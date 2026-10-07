import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Cursor } from "./components/Cursor";
import { DocumentViewer, usePrefetchDocuments } from "./components/DocumentViewer";
import { Expertise } from "./components/Expertise";
import { Experience } from "./components/Experience";
import { Hero } from "./components/Hero";
import { Navigation } from "./components/Navigation";
import { Philosophy } from "./components/Philosophy";
import { Preloader } from "./components/Preloader";
import { ProductionDesk } from "./components/ProductionDesk";
import { Profile } from "./components/Profile";
import { ProofOfWork } from "./components/ProofOfWork";
import { ScriptReader } from "./components/ScriptReader";
import { ScrollRail } from "./components/ScrollRail";
import { TextureLayer } from "./components/TextureLayer";
import { useActiveSection } from "./hooks/useActiveSection";
import { scrollToTarget, useLenis } from "./hooks/useLenis";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { SECTION_IDS } from "./hooks/useActiveSection";

/** Warms the first sheet of each group so the viewer opens without a flash. */
function useWarmup(onReady: () => void) {
  const done = useRef(false);
  const cb = useRef(onReady);

  useEffect(() => {
    cb.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const targets = [
      "/documents/bd01.jpg",
      "/documents/ls01.jpg",
      "/documents/dl01.jpg",
      "/documents/cs01.jpg",
    ];
    let settled = 0;
    const tick = () => {
      settled += 1;
      if (settled >= 2 && !done.current) {
        done.current = true;
        cb.current();
      }
    };
    const imgs = targets.map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = tick;
      img.onerror = tick;
      img.src = src;
      return img;
    });
    const fail = window.setTimeout(tick, 2600);
    return () => {
      window.clearTimeout(fail);
      imgs.length = 0;
    };
  }, []);
}

export default function App() {
  const reduced = useReducedMotion();
  const sectionIds = useMemo(() => SECTION_IDS, []);
  const { active, progress } = useActiveSection(sectionIds);

  const [entered, setEntered] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [viewer, setViewer] = useState<{ id: string; page: number } | null>(null);
  const [readerOpen, setReaderOpen] = useState(false);

  useLenis();
  useWarmup(() => setAssetsReady(true));
  usePrefetchDocuments();

  const openViewer = useCallback((id: string, page = 0) => {
    setReaderOpen(false);
    setViewer({ id, page });
  }, []);

  const openReader = useCallback(() => {
    setViewer(null);
    setReaderOpen(true);
  }, []);

  // Deep links: loading on /#about lands on that scene after the leader.
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const t = window.setTimeout(() => scrollToTarget(`#${hash}`, -10), 1700);
    return () => window.clearTimeout(t);
  }, []);

  // Keep the address bar in step with the scene being read.
  useEffect(() => {
    if (!entered) return;
    if (window.location.hash.replace("#", "") === active) return;
    window.history.replaceState(null, "", `#${active}`);
  }, [active, entered]);

  return (
    <>
      <a className="skip-link" href="#proof-of-work">
        Skip to proof of work
      </a>

      <Preloader ready={assetsReady || reduced} onDone={() => setEntered(true)} />

      <div className="page" data-entered={entered}>
        <Navigation active={active} />
        <ScrollRail active={active} progress={progress} />

        <TextureLayer pulseKey={active} />

        <main>
          <Hero entered={entered} />
          <About />
          <Profile />
          <Expertise />
          <ProofOfWork onOpen={openViewer} onOpenScript={openReader} />
          <ProductionDesk onOpen={openViewer} />
          <Experience />
          <Philosophy />
          <Contact />
        </main>
      </div>

      <DocumentViewer
        open={viewer !== null}
        groupId={viewer?.id ?? null}
        startPage={viewer?.page ?? 0}
        onClose={() => setViewer(null)}
      />

      <ScriptReader open={readerOpen} onClose={() => setReaderOpen(false)} />

      <Cursor />
    </>
  );
}