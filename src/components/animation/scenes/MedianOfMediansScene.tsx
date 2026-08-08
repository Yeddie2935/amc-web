import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

function readGroups(value: unknown): number[][] {
  return Array.isArray(value)
    ? value.filter((g) => Array.isArray(g)).map((g) => (g as unknown[]).map((v) => num(v, 0)))
    : [];
}

// A single number cell.
function Cell({
  value,
  isMedian,
  le,
  delay,
  label,
}: {
  value: string | number;
  isMedian?: boolean;
  le?: boolean;
  delay: number;
  label?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay }}
      style={{
        minWidth: 30,
        height: 28,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 7,
        fontFamily: numberFont,
        fontSize: 14,
        fontWeight: isMedian ? 800 : 600,
        color: isMedian ? "#4338ca" : le ? "#166534" : "#1f2a44",
        background: le ? "#dcfce7" : "#f8fafc",
        border: isMedian ? "2px solid #4338ca" : "1px solid #e2e8f0",
        position: "relative",
      }}
    >
      {value}
      {label && (
        <span style={{ position: "absolute", bottom: -14, fontSize: 9, color: "#94a3b8", fontWeight: 700 }}>{label}</span>
      )}
    </motion.div>
  );
}

// "Split 1..N into groups; M = median of the group medians; minimize M." The
// scene draws the lower-bound idea (a group's median has 3 values ≤ it, ×3
// groups ⇒ ≥9 values ≤ M), then an actual construction grid (medians and the
// ≤M cells shaded and counted), then lifts the medians out and takes their
// median. All medians are computed from the group data, never trusted.
// Data: { groups:[[..5..], ...], M }.
export function MedianOfMediansScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const groups = readGroups(data.groups);
  const sorted = groups.map((g) => [...g].sort((a, b) => a - b));
  const mid = (len: number) => Math.floor(len / 2);
  const medians = sorted.map((g) => g[mid(g.length)]);
  const sortedMedians = [...medians].sort((a, b) => a - b);
  const mom = sortedMedians.length ? sortedMedians[mid(sortedMedians.length)] : 0;
  const M = num(data.M, mom);
  const countLE = sorted.flat().filter((v) => v <= M).length;
  const groupsPerHalf = groups.length ? mid(groups.length) + 1 : 3; // medians that must be ≤ M
  const perGroupLE = sorted[0] ? mid(sorted[0].length) + 1 : 3; // values ≤ median in a group

  const last = totalSteps - 1;
  // Step 1 shows the bound; the grid appears from step 2; the median-of-medians
  // conclusion lands on the final step (its own beat with 3 steps).
  const showGrid = step >= 1;
  const showConclude = step >= last;
  // Scene shows the value M, so the badge points back to the choice letter.
  const answer = problem.answer ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", padding: "8px 4px" }}>
      {/* Step 1: lower-bound idea */}
      {!showGrid && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>ONE GROUP OF {sorted[0]?.length ?? 5}</span>
            <div style={{ display: "flex", gap: 5, paddingBottom: 16 }}>
              {Array.from({ length: sorted[0]?.length ?? 5 }).map((_, i) => {
                const isMed = i === mid(sorted[0]?.length ?? 5);
                const le = i <= mid(sorted[0]?.length ?? 5);
                return (
                  <Cell
                    key={i}
                    value={isMed ? "m" : i < mid(sorted[0]?.length ?? 5) ? "≤" : "≥"}
                    isMedian={isMed}
                    le={le}
                    delay={i * 0.1}
                    label={le ? "≤ m" : undefined}
                  />
                );
              })}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{ fontFamily: numberFont, fontSize: 14, fontWeight: 700, color: "#1f2a44", textAlign: "center", lineHeight: 1.7 }}
          >
            {perGroupLE} values ≤ m per group<br />
            <span style={{ color: "#64748b" }}>need {groupsPerHalf} medians ≤ M →</span>{" "}
            <span style={{ color: "#4338ca" }}>{groupsPerHalf} × {perGroupLE} = {groupsPerHalf * perGroupLE} values ≤ M</span>
            <br />
            <span style={{ color: "#16a34a", fontWeight: 800 }}>so M ≥ {groupsPerHalf * perGroupLE}</span>
          </motion.div>
        </div>
      )}

      {/* Steps 2-3: construction grid */}
      {showGrid && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>A CONSTRUCTION</span>
            <span
              style={{
                fontFamily: numberFont,
                fontSize: 12,
                fontWeight: 800,
                color: "#166534",
                background: "#dcfce7",
                padding: "2px 10px",
                borderRadius: 999,
              }}
            >
              {countLE} values ≤ {M}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sorted.map((g, gi) => {
              const medIdx = mid(g.length);
              return (
                <div key={gi} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", width: 20 }}>G{gi + 1}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {g.map((v, vi) => (
                      <Cell key={vi} value={v} isMedian={vi === medIdx} le={v <= M} delay={gi * 0.12 + vi * 0.05} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>med</span>
                  <span style={{ fontFamily: numberFont, fontSize: 14, fontWeight: 800, color: "#4338ca" }}>{medians[gi]}</span>
                </div>
              );
            })}
          </div>

          {/* Conclusion: median of the medians */}
          <AnimatePresence>
            {showConclude && (
              <motion.div
                key="conclude"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 2 }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>MEDIANS, SORTED</span>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {sortedMedians.map((v, i) => {
                    const isMid = i === mid(sortedMedians.length);
                    return (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.15 + i * 0.1 }}
                        style={{
                          minWidth: 30,
                          height: 30,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 8,
                          fontFamily: numberFont,
                          fontSize: 15,
                          fontWeight: 800,
                          color: isMid ? "#fff" : "#4338ca",
                          background: isMid ? "#16a34a" : "#eef2ff",
                          border: isMid ? "2px solid #16a34a" : "1px solid #c7d2fe",
                        }}
                      >
                        {v}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <AnimatePresence>
        {showConclude && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 + sortedMedians.length * 0.1 + 0.2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            least M = {mom} → Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
