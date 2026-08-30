import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";

/**
 * A 3x3 survey table fills its two missing cells from row/column totals,
 * then the male-listener fraction converts to a percent.
 * Data: { totalListen: 136, femaleListen: 58, maleDontListen: 26, femaleTotal: 96, grandTotal: 200 }.
 */
export function SurveyTablePercentScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const totalListen = num(data.totalListen, 136);
  const femaleListen = num(data.femaleListen, 58);
  const maleDontListen = num(data.maleDontListen, 26);
  const femaleTotal = num(data.femaleTotal, 96);
  const grandTotal = num(data.grandTotal, 200);

  const maleListen = totalListen - femaleListen;
  const maleTotal = grandTotal - femaleTotal;
  const dontListenTotal = grandTotal - totalListen;
  const femaleDontListen = dontListenTotal - maleDontListen;
  const percent = Math.round((maleListen / maleTotal) * 100);

  const isFinal = step >= totalSteps - 1;
  const showMaleListen = step >= 1;
  const showMaleTotal = step >= 2;
  const showPercent = isFinal;

  const colX = [170, 250, 330];
  const rowY = [60, 90, 120];
  const cellW = 78;

  const cell = (col: number, row: number, value: string | number, opts?: { highlight?: boolean; dim?: boolean }) => (
    <text
      x={colX[col]}
      y={rowY[row] + 5}
      textAnchor="middle"
      fontSize="13"
      fontWeight={opts?.highlight ? 900 : 700}
      fill={opts?.highlight ? IND : opts?.dim ? DIM : INK}
      fontFamily={FONT}
    >
      {value}
    </text>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "the survey table (some cells missing)"
          : showPercent
            ? "convert the fraction to a percent"
            : showMaleTotal
              ? "males who listen ÷ males total"
              : "males who listen = total listen − females who listen"}
      </div>

      <svg viewBox="0 0 400 150" width="100%" style={{ maxWidth: 400 }}>
        <line x1="60" y1="40" x2="370" y2="40" stroke={INK} strokeWidth="1.6" />
        <line x1="60" y1="75" x2="370" y2="75" stroke="#cbd5e1" strokeWidth="1.2" />
        <line x1="60" y1="105" x2="370" y2="105" stroke="#cbd5e1" strokeWidth="1.2" />
        <line x1="60" y1="135" x2="370" y2="135" stroke={INK} strokeWidth="1.6" />
        <line x1="130" y1="20" x2="130" y2="135" stroke="#cbd5e1" strokeWidth="1.2" />
        <line x1="210" y1="20" x2="210" y2="135" stroke="#cbd5e1" strokeWidth="1.2" />
        <line x1="290" y1="20" x2="290" y2="135" stroke={INK} strokeWidth="1.6" />

        <text x={colX[0]} y="34" textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>Listen</text>
        <text x={colX[1]} y="34" textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>Don't Listen</text>
        <text x={colX[2]} y="34" textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>Total</text>
        <text x="95" y={rowY[0] + 5} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>Males</text>
        <text x="95" y={rowY[1] + 5} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>Females</text>
        <text x="95" y={rowY[2] + 5} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>Total</text>

        {showMaleListen ? (
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {cell(0, 0, maleListen, { highlight: true })}
          </motion.g>
        ) : (
          cell(0, 0, "?", { dim: true })
        )}
        {cell(0, 1, femaleListen)}
        {cell(0, 2, totalListen)}

        {cell(1, 0, maleDontListen)}
        {cell(1, 1, femaleDontListen, { dim: !showMaleTotal })}
        {cell(1, 2, dontListenTotal)}

        {showMaleTotal ? (
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {cell(2, 0, maleTotal, { highlight: true })}
          </motion.g>
        ) : (
          cell(2, 0, "?", { dim: true })
        )}
        {cell(2, 1, femaleTotal)}
        {cell(2, 2, grandTotal)}
      </svg>

      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 800, color: IND, fontFamily: FONT, marginTop: 4, minHeight: 18 }}>
        {step === 0 && ` `}
        {step === 1 && `${totalListen} − ${femaleListen} = ${maleListen}`}
        {step === 2 && `${maleListen} + ${maleDontListen} = ${maleTotal}`}
        {showPercent && `${maleListen}/${maleTotal} = ${percent}%`}
      </div>

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 4 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
