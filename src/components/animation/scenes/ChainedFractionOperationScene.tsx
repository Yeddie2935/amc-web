import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * A made-up operation a⊗b = (a+b)/(a−b) feeding its own output back in as the
 * next input — the scene runs the real pair through the machine, feeds the
 * result and the third number through a second time, and spends a beat on
 * the trap of dumping all three numbers into one shared fraction at once
 * (a+b+c)/(a−b−c) instead of chaining two separate applications.
 * Data: { a, b, c }.
 */
export function ChainedFractionOperationScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const a = num(data.a, 6);
  const b = num(data.b, 4);
  const c = num(data.c, 3);

  const r1 = (a + b) / (a - b);
  const r2 = (r1 + c) / (r1 - c);
  const answerOk = problem.shortAnswer == null || String(r2) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${r2}, stored answer is ${problem.shortAnswer}` : "";

  const trapDen = a - b - c;
  const trapVal = (a + b + c) / trapDen;
  const trapChoice = (problem.choices ?? []).find((ch) => String(ch.text).trim() === String(Math.abs(trapVal)));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showSecond = step >= 2 || isFinal;

  const W = 300;
  const H = 200;
  const boxY = 60;
  const boxW = 90;
  const boxH = 50;

  const Machine = ({ x, top, bottom, resultText, color }: { x: number; top: string; bottom: string; resultText: string; color: string }) => (
    <g>
      <rect x={x} y={boxY} width={boxW} height={boxH} rx={10} fill="#fff" stroke={color} strokeWidth={2.2} />
      <text x={x + boxW / 2} y={boxY + 20} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
        {top}
      </text>
      <line x1={x + 14} y1={boxY + 26} x2={x + boxW - 14} y2={boxY + 26} stroke={INK} strokeWidth={1.4} />
      <text x={x + boxW / 2} y={boxY + 42} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
        {bottom}
      </text>
      <motion.text x={x + boxW / 2} y={boxY + boxH + 22} textAnchor="middle" fontSize="14" fontWeight="800" fill={color} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        = {resultText}
      </motion.text>
    </g>
  );

  const caption = isFinal
    ? `${r1} ⊗ ${c} = ${r2}`
    : showSecond
    ? `now apply the machine to ${r1} and ${c}`
    : showTrap
    ? trapChoice
      ? `dumping all three in one fraction: (${a}+${b}+${c})/(${a}−${b}−${c}) = ${trapVal} — magnitude matches choice ${trapChoice.label}`
      : `dumping all three in one fraction gives ${trapVal}, not how chained operations work`
    : `${a} ⊗ ${b} = (${a}+${b})/(${a}−${b})`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {!showSecond && !showTrap && <Machine x={105} top={`${a} + ${b}`} bottom={`${a} − ${b}`} resultText={String(r1)} color={IND} />}

        {showTrap && (
          <g>
            <rect x={70} y={boxY - 10} width={160} height={boxH + 20} rx={10} fill="#fee2e2" stroke={BAD} strokeWidth={2.2} />
            <text x={150} y={boxY + 8} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
              {a} + {b} + {c}
            </text>
            <line x1={90} y1={boxY + 14} x2={210} y2={boxY + 14} stroke={BAD} strokeWidth={1.4} />
            <text x={150} y={boxY + 30} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
              {a} − {b} − {c}
            </text>
            <text x={150} y={boxY + boxH + 22} textAnchor="middle" fontSize="13" fontWeight="800" fill={BAD} fontFamily={numberFont}>
              = {trapVal}
            </text>
          </g>
        )}

        {showSecond && <Machine x={105} top={`${r1} + ${c}`} bottom={`${r1} − ${c}`} resultText={String(r2)} color={WIN} />}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 300,
        }}
      >
        {caption}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
