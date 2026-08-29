import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const GRID = "#cbd5e1";

/** Parse "3/8" or "1" into a value; used only for the given ground-truth fractions. */
function parseFrac(s: string): number {
  const m = String(s).trim().match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (m) return Number(m[1]) / Number(m[2]);
  return Number(s);
}
function fracLabel(v: number): string {
  if (Number.isInteger(v)) return `${v}`;
  const den = [2, 3, 4, 8, 16].find((d) => Number.isInteger(v * d));
  if (den) return `${Math.round(v * den)}/${den}`;
  return v.toFixed(3);
}

/**
 * Four unit squares, each cut into congruent triangles/rectangles by the
 * contest's own figure, with one region in each traced in bold. The shapes
 * are read straight off that figure — a strip, a corner triangle, a
 * triangle-plus-quadrant kite, a quadrant — not invented, since a percent
 * problem like this lives or dies on whether the drawn region really is the
 * claimed fraction. Each square gets its own beat so its bold region can be
 * watched landing before its area is claimed; only then do the four areas
 * get added and turned into a percent of the combined four-square total.
 *
 * data: { areas: ["1/4","1/8","3/8","1/4"] } — the four bolded-area
 * fractions, one per square, used to drive the sum/percent computation.
 */
export function BoldedSquaresScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const areaStrs = (Array.isArray(data.areas) ? data.areas : ["1/4", "1/8", "3/8", "1/4"]).map((s) => String(s));
  const areas = areaStrs.map(parseFrac);
  const sum = areas.reduce((a, b) => a + b, 0);
  const totalSquareArea = 4;
  const percent = (sum / totalSquareArea) * 100;
  const expected = Number.isInteger(percent) ? `${percent}` : percent.toFixed(2).replace(/0$/, "").replace(/\.$/, "");
  const ok = expected === (problem.shortAnswer ?? "").trim();

  // ---- beats: 0 setup, 1-4 each square's bold region, 5 sum, 6 percent ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 6));
  const isFinal = step >= last;
  const revealedCount = Math.min(4, Math.max(0, beat));

  const caption =
    beat === 0
      ? `four squares, each with area 1`
      : beat <= 4
      ? `square ${beat} bolded area = ${areaStrs[beat - 1]}`
      : beat === 5
      ? `${areaStrs.join(" + ")} = ${fracLabel(sum)}`
      : `${fracLabel(sum)} of 4 = ${expected}%`;

  // ---- geometry: four 120x120 diagrams laid out 2x2, exactly as the figure shows ----
  const S = 120;
  const col1X = 20;
  const col2X = 170;
  const row1Y = 30;
  const row2Y = 200;
  const positions = [
    { x: col1X, y: row1Y },
    { x: col2X, y: row1Y },
    { x: col1X, y: row2Y },
    { x: col2X, y: row2Y },
  ];
  const W = 320;
  const H = 460;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        {positions.map((p, i) => (
          <DiagramSquare key={i} index={i} x={p.x} y={p.y} s={S} revealed={i < revealedCount} isCurrent={i === beat - 1} label={areaStrs[i]} />
        ))}

        {/* beat 5: the four bolded areas stacked into one bar out of the 4-square total */}
        {beat === 5 && <SumBar areas={areas} sum={sum} y={370} />}
        {beat === 6 && <SumBar areas={areas} sum={sum} y={370} final />}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : IND,
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
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${expected}% but stored answer reads "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** One of the four contest squares: real grid/diagonal structure, with its bold region revealed on cue. */
function DiagramSquare({ index, x, y, s, revealed, isCurrent, label }: { index: number; x: number; y: number; s: number; revealed: boolean; isCurrent: boolean; label: string }) {
  const mid = s / 2;
  const q = s / 4;

  // ---- the fixed structural lines, straight off the contest figure ----
  const gridLines: string[] = [];
  let boldPath = "";
  if (index === 0) {
    // four equal columns
    gridLines.push(`M ${x + q},${y} L ${x + q},${y + s}`, `M ${x + 2 * q},${y} L ${x + 2 * q},${y + s}`, `M ${x + 3 * q},${y} L ${x + 3 * q},${y + s}`);
    boldPath = `M ${x},${y} L ${x + q},${y} L ${x + q},${y + s} L ${x},${y + s} Z`;
  } else if (index === 1) {
    // 2x2 grid, top-right quadrant split by its own diagonal; upper triangle bold
    gridLines.push(`M ${x + mid},${y} L ${x + mid},${y + s}`, `M ${x},${y + mid} L ${x + s},${y + mid}`, `M ${x + mid},${y + mid} L ${x + s},${y}`);
    boldPath = `M ${x + mid},${y} L ${x + s},${y} L ${x + s},${y + mid} Z`;
  } else if (index === 2) {
    // 2x2 grid, top-left quadrant split by its own diagonal; lower-right triangle + bottom-left quadrant bold
    gridLines.push(`M ${x + mid},${y} L ${x + mid},${y + s}`, `M ${x},${y + mid} L ${x + s},${y + mid}`, `M ${x},${y + mid} L ${x + mid},${y}`);
    boldPath = `M ${x},${y + mid} L ${x + mid},${y} L ${x + mid},${y + s} L ${x},${y + s} Z`;
  } else {
    // 2x2 grid, bottom-left quadrant bold
    gridLines.push(`M ${x + mid},${y} L ${x + mid},${y + s}`, `M ${x},${y + mid} L ${x + s},${y + mid}`);
    boldPath = `M ${x},${y + mid} L ${x + mid},${y + mid} L ${x + mid},${y + s} L ${x},${y + s} Z`;
  }

  return (
    <g>
      <rect x={x} y={y} width={s} height={s} fill="#fff" stroke={INK} strokeWidth={1.4} />
      {gridLines.map((d, i) => (
        <path key={i} d={d} stroke={GRID} strokeWidth={1} fill="none" />
      ))}
      <text x={x + s / 2} y={y - 8} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>
        square {index + 1}
      </text>
      {revealed && (
        <motion.path
          d={boldPath}
          fill={IND}
          fillOpacity={0.22}
          stroke={IND}
          strokeWidth={2.4}
          initial={isCurrent ? { opacity: 0, scale: 0.7 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      )}
      {revealed && (
        <motion.text
          x={x + s / 2}
          y={y + s + 18}
          textAnchor="middle"
          fontSize="11"
          fontWeight="800"
          fill={IND}
          fontFamily={FONT}
          initial={isCurrent ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: isCurrent ? 0.4 : 0 }}
        >
          {label}
        </motion.text>
      )}
    </g>
  );
}

/** The four bolded areas stacked left to right, out of the 4-square total. */
function SumBar({ areas, sum, y, final: isFinalStep }: { areas: number[]; sum: number; y: number; final?: boolean }) {
  const barX = 20;
  const barW = 280;
  const total = 4;
  const px = (v: number) => (v / total) * barW;
  const colors = [IND, "#0d9488", "#d97706", "#7c3aed"];
  let acc = 0;
  return (
    <g>
      <rect x={barX} y={y} width={barW} height={30} rx={6} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1.2} />
      {areas.map((a, i) => {
        const w = px(a);
        const seg = (
          <motion.rect
            key={i}
            x={barX + px(acc)}
            y={y}
            width={w}
            height={30}
            fill={colors[i % colors.length]}
            fillOpacity={0.75}
            stroke="#fff"
            strokeWidth={1}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.18 }}
            style={{ transformBox: "fill-box", transformOrigin: "left" }}
          />
        );
        acc += a;
        return seg;
      })}
      <path d={`M ${barX + px(sum)},${y - 8} L ${barX + px(sum)},${y + 38}`} stroke={INK} strokeWidth={1.4} strokeDasharray="3 3" />
      <text x={barX + px(sum)} y={y - 12} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={FONT}>
        {fracLabel(sum)} of {total}
      </text>
      {isFinalStep && (
        <motion.text x={barX + barW / 2} y={y + 52} textAnchor="middle" fontSize="13" fontWeight="800" fill={WIN} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.6 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          {fracLabel(sum)} / {total} = {((sum / total) * 100).toFixed(0)}%
        </motion.text>
      )}
    </g>
  );
}
