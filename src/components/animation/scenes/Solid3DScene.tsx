import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, num, sceneData, SvgAnswerBadge } from "./sceneKit";

// A drawn isometric cube (three shaded faces) for 3-D solid problems: volume,
// surface area, painted/unit cubes, cross-sections. The cube scales in, lights
// up on step >= 1, and shows an n×n×n unit grid when data.n is provided.
type P = [number, number];

const topTop: P = [100, 38];
const topRight: P = [162, 74];
const topFront: P = [100, 110];
const topLeft: P = [38, 74];
const botFront: P = [100, 176];
const botRight: P = [162, 140];
const botLeft: P = [38, 140];

const poly = (pts: P[]) => pts.map(([x, y]) => `${x},${y}`).join(" ");
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];
const mul = (a: P, t: number): P => [a[0] * t, a[1] * t];

// Grid lines across one parallelogram face spanned from O by edges u and v.
function faceGrid(O: P, u: P, v: P, n: number) {
  const lines: Array<{ a: P; b: P }> = [];
  for (let i = 1; i < n; i += 1) {
    const onU = add(O, mul(u, i / n));
    lines.push({ a: onU, b: add(onU, v) });
    const onV = add(O, mul(v, i / n));
    lines.push({ a: onV, b: add(onV, u) });
  }
  return lines;
}

export function Solid3DScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const answer = answerOf(problem);
  const final = step >= totalSteps - 1;
  const highlight = step >= 1;

  const n = Math.max(0, Math.min(5, num(data.n ?? data.size ?? data.cubes, 0)));
  const grid =
    n > 1
      ? [
          ...faceGrid(topFront, sub(topRight, topFront), sub(topLeft, topFront), n), // top
          ...faceGrid(topLeft, sub(topFront, topLeft), sub(botLeft, topLeft), n), // left
          ...faceGrid(topFront, sub(topRight, topFront), sub(botFront, topFront), n), // right
        ]
      : [];

  const faces: Array<{ pts: P[]; base: string; bright: string; delay: number }> = [
    { pts: [topLeft, topFront, botFront, botLeft], base: "#6366f1", bright: "#818cf8", delay: 0.05 },
    { pts: [topFront, topRight, botRight, botFront], base: "#4338ca", bright: "#6366f1", delay: 0.12 },
    { pts: [topTop, topRight, topFront, topLeft], base: "#a5b4fc", bright: "#c7d2fe", delay: 0.2 },
  ];

  return (
    <svg viewBox="0 0 200 212" role="img" aria-label="3D solid" style={{ width: "100%", maxWidth: 300 }}>
      <motion.g
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 14 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        {faces.map((face, i) => (
          <motion.polygon
            key={i}
            points={poly(face.pts)}
            stroke="#1f2a44"
            strokeWidth="2"
            strokeLinejoin="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, fill: highlight ? face.bright : face.base }}
            transition={{ delay: face.delay, duration: 0.4 }}
          />
        ))}

        <AnimatePresence>
          {highlight &&
            grid.map((line, i) => (
              <motion.line
                key={i}
                x1={line.a[0]}
                y1={line.a[1]}
                x2={line.b[0]}
                y2={line.b[1]}
                stroke="#e0e7ff"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.02 }}
              />
            ))}
        </AnimatePresence>
      </motion.g>

      <SvgAnswerBadge show={final} answer={answer} cx={100} y={190} />
    </svg>
  );
}
