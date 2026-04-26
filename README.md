# FJN

Site pessoal feito com React + Vite + TypeScript.

## Como rodar

Você precisa ter o [Node.js](https://nodejs.org) instalado (versão 18 ou superior).

```bash
# instalar dependências
npm install

# rodar em modo desenvolvimento
npm run dev

# gerar versão final (build)
npm run build

# pré-visualizar a build
npm run preview
```

## Como publicar no GitHub Pages

1. No `vite.config.ts`, adicione `base: "/nome-do-repo/"` (substitua pelo nome do seu repositório).
2. Rode `npm run build`.
3. Faça upload da pasta `dist/` em uma branch `gh-pages` ou use uma action de deploy.

## Estrutura

- `src/App.tsx` — componente principal
- `src/index.css` — estilos
- `src/assets/` — gif do perfil e música

## Crédito

By Developer FJN
