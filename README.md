# somarjez.github.io

Personal portfolio of Jezreel Ramos. Built with React, Vite, TailwindCSS, and
Framer Motion. Lists GitHub repositories and organizations live from the
GitHub REST API.

## Develop

```bash
npm install
npm run dev
```

## Test

```bash
npm test
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
deploys to GitHub Pages.

**One-time setup:** GitHub repo → Settings → Pages → Build and deployment →
Source = **GitHub Actions**.

## Customize

- Personal content, links, skills, Formspree id: `src/config/site.js`
- Featured projects: `src/config/featured.js`
