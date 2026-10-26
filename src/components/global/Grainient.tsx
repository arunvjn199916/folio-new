"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { cssVar, onThemeChange } from "@/lib/theme";
import { motionDisabled } from "@/lib/a11y/store";

// Fixed full-screen grain gradient (same technique as the Shalmali reference:
// warped noise blending three pastel colours, plus film grain), written for this site.
const vertex = /* glsl */ `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform vec3 uC4;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = uv * vec2(uRes.x/uRes.y, 1.0) * 1.6;
  float t = uTime * 0.05;
  // domain warp
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p + 3.0*q + vec2(1.7, 9.2) + t), fbm(p + 3.0*q + vec2(8.3, 2.8) - t));
  float f = fbm(p + 2.5*r);

  vec3 col = mix(uC1, uC2, smoothstep(0.15, 0.85, f));
  col = mix(col, uC3, smoothstep(0.35, 0.95, length(q)));
  col = mix(col, uC4, smoothstep(0.55, 1.1, r.x) * 0.6);

  // soft contrast curve
  col = mix(col, col*col*(3.0-2.0*col), 0.35);
  // film grain (static so it doesn't shimmer)
  float g = hash(gl_FragCoord.xy) - 0.5;
  col += g * 0.03;
  gl_FragColor = vec4(col, 1.0);
}
`;

const hex = (h: string) => {
  const n = parseInt(h.replace("#", ""), 16);
  return Number.isFinite(n) ? [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255] : [1, 1, 1];
};
// Colours come from the theme tokens (--c-grain-1..4), so dark mode re-tints the field.
const grainColors = () => ["--c-grain-1", "--c-grain-2", "--c-grain-3", "--c-grain-4"].map((v) => hex(cssVar(v)));

export function Grainient() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: Renderer;
    try {
      // The field is soft noise, so it renders at ~0.6x and the browser upscales it:
      // indistinguishable, and ~6x fewer pixels per frame than a retina-resolution canvas.
      renderer = new Renderer({ dpr: 0.6, alpha: false, antialias: false });
    } catch {
      return; // no WebGL: the CSS gradient underneath stays
    }
    const gl = renderer.gl;
    el.appendChild(gl.canvas);
    Object.assign(gl.canvas.style, { width: "100%", height: "100%", display: "block" });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: [1, 1] },
        uC1: { value: [1, 1, 1] },
        uC2: { value: [1, 1, 1] },
        uC3: { value: [1, 1, 1] },
        uC4: { value: [1, 1, 1] },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    // Resizing clears the canvas, so always draw a frame straight after (even if the
    // loop is paused because the tab is hidden) — otherwise it can sit black.
    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.uRes.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
      renderer.render({ scene: mesh });
    };
    resize();
    window.addEventListener("resize", resize);
    const onVisible = () => !document.hidden && renderer.render({ scene: mesh });
    const recolor = () => {
      const [c1, c2, c3, c4] = grainColors();
      program.uniforms.uC1.value = c1;
      program.uniforms.uC2.value = c2;
      program.uniforms.uC3.value = c3;
      program.uniforms.uC4.value = c4;
      renderer.render({ scene: mesh });
    };
    recolor();
    const stopWatching = onThemeChange(recolor);
    document.addEventListener("visibilitychange", onVisible);

    let raf = 0;
    let last = 0;
    // Checked every frame so the Stop-animations setting freezes the field immediately
    // (the last frame stays on screen).
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || motionDisabled() || t - last < 33) return; // ~30fps is plenty for a slow drift
      last = t;
      program.uniforms.uTime.value = t / 1000;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisible);
      stopWatching();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.remove();
    };
  }, []);

  return (
    <div
      ref={host}
      data-decor
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20"
      style={{ background: "linear-gradient(135deg, var(--c-grain-1), var(--c-grain-2) 55%, var(--c-grain-3))" }}
    />
  );
}
