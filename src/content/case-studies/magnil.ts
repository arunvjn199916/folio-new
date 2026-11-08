import type { CaseStudy, Shot } from "./types";

// Screens are from the shipped app, re-themed (brand colour changed) with personal details replaced.
const s = (name: string, label: string, note?: string): Shot => ({ src: `cases/magnil/${name}.webp`, label, note, ratio: "375/792" });
const ai = (name: string, label: string, note?: string): Shot => ({ src: `cases/magnil/${name}.webp`, label, note });

export const magnil: CaseStudy = {
  slug: "magnil-employee-management",
  brand: { name: "Magnil", tint: "#e6e4fb", band: "#eceafb", accent: "#3b2fc9" },
  hero: {
    kicker: "Android app · automotive manufacturing",
    title: "Taking a factory's attendance, leave and shifts off paper",
    sub: "Magnil is an Android app for an automotive manufacturer: employees punch in with a swipe, apply for leave, swap shifts and download payslips, while supervisors and managers approve, assign tasks and run payroll from the same app.",
    shots: [s("walkthrough-1", "Onboarding"), s("attendance", "Attendance report"), s("home", "Employee home"), s("shift", "Shift"), s("salary", "Salary")],
  },
  client: true,
  meta: [
    { label: "My role", value: ["UI/UX designer", "User research", "Design system"] },
    { label: "Platform", value: ["Android", "3 roles"] },
    { label: "Timeline", value: ["12 weeks", "35+ screens"] },
    { label: "Outcome", value: ["+30% operational efficiency"] },
  ],
  blocks: [
    {
      kind: "metrics",
      title: "What changed",
      intro: "Efficiency was measured by the client after rollout; the rest is the scope of the work.",
      items: [
        { tone: "up", label: "Operational efficiency", value: "+30%" },
        { tone: "up", label: "Roles served by one app (employee, supervisor, manager)", value: "3" },
        { tone: "up", label: "Screens designed and handed off", value: "35+" },
        { tone: "down", label: "Weeks from first interview to handoff", value: "12" },
      ],
    },
    {
      kind: "text",
      eyebrow: "Background",
      body: [
        "An automotive parts manufacturer ran its people operations on registers, notice boards and a web portal only managers could reach. Employees punched in on paper, asked supervisors for leave in person and found out about shift changes from the notice board.",
        "Magnil brings those day-to-day activities — attendance, leave, shifts, tasks and payroll — into one Android app for every role, so records live in the cloud instead of in a cupboard.",
      ],
    },
    {
      kind: "numbered",
      title: "What wasn't working",
      intro: "From interviews with employees and supervisors on the floor.",
      items: [
        { title: "Records were kept by hand", body: "Attendance and leave lived in registers, so totals and payroll were reconciled manually at month end." },
        { title: "Leave meant finding your supervisor", body: "Requests were verbal or on paper, with no way to see your balance or the status of a request." },
        { title: "Tasks and progress weren't tracked", body: "Supervisors assigned work verbally; nobody could see what was done without asking." },
        { title: "The old portal was web-only and unreliable", body: "Frequent server issues, and most features weren't available on a phone at all." },
      ],
    },
    {
      kind: "personas",
      title: "Who it's for (from the interviews)",
      items: [
        { name: "Soundappan, 54", role: "General Manager · Namakkal", quote: "I want to see who is working and what got done — without walking the floor.", needs: ["Daily view of work and attendance", "Approvals in one place", "An app that doesn't go down"] },
        { name: "Rahul, 25", role: "Sales rep · Coimbatore", quote: "Applying for leave shouldn't depend on catching my manager in the corridor.", needs: ["Punch in from the app", "Apply and track leave", "Payslip and insurance details"] },
        { name: "Line supervisor", role: "Runs a shift of 40", quote: "I need to know who's missing before the shift starts.", needs: ["Attendance at a glance", "Assign tasks", "Approve swaps and leave"] },
      ],
    },
    {
      kind: "text",
      eyebrow: "Research",
      title: "Interviews, a survey and the competition",
      body: [
        "I ran face-to-face interviews with employees across roles and a short Google survey on how people learn about pay, what kind of employee they are, and how attendance is captured today. The survey showed a split workforce — permanent, temporary and contract — with salary updates arriving by text, email and the notice board, and attendance still largely manual.",
        "I compared Salary Box, Zoho People and HRMantra. All three hid core features behind paid tiers or memberships, and attendance was tied to logging in on a computer. That left a clear gap: a free, phone-first app built around the shop-floor day.",
      ],
      bullets: [
        "Empathy map: “All employee services in one app would be more productive” · “No proper notifications”",
        "Affinity clusters: manual attendance, server issues, third-party maintenance, web-only access",
        "Goals & needs: leave approval in the app, downloadable payslips, personal notes, fingerprint lock",
      ],
    },
    {
      kind: "statement",
      eyebrow: "The design question",
      line: "How might every employee handle punch-in, leave, shifts and pay from one app — whatever their role?",
      sub: "One app, three homes: employee, supervisor and manager each start from what they do first.",
    },
    {
      kind: "steps",
      eyebrow: "The solution at a glance",
      title: "Punch, plan, get paid.",
      items: [
        { quote: "I swipe once at the gate and I'm in.", title: "Punch", body: "Swipe-to-punch on the home screen with live entry, exit and total hours; an attendance report by month with present, leave and permission counts." },
        { quote: "I can see my leave balance before I ask.", title: "Plan", body: "Leave by type with balances, shift view with upcoming shifts and swap requests, holidays, and tasks assigned by supervisors." },
        { quote: "Payslip on my phone, not in an envelope.", title: "Get paid", body: "Salary breakdown with tax and insurance, payslip download, PF and insurance claims; managers release payroll for all, supervisors or contract staff." },
      ],
    },
    {
      kind: "journey",
      eyebrow: "User flow",
      title: "Three roles, one entry point",
      sub: "Splash → walkthrough → login → type of user → a home built for that role.",
      start: { kicker: "Start", title: "Login with employee ID", body: "OTP for first sign-in and password reset." },
      steps: [
        { title: "Employee", body: "Punch in/out, attendance, leave, shift, salary." },
        { title: "Supervisor", body: "Everything an employee has, plus tasks and approvals." },
        { title: "Manager", body: "Employee management, hierarchy, payroll and requests." },
      ],
      alt: { kicker: "Shortcut", title: "Chat with Mowgli", body: "An in-app helper for common problems like a failed punch." },
      end: { kicker: "Journey map", title: "“Overall experience was good”", body: "Pain points: no notification after a leave decision, unclear calendar changes — both fixed in the final design." },
    },
    {
      kind: "band",
      title: "Getting started",
      caption: "A three-step walkthrough, then employee-ID login with OTP",
      items: [{ shot: s("walkthrough-1", "Walkthrough", "New punch-in method") }, { shot: s("walkthrough-3", "Walkthrough", "Task assignment") }, { node: "Get started" }, { shot: s("login", "Login") }, { shot: s("otp", "OTP verification") }],
    },
    {
      kind: "band",
      title: "The employee's day",
      caption: "Punch in from home, check attendance, apply for leave, see the next shift",
      crumbs: ["Home", "Attendance", "Leave", "Shift"],
      items: [{ shot: s("home", "Home", "Swipe for attendance") }, { shot: s("attendance", "Attendance report") }, { shot: s("leave", "Leave", "Balance per type") }, { shot: s("shift", "Shift") }, { shot: s("shift-change", "Shift request", "Available swaps") }],
    },
    {
      kind: "band",
      title: "Supervisors and managers",
      caption: "Approvals, tasks, people and payroll in the same app",
      items: [{ shot: s("man-home", "Manager home") }, { shot: s("man-request", "Requests", "Approve or reject") }, { shot: s("man-task", "Task management") }, { shot: s("employees", "Employee management") }, { shot: s("payroll", "Payroll", "Release payslips") }],
    },
    {
      kind: "gallery",
      title: "Everything else",
      sub: "Salary, holidays, notifications, profile, settings and the in-app helper.",
      shots: [s("salary", "Salary"), s("holiday", "Holiday calendar"), s("notifications", "Notifications"), s("hierarchy", "People / hierarchy"), s("bot", "Chat with Mowgli"), s("menu", "Menu"), s("profile", "Profile"), s("settings", "Settings")],
    },
    {
      kind: "text",
      eyebrow: "Concept · added for this portfolio",
      title: "What AI would add next",
      body: [
        "The shipped app made every task possible on a phone. The next step is making the common ones effortless — without taking decisions away from people. These four concepts are designed in Magnil's style; they are not part of the shipped product.",
      ],
      bullets: [
        "Every AI action is a draft: nothing is sent, swapped or changed until a person taps confirm.",
        "Explanations use only the employee's own payslip, attendance and the rota.",
        "Supervisors still approve every leave and swap.",
      ],
    },
    {
      kind: "band",
      title: "Concept: AI that drafts, people decide",
      caption: "Leave assistant · shift-swap match · payslip explainer · supervisor digest",
      crumbs: ["Leave assistant", "Shift swap", "Payslip", "Digest"],
      items: [{ shot: ai("ai-leave", "Leave assistant", "Checks balance and shift clash") }, { shot: ai("ai-swap", "Shift-swap match", "Ranks who can cover") }, { shot: ai("ai-payslip", "Payslip explainer", "“Why is my pay lower?”") }, { shot: ai("ai-digest", "Supervisor digest", "What needs attention today") }],
    },
    {
      kind: "system",
      title: "The design system",
      body: "A small, strict kit so 35+ screens stay consistent: two brand colours with tints, one typeface in four sizes, a service-icon set and the components every screen is built from. Shown here in the re-themed palette.",
      colors: [
        { name: "Primary", hex: "#120088", role: "bars, buttons" },
        { name: "Secondary", hex: "#3b2fc9", role: "toggles, links" },
        { name: "Tint", hex: "#e8e6fb", role: "chips, fills" },
        { name: "Surface", hex: "#f4f4fb", role: "cards" },
        { name: "Alert", hex: "#e85d4a", role: "time, warnings" },
        { name: "Success", hex: "#2fb879", role: "progress" },
      ],
      type: { family: "Montserrat", scale: [{ size: 24, weight: 700, use: "Screen title" }, { size: 20, weight: 600, use: "Section heading" }, { size: 16, weight: 500, use: "Body and list items" }, { size: 14, weight: 400, use: "Labels and captions" }] },
      components: ["Top bar", "Bottom navigation", "Buttons (3 states)", "Input fields", "Toggles", "Date strip", "Service icons", "Swipe to punch", "Request card", "Shift card"],
    },
    {
      kind: "list",
      title: "What I learned",
      items: [
        { title: "Design for the gate, not the desk", body: "The most important moment is a tired employee punching in at 6 a.m. — one big swipe beat any form." },
        { title: "Roles are starting points, not permissions", body: "Supervisors and managers got their own home screens instead of extra menu items, so nobody hunts for their daily task." },
        { title: "A style guide pays off at 35 screens", body: "Locking colours, type and components early kept the app consistent while screens were added late in the project." },
      ],
    },
    {
      kind: "list",
      title: "What I'd do next",
      items: [
        { title: "Notifications for every decision", body: "The journey map's biggest pain point: tell people the moment leave or a swap is approved." },
        { title: "Offline punch-in", body: "Queue punches when the network drops on the floor and sync later." },
        { title: "Pilot the AI concepts", body: "Start with the payslip explainer — read-only, high value, low risk." },
      ],
    },
  ],
  sources: [],
};
