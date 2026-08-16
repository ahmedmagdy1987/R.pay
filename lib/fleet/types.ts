/**
 * R.Pay fleet data contract.
 *
 * DESIGN LAW 4 — "Every number carries its date."
 *
 * Every figure surfaced in the interface is a `Metric`, never a bare number. The UI reads
 * `isLive` to decide what it is allowed to *claim*:
 *
 *   isLive === false  →  render a dated provenance chip ("بيانات حتى ١٦ أغسطس ٢٠٢٦").
 *                        The word "مباشر / LIVE" MUST NOT appear anywhere near it.
 *   isLive === true   →  render the LIVE badge and the pulsing cyan indicator.
 *
 * Milestone 1 ships everything as `isLive: false`. When a real aggregate endpoint exists,
 * `getFleet()` swaps its implementation and the interface upgrades itself — no component
 * changes, no layout changes. That is the whole point of this shape.
 */

/** Where a figure came from. Surfaced in the provenance chip so a claim is always attributable. */
export type MetricSource =
  /** Supplied by R.Pay, not yet independently verified. Shows a date, never "live". */
  | "company-reported"
  /** Read from a live R.Pay endpoint at request time. Only this may claim "live". */
  | "live-endpoint"
  /** Shape-correct development placeholder. MUST be visibly labelled as a simulation. */
  | "placeholder";

export interface Metric<T = number> {
  value: T;
  /** ISO date the value was measured. Rendered in the provenance chip. */
  asOf: string;
  /** Only `true` when the value came from a live endpoint this request. */
  isLive: boolean;
  source: MetricSource;
}

export type MachineState = "online" | "offline" | "breach";

export interface Machine {
  /** Stable within a branch; displayed LTR-isolated inside RTL copy. */
  id: string;
  branchId: string;
  state: MachineState;
  /** Today's take in SAR. Null when the machine is not reporting. */
  today: number | null;
}

export interface Branch {
  id: string;
  /** Arabic name — authored, not translated (Design Law 7). */
  nameAr: string;
  nameEn: string;
  machineCount: number;
}

export interface Fleet {
  branches: Branch[];
  machines: Machine[];
  totals: {
    machines: Metric;
    online: Metric;
    offline: Metric;
    branches: Metric;
    transactions: Metric;
    prizes: Metric;
  };
}

/** True only when every surfaced figure genuinely came from a live endpoint. */
export function isFleetLive(fleet: Fleet): boolean {
  return Object.values(fleet.totals).every((m) => m.isLive);
}
