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
