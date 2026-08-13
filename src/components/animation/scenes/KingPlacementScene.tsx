import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const GRID = "#cbd5e1";
const MARK = "#4338ca";
const FREE = "#16a34a";
const HIT = "#dc2626";
const WIN = "#16a34a";

/**
 * Two kings on a board, placed so neither attacks the other. Once the first king
 * is down, the second may stand anywhere it does not attack, so the count is just
 * a sum over the first king's square — and by symmetry every square of the same
 * kind (corner, edge, middle) leaves the same number free. The scene shows the
 * attack rule, then spends one beat per kind: the king lands, its attacked
 * squares go red, the survivors go green, and the running tally on the right
 * gains a row. Free counts, the grouping and the total are all computed by
 * sweeping the board, and the total is checked against the stored answer.
 * Data: { size, ordered? }.
 */
export function KingPlacementScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(2, Math.min(8, Math.round(num(data.size, 3))));
  const ordered = data.ordered !== false;

  const cells: [number, number][] = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) cells.push([r, c]);
  const attacks = (a: [number, number], b: [number, number]) =>
    Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])) <= 1;
  const freeFor = (w: [number, number]) => cells.filter((b) => !attacks(w, b));
  const kindOf = ([r, c]: [number, number]) => {
    const re = r === 0 || r === n - 1;
    const ce = c === 0 || c === n - 1;
    return re && ce ? "corner" : re || ce ? "edge" : n <= 3 ? "middle" : "inner";
  };

  // squares with the same number of free replies behave identically
  const byFree = new Map<number, [number, number][]>();
  for (const w of cells) {
    const f = freeFor(w).length;
    byFree.set(f, [...(byFree.get(f) ?? []), w]);
  }
  const classes = [...byFree.entries()]
    .map(([free, squares]) => ({ free, squares, kind: kindOf(squares[0]) }))
    .sort((a, b) => b.free - a.free);
  const totalOrdered = classes.reduce((s, k) => s + k.free * k.squares.length, 0);
  const total = ordered ? totalOrdered : totalOrdered / 2;
  const agrees = problem.shortAnswer == null || Number(problem.shortAnswer) === total;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const shown = isFinal ? classes.length - 1 : step >= 1 ? Math.min(step - 1, classes.length - 1) : -1;
  const cur = shown >= 0 ? classes[shown] : null;
  const king = cur ? cur.squares[0] : null;
  const freeSet = new Set((king ? freeFor(king) : []).map(([r, c]) => `${r},${c}`));

  // ---- geometry ----
  const W = 340;
  const cell = 42;
  const x0 = 24;
  const y0 = 26;
  const H = Math.max(y0 + n * cell + 14, 40 + classes.length * 26 + 34);
  const X = (c: number) => x0 + c * cell;
  const Y = (r: number) => y0 + r * cell;
  const panelX = x0 + n * cell + 18;
  const mid = Math.floor((n - 1) / 2);

  const caption = isFinal
    ? `${classes.map((k) => `${k.squares.length}×${k.free}`).join(" + ")} = ${total}`
    : step === 0
    ? `a king attacks the ${cells.filter((c) => attacks([mid, mid], c)).length - 1} squares touching it`
    : cur
    ? `${cur.squares.length} ${cur.kind} squares, each leaving ${cur.free} free: ${cur.squares.length} × ${cur.free} = ${cur.squares.length * cur.free}`
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the board, tinted by what this beat has decided about each square */}
        {cells.map(([r, c]) => {
          const isKing = !!king && king[0] === r && king[1] === c;
          const isFree = !!king && freeSet.has(`${r},${c}`);
          const isHit = !!king && !isKing && !isFree;
          const sameKind = !!cur && cur.squares.some((q) => q[0] === r && q[1] === c) && !isKing;
          return (
            <g key={`${r}-${c}`}>
              <motion.rect
                x={X(c)}
                y={Y(r)}
                width={cell}
                height={cell}
                fill={isKing ? "#e0e7ff" : isFree ? "#dcfce7" : isHit ? "#fee2e2" : "#f8fafc"}
                stroke={GRID}
                strokeWidth={1.2}
                initial={false}
                animate={{ opacity: 1 }}
              />
              {sameKind && (
                <rect x={X(c) + 3} y={Y(r) + 3} width={cell - 6} height={cell - 6} rx={4} fill="none" stroke={MARK} strokeWidth={1.4} strokeDasharray="4 3" />
              )}
              <AnimatePresence>
                {isFree && (
                  <motion.text
                    key="f"
                    x={X(c) + cell / 2}
                    y={Y(r) + cell / 2 + 7}
                    textAnchor="middle"
                    fontSize="19"
                    fill={FREE}
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 0.85, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.35 + (r * n + c) * 0.04 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    ♚
                  </motion.text>
                )}
                {isHit && (
                  <motion.g
                    key="h"
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.2 + (r * n + c) * 0.04 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <line x1={X(c) + cell / 2 - 7} y1={Y(r) + cell / 2 - 7} x2={X(c) + cell / 2 + 7} y2={Y(r) + cell / 2 + 7} stroke={HIT} strokeWidth={2.4} strokeLinecap="round" />
                    <line x1={X(c) + cell / 2 + 7} y1={Y(r) + cell / 2 - 7} x2={X(c) + cell / 2 - 7} y2={Y(r) + cell / 2 + 7} stroke={HIT} strokeWidth={2.4} strokeLinecap="round" />
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          );
        })}
        <rect x={x0} y={y0} width={n * cell} height={n * cell} fill="none" stroke="#64748b" strokeWidth={1.8} />

        {/* the white king, wherever this beat puts it */}
        <AnimatePresence>
          {king && (
            <motion.text
              key={`${king[0]}-${king[1]}`}
              x={X(king[1]) + cell / 2}
              y={Y(king[0]) + cell / 2 + 8}
              textAnchor="middle"
              fontSize="22"
              fill={MARK}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 15 }}
            >
              ♔
            </motion.text>
          )}
        </AnimatePresence>

        {/* the rule: the eight squares a king reaches */}
        <AnimatePresence>
          {step === 0 && !isFinal && (
            <motion.g key="rule" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={X(mid) + cell / 2} y={Y(mid) + cell / 2 + 8} textAnchor="middle" fontSize="22" fill={MARK}>
                ♔
              </text>
              {[-1, 0, 1].map((dr) =>
                [-1, 0, 1].map((dc) => {
                  if (dr === 0 && dc === 0) return null;
                  const len = Math.hypot(dr, dc);
                  const sx = X(mid) + cell / 2 + (dc / len) * 15;
                  const sy = Y(mid) + cell / 2 + (dr / len) * 15;
                  const ex = X(mid + dc) + cell / 2 - (dc / len) * 9;
                  const ey = Y(mid + dr) + cell / 2 - (dr / len) * 9;
                  return (
                    <motion.line
                      key={`${dr}-${dc}`}
                      x1={sx}
                      y1={sy}
                      x2={ex}
                      y2={ey}
                      stroke={HIT}
                      strokeWidth={2}
                      strokeLinecap="round"
                      markerEnd="url(#kingAh)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.35, delay: 0.1 + (dr + 1) * 0.09 + (dc + 1) * 0.05 }}
                    />
                  );
                })
              )}
            </motion.g>
          )}
        </AnimatePresence>
        <defs>
          <marker id="kingAh" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M 0,0 L 5.5,3 L 0,6 z" fill={HIT} />
          </marker>
        </defs>

        {/* the running tally, one row per kind of square */}
        {classes.map((kl, i) => (
          <AnimatePresence key={kl.free}>
            {i <= shown && (
              <motion.g
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
              >
                <rect
                  x={panelX}
                  y={38 + i * 26}
                  width={W - panelX - 8}
                  height={21}
                  rx={6}
                  fill={i === shown ? "#eef2ff" : "#f8fafc"}
                  stroke={i === shown ? MARK : "#e2e8f0"}
                  strokeWidth={i === shown ? 1.6 : 1}
                />
                <text x={panelX + 7} y={38 + i * 26 + 14} fontSize="10" fontWeight="800" fill={i === shown ? MARK : "#94a3b8"} fontFamily={numberFont}>
                  {kl.squares.length} {kl.kind} × {kl.free} = {kl.squares.length * kl.free}
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        ))}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="tot" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <line x1={panelX} y1={38 + classes.length * 26 - 3} x2={W - 8} y2={38 + classes.length * 26 - 3} stroke={INK} strokeWidth={1.4} />
              <text x={panelX + 7} y={38 + classes.length * 26 + 15} fontSize="13" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {total} ways
              </text>
            </motion.g>
          )}
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
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {step === 0 && !isFinal && (
          <motion.span
            key="sym"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            {classes.map((k) => `${k.squares.length} ${k.kind}`).join(", ")} — squares of a kind behave alike
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : HIT, textAlign: "center" }}
          >
            {agrees
              ? `swept every square: the two kings are told apart, so order counts`
              : `the sweep gives ${total}, not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.65 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
