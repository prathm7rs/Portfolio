import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { PROOF_GROUPS, TOTAL_PAGES } from "../data/documents";
import { SAMPLE_DISCLAIMER } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { RevealLines } from "./Reveal";
import { RegistrationMarks } from "./TextureLayer";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProofOfWork({
  onOpen,
  onOpenScript,
}: {
  onOpen: (groupId: string, page?: number) => void;
  onOpenScript: () => void;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: stripRef,
    offset: ["start end", "end start"],
  });
  const stripX = useTransform(scrollYProgress, [0, 1], ["2%", "-2%"]);

  return (
    <section id="proof-of-work" className="section proof">
      <RegistrationMarks />
      <div className="shell">
        <header className="sec-head">
          <span className="sec-head__idx">03</span>
          <span className="sec-head__title">Proof of Work</span>
          <span className="sec-head__meta">
            Technical Samples
            <br />
            {TOTAL_PAGES} Sheets
          </span>
        </header>

        <div className="proof__intro">
          <RevealLines
            lines={["PROOF OF WORK"]}
            className="t-title proof__title"
          />
          <RevealLines
            lines={["THE PAPERWORK BEHIND", "THE PICTURE."]}
            className="t-h2 proof__sub"
            delay={0.14}
            as="p"
          />
          <motion.p
            className="proof__disclaimer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <span className="proof__disclaimer-tag t-mono-sm">NOTE</span>
            {SAMPLE_DISCLAIMER}.
          </motion.p>
        </div>
      </div>

      {/* ---------- The film strip: horizontal travel on vertical scroll ---------- */}
      <div className="proof__strip" ref={stripRef}>
        <motion.div className="proof__strip-track" style={reduced ? undefined : { x: stripX }}>
          {PROOF_GROUPS.map((group, gi) => (
            <motion.article
              className="specimen"
              key={group.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.9, delay: gi * 0.08, ease: EASE }}
            >
              <div className="specimen__head">
                <span className="specimen__idx t-mono">{group.idx}</span>
                <h3 className="specimen__title">{group.title}</h3>
                <span className="specimen__count t-mono-sm">
                  {group.sheets.reduce((n, s) => n + s.pages.length, 0)} SHEETS
                </span>
              </div>

              <p className="specimen__standfirst">{group.standfirst}</p>
              <p className="specimen__purpose t-mono-sm">{group.purpose}</p>

              {/* Real pages from the supplied portfolio */}
              <div className="specimen__pages">
                {group.sheets.map((sheet) => (
                  <div className="specimen__sheet" key={sheet.id}>
                    <span className="specimen__sheet-label t-mono-sm">
                      {sheet.label.toUpperCase()}
                    </span>
                    <div className="specimen__frames">
                      {sheet.pages.map((page, i) => (
                        <button
                          type="button"
                          key={page.src}
                          className="specimen__frame"
                          style={{ ["--i" as string]: i }}
                          onClick={() =>
                            onOpen(
                              group.id,
                              group.sheets
                                .slice(0, group.sheets.indexOf(sheet))
                                .reduce((n, s) => n + s.pages.length, 0) + i,
                            )
                          }
                          aria-label={`Open ${sheet.label}, sheet ${i + 1}`}
                          data-cursor="OPEN"
                        >
                          <img
                            src={page.src}
                            alt={`${sheet.label} — sheet ${i + 1}`}
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                          />
                          <span className="specimen__frame-num t-mono-sm">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="specimen__actions">
                <button
                  type="button"
                  className="btn btn--brass"
                  onClick={() => onOpen(group.id)}
                  data-cursor="VIEW"
                >
                  View {group.deskLabel}
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                </button>
                <span className="specimen__tech t-mono-sm">{group.tech}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* ---------- OPEN SCRIPT ---------- */}
      <div className="shell">
        <motion.div
          className="openscript"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <div className="openscript__left">
            <p className="t-mono openscript__kicker">READING ENVIRONMENT</p>
            <h3 className="openscript__title t-h2">
              Open Script
            </h3>
            <p className="t-body openscript__body">
              A distraction-free screenplay reader. Dark room, one page, page
              counter. Arrow keys to navigate, wheel to advance, Escape to step
              back out.
            </p>
            <button
              type="button"
              className="btn btn--brass openscript__btn"
              onClick={onOpenScript}
              data-cursor="OPEN SCRIPT"
            >
              Open Script
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </button>
          </div>

          <div className="openscript__right" aria-hidden="true">
            <div className="openscript__page">
              <div className="openscript__lines">
                {Array.from({ length: 16 }, (_, i) => (
                  <span
                    key={i}
                    style={{
                      width: `${i % 5 === 0 ? 62 : 30 + ((i * 23) % 62)}%`,
                      marginLeft: i % 5 === 0 ? 0 : 6,
                    }}
                  />
                ))}
              </div>
              <span className="openscript__num t-mono-sm">12 / 47</span>
            </div>
            <span className="openscript__shadow" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}