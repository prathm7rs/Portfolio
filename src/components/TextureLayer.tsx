import { useMemo } from "react";

const DUST = [
  [6, 92, 26, -14, 0.34],
  [14, 41, 34, 22, 0.22],
  [23, 78, 19, -26, 0.4],
  [31, 15, 42, 11, 0.18],
  [38, 66, 31, -19, 0.3],
  [45, 88, 24, 30, 0.26],
  [52, 33, 37, -22, 0.2],
  [58, 71, 21, 16, 0.36],
  [64, 12, 45, -12, 0.24],
  [71, 55, 28, 27, 0.2],
  [77, 84, 33, -30, 0.32],
  [84, 27, 26, 18, 0.22],
  [90, 63, 40, -16, 0.28],
  [96, 8, 22, 24, 0.18],
  [3, 47, 48, -21, 0.26],
  [18, 3, 30, 34, 0.2],
  [35, 95, 25, -28, 0.3],
  [49, 50, 44, 13, 0.22],
  [68, 39, 27, -25, 0.34],
  [88, 90, 32, 20, 0.2],
] as const;

/**
 * The substrate. Everything sits above the page and below the pointer:
 * grain, paper fibre, dust, grid, perforations, light leak, vignette,
 * telecine scanline and a hairline matte.
 *
 * `intensity` is driven by section transitions so the grain breathes
 * rather than sitting at one fixed opacity.
 */
export function TextureLayer({ pulseKey = "" }: { pulseKey?: string }) {
  const dust = useMemo(
    () =>
      DUST.map(([left, top, dur, dx, o], i) => (
        <i
          key={i}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDuration: `${dur}s`,
            animationDelay: `${-(i * 1.7).toFixed(2)}s`,
            ["--d-x" as string]: `${dx}px`,
            ["--d-o" as string]: `${o}`,
          }}
        />
      )),
    [],
  );

  return (
    <div className="tex" aria-hidden="true">
      <div key={pulseKey} className="tex__grain" data-surge="true" />
      <div className="tex__paper" />
      <div className="tex__grid" />
      <div className="tex__grid-fine" />
      <div className="tex__dust">{dust}</div>
      <div className="tex__leak" />
      <div className="tex__scan" />
      <div className="tex__vignette" />
      <div className="tex__perf tex__perf--l" />
      <div className="tex__perf tex__perf--r" />
      <div className="tex__matte" />
    </div>
  );
}

export function RegistrationMarks() {
  return (
    <div className="reg-set" aria-hidden="true">
      <span className="reg"><i /></span>
      <span className="reg"><i /></span>
      <span className="reg"><i /></span>
      <span className="reg"><i /></span>
    </div>
  );
}