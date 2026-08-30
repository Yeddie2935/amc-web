import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

/**
 * Choosing n-1 starters from a roster of n is the same as choosing the one
 * person left out — same count, easier to see. Four beats: (0) the roster;
 * (1) the flip to "who sits out"; (2) every bench case enumerated side by
 * side; (3) the tally and badge. Data: { names: string[] }, one person
 * benched per team.
 */
export function BenchOneComplementScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const names = strList(data.names);
  if (names.length < 2) return null;
  const n = names.length;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showFlip = step >= 1;
  const showCases = step >= 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <div style={{ display: "flex", gap: 8 }}>
        {names.map((nm, i) => (
          <motion.div
            key={nm}
            initial={{ opacity: 0, y: -8, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.08 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: `${MARK}18`,
                border: `1.6px solid ${MARK}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 13,
                color: MARK,
              }}
            >
              {nm.trim()[0]?.toUpperCase() ?? "?"}
            </div>
            <div style={{ fontFamily: FONT, fontSize: 8, fontWeight: 700, color: DIM }}>{nm}</div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showFlip && !showCases && (
          <motion.div
            key="flip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 700, color: "#b45309", textAlign: "center", maxWidth: 300 }}
          >
            choosing {n - 1} starters = choosing 1 to sit out — the same count, easier to see
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCases && (
          <motion.div key="cases" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {names.map((benched, ci) => (
              <motion.div
                key={benched}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: ci * 0.12 }}
                style={{ display: "flex", gap: 4, alignItems: "center" }}
              >
                {names.map((nm) => {
                  const sitsOut = nm === benched;
                  return (
                    <div
                      key={nm}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: sitsOut ? "#fee2e2" : `${WIN}18`,
                        border: `1.2px solid ${sitsOut ? BAD : WIN}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: FONT,
                        fontSize: 8,
                        fontWeight: 800,
                        color: sitsOut ? BAD : WIN,
                        textDecoration: sitsOut ? "line-through" : "none",
                      }}
                    >
                      {nm[0]}
                    </div>
                  );
                })}
                <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, color: DIM }}>{benched} sits out</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="tally"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 15 }}
            style={{ fontFamily: FONT, fontSize: 13, fontWeight: 800, color: "#166534" }}
          >
            {n} ways to choose who sits out = {n} possible teams
          </motion.div>
        )}
      </AnimatePresence>

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
