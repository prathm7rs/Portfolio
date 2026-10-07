import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { CORE_SKILLS, IDENTITY, SEEKING } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { RevealLines } from "./Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Profile() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const layers = useLayers(scrollYProgress, reduced);

  return (
    <section className="section profile" ref={ref} aria-label="Profile">
      <div className="shell profile__shell">
        {/* ---------- Left: identity plate ---------- */}
        <div className="profile__left">
          <p className="t-mono profile__kicker">CARD / 001</p>

          <RevealLines
            lines={[IDENTITY.first.toUpperCase(), IDENTITY.last.toUpperCase()]}
            className="t-title profile__name"
            delay={0.05}
          />

          <motion.div
            className="profile__roles"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          >
            {IDENTITY.rolesStacked.map((role) => (
              <p key={role} className="profile__role">
                {role}
              </p>
            ))}
          </motion.div>

          <motion.dl
            className="profile__facts"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div>
              <dt className="t-mono-sm">BASE</dt>
              <dd className="t-mono">{IDENTITY.location.toUpperCase()}</dd>
            </div>
            <div>
              <dt className="t-mono-sm">AVAILABLE FOR</dt>
              <dd className="t-mono">{SEEKING.join(" · ").toUpperCase()}</dd>
            </div>
            <div>
              <dt className="t-mono-sm">DISCIPLINE</dt>
              <dd className="t-mono">
                {CORE_SKILLS.length} CORE PRODUCTION SKILLS
              </dd>
            </div>
          </motion.dl>
        </div>

        {/* ---------- Right: layered production composition ---------- */}
        <motion.div
          className="profile__right"
          style={reduced ? undefined : { y: layers.back }}
          aria-hidden="true"
        >
          <div className="idplate" data-lit="true">
            {/* furthest plane: continuity grid */}
            <motion.svg
              className="idplate__layer idplate__layer--grid"
              viewBox="0 0 520 640"
              style={reduced ? undefined : { y: layers.g1 }}
            >
              <g className="idplate__gridlines">
                {Array.from({ length: 17 }, (_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 40} x2="520" y2={i * 40} />
                ))}
                {Array.from({ length: 14 }, (_, i) => (
                  <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="640" />
                ))}
              </g>
            </motion.svg>

            {/* screenplay page */}
            <motion.svg
              className="idplate__layer idplate__layer--page"
              viewBox="0 0 300 420"
              style={reduced ? undefined : { y: layers.g2 }}
            >
              <rect x="0" y="0" width="300" height="420" className="idplate__paper" />
              <g className="idplate__type">
                <rect x="30" y="40" width="120" height="8" />
                <rect x="30" y="76" width="212" height="4" />
                <rect x="30" y="88" width="180" height="4" />
                <rect x="30" y="100" width="226" height="4" />
                <rect x="30" y="134" width="96" height="6" />
                <rect x="30" y="158" width="220" height="4" />
                <rect x="30" y="170" width="166" height="4" />
                <rect x="62" y="192" width="200" height="4" />
                <rect x="62" y="204" width="216" height="4" />
                <rect x="62" y="216" width="150" height="4" />
              </g>
              <g className="idplate__strikes">
                <line x1="24" y1="79" x2="270" y2="79" />
                <line x1="24" y1="101" x2="270" y2="101" />
              </g>
              <g className="idplate__facing">
                <line x1="248" y1="20" x2="248" y2="400" />
                {Array.from({ length: 11 }, (_, i) => (
                  <line key={i} x1="248" y1={56 + i * 28} x2="274" y2={56 + i * 28} />
                ))}
              </g>
            </motion.svg>

            {/* film strip */}
            <motion.div
              className="idplate__layer idplate__layer--strip"
              style={reduced ? undefined : { y: layers.g3 }}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <span className="idplate__cell" key={i} />
              ))}
            </motion.div>

            {/* call sheet fragment */}
            <motion.div
              className="idplate__layer idplate__layer--cs"
              style={reduced ? undefined : { y: layers.g4 }}
            >
              <div className="idplate__cs-head" />
              <div className="idplate__cs-band" />
              <div className="idplate__cs-lines">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} style={{ width: `${46 + ((i * 23) % 50)}%` }} />
                ))}
              </div>
            </motion.div>

            {/* timeline ruler + marks */}
            <motion.div
              className="idplate__layer idplate__layer--ruler"
              style={reduced ? undefined : { y: layers.g5 }}
            >
              <span className="idplate__ruler-ticks">
                {Array.from({ length: 24 }, (_, i) => (
                  <i key={i} data-major={i % 4 === 0} />
                ))}
              </span>
              <span className="idplate__ruler-marks">
                {Array.from({ length: 4 }, (_, i) => (
                  <b key={i} style={{ left: `${10 + i * 26}%` }} />
                ))}
              </span>
            </motion.div>

            {/* key light */}
            <div className="idplate__light" />
            <div className="idplate__edge" />
          </div>

          <p className="profile__plate-caption t-mono-sm">
            COMPOSITION / ABSTRACT — SCRIPT PAGES, CALL SHEET, FILM STRIP,
            TIMELINE
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/** Five independent depth planes so the composition has real parallax. */
function useLayers(progress: MotionValue<number>, reduced: boolean) {
  const g1 = useTransform(progress, [0, 1], [26, -26]);
  const g2 = useTransform(progress, [0, 1], [58, -58]);
  const g3 = useTransform(progress, [0, 1], [-38, 38]);
  const g4 = useTransform(progress, [0, 1], [-72, 72]);
  const g5 = useTransform(progress, [0, 1], [92, -92]);
  const back = useTransform(progress, [0, 1], [44, -44]);

  if (reduced) {
    return { g1: 0, g2: 0, g3: 0, g4: 0, g5: 0, back: 0 } as unknown as {
      g1: MotionValue<number>;
      g2: MotionValue<number>;
      g3: MotionValue<number>;
      g4: MotionValue<number>;
      g5: MotionValue<number>;
      back: MotionValue<number>;
    };
  }
  return { g1, g2, g3, g4, g5, back };
}