import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const MEDIAN_C = "#a855f7";
const MODE_C = "#f59e0b";
const MEAN_C = "#4338ca";

function median(a: number[]): number {
  const s = [...a].sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1).replace(/0$/, ""));

/**
 * A short list of numbers, asked for the sum of its mean, median, and mode.
 * The real trap is the median: reading it off the *unsorted* list's middle
 * two positions gives a different value than the true sorted median, and on
 * this exact data that slip lands the sum precisely on a wrong choice. The
 * scene draws each number as a tile in its original position, physically
 * slides them into sorted order, and only then brackets the true middle —
 * so the sort step is a visible, checkable event, not an assumed one.
 *
 * data: { values: [2,3,0,3,1,4,0,3] }
 */
export function NumberListStatsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const values = (Array.isArray(data.values) ? data.values : []).map((v) => num(v, 0));
  const n = values.length;

  const sortedOrder = values.map((_, i) => i).sort((a, b) => values[a] - values[b] || a - b);
  const sortedVals = sortedOrder.map((i) => values[i]);
  const slotOf: number[] = [];
  sortedOrder.forEach((origIdx, slot) => (slotOf[origIdx] = slot));

  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const trueMedian = median(values);
  const midSlotA = n / 2 - 1;
  const midSlotB = n / 2;

  const freq = new Map<number, number>();
  values.forEach((v) => freq.set(v, (freq.get(v) ?? 0) + 1));
  let mode = values[0];
  let modeCount = 0;
  for (const v of values) {
    const c = freq.get(v) ?? 0;
    if (c > modeCount) {
      mode = v;
      modeCount = c;
    }
  }
  const modeSlots = sortedVals.map((v, slot) => slot).filter((slot) => sortedVals[slot] === mode);

  // ---- the trap: median read from the unsorted list's own middle two positions ----
  const trapMedian = n % 2 === 0 ? (values[n / 2 - 1] + values[n / 2]) / 2 : values[(n - 1) / 2];
  const trapSum = mode + trapMedian + mean;
  const trapChoice = (problem.choices ?? []).find((c) => Number(String(c.text).replace(/[^\d.-]/g, "")) === trapSum && String(c.label) !== problem.answer);

  const total = mode + trueMedian + mean;
  const ok = fmt(total) === (problem.shortAnswer ?? "").trim();

  // ---- beats: 0 raw list, 1 sort, 2 median+mode, 3 the trap, 4 mean, 5 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;
  const showSorted = beat >= 1;

  // ---- geometry ----
  const W = 380;
  const H = 300;
  const tileW = 34;
  const gap = 8;
  const totalW = n * tileW + (n - 1) * gap;
  const startX = (W - totalW) / 2;
  const tileY = 60;
  const tileH = 34;
  const homeX = (i: number) => startX + i * (tileW + gap);
  const sortedX = (slot: number) => startX + slot * (tileW + gap);

  const caption =
    beat === 0
      ? `${values.join(", ")}`
      : beat === 1
      ? `sorted: ${sortedVals.join(", ")}`
      : beat === 2
      ? `median = ${fmt(trueMedian)}, mode = ${fmt(mode)}`
      : beat === 3
      ? `unsorted middle: (${values[n / 2 - 1]}+${values[n / 2]})/2 = ${fmt(trapMedian)}`
      : beat === 4
      ? `mean = ${sum}/${n} = ${fmt(mean)}`
      : `${fmt(mode)} + ${fmt(trueMedian)} + ${fmt(mean)} = ${fmt(total)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        {beat <= 3 &&
          values.map((v, origIdx) => {
            const slot = slotOf[origIdx];
            const target = showSorted ? sortedX(slot) : homeX(origIdx);
            const dx = target - homeX(origIdx);
            const isModeTile = beat === 2 && modeSlots.includes(slot);
            const isMedianTile = beat === 2 && (slot === midSlotA || slot === midSlotB);
            const isTrapTile = beat === 3 && (origIdx === n / 2 - 1 || origIdx === n / 2);
            const fill = isModeTile ? "#fef3c7" : isMedianTile ? "#f3e8ff" : isTrapTile ? "#fee2e2" : "#eef2ff";
            const stroke = isModeTile ? MODE_C : isMedianTile ? MEDIAN_C : isTrapTile ? BAD : IND;
            return (
              <motion.g
                key={origIdx}
                initial={{ x: 0 }}
                animate={{ x: dx }}
                transition={{ type: "spring", stiffness: 170, damping: 20, delay: showSorted ? 0.05 + slot * 0.05 : 0 }}
              >
                <rect x={homeX(origIdx)} y={tileY} width={tileW} height={tileH} rx={7} fill={fill} stroke={stroke} strokeWidth={isModeTile || isMedianTile || isTrapTile ? 2.2 : 1.4} />
                <text x={homeX(origIdx) + tileW / 2} y={tileY + tileH / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={stroke === IND ? INK : stroke} fontFamily={FONT}>
                  {v}
                </text>
                {beat === 0 && (
                  <text x={homeX(origIdx) + tileW / 2} y={tileY - 8} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM} fontFamily={FONT}>
                    #{origIdx + 1}
                  </text>
                )}
              </motion.g>
            );
          })}

        {/* beat 2: median and mode brackets */}
        {beat === 2 && (
          <>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <path d={`M ${sortedX(midSlotA)},${tileY + tileH + 10} L ${sortedX(midSlotA)},${tileY + tileH + 16} L ${sortedX(midSlotB) + tileW},${tileY + tileH + 16} L ${sortedX(midSlotB) + tileW},${tileY + tileH + 10}`} fill="none" stroke={MEDIAN_C} strokeWidth={1.8} />
              <text x={(sortedX(midSlotA) + sortedX(midSlotB) + tileW) / 2} y={tileY + tileH + 34} textAnchor="middle" fontSize="10" fontWeight="800" fill={MEDIAN_C} fontFamily={FONT}>
                median = {fmt(trueMedian)}
              </text>
            </motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <path d={`M ${sortedX(modeSlots[0])},${tileY + tileH + 50} L ${sortedX(modeSlots[0])},${tileY + tileH + 56} L ${sortedX(modeSlots[modeSlots.length - 1]) + tileW},${tileY + tileH + 56} L ${sortedX(modeSlots[modeSlots.length - 1]) + tileW},${tileY + tileH + 50}`} fill="none" stroke={MODE_C} strokeWidth={1.8} />
              <text x={(sortedX(modeSlots[0]) + sortedX(modeSlots[modeSlots.length - 1]) + tileW) / 2} y={tileY + tileH + 74} textAnchor="middle" fontSize="10" fontWeight="800" fill={MODE_C} fontFamily={FONT}>
                mode = {fmt(mode)} ({modeCount}×)
              </text>
            </motion.g>
          </>
        )}

        {/* beat 3: the wrong median from the unsorted middle */}
        {beat === 3 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <path d={`M ${homeX(n / 2 - 1)},${tileY + tileH + 10} L ${homeX(n / 2 - 1)},${tileY + tileH + 16} L ${homeX(n / 2) + tileW},${tileY + tileH + 16} L ${homeX(n / 2) + tileW},${tileY + tileH + 10}`} fill="none" stroke={BAD} strokeWidth={1.8} />
            <text x={(homeX(n / 2 - 1) + homeX(n / 2) + tileW) / 2} y={tileY + tileH + 34} textAnchor="middle" fontSize="10" fontWeight="800" fill={BAD} fontFamily={FONT}>
              wrong median = {fmt(trapMedian)}
            </text>
          </motion.g>
        )}

        {/* beat 4: pool all values and split by n */}
        {beat === 4 && (
          <g>
            <text x={W / 2} y={40} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={FONT}>
              {values.join(" + ")} = {sum}
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <rect x={W / 2 - 66} y={90} width={132} height={36} rx={10} fill="#eef2ff" stroke={MEAN_C} strokeWidth={1.6} />
              <text x={W / 2} y={113} textAnchor="middle" fontSize="14" fontWeight="800" fill={MEAN_C} fontFamily={FONT}>
                {sum} / {n} = {fmt(mean)}
              </text>
            </motion.g>
          </g>
        )}

        {/* beat 5: the three stats added */}
        {beat === 5 && (
          <g>
            {[
              { label: "mode", v: mode, color: MODE_C },
              { label: "median", v: trueMedian, color: MEDIAN_C },
              { label: "mean", v: mean, color: MEAN_C },
            ].map((s, i) => (
              <motion.g key={s.label} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: i * 0.2 }}>
                <rect x={40 + i * 106} y={60} width={90} height={44} rx={10} fill="#fff" stroke={s.color} strokeWidth={1.8} />
                <text x={85 + i * 106} y={78} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={s.color} fontFamily={FONT}>
                  {s.label}
                </text>
                <text x={85 + i * 106} y={96} textAnchor="middle" fontSize="14" fontWeight="800" fill={s.color} fontFamily={FONT}>
                  {fmt(s.v)}
                </text>
              </motion.g>
            ))}
            <motion.text x={W / 2} y={148} textAnchor="middle" fontSize="15" fontWeight="800" fill={isFinal ? WIN : INK} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.7 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              {fmt(mode)} + {fmt(trueMedian)} + {fmt(mean)} = {fmt(total)}
            </motion.text>
          </g>
        )}
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
          color: isFinal ? "#166534" : beat === 3 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 3 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 3 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 3 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 270 }}>
            {trapChoice ? `that gives choice ${trapChoice.label} (${fmt(trapSum)}) — but the list has to be sorted first` : `the list must be sorted before finding the median`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${fmt(total)} but stored answer reads "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
