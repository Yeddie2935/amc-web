import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const DARK_FILL = "#1f2a44";
const BRIGHT_FILL = "#fde68a";

type Cell = { q: number; r: number };

function ringCells(k: number): Cell[] {
  if (k === 0) return [{ q: 0, r: 0 }];
  const dirs = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
  ];
  const out: Cell[] = [];
  let q = -k;
  let r = k;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < k; j++) {
      out.push({ q, r });
      q += dirs[i][0];
      r += dirs[i][1];
    }
  }
  return out;
}

function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

function hexPoints(cx: number, cy: number, s: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i);
    return `${cx + s * Math.cos(a)},${cy + s * Math.sin(a)}`;
  }).join(" ");
}

/**
 * A hexagon-of-hexagons border pattern: ring k out from the center holds
 * exactly 6k tiles, colored dark or bright per ring. Adding one more ring
 * changes only that ring's color total. Five beats: (0) the existing rings
 * built up; (1) the 6k rule confirmed on each ring; (2) the new border
 * ring added; (3) bright and dark tiles tallied; (4) the difference and
 * badge. Data: { ringColors: ("dark"|"bright")[], newRingColor }.
 */
export function HexTileBorderScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const ringColors = strList(data.ringColors);
  const newRingColor = data.newRingColor === "dark" ? "dark" : "bright";
  if (ringColors.length < 2) return null;

  const ringCount = (k: number) => (k === 0 ? 1 : 6 * k);
  const existingDark = ringColors.reduce((sum, c, k) => sum + (c === "dark" ? ringCount(k) : 0), 0);
  const existingBright = ringColors.reduce((sum, c, k) => sum + (c === "bright" ? ringCount(k) : 0), 0);
  const newRingIndex = ringColors.length;
  const newCount = ringCount(newRingIndex);
  const brightTotal = existingBright + (newRingColor === "bright" ? newCount : 0);
  const darkTotal = existingDark + (newRingColor === "dark" ? newCount : 0);
  const difference = Math.abs(brightTotal - darkTotal);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showRule = step >= 1;
  const showNewRing = step >= 2 || isFinal;
  const showTally = step >= 3 || isFinal;

  const s = 15;
  const ringsToDraw = showNewRing ? newRingIndex : ringColors.length - 1;
  const R = s * 1.75 * (ringsToDraw + 1) + 14;
  const W = R * 2;
  const H = R * 2;
  const cx = W / 2;
  const cy = H / 2;
  const at = (c: Cell) => ({ x: cx + s * 1.5 * c.q, y: cy + s * Math.sqrt(3) * (c.r + c.q / 2) });

  const colorFor = (k: number) => (k === newRingIndex ? newRingColor : ringColors[k]);

  const caption = isFinal
    ? `${brightTotal} − ${darkTotal} = ${difference}`
    : step === 0
    ? `ring k holds 6k tiles — ring 1 has ${ringCount(1)}, ring 2 has ${ringCount(2)}`
    : showTally
    ? "count bright vs. dark across every ring"
    : showNewRing
    ? `new ring ${newRingIndex}: 6 × ${newRingIndex} = ${newCount} ${newRingColor} tiles`
    : `each ring's tile count checks against 6k`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 300 }}>
        {Array.from({ length: ringsToDraw + 1 }).map((_, k) =>
          ringCells(k).map((c, j) => {
            const p = at(c);
            const color = colorFor(k);
            const isNew = k === newRingIndex;
            return (
              <motion.polygon
                key={`${k}-${j}`}
                points={hexPoints(p.x, p.y, s)}
                fill={color === "dark" ? DARK_FILL : BRIGHT_FILL}
                stroke={isNew ? MARK : "#fff"}
                strokeWidth={isNew ? 1.6 : 1}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 18, delay: k * 0.15 + j * 0.02 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            );
          })
        )}
      </svg>

      <AnimatePresence>
        {showRule && !showTally && (
          <motion.div key="rule" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 700, color: MARK, textAlign: "center" }}>
            {ringColors.map((c, k) => `ring ${k}: ${ringCount(k)} ${c}`).join(" · ")}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTally && (
          <motion.div key="tally" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 12, fontFamily: FONT, fontSize: 11, fontWeight: 800 }}>
            <span style={{ color: "#b45309" }}>bright: {existingBright}{newRingColor === "bright" ? ` + ${newCount}` : ""} = {brightTotal}</span>
            <span style={{ color: INK }}>dark: {existingDark}{newRingColor === "dark" ? ` + ${newCount}` : ""} = {darkTotal}</span>
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
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : INK,
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
