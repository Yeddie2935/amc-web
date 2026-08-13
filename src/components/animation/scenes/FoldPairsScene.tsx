import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const GOLD = "#fbbf24";
const SILVER = "#cbd5e1";
const WIN = "#16a34a";

/**
 * Folding a grid in half so squares meet in pairs, then asking for the fewest
 * and most pairs whose two squares are both unmarked. Each marked square spoils
 * the pair it lands in, so the count of spoiled pairs runs from ⌈marked/2⌉
 * (marks clumped two to a pair) up to min(marked, pairs) (marks scattered) —
 * and the good pairs are the complement. Both extreme layouts are generated and
 * then counted, so the numbers on screen come from the picture.
 * Data: { rows, cols, marked }.
 */
export function FoldPairsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const rows = Math.max(1, Math.round(num(data.rows, 6)));
  const cols = Math.max(2, Math.round(num(data.cols, 6)));
  const marked = Math.max(0, Math.round(num(data.marked, 0)));

  const half = Math.floor(cols / 2);
  const pairs = rows * half;

  // build the two extreme layouts, each entry = number of marks in that pair
  const scatter: number[] = Array(pairs).fill(0);
  for (let i = 0, left = marked; i < pairs && left > 0; i++, left--) scatter[i] = 1;
  const clump: number[] = Array(pairs).fill(0);
  let left = marked;
  for (let i = 0; i < pairs && left > 0; i++) {
    const put = Math.min(2, left);
    clump[i] = put;
    left -= put;
  }
  // count from the layouts rather than asserting the formula
  const spoiled = (arr: number[]) => arr.filter((v) => v > 0).length;
  const usedMarks = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const m = pairs - spoiled(scatter);
  const M = pairs - spoiled(clump);
  const sum = m + M;
  const layoutsOk = usedMarks(scatter) === marked && usedMarks(clump) === marked;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const mode: "fold" | "min" | "max" = isFinal ? "max" : step >= 2 ? "max" : step >= 1 ? "min" : "fold";
  const arr = mode === "min" ? scatter : clump;
  const showPairs = step >= 1 || isFinal;

  // ---- geometry ----
  const W = 340;
  const H = 214;
  const S = 24;
  // unfolded grid
  const gx = (W - cols * S) / 2;
  const gy = 34;
  // folded pair grid
  const pw = 2 * S;
  const pgap = 8;
  const px0 = (W - (half * pw + (half - 1) * pgap)) / 2;
  const py0 = 18;
  const prh = S + 4;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* the grid stays put; a translucent copy of the left half swings over,
            so the 6×6 setup is still readable and the overlap is visible */}
        {!showPairs &&
          Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((__, c) => (
              <motion.rect
                key={`${r}-${c}`}
                x={gx + c * S}
                y={gy + r * S}
                width={S}
                height={S}
                fill={c < half ? "#e0e7ff" : "#f8fafc"}
                stroke={INK}
                strokeWidth={1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: (r * cols + c) * 0.008 }}
              />
            ))
          )}
        {!showPairs &&
          Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: half }).map((__, c) => (
              <motion.rect
                key={`g${r}-${c}`}
                x={gx + c * S}
                y={gy + r * S}
                width={S}
                height={S}
                fill="#4338ca"
                stroke="#4338ca"
                strokeWidth={1}
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: (cols - 1 - 2 * c) * S, opacity: 0.42 }}
                transition={{
                  opacity: { duration: 0.25, delay: 0.45 },
                  x: { type: "spring", stiffness: 70, damping: 16, delay: 0.5 },
                }}
              />
            ))
          )}
        {!showPairs && (
          <line
            x1={gx + half * S}
            y1={gy - 10}
            x2={gx + half * S}
            y2={gy + rows * S + 10}
            stroke={INK}
            strokeWidth={2}
            strokeDasharray="6 5"
          />
        )}

        {/* the folded result: one cell per pair, split into its two squares */}
        {showPairs &&
          Array.from({ length: pairs }).map((_, i) => {
            const r = Math.floor(i / half);
            const c = i % half;
            const x = px0 + c * (pw + pgap);
            const y = py0 + r * prh;
            const nMarks = arr[i];
            const good = nMarks === 0;
            return (
              <motion.g
                key={i}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.018 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <rect x={x} y={y} width={S} height={S} fill={nMarks >= 1 ? SILVER : GOLD} stroke={INK} strokeWidth={0.9} />
                <rect x={x + S} y={y} width={S} height={S} fill={nMarks >= 2 ? SILVER : GOLD} stroke={INK} strokeWidth={0.9} />
                {good && <rect x={x - 1.5} y={y - 1.5} width={pw + 3} height={S + 3} fill="none" stroke={WIN} strokeWidth={2} rx={2} />}
              </motion.g>
            );
          })}
      </svg>

      {/* caption */}
      <motion.span
        key={`${mode}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {mode === "fold"
          ? `folding gives ${rows} × ${half} = ${pairs} pairs`
          : mode === "min"
          ? `scatter the ${marked}: ${spoiled(scatter)} pairs spoiled → m = ${m}`
          : !isFinal
          ? `clump them 2 to a pair: only ${spoiled(clump)} spoiled → M = ${M}`
          : `m + M = ${m} + ${M} = ${sum}`}
      </motion.span>

      <AnimatePresence>
        {showPairs && (
          <motion.span
            key={`leg-${mode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: "#94a3b8" }}
          >
            green = both squares gold · {pairs - spoiled(arr)} of {pairs}
          </motion.span>
        )}
      </AnimatePresence>

      {!layoutsOk && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: "#dc2626" }}>
          the marks do not fit in the pairs
        </span>
      )}

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
