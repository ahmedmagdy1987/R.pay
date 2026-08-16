/**
 * DAYBREAK — the act break, and the first daylight section.
 *
 * THE FALSIFICATION TEST: can the identity survive a complete environmental change
 * without becoming a second brand?
 *
 * ── What is deliberately NOT carried across ──────────────────────────────────
 *   No cyan.        Nothing here is live. Continuity may not be bought with colour.
 *   No pegs.        Nothing hangs in daylight — there is no fleet to suspend.
 *   No telemetry.   No numerals, no timestamps, no state.
 *   No motion.      Explanation does not report.
 *
 * ── What actually carries the brand ─────────────────────────────────────────
 * The deep DNA is not the peg. It is:
 *
 *   1. THE AXIS        every structural line sits on --axis, the x of the
 *                      instrument's first branch node. The daylight rule is on
 *                      the same axis as the hero's spine, four sections above.
 *   2. THE BREAK       the rule is interrupted where the content changes, exactly
 *                      as the spine breaks between branches and between questions.
 *   3. THE NODE        a heavier mark where a block attaches.
 *   4. HIERARCHY BY WEIGHT   infrastructure is drawn heavier than what it carries.
 *   5. TWO VOICES      mono labels, Readex speech — unchanged, only warmer.
 *   6. MEASURE         the same Arabic-first reading discipline.
 *
 * ── The one earned joint ────────────────────────────────────────────────────
 * The joint appears once, at the cut. The brass line ends above the boundary, the
 * gap spans it, and the line resumes below in ink. That is the joint's exact
 * meaning — two different things, connected — applied to the two worlds of the
 * page. It is used here and nowhere else in daylight.
 *
 * ── The role change ─────────────────────────────────────────────────────────
 * In the dark the line SUSPENDS: machines and questions hang from it.
 * In daylight the same line REGISTERS: type is set against it, nothing hangs.
 * Same object, same axis, changed job. That is inheritance, not duplication.
 *
 * Zero client JavaScript. The environment change is a hard cut, not a fade — a
 * crossfade would be a theme change, and this is an act break.
 */

export default function Daybreak({ en }: { en: boolean }) {
  return (
    <>
      {/* ── The crossing: night side ────────────────────────────────────── */}
      <div className="db-night">
        <div className="stack">
          <div className="db-col">
            <span className="db-stem" aria-hidden="true" />
            {/* The system's last utterance. After the cut, only people speak. */}
            <span className="db-sign mono">
              {en ? "END OF SHIFT" : "تنتهي الوردية"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Daylight ────────────────────────────────────────────────────── */}
      <section className="daylight" id="about" aria-labelledby="dl-title">
        <div className="stack">
          <div className="dl-col">
            {/* The rule resumes after the joint, now registering instead of
                suspending. Broken where the content changes. */}
            <span className="dl-rule dl-rule-a" aria-hidden="true" />
            <span className="dl-node dl-node-a" aria-hidden="true" />

            <span className="dl-eyebrow mono">{en ? "ABOUT R.PAY" : "عن آر باي"}</span>

            <h2 className="dl-title" id="dl-title">
              {en
                ? "A Saudi company building the payment and control systems for the self-service sector."
                : "شركة سعودية تبني أنظمة الدفع والتحكّم لقطاع الأجهزة والخدمات الذاتية."}
            </h2>

            <p className="dl-body">
              {en
                ? "We let operators run and watch their operations in real time — raising operational efficiency, giving the person at the machine a smooth and secure experience, and letting the business grow without the paperwork growing with it."
                : "نمكّن المشغّلين من إدارة عملياتهم ومتابعتها في الوقت الفعلي، لتعزيز الكفاءة التشغيلية، وتقديم تجربة سلسة وآمنة لمن يقف أمام المكينة، ودعم نمو الأعمال بمرونة."}
            </p>

            {/* The break. The rule stops, the content changes, the rule resumes. */}
            <div className="dl-pair">
              <div className="dl-block">
                <span className="dl-rule dl-rule-b" aria-hidden="true" />
                <span className="dl-node dl-node-b" aria-hidden="true" />
                <span className="dl-label mono">{en ? "OUR MISSION" : "مهمتنا"}</span>
                <p className="dl-statement">
                  {en
                    ? "To let operators raise their efficiency, give their customers a smooth and secure experience, and grow with flexibility."
                    : "تمكين المشغّلين من تعزيز الكفاءة التشغيلية، وتقديم تجربة سلسة وآمنة للمستخدم، ودعم نمو الأعمال بكفاءة ومرونة."}
                </p>
              </div>

              <div className="dl-block">
                <span className="dl-rule dl-rule-b" aria-hidden="true" />
                <span className="dl-node dl-node-b" aria-hidden="true" />
                <span className="dl-label mono">{en ? "OUR VISION" : "رؤيتنا"}</span>
                <p className="dl-statement">
                  {en
                    ? "To be the leading technology platform for running self-service machines in the Kingdom and the region."
                    : "أن نكون المنصة التقنية الرائدة لإدارة وتشغيل الأجهزة الذاتية في المملكة والمنطقة."}
                </p>
              </div>
            </div>

            <div className="dl-more">
              <a className="dl-link" href="#top">
                {en ? "Back to the control room" : "العودة إلى غرفة التحكم"}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
