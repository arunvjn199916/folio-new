import type { CaseStudy, Shot } from "./types";

// Anonymised: the product is shown as "Harbor", rebuilt in a new theme with made-up participants and numbers.
// Web screens are rebuilt from the shipped flows; mobile screens are from the design file, re-themed.
const w = (name: string, label: string): Shot => ({ src: `cases/harbor-web/${name}.webp`, label, ratio: "1440/900" });
const R: Record<string, string> = {
  "auto-increase": "375/1345", "choose-plan": "375/928", contribution: "375/1386", dashboard: "375/1349", investments: "375/990", login: "375/815", otp: "375/815",
  "post-enrollment": "375/2529", readiness: "375/1293", review: "375/1326", source: "375/1191", splash: "375/815", walkthrough: "375/811",
  "wizard-1": "375/932", "wizard-2": "375/928", "wizard-3": "375/928", "wizard-4": "375/928", "ai-chat": "375/812",
};
const m = (name: string, label: string, note?: string): Shot => ({ src: `cases/harbor-app/${name}.webp`, label, note, ratio: R[name] });

const SOURCES = [
  { label: "U.S. Department of Labor — ERISA overview", url: "https://www.dol.gov/general/topic/retirement/erisa" },
  { label: "Vanguard — How America Saves 2024", url: "https://institutional.vanguard.com/how-america-saves/overview" },
  { label: "IRS — 401(k) limit increases to $23,000 for 2024", url: "https://www.irs.gov/newsroom/401k-limit-increases-to-23000-for-2024-ira-limit-rises-to-7000" },
  { label: "Congress.gov — H.R.2617, Consolidated Appropriations Act 2023 (SECURE 2.0, Division T)", url: "https://www.congress.gov/bill/117th-congress/house-bill/2617" },
  { label: "U.S. DOL EBSA — Fee disclosure rule for participants (404a-5)", url: "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/fact-sheets/final-rule-to-improve-transparency-of-fees-and-expenses" },
  { label: "U.S. DOL EBSA — Default investment alternatives (QDIA)", url: "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/fact-sheets/default-investment-alternatives-under-participant-directed-individual-account-plans" },
];

export const harborWeb: CaseStudy = {
  slug: "agentic-ai-participant-portal",
  brand: { name: "Harbor", tint: "#dcf2ec", band: "#e6f5f1", accent: "#0b7a66" },
  hero: {
    kicker: "agentic AI · US retirement (ERISA)",
    title: "An AI that does the paperwork — and still asks before it moves your money",
    sub: "A participant portal for US workplace retirement plans where an agentic assistant plans multi-step changes — enrollment, contributions, investments — explains every number, and pauses for the participant's confirmation at each step that touches their money.",
    layout: "web",
    shots: [w("web-agent", "Ask Harbor — plan of action"), w("web-dashboard", "Dashboard"), w("web-readiness", "Retirement readiness")],
  },
  client: true,
  meta: [
    { label: "My role", value: ["Product designer", "AI interaction design", "UX research"] },
    { label: "Platform", value: ["Web (responsive)", "Companion mobile app"] },
    { label: "Domain", value: ["US 401(k) / 403(b)", "ERISA"] },
    { label: "Shown as", value: ["“Harbor” — anonymised"] },
  ],
  blocks: [
    {
      kind: "metrics",
      title: "What success looks like",
      intro: "Targets the portal was designed to move — goals, not measured results.",
      targets: true,
      items: [
        { tone: "down", label: "Time to complete enrollment", value: "<5 min" },
        { tone: "up", label: "Participants contributing at least to the full match", value: "+15 pts" },
        { tone: "down", label: "Calls to the service centre for “how do I change my contribution?”", value: "−40%" },
        { tone: "up", label: "AI actions confirmed by the participant before execution", value: "100%" },
      ],
    },
    {
      kind: "text",
      eyebrow: "Background",
      body: [
        "In the US, most private-sector retirement saving happens through workplace plans such as the 401(k). These plans are governed by ERISA, which makes the employer and the plan's fiduciaries legally responsible for acting in participants' interest, disclosing fees and offering prudent investment choices [1].",
        "The participant experience behind that is famously hard: plan documents, Roth vs pre-tax, vesting, match formulas, fee disclosures, beneficiary forms. Participants delay, under-save or call the service centre. The recordkeeper behind this project wanted a portal where AI does the heavy lifting — without ever acting on a participant's money on its own.",
      ],
    },
    {
      kind: "insights",
      title: "The market in four numbers",
      intro: "Desk research that shaped the brief.",
      items: [
        { value: "94% vs 64%", label: "plan participation with automatic enrollment vs voluntary enrollment", source: 2 },
        { value: "7.4%", label: "average participant deferral rate in Vanguard-administered plans", source: 2 },
        { value: "$23,000", label: "employee deferral limit for 2024, plus a $7,500 catch-up from age 50", source: 3 },
        { value: "2025", label: "SECURE 2.0 requires most new 401(k) plans to auto-enroll at 3–10%, rising 1% a year", source: 4 },
      ],
    },
    {
      kind: "numbered",
      title: "What participants actually ask",
      intro: "From service-centre call themes and participant feedback, rewritten as questions.",
      items: [
        { title: "Am I getting the full match?", body: "Match formulas (e.g. 100% of the first 6%) are in the plan document, not on the contribution screen." },
        { title: "Roth or pre-tax — which is right for me?", body: "The single most confusing election, with long-term tax consequences people can't see." },
        { title: "Am I on track?", body: "Balances are shown; income in retirement — the number people care about — isn't." },
        { title: "Can someone just do it for me?", body: "People want help that acts, but they also need to stay in control and understand what changed." },
      ],
    },
    {
      kind: "personas",
      title: "Who it's for (simulated personas)",
      items: [
        { name: "New hire, 26", role: "First job with a 401(k)", quote: "I don't know what any of these words mean. Just tell me the safe choice.", needs: ["Plain-language enrollment", "Default that gets the match", "Change it later"] },
        { name: "Mid-career saver, 41", role: "Two kids, some savings", quote: "I got a raise. I want to save more without doing the maths.", needs: ["Paycheck impact before confirming", "Roth vs pre-tax explained", "Readiness score"] },
        { name: "Near-retiree, 59", role: "Catching up", quote: "Am I going to have enough, and what's the catch-up limit?", needs: ["Income projection", "Catch-up contributions", "Talk to a person"] },
      ],
    },
    {
      kind: "numbered",
      title: "How the big recordkeeper portals compare",
      intro: "A heuristic review of public participant experiences from the leading US recordkeepers and a digital-first provider.",
      items: [
        { title: "Fidelity NetBenefits", body: "Broad, mature tools and strong education content, but changes are spread across many separate pages and forms." },
        { title: "Empower", body: "Good retirement-income framing and aggregation; guidance and transactions still live in different places." },
        { title: "Vanguard", body: "Clear, conservative defaults and strong research; little conversational or proactive help inside the flows." },
        { title: "Digital-first providers", body: "Fast onboarding and modern UI, but often limited plan-rule detail for complex employer plans." },
      ],
    },
    {
      kind: "text",
      eyebrow: "Constraints",
      title: "ERISA shapes the design",
      body: [
        "Every interaction had to respect how plans are regulated. That turned into concrete design rules rather than legal footnotes.",
      ],
      bullets: [
        "Fee and investment disclosures (404a-5) are linked wherever an investment choice is made [5].",
        "Defaults use the plan's qualified default investment alternative (QDIA), usually a target-date fund [6].",
        "The assistant gives education and plan-specific facts, not individual investment advice; advice questions hand off to a licensed person.",
        "Every change follows plan rules (limits, Roth availability, payroll cut-offs) and is saved to an audit trail the participant can see.",
      ],
    },
    {
      kind: "statement",
      eyebrow: "The design question",
      line: "How might an AI take real actions on someone's retirement — and earn their trust every single time?",
      sub: "Plan in the open, explain each number, and stop for a human yes before anything touches money.",
    },
    {
      kind: "steps",
      eyebrow: "The solution at a glance",
      title: "Notice, plan, confirm.",
      items: [
        { quote: "It told me I was missing free money.", title: "Notice", body: "The dashboard surfaces what matters — missed match, no beneficiary, drifting allocation — each with a one-click fix that opens a plan, not a form." },
        { quote: "I could see every step before it happened.", title: "Plan", body: "Ask Harbor turns a request into a visible plan: checks plan rules and payroll, then lists the changes with their paycheck and retirement impact." },
        { quote: "Nothing happened until I said yes.", title: "Confirm", body: "Each money-moving step needs explicit confirmation; optional steps are opt-in; any step can be changed or handed to a person." },
      ],
    },
    {
      kind: "journey",
      eyebrow: "The agent loop",
      title: "From a sentence to a confirmed change",
      sub: "The pattern every agentic action follows.",
      start: { kicker: "Request", title: "“Move me to 10% and get the full match”", body: "Typed, spoken, or started from a dashboard nudge." },
      steps: [
        { title: "Gather", body: "Reads plan rules, payroll calendar and current elections — shown as checked steps." },
        { title: "Propose", body: "Lists each change with paycheck impact, match and projected income." },
        { title: "Confirm", body: "Participant confirms each step that touches money; optional ones are opt-in." },
      ],
      alt: { kicker: "Hand-off", title: "Talk to a person", body: "Advice or edge cases go to a licensed specialist with the context attached." },
      end: { kicker: "Done", title: "Executed & recorded", body: "Takes effect on the next payroll; confirmation and audit trail saved to Documents." },
    },
    {
      kind: "web",
      title: "Dashboard: what matters, first",
      body: "Balance and readiness up top, then what Harbor noticed — each insight phrased as money and time, with a fix that opens a plan instead of a form.",
      shots: [w("web-dashboard", "Dashboard with proactive insights")],
    },
    {
      kind: "web",
      title: "Ask Harbor: an agent that shows its work",
      body: "The plan of action is a checklist, not a chat bubble. Completed checks, pending confirmations and optional steps look different; impact and guardrails sit beside the plan.",
      shots: [w("web-agent", "Plan of action with confirmations")],
    },
    {
      kind: "web",
      title: "Enrollment in six steps",
      body: "Plain-language questions with the employer match on the slider itself, and an explanation of why the suggested rate was chosen — based only on the participant's age, salary and plan formula.",
      shots: [w("web-enroll", "Contribution step"), w("web-review", "Review and submit with disclosures")],
    },
    {
      kind: "web",
      title: "Readiness: income, not just balance",
      body: "Projected monthly income against a goal, with suggestions that each say how many points they add and what they cost per paycheck.",
      shots: [w("web-readiness", "Retirement readiness")],
    },
    {
      kind: "test",
      title: "The test script",
      intro: "Four tasks used for the simulated walkthrough and for the moderated test that should follow.",
      tasks: ["Make sure you're getting the full employer match", "Increase your contribution to 10% using Ask Harbor", "Explain, in your own words, the difference between Roth and pre-tax", "Undo or change something the assistant proposed"],
      measures: ["Task success", "Trust (1–5) before and after confirming", "Errors / unintended changes", "Time on task"],
    },
    {
      kind: "walkthrough",
      title: "Four participants, four tasks",
      intro: "Four characters walked through the tasks on the rebuilt screens. A structured expert review, not user research — a moderated test with real participants is the next step.",
      participants: [
        { name: "Maria", age: 26, city: "Austin", role: "New hire", comfort: "High", context: "First 401(k); unsure about Roth." },
        { name: "James", age: 41, city: "Columbus", role: "Mid-career saver", comfort: "Medium", context: "Just got a raise; two kids." },
        { name: "Linda", age: 59, city: "Phoenix", role: "Near-retiree", comfort: "Low", context: "Wants catch-up contributions; prefers phone support." },
        { name: "Dev", age: 34, city: "Seattle", role: "Engineer", comfort: "High", context: "Skeptical of AI touching his money." },
      ],
      tasks: ["Full match", "Raise to 10%", "Roth vs pre-tax", "Change a proposal"],
      results: [
        ["pass", "pass", "hard", "pass"],
        ["pass", "pass", "pass", "pass"],
        ["hard", "hard", "pass", "fail"],
        ["pass", "pass", "pass", "pass"],
      ],
      quotes: [
        { by: "Dev, engineer", text: "Seeing it check the plan rules first is what made me trust it." },
        { by: "Linda, near-retiree", text: "I liked the ‘talk to a person’ button. I wasn't sure how to change one step." },
        { by: "Maria, new hire", text: "The ‘why 8%?’ box was the first time this made sense." },
      ],
    },
    {
      kind: "feedback",
      title: "What the walkthrough showed",
      source: "simulated",
      liked: ["Visible plan with checked steps built trust", "Paycheck impact shown before confirming", "Human hand-off always one click away"],
      disliked: ["Editing a single step of a plan wasn't obvious", "Roth vs pre-tax still needs a simpler visual", "Less confident users wanted a phone call option inside the flow"],
    },
    {
      kind: "list",
      title: "What I learned",
      items: [
        { title: "Agents need a visible plan", body: "Showing gathered facts, proposed changes and pending confirmations as a checklist did more for trust than any wording." },
        { title: "Confirmation is a design surface", body: "Each confirm step shows impact in money and time, so a yes is an informed yes." },
        { title: "Regulation becomes UI", body: "Treating ERISA rules as design inputs — disclosures, defaults, advice boundaries — made the product safer and simpler." },
      ],
    },
    {
      kind: "list",
      title: "What I'd do next",
      items: [
        { title: "Per-step editing", body: "Let participants change one step of a plan inline, the walkthrough's biggest failure." },
        { title: "Voice and phone parity", body: "The same plan-and-confirm loop over a phone call for less digital participants." },
        { title: "Moderated test", body: "Eight participants across the three personas, the four tasks above, measuring trust before and after." },
      ],
    },
  ],
  sources: SOURCES,
};

export const harborApp: CaseStudy = {
  slug: "retirement-mobile-app",
  brand: { name: "Harbor", tint: "#dcf2ec", band: "#e6f5f1", accent: "#0b7a66" },
  hero: {
    kicker: "iOS & Android MVP · US retirement",
    title: "A retirement plan you can enroll in on the bus",
    sub: "The mobile companion to the participant portal: a guided enrollment wizard, AI recommendations in plain language and a dashboard built around readiness — taken from wireframes to production in six weeks.",
    shots: [m("walkthrough", "Welcome"), m("wizard-1", "When would you retire?"), m("dashboard", "Home"), m("choose-plan", "Choose your plan"), m("readiness", "Readiness")],
  },
  client: true,
  preview: {
    device: "phone",
    shots: [
      m("splash", "Splash"), m("login", "Login"), m("otp", "Verification code"), m("walkthrough", "Welcome"), m("wizard-1", "Retirement age"), m("wizard-2", "Where"),
      m("wizard-3", "Current savings"), m("wizard-4", "Risk comfort"), m("choose-plan", "Plan selection"), m("contribution", "Contribution"), m("source", "Tax source"),
      m("auto-increase", "Auto-increase"), m("investments", "Investments"), m("readiness", "Readiness"), m("review", "Review & submit"), m("post-enrollment", "Dashboard"), m("ai-chat", "Ask Harbor (concept)"),
    ],
  },
  meta: [
    { label: "My role", value: ["Product designer", "AI UX", "Prototype"] },
    { label: "Platform", value: ["iOS / Android"] },
    { label: "Timeline", value: ["6 weeks to MVP"] },
    { label: "Outcome", value: ["500+ beta users", "4.2/5 satisfaction"] },
  ],
  blocks: [
    {
      kind: "metrics",
      title: "What happened",
      intro: "Measured in the beta.",
      items: [
        { tone: "up", label: "Beta users", value: "500+" },
        { tone: "up", label: "Satisfaction (out of 5)", value: "4.2" },
        { tone: "down", label: "Weeks from wireframes to production", value: "6" },
        { tone: "down", label: "Steps in the enrollment wizard", value: "7" },
      ],
    },
    {
      kind: "text",
      eyebrow: "Background",
      body: [
        "Most participants never open the retirement website; they do open their phone. The recordkeeper wanted a mobile app that could take someone from “I've been auto-enrolled” to a confident, personal plan in one sitting — with the same plan rules and ERISA guardrails as the web portal [1].",
        "The constraint was time: six weeks from wireframes to production for an MVP that real participants would use in a beta.",
      ],
    },
    {
      kind: "numbered",
      title: "What new participants wonder",
      items: [
        { title: "What do I even pick?", body: "Plan type, contribution, tax source and investments — four decisions most people have never made." },
        { title: "How much will this cost me?", body: "The paycheck impact is what people feel; the projection is what they need." },
        { title: "Is this the right choice for me?", body: "A recommendation that explains itself in one sentence beats a long article." },
        { title: "Am I done?", body: "A clear finish line, then a home that shows progress." },
      ],
    },
    {
      kind: "personas",
      title: "Who it's for (simulated personas)",
      items: [
        { name: "Auto-enrolled new hire", role: "Defaulted at 3%", quote: "I got an email saying I'm enrolled. Is 3% enough?", needs: ["Short wizard", "Match explained", "One recommendation"] },
        { name: "Busy parent", role: "Checks finances on the phone", quote: "I'll do it now if it takes five minutes.", needs: ["Save & exit", "Progress per step", "Paycheck impact"] },
        { name: "Cautious saver", role: "Low risk appetite", quote: "I don't want to lose what I've got.", needs: ["Risk in plain words", "Default portfolio", "Talk to a specialist"] },
      ],
    },
    {
      kind: "statement",
      eyebrow: "The design question",
      line: "How might seven retirement decisions feel like one easy conversation?",
      sub: "Ask about the person first, recommend second, and show the money impact at every step.",
    },
    {
      kind: "steps",
      eyebrow: "The solution at a glance",
      title: "Tell, choose, track.",
      items: [
        { quote: "It asked about me before it asked about funds.", title: "Tell", body: "A four-question warm-up — retirement age, where, current savings, comfort with risk — that personalises everything after it." },
        { quote: "Every step said why.", title: "Choose", body: "A seven-step wizard: plan type, contribution, tax source, auto-increase, investments, readiness, review — each with an AI insight and save & exit." },
        { quote: "I can see I'm on track.", title: "Track", body: "A home with balance, vested amount, readiness score and recommended actions that each add points to the score." },
      ],
    },
    {
      kind: "band",
      title: "Get to know the person",
      caption: "Welcome, then four quick questions before any financial jargon",
      crumbs: ["Welcome", "Age", "Where", "Savings", "Risk"],
      items: [{ shot: m("walkthrough", "Welcome") }, { shot: m("wizard-1", "Retirement age") }, { shot: m("wizard-2", "Where") }, { shot: m("wizard-3", "Current savings") }, { shot: m("wizard-4", "Risk comfort") }],
    },
    {
      kind: "band",
      title: "Seven steps, one at a time",
      caption: "Each step shows progress, an AI insight and the money impact",
      crumbs: ["Plan", "Contribution", "Tax source", "Auto-increase"],
      items: [{ shot: m("choose-plan", "Plan selection", "AI insight on Traditional vs Roth") }, { shot: m("contribution", "Contribution", "Match-aware slider") }, { shot: m("source", "Tax source") }, { shot: m("auto-increase", "Auto-increase") }],
    },
    {
      kind: "band",
      title: "Finish with confidence",
      caption: "Investments, readiness and a review of every election",
      crumbs: ["Investments", "Readiness", "Review", "Home"],
      items: [{ shot: m("investments", "Investment strategy", "Plan default recommended") }, { shot: m("readiness", "Readiness score") }, { shot: m("review", "Review & submit") }, { shot: m("post-enrollment", "Dashboard after enrollment") }],
    },
    {
      kind: "band",
      title: "Concept: Ask Harbor in your pocket",
      sub: "Added for this portfolio — the web portal's agent loop on mobile.",
      caption: "Explains Roth vs pre-tax with the participant's numbers, proposes a change, waits for confirmation",
      items: [{ shot: m("dashboard", "Home") }, { node: "Ask Harbor" }, { shot: m("ai-chat", "Ask Harbor", "Confirm before any change") }],
    },
    {
      kind: "gallery",
      title: "Sign-in and security",
      sub: "Splash, login and one-time passcode.",
      shots: [m("splash", "Splash"), m("login", "Login"), m("otp", "Verification code")],
    },
    {
      kind: "list",
      title: "What I learned",
      items: [
        { title: "Ask about the person first", body: "Four human questions before any financial term made the rest of the wizard feel personal, not bureaucratic." },
        { title: "Explain recommendations in one line", body: "“Based on your age (36) and tax bracket…” did more than any help article." },
        { title: "Six weeks forces good defaults", body: "Reusing the web portal's rules and components let the MVP ship fast without inventing new patterns." },
      ],
    },
    {
      kind: "list",
      title: "What I'd do next",
      items: [
        { title: "Ship Ask Harbor on mobile", body: "Bring the plan-and-confirm agent loop from the web portal." },
        { title: "Biometric confirmation", body: "Use Face ID / fingerprint for confirming money-moving steps." },
        { title: "Learn from the beta", body: "Instrument drop-off per wizard step and test the slowest one first." },
      ],
    },
  ],
  sources: [SOURCES[0]],
};
