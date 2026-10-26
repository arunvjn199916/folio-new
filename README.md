# Arun Vijayan — Portfolio

Next.js 16 (App Router) · React 19 · Tailwind 4 · GSAP · Lenis · OGL · Matter.js
English / Tamil / Hindi · light & dark · first-party accessibility panel · Groq-powered portfolio assistant.

## Run locally

```bash
npm ci
cp .env.example .env.local   # then add your GROQ_API_KEY
npm run dev                  # http://localhost:3000 → redirects to /en, /ta or /hi
```

Node 20.9+ (22 recommended, see `.nvmrc`).

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server (runs `images` first) |
| `npm run build` | Production build (runs `images` first) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run images` | Content-hashes `media/images/**` into `public/images/` and regenerates `src/content/images.generated.ts` |

## Content

- Copy lives in `src/content/*` (English) and `src/i18n/dictionaries/{ta,hi}.ts` (translations, type-checked against English).
- Images: drop files into `media/images/` using the names referenced in `src/content/*` (e.g. `projects/magnil.webp`), then `npm run images`. Never put images in `public/images/` — it's generated.

## Deploy on Netlify

1. Import the GitHub repo in Netlify — `netlify.toml` already sets the build command, publish dir and Node 22; the Next.js runtime is detected automatically.
2. Site configuration → Environment variables → add **`GROQ_API_KEY`** (server-only; never commit it). Optional: `GROQ_MODEL`.
3. Deploy. The site works without the key; only the chatbot replies "isn't configured yet".

## Security notes

Security headers + CSP in `next.config.ts`, SRI on bundles, chat endpoint guarded (origin check, validation, rate limit, timeout, grounded prompt). Details in `PLAN.md` §10–14 of the project notes.
