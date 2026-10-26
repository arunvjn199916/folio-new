"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/client";
import { BlurHeading } from "@/components/ui/Motion";
import { motionDisabled } from "@/lib/a11y/store";

/*
  Muskaan — "what I bring to the table": pills drop in under gravity when the section
  comes into view, tumble, and can be grabbed and thrown. DOM pills are driven by a
  Matter.js world; touch devices get the same pills, scattered and static.
*/
export function Skills() {
  const { skillPills, ui } = useI18n().dict;
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const pills = Array.from(el.querySelectorAll<HTMLElement>("[data-pill]"));
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = motionDisabled();
    if (!fine || reduce) return;
    pills.forEach((p) => (p.style.visibility = "hidden"));

    let cleanup = () => {};
    let started = false;
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting || started) return;
        started = true;
        io.disconnect();
        const M = await import("matter-js");
        const W = el.offsetWidth;
        const H = el.offsetHeight;
        // Extra solver iterations keep the resting pile from sinking into the floor.
        const engine = M.Engine.create({ gravity: { x: 0, y: 1 }, enableSleeping: true, positionIterations: 12, velocityIterations: 8 });
        const wall = { isStatic: true, render: { visible: false } };
        // Walls sit a few px inside the visible box (Matter allows a little overlap between
        // resting bodies), so pills never end up clipped by its edges.
        const INSET = 6;
        M.Composite.add(engine.world, [
          M.Bodies.rectangle(W / 2, H - INSET + 50, W * 2, 100, wall),
          M.Bodies.rectangle(INSET - 50, H / 2, 100, H * 3, wall),
          M.Bodies.rectangle(W - INSET + 50, H / 2, 100, H * 3, wall),
        ]);
        const bodies = pills.map((p, i) => {
          const w = p.offsetWidth;
          const h = p.offsetHeight;
          const b = M.Bodies.rectangle(80 + Math.random() * (W - 160), -60 - i * 45, w, h, {
            chamfer: { radius: h / 2 },
            restitution: 0.45,
            friction: 0.2,
            angle: (Math.random() - 0.5) * 0.8,
          });
          return { b, p, w, h };
        });
        M.Composite.add(engine.world, bodies.map((x) => x.b));
        // Once everything has dropped in, close the top so a hard throw can't fling a pill out.
        const ceiling = setTimeout(() => M.Composite.add(engine.world, M.Bodies.rectangle(W / 2, -50 + INSET, W * 2, 100, wall)), 2500);

        const mouse = M.Mouse.create(el);
        // Let the page keep scrolling over the box.
        const m = mouse as unknown as { mousewheel: EventListener };
        el.removeEventListener("wheel", m.mousewheel);
        el.removeEventListener("mousewheel", m.mousewheel);
        el.removeEventListener("DOMMouseScroll", m.mousewheel);
        const mc = M.MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
        M.Composite.add(engine.world, mc);

        pills.forEach((p) => {
          p.style.left = "0";
          p.style.top = "0";
          p.style.visibility = "visible";
        });
        let raf = 0;
        let last = performance.now();
        let acc = 0;
        const DT = 1000 / 60; // fixed 60 Hz sub-steps: stable at any frame rate
        const step = (t: number) => {
          acc = Math.min(acc + (t - last), DT * 4);
          last = t;
          while (acc >= DT) {
            M.Engine.update(engine, DT);
            acc -= DT;
          }
          // Safety net: anything thrown out of the box drops back in from the top.
          for (const { b } of bodies) {
            const { x, y } = b.position;
            if (y > H + 200 || y < -H || x < -200 || x > W + 200) {
              M.Body.setPosition(b, { x: W / 2, y: 40 });
              M.Body.setVelocity(b, { x: 0, y: 0 });
            }
          }
          for (const { b, p, w, h } of bodies) {
            if (b.isSleeping) continue; // resting pills keep their last transform
            p.style.transform = `translate(${b.position.x - w / 2}px, ${b.position.y - h / 2}px) rotate(${b.angle}rad)`;
          }
          raf = requestAnimationFrame(step);
        };
        // Simulate only while the box is on screen.
        const run = () => {
          if (raf) return;
          last = performance.now();
          raf = requestAnimationFrame(step);
        };
        const stop = () => {
          cancelAnimationFrame(raf);
          raf = 0;
        };
        const visible = new IntersectionObserver(([v]) => (v.isIntersecting ? run() : stop()));
        visible.observe(el);
        run();
        cleanup = () => {
          clearTimeout(ceiling);
          visible.disconnect();
          stop();
          M.Mouse.clearSourceEvents(mouse);
          M.Engine.clear(engine);
        };
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cleanup();
    };
  }, []);

  return (
    <section id="skills" className="relative bg-night px-6 pt-28 pb-10 text-on-night">
      <div className="mx-auto max-w-[1100px] text-center">
        <p className="font-serif text-[20px] text-on-night/60 italic">{ui.skills.eyebrow}</p>
        <BlurHeading className="mt-2 font-display text-[clamp(32px,3.8vw,50px)] leading-none font-semibold tracking-[-0.02em]">
          {ui.skills.title}
        </BlurHeading>
        <p className="mt-3 font-mono text-[11px] tracking-[0.16em] text-on-night/40">{ui.skills.hint}</p>
      </div>
      <div ref={box} className="cursor-grab relative mx-auto mt-6 h-[460px] max-w-[1100px] overflow-hidden select-none">
        {skillPills.map((s, i) => (
          <span
            key={s}
            data-pill
            className="absolute top-0 left-0 rounded-full border border-on-night/10 px-5 text-white py-2.5 text-[14px] font-medium whitespace-nowrap shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)]"
            style={{
              background: i % 3 === 0 ? "var(--c-pink)" : i % 3 === 1 ? "var(--c-violet)" : "#2b2836",
              // static scatter for touch / reduced motion; physics resets left/top to 0
              left: `${(i % 3) * 32 + 2}%`,
              top: `${Math.floor(i / 3) * 64 + 20}px`,
              transform: `rotate(${((i * 37) % 20) - 10}deg)`,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}
