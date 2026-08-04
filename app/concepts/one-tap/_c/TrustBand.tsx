"use client";
import { LOGOS } from "@/lib/assets/logos";

/** EARLY TRUST — «شركاؤنا وعملاؤنا» as a composed proof band directly
 *  after the hero: eyebrow + one verified proof line + a compact light
 *  logo tray (the logos are drawn for light — flow precedent — so the
 *  tray is framed as a deliberate object inside the dark system, not a
 *  white strip dropped on the page). Logos and the proof line are repo
 *  canon; nothing invented. */
export default function TrustBand() {
  const row = [...LOGOS, ...LOGOS];
  return (
    <section className="act trust" aria-label="Our partners and clients">
      <div className="trust-inner">
        <header className="trust-head">
          <p className="t-meta eyebrow">
            <span className="ar-t">شركاؤنا وعملاؤنا</span>
            <span className="en-t">Our partners &amp; clients</span>
          </p>
          <p className="t-body trust-line">
            <span className="ar-t">يثق بنا أكبر مشغّل لمكائن ألعاب الأركيد في المنطقة، ووجهات ومشاريع رائدة في السعودية.</span>
            <span className="en-t">Trusted by the region&apos;s largest arcade-machine operator and leading Saudi destinations.</span>
          </p>
        </header>
        <div className="trust-tray">
          <div className="marquee">
            <div className="mtrack">
              {row.map((l, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} className="brandlogo" src={l.uri} alt={l.alt} loading="lazy" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
