"use client";

/** ACT V — BUILT FOR REAL MACHINES. The three verified sectors, each a
 *  full-bleed cinematic scene (no card grid). Copy stays under the claims
 *  ceiling: sectors and named clients exist in repo canon. */
const SCENES = [
  {
    img: "/assets/concept-08/scene-arcade.webp",
    w: 1920, h: 1072,
    // The arcade plate's negative space is physical-left; the copy pins
    // there in both languages (hero precedent).
    pin: "left" as const,
    eyebrow: { ar: "ألعاب الأركيد", en: "Arcade games" },
    title: { ar: "قاعات تعمل بلمسة.", en: "Halls that run on a tap." },
    line: {
      ar: "أكبر مشغّل لمكائن ألعاب الأركيد في المنطقة يدير قاعاته مع آر باي.",
      en: "The region's largest arcade-machine operator runs its halls on R.Pay.",
    },
  },
  {
    img: "/assets/concept-08/scene-vending.webp",
    w: 1920, h: 1072,
    eyebrow: { ar: "البيع الذاتي", en: "Vending" },
    title: { ar: "رفوف تبيع وحدها.", en: "Shelves that sell on their own." },
    line: {
      ar: "دفع بلا نقد، ومخزون يُدار عن بُعد — الماكينة تعمل، وأنت تراقب.",
      en: "Cashless payment and remotely managed stock — the machine works, you watch.",
    },
  },
  {
    img: "/assets/concept-08/scene-coffee.webp",
    w: 1920, h: 1072,
    eyebrow: { ar: "آلات القهوة", en: "Coffee machines" },
    title: { ar: "فنجان يبدأ بلمسة.", en: "A cup that starts with a tap." },
    line: {
      ar: "من اللمسة إلى الفنجان — وكل عملية بيع مسجّلة لحظيًا.",
      en: "From tap to cup — every sale recorded the moment it happens.",
    },
  },
];

export default function MachineScenes() {
  return (
    <section className="act machines" id="machines" aria-label="Built for real machines">
      <header className="act-head">
        <h2 className="t-beat">
          <span className="ar-t">مصمّم لماكينات حقيقية.</span>
          <span className="en-t">Built for real machines.</span>
        </h2>
      </header>

      {SCENES.map((s, i) => (
        <figure className={`scene${"pin" in s && s.pin === "left" ? " scene-left" : ""}`} key={i}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.img} alt="" loading="lazy" width={s.w} height={s.h} />
          <figcaption className="scene-copy">
            <span className="t-meta scene-eyebrow">
              <span className="ar-t">{s.eyebrow.ar}</span>
              <span className="en-t">{s.eyebrow.en}</span>
            </span>
            <h3 className="t-beat scene-title">
              <span className="ar-t">{s.title.ar}</span>
              <span className="en-t">{s.title.en}</span>
            </h3>
            <p className="t-body scene-line">
              <span className="ar-t">{s.line.ar}</span>
              <span className="en-t">{s.line.en}</span>
            </p>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
