import Direct from "./_c/Direct";
import Control from "./_c/Control";
import { TalkButton, TalkSheet } from "./_c/Talk";

/**
 * R.PAY — /meeting
 *
 * Seven scenes, not seven sections. The page is a server component; three small
 * client islands carry the choreography, the drag, and the contact sheet.
 *
 * Everything factual on this page is either a description of what the product
 * does or a labelled simulation. There are no counts, no customer names, no
 * logos, and no figures presented as company data — not because the page is shy,
 * but because a number nobody has verified is the one thing that can lose the
 * room.
 */

export default function Meeting() {
  return (
    <div className="mt" dir="rtl" lang="ar">
      <Direct />
      <div className="mt-prog" aria-hidden="true"><i /></div>

      {/* ══ SCENE 01 · ARRIVAL ═══════════════════════════════════════════ */}
      <section className="s1">
        <div className="s1-film" aria-hidden="true">
          <video
            autoPlay muted loop playsInline preload="auto"
            poster="/assets/concept-08/hero-poster.webp"
          >
            <source src="/assets/concept-08/hero-wide.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="s1-grade" aria-hidden="true" />
        <div className="s1-bloom" aria-hidden="true" />

        <div className="s1-mark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mark.svg" alt="" />
          <b>R.PAY</b>
        </div>

        <div className="s1-body">
         <div className="s1-col">
          <p className="kicker">نظام الدفع والتحكّم لماكينات الخدمة الذاتية</p>

          <h1 className="display" style={{ marginBlockStart: "clamp(14px,2vh,24px)" }}>
            <span className="s1-line"><span>لمسة واحدة</span></span>
            <span className="s1-line"><span className="grad">تُشغّل أسطولًا.</span></span>
          </h1>

          <p className="lede s1-sub">
            تلمس البطاقة، فتعمل المكينة، ويظهر ما حدث على شاشة المشغّل في اللحظة نفسها.
            الدفع والتشغيل والمراقبة في نظام واحد.
          </p>

          <div className="s1-cta">
            <TalkButton label="شاهده يعمل" />
            <a className="cta-2" href="#control">اسرق المكينة</a>
          </div>

          <p className="s1-rails">
            <span>دفع بلا تلامس</span>
            <span>تشغيل فوري</span>
            <span>تحكّم مركزي</span>
          </p>
         </div>
        </div>

        <span className="s1-cue" aria-hidden="true" />
      </section>

      {/* ══ SCENE 02 · PRODUCT ═══════════════════════════════════════════ */}
      <section className="scene s2">
        <div className="wrap">
          <p className="kicker rv">الجهاز</p>
          <h2 className="h2 rv d1" style={{ marginBlockStart: "18px", maxWidth: "16ch" }}>
            طرفية واحدة،<br /><span className="grad">على أي ماكينة.</span>
          </h2>

          <div className="s2-stage">
            <figure className="s2-shot rv d1">
              <span className="s2-halo" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/concept-08/close-terminal.webp" alt="طرفية دفع آر باي عن قرب" />
            </figure>

            <div className="rv d2">
              <p className="lede">
                جهاز واحد يُركَّب على المكينة التي تملكها الآن — ألعاب، مشروبات، قهوة، غسيل.
                لا استبدال، ولا خط إنتاج جديد.
              </p>
              <p className="lede" style={{ marginBlockStart: "22px" }}>
                من اللحظة التي يُركَّب فيها، تصبح المكينة جزءًا من شبكة: تقبل الدفع،
                وتُبلّغ عن حالتها، وتُدار من مكان واحد.
              </p>
              <div style={{ marginBlockStart: "34px" }}>
                <TalkButton label="شاهده يعمل" kind="ghost" />
              </div>
            </div>
          </div>

          <div className="s2-cards rv d2">
            <figure className="s2-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/concept-08/card-arcade.webp" alt="ماكينة ألعاب" />
              <figcaption>ألعاب</figcaption>
            </figure>
            <figure className="s2-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/concept-08/card-vending.webp" alt="ماكينة بيع" />
              <figcaption>بيع ذاتي</figcaption>
            </figure>
            <figure className="s2-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/concept-08/card-coffee.webp" alt="ماكينة قهوة" />
              <figcaption>قهوة</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ══ SCENE 03 · CONTROL ═══════════════════════════════════════════ */}
      <section className="scene s3" id="control">
        <div className="s3-bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/concept-08/network-hall.webp" alt="" />
        </div>

        <div className="wrap">
          <div className="s3-grid">
            <div className="rv">
              <p className="kicker">الحماية</p>
              <h2 className="h2" style={{ marginBlockStart: "18px" }}>
                حرّكها من مكانها، <span className="grad">وتتوقّف.</span>
              </h2>
              <p className="lede" style={{ marginBlockStart: "26px" }}>
                لكل مكينة نطاق. في اللحظة التي تغادره، يوقفها النظام ويُبلّغ المالك —
                دون أن يكون أحد يراقب.
              </p>
              <p className="lede" style={{ marginBlockStart: "20px" }}>
                والأهم: التحصيل لا يعود إلى الصفر. يتجمّد عند رقمه، ويكمل من حيث توقّف.
              </p>
              <div style={{ marginBlockStart: "34px" }}>
                <TalkButton label="شاهده يعمل" />
              </div>
            </div>

            <div className="rv d1">
              <Control />
            </div>
          </div>
        </div>
      </section>

      {/* ══ SCENE 04 · TRANSFORMATION ════════════════════════════════════ */}
      <section className="s4" data-lit="0">
        <div className="s4-pin">
          <canvas className="s4-canvas" aria-hidden="true" />
          <div className="s4-veil" aria-hidden="true" />
          <div className="s4-type">
            <h2 className="h2">
              من لمسة واحدة<br />
              <span className="grad">إلى شبكة كاملة.</span>
            </h2>
          </div>
          <span className="s4-cap">التسلسل الكامل</span>
        </div>
      </section>

      {/* ══ SCENE 05 · BUSINESS ══════════════════════════════════════════ */}
      <section className="scene s5">
        <div className="wrap">
          <p className="kicker rv">للمشغّل</p>
          <h2 className="h2 rv d1" style={{ marginBlockStart: "18px", maxWidth: "18ch" }}>
            العمل الذي كان يأخذ ليلتك، صار يُدار من شاشة.
          </h2>

          <div className="s5-grid">
            <figure className="s5-shot rv d1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/concept-08/card-vending.webp" alt="ماكينة بيع ذاتي بنظام آر باي" />
            </figure>

            <div className="s5-rows rv d2">
              <div className="s5-row">
                <span className="s5-n">٠١</span>
                <div>
                  <p className="s5-h">التحصيل</p>
                  <p className="s5-p">تصل المبالغ إلى حساب المشغّل مباشرة، دون أن يمسكها أحد في الطريق.</p>
                </div>
              </div>
              <div className="s5-row">
                <span className="s5-n">٠٢</span>
                <div>
                  <p className="s5-h">الأعطال</p>
                  <p className="s5-p">المكينة هي التي تُبلّغ عن نفسها. لا تكتشف العطل من زبون غاضب.</p>
                </div>
              </div>
              <div className="s5-row">
                <span className="s5-n">٠٣</span>
                <div>
                  <p className="s5-h">الاسترجاع</p>
                  <p className="s5-p">عند فشل الدفع يُعاد المبلغ تلقائيًا. لا تذكرة، ولا مكالمة، ولا انتظار.</p>
                </div>
              </div>
              <div className="s5-row">
                <span className="s5-n">٠٤</span>
                <div>
                  <p className="s5-h">القرار</p>
                  <p className="s5-p">تعرف أي موقع يستحق مكينة إضافية، وأيّها يستحق أن تسحبها منه.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SCENE 06 · SCALE ═════════════════════════════════════════════ */}
      <section className="s6">
        <div className="s6-plate" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/concept-08/network-hall.webp" alt="" />
        </div>

        <div className="wrap">
          <div className="s6-head rv">
            <p className="kicker">النطاق</p>
            <h2 className="h2" style={{ marginBlockStart: "18px" }}>
              مبنيّ ليُدير <span className="grad">أسطولًا</span>، لا جهازًا.
            </h2>
          </div>

          <div className="s6-credits">
            <div className="s6-cr rv">
              <span className="s6-k">فروع</span>
              <p className="s6-t">كل فرع على حدة، والكل في شاشة واحدة.</p>
              <p className="s6-p">تفتح موقعًا جديدًا فيدخل الشبكة، لا نظامًا منفصلًا يُدار على حدة.</p>
            </div>
            <div className="s6-cr rv d1">
              <span className="s6-k">أنواع</span>
              <p className="s6-t">ماكينات مختلفة، لغة تشغيل واحدة.</p>
              <p className="s6-p">ألعاب ومشروبات وقهوة وغسيل — نفس الطرفية، ونفس غرفة التحكّم.</p>
            </div>
            <div className="s6-cr rv d2">
              <span className="s6-k">علامة بيضاء</span>
              <p className="s6-t">يمكن أن تحمل اسمك بدل اسمنا.</p>
              <p className="s6-p">الشاشة التي يلمسها العميل، والشاشة التي يعمل عليها فريقك، كلتاهما لك.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SCENE 07 · CLOSE ═════════════════════════════════════════════ */}
      <section className="s7">
        <div className="s7-bg" aria-hidden="true" />

        <div className="s7-body">
          <p className="kicker rv">الخطوة التالية</p>
          <h2 className="display rv d1" style={{ marginBlockStart: "clamp(16px,2.4vh,28px)" }}>
            شاهده يعمل <span className="grad">على أسطولك.</span>
          </h2>
          <p className="lede rv d2" style={{ marginBlockStart: "24px", marginInline: "auto", textAlign: "center" }}>
            خمس عشرة دقيقة في غرفة التحكّم، على شاشتك أنت.
          </p>

          <div className="s7-cta rv d2">
            <TalkButton label="شاهده يعمل" />
          </div>

          <p className="s7-foot rv d3">
            <span dir="ltr">R.PAY</span> · شركة سعودية
          </p>
        </div>
      </section>

      <TalkSheet />
    </div>
  );
}
