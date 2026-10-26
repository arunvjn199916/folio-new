"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

function mediaStore(query: string) {
  return {
    subscribe(cb: () => void) {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    get: () => window.matchMedia(query).matches,
  };
}

export function useMedia(query: string, serverFallback = false) {
  const store = mediaStore(query);
  return useSyncExternalStore(store.subscribe, store.get, () => serverFallback);
}

export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)");

// True once the element has been on screen; false again when it leaves (for pausing canvases).
export function useInView<T extends Element>(ref: React.RefObject<T | null>, rootMargin = "0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}
