"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { blip, intro } from "@/lib/intro";
import { useI18n } from "@/i18n/client";
import { isBool, safeStore } from "@/lib/utils";
import { motionDisabled } from "@/lib/a11y/store";

/*
  Intro, three acts:
  1. Gate (Neelesh)    — a laptop types "Welcome", Enter ↵ / click to continue, SOUND toggle.
                         The click is also the user gesture that unlocks audio.
  2. Greeting grid     — a crosshair draws from the centre, reaches the edges, splits into a
     (Neelesh)           3×3 grid whose centre cell hugs each greeting (Hello → வணக்கம் → …),
                         corner labels fade in, ends on a solid "Welcome." block.
  3. Tile streams      — two streams of cards sweep on curved paths (bottom-left up, top-right
     (Shriya)            down). The lead card of the falling stream is the hero portrait: it
                         breaks away and drops onto the hero card, then the loader fades.
  Plays once per session, Esc/Skip ends it, a failsafe removes it after 20s.
*/

const STEPS = 7;
const RUN = { entryY: 0.67, exitX: 0.29, bend: 0.53, gap: 0.16, duration: 2.2, tileW: 14 };
const TILE_TINTS = ["#2a2733", "#24212c", "#201d27", "#1c1a22", "#19171f", "#16141c", "#131118"];

function curve(t: number, mirrored: boolean): [number, number] {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const p0 = [-0.08, RUN.entryY];
  const p2 = [RUN.exitX, -0.15];
  const dx = (p2[0] - p0[0]) * W;
  const dy = (p2[1] - p0[1]) * H;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const c = [(p0[0] + p2[0]) / 2 + (nx * RUN.bend * len) / W, (p0[1] + p2[1]) / 2 + (ny * RUN.bend * len) / H];
  const u = 1 - t;
  let x = u * u * p0[0] + 2 * u * t * c[0] + t * t * p2[0];
  let y = u * u * p0[1] + 2 * u * t * c[1] + t * t * p2[1];
  if (mirrored) {
    x = 1 - x;
    y = 1 - y;
  }
  return [x, y];
}

export function Loader() {
  const { greetings, ui } = useI18n().dict;
  const t = ui.loader;
  const root = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(true);
  const [phase, setPhase] = useState<"gate" | "run">("gate");
  const [typed, setTyped] = useState("");
  const [sound, setSound] = useState(true);
  const finished = useRef(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const done = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    tl.current?.kill();
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {}
    intro.release();
    intro.lenis?.start();
    setMounted(false);
  }, []);

  // Skip entirely for repeat visits in the same session and for reduced motion.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro-seen") === "1";
    } catch {}
    if (seen || motionDisabled()) {
      done();
      return;
    }
    const s = safeStore.get("sound", isBool);
    if (s !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- preference only exists in the browser
      setSound(s);
      intro.setSound(s);
    }
    window.scrollTo(0, 0);
    intro.lenis?.stop();
    const failsafe = setTimeout(done, 20000);
    // Lenis may mount after us
    const t = setTimeout(() => intro.lenis?.stop(), 50);
    return () => {
      clearTimeout(failsafe);
      clearTimeout(t);
    };
  }, [done]);

  // Act 1: type the welcome word on the laptop screen. Typed by grapheme cluster so
  // Tamil/Hindi vowel signs never get split from their consonants.
  useEffect(() => {
    if (phase !== "gate") return;
    const graphemes = [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(t.welcome)].map((g) => g.segment);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(graphemes.slice(0, i).join(""));
      if (i >= graphemes.length) clearInterval(id);
    }, 320);
    return () => clearInterval(id);
  }, [phase, t.welcome]);

  const start = useCallback(() => {
    if (phase !== "gate") return;
    blip(520, 0.08, 0.05);
    setPhase("run");
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") done();
      else if (e.key === "Enter") start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start, done]);

  const toggleSound = () => {
    setSound((s) => {
      intro.setSound(!s);
      safeStore.set("sound", !s);
      return !s;
    });
  };

  // Acts 2 + 3.
  useEffect(() => {
    if (phase !== "run" || !root.current) return;
    const el = root.current;
    const q = gsap.utils.selector(el);
    const W = window.innerWidth;
    const H = window.innerHeight;
    const word = q(".lg-word")[0] as HTMLElement;
    const measure = q(".lg-measure")[0] as HTMLElement;
    const cell = { w: 0, h: Math.min(88, H * 0.12) };

    const sizeFor = (text: string) => {
      measure.textContent = text;
      return measure.offsetWidth + 48;
    };
    const placeLines = () => {
      gsap.set(q(".lg-v1"), { x: W / 2 - cell.w / 2 });
      gsap.set(q(".lg-v2"), { x: W / 2 + cell.w / 2 });
      gsap.set(q(".lg-h1"), { y: H / 2 - cell.h / 2 });
      gsap.set(q(".lg-h2"), { y: H / 2 + cell.h / 2 });
      gsap.set(q(".lg-labels"), { "--cw": `${cell.w}px`, "--ch": `${cell.h}px` });
      gsap.set(q(".lg-cell"), { width: cell.w, height: cell.h, x: W / 2 - cell.w / 2, y: H / 2 - cell.h / 2 });
    };

    // Tiles
    const tilesEl = q(".lg-tiles")[0] as HTMLElement;
    const tiles = Array.from(tilesEl.children) as HTMLElement[];
    const half = tiles.length / 2;
    tiles.forEach((t) => (t.style.width = `${RUN.tileW}vw`));
    const drive = { s: 0 };
    const place = () => {
      tiles.forEach((t, i) => {
        if (t.dataset.free) return;
        const left = i < half;
        const k = left ? i : i - half;
        const u = drive.s - k * RUN.gap;
        if (u <= 0 || u >= 1) {
          t.style.opacity = "0";
          return;
        }
        const [x, y] = curve(u, !left);
        t.style.transform = `translate(${x * W - t.offsetWidth / 2}px, ${y * H - t.offsetHeight / 2}px)`;
        t.style.opacity = Math.min(1, (1 - u) / 0.15).toFixed(3);
        t.style.zIndex = String(100 - k);
      });
    };

    // The portrait card's fall onto the hero card.
    const flyer = tiles[half];
    const flight = { t: 0 };
    let from: DOMRect | null = null;
    let to: DOMRect | null = null;
    const easeX = gsap.parseEase("power2.out");
    const easeY = gsap.parseEase("power2.inOut");
    const flyStart = () => {
      const card = document.querySelector("[data-hero-card]");
      if (!card) return;
      flyer.dataset.free = "1";
      intro.markHandoff();
      from = flyer.getBoundingClientRect();
      to = card.getBoundingClientRect();
      flyer.style.opacity = "1";
      flyer.style.zIndex = "200";
    };
    const flyDraw = () => {
      if (!from || !to) return;
      const x = from.left + (to.left - from.left) * easeX(flight.t);
      const w = from.width + (to.width - from.width) * easeX(flight.t);
      const y = from.top + (to.top - from.top) * easeY(flight.t);
      // sway out and back, settling on the hero card's 3° tilt
      const r = 4 * Math.sin(Math.PI * flight.t) + 3 * flight.t;
      flyer.style.width = `${w}px`;
      flyer.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
    };

    const t = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: done });
    tl.current = t;

    // Gate out
    t.to(q(".lg-gate"), { opacity: 0, scale: 0.96, duration: 0.35, ease: "power2.in" }, 0);

    // Crosshair: dot → short cross → full lines
    t.set(q(".lg-v1, .lg-v2"), { x: W / 2, scaleY: 0, opacity: 1 }, 0.3);
    t.set(q(".lg-h1, .lg-h2"), { y: H / 2, scaleX: 0, opacity: 1 }, 0.3);
    t.to(q(".lg-v1, .lg-v2"), { scaleY: 0.08, duration: 0.4 }, 0.35);
    t.to(q(".lg-h1, .lg-h2"), { scaleX: 0.08, duration: 0.4 }, 0.35);
    t.to(q(".lg-v1, .lg-v2"), { scaleY: 1, duration: 0.7, ease: "power3.inOut" }, 0.75);
    t.to(q(".lg-h1, .lg-h2"), { scaleX: 1, duration: 0.7, ease: "power3.inOut" }, 0.75);

    // Split into the grid around the first greeting
    t.call(
      () => {
        cell.w = sizeFor(greetings[0]);
        word.textContent = greetings[0];
      },
      [],
      1.4,
    );
    t.to(q(".lg-v1"), { x: () => W / 2 - cell.w / 2, duration: 0.6, ease: "power3.inOut" }, 1.45);
    t.to(q(".lg-v2"), { x: () => W / 2 + cell.w / 2, duration: 0.6, ease: "power3.inOut" }, 1.45);
    t.to(q(".lg-h1"), { y: () => H / 2 - cell.h / 2, duration: 0.6, ease: "power3.inOut" }, 1.45);
    t.to(q(".lg-h2"), { y: () => H / 2 + cell.h / 2, duration: 0.6, ease: "power3.inOut" }, 1.45);
    t.call(placeLines, [], 2.06);
    t.fromTo(q(".lg-word"), { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.35 }, 2.0);
    t.fromTo(q(".lg-label"), { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 }, 2.1);

    // Cycle greetings; the grid re-fits each word
    let at = 2.55;
    const list = [...greetings.slice(1), `${t.welcome}.`];
    list.forEach((g, i) => {
      const last = i === list.length - 1;
      t.to(q(".lg-word"), { opacity: 0, duration: 0.14, ease: "power1.in" }, at);
      t.call(
        () => {
          cell.w = sizeFor(g);
          word.textContent = g;
          blip(last ? 440 : 600 + i * 40, 0.05, 0.025);
        },
        [],
        at + 0.15,
      );
      t.to(q(".lg-v1"), { x: () => W / 2 - cell.w / 2, duration: 0.3, ease: "power2.out" }, at + 0.15);
      t.to(q(".lg-v2"), { x: () => W / 2 + cell.w / 2, duration: 0.3, ease: "power2.out" }, at + 0.15);
      t.to(q(".lg-labels"), { "--cw": () => `${cell.w}px`, duration: 0.3, ease: "power2.out" }, at + 0.15);
      t.set(q(".lg-cell"), { width: () => cell.w, x: () => W / 2 - cell.w / 2 }, at + 0.15);
      t.to(q(".lg-word"), { opacity: last ? 1 : 0.85, duration: 0.18 }, at + 0.17);
      if (last) {
        t.to(q(".lg-cell"), { opacity: 1, duration: 0.15 }, at + 0.15);
        t.set(q(".lg-word"), { color: "#fff" }, at + 0.15);
      }
      at += last ? 0.75 : 0.5;
    });

    // "Welcome." softens, grid steps back, the streams run
    const runAt = at;
    t.to(q(".lg-cell"), { backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--c-blush").trim(), duration: 0.5, ease: "power2.out" }, runAt - 0.2);
    t.to(q(".lg-lines, .lg-labels"), { opacity: 0, duration: 0.4 }, runAt);
    t.to(q(".lg-center"), { opacity: 0.35, duration: 0.5 }, runAt);
    t.to(drive, { s: 1 + (half - 1) * RUN.gap, duration: RUN.duration, ease: "power2.inOut", onUpdate: place }, runAt);

    // Hand-off: background clears to the page, the portrait card falls onto the hero card
    const fadeAt = runAt + RUN.duration * 0.35;
    t.fromTo(flight, { t: 0 }, { t: 1, duration: 1.1, ease: "none", onStart: flyStart, onUpdate: flyDraw }, fadeAt - 0.4);
    t.to(q(".lg-center"), { opacity: 0, duration: 0.4, ease: "power2.in" }, fadeAt);
    t.to(q(".lg-bg"), { opacity: 0, duration: 0.8, ease: "power2.inOut" }, fadeAt);
    t.call(() => intro.release(), [], fadeAt + 0.5);
    t.to(el, { opacity: 0, duration: 0.35, ease: "power1.out" }, fadeAt + 0.75);

    return () => {
      t.kill();
    };
  }, [phase, done, greetings, t.welcome]);

  if (!mounted) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100] overflow-hidden select-none" aria-label={t.intro} role="dialog">
      <div className="lg-bg absolute inset-0 bg-loader" />

      {/* Act 1 — gate */}
      <div className="lg-gate absolute inset-0 flex flex-col items-center justify-center">
        <Laptop typed={typed} word={t.welcome} />
        <button
          onClick={start}
          className="mt-5 flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-1.5 text-[13px] text-on-ink shadow-sm transition-transform hover:scale-[1.04]"
        >
          {t.enter} <span aria-hidden>↵</span>
        </button>
        <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-ink-3">{t.caption}</p>
        <button
          onClick={toggleSound}
          aria-pressed={sound}
          className="absolute bottom-8 flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-ink-2 hover:bg-ink/5"
        >
          <span aria-hidden className="flex h-3 items-end gap-[2px]">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-[2px] rounded-[1px] bg-ink-2"
                style={{ height: sound ? undefined : "25%", animation: sound ? `eq-${(i % 3) + 1} ${0.6 + i * 0.12}s ease-in-out infinite` : "none" }}
              />
            ))}
          </span>
          {sound ? t.soundOn : t.soundOff}
        </button>
      </div>

      {/* Act 2 — greeting grid */}
      <div className="lg-center pointer-events-none absolute inset-0">
        <div className="lg-lines">
          <span className="lg-v1 absolute top-0 left-0 h-full w-px origin-center bg-ink/15 opacity-0" />
          <span className="lg-v2 absolute top-0 left-0 h-full w-px origin-center bg-ink/15 opacity-0" />
          <span className="lg-h1 absolute top-0 left-0 h-px w-full origin-center bg-ink/15 opacity-0" />
          <span className="lg-h2 absolute top-0 left-0 h-px w-full origin-center bg-ink/15 opacity-0" />
        </div>
        <span className="lg-cell absolute top-0 left-0 bg-pink opacity-0" />
        <div
          className="lg-labels absolute inset-0 font-mono text-[9px] tracking-[0.16em] text-ink-3"
          style={{ ["--cw" as string]: "0px", ["--ch" as string]: "88px" }}
        >
          {[
            [t.labels[0], "right", "top"],
            [t.labels[1], "left", "top"],
            [t.labels[2], "right", "bottom"],
            [t.labels[3], "left", "bottom"],
          ].map(([t, side, v]) => (
            <span
              key={t}
              className="lg-label absolute opacity-0"
              style={{
                [side === "right" ? "right" : "left"]: `calc(50% + var(--cw) / 2 + 8px)`,
                [v === "top" ? "bottom" : "top"]: `calc(50% + var(--ch) / 2 + 6px)`,
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="absolute inset-0 grid place-items-center">
          <span className="lg-word font-display text-[clamp(36px,4.4vw,60px)] leading-none font-semibold tracking-tight text-ink opacity-0" />
        </div>
        <span
          className="lg-measure invisible absolute top-0 left-0 font-display text-[clamp(36px,4.4vw,60px)] leading-none font-semibold tracking-tight whitespace-nowrap"
          aria-hidden
        />
      </div>

      {/* Act 3 — tile streams */}
      <div className="lg-tiles pointer-events-none absolute inset-0">
        {Array.from({ length: STEPS * 2 }).map((_, i) => {
          const side = i < STEPS ? 0 : 1;
          const k = side ? i - STEPS : i;
          const portrait = side === 1 && k === 0;
          return (
            <div
              key={i}
              className="absolute top-0 left-0 aspect-[4/5] overflow-hidden rounded-[14px] opacity-0 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]"
              style={{
                background: portrait ? "center / cover no-repeat url(/images/portrait.webp), linear-gradient(160deg,#cdb8ff,#ffb6d9)" : TILE_TINTS[side ? STEPS - 1 - k : k],
                backgroundImage: portrait ? undefined : "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: portrait ? undefined : "12px 12px",
              }}
            />
          );
        })}
      </div>

      <button
        onClick={done}
        className="absolute right-5 bottom-5 rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-ink-3 hover:bg-ink/5 hover:text-ink"
      >
        {t.skip}
      </button>
    </div>
  );
}

function Laptop({ typed, word }: { typed: string; word: string }) {
  const complete = typed === word;
  return (
    <svg width="140" height="96" viewBox="0 0 140 96" aria-hidden>
      <rect x="18" y="6" width="104" height="70" rx="6" fill="#e9e6e1" stroke="#c9c5bf" />
      <rect x="23" y="11" width="94" height="60" rx="3" fill="#fbf3e6" />
      <text x="70" y="47" textAnchor="middle" fontFamily="var(--font-display)" fontSize="13" fontWeight="600" fill="#1a1822">
        {typed}
        {!complete && <tspan style={{ animation: "caret 1s steps(1) infinite" }}>|</tspan>}
      </text>
      {complete && (
        <g stroke="#3f8f4f" strokeWidth="1.6" strokeLinecap="round" fill="none">
          <path d="M70 32 L70 26" />
          <path d="M70 28 C66 26 64 23 64 21" />
          <path d="M70 28 C74 26 76 23 76 21" />
        </g>
      )}
      <path d="M6 80 H134 L128 90 H12 Z" fill="#dedad4" stroke="#c9c5bf" />
      <rect x="60" y="80" width="20" height="3" rx="1.5" fill="#c9c5bf" />
    </svg>
  );
}
