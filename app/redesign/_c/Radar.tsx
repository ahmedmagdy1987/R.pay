"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ARCADE } from "@/lib/assets/machines";

/**
 * «اسرق المكينة» — STEAL THE MACHINE
 *
 * The visitor commits the crime themselves. Drag the machine outside its geofence
 * and it dies; release and it recovers.
 *
 * The behaviour that carries the sale is small and easy to miss: the day's revenue
 * counter FREEZES mid-digit on breach and, on recovery, RESUMES FROM WHERE IT
 * STOPPED — never from zero. That converts "my machine died" into "my money was
 * preserved", which is the actual product argument, for the cost of one variable.
 *
 * Timing asymmetry is deliberate and load-bearing: danger arrives in 180ms and
 * leaves over 900ms. Do not harmonise those two values.
 *
 * Every visual reaction (ring colour, desaturation, meter colour, distance readout)
 * is CSS driven off one `data-breach` attribute on the wrapper — no per-element JS
 * style writes, so a breach costs one attribute change rather than a style recalc
 * per node.
 */

const RING_RATIO = 0.34;      // ring radius as a fraction of stage size
const START_RATE = 0.42;      // SAR per frame-ish; tuned to read as "live-but-calm"

interface LogEntry { id: number; time: string; text: string; tone: string; }

export default function Radar({ en }: { en: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLSpanElement>(null);

  const drag = useRef({ active: false, dx: 0, dy: 0, ox: 0, oy: 0 });
  const breached = useRef(false);
  const revenue = useRef(4820);
  const frozen = useRef(false);
  const raf = useRef(0);
  const breachCount = useRef(0);
  const touched = useRef(false);

  const [log, setLog] = useState<LogEntry[]>([]);
  const logId = useRef(0);

  const stamp = useCallback(() => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }, []);

  const push = useCallback(
    (text: string, tone: string) => {
      logId.current += 1;
      const entry = { id: logId.current, time: stamp(), text, tone };
      setLog((prev) => [...prev.slice(-2), entry]);
    },
    [stamp],
  );

  /* ── The meter. One rAF loop, paused when frozen or offscreen. ─────────── */
  useEffect(() => {
    let last = performance.now();
    let visible = true;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 120);
      last = now;
      if (!frozen.current && visible) {
        revenue.current += (dt / 16.7) * START_RATE;
        if (meterRef.current) {
          meterRef.current.textContent = Math.floor(revenue.current).toLocaleString("en-US");
        }
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    const onVis = () => { visible = !document.hidden; last = performance.now(); };
    document.addEventListener("visibilitychange", onVis);

    return () => { cancelAnimationFrame(raf.current); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  /* ── Breach evaluation ─────────────────────────────────────────────────── */
  const evaluate = useCallback(
    (dx: number, dy: number) => {
      const stage = stageRef.current;
      if (!stage) return;

      const size = stage.getBoundingClientRect().width;
      const radius = size * RING_RATIO;
      const dist = Math.hypot(dx, dy);
      const out = dist > radius;

      if (out !== breached.current) {
        breached.current = out;
        stage.setAttribute("data-breach", out ? "1" : "0");

        if (out) {
          frozen.current = true;                    // freeze MID-DIGIT
          breachCount.current += 1;
          if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(12);
          push(
            en
              ? "Machine RUH-14 left its zone · automatic shutdown · owner alerted"
              : "المكينة RUH-14 غادرت النطاق · إيقاف تلقائي · تنبيه المالك",
            "breach",
          );
        }
      }

      if (out) {
        const metres = Math.round(((dist - radius) / radius) * 40);
        const el = stage.querySelector(".r-dist");
        if (el) {
          el.textContent = en
            ? `${metres} m outside the zone`
            : `${metres.toLocaleString("ar-EG")} م خارج النطاق`;
        }
      }
    },
    [en, push],
  );

  /* ── Pointer handling ──────────────────────────────────────────────────── */
  useEffect(() => {
    const machine = machineRef.current;
    const stage = stageRef.current;
    if (!machine || !stage) return;

    const setPos = (x: number, y: number) => {
      machine.style.setProperty("--mx", `${x}px`);
      machine.style.setProperty("--my", `${y}px`);
    };

    const onDown = (e: PointerEvent) => {
      drag.current.active = true;
      drag.current.ox = e.clientX - drag.current.dx;
      drag.current.oy = e.clientY - drag.current.dy;
      machine.classList.remove("settling");
      machine.setPointerCapture(e.pointerId);
      touched.current = true;
      stage.setAttribute("data-touched", "1");
      e.preventDefault();
    };

    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      drag.current.dx = e.clientX - drag.current.ox;
      drag.current.dy = e.clientY - drag.current.oy;
      setPos(drag.current.dx, drag.current.dy);
      evaluate(drag.current.dx, drag.current.dy);
    };

    const onUp = () => {
      if (!drag.current.active) return;
      drag.current.active = false;

      machine.classList.add("settling");
      drag.current.dx = 0;
      drag.current.dy = 0;
      setPos(0, 0);

      if (breached.current) {
        breached.current = false;
        stage.setAttribute("data-breach", "0");
        // Resume from where it froze — never from zero. This is the sale.
        frozen.current = false;
        push(
          en ? "Back inside the zone · service resumed" : "عاد داخل النطاق · استئناف التشغيل",
          "ok",
        );
        if (breachCount.current === 5) {
          push(en ? "You won't get bored of this. Neither will we." : "لن تملّ من هذا. ولا نحن.", "wry");
        }
      }
    };

    machine.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    /* Auto-demo: if nobody touches it within 6s of being on screen, the machine
       drifts out and back once, then stops offering. Never nags twice. */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || touched.current) return;
          io.disconnect();
          window.setTimeout(() => {
            if (touched.current) return;
            const size = stage.getBoundingClientRect().width;
            const out = size * RING_RATIO * 1.35;
            machine.classList.add("settling");
            setPos(out, 0);
            evaluate(out, 0);
            window.setTimeout(() => {
              setPos(0, 0);
              if (breached.current) {
                breached.current = false;
                stage.setAttribute("data-breach", "0");
                frozen.current = false;
                push(en ? "Back inside the zone · service resumed" : "عاد داخل النطاق · استئناف التشغيل", "ok");
              }
            }, 1900);
          }, 6000);
        });
      },
      { threshold: 0.5 },
    );
    io.observe(stage);

    return () => {
      machine.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      io.disconnect();
    };
  }, [en, evaluate, push]);

  return (
    <section className="radar-sec" id="radar">
      <div className="radar-copy">
        <span className="label">{en ? "Protection" : "الحماية"}</span>
        <h2>
          {en ? <>Move it, and it <em>stops working.</em></> : <>حرّكها، <em>وتتوقّف عن العمل.</em></>}
        </h2>
        <p>
          {en
            ? "Every machine has a fixed zone. The moment it leaves, R.Pay shuts it down and tells the owner. Nobody has to be watching."
            : "لكل مكينة نطاق محدّد. في اللحظة التي تغادره، يوقفها آر باي ويُبلغ المالك. لا أحد بحاجة إلى المراقبة."}
        </p>
        <span className="sim-chip">
          {en ? "Interactive simulation · no real device is affected" : "محاكاة تفاعلية · لا يتم إيقاف أي جهاز حقيقي"}
        </span>

        <ul className="r-log" aria-live="polite">
          {log.map((l) => (
            <li key={l.id} data-tone={l.tone}>
              <span className="ltr">{l.time}</span>
              <span>{l.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="radar-stage" ref={stageRef} data-breach="0" data-touched="0">
        <svg className="radar-svg" viewBox="0 0 100 100" aria-hidden="true">
          <line className="r-cross" x1="50" y1="8" x2="50" y2="92" />
          <line className="r-cross" x1="8" y1="50" x2="92" y2="50" />
          <circle className="r-ring r-ring-inner" cx="50" cy="50" r="18" />
          <circle className="r-ring" cx="50" cy="50" r={RING_RATIO * 100} />
        </svg>

        <div className="r-meter">
          <span className="m-v mono ltr">
            <span ref={meterRef}>4,820</span>
          </span>
          <span className="label">{en ? "Today · SAR" : "اليوم · ريال"}</span>
        </div>

        <div className="r-machine" ref={machineRef}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ARCADE} alt={en ? "R.Pay arcade machine" : "مكينة ألعاب بنظام آر باي"} />
        </div>

        <span className="r-dist mono" />
        <span className="r-prompt">
          {en ? "Drag the machine outside its zone →" : "← اسحب المكينة خارج نطاقها"}
        </span>
      </div>
    </section>
  );
}
