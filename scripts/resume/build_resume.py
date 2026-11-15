"""Rebuild the resume as a clean 2-page A4 PDF (same text and look as the original ReportLab file),
with every role and project kept together so nothing is stranded on page 2."""
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, ListFlowable, ListItem
from reportlab.platypus.flowables import HRFlowable

LEAD = float(sys.argv[2]) if len(sys.argv) > 2 else 12.6
INK, GREY, BLUE = HexColor("#1a1a1a"), HexColor("#5a5a5a"), HexColor("#1f4e8c")
F, FB = "Helvetica", "Helvetica-Bold"
name = ParagraphStyle("name", fontName=FB, fontSize=20, leading=24, textColor=INK)
role = ParagraphStyle("role", fontName=FB, fontSize=10.5, leading=14, textColor=BLUE, spaceBefore=2)
contact = ParagraphStyle("contact", fontName=F, fontSize=9, leading=12.4, textColor=GREY)
h = ParagraphStyle("h", fontName=FB, fontSize=10.5, leading=13, textColor=BLUE)
body = ParagraphStyle("body", fontName=F, fontSize=9.3, leading=LEAD, textColor=INK)
skill = ParagraphStyle("skill", parent=body, spaceAfter=2.6)
title = ParagraphStyle("title", fontName=FB, fontSize=9.8, leading=LEAD, textColor=INK)
right = ParagraphStyle("right", fontName=F, fontSize=9.3, leading=LEAD, textColor=GREY, alignment=2)
sub = ParagraphStyle("sub", fontName=F, fontSize=9.3, leading=LEAD, textColor=GREY)
bullet = ParagraphStyle("bullet", parent=body)

W = A4[0] - 2 * 51.4
LINK = 'color="#5a5a5a"'


def section(t):
    return [Spacer(1, 7), Paragraph(t, h), HRFlowable(width="100%", thickness=0.6, color=HexColor("#c8ccd2"), spaceBefore=2, spaceAfter=5)]


def row(left, rt, lstyle=title):
    tb = Table([[Paragraph(left, lstyle), Paragraph(rt, right)]], colWidths=[W * 0.72, W * 0.28])
    tb.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    return tb


def bullets(items):
    return ListFlowable([ListItem(Paragraph(t, bullet), leftIndent=10, value="•") for t in items], bulletType="bullet", start="•", leftIndent=10, bulletFontSize=10, bulletOffsetY=0, spaceBefore=2)


def job(t, dates, org, items):
    return KeepTogether([Spacer(1, 6), row(t, dates), Paragraph(org, sub), bullets(items)])


def project(t, org, text):
    return KeepTogether([Spacer(1, 5), row(t, org), Spacer(1, 1.5), Paragraph(text, body)])


s = []
s += [Paragraph("Arun Vijayan S", name), Spacer(1, 2),
      Paragraph("AI-First Product Designer | Enterprise SaaS · FinTech · Agentic &amp; Conversational UX", role), Spacer(1, 2),
      Paragraph("Chennai, India · Open to relocation: UAE, Oman, Saudi Arabia &amp; GCC · Remote-ready", contact),
      Paragraph(f'<a href="mailto:arunvjn1999@gmail.com" {LINK}>arunvjn1999@gmail.com</a> · +91 95977 43417 · '
                f'<a href="https://www.linkedin.com/in/arun-vijayan-7a103316b/" {LINK}>linkedin.com/in/arun-vijayan-7a103316b</a>', contact),
      Paragraph(f'<b>Portfolio:</b> <a href="https://arunfolioproductdesigner.netlify.app/en" {LINK}>arunfolioproductdesigner.netlify.app</a> · '
                f'<b>Behance:</b> <a href="https://www.behance.net/arunvijayan6" {LINK}>behance.net/arunvijayan6</a>', contact)]

s += section("PROFESSIONAL SUMMARY")
s.append(Paragraph("AI-first Product Designer with 5+ years of experience, including 3+ years in product and UX design for enterprise SaaS and FinTech. "
                   "Designs AI-powered search, voice and agentic experiences for US retirement (401(k)) platforms, balancing user trust, clarity and "
                   "regulatory compliance. Uses AI tools such as Claude and Cursor to move from research to validated prototypes faster.", body))

s += section("SKILLS")
for k, v in [
    ("AI &amp; Agentic UX:", "Generative AI product design, agentic AI experiences, AI search experiences, conversational and voice UX, multi-agent workflows, human-in-the-loop design, AI trust and explainability patterns, prompt design"),
    ("UX Research &amp; Strategy:", "User research, user interviews, usability testing, UX audits, customer journey mapping, personas, business analysis, A/B testing"),
    ("Product &amp; UI Design:", "End-to-end product design, information architecture, user flows, sitemaps, storyboards, wireframing, prototyping, visual design, responsive web and mobile (iOS/Android)"),
    ("Design Systems &amp; Delivery:", "Design systems, design tokens, component libraries, design QA, developer handoff, accessibility (WCAG 2.2)"),
    ("Ways of Working:", "Design sprints, Agile/Scrum, Kanban, stakeholder workshops, cross-functional collaboration"),
    ("Tools:", "Figma (Auto Layout, Variables, Dev Mode), Claude, Claude Code, Cursor, Framer, Adobe XD, Illustrator, Photoshop, Balsamiq, Miro, Notion"),
    ("Domains:", "FinTech, US retirement / 401(k) recordkeeping, investor relations, CRM, enterprise SaaS"),
]:
    s.append(Paragraph(f"<b>{k}</b> {v}", skill))

s += section("EXPERIENCE")
s.append(job("Executive UI/UX Designer (Product Design)", "Sep 2025 – Present", "Congruent Solutions · Chennai, India", [
    "Lead AI-first product design for enterprise US retirement (401(k)) platforms serving participants, plan sponsors and administrators, transforming legacy dashboards into action-oriented AI workspaces with voice-enabled workflows.",
    "Designed an AI-powered search and command experience enabling unified discovery, contextual navigation and task execution across all platform modules.",
    "Defined reusable AI design patterns for regulated financial workflows, including source and citation display, confirmation steps before transactions, and fallback and error states, strengthening user trust and compliance.",
    "Planned and moderated 9 usability sessions for the CORE 2.0 participant portal; synthesized findings into cross-session pain points and prioritized design recommendations for stakeholders.",
    "Conducted a UX audit of the CORE 3.0 participant portal, cross-referencing client feedback with live review; identified 11 issues including 401(k) terminology confusion and missing role-based landing pages, and delivered an interactive prototype and handoff specification.",
    "Use AI-assisted prototyping with Claude and Cursor to validate concepts with users, product and engineering in days rather than weeks.",
]))
s.append(job("Product Designer", "Jul 2023 – Sep 2025", "Euroland IR · Chennai, India", [
    "Owned end-to-end design of CRM dashboards, task management tools, client websites and mobile apps for investor relations managers, increasing user engagement by 25%.",
    "Designed AI search experiences that let IR managers find documents and query financial data in natural language, improving query efficiency by 35%.",
    "Ran user interviews and usability tests that shaped product strategy, contributing to a 30% increase in user satisfaction scores.",
    "Built and maintained a scalable design system adopted across 4 products, improving visual consistency and handoff speed.",
    "Partnered with product managers and engineers in Agile/Scrum to balance user needs, business goals and technical constraints.",
]))
s.append(job("Application Engineer", "Aug 2021 – Aug 2022", "Embarckle · Coimbatore, India", [
    "Worked on client-facing web applications across the full development lifecycle, building a practical understanding of engineering constraints that now shapes feasible, build-ready designs.",
    "Wrote UI requirements and specifications that connected engineering, QA and business stakeholders.",
]))
s.append(job("Graphic Designer", "Oct 2020 – Aug 2021", "Apexs Automation · Chennai, India", [
    "Created brand identities, logo systems and guidelines for 6+ B2B clients, plus marketing and social campaigns that increased client engagement by 15%.",
]))

s += section("PROJECTS")
for t, org, text in [
    ("Agentic AI Participant Portal", "Congruent Solutions", "Designed a US retirement participant portal with agentic AI that guides participants through tasks such as enrollment, contributions and investment changes, with clear confirmations and human-in-the-loop controls."),
    ("Retirement Participant Mobile App MVP (iOS/Android)", "Congruent Solutions", "Designed an MVP for US retirement participants with AI-assisted workflows, from wireframes to production. Shipped in 6 weeks to 500+ beta users with a 4.2/5 satisfaction score."),
    ("Feedback Portal", "Congruent Solutions", "Designed a feedback portal to capture, organize and track client and user feedback, giving product teams a single view to prioritize improvements."),
    ("AI Design Canvas Platform", "Personal project", "A domain-aware, multi-agent design tool that turns product requirements into on-brand interface designs inside Figma."),
    ("Task Tracker Design System", "Euroland IR", "Built a design system for a task tracker app, defining reusable components, tokens and patterns that standardized UI and sped up design-to-development handoff."),
    ("AI Search for Investor Relations", "Euroland IR", "Intelligent search for document discovery and financial data queries, improving IR managers' query efficiency by 35%."),
    ("Magnil Employee Management (Android)", "Automotive", "Activity tracking app for the automotive industry that improved operational efficiency by 30%."),
]:
    s.append(project(t, org, text))

s += section("EDUCATION &amp; TRAINING")
for l, rt in [
    ("<b>Advanced Program in Design &amp; Technology</b> · Buff Creative College, Coimbatore", "Sep 2022 – Jun 2023"),
    ("<b>B.Tech, Information Technology</b> · Sathyabama Institute of Science and Technology, Chennai", "2016 – 2020"),
    ("<b>Python Programming</b> · Qtree Technology", "2021"),
]:
    s += [row(l, rt, body), Spacer(1, 3)]

s += section("ADDITIONAL INFORMATION")
s.append(Paragraph("<b>Languages:</b> English (Fluent), Tamil (Native) · <b>Nationality:</b> Indian · <b>Availability:</b> Full-time, open to relocation", body))

doc = SimpleDocTemplate(sys.argv[1], pagesize=A4, leftMargin=45.4, rightMargin=45.4, topMargin=34, bottomMargin=34,
                        title="Arun Vijayan S – AI-First Product Designer", author="Arun Vijayan S", subject="Resume",
                        keywords="AI Product Designer, UI/UX Designer, UX Designer, Product Designer, Agentic AI, FinTech, Design Systems")
doc.build(s)
