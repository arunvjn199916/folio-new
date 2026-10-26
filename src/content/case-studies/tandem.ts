import type { CaseStudy, Shot } from "./types";

const s = (name: string, label: string, note?: string): Shot => ({ src: `cases/tandem/${name}.webp`, label, note });

export const tandem: CaseStudy = {
  slug: "tandem-group-trip-planner",
  brand: { name: "Tandem", tint: "#ffeadb", band: "#fff3e8", accent: "#d94a2b" },
  hero: {
    kicker: "plan the trip together",
    title: "Spreading the work of a group trip across the whole group",
    sub: "A private budget handshake, voting on ideas, a day planner where everything has an owner, and UPI settle-up, so the organiser stops being the group's unpaid travel agent.",
    shots: [s("trips-home", "Trips home"), s("budget-handshake", "Budget handshake"), s("budget-result", "Budget result"), s("ideas-board", "Ideas board"), s("settle-up", "Settle up")],
  },
  meta: [
    { label: "My role", value: ["Research", "End-to-end UX & UI", "Collaboration design"] },
    { label: "Platform", value: ["iOS / Android", "Web planner"] },
    { label: "Timeline", value: ["3 weeks", "Concept"] },
    { label: "Built with", value: ["UX Magic", "Claude", "Figma"] },
  ],
  blocks: [
    {
      kind: "metrics",
      title: "What success looks like",
      intro: "Targets for a first season of trips. They describe the outcome, not measured results.",
      targets: true,
      items: [
        { tone: "up", label: "Members (not organisers) who add or own a plan item", value: "60%" },
        { tone: "up", label: "Trips that agree a budget before booking", value: "80%" },
        { tone: "down", label: "Organiser's share of planning actions", value: "<40%" },
        { tone: "down", label: "Trips with unsettled money a week later", value: "<10%" },
      ],
    },
    {
      kind: "text",
      eyebrow: "Background",
      body: [
        "Most trips are group trips. But group trips are planned the way they were ten years ago: a WhatsApp group, a spreadsheet, a few polls that nobody answers, and one tired person holding it all together.",
        "That person usually also fronts the money, chases everyone afterwards, and quietly decides not to organise the next one.",
      ],
    },
    {
      kind: "insights",
      title: "One person carries the trip",
      intro: "Desk research from recent surveys. Regional or vendor sources are marked in the list at the end.",
      items: [
        { value: "74%", label: "of group trips are planned by just one or two people", source: 1 },
        { value: "82.5%", label: "of organisers say they felt a psychological burden", source: 1 },
        { value: "46%", label: "say organising a group trip is more stressful than moving house (regional survey)", source: 2 },
        { value: "35%", label: "name agreeing on a budget as a key obstacle", source: 2 },
      ],
    },
    {
      kind: "numbered",
      title: "What was the problem?",
      items: [
        { title: "Money is the silent blocker", body: "Nobody wants to say 'that's too expensive' in a group chat, so plans stall or someone quietly overspends." },
        { title: "Decisions die in the chat", body: "Polls get buried, opinions arrive late, and the organiser ends up deciding everything and being blamed for it." },
        { title: "Work isn't shared", body: "Bookings, cabs and tickets have no owner, so they default to the organiser." },
      ],
    },
    {
      kind: "personas",
      title: "Who it's for",
      items: [
        {
          name: "Ananya Rao",
          role: "Always the organiser · Chennai · plans 3 trips a year",
          quote: "I love the trip. I hate being everyone's travel agent.",
          needs: ["Decisions that don't depend on her", "Clear owners for bookings", "Not fronting everyone's money"],
        },
        {
          name: "Karthik Subramanian",
          role: "Happy to help, never sure how · Bengaluru",
          quote: "Just tell me what to book and I'll do it.",
          needs: ["One clear task, not the whole plan", "A way to say the budget is too high, privately", "Settling up without awkward reminders"],
        },
      ],
    },
    {
      kind: "statement",
      eyebrow: "The design question",
      line: "How might the whole group plan the trip, not just the organiser?",
      sub: "The answer had to start with the most awkward conversation: money.",
    },
    {
      kind: "steps",
      eyebrow: "The solution at a glance",
      title: "Agree, decide, share the load.",
      items: [
        { quote: "Only the overlap is shown.", title: "Budget handshake", body: "Everyone privately sets a comfortable range. The group only sees where the ranges overlap." },
        { quote: "Let's vote on it.", title: "Ideas, then votes", body: "Anyone adds stays, food and activities. Emoji votes decide, and ties have a rule." },
        { quote: "That one's mine.", title: "Every item has an owner", body: "The day planner assigns each booking to a person, and expenses settle over UPI." },
      ],
    },
    {
      kind: "journey",
      eyebrow: "How it fits",
      title: "From 'let's go to Goa' to everyone paid back.",
      start: { kicker: "Start here", title: "Create + invite", body: "A WhatsApp link brings the group in." },
      steps: [
        { title: "Budget handshake", body: "Private ranges → one shared comfort zone." },
        { title: "Ideas + votes", body: "Options filtered by the agreed budget." },
        { title: "Day planner", body: "Winners become plan items with owners." },
      ],
      alt: { kicker: "During the trip", title: "Today view", body: "What's next, where, and who's handling it, even offline." },
      end: { kicker: "After", title: "Settle up", body: "Fewest payments, paid via UPI." },
    },
    {
      kind: "numbered",
      title: "What were the foreseen challenges?",
      items: [
        { body: "Making a private budget feel truly private, or people won't be honest." },
        { body: "Voting that ends: deadlines and tie rules without making the organiser the bad guy." },
        { body: "Group changes mid-plan (someone drops out) without the whole plan falling apart." },
      ],
    },
    {
      kind: "explore",
      title: "Exploring the budget handshake",
      body: [
        "The budget moment had to be honest, private and quick. I generated six directions in UX Magic and judged each on whether a person would answer truthfully if they thought a friend might see it.",
        "The range slider won: a range feels less exposing than a single number, and the 'only the overlap is shown' promise sits right under it. Tier cards were close, but they hid too much nuance.",
      ],
      variants: [
        s("budget-handshake-range-slider", "Range slider"),
        s("budget-handshake-tier-cards", "Tier cards"),
        s("budget-handshake-anonymous-poll", "Anonymous poll"),
        s("budget-handshake-daily-budget", "Daily budget"),
        s("budget-handshake-category-split", "Category split"),
        s("budget-handshake-chat-first", "Chat-first"),
      ],
      credit: "Generated in UX Magic · judged on honesty and privacy",
    },
    {
      kind: "band",
      title: "Agreeing before booking",
      sub: "(the budget handshake)",
      crumbs: ["Trips home", "Create + invite", "Handshake", "Result"],
      caption: "Talking about money without anyone having to say a number",
      items: [
        { shot: s("trips-home", "Trips home", "Countdown, crew and planning progress") },
        { shot: s("create-trip-invite", "Create + invite", "Dates, destination, WhatsApp invite") },
        { shot: s("budget-handshake", "Handshake", "A private range, locked when you're ready") },
        { node: "5/5 set", sub: "overlap computed" },
        { shot: s("budget-result", "Result", "₹10k–₹12k: the zone everyone is comfortable in") },
      ],
    },
    {
      kind: "band",
      title: "Deciding together",
      sub: "(ideas → votes → plan)",
      crumbs: ["Ideas board", "Vote result", "Day planner", "Today"],
      caption: "Every decision has a deadline, and every plan item has an owner",
      items: [
        { shot: s("ideas-board", "Ideas board", "Anyone adds, everyone votes") },
        { shot: s("vote-result", "Vote result", "Why it won, in plain words") },
        { shot: s("day-planner", "Day planner", "Owner avatars on every item") },
        { shot: s("on-trip-today", "Today", "Next up, route and who's handling what") },
      ],
    },
    {
      kind: "band",
      title: "Money, after",
      sub: "(expenses → settle up)",
      crumbs: ["Expenses", "Settle up"],
      caption: "Three payments instead of twelve awkward reminders",
      items: [
        { shot: s("expenses", "Expenses", "Who paid, split how, within the comfort band") },
        { node: "Simplified", sub: "12 debts → 3 payments" },
        { shot: s("settle-up", "Settle up", "Pay via UPI in one tap") },
      ],
    },
    {
      kind: "feedback",
      title: "Testing with five groups",
      intro: "Next, I'll test with five people who have organised or joined a recent group trip. Here's what I expect, and the risks I'm watching for.",
      planned: true,
      liked: ["A private budget lets people be honest without the awkwardness", "Owners on items visibly take load off the organiser"],
      disliked: ["Groups may not trust that their range is truly hidden", "Too many steps before the 'fun' part (picking places) could lose people"],
    },
    {
      kind: "test",
      title: "The test plan",
      intro: "Moderated, 30 minutes each, using a prototype seeded with the Goa trip. I'll replace this section with what they actually do and say.",
      tasks: [
        "Join the Goa trip from a WhatsApp invite and set your budget",
        "Explain who can see your budget",
        "Vote for a stay and find out why it won",
        "Pay back what you owe Ananya",
      ],
      measures: ["Comprehension of budget privacy", "Time to first vote", "Willingness to own a task (would you take this?)", "Settle-up success without help"],
    },
    {
      kind: "edges",
      title: "When the group changes",
      intro: "Group plans break when people do. Each disruption got a designed state.",
      cases: [
        {
          title: "Someone drops out",
          conclusion: "Show the impact (budget per person goes up ₹600, two items need new owners) and let the group reassign in a tap.",
          shot: s("member-drops-out", "Member drops out"),
          notes: [
            { title: "Constraint #1", body: "Their private range is removed from the overlap, but never revealed, even after leaving." },
            { title: "Constraint #2", body: "Anything already paid stays in the ledger until it's settled." },
          ],
        },
        {
          title: "A vote is tied",
          conclusion: "Remind the missing voter, extend 12 hours, or let the organiser decide. The rule is visible before the tie happens.",
          shot: s("tied-vote", "Tied vote"),
        },
        {
          title: "A plan goes over budget",
          conclusion: "Show who's affected and cheaper alternatives instead of silently breaking the agreement.",
          shot: s("over-budget", "Over budget"),
        },
        {
          title: "No signal on the trip",
          conclusion: "Tickets, addresses and the day plan are saved offline, and only directions wait for signal.",
          shot: s("offline-on-trip", "Offline on trip"),
        },
      ],
    },
    {
      kind: "web",
      title: "Planning on a bigger screen",
      body: "Building the itinerary is a sit-down job. On the web, ideas, days and budget sit side by side, and items drag straight from the backlog into a day.",
      shots: [s("tandem-itinerary-builder", "Tandem itinerary builder — web")],
    },
    {
      kind: "gallery",
      title: "The whole trip, together.",
      sub: "Ten core screens across planning, the trip and after.",
      shots: [
        s("trips-home", "Trips"),
        s("create-trip-invite", "Invite"),
        s("budget-handshake", "Handshake"),
        s("budget-result", "Overlap"),
        s("ideas-board", "Ideas"),
        s("vote-result", "Vote"),
        s("day-planner", "Planner"),
        s("on-trip-today", "Today"),
        s("expenses", "Expenses"),
        s("settle-up", "Settle up"),
      ],
    },
    {
      kind: "list",
      title: "What could be better?",
      items: [
        { title: "Living inside WhatsApp", body: "Groups won't leave their chat. A WhatsApp bot for votes and reminders might matter more than any screen." },
        { title: "Bookings in-app", body: "Today owners book elsewhere and paste details. Partner bookings would close the loop." },
      ],
    },
    {
      kind: "list",
      title: "Learnings & reflections",
      items: [
        { title: "Start with the awkward part", body: "Designing the money conversation first made every later decision easier, because the budget filters everything." },
        { title: "Collaboration needs rules", body: "Deadlines, tie-breaks and owners aren't bureaucracy, they're what make shared work actually finish." },
        { title: "Design for the person who isn't the organiser", body: "The product only works if the quiet members find it easy to take one thing on." },
      ],
    },
  ],
  sources: [
    { label: "Herald Corp — Korean survey on group-trip planning burden", url: "https://biz.heraldcorp.com/article/10779087" },
    { label: "Zawya — Skyscanner survey of Saudi travellers (regional)", url: "https://www.zawya.com/en/business/travel-and-tourism/flexible-travel-shapes-saudi-summer-plans-skyscanner-semczfic" },
    { label: "Globetrender — Mindtrip group chat launch and travel survey", url: "https://globetrender.com/2024/09/24/mindtrip-launches-group-chat-feature/" },
  ],
};
