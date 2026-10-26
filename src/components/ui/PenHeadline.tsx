"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useFinePointer } from "@/lib/hooks";

// Ashu reference: the headline is real vector outlines. Near the pointer the closest
// anchors show with their Bezier handles; drag an anchor or a handle to reshape the
// letter, "Reset" eases everything back. Fine pointers only; otherwise it's static.

type Pt = { x: number; y: number };
type Node = { p: Pt; in: Pt | null; out: Pt | null };
type Contour = Node[];
type Handle = { ci: number; ni: number; p: Pt; in: Pt | null; out: Pt | null };

const FONT_URL = "/fonts/ClashDisplay-Semibold.ttf";
const NEAR = 70; // px (screen) radius in which anchors appear
const MAX_SHOWN = 3;

function toContours(commands: { type: string; x?: number; y?: number; x1?: number; y1?: number; x2?: number; y2?: number }[]) {
  const contours: Contour[] = [];
  let cur: Contour = [];
  let last: Pt = { x: 0, y: 0 };
  for (const c of commands) {
    if (c.type === "M") {
      if (cur.length) contours.push(cur);
      cur = [{ p: { x: c.x!, y: c.y! }, in: null, out: null }];
      last = { x: c.x!, y: c.y! };
    } else if (c.type === "L") {
      cur.push({ p: { x: c.x!, y: c.y! }, in: null, out: null });
      last = { x: c.x!, y: c.y! };
    } else if (c.type === "Q") {
      // quadratic → cubic
      const prev = cur[cur.length - 1];
      const c1 = { x: last.x + (2 / 3) * (c.x1! - last.x), y: last.y + (2 / 3) * (c.y1! - last.y) };
      const c2 = { x: c.x! + (2 / 3) * (c.x1! - c.x!), y: c.y! + (2 / 3) * (c.y1! - c.y!) };
      prev.out = c1;
      cur.push({ p: { x: c.x!, y: c.y! }, in: c2, out: null });
      last = { x: c.x!, y: c.y! };
    } else if (c.type === "C") {
      cur[cur.length - 1].out = { x: c.x1!, y: c.y1! };
      cur.push({ p: { x: c.x!, y: c.y! }, in: { x: c.x2!, y: c.y2! }, out: null });
      last = { x: c.x!, y: c.y! };
    } else if (c.type === "Z") {
      // drop a duplicated closing point
      if (cur.length > 1) {
        const a = cur[0].p;
        const b = cur[cur.length - 1].p;
        if (Math.abs(a.x - b.x) < 0.01 && Math.abs(a.y - b.y) < 0.01) {
          cur[0].in = cur[cur.length - 1].in;
          cur.pop();
        }
      }
      contours.push(cur);
      cur = [];
    }
  }
  if (cur.length) contours.push(cur);
  return contours;
}

const r = (n: number) => Math.round(n * 100) / 100;
function serialize(contours: Contour[]) {
  return contours
    .map((ct) => {
      let d = `M${r(ct[0].p.x)},${r(ct[0].p.y)}`;
      ct.forEach((n, i) => {
        const nx = ct[(i + 1) % ct.length];
        if (n.out || nx.in) {
          const a = n.out ?? n.p;
          const b = nx.in ?? nx.p;
          d += `C${r(a.x)},${r(a.y)} ${r(b.x)},${r(b.y)} ${r(nx.p.x)},${r(nx.p.y)}`;
        } else d += `L${r(nx.p.x)},${r(nx.p.y)}`;
      });
      return d + "Z";
    })
    .join("");
}
const clone = (c: Contour[]): Contour[] =>
  c.map((ct) => ct.map((n) => ({ p: { ...n.p }, in: n.in && { ...n.in }, out: n.out && { ...n.out } })));

export function PenHeadline({
  text,
  label,
  hint,
  resetLabel,
  className,
  play,
}: {
  text: string; // drawn from the Latin display font's outlines
  label: string; // accessible (translated) name
  hint: string;
  resetLabel: string;
  className?: string;
  play: boolean;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const turb = useRef<SVGFEDisplacementMapElement>(null);
  const [box, setBox] = useState<{ w: number; h: number; y: number } | null>(null);
  const [d, setD] = useState("");
  const [dirty, setDirty] = useState(false);
  // anchors + handles near the pointer, snapshotted in the pointer handler (never read refs in render)
  const [overlay, setOverlay] = useState<{ items: Handle[]; u: number }>({ items: [], u: 1 });
  const fine = useFinePointer();
  const original = useRef<Contour[]>([]);
  const live = useRef<Contour[]>([]);
  const drag = useRef<{ ci: number; ni: number; key: "p" | "in" | "out"; last: Pt } | null>(null);
  const pointer = useRef<Pt | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { parse } = await import("opentype.js");
      const buf = await fetch(FONT_URL).then((r) => r.arrayBuffer());
      if (cancelled) return;
      const font = parse(buf);
      const size = 200;
      const path = font.getPath(text, 0, 0, size, { kerning: true });
      const bb = path.getBoundingBox();
      const contours = toContours(path.commands as never);
      // shift so the box starts at 0,0
      contours.forEach((ct) =>
        ct.forEach((n) => {
          for (const k of ["p", "in", "out"] as const) {
            const v = n[k];
            if (v) {
              v.x -= bb.x1;
              v.y -= bb.y1;
            }
          }
        }),
      );
      original.current = clone(contours);
      live.current = contours;
      setBox({ w: bb.x2 - bb.x1, h: bb.y2 - bb.y1, y: 0 });
      setD(serialize(contours));
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [text]);

  // Liquid entrance: the displacement settles to zero.
  useEffect(() => {
    if (!play || !turb.current || !box) return;
    const o = { s: 60 };
    const tw = gsap.to(o, {
      s: 0,
      duration: 1.1,
      ease: "power3.out",
      onUpdate: () => turb.current?.setAttribute("scale", String(o.s)),
    });
    return () => {
      tw.kill();
    };
  }, [play, box]);

  const toLocal = useCallback((e: { clientX: number; clientY: number }) => {
    const s = svg.current;
    const m = s?.getScreenCTM();
    if (!s || !m) return null;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: pt.x, y: pt.y };
  }, []);
  const scale = () => {
    const m = svg.current?.getScreenCTM();
    return m ? m.a : 1;
  };

  // Pick the nearest anchors (the dragged one always stays) and snapshot them for render.
  const updateOverlay = () => {
    const ptr = pointer.current;
    const k = scale();
    if (!ptr) return setOverlay({ items: [], u: 1 / k });
    const lim = NEAR / k;
    const all: { ci: number; ni: number; n: Node; dist: number }[] = [];
    live.current.forEach((ct, ci) => ct.forEach((n, ni) => all.push({ ci, ni, n, dist: Math.hypot(n.p.x - ptr.x, n.p.y - ptr.y) })));
    const picked: { ci: number; ni: number; n: Node }[] = [];
    const g = drag.current;
    if (g) picked.push({ ci: g.ci, ni: g.ni, n: live.current[g.ci][g.ni] });
    for (const a of all.filter((a) => a.dist < lim).sort((a, b) => a.dist - b.dist)) {
      if (picked.length >= MAX_SHOWN) break;
      if (picked.some((s) => Math.hypot(s.n.p.x - a.n.p.x, s.n.p.y - a.n.p.y) < 16 / k)) continue;
      picked.push(a);
    }
    setOverlay({
      items: picked.map(({ ci, ni, n }) => ({ ci, ni, p: { ...n.p }, in: n.in && { ...n.in }, out: n.out && { ...n.out } })),
      u: 1 / k,
    });
  };

  const redraw = () => {
    setD(serialize(live.current));
    updateOverlay();
  };

  const onMove = (e: React.PointerEvent) => {
    const p = toLocal(e);
    if (!p) return;
    pointer.current = p;
    const g = drag.current;
    if (!g) return updateOverlay();
    const dx = p.x - g.last.x;
    const dy = p.y - g.last.y;
    g.last = p;
    const n = live.current[g.ci][g.ni];
    if (g.key === "p") {
      for (const k of ["p", "in", "out"] as const) {
        const v = n[k];
        if (v) {
          v.x += dx;
          v.y += dy;
        }
      }
    } else {
      const v = n[g.key];
      if (v) {
        v.x += dx;
        v.y += dy;
      }
    }
    if (!dirty) setDirty(true);
    redraw();
  };

  const startDrag = (ci: number, ni: number, key: "p" | "in" | "out") => (e: React.PointerEvent) => {
    e.stopPropagation();
    svg.current?.setPointerCapture(e.pointerId);
    const p = toLocal(e);
    if (p) drag.current = { ci, ni, key, last: p };
  };
  const endDrag = () => (drag.current = null);

  const reset = () => {
    const from = clone(live.current);
    const to = original.current;
    const o = { t: 0 };
    gsap.to(o, {
      t: 1,
      duration: 0.7,
      ease: "power3.inOut",
      onUpdate: () => {
        live.current.forEach((ct, ci) =>
          ct.forEach((n, ni) => {
            for (const k of ["p", "in", "out"] as const) {
              const a = from[ci][ni][k];
              const b = to[ci][ni][k];
              const v = n[k];
              if (a && b && v) {
                v.x = a.x + (b.x - a.x) * o.t;
                v.y = a.y + (b.y - a.y) * o.t;
              }
            }
          }),
        );
        redraw();
      },
      onComplete: () => setDirty(false),
    });
  };

  const shown = fine ? overlay.items : [];
  const u = overlay.u; // one screen pixel in path units
  const pad = 30;

  return (
    <div className={className}>
      <h2 className="sr-only">{label}</h2>
      {box ? (
        <svg
          ref={svg}
          aria-hidden
          viewBox={`${-pad} ${-pad} ${box.w + pad * 2} ${box.h + pad * 2}`}
          className="block h-auto w-full touch-none overflow-visible"
          onPointerMove={fine ? onMove : undefined}
          onPointerLeave={() => {
            if (drag.current) return;
            pointer.current = null;
            setOverlay((o) => ({ ...o, items: [] }));
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <defs>
            <filter id="pen-liquid" x="-10%" y="-30%" width="120%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves="2" seed="3" />
              <feDisplacementMap ref={turb} in="SourceGraphic" scale={play ? 60 : 60} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <path d={d} fill="currentColor" filter="url(#pen-liquid)" />
          {shown.map((n, i) => (
            <g key={i}>
              {(["in", "out"] as const).map((k) => {
                const h = n[k];
                if (!h) return null;
                return (
                  <g key={k}>
                    <line x1={n.p.x} y1={n.p.y} x2={h.x} y2={h.y} stroke="var(--c-violet)" strokeWidth={u} />
                    <circle
                      cx={h.x}
                      cy={h.y}
                      r={4 * u}
                      fill="#fff"
                      stroke="var(--c-violet)"
                      strokeWidth={1.2 * u}
                      className="cursor-grab"
                      onPointerDown={startDrag(n.ci, n.ni, k)}
                    />
                  </g>
                );
              })}
              <rect
                x={n.p.x - 4.5 * u}
                y={n.p.y - 4.5 * u}
                width={9 * u}
                height={9 * u}
                fill="var(--c-violet)"
                stroke="#fff"
                strokeWidth={1.2 * u}
                className="cursor-grab"
                onPointerDown={startDrag(n.ci, n.ni, "p")}
              />
            </g>
          ))}
        </svg>
      ) : (
        <div aria-hidden className="font-display leading-none font-semibold whitespace-nowrap" style={{ fontSize: "11.4vw" }}>
          {text}
        </div>
      )}
      <div className="mt-2 flex h-7 items-center justify-between font-mono text-[10px] tracking-[0.16em] text-ink-3">
        <span className="hidden md:inline">{fine ? hint : ""}</span>
        {dirty && (
          <button onClick={reset} className="rounded-full border border-ink/15 bg-surface/70 px-3 py-1 text-ink hover:bg-surface">
            {resetLabel}
          </button>
        )}
      </div>
    </div>
  );
}
