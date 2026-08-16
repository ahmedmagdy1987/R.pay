/**
 * SECTION 02 — الأسئلة الأربعة · the four operator questions.
 *
 * THE NON-DATA TEST. There is no fleet here, no telemetry, no metric, no chart and
 * no card. The question is whether the grammar can organise human, commercial
 * content without pretending it is a dashboard.
 *
 * How the grammar carries it, semantically rather than decoratively:
 *
 *   In the hero, a peg is:   spine → node → stem → JOINT → head, and the head is a
 *                            MACHINE, coloured by its state.
 *   Here, a peg is:          spine → node → stem → JOINT → head, and the head is a
 *                            QUESTION, set as type.
 *
 * Same anatomy, different payload. The joint keeps its exact meaning too: in the
 * hero it is the break between infrastructure and machine; here it is the gap
 * between the system and the person — the distance the answer has to cross.
 *
 * What is deliberately NOT inherited:
 *   - No cyan. Cyan means live, and a question is not live state. The only colour
 *     in this section is brass (structure) and ink (voice).
 *   - No motion. Nothing moves unless it is reporting; explanation does not report.
 *     This section is a server component with zero JavaScript.
 *   - No state colours on the heads. A question has no uptime.
 *
 * Voices are separated by type, not by decoration: the mono numeral is the system
 * counting; everything a person reads is Readex.
 */

interface Q {
  n: string;
  nEn: string;
  qAr: string;
  qEn: string;
  aAr: string;
  aEn: string;
}

/* Ordered by the operator's night, not by feature importance: money first because
   it is the loudest anxiety, then whether the thing works, then whether it is
   still his, then what it earned. Each has exactly one answer. */
const QUESTIONS: Q[] = [
  {
    n: "٠١", nEn: "01",
    qAr: "هل تصل أموالي؟",
    qEn: "Is my money reaching me?",
    aAr: "التحصيل مباشر إلى حسابك. لا وسيط يمسك المبلغ في الطريق.",
    aEn: "Settlement goes straight to your account. No middleman holds it on the way.",
  },
  {
    n: "٠٢", nEn: "02",
    qAr: "هل المكينة تعمل الآن؟",
    qEn: "Is the machine working right now?",
    aAr: "كل مكينة تُبلّغ عن حالتها. تعرف المتوقّفة قبل أن يتصل بك أحد.",
    aEn: "Every machine reports its own state. You know which one stopped before anyone calls you.",
  },
  {
    n: "٠٣", nEn: "03",
    qAr: "هل حرّكها أحد؟",
    qEn: "Has someone moved it?",
    aAr: "لكل مكينة نطاق. تغادره، فتتوقّف من نفسها ويصلك التنبيه.",
    aEn: "Every machine has a zone. Leave it, and it stops itself and alerts you.",
  },
  {
    n: "٠٤", nEn: "04",
    qAr: "كم دخلت اليوم؟",
    qEn: "What did I make today?",
    aAr: "رقم واحد، ومعه تاريخه. لا تقرير يُجمَّع في آخر الشهر.",
    aEn: "One number, with its date attached. Not a report assembled at month-end.",
  },
];

export default function Questions({ en }: { en: boolean }) {
  return (
    <>
      {/* THE TRANSITION — the section hangs off the horizon.
          Not a fade, not a slide. A stem descends from the instrument, the joint
          opens, and what hangs below it is this section. The visitor moves from
          watching the system operate to understanding why it matters, carried by
          the same object. */}
      <div className="hang" aria-hidden="true">
        <div className="hang-inner measure">
          <span className="hang-stem" />
          <span className="hang-node" />
        </div>
      </div>

      <section className="qs" id="questions" aria-labelledby="qs-title">
        <div className="qs-head measure">
          <span className="label">{en ? "THE FOUR QUESTIONS" : "الأسئلة الأربعة"}</span>
          <h2 className="qs-title" id="qs-title">
            {en ? (
              <>At eleven at night, <em>four questions.</em></>
            ) : (
              <>في الحادية عشرة ليلًا، <em>أربعة أسئلة.</em></>
            )}
          </h2>
          <p className="lede">
            {en
              ? "These are the questions of an operator who owns machines he cannot see. Each one has a single answer."
              : "هذه أسئلة مشغّل يملك مكائن لا يراها. لكل سؤال إجابة واحدة."}
          </p>
        </div>

        <ol className="qs-list measure">
          {QUESTIONS.map((q) => (
            <li className="q" key={q.n}>
              <i className="q-node" aria-hidden="true" />
              <span className="q-n mono" aria-hidden="true">{en ? q.nEn : q.n}</span>
              <h3 className="q-q">{en ? q.qEn : q.qAr}</h3>
              <p className="q-a">{en ? q.aEn : q.aAr}</p>
            </li>
          ))}
        </ol>

        <div className="qs-more measure">
          <a className="ghost-link" href="#radar">
            {en ? "See what happens when one is moved" : "شاهد ما يحدث حين تُحرَّك واحدة"}
          </a>
        </div>
      </section>
    </>
  );
}
