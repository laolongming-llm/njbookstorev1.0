# Repository Guidelines

## Project Structure & Module Organization
`src/` contains the Vue 3 app. Put route-level pages in `src/views/`, shared UI in `src/components/`, router setup in `src/router/`, reusable stateful helpers in `src/composables/`, and static config/data in `src/constants/` and `src/data/`. App-wide CSS lives in `src/styles/`.

`public/` stores shipped assets and generated data. Use `public/materials/` for large visual assets and `public/data/shikong/` for map JSON consumed by the `Shikong` view. Repository scripts and source spreadsheets live in `script/`.

## Build, Test, and Development Commands
Run all commands from the repo root.

- `npm run dev` starts the Vite dev server for local UI work.
- `npm run build` creates a production bundle and is the required pre-merge smoke check.
- `npm run preview` serves the built bundle for a final browser check.
- `powershell -NoProfile -ExecutionPolicy Bypass -File .\script\build-shikong-data.ps1` rebuilds `public/data/shikong/*.json` and `script/output/cleaning-report.json`.

## Coding Style & Naming Conventions
Follow the existing Vue Single File Component style: `<script setup>`, Composition API, two-space indentation, and no semicolons. Keep imports grouped with third-party modules first and local modules second.

Use `PascalCase.vue` for components and views, `useSomething.js` for composables, and descriptive camelCase for data/config modules such as `manyouBookstores.js`. Keep explicit `.js` extensions in local ESM imports.

## Testing Guidelines
There is no automated test runner configured yet. Until one is added, contributors should:

- run `npm run build`
- manually verify the affected routes (`/`, `/manyou`, `/shikong`, `/shuyuan`)
- confirm map/data changes still load from `public/data/shikong/`

If you add tests later, place them close to the feature or under a dedicated `tests/` folder and name them after the feature being covered.

## Commit & Pull Request Guidelines
Recent history uses short, feature-focused commit subjects, often written in Chinese. Keep commits scoped to one change and use the subject to describe the visible result.

PRs should include a brief summary, the affected route(s), screenshots for UI changes, and confirmation that `npm run build` passed. If you modify generated JSON or large assets, call that out explicitly in the PR description.
