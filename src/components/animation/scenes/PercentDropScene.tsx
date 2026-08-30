import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const AMBER = "#b45309";

/**
 * A price bar that shrinks from the old cost to the new cost, with a
 * bracket calling out the raw drop — then a separate 0-100% strip fills to
 * the actual percent decrease. A beat is spent on the trap of mistaking the
 * raw cents dropped for the percent itself.
 * Data: { before, after }.
 */
export function PercentDropScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const before = Math.max(1, num(data.before, 41));
  const after = Math.max(0, num(data.after, 7));

  const drop = before - after;
  const pctExact = (drop / before) * 100;
  const pctRounded = Math.round(pctExact / 10) * 10;

  const matches = problem.shortAnswer == null || String(pctRounded) === String(problem.shortAnswer);
  const failure = !matches ? `check failed: round(${pctExact.toFixed(1)}%) = ${pctRounded}, stored answer is ${problem.shortAnswer}` : "";

  const trapChoice = (problem.choices ?? []).find((c) => c.text.trim() === String(drop));

  const lastStep = totalSteps - 1;
  const showAfter = step >= 1;
  const showBracket = step >= 2;
  const showTrap = step === 3;
  const showPercentBar = step >= 4;
  const isFinal = step >= lastStep;

  const caption = isFinal
    ? `${pctExact.toFixed(1)}% ≈ ${pctRounded}%`
    : showPercentBar
    ? `${drop}/${before} ≈ ${pctExact.toFixed(1)}%`
    : showTrap && trapChoice
    ? `${drop} cents saved isn't the percent — choice ${trapChoice.label}, but percent needs ÷ ${before}`
    : showBracket
    ? `dropped by ${before} − ${after} = ${drop} cents`
    : showAfter
    ? `2005: ${after} cents per minute`
    : `1985: ${before} cents per minute`;

  const note = failure || "";

  // ---- geometry ----
  const W = 300;
  const H = 190;
  const barX = 30;
  const barY = 34;
  const barH = 26;
  const fullW = 220;
  const widthOf = (v: number) => (v / before) * fullW;

  const pctBarY = 140;
  const pctBarH = 20;
  const pctFillW = (pctExact / 100) * fullW;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <text x={barX} y={barY - 10} fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          cents / minute
        </text>

        {/* faint full-width reference (the 1985 price) */}
        <rect x={barX} y={barY} width={fullW} height={barH} rx={5} fill="#eef2ff" stroke={IND} strokeWidth={1.2} strokeOpacity={0.4} />

        {/* the price bar itself, shrinking on showAfter */}
        <motion.rect
          x={barX}
          y={barY}
          height={barH}
          rx={5}
          fill={IND}
          fillOpacity={0.75}
          stroke={IND}
          strokeWidth={1.6}
          initial={{ width: widthOf(before) }}
          animate={{ width: widthOf(showAfter ? after : before) }}
          transition={{ type: "spring", stiffness: 130, damping: 18 }}
        />
        <motion.text
          y={barY + barH / 2 + 4}
          fontSize="10.5"
          fontWeight="800"
          fill="#fff"
          fontFamily={numberFont}
          initial={{ x: barX + widthOf(before) - 10 }}
          animate={{ x: barX + widthOf(showAfter ? after : before) - 10 }}
          transition={{ type: "spring", stiffness: 130, damping: 18 }}
          textAnchor="end"
        >
          {showAfter ? after : before}¢
        </motion.text>

        {/* bracket calling out the drop */}
        <AnimatePresence>
          {showBracket && (
            <motion.g key="bracket" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <line x1={barX + widthOf(after)} x2={barX + widthOf(before)} y1={barY + barH + 10} y2={barY + barH + 10} stroke={showTrap ? BAD : AMBER} strokeWidth={1.4} />
              <line x1={barX + widthOf(after)} x2={barX + widthOf(after)} y1={barY + barH + 6} y2={barY + barH + 14} stroke={showTrap ? BAD : AMBER} strokeWidth={1.4} />
              <line x1={barX + widthOf(before)} x2={barX + widthOf(before)} y1={barY + barH + 6} y2={barY + barH + 14} stroke={showTrap ? BAD : AMBER} strokeWidth={1.4} />
              <text x={(barX + widthOf(after) + barX + widthOf(before)) / 2} y={barY + barH + 28} textAnchor="middle" fontSize="10" fontWeight="800" fill={showTrap ? BAD : AMBER} fontFamily={numberFont}>
                {drop}¢ drop
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* percent strip: 10 ticks of 10% each, filling to the real percent */}
        <AnimatePresence>
          {showPercentBar && (
            <motion.g key="pct" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={barX} y={pctBarY - 8} fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                percent decrease
              </text>
              <rect x={barX} y={pctBarY} width={fullW} height={pctBarH} rx={4} fill="#f8fafc" stroke={INK} strokeWidth={1.4} />
              {Array.from({ length: 9 }).map((_, i) => (
                <line key={i} x1={barX + ((i + 1) / 10) * fullW} x2={barX + ((i + 1) / 10) * fullW} y1={pctBarY} y2={pctBarY + pctBarH} stroke="#cbd5e1" strokeWidth={1} />
              ))}
              <motion.rect
                x={barX}
                y={pctBarY}
                height={pctBarH}
                rx={4}
                fill={WIN}
                fillOpacity={0.6}
                initial={{ width: 0 }}
                animate={{ width: pctFillW }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.15 }}
              />
              <text x={barX + fullW + 8} y={pctBarY + pctBarH / 2 + 4} fontSize="10.5" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                {pctExact.toFixed(0)}%
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
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : "#4338ca",
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {note && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            {note}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
