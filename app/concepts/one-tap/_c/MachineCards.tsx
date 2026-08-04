"use client";
import { useCallback, useState } from "react";

/** ACT V — BUILT FOR REAL MACHINES, rebuilt as an editorial card trio.
 *  Three complete, aspect-specific 3:4 masters (machine fully inside the
 *  crop-safe center) in a flex-interpolated row: the active card expands
 *  to primary, the others contract but keep their titles. The active card
 *  reveals one short benefit and a contextual TEXT link (never a second
 *  orange button). Mobile: horizontal snap carousel, one card per view.
 *  Copy stays inside repo canon (sectors + the arcade superlative). */

const CARDS = [
  {
    key: "arcade",
    img: "/assets/concept-08/card-arcade.webp",
    eyebrow: { ar: "ألعاب الأركيد", en: "Arcade games" },
    title: { ar: "قاعات تعمل بلمسة.", en: "Halls that run on a tap." },
    line: {
      ar: "أكبر مشغّل لمكائن ألعاب الأركيد في المنطقة يدير قاعاته مع آر باي.",
      en: "The region's largest arcade-machine operator runs its halls on R.Pay.",
    },
  },
  {
    key: "vending",
    img: "/assets/concept-08/card-vending.webp",
    eyebrow: { ar: "البيع الذاتي", en: "Vending" },
    title: { ar: "رفوف تبيع وحدها.", en: "Shelves that sell on their own." },
    line: {
      ar: "دفع بلا نقد، ومخزون يُدار عن بُعد — الماكينة تعمل، وأنت تراقب.",
      en: "Cashless payment and remotely managed stock — the machine works, you watch.",
    },
  },
  {
    key: "coffee",
    img: "/assets/concept-08/card-coffee.webp",
    eyebrow: { ar: "آلات القهوة", en: "Coffee machines" },
    title: { ar: "فنجان يبدأ بلمسة.", en: "A cup that starts with a tap." },
    line: {
      ar: "من اللمسة إلى الفنجان — وكل عملية بيع مسجّلة لحظيًا.",
      en: "From tap to cup — every sale recorded the moment it happens.",
    },
  },
] as const;

export default function MachineCards() {
  const [active, setActive] = useState<string>("arcade");
  const activate = useCallback((k: string) => () => setActive(k), []);

  return (
    <section className="act machines" id="machines" aria-label="Built for real machines">
      <header className="act-head">
        <p className="t-meta eyebrow">
          <span className="ar-t">القطاعات</span>
          <span className="en-t">Sectors</span>
        </p>
        <h2 className="t-beat">
          <span className="ar-t">مصمّم لماكينات حقيقية.</span>
          <span className="en-t">Built for real machines.</span>
        </h2>
      </header>

      {/* Static reveal wrapper — see FleetCards: React-managed classNames
          must never carry the reveal system's imperative `in` class. */}
      <div className="cards-reveal">
      <div className={`machine-row cards-row active-${active}`} role="list">
        {CARDS.map((c) => (
          <article
            key={c.key}
            role="listitem"
            tabIndex={0}
            className={`mcard${active === c.key ? " is-active" : ""}`}
            onMouseEnter={activate(c.key)}
            onFocus={activate(c.key)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.img} alt="" loading="lazy" width={1200} height={1607} />
            <div className="fcard-scrim" aria-hidden="true" />
            <div className="mcard-body">
              <span className="t-meta eyebrow">
                <span className="ar-t">{c.eyebrow.ar}</span>
                <span className="en-t">{c.eyebrow.en}</span>
              </span>
              <h3 className="t-beat mcard-title">
                <span className="ar-t">{c.title.ar}</span>
                <span className="en-t">{c.title.en}</span>
              </h3>
              <div className="mcard-more">
                <p className="t-body mcard-line">
                  <span className="ar-t">{c.line.ar}</span>
                  <span className="en-t">{c.line.en}</span>
                </p>
                {/* Contextual TEXT link — the page's one verb, quiet form. */}
                <a className="tlink" href="#demo">
                  <span className="ar-t">احجز عرضًا مباشرًا ←</span>
                  <span className="en-t">Book a live demo →</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
