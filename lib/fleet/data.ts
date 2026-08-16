import type { Branch, Fleet, Machine, Metric } from "./types";

/**
 * Milestone 1 fleet data — DATED STATIC, architecture ready for a live endpoint.
 *
 * ── Provenance, stated plainly ────────────────────────────────────────────────
 * The headline totals (97 machines, 9 branches, 465,255 transactions, 9,434 prizes,
 * 90 online) are the figures R.Pay publishes on its own production site. They are
 * carried here as `company-reported` and MUST be re-confirmed by the owner before
 * launch — see docs/redesign-2026/01-PRODUCTION-SPEC.md §13 B1.
 *
 * The per-machine breakdown (which specific machines are offline, per-machine revenue,
 * the branch split) is NOT published anywhere and is therefore `placeholder`: it is
 * shape-correct scaffolding so the instrument can be built and judged. Anything driven
 * by it is labelled as a simulation in the UI.
 *
 * Branches are named by city, not by client venue. Naming them after Roshn or Boulevard
 * would assert deployments we cannot evidence — the honesty framework forbids it.
 *
 * To go live later: replace `getFleet()` with a fetch, set isLive true, and the UI
 * upgrades itself. No component changes.
 */

const AS_OF = "2026-08-16";

const metric = (
  value: number,
  source: Metric["source"] = "company-reported",
): Metric => ({ value, asOf: AS_OF, isLive: false, source });

export const BRANCHES: Branch[] = [
  { id: "RUH", nameAr: "الرياض",     nameEn: "Riyadh",   machineCount: 18 },
  { id: "JED", nameAr: "جدة",        nameEn: "Jeddah",   machineCount: 14 },
  { id: "DMM", nameAr: "الدمام",     nameEn: "Dammam",   machineCount: 13 },
  { id: "KHB", nameAr: "الخبر",      nameEn: "Khobar",   machineCount: 12 },
  { id: "MKK", nameAr: "مكة",        nameEn: "Makkah",   machineCount: 11 },
  { id: "MED", nameAr: "المدينة",    nameEn: "Madinah",  machineCount: 9  },
  { id: "QSM", nameAr: "القصيم",     nameEn: "Qassim",   machineCount: 8  },
  { id: "ABH", nameAr: "أبها",       nameEn: "Abha",     machineCount: 7  },
  { id: "TBK", nameAr: "تبوك",       nameEn: "Tabuk",    machineCount: 5  },
];

/** Machine ordinals that are offline. 7 of 97, matching the published 90/97. */
const OFFLINE = new Set([9, 22, 37, 58, 66, 81, 94]);

/** The machine the hero narrates. Deliberately mid-fleet so the eye has to find it. */
export const BREACH_ORDINAL = 43;

/**
 * Deterministic pseudo-revenue. Seeded, not random, so server and client render
 * identically — React would otherwise flag a hydration mismatch, and the figure would
 * change on every refresh, which reads as fake.
 */
function seededToday(ordinal: number): number {
  const n = Math.sin(ordinal * 12.9898) * 43758.5453;
  const frac = n - Math.floor(n);
  return Math.round((180 + frac * 1240) / 5) * 5;
}

function buildMachines(): Machine[] {
  const machines: Machine[] = [];
  let ordinal = 0;

  for (const branch of BRANCHES) {
    for (let i = 1; i <= branch.machineCount; i++) {
      ordinal += 1;
      const offline = OFFLINE.has(ordinal);
      machines.push({
        id: `${branch.id}-${String(i).padStart(2, "0")}`,
        branchId: branch.id,
        state: offline ? "offline" : "online",
        today: offline ? null : seededToday(ordinal),
      });
    }
  }

  return machines;
}

const MACHINES = buildMachines();

export function getFleet(): Fleet {
  return {
    branches: BRANCHES,
    machines: MACHINES,
    totals: {
      machines: metric(97),
      online: metric(90),
      offline: metric(7),
      branches: metric(9),
      transactions: metric(465255),
      prizes: metric(9434),
    },
  };
}

/** Today's settled total, derived from the placeholder per-machine figures. */
export function settledToday(): Metric {
  const sum = MACHINES.reduce((acc, m) => acc + (m.today ?? 0), 0);
  return { value: sum, asOf: AS_OF, isLive: false, source: "placeholder" };
}

/** Arabic long-form date for the provenance chip. */
export function formatAsOfAr(iso: string): string {
  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${months[m - 1]} ${y}`;
}

export function formatAsOfEn(iso: string): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${months[m - 1]} ${y}`;
}
