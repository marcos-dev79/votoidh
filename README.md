# IDH vs VOTO

Página que cruza o **Índice de Desenvolvimento Humano Municipal (IDHM 2024)** com as **intenções de voto** na eleição presidencial de 2026, estado a estado.

**Site:** https://marcos-dev79.github.io/votoidh/

## O que a pesquisa mostra

O objetivo é visualizar, para cada unidade da federação, a relação entre o nível de desenvolvimento humano (longevidade, educação e renda) e o cenário eleitoral no **1º turno**, com base nas pesquisas mais recentes disponíveis no momento da coleta.

**IDHM (2024)** — valores consolidados por estado, do Radar IDHM (PNUD/IBGE), divulgados em maio de 2026. O Distrito Federal lidera (0,866); Maranhão e Alagoas ficam na base do ranking (0,745 e 0,746).

**Voto** — percentuais de intenção de voto para:

- Luiz Inácio Lula da Silva (PT)
- Flávio Bolsonaro (PL)
- Ronaldo Caiado (PSD)

A coloração dos estados no gráfico segue quem está à frente numericamente: **vermelho** (Lula), **azul** (Flávio) ou **verde** (Caiado). Em empates técnicos dentro da margem de erro, a cor usa o candidato com maior percentual na pesquisa.

## Fontes das pesquisas

| Cobertura | Instituto | Período |
|-----------|-----------|---------|
| 24 estados + DF | Quaest (Grupo Globo e afiliadas) | 24–29 ago. 2026 |
| Ceará | Genial/Quaest | jul. 2026 |
| Piauí | Instituto GP1 | ago. 2026 |

Margens de erro: ±2 p.p. em São Paulo e ±3 p.p. nos demais estados (Quaest).

Nenhum candidato além de Lula, Flávio e Caiado **lidera** em algum estado nessas sondagens. Goiás é a exceção entre os três principais: Caiado aparece à frente (32%). O melhor desempenho entre os **secundários** é Romeu Zema (Novo), com 7% em Minas Gerais.

## O que foi construído

- **`index.html`** — layout, gráficos (Chart.js) e seções da página
- **`app.js`** — carrega `data.json` de forma assíncrona (sem cache) e renderiza tabelas e gráficos
- **`data.json`** — dados estruturados: IDHM, votos dos três principais, campo `referencia` com outros candidatos testados (Renan Santos, Zema, Augusto Cury, etc.) e catálogo em `meta.candidatos`

Na página:

1. Gráfico de barras — estados por IDH, com nome do estado e IDHM; barra = % do candidato à frente
2. Dispersão — IDHM × diferença Lula − Flávio
3. Tabela completa por estado
4. Resumo dos candidatos secundários (melhor % e estado)
5. Fontes com links

## Como abrir localmente

O `fetch` do JSON exige um servidor HTTP:

```bash
python3 -m http.server 8765
```

Acesse http://localhost:8765

## Referências

- [PNUD — Painel IDHM](https://www.undp.org/pt/brazil/desenvolvimento-humano/painel-idhm)
- [G1 — Mapa Quaest por estado (ago. 2026)](https://g1.globo.com/politica/eleicoes/2026/pesquisa-eleitoral/noticia/2026/08/29/mapa-mostra-como-esta-a-disputa-presidencial-nos-estados-segundo-a-quaest.ghtml)

Links completos na seção **Fontes** do site.
