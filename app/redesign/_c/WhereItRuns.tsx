import { claimMode } from "@/lib/content";

/**
 * DAYLIGHT — أين تعمل · where the system runs.
 *
 * ── DESIGNED TO WORK WITH ZERO LOGOS, ON PURPOSE ───────────────────────────
 * The obvious build is a logo wall. A logo wall has one property that makes it
 * unusable here: it collapses without logos. Written permission for thirteen
 * third-party marks — several of them PIF-tier — is unresolved and may stay that
 * way for some of them, and a section whose visual quality depends on somebody
 * else's legal department is a section that cannot ship.
 *
 * So this is a REGISTER, not a wall: deployment class and setting, set as type,
 * in the daylight rules. It reads as a shipping manifest. Marks, when they are
 * cleared, are ADDITIVE — they slot in beside the lines that are already there
 * and nothing about the composition depends on them arriving.
 *
 * What it states is what can be evidenced from the product itself: these are the
 * KINDS of place the system is built for. It names no venue, no brand and no
 * customer, because every one of those is a claim about somebody else.
 *
 * `customers.logos` and `customers.namedDeployments` are registered launch
 * blockers; this section is what ships in the meantime, and it is not a
 * placeholder — it is the fallback, already applied.
 */

const SETTINGS = [
  {
    ar: "مراكز تجارية",
    en: "Shopping centres",
    noteAr: "ممرات وساحات، حركة عالية، لا فريق مخصّص للمكينة.",
    noteEn: "Concourses and courts. High footfall, no staff dedicated to the machine.",
  },
  {
    ar: "وجهات ترفيهية",
    en: "Entertainment destinations",
    noteAr: "مواسم وفعاليات، ذروة قصيرة، وأجهزة تتحرّك بين المواقع.",
    noteEn: "Seasons and events. Short peaks, and machines that move between sites.",
  },
  {
    ar: "صالات ألعاب",
    en: "Arcades",
    noteAr: "أسطول كثيف في مساحة واحدة، وجوائز تُحسب عند الخروج.",
    noteEn: "A dense fleet in one room, with prizes counted on the way out.",
  },
  {
    ar: "مطاعم ومقاهٍ",
    en: "Restaurants and cafés",
    noteAr: "جهاز أو جهازان، وتحصيل لا يمرّ بالكاشير.",
    noteEn: "One or two machines, and takings that never touch the till.",
  },
  {
    ar: "مجمّعات سكنية",
    en: "Residential communities",
    noteAr: "مواقع موزّعة، زيارات صيانة نادرة، واعتماد على التبليغ الذاتي.",
    noteEn: "Scattered sites, rare maintenance visits, and self-reporting that has to hold.",
  },
];

export default function WhereItRuns({ en }: { en: boolean }) {
  const logosCleared = claimMode("customers.logos") === "publish";

  return (
    <section className="wr-sec day" aria-labelledby="wr-title">
      <div className="stack">
        <div className="wr-col">
          <span className="dl-eyebrow mono">{en ? "WHERE IT RUNS" : "أين تعمل"}</span>
          <h2 className="wr-title" id="wr-title">
            {en ? "The places a machine has to survive." : "الأماكن التي على المكينة أن تصمد فيها."}
          </h2>
          <p className="wr-lede">
            {en
              ? "Every one of these has the same two problems: the machine is a long way from the person who owns it, and nobody on site is paid to care about it."
              : "لكل واحد من هذه المواقع المشكلة نفسها: المكينة بعيدة عمّن يملكها، ولا أحد في الموقع يتقاضى أجرًا ليهتم بها."}
          </p>

          <ol className="wr-list">
            {SETTINGS.map((s, i) => (
              <li className="wr-row" key={s.en}>
                <span className="wr-n mono">{en ? String(i + 1).padStart(2, "0") : ["٠١", "٠٢", "٠٣", "٠٤", "٠٥"][i]}</span>
                <div className="wr-body">
                  <h3 className="wr-h">{en ? s.en : s.ar}</h3>
                  <p className="wr-note">{en ? s.noteEn : s.noteAr}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Marks slot in HERE when permission is cleared, beside a register
              that already stands on its own. Nothing above this line changes. */}
          {logosCleared ? null : (
            <p className="wr-pending">
              {en
                ? "Customer marks are shown only with written permission from each owner. The register above is what this section is, not a placeholder for them."
                : "لا تُعرض علامات العملاء إلا بإذن خطّي من كل مالك. السجلّ أعلاه هو هذا القسم نفسه، لا مكانًا شاغرًا في انتظارها."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
