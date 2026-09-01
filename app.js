const LULA_COLOR = "#c41e3a";
const FLAVIO_COLOR = "#1e5aa8";
const CAIADO_COLOR = "#2d8a4e";

const LEADER_CONFIG = {
  lula: { color: LULA_COLOR, label: "Lula" },
  flavio: { color: FLAVIO_COLOR, label: "Flávio Bolsonaro" },
  caiado: { color: CAIADO_COLOR, label: "Ronaldo Caiado" },
};

const PRINCIPAIS = new Set(["lula", "flavio", "caiado"]);

function getLeader(estado) {
  const { lula, flavio, caiado } = estado.votos;
  const scores = [
    { key: "lula", value: lula },
    { key: "flavio", value: flavio },
    { key: "caiado", value: caiado },
  ];
  return scores.reduce((best, cur) => (cur.value > best.value ? cur : best));
}

function formatIdh(idh) {
  return idh.toFixed(3).replace(".", ",");
}

function formatPercent(value) {
  return `${value}%`;
}

function siteBasePath() {
  const pathname = window.location.pathname;
  if (pathname.endsWith("/")) return pathname;
  const last = pathname.split("/").pop() || "";
  if (last.includes(".")) {
    return pathname.slice(0, pathname.lastIndexOf("/") + 1);
  }
  return `${pathname}/`;
}

function assetUrl(file) {
  const [name, query] = file.split("?");
  const base = siteBasePath();
  return query ? `${base}${name}?${query}` : `${base}${name}`;
}

async function loadData() {
  const url = assetUrl(`data.json?_=${Date.now()}`);
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
  });
  if (!response.ok) {
    throw new Error(`Falha ao carregar data.json (${response.status})`);
  }
  return response.json();
}

function renderMeta(meta) {
  document.title = meta.titulo;
  document.querySelector("h1").textContent = meta.titulo;
  document.querySelector(".subtitle").textContent = meta.descricao;
  document.querySelector(".note").textContent = meta.nota;
}

function renderTable(estados) {
  const sorted = [...estados].sort((a, b) => b.idh - a.idh);
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  sorted.forEach((estado) => {
    const leader = getLeader(estado);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${estado.nome}</strong> (${estado.uf})</td>
      <td>${formatIdh(estado.idh)}</td>
      <td>${formatPercent(estado.votos.lula)}</td>
      <td>${formatPercent(estado.votos.flavio)}</td>
      <td>${formatPercent(estado.votos.caiado)}</td>
      <td><span class="badge ${leader.key}">${LEADER_CONFIG[leader.key].label}</span></td>
      <td>${estado.pesquisa.instituto} (${estado.pesquisa.data})</td>
    `;
    tbody.appendChild(tr);
  });
}

function buildSecondarySummary(meta, estados) {
  const candidatos = meta.candidatos || {};
  const stats = {};

  estados.forEach((estado) => {
    const ref = estado.referencia || {};
    Object.entries(ref).forEach(([id, pct]) => {
      if (!stats[id]) {
        stats[id] = { max: pct, maxEstado: estado, estados: [] };
      } else if (pct > stats[id].max) {
        stats[id].max = pct;
        stats[id].maxEstado = estado;
      }
      stats[id].estados.push({ uf: estado.uf, nome: estado.nome, pct });
    });
  });

  const rows = Object.entries(stats)
    .map(([id, s]) => ({
      id,
      info: candidatos[id],
      max: s.max,
      maxEstado: s.maxEstado,
      count: s.estados.length,
      estados: s.estados.sort((a, b) => b.pct - a.pct),
    }))
    .filter((r) => r.info && !PRINCIPAIS.has(r.id))
    .sort((a, b) => b.max - a.max);

  return rows;
}

function renderSecondarySummary(meta, estados) {
  const rows = buildSecondarySummary(meta, estados);
  const highlight = document.getElementById("secondaryHighlight");
  const tbody = document.querySelector("#secondaryTable tbody");
  const scenarioEl = document.getElementById("secondaryScenario");

  tbody.innerHTML = "";

  if (rows.length === 0) {
    highlight.textContent = "Nenhum candidato secundário registrado nas pesquisas.";
    scenarioEl.textContent = "";
    return;
  }

  const top = rows[0];
  const topNome = top.info.nome;
  highlight.innerHTML = `
    <strong>Nenhum candidato secundário lidera em algum estado.</strong>
    O melhor desempenho é de <strong>${topNome}</strong> (${top.info.partido}),
    com <strong>${top.max}%</strong> em ${top.maxEstado.nome} (${top.maxEstado.uf}).
    ${rows.length} candidatos aparecem com voto nas pesquisas estaduais.
  `;

  rows.forEach((row) => {
    const outros = row.estados
      .slice(1, 4)
      .map((e) => `${e.uf} ${e.pct}%`)
      .join(", ");
    const outrosLabel = row.estados.length > 1
      ? `${row.count} (${row.maxEstado.uf} ${row.max}%${outros ? `; também ${outros}` : ""})`
      : `${row.count} (${row.maxEstado.uf})`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${row.info.nome}</strong></td>
      <td>${row.info.partido}</td>
      <td>${row.max}%</td>
      <td>${row.maxEstado.nome} (${row.maxEstado.uf})</td>
      <td>${outrosLabel}</td>
    `;
    tbody.appendChild(tr);
  });

  const cenarios = meta.cenarios_referencia || [];
  if (cenarios.length === 0) {
    scenarioEl.textContent = "";
    return;
  }

  const parts = cenarios.map((c) => {
    const marcal = c.votos.pablo_marcal;
    return `<strong>Cenário alternativo — ${c.uf}:</strong> ${c.cenario} (${c.fonte}). Pablo Marçal: ${marcal}%.`;
  });
  scenarioEl.innerHTML = parts.join(" ");
}

function renderSources(fontes) {
  const sourcesList = document.getElementById("sourcesList");
  sourcesList.innerHTML = "";

  fontes.forEach((fonte) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="${fonte.url}" target="_blank" rel="noopener">${fonte.titulo}</a>
      <div class="meta">${fonte.descricao}</div>
    `;
    sourcesList.appendChild(li);
  });
}

function leaderTooltipLines(estado) {
  const leader = getLeader(estado);
  return [
    `IDHM: ${estado.idh.toFixed(3)}`,
    `Lula: ${estado.votos.lula}%`,
    `Flávio: ${estado.votos.flavio}%`,
    `Caiado: ${estado.votos.caiado}%`,
    `À frente: ${LEADER_CONFIG[leader.key].label}`,
  ];
}

function renderBarChart(estados) {
  const sorted = [...estados].sort((a, b) => b.idh - a.idh);
  const labels = sorted.map((e) => `${e.nome}\nIDH ${formatIdh(e.idh)}`);
  const data = sorted.map((e) => getLeader(e).value);
  const colors = sorted.map((e) => LEADER_CONFIG[getLeader(e).key].color);

  return new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "% do candidato à frente",
        data,
        backgroundColor: colors,
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => sorted[items[0].dataIndex].nome,
            label: (ctx) => leaderTooltipLines(sorted[ctx.dataIndex]),
          },
        },
      },
      scales: {
        x: {
          min: 0,
          max: 70,
          title: { display: true, text: "Intenção de voto (%)" },
          grid: { color: "#2a3a52" },
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 10 } },
        },
      },
    },
  });
}

function renderScatterChart(estados) {
  const datasets = Object.keys(LEADER_CONFIG).map((key) => ({
    label: `${LEADER_CONFIG[key].label} à frente`,
    data: estados
      .filter((e) => getLeader(e).key === key)
      .map((e) => ({
        x: e.idh,
        y: e.votos.lula - e.votos.flavio,
        estado: e,
      })),
    backgroundColor: LEADER_CONFIG[key].color,
    pointRadius: 8,
    pointHoverRadius: 10,
  }));

  return new Chart(document.getElementById("scatterChart"), {
    type: "scatter",
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: {
          callbacks: {
            title: (items) => items[0].raw.estado.nome,
            label: (ctx) => {
              const e = ctx.raw.estado;
              return [
                `IDHM: ${e.idh.toFixed(3)}`,
                `Lula: ${e.votos.lula}% | Flávio: ${e.votos.flavio}% | Caiado: ${e.votos.caiado}%`,
                `Diferença Lula−Flávio: ${(e.votos.lula - e.votos.flavio).toFixed(1)} p.p.`,
                `À frente: ${LEADER_CONFIG[getLeader(e).key].label}`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          min: 0.74,
          max: 0.87,
          title: { display: true, text: "IDHM 2024" },
          grid: { color: "#2a3a52" },
        },
        y: {
          title: { display: true, text: "Lula % − Flávio %" },
          grid: { color: "#2a3a52" },
        },
      },
    },
  });
}

function showLoading() {
  const main = document.querySelector("main");
  const loading = document.createElement("p");
  loading.id = "loading";
  loading.className = "loading";
  loading.textContent = "Carregando dados…";
  main.prepend(loading);
}

function hideLoading() {
  const loading = document.getElementById("loading");
  if (loading) loading.remove();
}

function showError(message) {
  hideLoading();
  const main = document.querySelector("main");
  const error = document.createElement("p");
  error.className = "error";
  error.textContent = message;
  main.prepend(error);
}

async function init() {
  showLoading();

  try {
    const data = await loadData();

    Chart.defaults.color = "#8b9cb3";
    Chart.defaults.borderColor = "#2a3a52";

    renderMeta(data.meta);
    renderTable(data.estados);
    renderSecondarySummary(data.meta, data.estados);
    renderSources(data.fontes);
    renderBarChart(data.estados);
    renderScatterChart(data.estados);

    hideLoading();
  } catch (err) {
    showError(err.message);
    console.error(err);
  }
}

init();
