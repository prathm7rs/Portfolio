import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { useEffect, useMemo, useRef, type ElementType, type ReactNode } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Line-mask reveal: text slides up from behind a hard clip edge.      */
/* ------------------------------------------------------------------ */
export function RevealLines({
  lines,
  as: Tag = "h2",
  className = "t-h2",
  delay = 0,
  stagger = 0.085,
  once = true,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, margin: "-12% 0px -12% 0px" });
  const reduced = useReducedMotion();

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span className="rv-line" key={line + i}>
          <motion.span
            style={{ display: "block" }}
            initial={reduced ? { y: 0, opacity: 0 } : { y: "108%" }}
            animate={inView ? { y: "0%", opacity: 1 } : undefined}
            transition={{
              duration: reduced ? 0.3 : 1.15,
              delay: reduced ? 0 : delay + i * stagger,
              ease: EASE,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Character reveal, for the technical strings that must feel typed in. */
/* ------------------------------------------------------------------ */
export function RevealChars({
  text,
  className = "t-mono",
  delay = 0,
  stagger = 0.016,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  // Words stay intact as inline-block runs, so a line can only break between
  // words — never mid-word. Character indices are resolved up front, which
  // makes every glyph's delay a pure function of its position in the string.
  const tokens = useMemo(() => {
    const out: { word: string; start: number }[] = [];
    let i = 0;
    for (const word of text.split(/(\s+)/)) {
      if (/^\s+$/.test(word)) {
        i += word.length;
      } else {
        out.push({ word, start: i });
        i += word.length;
      }
    }
    return out;
  }, [text]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {tokens.map((tok, wi) => (
        <span className="rv-word" aria-hidden="true" key={`w-${wi}`}>
          {Array.from(tok.word).map((char, ci) => (
            <motion.i
              key={`${char}-${ci}`}
              className="rv-chars"
              initial={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: "0.5em", filter: "blur(3px)" }
              }
              animate={inView ? { opacity: 1, y: "0em", filter: "blur(0px)" } : undefined}
              transition={{
                duration: reduced ? 0.25 : 0.6,
                delay: reduced ? 0 : delay + (tok.start + ci) * stagger,
                ease: EASE,
              }}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.i>
          ))}
          {"\u00A0"}
        </span>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Clip-path mask reveal — a sheet sliding into frame.                 */
/* ------------------------------------------------------------------ */
export function RevealClip({
  children,
  className,
  delay = 0,
  from = "top",
  amount = 0.28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "top" | "bottom" | "left" | "right" | "scale";
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const reduced = useReducedMotion();

  const hidden: Record<string, string> = {
    top: "inset(0 0 100% 0)",
    bottom: "inset(100% 0 0 0)",
    left: "inset(0 100% 0 0)",
    right: "inset(0 0 0 100%)",
    scale: "inset(14% 14% 14% 14%)",
  };
  const shown = "inset(0% 0% 0% 0%)";

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <motion.div
        style={{ height: "100%" }}
        initial={reduced ? { clipPath: shown } : { clipPath: hidden[from] }}
        animate={inView ? { clipPath: shown } : undefined}
        transition={{
          duration: reduced ? 0.2 : 1.25,
          delay: reduced ? 0 : delay,
          ease: EASE,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll-linked parallax. Spring-damped so it never feels twitchy.   */
/* ------------------------------------------------------------------ */
export function Parallax({
  children,
  distance = 90,
  className,
  scale = false,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
  scale?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(raw, { stiffness: 90, damping: 26, mass: 0.6 });
  const s = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 0.96]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduced ? undefined : { y, scale: scale ? s : undefined }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Section number that counts itself up when the scene is entered.    */
/* ------------------------------------------------------------------ */
export function CounterNum({ value, pad = 2 }: { value: number; pad?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 22 });
  const text = useTransform(spring, (v) => String(Math.round(v)).padStart(pad, "0"));
  const reduced = useReducedMotion();

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, mv, value]);

  if (reduced) {
    return <span ref={ref}>{String(value).padStart(pad, "0")}</span>;
  }

  return (
    <span ref={ref} className="t-num">
      <motion.span>{text}</motion.span>
    </span>
  );
}

export const revealVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};