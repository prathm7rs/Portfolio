/**
 * Every factual string in this file is taken verbatim from the supplied
 * portfolio PDF: "Prathmesh_AD&ScriptSupervisor_Portfolio.pdf".
 * Nothing here is invented. Where the PDF is silent, the data file
 * records `null` and the UI renders an honest placeholder instead.
 */

export const IDENTITY = {
  first: "Prathmesh",
  last: "Ransingh",
  full: "Prathmesh Ransingh",
  roles: "Script Supervisor | Assistant Director",
  rolesStacked: ["Script Supervisor", "Assistant Director"],
  location: "Mumbai, Maharashtra",
  locationShort: "Mumbai, India",
  email: "prathmeshfilms@gmail.com",
  phone: "+91 93070 49070",
  phoneHref: "tel:+919307049070",
  portfolioFile: "/Prathmesh_Ransingh_Portfolio.pdf",
} as const;

/** Verbatim from the portfolio bio paragraph. */
export const BIO = [
  "Script Supervisor and Assistant Director with strong practical skills in script lining, continuity tracking, script breakdown, call sheets, shooting schedules and production paperwork.",
  "Currently seeking opportunities to work on web series, films, and digital content while continuing to develop as a writer-director.",
] as const;

export const HERO_STATEMENT = "Turning scripts into production-ready realities.";

/** Verbatim from the portfolio front/back matter. */
export const AVAILABILITY =
  "Available for web series, films & digital content.";

/** Verbatim footnote printed on the sample pages of the portfolio. */
export const SAMPLE_DISCLAIMER =
  "Prepared by Prathmesh Ransingh solely as a technical proof-of-work sample for portfolio purposes";

/** CORE SKILLS, verbatim from the portfolio cover. */
export const CORE_SKILLS = [
  { id: "lining", label: "Script Lining", detail: "Element numbering, strike-throughs and revision marks" },
  { id: "facing", label: "Facing Pages", detail: "Lined columns carrying scene data for the floor" },
  { id: "continuity", label: "Continuity Logs", detail: "Shot-to-shot state, wardrobe, props and screen direction" },
  { id: "breakdown", label: "Script Breakdown", detail: "Scene-by-scene element extraction for departments" },
  { id: "callsheets", label: "Call Sheets", detail: "Crew timings, locations, notes and weather" },
  { id: "schedules", label: "Shooting Schedules", detail: "Day-by-day scene allocation against pages" },
  { id: "shotlisting", label: "Shot Listing", detail: "Frame-level planning handed to camera and art" },
  { id: "dailyreports", label: "Daily Reports", detail: "Progress, pages and department sign-offs" },
] as const;

/** The three markets named in the portfolio. */
export const SEEKING = ["Web Series", "Films", "Digital Content"] as const;

/** Verbatim from the portfolio cover. */
export const DEVELOPING_AS = "writer-director";

export const EXPERIENCE = {
  /**
   * The supplied portfolio contains no employment history, production
   * credits, dates, clients or awards. Rather than fabricate them, the
   * timeline below is built only from what the document actually states.
   */
  creditsAvailable: false,
  entries: [
    {
      id: "now",
      scene: "NOW",
      code: "SC 01",
      title: IDENTITY.roles,
      body: [
        "Currently seeking opportunities to work on web series, films, and digital content while continuing to develop as a writer-director.",
      ],
      meta: ["Mumbai, Maharashtra", "Available for work"],
      status: "OPEN",
    },
    {
      id: "practice",
      scene: "PRACTICE",
      code: "SC 02",
      title: "The floor, the room, the paperwork",
      body: [
        "Script Supervisor and Assistant Director with strong practical skills in script lining, continuity tracking, script breakdown, call sheets, shooting schedules and production paperwork.",
      ],
      meta: ["Script Supervisor", "Assistant Director"],
      status: "ACTIVE",
    },
    {
      id: "proof",
      scene: "PROOF",
      code: "SC 03",
      title: "Technical proof-of-work",
      body: [
        SAMPLE_DISCLAIMER + ".",
      ],
      meta: ["Breakdown", "Lining & facing pages", "Daily log & DPR", "Call sheet & schedule"],
      status: "ON FILE",
    },
  ],
} as const;

export const PHILOSOPHY = {
  heading: "The job is in the details.",
  quote: "Cinema is chaos. Good preparation gives the chaos structure.",
  pillars: [
    {
      n: "01",
      term: "Continuity",
      note: "Nothing changes between two frames unless a human decides it does.",
    },
    {
      n: "02",
      term: "Timing",
      note: "A schedule is a promise made to forty departments at 5 a.m.",
    },
    {
      n: "03",
      term: "Preparation",
      note: "The facing page exists so nobody has to improvise on the day.",
    },
    {
      n: "04",
      term: "Communication",
      note: "The chain from director to second unit breaks at the handover.",
    },
    {
      n: "05",
      term: "Documentation",
      note: "If it was not written down, it did not happen.",
    },
    {
      n: "06",
      term: "Production discipline",
      note: "The paperwork is the product. The picture is only the evidence.",
    },
  ],
} as const;

export const NAV_ITEMS = [
  { id: "about", idx: "01", label: "About" },
  { id: "expertise", idx: "02", label: "Expertise" },
  { id: "proof-of-work", idx: "03", label: "Proof of Work" },
  { id: "experience", idx: "04", label: "Experience" },
  { id: "contact", idx: "05", label: "Contact" },
] as const;