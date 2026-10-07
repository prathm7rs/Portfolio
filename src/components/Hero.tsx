import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { HERO_STATEMENT, IDENTITY } from "../data/content";
import { scrollToTarget } from "../hooks/useLenis";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { RevealChars } from "./Reveal";

const SLUG = [
  { k: "REEL", v: "01" },
  { k: "FORMAT", v: "16 : 9" },
  { k: "STOCK", v: "MONO / WARM" },
  { k: "UNIT", v: "MUMBAI" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ entered }: { entered: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const nameY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const plateY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const metaOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const show = entered ? "show" : "hidden";

  return (
    <section id="hero" className="hero" ref={ref} aria-label="Introduction">
      <div className="hero__bars" aria-hidden="true">
        <span />
        <span />
      </div>

      {/* ---- Abstract production plate: never a photograph, always a drawing ---- */}
      <motion.div
        className="hero__plate"
        aria-hidden="true"
        style={reduced ? undefined : { y: plateY, scale: plateScale }}
      >
        <motion.div
          className="hero__plate-inner"
          initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 1.08, filter: "blur(14px)" }}
          animate={show ? { opacity: 1, scale: 1, filter: "blur(0px)" } : undefined}
          transition={{ duration: reduced ? 0.2 : 2.2, ease: EASE, delay: 0.15 }}
        >
          <ProductionPlate />
        </motion.div>
      </motion.div>

      <div className="shell hero__shell">
        {/* ---- Corner metadata ---- */}
        <motion.div
          className="hero__meta"
          initial={{ opacity: 0 }}
          animate={show ? { opacity: 1 } : undefined}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          style={reduced ? undefined : { opacity: metaOpacity }}
        >
          {SLUG.map((s) => (
            <span key={s.k} className="hero__meta-row">
              <span className="t-mono-sm">{s.k}</span>
              <span className="hero__meta-rule" aria-hidden="true" />
              <span className="t-mono">{s.v}</span>
            </span>
          ))}
        </motion.div>

        {/* ---- The name ---- */}
        <motion.div
          className="hero__name"
          style={reduced ? undefined : { y: nameY }}
        >
          <HeroLine text="PRATHMESH" entered={entered} delay={0.34} />
          <HeroLine text="RANSINGH" offset entered={entered} delay={0.46} />
          <div className="hero__rule" aria-hidden="true">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={entered ? { scaleX: 1 } : undefined}
              transition={{ duration: reduced ? 0 : 1.5, delay: 1.0, ease: EASE }}
            />
          </div>
        </motion.div>

        {/* ---- Roles + statement ---- */}
        <motion.div
          className="hero__foot"
          initial={{ opacity: 0, y: 14 }}
          animate={show ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, delay: 1.05, ease: EASE }}
        >
          <div className="hero__roles">
            {IDENTITY.rolesStacked.map((role, i) => (
              <span className="hero__role" key={role}>
                <span className="hero__role-idx t-mono-sm">0{i + 1}</span>
                <span className="hero__role-text">{role}</span>
              </span>
            ))}
          </div>
          <p className="hero__statement">
            <RevealChars
              text={`“${HERO_STATEMENT}”`}
              as="span"
              className="hero__statement-text"
              delay={1.35}
              stagger={0.028}
            />
          </p>
        </motion.div>
      </div>

      {/* ---- Scroll cue ---- */}
      <motion.button
        type="button"
        className="hero__scroll"
        onClick={() => scrollToTarget("#about", -10)}
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : undefined}
        transition={{ duration: 0.8, delay: 1.6 }}
        data-cursor="ENTER"
        aria-label="Scroll to About"
      >
        <span className="hero__scroll-vert">
          <span className="hero__scroll-row">
            <span className="t-mono">SCROLL TO ENTER</span>
            <span className="hero__scroll-arrow" aria-hidden="true">
              →
            </span>
          </span>
        </span>
        <span className="hero__scroll-track" aria-hidden="true">
          <motion.span
            className="hero__scroll-bead"
            animate={reduced ? undefined : { y: ["0%", "100%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.button>

      <div className="hero__corner hero__corner--br t-mono-sm">
        35.6762° N · 72.8776° E
      </div>
    </section>
  );
}

function HeroLine({
  text,
  offset,
  entered,
  delay,
}: {
  text: string;
  offset?: boolean;
  entered: boolean;
  delay: number;
}) {
  const reduced = useReducedMotion();
  return (
    <span className="hero__line-wrap">
      <motion.span
        className="hero__line"
        style={{ paddingLeft: offset ? "0.06em" : 0 }}
        initial={
          reduced
            ? { opacity: 0 }
            : { y: "114%", rotate: 1.6, transformOrigin: "left bottom" }
        }
        animate={
          entered
            ? reduced
              ? { opacity: 1 }
              : { y: "0%", rotate: 0, opacity: 1 }
            : undefined
        }
        transition={{
          duration: reduced ? 0.3 : 1.6,
          delay: reduced ? 0 : delay,
          ease: EASE,
        }}
      >
        {text}
      </motion.span>
    </span>
  );
}

/**
 * Layered abstract composition standing in for the craft: a screenplay
 * page, a call-sheet fragment, a facing-page grid, a timeline ruler and
 * camera marks — drawn, lit from one side, moving on separate planes.
 */
function ProductionPlate() {
  const reduced = useReducedMotion();

  return (
    <div className="plate">
      <div className="plate__light" aria-hidden="true" />

      {/* Layer 1 — screenplay page */}
      <svg className="plate__layer plate__layer--script" viewBox="0 0 320 460" role="presentation">
        <rect x="0" y="0" width="320" height="460" className="plate__paper" />
        <g className="plate__rules">
          {Array.from({ length: 22 }, (_, i) => (
            <line key={i} x1="26" y1={38 + i * 19} x2="294" y2={38 + i * 19} />
          ))}
        </g>
        <g className="plate__script">
          <rect x="26" y="34" width="150" height="9" />
          <rect x="26" y="72" width="238" height="5" />
          <rect x="26" y="84" width="206" height="5" />
          <rect x="26" y="96" width="252" height="5" />
          <rect x="26" y="134" width="120" height="7" />
          <rect x="26" y="160" width="244" height="5" />
          <rect x="26" y="172" width="196" height="5" />
          <rect x="60" y="196" width="220" height="5" />
          <rect x="60" y="208" width="240" height="5" />
          <rect x="60" y="220" width="188" height="5" />
        </g>
        {/* facing page column */}
        <g className="plate__facing">
          <line x1="266" y1="20" x2="266" y2="440" />
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1="266" y1={54 + i * 26} x2="294" y2={54 + i * 26} />
          ))}
        </g>
        {/* strike-throughs: lining marks */}
        <g className="plate__strikes">
          <line x1="20" y1="75" x2="300" y2="75" />
          <line x1="20" y1="97" x2="300" y2="97" />
          <line x1="20" y1="173" x2="300" y2="173" />
        </g>
      </svg>

      {/* Layer 2 — film strip */}
      <div className="plate__layer plate__layer--strip" aria-hidden="true">
        <div className="plate__perf plate__perf--a" />
        <div className="plate__perf plate__perf--b" />
        <div className="plate__frames">
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>

      {/* Layer 3 — call sheet fragment */}
      <div className="plate__layer plate__layer--callsheet" aria-hidden="true">
        <div className="plate__cs-head" />
        <div className="plate__cs-rows">
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} style={{ width: `${52 + ((i * 17) % 44)}%` }} />
          ))}
        </div>
        <div className="plate__cs-band" />
      </div>

      {/* Layer 4 — facing-page grid / timeline ruler */}
      <svg className="plate__layer plate__layer--ruler" viewBox="0 0 420 60" role="presentation">
        <line x1="0" y1="30" x2="420" y2="30" />
        {Array.from({ length: 29 }, (_, i) => (
          <line
            key={i}
            x1={i * 15}
            y1={i % 4 === 0 ? 12 : 22}
            x2={i * 15}
            y2="30"
            className={i % 4 === 0 ? "plate__tick--major" : ""}
          />
        ))}
      </svg>

      {/* Layer 5 — camera marks */}
      <div className="plate__layer plate__layer--marks" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <span className="plate__mark" key={i} style={{ ["--i" as string]: i }} />
        ))}
      </div>

      {reduced ? null : (
        <div className="plate__drift" aria-hidden="true">
          <span />
          <span />
        </div>
      )}
    </div>
  );
}