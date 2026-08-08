import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

// A tilted square on a unit lattice (optionally a half-shifted "brick" tiling),
// with the slope triangle showing the side vector (dx, dy) so the area = dx²+dy².
// Reusable for lattice-square / "tilted square on a grid" area problems.
// Data: { gridW, gridH, ax, ay, dx, dy, brick? }.
export function LatticeSquareScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const W = Math.max(1, num(data.gridW, 6));
  const H = Math.max(1, num(data.gridH, 5));
  const ax = num(data.ax, 1);
  const ay = num(data.ay, 1);
  const dx = num(data.dx, 1);
  const dy = num(data.dy, 3);
  const brick = data.brick !== false;

  const area = dx * dx + dy * dy;
  const last = totalSteps - 1;
  const final = step >= last;
  const answer = problem.answer ?? null;

  const s = 44;
  const m = 14;
  const xP = (u: number) => m + u * s;
  const yP = (u: number) => m + (H - u) * s;
  const svgW = m * 2 + W * s;
  const svgH = m * 2 + H * s;

  // Square vertices: A, B=A+v, C=B+v⊥, D=A+v⊥ with v⊥=(dy,−dx).
  const A: [number, number] = [ax, ay];
  const B: [number, number] = [ax + dx, ay + dy];
  const C: [number, number] = [ax + dx + dy, ay + dy - dx];
  const D: [number, number] = [ax + dy, ay - dx];
  const poly = [A, B, C, D].map(([x, y]) => `${xP(x)},${yP(y)}`).join(" ");
  const corner: [number, number] = [ax + dx, ay]; // right angle of the slope triangle

  const verticals: [number, number, number][] = []; // x, rowBottom, rowTop (unit)
  for (let r = 0; r < H; r++) {
    const off = brick && r % 2 === 1 ? 0.5 : 0;
    for (let k = Math.ceil((0 - off)); off + k <= W + 0.001; k++) {
      const x = off + k;
      if (x >= -0.001 && x <= W + 0.001) verticals.push([x, r, r + 1]);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "6px 4px" }}>
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ maxWidth: "100%" }}>
        {/* grid: horizontal lines + brick verticals */}
        {Array.from({ length: H + 1 }).map((_, r) => (
          <line key={`h${r}`} x1={xP(0)} y1={yP(r)} x2={xP(W)} y2={yP(r)} stroke="#e2e8f0" strokeWidth={1.5} />
        ))}
        {verticals.map(([x, y0, y1], i) => (
          <line key={`v${i}`} x1={xP(x)} y1={yP(y0)} x2={xP(x)} y2={yP(y1)} stroke="#e2e8f0" strokeWidth={1.5} />
        ))}

        {/* tilted square */}
        <motion.polygon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          points={poly}
          fill="#dbeafe"
          stroke="#4338ca"
          strokeWidth={2.5}
        />

        {/* slope triangle on side AB (final) */}
        <AnimatePresence>
          {final && (
            <motion.g key="tri" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <line x1={xP(A[0])} y1={yP(A[1])} x2={xP(corner[0])} y2={yP(corner[1])} stroke="#ea580c" strokeWidth={2} strokeDasharray="5 3" />
              <line x1={xP(corner[0])} y1={yP(corner[1])} x2={xP(B[0])} y2={yP(B[1])} stroke="#ea580c" strokeWidth={2} strokeDasharray="5 3" />
              <text x={(xP(A[0]) + xP(corner[0])) / 2} y={yP(A[1]) + 14} fontSize={13} textAnchor="middle" fill="#ea580c" fontWeight={800} fontFamily={numberFont}>{dx}</text>
              <text x={xP(corner[0]) + 10} y={(yP(corner[1]) + yP(B[1])) / 2} fontSize={13} textAnchor="middle" fill="#ea580c" fontWeight={800} fontFamily={numberFont}>{dy}</text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* vertices */}
        {[A, B, C, D].map(([x, y], i) => (
          <circle key={`p${i}`} cx={xP(x)} cy={yP(y)} r={5} fill="#1f2a44" />
        ))}
        <text x={xP(A[0]) - 8} y={yP(A[1]) + 18} fontSize={12} textAnchor="middle" fill="#1f2a44" fontWeight={700} fontFamily={numberFont}>A</text>
        <text x={xP(B[0]) + 10} y={yP(B[1]) - 8} fontSize={12} textAnchor="middle" fill="#1f2a44" fontWeight={700} fontFamily={numberFont}>B</text>
      </svg>

      <div style={{ fontFamily: numberFont, fontSize: 14, fontWeight: 700, color: "#334155" }}>
        A → B differs by ({dx}, {dy})
      </div>

      <AnimatePresence>
        {final && (
          <motion.div
            key="area"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: numberFont, fontSize: 18, fontWeight: 800, color: "#1f2a44", textAlign: "center" }}
          >
            side = √({dx}² + {dy}²) = √{area} → area = {area}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {final && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
