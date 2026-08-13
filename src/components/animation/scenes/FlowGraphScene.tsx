import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const OUT = "#dc2626";
const IN = "#0d9488";
const WIN = "#16a34a";
const DIM = "#cbd5e1";

interface Node {
  id: string;
  pop: number;
  x: number;
  y: number;
}
interface Edge {
  from: string;
  to: string;
  numer: number;
  den: number;
}

/**
 * People split between places by fractions along directed arrows: how many end
 * up at one target? The target keeps whoever it does not send away, and gains
 * each neighbour's fraction. Outgoing arrows are struck in red, incoming in
 * green, and every count is computed from the populations and fractions.
 * Data: { nodes:[{id,pop}], edges:[{from,to,numer,den}], target }.
 */
export function FlowGraphScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const target = data.target != null ? String(data.target) : "A";
  const raw = Array.isArray(data.nodes) ? data.nodes : [];
  // lay the places out on a circle so any node count works
  const nodes: Node[] = raw.map((r, i) => {
    const o = (r ?? {}) as Record<string, unknown>;
    const a = (-90 + (360 / Math.max(1, raw.length)) * i) * (Math.PI / 180);
    return {
      id: o.id != null ? String(o.id) : String(i),
      pop: num(o.pop, 0),
      x: 150 + 95 * Math.cos(a),
      y: 120 + 78 * Math.sin(a),
    };
  });
  const edges: Edge[] = (Array.isArray(data.edges) ? data.edges : []).map((e) => {
    const o = (e ?? {}) as Record<string, unknown>;
    return {
      from: o.from != null ? String(o.from) : "",
      to: o.to != null ? String(o.to) : "",
      numer: num(o.numer, 1),
      den: Math.max(1, num(o.den, 1)),
    };
  });
  const at = (id: string) => nodes.find((n) => n.id === id);
  const popOf = (id: string) => at(id)?.pop ?? 0;

  const outs = edges.filter((e) => e.from === target);
  const ins = edges.filter((e) => e.to === target);
  const sent = outs.reduce((s, e) => s + (popOf(e.from) * e.numer) / e.den, 0);
  const stay = popOf(target) - sent;
  const gained = ins.map((e) => ({ e, v: (popOf(e.from) * e.numer) / e.den }));
  const total = stay + gained.reduce((s, g) => s + g.v, 0);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showOut = step >= 1 || isFinal;
  const showIn = step >= 2 || isFinal;

  const W = 300;
  const H = 232;

  // a bowed arc so both directions of a pair stay apart
  const arc = (a: Node, b: Node) => {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const L = Math.hypot(dx, dy) || 1;
    const k = 22;
    const cxp = mx - (dy / L) * k;
    const cyp = my + (dx / L) * k;
    // stop short of the node circles
    const t = 24 / L;
    const sx = a.x + dx * t;
    const sy = a.y + dy * t;
    const ex = b.x - dx * t;
    const ey = b.y - dy * t;
    return { d: `M ${sx},${sy} Q ${cxp},${cyp} ${ex},${ey}`, lx: (sx + 2 * cxp + ex) / 4, ly: (sy + 2 * cyp + ey) / 4 };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        <defs>
          {[DIM, OUT, IN].map((c, i) => (
            <marker key={i} id={`fg-${i}`} markerWidth="7" markerHeight="7" refX="6" refY="2.6" orient="auto">
              <path d="M0,0 L6,2.6 L0,5.2 Z" fill={c} />
            </marker>
          ))}
        </defs>

        {edges.map((e, i) => {
          const a = at(e.from);
          const b = at(e.to);
          if (!a || !b) return null;
          const isOut = e.from === target;
          const isIn = e.to === target;
          const lit = (isOut && showOut) || (isIn && showIn);
          const col = lit ? (isOut ? OUT : IN) : DIM;
          const mk = lit ? (isOut ? 1 : 2) : 0;
          const g = arc(a, b);
          return (
            <motion.g key={i} animate={{ opacity: lit || (!showOut && !showIn) ? 1 : 0.4 }} transition={{ duration: 0.3 }}>
              <path d={g.d} fill="none" stroke={col} strokeWidth={lit ? 2.4 : 1.6} markerEnd={`url(#fg-${mk})`} />
              <text x={g.lx} y={g.ly + 3} textAnchor="middle" fontSize="11" fontWeight="800" fill={col} fontFamily={numberFont}>
                {e.numer}/{e.den}
              </text>
            </motion.g>
          );
        })}

        {nodes.map((nd, i) => {
          const isT = nd.id === target;
          return (
            <motion.g key={nd.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.08 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <circle cx={nd.x} cy={nd.y} r={21} fill={isT ? "#dcfce7" : "#eef2ff"} stroke={isT ? WIN : "#4338ca"} strokeWidth={2.2} />
              <text x={nd.x} y={nd.y + 1} textAnchor="middle" fontSize="14" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {nd.id}
              </text>
              <text x={nd.x} y={nd.y + 13} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                {nd.pop}
              </text>
            </motion.g>
          );
        })}

        {/* how many the target keeps */}
        <AnimatePresence>
          {showOut && at(target) && (
            <motion.text
              key="stay"
              x={at(target)!.x}
              y={at(target)!.y - 30}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              stay {stay}
            </motion.text>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={`${showOut}-${showIn}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : showIn ? "#0f766e" : showOut ? "#b91c1c" : "#4338ca",
          background: isFinal ? "#dcfce7" : showIn ? "#f0fdfa" : showOut ? "#fef2f2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showIn ? "#99f6e4" : showOut ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {!showOut
          ? `each arrow sends that fraction of the city away`
          : !showIn
          ? `${target} sends ${outs.map((e) => `${(popOf(e.from) * e.numer) / e.den}`).join(" + ")} away → ${stay} stay`
          : !isFinal
          ? `${target} gains ${gained.map((g) => `${g.e.numer}/${g.e.den}×${popOf(g.e.from)}=${g.v}`).join("  ")}`
          : `${stay} + ${gained.map((g) => g.v).join(" + ")} = ${total}`}
      </motion.span>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            {total} work in {target} → Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
