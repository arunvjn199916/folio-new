# Round 6 plan: Magnil, zeroQ, Baby Tracker, MyIR AI, Participant portal (web + mobile)

Analysed from the Figma files via the REST API. **Nothing will be built until you approve this plan.**
Open questions are marked **❓**.

---

## 0. Before anything else

| # | Topic | Status / proposal |
|---|---|---|
| A | **Figma rate limit** | The file `portfolio-website` (MyIR + the participant-portal mobile app) is locked by Figma again for about 4.5 days (until about **13 Nov**). Magnil, zeroQ and Baby Tracker are readable now. **❓ Should I wait, or will you export the 20 participant-portal frames as PNG at 2× and put them in `media/incoming/ppm/`?** The frame list is in §6. |
| B | **Congruent permission** | The participant portal (web and mobile) is Congruent work, like Orion/MyIR was Euroland work. I'll anonymise in the same way: no Congruent or client names, fake participants and amounts. **❓ Is it OK to show this?** |
| C | **The login you pasted** | Please **change that password**: it's now in the chat history. I won't store it in the repo, the code or any doc. If I log in to capture screens, I'll use it only in this session. |
| D | **"Host this"** | I recommend **not** redeploying Congruent's code. Instead: (1) a case study with re-themed screens, and (2) an optional **clickable demo** that I rebuild from scratch on the site at `/work/participant-portal/demo`, with fake data and a new theme. It's yours to show, and nothing from Congruent's codebase is in it. **❓ Case study only, or case study + demo?** |
| E | **AI features** | All new AI features are labelled **"Concept, added for this portfolio"**, so nobody reads them as shipped. They're designed in each app's own visual style. |
| F | **How new screens are made** | New screens (AI features, re-themed portal) are written as small HTML pages in each app's tokens, then captured with Playwright as 2× webp. That's the same pipeline as the existing shots, so they look like the Figma exports. |

---

## 1. Magnil: employee management app (Android). Upgrades the existing Projects row to a full case study

**What Figma has.** A full 36,000 px case-study page, including real research:
- **Research:** interviews with factory employees; a Google survey (salary notifications, employee type, attendance method); competitor analysis of Salary Box, Zoho and HRMantra; 2 personas (a general manager and a sales rep); an empathy map; affinity mapping.
- **Flows:** a role-based user flow (Employee / Supervisor / Manager → punch, attendance, leave, shift, task, salary, payroll) and a user journey map.
- **Wireframes:** sketch → digital → wire-flow.
- **Style guide:** a logo concept; primary **#007E87**, secondary **#45A8B7**; Montserrat at 14/16/20/24; service icons.
- **Components:** bottom nav, buttons, inputs, toggles, top bar.
- **35+ UI screens:** splash/onboarding, login/OTP, home (punch in/out swipe, attendance, salary, news feed, Digi-Locker), attendance + leave, shifts + payslip, other-role home screens, screen evolution.
- **Meta:** UI/UX designer · Mobile · 12 weeks.

**Case study (same template as Orion/MyIR):**

| Chapter | Content |
|---|---|
| Hero | "Taking a factory's attendance, leave and shifts off paper." Phone fan: home, punch-in, attendance, shifts, payslip. |
| Problem | Questions list from the Figma "Problems": manual records, manual leave requests, no way to track work, time-consuming process. |
| Research | **Real** (not simulated): interview questions, survey results as small charts, a competitor table, 2 personas (employer names removed), empathy map, affinity clusters. |
| Question | "How might we let every employee handle punch-in, leave, shifts and pay from one app, whatever their role?" |
| Design | User flow by role → journey map → sketch / digital wireframe / wire-flow → final screens in bands. |
| **Design system** (new chapter) | Tokens (colours, type scale, icon set) and the component sheet, shown as a kit grid. Plus a small **live token panel** built in code, so it's not only a picture. |
| **AI concept** (new chapter) | 1. **Leave assistant**: "Leave on Friday", then it checks your balance and shift clash and drafts the request. 2. **Shift-swap match**: suggests colleagues who can cover. 3. **Payslip explainer**: "Why is my pay lower this month?" with an itemised answer. 4. **Supervisor digest**: flags attendance anomalies, with a person confirming every action. 4 new screens. |
| Learnings / next | From the testing notes in Figma, plus the AI rollout risks. |

❓ **Is the "improved operational efficiency by 30%" on the current row a real number?** If not, I'll remove it.
Anonymise: the persona employers (two named manufacturers) become "an auto-parts manufacturer". Your phone number on the last frame is not used.

---

## 2. zeroQ: food ordering, delivery *or* self-pickup ("zero queue")

**What Figma has** (page *NEW DEV SHARE PAGE*, 30 frames, 375 px):
- splash
- login (5 states)
- location
- home: Delivery / Self-pickup toggle, cuisines, top restaurants
- search
- restaurant list (sort, "under 30 min")
- menu (2 states)
- self-pickup cart and delivery cart
- pickup payment, delivery payment
- order placed / cancelled for both modes
- delivery address
- feedback for takeaway and for delivery (several states)
- new-food and refund pop-ups

There's no research in the file, so research is **simulated and labelled**, as with Orion.

| Chapter | Content |
|---|---|
| Hero | "Skip the queue, not the meal." Phone fan: home, restaurant, menu, cart, order placed. |
| Problem | Why people wait: the pickup counter queue, unclear ready time, delivery fees for 1 km orders. |
| Research (simulated) | 3 personas: office-lunch pickup, family delivery, student on a budget. The test script and a 4×4 walkthrough grid. |
| Design | Two modes, one flow: a journey for pickup vs delivery; bands for discover → order → pay → after-order (feedback, refund). |
| **AI concept** | 1. **Craving search**: "spicy biryani under ₹300, ready in 20 min for pickup", turned into filter chips you can edit. 2. **Smart pickup slot**: uses kitchen load to suggest the time to leave home. 3. **Review summary** on each restaurant ("Liked: portion size · Watch out: weekend waits"). 4 new screens in zeroQ's style. |
| Learnings / next | |

Anonymise: the real Chennai restaurant names and the street address become fictional ones.
❓ **Your role, team size and timeline for zeroQ? Was it shipped, client work or a concept?**

---

## 3. Baby Tracker (new project)

**What Figma has** (page *UI*, 375 px):
- home: "Choose your baby tracking" (sleep, bottle feeding, breast feeding, pumping)
- sleep home (3 states) and sleep analysis: daily/weekly chart, sleep efficiency, daily report
- bottle-feed analytics (ml per feed)
- pumping: left/right, day/week/list
- tablet sleep view
- wireframes section
- a *UX* page (138:2), which I'll read during the build for any research

| Chapter | Content |
|---|---|
| Hero | "Logging a baby's day with one hand, at 3 a.m." |
| Problem | Tired parents, scattered notes, "when did she last eat?" |
| Research | Whatever is on the UX page; anything missing is simulated and labelled. |
| Design | The tracking picker → sleep → feeding → pumping → analytics bands, with wireframes as the before. |
| **AI concept** | 1. **Voice / one-tap logging** ("Fed 90 ml, left side"). 2. **Pattern insights** ("Naps are shorter after late feeds"). 3. **Next-nap / next-feed prediction** with a confidence note. 4. **Paediatrician summary**: a one-page weekly PDF. Every screen says **"Not medical advice"**, and there's a path to "talk to your doctor". |

Placement: a new Projects row (B2C · Mobile · AI).
❓ **Role / timeline? Personal project or client work?**

---

## 4. MyIR: AI search + AI chat (concept, added to the existing case study)

Designed new in MyIR's anonymised blue style (375 px), using the existing MyIR screens as the reference. No Figma needed, so this isn't blocked.

| Screen | What it shows |
|---|---|
| AI search entry | Search bar on home: "Ask about this company…", with suggested questions. |
| Search results | An answer card with **sources** (announcement, annual report page, dividend table), each opening the real module. |
| AI chat | A conversation ("How did Q1 dividends compare to last year?") with a chart reply, citations, follow-up chips. |
| Guardrails | "Not investment advice", data delay note, "Ask the IR team" hand-off, and a "no answer" state when the documents don't cover the question. |

Added as a new chapter "Concept: asking instead of browsing", plus a link to the existing **AI search for IR managers** row (the same idea from the IR manager's side).

---

## 5. Participant portal, web (corethreepointo.netlify.app). Upgrades the "Agentic AI participant portal" row

- **Capture:** log in with Playwright and screenshot the main flows. This needs the netlify host allowed in this environment; I'll ask for that with an approval prompt only once you approve this plan.
- **New theme and style** (so it doesn't look like Congruent's product):
  - working name "Harbor"
  - deep teal-green + sand + coral accent
  - a different typeface (e.g. IBM Plex Sans)
  - rounder cards

  The key screens are **rebuilt** in this theme rather than recoloured, since recolouring a screenshot looks fake.
- **Case study:**
  - problem: retirement enrollment is long and confusing
  - research: simulated, unless you have real research ❓
  - question
  - agentic AI flows: enrollment, contribution change, investment change, with confirmations and human-in-the-loop
  - test → learnings
- **Demo (if you choose D2):** a clickable 5–6 step flow on the site, with fake data and the new theme.

## 6. Participant portal, mobile app (Figma 688:16708). Upgrades the "Retirement mobile MVP" row

20 frames (402 px):
- splash, login, signup, login, OTP
- **dashboard**
- enroll walkthrough + 4 wizard steps
- **choose plan**
- **contribution**
- **source**
- **auto-increase**
- **investments**
- **readiness**
- **review**
- **post-enrollment** (long page)

It gets the same "Harbor" theme as the web portal, so they read as one product family. Case-study blocks: hero fan → enrollment journey → wizard bands → readiness/review → the stats already on the row (500+ beta users, 4.2/5). Blocked by the Figma lock (§0 A).

---

## 7. Build order (after approval)

1. **MyIR AI screens** (not blocked).
2. **Magnil** (most content, real research).
3. **zeroQ**.
4. **Baby Tracker**.
5. **Participant portal web** (after permission plus the host prompt).
6. **Participant portal mobile** (after the Figma unlock or your PNG export).

Each project gets:
- an anonymised webp set in `media/images/cases/<slug>/` and `src/content/case-studies/<slug>.ts`
- a Projects row (Magnil and the two portals upgrade their existing rows; zeroQ and Baby Tracker are new)
- EN / TA / HI strings at matching positions
- verification: lint, build, axe with 0 violations in both themes, and the 320→1920 responsive audit
- then commit and push to `v2-redesign`

## 8. Questions (short answers are fine)

1. Figma: wait for the unlock, or will you export the 20 mobile-portal frames? (§0 A)
2. Congruent: OK to show, anonymised? Case study only, or case study + rebuilt demo? (§0 B, D)
3. Magnil: is the "30% efficiency" number real?
4. zeroQ and Baby Tracker: role, team, timeline, and shipped / client / concept?
5. Participant portal: any real research or numbers beyond 500+ beta users and 4.2/5?
