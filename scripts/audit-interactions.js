// Playwright audit: drives every interactive piece of the site and records what broke.
async (page) => {
  const base = "http://localhost:3001";
  const issues = [];
  const errors = [];
  const note = (area, ok, detail) => issues.push({ area, ok, detail });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 160)));
  page.on("console", (m) => m.type() === "error" && errors.push("console: " + m.text().slice(0, 160)));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/en`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  // 1. Loader: full run, then hand-off
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(1500);
  const gate = await page.locator('[role="dialog"][aria-label="Intro"]').count();
  note("loader: gate visible", gate === 1, gate);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(9500);
  const loaderGone = (await page.locator('[role="dialog"][aria-label="Intro"]').count()) === 0;
  note("loader: removed after run", loaderGone, "");
  const heroVisible = await page.evaluate(() => getComputedStyle(document.querySelector("[data-hide]")).visibility);
  note("loader: hero released", heroVisible === "visible", heroVisible);
  const lenisRunning = await page.evaluate(() => !document.documentElement.classList.contains("lenis-stopped"));
  note("loader: scroll unlocked", lenisRunning, "");

  // 2. Hero word cycle
  const w1 = await page.evaluate(() => [...document.querySelectorAll("h1 [aria-live] > span")].find((s) => s.getAttribute("aria-hidden") !== "true")?.textContent);
  await page.waitForTimeout(3300);
  const w2 = await page.evaluate(() => [...document.querySelectorAll("h1 [aria-live] > span")].find((s) => s.getAttribute("aria-hidden") !== "true")?.textContent);
  note("hero: word cycles", w1 !== w2, `${w1} → ${w2}`);

  // 3. Pen tool: handles appear near letters, drag reshapes, reset appears
  const svg = page.locator("[data-decor] svg").first();
  const box = await svg.boundingBox();
  if (box) {
    await page.evaluate((y) => window.scrollTo(0, y), box.y - 200);
    await page.waitForTimeout(600);
    const b2 = await svg.boundingBox();
    await page.mouse.move(b2.x + b2.width * 0.05, b2.y + b2.height * 0.5, { steps: 6 });
    await page.waitForTimeout(300);
    const handles = await page.locator("[data-decor] svg rect").count();
    note("pen: handles near pointer", handles > 0, handles);
    if (handles) {
      const r = await page.locator("[data-decor] svg rect").first().boundingBox();
      await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
      await page.mouse.down();
      await page.mouse.move(r.x + 40, r.y - 40, { steps: 8 });
      await page.mouse.up();
      await page.waitForTimeout(300);
      const reset = await page.getByRole("button", { name: "RESET" }).count();
      note("pen: drag shows reset", reset === 1, reset);
      if (reset) await page.getByRole("button", { name: "RESET" }).click();
    }
  }

  // 4. Nav compaction + anchor link
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(800);
  const compact = await page.getByRole("button", { name: "Open menu" }).count();
  note("nav: compacts after scroll", compact === 1, compact);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.locator("nav a", { hasText: "Work" }).first().click();
  await page.waitForTimeout(1800);
  const workTop = await page.evaluate(() => Math.round(document.getElementById("work").getBoundingClientRect().top));
  note("nav: Work link scrolls to section", Math.abs(workTop) < 140, `work top=${workTop}`);

  // 5. Work filters
  const tabs = page.getByRole("tab");
  const counts = {};
  for (const name of ["AI", "Mobile", "Web", "All"]) {
    await tabs.filter({ hasText: new RegExp(`^${name}$`) }).click();
    await page.waitForTimeout(700);
    counts[name] = await page.evaluate(() => [...document.querySelectorAll("[data-flip-id]")].filter((e) => !e.hidden && e.getBoundingClientRect().height > 0).length);
    const ghost = await page.evaluate(() => [...document.querySelectorAll("[data-flip-id]")].filter((e) => !e.hidden && getComputedStyle(e).opacity < 0.5).length);
    if (ghost) note(`work: filter ${name} leaves faded cards`, false, ghost);
  }
  note("work: filter counts", counts.AI === 5 && counts.All === 11, JSON.stringify(counts));

  // 6. Prism folder
  const folder = page.getByRole("button", { name: "Open the UI archive" });
  await folder.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await folder.click();
  await page.waitForTimeout(1300);
  const windowsOut = await page.evaluate(() => [...document.querySelectorAll("[data-folder-ui].absolute")].filter((e) => parseFloat(getComputedStyle(e).opacity) > 0.9).length);
  note("folder: windows fly out", windowsOut >= 6, windowsOut);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(900);
  const windowsIn = await page.evaluate(() => [...document.querySelectorAll("[data-folder-ui].absolute")].filter((e) => parseFloat(getComputedStyle(e).opacity) > 0.1).length);
  note("folder: Esc closes", windowsIn === 0, windowsIn);

  // 7. Experience: sticky horizontal track
  const xp = await page.evaluate(() => {
    const s = document.getElementById("experience");
    return { top: s.getBoundingClientRect().top + scrollY, h: s.offsetHeight };
  });
  const xs = [];
  for (const f of [0, 0.35, 0.7, 1]) {
    await page.evaluate((y) => window.scrollTo(0, y), xp.top + (xp.h - 900) * f);
    await page.waitForTimeout(900);
    xs.push(await page.evaluate(() => Math.round(new DOMMatrix(getComputedStyle(document.querySelector("#experience .xp-line").parentElement).transform).m41)));
  }
  note("experience: track moves with scroll", xs[0] > xs[1] && xs[1] > xs[2], xs.join(" → "));
  const stickyTop = await page.evaluate(() => Math.round(document.querySelector("#experience > div").getBoundingClientRect().top));
  note("experience: viewport stays pinned", Math.abs(stickyTop) < 2, stickyTop);
  const hiddenCards = await page.evaluate(() => [...document.querySelectorAll(".xp-card")].filter((c) => { const r = c.getBoundingClientRect(); return r.left > 0 && r.right < innerWidth && parseFloat(getComputedStyle(c).opacity) < 0.6; }).length);
  note("experience: on-screen cards fully visible", hiddenCards === 0, hiddenCards);

  // 8. Skills physics
  await page.evaluate(() => document.getElementById("skills").scrollIntoView());
  await page.waitForTimeout(3000);
  const pills = await page.evaluate(() => {
    const box = document.querySelector("#skills .cursor-grab").getBoundingClientRect();
    return [...document.querySelectorAll("[data-pill]")].map((p) => {
      const r = p.getBoundingClientRect();
      return { inside: r.top >= box.top - 4 && r.bottom <= box.bottom + 4, vis: getComputedStyle(p).visibility };
    });
  });
  note("skills: all pills settled inside box", pills.every((p) => p.inside && p.vis === "visible"), `${pills.filter((p) => p.inside).length}/${pills.length}`);
  const y0 = await page.evaluate(() => scrollY);
  const sb = await page.locator("#skills .cursor-grab").boundingBox();
  await page.mouse.move(sb.x + sb.width / 2, sb.y + 80);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(700);
  const y1 = await page.evaluate(() => scrollY);
  note("skills: page scrolls over physics box", y1 > y0 + 100, `${y0} → ${y1}`);

  // 9. Tools reveal
  await page.evaluate(() => document.getElementById("tools").scrollIntoView());
  await page.waitForTimeout(1600);
  const toolOpacity = await page.evaluate(() => [...document.querySelectorAll("#tools [data-reveal]")].slice(0, 6).map((e) => +parseFloat(getComputedStyle(e).opacity).toFixed(2)));
  note("tools: cards revealed", toolOpacity.every((o) => o > 0.95), toolOpacity.join(","));

  // 10. Music player: drag to top-left, snaps
  const header = page.locator("[data-music-player] .cursor-grab");
  const hb = await header.boundingBox();
  await page.mouse.move(hb.x + 40, hb.y + hb.height / 2);
  await page.mouse.down();
  await page.mouse.move(120, 160, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(900);
  const pb = await page.locator("[data-music-player]").boundingBox();
  note("player: snaps to top-left", pb.x < 30 && pb.y < 110, `${Math.round(pb.x)},${Math.round(pb.y)}`);
  const chatFab = await page.getByRole("button", { name: "Ask about Arun" }).boundingBox();
  const a11yBtn = await page.getByRole("navigation").getByRole("button", { name: /Accessibility adjustments/ }).boundingBox();
  note("a11y: trigger lives in the nav", !!a11yBtn, a11yBtn ? Math.round(a11yBtn.y) : "missing");
  const overlap = (a, b) => a && b && a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  note("fixed widgets don't overlap (player/chat/a11y)", !overlap(pb, chatFab) && !overlap(pb, a11yBtn) && !overlap(chatFab, a11yBtn), "");
  await page.evaluate(() => localStorage.removeItem("player-corner"));

  // 11. Chat open/close
  await page.getByRole("button", { name: "Ask about Arun" }).click();
  await page.waitForTimeout(700);
  const chatOpen = await page.getByRole("dialog", { name: /Chat about/ }).count();
  note("chat: opens", chatOpen === 1, chatOpen);
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  note("chat: input focused", focused === "TEXTAREA", focused);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  note("chat: Esc closes", (await page.getByRole("dialog", { name: /Chat about/ }).count()) === 0, "");

  // 12. Theme toggle round-trip
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("button", { name: /Switch theme/ }).click();
  await page.waitForTimeout(500);
  const t1 = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.getByRole("button", { name: /Switch theme/ }).click();
  await page.waitForTimeout(500);
  const t2 = await page.evaluate(() => document.documentElement.dataset.theme);
  note("theme: toggles", t1 !== t2, `${t1} → ${t2}`);

  // 13. Language switch keeps section
  await page.evaluate(() => {
    location.hash = "#work";
  });
  await page.getByRole("button", { name: /Change language/ }).click();
  await page.getByRole("option", { name: /தமிழ்/ }).click();
  await page.waitForTimeout(2500);
  note("lang: switched to /ta with hash", page.url().endsWith("/ta#work"), page.url());
  const htmlLang = await page.evaluate(() => document.documentElement.lang);
  note("lang: html lang updated", htmlLang === "ta", htmlLang);

  // 14. A11y panel: open, profile, reset, keyboard trap
  await page.keyboard.press("Alt+KeyA");
  await page.waitForTimeout(700);
  const panel = await page.locator('[aria-labelledby="a11y-title"]').count();
  note("a11y: Alt+A opens", panel === 1, panel);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  return { issues: issues.filter((i) => !i.ok), passed: issues.filter((i) => i.ok).map((i) => i.area), errors: [...new Set(errors)].slice(0, 15) };
}
