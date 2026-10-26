"use client";

import { useEffect, useRef } from "react";
import { cssVar, onThemeChange } from "@/lib/theme";

// Dot grid that brightens and grows around the cursor (Shalmali reference:
// dot radius 2, spacing 24, glow radius 150). Drawn on a fixed 2D canvas.
// The glow colour comes from the --c-glow token ("r g b"), so it follows the theme.
export function DotGlow({ radius = 2, spacing = 24, glowRadius = 150 }: { radius?: number; spacing?: number; glowRadius?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mouse = { x: -1000, y: -1000, tx: -1000, ty: -1000 };
    let raf = 0;
    let drawn = { x: NaN, y: NaN }; // mouse position at the last redraw
    let glow = cssVar("--c-glow") || "123 92 255";
    const stopWatching = onThemeChange(() => {
      glow = cssVar("--c-glow") || glow;
      drawn = { x: NaN, y: NaN };
    });
    const dpr = Math.min(2, window.devicePixelRatio);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawn = { x: NaN, y: NaN }; // resizing cleared the canvas
    };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    const onLeave = () => {
      mouse.tx = -1000;
      mouse.ty = -1000;
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      mouse.x += (mouse.tx - mouse.x) * 0.18;
      mouse.y += (mouse.ty - mouse.y) * 0.18;
      // Nothing moved since the last frame: keep the canvas as it is.
      if (Math.abs(mouse.x - drawn.x) < 0.3 && Math.abs(mouse.y - drawn.y) < 0.3) return;
      drawn = { x: mouse.x, y: mouse.y };
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      // Only draw dots inside the glow — the rest of the grid is CSS-free and invisible,
      // so the effect reads as dots "appearing" under the cursor.
      const x0 = Math.max(0, Math.floor((mouse.x - glowRadius) / spacing) * spacing);
      const y0 = Math.max(0, Math.floor((mouse.y - glowRadius) / spacing) * spacing);
      for (let x = x0; x < Math.min(w, mouse.x + glowRadius); x += spacing) {
        for (let y = y0; y < Math.min(h, mouse.y + glowRadius); y += spacing) {
          const d = Math.hypot(x - mouse.x, y - mouse.y);
          if (d > glowRadius) continue;
          const k = 1 - d / glowRadius;
          ctx.beginPath();
          ctx.fillStyle = `rgb(${glow} / ${0.12 + k * 0.55})`;
          ctx.arc(x, y, radius * (1 + k * 0.6), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      stopWatching();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [radius, spacing, glowRadius]);

  return <canvas ref={ref} data-decor aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen" />;
}
