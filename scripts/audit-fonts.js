// Playwright audit: font loading, the face actually used per text role, glyph fallbacks,
// clipped/overflowing text and layout shifts caused by font swaps — per locale.
async (page) => {
  const base = "http://localhost:3001";
  const out = {};
  for (const loc of ["en", "ta", "hi"]) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${base}/${loc}`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      sessionStorage.setItem("intro-seen", "1");
      localStorage.removeItem("a11y");
      localStorage.setItem("theme", "light");
    });
    // measure CLS from a cold load
    await page.addInitScript(() => {
      window.__cls = [];
      new PerformanceObserver((l) =>
        l.getEntries().forEach((e) => !e.hadRecentInput && window.__cls.push({ v: +e.value.toFixed(4), t: Math.round(e.startTime), src: (e.sources || []).map((s) => (s.node && (s.node.className || s.node.nodeName || "").toString().slice(0, 40)) || "?") })),
      ).observe({ type: "layout-shift", buffered: true });
    });
    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(3500);
    out[loc] = await page.evaluate(async () => {
      await document.fonts.ready;
      const faces = [...document.fonts].map((f) => `${f.family}|${f.weight}|${f.style}|${f.status}`);
      const loadedFamilies = [...new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family))];
      const failed = [...document.fonts].filter((f) => f.status === "error").map((f) => f.family);
      // computed font stacks per role
      const pick = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const cs = getComputedStyle(el);
        return { family: cs.fontFamily.slice(0, 90), weight: cs.fontWeight, size: cs.fontSize, lh: cs.lineHeight, text: el.textContent.trim().slice(0, 30) };
      };
      const roles = {
        h1: pick("h1"),
        heroBio: pick(".hero-bio"),
        navLink: pick("nav a[href*='#about']"),
        sectionH2: pick("#work h2"),
        expCardTitle: pick("#experience h3"),
        aboutMono: pick("#about .font-mono p"),
        toolsSerifH2: pick("#tools h2"),
        marquee: pick(".hero-marquee span"),
        script: pick(".hero-caption"),
        contactH2: pick("#contact h2"),
      };
      // clipped / overflowing text: headings & key text whose content box overflows
      const overflow = [];
      document.querySelectorAll("main h1, main h2, main h3, main p, nav a, nav button, footer p, footer h2").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || getComputedStyle(el).visibility === "hidden") return;
        const ox = el.scrollWidth - el.clientWidth;
        const oy = el.scrollHeight - el.clientHeight;
        const cs = getComputedStyle(el);
        if ((ox > 2 && cs.overflowX !== "visible") || (oy > 2 && cs.overflowY !== "visible")) overflow.push({ tag: el.tagName, cls: el.className.toString().slice(0, 50), ox, oy, text: el.textContent.trim().slice(0, 30) });
        // glyphs taller than the line box (tight leading on Tamil/Devanagari)
        const lh = parseFloat(cs.lineHeight);
        const fs = parseFloat(cs.fontSize);
        if (lh && fs && lh / fs < 1.15 && /[஀-௿ऀ-ॿ]/.test(el.textContent)) overflow.push({ tag: el.tagName, issue: "tight-leading-indic", ratio: +(lh / fs).toFixed(2), text: el.textContent.trim().slice(0, 30) });
      });
      // elements wider than the viewport (horizontal scroll)
      const wide = [...document.querySelectorAll("body *")]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.right > innerWidth + 1 && getComputedStyle(e).position !== "fixed" && !e.closest("[data-decor], .overflow-hidden, [class*='overflow-hidden']");
        })
        .slice(0, 8)
        .map((e) => e.tagName + "." + e.className.toString().slice(0, 40));
      return { faces, loadedFamilies, failed, roles, overflow: overflow.slice(0, 20), wide, docOverflowX: document.documentElement.scrollWidth - innerWidth, cls: window.__cls };
    });
  }
  return out;
}
