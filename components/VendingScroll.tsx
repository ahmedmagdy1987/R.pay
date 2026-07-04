"use client";
import { useEffect, useRef } from "react";
import {
  VENDING_SPRITE, V_COUNT, V_COLS, V_FW, V_FH,
} from "@/lib/assets/vending";

export default function VendingScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sheet = new Image();
    let ready = false;
    sheet.onload = () => { ready = true; sizeCanvas(); compute(); };
    sheet.src = VENDING_SPRITE;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
    };

    const draw = (index: number) => {
      if (!ready) return;
      const i = Math.max(0, Math.min(V_COUNT - 1, index));
      const sx = (i % V_COLS) * V_FW;
      const sy = Math.floor(i / V_COLS) * V_FH;
      const cw = canvas.width, ch = canvas.height;
      const scale = Math.max(cw / V_FW, ch / V_FH);
      const dw = V_FW * scale, dh = V_FH * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(sheet, sx, sy, V_FW, V_FH, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    let active = true, ticking = false;
    const compute = () => {
      ticking = false;
      if (!active) return;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / (total || 1)));
      draw(Math.round(p * (V_COUNT - 1)));
      if (overlay) {
        const o = p < 0.5 ? 1 : Math.max(0, 1 - (p - 0.5) / 0.35);
        overlay.style.opacity = o.toFixed(2);
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(compute); } };
    const onResize = () => { sizeCanvas(); compute(); };

    const io = new IntersectionObserver((es) => { active = es[0].isIntersecting; }, { threshold: 0 });
    io.observe(section);
    sizeCanvas();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="vending" ref={sectionRef} id="showcase">
      <div className="vstick">
        <canvas className="vcanvas" ref={canvasRef} />
        <div className="voverlay" ref={overlayRef}>
          <div className="vkicker">
            <span className="ar-t">تجربة الدفع</span>
            <span className="en-t">The payment experience</span>
          </div>
          <h2 className="vtitle">
            <span className="ar-t">لمسة واحدة، <em>وكل شيء يعمل</em></span>
            <span className="en-t">One tap, <em>everything works</em></span>
          </h2>
          <p className="vsub">
            <span className="ar-t">وحدة دفع مدمجة داخل كل جهاز تقبل البطاقات والمحافظ الرقمية، وتعرض كل عملية لحظيًا في لوحة التحكم.</span>
            <span className="en-t">An embedded payment unit in every machine accepts cards and digital wallets, streaming every transaction live to your dashboard.</span>
          </p>
        </div>
        <div className="vhint">
          <span className="ar-t">مرّر للأسفل</span>
          <span className="en-t">Scroll</span>
          <span className="m"><i /></span>
        </div>
      </div>
    </section>
  );
}
