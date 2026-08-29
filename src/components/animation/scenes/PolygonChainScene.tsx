import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const AMB = "#b45309";
const BAD = "#dc2626";

function polygonPoints(cx: number, cy: number, r: number, n: number): string {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return pts.join(" ");
}

/**
 * A chain of regular polygons, each glued to the next along one shared edge.
 * A shared edge belongs to the outer boundary of neither neighbor, so it
 * removes 2 from the raw side count (one per polygon) — the scene draws the
 * real polygons, sums every side, then subtracts 2 for each of the glue
 * points between them.
 * Data: { sideCounts:[3,4,5,6,7,8] }.
 */
export function PolygonChainScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const sideCounts = (Array.isArray(data.sideCounts) ? data.sideCounts : [3, 4, 5, 6, 7, 8]).map((v) =>
    Math.max(3, Math.round(Number(v) || 3)),
  );
  const count = sideCounts.length;
  const glueCount = Math.max(0, count - 1);
  const rawSum = sideCounts.reduce((a, b) => a + b, 0);
  const outerSides = rawSum - 2 * glueCount;

  const matches = problem.shortAnswer == null || String(outerSides) === String(problem.shortAnswer);
  const failure = !matches ? `check failed: ${rawSum} − 2×${glueCount} = ${outerSides}, stored answer is ${problem.shortAnswer}` : "";

  const lastStep = totalSteps - 1;
  const showSum = step >= 1;
  const showGlue = step >= 2;
  const showFinal = step >= 3;
  const isFinal = step >= lastStep;

  // ---- geometry ----
  const r = 15;
  const spacing = 48;
  const x0 = 32;
  const cy = 40;
  const W = x0 * 2 + (count - 1) * spacing;
  const H = 170;
  const cx = (i: number) => x0 + i * spacing;

  const caption = isFinal
    ? `the outer boundary has ${outerSides} sides`
    : showFinal
    ? `${rawSum} − 2 × ${glueCount} = ${outerSides}`
    : showGlue
    ? `each of the ${glueCount} glued edges removes 2 sides — one from each neighbor`
    : showSum
    ? `add every side, ignoring the gluing for now: ${sideCounts.join(" + ")} = ${rawSum}`
    : `chain of polygons: ${sideCounts.join(", ")} sides`;

  const note = failure || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {/* the glued edges between neighbors */}
        <AnimatePresence>
          {showGlue &&
            Array.from({ length: glueCount }).map((_, i) => {
              const mx = (cx(i) + cx(i + 1)) / 2;
              return (
                <motion.g key={`glue${i}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <line x1={mx} y1={cy - r - 4} x2={mx} y2={cy + r + 4} stroke={AMB} strokeWidth={2} strokeDasharray="3 3" />
                  <rect x={mx - 10} y={cy + r + 8} width={20} height={14} rx={7} fill="#fef3c7" stroke={AMB} strokeWidth={1} />
                  <text x={mx} y={cy + r + 18} textAnchor="middle" fontSize="9" fontWeight="800" fill="#92400e" fontFamily={numberFont}>
                    −2
                  </text>
                </motion.g>
              );
            })}
        </AnimatePresence>

        {/* the polygons themselves */}
        {sideCounts.map((n, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.08 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <polygon points={polygonPoints(cx(i), cy, r, n)} fill="rgba(67,56,202,0.14)" stroke={IND} strokeWidth={1.6} strokeLinejoin="round" />
            <text x={cx(i)} y={cy + r + 14} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {n}
            </text>
          </motion.g>
        ))}

        {/* the running sum */}
        <AnimatePresence>
          {showSum && (
            <motion.text
              x={W / 2}
              y={H - 12}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={showFinal ? WIN : IND}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {showFinal ? `${rawSum} − ${2 * glueCount} = ${outerSides}` : `${sideCounts.join(" + ")} = ${rawSum}`}
            </motion.text>
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
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
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
