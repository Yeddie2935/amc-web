import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const PLACE_NAMES = ["ten-thousands", "thousands", "hundreds", "tens", "ones"];

/**
 * Building the smallest number from a fixed digit set with an even-ones
 * constraint isn't just "save the smallest even digit for last" — reserving
 * a *larger* even digit can leave smaller digits free for the high-value
 * places and win overall, so the scene builds every valid ones-digit
 * candidate as a full number and compares them side by side rather than
 * asserting which wins, then reads the requested place off the true winner.
 * Data: { digits, targetPlace }.
 */
export function SmallestEvenDigitSlotScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const digits = (Array.isArray(data.digits) ? data.digits : [1, 2, 3, 4, 9]).map((d) => Math.round(Number(d)));
  const targetPlace = String(data.targetPlace ?? "tens");
  const targetIdx = Math.max(0, PLACE_NAMES.indexOf(targetPlace));

  const evens = Array.from(new Set(digits.filter((d) => d % 2 === 0))).sort((a, b) => a - b);
  const candidates = evens.map((e) => {
    const rest = digits.filter((d) => d !== e).sort((a, b) => a - b);
    const arr = [...rest, e];
    return { onesDigit: e, arr, value: Number(arr.join("")) };
  });
  const best = candidates.reduce((min, c) => (c.value < min.value ? c : min), candidates[0]);
  const worst = candidates.reduce((max, c) => (c.value > max.value ? c : max), candidates[0]);
  const number = best.arr;
  const answerOk = problem.shortAnswer == null || String(number[targetIdx]) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed digit ${number[targetIdx]}, stored answer is ${problem.shortAnswer}` : "";

  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(worst.onesDigit));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showCandidates = step >= 1;
  const showCompare = step === 2 && !isFinal;

  const W = 300;
  const H = 210;
  const cw = 34;

  const Row = ({ arr, y, highlight, dim }: { arr: number[]; y: number; highlight?: boolean; dim?: boolean }) => {
    const startX = (W - arr.length * cw) / 2;
    return (
      <g opacity={dim ? 0.35 : 1}>
        {arr.map((d, i) => {
          const isTarget = highlight && i === targetIdx;
          const x = startX + i * cw;
          return (
            <motion.g key={i} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 230, damping: 16, delay: i * 0.08 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={x} y={y} width={cw - 4} height={34} rx={5} fill={isTarget ? "#dcfce7" : d === arr[arr.length - 1] ? "#eef2ff" : "#f8fafc"} stroke={isTarget ? WIN : d === arr[arr.length - 1] ? IND : "#cbd5e1"} strokeWidth={isTarget ? 2.2 : 1.3} />
              <text x={x + (cw - 4) / 2} y={y + 23} textAnchor="middle" fontSize="15" fontWeight="800" fill={isTarget ? WIN : INK} fontFamily={numberFont}>
                {d}
              </text>
            </motion.g>
          );
        })}
      </g>
    );
  };

  const caption = isFinal
    ? `${number.join("")} — the ${targetPlace} digit is ${number[targetIdx]}`
    : showCompare
    ? trapChoice
      ? `saving the smaller even digit ${worst.onesDigit} gives ${worst.value}, bigger than ${best.value} — choice ${trapChoice.label} looks tempting but isn't the winning ones digit`
      : `saving ${worst.onesDigit} gives ${worst.value}, bigger than saving ${best.onesDigit} which gives ${best.value}`
    : showCandidates
    ? `try each even digit as the ones digit: ${candidates.map((c) => c.value).join(" vs ")}`
    : `ones place must be even: ${evens.join(" or ")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {!showCandidates && (
          <g>
            <text x={W / 2} y={26} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK}>
              digits available
            </text>
            <Row arr={digits} y={40} />
            <text x={W / 2} y={98} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM}>
              even digits: {evens.join(", ")} — one must end the number
            </text>
          </g>
        )}

        {showCandidates && !isFinal && (
          <g>
            {candidates.map((c, ci) => {
              const y = 20 + ci * 60;
              const isBest = c === best;
              return (
                <g key={ci}>
                  <text x={16} y={y - 4} fontSize="9.5" fontWeight="800" fill={showCompare ? (isBest ? WIN : BAD) : DIM} fontFamily={numberFont}>
                    ones = {c.onesDigit}
                  </text>
                  <Row arr={c.arr} y={y} dim={showCompare && !isBest} />
                  {showCompare && (
                    <text x={(W - c.arr.length * cw) / 2 + c.arr.length * cw + 6} y={y + 22} fontSize="12" fontWeight="800" fill={isBest ? WIN : BAD} fontFamily={numberFont}>
                      {c.value}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {isFinal && (
          <g>
            <text x={W / 2} y={26} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK}>
              the winning arrangement
            </text>
            <Row arr={number} y={44} highlight />
            <text x={W / 2} y={104} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM}>
              {PLACE_NAMES.map((p, i) => (i === targetIdx ? p.toUpperCase() : p)).join(" · ")}
            </text>
          </g>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : showCompare ? BAD : IND,
          background: isFinal ? "#dcfce7" : showCompare ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showCompare ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 300,
        }}
      >
        {caption}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
