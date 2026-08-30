import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const WIN = "#16a34a";
const BAD = "#dc2626";

/**
 * A real hexagram: a regular hexagon split into 6 congruent equilateral
 * wedge triangles from its center, with 6 more equilateral triangles
 * attached outward on its sides (the "points"), each point colored to pair
 * with its congruent wedge. A beat is spent on the trap of comparing the
 * WHOLE star to the hexagon (2:1) instead of just the points (1:1).
 * Data: { sides }. (sides is always 6 for a hexagram; kept for clarity.)
 */
export function HexagramAreaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const sides = 6;
  void data;

  const wedgeCount = sides;
  const pointCount = sides;
  const ratioMatches = problem.shortAnswer == null || String(problem.shortAnswer).trim() === `${pointCount}:${wedgeCount}` || String(problem.shortAnswer).trim() === "1:1";
  const note = ratioMatches ? "" : `check failed: computed ${pointCount}:${wedgeCount}, stored answer is ${problem.shortAnswer}`;

  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const starTotal = wedgeCount + pointCount;
  const g = gcd(starTotal, wedgeCount) || 1;
  const trapRatioStr = `${starTotal / g}:${wedgeCount / g}`;
  const trapChoice = (problem.choices ?? []).find((c) => c.text.trim() === trapRatioStr);

  const lastStep = totalSteps - 1;
  const showSpokes = step >= 1;
  const showPoints = step >= 2;
  const showTrap = step === 3;
  const showCompare = step >= 4;
  const isFinal = step >= lastStep;

  const caption = isFinal
    ? `${pointCount}:${wedgeCount} = 1:1`
    : showCompare
    ? `${pointCount} point triangles : ${wedgeCount} hexagon triangles = 1:1`
    : showTrap && trapChoice
    ? `whole star : hexagon = ${starTotal}:${wedgeCount} = 2:1 — choice ${trapChoice.label}, but we want points vs hexagon`
    : showPoints
    ? `each point is also an equilateral triangle, same size`
    : showSpokes
    ? `the hexagon splits into ${wedgeCount} equilateral triangles`
    : `a hexagon with 6 point extensions`;

  // ---- geometry ----
  const W = 260;
  const H = 260;
  const cx = W / 2;
  const cy = H / 2;
  const R = 46;
  const angleAt = (i: number) => (-90 + i * 60) * (Math.PI / 180);
  const vertices = Array.from({ length: sides }, (_, i) => ({ x: cx + R * Math.cos(angleAt(i)), y: cy + R * Math.sin(angleAt(i)) }));
  const colorOf = (i: number) => `hsl(${220 + i * 40}, 55%, 58%)`;

  const points = Array.from({ length: sides }, (_, i) => {
    const a = vertices[i];
    const b = vertices[(i + 1) % sides];
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const normal = { x: mid.x - cx, y: mid.y - cy };
    const len = Math.hypot(normal.x, normal.y) || 1;
    const h = (R * Math.sqrt(3)) / 2;
    const apex = { x: mid.x + (normal.x / len) * h, y: mid.y + (normal.y / len) * h };
    return { a, b, apex };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 280 }}>
        {/* hexagon outline */}
        <polygon points={vertices.map((v) => `${v.x},${v.y}`).join(" ")} fill="#f8fafc" stroke={INK} strokeWidth={1.6} />

        {/* wedges from center, revealed on showSpokes */}
        <AnimatePresence>
          {showSpokes &&
            vertices.map((v, i) => {
              const next = vertices[(i + 1) % sides];
              return (
                <motion.polygon
                  key={i}
                  points={`${cx},${cy} ${v.x},${v.y} ${next.x},${next.y}`}
                  fill={colorOf(i)}
                  fillOpacity={showTrap ? 0.55 : 0.4}
                  stroke={colorOf(i)}
                  strokeWidth={1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                />
              );
            })}
        </AnimatePresence>

        {/* point triangles, revealed on showPoints */}
        <AnimatePresence>
          {showPoints &&
            points.map((p, i) => (
              <motion.polygon
                key={i}
                points={`${p.a.x},${p.a.y} ${p.b.x},${p.b.y} ${p.apex.x},${p.apex.y}`}
                fill={colorOf(i)}
                fillOpacity={showTrap ? 0.55 : 0.4}
                stroke={colorOf(i)}
                strokeWidth={1.2}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.06 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            ))}
        </AnimatePresence>

        {/* trap: outline the whole star vs just the hexagon */}
        <AnimatePresence>
          {showTrap && (
            <motion.g key="trap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <polygon points={vertices.map((v) => `${v.x},${v.y}`).join(" ")} fill="none" stroke={BAD} strokeWidth={2} strokeDasharray="4 3" />
              <text x={cx} y={cy + 4} textAnchor="middle" fontSize="9" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                hexagon
              </text>
              <text x={cx} y={16} textAnchor="middle" fontSize="9" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                whole star = 2× this
              </text>
            </motion.g>
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
          color: isFinal ? "#166534" : showTrap ? BAD : "#4338ca",
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
