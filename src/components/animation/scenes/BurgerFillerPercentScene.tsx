import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const NAVY = "#1f2a44";
const GREEN = "#16a34a";
const AMBER = "#b45309";
const AMBER_FILL = "#fde68a";
const MEAT = "#c2410c";
const MEAT_FILL = "#fdba74";

/** Greatest common divisor, used to reduce the leftover-over-total fraction. */
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// A burger's total mass splits into a filler part and a "not filler" part;
// the not-filler part is then read off as a percent of the whole burger.
// Data: { total, filler, unit }.
export function BurgerFillerPercentScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = num(data.total, 120);
  const filler = num(data.filler, 30);
  const unit = data.unit != null ? String(data.unit) : "g";
  const rest = total - filler;
  const g = gcd(rest, total) || 1;
  const numRed = rest / g;
  const denRed = total / g;
  const percent = Math.round((rest / total) * 100);

  const last = totalSteps - 1;
  const showSplit = step >= 1;
  const showFraction = step >= 2;
  const isFinal = step >= last;

  const barW = 260;
  const barH = 34;
  const barX = 20;
  const barY = 46;
  const fillerW = showSplit ? (filler / total) * barW : 0;
  const restW = showSplit ? (rest / total) * barW : barW;

  const pctBarW = 220;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox="0 0 300 90" width="100%" style={{ maxWidth: 300 }}>
        <ellipse cx={barX + barW / 2} cy={barY - 6} rx={barW / 2 + 4} ry={10} fill="#fbbf24" stroke={AMBER} strokeWidth={1.5} />
        {showSplit && (
          <motion.rect
            x={barX}
            y={barY}
            width={fillerW}
            height={barH}
            fill={AMBER_FILL}
            stroke={AMBER}
            strokeWidth={1.5}
            initial={{ width: 0 }}
            animate={{ width: fillerW }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
          />
        )}
        <motion.g initial={false} animate={{ x: showSplit ? fillerW : 0 }} transition={{ type: "spring", stiffness: 140, damping: 20 }}>
          <motion.rect
            x={barX}
            y={barY}
            height={barH}
            fill={MEAT_FILL}
            stroke={MEAT}
            strokeWidth={1.5}
            initial={{ width: barW }}
            animate={{ width: restW }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
          />
          <text x={barX + restW / 2} y={barY + barH / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={MEAT} fontFamily={FONT}>
            {rest}{unit}
          </text>
        </motion.g>
        <ellipse cx={barX + barW / 2} cy={barY + barH + 6} rx={barW / 2 + 4} ry={10} fill="#fde68a" stroke={AMBER} strokeWidth={1.5} />
        {showSplit && fillerW > 22 && (
          <motion.text
            x={barX + fillerW / 2}
            y={barY + barH / 2 + 4}
            textAnchor="middle"
            fontSize="10"
            fontWeight="800"
            fill={AMBER}
            fontFamily={FONT}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {filler}{unit}
          </motion.text>
        )}
      </svg>

      <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: NAVY, textAlign: "center" }}>
        {!showSplit
          ? `the burger weighs ${total}${unit} in total`
          : !showFraction
          ? `${total} − ${filler} = ${rest}${unit} is not filler`
          : `${rest}/${total} = ${numRed}/${denRed} = ${percent}%`}
      </motion.div>

      <AnimatePresence>
        {showFraction && (
          <motion.div key="pctbar" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "center", gap: 8, width: pctBarW + 40 }}>
            <svg viewBox={`0 0 ${pctBarW} 16`} width={pctBarW} height={16}>
              <rect x={0} y={0} width={pctBarW} height={16} rx={8} fill="#f1f5f9" />
              <motion.rect
                x={0}
                y={0}
                height={16}
                rx={8}
                fill={isFinal ? GREEN : MEAT}
                initial={{ width: 0 }}
                animate={{ width: (percent / 100) * pctBarW }}
                transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.15 }}
              />
            </svg>
            <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: isFinal ? GREEN : MEAT }}>{percent}%</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
