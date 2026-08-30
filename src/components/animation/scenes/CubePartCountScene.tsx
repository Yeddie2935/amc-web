import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const NAVY = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";

// Isometric cube vertices: front square ABCD, back square EFGH (H hidden).
const ox = 34, oy = 78, u = 58, dp = 30;
const A = { x: ox, y: oy };
const B = { x: ox + u, y: oy };
const C = { x: ox + u, y: oy + u };
const D = { x: ox, y: oy + u };
const E = { x: ox + dp, y: oy - dp };
const F = { x: ox + u + dp, y: oy - dp };
const G = { x: ox + u + dp, y: oy + u - dp };
const H = { x: ox + dp, y: oy + u - dp };

type Pt = { x: number; y: number };
const solidEdges: [Pt, Pt][] = [
  [A, B], [B, C], [C, D], [D, A],
  [E, F], [F, G],
  [A, E], [B, F], [C, G],
];
const dashedEdges: [Pt, Pt][] = [
  [D, H], [H, E], [H, G],
];
const corners: Pt[] = [A, B, C, D, E, F, G, H];

function TallyRow({ label, value, show, color }: { label: string; value: number; show: boolean; color: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, opacity: show ? 1 : 0.35 }}>
      <span>{label}</span>
      <span style={{ color }}>{show ? value : "—"}</span>
    </div>
  );
}

// A cube's edges, corners, and faces highlighted in turn on one isometric
// drawing, tallied to the side, then summed to the final answer.
export function CubePartCountScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const edgesCount = num(data.edges, 12);
  const cornersCount = num(data.corners, 8);
  const facesCount = num(data.faces, 6);
  const sum = edgesCount + cornersCount + facesCount;
  const last = totalSteps - 1;

  const showEdges = step >= 0;
  const showCorners = step >= 1;
  const showFaces = step >= 2;
  const showSum = step >= 3;
  const showAnswer = step >= last;

  const frontPts = `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`;
  const topPts = `${A.x},${A.y} ${E.x},${E.y} ${F.x},${F.y} ${B.x},${B.y}`;
  const rightPts = `${B.x},${B.y} ${F.x},${F.y} ${G.x},${G.y} ${C.x},${C.y}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "6px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <svg width={180} height={150} viewBox="0 0 180 150">
          <motion.polygon points={frontPts} fill={INDIGO} initial={false} animate={{ opacity: showFaces ? 0.22 : 0 }} transition={{ duration: 0.4 }} />
          <motion.polygon points={topPts} fill={INDIGO} initial={false} animate={{ opacity: showFaces ? 0.34 : 0 }} transition={{ duration: 0.4, delay: 0.1 }} />
          <motion.polygon points={rightPts} fill={INDIGO} initial={false} animate={{ opacity: showFaces ? 0.46 : 0 }} transition={{ duration: 0.4, delay: 0.2 }} />

          {[...solidEdges, ...dashedEdges].map(([p1, p2], i) => (
            <line key={`base${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#cbd5e1" strokeWidth={1.5} />
          ))}

          {solidEdges.map(([p1, p2], i) => (
            <motion.line
              key={`e${i}`}
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={NAVY} strokeWidth={3} strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: showEdges ? 1 : 0, opacity: showEdges ? 1 : 0 }}
              transition={{ duration: 0.3, delay: showEdges ? i * 0.05 : 0 }}
            />
          ))}
          {dashedEdges.map(([p1, p2], i) => (
            <motion.line
              key={`d${i}`}
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={NAVY} strokeWidth={2.5} strokeDasharray="4 3" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: showEdges ? 1 : 0, opacity: showEdges ? 0.85 : 0 }}
              transition={{ duration: 0.3, delay: showEdges ? (solidEdges.length + i) * 0.05 : 0 }}
            />
          ))}

          {corners.map((p, i) => (
            <motion.circle
              key={`c${i}`}
              cx={p.x} cy={p.y} r={4.5}
              fill={p === H ? "#94a3b8" : GREEN}
              stroke="#fff" strokeWidth={1}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={{ scale: 0 }}
              animate={{ scale: showCorners ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 16, delay: showCorners ? i * 0.06 : 0 }}
            />
          ))}
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: numberFont, fontSize: 13, fontWeight: 700, color: NAVY, minWidth: 90 }}>
          <TallyRow label="Edges" value={edgesCount} show={showEdges} color={NAVY} />
          <TallyRow label="Corners" value={cornersCount} show={showCorners} color={GREEN} />
          <TallyRow label="Faces" value={facesCount} show={showFaces} color={INDIGO} />
        </div>
      </div>

      <AnimatePresence>
        {showFaces && !showSum && (
          <motion.div
            key="hidden-note"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ fontSize: 11, color: "#64748b", fontFamily: numberFont, textAlign: "center", maxWidth: 260 }}
          >
            3 faces visible here + 3 hidden behind = 6 faces
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSum && (
          <motion.div
            key="sum"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 16, fontWeight: 800, color: NAVY, fontFamily: numberFont }}
          >
            {edgesCount} + {cornersCount} + {facesCount} = <span style={{ color: showAnswer ? GREEN : NAVY }}>{sum}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAnswer && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
