import { motion } from "motion/react";
import { PHILOSOPHY } from "../data/content";
import { RevealChars, RevealLines } from "./Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Philosophy() {
  return (
    <section className="section philosophy">
      <div className="philosophy__field" aria-hidden="true">
        {Array.from({ length: 26 }, (_, i) => (
          <span key={i} style={{ ["--i" as string]: i }} />
        ))}
      </div>

      <div className="shell">
        <header className="sec-head">
          <span className="sec-head__idx">—</span>
          <span className="sec-head__title">Working Philosophy</span>
          <span className="sec-head__meta">
            Margins
            <br />
            Annotated
          </span>
        </header>

        <div className="philosophy__inner">
          <RevealLines
            lines={[PHILOSOPHY.heading.toUpperCase()]}
            className="t-title philosophy__title"
          />

          <p className="philosophy__quote">
            <RevealChars
              text={`“${PHILOSOPHY.quote}”`}
              as="span"
              className="philosophy__quote-text"
              stagger={0.022}
            />
          </p>

          <ul className="philosophy__pillars">
            {PHILOSOPHY.pillars.map((pillar, i) => (
              <motion.li
                className="pillar"
                key={pillar.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              >
                <span className="pillar__n t-mono-sm">{pillar.n}</span>
                <span className="pillar__term">{pillar.term}</span>
                <span className="pillar__note t-mono-sm">{pillar.note}</span>
                <span className="pillar__mark" aria-hidden="true" />
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}