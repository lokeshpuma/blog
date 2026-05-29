# Blog Platform

A modern blogging dashboard: create and publish posts, trending section, stats, search, and filters.

**Live site (GitHub Pages):** [https://lokeshpuma.github.io/blog/](https://lokeshpuma.github.io/blog/)

---

## Project structure

| Path | Description |
|------|-------------|
| `frontend/` | React + Vite UI (`frontend/src/`) |
| `backend/` | Express API (deploy separately) |

---

## GitHub Pages (frontend)

The frontend deploys automatically on push to `main` via [`.github/workflows/deploy-frontend.yml`](.github/workflows/deploy-frontend.yml).

### One-time setup

1. Open [github.com/lokeshpuma/blog/settings/pages](https://github.com/lokeshpuma/blog/settings/pages).
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.

### API URLs for production

In the repo, go to **Settings → Secrets and variables → Actions → Variables** and add:

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://your-api.example.com/api` |
| `VITE_AUTH_API_URL` | `https://your-api.example.com/api/auth` |

The backend must allow CORS from `https://lokeshpuma.github.io` (set `FRONTEND_URL` in backend `.env`).

### Local build (same as CI)

```bash
cd frontend
npm install
npm run build:gh-pages
```

Preview: `npx serve dist` and open with the `/blog/` path, or use `npm run preview` after a normal `npm run build`.

### Local development

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

---

## Backend (local)

```bash
cd backend
cp .env.example .env
npm install
npm start
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for environment variable details.
