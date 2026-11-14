import { useEffect, useRef } from "react";

/**
 * Calls `onReach` when the returned sentinel element scrolls into view.
 * Used to load the next page of an infinite query.
 */
export function useInfiniteScroll(onReach: () => void, enabled: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);
  const cb = useRef(onReach);
  cb.current = onReach;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && cb.current(), { rootMargin: "0% 0% 25% 0%" /* start loading a little before the end is visible */ });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  return ref;
}
