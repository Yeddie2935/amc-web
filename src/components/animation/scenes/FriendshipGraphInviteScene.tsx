import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const NAVY = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const DIM = "#94a3b8";

const SARAH = { x: 170, y: 120 };
// Hand-placed schematic layout (topology-accurate, not pixel-matched to the
// source diagram): direct friends ring around Sarah, friends-of-friends
// branch outward from their friend, and the disconnected pieces sit apart.
const POS: Record<number, [number, number]> = {
  1: [159, 56], 3: [202, 64], 4: [231, 98], 6: [231, 142], 7: [202, 176],
  9: [159, 184], 13: [120, 162], 14: [105, 120], 16: [120, 78],
  8: [278, 81], 12: [150, 233], 15: [59, 150], 18: [59, 90], 17: [82, 46],
  11: [325, 64], 19: [88, 263],
  0: [50, 260], 2: [20, 300], 5: [62, 310], 10: [105, 285],
};

/**
 * Sarah's classmates form a friendship graph; the invite list is her direct
 * friends plus anyone directly connected to one of those friends — computed
 * by real graph adjacency (BFS one and two hops from Sarah), not asserted.
 * Whoever is left over (an isolated dot, a separate triangle, or too many
 * hops away) doesn't get invited.
 * Data: { totalNodes, sarahFriends: [ids], edges: [[a,b], ...] }.
 */
export function FriendshipGraphInviteScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const totalNodes = Math.round(num(data.totalNodes, 20));
  const sarahFriends: number[] = Array.isArray(data.sarahFriends) ? data.sarahFriends.map(Number) : [];
  const edges: [number, number][] = Array.isArray(data.edges) ? (data.edges as unknown[]).map((e) => [Number((e as number[])[0]), Number((e as number[])[1])]) : [];

  const neighbors = (id: number) => edges.filter(([a, b]) => a === id || b === id).map(([a, b]) => (a === id ? b : a));
  const friendSet = new Set(sarahFriends);
  const fofSet = new Set<number>();
  sarahFriends.forEach((f) => neighbors(f).forEach((n) => { if (!friendSet.has(n)) fofSet.add(n); }));
  const invited = new Set([...friendSet, ...fofSet]);
  const uninvited = Array.from({ length: totalNodes }, (_, i) => i).filter((i) => !invited.has(i));

  const last = totalSteps - 1;
  const showFriends = step >= 1;
  const showFof = step >= 2;
  const isFinal = step >= last;

  const nodeColor = (id: number) => {
    if (showFof && fofSet.has(id)) return GREEN;
    if (showFriends && friendSet.has(id)) return INDIGO;
    if (isFinal && uninvited.includes(id)) return DIM;
    return "#cbd5e1";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox="0 0 345 330" width="100%" style={{ maxWidth: 340 }}>
        {edges.map(([a, b], i) => {
          const p1 = POS[a];
          const p2 = POS[b];
          if (!p1 || !p2) return null;
          return <line key={i} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#cbd5e1" strokeWidth={1.3} />;
        })}
        {sarahFriends.map((f, i) => {
          const p = POS[f];
          if (!p) return null;
          return (
            <motion.line
              key={`sf${f}`}
              x1={SARAH.x}
              y1={SARAH.y}
              x2={p[0]}
              y2={p[1]}
              stroke={showFriends ? INDIGO : "#cbd5e1"}
              strokeWidth={showFriends ? 1.8 : 1.3}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            />
          );
        })}

        <g>
          <circle cx={SARAH.x} cy={SARAH.y} r={16} fill="#fff" stroke={NAVY} strokeWidth={2} />
          <text x={SARAH.x} y={SARAH.y + 3} textAnchor="middle" fontSize="8" fontWeight="900" fill={NAVY} fontFamily={FONT}>
            Sarah
          </text>
        </g>

        {Array.from({ length: totalNodes }, (_, id) => id).map((id) => {
          const p = POS[id];
          if (!p) return null;
          const color = nodeColor(id);
          return (
            <motion.circle
              key={id}
              cx={p[0]}
              cy={p[1]}
              r={6}
              fill={color}
              stroke="#fff"
              strokeWidth={1}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: id * 0.02 }}
            />
          );
        })}
      </svg>

      <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: NAVY, textAlign: "center", maxWidth: 320 }}>
        {!showFriends
          ? `${totalNodes} classmates, connected by friendships`
          : !showFof
          ? `${sarahFriends.length} classmates are Sarah's direct friends — invited`
          : `${fofSet.size} more are friends of a friend — also invited`}
      </motion.div>

      <AnimatePresence>
        {isFinal && (
          <motion.div key="tally" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 14, fontWeight: 800, color: GREEN, textAlign: "center" }}>
            {invited.size} invited, {uninvited.length} not invited
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
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
