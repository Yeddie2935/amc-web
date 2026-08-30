import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const NAVY = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

/**
 * TWO + TWO = FOUR, doubled column by column. T is given; the hundreds
 * column forces O from T and the required carry into a 4th digit, the "O
 * even" clue picks between the two carry cases, the ones column then gives
 * R, and the tens column leaves W with one free choice per candidate that
 * gets eliminated for reusing a digit already taken. Data: { T }.
 */
export function DoubledWordSumScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const T = Math.round(num(data.T, 7));

  // Hundreds column: 2T + c2 = O + 10 (c3 must be 1 for a 4-digit result).
  const oIfC2_0 = 2 * T - 10;
  const oIfC2_1 = 2 * T - 9;
  const O = oIfC2_0 % 2 === 0 ? oIfC2_0 : oIfC2_1;
  const c2 = O === oIfC2_0 ? 0 : 1;
  const F = 1;

  // Ones column: 2O = R + 10*c1.
  const R = (2 * O) % 10;
  const c1 = Math.floor((2 * O) / 10);

  // Tens column: 2W + c1 = U + 10*c2 (c2 already fixed above), so U = 2W + c1 - 10*c2.
  const used = new Set([T, O, F, R]);
  const candidates = Array.from({ length: 5 }, (_, w) => w).map((w) => {
    const u = 2 * w + c1 - 10 * c2;
    const conflicts = used.has(w) || used.has(u) || w === u;
    return { w, u, valid: !conflicts && u >= 0 && u <= 9 };
  });
  const winner = candidates.find((c) => c.valid);
  const W = winner?.w ?? 0;
  const U = winner?.u ?? 0;

  const last = totalSteps - 1;
  const showO = step >= 1;
  const showR = step >= 2;
  const showCandidates = step >= 3;
  const isFinal = step >= last;

  const digit = (v: number | null, show: boolean) => (show && v != null ? String(v) : "?");

  const Row = ({ letters, values, y }: { letters: string[]; values: (number | null)[]; y: number }) => (
    <g>
      {letters.map((l, i) => (
        <g key={i}>
          <text x={90 - i * 34} y={y} textAnchor="middle" fontSize="20" fontWeight="900" fill={values[i] != null ? INDIGO : DIM} fontFamily={FONT}>
            {values[i] != null ? values[i] : l}
          </text>
        </g>
      ))}
    </g>
  );

  const oVal = showO ? O : null;
  const rVal = showR ? R : null;
  const wVal = isFinal ? W : null;
  const uVal = isFinal ? U : null;
  const fVal = showO ? F : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox="0 0 220 130" width="100%" style={{ maxWidth: 240 }}>
        <Row letters={["O", "W", "T"]} values={[oVal, wVal, T]} y={30} />
        <text x={12} y={30} fontSize="16" fontWeight="800" fill={NAVY}>
          +
        </text>
        <Row letters={["O", "W", "T"]} values={[oVal, wVal, T]} y={60} />
        <line x1={10} y1={70} x2={124} y2={70} stroke={NAVY} strokeWidth={2} />
        <g>
          <text x={22} y={98} textAnchor="middle" fontSize="20" fontWeight="900" fill={rVal != null ? GREEN : DIM} fontFamily={FONT}>
            {digit(rVal, showR)}
          </text>
          <text x={56} y={98} textAnchor="middle" fontSize="20" fontWeight="900" fill={uVal != null ? GREEN : DIM} fontFamily={FONT}>
            {digit(uVal, isFinal)}
          </text>
          <text x={90} y={98} textAnchor="middle" fontSize="20" fontWeight="900" fill={oVal != null ? GREEN : DIM} fontFamily={FONT}>
            {digit(oVal, showO)}
          </text>
          <text x={124} y={98} textAnchor="middle" fontSize="20" fontWeight="900" fill={fVal != null ? GREEN : DIM} fontFamily={FONT}>
            {digit(fVal, showO)}
          </text>
        </g>
        <text x={22} y={112} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM} fontFamily={FONT}>
          R
        </text>
        <text x={56} y={112} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM} fontFamily={FONT}>
          U
        </text>
        <text x={90} y={112} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM} fontFamily={FONT}>
          O
        </text>
        <text x={124} y={112} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM} fontFamily={FONT}>
          F
        </text>
      </svg>

      <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: NAVY, textAlign: "center", maxWidth: 320 }}>
        {!showO
          ? `T = ${T}; a 3-digit + 3-digit sum needs a carry into F, so F = 1`
          : !showR
          ? `hundreds: 2×${T} + carry = ${O + 10} → O = ${O} (the only even choice) or O = ${oIfC2_1} (odd, rejected)`
          : !showCandidates
          ? `ones: 2×${O} = ${2 * O} → R = ${R}, carry ${c1}`
          : `tens: 2W + ${c1} = U — testing each W for a digit that isn't already used`}
      </motion.div>

      <AnimatePresence>
        {showCandidates && (
          <motion.div key="candidates" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", gap: 8 }}>
            {candidates.map((c) => (
              <div
                key={c.w}
                style={{
                  padding: "4px 8px",
                  borderRadius: 8,
                  border: `1.5px solid ${c.valid ? GREEN : RED}`,
                  background: c.valid ? "#f0fdf4" : "#fef2f2",
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 800,
                  color: c.valid ? GREEN : RED,
                  textAlign: "center",
                }}
              >
                W={c.w}
                <br />
                U={c.u}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.div key="win" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 14, fontWeight: 800, color: GREEN }}>
            W = {W} is the only digit that keeps every letter distinct
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
