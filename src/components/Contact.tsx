import { motion } from "motion/react";
import { AVAILABILITY, IDENTITY } from "../data/content";
import { scrollToTarget } from "../hooks/useLenis";
import { RevealLines } from "./Reveal";
import { EndCard } from "./EndCard";

const EASE = [0.16, 1, 0.3, 1] as const;

const CHANNELS = [
  {
    k: "PHONE",
    v: IDENTITY.phone,
    href: IDENTITY.phoneHref,
    cursor: "CALL",
  },
  {
    k: "EMAIL",
    v: IDENTITY.email,
    href: `mailto:${IDENTITY.email}`,
    cursor: "EMAIL",
    wide: true,
  },
  { k: "LOCATION", v: IDENTITY.location, cursor: "MAP", wide: true },
] as const;

export function Contact() {
  return (
    <>
      <section id="contact" className="section contact">
        <div className="contact__leak" aria-hidden="true" />
        <div className="shell">
          <header className="sec-head">
            <span className="sec-head__idx">05</span>
            <span className="sec-head__title">Contact</span>
            <span className="sec-head__meta">
              {AVAILABILITY}
            </span>
          </header>

          <div className="contact__lead">
            <RevealLines
              lines={["LET'S MAKE", "THE NEXT", "FRAME."]}
              className="t-mega contact__title"
            />
          </div>

          <motion.div
            className="contact__identity"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          >
            <span className="contact__name">{IDENTITY.full.toUpperCase()}</span>
            <span className="contact__roles t-mono">{IDENTITY.roles.toUpperCase()}</span>
          </motion.div>

          <div className="contact__body">
            <dl className="contact__channels">
              {CHANNELS.map((c, i) => (
                <motion.div
                  className="contact__channel"
                  key={c.k}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: EASE }}
                >
                  <dt className="t-mono-sm">{c.k}</dt>
                  <dd>
                    {"href" in c ? (
                      <a
                        href={c.href}
                        className="contact__value"
                        data-cursor={c.cursor}
                        data-cursor-mode="text"
                      >
                        {c.v}
                      </a>
                    ) : (
                      <span className="contact__value">{c.v}</span>
                    )}
                  </dd>
                </motion.div>
              ))}
            </dl>

            <motion.div
              className="contact__actions"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <a
                className="btn btn--brass"
                href={`mailto:${IDENTITY.email}`}
                data-cursor="EMAIL"
                data-cursor-mode="text"
              >
                Email Me
                <span className="btn__arrow" aria-hidden="true">
                  →
                </span>
              </a>

              <a
                className="btn"
                href={IDENTITY.portfolioFile}
                download="Prathmesh_Ransingh_Portfolio.pdf"
                data-cursor="DOWNLOAD"
              >
                Download Portfolio
                <span className="btn__arrow" aria-hidden="true">
                  ↓
                </span>
              </a>

              <p className="contact__note t-mono-sm">
                PDF · TECHNICAL SAMPLES INCLUDED
              </p>
            </motion.div>
          </div>

          <motion.button
            type="button"
            className="contact__up"
            onClick={() => scrollToTarget("#hero", 0)}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            data-cursor="TOP"
          >
            <span className="t-mono-sm">RUN IT AGAIN</span>
            <span className="contact__up-arrow" aria-hidden="true">
              ↑
            </span>
          </motion.button>
        </div>
      </section>

      <EndCard />
    </>
  );
}