import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IDENTITY, NAV_ITEMS } from "../data/content";
import { scrollToTarget } from "../hooks/useLenis";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function Navigation({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const sync = () => {
      if (!mq.matches) setOpen(false);
    };
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = useCallback((id: string) => {
    setOpen(false);
    // Let the overlay begin closing before the scroll starts.
    window.setTimeout(() => scrollToTarget(`#${id}`, -10), reduced ? 0 : 220);
  }, [reduced]);

  return (
    <>
      <header className="nav" data-condensed={condensed} data-open={open}>
        <button
          type="button"
          className="nav__mark"
          onClick={() => scrollToTarget("#hero", 0)}
          aria-label="Back to top"
          data-cursor="TOP"
        >
          <span className="nav__mark-name">{IDENTITY.full.toUpperCase()}</span>
          <span className="nav__mark-rule" aria-hidden="true" />
          <span className="nav__mark-role t-mono-sm">
            {IDENTITY.roles.toUpperCase()}
          </span>
        </button>

        <nav className="nav__links" aria-label="Primary">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="nav__link"
                  data-active={active === item.id}
                  onClick={() => go(item.id)}
                  data-cursor="GO"
                >
                  <span className="nav__num">{item.idx}</span>
                  <span className="nav__slash">/</span>
                  <span className="nav__text">{item.label}</span>
                  <span className="nav__underline" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <a
          className="nav__contact"
          href={`mailto:${IDENTITY.email}`}
          data-cursor="EMAIL"
          data-cursor-mode="text"
        >
          <span className="nav__contact-dot" aria-hidden="true" />
          <span className="t-mono">{IDENTITY.email}</span>
        </a>

        <button
          type="button"
          className="nav__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="scene-index"
        >
          <span className="t-mono-sm">{open ? "CLOSE" : "INDEX"}</span>
          <span className="nav__toggle-bars" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      </header>

      {/* Mobile / tablet: full-bleed index laid out like a scene list, not a hamburger menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="scene-index"
            className="index-overlay"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{
              duration: reduced ? 0.15 : 0.72,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <div className="index-overlay__grain" aria-hidden="true" />
            <p className="index-overlay__head t-mono">SCENE INDEX</p>
            <ul className="index-overlay__list">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ y: 22, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.14 + i * 0.06,
                    duration: reduced ? 0 : 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <button type="button" onClick={() => go(item.id)}>
                    <span className="index-overlay__idx">{item.idx}</span>
                    <span className="index-overlay__label">{item.label}</span>
                    <span className="index-overlay__arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="index-overlay__foot">
              <span className="t-mono-sm">{IDENTITY.location.toUpperCase()}</span>
              <a className="t-mono" href={`mailto:${IDENTITY.email}`}>
                {IDENTITY.email}
              </a>
              <a className="t-mono" href={IDENTITY.phoneHref}>
                {IDENTITY.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}