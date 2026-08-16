/**
 * DAYLIGHT — لِمن نعمل · who this is for.
 *
 * THE SECOND AUDIENCE, FINALLY ADDRESSED.
 *
 * The whole night act speaks to one person: the operator who owns the machines.
 * But most of the marks in R.Pay's own customer list are VENUES — malls,
 * developers, destinations — who HOST machines rather than own them. Nothing on
 * any previous version of this site spoke to them at all.
 *
 * ── WHY IT IS TWO COLUMNS AND NOT A TOGGLE ─────────────────────────────────
 * A selector would make the visitor classify themselves before they have been
 * told what the classes are, and it hides half the argument from each reader.
 * Side by side, an operator sees that venues are served too (which is
 * reassurance that the thing is deployable), and a venue lead finds the only
 * paragraph on the site written for them without hunting.
 *
 * ── WHAT THE VENUE COLUMN CAREFULLY DOES NOT CLAIM ─────────────────────────
 * Revenue share, footfall data, installation terms and maintenance SLAs do not
 * exist anywhere in the company's own material, and inventing commercial terms
 * for somebody else's contract is the single most damaging thing this page could
 * do. So this column states only what the SYSTEM verifiably does — the money
 * never touches venue staff, the machine reports its own faults, and a machine
 * that leaves stops working — and then asks them to talk. The commercial offer
 * is registered as `commercial.venueProposition` and is a launch blocker.
 *
 * Daylight rules hold: no cyan, no pegs, no telemetry, no motion.
 */

interface Column {
  keyAr: string;
  keyEn: string;
  titleAr: string;
  titleEn: string;
  ledeAr: string;
  ledeEn: string;
  points: { ar: string; en: string }[];
}

const COLUMNS: Column[] = [
  {
    keyAr: "إن كنت تملك المكائن",
    keyEn: "IF YOU OWN THE MACHINES",
    titleAr: "تدير أسطولًا لا تراه.",
    titleEn: "You run a fleet you cannot see.",
    ledeAr:
      "أنت من يشتري المكينة، ويضعها في موقع، وينتظر أن تعمل. النظام كله مكتوب لهذا الدور.",
    ledeEn:
      "You buy the machine, you place it somewhere, and you wait for it to work. The whole system is written for that job.",
    points: [
      {
        ar: "التحصيل يصل إلى حسابك مباشرة، لا إلى حساب أحد آخر.",
        en: "Takings settle to your account, not to somebody else's.",
      },
      {
        ar: "كل مكينة تُبلّغ عن حالتها، فتعرف المتوقّفة قبل أن يخبرك أحد.",
        en: "Every machine reports its own state, so you know which one stopped before anyone tells you.",
      },
      {
        ar: "المكينة التي تغادر نطاقها تتوقّف من نفسها.",
        en: "A machine that leaves its zone stops itself.",
      },
    ],
  },
  {
    keyAr: "إن كنت تستضيفها",
    keyEn: "IF YOU HOST THEM",
    titleAr: "المكائن في موقعك، لا مشاكلها.",
    titleEn: "The machines are yours to host, not to run.",
    ledeAr:
      "المركز التجاري، الوجهة الترفيهية، المطعم. المكينة في مساحتك، لكنها ليست عبئًا على فريقك.",
    ledeEn:
      "A mall, a destination, a restaurant. The machine is in your space without becoming your staff's problem.",
    points: [
      {
        ar: "لا نقد يمرّ بأيدي فريقك. الدفع إلكتروني بالكامل.",
        en: "No cash passes through your staff. Payment is entirely electronic.",
      },
      {
        ar: "الأعطال تظهر عند المشغّل أولًا، لا عند موظف الاستقبال.",
        en: "Faults surface to the operator first, not to your front desk.",
      },
      {
        ar: "كل مكينة مربوطة بموقعها، فلا تتحرّك من مساحتك دون أن يُعرف.",
        en: "Every machine is tied to its location, so nothing moves out of your space unnoticed.",
      },
    ],
  },
];

export default function Audiences({ en }: { en: boolean }) {
  return (
    <section className="au-sec day" aria-labelledby="au-title">
      <div className="stack">
        <div className="au-col">
          <span className="dl-eyebrow mono">{en ? "WHO THIS IS FOR" : "لِمن نعمل"}</span>
          <h2 className="au-title" id="au-title">
            {en ? "Two people read this page." : "شخصان يقرآن هذه الصفحة."}
          </h2>

          <div className="au-grid">
            {COLUMNS.map((c) => (
              <article className="au-card" key={c.keyEn}>
                <span className="dl-rule au-rule" aria-hidden="true" />
                <span className="dl-node au-node" aria-hidden="true" />
                <span className="dl-label mono">{en ? c.keyEn : c.keyAr}</span>
                <h3 className="au-h">{en ? c.titleEn : c.titleAr}</h3>
                <p className="au-lede">{en ? c.ledeEn : c.ledeAr}</p>
                <ul className="au-points">
                  {c.points.map((p) => (
                    <li key={p.en}>{en ? p.en : p.ar}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="au-foot">
            {en
              ? "If you host machines and want the commercial terms, that is a conversation rather than a page. Ask, and you will get a straight answer."
              : "إن كنت تستضيف المكائن وتريد الشروط التجارية، فتلك محادثة لا صفحة. اسأل، وستصلك إجابة مباشرة."}
          </p>
        </div>
      </div>
    </section>
  );
}
