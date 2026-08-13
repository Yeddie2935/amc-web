import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const ROAD = "#cbd5e1";
const MARK = "#4338ca";
const WARN = "#f59e0b";
const WIN = "#16a34a";
const BAD = "#dc2626";

type Node = { id: string; x: number; y: number };
type Edge = { from: string; to: string; w: number; bend: number };

/**
 * Shortest route through a network of one-way roads. The scene runs the
 * relaxation itself, so the best distance to every town, the winning route and
 * every alternative are discovered rather than asserted. The beats follow the
 * reasoning: settle each town's best distance (noting where a detour beats the
 * direct road), then compare every road arriving at the destination side by
 * side, then draw the winner with its running total. Distances, the route and
 * the full list of simple paths are computed, and the result is checked against
 * the stored answer.
 * Data: { nodes:[{id,x,y}], edges:[{from,to,w,bend?}], start, end }.
 */
export function ShortestRouteScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const nodes: Node[] = (Array.isArray(data.nodes) ? data.nodes : []).map((r) => {
    const o = (r ?? {}) as Record<string, unknown>;
    return { id: String(o.id ?? "?"), x: num(o.x, 0), y: num(o.y, 0) };
  });
  const edges: Edge[] = (Array.isArray(data.edges) ? data.edges : []).map((r) => {
    const o = (r ?? {}) as Record<string, unknown>;
    return { from: String(o.from ?? ""), to: String(o.to ?? ""), w: num(o.w, 0), bend: num(o.bend, 0) };
  });
  const start = data.start != null ? String(data.start) : nodes[0]?.id ?? "";
  const end = data.end != null ? String(data.end) : nodes[nodes.length - 1]?.id ?? "";

  // relax until nothing improves: the best distance to every town
  const dist: Record<string, number> = {};
  const via: Record<string, string> = {};
  nodes.forEach((nd) => (dist[nd.id] = Infinity));
  dist[start] = 0;
  for (let i = 0; i < nodes.length; i++)
    for (const e of edges)
      if (dist[e.from] + e.w < dist[e.to]) {
        dist[e.to] = dist[e.from] + e.w;
        via[e.to] = e.from;
      }

  // the winning route, read back through the predecessors
  const route: string[] = [];
  for (let u = end; u != null; u = via[u]) {
    route.unshift(u);
    if (u === start) break;
  }
  const onRoute = (e: Edge) => {
    const i = route.indexOf(e.from);
    return i >= 0 && route[i + 1] === e.to;
  };

  // every simple route, so the alternatives are real rather than claimed
  const paths: { path: string[]; d: number }[] = [];
  const walk = (u: string, seen: Set<string>, d: number, p: string[]) => {
    if (u === end) {
      paths.push({ path: p, d });
      return;
    }
    for (const e of edges) if (e.from === u && !seen.has(e.to)) walk(e.to, new Set([...seen, e.to]), d + e.w, [...p, e.to]);
  };
  if (start && end) walk(start, new Set([start]), 0, [start]);
  paths.sort((a, b) => a.d - b.d);

  // roads arriving at the destination, each with the total it would give
  const finals = edges
    .filter((e) => e.to === end)
    .map((e) => ({ e, total: dist[e.from] + e.w }))
    .sort((a, b) => a.total - b.total);

  // a town where going the long way round beats the direct road
  const detour = nodes
    .map((nd) => {
      const ins = edges.filter((e) => e.to === nd.id);
      const best = ins.find((e) => Math.abs(dist[e.from] + e.w - dist[nd.id]) < 1e-9);
      const direct = ins.find((e) => e.from === start && e !== best);
      return best && direct && dist[nd.id] < direct.w ? { id: nd.id, best: dist[nd.id], direct: direct.w } : null;
    })
    .find(Boolean);

  const agrees = problem.shortAnswer == null || Number(problem.shortAnswer) === dist[end];
  const choiceHits = (problem.choices ?? []).filter((c) => paths.some((p) => p.d === Number(String(c.text).replace(/[^0-9.\-]/g, "")))).length;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showDist = isFinal || step >= 1;
  const showFinals = !isFinal && step === 2;

  // ---- geometry ----
  const W = 340;
  const H = 152;
  const R = 12.5;
  const NX = (nd: Node) => 18 + nd.x * (W - 36);
  const NY = (nd: Node) => 20 + nd.y * 95;
  const at = (id: string) => nodes.find((nd) => nd.id === id) ?? { id, x: 0, y: 0 };

  // an edge, shortened to the circle rims, optionally bowed aside
  const geom = (e: Edge) => {
    const a = at(e.from);
    const b = at(e.to);
    const x1 = NX(a);
    const y1 = NY(a);
    const x2 = NX(b);
    const y2 = NY(b);
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 + e.bend;
    // trim the ends so the line meets the circles, not their centres
    const t1 = Math.atan2(my - y1, mx - x1);
    const t2 = Math.atan2(my - y2, mx - x2);
    const sx = x1 + Math.cos(t1) * R;
    const sy = y1 + Math.sin(t1) * R;
    const ex = x2 + Math.cos(t2) * R;
    const ey = y2 + Math.sin(t2) * R;
    // a quadratic sits halfway between its midpoint and its control point, so
    // labels must go on the curve itself, not on the control point
    const pt = (t: number) => ({
      x: (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * mx + t * t * ex,
      y: (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * my + t * t * ey,
    });
    const mid = pt(0.5);
    return { d: `M ${sx},${sy} Q ${mx},${my} ${ex},${ey}`, ex, ey, lx: mid.x, ly: mid.y, pt };
  };

  const caption = isFinal
    ? `${route.join(" → ")} = ${route
        .slice(0, -1)
        .map((u, i) => edges.find((e) => e.from === u && e.to === route[i + 1])?.w)
        .join(" + ")} = ${dist[end]}`
    : step === 0
    ? `every road is one way — ${paths.length} routes from ${start} to ${end}`
    : showFinals
    ? `${finals.length} roads reach ${end}: ${finals.map((f) => `${f.e.from} gives ${f.total}`).join(", ")}`
    : `best distance to each town, working outward from ${start}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        <defs>
          {[ROAD, MARK, WARN, WIN].map((c, i) => (
            <marker key={i} id={`ah${i}`} markerWidth="7" markerHeight="7" refX="5.6" refY="3" orient="auto">
              <path d="M 0,0 L 6,3 L 0,6 z" fill={c} />
            </marker>
          ))}
        </defs>

        {edges.map((e, i) => {
          const g = geom(e);
          const win = isFinal && onRoute(e);
          const flagged = showFinals && e.to === end;
          const bestFinal = flagged && finals[0].e === e;
          const tone = win || bestFinal ? WIN : flagged ? WARN : ROAD;
          const mk = win || bestFinal ? 3 : flagged ? 2 : 0;
          return (
            <g key={`e${i}`}>
              <motion.path
                d={g.d}
                fill="none"
                stroke={tone}
                strokeWidth={win || bestFinal ? 3 : flagged ? 2.4 : 1.6}
                strokeLinecap="round"
                markerEnd={`url(#ah${mk})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: win ? 0.3 + route.indexOf(e.from) * 0.22 : i * 0.05 }}
              />
              <text
                x={g.lx}
                y={g.ly + (e.bend > 0 ? 11 : -4)}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="800"
                fill={win || bestFinal ? "#166534" : flagged ? "#92400e" : "#64748b"}
                fontFamily={numberFont}
              >
                {e.w}
              </text>
            </g>
          );
        })}

        {/* what each road into the destination would total */}
        <AnimatePresence>
          {showFinals &&
            finals.map((f, i) => {
              const g = geom(f.e);
              const q = g.pt(0.25);
              const good = i === 0;
              return (
                <motion.g
                  key={`f${i}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.3 + i * 0.18 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <rect x={q.x - 17} y={q.y + (f.e.bend > 0 ? 10 : -26)} width={34} height={14} rx={7} fill={good ? "#dcfce7" : "#fef3c7"} stroke={good ? WIN : WARN} strokeWidth={1.3} />
                  <text
                    x={q.x}
                    y={q.y + (f.e.bend > 0 ? 20 : -16)}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="800"
                    fill={good ? "#166534" : "#92400e"}
                    fontFamily={numberFont}
                  >
                    {f.total}
                  </text>
                </motion.g>
              );
            })}
        </AnimatePresence>

        {/* the towns, each labelled with its best distance once settled */}
        {nodes.map((nd) => {
          const on = isFinal && route.includes(nd.id);
          const order = [...nodes].sort((a, b) => dist[a.id] - dist[b.id]).findIndex((q) => q.id === nd.id);
          return (
            <g key={nd.id}>
              <motion.circle
                cx={NX(nd)}
                cy={NY(nd)}
                r={R}
                fill="#fff"
                stroke={on ? WIN : nd.id === start || nd.id === end ? MARK : "#94a3b8"}
                strokeWidth={on || nd.id === start || nd.id === end ? 2.4 : 1.5}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 16, delay: order * 0.05 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
              <text x={NX(nd)} y={NY(nd) + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {nd.id}
              </text>
              <AnimatePresence>
                {showDist && Number.isFinite(dist[nd.id]) && (
                  <motion.g
                    key="d"
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: order * 0.16 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <rect x={NX(nd) - 13} y={NY(nd) - R - 15} width={26} height={13} rx={6} fill={on ? "#dcfce7" : "#eef2ff"} stroke={on ? WIN : "#c7d2fe"} strokeWidth={1.2} />
                    <text x={NX(nd)} y={NY(nd) - R - 5} textAnchor="middle" fontSize="9" fontWeight="800" fill={on ? "#166534" : MARK} fontFamily={numberFont}>
                      {dist[nd.id]}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
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
          color: isFinal ? "#166534" : showFinals ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : showFinals ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showFinals ? "#fde68a" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {showDist && !showFinals && !isFinal && detour && (
          <motion.span
            key="det"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            {start} to {detour.id} is {detour.direct} straight, but only {detour.best} the long way
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees
              ? `checked all ${paths.length} routes — the next best is ${paths[1]?.d ?? "—"}`
              : `the relaxation gives ${dist[end]}, not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && choiceHits > 1 && (
          <motion.span
            key="hits"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            {choiceHits} of the answer choices are lengths of real routes
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
