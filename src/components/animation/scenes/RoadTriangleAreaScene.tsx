import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const BASE_C = "#0d9488";
const HIGH_C = "#b45309";
const WIN = "#16a34a";
const BAD = "#dc2626";

const parseChoice = (text: string) => Number(String(text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));
const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(2))));

/**
 * A triangular plot between two roads meeting at a point and a railroad
 * running perpendicular to the street through them. The railroad segment CD
 * is the base, the street distance to the railroad is the height, and a beat
 * is spent on the classic slip of using the whole railroad span BD instead of
 * just CD — which prices out to another answer choice.
 * Data: { roadDist, bcDist, cdDist }.
 */
export function RoadTriangleAreaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const roadDist = Math.max(0.5, num(data.roadDist, 3));
  const bcDist = Math.max(0.5, num(data.bcDist, 3));
  const cdDist = Math.max(0.5, num(data.cdDist, 3));

  const ax = 0, ay = 0;
  const bx = roadDist, by = 0;
  const cx = roadDist, cy = bcDist;
  const dx = roadDist, dy = bcDist + cdDist;

  const base = cdDist;
  const height = roadDist;
  const area = 0.5 * base * height;
  const matches = problem.shortAnswer == null || Math.abs(Number(problem.shortAnswer) - area) < 1e-9;
  const failure = !matches ? `check failed: ½ × ${tidy(base)} × ${tidy(height)} = ${tidy(area)}, stored answer is ${problem.shortAnswer}` : "";

  const bdSpan = bcDist + cdDist;
  const trapArea = 0.5 * bdSpan * height;
  const trapChoice = (problem.choices ?? []).find((c) => Math.abs(parseChoice(c.text) - trapArea) < 1e-9);

  const lastStep = totalSteps - 1;
  const showBase = step >= 1;
  const showHeight = step >= 2;
  const showTrap = step >= 3;
  const isFinal = step >= lastStep;

  // ---- geometry: a coordinate grid, y up ----
  const W = 300;
  const xMin = -1.5, xMax = roadDist + 2;
  const yMin = -1.5, yMax = dy + 1.5;
  const padL = 14;
  const gTop = 14;
  const cell = Math.min(30, (W - padL - 14) / (xMax - xMin));
  const gW = (xMax - xMin) * cell;
  const gH = (yMax - yMin) * cell;
  const H = gTop + gH + 16;
  const X = (x: number) => padL + (x - xMin) * cell;
  const Y = (y: number) => gTop + (yMax - y) * cell;

  const caption = isFinal
    ? `½ × ${tidy(base)} × ${tidy(height)} = ${tidy(area)} sq mi`
    : showTrap
    ? trapChoice
      ? `using BD = ${tidy(bdSpan)} as the base gives ${tidy(trapArea)} — choice ${trapChoice.label}, but the plot's base is only CD`
      : `BD = ${tidy(bdSpan)} is the whole railroad span, not the plot's own base`
    : showHeight
    ? `AB is perpendicular to the railroad: height = ${tidy(height)}`
    : showBase
    ? `base CD = ${tidy(base)} miles, along the railroad`
    : `plot ACD sits between the two roads and the railroad`;

  const note = failure || (isFinal ? `base × height = ${tidy(base)} × ${tidy(height)} = ${tidy(base * height)}, half of that is ${tidy(area)}` : "");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {/* Main St */}
        <line x1={padL} y1={Y(0)} x2={padL + gW} y2={Y(0)} stroke="#94a3b8" strokeWidth={1.4} />
        <text x={padL + gW - 4} y={Y(0) - 5} textAnchor="end" fontSize="8.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          Main St
        </text>

        {/* railroad: double line with cross-ties */}
        <line x1={X(roadDist) - 2.5} y1={gTop} x2={X(roadDist) - 2.5} y2={gTop + gH} stroke="#64748b" strokeWidth={1.2} />
        <line x1={X(roadDist) + 2.5} y1={gTop} x2={X(roadDist) + 2.5} y2={gTop + gH} stroke="#64748b" strokeWidth={1.2} />
        {Array.from({ length: Math.round((yMax - yMin) * 2) }).map((_, i) => (
          <line
            key={i}
            x1={X(roadDist) - 4.5}
            x2={X(roadDist) + 4.5}
            y1={gTop + i * (cell / 2)}
            y2={gTop + i * (cell / 2)}
            stroke="#94a3b8"
            strokeWidth={1}
          />
        ))}

        {/* the two roads, from A, overshooting slightly for a road-like feel */}
        {[
          { tx: cx, ty: cy, label: "Aspen" },
          { tx: dx, ty: dy, label: "Brown" },
        ].map((r) => {
          const dxv = r.tx - ax, dyv = r.ty - ay;
          const len = Math.hypot(dxv, dyv);
          const ux = dxv / len, uy = dyv / len;
          const ex = r.tx + ux * cell * 0.6, ey = r.ty + uy * cell * 0.6;
          const sx = ax - ux * cell * 0.35, sy = ay - uy * cell * 0.35;
          return (
            <g key={r.label}>
              <line x1={X(sx)} y1={Y(sy)} x2={X(ex)} y2={Y(ey)} stroke={INK} strokeWidth={1.4} />
              <text
                x={X((ax + r.tx) / 2) - uy * 12}
                y={Y((ay + r.ty) / 2) - ux * 12}
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="700"
                fill="#64748b"
                fontFamily={numberFont}
              >
                {r.label}
              </text>
            </g>
          );
        })}

        {/* the plot itself */}
        <motion.polygon
          points={`${X(ax)},${Y(ay)} ${X(cx)},${Y(cy)} ${X(dx)},${Y(dy)}`}
          fill="rgba(67,56,202,0.16)"
          stroke={IND}
          strokeWidth={2}
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* base CD, measured */}
        <AnimatePresence>
          {showBase && (
            <motion.g key="base" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.line
                x1={X(cx) + 10}
                y1={Y(cy)}
                x2={X(dx) + 10}
                y2={Y(dy)}
                stroke={BASE_C}
                strokeWidth={2.6}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }}
              />
              <rect x={X(cx) + 14} y={(Y(cy) + Y(dy)) / 2 - 8} width={34} height={16} rx={7} fill="#ccfbf1" stroke={BASE_C} strokeWidth={1.1} />
              <text x={X(cx) + 31} y={(Y(cy) + Y(dy)) / 2 + 4} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#0f766e" fontFamily={numberFont}>
                {tidy(base)}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* height AB, measured, with a right-angle mark */}
        <AnimatePresence>
          {showHeight && (
            <motion.g key="height" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.line
                x1={X(ax)}
                y1={Y(ay) + 10}
                x2={X(bx)}
                y2={Y(by) + 10}
                stroke={HIGH_C}
                strokeWidth={2.6}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }}
              />
              <rect x={X(bx) - 3} y={Y(by) - 3} width={7} height={7} fill="none" stroke="#94a3b8" strokeWidth={1} />
              <rect x={(X(ax) + X(bx)) / 2 - 12} y={Y(ay) + 14} width={24} height={15} rx={7} fill="#fef3c7" stroke={HIGH_C} strokeWidth={1.1} />
              <text x={(X(ax) + X(bx)) / 2} y={Y(ay) + 25} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#92400e" fontFamily={numberFont}>
                {tidy(height)}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the trap: BD, the whole railroad span, crossed out */}
        <AnimatePresence>
          {showTrap && !isFinal && (
            <motion.g key="trap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.line
                x1={X(bx) - 12}
                y1={Y(by)}
                x2={X(dx) - 12}
                y2={Y(dy)}
                stroke={BAD}
                strokeWidth={2}
                strokeDasharray="4 3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }}
              />
              <text x={X(bx) - 16} y={(Y(by) + Y(dy)) / 2} textAnchor="end" fontSize="9" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                BD={tidy(bdSpan)} ✗
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the vertices */}
        {[
          { l: "A", x: ax, y: ay, dx: -8, dy: 12 },
          { l: "B", x: bx, y: by, dx: 10, dy: 12 },
          { l: "C", x: cx, y: cy, dx: 12, dy: 4 },
          { l: "D", x: dx, y: dy, dx: 12, dy: -3 },
        ].map((p, i) => (
          <motion.g
            key={p.l}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 16, delay: i * 0.08 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <circle cx={X(p.x)} cy={Y(p.y)} r={3.4} fill={INK} stroke="#fff" strokeWidth={1.2} />
            <text x={X(p.x) + p.dx} y={Y(p.y) + p.dy} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {p.l}
            </text>
          </motion.g>
        ))}
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
          color: isFinal ? "#166534" : showTrap ? "#dc2626" : "#4338ca",
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
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
            style={{
              fontFamily: numberFont,
              fontSize: 11.5,
              fontWeight: 700,
              color: failure ? BAD : "#94a3b8",
              textAlign: "center",
            }}
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
