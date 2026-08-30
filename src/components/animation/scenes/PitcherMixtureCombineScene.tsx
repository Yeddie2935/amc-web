import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const OJ = "#f59e0b";
const WATER = "#93c5fd";

function fracList(value: unknown): number[] {
  return Array.isArray(value) ? value.map((v) => Number(v)).filter((v) => Number.isFinite(v) && v > 0 && v <= 1) : [];
}
function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/**
 * Two pitchers, each filled to a different fraction with juice, then topped
 * up with water to the same capacity — the juice volumes are fixed by the
 * fractions, but the water volumes differ per pitcher, so only the juice
 * totals add cleanly. Five beats: (0) two empty pitchers; (1) the juice
 * poured to each fraction; (2) water tops each one off; (3) both poured
 * into one container, juice and water stacking separately; (4) the
 * simplified fraction and badge. Data: { pitcherSize, fractions: number[] }.
 */
export function PitcherMixtureCombineScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const pitcherSize = num(data.pitcherSize, 600);
  const fractions = fracList(data.fractions);
  const fractionLabels = strList(data.fractionLabels);
  if (pitcherSize <= 0 || fractions.length < 2) return null;

  const ojAmounts = fractions.map((f) => Math.round(pitcherSize * f));
  const waterAmounts = ojAmounts.map((oj) => pitcherSize - oj);
  const totalOJ = ojAmounts.reduce((a, b) => a + b, 0);
  const totalLiquid = pitcherSize * fractions.length;
  const g = gcd(totalOJ, totalLiquid) || 1;
  const simpNum = totalOJ / g;
  const simpDen = totalLiquid / g;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showOJ = step >= 1;
  const showWater = step >= 2;
  const showPour = step >= 3 || isFinal;

  const pitcherW = 56;
  const pitcherH = 110;
  const y0 = 14;
  const yBase = y0 + pitcherH;
  const gap = 40;
  const totalPitchersW = fractions.length * pitcherW + (fractions.length - 1) * gap;
  const x0 = (340 - totalPitchersW) / 2;
  const xOf = (i: number) => x0 + i * (pitcherW + gap);

  const barW = 280;
  const barX = (340 - barW) / 2;
  const barY = 168;
  const barH = 26;
  const ojBarW = (totalOJ / totalLiquid) * barW;

  const caption = isFinal
    ? `${totalOJ}/${totalLiquid} = ${simpNum}/${simpDen}`
    : step === 0
    ? `${fractions.length} pitchers, ${pitcherSize} mL each, filled to different fractions`
    : showPour
    ? `pour both into one container: ${totalOJ} mL juice in ${totalLiquid} mL total`
    : showWater
    ? `water fills the rest: ${waterAmounts.join(" mL, ")} mL`
    : `${pitcherSize} × ${fractionLabels.length ? fractionLabels.join(", ") : fractions.join(", ")} = ${ojAmounts.join(" mL, ")} mL juice`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox="0 0 340 210" width="100%" style={{ maxWidth: 380 }}>
        {fractions.map((f, i) => {
          const ojH = f * pitcherH;
          const x = xOf(i);
          return (
            <g key={i}>
              <rect x={x} y={y0} width={pitcherW} height={pitcherH} rx={6} fill="#fff" stroke={INK} strokeWidth={1.6} />
              <AnimatePresence>
                {showOJ && (
                  <motion.rect
                    key="oj"
                    x={x + 2}
                    width={pitcherW - 4}
                    fill={OJ}
                    initial={{ y: yBase - 2, height: 0 }}
                    animate={{ y: yBase - ojH, height: ojH - 2 }}
                    transition={{ type: "spring", stiffness: 90, damping: 18 }}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {showWater && !showPour && (
                  <motion.rect
                    key="water"
                    x={x + 2}
                    width={pitcherW - 4}
                    fill={WATER}
                    fillOpacity={0.6}
                    initial={{ y: yBase - ojH, height: 0 }}
                    animate={{ y: y0 + 2, height: pitcherH - ojH - 2 }}
                    transition={{ type: "spring", stiffness: 90, damping: 18 }}
                  />
                )}
              </AnimatePresence>
              <text x={x + pitcherW / 2} y={y0 - 4} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={FONT}>
                {fractionLabels[i] ?? f}
              </text>
              {showOJ && (
                <text x={x + pitcherW / 2} y={yBase - ojH / 2 + 4} textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#7c3400" fontFamily={FONT}>
                  {ojAmounts[i]}
                </text>
              )}
            </g>
          );
        })}

        <AnimatePresence>
          {showPour && (
            <motion.g key="pour" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {fractions.map((_, i) => (
                <motion.path
                  key={i}
                  d={`M ${xOf(i) + pitcherW / 2} ${yBase} Q ${170} ${150} ${barX + ojBarW / 2 + i * 20} ${barY}`}
                  fill="none"
                  stroke={OJ}
                  strokeWidth={1.6}
                  strokeDasharray="4 3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                />
              ))}
              <rect x={barX} y={barY} width={barW} height={barH} rx={6} fill="#fff" stroke={INK} strokeWidth={1.6} />
              <motion.rect
                x={barX + 1.5}
                y={barY + 1.5}
                height={barH - 3}
                fill={OJ}
                initial={{ width: 0 }}
                animate={{ width: ojBarW - 3 }}
                transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.4 }}
              />
              <motion.rect
                x={barX + ojBarW}
                y={barY + 1.5}
                height={barH - 3}
                fill={WATER}
                fillOpacity={0.6}
                initial={{ width: 0 }}
                animate={{ width: barW - ojBarW - 1.5 }}
                transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.55 }}
              />
              <text x={barX + barW / 2} y={barY + barH + 14} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={FONT}>
                {totalOJ} mL juice / {totalLiquid} mL total
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : INK,
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 320,
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {isFinal && problem.answer && (
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
