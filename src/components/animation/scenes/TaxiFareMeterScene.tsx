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

/**
 * A taxi's fare is flat for a starting stretch, then climbs at a fixed rate
 * per tenth-mile — a step then a ramp on a fare-vs-distance chart. The whole
 * problem is finding where that ramp crosses the money you actually have
 * left for miles (budget minus tip minus the flat charge), but the natural
 * slip is stopping at the ramp's own *length* — the extra miles the $5.60
 * buys — and forgetting the flat stretch you already rode for free before
 * the ramp even started.
 *
 * Everything is computed in integer cents and tenth-mile ticks so the
 * division comes out exact, then converted to dollars/miles only for
 * display; a self-check compares the computed total against the stored
 * answer.
 *
 * data: { baseFareCents, baseMiles, perTickCents, tickMiles, tipCents, budgetCents }
 */
export function TaxiFareMeterScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const baseFareCents = Math.round(num(data.baseFareCents, 240));
  const baseMiles = num(data.baseMiles, 0.5);
  const perTickCents = Math.round(num(data.perTickCents, 20));
  const tickMiles = num(data.tickMiles, 0.1);
  const tipCents = Math.round(num(data.tipCents, 200));
  const budgetCents = Math.round(num(data.budgetCents, 1000));

  const baseTicks = Math.round(baseMiles / tickMiles);
  const fareBudgetCents = budgetCents - tipCents;
  const extraBudgetCents = fareBudgetCents - baseFareCents;
  const extraTicks = perTickCents > 0 ? Math.floor(extraBudgetCents / perTickCents) : 0;
  const extraMiles = extraTicks * tickMiles;
  const totalMiles = baseMiles + extraMiles;

  const money = (c: number) => `$${(c / 100).toFixed(2)}`;
  const tidyMi = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(2))));
  const expected = tidyMi(Number(totalMiles.toFixed(2)));
  const ok = expected === (problem.shortAnswer ?? "").trim();

  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === Number(extraMiles.toFixed(2)) && String(c.label) !== problem.answer
  );

  // ---- beats: 0 base fare, 1 budget minus tip, 2 subtract base, 3 rate+ramp, 4 the trap, 5 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  // ---- geometry ----
  const W = 380;
  const H = 280;
  const PL = 54;
  const PR = 350;
  const PT = 26;
  const PB = 190;
  const xMax = Math.max(totalMiles + 0.5, 2);
  const yMax = Math.max(budgetCents / 100 + 1, 5);
  const sx = (mi: number) => PL + (mi / xMax) * (PR - PL);
  const sy = (dollars: number) => PB - (dollars / yMax) * (PB - PT);

  const flatPts = `${sx(0)},${sy(baseFareCents / 100)} ${sx(baseMiles)},${sy(baseFareCents / 100)}`;
  const rampPts = `${sx(baseMiles)},${sy(baseFareCents / 100)} ${sx(totalMiles)},${sy(fareBudgetCents / 100)}`;

  const caption =
    beat === 0
      ? `first ${tidyMi(baseMiles)} mi costs a flat ${money(baseFareCents)}`
      : beat === 1
      ? `${money(budgetCents)} − ${money(tipCents)} tip = ${money(fareBudgetCents)} for the fare`
      : beat === 2
      ? `${money(fareBudgetCents)} − ${money(baseFareCents)} = ${money(extraBudgetCents)} for extra miles`
      : beat === 3
      ? `${money(perTickCents)} per ${tidyMi(tickMiles)} mi = ${money(perTickCents * 10)} per mile → ${tidyMi(extraMiles)} extra miles`
      : beat === 4
      ? `${tidyMi(extraMiles)} mi — just the extra distance`
      : `${tidyMi(baseMiles)} + ${tidyMi(extraMiles)} = ${expected} mi`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        {/* axes */}
        {Array.from({ length: Math.floor(yMax / 2) + 1 }, (_, i) => i * 2).map((d) => (
          <g key={`y${d}`}>
            <line x1={PL} y1={sy(d)} x2={PR} y2={sy(d)} stroke={GRID} strokeWidth={1} />
            <text x={PL - 6} y={sy(d) + 3} textAnchor="end" fontSize="8" fontWeight="700" fill={DIM} fontFamily={FONT}>
              ${d}
            </text>
          </g>
        ))}
        {Array.from({ length: Math.floor(xMax) + 1 }, (_, i) => i).map((t) => (
          <g key={`x${t}`}>
            <line x1={sx(t)} y1={PT} x2={sx(t)} y2={PB} stroke={GRID} strokeWidth={1} />
            <text x={sx(t)} y={PB + 14} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM} fontFamily={FONT}>
              {t}
            </text>
          </g>
        ))}
        <line x1={PL} y1={PT} x2={PL} y2={PB} stroke={INK} strokeWidth={1.6} />
        <line x1={PL} y1={PB} x2={PR} y2={PB} stroke={INK} strokeWidth={1.6} />
        <text x={(PL + PR) / 2} y={PB + 28} textAnchor="middle" fontSize="9" fontWeight="700" fill={INK}>
          miles
        </text>
        <text x={16} y={(PT + PB) / 2} textAnchor="middle" fontSize="9" fontWeight="700" fill={INK} transform={`rotate(-90 16 ${(PT + PB) / 2})`}>
          fare
        </text>

        {/* the flat base-fare stretch */}
        <motion.polyline
          points={flatPts}
          fill="none"
          stroke={IND}
          strokeWidth={2.4}
          strokeLinecap="round"
          initial={beat === 0 ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7 }}
        />
        {beat === 0 && (
          <motion.text x={0} y={0} textAnchor="middle" fontSize="15" initial={{ x: sx(0), y: sy(baseFareCents / 100) - 10 }} animate={{ x: sx(baseMiles), y: sy(baseFareCents / 100) - 10 }} transition={{ duration: 0.7 }}>
            🚕
          </motion.text>
        )}

        {/* budget lines */}
        {beat >= 1 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <line x1={PL} y1={sy(budgetCents / 100)} x2={PR} y2={sy(budgetCents / 100)} stroke={DIM} strokeWidth={1.2} strokeDasharray="3 3" />
            <text x={PR} y={sy(budgetCents / 100) - 5} textAnchor="end" fontSize="8" fontWeight="800" fill={DIM} fontFamily={FONT}>
              {money(budgetCents)} total
            </text>
          </motion.g>
        )}
        {beat >= 2 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <line x1={PL} y1={sy(fareBudgetCents / 100)} x2={PR} y2={sy(fareBudgetCents / 100)} stroke={IND} strokeWidth={1.4} strokeDasharray="3 3" />
            <text x={PR} y={sy(fareBudgetCents / 100) - 5} textAnchor="end" fontSize="8" fontWeight="800" fill={IND} fontFamily={FONT}>
              {money(fareBudgetCents)} for the fare
            </text>
          </motion.g>
        )}
        {beat === 1 && (
          <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <path d={`M ${sx(baseMiles)},${sy(fareBudgetCents / 100)} L ${sx(baseMiles)},${sy(budgetCents / 100)}`} stroke={BAD} strokeWidth={1.6} />
            <text x={sx(baseMiles) + 8} y={(sy(fareBudgetCents / 100) + sy(budgetCents / 100)) / 2} fontSize="8.5" fontWeight="800" fill={BAD} fontFamily={FONT}>
              −{money(tipCents)} tip
            </text>
          </motion.g>
        )}

        {/* the bracket for the base fare, once we subtract it */}
        {beat === 2 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <path d={`M ${sx(baseMiles) + 6},${sy(0)} L ${sx(baseMiles) + 6},${sy(baseFareCents / 100)}`} stroke={DIM} strokeWidth={1.4} />
            <text x={sx(baseMiles) + 10} y={sy(baseFareCents / 200)} fontSize="8" fontWeight="700" fill={DIM} fontFamily={FONT}>
              {money(baseFareCents)} base
            </text>
            <path d={`M ${sx(baseMiles) + 20},${sy(baseFareCents / 100)} L ${sx(baseMiles) + 20},${sy(fareBudgetCents / 100)}`} stroke={IND} strokeWidth={1.6} />
            <text x={sx(baseMiles) + 24} y={(sy(baseFareCents / 100) + sy(fareBudgetCents / 100)) / 2} fontSize="8.5" fontWeight="800" fill={IND} fontFamily={FONT}>
              {money(extraBudgetCents)} left
            </text>
          </motion.g>
        )}

        {/* the ramp, filling to meet the fare budget */}
        {beat >= 3 && (
          <motion.polyline
            points={rampPts}
            fill="none"
            stroke={beat === 4 ? BAD : WIN}
            strokeWidth={2.6}
            strokeLinecap="round"
            initial={beat === 3 ? { pathLength: 0 } : false}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9 }}
          />
        )}
        {beat >= 3 && (
          <circle cx={sx(totalMiles)} cy={sy(fareBudgetCents / 100)} r={4.5} fill={beat === 4 ? BAD : WIN} stroke="#fff" strokeWidth={1.4} />
        )}

        {/* beat 4: the extra-miles length isolated and flagged */}
        {beat === 4 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <path d={`M ${sx(baseMiles)},${PB + 22} L ${sx(totalMiles)},${PB + 22}`} stroke={BAD} strokeWidth={1.6} />
            <path d={`M ${sx(baseMiles)},${PB + 18} L ${sx(baseMiles)},${PB + 26}`} stroke={BAD} strokeWidth={1.6} />
            <path d={`M ${sx(totalMiles)},${PB + 18} L ${sx(totalMiles)},${PB + 26}`} stroke={BAD} strokeWidth={1.6} />
            <text x={(sx(baseMiles) + sx(totalMiles)) / 2} y={PB + 38} textAnchor="middle" fontSize="10" fontWeight="800" fill={BAD} fontFamily={FONT}>
              {tidyMi(extraMiles)} mi extra ✗
            </text>
          </motion.g>
        )}

        {/* beat 5: the base stretch and the extra stretch, both counted */}
        {beat === 5 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <path d={`M ${sx(0)},${PB + 22} L ${sx(baseMiles)},${PB + 22}`} stroke={IND} strokeWidth={1.6} />
            <path d={`M ${sx(baseMiles)},${PB + 22} L ${sx(totalMiles)},${PB + 22}`} stroke={WIN} strokeWidth={1.6} />
            <text x={(sx(0) + sx(totalMiles)) / 2} y={PB + 38} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>
              {tidyMi(baseMiles)} + {tidyMi(extraMiles)} = {expected} mi
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
          color: isFinal ? "#166534" : beat === 4 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 4 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 4 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 4 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 270 }}>
            {trapChoice
              ? `choice ${trapChoice.label} (${tidyMi(extraMiles)}) forgets the free first ${tidyMi(baseMiles)} mile`
              : `this forgets the free first ${tidyMi(baseMiles)} mile already ridden`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${expected} but stored answer reads "${problem.shortAnswer}"`}
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
