import type { CaseStudy, Shot } from "./types";

const s = (name: string, label: string, note?: string): Shot => ({ src: `cases/secondly/${name}.webp`, label, note });

export const secondly: CaseStudy = {
  slug: "secondly-trusted-marketplace",
  brand: { name: "Secondly", tint: "#e3ebff", band: "#eef3ff", accent: "#2f6bff" },
  hero: {
    kicker: "buy used, trust fully",
    title: "Designing trust into a marketplace where strangers trade ₹38,000 phones",
    sub: "Verified listings, money held until the buyer inspects, safe meet-up spots and a trust score you can read, so a second-hand deal feels as safe as buying new.",
    shots: [s("home-feed", "Home feed"), s("listing-detail", "Listing detail"), s("protected-checkout", "Protected checkout"), s("inspection-checklist", "Inspection"), s("trust-score-explainer", "Trust score")],
  },
  meta: [
    { label: "My role", value: ["Product strategy", "UX & UI design", "Trust & safety flows"] },
    { label: "Platform", value: ["iOS / Android", "Seller web dashboard"] },
    { label: "Timeline", value: ["3 weeks", "Concept"] },
    { label: "Built with", value: ["UX Magic", "Claude", "Figma"] },
  ],
  blocks: [
    {
      kind: "metrics",
      title: "What success looks like",
      intro: "Business and trust targets for a city pilot. These are goals, not results.",
      targets: true,
      items: [
        { tone: "up", label: "Listings that complete verification", value: "70%" },
        { tone: "up", label: "Chats that turn into protected orders", value: "25%" },
        { tone: "down", label: "Orders that end in a dispute", value: "<3%" },
        { tone: "down", label: "Reported scam attempts reaching a payment", value: "~0" },
      ],
    },
    {
      kind: "text",
      eyebrow: "Background",
      body: [
        "India's second-hand market is large and growing, led by phones and electronics: high-value, easy to fake, and hard to check on a street corner.",
        "Today's classifieds connect strangers, then step away. Payment, inspection and recourse are left to the buyer and seller, and that's where people get burned.",
      ],
    },
    {
      kind: "insights",
      title: "A big market with a trust gap",
      intro: "Market estimates vary a lot by source and definition. The figures below come from a single paid report summary, cited at the end.",
      items: [
        { value: "$4.2B", label: "India C2C recommerce market in 2026", source: 1 },
        { value: "$9.5B", label: "projected by 2034 (10.7% CAGR)", source: 1 },
        { value: "~35%", label: "of C2C recommerce is electronics — the largest category", source: 1 },
        { value: "47%", label: "of revenue already flows through app-based platforms", source: 1 },
      ],
    },
    {
      kind: "numbered",
      title: "What was the problem?",
      items: [
        { title: "No way to verify", body: "Buyers can't check IMEI status, battery health or hidden faults before paying, so they rely on photos and the seller's word." },
        { title: "Money moves first", body: "Advance payments over UPI are the most common scam pattern, and once paid there's no recourse." },
        { title: "Trust is a black box", body: "Ratings and 'verified' badges rarely say what was actually checked." },
      ],
    },
    {
      kind: "personas",
      title: "Who it's for",
      items: [
        {
          name: "Neha Kapoor",
          role: "Buyer · Delhi · upgrading on a budget",
          quote: "I'd buy used if I knew it wasn't stolen or broken.",
          needs: ["Proof of the phone's condition before meeting", "Not paying until she has it in hand", "A safe, public place to meet"],
        },
        {
          name: "Vikram Shah",
          role: "Seller · Saket · sells his old phone every two years",
          quote: "Half my chats are lowballers or scammers.",
          needs: ["Serious, verified buyers", "Getting paid the moment the buyer is happy", "A fair price suggestion"],
        },
      ],
    },
    {
      kind: "statement",
      eyebrow: "The design question",
      line: "How do two strangers trust each other enough to hand over money?",
      sub: "Trust had to be built from evidence the app can check, not from promises either person makes.",
    },
    {
      kind: "steps",
      eyebrow: "The solution at a glance",
      title: "Verify the item. Protect the money. Meet safely.",
      items: [
        { quote: "9/9 checks passed.", title: "Verified listings", body: "An IMEI check plus a guided two-minute self-diagnostic fill the listing with facts." },
        { quote: "My money's on hold.", title: "Protected payment", body: "The buyer pays into escrow, and the seller is paid only after inspection." },
        { quote: "Saket Metro, 6:30.", title: "Safe meet-ups", body: "Suggested public spots, a checklist at handover, and a dispute path if something's wrong." },
      ],
    },
    {
      kind: "journey",
      eyebrow: "How it fits",
      title: "Every rupee waits for the buyer's 'yes'.",
      start: { kicker: "Seller", title: "List with diagnostics", body: "IMEI + 9 device checks, suggested price." },
      steps: [
        { title: "Offer + chat", body: "Scam patterns flagged in the conversation." },
        { title: "Protected checkout", body: "UPI payment held in escrow." },
        { title: "Meet + inspect", body: "Checklist in hand, at a safe spot." },
      ],
      alt: { kicker: "If something's wrong", title: "Raise a dispute", body: "Money stays on hold, with evidence and an outcome to choose." },
      end: { kicker: "Buyer says yes", title: "Release + rate", body: "Seller paid instantly, and trust scores update." },
    },
    {
      kind: "text",
      eyebrow: "Product strategy",
      title: "Why escrow is also the business model",
      body: [
        "Classifieds earn from ads and listing boosts, which reward volume, not good trades. Secondly instead takes a small fee on protected orders (about 2–3% from the seller), so revenue only comes from trades that complete safely.",
        "That aligns everything: verification raises conversion, escrow kills the advance-payment scam, and fewer disputes lower support cost. The north-star metric is completed protected orders per week, and verification rate, chat-to-order rate and dispute rate sit under it.",
      ],
      bullets: ["Revenue: fee on protected orders, plus optional paid pickup and doorstep inspection", "Cost: payment processing, dispute handling and IMEI lookups", "Moat: trust history that's only earned through completed trades"],
    },
    {
      kind: "explore",
      title: "Exploring the trust panel",
      body: [
        "The trust panel on a listing does the heavy lifting, so I explored six ways to show 'why you can trust this' and judged each on whether a buyer could tell what was actually checked.",
        "The checklist won, folded into a compact 'Verified listing' card with three facts up front. The score dial was striking but said nothing on its own, so it moved into the explainer sheet.",
      ],
      variants: [s("badge-row", "Badge row"), s("checklist", "Checklist"), s("score-dial", "Score dial"), s("report-card", "Report card"), s("timeline-history", "Timeline history"), s("compare-to-new", "Compare to new")],
      credit: "Generated in UX Magic · judged on 'what was actually checked?'",
    },
    {
      kind: "band",
      title: "Finding a phone you can trust",
      sub: "(buyer, before paying)",
      crumbs: ["Home", "Listing", "Trust score", "Chat"],
      caption: "Evidence first, then the conversation",
      items: [
        { shot: s("home-feed", "Home feed", "Verified badges and distance on every card") },
        { shot: s("listing-detail", "Listing detail", "IMEI clean, diagnostic 9/9, seller score") },
        { shot: s("trust-score-explainer", "Trust score", "What the 4.8 is made of") },
        { node: "Scam check", sub: "off-platform payment" },
        { shot: s("chat-with-seller", "Chat", "'Pay advance on GPay' is flagged") },
      ],
    },
    {
      kind: "band",
      title: "Paying without the risk",
      sub: "(offer → escrow → meet-up)",
      crumbs: ["Offer", "Checkout", "Meet-up", "Inspect", "Release"],
      caption: "The seller is paid only after the buyer says yes",
      items: [
        { shot: s("make-offer", "Make offer", "A fair starting point, protected by escrow") },
        { shot: s("protected-checkout", "Protected checkout", "Pay via UPI into escrow") },
        { shot: s("meet-up", "Meet-up", "Suggested public, well-lit spots") },
        { shot: s("inspection-checklist", "Inspection", "Tick each check, then release") },
        { shot: s("payment-released-and-rating", "Released", "Both sides rate the trade") },
      ],
    },
    {
      kind: "band",
      title: "Selling with proof",
      sub: "(seller)",
      crumbs: ["Diagnostic", "Listing preview"],
      caption: "Two minutes of checks replace twenty questions in chat",
      items: [
        { shot: s("sell-diagnostic", "Device diagnostic", "Guided tests: screen, battery, cameras, speakers") },
        { node: "9/9 passed", sub: "auto-filled" },
        { shot: s("listing-preview", "Listing preview", "Results and a price range from recent sales") },
      ],
    },
    {
      kind: "test",
      title: "The test script",
      intro: "The same four tasks drive the simulated walkthrough below and the moderated test that comes next.",
      tasks: ["Decide whether this iPhone listing is safe to buy, and say why", "Respond to the seller's ‘pay advance on GPay’ message", "Pay for the phone and explain where your money is", "At the meet-up Face ID doesn't work — what do you do?"],
      measures: ["Correctly explaining protected payment", "Spotting the scam warning", "Trust in the listing (1–7)", "Dispute flow completion"],
    },
    {
      kind: "walkthrough",
      title: "Five characters, four tasks",
      intro: "I wrote five characters who differ in age, city, confidence with technology and history with the problem, then walked each one through the script on the actual prototype screens, noting where their goals and habits would trip them up. It's a structured expert review, not user research: it finds friction quickly, but a moderated test with five real people is still the next step.",
      participants: [
        { name: "Ananya Ghosh", age: 28, city: "Kolkata", role: "Content writer", comfort: "Medium", context: "Lost ₹6,000 to an advance-payment scam on a classifieds app." },
        { name: "Mohammed Irfan", age: 35, city: "Bengaluru", role: "IT support lead", comfort: "High", context: "Sells his old devices every two years." },
        { name: "Pooja Verma", age: 22, city: "Jaipur", role: "College student", comfort: "High", context: "Buying her first phone with her own savings." },
        { name: "Ramesh Gowda", age: 47, city: "Mysuru", role: "Auto-parts dealer", comfort: "Low", context: "Prefers cash and meeting face to face." },
        { name: "Divya Menon", age: 36, city: "Delhi", role: "Doctor", comfort: "Medium", context: "No time to haggle; wants a guarantee." },
      ],
      tasks: ["Judge the listing", "Handle the GPay request", "Pay and say where the money is", "Face ID fails at the meet-up"],
      results: [
        ["pass", "pass", "pass", "hard"],
        ["pass", "pass", "pass", "pass"],
        ["pass", "pass", "hard", "hard"],
        ["hard", "pass", "hard", "fail"],
        ["pass", "pass", "pass", "hard"],
      ],
      quotes: [
        { by: "Ananya, content writer", text: "This warning is exactly what I needed two years ago." },
        { by: "Ramesh, auto-parts dealer", text: "What is escrow? Just tell me Secondly keeps the money." },
        { by: "Divya, doctor", text: "Face ID isn't on the list, so where do I complain?" },
      ],
    },
    {
      kind: "feedback",
      title: "What the walkthrough showed",
      source: "simulated",
      liked: ["The scam warning in chat stopped all five, and ‘Make protected offer’ gave them the safe next step", "The trust panel's three facts (IMEI clean, diagnostic 9/9, 4.8) were enough for four of five to call the listing safe", "The trust score explainer adds up visibly (1.0 + 2.0 + 1.8), so nobody read it as a black box"],
      disliked: ["‘Escrow’ is jargon: two of five couldn't say where their ₹37,000 was", "The handover checklist has no Face ID / biometrics item, which is exactly what failed in the task", "‘Report a problem’ is a small red link under a large ‘Release payment’ button. Ramesh never found it", "‘IMEI clean’ means nothing to people who've never had a phone stolen"],
    },
    {
      kind: "numbered",
      title: "Improvements after the walkthrough",
      intro: "Each change maps to a moment where a character got stuck.",
      items: [
        { title: "Plain-language protection", body: "‘Secondly holds your ₹37,000 until you say the phone is fine’ replaces ‘escrow’ everywhere." },
        { title: "Model-aware checklist", body: "Checks come from the device model, so an iPhone 13 includes Face ID, True Tone and the SIM tray." },
        { title: "Two equal choices", body: "‘Something's wrong’ and ‘Release payment’ sit side by side, and release unlocks only when every check is ticked." },
        { title: "Explain the badges", body: "Tap any trust fact to learn what it means, e.g. ‘IMEI clean: not reported lost or stolen’." },
      ],
    },
    {
      kind: "edges",
      title: "Solving for edge cases",
      intro: "A trust product is judged by what happens when a trade goes wrong.",
      cases: [
        {
          title: "The phone isn't as described",
          conclusion: "Payment stays on hold. The buyer picks the issue, adds evidence and chooses an outcome: partial refund, return or cancel.",
          shot: s("raise-a-dispute", "Raise a dispute"),
          notes: [
            { title: "Constraint #1", body: "Disputes must be raised at handover, before release, or the seller's payout becomes uncertain forever." },
            { title: "Constraint #2", body: "Evidence is limited to photos and a short video to keep reviews fast and fair." },
          ],
        },
        {
          title: "The buyer doesn't show up",
          conclusion: "The seller can reschedule or cancel with no penalty, and the no-show counts on the buyer's record, not the seller's.",
          shot: s("buyer-no-show", "Buyer no-show"),
        },
        {
          title: "The IMEI is blacklisted",
          conclusion: "The listing is blocked with a calm explanation and steps to resolve it, never an accusation.",
          shot: s("blacklisted-imei", "IMEI check failed"),
        },
      ],
    },
    {
      kind: "web",
      title: "For people who sell often",
      body: "Repeat sellers manage listings, offers, held and released payments and upcoming meet-ups from one dashboard, and see exactly what their trust score is made of.",
      shots: [s("secondly-seller-dashboard", "Secondly seller dashboard — web")],
    },
    {
      kind: "gallery",
      title: "The whole trade, together.",
      sub: "Ten core screens from listing to payout.",
      shots: [
        s("home-feed", "Home"),
        s("listing-detail", "Listing"),
        s("trust-score-explainer", "Trust"),
        s("chat-with-seller", "Chat"),
        s("make-offer", "Offer"),
        s("protected-checkout", "Checkout"),
        s("meet-up", "Meet-up"),
        s("inspection-checklist", "Inspect"),
        s("payment-released-and-rating", "Release"),
        s("sell-diagnostic", "Diagnostic"),
      ],
    },
    {
      kind: "list",
      title: "What could be better?",
      items: [
        { title: "Doorstep inspection", body: "A paid partner inspection would serve people who won't meet strangers at all." },
        { title: "Beyond phones", body: "Laptops and cameras need their own diagnostics, and the checklist model has to stretch per category." },
      ],
    },
    {
      kind: "list",
      title: "Learnings & reflections",
      items: [
        { title: "Trust is evidence, not a badge", body: "Every 'verified' label had to answer 'verified what?', and that question shaped the whole listing page." },
        { title: "Strategy and UX are the same decision", body: "Choosing escrow as the revenue model made the safest flow the most profitable one." },
        { title: "Design the bad day", body: "Disputes, no-shows and blacklisted devices got as much care as checkout, because that's when people decide whether to come back." },
      ],
    },
  ],
  sources: [
    { label: "The Report Cubes — C2C Recommerce Market India (paid report summary)", url: "https://www.thereportcubes.com/public/report-store/c2c-recommerce-market-india" },
    { label: "Statista — ReCommerce India market outlook", url: "https://www.statista.com/outlook/emo/recommerce/india/" },
  ],
};
