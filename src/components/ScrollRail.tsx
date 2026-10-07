import { motion } from "motion/react";
import { NAV_ITEMS } from "../data/content";
import { scrollToTarget } from "../hooks/useLenis";
import { useReducedMotion } from "../hooks/useReducedMotion";
import type { RefObject } from "react";

/**
 * Right-edge production timeline. Doubles as the scroll progress readout
 * and as scene navigation, the way a shot list sits beside the script.
 */
export function ScrollRail({
  active,
  progress,
}: {
  active: string;
  progress: number;
}) {
  const reduced = useReducedMotion();

  return (
    <nav className="rail" aria-label="Scene timeline">
      <span className="rail__cap t-mono-sm">SCENE</span>
      <div className="rail__line" aria-hidden="true">
        <motion.span
          className="rail__fill"
          style={{ height: `${progress * 100}%` }}
          transition={reduced ? { duration: 0 } : { duration: 0.1 }}
        />
      </div>
      <ul className="rail__list">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                className="rail__marker"
                data-active={isActive}
                onClick={() => scrollToTarget(`#${item.id}`, -8)}
                aria-current={isActive ? "true" : undefined}
                aria-label={`Go to ${item.label}`}
              >
                <span className="rail__idx">{item.idx}</span>
                <span className="rail__tick" aria-hidden="true" />
                <span className="rail__label">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <span className="rail__foot t-mono-sm">
        {String(Math.round(progress * 100)).padStart(3, "0")}%
      </span>
    </nav>
  );
}

/** Thin vertical line that tracks reading position inside one section. */
export function ProgressLine({ progress }: { progress: RefObject<number> }) {
  return (
    <div className="pline" aria-hidden="true">
      <span className="pline__fill" style={{ transform: `scaleY(${progress.current ?? 0})` }} />
    </div>
  );
}