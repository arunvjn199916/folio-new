# New projects — Orion (task tracker + design system) and MyIR (mobile app)

Analysed from the Figma files via the Figma API (the Figma connector could not connect in this session).
**Nothing is added to the site until this plan is approved.** Questions are marked **❓**.

---

## 1. What the Figma files contain

### 1.1 Orion — support & onboarding system (file "Orion(Support system)")
Internal tool at **Euroland IR**: a Kanban-based ticket system that tracks client **onboarding, support, updates,
dividends and analyst-consensus** work across Euroland's IR tools (Share Graph, Financial Report, Investment
Calculator, Analyst Consensus, Factsheet, Share Alerts … ~25 tools).

| Area | Screens found | Notes |
|---|---|---|
| Login | Login (illustration + "Support System"), login directory | Branded entry, role-based landing |
| Kanban boards | Onboarding · Support · Updates · Dividends · Analyst consensus; Lead / Member / Manager variants; Admin/User | Columns: Open → In progress → Moved to production → Production done → QA → … |
| Ticket creation | Create ticket, New ticket (Manager / Lead) | Inline "Add new ticket" in a column |
| Ticket view | Ticket view per board, ~20 tool-specific variants, automated ticket, comments section | Header (client, priority, status), description, progress + time remaining, data inputs (sales/common data), tools & products progress rows, owner/assignees/participants/labels |
| Tool Center | Euroland Tool Center (service links per tool, languages, link status) | Single source of truth for tool links |
| Products & Tools | Product table (platform, version, category, subscription, status, members, owner) | Filterable inventory |
| Team | My team / All members table | Roles, department, position |
| Customers | Customer cards grid with filters + customer detail (overview, orders & invoice, service list, contacts, documents) | CRM-lite |
| Notifications | Push notification (Windows toast + in-app) | |
| Labels | Create label pop-up | |
| Wireframes | Ticket + notifications wireframes | Low-fi before visual design |
| **Design system** ("components" page) | Ticket card, Kanban column, list, status chips/icons, progress bars, edit buttons (3 states), data-input blocks, sales/common-data sections, tools & products table … | The reusable kit behind every screen |
| Brand | "Orion logo" page (logo explorations, Orion-branded Kanban) | Rebrand from "Euroland IR Support System" → **Orion** |

### 1.2 MyIR — investor-relations mobile app (file "portfolio website" → section "Prototype 1")
A white-label **IR app** for listed companies (screens show Milaha / QNSS on Qatar exchange, Woori Bank watchlist,
stc contact page) — the mobile counterpart of Euroland's IR website tools. ~120 frames, iOS 375 px, purple brand.

| Area | Screens found |
|---|---|
| Home | Data-centric home (price, chart, financial calendar, key financials, documents, analyst ratings, dividends, historical price) |
| Share graph | Share data / market data tabs, 1D→MAX ranges, compare, **landscape full-screen chart** |
| Watchlist | My watchlist, stock detail (share data / market data), add-stock pop-ups |
| Analyst consensus | Overview (current price, recommendation, target price), consensus scale, detailed recommendations |
| Documents | Document library (annual reports, earnings presentations, quarterly), download pop-up |
| Announcements | Company announcements by month, with price reaction |
| Key financials | Income statement / key figures, annual & quarterly |
| Financial calendar | Upcoming / past events (dividends, AGM, results), add-to-calendar |
| Dividends | Dividends per share chart, annual yield, dividend history |
| Historical price | Day / custom period, OHLC + candles, annual close |
| Investment calculator | Period, amount vs shares, dividend reinvested |
| Notifications | Feed + notification settings |
| Media / Audiocast · Webcast · Corporate governance · About us · Contact us | Content pages |
| Menu · Settings | Full-screen menu on corporate imagery; account, language, currency, notification & home-module settings, delete account |

---

## 2. Confidentiality ❓ (must answer first)
Both projects are **Euroland IR client work**. The screens show real client names and data
(Saudi Tadawul, Aramco, Milaha, Woori Bank, stc contact details, internal team names and emails).
**Proposal:** before publishing, anonymise in the exported images — blur/replace client logos and names
("Client A", "Listed company"), team names/emails and phone numbers — and add a line
"Shown with client details anonymised". **❓ Do you have Euroland's OK to show these, and should I anonymise?**

---

## 3. Case-study plans (same template as Kairo/Kosh: solution-page structure, chapters, dark panels)

### 3.1 Orion — "One board for every client handover"
| Chapter | Content (built from the screens; nothing invented) |
|---|---|
| Hero | Orion · Internal tool · Euroland IR. Statement: *"Turning scattered onboarding emails into one board the whole team can trust."* Scope chips: role, platform (Web, 1920), team, timeline ❓ |
| The problem | Questions list: *Which client is waiting on us? Which of the 25 tools is live for them? Who owns this ticket? What changed since yesterday?* |
| Research | Roles from the screens: **Manager**, **Lead**, **Member**, **Admin/User** — what each needs (board views differ per role). Plus the wireframes as "early exploration". ❓ any real research (interviews, # users)? |
| Design question | *"How might we let five teams track hundreds of tool deployments per client without losing the thread?"* |
| What I designed | 1. **Role-based Kanban boards** (5 workflows) · 2. **Ticket view** with tool-by-tool progress and time remaining · 3. **Tool Center + Products & Tools** as one source of truth · 4. Customers CRM-lite · 5. Notifications |
| Flows (UX research flows) | Journey: client signs → Manager creates onboarding ticket → Lead assigns tools → Members move cards through columns → QA → production → client notified. Plus ticket-lifecycle diagram (statuses from the boards). |
| Design system | Components page: ticket card, column, status chips, progress bars, button states, data blocks — shown as a "kit" grid; tokens (navy #0b2545-ish, status colours) extracted from Figma |
| Rebrand | Euroland IR Support System → **Orion** logo explorations |
| Before → after | Wireframe ticket vs final ticket view |
| Outcome | Only real numbers — résumé says design system "adopted across 4 products" and engagement up 25% for Euroland work ❓ which apply to Orion? |
| Learnings | 3 items ❓ (or I draft, you edit) |

**Screens to use (≈12):** Login, Onboarding Kanban (Manager), Create ticket, Ticket view, Tool Center, Products & Tools, Team, Customers, Push notification, Updates Kanban (User), wireframe ticket, components sheet, Orion logo.
**Placement:** replaces the existing "A design system for a task tracker app" row (same project) ❓, and appears as a third card on the Case studies page.

### 3.2 MyIR — "Investor relations in your pocket"
| Chapter | Content |
|---|---|
| Hero | MyIR · Mobile app (iOS/Android) · Euroland IR. Statement: *"Everything a shareholder checks — price, reports, dividends, events — in one tap from the home screen."* |
| The problem | Questions: *How is the share doing today? When is the next dividend? Where's the annual report? What did the company just announce?* — answers were spread across IR websites built for desktop. |
| Research | Audiences visible in the screens: **retail shareholders**, **analysts/investors**, **IR team** (content owner). Competitive look at IR websites → mobile. ❓ real research? |
| Design question | *"How might we fit a full IR website's tools into a phone without burying the share price?"* |
| What I designed | 1. **Data-centric home** (configurable modules) · 2. **Share graph** incl. landscape chart & compare · 3. **Watchlist** · 4. **Documents & announcements** · 5. **Dividends + investment calculator** · 6. **Notifications & settings** (language, currency, home modules) |
| Flows | Shareholder journey: notification → announcement → share graph → add to calendar; IA map of the 15+ modules from the menu. |
| Design system | Purple brand, cards, tabs, range selector, charts, pop-ups (from the components in the frame) |
| Outcome | ❓ — any shipped numbers (clients using it, downloads, ratings)? Otherwise "Shipped to N clients" or no metric. |

**Screens to use (≈14):** Home, Share graph, Landscape chart, Watchlist, Stock detail, Analyst consensus, Documents, Announcements, Key financials, Financial calendar, Dividends, Investment calculator, Notifications, Menu, Settings.
**Placement:** new row in Projects (it's shipped client work) + case-study page.

---

## 4. How I'll build it (after approval)
1. Export the chosen frames from Figma at 2× → anonymise (if approved) → `media/images/cases/orion/*`, `cases/myir/*` (webp).
2. Write `src/content/case-studies/orion.ts` and `myir.ts` with the existing block types (statement, questions, journey, band, web/gallery, edges, list) — desktop screens in browser frames, mobile in phone frames.
3. Add both to `projects.ts`, Projects index and the Case studies page; EN/TA/HI strings.
4. Verify (Playwright 320→1920, axe 0 violations, build) and push.

## 5. Questions
1. **Permission + anonymisation** (§2).
2. Your **role, team size and timeline** for each project.
3. Any **real research** (interviews, usability tests, # participants) and **outcomes/metrics** for each?
4. Orion: **replace** the existing "task tracker design system" project, or keep both?
5. MyIR: which client is it shipped for (or keep it generic)?
