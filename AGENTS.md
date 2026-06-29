# AGENTS.md

## Cursor Cloud specific instructions

### Primary project: SparXion website (repo root)
The active product is the SparXion marketing/portfolio site at the repo root — a single-page app built with Vite + React 18 + TypeScript + Tailwind CSS, deployed via Netlify (`netlify.toml`). It is a static frontend with no backend/API.

- Package manager: npm (`package-lock.json`). Node 22 / npm 10 work fine.
- Dev server: `npm run dev` (Vite). Serves on `http://localhost:3000` (port is pinned in `vite.config.ts`).
- Build: `npm run build` (runs `tsc` typecheck, then `vite build` to `dist/`).
- Preview production build: `npm run preview`.
- Lint: there is no dedicated lint script or ESLint config; `npm run build` (the `tsc` step) is the effective type/correctness check. `tsconfig.json` enables `strict`, `noUnusedLocals`, and `noUnusedParameters`, so unused imports/vars fail the build.
- Automated tests: none are configured for this project.

Gotchas:
- `npm run sync-portfolio` runs shell scripts that expect local-only image source folders (e.g. a `01-MASTERS/` vault) that are gitignored and absent in CI/cloud. Do not run it unless those assets exist; the committed `public/portfolio` band images and `src/data/portfolioImageManifest.ts` are sufficient for the dev server to render.

### Secondary: `career-exploration-app/`
An old, abandoned prototype (its README is a corrupted paste). It has no working backend and is not part of the active product — ignore it for normal development unless explicitly asked.
