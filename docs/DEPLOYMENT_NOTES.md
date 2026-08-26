# Legacy Deployment Notes

## Tooling

- Vite 5 with React plugin; JavaScript/JSX source.
- Dev: `npm run dev` (Vite port 5173, host enabled, browser open enabled).
- Build: `npm run build`, output directory `dist`, sourcemaps disabled.
- Preview: `npm run preview`.
- Deploy: `npm run deploy`, which publishes `dist` with `gh-pages`.
- `predeploy` runs the production build.
- No lint script or tests are defined in `package.json`.

## Base Path and API

`vite.config.js` sets `base: '/SSTG/'`. The package homepage is
`https://studentstage.github.io/SSTG/`. `VITE_API_URL` is optional; the client
defaults to `https://student-stage-backend-apis.onrender.com/api` and
normalizes/appends `/api` as described in `API_CONTRACT.md`.

The repository contains no `.env` or environment example visible during
recovery. Never commit secrets. The default backend URL is a deployed fallback,
not confirmation that it is current or available.

## Hosting and Routing

The configured deployment is GitHub Pages through `gh-pages`, not Netlify.
There is no Netlify configuration, redirect rule, or server rewrite in the
repository. Browser history routes therefore need a hosting fallback when the
new frontend is deployed. The Axios 401 redirect uses `/login` rather than a
basename-aware URL.

## PWA

`main.jsx` manually registers `/service-worker.js` on window load. The worker
caches `/`, `/index.html`, and `/vite.svg`, then cache-first serves same-origin
successful requests and skips cross-origin API requests. Navigation fallback is
`/`. There is no manifest, install metadata, workbox setup, or Vite PWA plugin.
Because the app base is `/SSTG/`, the worker's root URLs are likely incorrect
for the existing GitHub Pages deployment.

## Preparation Constraints

The new frontend target is React, JavaScript, Vite, Tailwind, PWA, and Netlify,
but this recovery phase does not add pages or redesign behavior. Before the
next phase, validate API schemas, choose a basename/hosting strategy, add
Netlify history fallback and a manifest/service-worker strategy, and preserve
the endpoint compatibility documented here.
