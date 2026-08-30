import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const RED = "#dc2626";
const WIN = "#16a34a";
const DIM = "#94a3b8";

/**
 * A chain of fractions (k+1)/k telescopes: each denominator cancels the
 * previous numerator, leaving only the first denominator and last numerator.
 * Data: { start: 2, end: 2006 }.
 */
export function TelescopeCancelChainScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const start = num(data.start, 2);
  const end = num(data.end, 2006);
  const result = end / start;

  const isFinal = step >= totalSteps - 1;
  const showCancel = step >= 1;
  const showSurvivors = step >= 2;

  // Display terms: first three fractions, an ellipsis, and the last fraction.
  const terms = [
    { num: start + 1, den: start },
    { num: start + 2, den: start + 1 },
    { num: start + 3, den: start + 2 },
  ];
  const lastTerm = { num: end, den: end - 1 };

  const termX = [50, 130, 210, 290, 380];
  const fraction = (cx: number, top: number, bottom: number, opts?: { fadeNum?: boolean; fadeDen?: boolean; highlightNum?: boolean; highlightDen?: boolean }) => (
    <g>
      <text
        x={cx}
        y="52"
        textAnchor="middle"
        fontSize="15"
        fontWeight="800"
        fill={opts?.highlightNum ? WIN : opts?.fadeNum ? "#cbd5e1" : INK}
        fontFamily={FONT}
        textDecoration={opts?.fadeNum ? "line-through" : undefined}
      >
        {top}
      </text>
      <line x1={cx - 16} y1="60" x2={cx + 16} y2="60" stroke={INK} strokeWidth="1.6" />
      <text
        x={cx}
        y="78"
        textAnchor="middle"
        fontSize="15"
        fontWeight="800"
        fill={opts?.highlightDen ? WIN : opts?.fadeDen ? "#cbd5e1" : INK}
        fontFamily={FONT}
        textDecoration={opts?.fadeDen ? "line-through" : undefined}
      >
        {bottom}
      </text>
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "each term's numerator matches the next term's denominator"
          : isFinal
            ? "compute the surviving fraction"
            : showSurvivors
              ? "only the two endpoints are left"
              : "cancel every denominator with the numerator before it"}
      </div>

      <svg viewBox="0 0 430 100" width="100%" style={{ maxWidth: 460 }}>
        {fraction(termX[0], terms[0].num, terms[0].den, { fadeNum: showCancel && !showSurvivors, highlightDen: showSurvivors })}
        <text x="90" y="60" textAnchor="middle" fontSize="16" fontWeight="700" fill={DIM}>×</text>
        {fraction(termX[1], terms[1].num, terms[1].den, {
          fadeNum: showCancel && !showSurvivors,
          fadeDen: showCancel && !showSurvivors,
        })}
        <text x="170" y="60" textAnchor="middle" fontSize="16" fontWeight="700" fill={DIM}>×</text>
        {fraction(termX[2], terms[2].num, terms[2].den, {
          fadeNum: showCancel && !showSurvivors,
          fadeDen: showCancel && !showSurvivors,
        })}
        <text x="250" y="60" textAnchor="middle" fontSize="16" fontWeight="700" fill={DIM}>× ⋯ ×</text>
        {fraction(termX[4], lastTerm.num, lastTerm.den, { fadeDen: showCancel && !showSurvivors, highlightNum: showSurvivors })}
      </svg>

      <AnimatePresence>
        {showSurvivors && (
          <motion.div
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", fontSize: 15, fontWeight: 900, color: IND, fontFamily: FONT, marginTop: 6 }}
          >
            {lastTerm.num} / {start} = {result}
          </motion.div>
        )}
      </AnimatePresence>

      {isFinal && (
        <div style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: DIM, marginTop: 4 }}>
          picking {lastTerm.num} alone (choice E) forgets to divide by the leftover {start}
        </div>
      )}

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 6 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
