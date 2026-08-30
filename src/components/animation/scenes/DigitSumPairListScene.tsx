import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * Two-digit numbers whose digits sum to a fixed target: for each tens digit
 * 1-9, the units digit is forced (target − tens), and it only survives if
 * it lands in 0-9. Five beats: (0) the nine possible tens digits; (1) the
 * valid ones paired into real numbers; (2) the tens digits that overshoot;
 * (3) the trap — a zero units digit is easy to forget; (4) the tally and
 * badge. Data: { targetSum }.
 */
export function DigitSumPairListScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const targetSum = Math.round(num(data.targetSum, 7));
  if (targetSum < 1 || targetSum > 17) return null;

  const rows = Array.from({ length: 9 }, (_, i) => {
    const tens = i + 1;
    const units = targetSum - tens;
    const valid = units >= 0 && units <= 9;
    return { tens, units, valid, num: tens * 10 + units };
  });
  const validRows = rows.filter((r) => r.valid);
  const invalidRows = rows.filter((r) => !r.valid);
  const zeroUnitsRow = validRows.find((r) => r.units === 0);

  const trap = (problem.choices ?? []).find((c) => c.text.trim() === String(validRows.length - 1));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showValid = step >= 1;
  const showInvalid = step >= 2;
  const showTrap = step >= 3 && !isFinal;

  const caption = isFinal
    ? `${validRows.length} numbers: ${validRows.map((r) => r.num).join(", ")}`
    : step === 0
    ? "the tens digit can be 1 through 9"
    : showInvalid
    ? `tens ${invalidRows.map((r) => r.tens).join(" and ")} would need a negative units digit`
    : `units digit = ${targetSum} − tens, when it's 0-9`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center", maxWidth: 320 }}>
        {rows.map((r) => (
          <motion.div
            key={r.tens}
            initial={{ opacity: 0, y: -8, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: r.tens * 0.05 }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "#f1f5f9",
              border: "1.6px solid #cbd5e1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 800,
              color: INK,
            }}
          >
            {r.tens}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showValid && (
          <motion.div key="valid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center", maxWidth: 320 }}>
            {validRows.map((r, i) => (
              <motion.div
                key={r.num}
                initial={{ opacity: 0, y: 8, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.09 }}
                style={{
                  padding: "3px 8px",
                  borderRadius: 6,
                  background: `${WIN}18`,
                  border: `1.4px solid ${WIN}`,
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 800,
                  color: WIN,
                }}
              >
                {r.tens}+{r.units}={r.num}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInvalid && (
          <motion.div key="invalid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 5 }}>
            {invalidRows.map((r) => (
              <div
                key={r.tens}
                style={{
                  padding: "3px 8px",
                  borderRadius: 6,
                  background: "#fee2e2",
                  border: `1.4px solid ${BAD}`,
                  fontFamily: FONT,
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: BAD,
                  textDecoration: "line-through",
                }}
              >
                tens {r.tens}: units {r.units}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTrap && zeroUnitsRow && (
          <motion.div
            key="trap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 700, color: "#b45309", textAlign: "center", maxWidth: 300 }}
          >
            {zeroUnitsRow.num} is easy to forget — a units digit of 0 still counts. Miss it{trap ? ` and you land on choice ${trap.label}` : ""}.
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
