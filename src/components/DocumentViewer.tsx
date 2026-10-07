import {
  AnimatePresence,
  motion,
  type PanInfo,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MOOD_LABEL,
  PROOF_GROUPS,
  flatten,
  type ProofGroup,
} from "../data/documents";
import { lockScroll } from "../hooks/useLenis";
import { useReducedMotion } from "../hooks/useReducedMotion";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5;
const EASE = [0.76, 0, 0.24, 1] as const;

type Props = {
  groupId: string | null;
  open: boolean;
  onClose: () => void;
  startPage?: number;
};

export function DocumentViewer({ groupId, open, onClose, startPage = 0 }: Props) {
  const group = useMemo<ProofGroup | null>(
    () => PROOF_GROUPS.find((g) => g.id === groupId) ?? null,
    [groupId],
  );
  const pages = useMemo(() => (group ? flatten(group) : []), [group]);

  const reduced = useReducedMotion();
  const [index, setIndex] = useState(startPage);
  const [dir, setDir] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [showThumbs, setShowThumbs] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fitMode, setFitMode] = useState(true);

  const shellRef = useRef<HTMLDivElement>(null);
  const thumbRailRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ dist: number; zoom: number } | null>(null);

  /* ---------------- open / close bookkeeping ---------------- */
  useEffect(() => {
    if (open) {
      lockScroll(true);
      setIndex(Math.min(Math.max(startPage, 0), Math.max(0, pages.length - 1)));
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setFitMode(true);
      setShowThumbs(window.innerWidth > 720);
      const t = window.setTimeout(() => closeBtnRef.current?.focus(), 380);
      return () => window.clearTimeout(t);
    }
    lockScroll(false);
    return undefined;
  }, [open, startPage, pages.length]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    if (!open) return;
    activeThumbRef.current?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index, open, reduced]);

  const clampOffset = useCallback(
    (next: { x: number; y: number }, z: number) => {
      if (z <= 1.02) return { x: 0, y: 0 };
      const el = shellRef.current?.querySelector(".viewer__stage") as HTMLElement | null;
      const rect = el?.getBoundingClientRect();
      if (!rect) return next;
      const limitX = Math.max(0, (rect.width * (z - 1)) / 2);
      const limitY = Math.max(0, (rect.height * (z - 1)) / 2);
      return {
        x: Math.min(limitX, Math.max(-limitX, next.x)),
        y: Math.min(limitY, Math.max(-limitY, next.y)),
      };
    },
    [],
  );

  /* ---------------- navigation ---------------- */
  const goTo = useCallback(
    (next: number, direction?: number) => {
      const clamped = Math.min(Math.max(next, 0), pages.length - 1);
      if (clamped === index) return;
      setDir(direction ?? (clamped > index ? 1 : -1));
      setIndex(clamped);
      setOffset({ x: 0, y: 0 });
      if (fitMode) setZoom(1);
    },
    [fitMode, index, pages.length],
  );

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  /* ---------------- zoom ---------------- */
  const applyZoom = useCallback(
    (z: number, keepOffset = false) => {
      const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
      setZoom(clamped);
      setFitMode(Math.abs(clamped - 1) < 0.02);
      setOffset((o) => (keepOffset ? clampOffset(o, clamped) : { x: 0, y: 0 }));
    },
    [clampOffset],
  );

  const zoomBy = useCallback(
    (factor: number) => applyZoom(zoom * factor, false),
    [applyZoom, zoom],
  );

  /* ---------------- keyboard ---------------- */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          goTo(0, -1);
          break;
        case "End":
          e.preventDefault();
          goTo(pages.length - 1, 1);
          break;
        case "+":
        case "=":
          e.preventDefault();
          zoomBy(1.25);
          break;
        case "-":
        case "_":
          e.preventDefault();
          zoomBy(0.8);
          break;
        case "0":
          e.preventDefault();
          applyZoom(1);
          break;
        case "t":
          setShowThumbs((v) => !v);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, next, prev, goTo, zoomBy, applyZoom, pages.length]);

  /* ---------------- wheel zoom ---------------- */
  useEffect(() => {
    if (!open) return;
    const el = shellRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0016);
      applyZoom(zoom * factor, true);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open, zoom, applyZoom]);

  /* ---------------- fullscreen ---------------- */
  const toggleFullscreen = useCallback(() => {
    const el = shellRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
  }, []);

  if (!group) return null;
  const current = pages[index];
  const mood = group.viewerMood;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="viewer"
          data-mood={mood}
          ref={shellRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.12 : 0.42, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label={`${group.title} — document viewer`}
        >
          {/* --- Backdrop --- */}
          <motion.div
            className="viewer__backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.1 : 0.6 }}
          />
          <div className="viewer__grain" aria-hidden="true" />
          <div className="viewer__grid" aria-hidden="true" />

          {/* --- Top bar --- */}
          <header className="viewer__bar">
            <div className="viewer__bar-left">
              <span className="viewer__seal" aria-hidden="true">
                <i />
              </span>
              <div className="viewer__ident">
                <span className="t-mono-sm viewer__doc-class">
                  {MOOD_LABEL[mood]}
                </span>
                <span className="t-mono viewer__doc-title">
                  {group.title.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="viewer__bar-right">
              <span className="t-mono-sm viewer__sheetname">
                {current.sheet.label.toUpperCase()}
              </span>
              <div className="viewer__tools">
                <button
                  type="button"
                  className="vtool"
                  onClick={() => zoomBy(0.8)}
                  aria-label="Zoom out"
                  data-cursor="OUT"
                >
                  −
                </button>
                <button
                  type="button"
                  className="vtool vtool--wide"
                  onClick={() => applyZoom(1)}
                  aria-label="Reset zoom to fit"
                  data-cursor="FIT"
                >
                  <span className="t-mono-sm">{Math.round(zoom * 100)}%</span>
                </button>
                <button
                  type="button"
                  className="vtool"
                  onClick={() => zoomBy(1.25)}
                  aria-label="Zoom in"
                  data-cursor="IN"
                >
                  +
                </button>
                <button
                  type="button"
                  className="vtool"
                  onClick={() => setShowThumbs((v) => !v)}
                  aria-label="Toggle thumbnail strip"
                  aria-pressed={showThumbs}
                  data-cursor="THUMBS"
                >
                  <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                    <rect x="1" y="3" width="14" height="10" fill="none" stroke="currentColor" />
                    <line x1="6" y1="3" x2="6" y2="13" stroke="currentColor" />
                    <line x1="10" y1="3" x2="10" y2="13" stroke="currentColor" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="vtool vtool--fs"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  aria-pressed={isFullscreen}
                  data-cursor="FULL"
                >
                  <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                    <path
                      d="M1 5V1h4M15 5V1h-4M1 11v4h4M15 11v4h-4"
                      fill="none"
                      stroke="currentColor"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="vtool vtool--close"
                  ref={closeBtnRef}
                  onClick={onClose}
                  aria-label="Close viewer"
                  data-cursor="CLOSE"
                >
                  <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                    <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" />
                    <line x1="13" y1="3" x2="3" y2="13" stroke="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* --- Stage --- */}
          <div className="viewer__stage">
            <button
              type="button"
              className="viewer__nav viewer__nav--prev"
              onClick={prev}
              disabled={index === 0}
              aria-label="Previous page"
              data-cursor="PREV"
            >
              <span className="viewer__nav-arrow">←</span>
              <span className="t-mono-sm viewer__nav-label">PREVIOUS</span>
            </button>

            <div className="viewer__page-well">
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.div
                  key={`${group.id}-${index}`}
                  className="viewer__page"
                  custom={dir}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, x: dir * 46, rotateY: dir * -7 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, x: dir * -34, rotateY: dir * 5 }}
                  transition={{ duration: reduced ? 0.12 : 0.62, ease: EASE }}
                  style={{ zIndex: index }}
                >
                  <motion.div
                    className="viewer__sheet paper-surface"
                    drag={zoom > 1.02}
                    dragMomentum={false}
                    dragElastic={0.02}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    onDrag={(_: unknown, info: PanInfo) => {
                      setOffset((o) =>
                        clampOffset({ x: o.x + info.offset.x, y: o.y + info.offset.y }, zoom),
                      );
                    }}
                    animate={{ scale: zoom, x: offset.x, y: offset.y }}
                    transition={{ duration: reduced ? 0 : 0.34, ease: EASE }}
                    onPointerDown={(e: React.PointerEvent) => {
                      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
                      if (pointers.current.size === 2) {
                        const [a, b] = Array.from(pointers.current.values());
                        pinchStart.current = {
                          dist: Math.hypot(a.x - b.x, a.y - b.y),
                          zoom,
                        };
                      }
                    }}
                    onPointerMove={(e: React.PointerEvent) => {
                      if (!pointers.current.has(e.pointerId)) return;
                      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
                      if (pointers.current.size === 2 && pinchStart.current) {
                        const [a, b] = Array.from(pointers.current.values());
                        const dist = Math.hypot(a.x - b.x, a.y - b.y);
                        const ratio = dist / Math.max(1, pinchStart.current.dist);
                        applyZoom(pinchStart.current.zoom * ratio, true);
                      }
                    }}
                    onPointerUp={(e: React.PointerEvent) => {
                      pointers.current.delete(e.pointerId);
                      if (pointers.current.size < 2) pinchStart.current = null;
                    }}
                    onPointerCancel={(e: React.PointerEvent) => {
                      pointers.current.delete(e.pointerId);
                      pinchStart.current = null;
                    }}
                  >
                    <div className="viewer__paper-grain" aria-hidden="true" />
                    <img
                      src={current.page.src}
                      alt={`${group.title} — ${current.sheet.label}, sheet ${
                        current.indexInSheet + 1
                      } of ${current.sheet.pages.length}. Extracted from the supplied portfolio PDF as a technical proof-of-work sample.`}
                      draggable={false}
                      loading="eager"
                      decoding="async"
                      width={current.page.w}
                      height={current.page.h}
                    />
                    <div className="viewer__sheet-shadow" aria-hidden="true" />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              type="button"
              className="viewer__nav viewer__nav--next"
              onClick={next}
              disabled={index === pages.length - 1}
              aria-label="Next page"
              data-cursor="NEXT"
            >
              <span className="t-mono-sm viewer__nav-label">NEXT</span>
              <span className="viewer__nav-arrow">→</span>
            </button>
          </div>

          {/* --- Footer --- */}
          <footer className="viewer__foot">
            <div className="viewer__counter">
              <span className="t-mono-sm">PAGE</span>
              <span className="viewer__counter-num t-mono">
                {String(index + 1).padStart(2, "0")}
                <i>/</i>
                {String(pages.length).padStart(2, "0")}
              </span>
            </div>

            <AnimatePresence initial={false}>
              {showThumbs && (
                <motion.div
                  className="viewer__thumbs"
                  ref={thumbRailRef}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0.12 : 0.42, ease: EASE }}
                >
                  <div className="viewer__thumbs-inner" ref={thumbRailRef}>
                    {pages.map((p, i) => (
                      <button
                        key={`${p.sheet.id}-${i}`}
                        type="button"
                        ref={i === index ? activeThumbRef : undefined}
                        className="vthumb"
                        data-active={i === index}
                        onClick={() => goTo(i, i > index ? 1 : -1)}
                        aria-label={`Go to page ${i + 1}`}
                        aria-current={i === index ? "true" : undefined}
                        data-cursor="PAGE"
                      >
                        <img src={p.page.thumb} alt="" loading="lazy" decoding="async" />
                        <span className="vthumb__num t-mono-sm">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {p.indexInSheet === 0 && (
                          <span className="vthumb__sheet" aria-hidden="true" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="viewer__hint t-mono-sm">
              <span>← → PAGE</span>
              <span>SCROLL ZOOM</span>
              <span>DRAG PAN</span>
              <span>T THUMBS</span>
              <span>ESC CLOSE</span>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Warms the first sheet of each group so the viewer opens without a flash. */
export function usePrefetchDocuments() {
  useEffect(() => {
    const urls: string[] = [];
    for (const g of PROOF_GROUPS) {
      for (const s of g.sheets) urls.push(s.pages[0].src, s.pages[0].thumb);
    }
    const run = () => {
      urls.forEach((u) => {
        const img = new Image();
        img.decoding = "async";
        img.src = u;
      });
    };
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(run);
      return () => win.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(run, 600);
    return () => window.clearTimeout(id);
  }, []);
}