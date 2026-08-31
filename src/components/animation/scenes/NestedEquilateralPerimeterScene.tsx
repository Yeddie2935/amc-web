import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * Three equilateral triangles share vertices at real midpoints, so each
 * nested triangle's side is exactly half the one before — the scene draws
 * the real chain from the big triangle down through the two smaller ones,
 * spends a beat on the trap of summing all three triangles' full perimeters
 * (double-counting the shared internal edges), then walks only the true
 * outer boundary and adds those seven real side lengths.
 * Data: { side } (AB of the largest triangle; the other two halve each time).
 */
export function NestedEquilateralPerimeterScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const side = Math.max(1, num(data.side, 4));

  const s1 = side;
  const s2 = side / 2;
  const s3 = side / 4;
  const outerSides = [s1, s1, s2, s2, s3, s3, s3];
  const perimeter = outerSides.reduce((a, b) => a + b, 0);
  const answerOk = problem.shortAnswer == null || String(perimeter) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${perimeter}, stored answer is ${problem.shortAnswer}` : "";

  const trapTotal = 3 * s1 + 3 * s2 + 3 * s3;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapTotal));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showHalves = step >= 2 || isFinal;

  // vertices matching the real diagram: B bottom-left, C top, A bottom-right (on BC's baseline extended), D mid CA, E right of D, G mid AE, F right of G
  const B = { x: 30, y: 150 };
  const C = { x: 105, y: 20 };
  const A = { x: 150, y: 150 };
  const D = { x: (C.x + A.x) / 2, y: (C.y + A.y) / 2 };
  const E = { x: D.x + 45, y: D.y };
  const G = { x: (A.x + E.x) / 2, y: (A.y + E.y) / 2 };
  const F = { x: G.x + 22, y: G.y };

  const W = 260;
  const H = 180;

  const caption = isFinal
    ? `${outerSides.join(" + ")} = ${perimeter}`
    : showHalves
    ? `AD=DC=${s2}, DE=AE=${s2}, AG=GE=${s3}, EF=FG=${s3}`
    : showTrap
    ? trapChoice
      ? `3×${s1} + 3×${s2} + 3×${s3} = ${trapTotal} — choice ${trapChoice.label}, but that double-counts the shared inner edges`
      : `summing all three full perimeters double-counts the shared edges`
    : `triangle ABC is equilateral: AB = BC = AC = ${s1}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 280 }}>
        <polygon points={`${B.x},${B.y} ${C.x},${C.y} ${A.x},${A.y}`} fill="none" stroke={showTrap ? BAD : INK} strokeWidth={2} />
        <polygon points={`${A.x},${A.y} ${D.x},${D.y} ${E.x},${E.y}`} fill="none" stroke={showTrap ? BAD : INK} strokeWidth={2} />
        <polygon points={`${A.x},${A.y} ${G.x},${G.y} ${F.x},${F.y}`} fill="none" stroke={showTrap ? BAD : INK} strokeWidth={2} />

        {!showTrap && (
          <motion.polyline
            points={`${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y} ${E.x},${E.y} ${F.x},${F.y} ${G.x},${G.y} ${A.x},${A.y} ${B.x},${B.y}`}
            fill="none"
            stroke={WIN}
            strokeWidth={3}
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: showHalves || isFinal ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          />
        )}

        {[
          { p: B, l: "B" },
          { p: C, l: "C" },
          { p: A, l: "A" },
          { p: D, l: "D" },
          { p: E, l: "E" },
          { p: G, l: "G" },
          { p: F, l: "F" },
        ].map(({ p, l }) => (
          <text key={l} x={p.x + (l === "F" ? 10 : l === "B" ? -10 : 0)} y={p.y + (p.y > 100 ? 14 : -6)} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
            {l}
          </text>
        ))}

        {showHalves && (
          <>
            <text x={(C.x + D.x) / 2 - 8} y={(C.y + D.y) / 2} fontSize="8.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {s2}
            </text>
            <text x={(D.x + A.x) / 2 - 8} y={(D.y + A.y) / 2 + 10} fontSize="8.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {s2}
            </text>
            <text x={(A.x + G.x) / 2} y={(A.y + G.y) / 2 - 8} fontSize="8" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {s3}
            </text>
            <text x={(G.x + E.x) / 2} y={(G.y + E.y) / 2 - 8} fontSize="8" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {s3}
            </text>
          </>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
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

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
