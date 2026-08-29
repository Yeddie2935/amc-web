import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const CAR = "#4338ca";
const MOTO = "#d97706";

/**
 * A population where everyone owns at least one of two vehicle types, and
 * the two ownership counts overshoot the population — classic
 * inclusion-exclusion, but with a population too large (351) to draw as
 * individual dots. Instead of a person-by-person Venn, one population bar
 * gets two translucent ownership bands laid over it: a car band anchored at
 * the left covering 331 of the 351 slots, a motorcycle band anchored at the
 * right covering 45. Because every slot is owned by at least one group, the
 * two bands are forced to overlap by exactly the inclusion-exclusion amount
 * — the overlap isn't drawn in, it falls out of where the bands land.
 *
 * The real trap: the overlap (25) is itself sitting on the answer list as a
 * distractor for a solver who stops one step early, so the scene flags it by
 * name before doing the final subtraction the question actually asks for.
 *
 * data: { total, carCount, motoCount, neither? }
 */
export function VehicleOverlapScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = Math.max(1, Math.round(num(data.total, 1)));
  const carCount = Math.round(num(data.carCount, 0));
  const motoCount = Math.round(num(data.motoCount, 0));
  const neither = Math.max(0, Math.round(num(data.neither, 0)));

  const union = total - neither;
  const both = carCount + motoCount - union;
  const carOnly = carCount - both;
  const motoOnly = motoCount - both;

  const partsOk = carOnly + both + motoOnly + neither === total;
  const expected = carOnly;
  const ok = String(expected) === (problem.shortAnswer ?? "").trim();

  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === both && String(c.label) !== problem.answer
  );

  // ---- beats: 0 setup, 1 car band, 2 moto band, 3 compute overlap, 4 the trap, 5 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  // ---- geometry ----
  const W = 380;
  const H = 280;
  const barX = 20;
  const barW = 340;
  const barY = 110;
  const barH = 50;
  const scale = barW / total;
  const carW = carCount * scale;
  const motoW = motoCount * scale;
  const motoX = barX + barW - motoW;
  const overlapX0 = motoX;
  const overlapX1 = barX + carW;
  const overlapW = Math.max(0, overlapX1 - overlapX0);
  const carOnlyCx = barX + (carW - overlapW) / 2;
  const motoOnlyCx = overlapX1 + (barX + barW - overlapX1) / 2;
  const overlapCx = (overlapX0 + overlapX1) / 2;

  const caption =
    beat === 0
      ? `${total} adults — everyone owns a car, a motorcycle, or both`
      : beat === 1
      ? `${carCount} own a car`
      : beat === 2
      ? `${motoCount} own a motorcycle`
      : beat === 3
      ? `${carCount} + ${motoCount} − ${total} = ${both}`
      : beat === 4
      ? `${both} own both — but that's not what's asked`
      : `${carCount} − ${both} = ${carOnly}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        <text x={W / 2} y={20} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>
          {total} adults
        </text>

        {/* the population track, always visible */}
        <rect x={barX} y={barY} width={barW} height={barH} rx={6} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1.4} />

        {/* the car band, growing in from the left */}
        {beat >= 1 && (
          <motion.rect
            x={barX}
            y={barY}
            height={barH}
            rx={6}
            fill={CAR}
            fillOpacity={0.55}
            initial={{ width: 0 }}
            animate={{ width: carW }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          />
        )}

        {/* the motorcycle band, growing in from the right */}
        {beat >= 2 && (
          <motion.rect
            y={barY}
            height={barH}
            rx={6}
            fill={MOTO}
            fillOpacity={0.55}
            initial={{ x: barX + barW, width: 0 }}
            animate={{ x: motoX, width: motoW }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          />
        )}

        {/* boundary markers once both bands are in */}
        {beat >= 2 && (
          <>
            <path d={`M ${overlapX0},${barY - 10} L ${overlapX0},${barY + barH + 10}`} stroke={INK} strokeWidth={1.2} strokeDasharray="3 3" />
            <path d={`M ${overlapX1},${barY - 10} L ${overlapX1},${barY + barH + 10}`} stroke={INK} strokeWidth={1.2} strokeDasharray="3 3" />
          </>
        )}

        {/* region icons and labels once the layout has settled */}
        {beat >= 2 && (
          <>
            <Car cx={carOnlyCx} bottom={barY - 6} w={34} />
            <text x={carOnlyCx} y={barY + barH + 22} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={CAR} fontFamily={FONT}>
              cars only
            </text>
            <Motorcycle cx={motoOnlyCx} bottom={barY - 6} w={30} />
            <text x={motoOnlyCx} y={barY + barH + 22} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={MOTO} fontFamily={FONT}>
              motos only
            </text>
          </>
        )}

        {/* the overlap, called out from beat 3 on */}
        {beat >= 3 && (
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={overlapCx - 42} y={beat === 4 ? barY - 36 : barY + barH + 30} width={84} height={24} rx={8} fill={beat === 4 ? BAD : INK} />
            <text x={overlapCx} y={(beat === 4 ? barY - 36 : barY + barH + 30) + 16} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily={FONT}>
              {beat === 4 ? "✗ both" : `both = ${both}`}
            </text>
          </motion.g>
        )}

        {/* beat 1: the uncovered gap, before the motorcycle band explains it */}
        {beat === 1 && carW < barW && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <path d={`M ${barX + carW + (barW - carW) / 2},${barY + barH + 14} L ${barX + carW + (barW - carW) / 2},${barY + barH + 2}`} stroke={DIM} strokeWidth={1.4} />
          </motion.g>
        )}

        {/* beat 5: the final subtraction, landing on car-only */}
        {beat === 5 && (
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.4 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={carOnlyCx - 30} y={barY - 36} width={60} height={24} rx={8} fill={WIN} />
            <text x={carOnlyCx} y={barY - 20} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily={FONT}>
              = {carOnly}
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
        {beat === 1 && carW < barW && (
          <motion.span key="gap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center" }}>
            the gap on the right isn't covered yet
          </motion.span>
        )}
        {beat === 4 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 270 }}>
            {trapChoice
              ? `choice ${trapChoice.label} (${both}) is the overlap — the question asks for cars without a motorcycle`
              : `the overlap alone isn't the answer — the question asks for cars without a motorcycle`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {!partsOk
              ? `check failed: ${carOnly} + ${both} + ${motoOnly} + ${neither} ≠ ${total}`
              : `check failed: computed ${expected} but stored answer reads "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A simple side-on car: body, roof, two wheels. */
function Car({ cx, bottom, w }: { cx: number; bottom: number; w: number }) {
  const h = w * 0.42;
  const x = cx - w / 2;
  const y = bottom - h;
  return (
    <g>
      <path d={`M ${x + w * 0.12},${y + h * 0.55} L ${x + w * 0.28},${y + h * 0.1} L ${x + w * 0.72},${y + h * 0.1} L ${x + w * 0.88},${y + h * 0.55} Z`} fill={CAR} />
      <rect x={x} y={y + h * 0.45} width={w} height={h * 0.4} rx={h * 0.15} fill={CAR} />
      <circle cx={x + w * 0.24} cy={bottom} r={h * 0.22} fill={INK} />
      <circle cx={x + w * 0.76} cy={bottom} r={h * 0.22} fill={INK} />
    </g>
  );
}

/** A simple side-on motorcycle: two wheels, a frame, a seat. */
function Motorcycle({ cx, bottom, w }: { cx: number; bottom: number; w: number }) {
  const h = w * 0.5;
  const x = cx - w / 2;
  const y = bottom - h;
  return (
    <g>
      <circle cx={x + w * 0.18} cy={bottom} r={h * 0.28} fill="none" stroke={MOTO} strokeWidth={2.4} />
      <circle cx={x + w * 0.82} cy={bottom} r={h * 0.28} fill="none" stroke={MOTO} strokeWidth={2.4} />
      <path d={`M ${x + w * 0.18},${bottom} L ${x + w * 0.45},${y + h * 0.35} L ${x + w * 0.82},${bottom}`} stroke={MOTO} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M ${x + w * 0.45},${y + h * 0.35} L ${x + w * 0.6},${y}`} stroke={MOTO} strokeWidth={2.4} strokeLinecap="round" />
      <rect x={x + w * 0.3} y={y + h * 0.28} width={w * 0.24} height={h * 0.16} rx={h * 0.06} fill={MOTO} />
    </g>
  );
}
