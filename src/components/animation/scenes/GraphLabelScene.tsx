import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const HOT = "#4338ca";
const PICK = "#f59e0b";
const WIN = "#16a34a";

/**
 * Label the nodes of a graph so that every edge joins labels far enough apart.
 * The busiest nodes are the tightest constrained, so they take the extreme
 * labels; the rest follow. The scene checks the supplied labelling really
 * satisfies the rule on every edge and says so if it does not, and sums the
 * asked-for nodes itself.
 * Data: { nodes:[{id,x,y}], edges:[[a,b],...], solution:{id:label}, minDiff,
 *         firstReveal:[ids], askFor:[ids] }.
 */
export function GraphLabelScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const nodes = (Array.isArray(data.nodes) ? data.nodes : []).map((r) => {
    const o = (r ?? {}) as Record<string, unknown>;
    return { id: o.id != null ? String(o.id) : "", x: num(o.x, 0), y: num(o.y, 0) };
  });
  const edges: [string, string][] = (Array.isArray(data.edges) ? data.edges : [])
    .filter((e) => Array.isArray(e) && e.length >= 2)
    .map((e) => [String((e as unknown[])[0]), String((e as unknown[])[1])]);
  const sol = (data.solution ?? {}) as Record<string, number>;
  const minDiff = Math.max(1, num(data.minDiff, 2));
  const firstReveal = Array.isArray(data.firstReveal) ? data.firstReveal.map((v) => String(v)) : [];
  const askFor = Array.isArray(data.askFor) ? data.askFor.map((v) => String(v)) : [];

  const labelOf = (id: string) => num(sol[id], NaN);
  const deg: Record<string, number> = {};
  nodes.forEach((n) => (deg[n.id] = 0));
  edges.forEach(([a, b]) => {
    deg[a] = (deg[a] ?? 0) + 1;
    deg[b] = (deg[b] ?? 0) + 1;
  });
  const maxDeg = Math.max(0, ...Object.values(deg));
  // does the given labelling actually obey the rule?
  const bad = edges.filter(([a, b]) => Math.abs(labelOf(a) - labelOf(b)) < minDiff);
  const askSum = askFor.reduce((s, id) => s + labelOf(id), 0);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showSome = step >= 1 || isFinal;
  const showAll = step >= 2 || isFinal;
  const shownIds = new Set(showAll ? nodes.map((n) => n.id) : showSome ? firstReveal : []);

  const W = 340;
  const H = 232;
  const at = (id: string) => nodes.find((n) => n.id === id);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {edges.map(([a, b], i) => {
          const p = at(a);
          const q = at(b);
          if (!p || !q) return null;
          const lit = shownIds.has(a) && shownIds.has(b);
          return (
            <motion.line
              key={i}
              x1={p.x}
              y1={p.y}
              x2={q.x}
              y2={q.y}
              stroke={lit ? "#a5b4fc" : "#cbd5e1"}
              strokeWidth={lit ? 2 : 1.4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: i * 0.02 }}
            />
          );
        })}
        {nodes.map((n, i) => {
          const shown = shownIds.has(n.id);
          const busiest = deg[n.id] === maxDeg;
          const asked = askFor.includes(n.id);
          return (
            <motion.g
              key={n.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.05 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect
                x={n.x - 15}
                y={n.y - 14}
                width={30}
                height={28}
                rx={5}
                fill={shown ? (asked ? "#dcfce7" : "#eef2ff") : "#f8fafc"}
                stroke={shown ? (asked ? WIN : HOT) : busiest && !showAll ? PICK : "#cbd5e1"}
                strokeWidth={shown || (busiest && !showAll) ? 2.2 : 1.3}
              />
              <text x={n.x} y={n.y - 2} textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                {n.id}
              </text>
              <AnimatePresence>
                {shown && (
                  <motion.text
                    key="lab"
                    x={n.x}
                    y={n.y + 10}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    fill={asked ? "#166534" : INK}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {labelOf(n.id)}
                  </motion.text>
                )}
                {!shown && (
                  <motion.text key="deg" x={n.x} y={n.y + 10} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={busiest ? PICK : "#94a3b8"} fontFamily={numberFont}>
                    {deg[n.id]} links
                  </motion.text>
                )}
              </AnimatePresence>
            </motion.g>
          );
        })}
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
          color: isFinal ? "#166534" : showSome ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : showSome ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showSome ? "#fde68a" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {!showSome
          ? `linked pods must differ by at least ${minDiff}`
          : !showAll
          ? `the ${maxDeg}-link pods are hardest — they take the extremes`
          : !isFinal
          ? `the rest fit around them`
          : `${askFor.map((id) => `${id}=${labelOf(id)}`).join(" + ")} = ${askSum}`}
      </motion.span>

      {bad.length > 0 && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: "#dc2626" }}>
          {bad.length} edge(s) break the rule
        </span>
      )}

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
