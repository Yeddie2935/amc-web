import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

function pointAt(cx: number, cy: number, deg: number, r: number) {
  const t = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(t), y: cy - r * Math.cos(t) };
}

/** n team dots on a circle with every connecting edge drawn — a complete graph. */
function TeamGraph({ n, cx, cy, r, color, revealEdges }: { n: number; cx: number; cy: number; r: number; color: string; revealEdges: boolean }) {
  const nodes = Array.from({ length: n }, (_, i) => pointAt(cx, cy, (360 / n) * i, r));
  const edges: [number, number][] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) edges.push([i, j]);

  return (
    <g>
      <AnimatePresence>
        {revealEdges &&
          edges.map(([i, j], k) => (
            <motion.line
              key={`${i}-${j}`}
              x1={nodes[i].x}
              y1={nodes[i].y}
              x2={nodes[j].x}
              y2={nodes[j].y}
              stroke={color}
              strokeWidth={1.4}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.55 }}
              transition={{ duration: 0.25, delay: k * 0.02 }}
            />
          ))}
      </AnimatePresence>
      {nodes.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={7}
          fill="#fff"
          stroke={color}
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.04 }}
        />
      ))}
    </g>
  );
}

/**
 * A round-robin schedule: n teams, every pair plays once, so the game count
 * is C(n,2). Six beats: (0) the setup, every pair plays exactly once;
 * (1) the trap — trying a real answer choice (6 teams) as a complete graph
 * only produces 15 games, short of 21; (2) the equation n(n−1)/2=21 is set
 * up; (3) solved by finding consecutive integers multiplying to 42;
 * (4) the true team count's graph is drawn and its edges counted to
 * confirm 21; (5) the badge. Data: { totalGames }.
 */
export function RoundRobinGraphScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const totalGames = Math.round(num(data.totalGames, 21));

  const product = totalGames * 2;
  let n = 0;
  for (let k = 2; k <= product; k++) {
    if (k * (k - 1) === product) {
      n = k;
      break;
    }
  }
  const trialN = n - 1;
  const trialGames = (trialN * (trialN - 1)) / 2;
  const trap = (problem.choices ?? []).find((c) => c.text.trim() === String(trialN));

  const last = totalSteps - 1;
  const showTrial = step === 1;
  const showEquation = step >= 2;
  const showSolve = step >= 3;
  const showFinalNodes = step >= 2;
  const showFinal = step >= 4;
  const isFinal = step >= last;

  const W = 220;
  const H = 190;
  const cx = W / 2;
  const cy = 100;
  const r = 72;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 240 }}>
        {step === 0 && (
          <text x={cx} y={cy} textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM} fontFamily={FONT}>
            n teams, unknown
          </text>
        )}
        {showTrial && <TeamGraph n={trialN} cx={cx} cy={cy} r={r} color={BAD} revealEdges />}
        {showFinalNodes && !showTrial && <TeamGraph n={n} cx={cx} cy={cy} r={r} color={isFinal ? WIN : MARK} revealEdges={showFinal} />}
        {(showTrial || showFinalNodes) && (
          <text x={cx} y={H - 8} textAnchor="middle" fontSize="11" fontWeight="800" fill={showTrial ? BAD : isFinal ? WIN : MARK} fontFamily={FONT}>
            {showTrial
              ? `${trialN} teams: ${trialGames} games`
              : showFinal
              ? `${n} teams: ${(n * (n - 1)) / 2} games`
              : showSolve
              ? `${n} teams`
              : `? teams`}
          </text>
        )}
      </svg>

      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontFamily: FONT,
          fontSize: 11,
          fontWeight: 800,
          textAlign: "center",
          maxWidth: 300,
          color: isFinal ? WIN : showFinal ? MARK : showSolve ? MARK : showEquation ? MARK : showTrial ? BAD : DIM,
        }}
      >
        {isFinal
          ? `${n} teams`
          : showFinal
          ? `${n} teams give ${(n * (n - 1)) / 2} games — matches the ${totalGames} played`
          : showSolve
          ? `${n} × ${trialN} = ${product}, so n = ${n}`
          : showEquation
          ? `n(n−1) ÷ 2 = ${totalGames}, so n(n−1) = ${product}`
          : showTrial
          ? `${trialN} teams only give ${trialGames} games${trap ? ` — matches choice ${trap.label}` : ""}, short of ${totalGames}`
          : `each pair of teams plays exactly one game`}
      </motion.div>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
