import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { EXPERIENCE } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { RevealLines } from "./Reveal";
import { RegistrationMarks } from "./TextureLayer";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 78%", "end 60%"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.5 });

  return (
    <section id="experience" className="section timeline-section" ref={ref}>
      <RegistrationMarks />
      <div className="shell">
        <header className="sec-head">
          <span className="sec-head__idx">04</span>
          <span className="sec-head__title">Experience</span>
          <span className="sec-head__meta">
            On Set / In The Room
            <br />
            Sequence A
          </span>
        </header>

        <div className="timeline__intro">
          <RevealLines
            lines={["ON SET /", "IN THE ROOM."]}
            className="t-title timeline__title"
          />
          <p className="t-body timeline__lede">
            The position is defined by the discipline around the camera, not by
            the credits attached to it. This is what the supplied portfolio
            states — and what it does not.
          </p>
        </div>

        <div className="timeline">
          <div className="timeline__spine" aria-hidden="true">
            <motion.span
              className="timeline__spine-fill"
              style={reduced ? { scaleY: 1 } : { scaleY: lineScale }}
            />
          </div>

          <ol className="timeline__list">
            {EXPERIENCE.entries.map((entry, i) => (
              <motion.li
                className="tl"
                key={entry.id}
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: reduced ? 0.3 : 0.85, delay: i * 0.08, ease: EASE }}
              >
                <div className="tl__marker" aria-hidden="true">
                  <span className="tl__marker-ring" />
                  <span className="tl__marker-core" />
                </div>

                <div className="tl__card">
                  <div className="tl__head">
                    <span className="tl__code t-mono-sm">{entry.code}</span>
                    <span className="tl__scene t-mono-sm">{entry.scene}</span>
                    <span className="tl__status t-mono-sm" data-status={entry.status}>
                      {entry.status}
                    </span>
                  </div>

                  <h3 className="tl__title">{entry.title}</h3>

                  {entry.body.map((p) => (
                    <p key={p} className="tl__body t-body">
                      {p}
                    </p>
                  ))}

                  <ul className="tl__meta">
                    {entry.meta.map((m) => (
                      <li key={m} className="t-mono-sm">
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* ---- Honest placeholder: the portfolio lists no production credits ---- */}
        {!EXPERIENCE.creditsAvailable && (
          <motion.aside
            className="tl__placeholder"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            <span className="tl__placeholder-tag t-mono-sm">
              NOT IN THE SUPPLIED PORTFOLIO
            </span>
            <div className="tl__placeholder-body">
              <h4 className="tl__placeholder-title">
                Production credits, dates and references
              </h4>
              <p className="t-body">
                The portfolio supplied for this site contains no employment
                history, production titles, clients or awards, so nothing has
                been written in this space. Full credit history is available on
                request.
              </p>
              <a
                className="rule-link t-mono"
                href="mailto:prathmeshfilms@gmail.com?subject=Production%20credits%20request"
                data-cursor="EMAIL"
                data-cursor-mode="text"
              >
                Request credit history →
              </a>
            </div>
          </motion.aside>
        )}
      </div>
    </section>
  );
}