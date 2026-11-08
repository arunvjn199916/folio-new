"use client";

import { useEffect, useRef, useState } from "react";
import { motionDisabled } from "@/lib/a11y/store";

/*
  An original little rover as the pointer (not any existing character): the pointer tip
  stays exact at the hotspot; the rover rides just behind it and reacts to movement —
  leans into the direction of travel, its treads roll with speed, the eyes look where
  you're heading, it perks up over links and squashes on click, and bobs when idle.
  Only on fine pointers with motion allowed; touch, reduced motion and text fields keep
  the system cursor.
*/
export function RobotCursor() {
  const [on, setOn] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<SVGGElement>(null);
  const eyes = useRef<SVGGElement>(null);
  const treads = useRef<SVGPathElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)");
    // The accessibility panel's large cursors and Stop-animations both switch the rover off.
    const update = () => setOn(fine.matches && !motionDisabled() && !document.documentElement.hasAttribute("data-a11y-cursor"));
    const first = requestAnimationFrame(update);
    fine.addEventListener("change", update);
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-a11y-stop-animations", "data-a11y-cursor"] });
    return () => {
      cancelAnimationFrame(first);
      fine.removeEventListener("change", update);
      obs.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!on) return;
    const html = document.documentElement;
    html.classList.add("robot-cursor");
    let x = -100, y = -100, px = x, py = y, vx = 0, tilt = 0, roll = 0, t = 0, raf = 0;
    let hover = false, down = false, visible = false, text = false;

    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      const el = e.target as Element | null;
      hover = !!el?.closest("a, button, [role=button], label, summary, [data-cursor=hover]");
      text = !!el?.closest("input, textarea, select, [contenteditable=true]");
      if (!visible) { visible = true; px = x; py = y; }
    };
    const leave = () => { visible = false; };
    const press = () => { down = true; };
    const release = () => { down = false; };

    const tick = () => {
      t += 1;
      const dx = x - px, dy = y - py;
      px = x; py = y;
      vx += (dx - vx) * 0.25;
      const speed = Math.min(Math.hypot(dx, dy), 60);
      tilt += (Math.max(-18, Math.min(18, vx * 1.4)) - tilt) * 0.2;
      roll += vx * 0.9;
      const idle = speed < 0.5;
      const bob = idle ? Math.sin(t / 14) * 1.2 : 0;
      const scale = (hover ? 1.18 : 1) * (down ? 0.86 : 1);
      const el = root.current;
      if (el) {
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        el.style.opacity = visible && !text ? "1" : "0";
      }
      body.current?.setAttribute("transform", `translate(0 ${bob}) rotate(${tilt} 22 36) scale(${scale} ${down ? scale * 0.92 : scale})`);
      const ex = Math.max(-2.2, Math.min(2.2, dx * 0.25)), ey = Math.max(-1.6, Math.min(1.6, dy * 0.25));
      eyes.current?.setAttribute("transform", `translate(${ex} ${ey})`);
      treads.current?.setAttribute("stroke-dashoffset", String(-roll));
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    raf = requestAnimationFrame(tick);
    return () => {
      html.classList.remove("robot-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [on]);

  if (!on) return null;
  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed top-0 left-0 z-[2147483000] opacity-0 transition-opacity duration-200 will-change-transform">
      <svg width="46" height="52" viewBox="0 0 46 52" className="overflow-visible drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]">
        {/* exact pointer tip at the hotspot */}
        <path d="M0 0 L0 13 L3.6 9.6 L6.4 15.4 L8.6 14.4 L5.8 8.8 L10.6 8.6 Z" fill="#ffef93" stroke="#100001" strokeWidth="1.2" strokeLinejoin="round" />
        <g transform="translate(6 6)">
          <g ref={body}>
            {/* neck + binocular eyes */}
            <rect x="19.5" y="13" width="3" height="6" rx="1" fill="#6b5a3a" />
            <g ref={eyes}>
              <rect x="10" y="4" width="10" height="9" rx="4" fill="#d9d4c7" stroke="#100001" strokeWidth="1.2" />
              <rect x="22" y="4" width="10" height="9" rx="4" fill="#d9d4c7" stroke="#100001" strokeWidth="1.2" />
              <circle cx="15" cy="8.5" r="2.3" fill="#100001" />
              <circle cx="27" cy="8.5" r="2.3" fill="#100001" />
              <circle cx="15.8" cy="7.7" r="0.7" fill="#fff" />
              <circle cx="27.8" cy="7.7" r="0.7" fill="#fff" />
            </g>
            {/* body: a boxy rover in the site's crimson + champagne */}
            <rect x="9" y="18" width="24" height="16" rx="3" fill="#dc0208" stroke="#100001" strokeWidth="1.2" />
            <rect x="12" y="21" width="18" height="4" rx="1.5" fill="#ffef93" opacity="0.9" />
            <circle cx="14" cy="29.5" r="1.4" fill="#ffef93" />
            <rect x="18" y="28.5" width="11" height="2" rx="1" fill="#100001" opacity="0.5" />
            {/* treads: dashes roll with horizontal speed */}
            <rect x="6" y="34" width="30" height="8" rx="4" fill="#3a2f22" stroke="#100001" strokeWidth="1.2" />
            <path ref={treads} d="M10 38 H32" stroke="#ffef93" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="2.2 3" />
          </g>
        </g>
      </svg>
    </div>
  );
}
