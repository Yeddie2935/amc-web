import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const CAP = "#f97316";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/** A test-paper chip: a rounded rect with lines of "text" and a big score. */
function Paper({ x, y, w, h, value, color, ghost }: { x: number; y: number; w: number; h: number; value: string; color: string; ghost?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={ghost ? `${color}18` : `${color}12`} stroke={color} strokeWidth={1.6} strokeDasharray={ghost ? "3 3" : undefined} />
      <path d={`M ${x + 10} ${y + 14} H ${x + w - 10} M ${x + 10} ${y + 22} H ${x + w - 22}`} stroke="#cbd5e1" strokeWidth={1.6} />
      <text x={x + w / 2} y={y + h - 12} textAnchor="middle" fontSize="16" fontWeight="900" fill={color} fontFamily={FONT}>
        {value}
      </text>
    </g>
  );
}

/**
 * Two known scores plus a target average pin down a total; to make one
 * remaining score as low as possible, the other remaining score is pushed
 * to its cap. Six beats: (0) the goal, empty tests; (1) the two known
 * scores fill in, remaining points bracketed; (2) the even-split trap —
 * splitting the remainder evenly lands on a real (wrong) choice; (3) the
 * last test is capped at the max score, squeezing the target test's slot
 * down; (4) that slot is solved and colored in; (5) the badge. Data:
 * { testCount, targetAverage, known: number[], cap }.
 */
export function ScoreMinimizeCapScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const testCount = Math.round(num(data.testCount, 4));
  const targetAverage = num(data.targetAverage, 0);
  const known = (Array.isArray(data.known) ? data.known : []).map((v) => num(v, 0));
  const cap = num(data.cap, 100);

  const required = testCount * targetAverage;
  const knownTotal = known.reduce((s, v) => s + v, 0);
  const remaining = required - knownTotal;
  const evenHalf = remaining / 2;
  const minThird = remaining - cap;

  const trapChoice = (problem.choices ?? []).find((c) => Number(c.text) === evenHalf);
  const agrees = problem.shortAnswer == null || Number(problem.shortAnswer) === minThird;

  const last = totalSteps - 1;
  const showKnown = step >= 1;
  const isTrapStep = step === 2;
  const showCap = step >= 3;
  const showSolve = step >= 4;
  const isFinal = step >= last;

  const W = 380;
  const H = 132;
  const chipY = 14;
  const chipW = 68;
  const chipH = 56;
  const chipGap = 12;
  const chipX0 = (W - (testCount * chipW + (testCount - 1) * chipGap)) / 2;
  const chipX = (i: number) => chipX0 + i * (chipW + chipGap);

  const barY = 96;
  const barH = 30;
  const barW = 300;
  const barX0 = (W - barW) / 2;
  const scale = barW / required;

  const seg1w = knownTotal > 0 ? known[0] * scale : 0;
  const seg2w = known.length > 1 ? known[1] * scale : 0;
  const seg4w = showCap ? cap * scale : isTrapStep ? evenHalf * scale : 0;
  const seg3w = showSolve ? minThird * scale : isTrapStep ? evenHalf * scale : showCap ? (remaining - cap) * scale : 0;
  const remainderStartX = barX0 + seg1w + seg2w;

  const seg3Fill = showSolve ? WIN : isTrapStep ? "#fde68a" : "#e2e8f0";
  const seg3Stroke = showSolve ? WIN : isTrapStep ? "#d97706" : "#cbd5e1";
  const seg4Fill = showCap ? "#fed7aa" : isTrapStep ? "#fde68a" : "#e2e8f0";
  const seg4Stroke = showCap ? CAP : isTrapStep ? "#d97706" : "#cbd5e1";

  const chip3Value = showSolve ? String(minThird) : isTrapStep ? String(evenHalf) : "?";
  const chip3Color = showSolve ? WIN : isTrapStep ? "#d97706" : DIM;
  const chip4Value = showCap ? String(cap) : isTrapStep ? String(evenHalf) : "?";
  const chip4Color = showCap ? CAP : isTrapStep ? "#d97706" : DIM;

  const caption = isFinal
    ? `test 3 = ${minThird}`
    : showSolve
    ? `${remaining} − ${cap} = ${minThird}`
    : showCap
    ? `cap test 4 at ${cap} to leave as little as possible for test 3`
    : isTrapStep
    ? `split evenly: ${remaining} ÷ 2 = ${evenHalf} each${trapChoice ? ` — matches choice ${trapChoice.label}, but not the lowest possible` : ""}`
    : showKnown
    ? `${known.join(" + ")} = ${knownTotal}, so ${required} − ${knownTotal} = ${remaining} is needed from tests 3 and 4`
    : `goal: average ${targetAverage} over ${testCount} tests`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        {Array.from({ length: testCount }).map((_, i) => {
          const x = chipX(i);
          if (i === 0 || i === 1) {
            return (
              <AnimatePresence key={i}>
                {showKnown && (
                  <motion.g key="p" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: i * 0.1 }}>
                    <Paper x={x} y={chipY} w={chipW} h={chipH} value={String(known[i])} color={MARK} />
                  </motion.g>
                )}
              </AnimatePresence>
            );
          }
          if (i === 2) {
            return <Paper key={i} x={x} y={chipY} w={chipW} h={chipH} value={chip3Value} color={chip3Color} ghost={isTrapStep} />;
          }
          return <Paper key={i} x={x} y={chipY} w={chipW} h={chipH} value={chip4Value} color={chip4Color} ghost={isTrapStep} />;
        })}

        <text x={W / 2} y={chipY - 2} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={FONT}>
          {testCount} tests, goal average {targetAverage}
        </text>

        <rect x={barX0} y={barY} width={barW} height={barH} rx={8} fill="none" stroke="#cbd5e1" strokeWidth={1.4} />

        <AnimatePresence>
          {showKnown && (
            <motion.g key="knownbar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={barX0} y={barY} width={seg1w} height={barH} rx={0} fill={`${MARK}22`} stroke={MARK} strokeWidth={1.2} />
              <rect x={barX0 + seg1w} y={barY} width={seg2w} height={barH} fill={`${MARK}33`} stroke={MARK} strokeWidth={1.2} />
              <text x={barX0 + seg1w / 2} y={barY + barH / 2 + 4} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={MARK} fontFamily={FONT}>
                {known[0]}
              </text>
              <text x={barX0 + seg1w + seg2w / 2} y={barY + barH / 2 + 4} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={MARK} fontFamily={FONT}>
                {known[1]}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <motion.rect
          x={remainderStartX}
          y={barY}
          width={seg3w}
          height={barH}
          animate={{ fill: seg3Fill, stroke: seg3Stroke, width: seg3w, x: remainderStartX }}
          strokeWidth={1.6}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
        <motion.rect
          x={remainderStartX + seg3w}
          y={barY}
          width={seg4w}
          height={barH}
          animate={{ fill: seg4Fill, stroke: seg4Stroke, width: seg4w, x: remainderStartX + seg3w }}
          strokeWidth={1.6}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
        <AnimatePresence>
          {(showCap || isTrapStep) && (
            <motion.g key="remlabels" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {seg3w > 14 && (
                <text x={remainderStartX + seg3w / 2} y={barY + barH / 2 + 4} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={seg3Stroke} fontFamily={FONT}>
                  {showSolve ? minThird : isTrapStep ? evenHalf : "?"}
                </text>
              )}
              {seg4w > 14 && (
                <text x={remainderStartX + seg3w + seg4w / 2} y={barY + barH / 2 + 4} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={seg4Stroke} fontFamily={FONT}>
                  {showCap ? cap : isTrapStep ? evenHalf : "?"}
                </text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isTrapStep && (
            <motion.line
              key="divider"
              x1={remainderStartX + seg3w}
              y1={barY - 6}
              x2={remainderStartX + seg3w}
              y2={barY + barH + 6}
              stroke="#d97706"
              strokeWidth={1.6}
              strokeDasharray="3 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </AnimatePresence>

        {!showKnown && (
          <rect x={barX0} y={barY} width={barW} height={barH} fill="#f8fafc" />
        )}

        <line x1={barX0 + barW} y1={barY - 8} x2={barX0 + barW} y2={barY + barH + 8} stroke={INK} strokeWidth={1.4} />
        <text x={barX0 + barW} y={barY - 12} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={FONT}>
          goal {required}
        </text>
      </svg>

      <motion.div
        key={caption}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontFamily: FONT,
          fontSize: 11,
          fontWeight: 800,
          color: showSolve ? WIN : showCap ? CAP : isTrapStep ? "#d97706" : MARK,
          textAlign: "center",
          maxWidth: 320,
        }}
      >
        {caption}
      </motion.div>

      <AnimatePresence>
        {isFinal && !agrees && (
          <motion.div
            key="warn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: FONT, fontSize: 9.5, fontWeight: 700, color: BAD, textAlign: "center", maxWidth: 320 }}
          >
            computed {minThird}, which does not match the stored answer
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
