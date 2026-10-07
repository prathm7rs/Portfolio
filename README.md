# Prathmesh Ransingh — Script Supervisor | Assistant Director

A cinematic, single-scroll portfolio built around the supplied portfolio PDF.
Every factual claim, every document page and every contact detail on this site
comes from that file. Nothing else was invented.

---

## What this is

A single continuous "film" rather than a set of separate pages: an academy
leader, a title card, five numbered scenes, an archive of the actual technical
proof-of-work, and a closing slate. Navigation, the right-hand scene rail and
the URL hash all address the same scenes.

| # | Scene | Anchor |
|---|-------|--------|
| 00 | Hero / title card | `#hero` |
| 01 | About — *The work behind the frame* | `#about` |
| — | Profile / identity plate | — |
| 02 | Expertise — *What I handle* | `#expertise` |
| 03 | Proof of work — *The paperwork behind the picture* | `#proof-of-work` |
| 03.2 | The Production Desk | — |
| 04 | Experience — *On set / in the room* | `#experience` |
| — | Working philosophy | — |
| 05 | Contact — *Let's make the next frame* | `#contact` |

Sections live in `src/components/` and are composed in `src/App.tsx`. Adding a
scene is one import and one element — see *Extending* below.

---

## Source material and provenance

The supplied file was `Prathmesh_AD&ScriptSupervisor_Portfolio.pdf`
(6 pages, landscape). Its technical samples are scanned sheets embedded as
images. Those images were extracted losslessly, split along the real sheet
boundaries, cropped past a dead black scan band, and re-encoded as progressive
JPEG at quality 88. **No document was retyped, redrawn or recoloured.**

| Set | Portfolio label | Sheets | Prefix |
|-----|-----------------|--------|--------|
| `breakdown` | Script Breakdown Sample | 4 | `bd01–04` |
| `lined` | Lined Script & Facing Page Sample | 4 | `ls01–04` |
| `facing` | Lined Script & Facing Page Sample | 4 | `fp01–04` |
| `daily-log` | Daily Log & DPR Sample | 4 | `dl01–04` |
| `dpr` | Daily Log & DPR Sample | 4 | `dp01–04` |
| `call-sheet` | Call Sheet & Schedule Sample | 4 | `cs01–04` |
| `schedule` | Call Sheet & Schedule Sample | 4 | `sc01–04` |

28 sheets, ~5 MB total including thumbnails and the original PDF.

**Verbatim copy** lives in `src/data/content.ts`. The biography, the core-skills
list, the availability line, the location, the phone number, the email address
and the *"technical proof-of-work sample"* footnote are all transcribed word for
word from the PDF. That file is the single place to edit copy.

**What the PDF does not contain** — employment history, production credits,
clients, awards, dates — is not on this site. The Experience scene says so
explicitly and offers a mailto to request credit history, rather than filling
the gap with fiction. `EXPERIENCE.creditsAvailable` is the switch that controls
that placeholder.

The Expertise specimens (the `INT. KITCHEN — NIGHT` tally, the call-sheet crew
times, the DPR percentages, and so on) are **format demonstrations only**. They
are labelled as such on the card itself and in the footnote under the grid.

---

## Architecture

```
src/
  App.tsx                  scene composition, viewer + reader state, hash sync
  main.tsx
  index.css                stylesheet manifest + shared SVG texture definitions
  data/
    content.ts             every verbatim string from the portfolio
    documents.ts           document registry: groups, sheets, pages, sizes
  hooks/
    useActiveSection.ts    which scene is being read + scroll progress
    useLenis.ts            smooth scroll, scroll lock, programmatic scrolling
    useReducedMotion.ts    live prefers-reduced-motion
    useTilt.ts             rAF pointer tilt for the desk documents
  components/
    Preloader.tsx          academy leader: countdown, sweep, slate, cut
    Navigation.tsx         floating nav + full-bleed scene index (mobile)
    ScrollRail.tsx         right-edge production timeline
    Cursor.tsx             two-part cinematic cursor (delegated data-cursor)
    TextureLayer.tsx       grain, paper fibre, dust, grid, perforations, leak
    Reveal.tsx             line-mask / word-char / clip reveals, parallax, counter
    Hero.tsx               title card + layered production plate
    About.tsx              editorial copy + production-note annotations
    Profile.tsx            identity card + five-plane parallax composition
    Expertise.tsx          eight index cards with specimen demonstrations
    ProofOfWork.tsx        film-strip specimen wall + OPEN SCRIPT entry
    ProductionDesk.tsx     four documents as objects on a desk surface
    Experience.tsx         production timeline + honest credits placeholder
    Philosophy.tsx         the six disciplines
    Contact.tsx            closing sequence
    EndCard.tsx            CUT TO BLACK → credit → END.
    DocumentViewer.tsx     fullscreen document viewer
    ScriptReader.tsx       OPEN SCRIPT reading environment
  styles/
    tokens.css base.css textures.css …one file per scene
```

**State flows one way.** `App` owns `viewer` (`{ id, page } | null`) and
`readerOpen`. Sections receive plain callbacks — no global store, no context.

**Animation.** Motion (Framer Motion) for reveals and scroll-linked transforms,
Lenis for the scroll itself. No WebGL: the plate in the hero, the identity
composition and the expertise specimens are all SVG and CSS, so they stay sharp
at any resolution and cost nothing to animate.

**Performance.** One `requestAnimationFrame` loop for Lenis. Parallax and tilt
write transforms inside that frame budget rather than triggering renders.
Tilt writes straight to the node and never re-renders. Thumbnails and
specimen sheets are `loading="lazy"`; only the first sheet of each group is
preloaded, and everything else warms on idle.

---

## The two document surfaces

### Interactive document viewer
Opened from a specimen frame or a *View* button.

- Zoom 50 %–500 %: `+` / `-`, scroll wheel, pinch, or the on-screen tools
- Pan by dragging once zoomed; the offset is clamped to the sheet
- Page navigation: `←` `→`, `PageUp` `PageDown`, `Space`, `Home`, `End`
- Thumbnail strip (`T`), page counter, fullscreen, close
- `0` resets to fit
- Direction-aware page turn: the outgoing sheet rotates and masks away
- Four moods (`breakdown`, `lined`, `log`, `confidential`) retint the room and
  the sheet's edge; the call sheet gets a red confidential spine

The document itself is never obscured. Paper texture is multiplied at 16 % and
the edge shading at 12 %, both applied *over* the image so legibility is never
the price of atmosphere.

### OPEN SCRIPT
A separate, darker environment over the lined script and facing page.

- Arrow keys / `PageUp` / `PageDown` / `Space` to navigate, `Home` / `End` to jump
- One wheel gesture equals one page
- `+` / `-` / `0` to zoom and inspect detail, drag to pan
- `Esc` to step back out
- Corner slates read *PROJECT DOCUMENT* and *TECHNICAL SAMPLE*

---

## Accessibility and motion

- `prefers-reduced-motion` is honoured everywhere. Lenis is not instantiated,
  the leader collapses to a short fade, reveals become instant, grain, dust and
  light leaks stop animating, the custom cursor is never mounted, and the
  document viewport transitions become cross-fades.
- Both overlays are real dialogs with `aria-modal`, labelled, and close on
  `Escape`. Focus moves to the viewer's close button on open.
- Every specimen image carries a descriptive `alt` that states the document is
  a technical proof-of-work sample.
- Full keyboard navigation. A skip link jumps to Proof of Work.
- The custom cursor is desktop-only (`pointer: fine` and ≥ 1024 px).
- All body text meets AA contrast against the substrate; the smallest type on
  screen is decorative production notation at roughly 3.4:1 and is never the
  only carrier of meaning.

## Responsiveness

Verified without horizontal overflow at 1920×1080, 1440×900, 1366×768 and
390×844. Mobile is a separate treatment, not a squeeze: the scene index becomes
a full-bleed overlay, the scene rail retires, the identity plate moves above the
copy, the desk becomes a single column of sheets, the hero plate sheds its
heaviest layers, and the document viewer drops its fullscreen tool and lets the
sheet use the full width.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build  →  dist/
npm run preview
npm run lint
```

`dist/` is a static bundle. Deploy it to any static host.

## Deploying to Vercel

`vercel.json` is already committed. It declares the Vite framework preset, the
build command and `dist` as the output directory, adds an SPA rewrite so deep
paths resolve, and sets response headers:

| Path | Header |
|------|--------|
| `/assets/*` | `immutable`, 1 year — Vite fingerprints these filenames |
| `/documents/*` | 1 week, `stale-while-revalidate` — these names are *not* fingerprinted, so a re-extracted scan must not be cached forever |
| `/*.pdf` | `application/pdf`, 1 hour |
| everything | `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, and a `Content-Security-Policy` |

The CSP allows exactly what the site uses: `'self'` for scripts and connections,
`fonts.googleapis.com` for the stylesheet, `fonts.gstatic.com` for the webfont
files, and `'unsafe-inline'` for styles because React writes inline `style`
attributes. `frame-ancestors 'none'` and `object-src 'none'` close the obvious
holes.

**From the CLI** — install once, then `npm run deploy` (aliased to
`vercel --prod`) for every release after the first:

```bash
npm i -g vercel
cd portfolio-site
vercel            # first run: logs in, creates the project, gives you a preview URL
vercel --prod     # promote to production
```

The first `vercel` run is interactive — it opens a browser to authenticate.
After that it is non-interactive and safe to script or wire into CI.

**Or from the dashboard.** Import the repo and accept the detected settings
(Framework Preset: Vite, Build: `npm run build`, Output: `dist`); the committed
`vercel.json` fills in the rest. Every push to the default branch redeploys.

**Or from CI.** With `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` and `VERCEL_TOKEN` set,
`vercel deploy --prod --yes` is fully non-interactive.

Requires Node `>=20.19` (pinned in `engines`) — Vite 8 will not build on older
runtimes.

### Before you push

- `vercel.json` is committed, so do not delete it. The deploy works without it,
  but you lose the caching rules and the CSP.
- `public/Prathmesh_Ransingh_Portfolio.pdf` is the file the *Download
  Portfolio* button serves. Replace it if you re-issue the portfolio, and bump
  `max-age` awareness: the filename is stable, so browsers may hold the old
  copy for up to an hour.
- The document images in `public/documents/` are likewise un-fingerprinted. If
  you re-extract them from a new PDF, run a hard refresh or wait out the
  `stale-while-revalidate` window. To force it immediately, delete the files on
  the CDN or rename them in `src/data/documents.ts`.

## Extending

- **New credit or project:** add an entry to `EXPERIENCE.entries` in
  `src/data/content.ts`. The timeline renders any number of scenes. When real
  credits exist, set `EXPERIENCE.creditsAvailable = true` to retire the
  placeholder.
- **New document:** drop the extracted sheets into `public/documents/`, add an
  entry to `SIZES` in `src/data/documents.ts` with their intrinsic pixel size
  (it only reserves layout space, so nothing reflows on decode), and add a
  `ProofGroup` to `PROOF_GROUPS`. The proof wall, the desk, the viewer, the
  thumbnail strip and the page counts all follow automatically.
- **New scene:** create `src/components/YourScene.tsx` and
  `src/styles/yourscene.css`, import the stylesheet in `index.css`, add the
  component to `<main>` in `App.tsx`, and add the id to `NAV_ITEMS` in
  `content.ts` and to `SECTION_IDS`. The rail, the nav and the hash sync pick
  it up with no other changes.

---

## Contact

Prathmesh Ransingh — Script Supervisor | Assistant Director
Mumbai, Maharashtra · prathmeshfilms@gmail.com · +91 93070 49070