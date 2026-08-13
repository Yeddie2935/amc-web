import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const FILL = "#e0e7ff";
const CUT = "#f59e0b";
const WIN = "#16a34a";

/**
 * Isosceles trapezoids with a fixed base angle, equal legs and a fixed integer
 * perimeter. Dropping a perpendicular from each top vertex cuts off a right
 * triangle whose horizontal leg is L·cos(angle), so the long side exceeds the
 * short one by 2L·cos(angle); with 60° that is exactly L. The perimeter equation
 * is then solved over the integers by search, and every solution is drawn to a
 * common scale.
 * Data: { perimeter, angleDeg }.
 */
export function TrapezoidFamilyScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const P = Math.max(3, Math.round(num(data.perimeter, 30)));
  const ang = num(data.angleDeg, 60);
  const c = Math.cos((ang * Math.PI) / 180);
  const h = Math.sin((ang * Math.PI) / 180);

  // short side a, leg L, long side b = a + 2Lc; perimeter a + b + 2L = P
  const sols: { a: number; b: number; L: number }[] = [];
  for (let L = 1; L < P; L++) {
    for (let a = 1; a < P; a++) {
      // cos(60°) is 0.5000000000000001 in floating point, so round then verify
      const braw = a + 2 * L * c;
      const b = Math.round(braw);
      if (Math.abs(braw - b) > 1e-9) continue;
      if (Math.abs(a + b + 2 * L - P) > 1e-9) continue;
      if (b <= a) continue;
      sols.push({ a, b, L });
    }
  }
  sols.sort((x, y) => x.L - y.L);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showCut = step >= 1 || isFinal;
  const showEq = step >= 2 || isFinal;

  const W = 340;
  const H = isFinal ? 150 : 160;

  // one trapezoid, drawn with a given px-per-unit
  const Trap = ({ a, b, L, s, ox, oy, labels }: { a: number; b: number; L: number; s: number; ox: number; oy: number; labels?: boolean }) => {
    const hh = L * h * s;
    const B = { x: ox, y: oy };
    const C = { x: ox + b * s, y: oy };
    const A = { x: ox + L * c * s, y: oy - hh };
    const D = { x: ox + (b - L * c) * s, y: oy - hh };
    return (
      <g>
        <polygon points={`${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y} ${A.x},${A.y}`} fill={FILL} stroke={INK} strokeWidth={1.5} />
        {showCut && labels && (
          <>
            <line x1={A.x} y1={A.y} x2={A.x} y2={B.y} stroke={CUT} strokeWidth={1.5} strokeDasharray="4 3" />
            <line x1={D.x} y1={D.y} x2={D.x} y2={C.y} stroke={CUT} strokeWidth={1.5} strokeDasharray="4 3" />
            <text x={(B.x + A.x) / 2} y={B.y + 11} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#92400e" fontFamily={numberFont}>
              {Math.round(L * c * 100) / 100}
            </text>
            <text x={(C.x + D.x) / 2} y={B.y + 11} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#92400e" fontFamily={numberFont}>
              {Math.round(L * c * 100) / 100}
            </text>
          </>
        )}
        {labels && (
          <>
            <text x={(A.x + D.x) / 2} y={A.y - 5} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>{a}</text>
            <text x={(B.x + C.x) / 2} y={B.y + 22} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>{b}</text>
            <text x={(B.x + A.x) / 2 - 10} y={(B.y + A.y) / 2} textAnchor="end" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>{L}</text>
          </>
        )}
      </g>
    );
  };

  const demo = sols[Math.min(2, sols.length - 1)] ?? { a: 1, b: 2, L: 1 };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {!isFinal && <Trap a={demo.a} b={demo.b} L={demo.L} s={16} ox={(W - demo.b * 16) / 2} oy={120} labels />}
        {isFinal && (
          <>
            <text x={12} y={14} fontSize="10.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
              all {sols.length}, drawn to one scale
            </text>
            {sols.map((sl, i) => {
              const s = 7.6;
              const colW = W / sols.length;
              return (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.12 }}>
                  <Trap a={sl.a} b={sl.b} L={sl.L} s={s} ox={i * colW + (colW - sl.b * s) / 2} oy={108} />
                  <text x={i * colW + colW / 2} y={126} textAnchor="middle" fontSize="10" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                    {sl.a},{sl.b},{sl.L}
                  </text>
                </motion.g>
              );
            })}
          </>
        )}
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
          color: isFinal ? "#166534" : showCut ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : showCut ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showCut ? "#fde68a" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {!showCut
          ? `equal legs L, base angles ${ang}°`
          : !showEq
          ? `each corner cuts off ${Math.round(c * 100) / 100}·L, so long = short + ${Math.round(2 * c * 100) / 100}·L`
          : !isFinal
          ? `perimeter: a + (a + L) + 2L = 2a + 3L = ${P}`
          : `${sols.length} non-congruent trapezoids`}
      </motion.span>

      <AnimatePresence>
        {showEq && (
          <motion.span
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            2a = {P} − 3L needs L even → L = {sols.map((s) => s.L).join(", ")}
          </motion.span>
        )}
      </AnimatePresence>

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
