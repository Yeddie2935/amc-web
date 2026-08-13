import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const NODE = "#eef2ff";
const EDGE = "#c7d2fe";
const MERGE = "#f59e0b";
const WIN = "#16a34a";
const OP_COLORS = ["#0d9488", "#4338ca", "#db2777", "#d97706"];

type Op = { label: string; kind: string; value: number };
type Edge = { level: number; from: number; to: number; op: number };

/**
 * A quantity that each round is changed by one of a few operations, asking how
 * many *different* values are reachable. The tree is grown one round per beat,
 * but values are kept once per level, so two branches that arrive at the same
 * number visibly land on one node — and that merge is the whole problem, since
 * it is why the count of distinct values falls short of the number of paths.
 * Levels, edges, merges and both counts are computed from the start value and
 * the operations; the scene names the collision it finds rather than assuming
 * one exists.
 * Data: { start, days, ops:[{label,kind:"add"|"mul",value}], dayLabels?, unit? }.
 */
export function BranchValueTreeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const start = num(data.start, 0);
  const days = Math.max(1, Math.round(num(data.days, 3)));
  const unit = data.unit != null ? String(data.unit) : "";
  const ops: Op[] = (Array.isArray(data.ops) ? data.ops : []).map((o) => {
    const r = (o ?? {}) as Record<string, unknown>;
    return { label: r.label != null ? String(r.label) : "?", kind: r.kind === "mul" ? "mul" : "add", value: num(r.value, 0) };
  });
  const dayLabels = (Array.isArray(data.dayLabels) ? data.dayLabels : []).map((d) => String(d));

  // grow the tree, but keep each value only once per level: arriving twice at
  // the same number is a merge, not a second node
  const levels: number[][] = [[start]];
  const edges: Edge[] = [];
  for (let d = 0; d < days; d++) {
    const prev = levels[d];
    const next: number[] = [];
    prev.forEach((v, pi) => {
      ops.forEach((op, oi) => {
        const w = op.kind === "mul" ? v * op.value : v + op.value;
        let idx = next.indexOf(w);
        if (idx < 0) {
          next.push(w);
          idx = next.length - 1;
        }
        edges.push({ level: d, from: pi, to: idx, op: oi });
      });
    });
    levels.push(next);
  }

  // order each level by the average position of its parents, so children sit
  // under the branch they came from and a merged value lands between the two
  // nodes that reach it — otherwise its edges take a long detour across others
  for (let l = 1; l <= days; l++) {
    const ins = levels[l].map((_, i) => edges.filter((e) => e.level === l - 1 && e.to === i));
    const bary = ins.map((es) => (es.length ? es.reduce((a, e) => a + e.from, 0) / es.length : 0));
    const order = levels[l].map((_, i) => i).sort((a, b) => bary[a] - bary[b] || a - b);
    const at = new Array<number>(order.length);
    order.forEach((old, now) => (at[old] = now));
    levels[l] = order.map((old) => levels[l][old]);
    for (const e of edges) {
      if (e.level === l - 1) e.to = at[e.to];
      if (e.level === l) e.from = at[e.from];
    }
  }

  const inDeg = (level: number, idx: number) => edges.filter((e) => e.level === level - 1 && e.to === idx).length;
  const isMerged = (level: number, idx: number) => level > 0 && inDeg(level, idx) > 1;
  const paths = Math.pow(ops.length, days);
  const distinct = levels[days].length;
  const finalSorted = [...levels[days]].sort((a, b) => a - b);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const shown = isFinal ? days : Math.min(Math.max(step, 0), days);

  // the collision on the level just drawn, described by its two routes
  const mergedHere = levels[shown]
    .map((_, i) => i)
    .filter((i) => isMerged(shown, i))
    .map((i) => {
      const ins = edges.filter((e) => e.level === shown - 1 && e.to === i);
      return { idx: i, value: levels[shown][i], routes: ins.map((e) => `${levels[shown - 1][e.from]}${ops[e.op].label}`) };
    });

  // ---- geometry ----
  const W = 340;
  const rowGap = 42;
  const topY = 44;
  const nh = 22;
  const H = topY + days * rowGap + nh + 16;
  const rowY = (l: number) => topY + l * rowGap;
  const nodeX = (l: number, i: number) => {
    const k = levels[l].length;
    return 8 + ((i + 0.5) * (W - 16)) / k;
  };
  const nw = (l: number) => Math.min(52, (W - 16) / levels[l].length - 6);

  const caption = isFinal
    ? `${finalSorted.join(", ")} — ${distinct} amounts from ${paths} paths`
    : shown === 0
    ? `start at ${unit}${start} — each day ${ops.map((o) => o.label).join(" or ")}`
    : mergedHere.length > 0
    ? `${mergedHere[0].routes.join(" = ")} = ${mergedHere[0].value} — two branches meet`
    : `${levels[shown].length} different amounts so far`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* the moves on offer */}
        {ops.map((op, i) => (
          <motion.g
            key={`op${i}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 17, delay: i * 0.08 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <rect x={W / 2 - 52 + i * 56} y={6} width={48} height={19} rx={9} fill="#fff" stroke={OP_COLORS[i % OP_COLORS.length]} strokeWidth={1.6} />
            <text
              x={W / 2 - 52 + i * 56 + 24}
              y={19}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="800"
              fill={OP_COLORS[i % OP_COLORS.length]}
              fontFamily={numberFont}
            >
              {op.label}
            </text>
          </motion.g>
        ))}

        {/* one branch per move, drawn as it is taken */}
        {edges
          .filter((e) => e.level < shown)
          .map((e, i) => {
            const x1 = nodeX(e.level, e.from);
            const y1 = rowY(e.level) + nh;
            const x2 = nodeX(e.level + 1, e.to);
            const y2 = rowY(e.level + 1);
            const merge = isMerged(e.level + 1, e.to);
            return (
              <motion.path
                key={`e${i}`}
                d={`M ${x1},${y1} C ${x1},${y1 + 14} ${x2},${y2 - 14} ${x2},${y2}`}
                fill="none"
                stroke={merge ? MERGE : OP_COLORS[e.op % OP_COLORS.length]}
                strokeWidth={merge ? 2.4 : 1.6}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: merge ? 1 : 0.75 }}
                transition={{ duration: 0.45, delay: e.level * 0.12 + (i % 4) * 0.05 }}
              />
            );
          })}

        {/* the distinct amounts reachable on each day */}
        {levels.slice(0, shown + 1).map((vals, l) => (
          <g key={`lv${l}`}>
            {/* backed in white: the row labels sit in the band the edges cross */}
            {dayLabels[l] && (
              <g>
                <rect x={2} y={rowY(l) - 15} width={dayLabels[l].length * 6 + 8} height={13} rx={3} fill="#fff" />
                <text x={6} y={rowY(l) - 6} fontSize="9.5" fontWeight="800" fill="#94a3b8" fontFamily={numberFont}>
                  {dayLabels[l]}
                </text>
              </g>
            )}
            <g>
              <rect x={W - 12 - `${vals.length} values`.length * 6} y={rowY(l) - 15} width={`${vals.length} values`.length * 6 + 10} height={13} rx={3} fill="#fff" />
              <text x={W - 6} y={rowY(l) - 6} textAnchor="end" fontSize="9.5" fontWeight="800" fill="#94a3b8" fontFamily={numberFont}>
                {vals.length} value{vals.length === 1 ? "" : "s"}
              </text>
            </g>
            {vals.map((v, i) => {
              const merged = isMerged(l, i);
              const w = nw(l);
              const done = isFinal && l === days;
              return (
                <motion.g
                  key={`n${l}-${i}`}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 16, delay: l * 0.14 + i * 0.05 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <rect
                    x={nodeX(l, i) - w / 2}
                    y={rowY(l)}
                    width={w}
                    height={nh}
                    rx={6}
                    fill={merged ? "#fef3c7" : done ? "#dcfce7" : NODE}
                    stroke={merged ? MERGE : done ? WIN : EDGE}
                    strokeWidth={merged ? 2.2 : 1.4}
                  />
                  <text
                    x={nodeX(l, i)}
                    y={rowY(l) + 15}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="800"
                    fill={merged ? "#92400e" : done ? "#166534" : INK}
                    fontFamily={numberFont}
                  >
                    {unit}
                    {v}
                  </text>
                </motion.g>
              );
            })}
          </g>
        ))}

        {/* the collision, called out where it happens */}
        <AnimatePresence>
          {!isFinal &&
            mergedHere.map((m) => (
              <motion.g
                key={`mg${m.idx}`}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 14, delay: 0.55 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <circle cx={nodeX(shown, m.idx) + nw(shown) / 2 + 6} cy={rowY(shown) + 4} r={7.5} fill={MERGE} />
                <text x={nodeX(shown, m.idx) + nw(shown) / 2 + 6} y={rowY(shown) + 7.5} textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                  {m.routes.length}
                </text>
              </motion.g>
            ))}
        </AnimatePresence>
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
          color: isFinal ? "#166534" : mergedHere.length ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : mergedHere.length ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : mergedHere.length ? "#fde68a" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            {paths - distinct > 0
              ? `the one merge costs ${paths - distinct} of the ${paths} endings`
              : `no two branches ever meet, so all ${paths} differ`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
