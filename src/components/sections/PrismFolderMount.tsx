"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { blip } from "@/lib/intro";
import { PlaceholderLabel } from "@/components/ui/PlaceholderLabel";
import { motionDisabled } from "@/lib/a11y/store";

type Win = { src: string | null; tint: string; w: number; h: number };

/*
  Shriya's "Prism folder": a folder with a tinted glass flap that catches the light.
  Click → the pictures fly out one after another into windows scattered in an ellipse
  around it. Windows drag and come to the front; Esc, a click outside or a click on the
  folder sends them back. The light on the flap is a small WebGL shader (iridescent
  streak + pointer glint) drawn only while something moves; CSS glass without WebGL.
*/
type FolderLabels = { name: string; items: string; open: string; close: string; screen: string };

export function PrismFolderMount({ windows, labels }: { windows: Win[]; labels: FolderLabels }) {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState(windows.map((_, i) => i));
  const area = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState({ x: 420, y: 230 });

  useEffect(() => {
    const fit = () => {
      const w = area.current?.offsetWidth ?? 900;
      setRadius({ x: Math.min(460, w * 0.4), y: Math.min(240, w * 0.26) });
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const toggle = useCallback(() => {
    setOpen((o) => {
      blip(o ? 380 : 560, 0.08, 0.04);
      return !o;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest("[data-folder-ui]")) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const front = (i: number) => setOrder((o) => [...o.filter((x) => x !== i), i]);

  return (
    <div ref={area} data-decor className="relative mx-auto mt-24 grid h-[640px] max-w-[1100px] place-items-center">
      {windows.map((w, i) => {
        const a = (i / windows.length) * Math.PI * 2 - Math.PI / 2 + 0.35;
        const tx = Math.cos(a) * radius.x;
        const ty = Math.sin(a) * radius.y;
        return (
          <motion.div
            key={i}
            data-folder-ui
            drag={open}
            dragMomentum
            dragElastic={0.15}
            onPointerDown={() => front(i)}
            initial={false}
            animate={
              open
                ? { x: tx, y: ty, scale: 1, opacity: 1, rotate: 0 }
                : { x: (i - windows.length / 2) * 6, y: -30 - i * 2, scale: 0.32, opacity: 0, rotate: (i - 2.5) * 4 }
            }
            transition={{ type: "spring", stiffness: 210, damping: 22, delay: open ? i * 0.06 : (windows.length - i) * 0.03 }}
            className={`absolute overflow-hidden rounded-[14px] border-[5px] border-photo bg-photo shadow-[0_24px_50px_-24px_rgba(26,24,34,0.55)] ${open ? "cursor-grab" : "pointer-events-none"}`}
            style={{ width: w.w, height: w.h, zIndex: 10 + order.indexOf(i), background: w.tint }}
          >
            {w.src ? (
              <Image src={w.src} alt="" fill sizes="240px" className="pointer-events-none object-cover object-top" draggable={false} />
            ) : (
              <PlaceholderLabel label={`${labels.screen} ${i + 1}`} />
            )}
          </motion.div>
        );
      })}

      <button
        data-folder-ui
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? labels.close : labels.open}
        className="group relative z-[60] flex flex-col items-center"
      >
        <Folder open={open} windows={windows} />
        <span className="mt-4 font-display text-[15px] font-semibold text-ink">{labels.name}</span>
        <span className="font-mono text-[11px] text-ink-3">{windows.length} {labels.items}</span>
      </button>
    </div>
  );
}

function Folder({ open, windows }: { open: boolean; windows: Win[] }) {
  return (
    <div className="relative h-[150px] w-[210px] transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.03]">
      {/* back panel + tab */}
      <div className="absolute top-0 left-0 h-6 w-[86px] rounded-t-[10px] bg-[#9a7bff]" />
      <div className="absolute inset-x-0 top-4 bottom-0 rounded-[12px] rounded-tl-none bg-[#9a7bff]" />
      {/* peeking pictures */}
      {windows.slice(0, 3).map((w, i) => (
        <motion.div
          key={i}
          animate={{ y: open ? -46 - i * 6 : -8 - i * 4, rotate: (i - 1) * 6, opacity: open ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="absolute top-8 h-[90px] w-[70px] rounded-[6px] border-2 border-photo shadow-sm"
          style={{ left: 40 + i * 42, background: w.tint }}
        />
      ))}
      {/* glass flap */}
      <motion.div
        animate={{ rotateX: open ? -38 : 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="absolute inset-x-0 top-10 bottom-0 origin-bottom overflow-hidden rounded-[12px] border border-white/50 bg-[linear-gradient(160deg,rgba(220,206,255,0.72),rgba(154,123,255,0.6))] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-[6px] [transform-style:preserve-3d]"
        style={{ transformPerspective: 600 }}
      >
        <GlassLight />
      </motion.div>
    </div>
  );
}

const frag = /* glsl */ `
precision highp float;
uniform vec2 uRes; uniform vec2 uMouse; uniform float uTime;
vec3 spectrum(float x){ return clamp(abs(mod(x*6.0+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.); }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  // diagonal streak that follows the pointer
  float d = uv.x + uv.y*0.6 - (uMouse.x + uMouse.y*0.6) - 0.15*sin(uTime*0.6);
  float streak = exp(-d*d*60.0);
  vec3 col = spectrum(uv.x*0.8 + uv.y*0.4 + uTime*0.05) * streak * 0.55;
  // pointer glint
  float g = exp(-distance(uv, uMouse)*distance(uv, uMouse)*40.0);
  col += vec3(1.0) * g * 0.35;
  // rim light
  float rim = smoothstep(0.92, 1.0, max(abs(uv.x-0.5), abs(uv.y-0.5))*2.0);
  col += vec3(1.0,0.95,1.0) * rim * 0.25;
  gl_FragColor = vec4(col, max(max(col.r,col.g),col.b));
}`;

function GlassLight() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el || motionDisabled()) return;
    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: false, dpr: Math.min(2, devicePixelRatio) });
    } catch {
      return;
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    el.appendChild(gl.canvas);
    Object.assign(gl.canvas.style, { width: "100%", height: "100%", display: "block", mixBlendMode: "screen" });
    const program = new Program(gl, {
      vertex: "attribute vec2 position; void main(){ gl_Position = vec4(position,0.,1.); }",
      fragment: frag,
      uniforms: { uRes: { value: [1, 1] }, uMouse: { value: [0.3, 0.6] }, uTime: { value: 0 } },
      transparent: true,
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const size = () => {
      renderer.setSize(el.offsetWidth, el.offsetHeight);
      program.uniforms.uRes.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    };
    size();
    const target = { x: 0.3, y: 0.6 };
    const cur = { x: 0.3, y: 0.6 };
    let raf = 0;
    let idle = 0;
    const frame = (t: number) => {
      cur.x += (target.x - cur.x) * 0.1;
      cur.y += (target.y - cur.y) * 0.1;
      program.uniforms.uMouse.value = [cur.x, cur.y];
      program.uniforms.uTime.value = t / 1000;
      renderer.render({ scene: mesh });
      // only animate while something is moving
      if (Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.001 || idle++ < 90) raf = requestAnimationFrame(frame);
      else raf = 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = Math.min(1.2, Math.max(-0.2, (e.clientX - r.left) / r.width));
      target.y = 1 - Math.min(1.2, Math.max(-0.2, (e.clientY - r.top) / r.height));
      idle = 0;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.remove();
    };
  }, []);
  return <div ref={host} aria-hidden className="pointer-events-none absolute inset-0" />;
}
