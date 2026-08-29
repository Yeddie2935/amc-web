import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const GRID = "#e2e8f0";
const A_COLOR = "#1f2a44";
const B_COLOR = "#94a3b8";

/**
 * Two people's daily bar totals, asking for the average daily *gap* between
 * them. Some days the second person studied more, some days less, so the
 * real trap is summing only the days where the gap runs one direction and
 * dropping the days it runs the other way — which, on this exact data,
 * lands precisely on one of the wrong choices. The scene reads each day's
 * two bars straight off the real figure, derives every signed gap from
 * them, and only then averages across all five days, negatives included.
 *
 * data: { days: ["M","Tu",...], aValues:[...], bValues:[...], aLabel?, bLabel? }
 */
export function StudyGapAverageScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const days = (Array.isArray(data.days) ? data.days : []).map((v) => String(v));
  const aValues = (Array.isArray(data.aValues) ? data.aValues : []).map((v) => Math.round(num(v, 0)));
  const bValues = (Array.isArray(data.bValues) ? data.bValues : []).map((v) => Math.round(num(v, 0)));
  const aLabel = data.aLabel != null ? String(data.aLabel) : "A";
  const bLabel = data.bLabel != null ? String(data.bLabel) : "B";
  const n = Math.min(days.length, aValues.length, bValues.length);

  const diffs = Array.from({ length: n }, (_, i) => bValues[i] - aValues[i]);
  const sum = diffs.reduce((a, b) => a + b, 0);
  const avg = n > 0 ? sum / n : 0;
  const positiveOnlySum = diffs.filter((d) => d > 0).reduce((a, b) => a + b, 0);
  const positiveOnlyAvg = n > 0 ? positiveOnlySum / n : 0;

  const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(2))));
  const ok = tidy(avg) === (problem.shortAnswer ?? "").trim();
  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === positiveOnlyAvg && String(c.label) !== problem.answer
  );

  // ---- beats: 0 setup, 1 daily gaps, 2 the trap, 3 the real sum, 4 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 4));
  const isFinal = step >= last;

  // ---- geometry ----
  const W = 380;
  const H = 340;
  const PL = 40;
  const PR = 360;
  const PT = 26;
  const PB = 200;
  const yMax = Math.max(10, Math.ceil(Math.max(...aValues, ...bValues, 10) / 20) * 20 + 10);
  const sy = (v: number) => PB - (v / yMax) * (PB - PT);
  const groupW = (PR - PL) / n;
  const barW = groupW * 0.32;
  const gCx = (i: number) => PL + (i + 0.5) * groupW;

  const caption =
    beat === 0
      ? `${aLabel} vs ${bLabel}, ${n} days`
      : beat === 1
      ? `each day's gap: ${diffs.join(", ")}`
      : beat === 2
      ? `${diffs.filter((d) => d > 0).join("+")} = ${positiveOnlySum}, ÷ ${n} = ${tidy(positiveOnlyAvg)}`
      : beat === 3
      ? `${diffs.join(" + ")} = ${sum}`
      : `${sum} / ${n} = ${tidy(avg)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        {/* axes */}
        {Array.from({ length: Math.floor(yMax / 20) + 1 }, (_, i) => i * 20).map((v) => (
          <g key={v}>
            <line x1={PL} y1={sy(v)} x2={PR} y2={sy(v)} stroke={GRID} strokeWidth={1} />
            <text x={PL - 6} y={sy(v) + 3} textAnchor="end" fontSize="7.5" fontWeight="700" fill={DIM} fontFamily={FONT}>
              {v}
            </text>
          </g>
        ))}
        <line x1={PL} y1={PT} x2={PL} y2={PB} stroke={INK} strokeWidth={1.6} />
        <line x1={PL} y1={PB} x2={PR} y2={PB} stroke={INK} strokeWidth={1.6} />

        {/* the two bars per day */}
        {Array.from({ length: n }).map((_, i) => {
          const cx = gCx(i);
          const aH = PB - sy(aValues[i]);
          const bH = PB - sy(bValues[i]);
          return (
            <g key={i}>
              <motion.rect
                x={cx - barW - 2}
                width={barW}
                fill={A_COLOR}
                initial={{ y: PB, height: 0 }}
                animate={{ y: PB - aH, height: aH }}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.08 }}
              />
              <motion.rect
                x={cx + 2}
                width={barW}
                fill={B_COLOR}
                initial={{ y: PB, height: 0 }}
                animate={{ y: PB - bH, height: bH }}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 + i * 0.08 }}
              />
              <text x={cx} y={PB + 14} textAnchor="middle" fontSize="9" fontWeight="700" fill={INK} fontFamily={FONT}>
                {days[i]}
              </text>

              {/* the signed gap, once we're past setup */}
              {beat >= 1 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }}>
                  <path d={`M ${cx - barW - 2},${sy(Math.max(aValues[i], bValues[i])) - 6} L ${cx + barW + 2},${sy(Math.max(aValues[i], bValues[i])) - 6}`} stroke={DIM} strokeWidth={1} strokeDasharray="2 2" />
                  <rect
                    x={cx - 16}
                    y={sy(Math.max(aValues[i], bValues[i])) - 24}
                    width={32}
                    height={16}
                    rx={5}
                    fill={beat === 2 && diffs[i] <= 0 ? "#f1f5f9" : diffs[i] >= 0 ? "#dcfce7" : "#fee2e2"}
                    stroke={beat === 2 && diffs[i] <= 0 ? DIM : diffs[i] >= 0 ? WIN : BAD}
                    strokeWidth={1.4}
                    opacity={beat === 2 && diffs[i] <= 0 ? 0.5 : 1}
                  />
                  <text
                    x={cx}
                    y={sy(Math.max(aValues[i], bValues[i])) - 13}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="800"
                    fill={beat === 2 && diffs[i] <= 0 ? DIM : diffs[i] >= 0 ? WIN : BAD}
                    fontFamily={FONT}
                  >
                    {diffs[i] > 0 ? `+${diffs[i]}` : diffs[i]}
                  </text>
                </motion.g>
              )}
            </g>
          );
        })}

        {/* beat 3: the running signed sum, negatives included */}
        {beat === 3 &&
          (() => {
            const cum = diffs.reduce<number[]>((acc, d, i) => [...acc, (acc[i - 1] ?? 0) + d], []);
            const allVals = [0, ...cum];
            const minV = Math.min(...allVals);
            const maxV = Math.max(...allVals);
            const nlY = 250;
            const nlX0 = PL;
            const nlX1 = PR;
            const px = (v: number) => nlX0 + ((v - minV) / (maxV - minV || 1)) * (nlX1 - nlX0);
            return (
              <g>
                <line x1={nlX0} y1={nlY} x2={nlX1} y2={nlY} stroke={GRID} strokeWidth={2} />
                {cum.map((c, i) => {
                  const prev = i === 0 ? 0 : cum[i - 1];
                  const color = diffs[i] >= 0 ? WIN : BAD;
                  return (
                    <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.25 }}>
                      <line x1={px(prev)} y1={nlY} x2={px(c)} y2={nlY} stroke={color} strokeWidth={4} strokeLinecap="round" />
                      <circle cx={px(c)} cy={nlY} r={4} fill={color} stroke="#fff" strokeWidth={1.2} />
                      <text x={px(c)} y={nlY - 10} textAnchor="middle" fontSize="8" fontWeight="800" fill={color} fontFamily={FONT}>
                        {c}
                      </text>
                    </motion.g>
                  );
                })}
                <motion.text x={px(0)} y={nlY + 18} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  0
                </motion.text>
                <motion.text x={px(sum)} y={nlY + 18} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + n * 0.25 }}>
                  sum = {sum}
                </motion.text>
              </g>
            );
          })()}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : beat === 2 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 2 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 2 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 2 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 280 }}>
            {trapChoice
              ? `choice ${trapChoice.label} (${tidy(positiveOnlyAvg)}) drops the days ${aLabel} studied more`
              : `dropping the negative days isn't the real average`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${tidy(avg)} but stored answer reads "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
