import { useRef, useState } from "react";
import { motion } from "motion/react";
import { CORE_SKILLS } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { RevealLines } from "./Reveal";
import { RegistrationMarks } from "./TextureLayer";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Miniature demonstrations. Purely illustrative — see the footnote.   */
/* ------------------------------------------------------------------ */
function SkillDemo({ id }: { id: string }) {
  switch (id) {
    case "lining":
      return (
        <div className="demo demo--lining" aria-hidden="true">
          <div className="demo__paper-lines" />
          <span className="demo__line" style={{ width: "68%" }} />
          <span className="demo__code" style={{ top: "6%", left: "4%" }}>A</span>
          <span className="demo__line" style={{ width: "84%" }} />
          <span className="demo__code" style={{ top: "22%", left: "4%" }}>B</span>
          <span className="demo__line" style={{ width: "58%" }} />
          <span className="demo__line" style={{ width: "76%" }} />
          <span className="demo__code" style={{ top: "46%", left: "4%" }}>1</span>
          <span className="demo__strike" style={{ top: "49%" }} />
          <span className="demo__line" style={{ width: "90%" }} />
          <span className="demo__code" style={{ top: "62%", left: "4%" }}>2</span>
          <span className="demo__line" style={{ width: "48%" }} />
        </div>
      );
    case "facing":
      return (
        <div className="demo demo--facing" aria-hidden="true">
          <div className="demo__paper-lines" />
          <div className="demo__facing-col">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} style={{ width: `${40 + ((i * 29) % 55)}%` }} />
            ))}
          </div>
          <div className="demo__facing-rule" />
          <span className="demo__line" style={{ width: "62%" }} />
          <span className="demo__line" style={{ width: "48%" }} />
          <span className="demo__line" style={{ width: "70%" }} />
        </div>
      );
    case "continuity":
      return (
        <div className="demo demo--table" aria-hidden="true">
          <div className="demo__thead">
            <span>TIME</span>
            <span>SLUG</span>
            <span>STATE</span>
          </div>
          {["09:12", "11:40", "14:05", "16:30", "18:12"].map((t, i) => (
            <div className="demo__trow" key={t}>
              <span>{t}</span>
              <span>1{i * 2 + 1}A</span>
              <span className="demo__tstate" data-s={i % 3} />
            </div>
          ))}
        </div>
      );
    case "breakdown":
      return (
        <div className="demo demo--breakdown" aria-hidden="true">
          <p className="demo__slug">INT. KITCHEN — NIGHT</p>
          <dl className="demo__tally">
            {[
              ["Characters", 3],
              ["Props", 7],
              ["Wardrobe", 4],
              ["Vehicles", 1],
              ["SFX", 2],
            ].map(([k, v]) => (
              <div key={k as string}>
                <dt>{k}</dt>
                <dd>{String(v).padStart(2, "0")}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case "callsheets":
      return (
        <div className="demo demo--callsheet" aria-hidden="true">
          <div className="demo__cs-band" />
          <div className="demo__cs-head">
            <span>CALL SHEET</span>
            <span>DAY 01</span>
          </div>
          {[
            ["DIRECTOR", "05:30"],
            ["DOP", "05:15"],
            ["1st AD", "05:00"],
            ["SCRIPT", "06:00"],
          ].map(([k, v]) => (
            <div className="demo__cs-row" key={k}>
              <span>{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      );
    case "schedules":
      return (
        <div className="demo demo--schedule" aria-hidden="true">
          <div className="demo__thead">
            <span>DAY</span>
            <span>SCENE</span>
            <span>PGS</span>
          </div>
          {[
            ["01", "1, 2", "2 1/8"],
            ["02", "4, 5", "3 2/8"],
            ["03", "7, 8, 9", "4 5/8"],
            ["04", "12", "1 3/8"],
          ].map(([a, b, c]) => (
            <div className="demo__trow" key={a}>
              <span>{a}</span>
              <span>{b}</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      );
    case "shotlisting":
      return (
        <div className="demo demo--shots" aria-hidden="true">
          {["1A", "1B", "2A", "2B", "3A", "4A", "5A"].map((s, i) => (
            <div className="demo__shot" key={s} data-on={i < 4}>
              <span className="demo__shot-id">{s}</span>
              <span className="demo__shot-bar" style={{ width: `${34 + ((i * 17) % 58)}%` }} />
            </div>
          ))}
        </div>
      );
    case "dailyreports":
    default:
      return (
        <div className="demo demo--dpr" aria-hidden="true">
          <div className="demo__dpr-head">
            <span>DAILY PROGRESS REPORT</span>
            <span>DAY 12 / 24</span>
          </div>
          {[
            ["SCENES", 78],
            ["PAGES", 64],
            ["WATERMARKS", 91],
            ["PICKUPS", 42],
          ].map(([label, pct]) => (
            <div className="demo__dpr-row" key={label as string}>
              <span>{label as string}</span>
              <span className="demo__dpr-bar">
                <i style={{ width: `${pct}%` }} />
              </span>
              <span>{pct}%</span>
            </div>
          ))}
        </div>
      );
  }
}

export function Expertise() {
  const [open, setOpen] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  return (
    <section id="expertise" className="section expertise">
      <RegistrationMarks />
      <div className="shell">
        <header className="sec-head">
          <span className="sec-head__idx">02</span>
          <span className="sec-head__title">Expertise</span>
          <span className="sec-head__meta">
            Eight Disciplines
            <br />
            Card Set A
          </span>
        </header>

        <div className="expertise__intro">
          <RevealLines lines={["WHAT I", "HANDLE."]} className="t-title expertise__title" />
          <p className="t-body expertise__lede">
            Every one of these is a document before it is a task. The craft is
            building them so that forty people can read the same truth at the
            same time.
          </p>
        </div>

        <motion.div
          className="skillgrid"
          ref={gridRef}
          onPointerLeave={() => setOpen(null)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.06 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.055 } },
          }}
        >
          {CORE_SKILLS.map((skill, i) => {
            const isOpen = open === skill.id;
            return (
              <motion.article
                key={skill.id}
                className="skillcard"
                data-open={isOpen}
                onPointerEnter={() => setOpen(skill.id)}
                onFocusCapture={() => setOpen(skill.id)}
                onBlurCapture={() => setOpen(null)}
                variants={{
                  hidden: reduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: 34, clipPath: "inset(0 0 22% 0)" },
                  show: reduced
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" },
                }}
                transition={{ duration: reduced ? 0.25 : 0.85, ease: EASE }}
              >
                <div className="skillcard__perf" aria-hidden="true" />
                <header className="skillcard__head">
                  <span className="skillcard__idx t-mono">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="skillcard__title">{skill.label}</h3>
                </header>

                <p className="skillcard__detail">{skill.detail}</p>

                <div className="skillcard__demo-wrap">
                  <div className="skillcard__demo" data-open={isOpen}>
                    <SkillDemo id={skill.id} />
                  </div>
                </div>

                <footer className="skillcard__foot">
                  <span className="t-mono-sm">
                    {isOpen ? "ILLUSTRATIVE SPECIMEN" : "HOVER TO INSPECT"}
                  </span>
                  <span className="skillcard__corner" aria-hidden="true" />
                </footer>
              </motion.article>
            );
          })}
        </motion.div>

        <p className="expertise__note t-mono-sm">
          * THE SPECIMENS ABOVE ARE VISUAL DEMONSTRATIONS OF FORMAT ONLY. THEY ARE
          NOT DRAWN FROM AN ACTUAL PRODUCTION.
        </p>
      </div>
    </section>
  );
}