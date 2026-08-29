import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const FISH = "#0ea5e9";
const MEDIAN_C = "#a855f7";
const MODE_C = "#f59e0b";
const MEAN_C = "#4338ca";

/** Median of a numeric list (average of the middle two when the count is even). */
function median(a: number[]): number {
  const s = [...a].sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
const fmt = (v: number) => (Number.isInteger(v) ? `${v}` : v.toFixed(2).replace(/0$/, ""));
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/**
 * Nine daily catch counts, compared by mean, median, and mode. The catches
 * are drawn as literal stacked fish per outing, sorted in place so the
 * median and mode can be read straight off the row, then the whole catch is
 * pooled and re-split to compute the mean.
 *
 * The real trap here is miscounting the sample size: averaging the two
 * *actual* middle values of a 9-outing list needs an odd-count read, and
 * dropping just one outing (treating it as 8) flips that into an average of
 * two middle values — which happens to land exactly on one of the wrong
 * answer choices, so the scene computes that slip from the real data (drop
 * the largest sorted value) rather than asserting it.
 *
 * data: { catches: number[] }
 */
export function FishCatchStatsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const catches = (Array.isArray(data.catches) ? data.catches : []).map((v) => num(v, 0));
  const n = catches.length;

  const sortedOrder = catches.map((_, i) => i).sort((a, b) => catches[a] - catches[b] || a - b);
  const sortedVals = sortedOrder.map((i) => catches[i]);
  const slotOf: number[] = [];
  sortedOrder.forEach((origIdx, slot) => (slotOf[origIdx] = slot));

  const sum = catches.reduce((a, b) => a + b, 0);
  const g = gcd(sum, n) || 1;
  const meanNum = sum / g;
  const meanDen = n / g;
  const mean = sum / n;

  const trueMedian = median(catches);
  const midSlot = (n - 1) / 2;

  // mode: the value with the highest count, ties broken by first occurrence
  const freq = new Map<number, number>();
  catches.forEach((v) => freq.set(v, (freq.get(v) ?? 0) + 1));
  let mode = catches[0];
  let modeCount = 0;
  for (const v of catches) {
    const c = freq.get(v) ?? 0;
    if (c > modeCount) {
      mode = v;
      modeCount = c;
    }
  }
  const modeSlots = sortedOrder.map((_, slot) => slot).filter((slot) => sortedVals[slot] === mode);

  // ---- the trap: drop the largest sorted value, miscounting n-1 outings ----
  const dropped = n - 1;
  const trapList = sortedVals.slice(0, dropped);
  const trapMedian = median(trapList);
  const trapOrderText = trapMedian < mean && mean < mode ? "median < mean < mode" : null;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === trapOrderText);

  const statOrder = [
    { label: "mean", v: mean },
    { label: "median", v: trueMedian },
    { label: "mode", v: mode },
  ].sort((a, b) => a.v - b.v);
  const expected = statOrder.map((s) => s.label).join(" < ");
  const ok = expected === (problem.shortAnswer ?? "").trim();

  // ---- beats: 0 setup, 1 sort, 2 median+mode, 3 the trap, 4 mean, 5 compare ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  // ---- geometry ----
  const W = 380;
  const H = 340;
  const colW = 28;
  const gap = 6;
  const totalW = n * colW + (n - 1) * gap;
  const startX = (W - totalW) / 2;
  const baselineY = 190;
  const fishH = 20;
  const homeX = (i: number) => startX + i * (colW + gap);
  const sortedX = (slot: number) => startX + slot * (colW + gap);
  const showSorted = beat >= 1;

  const caption =
    beat === 0
      ? `Tyler's catch over ${n} outings: ${catches.join(", ")}`
      : beat === 1
      ? `sorted: ${sortedVals.join(", ")}`
      : beat === 2
      ? `median = ${fmt(trueMedian)}, mode = ${fmt(mode)} (${modeCount} outings)`
      : beat === 3
      ? `dropping one outing gives median ${fmt(trapMedian)} — but there are really ${n}`
      : beat === 4
      ? `mean = ${sum}/${n} = ${meanDen === 1 ? meanNum : `${meanNum}/${meanDen}`} ≈ ${fmt(mean)}`
      : expected;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        <text x={W / 2} y={20} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>
          {beat === 0 ? "in order caught" : beat <= 3 ? "sorted by fish caught" : "the whole catch"}
        </text>

        <path d={`M ${startX - 8},${baselineY} L ${startX + totalW + 8},${baselineY}`} stroke={INK} strokeWidth={1.6} />

        {/* ---- beats 0-3: the nine outings, in order or sorted ---- */}
        {beat <= 3 &&
          catches.map((value, origIdx) => {
            const slot = slotOf[origIdx];
            const target = showSorted ? sortedX(slot) : homeX(origIdx);
            const dx = target - homeX(origIdx);
            const isModeCol = beat === 2 && modeSlots.includes(slot);
            const isMedianCol = beat === 2 && slot === midSlot;
            const isDroppedCol = beat === 3 && slot === n - 1;
            return (
              <motion.g
                key={`c${origIdx}`}
                initial={{ x: 0 }}
                animate={{ x: dx, opacity: isDroppedCol ? 0.3 : 1 }}
                transition={{ type: "spring", stiffness: 170, damping: 20, delay: showSorted ? 0.05 + slot * 0.04 : 0 }}
              >
                {(isModeCol || isMedianCol) && (
                  <rect x={homeX(origIdx) - 2} y={baselineY - value * fishH - 6} width={colW + 4} height={value * fishH + 10} rx={4} fill={isModeCol ? MODE_C : MEDIAN_C} opacity={0.16} />
                )}
                {Array.from({ length: value }).map((_, k) => (
                  <Fish key={k} cx={homeX(origIdx) + colW / 2} bottom={baselineY - k * fishH - 2} w={colW - 6} />
                ))}
                <text x={homeX(origIdx) + colW / 2} y={baselineY + 14} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={isDroppedCol ? BAD : INK} fontFamily={FONT}>
                  {value}
                </text>
                {beat === 0 && (
                  <text x={homeX(origIdx) + colW / 2} y={baselineY - value * fishH - 12} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM} fontFamily={FONT}>
                    #{origIdx + 1}
                  </text>
                )}
                {isDroppedCol && (
                  <text x={homeX(origIdx) + colW / 2} y={baselineY - 20} textAnchor="middle" fontSize="14" fontWeight="800" fill={BAD} fontFamily={FONT}>
                    ✗
                  </text>
                )}
              </motion.g>
            );
          })}

        {/* beat 2: median and mode brackets */}
        {beat === 2 && (
          <>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <path
                d={`M ${sortedX(midSlot)},${baselineY + 22} L ${sortedX(midSlot)},${baselineY + 28} L ${sortedX(midSlot) + colW},${baselineY + 28} L ${sortedX(midSlot) + colW},${baselineY + 22}`}
                fill="none"
                stroke={MEDIAN_C}
                strokeWidth={1.8}
              />
              <text x={sortedX(midSlot) + colW / 2} y={baselineY + 44} textAnchor="middle" fontSize="10" fontWeight="800" fill={MEDIAN_C} fontFamily={FONT}>
                median = {fmt(trueMedian)}
              </text>
            </motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <path
                d={`M ${sortedX(modeSlots[0])},${baselineY + 58} L ${sortedX(modeSlots[0])},${baselineY + 64} L ${sortedX(modeSlots[modeSlots.length - 1]) + colW},${baselineY + 64} L ${sortedX(modeSlots[modeSlots.length - 1]) + colW},${baselineY + 58}`}
                fill="none"
                stroke={MODE_C}
                strokeWidth={1.8}
              />
              <text x={(sortedX(modeSlots[0]) + sortedX(modeSlots[modeSlots.length - 1]) + colW) / 2} y={baselineY + 80} textAnchor="middle" fontSize="10" fontWeight="800" fill={MODE_C} fontFamily={FONT}>
                mode = {fmt(mode)} ({modeCount} outings)
              </text>
            </motion.g>
          </>
        )}

        {/* beat 3: the wrong median from dropping one outing */}
        {beat === 3 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <path
              d={`M ${sortedX(dropped / 2 - 1)},${baselineY + 22} L ${sortedX(dropped / 2 - 1)},${baselineY + 28} L ${sortedX(dropped / 2) + colW},${baselineY + 28} L ${sortedX(dropped / 2) + colW},${baselineY + 22}`}
              fill="none"
              stroke={BAD}
              strokeWidth={1.8}
            />
            <text x={(sortedX(dropped / 2 - 1) + sortedX(dropped / 2) + colW) / 2} y={baselineY + 44} textAnchor="middle" fontSize="10" fontWeight="800" fill={BAD} fontFamily={FONT}>
              wrong median = {fmt(trapMedian)}
            </text>
          </motion.g>
        )}

        {/* beat 4: pool the whole catch and split it back out */}
        {beat === 4 && (
          <g>
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              {Array.from({ length: sum }).map((_, i) => {
                const cols = 5;
                const cx = W / 2 - ((cols - 1) * 16) / 2 + (i % cols) * 16;
                const cy = 90 - Math.floor(i / cols) * 16;
                return <Fish key={i} cx={cx} bottom={cy} w={16} />;
              })}
            </motion.g>
            <motion.text x={W / 2} y={122} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              {sum} fish total
            </motion.text>
            <motion.text x={W / 2} y={148} textAnchor="middle" fontSize="12" fontWeight="800" fill={DIM} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
              ÷ {n} outings
            </motion.text>
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.6 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={W / 2 - 60} y={166} width={120} height={34} rx={10} fill="#eef2ff" stroke={MEAN_C} strokeWidth={1.6} />
              <text x={W / 2} y={188} textAnchor="middle" fontSize="15" fontWeight="800" fill={MEAN_C} fontFamily={FONT}>
                mean = {meanDen === 1 ? meanNum : `${meanNum}/${meanDen}`}
              </text>
            </motion.g>
          </g>
        )}

        {/* beat 5: mean, median, mode plotted on a number line */}
        {beat === 5 && (
          <g>
            {(() => {
              const lineX0 = 40;
              const lineX1 = 340;
              const maxV = Math.max(mode, trueMedian, mean) + 0.5;
              const px = (v: number) => lineX0 + (v / maxV) * (lineX1 - lineX0);
              const colorOf: Record<string, string> = { mean: MEAN_C, median: MEDIAN_C, mode: MODE_C };
              const points = statOrder.map((s) => ({ v: s.v, label: s.label, color: colorOf[s.label], sub: fmt(s.v) }));
              return (
                <>
                  <path d={`M ${lineX0},120 L ${lineX1},120`} stroke={INK} strokeWidth={1.6} />
                  {points.map((p, i) => (
                    <motion.g key={p.label} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.3 + i * 0.3 }}>
                      <circle cx={px(p.v)} cy={120} r={6} fill={p.color} stroke="#fff" strokeWidth={1.4} />
                      <text x={px(p.v)} y={i % 2 ? 92 : 104} textAnchor="middle" fontSize="10" fontWeight="800" fill={p.color} fontFamily={FONT}>
                        {p.label}
                      </text>
                      <text x={px(p.v)} y={i % 2 ? 152 : 140} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={p.color} fontFamily={FONT}>
                        {p.sub}
                      </text>
                    </motion.g>
                  ))}
                  <motion.text x={W / 2} y={180} textAnchor="middle" fontSize="14" fontWeight="800" fill={INK} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 15, delay: 1.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    {points.map((p) => p.label).join(" < ")}
                  </motion.text>
                </>
              );
            })()}
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
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 260 }}>
            {trapChoice ? `that wrong median gives choice ${trapChoice.label} (${trapOrderText})` : `miscounting the outings gives a wrong median`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed "${expected}" but stored answer reads "${problem.shortAnswer}"`}
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

/** A small side-on fish: body, tail, eye. */
function Fish({ cx, bottom, w }: { cx: number; bottom: number; w: number }) {
  const h = w * 0.62;
  const x = cx - w / 2;
  const y = bottom - h;
  return (
    <g>
      <ellipse cx={cx - w * 0.08} cy={y + h / 2} rx={w * 0.38} ry={h / 2} fill={FISH} />
      <path d={`M ${x},${y + h / 2} L ${x - w * 0.22},${y} L ${x - w * 0.22},${y + h} Z`} fill={FISH} />
      <circle cx={cx + w * 0.2} cy={y + h / 2 - h * 0.08} r={Math.max(1, w * 0.05)} fill="#fff" />
    </g>
  );
}
