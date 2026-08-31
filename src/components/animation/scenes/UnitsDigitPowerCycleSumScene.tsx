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
 * A power's units digit only depends on the base's units digit and the
 * exponent's position in a short repeating cycle — the scene reduces both
 * numbers to their shared units digit, walks that digit's real 2-step cycle
 * to read off odd vs. even behavior, spends a beat on the trap of
 * mis-tracking which parity each real exponent actually has, then adds the
 * two resulting units digits together. Data: { base1, exp1, base2, exp2 }.
 */
export function UnitsDigitPowerCycleSumScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const base1 = Math.round(num(data.base1, 19));
  const exp1 = Math.round(num(data.exp1, 19));
  const base2 = Math.round(num(data.base2, 99));
  const exp2 = Math.round(num(data.exp2, 99));

  const unitsOf = (n: number) => ((n % 10) + 10) % 10;
  const u1 = unitsOf(base1);
  const u2 = unitsOf(base2);

  const cycle = (u: number) => {
    const seen: number[] = [];
    let cur = 1;
    for (let i = 0; i < 8; i++) {
      cur = (cur * u) % 10;
      if (seen.includes(cur) && i > 0) break;
      seen.push(cur);
    }
    return seen;
  };
  const cyc1 = cycle(u1);
  const cyc2 = cycle(u2);
  const powerUnits = (u: number, cyc: number[], exp: number) => cyc[(exp - 1) % cyc.length];
  const p1 = powerUnits(u1, cyc1, exp1);
  const p2 = powerUnits(u2, cyc2, exp2);
  const sum = p1 + p2;
  const finalUnits = sum % 10;
  const answerOk = problem.shortAnswer == null || String(finalUnits) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${finalUnits}, stored answer is ${problem.shortAnswer}` : "";

  // trap: assume the wrong parity for both exponents (flip odd/even)
  const trapP1 = cyc1[exp1 % cyc1.length];
  const trapP2 = cyc2[exp2 % cyc2.length];
  const trapSum = (trapP1 + trapP2) % 10;
  const trapChoice = trapSum !== finalUnits ? (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapSum)) : undefined;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showCycle = step >= 2 || isFinal;

  const W = 300;
  const H = 190;

  const caption = isFinal
    ? `${p1} + ${p2} = ${sum} → units digit ${finalUnits}`
    : showCycle
    ? `${base1}^${exp1} → ...${p1}, ${base2}^${exp2} → ...${p2} (both exponents odd)`
    : showTrap
    ? trapChoice
      ? `if both exponents were even instead: ${trapP1} + ${trapP2} → ${trapSum} — choice ${trapChoice.label}`
      : `misjudging the exponents' parity gives a different units digit entirely`
    : `only the units digits matter: ${base1} → ${u1}, ${base2} → ${u2}`;

  const Cycle = ({ x, y, u, cyc, exp, highlight }: { x: number; y: number; u: number; cyc: number[]; exp: number; highlight: number }) => (
    <g>
      <text x={x} y={y - 10} fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
        {u}^n cycle:
      </text>
      {cyc.map((v, i) => {
        const isHi = i === highlight % cyc.length;
        return (
          <g key={i}>
            <circle cx={x + 20 + i * 34} cy={y} r={13} fill={isHi ? WIN : "#eef2ff"} stroke={isHi ? WIN : IND} strokeWidth={isHi ? 2.2 : 1.3} />
            <text x={x + 20 + i * 34} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={isHi ? "#fff" : IND} fontFamily={numberFont}>
              {v}
            </text>
            <text x={x + 20 + i * 34} y={y + 24} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={DIM}>
              ^{i + 1}
            </text>
          </g>
        );
      })}
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {showCycle ? (
          <>
            <Cycle x={20} y={40} u={u1} cyc={cyc1} exp={exp1 - 1} highlight={exp1 - 1} />
            <Cycle x={20} y={100} u={u2} cyc={cyc2} exp={exp2 - 1} highlight={exp2 - 1} />
          </>
        ) : (
          <>
            <text x={W / 2} y={50} textAnchor="middle" fontSize="16" fontWeight="800" fill={IND} fontFamily={numberFont}>
              {base1}^{exp1} → {u1}^{exp1}
            </text>
            <text x={W / 2} y={80} textAnchor="middle" fontSize="16" fontWeight="800" fill={IND} fontFamily={numberFont}>
              {base2}^{exp2} → {u2}^{exp2}
            </text>
            {showTrap && (
              <motion.text x={W / 2} y={120} textAnchor="middle" fontSize="12" fontWeight="800" fill={BAD} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                exponents even? {trapP1} then {trapP2}
              </motion.text>
            )}
          </>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11,
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
