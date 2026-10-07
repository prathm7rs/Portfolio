import { useEffect, useState } from "react";
import { NAV_ITEMS } from "../data/content";

/**
 * Tracks which scene the viewport is currently inside. Uses a band across
 * the upper-middle of the screen so a marker lights while its section is
 * actually being read, not merely when it first touches the fold.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const compute = () => {
      const band = window.innerHeight * 0.42;
      let current = ids[0] ?? "";
      let found = false;
      // Last section whose top has passed the reading band wins, so scenes
      // that sit between nav targets (desk, philosophy) keep the previous
      // marker lit instead of snapping back to the first.
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= band) {
          current = id;
          found = true;
        }
      }
      if (!found) {
        const el = document.getElementById(ids[0] ?? "");
        if (el && el.getBoundingClientRect().top > band) current = ids[0] ?? "";
      }
      // Near the very bottom the last section always wins.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 80) {
        current = ids[ids.length - 1] ?? current;
      }
      setActive(current);
    };

    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const onScroll = () => {
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      compute();
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return { active, progress };
}

export const SECTION_IDS = NAV_ITEMS.map((n) => n.id);