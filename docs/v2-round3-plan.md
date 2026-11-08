# Portfolio v2 — round 3 plan (for approval)

Built from Arun's 13 comments, a fresh Playwright pass over both sites (home, `/en/agency/`, `/en/conversion/`,
projects), an axe-core WCAG 2.2 AA audit of our pages in dark and light, and a v1-leftover sweep.
**Nothing is changed until this plan is approved.** Questions are marked **❓**.

---

## 0. What the review found

### 0.1 v1 leftovers still on the site (comment 3)
| Leftover | Where | Fix |
|---|---|---|
| Blotchy peach/yellow animated gradient (`Grainient`) behind every page | global background | Replace with flat theme paper + very fine grain; colour only where a section asks for it |
| Coloured cursor-glow dots (`DotGlow`) | global | Remove (reference has none); keep a subtle accent cursor dot only |
| Pixel-art cursors | global CSS | Back to system cursors (reference uses normal cursors) |
| Rainbow "N" chat orb | bottom-left | Restyle to a v2 round button (black-red / champagne, "Ask about Arun") |
| Spotify "Now Playing" window | bottom-right | Restyle to a small v2 "SOUND OFF ▮▮" pill like the reference; player opens from it |
| Throwable physics pills (Skills) | home | Retire; skills move into the About story as a clean list |
| Purple "UI archive" folder | Work | Restyle as a v2 "Archive" row in the project index (or remove ❓) |
| "Enter" laptop gate + greeting grid intro | loader | Kept as asked earlier, already re-themed — **❓ keep or switch to a reference-style logo/percentage loader?** |
| Pastel product bands, script-font quotes, purple Kairo accent | case-study pages | Rebuilt in v2 (see §4) |
| Placeholder testimonials | hidden | Real quotes needed (§6) |

### 0.2 Sections that should not be there (comment 5)
- **"Where do AI products lose people?"** (`Shift`) — remove.
- **"How I design AI" principles** — remove (replaced by the personal crawl, §7).
- Home goes back to v1's content set — hero, about, work, experience, skills/tools, process, testimonials, contact — in the new theme and reference layouts.

### 0.3 Accessibility audit (axe-core, WCAG 2.2 AA)
| Page / theme | Result | Fix |
|---|---|---|
| Home · dark | 1 fail — giant footer wordmark 1.13:1 | It's decorative: hide from assistive tech properly (`aria-hidden` on the text node + `role="presentation"`) |
| Home · light | 31 fails — tool tiles read as cream-on-cream | Tiles get their own dark surface tokens so text never inherits the page colour; re-test |
| Case study · both | 9 fails — Kairo purple `#6e56ff` text at 4.34–4.38:1 | Case accents get an AA-checked "text" variant (≥ 4.5:1) per theme |
| Case study · both | Scrollable gallery not keyboard-reachable | `tabIndex=0` + label on the scroll region |
| AI workflow · both | ✅ 0 fails | — |
Plus manual checks for every new section: focus ring visible on every control, targets ≥ 24 px (WCAG 2.2), reduced motion respected, text resize to 200 %, keyboard order.

### 0.4 Light mode (comment 4)
Problems: blotchy background, washed-out pink hero, harsh jumps between cream and black panels, faint grey reveal text.
**Light palette v2** (all text pairs ≥ 4.5:1, re-verified with the audit):
| Token | Now | Proposed | Why |
|---|---|---|---|
| paper | `#fbf6e9` + blotchy gradient | **`#f6f1e7`** flat warm paper | calm, no blotches |
| surface / card | `#fffdf6` / `#fff` | **`#fffcf5` / `#ffffff`** with 1 px `#100001/10` border | cards read as cards |
| ink / ink-2 / ink-3 | `#100001 / #5a3a38 / #7a5e5a` | **`#100001 / #4a2b29 / #6e5450`** | ink-3 to 5.3:1 |
| accent (CTA) | `#dc0208` | **`#c40007`** text-safe crimson (6.1:1), white label | stronger, AA for small text |
| highlight | `#ffef93` | champagne kept for fills/badges only, always with black-red text | |
| dark stages | `#100001` | unchanged — hero, journey, crawl and footer stay dark **in both themes** ❓ | matches the reference; the light theme then reads as "paper sections between dark stages" with soft 48 px rounded joins instead of hard cuts |
Hero in light mode: **❓ option A (recommended)** keep the hero a dark stage in both themes (strongest look), or **option B** light hero with a deep-crimson globe and darker dots.

---

## 1. Header (comment 1) ❓
Comment 1 reads "header i header instead of …" — the sentence is cut off. What should change in the header?
Possible readings: (a) use "Arun Vijayan" text logo instead of the lowercase wordmark, (b) use a photo/initials logo, (c) different nav links (e.g. About · Work · Experience · Contact), (d) a different CTA instead of "Let's talk". **Please complete the comment.**

## 2. Hero — positive and purely about Arun (comment 2)
Layout unchanged (globe, HUD, two statements). New copy, no criticism of AI:
| Element | Proposed |
|---|---|
| Pill | ● Available for full-time roles — GCC & remote |
| Eyebrow | AI-FIRST PRODUCT DESIGNER · CHENNAI, INDIA |
| Statement 1 (dims) | **HI, I'M / ARUN VIJAYAN.** |
| Statement 2 (stays) | ❓ pick one: **A. I DESIGN AI / PEOPLE ENJOY.** · **B. I MAKE COMPLEX / FEEL SIMPLE.** · **C. DESIGNER WHO / SHIPS CODE.** |
| Sub | Product designer with 5+ years in enterprise SaaS and FinTech. I shape AI search, voice and agentic experiences for US retirement platforms at Congruent Solutions — and prototype them in real code with Claude & Cursor. |
| Proof row | 5+ years · 500+ beta users in 6 weeks · 4.2/5 satisfaction |
| HUD | CHENNAI 10:42 · ● IDEAS ● SHIPPED · state "SKETCHING" → "SHIPPED" · DRAG TO ROTATE |
| Globe story | dots = ideas; they light up as "shipped" and gather into one glowing dot (positive, about his work) |

## 3. About — the reference Agency page (comment 6)
Reference `/en/agency/`: full-bleed photo hero "WE ARE EEZY INN." → centred statement + text → clients → crawl → team → "Design DNA" → how we work → studio/location → "Enough about us" CTA → contact.
**Proposal:** a home About block in that style **plus** a full `/about` page that mirrors the agency page ❓ (or home section only).
| Reference block | Arun version |
|---|---|
| Photo hero "WE ARE EEZY INN." + 2 buttons | Full-bleed portrait, dark wash: **"I'M ARUN VIJAYAN."** + one line + [See my work] [Résumé] |
| "NOT AN AGENCY THAT DOES EVERYTHING." + text | **"A DESIGNER WHO SPEAKS ENGINEER."** — engineer → designer story (positive) |
| Clients | Companies: Congruent Solutions · Euroland IR · Embarckle · Apexs Automation |
| Team cards | "Toolbox" cards: Figma · Claude · Cursor · Framer … (replaces team) |
| "FUNCTION AND FORM AREN'T A CONTRADICTION." | **"LOGIC AND CRAFT, IN ONE HEAD."** — skills list (research, IA, systems, AI patterns, accessibility) |
| "VECHTA. MOSTLY." | **"CHENNAI. FOR NOW."** — open to UAE, Oman, Saudi Arabia & GCC, remote; English & Tamil |
| "ENOUGH ABOUT US." | **"ENOUGH ABOUT ME."** Work says the most → [See my work] |

## 4. Experience (comment 7)
Keep as is (road timeline). Only light-mode/a11y fixes.

## 5. Case studies — the reference "Solutions" pattern (comment 8)
Reference home "WE START WHERE POTENTIAL GETS LOST.": two large dark cards (eyebrow · big title · list rows with arrows · button) beside a 3D object; the solution page (`/en/conversion/`) is: page hero → question list → centred statement → three service cards with mini UI illustrations → comparison → process → projects → CTA.
**Proposal ❓ confirm:**
- **Home "CASE STUDIES" section** in the solutions-card style: 4 cards (Kairo · Kosh · Tandem · Secondly), each with domain eyebrow, big name, three rows (Problem · Approach · Outcome → deep links) and [Read case]. Aura design system as a wide fifth card.
- **Case-study pages** restructured like the solution page: hero → "the questions users had" list → centred statement → solution cards with screens → before/after → process → next case. Product colours only as accents (AA-checked).

## 6. Projects (comment 9)
Reference "PROJECTS." (featured case card + numbered index rows with tags and arrows). Already in place — it becomes **shipped client work only** (Congruent, Euroland, personal tools); concept studies move to §5. Archive folder → a final "Archive" row ❓.

## 7. Testimonials instead of clients (comment 10)
Reference clients = two rows of logo tiles drifting in opposite directions. Arun version: **two rows of quote cards** (quote · name · role · company) drifting the same way, pausing on hover, readable without motion.
**❓ Needs 4–6 real recommendations** (LinkedIn text is fine). Until then the section stays hidden — no invented quotes.

## 8. Scrolly crawl with a personal story (comment 11)
Reference agency "EPISODE IV · A NEW VISIBILITY" — text rolls up in perspective like a film crawl as you scroll.
Arun version (positive, unique, true to the résumé) ❓ approve copy:
> **EPISODE V · A NEW DESIGNER**
> It began with logos — brand systems for six B2B clients in Chennai.
> Then came code: Python, client web apps, specs that engineering and QA could trust.
> Curiosity pulled the other way. A year of design and technology at Buff Creative College, and the engineer became a designer.
> At Euroland he gave investor-relations teams AI search that answered in plain language.
> Today, at Congruent Solutions, he designs AI for people's retirement savings — and prototypes it in real code, in days.
> Somewhere between the logic and the craft, he found his favourite job.
> **The next chapter could be with your team…**

## 9. How I work (comment 12)
Recreate the reference exactly: sticky "FROM IDEA TO SHIPPED." on the left, four big steps **01 DISCOVER · 02 DEFINE · 03 DESIGN & PROTOTYPE · 04 SHIP & LEARN** lighting up with a dot rail; one line each. Education moves to the About page.

## 10. Contact (comment 13)
Keep as is. Light-mode/a11y fixes only.

---

## 11. New home order
Hero → About (agency-style block) → Projects (shipped work) → Case studies (solution cards) → Experience → Crawl → How I work → Testimonials (when real) → Contact.
Removed: two-gaps line section, principles, physics pills, blotchy background, cursor dots, pixel cursors.

## 12. Build order (after approval)
1. Light palette + background + global leftovers (cursors, orb, sound pill) + audit fixes.
2. Hero copy and globe story.
3. About block + `/about` page.
4. Case-studies solution cards; projects → client work.
5. Crawl section.
6. How I work.
7. Testimonials (when quotes arrive).
8. Case-study page restructure.
9. EN/TA/HI for every string, axe audit (0 violations target) in both themes, phones/tablets/desktop, build, push.

## 13. Questions to answer
1. Header — what was comment 1 going to say?
2. Hero statement 2 — A, B or C (or your own)?
3. Hero in light mode — dark stage (A, recommended) or light (B)?
4. About — home block **and** a full `/about` page, or home only?
5. Case studies — solution cards on home **and** case pages restructured like the solution page?
6. Testimonials — can you send 4–6 real quotes (text, name, role, company)?
7. Crawl copy — approve or edit?
8. Archive folder — restyle as a row, or remove?
9. Intro — keep the re-themed "Enter" intro, or switch to a reference-style loader?

---

## 14. Decisions & status (round 3 built)
| # | Decision | Status |
|---|---|---|
| 1 | Header unchanged | — |
| 2 | Hero about Arun: "HI, I'M ARUN VIJAYAN. / ENGINEER TURNED DESIGNER." | ✅ |
| 3 | Both themes; light mode reworked (flat paper, AA palette, clean light globe) | ✅ |
| 4 | Home About block + `/about` page via "Know more" | ✅ |
| 5 | Two case studies on home + "View all" → `/case-studies` | ✅ |
| 6 | Testimonials: 2 cards with thumbnails | ✅ built, hidden until real quotes + photos (`showTestimonials`) |
| 7 | Story crawl copy approved | ✅ |
| 8 | Archive as its own section below Projects | ✅ |
| 9 | Intro unchanged | — |
| + | Tamil / Hindi alignment: no mid-word breaks, no ch caps, Brahmic line-height on display text, smaller hero, centred crawl | ✅ |
| + | axe-core WCAG 2.2 AA: 0 violations on 8 pages × 2 themes (see `v2-round3-axe-report.txt`) | ✅ |
