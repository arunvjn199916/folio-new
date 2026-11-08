# Portfolio v2 — round 4 plan (for approval)

Arun's feedback: (1) hero and About feel repetitive, (2) the case-study section was missed, (3) check every comment for
errors/mistakes. Built from a fresh Playwright pass of the current site (`0118881`) and the reference
(`eezyinn.de/en/`, `/en/conversion/`). **Nothing changes until approved.** Questions are marked **❓**.

---

## 1. Hero vs About — what repeats

| | Hero (now) | Home About (now) | Problem |
|---|---|---|---|
| Name | "HI, I'M ARUN VIJAYAN." | "I'M ARUN VIJAYAN." | same line twice, one scroll apart |
| Who/what | "Product designer… Congruent… prototype in real code with Claude & Cursor" | "AI-first product designer from Chennai… I build the prototypes myself" | same message twice |
| Companies | — | 4 company chips | Experience (two sections later) lists the same 4 companies |
| Story | "Engineer turned designer" | (on /about) engineer → designer | the crawl tells the same story again |

### Fix — give every section one job
| Section | Job | Says |
|---|---|---|
| **Hero** | WHO + WHAT + proof | Name, headline, current role/domain, 3 numbers. Nothing about the journey. |
| **Home About** | WHY / HOW — the person | No name, no companies. A hook + three "how I work" traits + photo + **Know more** |
| **Experience** | WHERE — facts | Companies, roles, dates (unchanged) |
| **Crawl** | The story | Graphic design → code → design → AI (unchanged) |
| **/about page** | Everything in depth | Name hero is fine here (separate page) |

**Hero (copy changes)**
- Statement 1: **HI, I'M / ARUN VIJAYAN.** (kept)
- Statement 2: **I DESIGN AI / PEOPLE UNDERSTAND.** ❓ (or keep **ENGINEER TURNED DESIGNER.** — but then the crawl/About must not repeat it)
- Sub (shorter, no tools): "Product designer with 5+ years in enterprise SaaS and FinTech — today designing AI search, voice and agentic experiences for US retirement platforms at Congruent Solutions."
- Proof row unchanged.

**Home About (rebuilt, agency-style photo panel kept)**
- Eyebrow: ABOUT ME
- Title: **ENGINEER FIRST. DESIGNER BY CHOICE.** (replaces the repeated name)
- One-line hook: "I write the prototype before I write the spec — so ideas get tested with real people in days."
- Three trait tiles (instead of company chips):
  1. **Thinks in systems** — design systems, tokens and AI patterns that scale across products.
  2. **Builds what he designs** — real-code prototypes with Claude & Cursor.
  3. **Designs for trust** — clear states, sources and a way back, for regulated finance.
- Buttons: **Know more** → `/about` · Résumé

---

## 2. Case studies — what was missed

Reference comment 8: *"follow solution section for case study from eezyinn"*.
- Built in round 3: only the **home cards** (2 + "View all").
- **Missed:** the **case-study pages** still use the v1 long-form layout (pastel bands, "What was the problem?",
  persona notes, "Five characters, four tasks"…) — they do not follow the reference solution page.
- The home cards also don't match the reference solutions block closely (it has numbered cards with **list rows
  that link into the solution**, and a floating object between the cards).

### 2.1 Home "Case studies" — mirror the reference solutions block
- Left: eyebrow CASE STUDIES · big title **"TWO PRODUCTS, END TO END."** · one line.
- Two tall dark cards side by side (Kairo · Kosh), each:
  `01 · AI ASSISTANT` → big name → **chapter rows with arrows** (Problem · Research · Design · Validation → jump to
  that part of the case) → **Read case** button.
- A floating phone screen drifting between the cards (the reference's 3D object), parallax on scroll.
- Row below: **View all case studies →** (kept).

### 2.2 Case-study pages — rebuilt on the reference solution-page structure
Same content (nothing lost), new order and layout. Reference `/en/conversion/` → ours:

| # | Reference block | Case-study block (filled from the existing study data) |
|---|---|---|
| 1 | Page hero: "SOLUTION / CONVERSION" + big statement + sub + 2 buttons | Breadcrumb `Case study / Kosh` · big headline · sub · [Read the story ↓] [Next case] · scope chips |
| 2 | Stage panel | Phone fan in the dark media panel (exists) |
| 3 | "More traffic doesn't solve…" short statement + text | **Why it matters** — the key insight numbers (insights / metrics) |
| 4 | Question list that lights up on scroll | **Questions users had** — each problem as a question, lit one by one |
| 5 | Centred big statement | **The design question** (statement block) |
| 6 | Three service cards with mini UI | **What I designed** — three feature cards, each with a screen |
| 7 | "Same traffic. Different result." comparison | **Before → after** — explored wireframes vs the final screens |
| 8 | How we work | **How I worked on it** — research → define → design → test |
| 9 | Projects / numbers | **Validation** — walkthrough results + targets in big numbers |
| 10 | CTA rows | **Learnings** → **Next case** → contact rows |

Pastel bands → dark panels; persona notes / script quotes → v2 cards; product colour only as an AA-checked accent.

---

## 3. Comment-by-comment audit (rounds 1–3)

| Comment | Status | Mistake / gap | Fix |
|---|---|---|---|
| R1 Hero + globe like reference | ✅ | — | — |
| R1 Nav animation | ✅ | — | — |
| R1 Timeline section | ✅ | — | — |
| R2 Palette #100001 / #dc0208 / #ffef93, light + dark | ✅ | Light mode needed a second pass (done in R3) | — |
| R2 Responsive | ✅ | — | Re-check after this round |
| R2 Keep intro, re-theme | ✅ | — | — |
| R3-1 Header CTA | ✅ unchanged | — | — |
| R3-2 Hero positive, about Arun | ⚠️ | Positive ✅, but **duplicates About** | §1 |
| R3-3 Everything in the new theme | ⚠️ | Still v1: **accessibility panel** (bright purple), **case-study page internals**, chat panel internals | Restyle all three in v2 |
| R3-4 Light mode + accessibility | ✅ | 0 axe violations; re-test after changes | — |
| R3-5 Remove "Where AI loses people", v1 content set | ⚠️ | Section removed ✅, but **Skills & Tools left the home page** (now only on /about) — v1 had them on home | ❓ bring a compact Skills & Tools strip back to home, or keep on /about |
| R3-6 About = agency page | ✅ | Home block repeats hero | §1 |
| R3-7 Experience OK | ✅ | — | — |
| R3-8 Solution section for case study | ❌ | **Case pages not rebuilt; home cards not close enough** | §2 |
| R3-9 Projects section | ✅ | — | — |
| R3-10 Testimonials instead of clients | ⚠️ | Built but **hidden** — no real quotes yet, so it looks missing | Needs 2 real quotes + photos ❓ |
| R3-11 Crawl | ✅ | Repeats About's journey | §1 (About no longer narrates it) |
| R3-12 How we work | ✅ | — | — |
| R3-13 Contact | ✅ | — | — |
| Answer 10 | — | Your message ended at "10." — anything to add? ❓ | — |
| Local dev server "old version" | ✅ resolved | Your copy was 8 commits behind; npm not on PATH | Fixed with reset + PATH |

---

## 4. Build order (after approval)
1. Hero copy + home About rebuild (de-duplication).
2. Home case-studies block (numbered cards, chapter rows, floating screen).
3. Case-study page template on the solution-page structure; migrate Kairo, Kosh, Tandem, Secondly.
4. v1 leftovers: accessibility panel, chat panel, case-page blocks → v2.
5. EN / TA / HI, light + dark, phones → desktop, axe audit (0 violations), build, push, screenshots.

## 5. Questions
1. Hero statement 2: **"I DESIGN AI PEOPLE UNDERSTAND."** or keep **"ENGINEER TURNED DESIGNER."**?
2. Skills & Tools: compact strip back on the home page, or only on /about?
3. Testimonials: can you send 2 real quotes (text, name, role, company) + photos?
4. Your previous message ended at "10." — anything for that point?

---

## 6. Decisions & status (round 4 built)
| Item | Decision | Status |
|---|---|---|
| Hero statement 2 | Keep "ENGINEER TURNED DESIGNER." | ✅ sub shortened to role + domain |
| Home About | No name / companies; "Engineer first. Designer by choice." + hook + 3 traits + Know more | ✅ |
| Skills & Tools | Stay on /about | ✅ |
| Home case studies | Numbered cards, chapter rows linking into each case, floating screen, View all | ✅ |
| Case-study pages | Solution-page structure: statement hero, chapters with anchors, scroll-lit questions, dark panels | ✅ all 4 cases |
| Testimonials | Drafts for Nithi, Surya, Gowtham, Vairoshini + Aramco/BAT IR-app feedback — shown only once approved | ⏳ awaiting approvals (`docs/testimonial-drafts.md`) |
| v1 leftovers | Accessibility panel + chat panel re-coloured to the brand | ✅ |
| Accessibility | axe WCAG 2.2 AA: 0 violations, 12 pages × 2 themes (`v2-round4-axe-report.txt`) | ✅ |
| Known small issue | On 390 px phones in Tamil, the minimised music bar overlaps the second hero button | open |
