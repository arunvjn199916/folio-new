"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { motionDisabled } from "@/lib/a11y/store";

// Iridescent orb from the chatbot reference: a soft blob whose edge breathes, with cyan,
// blue and magenta swirling inside. `energy` speeds it up while the assistant is thinking.
const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uEnergy;
uniform vec2 uRes;

float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3,289.1))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.03; a*=0.5; } return v; }

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / min(uRes.x, uRes.y);
  float t = uTime * (0.35 + uEnergy * 0.9);
  float ang = atan(uv.y, uv.x);
  float r = length(uv);

  // breathing, lumpy silhouette
  float edge = 0.36 + 0.035*sin(ang*3.0 + t*1.3) + 0.03*sin(ang*5.0 - t*1.7) + 0.04*(fbm(vec2(ang*1.2, t*0.6)) - 0.5);
  float mask = 1.0 - smoothstep(edge - 0.07, edge + 0.035, r);

  // swirling colour field
  vec2 q = uv * 2.2;
  float a = t * 0.6;
  q = mat2(cos(a), -sin(a), sin(a), cos(a)) * q;
  float n = fbm(q + vec2(fbm(q + t*0.4), fbm(q - t*0.3)) * 1.6);

  vec3 cyan = vec3(0.37, 0.91, 0.97);
  vec3 blue = vec3(0.24, 0.42, 1.0);
  vec3 magenta = vec3(0.93, 0.23, 0.94);
  vec3 col = mix(cyan, blue, smoothstep(0.25, 0.65, n));
  col = mix(col, magenta, smoothstep(0.55, 0.85, n + uv.y*0.35 - uv.x*0.2));
  col = mix(col, vec3(1.0), smoothstep(0.2, 0.0, r) * 0.25);   // soft core light

  gl_FragColor = vec4(col * mask, mask);
}`;

export function Orb({ size, energy = 0, className }: { size: number; energy?: number; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const energyRef = useRef(energy);

  useEffect(() => {
    energyRef.current = energy;
  }, [energy]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: true, dpr: Math.min(2, devicePixelRatio), width: size, height: size });
    } catch {
      return; // CSS gradient fallback stays
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    el.appendChild(gl.canvas);
    Object.assign(gl.canvas.style, { width: "100%", height: "100%", display: "block" });
    el.style.background = "none"; // shader takes over from the CSS fallback
    const program = new Program(gl, {
      vertex: "attribute vec2 position; void main(){ gl_Position = vec4(position,0.,1.); }",
      fragment,
      uniforms: { uTime: { value: 0 }, uEnergy: { value: 0 }, uRes: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight] } },
      transparent: true,
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let raf = 0;
    let visible = true;
    let e = 0;
    const frame = (t: number) => {
      raf = 0;
      e += (energyRef.current - e) * 0.05;
      program.uniforms.uTime.value = t / 1000;
      program.uniforms.uEnergy.value = e;
      renderer.render({ scene: mesh });
      // with motion disabled it draws one still frame and stops
      if (visible && !motionDisabled() && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([v]) => {
      visible = v.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(el);
    const onVis = () => !document.hidden && !raf && (raf = requestAnimationFrame(frame));
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.remove();
    };
  }, [size]);

  return (
    <div
      ref={host}
      aria-hidden
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, #5ee7f7 0%, #3d6bff 45%, #ec3bf0 75%, transparent 76%)",
      }}
    />
  );
}
