/**
 * SECTION 03 — خط المال · the money line.
 *
 * The objection this kills is the loudest one an operator has: who touches my
 * money on the way to me.
 *
 * ── WHY IT IS STATIC ────────────────────────────────────────────────────────
 * The obvious build is a scroll-scrubbed animation of a payment travelling. But
 * the law is that nothing moves unless it is reporting, and this is a diagram of
 * how settlement works, not a live transaction. Motion here would be decoration
 * wearing the costume of telemetry — the exact failure the whole direction was
 * built to avoid. So the argument is made in geometry instead, and it is made
 * faster: two lines, side by side, one of which is interrupted.
 *
 * ── THE GRAMMAR, USED WITH ITS MEANING INVERTED ON PURPOSE ─────────────────
 * Everywhere else on this page a BREAK in a line is structure: the spine breaks
 * between branches, between questions, between daylight blocks. Here a break is
 * the problem. The competitor path stops at a box; R.Pay's path does not stop at
 * all. That inversion is legible precisely BECAUSE the reader has been taught
 * what an unbroken line means for four sections.
 *
 * Server component. No JavaScript, no animation, no images.
 */

export default function MoneyLine({ en }: { en: boolean }) {
  /* SVG has no text direction, but the labels beneath it do. Unmirrored, the
     mint "arrived" terminus lands on the machine instead of the account and the
     diagram contradicts the sentence next to it. Same class of bug as the
     horizon's reading order. */
  const A = en ? 4 : 296;    // the machine
  const B = en ? 296 : 4;    // the account

  return (
    <section className="ml-sec" aria-labelledby="ml-title">
      <div className="stack">
        <div className="ml-col">
          <span className="label">{en ? "SETTLEMENT" : "التحصيل"}</span>
          <h2 className="ml-title" id="ml-title">
            {en ? (
              <>Your money takes <em>the short way.</em></>
            ) : (
              <>أموالك تسلك <em>الطريق القصير.</em></>
            )}
          </h2>

          <div className="ml-paths">
            {/* R.Pay: one unbroken run, machine to account. */}
            <figure className="ml-path" data-kind="direct">
              <figcaption className="ml-path-k mono">{en ? "WITH R.PAY" : "مع آر باي"}</figcaption>
              <svg viewBox="0 0 300 34" preserveAspectRatio="none" aria-hidden="true">
                <line className="ml-run" x1={A} y1="17" x2={B} y2="17" />
                <circle className="ml-end ml-from" cx={A} cy="17" r="3.4" />
                <circle className="ml-end ml-to" cx={B} cy="17" r="4.6" />
              </svg>
              <div className="ml-ends">
                <span>{en ? "the machine" : "المكينة"}</span>
                <span className="ml-arrive">{en ? "your account" : "حسابك"}</span>
              </div>
              <p className="ml-note">
                {en
                  ? "One hop. The takings settle to the operator's own account, with nobody holding them in between."
                  : "خطوة واحدة. تُحصَّل المبالغ إلى حساب المشغّل مباشرة، دون أن يمسكها أحد في الطريق."}
              </p>
            </figure>

            {/* The alternative: the same distance, interrupted. No competitor is
                named. Naming one is a claim about somebody else's business and
                needs sourcing and legal sign-off; the shape makes the point
                without asserting anything about a third party. */}
            <figure className="ml-path" data-kind="broken">
              <figcaption className="ml-path-k mono">{en ? "THE USUAL WAY" : "الطريقة المعتادة"}</figcaption>
              <svg viewBox="0 0 300 34" preserveAspectRatio="none" aria-hidden="true">
                <line className="ml-run ml-dim" x1={A} y1="17" x2={en ? 122 : 178} y2="17" />
                <rect className="ml-block" x="122" y="7" width="56" height="20" rx="2" />
                <line className="ml-run ml-dim" x1={en ? 178 : 122} y1="17" x2={B} y2="17" />
                <circle className="ml-end ml-from ml-dim-f" cx={A} cy="17" r="3.4" />
                <circle className="ml-end ml-to ml-dim-f" cx={B} cy="17" r="4.6" />
              </svg>
              <div className="ml-ends">
                <span>{en ? "the machine" : "المكينة"}</span>
                <span className="ml-mid">{en ? "an intermediary" : "وسيط"}</span>
                <span>{en ? "your account" : "حسابك"}</span>
              </div>
              <p className="ml-note">
                {en
                  ? "The money stops somewhere before it reaches you, and how long it waits there is somebody else's decision."
                  : "يتوقّف المال في مكان ما قبل أن يصلك، ومدة انتظاره هناك قرار شخص آخر."}
              </p>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
