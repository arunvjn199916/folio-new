import type { CaseStudy, Shot } from "./types";

// Screens are from the client's design file, re-themed (brand colour changed) with names replaced.
const s = (name: string, label: string, note?: string): Shot => ({ src: `cases/baby/${name}.webp`, label, note, ratio: "375/812" });

export const baby: CaseStudy = {
  slug: "baby-tracker",
  brand: { name: "Baby Tracker", tint: "#ece4ff", band: "#f1ebff", accent: "#702ce2" },
  hero: {
    kicker: "parenting app · sleep, feeding & pumping",
    title: "Logging a baby's day with one hand, at 3 a.m.",
    sub: "A tracker for new parents: sleep, bottle and breast feeding, and pumping sessions — logged in a couple of taps and turned into daily reports parents can actually read.",
    shots: [s("choose", "Choose what to track"), s("sleep-analysis", "Sleep analysis"), s("sleep", "Sleep tracking"), s("home", "Feeding analytics"), s("pump", "Pumping")],
  },
  client: true,
  meta: [
    { label: "My role", value: ["Product designer (solo)", "UX research", "UI & prototype"] },
    { label: "Platform", value: ["iOS / Android", "Tablet view"] },
    { label: "Team & timeline", value: ["1 designer", "3–4 months"] },
    { label: "Scope", value: ["4 trackers", "Analytics"] },
  ],
  blocks: [
    {
      kind: "metrics",
      title: "What success looks like",
      intro: "Targets set for launch — goals, not measured results.",
      targets: true,
      items: [
        { tone: "down", label: "Seconds to log a feed", value: "<10s" },
        { tone: "up", label: "Parents logging every day in week 2", value: "60%" },
        { tone: "down", label: "Taps to answer “when did she last eat?”", value: "0" },
        { tone: "up", label: "Logs made by a second caregiver", value: "30%" },
      ],
    },
    {
      kind: "text",
      eyebrow: "Background",
      body: [
        "In the first months parents are asked the same questions by doctors, nurses and each other: how long does she sleep, how often does she feed, how much? The answers live in notes apps, paper charts and tired memory.",
        "The client wanted a calm, friendly tracker for four things — sleep, bottle feeding, breast feeding and pumping — with reports that turn the logs into patterns.",
      ],
    },
    {
      kind: "numbered",
      title: "What parents keep asking",
      intro: "Each tracker and report answers one of these.",
      items: [
        { title: "When did she last eat — and which side?", body: "The single most-asked question at night; it should be on screen without tapping." },
        { title: "Is she sleeping enough?", body: "Day vs night sleep, total per day, and whether it's getting better week on week." },
        { title: "How much milk is she getting?", body: "Bottle volumes, breast-feeding time per side, and pumping output in one place." },
        { title: "What do I tell the doctor?", body: "A clear summary for check-ups instead of scrolling through notes." },
      ],
    },
    {
      kind: "personas",
      title: "Who it's for (simulated personas)",
      items: [
        { name: "First-time mum", role: "On maternity leave, breast and bottle feeding", quote: "I can't remember if I fed her at two or at three.", needs: ["One-tap logging", "Last feed and side on home", "Night-friendly screens"] },
        { name: "Working dad", role: "Does the night bottle", quote: "I want to log it without waking everyone up.", needs: ["Quick bottle log", "Shared with partner", "Simple timer"] },
        { name: "Pumping parent", role: "Back at work, pumping twice a day", quote: "I need to know if my supply is dropping.", needs: ["Left / right sessions", "Weekly totals", "Reminders"] },
      ],
    },
    {
      kind: "numbered",
      title: "How existing trackers compare (desk review)",
      intro: "A walkthrough of popular baby-tracking apps on the stores.",
      items: [
        { title: "Powerful but busy", body: "Feature-rich trackers bury the quick log under menus, charts and upsells." },
        { title: "Logging needs two hands", body: "Forms with pickers and keyboards are hard while holding a baby." },
        { title: "Charts without meaning", body: "Plenty of graphs, little guidance on what a pattern means." },
        { title: "Paywalls on reports", body: "The summary parents need for check-ups is often a premium feature." },
      ],
    },
    {
      kind: "statement",
      eyebrow: "The design question",
      line: "How might a tired parent log anything in two taps — and still get answers worth reading?",
      sub: "Big targets, a timer for everything, and reports that lead with one number.",
    },
    {
      kind: "steps",
      eyebrow: "The solution at a glance",
      title: "Choose, log, understand.",
      items: [
        { quote: "I only track what I need.", title: "Choose", body: "Onboarding asks which trackers you want — sleep, bottle, breast feeding, pumping — and builds the home around them." },
        { quote: "Start, pause, done.", title: "Log", body: "Large start / end timers, left and right side buttons, notes, and a tracking history you can edit." },
        { quote: "Now I can see the pattern.", title: "Understand", body: "Daily and weekly analytics: total sleep, sleep efficiency per day, feeding time and volume, pumping per side." },
      ],
    },
    {
      kind: "journey",
      eyebrow: "A night feed",
      title: "From cry to back to sleep",
      start: { kicker: "Trigger", title: "Baby wakes at 3 a.m.", body: "One hand free, lights off." },
      steps: [
        { title: "Open to the home", body: "Last feed and side are already on screen." },
        { title: "Tap start on the side", body: "A big timer runs; pause if she unlatches." },
        { title: "Tap done", body: "Saved to history; today's total updates." },
      ],
      alt: { kicker: "Shortcut", title: "Partner logs a bottle", body: "Bottle tracking with volume in two taps." },
      end: { kicker: "Morning", title: "Daily report", body: "Totals and efficiency for the night, ready to compare." },
    },
    {
      kind: "band",
      title: "Track",
      caption: "Choose your trackers, then log with big timers and side buttons",
      crumbs: ["Choose", "Sleep", "Bottle", "Breast"],
      items: [{ shot: s("choose", "Choose trackers") }, { shot: s("sleep", "Sleep tracking", "Day / night sleep") }, { shot: s("sleep-2", "Bottle tracking") }, { shot: s("sleep-3", "Breast feeding", "Left / right timer") }],
    },
    {
      kind: "band",
      title: "Understand",
      caption: "Reports lead with one number, then show the week",
      crumbs: ["Sleep", "Feeding", "Bottle", "Pumping"],
      items: [{ shot: s("sleep-analysis", "Sleep analysis", "Sleep efficiency per day") }, { shot: s("home", "Total feeding", "Left vs right") }, { shot: s("bottle", "Bottle analytics", "Volume over time") }, { shot: s("pump", "Pumping", "Per side, per day") }],
    },
    {
      kind: "text",
      eyebrow: "Concept · added for this portfolio",
      title: "AI that helps without worrying anyone",
      body: [
        "Four AI concepts in Baby Tracker's style. They're careful by design: they describe patterns in the parent's own logs, never diagnose, and always point to the doctor for anything medical. They are not part of the delivered app.",
      ],
      bullets: [
        "Voice log: “Fed 90 ml, left side” becomes a structured entry you confirm.",
        "Weekly insights in plain language, each with the data behind it.",
        "Next nap and feed predictions with an honest ± range.",
        "A one-page doctor summary with the parent's own questions attached.",
      ],
    },
    {
      kind: "band",
      title: "Concept: answers, not just charts",
      caption: "Voice log · weekly insights · predictions · doctor summary",
      crumbs: ["Voice log", "Insights", "Predictions", "Doctor summary"],
      items: [{ shot: s("ai-voice", "Voice log", "One hand, lights off") }, { shot: s("ai-insights", "Weekly insights", "Patterns, not diagnoses") }, { shot: s("ai-predict", "Next nap & feed", "± range shown") }, { shot: s("ai-report", "Doctor summary", "One page PDF") }],
    },
    {
      kind: "test",
      title: "The test script",
      intro: "Four tasks used for the simulated walkthrough and for the moderated test that should follow.",
      tasks: ["Log a breast feed on the left side, one-handed", "Tell me when the baby last fed", "How much did she sleep yesterday compared with the day before?", "Fix a feed you logged at the wrong time"],
      measures: ["Time on task", "One-handed success", "Errors", "Confidence (1–5)"],
    },
    {
      kind: "walkthrough",
      title: "Four parents, four tasks",
      intro: "Four characters walked through the tasks on the real screens. A structured expert review, not user research — a moderated test with real parents is the next step.",
      participants: [
        { name: "Divya", age: 29, city: "Chennai", role: "First-time mum", comfort: "High", context: "Breast and bottle feeding; logs at night." },
        { name: "Suresh", age: 33, city: "Bengaluru", role: "Working dad", comfort: "High", context: "Does the 2 a.m. bottle." },
        { name: "Fathima", age: 31, city: "Kochi", role: "Pumping parent", comfort: "Medium", context: "Back at work; pumps twice a day." },
        { name: "Saroja", age: 56, city: "Trichy", role: "Grandmother, helps at night", comfort: "Low", context: "Prefers big text, few choices." },
      ],
      tasks: ["One-handed log", "Last feed", "Compare sleep", "Fix a log"],
      results: [
        ["pass", "pass", "pass", "hard"],
        ["pass", "pass", "pass", "pass"],
        ["pass", "pass", "hard", "pass"],
        ["hard", "pass", "fail", "fail"],
      ],
      quotes: [
        { by: "Divya, first-time mum", text: "The big timer is perfect. I just want the last side shown bigger." },
        { by: "Fathima, pumping parent", text: "Left and right totals side by side is what I actually check." },
        { by: "Saroja, grandmother", text: "I could start the timer, but I couldn't find where to change the time." },
      ],
    },
    {
      kind: "feedback",
      title: "What the walkthrough showed",
      source: "simulated",
      liked: ["Large timers worked one-handed", "Last feed visible from home", "Per-side totals for feeding and pumping"],
      disliked: ["Editing a past log is hidden in the history filter", "Weekly comparison needs a toggle most people missed", "Bright blue headers are harsh at night"],
    },
    {
      kind: "list",
      title: "What I learned",
      items: [
        { title: "Design for the worst moment", body: "If it works at 3 a.m. with one hand and dim eyes, it works any time." },
        { title: "Lead with one number", body: "Each report opens with a single total; the chart is there for anyone who wants more." },
        { title: "Care beats cleverness", body: "Parents are anxious; every insight needs plain words and a route to a professional." },
      ],
    },
    {
      kind: "list",
      title: "What I'd do next",
      items: [
        { title: "Night mode by default after dark", body: "Dim palette and bigger targets automatically between 10 p.m. and 6 a.m." },
        { title: "Edit from the timeline", body: "Long-press any log to change its time — the walkthrough's biggest failure." },
        { title: "Test with real parents", body: "Five parents of babies under six months, the four tasks above, in their own homes." },
      ],
    },
  ],
  sources: [],
};
