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

## Credential previews

The portfolio serves sanitized certificate copies and first-page previews from
`public/credentials/`. Regenerate previews after replacing a source PDF:

```powershell
python -m pip install -r requirements-tools.txt
python scripts/render-credential-previews.py
```

Light mode is the default. The navigation toggle stores an explicit choice under
`portfolio-theme` in browser local storage.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
deploys to GitHub Pages.

**One-time setup:** GitHub repo → Settings → Pages → Build and deployment →
Source = **GitHub Actions**.

## Customize

- Personal content, links, skills, Formspree id: `src/config/site.js`
- Featured projects: `src/config/featured.js`
- Other academic projects: `src/config/academicProjects.js`
