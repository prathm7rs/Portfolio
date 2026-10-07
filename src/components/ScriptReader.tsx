import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MOOD_LABEL, READER_SEQUENCE } from "../data/documents";
import { lockScroll } from "../hooks/useLenis";
import { useReducedMotion } from "../hooks/useReducedMotion";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * OPEN SCRIPT — a dedicated reading environment.
 * One page, centred, page counter, arrow-key navigation, wheel advance,
 * Escape to exit. Reads like stepping into an edit suite.
 */
export function ScriptReader({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pages = useMemo(() => READER_SEQUENCE.flatMap((s) => s.pages), []);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [entered, setEntered] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const wheelLock = useRef(false);
  const reduced = useReducedMotion();

  const applyZoom = useCallback((z: number) => {
    const clamped = Math.min(4, Math.max(1, z));
    setZoom(clamped);
    if (clamped <= 1.02) setOffset({ x: 0, y: 0 });
  }, []);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), pages.length - 1);
      setDir(clamped >= index ? 1 : -1);
      setIndex(clamped);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    },
    [index, pages.length],
  );

  useEffect(() => {
    if (open) {
      lockScroll(true);
      setEntered(false);
      setIndex(0);
      setHintVisible(true);
      const t = window.setTimeout(() => setEntered(true), reduced ? 0 : 620);
      const h = window.setTimeout(() => setHintVisible(false), 5200);
      return () => {
        window.clearTimeout(t);
        window.clearTimeout(h);
      };
    }
    lockScroll(false);
    return undefined;
  }, [open, reduced]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        go(index + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        go(0);
      } else if (e.key === "End") {
        e.preventDefault();
        go(pages.length - 1);
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        applyZoom(zoom * 1.25);
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        applyZoom(zoom * 0.8);
      } else if (e.key === "0") {
        e.preventDefault();
        applyZoom(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, go, index, pages.length, zoom, applyZoom]);

  // Wheel / trackpad advances pages, with a lock so one gesture = one page.
  useEffect(() => {
    if (!open) return;
    let timer = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (wheelLock.current) return;
      if (Math.abs(e.deltaY) < 12) return;
      wheelLock.current = true;
      go(index + (e.deltaY > 0 ? 1 : -1));
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        wheelLock.current = false;
      }, reduced ? 120 : 620);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.clearTimeout(timer);
    };
  }, [open, go, index, reduced]);

  const current = pages[index];
  const sheet = READER_SEQUENCE.find((s) => s.pages.some((p) => p.src === current?.src));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="reader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.12 : 0.5, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label="Screenplay reader"
        >
          {/* Cut to a darker room than the site itself */}
          <motion.div
            className="reader__void"
            aria-hidden="true"
            initial={{ scale: 1.06 }}
            animate={{ scale: entered ? 1 : 1.06 }}
            transition={{ duration: reduced ? 0 : 1.1, ease: EASE }}
          />
          <div className="reader__grain" aria-hidden="true" />

          <header className="reader__bar">
            <span className="reader__corner t-mono-sm">PROJECT DOCUMENT</span>
            <span className="reader__corner reader__corner--mid t-mono-sm">
              {MOOD_LABEL.lined.toUpperCase()}
            </span>
            <span className="reader__corner reader__corner--r t-mono-sm">
              TECHNICAL SAMPLE
            </span>
          </header>

          <div className="reader__stage">
            <div className="reader__page-well">
              <AnimatePresence initial={false} custom={dir} mode="wait">
                <motion.figure
                  key={current?.src}
                  className="reader__page paper-surface"
                  custom={dir}
                  drag={zoom > 1.02}
                  dragMomentum={false}
                  dragElastic={0.04}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  onDrag={(_: unknown, info: PanInfo) =>
                    setOffset({ x: info.offset.x, y: info.offset.y })
                  }
                  initial={
                    reduced
                      ? { opacity: 0, scale: zoom, x: offset.x }
                      : {
                          opacity: 0,
                          y: dir * 44,
                          x: offset.x,
                          rotate: dir * 0.8,
                          scale: zoom,
                          clipPath: "inset(6% 0 6% 0)",
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    x: offset.x,
                    rotate: 0,
                    scale: zoom,
                    clipPath: "inset(0% 0 0% 0)",
                  }}
                  exit={
                    reduced
                      ? { opacity: 0, scale: zoom, x: offset.x }
                      : {
                          opacity: 0,
                          y: dir * -32,
                          x: offset.x,
                          rotate: dir * -0.5,
                          scale: zoom,
                          clipPath: "inset(0 0 88% 0)",
                        }
                  }
                  transition={{ duration: reduced ? 0.12 : 0.62, ease: EASE }}
                >
                  <div className="reader__paper-grain" aria-hidden="true" />
                  <img
                    src={current?.src}
                    alt={`${sheet?.label ?? "Screenplay"} — page ${index + 1} of ${
                      pages.length
                    }. Technical proof-of-work sample from the supplied portfolio.`}
                    draggable={false}
                    decoding="async"
                  />
                  <span className="reader__sheet-tag t-mono-sm">
                    {sheet?.label.toUpperCase()}
                  </span>
                </motion.figure>
              </AnimatePresence>
            </div>
          </div>

          <footer className="reader__foot">
            <div className="reader__counter">
              <span className="t-mono-sm">PAGE</span>
              <span className="reader__counter-num t-mono">
                {String(index + 1).padStart(2, "0")}
                <i>/</i>
                {String(pages.length).padStart(2, "0")}
              </span>
            </div>

            <div className="reader__nav">
              <button
                type="button"
                className="reader__navbtn"
                onClick={() => go(index - 1)}
                disabled={index === 0}
                data-cursor="PREVIOUS PAGE"
              >
                <span aria-hidden="true">←</span> Previous Page
              </button>
              <button
                type="button"
                className="reader__navbtn"
                onClick={() => go(index + 1)}
                disabled={index === pages.length - 1}
                data-cursor="NEXT PAGE"
              >
                Next Page <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="reader__exit">
              <span className="t-mono-sm reader__exit-label">
                {index + 1} / {pages.length}
                {zoom > 1.02 ? ` · ${Math.round(zoom * 100)}%` : ""}
              </span>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={onClose}
                data-cursor="EXIT"
              >
                Exit Reader <span className="btn__arrow" aria-hidden="true">esc</span>
              </button>
            </div>
          </footer>

          <AnimatePresence>
            {hintVisible && (
              <motion.div
                className="reader__hint t-mono-sm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <span>← → NAVIGATE</span>
                <span>SCROLL PAGES</span>
                <span>ESC EXIT</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}