import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";

/**
 * Tests every digit 0-9 in the thousandths place of 2.00d5 against 2.0050
 * (2.005 padded to the same length), column by column.
 * Data: { extraDigit: 5 }.
 */
export function DecimalDigitCompareScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const extraDigit = num(data.extraDigit, 5);

  const isFinal = step >= totalSteps - 1;
  const showPad = step >= 1;
  const showTest = step >= 2;

  const passes = (d: number) => {
    if (d > 5) return true;
    if (d < 5) return false;
    return extraDigit > 0; // d === 5: tie, decided by the extra trailing digit
  };
  const winners = Array.from({ length: 10 }, (_, d) => d).filter(passes);

  // Decimal digit columns after the "2." prefix: tenths, hundredths, thousandths, ten-thousandths.
  const leftCols = ["0", "0", "d", String(extraDigit)];
  const rightCols = ["0", "0", "5", showPad ? "0" : ""];
  const colX = (i: number) => 90 + i * 26;

  const row = (label: string, cols: string[], y: number, labelColor: string) => (
    <g>
      <text x="20" y={y + 5} fontSize="14" fontWeight="900" fill={labelColor} fontFamily={FONT}>
        2.
      </text>
      {cols.map((ch, i) => (
        <text key={i} x={colX(i)} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="900" fill={i === 2 ? IND : labelColor} fontFamily={FONT}>
          {ch}
        </text>
      ))}
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "compare 2.00d5 with 2.005, place by place"
          : isFinal
            ? "count the digits that work"
            : showTest
              ? "test every digit 0-9 for d"
              : "line up the digits, ones to ten-thousandths"}
      </div>

      {!showTest && (
        <svg viewBox="0 0 220 60" width="100%" style={{ maxWidth: 240 }}>
          {row("left", leftCols, 20, INK)}
          {row("right", rightCols, 44, DIM)}
        </svg>
      )}

      {showTest && (
        <svg viewBox="0 0 320 90" width="100%" style={{ maxWidth: 340 }}>
          {Array.from({ length: 10 }, (_, d) => d).map((d, i) => {
            const win = passes(d);
            return (
              <motion.g key={d} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.06 * i }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <circle cx={26 + i * 30} cy="30" r="13" fill={win ? WIN : "#e2e8f0"} />
                <text x={26 + i * 30} y="35" textAnchor="middle" fontSize="13" fontWeight="900" fill={win ? "#fff" : DIM} fontFamily={FONT}>
                  {d}
                </text>
              </motion.g>
            );
          })}
          <text x="160" y="65" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} fontFamily={FONT}>
            green: 2.00d5 &gt; 2.005
          </text>
          {isFinal && (
            <text x="160" y="85" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>
              {winners.join(", ")} → {winners.length} values
            </text>
          )}
        </svg>
      )}

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 2 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
