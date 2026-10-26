// Playwright snippet: scrolls the page with the mouse wheel and reports dropped frames
// per section, plus layout shifts and long tasks. Used to find scroll jank.
// Run via the Playwright MCP `browser_run_code_unsafe` with filename pointing here.
async (page) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3001/", { waitUntil: "load" });
  await page.evaluate(() => sessionStorage.setItem("intro-seen", "1"));
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(2500);
  await page.mouse.move(700, 450);

  await page.evaluate(() => {
    const w = window;
    w.__frames = [];
    w.__shifts = [];
    w.__long = [];
    let last = performance.now();
    const sectionAt = () => {
      const el = document.elementsFromPoint(innerWidth / 2, innerHeight / 2).find((e) => e.closest("section,footer"));
      const s = el?.closest("section,footer");
      return s?.id || s?.tagName || "?";
    };
    const loop = (t) => {
      w.__frames.push({ dt: t - last, y: Math.round(scrollY), s: sectionAt() });
      last = t;
      w.__raf = requestAnimationFrame(loop);
    };
    w.__raf = requestAnimationFrame(loop);
    new PerformanceObserver((l) => l.getEntries().forEach((e) => !e.hadRecentInput && w.__shifts.push({ v: e.value, y: Math.round(scrollY), src: e.sources?.map((s) => s.node?.className?.toString().slice(0, 50)) }))).observe({ type: "layout-shift", buffered: false });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => w.__long.push({ d: Math.round(e.duration), y: Math.round(scrollY) }))).observe({ type: "longtask", buffered: false });
  });

  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let i = 0; i < 400; i++) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(40);
    const y = await page.evaluate(() => scrollY + innerHeight);
    if (y >= H - 4) break;
  }
  await page.waitForTimeout(1200);

  return await page.evaluate(() => {
    const w = window;
    cancelAnimationFrame(w.__raf);
    const by = {};
    for (const f of w.__frames) {
      const b = (by[f.s] ??= { n: 0, over25: 0, over50: 0, max: 0, sum: 0 });
      b.n++;
      b.sum += f.dt;
      if (f.dt > 25) b.over25++;
      if (f.dt > 50) b.over50++;
      b.max = Math.max(b.max, Math.round(f.dt));
    }
    for (const k in by) by[k].avg = +(by[k].sum / by[k].n).toFixed(1);
    const worst = [...w.__frames].sort((a, b) => b.dt - a.dt).slice(0, 12).map((f) => `${Math.round(f.dt)}ms@${f.y}(${f.s})`);
    return { by, worst, shifts: w.__shifts.slice(0, 15), long: w.__long.slice(0, 20), cls: w.__shifts.reduce((a, s) => a + s.v, 0).toFixed(3) };
  });
}
