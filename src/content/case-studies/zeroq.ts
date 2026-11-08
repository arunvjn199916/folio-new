import type { CaseStudy, Shot } from "./types";

// Screens are from the client's design file, re-themed (brand colour and logo replaced) with restaurant names and addresses made up.
const R: Record<string, string> = { home: "375/1934", restaurants: "375/856" };
const s = (name: string, label: string, note?: string): Shot => ({ src: `cases/zeroq/${name}.webp`, label, note, ratio: R[name] ?? "375/812" });

export const zeroq: CaseStudy = {
  slug: "zeroq-food-ordering",
  brand: { name: "zeroQ", tint: "#fbe7dc", band: "#fcefe7", accent: "#b8461c" },
  hero: {
    kicker: "food ordering · delivery or self-pickup",
    title: "Skip the queue, not the meal",
    sub: "zeroQ lets people order from local restaurants for delivery — or pay ahead and walk in to pick it up with no wait at the counter. One flow, two modes, from craving to feedback.",
    shots: [s("restaurants", "Restaurants"), s("menu-added", "Menu"), s("home", "Home"), s("pickup-cart", "Pickup cart"), s("pickup-placed", "Order placed")],
  },
  client: true,
  meta: [
    { label: "My role", value: ["Product designer (solo)", "UX research", "UI & prototype"] },
    { label: "Platform", value: ["iOS / Android"] },
    { label: "Team & timeline", value: ["1 designer", "3–4 months"] },
    { label: "Scope", value: ["30+ screens", "Delivery + self-pickup"] },
  ],
  blocks: [
    {
      kind: "metrics",
      title: "What success looks like",
      intro: "Targets set for launch — goals, not measured results.",
      targets: true,
      items: [
        { tone: "down", label: "Wait at the counter for a pickup order", value: "<2 min" },
        { tone: "down", label: "Taps from home to a placed order", value: "≤6" },
        { tone: "up", label: "Orders that use self-pickup", value: "30%" },
        { tone: "up", label: "Orders that leave feedback", value: "25%" },
      ],
    },
    {
      kind: "text",
      eyebrow: "Background",
      body: [
        "In dense city neighbourhoods a lot of food orders are for places less than two kilometres away. Delivery adds a fee and a 30–40 minute wait; walking over means standing in a queue at the counter while the kitchen works through everyone else's order.",
        "The client wanted one app that does both: classic delivery, and a self-pickup mode where you order and pay ahead, get a ready time, and collect without queuing. My job was the end-to-end experience across both modes.",
      ],
    },
    {
      kind: "numbered",
      title: "Questions a hungry person asks",
      intro: "Every screen answers one of these. Existing apps answer them for delivery only.",
      items: [
        { title: "What can I get nearby, right now?", body: "Cuisine, distance, price for one, and how long it will really take." },
        { title: "Is it faster to just go and get it?", body: "Pickup vs delivery should be a toggle you can flip at any point — not a separate app." },
        { title: "When exactly will it be ready?", body: "A ready time you can trust, so you leave home at the right moment." },
        { title: "What if something goes wrong?", body: "Cancellations, refunds and feedback that don't need a phone call." },
      ],
    },
    {
      kind: "personas",
      title: "Who it's for (simulated personas)",
      items: [
        { name: "Office lunch runner", role: "Orders for 3–4 colleagues", quote: "I have 40 minutes for lunch. I can't spend 15 of them in a queue.", needs: ["Pickup with a ready time", "Group order in one cart", "Pay ahead"] },
        { name: "Family weekend order", role: "Delivery to home", quote: "Show me what everyone can eat, and don't surprise me with fees at the end.", needs: ["Clear delivery charge", "Saved addresses", "Track order"] },
        { name: "Student on a budget", role: "Price-first, walks everywhere", quote: "If it's 600 metres away, why pay for delivery?", needs: ["Price for one", "Distance", "Offers"] },
      ],
    },
    {
      kind: "numbered",
      title: "How the big apps compare (desk review)",
      intro: "A walkthrough of the leading food apps in India, focused on pickup.",
      items: [
        { title: "Delivery-first by design", body: "Takeaway exists in some apps but is buried in filters, and ready times are vague." },
        { title: "Queue isn't solved", body: "Even when you order ahead, nothing tells the kitchen when you'll arrive." },
        { title: "Fees appear late", body: "Platform and delivery charges often show up only at checkout." },
        { title: "Feedback is generic", body: "One rating for food and delivery together hides what actually went wrong." },
      ],
    },
    {
      kind: "statement",
      eyebrow: "The design question",
      line: "How might ordering ahead feel as easy as delivery — and beat the queue every time?",
      sub: "Make pickup a first-class mode: one toggle, an honest ready time, and the same checkout.",
    },
    {
      kind: "steps",
      eyebrow: "The solution at a glance",
      title: "Find, order, collect.",
      items: [
        { quote: "Delivery or pickup — I can switch any time.", title: "Find", body: "Location-aware home with a Delivery / Self-pickup toggle, top cuisines, top restaurants with price for one, time and distance, and voice search." },
        { quote: "I paid before I left the office.", title: "Order", body: "Menu with quick add, frequently-bought items in the cart, a 3-step checkout for delivery and 2-step for pickup, with every fee shown up front." },
        { quote: "Food was waiting when I walked in.", title: "Collect", body: "Order placed with tracking, cancellation and refund pop-ups, and separate feedback for the food and the delivery or pickup." },
      ],
    },
    {
      kind: "journey",
      eyebrow: "Two modes, one flow",
      title: "From craving to feedback",
      start: { kicker: "Start", title: "Open the app", body: "Location is set; the mode toggle remembers your last choice." },
      steps: [
        { title: "Pick a restaurant", body: "Sort by time, price or distance; filter “less than 30 min”." },
        { title: "Build the cart", body: "Quick add, frequently bought items, total always visible." },
        { title: "Checkout", body: "Pickup: pay → placed. Delivery: address → pay → placed." },
      ],
      alt: { kicker: "Shortcut", title: "Search", body: "Search a dish or restaurant directly, with voice." },
      end: { kicker: "After", title: "Feedback", body: "Rate the food and the pickup or delivery separately." },
    },
    {
      kind: "band",
      title: "Find",
      caption: "Set your location, choose a mode, browse or search",
      crumbs: ["Location", "Home", "Search", "Restaurants"],
      items: [{ shot: s("location", "Location") }, { shot: s("home", "Home", "Delivery / Self-pickup toggle") }, { shot: s("search", "Search") }, { shot: s("restaurants", "Restaurants", "Sort and quick filters") }],
    },
    {
      kind: "band",
      title: "Order and pay ahead",
      caption: "Pickup checkout is two steps; delivery adds an address",
      crumbs: ["Menu", "Cart", "Payment", "Placed"],
      items: [{ shot: s("menu-added", "Menu", "1 item added") }, { shot: s("pickup-cart", "Pickup cart") }, { shot: s("pickup-payment", "Payment") }, { shot: s("pickup-placed", "Order placed") }],
    },
    {
      kind: "band",
      title: "Delivery and after the order",
      caption: "Same patterns, one extra step — and feedback split by what went wrong",
      items: [{ shot: s("delivery-cart", "Delivery cart") }, { shot: s("address", "Delivery address") }, { shot: s("payment", "Payment") }, { shot: s("order-placed", "Order placed") }, { shot: s("feedback-delivery", "Feedback") }],
    },
    {
      kind: "text",
      eyebrow: "Concept · added for this portfolio",
      title: "Where AI earns its place",
      body: [
        "Three AI features designed in zeroQ's style, aimed at the two hardest moments: deciding what to eat, and knowing when to leave. They are concepts, not part of the delivered app.",
      ],
      bullets: [
        "Craving search turns a sentence into filter chips you can see and remove — no black box.",
        "Smart pickup slot uses the kitchen's live load to suggest when to collect.",
        "Review summaries say what people love and what to watch out for, with a link to every review.",
      ],
    },
    {
      kind: "band",
      title: "Concept: say what you want, skip the queue",
      caption: "Craving search · smart pickup slot · review summary",
      crumbs: ["Craving search", "Pickup slot", "Reviews"],
      items: [{ shot: s("ai-craving", "Craving search", "Sentence → editable chips") }, { shot: s("ai-slot", "Smart pickup slot", "Leave at the right time") }, { shot: s("ai-reviews", "Review summary", "Love / watch out for") }],
    },
    {
      kind: "test",
      title: "The test script",
      intro: "Four tasks used for the simulated walkthrough and for the moderated test that should follow.",
      tasks: ["Order lunch for pickup from the nearest biryani place", "Switch an order from delivery to pickup before paying", "Find out how much delivery costs before checkout", "Leave feedback that the food was good but late"],
      measures: ["Time on task", "Taps to complete", "Errors / wrong mode", "Confidence (1–5)"],
    },
    {
      kind: "walkthrough",
      title: "Four people, four tasks",
      intro: "Four characters walked through the tasks on the real screens. A structured expert review, not user research — a moderated test with real customers is the next step.",
      participants: [
        { name: "Karthik", age: 29, city: "Chennai", role: "Office lunch runner", comfort: "High", context: "Orders for his team three times a week." },
        { name: "Lakshmi", age: 41, city: "Chennai", role: "Family orders", comfort: "Medium", context: "Weekend delivery for four; watches fees." },
        { name: "Arjun", age: 20, city: "Coimbatore", role: "Student", comfort: "High", context: "Walks to most places; price-first." },
        { name: "Meenakshi", age: 58, city: "Madurai", role: "Occasional user", comfort: "Low", context: "Prefers calling the restaurant." },
      ],
      tasks: ["Pickup order", "Switch mode", "Find delivery fee", "Split feedback"],
      results: [
        ["pass", "pass", "pass", "pass"],
        ["pass", "hard", "pass", "pass"],
        ["pass", "pass", "pass", "hard"],
        ["hard", "fail", "hard", "pass"],
      ],
      quotes: [
        { by: "Karthik, lunch runner", text: "Pay ahead and walk in — that's the whole point. I'd use this daily." },
        { by: "Lakshmi, family orders", text: "I didn't realise switching to pickup would keep my cart." },
        { by: "Meenakshi, occasional user", text: "The toggle is small. I thought I was still on delivery." },
      ],
    },
    {
      kind: "feedback",
      title: "What the walkthrough showed",
      source: "simulated",
      liked: ["Pickup as a top-level toggle, not a filter", "All fees visible in the cart", "Feedback split between food and service"],
      disliked: ["The mode toggle is easy to miss for less confident users", "No ready time shown before paying for pickup", "Cart change when switching mode isn't confirmed"],
    },
    {
      kind: "list",
      title: "What I learned",
      items: [
        { title: "A mode is a promise", body: "Once pickup is a first-class mode, every screen has to say which mode you're in — colour, label and the checkout steps." },
        { title: "Time is the real price", body: "People compared ready time more than rupees; the time chip earned a place on every restaurant card." },
        { title: "Split feedback finds problems faster", body: "Separating food from delivery makes it obvious whether to fix the kitchen or the logistics." },
      ],
    },
    {
      kind: "list",
      title: "What I'd do next",
      items: [
        { title: "Show a ready time before payment", body: "The walkthrough's top gap — and the basis for the smart pickup slot concept." },
        { title: "A bigger, labelled mode switch", body: "Make the current mode impossible to miss, especially for less confident users." },
        { title: "Test with real customers", body: "Five people per persona, the four tasks above, timed against a leading delivery app." },
      ],
    },
  ],
  sources: [],
};
