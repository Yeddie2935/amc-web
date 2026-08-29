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
const BAR = "#94a3b8";

const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(1))));

/**
 * Ten months of gasoline prices on a bar graph, asking by what percent the
 * highest price exceeds the lowest. The real trap is which price the percent
 * is *of* — the increase is the same $7 either way, but dividing by the
 * higher price instead of the lower one gives a different, smaller percent,
 * so the scene computes that wrong-base version explicitly (even when it
 * doesn't land on a listed choice) before doing the increase the right way,
 * over the lower price.
 *
 * data: { prices: [17,14,10,12,12,13,11,16,14,11] }
 */
export function GasPriceBarScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const prices = (Array.isArray(data.prices) ? data.prices : []).map((v) => num(v, 0));
  const n = prices.length;

  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const maxIdx = prices.indexOf(maxPrice);
  const minIdx = prices.indexOf(minPrice);
  const increase = maxPrice - minPrice;
  const percent = (increase / minPrice) * 100;
  const trapPercent = (increase / maxPrice) * 100;

  const expected = tidy(Math.round(percent));
  const ok = expected === (problem.shortAnswer ?? "").trim();
  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === Math.round(trapPercent) && String(c.label) !== problem.answer
  );

  // ---- beats: 0 all bars, 1 the highest, 2 the lowest, 3 the trap base, 4 the increase, 5 the real percent ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  // ---- geometry ----
  const W = 380;
  const H = 280;
  const PL = 40;
  const PR = 360;
  const PT = 26;
  const PB = 190;
  const yMax = Math.ceil((maxPrice + 2) / 5) * 5;
  const sy = (v: number) => PB - (v / yMax) * (PB - PT);
  const barW = ((PR - PL) / n) * 0.6;
  const barGap = (PR - PL) / n;
  const barX = (i: number) => PL + i * barGap + (barGap - barW) / 2;

  const caption =
    beat === 0
      ? `10 months of gas prices`
      : beat === 1
      ? `highest: month ${maxIdx + 1}, $${tidy(maxPrice)}`
      : beat === 2
      ? `lowest: month ${minIdx + 1}, $${tidy(minPrice)}`
      : beat === 3
      ? `$${tidy(increase)} / $${tidy(maxPrice)} = ${tidy(trapPercent)}% — of the wrong price`
      : beat === 4
      ? `$${tidy(maxPrice)} − $${tidy(minPrice)} = $${tidy(increase)}`
      : `$${tidy(increase)} / $${tidy(minPrice)} = ${expected}%`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        {/* axes */}
        {Array.from({ length: yMax / 5 + 1 }, (_, i) => i * 5).map((v) => (
          <g key={v}>
            <line x1={PL} y1={sy(v)} x2={PR} y2={sy(v)} stroke={GRID} strokeWidth={1} />
            <text x={PL - 6} y={sy(v) + 3} textAnchor="end" fontSize="8" fontWeight="700" fill={DIM} fontFamily={FONT}>
              ${v}
            </text>
          </g>
        ))}
        <line x1={PL} y1={PT} x2={PL} y2={PB} stroke={INK} strokeWidth={1.6} />
        <line x1={PL} y1={PB} x2={PR} y2={PB} stroke={INK} strokeWidth={1.6} />
        <text x={(PL + PR) / 2} y={PB + 28} textAnchor="middle" fontSize="9" fontWeight="700" fill={INK}>
          month
        </text>

        {/* the ten bars */}
        {prices.map((p, i) => {
          const h = PB - sy(p);
          const isMax = i === maxIdx && beat >= 1;
          const isMin = i === minIdx && beat >= 2;
          const color = isMax ? WIN : isMin ? BAD : BAR;
          return (
            <g key={i}>
              <motion.rect
                x={barX(i)}
                width={barW}
                fill={color}
                fillOpacity={isMax || isMin ? 0.8 : 0.55}
                stroke={color}
                strokeWidth={isMax || isMin ? 2 : 1}
                initial={{ y: PB, height: 0 }}
                animate={{ y: PB - h, height: h }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.04 }}
              />
              <text x={barX(i) + barW / 2} y={PB + 14} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM} fontFamily={FONT}>
                {i + 1}
              </text>
              {(isMax || isMin) && beat <= 2 && (
                <motion.text x={barX(i) + barW / 2} y={PB - h - 6} textAnchor="middle" fontSize="9" fontWeight="800" fill={color} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  ${tidy(p)}
                </motion.text>
              )}
            </g>
          );
        })}

        {/* beat 3: the trap bracket, increase over the higher price */}
        {beat === 3 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <path d={`M ${barX(maxIdx) + barW + 6},${sy(minPrice)} L ${barX(maxIdx) + barW + 6},${sy(maxPrice)}`} stroke={BAD} strokeWidth={2} />
            <text x={barX(maxIdx) + barW + 10} y={(sy(minPrice) + sy(maxPrice)) / 2} fontSize="9" fontWeight="800" fill={BAD} fontFamily={FONT}>
              ${tidy(increase)}
            </text>
          </motion.g>
        )}

        {/* beat 4: the real increase bracket */}
        {beat === 4 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <path d={`M ${barX(maxIdx) + barW + 6},${sy(minPrice)} L ${barX(maxIdx) + barW + 6},${sy(maxPrice)}`} stroke={IND} strokeWidth={2} />
            <text x={barX(maxIdx) + barW + 10} y={(sy(minPrice) + sy(maxPrice)) / 2} fontSize="9" fontWeight="800" fill={IND} fontFamily={FONT}>
              ${tidy(increase)}
            </text>
          </motion.g>
        )}

        {/* beat 5: the real base bracket, over the lower price */}
        {beat === 5 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <path d={`M ${barX(minIdx) - 6},${sy(0)} L ${barX(minIdx) - 6},${sy(minPrice)}`} stroke={WIN} strokeWidth={2} />
            <text x={barX(minIdx) - 10} y={(sy(0) + sy(minPrice)) / 2} textAnchor="end" fontSize="9" fontWeight="800" fill={WIN} fontFamily={FONT}>
              ${tidy(minPrice)}
            </text>
          </motion.g>
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
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 270 }}>
            {trapChoice
              ? `choice ${trapChoice.label} (${Math.round(trapPercent)}%) divides by the higher price instead`
              : `"more than" means percent of the lower price, not the higher one`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${expected}% but stored answer reads "${problem.shortAnswer}"`}
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
