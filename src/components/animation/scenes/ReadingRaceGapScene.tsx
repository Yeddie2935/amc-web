import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const ORANGE = "#f59e0b";
const BLUE = "#2563eb";
const DIM = "#94a3b8";

/**
 * Two readers finish the same book at different times; the gap between
 * finish lines, scaled by page count, is the answer — not either total alone.
 * Data: { pages: 760, bobRate: 45, chandraRate: 30 }.
 */
export function ReadingRaceGapScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const pages = num(data.pages, 760);
  const bobRate = num(data.bobRate, 45);
  const chandraRate = num(data.chandraRate, 30);

  const perPageDiff = bobRate - chandraRate;
  const bobTotal = pages * bobRate;
  const chandraTotal = pages * chandraRate;
  const totalDiff = bobTotal - chandraTotal;

  const isFinal = step >= totalSteps - 1;
  const showPerPage = step >= 1;
  const showTotal = step >= 2;

  const maxTime = bobTotal;
  const X0 = 70;
  const X1 = 250;
  const px = (t: number) => X0 + (t / maxTime) * (X1 - X0);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? `both read all ${pages} pages, at different speeds`
          : isFinal
            ? "the gap, not either total, is the answer"
            : showTotal
              ? "scale the per-page gap by the page count"
              : "find the per-page time difference"}
      </div>

      <svg viewBox="0 0 320 130" width="100%" style={{ maxWidth: 340 }}>
        <text x="10" y="34" fontSize="11" fontWeight="800" fill={ORANGE} fontFamily={FONT}>Bob</text>
        <line x1={X0} y1="30" x2={X1} y2="30" stroke="#f1f5f9" strokeWidth="10" />
        <motion.line x1={X0} y1="30" x2={X0} y2="30" stroke={ORANGE} strokeWidth="10" initial={{ x2: X0 }} animate={{ x2: px(bobTotal) }} transition={{ duration: 0.8 }} />
        <text x={px(bobTotal) + 6} y="34" fontSize="10" fontWeight="800" fill={ORANGE} fontFamily={FONT}>
          {bobRate}s/pg
        </text>

        <text x="10" y="74" fontSize="11" fontWeight="800" fill={BLUE} fontFamily={FONT}>Chandra</text>
        <line x1={X0} y1="70" x2={X1} y2="70" stroke="#f1f5f9" strokeWidth="10" />
        <motion.line x1={X0} y1="70" x2={X0} y2="70" stroke={BLUE} strokeWidth="10" initial={{ x2: X0 }} animate={{ x2: px(chandraTotal) }} transition={{ duration: 0.8 }} />
        <text x={px(chandraTotal) + 6} y="74" fontSize="10" fontWeight="800" fill={BLUE} fontFamily={FONT}>
          {chandraRate}s/pg
        </text>

        <AnimatePresence>
          {showTotal && (
            <motion.g key="gap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={px(chandraTotal)} y1="90" x2={px(bobTotal)} y2="90" stroke={IND} strokeWidth="2.4" />
              <line x1={px(chandraTotal)} y1="84" x2={px(chandraTotal)} y2="96" stroke={IND} strokeWidth="2.4" />
              <line x1={px(bobTotal)} y1="84" x2={px(bobTotal)} y2="96" stroke={IND} strokeWidth="2.4" />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 800, color: IND, fontFamily: FONT, marginTop: 2, minHeight: 36 }}>
        {showPerPage && !showTotal && `${bobRate} − ${chandraRate} = ${perPageDiff}s per page`}
        {showTotal && !isFinal && `${pages} × ${perPageDiff} = ${totalDiff}s`}
        {isFinal && (
          <>
            {totalDiff}s more for Bob
            <div style={{ fontSize: 10.5, fontWeight: 700, color: DIM, marginTop: 2 }}>
              (Chandra's own total, {chandraTotal}s, is a trap — that's choice E)
            </div>
          </>
        )}
      </div>

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 2 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
