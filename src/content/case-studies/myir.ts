import type { CaseStudy, Shot } from "./types";

// Screens are from the shipped app, anonymised: company names, logos, photos and brand colour replaced.
const s = (name: string, label: string, note?: string): Shot => ({ src: `cases/myir/${name}.webp`, label, note });

export const myir: CaseStudy = {
  slug: "myir-investor-app",
  brand: { name: "MyIR", tint: "#dde6fb", band: "#e7edfb", accent: "#1d4ed8" },
  hero: {
    kicker: "white-label investor-relations app",
    title: "Putting a company's whole investor-relations website in a shareholder's pocket",
    sub: "MyIR turns 15+ desktop IR tools — share graph, reports, announcements, dividends, calendar, calculator — into one mobile app a listed company can brand as its own, without burying the share price.",
    shots: [s("share-graph", "Share graph"), s("watchlist", "Watchlist"), s("announcements", "Announcements"), s("dividends", "Dividends"), s("calendar", "Financial calendar")],
  },
  client: true,
  meta: [
    { label: "My role", value: ["Product design", "Information architecture", "UI & prototype"] },
    { label: "Platform", value: ["iOS / Android", "White-label"] },
    { label: "Team & timeline", value: ["3 designers", "8 months"] },
    { label: "Built with", value: ["Figma", "Design system"] },
  ],
  blocks: [
    {
      kind: "metrics",
      title: "What success looks like",
      intro: "Targets for a first client launch — goals, not measured results.",
      targets: true,
      items: [
        { tone: "down", label: "Taps from opening the app to today's share price", value: "0" },
        { tone: "up", label: "Shareholders with announcement alerts on", value: "60%" },
        { tone: "down", label: "Time to find the latest annual report", value: "<10s" },
        { tone: "up", label: "Weekly returning users", value: "35%" },
      ],
    },
    {
      kind: "text",
      eyebrow: "Background",
      body: [
        "Listed companies publish everything shareholders need — prices, results, dividends, AGMs, reports — on investor-relations websites built for desktop: long pages, wide tables and charts that don't survive a phone screen.",
        "The same provider that builds those websites wanted one mobile product it could brand for each client. The challenge wasn't adding features — the tools already existed — it was deciding what a shareholder should see first and fitting a dozen dense tools into a 375-pixel screen.",
      ],
    },
    {
      kind: "numbered",
      title: "What shareholders came to check",
      intro: "Every module in the app answers one of these questions. On the desktop site each answer was three clicks and a horizontal scroll away.",
      items: [
        { title: "How is the share doing today?", body: "Price, change and the day's chart, before anything else." },
        { title: "What did the company just announce?", body: "Announcements and results, with the price reaction next to them." },
        { title: "When is the next dividend or meeting?", body: "Dividends, AGMs and results dates — and a way to put them in a calendar." },
        { title: "Where is the report I need?", body: "Annual reports, earnings presentations and quarterly disclosures, downloadable on the go." },
      ],
    },
    {
      kind: "personas",
      title: "Who it's for (simulated personas)",
      items: [
        { name: "Retail shareholder", role: "Holds shares in a few companies", quote: "I just want to know if today is a good day — and when the dividend lands.", needs: ["Price on open", "Dividend dates and history", "Simple alerts"] },
        { name: "Active investor / analyst", role: "Tracks results and consensus", quote: "Give me the chart in landscape and the numbers without the marketing.", needs: ["Full-screen charts and compare", "Key financials and consensus", "Reports and presentations"] },
        { name: "IR manager", role: "Owns the company's IR content", quote: "Whatever we publish on the website should reach shareholders' phones the same day.", needs: ["Content synced from the IR site", "Push for announcements", "Their own brand, not ours"] },
      ],
    },
    {
      kind: "statement",
      eyebrow: "The design question",
      line: "How might we fit a full IR website into a phone without burying the share price?",
      sub: "Price first, everything else one tap away — and every screen brandable per client.",
    },
    {
      kind: "steps",
      eyebrow: "The solution at a glance",
      title: "Check, follow, dig in.",
      items: [
        { quote: "The price is the first thing I see.", title: "Check", body: "A data-centric home and share graph: price, change, ranges from 1D to MAX, share data and market data, with a landscape chart and compare." },
        { quote: "I heard about the AGM from the app, not the news.", title: "Follow", body: "Watchlist, announcements with price reaction, a financial calendar with add-to-calendar, and notifications you can tune per topic." },
        { quote: "Everything from the IR site is here.", title: "Dig in", body: "Key financials, dividends and yield, historical prices, analyst consensus, document library, media and an investment calculator." },
      ],
    },
    {
      kind: "journey",
      eyebrow: "A shareholder's week",
      title: "From a notification to a decision",
      start: { kicker: "Trigger", title: "Push notification", body: "“Company announces Q1 dividend distribution.”" },
      steps: [
        { title: "Read the announcement", body: "With the share's reaction shown beside it." },
        { title: "Check the share graph", body: "Switch to 3M, rotate for full-screen, compare." },
        { title: "Save the date", body: "Add the dividend date from the financial calendar." },
      ],
      alt: { kicker: "Shortcut", title: "Watchlist", body: "Investors following several companies start from their watchlist instead." },
      end: { kicker: "Outcome", title: "Informed shareholder", body: "Knows the price, the news and the date — in under a minute." },
    },
    {
      kind: "band",
      title: "Check: price first",
      sub: "The share graph is the heart of the app.",
      caption: "Share data and market data tabs, ranges from 1D to MAX, delayed-data disclosure",
      crumbs: ["Share graph", "Stock detail", "Analyst consensus"],
      items: [{ shot: s("share-graph", "Share graph", "Price, change and range") }, { node: "Tap a stock" }, { shot: s("stock-detail", "Stock detail", "52-week range, YTD") }, { node: "Consensus" }, { shot: s("analyst", "Analyst consensus", "Buy / hold / sell") }],
    },
    {
      kind: "band",
      title: "Follow: never miss an update",
      caption: "Announcements, calendar and alerts work together",
      crumbs: ["Watchlist", "Announcements", "Calendar", "Notifications"],
      items: [{ shot: s("watchlist", "Watchlist") }, { shot: s("announcements", "Announcements", "Price reaction per item") }, { shot: s("calendar", "Financial calendar", "Add to calendar") }, { shot: s("notifications", "Notifications") }],
    },
    {
      kind: "gallery",
      title: "Dig in: the full IR toolkit",
      sub: "Desktop tools rebuilt for one hand and a small screen.",
      shots: [s("key-financials", "Key financials"), s("dividends", "Dividends & yield"), s("historical-price", "Historical price"), s("calculator", "Investment calculator"), s("documents", "Document library"), s("media", "Media & audiocasts"), s("settings", "Settings: language, currency, home modules")],
    },
    {
      kind: "text",
      eyebrow: "Concept · added for this portfolio",
      title: "Asking instead of browsing",
      body: [
        "Fifteen modules are a lot to browse on a phone. These AI search and chat screens, designed in MyIR's style, let a shareholder simply ask — and answer only from what the company has published, with a link to every source. They extend the AI search I designed for IR managers to the shareholder's side; they are not part of the shipped app.",
      ],
      bullets: [
        "Answers cite the announcement, report page or data module they come from.",
        "Actions sit on the answer: add the dividend to the calendar, open the share graph.",
        "No predictions or investment advice — the assistant says so and offers the IR team instead.",
      ],
    },
    {
      kind: "band",
      title: "Concept: AI search & chat",
      caption: "Ask, get a sourced answer, follow up — and a clear line where the AI stops",
      crumbs: ["Ask", "Answer", "Chat", "Can't answer"],
      items: [{ shot: s("ai-search", "AI search", "Suggested questions") }, { shot: s("ai-answer", "Sourced answer", "With add-to-calendar") }, { shot: s("ai-chat", "AI chat", "Chart + citations") }, { shot: s("ai-fallback", "Guardrails", "No advice → IR team") }],
    },
    {
      kind: "test",
      title: "The test script",
      intro: "Four tasks from the shareholder questions, used for the simulated walkthrough and the moderated test that should follow.",
      tasks: ["Tell me how the share did over three months", "When is the next dividend, and add it to your calendar", "Find the latest annual report", "Turn off notifications for everything except announcements"],
      measures: ["Time on task", "Wrong turns in the menu", "Success without help", "Confidence (1–5)"],
    },
    {
      kind: "walkthrough",
      title: "Four shareholders, four tasks",
      intro: "Four characters who differ in experience and in how often they invest, walked through the tasks on the real screens. A structured expert review, not user research — a moderated test with real shareholders is the next step.",
      participants: [
        { name: "Mariam", age: 44, city: "Doha", role: "Retail shareholder", comfort: "Medium", context: "Holds shares in three local companies; checks monthly." },
        { name: "Omar", age: 33, city: "Riyadh", role: "Equity analyst", comfort: "High", context: "Covers a sector; compares charts daily." },
        { name: "Priya", age: 28, city: "Dubai", role: "New investor", comfort: "High", context: "Bought her first shares this year via an app." },
        { name: "Hassan", age: 61, city: "Muscat", role: "Retired investor", comfort: "Low", context: "Cares about dividends; prefers large text." },
      ],
      tasks: ["3-month performance", "Next dividend → calendar", "Latest annual report", "Tune notifications"],
      results: [
        ["pass", "pass", "pass", "hard"],
        ["pass", "pass", "pass", "pass"],
        ["pass", "hard", "pass", "pass"],
        ["hard", "pass", "hard", "fail"],
      ],
      quotes: [
        { by: "Hassan, retired investor", text: "The dividend part I understand. The settings page has too many small switches." },
        { by: "Priya, new investor", text: "I found the dividend, but I expected ‘add to calendar’ right on the dividend screen." },
        { by: "Omar, analyst", text: "Landscape chart with compare is exactly what I use on the desktop site." },
      ],
    },
    {
      kind: "feedback",
      title: "What the walkthrough showed",
      source: "simulated",
      liked: ["Price-first home answered the most common question with zero taps", "Landscape chart and compare matched what analysts use on desktop", "Announcements with price reaction made news easy to judge"],
      disliked: ["Notification settings are long and fine-grained — hard for less confident users", "Add-to-calendar lives in the calendar, not on the dividend screen", "The document library hides older years behind tabs"],
    },
    {
      kind: "list",
      title: "What I learned",
      items: [
        { title: "Prioritise, don't port", body: "Every desktop tool made it into the app, but only the share price earned the first screen. The rest sit one tap away in a clear menu." },
        { title: "White-label is a design-system problem", body: "Building every screen from tokens meant each client's colours and logo could be applied without touching layouts." },
        { title: "Charts need a landscape mode", body: "Investors who use charts seriously rotate the phone — designing that state early saved a lot of cramped compromises." },
      ],
    },
    {
      kind: "list",
      title: "What I'd do next",
      items: [
        { title: "Simplify notification settings", body: "Three presets (everything / announcements & dividends / off) with advanced options behind them." },
        { title: "Bring actions to the content", body: "‘Add to calendar’ on the dividend and AGM screens, not only in the calendar." },
        { title: "Test with real shareholders", body: "Five participants per client market, the four tasks above, before the next client launch." },
      ],
    },
  ],
  sources: [],
};
