import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WARN = "#b45309";

type Line = { cells: [number, number][]; vals: number[]; kind: "row" | "col" | "diag"; i: number };

const key = (v: number[]) => [...v].sort((a, b) => a - b).join(",");
const combos = <T,>(xs: T[], k: number): T[][] => {
  if (k === 0) return [[]];
  if (xs.length < k) return [];
  const [h, ...t] = xs;
  return [...combos(t, k - 1).map((c) => [h, ...c]), ...combos(t, k)];
};

/** A playing card with a corner index, like the real thing. */
function Card({ x, y, w, h, v, fill, stroke, ink }: { x: number; y: number; w: number; h: number; v: number; fill: string; stroke: string; ink: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} fill={fill} stroke={stroke} strokeWidth={1.4} />
      <text x={x + 5} y={y + 11} fontSize="8" fontWeight="800" fill={ink} fontFamily={numberFont} opacity={0.65}>
        {v}
      </text>
      <text x={x + w / 2} y={y + h / 2 + 6} textAnchor="middle" fontSize="17" fontWeight="800" fill={ink} fontFamily={numberFont}>
        {v}
      </text>
    </g>
  );
}

/**
 * Split a run of cards into equal-sum groups — and the whole thing is secretly
 * the 3 x 3 **magic square**. The scene enumerates every triple that hits the
 * target sum (only 8 of the 84), then checks that those 8 are *exactly* the 3
 * rows, 3 columns and 2 diagonals of the square, so the square earns its place
 * rather than being decoration. From there the counting is geometry: a valid
 * split is three disjoint lines covering all nine cells. The card that pins it
 * down is the **centre** one, whose group must be one of the 4 lines through the
 * middle — and removing a *diagonal* leaves **no** complete line among the six
 * remaining cells, while removing the middle row (or column) leaves exactly the
 * other two rows (or columns), forcing the rest. So two ways, and the scene
 * counts the survivors itself for each of the four rather than asserting the
 * dead ends. Beats: the cards fanned out with the target sum; the cards flying
 * into the square while all 8 lines draw themselves; the four lines through the
 * centre with the diagonals struck out; then both tilings side by side. The
 * partitions are also enumerated independently and cross-checked against the
 * lines, so the picture and the count cannot disagree; data
 * `{ cards: [...], groups, square: ["2,7,6", ...] }`.
 */
export function MagicSquareLinesScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const cards = (Array.isArray(data.cards) ? data.cards : []).map((v) => num(v, 0));
  const groups = Math.max(2, Math.round(num(data.groups, 3)));
  const grid = (Array.isArray(data.square) ? data.square : []).map((r) => String(r).split(",").map((v) => num(v, 0)));
  const size = grid.length;

  const total = cards.reduce((a, b) => a + b, 0);
  const target = total / groups;
  const k = cards.length / groups;

  // ---- every triple that hits the target ----
  const allTriples = combos(cards, k);
  const hits = allTriples.filter((t) => t.reduce((a, b) => a + b, 0) === target);
  const hitKeys = new Set(hits.map(key));

  // ---- the square's lines ----
  const lines: Line[] = [];
  for (let r = 0; r < size; r++) {
    lines.push({ cells: Array.from({ length: size }, (_, c) => [r, c] as [number, number]), vals: grid[r], kind: "row", i: r });
  }
  for (let c = 0; c < size; c++) {
    lines.push({
      cells: Array.from({ length: size }, (_, r) => [r, c] as [number, number]),
      vals: grid.map((row) => row[c]),
      kind: "col",
      i: c,
    });
  }
  lines.push({ cells: Array.from({ length: size }, (_, i) => [i, i] as [number, number]), vals: grid.map((row, i) => row[i]), kind: "diag", i: 0 });
  lines.push({
    cells: Array.from({ length: size }, (_, i) => [i, size - 1 - i] as [number, number]),
    vals: grid.map((row, i) => row[size - 1 - i]),
    kind: "diag",
    i: 1,
  });

  // the theorem the picture rests on: the square's lines ARE the target triples
  const linesMatch =
    lines.length === hits.length && lines.every((l) => hitKeys.has(key(l.vals))) && new Set(grid.flat()).size === cards.length;

  // ---- every partition, enumerated independently ----
  const parts: number[][][] = [];
  const walk = (left: number[], acc: number[][]) => {
    if (!left.length) {
      parts.push(acc.map((g) => [...g]));
      return;
    }
    const [first, ...rest] = left;
    for (const c of combos(rest, k - 1)) {
      const g = [first, ...c];
      if (g.reduce((a, b) => a + b, 0) !== target) continue;
      walk(left.filter((v) => !g.includes(v)), [...acc, g]);
    }
  };
  walk([...cards].sort((a, b) => a - b), []);

  // ---- the centre card and the four lines through it ----
  const mid = (size - 1) / 2;
  const centre = grid[mid]?.[mid] ?? 0;
  const through = lines.filter((l) => l.vals.includes(centre));
  const survivors = (l: Line) => hits.filter((t) => !t.some((v) => l.vals.includes(v)));
  const deadEnds = through.filter((l) => survivors(l).length === 0);
  const openings = through.filter((l) => survivors(l).length > 0);

  const answerOk = problem.shortAnswer == null || String(parts.length) === String(problem.shortAnswer);
  const ok = linesMatch && answerOk && parts.length === openings.length && deadEnds.length > 0;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 460;
  const H = 252;

  // ---- geometry ----
  const cell = 46;
  const gx = 44;
  const gy = 58;
  const gx2 = 254;
  const cx = (c: number, x0 = gx) => x0 + c * cell;
  const cy = (r: number) => gy + r * cell;

  // the fan the cards come from
  const fw = 32;
  const fh = 44;
  const fanPitch = 36;
  const fanX0 = (W - cards.length * fanPitch + (fanPitch - fw)) / 2;
  const fanY = 74;

  const lineEnds = (l: Line, x0 = gx) => {
    const a = l.cells[0];
    const b = l.cells[l.cells.length - 1];
    const pad = 9;
    const ax = cx(a[1], x0) + cell / 2;
    const ay = cy(a[0]) + cell / 2;
    const bx = cx(b[1], x0) + cell / 2;
    const by = cy(b[0]) + cell / 2;
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    return { x1: ax - (dx / len) * pad, y1: ay - (dy / len) * pad, x2: bx + (dx / len) * pad, y2: by + (dy / len) * pad };
  };
  const colourOf = (l: Line) => (l.kind === "row" ? IND : l.kind === "col" ? TEAL : WARN);

  const Grid = ({ x0, dim }: { x0?: number; dim?: (v: number) => boolean }) => (
    <g>
      {grid.map((row, r) =>
        row.map((v, c) => (
          <motion.g
            key={`c${r}-${c}`}
            initial={phase === 1 ? { x: fanX0 + cards.indexOf(v) * fanPitch - cx(c, x0), y: fanY - cy(r) } : { opacity: 0 }}
            animate={phase === 1 ? { x: 0, y: 0 } : { opacity: 1 }}
            transition={
              phase === 1
                ? { type: "spring", stiffness: 70, damping: 15, delay: 0.1 + cards.indexOf(v) * 0.07 }
                : { duration: 0.25, delay: 0.05 * (r * size + c) }
            }
          >
            <Card
              x={cx(c, x0) + 3}
              y={cy(r) + 3}
              w={cell - 6}
              h={cell - 6}
              v={v}
              fill={dim && dim(v) ? "#f1f5f9" : "#fff"}
              stroke={dim && dim(v) ? "#e2e8f0" : "#cbd5e1"}
              ink={dim && dim(v) ? DIM : INK}
            />
          </motion.g>
        )),
      )}
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ================= phase 0: the target sum ================= */}
        {phase === 0 && (
          <g>
            <text x={W / 2} y={24} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              nine cards, three equal groups
            </text>
            {cards.map((v, i) => (
              <motion.g
                key={v}
                initial={{ opacity: 0, y: -30, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: (i - (cards.length - 1) / 2) * 3 }}
                transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.06 * i }}
                style={{ transformBox: "fill-box", transformOrigin: "center bottom" }}
              >
                <Card x={fanX0 + i * fanPitch} y={fanY} w={fw} h={fh} v={v} fill="#fff" stroke="#cbd5e1" ink={INK} />
              </motion.g>
            ))}
            <motion.text
              x={W / 2}
              y={158}
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {cards[0]} + {cards[1]} + … + {cards[cards.length - 1]} = {total}
            </motion.text>
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <text x={W / 2} y={192} textAnchor="middle" fontSize="15" fontWeight="800" fill={IND} fontFamily={numberFont}>
                {total} ÷ {groups} = {target}
              </text>
            </motion.g>
            <motion.text x={W / 2} y={216} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
              every group of {k} has to add to {target}
            </motion.text>
          </g>
        )}

        {/* ================= phases 1–2: one square ================= */}
        {(phase === 1 || phase === 2) && (
          <g>
            <Grid />

            {/* the lines ride over the cards — behind them only stubs show */}
            {phase === 1 &&
              lines.map((l, i) => {
                const e = lineEnds(l);
                return (
                  <motion.line
                    key={`l${i}`}
                    x1={e.x1}
                    y1={e.y1}
                    x2={e.x2}
                    y2={e.y2}
                    stroke={colourOf(l)}
                    strokeWidth={5}
                    strokeLinecap="round"
                    opacity={0.6}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.9 + i * 0.18 }}
                  />
                );
              })}
            {phase === 2 &&
              through.map((l, i) => {
                const e = lineEnds(l);
                const dead = survivors(l).length === 0;
                return (
                  <motion.line
                    key={`t${i}`}
                    x1={e.x1}
                    y1={e.y1}
                    x2={e.x2}
                    y2={e.y2}
                    stroke={dead ? BAD : WIN}
                    strokeWidth={5}
                    strokeLinecap="round"
                    opacity={dead ? 0.55 : 0.6}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.25 }}
                  />
                );
              })}
            {/* phase 2: the centre card is what pins it down */}
            {phase === 2 && (
              <motion.circle
                cx={cx(mid) + cell / 2}
                cy={cy(mid) + cell / 2}
                r={cell / 2 - 1}
                fill="none"
                stroke={IND}
                strokeWidth={2.2}
                initial={{ opacity: 0, scale: 1.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            )}

            {/* ---- right-hand panel ---- */}
            {phase === 1 && (
              <g>
                <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  the cards fit a square where every line adds to {target}
                </text>
                <motion.text x={210} y={92} fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                  {allTriples.length} triples in all
                </motion.text>
                <motion.text x={210} y={112} fontSize="11" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
                  only {hits.length} add to {target}
                </motion.text>
                {[
                  { c: IND, t: `${size} rows` },
                  { c: TEAL, t: `${size} columns` },
                  { c: WARN, t: `2 diagonals` },
                ].map((row, i) => (
                  <motion.g key={row.t} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1.5 + i * 0.35 }}>
                    <line x1={210} y1={143 + i * 22} x2={232} y2={143 + i * 22} stroke={row.c} strokeWidth={6} strokeLinecap="round" opacity={0.45} />
                    <text x={240} y={147 + i * 22} fontSize="11" fontWeight="700" fill={INK} fontFamily={numberFont}>
                      {row.t}
                    </text>
                  </motion.g>
                ))}
                <motion.text x={210} y={220} fontSize="12" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}>
                  the {lines.length} lines are
                </motion.text>
                <motion.text x={210} y={236} fontSize="12" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.7 }}>
                  exactly the {hits.length} triples
                </motion.text>
              </g>
            )}
            {phase === 2 && (
              <g>
                <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  card {centre} sits in the middle — its group is a line through the centre
                </text>
                {through.map((l, i) => {
                  const s = survivors(l).length;
                  const dead = s === 0;
                  return (
                    <motion.g key={`p${i}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1.5 + i * 0.3 }}>
                      <text x={210} y={92 + i * 30} fontSize="11" fontWeight="800" fill={dead ? BAD : WIN} fontFamily={numberFont}>
                        {"{" + [...l.vals].sort((a, b) => a - b).join(",") + "}"}
                      </text>
                      <text x={286} y={92 + i * 30} fontSize="10" fontWeight="700" fill={dead ? BAD : WIN} fontFamily={numberFont}>
                        {dead ? `${l.kind} — 0 lines left` : `${l.kind} — ${s} lines left`}
                      </text>
                      {dead && <line x1={206} y1={88 + i * 30} x2={282} y2={88 + i * 30} stroke={BAD} strokeWidth={1.6} />}
                    </motion.g>
                  );
                })}
                <motion.text x={210} y={218} fontSize="10.5" fontWeight="700" fill={BAD} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}>
                  after a diagonal, no {k} of the six left
                </motion.text>
                <motion.text x={210} y={233} fontSize="10.5" fontWeight="700" fill={BAD} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.9 }}>
                  add to {target} at all
                </motion.text>
              </g>
            )}
          </g>
        )}

        {/* ================= phase 3: both tilings ================= */}
        {phase === 3 && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              the middle row or the middle column — each forces the rest
            </text>
            {openings.map((open, gi) => {
              const x0 = gi === 0 ? gx : gx2;
              const fam = lines.filter((l) => l.kind === open.kind);
              return (
                <g key={`g${gi}`}>
                  <Grid x0={x0} />
                  {fam.map((l, i) => {
                    const e = lineEnds(l, x0);
                    return (
                      <motion.line
                        key={`f${i}`}
                        x1={e.x1}
                        y1={e.y1}
                        x2={e.x2}
                        y2={e.y2}
                        stroke={colourOf(l)}
                        strokeWidth={cell - 8}
                        strokeLinecap="round"
                        opacity={0.2}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.45, delay: 0.4 + gi * 1.1 + i * 0.3 }}
                      />
                    );
                  })}

                  {fam.map((l, i) => (
                    <motion.text
                      key={`s${i}`}
                      x={x0 + (size * cell) / 2}
                      y={cy(size) + 18 + i * 14}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight="800"
                      fill={colourOf(l)}
                      fontFamily={numberFont}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + gi * 1.1 + i * 0.3 }}
                    >
                      {"{" + [...l.vals].sort((a, b) => a - b).join(",") + "} = " + target}
                    </motion.text>
                  ))}
                  <text x={x0 + (size * cell) / 2} y={gy - 10} textAnchor="middle" fontSize="11" fontWeight="800" fill={colourOf(fam[0])} fontFamily={numberFont}>
                    the {open.kind === "row" ? "rows" : "columns"}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>

      <motion.span
        key={phase}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: phase === 3 ? "#166534" : "#4338ca",
          background: phase === 3 ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${phase === 3 ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {phase === 0
          ? `${total} split ${groups} ways means ${target} per group`
          : phase === 1
          ? `a split is ${groups} of these lines, covering all ${cards.length} cards`
          : phase === 2
          ? `two of the four die at once — a diagonal strands the rest`
          : `${parts.length} ways: the ${size} rows, or the ${size} columns`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed: {parts.length} partitions, lines match {String(linesMatch)}
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
