"use client";
import { LOGOS } from "@/lib/assets/logos";

export default function BrandsMarquee() {
  const row = [...LOGOS, ...LOGOS];
  return (
    <section className="brands" aria-label="partners">
      <div className="lbl">
        <span className="ar-t">شركاؤنا وعملاؤنا</span>
        <span className="en-t">Trusted by leading brands</span>
      </div>
      <div className="marquee">
        <div className="mtrack">
          {row.map((l, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} className="brandlogo" src={l.uri} alt={l.alt} loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  );
}
