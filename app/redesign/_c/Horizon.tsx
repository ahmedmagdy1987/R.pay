"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BRANCHES } from "@/lib/fleet/data";
import type { Fleet, Machine } from "@/lib/fleet/types";
import { desktopLayout, BREACH_ORDINAL, type Layout } from "./geometry";

/**
 * THE HORIZON — the owned form.
 *
 * Grammar: spine → socket → stem → JOINT → head. See geometry.ts for why.
 *
 * The breach is narrated by the form, not by a status message: the peg pulls out
 * of its socket (the joint widens), the head loses its state colour, the socket
 * scars, and red travels a bounded distance along the spine and stops — which is
 * containment made visible. Recovery reverses it slowly. Danger arrives fast and
 * leaves slowly; that asymmetry is the product's argument.
 *
 * ── Two implementation rules from this repo's own history ──
 * 1. The choreography never touches React state. Peg elements render once from
 *    static data and their props never change, so React cannot reconcile away the
 *    attributes we set imperatively. (A previous build lost a whole section to
 *    exactly that.) The hover readout, which does use state, owns no animation
 *    attributes.
 * 2. Pegs are server-rendered in their final state, so with JS off or slow the
 *    instrument is already correct; the sequence is an enhancement.
 */

type Beat = { at: number; run: () => void };

interface Props {
  fleet: Fleet;
  en: boolean;
}

export default function Horizon({ fleet, en }: Props) {
  const layout = desktopLayout(fleet.machines);

  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [readout, setReadout] = useState<Machine | null>(null);
  const timers = useRef<number[]>([]);

  const branchOf = useCallback((id: string) => BRANCHES.find((b) => b.id === id), []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const block = root.closest<HTMLElement>(".horizon-block") ?? root;
    const phase = (p: string) => block.setAttribute("data-phase", p);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pegs = Array.from(root.querySelectorAll<SVGElement>("[data-ordinal]"));
    const structure = Array.from(root.querySelectorAll<SVGElement>("[data-structure]"));
    const sweeps = Array.from(root.querySelectorAll<SVGRectElement>(".h-sweep"));
    const breachGroups = Array.from(root.querySelectorAll<SVGElement>(".h-breach"));

    const setAll = (attr: string, val: string) => pegs.forEach((t) => t.setAttribute(attr, val));
    const showStructure = () => structure.forEach((el) => el.setAttribute("data-in", "1"));
    const setBreachUI = (v: string) => breachGroups.forEach((g) => g.setAttribute("data-in", v));
    const setPegState = (s: string) =>
      pegs
        .filter((t) => Number(t.dataset.ordinal) === BREACH_ORDINAL)
        .forEach((t) => t.setAttribute("data-state", s));

    // Reduced motion: final state at first paint, breach included and attributed.
    if (reduced) {
      root.setAttribute("data-armed", "false");
      setAll("data-lit", "1");
      setAll("data-resolved", "1");
      showStructure();
      setPegState("breach");
      setBreachUI("1");
      phase("resolved");
      return;
    }

    root.setAttribute("data-armed", "true");
    setAll("data-lit", "0");
    setAll("data-resolved", "0");

    const beats: Beat[] = [
      // 2 — the fleet reports in. Constant velocity: machines do not ease.
      {
        at: 150,
        run: () => {
          sweeps.forEach((s) => {
            const axis = s.dataset.axis === "y" ? "translateY" : "translateX";
            const from = Number(s.dataset.from ?? 0);
            const to = Number(s.dataset.to ?? 0);
            s.animate(
              [
                { transform: `${axis}(${from}px)`, opacity: 0 },
                { transform: `${axis}(${from * 0.86}px)`, opacity: 1, offset: 0.08 },
                { transform: `${axis}(${to * 0.6}px)`, opacity: 1, offset: 0.92 },
                { transform: `${axis}(${to}px)`, opacity: 0 },
              ],
              { duration: 900, easing: "linear", fill: "forwards" },
            );
          });
          pegs.forEach((t) => {
            const i = Number(t.dataset.ordinal) - 1;
            timers.current.push(window.setTimeout(() => t.setAttribute("data-lit", "1"), i * 9));
          });
        },
      },
      // 3 — branch segments resolve; the spine becomes a scale.
      { at: 1050, run: () => { showStructure(); phase("scaled"); } },
      // 4 — the rails.
      { at: 1600, run: () => phase("railed") },
      // 5 — pegs resolve into truth. Seven stay grey.
      {
        at: 2200,
        run: () => {
          pegs.forEach((t) => {
            const i = Number(t.dataset.ordinal) - 1;
            timers.current.push(
              window.setTimeout(() => t.setAttribute("data-resolved", "1"), i * 29),
            );
          });
        },
      },
      // 6a — DETECTED. The socket scars; red begins travelling the spine.
      { at: 5000, run: () => { setPegState("alert"); setBreachUI("1"); phase("breach"); } },
      // 6b — ISOLATED + STOPPED. The peg pulls out of its socket and goes dark.
      { at: 5320, run: () => setPegState("breach") },
      // 7 — RECOVERED, deliberately: red drains, the peg seats, the joint closes.
      { at: 6600, run: () => { setPegState("online"); setBreachUI("0"); phase("restored"); } },
    ];

    beats.forEach((b) => timers.current.push(window.setTimeout(b.run, b.at)));

    // On the phone the frame is narrower than the drawing. Open it centred on the
    // machine the story is about, so the breach is never off-screen.
    const frame = frameRef.current;
    if (frame && frame.scrollWidth > frame.clientWidth) {
      const svg = frame.querySelector("svg");
      const vb = svg?.viewBox.baseVal;
      if (vb) {
        const ratio = frame.scrollWidth / vb.width;
        const target = 43 * 9 * ratio - frame.clientWidth / 2;
        const max = frame.scrollWidth - frame.clientWidth;
        const clamped = Math.max(0, Math.min(target, max));
        // RTL scroll containers count leftward from 0, hence the sign flip.
        const rtl = getComputedStyle(frame).direction === "rtl";
        frame.scrollLeft = rtl ? -(max - clamped) : clamped;
      }
    }

    const all = timers.current;
    return () => all.forEach(clearTimeout);
  }, []);

  const renderLayout = (layout: Layout, variant: "d") => {
    return (
      <svg
        className="horizon-svg"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        role="presentation"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient
            id={`rp-sweep-${variant}`}
            x1="0" y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="0%" stopColor="#00AEEF" stopOpacity="0" />
            <stop offset="55%" stopColor="#00AEEF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#00AEEF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* The travelling light */}
        <rect
          className="h-sweep"
          fill={`url(#rp-sweep-${variant})`}
          data-axis={layout.sweep.axis}
          data-from={layout.sweep.from}
          data-to={layout.sweep.to}
          x={0}
          y={layout.spine.y1 - 26}
          width={layout.sweep.thickness}
          height={126}
        />

        {/* Branch segments — the spine is broken per branch, not continuous.
            The breaks ARE the branch structure; no extra chart furniture. */}
        {layout.drops.map((d) => {
          const b = BRANCHES[d.branchIndex];
          return (
            <g key={`${variant}-seg-${b.id}`}>
              <line className="h-seg" x1={d.segX1} y1={d.segY1} x2={d.segX2} y2={d.segY2} />
              <g data-structure="" data-in="0" className="h-structure">
                <circle className="h-node" cx={d.nodeX} cy={d.nodeY} r={2.2} />
                <text
                  className="h-branch-label"
                  x={d.labelX} y={d.labelY}
                  textAnchor="middle"
                >
                  {en ? b.nameEn : b.nameAr}
                </text>
                <text
                  className="h-branch-count"
                  x={d.countX} y={d.countY}
                  textAnchor="middle"
                >
                  {b.machineCount}
                </text>
              </g>
            </g>
          );
        })}

        {/* The breach acting on the form itself: a bounded red run along the
            spine — containment made visible — plus the scarred socket. */}
        <g className="h-breach" data-in="0">
          <line
            className="h-hot"
            x1={layout.leader.hotA}
            y1={layout.leader.socketY}
            x2={layout.leader.hotB}
            y2={layout.leader.socketY}
          />
          <circle className="h-scar" cx={layout.leader.socketX} cy={layout.leader.socketY} r={3.4} />
          <text
            className="h-breach-t"
            x={layout.leader.labelX} y={layout.leader.labelY}
            textAnchor="middle"
          >
            {en ? "43 · ISOLATED" : "٤٣ · معزولة"}
          </text>
        </g>

        {/* One peg per machine: socket · stem · JOINT · head */}
        {layout.ticks.map((t) => (
          <g
            key={`${variant}-p-${t.machine.id}`}
            className="pg"
            data-ordinal={t.ordinal}
            data-state={t.machine.state}
            data-lit="1"
            data-resolved="1"
          >
            <rect
              className="h-hit"
              x={t.hx} y={t.hy} width={t.hw} height={t.hh}
              onMouseEnter={() => setReadout(t.machine)}
              onMouseLeave={() => setReadout(null)}
              onTouchStart={() => setReadout(t.machine)}
            />
            <line className="pg-stem" x1={t.stemX1} y1={t.stemY1} x2={t.stemX2} y2={t.stemY2} />
            <line className="pg-head" x1={t.headX1} y1={t.headY1} x2={t.headX2} y2={t.headY2} />
          </g>
        ))}
      </svg>
    );
  };

  const b = readout ? branchOf(readout.branchId) : null;

  return (
    <div className="horizon" ref={rootRef} data-armed="false">
      {/* The instrument is a graphic. Assistive tech gets navigable content
          instead of 97 tab stops, which would be a keyboard trap in all but name. */}
      <div className="vh">
        <h2>{en ? "Fleet status" : "حالة الأسطول"}</h2>
        <p>
          {en
            ? `${fleet.totals.machines.value} machines across ${fleet.totals.branches.value} branches. ${fleet.totals.online.value} online, ${fleet.totals.offline.value} offline. Company-reported, as of ${fleet.totals.machines.asOf}.`
            : `${fleet.totals.machines.value} مكينة في ${fleet.totals.branches.value} فروع. ${fleet.totals.online.value} متصلة و${fleet.totals.offline.value} غير متصلة. بيانات الشركة حتى ${fleet.totals.machines.asOf}.`}
        </p>
        <table>
          <caption>{en ? "Machines by branch" : "المكائن حسب الفرع"}</caption>
          <thead>
            <tr>
              <th scope="col">{en ? "Branch" : "الفرع"}</th>
              <th scope="col">{en ? "Machines" : "المكائن"}</th>
              <th scope="col">{en ? "Online" : "متصلة"}</th>
            </tr>
          </thead>
          <tbody>
            {BRANCHES.map((br) => {
              const inBranch = fleet.machines.filter((m) => m.branchId === br.id);
              const online = inBranch.filter((m) => m.state === "online").length;
              return (
                <tr key={br.id}>
                  <th scope="row">{en ? br.nameEn : br.nameAr}</th>
                  <td>{br.machineCount}</td>
                  <td>{online}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* One drawing. On a phone this frame becomes a scroll window into a fleet
          that is wider than the screen — which is literally true, and guarantees
          the mobile identity is the same object rather than a second chart. */}
      <div className="h-frame" ref={frameRef}>{renderLayout(layout, "d")}</div>
      <p className="h-drag-hint" aria-hidden="true">
        {en ? "drag along the fleet →" : "← اسحب على طول الأسطول"}
      </p>

      <div className="readout" aria-live="polite">
        {readout && b ? (
          <>
            <span className="ro-id mono ltr">{readout.id}</span>
            <span className="ro-k label">{en ? "Branch" : "الفرع"}</span>
            <span className="ro-v">{en ? b.nameEn : b.nameAr}</span>
            <span className="ro-k label">{en ? "State" : "الحالة"}</span>
            <span className="ro-v" data-state={readout.state}>
              {readout.state === "online"
                ? en ? "Online" : "متصلة"
                : en ? "Offline" : "غير متصلة"}
            </span>
            <span className="ro-k label">{en ? "Today" : "اليوم"}</span>
            <span className="ro-v mono ltr">
              {readout.today === null ? "—" : `SAR ${readout.today.toLocaleString("en-US")}`}
            </span>
          </>
        ) : (
          <span className="ro-hint">
            {en
              ? "Point at any machine on the horizon to read it."
              : "أشِر إلى أي مكينة على الأفق لقراءتها."}
          </span>
        )}
      </div>
    </div>
  );
}
