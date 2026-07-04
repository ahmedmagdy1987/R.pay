"use client";
import { LOGOS } from "@/lib/assets/logos";

function Track() {
  return (
    <div className="mtrack" aria-hidden="true">
      {LOGOS.map((l, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} className="brandlogo" src={l.uri} alt={l.alt} loading="lazy" />
      ))}
    </div>
  );
}

export default function BrandsMarquee() {
  return (
    <section className="brands" aria-label="partners">
      <div className="lbl">
        <span className="ar-t">شركاؤنا وعملاؤنا</span>
        <span className="en-t">Our partners &amp; clients</span>
      </div>
      <div className="marquee">
        <Track />
        <Track />
      </div>
    </section>
  );
}
