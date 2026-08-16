import { ARCADE, VENDING, COFFEE } from "@/lib/assets/machines";
import { DEVICE } from "@/lib/assets/device";
import { Fact } from "./Fact";
import { devValue } from "@/lib/content";

/**
 * SECTION 06 — الأسطول · what the system is actually attached to.
 *
 * The page has spent five sections talking about machines without showing one.
 * This is the proof they are physical objects in real halls, and it is the only
 * section on the site carrying photography.
 *
 * ── WHAT IT DELIBERATELY DOES NOT SAY ──────────────────────────────────────
 * No IP rating, no EMV level, no certification, no dimensions. Publishing a
 * specification that cannot be evidenced by a supplier document is a legal
 * exposure rather than a design detail, so the section describes BEHAVIOUR —
 * what the terminal does — and nothing about what it is rated for. The product
 * name is a claim too, and it is registered as one; until it is approved and
 * cleared, this says "the terminal".
 *
 * ── THE RENDERS ────────────────────────────────────────────────────────────
 * They are AI-generated product renders from an earlier concept, at 720x964,
 * and they are treated rather than presented: desaturated and darkened toward
 * the hull so they read as SCHEMATICS in an instrument, not as photography in a
 * brochure. That is also what makes their resolution sufficient — at 300px wide
 * and low contrast, nothing about them invites inspection. A hero-sized product
 * shot would need a real camera.
 */

const CLASSES = [
  {
    src: ARCADE,
    ar: "ألعاب",
    en: "Arcade",
    noteAr: "تُشغَّل باللمس، وتُدار عن بُعد.",
    noteEn: "Started by a tap, managed from anywhere.",
  },
  {
    src: VENDING,
    ar: "بيع ذاتي",
    en: "Vending",
    noteAr: "المخزون والمبيعات على الشاشة نفسها.",
    noteEn: "Stock and takings on the same screen.",
  },
  {
    src: COFFEE,
    ar: "قهوة",
    en: "Coffee",
    noteAr: "نفس النظام، نفس التحصيل.",
    noteEn: "Same system, same settlement.",
  },
];

export default function Fleet({ en }: { en: boolean }) {
  return (
    <section className="fl-sec" aria-labelledby="fl-title">
      <div className="stack">
        <div className="fl-col">
          <span className="label">{en ? "THE HARDWARE" : "الأجهزة"}</span>
          <h2 className="fl-title" id="fl-title">
            {en ? (
              <>It is bolted to <em>real machines.</em></>
            ) : (
              <>مثبَّت على <em>مكائن حقيقية.</em></>
            )}
          </h2>
          <p className="fl-lede">
            {en
              ? "One terminal, one way of working, whatever the machine dispenses. It takes the payment, reports its own state, and answers to the same screen as every other machine you run."
              : "طرفية واحدة وطريقة عمل واحدة، مهما كان ما تقدّمه المكينة. تستقبل الدفع، وتُبلّغ عن حالتها، وتُدار من الشاشة نفسها التي تدير بها بقية مكائنك."}
          </p>

          <div className="fl-grid">
            {/* The terminal itself, larger — it is the thing the section is about. */}
            <figure className="fl-terminal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DEVICE}
                alt={en ? "The R.Pay payment terminal" : "طرفية الدفع من آر باي"}
                width={375}
                height={500}
                loading="lazy"
              />
              <figcaption className="fl-cap mono">
                {en ? "THE TERMINAL" : "الطرفية"}
              </figcaption>
            </figure>

            <ul className="fl-classes">
              {CLASSES.map((c) => (
                <li className="fl-class" key={c.en}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.src}
                    alt=""
                    width={170}
                    height={228}
                    loading="lazy"
                    aria-hidden="true"
                  />
                  <div className="fl-class-t">
                    <h3>{en ? c.en : c.ar}</h3>
                    <p>{en ? c.noteEn : c.noteAr}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* The most human number the company owns, and the one every other
              vendor forgets to count: what came OUT of the machines. */}
          <p className="fl-prizes">
            <Fact
              id="totals.prizes"
              en={en}
              fallback={
                <span className="fl-prizes-alt">
                  {en
                    ? "Prizes and stock are counted on the way out, not only on the way in."
                    : "الجوائز والمخزون تُحسب عند الخروج، لا عند الدخول فقط."}
                </span>
              }
            >
              <span className="fl-prizes-n mono ltr">
                {devValue<number>("totals.prizes").toLocaleString("en-US")}
              </span>{" "}
              <span className="fl-prizes-l">
                {en
                  ? "prizes delivered, each one accounted to the machine that gave it."
                  : "جائزة سُلّمت، كل واحدة محسوبة على المكينة التي أخرجتها."}
              </span>
            </Fact>
          </p>
        </div>
      </div>
    </section>
  );
}
