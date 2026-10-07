import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { BIO, CORE_SKILLS, DEVELOPING_AS, SEEKING } from "../data/content";
import { CounterNum, RevealLines } from "./Reveal";
import { RegistrationMarks } from "./TextureLayer";

const EASE = [0.16, 1, 0.3, 1] as const;

export function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });

  return (
    <section id="about" className="section about" ref={ref}>
      <RegistrationMarks />
      <div className="shell">
        <header className="sec-head">
          <span className="sec-head__idx">01</span>
          <span className="sec-head__title">About</span>
          <span className="sec-head__meta">
            Production Notes
            <br />
            Sheet 01 / 01
          </span>
        </header>

        <div className="about__grid">
          {/* ---- Main editorial copy ---- */}
          <div className="about__main">
            <RevealLines
              lines={["THE WORK BEHIND", "THE FRAME."]}
              className="t-title about__title"
            />

            <div className="about__body">
              {BIO.map((para, i) => (
                <motion.p
                  key={para}
                  className={i === 0 ? "t-lede" : "t-body"}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: EASE }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* ---- Availability ---- */}
            <motion.div
              className="about__seeking"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <p className="t-mono about__seeking-label">
                CURRENTLY SEEKING OPPORTUNITIES IN
              </p>
              <ul className="about__seeking-list">
                {SEEKING.map((item, i) => (
                  <li key={item}>
                    <motion.span
                      initial={{ clipPath: "inset(0 0 100% 0)" }}
                      animate={inView ? { clipPath: "inset(0 0 0% 0)" } : undefined}
                      transition={{
                        duration: 0.8,
                        delay: 0.55 + i * 0.11,
                        ease: EASE,
                      }}
                    >
                      {item}
                    </motion.span>
                  </li>
                ))}
              </ul>
              <p className="t-body about__seeking-note">
                While continuing to develop as a {DEVELOPING_AS}.
              </p>
            </motion.div>
          </div>

          {/* ---- Production annotations ---- */}
          <aside className="about__notes" aria-label="Core skills, as annotated on the production page">
            <div className="about__notes-head">
              <span className="t-mono-sm">CORE SKILLS</span>
              <span className="t-mono-sm about__notes-count">
                <CounterNum value={CORE_SKILLS.length} /> ITEMS
              </span>
            </div>
            <ol className="about__note-list">
              {CORE_SKILLS.map((skill, i) => (
                <motion.li
                  className="note"
                  key={skill.id}
                  initial={{ opacity: 0, x: 26 }}
                  animate={inView ? { opacity: 1, x: 0 } : undefined}
                  transition={{
                    duration: 0.75,
                    delay: 0.16 + i * 0.075,
                    ease: EASE,
                  }}
                  style={{ ["--depth" as string]: `${(i % 4) * 14}px` }}
                >
                  <span className="note__leader" aria-hidden="true" />
                  <span className="note__tick" aria-hidden="true" />
                  <span className="note__body">
                    <span className="note__term">{skill.label}</span>
                    <span className="note__detail">{skill.detail}</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  );
}