import type { CaseStudy, Shot } from "./types";

const s = (name: string, label: string, note?: string): Shot => ({ src: `cases/kosh/${name}.webp`, label, note });

export const kosh: CaseStudy = {
  slug: "kosh-personal-finance",
  brand: { name: "Kosh", tint: "#e9f3d6", band: "#f1f5e6", accent: "#2f6b2a" },
  hero: {
    kicker: "personal finance for the UPI generation",
    title: "Turning a hundred invisible UPI payments into one number you can trust",
    sub: "Kosh answers a single daily question — how much can I safely spend today? — using consent-based bank data, envelopes and charts that make a month readable at a glance.",
    shots: [s("account-aggregator-consent", "Consent"), s("home", "Home"), s("month-view", "Month view"), s("envelopes", "Envelopes"), s("month-review", "Month review")],
  },
  meta: [
    { label: "My role", value: ["Research", "UX & UI design", "Data visualisation"] },
    { label: "Platform", value: ["iOS / Android"] },
    { label: "Timeline", value: ["3 weeks", "Concept"] },
    { label: "Built with", value: ["UX Magic", "Claude", "Figma"] },
  ],
  blocks: [
    {
      kind: "metrics",
      title: "What success looks like",
      intro: "The behaviour Kosh is designed to change, as targets for a first cohort.",
      targets: true,
      items: [
        { tone: "up", label: "Users who open the app 4+ days a week", value: "40%" },
        { tone: "up", label: "UPI spends auto-categorised correctly", value: "90%" },
        { tone: "down", label: "Envelopes overspent at month end", value: "−30%" },
        { tone: "down", label: "Time to answer 'can I afford this?'", value: "<5s" },
      ],
    },
    {
      kind: "text",
      eyebrow: "Background",
      body: [
        "UPI made paying effortless. Twenty-rupee chais, cabs, groceries and subscriptions now leave an account dozens of times a week, each one too small to notice and together too big to ignore.",
        "India's finance-app installs are growing in payments and credit, not in understanding money. People have more ways to spend than ever and no better sense of where it goes.",
      ],
    },
    {
      kind: "insights",
      title: "Easy to pay, hard to see",
      intro: "Desk research. A few sources are small or non-representative, and they're flagged as such in the list at the end.",
      items: [
        { value: "20B+", label: "UPI transactions a month since August 2025", source: 1 },
        { value: "102M", label: "downloads for PhonePe in a year — the top finance apps are payment and lending apps, not money-understanding apps", source: 2 },
        { value: "Most", label: "participants in a 34-person UPI usability study wanted to see their balance before and after paying", source: 3 },
        { value: "75%", label: "of respondents in an informal survey said UPI increased their spending (non-representative)", source: 4 },
      ],
    },
    {
      kind: "numbered",
      title: "What was the problem?",
      items: [
        { title: "Spending is invisible", body: "UPI shows one payment at a time. No one adds up 60 small payments in their head, so the month only becomes real when the balance is low." },
        { title: "Budget apps ask for homework", body: "Most trackers need manual entry or SMS reading that breaks often. People log for a week, fall behind and quit." },
      ],
    },
    {
      kind: "personas",
      title: "Who it's for",
      items: [
        {
          name: "Rahul Menon",
          role: "Software engineer, Pune · ₹85k/month, pays almost everything by UPI",
          quote: "I earn well. I just never know where it went.",
          needs: ["A single number to check before spending", "No manual logging", "Proof that his data stays read-only"],
        },
        {
          name: "Sneha Iyer",
          role: "First job, Chennai · shares rent and dinners with friends",
          quote: "Splitting dinner ruins my budget maths.",
          needs: ["Count only her share of split bills", "Gentle warnings, not guilt", "See the month as a picture, not a statement"],
        },
      ],
    },
    {
      kind: "statement",
      eyebrow: "The design question",
      line: "What if you knew how much you could safely spend today?",
      sub: "Budgets fail because they're monthly and abstract. A daily number is something you can act on before you tap Pay.",
    },
    {
      kind: "steps",
      eyebrow: "The solution at a glance",
      title: "Connect once. Check one number. See the month.",
      items: [
        { quote: "Read-only, I can revoke.", title: "Consent, not passwords", body: "Banks connect through RBI's Account Aggregator framework. Kosh can read, never move money." },
        { quote: "Can I get the cab?", title: "Safe to spend today", body: "Income minus bills and goals, spread over the days left. It updates after every UPI payment." },
        { quote: "Oh — that's where it went.", title: "A month you can see", body: "A calendar heatmap, envelopes and a category ring replace the statement." },
      ],
    },
    {
      kind: "journey",
      eyebrow: "How it fits",
      title: "From a payment to a better decision.",
      start: { kicker: "Every day", title: "A UPI payment", body: "Made in any app, from any linked bank." },
      steps: [
        { title: "Fetched with consent", body: "The Account Aggregator shares the transaction, read-only." },
        { title: "Auto-sorted", body: "Kosh categorises the payee, or asks once and remembers." },
        { title: "Number updates", body: "Safe-to-spend and the envelope adjust in real time." },
      ],
      alt: { kicker: "When it matters", title: "A gentle nudge", body: "At 85% of an envelope, Kosh suggests three small fixes, never a lecture." },
      end: { kicker: "Month end", title: "The review", body: "What you saved, what changed, one insight." },
    },
    {
      kind: "numbered",
      title: "What were the foreseen challenges?",
      items: [
        { body: "Earning trust for bank access in a market where 'finance app' often means lending spam." },
        { body: "Making 'safe to spend' honest: it has to account for bills that haven't happened yet." },
        { body: "Showing a month of data on a phone without it turning into a spreadsheet." },
      ],
    },
    {
      kind: "explore",
      title: "Exploring the home screen",
      body: [
        "The home screen decides whether Kosh is a habit or a chore, so I explored six directions before committing, testing each against a single question: can you answer 'can I afford this?' in under five seconds?",
        "The ring gauge won. The number is big, progress through the month is visible in the ring, and it holds up at a glance. I folded the weekly bar into the month view instead.",
      ],
      variants: [
        s("home-wireframe-big-number", "Big number"),
        s("home-wireframe-ring-gauge", "Ring gauge"),
        s("home-wireframe-weekly-bar", "Weekly bar"),
        s("home-wireframe-envelope-grid", "Envelope grid"),
        s("home-wireframe-timeline-feed", "Timeline feed"),
        s("home-wireframe-calendar-first", "Calendar first"),
      ],
      credit: "Generated in UX Magic · judged on the five-second test",
    },
    {
      kind: "band",
      title: "Connecting a bank",
      sub: "(first run)",
      crumbs: ["Welcome", "Consent", "Linked"],
      caption: "Asking for consent the way a bank would, not the way an app would",
      items: [
        { shot: s("welcome", "Welcome", "One promise: know what you can spend today") },
        { shot: s("account-aggregator-consent", "Consent", "What's shared, for how long, revoke anytime") },
        { node: "Account Aggregator", sub: "RBI-regulated · read-only" },
        { shot: s("bank-linking-success", "Linked", "Both banks, balances, and a reassurance line") },
      ],
    },
    {
      kind: "band",
      title: "Every day with Kosh",
      sub: "(the core loop)",
      crumbs: ["Home", "Spend detail", "Envelopes", "Nudge"],
      caption: "One number, then the detail only when you want it",
      items: [
        { shot: s("home", "Home", "Safe to spend today, upcoming bills, recent UPI") },
        { shot: s("spend-detail", "Spend detail", "Editable category, similar spends this month") },
        { shot: s("envelopes", "Envelopes", "Monthly limits with what's left, not what's spent") },
        { node: "85% used", sub: "9 days left" },
        { shot: s("overspend-nudge", "Nudge", "Three small fixes, never a lecture") },
      ],
    },
    {
      kind: "band",
      title: "Seeing the month",
      sub: "(data visualisation)",
      crumbs: ["Month view", "Create envelope", "Month review"],
      caption: "The statement, redrawn as pictures people can read",
      items: [
        { shot: s("month-view", "Month view", "Calendar heatmap + where it went") },
        { shot: s("create-envelope", "Create envelope", "Limit slider and the categories that feed it") },
        { shot: s("month-review", "Month review", "Saved, top categories and one useful insight") },
      ],
    },
    {
      kind: "test",
      title: "The test script",
      intro: "The same four tasks drive the simulated walkthrough below and the moderated test that comes next.",
      tasks: ["Connect a bank and explain in your own words what Kosh can see", "Decide whether you can afford a ₹1,200 dinner tonight", "Find the week you spent the most, and on what", "Fix a payment that's in the wrong category"],
      measures: ["Time to answer the ‘afford it?’ question", "Can they explain the consent correctly?", "Trust in the safe-to-spend number (1–7)", "Errors reading the heatmap"],
    },
    {
      kind: "walkthrough",
      title: "Five characters, four tasks",
      intro: "I wrote five characters who differ in age, city, confidence with technology and history with the problem, then walked each one through the script on the actual prototype screens, noting where their goals and habits would trip them up. It's a structured expert review, not user research: it finds friction quickly, but a moderated test with five real people is still the next step.",
      participants: [
        { name: "Aditya Kulkarni", age: 26, city: "Pune", role: "Data analyst", comfort: "High", context: "Tracked spending in a Google Sheet until he gave up in March." },
        { name: "Fatima Sheikh", age: 31, city: "Mumbai", role: "Staff nurse", comfort: "Medium", context: "Shift work; pays nearly everything by UPI; rarely opens her bank app." },
        { name: "Harpreet Singh", age: 23, city: "Chandigarh", role: "Final-year student", comfort: "High", context: "Lives on a ₹12k monthly allowance and splits most bills." },
        { name: "Kavya Reddy", age: 38, city: "Hyderabad", role: "School teacher", comfort: "Low", context: "Distrusts apps asking for bank access after a fraud call last year." },
        { name: "Joseph Mathew", age: 45, city: "Kochi", role: "Shop owner", comfort: "Medium", context: "Personal and shop UPI payments go through one account." },
      ],
      tasks: ["Connect and explain consent", "Afford a ₹1,200 dinner?", "Find the most expensive week", "Fix a wrong category"],
      results: [
        ["pass", "pass", "hard", "pass"],
        ["pass", "hard", "fail", "pass"],
        ["pass", "pass", "hard", "pass"],
        ["hard", "pass", "fail", "hard"],
        ["hard", "hard", "fail", "pass"],
      ],
      quotes: [
        { by: "Kavya, school teacher", text: "It says read-only, but can it take money out? I want that exact sentence." },
        { by: "Joseph, shop owner", text: "68% of what? And is ₹1,240 just for today or for the week?" },
        { by: "Fatima, staff nurse", text: "The dark circles look nice, but which week was bad? I'd have to count." },
      ],
    },
    {
      kind: "feedback",
      title: "What the walkthrough showed",
      source: "simulated",
      liked: ["One number answered the ‘can I afford it?’ question for all five, in seconds", "Editing a category and ‘Remember for this payee’ felt effortless, and four of five fixed it first time", "The overspend nudge's three concrete options read as help, not a telling-off"],
      disliked: ["The heatmap has no week totals and no visible tap target, so three of five couldn't name their most expensive week", "‘68% on track’ inside the ring has no unit: of the month, of the budget, or of the day?", "Consent says read-only but never says ‘Kosh can't move money’, and the banks aren't listed before linking", "Nothing explains how today's number is calculated, so the two lower-confidence characters hesitated to trust it"],
    },
    {
      kind: "numbered",
      title: "Improvements after the walkthrough",
      intro: "Each change maps to a moment where a character got stuck.",
      items: [
        { title: "Weeks you can read", body: "A totals column beside the heatmap, the highest week highlighted, and tap-a-day for detail." },
        { title: "Label the ring", body: "‘68% of October's plan used’, never a bare percentage." },
        { title: "Say the scary part", body: "‘Kosh can never move your money’ in the consent header, plus the bank list before you link." },
        { title: "Explain the number", body: "A ‘How is ₹1,240 calculated?’ sheet: income − bills − goals ÷ days left." },
      ],
    },
    {
      kind: "edges",
      title: "Solving for edge cases",
      intro: "Money apps lose trust on the messy cases: unknown payees, refunds, split bills and failed bank links.",
      cases: [
        {
          title: "A payment Kosh can't categorise",
          conclusion: "Ask once, with smart suggestions based on similar payees, and offer 'remember for this payee' so it never asks again.",
          shot: s("uncategorised-payment", "Uncategorised payment"),
          notes: [
            { title: "Constraint #1", body: "UPI payee names are often phone numbers or merchant IDs, so the category can't always be inferred." },
            { title: "Constraint #2", body: "Asking too often feels like homework, so questions are batched and capped per day." },
          ],
        },
        {
          title: "A refund arrives",
          conclusion: "Match it to the original purchase and restore the envelope, so the refund isn't counted as income.",
          shot: s("refund-received", "Refund received"),
        },
        {
          title: "You paid for the whole table",
          conclusion: "Only your share counts toward your envelope, and the rest is tracked as owed to you.",
          shot: s("shared-payment", "Shared payment"),
        },
        {
          title: "A bank link fails",
          conclusion: "Say plainly what happened (consent timed out, no data shared), keep working banks connected, and offer try again or later.",
          shot: s("bank-link-failed", "Bank link failed"),
        },
      ],
    },
    {
      kind: "gallery",
      title: "The whole system, together.",
      sub: "Ten core screens, designed as one system.",
      shots: [
        s("welcome", "Welcome"),
        s("account-aggregator-consent", "Consent"),
        s("bank-linking-success", "Linked"),
        s("home", "Home"),
        s("spend-detail", "Spend"),
        s("month-view", "Month"),
        s("envelopes", "Envelopes"),
        s("create-envelope", "New envelope"),
        s("overspend-nudge", "Nudge"),
        s("month-review", "Review"),
      ],
    },
    {
      kind: "list",
      title: "What could be better?",
      items: [
        { title: "Irregular income", body: "Freelancers and gig workers break a monthly model. Safe-to-spend needs a rolling 30-day mode." },
        { title: "Explain the number", body: "A tap-to-explain breakdown of today's number is likely the single biggest trust lever, and it's next to design." },
      ],
    },
    {
      kind: "list",
      title: "Learnings & reflections",
      items: [
        { title: "One number beats ten charts", body: "Reducing the product to a single daily answer made every other screen easier to justify." },
        { title: "Consent is UI", body: "The consent screen is where trust is won or lost. It got more iterations than the dashboard." },
        { title: "Design the messy cases early", body: "Refunds and split bills are where real money apps break, and designing them first kept the model honest." },
      ],
    },
  ],
  sources: [
    { label: "NPCI — UPI product statistics (monthly volumes)", url: "https://www.npci.org.in/what-we-do/upi/product-statistics" },
    { label: "AppTweak — Most downloaded finance apps in India (May 2025 – Apr 2026)", url: "https://www.apptweak.com/en/reports/the-most-downloaded-finance-apps-in-india" },
    { label: "arXiv — From Cash to Cashless: UPI's impact on spending behaviour (n=34 usability study)", url: "https://arxiv.org/html/2401.09937v3" },
    { label: "Substack — Does India know where its money goes? (informal, non-representative survey)", url: "https://tanvibagadiya.substack.com/p/does-india-know-where-its-money-goes" },
  ],
};
