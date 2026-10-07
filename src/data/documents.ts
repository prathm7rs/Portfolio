/**
 * Document registry.
 *
 * Every page image here was extracted losslessly from the embedded scans
 * inside the supplied portfolio PDF, then split along the real sheet
 * boundaries and re-encoded. No document content was retyped, redrawn
 * or invented — the samples stay exactly as they were submitted.
 */

export type PageImage = {
  src: string;
  thumb: string;
  w: number;
  h: number;
};

export type Sheet = {
  id: string;
  label: string;
  caption: string;
  pages: PageImage[];
};

export type ProofGroup = {
  id: string;
  idx: string;
  title: string;
  standfirst: string;
  /** What the viewer must be able to do with this document. */
  purpose: string;
  /** The portfolio's own labels for the two sheets, where it gave them. */
  sheets: Sheet[];
  viewerMood: "breakdown" | "lined" | "log" | "confidential";
  /** Label used on the production-desk surface. */
  deskLabel: string;
  /** One-line technical description for the document card footer. */
  tech: string;
  accent: string;
};

const p = (prefix: string, w: number, h: number, i: number): PageImage => ({
  src: `/documents/${prefix}${String(i).padStart(2, "0")}.jpg`,
  thumb: `/documents/thumb_${prefix}${String(i).padStart(2, "0")}.jpg`,
  w,
  h,
});

/**
 * Intrinsic sheet sizes, measured from the extracted scans. Used only to
 * reserve layout space so nothing reflows while a page is decoded.
 */
const SIZES: Record<string, [number, number][]> = {
  bd: [
    [484, 652],
    [484, 652],
    [484, 652],
    [484, 652],
  ],
  ls: [
    [232, 740],
    [232, 711],
    [232, 710],
    [232, 740],
  ],
  fp: [
    [236, 628],
    [236, 627],
    [236, 627],
    [236, 626],
  ],
  dl: [
    [243, 834],
    [243, 833],
    [243, 833],
    [243, 834],
  ],
  dp: [
    [249, 735],
    [249, 734],
    [249, 734],
    [249, 735],
  ],
  cs: [
    [237, 712],
    [237, 712],
    [237, 712],
    [237, 712],
  ],
  sc: [
    [243, 814],
    [243, 813],
    [243, 813],
    [243, 813],
  ],
};

const cols = (prefix: string): PageImage[] =>
  SIZES[prefix].map(([w, h], i) => p(prefix, w, h, i + 1));

export const PROOF_GROUPS: ProofGroup[] = [
  {
    id: "breakdown",
    idx: "01",
    title: "Script Breakdown",
    standfirst:
      "Every element in a scene, pulled out and counted before a single foot of camera is bought.",
    purpose:
      "Department heads read this to know what they are carrying, and what they are not.",
    sheets: [
      {
        id: "bd",
        label: "Master Script Breakdown",
        caption: "Scene header block, then element tally per scene.",
        pages: cols("bd"),
      },
    ],
    viewerMood: "breakdown",
    deskLabel: "Script Breakdown",
    tech: "4 sheets · element extraction",
    accent: "brass",
  },
  {
    id: "lined",
    idx: "02",
    title: "Lined Script & Facing Page",
    standfirst:
      "The script as a working document — revised, numbered, annotated, and faced with the data the floor needs.",
    purpose:
      "The facing page is how a first AD reads a scene at 4 a.m. without turning a page.",
    sheets: [
      {
        id: "ls",
        label: "Lined Script",
        caption: "Element codes struck into the script body.",
        pages: cols("ls"),
      },
      {
        id: "fp",
        label: "Facing Page",
        caption: "Facing-page grid carrying scene totals.",
        pages: cols("fp"),
      },
    ],
    viewerMood: "lined",
    deskLabel: "Lined Script",
    tech: "8 sheets · lining + facing",
    accent: "brass",
  },
  {
    id: "logs",
    idx: "03",
    title: "Daily Log & Daily Progress Report",
    standfirst:
      "The day, written down. What was achieved, what was not, and what the unit starts with tomorrow.",
    purpose:
      "A log is not a memory aid. It is the record a producer, a financier and an editor will all rely on.",
    sheets: [
      {
        id: "dl",
        label: "Daily Log",
        caption: "Dated activity, department remarks, sign-off rows.",
        pages: cols("dl"),
      },
      {
        id: "dp",
        label: "Daily Progress Report",
        caption: "Scene-level progress tracking with completion marks.",
        pages: cols("dp"),
      },
    ],
    viewerMood: "log",
    deskLabel: "Daily Log / DPR",
    tech: "8 sheets · progress tracking",
    accent: "brass",
  },
  {
    id: "callsheet",
    idx: "04",
    title: "Call Sheet & Schedule",
    standfirst:
      "The document the whole unit wakes up to, and the schedule that keeps the days adding up.",
    purpose:
      "Times, locations, crew, and the notes that stop forty people from arriving in the wrong place.",
    sheets: [
      {
        id: "cs",
        label: "Call Sheet",
        caption: "General information, crew block, production notes.",
        pages: cols("cs"),
      },
      {
        id: "sc",
        label: "Shooting Schedule",
        caption: "Day allocation with scene, pages and set diagrams.",
        pages: cols("sc"),
      },
    ],
    viewerMood: "confidential",
    deskLabel: "Call Sheet / Schedule",
    tech: "8 sheets · daily operations",
    accent: "brass",
  },
];

/** Flattened reading order for the screenplay reader: Lined Script → Facing Page. */
export const READER_SEQUENCE: Sheet[] = PROOF_GROUPS[1].sheets;

export const ALL_SHEETS: Sheet[] = PROOF_GROUPS.flatMap((g) => g.sheets);

export const TOTAL_PAGES = ALL_SHEETS.reduce((n, s) => n + s.pages.length, 0);

export function groupById(id: string): ProofGroup {
  const found = PROOF_GROUPS.find((g) => g.id === id);
  if (!found) throw new Error(`Unknown document group: ${id}`);
  return found;
}

/** Flat page index across a group, keeping sheet boundaries for the UI. */
export function flatten(group: ProofGroup) {
  const out: { page: PageImage; sheet: Sheet; indexInSheet: number }[] = [];
  for (const sheet of group.sheets) {
    sheet.pages.forEach((page, indexInSheet) => out.push({ page, sheet, indexInSheet }));
  }
  return out;
}

export const MOOD_LABEL: Record<ProofGroup["viewerMood"], string> = {
  breakdown: "Breakdown Reference",
  lined: "Working Screenplay",
  log: "Production Log",
  confidential: "Confidential — Production Document",
};