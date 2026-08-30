import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";

/**
 * A map's scale (km per cm) discovered by dividing the known segment, then
 * scaled up to a longer segment. Five beats: (0) the known segment and its
 * real distance; (1) the rate, built as one chip per centimeter summing to
 * the known distance; (2) the trap — the rate alone matches a choice but
 * isn't the answer; (3) the ruler stretched to the target length with new
 * chips added; (4) the total and the badge.
 * Data: { mapCm, realKm, targetCm }.
 */
export function MapScaleStretchScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const mapCm = Math.round(num(data.mapCm, 12));
  const realKm = num(data.realKm, 72);
  const targetCm = Math.round(num(data.targetCm, 17));
  if (mapCm <= 0 || targetCm <= mapCm || realKm <= 0) return null;

  const rate = realKm / mapCm;
  const targetKm = rate * targetCm;
  const rateTrap = (problem.choices ?? []).find((c) => c.text.trim() === String(rate));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showRate = step >= 1;
  const showTrap = step >= 2 && !isFinal;
  const showStretch = step >= 3 || isFinal;

  const pitch = 15;
  const x0 = 24;
  const rulerY = 78;
  const chipY = 36;
  const chipH = 15;
  const W = x0 + targetCm * pitch + 24;
  const H = 128;
  const cx = (cm: number) => x0 + cm * pitch;

  const caption = isFinal
    ? `${targetCm} × ${rate} = ${targetKm} km`
    : step === 0
    ? `${mapCm} cm on the map is ${realKm} km`
    : showTrap
    ? "scale that rate up to the full length"
    : `each centimeter is ${rate} km`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        <line x1={x0} y1={rulerY} x2={cx(targetCm)} y2={rulerY} stroke="#cbd5e1" strokeWidth={1.6} />
        {Array.from({ length: targetCm + 1 }).map((_, cm) => (
          <line
            key={cm}
            x1={cx(cm)}
            y1={rulerY - 5}
            x2={cx(cm)}
            y2={rulerY + 5}
            stroke={cm === 0 || cm === mapCm || cm === targetCm ? INK : "#cbd5e1"}
            strokeWidth={cm === 0 || cm === mapCm || cm === targetCm ? 1.8 : 1}
          />
        ))}
        <text x={cx(0)} y={rulerY + 18} textAnchor="middle" fontSize="9" fontWeight="700" fill={DIM} fontFamily={FONT}>
          0
        </text>
        <text x={cx(mapCm)} y={rulerY + 18} textAnchor="middle" fontSize="9" fontWeight="800" fill={INK} fontFamily={FONT}>
          {mapCm} cm
        </text>
        {showStretch && (
          <text x={cx(targetCm)} y={rulerY + 18} textAnchor="middle" fontSize="9" fontWeight="800" fill={MARK} fontFamily={FONT}>
            {targetCm} cm
          </text>
        )}
        <text x={(cx(0) + cx(mapCm)) / 2} y={rulerY + 32} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={FONT}>
          {realKm} km
        </text>

        <AnimatePresence>
          {showRate &&
            Array.from({ length: mapCm }).map((_, i) => (
              <motion.rect
                key={`r${i}`}
                x={cx(i) + 1.5}
                y={chipY}
                width={pitch - 3}
                height={chipH}
                rx={3}
                fill={`${MARK}18`}
                stroke={MARK}
                strokeWidth={1.1}
                initial={{ opacity: 0, y: chipY - 8, scale: 0.5 }}
                animate={{ opacity: 1, y: chipY, scale: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 16, delay: i * 0.04 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            ))}
        </AnimatePresence>

        {showStretch && (
          <>
            <line x1={cx(mapCm)} y1={rulerY} x2={cx(targetCm)} y2={rulerY} stroke={MARK} strokeWidth={2.2} strokeDasharray="4 3" />
            {Array.from({ length: targetCm - mapCm }).map((_, i) => (
              <motion.rect
                key={`s${i}`}
                x={cx(mapCm + i) + 1.5}
                y={chipY}
                width={pitch - 3}
                height={chipH}
                rx={3}
                fill={`${WIN}1f`}
                stroke={WIN}
                strokeWidth={1.1}
                initial={{ opacity: 0, y: chipY - 8, scale: 0.5 }}
                animate={{ opacity: 1, y: chipY, scale: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 16, delay: i * 0.09 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            ))}
          </>
        )}
      </svg>

      <AnimatePresence>
        {showTrap && (
          <motion.div
            key="trap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 700, color: "#b45309", textAlign: "center", maxWidth: 300 }}
          >
            {rate} km/cm is only the rate{rateTrap ? ` — choice ${rateTrap.label} traps you here` : ""}; the question asks for {targetCm} cm of real distance.
          </motion.div>
        )}
      </AnimatePresence>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : INK,
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {isFinal && answerOf(problem) && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
