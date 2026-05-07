# SkillTree

Gamified, AI-assisted skill learning with onboarding (account, career quiz, optional resume), a skill-tree dashboard, and interactive lessons. Built as a **Next.js** single-page experience with client-side state and `localStorage` persistence.

## Tech stack

- **Framework:** Next.js 15 (App Router), React 19
- **Styling:** Tailwind CSS v4
- **UI / motion:** Framer Motion, Radix UI, Lucide
- **Sanitization:** isomorphic-dompurify
- **Quality:** ESLint (`next/core-web-vitals`), Prettier, GitHub Actions CI

## Requirements

- **Node.js** ≥ 20.9 (see `package.json` `engines`)
- **npm** 10+ recommended

## Setup

```bash
npm ci
cp .env.example .env   # then fill in keys as needed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                | Description                 |
| ---------------------- | --------------------------- |
| `npm run dev`          | Development server          |
| `npm run build`        | Production build            |
| `npm start`            | Run production server       |
| `npm run lint`         | ESLint                      |
| `npm run lint:fix`     | ESLint with auto-fix        |
| `npm run format`       | Prettier write              |
| `npm run format:check` | Prettier check (used in CI) |

## Environment variables

See **`.env.example`**. `NEXT_PUBLIC_*` variables are exposed to the browser; treat them as public.

For production, **avoid embedding long-lived API keys in the client**. The current demo may call AI from the browser; a hardened setup uses server routes or a backend and keeps secrets server-side only.

## Deployment

- **Vercel:** `vercel.json` targets the Next.js build. Set environment variables in the project dashboard.
- Canonical URL for metadata: optional **`NEXT_PUBLIC_SITE_URL`** (see `.env.example`). On Vercel, `VERCEL_URL` is used as a fallback for `metadataBase`.

## Project layout (high level)

```
app/                 # App Router: routes, layout, providers, globals.css
public/              # Static assets
src/
  components/       # Feature UI
  Context/          # React context (user, theme, accessibility)
  lib/              # Shared helpers (e.g. lesson navigation bridge)
  utils/            # Lesson generation, evaluation
```

## Security & privacy

- User-generated strings are sanitized before rendering where appropriate.
- Auth and persistence in this repo are **client-only** and suitable for demos, not production auth.
- Security headers are set in **`next.config.mjs`** (`X-Frame-Options`, `Referrer-Policy`, etc.).

## Contributing

1. Run `npm run lint` and `npm run format:check` before pushing (or rely on CI).
2. Open an issue for larger changes before a large PR.

## License

MIT — see [LICENSE](./LICENSE).
