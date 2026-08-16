import { BRANCHES, BREACH_ORDINAL } from "@/lib/fleet/data";
import type { Machine } from "@/lib/fleet/types";

/**
 * THE HORIZON — geometry of the peg grammar.
 *
 * ONE drawing. Desktop shows the whole spine; mobile shows a window into it and
 * lets you drag along the fleet. Same geometry, same nodes, same choreography —
 * so the two can never drift into being different charts of the same data.
 *
 * ── Why this shape and not a row of ticks ────────────────────────────────────
 * A tick standing on a baseline is a bar chart, and a bar chart belongs to
 * everybody. R.Pay's product is not "values over categories" — it is a spine of
 * infrastructure that PHYSICALLY HOLDS a fleet of machines in fixed places, and
 * whose whole differentiator is what happens when one is pulled out of position.
 *
 * So the machine is a peg — وَتَد — driven into the backbone:
 *
 *      ════╤════════╤════════╤════════        spine (brass, segmented per branch)
 *          │        │        │                socket + stem (brass — infrastructure)
 *                                             ← THE JOINT: a gap in every mark
 *          ▌        ▌        ▌                head (state colour — the machine)
 *
 * Four consequences, all load-bearing:
 *   1. Bars grow UP from a baseline; pegs HANG from a spine. Opposite reading.
 *   2. The joint is a break in the middle of every mark. Repeated 97 times it makes
 *      a two-tone dash rhythm no dashboard produces, and it survives to favicon size.
 *   3. It gives the breach somewhere to happen: the peg PULLS OUT of its socket.
 *      The form itself narrates detected → isolated → stopped → recovered.
 *   4. Horizon → branch → machine → state becomes one grammar, not three devices.
 *
 * Desktop and mobile rotate the same grammar; they never become different charts.
 */

export interface TickPos {
  /** 1-based ordinal across the whole fleet. Drives choreography order. */
  ordinal: number;
  machine: Machine;
  /** Where the peg meets the spine. */
  socketX: number; socketY: number;
  /** Stem: infrastructure reaching toward the machine. */
  stemX1: number; stemY1: number; stemX2: number; stemY2: number;
  /** Head: the machine. Carries state colour. */
  headX1: number; headY1: number; headX2: number; headY2: number;
  /** Hit target. */
  hx: number; hy: number; hw: number; hh: number;
  branchIndex: number;
}

export interface DropPos {
  branchIndex: number;
  /** Branch segment of the spine. */
  segX1: number; segY1: number; segX2: number; segY2: number;
  /** The branch node — where a segment begins. */
  nodeX: number; nodeY: number;
  labelX: number; labelY: number;
  countX: number; countY: number;
}

export interface Leader {
  socketX: number; socketY: number;
  /** How far red is allowed to travel along the spine before it is contained. */
  hotA: number; hotB: number;
  labelX: number; labelY: number;
}

export interface Layout {
  width: number;
  height: number;
  spine: { x1: number; y1: number; x2: number; y2: number };
  ticks: TickPos[];
  drops: DropPos[];
  sweep: { from: number; to: number; axis: "x" | "y"; thickness: number };
  leader: Leader;
}

/* ══════════════════ DESKTOP — spine across, pegs hanging ══════════════════ */

const D_PAD = 34;
const D_GAP_M = 9;        // between machines
const D_GAP_B = 26;       // between branches — the spine breaks here
const D_SPINE_Y = 58;
const D_STEM = 22;        // socket → joint
const D_JOINT = 10;       // THE GAP
const D_HEAD = 46;        // the machine

/**
 * @param mirror  SVG coordinates ignore `direction`, so on an Arabic page an
 *   unmirrored drawing enumerates the fleet left-to-right — backwards — and the
 *   right-to-left sweep then lights ticks in the opposite order to its own travel.
 *   Mirroring puts machine 1 on the reading edge and re-syncs the light with what
 *   it deposits.
 */
export function desktopLayout(machines: Machine[], mirror = false): Layout {
  const total = machines.length;
  const width = D_PAD * 2 + (total - 1) * D_GAP_M + (BRANCHES.length - 1) * D_GAP_B;

  const ticks: TickPos[] = [];
  const drops: DropPos[] = [];

  /* Mirror about the drawing's own centre line. Text anchors are unaffected, so
     Arabic labels stay correctly shaped — only positions flip. */
  const mx = (v: number) => (mirror ? width - v : v);

  const stemEnd = D_SPINE_Y + D_STEM;
  const headTop = stemEnd + D_JOINT;
  const headEnd = headTop + D_HEAD;

  let x = D_PAD;
  let ordinal = 0;

  BRANCHES.forEach((branch, bi) => {
    const segStart = x - D_GAP_M * 0.55;

    for (let i = 0; i < branch.machineCount; i++) {
      ordinal += 1;
      ticks.push({
        ordinal,
        machine: machines[ordinal - 1],
        socketX: mx(x), socketY: D_SPINE_Y,
        stemX1: mx(x), stemY1: D_SPINE_Y, stemX2: mx(x), stemY2: stemEnd,
        headX1: mx(x), headY1: headTop, headX2: mx(x), headY2: headEnd,
        hx: mx(x) - D_GAP_M / 2, hy: D_SPINE_Y - 12,
        hw: D_GAP_M, hh: headEnd - D_SPINE_Y + 24,
        branchIndex: bi,
      });
      if (i < branch.machineCount - 1) x += D_GAP_M;
    }

    const segEnd = x + D_GAP_M * 0.55;
    drops.push({
      branchIndex: bi,
      segX1: mx(segStart), segY1: D_SPINE_Y, segX2: mx(segEnd), segY2: D_SPINE_Y,
      nodeX: mx(segStart), nodeY: D_SPINE_Y,
      labelX: mx((segStart + segEnd) / 2), labelY: D_SPINE_Y - 17,
      countX: mx((segStart + segEnd) / 2), countY: headEnd + 22,
    });

    x += D_GAP_B;
  });

  const bt = ticks.find((t) => t.ordinal === BREACH_ORDINAL)!;

  return {
    width,
    height: headEnd + 34,
    spine: { x1: 0, y1: D_SPINE_Y, x2: width, y2: D_SPINE_Y },
    ticks,
    drops,
    /* The light enters from the reading edge and leaves by the far edge, so it
       arrives at machine 1 first — the order the ticks are deposited in. */
    sweep: mirror
      ? { from: width, to: -150, axis: "x" as const, thickness: 150 }
      : { from: -150, to: width, axis: "x" as const, thickness: 150 },
    leader: {
      socketX: bt.socketX, socketY: D_SPINE_Y,
      hotA: bt.socketX - 46, hotB: bt.socketX + 46,
      labelX: bt.socketX, labelY: D_SPINE_Y - 32,
    },
  };
}

/**
 * THE PAGE AXIS.
 *
 * The x of the first branch node, as a fraction of the instrument's width. Every
 * structural line below the hero — the transition stem, Section 02's spine, the
 * Daybreak crossing, the daylight registration rule — sits on this axis, so the
 * page is one spatial construction descending from a real attachment point on the
 * fleet rather than a stack of separately styled sections.
 *
 * Derived, never hardcoded: change the padding or the tick gap and this follows.
 */
export const AXIS_PCT = ((D_PAD - D_GAP_M * 0.55) /
  (D_PAD * 2 + 96 * D_GAP_M + (BRANCHES.length - 1) * D_GAP_B)) * 100;

export { BREACH_ORDINAL };
