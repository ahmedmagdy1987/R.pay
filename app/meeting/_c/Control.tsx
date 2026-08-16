"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * SCENE 03 — الحماية · take the machine.
 *
 * The one moment on the page where the visitor does something instead of
 * watching something. Drag the machine out of its zone: it dies, the frame goes
 * red, the takings stop counting. Let go: it comes home, and the counter RESUMES
 * FROM WHERE IT FROZE — never from zero.
 *
 * That single detail is the whole product argument. "My machine was stolen"
 * becomes "my money was never at risk", and it costs one boolean.
 *
 * Danger arrives in 180ms and leaves over 900ms. Do not harmonise those.
 *
 * Every visual reaction hangs off one `data-breach` attribute on the stage, so a
 * breach is one attribute write, not a style pass over a dozen nodes.
 */

const RING = 0.33;   // zone radius as a fraction of stage width
const RATE = 0.4;    // counter pace — tuned to read as live but calm

export default function Control() {
  const stageRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLSpanElement>(null);

  const drag = useRef({ on: false, dx: 0, dy: 0, ox: 0, oy: 0 });
  const out = useRef(false);
  const money = useRef(4820);
  const frozen = useRef(false);
  const touched = useRef(false);

  const [state, setState] = useState<"idle" | "breach" | "safe">("idle");

  /* ── The counter ───────────────────────────────────────────────────────── */
  useEffect(() => {
    let last = performance.now();
    let vis = true;
    let id = 0;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 120);
      last = now;
      if (!frozen.current && vis) {
        money.current += (dt / 16.7) * RATE;
        if (meterRef.current) {
          meterRef.current.textContent = Math.floor(money.current).toLocaleString("en-US");
        }
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);

    const onVis = () => { vis = !document.hidden; last = performance.now(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { cancelAnimationFrame(id); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  const judge = useCallback((dx: number, dy: number) => {
    const stage = stageRef.current;
    if (!stage) return;

    const size = stage.getBoundingClientRect().width;
    const r = size * RING;
    const dist = Math.hypot(dx, dy);
    const beyond = dist > r;

    if (beyond !== out.current) {
      out.current = beyond;
      stage.setAttribute("data-breach", beyond ? "1" : "0");
      if (beyond) {
        frozen.current = true;                                  // freeze mid-digit
        setState("breach");
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(12);
      }
    }

    if (beyond) {
      const m = Math.round(((dist - r) / r) * 40);
      const el = stage.querySelector(".c-dist");
      if (el) el.textContent = `${m.toLocaleString("ar-EG")} م خارج النطاق`;
    }
  }, []);

  useEffect(() => {
    const machine = machineRef.current;
    const stage = stageRef.current;
    if (!machine || !stage) return;

    const put = (x: number, y: number) => {
      machine.style.setProperty("--mx", `${x}px`);
      machine.style.setProperty("--my", `${y}px`);
    };

    const down = (e: PointerEvent) => {
      drag.current.on = true;
      drag.current.ox = e.clientX - drag.current.dx;
      drag.current.oy = e.clientY - drag.current.dy;
      machine.classList.remove("settling");
      machine.setPointerCapture(e.pointerId);
      touched.current = true;
      stage.setAttribute("data-touched", "1");
      e.preventDefault();
    };

    const move = (e: PointerEvent) => {
      if (!drag.current.on) return;
      drag.current.dx = e.clientX - drag.current.ox;
      drag.current.dy = e.clientY - drag.current.oy;
      put(drag.current.dx, drag.current.dy);
      judge(drag.current.dx, drag.current.dy);
    };

    const up = () => {
      if (!drag.current.on) return;
      drag.current.on = false;
      machine.classList.add("settling");
      drag.current.dx = 0;
      drag.current.dy = 0;
      put(0, 0);
      if (out.current) {
        out.current = false;
        stage.setAttribute("data-breach", "0");
        frozen.current = false;        // resumes from the frozen value. the sale.
        setState("safe");
      }
    };

    machine.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    /* If nobody touches it, the scene demonstrates itself — once, then never
       asks again. A page that nags is a page nobody trusts. */
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting || touched.current) return;
        io.disconnect();
        window.setTimeout(() => {
          if (touched.current) return;
          const far = stage.getBoundingClientRect().width * RING * 1.3;
          machine.classList.add("settling");
          put(far, 0);
          judge(far, 0);
          window.setTimeout(() => {
            put(0, 0);
            if (out.current) {
              out.current = false;
              stage.setAttribute("data-breach", "0");
              frozen.current = false;
              setState("safe");
            }
          }, 1800);
        }, 4200);
      });
    }, { threshold: 0.45 });
    io.observe(stage);

    return () => {
      machine.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      io.disconnect();
    };
  }, [judge]);

  return (
    <div className="c-stage" ref={stageRef} data-breach="0" data-touched="0">
      <div className="c-field" aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <circle className="c-ring c-ring-3" cx="50" cy="50" r="46" />
          <circle className="c-ring c-ring-2" cx="50" cy="50" r={RING * 100} />
          <circle className="c-ring c-ring-1" cx="50" cy="50" r="16" />
          <line className="c-x" x1="50" y1="2" x2="50" y2="98" />
          <line className="c-x" x1="2" y1="50" x2="98" y2="50" />
        </svg>
        <span className="c-sweep" />
      </div>

      <div className="c-machine" ref={machineRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/machine-arcade.webp" alt="" draggable={false} />
        <span className="c-shadow" aria-hidden="true" />
      </div>

      <div className="c-hud">
        <span className="c-hud-k">اليوم · ريال</span>
        <span className="c-hud-v" dir="ltr"><span ref={meterRef}>4,820</span></span>
      </div>

      <span className="c-dist" aria-hidden="true" />

      <p className="c-status" role="status">
        {state === "breach"
          ? "خرجت من النطاق · إيقاف فوري · تنبيه المالك"
          : state === "safe"
            ? "عادت إلى النطاق · استُؤنف التشغيل من حيث توقّف"
            : "اسحب المكينة خارج الدائرة"}
      </p>

      <span className="c-sim">محاكاة تفاعلية · لا يتأثر أي جهاز حقيقي</span>
    </div>
  );
}
