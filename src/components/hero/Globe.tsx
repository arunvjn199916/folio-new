"use client";

import { useEffect, useRef } from "react";
import { PORTRAIT_POINTS } from "@/content/portrait-points";

/*
  Dot globe for the v2 hero, drawn on one 2D canvas.

  `progress` (0 → 1) is written by the hero's scroll trigger and read every frame:
    0.00–0.32  a huge planet horizon behind the headline pulls back into a globe on the right
    0.28–0.52  "users" (a share of the dots) light up in the accent colour
    0.50–0.82  dots fly off the globe and draw Arun's portrait outline (top to bottom),
               traced from his photo (content/portrait-points.ts); the planet fades away
  The globe spins slowly on its own and can be dragged (with inertia). Colours come from
  the theme tokens (--c-globe-dot / --c-globe-lit / --c-globe-rim), re-read on theme change.
*/

type Props = {
  progress: React.RefObject<number>;
  still?: boolean;
  className?: string;
  label: string;
};

const N = 1150;
const LIT_SHARE = 0.14;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function readRgb(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return (v || fallback).split(/[\s,]+/).map(Number) as [
    number,
    number,
    number,
  ];
}

function makeSprite(rgb: [number, number, number], size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  grad.addColorStop(0, `rgba(${rgb.join(",")},0.95)`);
  grad.addColorStop(0.18, `rgba(${rgb.join(",")},0.55)`);
  grad.addColorStop(0.5, `rgba(${rgb.join(",")},0.12)`);
  grad.addColorStop(1, `rgba(${rgb.join(",")},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export function Globe({ progress, still = false, className, label }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    let W = 0;
    let H = 0;
    let dpr = 1;

    // Fibonacci sphere + per-dot randomness (lit threshold, twinkle phase).
    const pts = new Float32Array(N * 3);
    const thr = new Float32Array(N);
    const phase = new Float32Array(N);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = golden * i;
      pts[i * 3] = Math.cos(a) * r;
      pts[i * 3 + 1] = y;
      pts[i * 3 + 2] = Math.sin(a) * r;
      // pseudo-random but stable
      const h = Math.sin(i * 12.9898) * 43758.5453;
      thr[i] = h - Math.floor(h);
      phase[i] = (thr[i] * 997) % (Math.PI * 2);
    }
    const stars = Array.from({ length: 140 }, (_, i) => {
      const h = Math.sin(i * 78.233) * 12543.123;
      const f = h - Math.floor(h);
      const g = Math.sin(i * 39.425) * 9821.77;
      return {
        x: f,
        y: g - Math.floor(g),
        s: 0.4 + ((i * 7) % 10) / 12,
        p: f * 6.28,
      };
    });

    // Portrait: each outline point gets one globe dot (lit "users" first, then the rest).
    // Points are ordered top → bottom so the drawing builds from the hair down.
    // Bust crop (head, shoulders, collar — the crossed arms crowd the hero copy), re-centred
    // and scaled back to [-1, 1] so the face reads large.
    const bust: number[] = [];
    for (let k = 0; k < PORTRAIT_POINTS.length; k += 2)
      if (PORTRAIT_POINTS[k + 1] < 0.42)
        bust.push(PORTRAIT_POINTS[k], PORTRAIT_POINTS[k + 1]);
    let bx0 = Infinity,
      bx1 = -Infinity,
      by0 = Infinity,
      by1 = -Infinity;
    for (let k = 0; k < bust.length; k += 2) {
      bx0 = Math.min(bx0, bust[k]);
      bx1 = Math.max(bx1, bust[k]);
      by0 = Math.min(by0, bust[k + 1]);
      by1 = Math.max(by1, bust[k + 1]);
    }
    const bs = Math.max(bx1 - bx0, by1 - by0) / 2;
    const PP = new Float32Array(bust.length);
    for (let k = 0; k < bust.length; k += 2) {
      PP[k] = (bust[k] - (bx0 + bx1) / 2) / bs;
      PP[k + 1] = (bust[k + 1] - (by0 + by1) / 2) / bs;
    }
    const M = Math.min(PP.length / 2, N);
    const order = Array.from({ length: M }, (_, k) => k).sort(
      (a, b) => PP[a * 2 + 1] - PP[b * 2 + 1],
    );
    const byThr = Array.from({ length: N }, (_, i) => i).sort(
      (a, b) => thr[a] - thr[b],
    );
    const target = new Int32Array(N).fill(-1); // globe dot → slot in `order`
    for (let k = 0; k < M; k++) target[byThr[k]] = k;
    const delayOf = (k: number) => (k / M) * 0.4;

    let dot: [number, number, number] = [247, 241, 227];
    let lit: [number, number, number] = [255, 239, 147];
    let rim: [number, number, number] = [220, 2, 8];
    let litSprite = makeSprite(lit, 40);
    let rimHi: [number, number, number] = [255, 90, 79];
    let paper: [number, number, number] = [16, 0, 1];
    let glow = 1;
    const readColors = () => {
      dot = readRgb("--c-globe-dot", "247 241 227");
      lit = readRgb("--c-globe-lit", "255 239 147");
      rim = readRgb("--c-globe-rim", "220 2 8");
      rimHi = readRgb("--c-globe-rim-hi", "255 90 79");
      paper = readRgb("--c-globe-body", "16 0 1");
      glow = Number(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--c-globe-glow")
          .trim() || 1,
      );
      litSprite = makeSprite(lit, 40);
    };
    readColors();
    const themeObs = new MutationObserver(readColors);
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const resize = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width;
      H = r.height;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    // Rotation state: yaw spins, pitch tilts; drag adds velocity that decays.
    let yaw = 0.6;
    let pitch = -0.32;
    let vYaw = 0;
    let vPitch = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      cv.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      vYaw = dx * 0.006;
      vPitch = e.pointerType === "touch" ? 0 : dy * 0.004;
      yaw += vYaw;
      pitch = Math.max(-1.1, Math.min(1.1, pitch + vPitch));
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      if (cv.hasPointerCapture(e.pointerId))
        cv.releasePointerCapture(e.pointerId);
    };
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onUp);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(cv);

    let raf = 0;
    let time = 0;
    let last = performance.now();
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || document.hidden || W === 0) return;
      time += dt;

      const p = still ? 0.95 : (progress.current ?? 0); // motion off: show the finished portrait
      if (!dragging) {
        yaw += vYaw + (still ? 0 : dt * 0.09);
        pitch = Math.max(-1.1, Math.min(1.1, pitch + vPitch));
        vYaw *= 0.94;
        vPitch *= 0.9;
      }

      // Layout: horizon → globe
      const mobile = W < 768;
      const pull = smooth(0.0, 0.32, p);
      const hR = Math.max(W * 0.95, H * 1.6);
      const hCx = W * 0.5;
      const hCy = H * (mobile ? 0.42 : 0.2) + hR;
      const gR = mobile
        ? Math.min(W * 0.46, H * 0.3)
        : Math.min(W * 0.27, H * 0.38);
      const gCx = mobile ? W * 0.5 : W * 0.7;
      const gCy = mobile ? H * 0.6 : H * 0.47;
      const form = smooth(0.5, 0.82, p);
      const R = mix(hR, gR, pull) * (1 - form * 0.08);
      const cx = mix(hCx, gCx, pull);
      const cy = mix(hCy, gCy, pull);
      const litF = smooth(0.28, 0.52, p);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // background stars, drifting slowly with scroll
      for (const s of stars) {
        const tw = 0.35 + 0.35 * Math.sin(time * 1.2 + s.p);
        ctx.globalAlpha = tw * 0.8;
        ctx.fillStyle = `rgb(${dot.join(",")})`;
        const sx = s.x * W;
        const sy = ((s.y - p * 0.15 + 1) % 1) * H;
        ctx.fillRect(sx, sy, s.s, s.s);
      }

      // planet body: darker than space, lit towards the rim
      const fade = 1 - form * 0.92;
      const body = ctx.createRadialGradient(
        cx - R * 0.25,
        cy - R * 0.3,
        R * 0.05,
        cx,
        cy,
        R,
      );
      // light theme starts from the body colour (crimson → cream would interpolate through pink)
      body.addColorStop(
        0,
        glow < 1
          ? `rgba(${paper.join(",")},0.6)`
          : `rgba(${rim.join(",")},0.14)`,
      );
      body.addColorStop(0.55, `rgba(${paper.join(",")},0.92)`);
      body.addColorStop(0.93, `rgba(${paper.join(",")},0.86)`);
      body.addColorStop(1, `rgba(${rim.join(",")},${0.35 * glow})`);
      ctx.globalAlpha = fade;
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();
      // atmosphere: layered strokes give a soft glow band with a bright edge
      for (const [w, a] of [
        [70, 0.05],
        [34, 0.09],
        [14, 0.18],
        [5, 0.4],
      ] as const) {
        ctx.globalAlpha = a * fade * glow;
        ctx.strokeStyle = `rgb(${rim.join(",")})`;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.arc(cx, cy, R + w * 0.3, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.95 * fade;
      ctx.strokeStyle = `rgb(${rimHi.join(",")})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // dots
      const cyw = Math.cos(yaw);
      const syw = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const dotCol = `rgb(${dot.join(",")})`;
      ctx.fillStyle = dotCol;
      const litList: number[] = [];
      const portraitList: number[] = [];
      // portrait frame: where the globe sits, a little larger than it
      const pS = mobile
        ? Math.min(W * 0.36, H * 0.22)
        : Math.min(H * 0.34, W * 0.19);
      const pcx = mobile ? W * 0.62 : W * 0.78;
      const pcy = mobile ? H * 0.6 : H * 0.44;
      for (let i = 0; i < N; i++) {
        const x0 = pts[i * 3];
        const y0 = pts[i * 3 + 1];
        const z0 = pts[i * 3 + 2];
        const x1 = x0 * cyw + z0 * syw;
        const z1 = -x0 * syw + z0 * cyw;
        const y2 = y0 * cp - z1 * sp;
        const z2 = y0 * sp + z1 * cp;
        let sx = cx + x1 * R;
        let sy = cy - y2 * R;
        const slot = target[i];
        if (slot >= 0 && form > 0) {
          const tk = smooth(0, 1, (form - delayOf(slot)) / 0.6);
          if (tk > 0) {
            const k = order[slot];
            sx = mix(sx, pcx + PP[k * 2] * pS, tk);
            sy = mix(sy, pcy + PP[k * 2 + 1] * pS, tk);
            portraitList.push(sx, sy, tk, z2);
            continue;
          }
        }
        const isLit = thr[i] < LIT_SHARE && thr[i] / LIT_SHARE < litF;
        if (isLit && z2 > -0.2) {
          if (sx > -20 && sx < W + 20 && sy > -20 && sy < H + 20)
            litList.push(sx, sy, z2);
          continue;
        }
        if (sx < -4 || sx > W + 4 || sy < -4 || sy > H + 4) continue;
        const front = z2 > 0;
        const a = (front ? 0.22 + 0.5 * z2 : 0.07) * (1 - form);
        if (a < 0.01) continue;
        ctx.globalAlpha = a * (0.75 + 0.25 * Math.sin(time * 2 + phase[i]));
        const s = front ? 1.1 + z2 * 0.9 : 0.9;
        ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
      }
      // lit dots on top: glow sprite + core
      for (let k = 0; k < litList.length; k += 3) {
        const sx = litList[k];
        const sy = litList[k + 1];
        const z = litList[k + 2];
        const g = 16 + z * 8;
        ctx.globalAlpha = (0.55 + 0.35 * z) * glow;
        ctx.drawImage(litSprite, sx - g / 2, sy - g / 2, g, g);
        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgb(${lit.join(",")})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.6 + z * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      // the portrait: dots in flight brighten as they land; a slow twinkle once formed
      ctx.fillStyle = `rgb(${lit.join(",")})`;
      for (let k = 0; k < portraitList.length; k += 4) {
        const sx = portraitList[k];
        const sy = portraitList[k + 1];
        const tk = portraitList[k + 2];
        const z = portraitList[k + 3];
        const base = mix(z > 0 ? 0.35 + 0.5 * z : 0.12, 1, tk);
        // on phones the portrait sits behind the copy, so it is drawn at half strength
        const tw = (0.85 + 0.15 * Math.sin(time * 1.6 + k)) * (mobile ? 0.5 : 1);
        const g = 9 + tk * 7;
        ctx.globalAlpha = base * tw * (0.35 + 0.45 * tk) * glow;
        ctx.drawImage(litSprite, sx - g / 2, sy - g / 2, g, g);
        ctx.globalAlpha = base * tw;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.1 + tk * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointercancel", onUp);
    };
  }, [progress, still]);

  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label={label}
      className={className}
      style={{ touchAction: "pan-y" }}
    />
  );
}
