import { claimMode } from "@/lib/content";

/**
 * ACT III — العودة · white label, the handover, and the station ident.
 *
 * The page returns to the hull it started in. Daylight explained; night closes.
 *
 * ── THE CTA STRATEGY, FINALISED ────────────────────────────────────────────
 * ONE primary action, and it is not "contact us". It is a fifteen-minute
 * walkthrough of the control room — concrete, small, and the thing the entire
 * night act has been showing. It appears THREE times and never anywhere else:
 *
 *   1. after the geofence, where intent peaks emotionally
 *   2. here, at the handover, where the argument has finished
 *   3. in the station ident, as a line rather than a button
 *
 * There is deliberately none in the hero. The first 100vh carries one ghost
 * link, because asking a stranger to book a meeting before the instrument has
 * finished drawing is asking for a decision nobody is ready to make.
 *
 * The secondary action is WhatsApp, and it is a different KIND of ask rather
 * than a weaker version of the same one: Saudi B2B closes on WhatsApp, and a
 * person who will not book a slot will still send a message.
 *
 * ── WHAT HAPPENS AFTER ─────────────────────────────────────────────────────
 * Both destinations are registered as launch blockers (`commercial.tour`,
 * `commercial.contact`). Until they resolve, the buttons are visibly inert
 * rather than pointing somewhere plausible — a CTA that silently goes nowhere is
 * worse than one that says it is not wired yet.
 */

export default function Close({ en }: { en: boolean }) {
  const contactReady = claimMode("commercial.contact") === "publish";
  const tourReady = claimMode("commercial.tour") === "publish";
  const registrationReady = claimMode("company.registration") === "publish";

  return (
    <>
      {/* ── White label. A compact beat, not a chapter. ─────────────────── */}
      <section className="wl-sec" aria-labelledby="wl-title">
        <div className="stack">
          <div className="wl-col">
            <span className="label">{en ? "WHITE LABEL" : "العلامة البيضاء"}</span>
            <h2 className="wl-title" id="wl-title">
              {en ? (
                <>It can carry <em>your name</em> instead of ours.</>
              ) : (
                <>يمكن أن تحمل <em>اسمك</em> بدل اسمنا.</>
              )}
            </h2>
            <p className="wl-note">
              {en
                ? "The screen a customer taps, and the screen your team works from, can both be yours. The system underneath is the same one this page has been showing."
                : "الشاشة التي يلمسها العميل، والشاشة التي يعمل عليها فريقك، يمكن أن تكونا باسمك. النظام تحتهما هو نفسه الذي عرضته هذه الصفحة."}
            </p>
          </div>
        </div>
      </section>

      {/* ── The handover. Where the argument finishes. ──────────────────── */}
      <section className="hv-sec" id="handover" aria-labelledby="hv-title">
        <div className="stack">
          <div className="hv-col">
            <h2 className="hv-title" id="hv-title">
              {en ? (
                <>See it running <em>on a real fleet.</em></>
              ) : (
                <>شاهده يعمل <em>على أسطول حقيقي.</em></>
              )}
            </h2>
            <p className="hv-lede">
              {en
                ? "Fifteen minutes in the control room, on your own screen. Bring the number of machines you run and we will show you what that looks like on it."
                : "خمس عشرة دقيقة في غرفة التحكم، على شاشتك أنت. أحضِر عدد مكائنك، ونعرض لك كيف تبدو عليها."}
            </p>

            <div className="hv-actions">
              <button
                type="button"
                className="btn-primary"
                disabled={!tourReady}
                aria-describedby={tourReady ? undefined : "hv-pending"}
              >
                {en ? "Book the control-room tour" : "احجز جولة في غرفة التحكم"}
              </button>

              <button
                type="button"
                className="btn-ghost"
                disabled={!contactReady}
                aria-describedby={contactReady ? undefined : "hv-pending"}
              >
                {en ? "Ask on WhatsApp" : "اسأل عبر واتساب"}
              </button>
            </div>

            {tourReady && contactReady ? null : (
              <p className="hv-pending" id="hv-pending">
                {en
                  ? "Development build: these actions are not wired to a destination yet, and are disabled rather than pointing somewhere plausible."
                  : "نسخة تطويرية: هذه الإجراءات غير موصولة بوجهة بعد، وهي معطّلة بدل أن تشير إلى مكان يبدو صحيحًا."}
              </p>
            )}

            <p className="hv-fine">
              {en
                ? "Arabic or English, whichever you prefer."
                : "بالعربية أو الإنجليزية، كما تفضّل."}
            </p>
          </div>
        </div>
      </section>

      {/* ── Station ident. The grid keeps running after you leave. ──────── */}
      <footer className="si-sec">
        <div className="stack">
          <div className="si-col">
            <span className="si-rule" aria-hidden="true" />
            <div className="si-grid">
              <div className="si-brand">
                <p className="si-mark mono ltr">R.PAY</p>
                <p className="si-line">
                  {en
                    ? "The payment and control system for self-service machines."
                    : "نظام الدفع والتحكّم لماكينات الخدمة الذاتية."}
                </p>
                <p className="si-line si-sa">{en ? "A Saudi company." : "شركة سعودية."}</p>
              </div>

              <div className="si-meta">
                {registrationReady ? null : (
                  <p className="si-pending mono">
                    {en
                      ? "CR · VAT · registered address — pending verification"
                      : "السجل التجاري · الرقم الضريبي · العنوان — قيد التوثيق"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
