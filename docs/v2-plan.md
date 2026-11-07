# Portfolio v2 — redesign plan & roadmap

Reference: https://eezyinn.de/en/ (captured 2026-11-07 with Playwright at 1440×900).
Goal: rebuild the **typography, hero (with globe background), navigation and the scroll timeline**
to match the reference's look and interaction as closely as possible, using **our own colour palette, content
and assets**. Everything is re-implemented in our stack (Next 16 + GSAP/ScrollTrigger + Lenis + canvas);
nothing is copied from their source, logo, copy or videos.

---

## 1. How the reference works (findings)

| Area | What it does | How it's built |
|---|---|---|
| Stack | Astro static site, no animation library | Hand-written JS, `requestAnimationFrame`, `IntersectionObserver`, 2D canvas |
| Font | **Manrope Variable** only (open-source, OFL) | Self-hosted woff2 |
| Type scale @1440 | H1 **113px / weight 650 / line-height 0.9 / tracking −0.05em / UPPERCASE**. H2 63px (0.98 lh, −0.035em). Big section H2 87px. Body 18px / 1.55, tracking −0.005em. Eyebrows ~13px uppercase, +0.08em, 60% white | Fluid (scales with viewport ≈ 7.85vw for H1) |
| Colour | Near-black `#0a0a0a`, off-white text `#f5f5f2`, deep **space purple** gradients, **lime** accent `#d4ff3f`-ish for CTAs + "active" dots | Sections switch black ↔ purple with rounded-panel "peek" transitions |
| Loader | Logo draws in as outline → fills → progress bar to 100% → accent dot pops | ~2s |
| Hero | Sticky, ~2.3 viewports tall. 1) Big **planet horizon** (glowing arc) behind the headline. 2) On scroll the camera pulls back: arc becomes a **full dot-globe** on the right. 3) First headline line dims, second brightens. 4) Dots on the globe light up in accent ("visitors → customers"), collapse to one glowing dot. 5) Background bleeds into purple for the next section. **Drag to rotate** with inertia. HUD top-right: city + live clock, dot legend, state label, "drag to rotate" | 2D canvas, points on a sphere projected each frame, DPR-aware |
| Headline layout | Two 2-line statements, second one indented ~8% and staggered; word-by-word reveal after loader | |
| Nav (top) | Full-width bar: logo left · centred UPPERCASE links (Solutions ▾, Projects, Agency, Insights, Contact) · right: segmented language pill (dot marks active) + lime CTA pill | |
| Nav (dropdown) | Hover "Solutions" → dark rounded mega panel, two columns (eyebrow + big uppercase title + list), full-width bottom row link with arrow; active link turns accent with soft glow | |
| Nav (scrolled) | Collapses to a **centred compact pill**: logo mark · lime CTA · round burger. Burger opens full menu overlay | |
| "Two problems" section | Horizontal line with a travelling accent dot, a **CLICK** pill marker splitting *before / after*, two columns of big uppercase statements + tag chips | |
| Journey timeline | Sticky, ~2.8 viewports. Black stage with **perspective road lines** converging to the centre + dashed centre line. Headline left, paragraph right. Horizontal track of 7 stops (Offer → … → Customer) with the **CLICK** pill in the middle; a glowing accent dot is **scrubbed** along the track and each label brightens as it is passed | SVG + scroll progress |
| Global extras | Left **page-progress rail** with ticks + accent dot, cursor trail canvas, sound toggle, Lenis-like smooth scroll (`/smooth.js`), smoke-filled footer wordmark | |

Captures used for this analysis are in the session scratchpad (`ref-*`, `f00…f21` scroll frames, `nav-dropdown`, `intro-*`).

## 2. Our site today vs the reference

| | Ours (v1) | Reference / v2 target |
|---|---|---|
| Theme | Light lavender/pink pastel (dark mode optional) | Dark-first: black + space-purple, lime accent → **we use our own palette** |
| Fonts | Clash Display (display) + Geist (body), mixed case | One grotesk (Manrope), **UPPERCASE heavy display**, very tight tracking |
| Intro | "Welcome / Enter" laptop gate + grid split loader | Logo draw + % progress bar, no click needed |
| Hero | "Arun Vijayan designs agentic AI experiences", pen headline, portrait card, marquee, dark tile cascade | Huge 2-statement headline over interactive **dot-globe**, sticky scroll story, HUD |
| Nav | Floating glass pill, shrinks to "ARUN VIJAYAN •••" | Full bar → compact centred pill + burger, mega dropdown, lime CTA |
| Experience | Horizontal scroll of role cards with line | Sticky **road-perspective timeline** with scrubbed dot and stops |
| Rest | Work grid, skills pills (Matter.js), toolkit, process, testimonials notes, contact | Restyle to the new type/colour system so nothing looks v1 |

## 3. Design decisions for v2

- **Font:** Manrope Variable (self-hosted via `next/font/google`, weights 400–800). Tamil / Hindi keep Noto Sans fallbacks; for those locales we **drop uppercase and negative tracking** (scripts have no case, tight tracking breaks them).
- **Type tokens** (fluid, `clamp()`): `display-xl` 7.85vw (H1), `display-l` 6vw, `display-m` 4.4vw, `body-l` 1.25rem, `body` 1.125rem, `eyebrow` 0.8rem.
- **Palette (ours, to confirm):** base `#09090c`, text `#f5f5f2`, a "space" gradient in our own hue, one bright accent for CTAs / active dots. Proposed default: **deep indigo-blue space + coral/orange accent** (clearly not their purple + lime). Decide in §6.
- **Globe meaning for a portfolio:** dots = people/products touched; scroll story = "Problem → Design → Shipped". Legend: `• USERS  • SHIPPED`, HUD: `CHENNAI 10:42` live clock.
- **Accessibility kept:** reduced-motion → static globe + no scrub; a11y panel, keyboard focus on nav/mega menu, `aria-expanded`, Esc closes.
- **Performance:** single canvas, DPR capped at 2, ~1.5–2k points, paused when off-screen / tab hidden; lazy-load globe after first paint.

## 4. Roadmap

Each phase ends with a **side-by-side Playwright check** (same viewport + scroll positions as the reference captures), `npm run lint`, `npm run build`, and a quick EN/TA/HI + mobile pass.

| Phase | Scope | Main files | Est. |
|---|---|---|---|
| **0 · Foundations** | New colour tokens (dark-first), Manrope + fluid type scale, uppercase display utility with i18n exceptions, button styles (accent pill + outline pill with arrow), eyebrow style | `src/app/globals.css`, `src/app/[lang]/layout.tsx`, `src/ds/tokens.css` (DS stays separate) | 0.5 day |
| **1 · Navigation** | Top bar (logo · links · segmented EN/TA/HI · accent CTA), Work ▾ mega panel (case studies in two columns + "AI workflow" bottom row), hover glow/colour, scroll → compact centred pill (logo mark · CTA · burger) with GSAP morph, full-screen menu overlay with staggered links, mobile version | `components/global/Nav.tsx` (rewrite), `LanguageSwitcher.tsx`, new `NavMenu.tsx` | 1–1.5 days |
| **2 · Loader** | Replace "Enter" gate with logo-draw + % bar + accent dot pop (keeps sound unlock on first interaction) | `components/loader/Loader.tsx`, `lib/intro.ts` | 0.5 day |
| **3 · Hero + globe** | Canvas dot-globe component (fibonacci sphere, projection, drag-to-rotate with inertia, glow), sticky 2.3-vh scroll story with ScrollTrigger (horizon → globe → dots light → single dot → colour bleed), two-statement headline with word reveal + dim/brighten, HUD (city clock, legend, state, "drag to rotate"), sub-copy + 2 CTAs | `components/sections/Hero.tsx` (rewrite), new `components/hero/Globe.tsx`, `content/profile.ts` + dictionaries (new copy) | 2–3 days |
| **4 · "Before/after" line section** *(optional, as in reference)* | Horizontal line with travelling dot + pill marker; e.g. "BEFORE AI / AI-FIRST" two-column statement | new `components/sections/Shift.tsx` | 0.5 day |
| **5 · Journey timeline** | Experience becomes sticky road-perspective timeline: SVG converging lines + dashed centre, headline + intro text, stops = roles/milestones (2021 → today), pill marker at the career switch, scrubbed glowing dot, labels light as passed, active role detail (title, company, 2–3 bullets) swaps under the track; mobile = vertical version | `components/sections/Experience.tsx` (rewrite), `content/experience.ts` (+ stop labels) | 1.5–2 days |
| **6 · Global polish** | Left page-progress rail, black↔colour rounded section transitions, cursor trail (optional), smooth-scroll tuning | `SmoothScroll.tsx`, new `PageProgress.tsx` | 1 day |
| **7 · Restyle remaining sections** | Work, Skills, Toolkit, Process, Testimonials, Contact/footer to the new type + colour system (content unchanged) | `components/sections/*` | 2 days |
| **8 · QA & ship** | Reduced motion, keyboard, screen-reader labels, Lighthouse perf, TA/HI layouts, mobile 375px, CSP still valid, Netlify deploy preview | — | 1 day |

**Order of work:** 0 → 1 → 3 → 5 first (the three things asked for), then 2, 4, 6, 7, 8.
Each phase is its own commit on a `v2-redesign` branch so we can review/merge in steps.

## 5. Risks / notes

- The site is v1-light today; a dark-first v2 touches every section — phase 7 is what keeps it coherent.
- Large uppercase display type doesn't suit Tamil/Hindi; those locales get mixed-case and normal tracking.
- The current loader/intro, Matter.js skills pills and music player stay unless you want them removed.
- Reference copy, logo, case videos and exact colours are **not** reused.

## 6. Decisions needed before starting

1. **Colour palette** — pick the space hue + accent (default proposal: indigo-blue space + coral accent), or give your brand colours.
2. **Light mode** — keep a light theme toggle in v2, or go dark-only like the reference?
3. **Hero copy** — keep "Arun Vijayan designs agentic AI experiences" in the new style, or write two short uppercase statements (e.g. "AI THAT USERS TRUST? / PRODUCTS THAT SHIP?")?
4. **Intro** — replace the "Enter" gate with the logo-draw loader (recommended)?
