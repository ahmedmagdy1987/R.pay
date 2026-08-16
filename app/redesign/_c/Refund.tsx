/**
 * SECTION 04 — الريال الذي عاد · the riyal that came back.
 *
 * Its own beat, and a short one. A payment fails and the money goes home by
 * itself: no ticket, no call, no refund request, nobody's evening.
 *
 * ── WHY THIS IS THE QUIETEST SECTION ON THE PAGE ───────────────────────────
 * Everything around it argues. This one only has to be true. The whole
 * differentiator is that NOTHING HAPPENED — no human intervened — and a section
 * that animated hard to say "nothing happened" would contradict itself. So it is
 * one reversed line and one log entry, and it is over.
 *
 * The line runs the other way from the money line above it, which is the entire
 * visual argument: same path, opposite direction, and it is the system that
 * walked it back rather than a person.
 *
 * Server component. No JavaScript, no animation, no images.
 */

export default function Refund({ en }: { en: boolean }) {
  /* The card is the destination here, and it sits on the reading-start side so
     the drawing runs the same way the sentence does. */
  const CARD = en ? 8 : 292;
  const MACHINE = en ? 292 : 8;

  return (
    <section className="rf-sec" aria-labelledby="rf-title">
      <div className="stack">
        <div className="rf-col">
          <span className="label">{en ? "WHEN IT FAILS" : "حين يفشل الدفع"}</span>
          <h2 className="rf-title" id="rf-title">
            {en ? (
              <>The money goes back <em>on its own.</em></>
            ) : (
              <>يعود المال <em>من تلقاء نفسه.</em></>
            )}
          </h2>

          <figure className="rf-path" aria-hidden="true">
            <svg viewBox="0 0 300 30" preserveAspectRatio="none">
              {/* Reversed: the terminus is on the card side now. */}
              <line className="rf-run" x1={MACHINE} y1="15" x2={CARD} y2="15" />
              <circle className="rf-back" cx={CARD} cy="15" r="4.6" />
              <circle className="rf-from" cx={MACHINE} cy="15" r="3.4" />
            </svg>
            <div className="rf-ends">
              <span className="rf-ends-to">{en ? "back to the card" : "إلى البطاقة"}</span>
              <span>{en ? "the machine" : "المكينة"}</span>
            </div>
          </figure>

          <p className="rf-log mono">
            <span className="rf-log-k">{en ? "AUTOMATIC REFUND" : "استرجاع تلقائي"}</span>
            <span className="rf-log-t">
              {en ? "no human intervention" : "بدون تدخّل بشري"}
            </span>
          </p>

          <p className="rf-note">
            {en
              ? "A failed payment is refunded by the system itself. Nobody opens a ticket, nobody calls you, and the person standing at the machine does not have to trust that you will sort it out later."
              : "عند فشل الدفع يُعاد المبلغ تلقائيًا. لا أحد يفتح تذكرة، ولا أحد يتصل بك، ولا يحتاج من يقف أمام المكينة أن يثق بأنك ستعالج الأمر لاحقًا."}
          </p>
        </div>
      </div>
    </section>
  );
}
