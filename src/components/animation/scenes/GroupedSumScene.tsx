import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

// Split a flat list of signed terms into fixed-size groups.
function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

// Render one group as "(1 + 2 − 3)", keeping the original signs faithful.
function groupExpr(group: number[]): string {
  return (
    "(" +
    group
      .map((t, i) => {
        const mag = Math.abs(t);
        if (i === 0) return t < 0 ? `−${mag}` : `${mag}`;
        return t < 0 ? ` − ${mag}` : ` + ${mag}`;
      })
      .join("") +
    ")"
  );
}

// Visual walkthrough for "group an alternating sum into equal blocks", e.g.
// 1 + 2 − 3 + 4 + 5 − 6 + … . Each group is laid out on its own row; on the
// final step every group's sum pops in, then the running total and answer.
// Data: { terms: [1,2,-3,...], groupSize: 3 }.
export function GroupedSumScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  // The total line already shows the numeric value, so the badge points back to
  // the answer choice (the letter) rather than repeating the number.
  const answer = problem.answer ?? null;

  const terms = Array.isArray(data.terms) ? data.terms.map((t) => num(t, 0)) : [];
  const groupSize = Math.max(1, num(data.groupSize, 3));
  const groups = chunk(terms, groupSize);
  const groupSums = groups.map((g) => g.reduce((a, b) => a + b, 0));
  const total = groupSums.reduce((a, b) => a + b, 0);

  const last = totalSteps - 1;
  const revealSums = step >= last;
  const final = step >= last;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      {groups.map((group, gi) => (
        <motion.div
          key={gi}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: gi * 0.12 }}
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <span
            style={{
              fontFamily: numberFont,
              fontSize: 22,
              fontWeight: 700,
              color: "#1f2a44",
              padding: "4px 12px",
              borderRadius: 10,
              background: "#eef2ff",
              minWidth: 132,
              textAlign: "center",
            }}
          >
            {groupExpr(group)}
          </span>
          <AnimatePresence>
            {revealSums && (
              <motion.span
                key="sum"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 14, delay: gi * 0.14 }}
                style={{ fontFamily: numberFont, fontSize: 22, fontWeight: 800, color: "#4338ca" }}
              >
                = {groupSums[gi]}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      <AnimatePresence>
        {final && (
          <motion.div
            key="total"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groups.length * 0.14 + 0.1 }}
            style={{ fontFamily: numberFont, fontSize: 22, fontWeight: 800, color: "#1f2a44", marginTop: 4 }}
          >
            {groupSums.join(" + ")} = {total}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {final && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: groups.length * 0.14 + 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
