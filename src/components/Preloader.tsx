import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IDENTITY } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";

const COUNTS = [8, 7, 6, 5, 4, 3, 2];

const SLATE = [
  { k: "FRAME", v: "001" },
  { k: "PRODUCTION", v: "2026" },
  { k: "LOCATION", v: "MUMBAI, INDIA" },
];

type Phase = "boot" | "leader" | "slate" | "exit";

const T = { boot: 460, count: 300, slate: 760, exit: 900 };
const MIN_HOLD = 1500;

/**
 * Opening film leader. Countdown, sweep, slate, then a cut.
 * Anything the viewer can do to skip: click, tap, Space, Enter, Escape.
 */
export function Preloader({
  ready,
  onDone,
}: {
  ready: boolean;
  onDone: () => void;
}) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("boot");
  const [count, setCount] = useState(COUNTS[0]);
  const [sweep, setSweep] = useState(0);
  const [gone, setGone] = useState(false);

  const phaseRef = useRef<Phase>("boot");
  const readyRef = useRef(ready);
  const finishedRef = useRef(false);

  // Mirrored into a ref so the rAF clock reads the current value without
  // restarting the animation every time an asset lands.
  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setPhase("exit");
    window.setTimeout(() => {
      setGone(true);
      onDone();
    }, reduced ? 60 : 820);
  }, [onDone, reduced]);

  useEffect(() => {
    if (reduced) {
      const id = window.setTimeout(finish, 500);
      return () => window.clearTimeout(id);
    }

    let raf = 0;
    const t0 = performance.now();
    let currentPhase: Phase = "boot";
    let lastCount = -1;

    const bootEnd = T.boot;
    const leaderEnd = bootEnd + T.count * COUNTS.length;
    const slateEnd = leaderEnd + T.slate;

    const tick = (now: number) => {
      const t = now - t0;

      if (t < bootEnd) {
        currentPhase = "boot";
      } else if (t < leaderEnd) {
        currentPhase = "leader";
        const i = Math.min(COUNTS.length - 1, Math.floor((t - bootEnd) / T.count));
        if (i !== lastCount) {
          lastCount = i;
          setCount(COUNTS[i]);
        }
        const local = ((t - bootEnd) % T.count) / T.count;
        setSweep(local * 360);
      } else if (t < slateEnd) {
        currentPhase = "slate";
      } else {
        currentPhase = "exit";
      }

      if (currentPhase !== phaseRef.current) {
        phaseRef.current = currentPhase;
        setPhase(currentPhase);
      }

      const assetsOk = readyRef.current && t > MIN_HOLD;
      if (currentPhase === "exit" && assetsOk) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [finish, reduced]);

  useEffect(() => {
    const onKey = () => finish();
    const onDown = () => finish();
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [finish]);

  useEffect(() => {
    document.body.dataset.lock = "true";
    return () => {
      delete document.body.dataset.lock;
    };
  }, []);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="leader"
          data-phase={phase}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
          role="status"
          aria-live="polite"
          aria-label="Loading"
        >
          <div className="leader__grain" aria-hidden="true" />

          <motion.p
            className="leader__name t-mono"
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: phase === "boot" ? 1 : 0.35, letterSpacing: "0.34em" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {IDENTITY.full.toUpperCase()}
          </motion.p>

          {/* ---- Academy leader ---- */}
          <div className="leader__stage" aria-hidden={phase !== "leader"}>
            <svg className="leader__dial" viewBox="0 0 200 200" role="presentation">
              <circle className="leader__ring leader__ring--outer" cx="100" cy="100" r="88" />
              <circle className="leader__ring leader__ring--mid" cx="100" cy="100" r="66" />
              <circle className="leader__ring leader__ring--inner" cx="100" cy="100" r="26" />
              <line className="leader__cross" x1="0" y1="100" x2="200" y2="100" />
              <line className="leader__cross" x1="100" y1="0" x2="100" y2="200" />
              <g
                className="leader__sweepwrap"
                style={{ transform: `rotate(${sweep}deg)`, transformOrigin: "100px 100px" }}
              >
                <line className="leader__sweep" x1="100" y1="100" x2="100" y2="16" />
              </g>
            </svg>
            <span className="leader__count">{count}</span>
          </div>

          {/* ---- Slate ---- */}
          <div className="leader__slate" data-on={phase === "slate" || phase === "exit"}>
            <div className="leader__slate-inner">
              {SLATE.map((row, i) => (
                <div className="leader__row" key={row.k} style={{ ["--i" as string]: i }}>
                  <span className="t-mono-sm">{row.k}</span>
                  <span className="leader__rule" />
                  <span className="t-mono">{row.v}</span>
                </div>
              ))}
              <div className="leader__role t-mono-sm">
                {IDENTITY.roles.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="leader__bar" aria-hidden="true">
            <span
              className="leader__bar-fill"
              style={{
                transform: `scaleX(${ready ? 1 : 0.34})`,
                transitionDuration: reduced ? "0.2s" : "0.7s",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}