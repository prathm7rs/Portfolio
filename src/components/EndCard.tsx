import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { IDENTITY } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The closing sequence. The room goes dark, the slate reads CUT TO BLACK,
 * the credit lands, a cursor blinks, and the run ends.
 * Scrolling back up returns to the site normally.
 */
export function EndCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.55 });
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState(reduced);

  useEffect(() => {
    if (!inView || reduced) return;
    const t = window.setTimeout(() => setTyped(true), 2200);
    return () => window.clearTimeout(t);
  }, [inView, reduced]);

  return (
    <div className="endcard" ref={ref} data-on={inView}>
      <div className="endcard__void" aria-hidden="true" />
      <div className="endcard__grain" aria-hidden="true" />

      <motion.p
        className="endcard__slate t-mono"
        initial={{ opacity: 0, letterSpacing: "0.7em" }}
        animate={inView ? { opacity: 1, letterSpacing: "0.34em" } : undefined}
        transition={{ duration: reduced ? 0.2 : 1.4, ease: EASE }}
      >
        CUT TO BLACK.
      </motion.p>

      <motion.div
        className="endcard__credit"
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1, delay: reduced ? 0 : 0.7, ease: EASE }}
      >
        <p className="endcard__name">{IDENTITY.full.toUpperCase()}</p>
        <p className="endcard__role t-mono-sm">{IDENTITY.roles.toUpperCase()}</p>
      </motion.div>

      <motion.div
        className="endcard__end"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: typed ? 1 : 0.35 } : undefined}
        transition={{ duration: 0.8, delay: reduced ? 0 : 1.6 }}
      >
        <span className="endcard__word t-mono">END</span>
        <span className="endcard__period">.</span>
        <span className="endcard__caret" aria-hidden="true" />
      </motion.div>

      <p className="endcard__tail t-mono-sm">
        SCROLL UP TO RETURN · {IDENTITY.locationShort.toUpperCase()}
      </p>
    </div>
  );
}