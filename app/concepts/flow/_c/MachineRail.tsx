"use client";

/** ACT III — THE THREE MACHINES. Horizontal snap rail.
 *  Each card: render, ONE .led number, ONE line, one text-link CTA.
 *  No feature bullets. LED windows hold digits only (the mono face has no
 *  Arabic); the Arabic unit sits beside the window as a label. */
const MACHINES = [
  {
    img: "/assets/machine-vending.webp",
    led: "24/7",
    unitAr: "تشغيل متواصل", unitEn: "always on",
    lineAr: "بيع ذاتي لا يتوقف، ومدفوعات فورية.",
    lineEn: "Self-service that never stops, payments that land instantly.",
    altAr: "ماكينة بيع ذاتي", altEn: "Vending machine",
  },
  {
    img: "/assets/machine-coffee.webp",
    led: "60",
    unitAr: "ثانية للكوب", unitEn: "seconds a cup",
    lineAr: "قهوة تُدفع بلمسة وتُسلَّم قبل أن تنتظر.",
    lineEn: "Coffee paid in a tap, poured before the wait begins.",
    altAr: "ماكينة قهوة", altEn: "Coffee machine",
  },
  {
    img: "/assets/machine-arcade.webp",
    led: "9,434",
    unitAr: "هدية مُسلَّمة", unitEn: "prizes delivered",
    lineAr: "ألعاب الجوائز، بمدفوعات رقمية وتتبّع لكل هدية.",
    lineEn: "Prize machines with digital payments and every prize tracked.",
    altAr: "ماكينة ألعاب", altEn: "Arcade machine",
  },
];

export default function MachineRail() {
  return (
    <section className="act rail" id="machines" aria-label="Machines">
      <div className="rail-track">
        {MACHINES.map((m, i) => (
          <article className="rail-card" key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.img} alt="" loading="lazy" />
            <p className="rail-num">
              <span className="led">{m.led}</span>
              <span className="t-meta rail-unit">
                <span className="ar-t">{m.unitAr}</span>
                <span className="en-t">{m.unitEn}</span>
              </span>
            </p>
            <p className="t-body rail-line">
              <span className="ar-t">{m.lineAr}</span>
              <span className="en-t">{m.lineEn}</span>
            </p>
            <a className="rail-link" href="#demo">
              <span className="ar-t">احجز عرضًا ←</span>
              <span className="en-t">Book a demo →</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
