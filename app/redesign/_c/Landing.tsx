/**
 * THE PAGE.
 *
 * A SERVER COMPONENT, and that is a performance decision rather than a
 * stylistic one. While the locale lived in `useState` the whole file carried
 * `"use client"`, so every text section it imported was shipped to the browser
 * as JavaScript: adding six static sections took First Load from 97 kB to
 * 106 kB against a 110 kB budget, for markup that never changes after paint.
 *
 * The locale is a route now (`/redesign` is Arabic, `/redesign/en` is English),
 * which is also the correct answer for a bilingual site: two real URLs, each
 * server-rendered in its own language and direction, crawlable and linkable,
 * instead of one page that rewrites itself in the client.
 *
 * Three client islands remain, and each earns it by being genuinely
 * interactive: the Horizon (choreography and per-peg readouts), the Radar
 * (drag), and the SpineRail (scroll progress).
 */
import Link from "next/link";
import { R_MARK } from "@/lib/assets/brand";
import { getFleet, settledToday, formatAsOfAr, formatAsOfEn } from "@/lib/fleet/data";
import Horizon from "./Horizon";
import Radar from "./Radar";
import SpineRail from "./SpineRail";
import JointRule from "./JointRule";
import Questions from "./Questions";
import Daybreak from "./Daybreak";
import MoneyLine from "./MoneyLine";
import Refund from "./Refund";
import Fleet from "./Fleet";
import Audiences from "./Audiences";
import WhereItRuns from "./WhereItRuns";
import Close from "./Close";

/**
 * MILESTONE 1 — THE HORIZON
 *
 * The hero communicates the product while creating the identity. No video, no
 * loader, no intro. LCP is the headline text and it is in the first paint.
 *
 * Beat map (driven by Horizon, gated in CSS off data-phase):
 *   0.00  horizon + headline already set, nothing animating
 *   0.15  the fleet reports in — sweep deposits 97 ticks, right to left
 *   1.05  branch drops resolve; the line becomes a scale; gauges settle
 *   1.60  payment rails — the entry objection dies before it forms
 *   2.20  ticks resolve into truth; seven stay grey because seven are offline
 *   5.00  the theft — tick 43 breaches
 *   6.40  restored; the horizon goes still and never animates unprompted again
 */

const fleet = getFleet();
const settled = settledToday();

export default function Landing({ en }: { en: boolean }) {
  const asOf = en ? formatAsOfEn(fleet.totals.machines.asOf) : formatAsOfAr(fleet.totals.machines.asOf);

  return (
    <div className={`rp${en ? " en" : ""}`} lang={en ? "en" : "ar"} dir={en ? "ltr" : "rtl"}>
      {/* Repetition test 1 — the spine, compressed, as page progress */}
      <SpineRail />

      <main className="stage">
        {/* ── Masthead ─────────────────────────────────────────────────── */}
        <header className="mast">
          <a className="mast-brand" href="#top" aria-label="R.Pay">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={R_MARK} alt="" width={26} height={24} />
            <b>Pay</b>
          </a>
          <div className="mast-tools">
            <Link
              className="tool"
              href={en ? "/redesign" : "/redesign/en"}
              hrefLang={en ? "ar" : "en"}
              aria-label={en ? "التبديل إلى العربية" : "Switch to English"}
            >
              {en ? "ع" : "EN"}
            </Link>
          </div>
        </header>

        {/* ── The instrument ───────────────────────────────────────────── */}
        <div className="horizon-block" data-phase="idle" id="top">
          <div className="say">
            <h1 className="display">
              {en ? <>Every machine <em>under your command.</em></> : <>كل مكينة <em>تحت أمرك.</em></>}
            </h1>
            <p className="lede">
              {en
                ? "The payment and control system for self-service machines in Saudi Arabia. Every machine, on one screen, with no guessing."
                : "نظام الدفع والتحكّم لماكينات الخدمة الذاتية في السعودية. كل مكينة، على شاشة واحدة، بلا تخمين."}
            </p>
          </div>

          <Horizon fleet={fleet} en={en} />

          {/* Gauges. LAW 4 — every number carries its date, and none of them
              claims to be live, because none of them is. */}
          <div className="gauges">
            <div className="gauge">
              <span className="g-v mono ltr" data-tone="signal">
                {fleet.totals.online.value}
                <small>/{fleet.totals.machines.value}</small>
              </span>
              <span className="label">{en ? "Machines online" : "مكائن متصلة"}</span>
            </div>
            <div className="gauge">
              <span className="g-v mono ltr">{fleet.totals.branches.value}</span>
              <span className="label">{en ? "Branches" : "فروع"}</span>
            </div>
            <div className="gauge">
              <span className="g-v mono ltr">{fleet.totals.transactions.value.toLocaleString("en-US")}</span>
              <span className="label">{en ? "Transactions" : "عملية دفع"}</span>
            </div>
            <div className="gauge">
              <span className="g-v mono ltr">{settled.value.toLocaleString("en-US")}</span>
              <span className="label">{en ? "Settled today · SAR" : "محصّل اليوم · ريال"}</span>
            </div>
            <span className="prov">
              {en ? `Company-reported · as of ${asOf}` : `بيانات الشركة · حتى ${asOf}`}
            </span>
          </div>

          {/* Beat 4 — the rails. Static, monochrome, no badges. */}
          <div className="rails">
            <span className="rails-k">{en ? "ACCEPTS" : "يقبل"}</span>
            <span>mada</span><span>VISA</span><span>Mastercard</span>
            <span>Apple&nbsp;Pay</span><span>stc&nbsp;pay</span><span>GCCNET</span>
          </div>

          {/* Beats 6–7 — the system speaking. Mask sweep, never per-character. */}
          <div className="logline-wrap">
            <p className="logline" data-tone="breach" aria-live="polite">
              <span className="ltr mono">02:14:07</span>
              <span className="lg-text">
                {en
                  ? "Machine 43 left its geofence · automatic shutdown · owner alerted"
                  : "جهاز ٤٣ · خارج النطاق الجغرافي · إيقاف تلقائي · تنبيه المالك"}
              </span>
            </p>
          </div>
        </div>

        {/* ── Below the horizon: one ghost link, no filled button in 100vh ── */}
        <div className="foot-note">
          <a className="ghost-link" href="#radar">
            {en ? "See the control room · 15 minutes" : "شاهد جولة في غرفة التحكم · ١٥ دقيقة"}
          </a>
        </div>
      </main>

      {/* ── ACT I · NIGHT ─────────────────────────────────────────────
          02  the four questions      · recognition
          03  the money line          · kills the loudest objection
          04  the riyal that came back· the thing no competitor can show
          05  the geofence            · the visitor commits the crime
          06  the fleet               · it is bolted to real machines      */}
      <Questions en={en} />
      <MoneyLine en={en} />
      <Refund en={en} />

      {/* The joint as the section divider — used once, where the ground changes
          from explanation to demonstration */}
      <div className="divider-slot">
        <JointRule tone="breach" at={0.31} label={en ? "PROTECTION" : "الحماية"} />
      </div>

      <Radar en={en} />

      <Fleet en={en} />

      {/* ── DAYBREAK · the act break, and the paper act ───────────────
          The night has finished arguing. Daylight explains, to a second
          audience the night never addressed.                           */}
      <Daybreak en={en} />
      <Audiences en={en} />
      <WhereItRuns en={en} />

      {/* ── ACT III · NIGHT · the return ──────────────────────────────
          Back to the hull the page started in, for the one decision it
          has been asking for.                                          */}
      <Close en={en} />

    </div>
  );
}
