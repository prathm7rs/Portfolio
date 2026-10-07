import { useCallback, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

type TiltOptions = {
  /** degrees of rotation at the extreme of the pointer travel */
  max?: number;
  /** pixels of pointer travel that map to the full rotation */
  distance?: number;
  /** translate the card toward the pointer, in px */
  lift?: number;
  scale?: number;
};

/**
 * Pointer-reactive tilt used on the document cards. Writes transforms
 * straight to the node inside a rAF so hover never triggers React renders.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>({
  max = 6,
  distance = 320,
  lift = 8,
  scale = 1,
}: TiltOptions = {}) {
  const ref = useRef<T | null>(null);
  const frame = useRef(0);
  const reduced = useReducedMotion();

  const reset = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.transform = `scale(${scale})`;
    el.style.setProperty("--px", "0px");
    el.style.setProperty("--py", "0px");
  }, [scale]);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<T>) => {
      if (reduced) return;
      if (event.pointerType !== "mouse") return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      // Ease the rotation in over the first `distance` px of travel so the
      // card does not snap when the pointer first crosses its bounds.
      const travel = Math.min(1, Math.max(rect.width, rect.height) / distance);
      const gain = 0.35 + 0.65 * travel;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.transform = `perspective(1400px) rotateX(${(-py * max * gain).toFixed(3)}deg) rotateY(${(px * max * gain).toFixed(3)}deg) translate3d(0, ${-lift}px, 0) scale(${scale + 0.012})`;
        el.style.setProperty("--px", `${(px * lift).toFixed(2)}px`);
        el.style.setProperty("--py", `${(py * lift).toFixed(2)}px`);
      });
    },
    [distance, lift, max, reduced, scale],
  );

  const onPointerLeave = useCallback(() => reset(), [reset]);

  return { ref, onPointerMove, onPointerLeave, reset };
}