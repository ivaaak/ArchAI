# ArchAI Frontend

React + TypeScript + Vite. See the [root README](../README.md) for the full setup.

```sh
npm install
npm run dev      # http://localhost:5173, proxies /api and /uploads to the backend
npm run build    # type-check and build to dist/
npm test         # type-check and lint
```

Environment variables (all optional, in `frontend/.env`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_PROXY_TARGET` | `http://localhost:3000` | Backend used by the dev server proxy |
| `VITE_API_URL` | `/api` | API base URL for builds served separately from the backend |
| `VITE_AUTH0_DOMAIN` / `VITE_AUTH0_CLIENT_ID` | ArchAI's Auth0 app | Auth0 SPA application (`REACT_APP_` names also work) |
