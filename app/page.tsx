"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BrandsMarquee from "@/components/BrandsMarquee";
import HowItWorks from "@/components/HowItWorks";
import Integration from "@/components/Integration";
import Menu from "@/components/Menu";
import { DEVICE } from "@/lib/assets/device";
import { R_MARK } from "@/lib/assets/brand";

const VendingScroll = dynamic(() => import("@/components/VendingScroll"), {
  ssr: false,
});

export default function Page() {
  const [en, setEn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = document.documentElement;
    if (en) {
      h.classList.add("en");
      h.setAttribute("dir", "ltr");
      h.setAttribute("lang", "en");
    } else {
      h.classList.remove("en");
      h.setAttribute("dir", "rtl");
      h.setAttribute("lang", "ar");
    }
  }, [en]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer:fine)").matches;

    // clocks
    const clkR = document.getElementById("clkR");
    const clkL = document.getElementById("clkL");
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const fmt = (z: string) => {
      try {
        return new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit", minute: "2-digit", hour12: false, timeZone: z,
        }).format(new Date());
      } catch { return "--:--"; }
    };
    const tick = () => {
      if (clkR) clkR.textContent = fmt("Asia/Riyadh");
      if (clkL) clkL.textContent = fmt(tz);
    };
    tick();
    const clockInt = setInterval(tick, 30000);

    // counters
    const runNum = (el: HTMLElement) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const t = +(el.dataset.t || "0");
      const dur = reduced ? 0 : 1400;
      const s = performance.now();
      const step = (now: number) => {
        const k = Math.min((now - s) / Math.max(dur, 1), 1);
        const e = 1 - Math.pow(1 - k, 4);
        el.textContent = Math.round(t * e).toLocaleString("en-US");
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    // reveal
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            entry.target
              .querySelectorAll<HTMLElement>(".num")
              .forEach(runNum);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll<HTMLElement>(".rv").forEach((el) => io.observe(el));

    // nav + progress
    const nav = document.getElementById("nav");
    const prog = document.getElementById("prog");
    const onScroll = () => {
      if (nav) nav.classList.toggle("sc", window.scrollY > 30);
      if (prog) {
        const hgt = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.width = (hgt > 0 ? (window.scrollY / hgt) * 100 : 0) + "%";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // scroll-spy
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".nlinks a")
    );
    const spy: Record<string, HTMLAnchorElement> = {};
    links.forEach((a) => {
      const id = a.getAttribute("href");
      if (id && id[0] === "#") spy[id.slice(1)] = a;
    });
    const sio = new IntersectionObserver(
      (es) => {
        es.forEach((entry) => {
          const a = spy[entry.target.id];
          if (a && entry.isIntersecting) {
            Object.values(spy).forEach((x) => x.classList.remove("cur"));
            a.classList.add("cur");
          }
        });
      },
      { rootMargin: "-38% 0px -55% 0px" }
    );
    Object.keys(spy).forEach((id) => {
      const el = document.getElementById(id);
      if (el) sio.observe(el);
    });

    // card numbering
    document.querySelectorAll<HTMLElement>(".bento .card").forEach((c, i) => {
      if (c.querySelector(".cnum")) return;
      const nEl = document.createElement("i");
      nEl.className = "cnum";
      nEl.textContent = (i < 9 ? "0" : "") + (i + 1);
      c.appendChild(nEl);
    });

    // pointer: spotlight + device tilt
    const tilt = document.getElementById("tilt");
    const onPointer = (e: PointerEvent) => {
      const cards = document.querySelectorAll<HTMLElement>(".card,.sector");
      cards.forEach((c) => {
        const r = c.getBoundingClientRect();
        if (
          e.clientX >= r.left && e.clientX <= r.right &&
          e.clientY >= r.top && e.clientY <= r.bottom
        ) {
          c.style.setProperty("--mx", e.clientX - r.left + "px");
          c.style.setProperty("--my", e.clientY - r.top + "px");
        }
      });
      if (fine && tilt && !reduced) {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -((e.clientY / window.innerHeight) * 2 - 1);
        tilt.style.transform = `rotateY(${nx * 10}deg) rotateX(${-ny * 7}deg)`;
      }
    };
    if (fine) window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      clearInterval(clockInt);
      io.disconnect();
      sio.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <>
      {/* NAV */}
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="nav" id="nav">
        <a className="brand" href="#top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-mark" src={R_MARK} alt="R.Pay" />
          <span>Pay</span>
        </a>
        <nav className="nlinks">
          <a href="#features"><span className="ar-t">المزايا</span><span className="en-t">Features</span></a>
          <a href="#about"><span className="ar-t">عن ار باي</span><span className="en-t">About</span></a>
          <a href="#sectors"><span className="ar-t">التكامل</span><span className="en-t">Integration</span></a>
          <a href="#how"><span className="ar-t">كيف يعمل</span><span className="en-t">How it works</span></a>
          <a href="#compare"><span className="ar-t">المقارنة</span><span className="en-t">Compare</span></a>
        </nav>
        <div className="nright">
          <button className="lang" onClick={() => setEn((v) => !v)}>{en ? "ع" : "EN"}</button>
          <a className="btn" href="#contact"><span className="ar-t">ابدأ الآن</span><span className="en-t">Get Started</span></a>
          <button className="burger" onClick={() => setMenuOpen(true)} aria-label="القائمة"><i /><i /><i /></button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="hgrid">
          <div>
            <div className="kicker rv"><span className="pulse" />
              <span className="ar-t">نظام دفع ذكي · منصة تحكّم موحّدة</span>
              <span className="en-t">Smart Payments · Unified Control</span>
            </div>
            <h1 className="rv d1">
              <span className="ar-t">حلول <em>ذكية</em><br />لمستقبل أفضل</span>
              <span className="en-t"><em>Results</em> That<br />Speak.</span>
            </h1>
            <p className="hsub rv d2">
              <span className="ar-t">نظام دفع شامل ومنصّة تحكّم لحظية لأجهزة الخدمة الذاتية، من ماكينة واحدة إلى شبكة كاملة.</span>
              <span className="en-t">A complete payment suite and real-time control platform for self-service devices, from one machine to a whole network.</span>
            </p>
            <div className="hcta rv d3">
              <a className="btn" href="#contact"><span className="ar-t">ابدأ الآن</span><span className="en-t">Get Started</span></a>
              <a className="btn ghost" href="#showcase"><span className="ar-t">اكتشف المنصة</span><span className="en-t">Explore the Platform</span></a>
            </div>
            <div className="pays rv d4">
              <span className="lb"><span className="ar-t">طرق الدفع</span><span className="en-t">Payments</span></span>
              <span className="pay">mada</span><span className="pay">VISA</span><span className="pay">Mastercard</span>
              <span className="pay">Apple Pay</span><span className="pay">stc pay</span><span className="pay">GCCNET</span>
            </div>
          </div>
          <div className="rv d2">
            <div className="stage">
              <div className="dfloat"><div className="dtilt" id="tilt">
                <div className="halo" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="device" src={DEVICE} alt="R.Pay payment terminal" />
              </div></div>
              <div className="dash">
                <div className="dhd">
                  <span className="t"><span className="ar-t">لوحة التحكم</span><span className="en-t">Dashboard</span></span>
                  <span className="live"><i /><span className="ar-t">مباشر</span><span className="en-t">LIVE</span></span>
                </div>
                <div className="dlbl"><span className="ar-t">إجمالي المشتريات</span><span className="en-t">Total purchases</span></div>
                <div className="dval"><span className="num" data-t="465255">0</span></div>
                <svg className="spark" viewBox="0 0 240 34" preserveAspectRatio="none">
                  <defs><linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#00AEEF" /><stop offset="1" stopColor="#00AEEF" stopOpacity="0" />
                  </linearGradient></defs>
                  <path className="f" d="M0,30 L0,22 C24,26 36,10 60,14 C84,18 96,4 120,9 C150,15 168,2 192,7 C210,11 224,6 240,10 L240,34 L0,34 Z" fill="url(#sparkGrad)" />
                  <path className="l" d="M0,22 C24,26 36,10 60,14 C84,18 96,4 120,9 C150,15 168,2 192,7 C210,11 224,6 240,10" />
                </svg>
                <div className="dgrid">
                  <div className="mini"><div className="a"><span className="ar-t">الأرباح</span><span className="en-t">Profit</span></div><div className="b"><span className="num" data-t="162839">0</span></div></div>
                  <div className="mini"><div className="a"><span className="ar-t">متصل</span><span className="en-t">Online</span></div><div className="b"><span className="num" data-t="90">0</span>/97</div></div>
                  <div className="mini"><div className="a"><span className="ar-t">الهدايا</span><span className="en-t">Gifts</span></div><div className="b"><span className="num" data-t="9434">0</span></div></div>
                </div>
              </div>
              <div className="toast">
                <span className="ic"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg></span>
                <div>
                  <div className="tt"><span className="ar-t">دفعة ناجحة</span><span className="en-t">Payment approved</span></div>
                  <div className="ts">SAR 15.00 · mada</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BrandsMarquee />
      <VendingScroll />

      {/* STATS */}
      <section className="stats">
        <div className="wrap">
          <div className="stgrid">
            <div className="stat rv"><b><span className="num" data-t="465255">0</span>+</b><span><span className="ar-t">عملية دفع</span><span className="en-t">Transactions</span></span></div>
            <div className="stat rv d1"><b><span className="num" data-t="97">0</span></b><span><span className="ar-t">ماكينة مُدارة</span><span className="en-t">Machines managed</span></span></div>
            <div className="stat rv d2"><b><span className="num" data-t="9">0</span></b><span><span className="ar-t">فروع</span><span className="en-t">Branches</span></span></div>
            <div className="stat rv d3"><b><span className="num" data-t="9434">0</span></b><span><span className="ar-t">هدية مُسلَّمة</span><span className="en-t">Gifts delivered</span></span></div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div className="wrap">
          <div className="khead rv"><i /><span><span className="ar-t">مزايا ار باي</span><span className="en-t">R Pay Features</span></span><i /></div>
          <h2 className="stitle rv d1"><span className="ar-t">كل ما تحتاجه <em>في نظام واحد</em></span><span className="en-t">Everything you need, <em>in one system</em></span></h2>
          <p className="ssub rv d2"><span className="ar-t">تخلّص من الأعمال الروتينية واحصل على رؤية واضحة لما يهم، نظام شامل لإدارة عملياتك بسلاسة وكفاءة.</span><span className="en-t">Eliminate the busywork and gain a clear picture of what matters, one suite to run your operations smoothly.</span></p>
          <div className="bento">
            <div className="card s2 rv">
              <div className="fic"><svg viewBox="0 0 24 24"><path d="M3 10h18M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" /><path d="M7 15h4" /></svg></div>
              <h3><span className="ar-t">تحصيل مباشر لحسابك</span><span className="en-t">Direct settlement</span></h3>
              <p><span className="ar-t">التحصيل المباشر للمبالغ إلى حساب المالك أو المشغّل، أموالك تصلك مباشرة دون وسيط.</span><span className="en-t">Revenue is collected straight into the owner or operator account, no middleman.</span></p>
            </div>
            <div className="card rv d1">
              <div className="fic"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg></div>
              <h3><span className="ar-t">استرجاع تلقائي</span><span className="en-t">Auto cashback</span></h3>
              <p><span className="ar-t">عند فشل الدفع يُعاد المبلغ تلقائيًا دون تدخل بشري.</span><span className="en-t">Failed payments are refunded automatically.</span></p>
            </div>
            <div className="card rv d2">
              <div className="fic"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M7 14l3-3 2 2 4-4" /></svg></div>
              <h3><span className="ar-t">تقارير لحظية</span><span className="en-t">Real-time reports</span></h3>
              <p><span className="ar-t">تقارير تشغيلية ومالية في الوقت الفعلي.</span><span className="en-t">Operational and financial reports as they happen.</span></p>
            </div>
            <div className="card rv">
              <div className="fic"><svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="12" rx="2" /><path d="M8 21h8M12 17v4" /></svg></div>
              <h3><span className="ar-t">لوحة تحكم موحّدة</span><span className="en-t">Unified dashboard</span></h3>
              <p><span className="ar-t">المبيعات والأرباح والأجهزة والهدايا في مكان واحد.</span><span className="en-t">Sales, profit, devices and rewards in one place.</span></p>
            </div>
            <div className="card rv d1">
              <div className="fic"><svg viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /><circle cx="12" cy="12" r="4" /></svg></div>
              <h3><span className="ar-t">إدارة الأجهزة عن بُعد</span><span className="en-t">Remote device control</span></h3>
              <p><span className="ar-t">تشغيل وإيقاف وتتبّع الموقع وعدد الأجهزة، كل ذلك عن بُعد.</span><span className="en-t">Start, stop and track every device remotely.</span></p>
            </div>
            <div className="card s2 rv d2">
              <div className="fic"><svg viewBox="0 0 24 24"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg></div>
              <h3><span className="ar-t">الرادار الجغرافي</span><span className="en-t">Geofence radar</span></h3>
              <p><span className="ar-t">تنبيه فوري وإغلاق تلقائي عند خروج الجهاز عن نطاقه المحدد.</span><span className="en-t">Instant alert and auto-shutdown when a device leaves its zone.</span></p>
            </div>
            <div className="card s2 rv">
              <div className="fic"><svg viewBox="0 0 24 24"><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6M12 20V9M2 7l10-4 10 4-10 4L2 7Z" /></svg></div>
              <h3><span className="ar-t">إدارة المخزون والهدايا</span><span className="en-t">Inventory and rewards</span></h3>
              <p><span className="ar-t">تصنيف الهدايا وتتبّع الكميات وربط كل هدية بجهاز محدد، ضبط فعّال وتقليل للهدر وتجربة أدق للعميل.</span><span className="en-t">Classify prizes, track quantities and link each item to a device, tighter control and less waste.</span></p>
            </div>
            <div className="card s2 rv d1">
              <div className="fic"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
              <h3><span className="ar-t">الفروع والمستخدمون والصلاحيات</span><span className="en-t">Branches, users and access</span></h3>
              <p><span className="ar-t">إدارة مرنة للفروع والمستخدمين والصلاحيات مع تنبيهات فورية للأعطال والمخزون.</span><span className="en-t">Flexible branch, user and permission management with instant fault and stock alerts.</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="wrap">
          <div className="khead rv"><i /><span><span className="ar-t">قصتنا</span><span className="en-t">Our Story</span></span><i /></div>
          <h2 className="stitle rv d1"><span className="ar-t">عن <em>ار باي</em></span><span className="en-t">About <em>R Pay</em></span></h2>
          <p className="ssub rv d2"><span className="ar-t">شركة سعودية تقود التحوّل الذكي لقطاع الأجهزة والخدمات الذاتية.</span><span className="en-t">A Saudi company leading the smart transformation of the self-service sector.</span></p>
          <div className="agrid">
            <div className="atext rv">
              <p className="lead"><span className="ar-t">نظام موحّد يجمع الدفع الإلكتروني والمراقبة التشغيلية في منصة واحدة.</span><span className="en-t">One unified system bringing e-payment and operational control together.</span></p>
              <p><span className="ar-t">ار باي شركة سعودية تقدّم حلولاً تقنية ذكية لقطاع الأجهزة والخدمات الذاتية، تتيح للمشغلين التحكم الكامل ومتابعة عملياتهم في الوقت الفعلي، لتعزيز الكفاءة التشغيلية وتقديم تجربة سلسة وآمنة للمستخدم ودعم نمو الأعمال بمرونة.</span><span className="en-t">R Pay is a Saudi company offering smart tech solutions for the self-service and device sector, enabling operators to manage and monitor operations in real time, boosting efficiency and delivering a smooth, secure user experience.</span></p>
              <div className="lead-badge rv d1"><svg viewBox="0 0 24 24"><path d="M8 21h8M12 17v4M17 4H7v6a5 5 0 0 0 10 0V4Z" /><path d="M7 6H4a2 2 0 0 0 2 5M17 6h3a2 2 0 0 1-2 5" /></svg>
                <span className="ar-t">أكبر مشغّل لمكائن ألعاب الأركيد في المنطقة</span><span className="en-t">The largest arcade-machine operator in the region</span></div>
              <div className="clients rv d2">
                <span className="client">Saffori Land</span><span className="client">Sparky&apos;s</span><span className="client">VR Games Zone</span>
              </div>
            </div>
            <div className="mv">
              <div className="mvc rv d1">
                <h3><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></svg><span className="ar-t">مهمتنا</span><span className="en-t">Our Mission</span></h3>
                <p><span className="ar-t">تمكين المشغلين من تعزيز الكفاءة التشغيلية وتقديم تجربة سلسة وآمنة للمستخدم، ودعم نمو الأعمال بكفاءة ومرونة.</span><span className="en-t">Empower operators to boost efficiency, deliver a smooth and secure experience, and support business growth.</span></p>
              </div>
              <div className="mvc rv d2">
                <h3><svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg><span className="ar-t">رؤيتنا</span><span className="en-t">Our Vision</span></h3>
                <p><span className="ar-t">أن نكون المنصة التقنية الرائدة لإدارة وتشغيل الأجهزة الذاتية في المملكة والمنطقة.</span><span className="en-t">To be the leading tech platform for managing and operating self-service devices in the Kingdom and the region.</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Integration />

      <HowItWorks />

      {/* RADAR */}
      <section id="radar">
        <div className="wrap">
          <div className="rgrid">
            <div className="rcopy rv">
              <div className="khead" style={{ justifyContent: "flex-start" }}><i /><span><span className="ar-t">الحماية</span><span className="en-t">Protection</span></span></div>
              <h2><span className="ar-t">الرادار الجغرافي، <em>حماية تعمل وحدها</em></span><span className="en-t">Geofence Radar, <em>protection on autopilot</em></span></h2>
              <p><span className="ar-t">يتم تحديد موقع جغرافي لكل جهاز، وعند تغييره يُرسل تنبيه فوري ويُغلق الجهاز تلقائيًا إذا خرج عن الحدود المحددة.</span><span className="en-t">A fixed location is set for each device; any movement triggers an instant alert and automatic shutdown if it leaves the defined area.</span></p>
              <div className="rlist">
                <div className="rli rv d1"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg><div><b><span className="ar-t">حماية من العبث أو النقل</span><span className="en-t">Anti-tampering and relocation</span></b><span className="ar-t">أي حركة خارج النطاق تُغلق الجهاز فورًا.</span><span className="en-t">Movement outside the zone shuts the device down.</span></div></div>
                <div className="rli rv d2"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg><div><b><span className="ar-t">توثيق دقيق للموقع</span><span className="en-t">Accurate site tracking</span></b><span className="ar-t">تعرف مكان كل جهاز في شبكتك لحظة بلحظة.</span><span className="en-t">Know where every device is, moment by moment.</span></div></div>
                <div className="rli rv d3"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg><div><b><span className="ar-t">موثوقية تشغيلية أعلى</span><span className="en-t">Higher operational reliability</span></b><span className="ar-t">تقليل المخاطر ورفع الثقة في التشغيل.</span><span className="en-t">Lower risk, stronger operational confidence.</span></div></div>
              </div>
            </div>
            <div className="rv d1">
              <div className="radar">
                <div className="rring r1" /><div className="rring r2" /><div className="rring r3" /><div className="rring r4" />
                <div className="rcross" /><div className="sweep" /><div className="fence" /><div className="dev" />
                <div className="ralert"><span className="dot" />
                  <div><b><span className="ar-t">تنبيه: خرج الجهاز عن النطاق</span><span className="en-t">Alert: device left the zone</span></b><br /><span className="ar-t">تم الإغلاق تلقائيًا</span><span className="en-t">Auto-shutdown engaged</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section id="compare">
        <div className="wrap">
          <div className="khead rv"><i /><span><span className="ar-t">المقارنة</span><span className="en-t">Comparison</span></span><i /></div>
          <h2 className="stitle rv d1"><span className="ar-t">لماذا <em>ار باي</em>؟</span><span className="en-t">Why <em>R Pay</em>?</span></h2>
          <p className="ssub rv d2"><span className="ar-t">مقارنة مباشرة مع الحلول الأخرى في السوق.</span><span className="en-t">A head-to-head look at the alternatives.</span></p>
          <div className="cmp rv d1">
            <table>
              <thead><tr>
                <th><span className="ar-t">الميزة</span><span className="en-t">Feature</span></th>
                <th className="rcol">R.Pay</th>
                <th><span className="ar-t">الآخرون</span><span className="en-t">Others</span><br /><small style={{ opacity: .55, fontSize: "10px" }}>SurePay · Geidea</small></th>
              </tr></thead>
              <tbody>
                {[
                  ["تحصيل مباشر لحساب المالك", "Direct revenue collection", false],
                  ["استرداد تلقائي", "Automatic refunds", false],
                  ["الرادار الجغرافي GPS", "GPS geofencing", false],
                  ["إدارة المخزون والهدايا", "Inventory management", false],
                  ["إضافة وإزالة الأجهزة عن بُعد", "Remote add/remove devices", false],
                  ["تدريب ودعم عن بُعد", "Remote training and support", false],
                  ["العلامة البيضاء", "White-label option", false],
                  ["لوحة مبيعات وتحكم لحظية", "Real-time dashboard", true],
                ].map((row, i) => (
                  <tr className="rv" key={i}>
                    <td><span className="ar-t">{row[0] as string}</span><span className="en-t">{row[1] as string}</span></td>
                    <td className="rcol"><svg className="ck" viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" /></svg></td>
                    <td>
                      {row[2] ? (
                        <svg className="ck" viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" /></svg>
                      ) : (
                        <svg className="xk" viewBox="0 0 24 24"><path d="M6 6l12 12" /><path d="M18 6L6 18" /></svg>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="disc rv"><span className="ar-t">تنويه: المعلومات مبنية على بيانات السوق الحالية وقد تتغير مع التحديثات المستقبلية.</span><span className="en-t">Disclaimer: based on current market insights and may change with future updates.</span></p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="contact">
        <div className="wrap">
          <div className="ctabox rv">
            <h2><span className="ar-t">انضم إلينا وابدأ البيع الذاتي الآن<br />بكل سهولة</span><span className="en-t">Join us and start self-selling now<br />with ease</span></h2>
            <p><span className="ar-t">انضم إلى المنصة الرائدة للقياس عن بُعد والمدفوعات الرقمية في منطقة الشرق الأوسط وشمال إفريقيا، وحوّل عمليات الخدمة الذاتية الخاصة بك اليوم.</span><span className="en-t">Join the leading platform for scalable telemetry and digital payments in the MENA region. Transform your self-service operations today.</span></p>
            <a className="btn" href="https://wa.me/966550796555" target="_blank" rel="noopener noreferrer"><span className="ar-t">ابدأ الآن</span><span className="en-t">Get Started</span></a>
            <span className="ctamail"><span className="ar-t">استفسارات:</span><span className="en-t">Inquiries:</span> <b>hello@rpay.sa</b></span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="fgrid">
          <div className="fbrand">
            <a className="brand" href="#top">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="brand-mark" src={R_MARK} alt="R.Pay" />
              <span>Pay</span>
            </a>
            <p><span className="ar-t">نظام الدفع الذكي وإدارة العمليات الرائد في المملكة العربية السعودية لمشغّلي الخدمة الذاتية.</span><span className="en-t">Saudi Arabia&apos;s premier smart payment and operations management system for self-service operators.</span></p>
            <div className="socials">
              <a className="soc" href="#" aria-label="X"><svg viewBox="0 0 24 24"><path d="M18.9 2H22l-6.9 7.9L23.3 22h-6.4l-5-6.6L6 22H2.9l7.4-8.5L1.5 2H8l4.5 6L18.9 2Zm-1.1 18h1.7L7.1 3.9H5.3L17.8 20Z" /></svg></a>
              <a className="soc" href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.24 8.31h4.52V23H.24V8.31Zm7.44 0h4.33v2h.06c.6-1.14 2.07-2.34 4.27-2.34 4.57 0 5.41 3 5.41 6.91V23h-4.5v-7.2c0-1.72-.03-3.93-2.4-3.93-2.4 0-2.77 1.87-2.77 3.8V23H7.68V8.31Z" /></svg></a>
              <a className="soc" href="#" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.86s0 3.6-.07 4.86c-.15 3.23-1.66 4.77-4.92 4.92-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.1 15.6 2.1 15.2 2.1 12s0-3.6.08-4.86C2.33 3.9 3.84 2.42 7.1 2.27 8.4 2.2 8.8 2.2 12 2.2Zm0 3.63a6.17 6.17 0 1 0 0 12.34 6.17 6.17 0 0 0 0-12.34Zm0 10.18a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" /></svg></a>
            </div>
          </div>
          <div className="fcol">
            <h4><span className="ar-t">الشركة</span><span className="en-t">Company</span></h4>
            <a href="#about"><span className="ar-t">معلومات عنا</span><span className="en-t">About us</span></a>
            <a href="#"><span className="ar-t">الوظائف</span><span className="en-t">Careers</span></a>
            <a href="#"><span className="ar-t">الشراكات</span><span className="en-t">Partnerships</span></a>
            <a href="#contact"><span className="ar-t">اتصل بنا</span><span className="en-t">Contact</span></a>
          </div>
          <div className="fcol">
            <h4><span className="ar-t">قانوني</span><span className="en-t">Legal</span></h4>
            <a href="#"><span className="ar-t">سياسة الخصوصية</span><span className="en-t">Privacy Policy</span></a>
            <a href="#"><span className="ar-t">شروط الخدمة</span><span className="en-t">Terms of Service</span></a>
            <a href="#"><span className="ar-t">الأمان</span><span className="en-t">Security</span></a>
            <a href="#"><span className="ar-t">الامتثال</span><span className="en-t">Compliance</span></a>
          </div>
          <div className="fcol">
            <h4><span className="ar-t">الحالة</span><span className="en-t">Status</span></h4>
            <div className="clocks">
              <div className="clock"><span><span className="ar-t">الرياض</span><span className="en-t">Riyadh</span></span><b id="clkR">--:--</b></div>
              <div className="clock"><span><span className="ar-t">محلي</span><span className="en-t">Local</span></span><b id="clkL">--:--</b></div>
            </div>
            <span className="status"><i /><span className="ar-t">النظام يعمل</span><span className="en-t">System Operational</span></span>
            <span className="fi" style={{ marginTop: "12px" }}><span className="ar-t">طريق الملك فهد، الرياض</span><span className="en-t">King Fahd Rd, Riyadh</span></span>
          </div>
        </div>
        <div className="fbot">
          <span><span className="ar-t">جميع الحقوق محفوظة © 2026 شركة آر باي السعودية.</span><span className="en-t">© 2026 R.Pay Saudi Arabia. All rights reserved.</span></span>
          <span>R.PAY</span>
        </div>
      </footer>
    </>
  );
}
