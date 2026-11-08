"use client";

// Tiny shared state between the loader and the rest of the page:
// the hero waits for "released" before playing its entrance, and the
// loader hands its photo tile to the hero card ("handoff").
import type Lenis from "lenis";

type Listener = () => void;

const state = {
  released: false,
  handoff: false,
  lenis: null as Lenis | null,
  sound: true,
};
const listeners = new Set<Listener>();

export const intro = {
  get released() {
    return state.released;
  },
  get handoff() {
    return state.handoff;
  },
  get sound() {
    return state.sound;
  },
  setSound(on: boolean) {
    state.sound = on;
  },
  markHandoff() {
    state.handoff = true;
  },
  release() {
    if (state.released) return;
    state.released = true;
    listeners.forEach((l) => l());
  },
  onRelease(cb: Listener) {
    if (state.released) {
      cb();
      return () => {};
    }
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  set lenis(l: Lenis | null) {
    state.lenis = l;
  },
  get lenis() {
    return state.lenis;
  },
};

// Soft UI blips synthesised with WebAudio — no audio files to load.
let ctx: AudioContext | null = null;
export function blip(freq = 660, dur = 0.06, gain = 0.035) {
  if (!state.sound || typeof window === "undefined") return;
  try {
    ctx ??= new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  } catch {
    /* audio blocked — stay silent */
  }
}

// Original "systems online" power-up (inspired by sci-fi suit boot-ups — no film audio used):
// a filtered saw sweep rising over ~1.6s with a soft noise shimmer, then a two-note glow.
export function powerUp() {
  if (!state.sound || typeof window === "undefined") return;
  try {
    ctx ??= new AudioContext();
    const t0 = ctx.currentTime + 0.02;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, t0);
    out.gain.exponentialRampToValueAtTime(0.09, t0 + 0.5);
    out.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.1);
    out.connect(ctx.destination);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.Q.value = 9;
    lp.frequency.setValueAtTime(180, t0);
    lp.frequency.exponentialRampToValueAtTime(3200, t0 + 1.6);
    lp.connect(out);
    for (const [f0, f1, type, g] of [
      [55, 220, "sawtooth", 0.6],
      [82.5, 330, "sawtooth", 0.35],
      [110, 880, "sine", 0.25],
    ] as const) {
      const o = ctx.createOscillator();
      const og = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f0, t0);
      o.frequency.exponentialRampToValueAtTime(f1, t0 + 1.6);
      og.gain.value = g;
      o.connect(og).connect(lp);
      o.start(t0);
      o.stop(t0 + 2.2);
    }
    // shimmer: band-passed noise rising with the sweep
    const len = Math.floor(ctx.sampleRate * 2);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const n = ctx.createBufferSource();
    n.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 6;
    bp.frequency.setValueAtTime(800, t0);
    bp.frequency.exponentialRampToValueAtTime(6000, t0 + 1.6);
    const ng = ctx.createGain();
    ng.gain.value = 0.18;
    n.connect(bp).connect(ng).connect(out);
    n.start(t0);
    n.stop(t0 + 2);
  } catch {
    /* audio blocked — stay silent */
  }
}

/** The "online" chime played when the logo forms. */
export function onlineChime() {
  if (!state.sound || typeof window === "undefined") return;
  [
    [659.25, 0],
    [987.77, 0.12],
    [1318.5, 0.24],
  ].forEach(([f, d]) => setTimeout(() => blip(f, 0.45, 0.04), d * 1000));
}
