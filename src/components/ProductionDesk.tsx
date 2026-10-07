import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { PROOF_GROUPS } from "../data/documents";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useTilt } from "../hooks/useTilt";
import { RevealLines } from "./Reveal";
import { RegistrationMarks } from "./TextureLayer";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The four documents as physical objects resting on a desk surface:
 * perspective, real shadows, paper edges. Hover lifts each sheet off
 * the table; clicking opens the interactive viewer.
 */
export function ProductionDesk({
  onOpen,
}: {
  onOpen: (groupId: string) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const deskRot = useTransform(scrollYProgress, [0, 1], [16, 3]);

  return (
    <section className="section desk" ref={ref}>
      <RegistrationMarks />
      <div className="shell">
        <header className="sec-head">
          <span className="sec-head__idx">03.2</span>
          <span className="sec-head__title">The Production Desk</span>
          <span className="sec-head__meta">
            Four Documents
            <br />
            Surface / Archive
          </span>
        </header>

        <div className="desk__intro">
          <RevealLines lines={["THE PRODUCTION", "DESK"]} className="t-title desk__title" />
          <p className="t-body desk__lede">
            Four working documents, laid out the way they are on a production
            table: the breakdown, the lined script, the day's log, and the sheet
            everyone actually reads.
          </p>
        </div>

        <div className="desk__stage">
          <div className="desk__surface" aria-hidden="true">
            <div className="desk__grain" />
            <div className="desk__light" />
            <motion.div
              className="desk__horizon"
              style={reduced ? undefined : { rotateX: deskRot }}
              aria-hidden="true"
            />
          </div>

          <div className="desk__objects">
            {PROOF_GROUPS.map((group, i) => (
              <DeskObject
                key={group.id}
                groupId={group.id}
                label={group.deskLabel}
                sub={group.tech}
                thumb={group.sheets[0].pages[0].src}
                pages={group.sheets.reduce((n, s) => n + s.pages.length, 0)}
                index={i}
                reduced={reduced}
                onOpen={onOpen}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DeskObject({
  groupId,
  label,
  sub,
  thumb,
  pages,
  index,
  reduced,
  onOpen,
}: {
  groupId: string;
  label: string;
  sub: string;
  thumb: string;
  pages: number;
  index: number;
  reduced: boolean;
  onOpen: (id: string) => void;
}) {
  const tilt = useTilt<HTMLDivElement>({ max: 7, distance: 300, lift: 14 });
  const isBreakdown = groupId === "breakdown";

  return (
    <motion.div
      className="desk__slot"
      style={{ ["--i" as string]: index }}
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduced ? 0.3 : 0.95, delay: index * 0.09, ease: EASE }}
    >
      <div className="desk__object">
        <div
          ref={tilt.ref}
          className="desk__paper"
          onPointerMove={tilt.onPointerMove}
          onPointerLeave={tilt.onPointerLeave}
        >
          <button
            type="button"
            className="desk__hit"
            onClick={() => onOpen(groupId)}
            aria-label={`Open ${label} in the document viewer`}
            data-cursor="DOCUMENT"
          >
            <span className="desk__paper-grain" aria-hidden="true" />
            <img
              className="desk__thumb"
              src={thumb}
              alt={`${label} — first sheet of the supplied sample`}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <span className="desk__label t-mono-sm">{label.toUpperCase()}</span>
            <span className="desk__pages t-mono-sm">{pages} SHEETS</span>
            <span className="desk__edge" aria-hidden="true" />
            <span className="desk__clip" aria-hidden="true" />
            {isBreakdown && <span className="desk__stamp" aria-hidden="true">SAMPLE</span>}
          </button>
        </div>
        <span className="desk__cast" aria-hidden="true" />
      </div>

      <div className="desk__meta">
        <span className="desk__meta-idx t-mono">{String(index + 1).padStart(2, "0")}</span>
        <span className="desk__meta-sub t-mono-sm">{sub.toUpperCase()}</span>
      </div>
    </motion.div>
  );
}