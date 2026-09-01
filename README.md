# IDH vs VOTO

Visualização do **IDHM 2024** (PNUD) e intenção de voto presidencial por estado brasileiro — Lula (PT), Flávio Bolsonaro (PL) e Ronaldo Caiado (PSD), com referência aos demais candidatos testados nas pesquisas.

## Demo

Após publicar no GitHub Pages, o site estará em:

`https://<usuario>.github.io/<repositorio>/`

## Estrutura

| Arquivo      | Descrição                          |
|--------------|------------------------------------|
| `index.html` | Página principal                   |
| `app.js`     | Lógica, gráficos e renderização    |
| `data.json`  | Dados estruturados (IDH + pesquisas)|

## Desenvolvimento local

Requer um servidor HTTP (o `fetch` não funciona com `file://`):

```bash
python3 -m http.server 8765
```

Abra: http://localhost:8765

## Publicação no GitHub Pages

### Opção A — GitHub Actions (recomendado)

1. Crie um repositório no GitHub e envie este projeto na branch `main`.
2. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions**.
3. Ao fazer push na `main`, o workflow `.github/workflows/deploy.yml` publica o site automaticamente.

### Opção B — Deploy manual

1. **Settings → Pages → Build and deployment**
2. Source: **Deploy from a branch**
3. Branch: `main` / pasta **/ (root)**

### Primeiro push

```bash
git init
git add .
git commit -m "Publica IDH vs VOTO no GitHub Pages"
git branch -M main
git remote add origin https://github.com/<usuario>/<repositorio>.git
git push -u origin main
```

## Fontes dos dados

- IDHM 2024: PNUD Radar IDHM
- Pesquisas: Quaest/Globo (ago. 2026), com exceções no `data.json` (Ceará, Piauí)

Detalhes e links na seção **Fontes** do site.

## Licença

Dados de pesquisas e IDH são de terceiros; consulte as fontes originais para uso e reprodução.
