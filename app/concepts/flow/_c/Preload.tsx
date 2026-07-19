"use client";
import { useEffect, useState } from "react";

const POSTER = "/assets/flow/film-poster.webp";
const FIRST_FRAMES = Array.from({ length: 8 }, (_, i) =>
  `/assets/flow/seq/f_${String(i + 1).padStart(3, "0")}.webp`
);

/** ACT 0 — kills the black flash. R mark + cyan hairline while the hero
 *  poster and the first 8 sequence frames decode. Hard cap: 800ms. */
export default function Preload() {
  const [armed, setArmed] = useState(false);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let alive = true;
    requestAnimationFrame(() => alive && setArmed(true));

    const decode = (src: string) =>
      new Promise<void>((res) => {
        const img = new Image();
        img.onload = () => (img.decode ? img.decode().catch(() => {}).then(() => res()) : res());
        img.onerror = () => res();
        img.src = src;
      });

    const cap = new Promise<void>((res) => setTimeout(res, 800));
    Promise.race([Promise.all([POSTER, ...FIRST_FRAMES].map(decode)).then(() => {}), cap]).then(
      () => {
        if (!alive) return;
        setDone(true);
        setTimeout(() => alive && setGone(true), 400);
      }
    );
    return () => { alive = false; };
  }, []);

  if (gone) return null;
  return (
    <div className={`preload${armed ? " armed" : ""}${done ? " done" : ""}`} aria-hidden="true">
      <span className="mark">R</span>
      <span className="hair"><i /></span>
    </div>
  );
}
