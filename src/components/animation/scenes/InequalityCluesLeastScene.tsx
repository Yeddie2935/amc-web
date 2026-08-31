import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";
const COLORS = ["#4338ca", "#0d9488", "#db2777"];

type Edge = { gt: string; lt: string; clue: number };

function parseEdges(raw: unknown): Edge[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const o = (r ?? {}) as Record<string, unknown>;
    return { gt: String(o.gt ?? ""), lt: String(o.lt ?? ""), clue: Number(o.clue ?? 0) };
  });
}

/**
 * Several "more than / less than" clues between named people, each drawn as
 * a directed arrow (greater → lesser) laid out left-to-right so every arrow
 * points forward. Rather than asserting who has the least, every person's
 * out-degree (how many times they appear as the greater side) is counted
 * from the actual edges; the one and only person who never appears as
 * "greater than" anybody is the least — discovered, not declared.
 * Data: { people: string[], edges: [{gt, lt, clue}, ...] }.
 */
export function InequalityCluesLeastScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const people = Array.isArray(data.people) ? (data.people as unknown[]).map(String) : [];
  const edges = parseEdges(data.edges);
  const clueCount = Math.max(0, ...edges.map((e) => e.clue));

  const outDeg: Record<string, number> = {};
  people.forEach((p) => (outDeg[p] = 0));
  edges.forEach((e) => {
    if (outDeg[e.gt] != null) outDeg[e.gt]++;
  });
  const least = people.find((p) => outDeg[p] === 0 && edges.some((e) => e.lt === p));
  const answer = answerOf(problem);
  const valid = least === problem.shortAnswer;

  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), last);
  // 0: setup, 1..clueCount: reveal that clue's edges, last: conclude
  const currentClue = beat >= 1 && beat <= clueCount ? beat : null;
  const shownClues = beat >= 1 ? Math.min(beat, clueCount) : 0;
  const showConclude = beat >= clueCount + 1;

  const W = 400;
  const H = 220;
  const nodeY = 60;
  const nodeGap = (W - 60) / (people.length - 1 || 1);
  const nodeX = (i: number) => 30 + i * nodeGap;

  const visibleEdges = edges.filter((e) => e.clue <= shownClues);

  const caption =
    beat === 0
      ? "five people, ranked only by clues comparing pairs"
      : currentClue != null
      ? `clue ${currentClue}: ${edges
          .filter((e) => e.clue === currentClue)
          .map((e) => `${e.gt} > ${e.lt}`)
          .join(", ")}`
      : `${least ?? "?"} is never the greater side of any clue — the least`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px", boxSizing: "border-box" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 430, minWidth: 0, display: "block" }} aria-label="Five people with directed more-than arrows between them, from clues">
        <defs>
          {COLORS.map((c, i) => (
            <marker key={i} id={`arrow${i}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={c} />
            </marker>
          ))}
        </defs>

        {/* edges, drawn as arcs so parallel arrows don't collide, ending short of the node so the arrowhead is visible */}
        {visibleEdges.map((e, i) => {
          const from = people.indexOf(e.gt);
          const to = people.indexOf(e.lt);
          if (from < 0 || to < 0) return null;
          const x1 = nodeX(from);
          const x2 = nodeX(to);
          const dist = Math.abs(to - from);
          const bow = 18 + dist * 6;
          const midX = (x1 + x2) / 2;
          const colorIdx = (e.clue - 1) % COLORS.length;
          const color = COLORS[colorIdx];
          const dir = x2 > x1 ? -1 : 1;
          return (
            <motion.path
              key={i}
              d={`M ${x1},${nodeY} Q ${midX},${nodeY - bow} ${x2 + dir * 20},${nodeY}`}
              fill="none"
              stroke={color}
              strokeWidth="2"
              markerEnd={`url(#arrow${colorIdx})`}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.15 }}
            />
          );
        })}

        {/* nodes */}
        {people.map((p, i) => {
          const isLeast = showConclude && p === least;
          return (
            <motion.g key={p} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <circle cx={nodeX(i)} cy={nodeY} r="20" fill={isLeast ? "#fef2f2" : "#eef2ff"} stroke={isLeast ? RED : IND} strokeWidth={isLeast ? 2.6 : 1.6} />
              <text x={nodeX(i)} y={nodeY + 4} textAnchor="middle" fontSize="10.5" fontWeight="900" fill={isLeast ? RED : IND} fontFamily={FONT}>
                {p}
              </text>
              {showConclude && (
                <motion.text x={nodeX(i)} y={nodeY + 40} textAnchor="middle" fontSize="10" fontWeight="850" fill={isLeast ? RED : DIM} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}>
                  {outDeg[p]}×
                </motion.text>
              )}
            </motion.g>
          );
        })}

        {showConclude && (
          <text x={W / 2} y={nodeY + 58} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>
            times each person is the "greater" side
          </text>
        )}

        <SvgAnswerBadge show={showConclude} answer={answer} cx={W / 2} y={nodeY + 76} width={100} />
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 11.5,
          fontWeight: 800,
          color: showConclude ? (valid ? "#166534" : RED) : INK,
          background: showConclude ? (valid ? "#dcfce7" : "#fef2f2") : "#eef2ff",
          border: `1px solid ${showConclude ? (valid ? "#bbf7d0" : "#fecaca") : "#c7d2fe"}`,
          padding: "5px 12px",
          borderRadius: 10,
          textAlign: "center",
          maxWidth: 380,
        }}
      >
        {caption}
      </motion.span>
    </div>
  );
}
