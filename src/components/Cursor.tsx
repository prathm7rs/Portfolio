import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

type Mode = "default" | "text";

/**
 * A two-part cinematic cursor: a hard dot that tracks 1:1 and a ring that
 * lags behind it. Hover targets are declared declaratively with
 * `data-cursor="VIEW"`, so no component needs to re-render on hover.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState<Mode>("default");
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(pointer: fine)");
    const enabled = () => fine.matches && window.innerWidth >= 1024;
    if (!enabled()) return;

    setActive(true);
    document.documentElement.classList.add("has-custom-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const soft = { x: target.x, y: target.y };
    let visible = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        document.documentElement.classList.add("cursor-visible");
      }
      if (dot.current) {
        dot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      const hit = (e.target as Element | null)?.closest?.("[data-cursor]");
      const nextLabel = hit?.getAttribute("data-cursor") ?? "";
      const nextMode: Mode = hit?.getAttribute("data-cursor-mode") === "text" ? "text" : "default";
      setLabel((prev) => (prev === nextLabel ? prev : nextLabel));
      setMode((prev) => (prev === nextMode ? prev : nextMode));
    };

    const onLeaveWindow = () => {
      visible = false;
      document.documentElement.classList.remove("cursor-visible");
    };

    const onDown = () => document.documentElement.classList.add("cursor-down");
    const onUp = () => document.documentElement.classList.remove("cursor-down");

    const loop = () => {
      soft.x += (target.x - soft.x) * 0.16;
      soft.y += (target.y - soft.y) * 0.16;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${soft.x}px, ${soft.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeaveWindow);
      document.documentElement.classList.remove(
        "has-custom-cursor",
        "cursor-visible",
        "cursor-down",
      );
    };
  }, [reduced]);

  if (!active) return null;

  const expanded = label.length > 0;
  const ringSize = expanded ? 92 : mode === "text" ? 44 : 30;

  return (
    <div className="cursor" aria-hidden="true">
      <div
        ref={ring}
        className="cursor__ring"
        style={{ width: ringSize, height: ringSize }}
        data-expanded={expanded}
      >
        <span className="cursor__label">{label}</span>
      </div>
      <div ref={dot} className="cursor__dot" data-hidden={expanded} />
    </div>
  );
}