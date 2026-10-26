"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, animate } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { isBool, safeStore } from "@/lib/utils";

const W = 320;
const W_MIN = 172;
const BODY = 152;
const GAP = 16;
// The chat button lives bottom-left, so a player parked there sits above it.
const CHAT_CLEARANCE = 84;

type Corner = "tl" | "tr" | "bl" | "br";
const isCorner = (v: unknown): v is Corner => v === "tl" || v === "tr" || v === "bl" || v === "br";

const anchor = (c: Corner): React.CSSProperties => ({
  [c[1] === "r" ? "right" : "left"]: GAP,
  [c[0] === "b" ? "bottom" : "top"]: c === "bl" ? GAP + CHAT_CLEARANCE : c[0] === "b" ? GAP : 84,
});

/*
  Niyas reference: a dark "Now Playing" window with an equaliser, draggable by its header,
  collapsible to a pill. It is anchored to a corner with CSS (so minimising, expanding and
  resizing the window keep it there). Dragging moves it freely; on release it springs to the
  nearest corner. Corner and minimised state persist locally.
*/
export function MusicPlayer() {
  const { profile, ui } = useI18n().dict;
  const t = ui.player;
  const box = useRef<HTMLDivElement>(null);
  const [corner, setCorner] = useState<Corner>("br");
  const [free, setFree] = useState<{ x: number; y: number } | null>(null);
  const [min, setMin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drag = useRef<{ dx: number; dy: number; sx: number; sy: number; moved: boolean } | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- browser-only preferences, read after mount */
    setCorner(safeStore.get("player-corner", isCorner) ?? "br");
    setMin(safeStore.get("player-min", isBool) ?? window.innerWidth < 768);
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button") || !box.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = box.current.getBoundingClientRect();
    drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top, sx: e.clientX, sy: e.clientY, moved: false };
    setFree({ x: r.left, y: r.top });
  };

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 4) return;
    d.moved = true;
    setFree({ x: e.clientX - d.dx, y: e.clientY - d.dy });
  };

  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    const el = box.current;
    if (!d || !el) return;
    if (!d.moved) return setFree(null);

    // Nearest corner by the window's centre, then spring there and hand back to CSS anchoring.
    const r = el.getBoundingClientRect();
    const c: Corner = `${r.top + r.height / 2 < window.innerHeight / 2 ? "t" : "b"}${r.left + r.width / 2 < window.innerWidth / 2 ? "l" : "r"}`;
    const a = anchor(c);
    const tx = c[1] === "r" ? window.innerWidth - r.width - GAP : GAP;
    const ty = c[0] === "b" ? window.innerHeight - r.height - (a.bottom as number) : (a.top as number);
    const from = { x: r.left, y: r.top };
    const spring = { type: "spring", stiffness: 420, damping: 34 } as const;
    animate(from.x, tx, { ...spring, onUpdate: (x) => setFree((p) => (p ? { ...p, x } : p)) });
    animate(from.y, ty, {
      ...spring,
      onUpdate: (y) => setFree((p) => (p ? { ...p, y } : p)),
      onComplete: () => {
        setCorner(c);
        setFree(null);
        safeStore.set("player-corner", c);
      },
    });
  };

  const toggle = () => {
    setMin((m) => {
      safeStore.set("player-min", !m);
      return !m;
    });
  };

  if (!mounted) return null;

  return (
    <motion.div
      ref={box}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1, width: min ? W_MIN : Math.min(W, window.innerWidth - GAP * 2) }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      data-music-player
      className="fixed z-40 overflow-hidden rounded-xl border border-white/10 bg-[#2a2a2a] shadow-2xl"
      style={free ? { left: free.x, top: free.y } : anchor(corner)}
    >
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="cursor-grab flex touch-none items-center justify-between border-b border-white/10 px-3 py-2 select-none"
      >
        <div className="pointer-events-none flex items-center gap-2">
          <div aria-hidden className="flex h-3 w-3.5 items-end gap-[2px]">
            <span className="w-[2px] rounded-[1px] bg-white" style={{ animation: "eq-1 .7s ease-in-out infinite" }} />
            <span className="w-[2px] rounded-[1px] bg-white" style={{ animation: "eq-2 .55s ease-in-out -.2s infinite" }} />
            <span className="w-[2px] rounded-[1px] bg-white" style={{ animation: "eq-3 .85s ease-in-out -.4s infinite" }} />
          </div>
          <span className="text-xs font-medium tracking-wide whitespace-nowrap text-white/90">{t.nowPlaying}</span>
        </div>
        <button
          onClick={toggle}
          title={min ? t.expand : t.minimize}
          aria-label={min ? t.expand : t.minimize}
          className="grid size-6 shrink-0 place-items-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          {min ? <Plus size={14} /> : <Minus size={14} />}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {!min && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: BODY, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <iframe
              title={t.title}
              src={profile.spotifyEmbed}
              width="100%"
              height={BODY}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation"
              referrerPolicy="strict-origin-when-cross-origin"
              className="block border-0"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
