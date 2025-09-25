# SkillTree — Vite + React + TypeScript

A small starter app built with Vite, React 19 and TypeScript. Provides a simple onboarding flow (sign in / create account / career quiz / resume upload) and a dashboard with a visual skill tree.

Project structure
- [.gitignore](.gitignore)
- [eslint.config.js](eslint.config.js)
- [index.html](index.html)
- [package.json](package.json)
- [vite.config.ts](vite.config.ts)
- [tsconfig.json](tsconfig.json)
- [tsconfig.app.json](tsconfig.app.json)
- [tsconfig.node.json](tsconfig.node.json)
- public/vite.svg
- src/vite-env.d.ts
- src/main.tsx — entry (see [src/main.tsx](src/main.tsx))
- src/App.tsx — routes (see [`App`](src/App.tsx))
- src/index.css — base styles (see [src/index.css](src/index.css))
- src/App.css — app styles (see [src/App.css](src/App.css))

Components (source files and exported symbols)
- [`SignIn`](src/components/SignIn.tsx) — sign-in page ([src/components/SignIn.tsx](src/components/SignIn.tsx))
- [`CreateAccount`](src/components/CreateAccount.tsx) — create account flow ([src/components/CreateAccount.tsx](src/components/CreateAccount.tsx))
- [`Career`](src/components/Career.tsx) — career questionnaire ([src/components/Career.tsx](src/components/Career.tsx))
- [`Upload`](src/components/Upload.tsx) — resume upload and [`handleFile`](src/components/Upload.tsx) validation ([src/components/Upload.tsx](src/components/Upload.tsx))
- [`Dashboard`](src/components/Dashboard.tsx) — main dashboard / skill tree and [`latestSkills`](src/components/Dashboard.tsx) ([src/components/Dashboard.tsx](src/components/Dashboard.tsx))

Notable files (assets & env)
- [src/assets/react.svg](src/assets/react.svg)
- [public/vite.svg](public/vite.svg)
- [src/vite-env.d.ts](src/vite-env.d.ts)

Overview / behavior details
- Routing is defined in [`App`](src/App.tsx) — routes:
  - `/` → [`SignIn`](src/components/SignIn.tsx)
  - `/quiz` → [`Career`](src/components/Career.tsx)
  - `/upload` → [`Upload`](src/components/Upload.tsx)
  - `/dashboard` → [`Dashboard`](src/components/Dashboard.tsx)
  - `/create-account` → [`CreateAccount`](src/components/CreateAccount.tsx)
- Auth simulation:
  - [`SignIn`](src/components/SignIn.tsx) stores the username in localStorage with key `"username"` and navigates to `/quiz`.
  - [`CreateAccount`](src/components/CreateAccount.tsx) stores `"username"` and `"userEmail"` in localStorage and navigates to `/quiz`.
- Career quiz:
  - [`Career`](src/components/Career.tsx) collects answers for three questions and navigates to `/upload` after submission.
- Upload:
  - [`Upload`](src/components/Upload.tsx) validates file size (max 10MB) and types (PDF, DOC, DOCX) inside [`handleFile`](src/components/Upload.tsx). After simulated upload it navigates to `/dashboard`. There's also a "Skip for now" button that routes directly to `/dashboard`.
- Dashboard:
  - [`Dashboard`](src/components/Dashboard.tsx) reads `localStorage.getItem("username")` and shows the skill tree + previous lessons. The sign-out button clears `"username"` and `"userEmail"` and navigates to `/`.

Scripts (see [package.json](package.json))
- npm run dev — start Vite dev server
- npm run build — tsc -b && vite build
- npm run preview — preview build
- npm run lint — eslint .

Quick start
1. Install dependencies
```sh
npm install