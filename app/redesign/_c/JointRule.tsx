/**
 * REPETITION TEST 2 — the joint as a section divider.
 *
 * A section break is normally a 1px line, which is the single most generic
 * element in web design. Here it is the same grammar at rest: a brass spine that
 * BREAKS, with one peg hanging off it — socket, stem, JOINT, head.
 *
 * The head carries the section's colour, so the divider states what is coming
 * rather than merely separating. Server component: no JS, no client bundle cost.
 */

interface Props {
  /** Which state the section below reports. Cyan only ever means live. */
  tone?: "signal" | "breach" | "settled" | "dead";
  /** Where the peg hangs, 0–1 across the rule. */
  at?: number;
  label?: string;
}

export default function JointRule({ tone = "signal", at = 0.28, label }: Props) {
  // Four segments, unequal — the spine is never a ruler.
  const GAP = 1.6;
  const widths = [26, 34, 21, 19];
  const usable = 100 - GAP * (widths.length - 1);
  let x = 0;
  const segs = widths.map((w) => {
    const seg = { x, w: (w / 100) * usable };
    x += seg.w + GAP;
    return seg;
  });

  const pegX = Math.max(2, Math.min(98, at * 100));

  return (
    <div className="joint-rule" data-tone={tone}>
      <svg viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true">
        {segs.map((s, i) => (
          <g key={i}>
            <rect className="jr-seg" x={s.x} y={0} width={s.w} height={1.1} />
            <line className="jr-node" x1={s.x} y1={0} x2={s.x} y2={3} />
          </g>
        ))}
        {/* socket → stem → JOINT → head, the atom of the system */}
        <line className="jr-stem" x1={pegX} y1={1.1} x2={pegX} y2={4.6} />
        {/* the joint is the empty space here — 4.5 to 7.2 */}
        <line className="jr-head" x1={pegX} y1={7.4} x2={pegX} y2={13.6} />
      </svg>
      {label ? <span className="jr-label mono">{label}</span> : null}
    </div>
  );
}
