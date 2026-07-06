"use client";
import { ARCADE, VENDING, COFFEE } from "@/lib/assets/machines";

const CARDS = [
  {
    img: ARCADE,
    ar: "ألعاب الأركيد", en: "Arcade Games", sub: "ARCADE GAMES",
    arP: "خبرة تشغيلية عميقة لأكبر مشغّل لمكائن ألعاب الأركيد في المنطقة.",
    enP: "Deep operational expertise from the region's largest arcade operator.",
  },
  {
    img: VENDING,
    ar: "آلات البيع الذاتي", en: "Vending Machines", sub: "VENDING MACHINES",
    arP: "حلول تقنية ذكية لقطاع الخدمة الذاتية مع دفع إلكتروني متكامل.",
    enP: "Smart self-service solutions with fully integrated e-payment.",
  },
  {
    img: COFFEE,
    ar: "آلات القهوة", en: "Coffee Machines", sub: "COFFEE MACHINES",
    arP: "تحكّم كامل ومتابعة تشغيلية فورية من خلال نظام موحّد.",
    enP: "Full control and instant operational monitoring in one system.",
  },
];

export default function Integration() {
  return (
    <section id="sectors" className="integ">
      <div className="wrap">
        <div className="khead rv">
          <i /><span><span className="ar-t">نظام موحّد</span><span className="en-t">Unified System</span></span><i />
        </div>
        <h2 className="stitle rv d1">
          <span className="ar-t">تكامل <em>آر باي</em></span>
          <span className="en-t">R Pay <em>Integration</em></span>
        </h2>
        <div className="integ-en rv d1" aria-hidden="true">
          <span className="ar-t">R PAY <em>INTEGRATION</em></span>
          <span className="en-t">نظام <em>موحّد</em></span>
        </div>
        <p className="ssub rv d2">
          <span className="ar-t">نظام موحّد يجمع الدفع الإلكتروني والمراقبة التشغيلية لتمكين المشغلين من تعزيز الكفاءة وتقديم تجربة سلسة وآمنة للمستخدم.</span>
          <span className="en-t">A unified system integrating e-payment and operational control to empower operators, enhance efficiency, and deliver a secure user experience.</span>
        </p>
        <div className="integ-grid">
          {CARDS.map((c, i) => (
            <article className={`mcard rv${i ? " d" + i : ""}`} key={c.sub}>
              <div className="mcard-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.en} loading="lazy" />
              </div>
              <div className="mcard-body">
                <h3><span className="ar-t">{c.ar}</span><span className="en-t">{c.en}</span></h3>
                <div className="mcard-sub">{c.sub}</div>
                <p><span className="ar-t">{c.arP}</span><span className="en-t">{c.enP}</span></p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
