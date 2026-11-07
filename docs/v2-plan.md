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

## 3. Design decisions for v2 (confirmed)

### 3.1 Colour system — from the brand colours
Brand colours: **black red `#100001`**, **crimson red `#dc0208`**, **champagne yellow `#ffef93`**.
Role mapping mirrors the reference (black + space colour + one bright accent):
the space colour becomes **crimson**, the bright accent (their lime) becomes **champagne**.

| Token | Dark (default look) | Light | Used for |
|---|---|---|---|
| `paper` (page) | `#100001` black red | `#fbf6e9` champagne cream | page background |
| `ink` (text) | `#f7f1e3` warm off-white | `#100001` black red | headings, body |
| `ink-2` | `#c9bcae` | `#5a3a38` | secondary text |
| `ink-3` | `#8f8278` | `#7a5e5a` | labels, eyebrows |
| `card` / `surface` | `#1a0507` / `#1a0507` | `#ffffff` / `#fffdf6` | cards, panels |
| `accent` | `#ffef93` champagne | `#dc0208` crimson | CTA pills, active dots, active nav |
| `on-accent` | `#100001` | `#ffffff` | text on CTA |
| `crimson` | `#dc0208` (glow / fills only) | `#dc0208` | globe horizon glow, space gradient, dividers |
| `crimson-text` | `#ff4d4f` | `#b8000a` | red text (AA-safe) |
| `champagne` | `#ffef93` | `#ffef93` (fills / highlight only) | highlights, lit dots in light mode outline |
| `space` gradient | `#100001 → #3a0207 → #6b0410` | `#fbf6e9 → #ffe7c2 → #ffc9bd` | hero / section colour bleed |
| `night` bands | `#0a0001` | `#100001` | dark stages (journey timeline stays dark in both themes) |

Contrast (WCAG): text 18.2:1 (dark) / 19.0:1 (light); champagne CTA 17.6:1; white on crimson CTA 5.2:1;
ink-3 5.5:1 / 4.6:1. Crimson `#dc0208` on black red is only 3.97:1 → used for glows, fills and large display
words only, never small text (that uses `crimson-text`).

The old pastel tokens (`lav`, `blush`, `pink`, `violet`, `blue`, `sky`, `butter`, `mint`) are remapped to this
family so every untouched section shifts to the new palette automatically.
Light mode keeps the toggle (and the "System" option in the accessibility panel).

### 3.2 Typography
- **Manrope Variable** (via `next/font/google`, weights 400–800) replaces Clash Display + Geist for display and body.
  Instrument Serif / Caveat / DM Mono stay for the few decorative uses (testimonial notes, loader labels).
- Display: weight 650, UPPERCASE, line-height 0.9, tracking −0.05em.
- Fluid scale (`clamp`): `display-xl` hero H1 = mobile 10.4vw → desktop 7.85vw (max 150px);
  `display-l` 6vw; `display-m` H2 4.4vw (min 34px); body-l 20px; body 17–18px; eyebrow 12–13px +0.1em.
- Tamil / Hindi: no uppercase, normal tracking, line-height 1.3, display sizes × 0.72 (existing script rules extended).

### 3.3 Hero copy (personal — revised)
- Availability pill: `● Open to work — GCC & remote`
- Eyebrow: `AI-FIRST PRODUCT DESIGNER · CHENNAI, INDIA · 5+ YEARS`
- Statement 1 (dims on scroll): **HI, I'M / ARUN VIJAYAN.**
- Statement 2 (indented, stays bright): **I DESIGN AI / PEOPLE TRUST.**
- Sub-copy: "Executive UI/UX Designer at Congruent Solutions. I design AI search, voice and agentic experiences
  for US 401(k) platforms — and prototype them in real code with Claude & Cursor."
- Proof row: **5+ YEARS · 4 COMPANIES · 500+ BETA USERS**
- CTAs: **LET'S TALK →** (accent, to contact) · **VIEW WORK ↘** (outline, to work)
- HUD: `CHENNAI 10:42` live clock · legend `● USERS  ● TRUSTED` · state `AI · BEFORE DESIGN` → `AI · AFTER DESIGN` · `DRAG TO ROTATE`
- Story: the name dims as the globe's users light up — "this is Arun, and this is what he does".
- Tamil and Hindi versions written for every string.

### 3.4 Intro
Keep the existing intro flow (Enter gate → greetings grid → tile stream). Only re-theme it:
black-red background, crimson/champagne tiles and cell, Manrope, champagne "Enter" button, laptop art recoloured.

### 3.5 Responsive rules
| Breakpoint | Nav | Hero | Journey timeline |
|---|---|---|---|
| ≥1280 | Full top bar → compact pill on scroll | Globe right, text left, HUD top-right | Horizontal track, 7 stops |
| 1024–1279 | Same, tighter gaps | Globe right, smaller | Horizontal, labels shortened |
| 768–1023 | Compact pill + burger always | Globe behind text (centre-right), HUD 2 lines | Horizontal, 4 role stops |
| <768 (375 tested) | Compact pill + burger; full-screen menu | Globe behind/below text, H1 10.4vw, CTAs stacked full width, no HUD legend | **Vertical** track: line on the left, dot travels down, role cards beside |
- Touch: globe drag is horizontal only (`touch-action: pan-y`) so the page still scrolls.
- Sticky scroll stories get shorter on mobile (hero 180vh, journey 220vh).
- Reduced motion / a11y "stop motion": no scrubbing; hero shows the finished globe state, timeline shows all stops lit.

### 3.6 Accessibility & performance (unchanged principles)
Keyboard + `aria-expanded` on dropdown/menu, Esc closes, focus returns to trigger; canvas `aria-hidden` with text
equivalents; one canvas, DPR ≤ 2, ~1,200 points, glow sprites pre-rendered, paused off-screen / hidden tab.

## 4. Roadmap

Each phase ends with a **side-by-side Playwright check** (same viewport + scroll positions as the reference captures), `npm run lint`, `npm run build`, and a quick EN/TA/HI + mobile pass.

| Phase | Scope | Main files | Est. |
|---|---|---|---|
| **0 · Foundations** | New colour tokens (dark-first), Manrope + fluid type scale, uppercase display utility with i18n exceptions, button styles (accent pill + outline pill with arrow), eyebrow style | `src/app/globals.css`, `src/app/[lang]/layout.tsx`, `src/ds/tokens.css` (DS stays separate) | 0.5 day |
| **1 · Navigation** | Top bar (logo · links · segmented EN/TA/HI · accent CTA), Work ▾ mega panel (case studies in two columns + "AI workflow" bottom row), hover glow/colour, scroll → compact centred pill (logo mark · CTA · burger) with GSAP morph, full-screen menu overlay with staggered links, mobile version | `components/global/Nav.tsx` (rewrite), `LanguageSwitcher.tsx`, new `NavMenu.tsx` | 1–1.5 days |
| **2 · Intro re-theme** | Keep the current intro flow; recolour + new font only | `components/loader/Loader.tsx`, `lib/intro.ts` | 0.5 day |
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

## 6. Decisions log

| Question | Decision |
|---|---|
| Colour palette | Black red `#100001`, crimson `#dc0208`, champagne `#ffef93`; dark + matching light (§3.1) |
| Light mode | Keep the toggle; light theme derived from the same colours |
| Hero copy | New two-statement copy (§3.3) |
| Intro | Keep the current intro, re-theme only (§3.4) |
| Responsive | Required for every phase (§3.5) |

## 7. Build order (this branch)

1. Phase 0 — tokens, Manrope, type scale, buttons, background layers recoloured
2. Phase 1 — navigation
3. Phase 3 — hero + globe (with TA/HI copy)
4. Phase 5 — journey timeline
5. Phase 2 — intro re-theme
6. Verify — lint, build, Playwright screenshots at 1440 / 1024 / 768 / 375, dark + light, EN/TA/HI, then commit + push
7. Later — phases 4, 6, 7 (before/after section, page-progress rail, restyle the remaining sections)

## 8. Status

| Phase | State | Commit |
|---|---|---|
| 0 · Foundations | ✅ done | `v2 phase 0` |
| 1 · Navigation | ✅ done (full bar ≥1280, pill + menu below) | `v2 phase 1` |
| 3 · Hero + globe | ✅ done | `v2 phase 3` |
| 5 · Journey timeline | ✅ done (horizontal ≥1024, vertical below) | `v2 phase 5` |
| 2 · Intro re-theme | ✅ done (+ fixed "undefined." greeting) | `v2 phase 2` |
| Verify | ✅ lint (no new warnings), production build, no console/CSP errors; checked 1440 / 1280 / 1024 / 768 / 390, dark + light, EN / TA / HI | |
| 4 · Before/after line section | ⏳ next | |
| 6 · Page-progress rail, section transitions | ⏳ next | |
| 7 · Restyle remaining sections (About, Work, Skills, Toolkit, Testimonials, Contact) | ⏳ next | |
