import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "./useReducedMotion";

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/** Locks / releases page scroll without layout shift (scrollbar gutter). */
export function lockScroll(locked: boolean) {
  const body = document.body;
  if (locked) {
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.dataset.lock = "true";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
  } else {
    delete body.dataset.lock;
    body.style.paddingRight = "";
  }
}

/**
 * Lenis smooth scroll, wired to GSAP's ticker so there is exactly one
 * rAF loop for the whole site. Disabled entirely under reduced motion.
 */
export function useLenis() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      lenisInstance?.destroy();
      lenisInstance = null;
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      lerp: 0.1,
    });
    lenisInstance = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisInstance = null;
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, [reduced]);
}

/** Programmatic scroll used by the nav and the rail. */
export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset, duration: 1.5 });
  } else {
    const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}