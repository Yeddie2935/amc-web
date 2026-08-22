import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const EXTRA = "#f59e0b";
const TRUNK = "#8b5e3c";
const LEAF = "#3f9142";
const LEAF_DIM = "#cbd5e1";

const parseChoice = (text: string) => Number(String(text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));

/**
 * A row of whole-number measurements where each one is double or half its
 * neighbour, one value legible and the rest lost — plus a single surviving digit
 * of the average. It looks wide open, and the thing that closes it is
 * **integrality**: the known value is odd, and halving an odd number never lands
 * on a whole number, so every branch that tries to halve it dies on the spot.
 * That forces both neighbours upward without any casework at all, and from there
 * only a handful of chains exist.
 *
 * Writing each height as `odd × 2^k` makes the rule exact — a chain is a walk
 * whose exponent moves ±1 each step and can never go below 0 — so the scene
 * enumerates every such walk rather than guessing, finds the three that survive,
 * and only then spends the one clue the rain left: the tenths digit of the
 * average, which singles out exactly one.
 *
 * The trees are drawn to true scale on the opening and closing beats, so the
 * doubling is something you see rather than read, and the closing beat lays the
 * average across the finished row as a real line. Every chain, sum and average is
 * computed, the winner is checked to be unique, and the closing note finds the
 * rejected chain whose average shares its whole number with an answer choice —
 * the trap for anyone who stops before checking the decimal.
 * Data: { count, knownIndex, knownValue, averageEndsWith, unit?, label? }.
 */
export function HalveDoubleChainScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const count = Math.max(2, Math.round(num(data.count, 5)));
  const knownIndex = Math.min(count, Math.max(1, Math.round(num(data.knownIndex, 1))));
  const knownValue = Math.max(1, Math.round(num(data.knownValue, 1)));
  const clue = data.averageEndsWith != null ? String(data.averageEndsWith) : "";
  const unit = data.unit != null ? String(data.unit) : "";
  const label = data.label != null ? String(data.label) : "Item";

  // every height is the known value's odd part times a power of two
  let odd = knownValue;
  let anchor = 0;
  while (odd % 2 === 0) {
    odd /= 2;
    anchor += 1;
  }

  // a chain is an exponent walk stepping ±1 and never dropping below zero
  const chains: { values: number[]; sum: number; avg: number; avgStr: string; ok: boolean }[] = [];
  const dp = Math.max(0, clue.replace(".", "").length);
  const walk = (exps: number[]) => {
    if (exps.length === count) {
      if (exps[knownIndex - 1] !== anchor) return;
      const values = exps.map((e) => odd * 2 ** e);
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / count;
      const avgStr = avg.toFixed(dp);
      chains.push({ values, sum, avg, avgStr, ok: clue === "" || avgStr.endsWith(clue) });
      return;
    }
    for (const d of [1, -1]) {
      const next = exps[exps.length - 1] + d;
      if (next >= 0) walk([...exps, next]);
    }
  };
  // every start the anchor could still be reached from, then filtered on it
  for (let e0 = 0; e0 <= anchor + count; e0 += 1) walk([e0]);
  const valid = chains.sort((a, b) => {
    for (let i = 0; i < count; i += 1) if (a.values[i] !== b.values[i]) return a.values[i] - b.values[i];
    return 0;
  });
  const winners = valid.filter((c) => c.ok);
  const winner = winners[0] ?? null;

  const matchesStored =
    problem.shortAnswer == null || winner == null || Math.abs(parseChoice(String(problem.shortAnswer)) - winner.avg) < 1e-9;
  const failure =
    valid.length === 0
      ? `check failed: no chain of ${count} whole numbers puts ${knownValue} in slot ${knownIndex}`
      : winners.length !== 1
      ? `check failed: ${winners.length} chains end in ${clue}, so the clue does not single one out`
      : !matchesStored
      ? `check failed: the surviving chain averages ${winner?.avgStr}, the stored answer is ${problem.shortAnswer}`
      : "";

  // the rejected chain that shares a whole number with an answer choice
  const trap = valid
    .filter((c) => !c.ok)
    .map((c) => ({
      c,
      hit: (problem.choices ?? []).find((ch) => Math.floor(parseChoice(String(ch.text))) === Math.floor(c.avg)),
    }))
    .find((t) => t.hit);

  const lastStep = totalSteps - 1;
  const isFinal = step >= lastStep;
  const branched = isFinal || step >= 1;
  const judged = isFinal || step >= 2;

  // the slots the known value forces on its own, before any branching
  const forced: (number | null)[] = Array.from({ length: count }, (_, i) => {
    const seen = new Set(valid.map((c) => c.values[i]));
    return seen.size === 1 ? [...seen][0] : null;
  });

  // ---- geometry ----
  const W = 360;
  const H = 252;
  const groundY = 190;
  const colW = (W - 40) / count;
  const treeX = (i: number) => 20 + colW * (i + 0.5);
  const shownMax = winner ? Math.max(...winner.values) : Math.max(...(valid[0]?.values ?? [1]));
  const scale = 120 / Math.max(1, shownMax);
  const hOf = (v: number) => v * scale;

  const tree = (cx: number, v: number, dim: boolean) => {
    const h = hOf(v);
    const w = Math.min(30, Math.max(14, h * 0.5));
    const trunkH = Math.max(5, h * 0.2);
    return (
      <>
        <rect x={cx - 2.6} y={groundY - trunkH} width={5.2} height={trunkH} fill={dim ? LEAF_DIM : TRUNK} />
        <polygon
          points={`${cx - w / 2},${groundY - trunkH} ${cx + w / 2},${groundY - trunkH} ${cx},${groundY - h}`}
          fill={dim ? LEAF_DIM : LEAF}
          stroke={dim ? "#94a3b8" : "#276b2c"}
          strokeWidth={1}
        />
      </>
    );
  };

  // ---- the branch diagram, laid out from the leaves back ----
  const nodeW = 36;
  const nodeH = 20;
  const colX = (i: number) => 18 + i * 50;
  type Node = { col: number; value: number; y: number; chain: number; parent: number };
  const nodes: Node[] = [];
  const leafY = (k: number) => 46 + k * 40;
  if (branched && valid.length) {
    // fold the chains together by shared prefix, so a fork is a real divergence
    const rows: number[][] = valid.map((c) => c.values);
    const build = (col: number, members: number[], parent: number): number => {
      const id = nodes.length;
      nodes.push({ col, value: rows[members[0]][col], y: 0, chain: col === count - 1 ? members[0] : -1, parent });
      if (col === count - 1) {
        nodes[id].y = leafY(members[0]);
      } else {
        const groups = new Map<number, number[]>();
        members.forEach((m) => {
          const v = rows[m][col + 1];
          groups.set(v, [...(groups.get(v) ?? []), m]);
        });
        const kids = [...groups.values()].map((g) => build(col + 1, g, id));
        nodes[id].y = kids.reduce((a, k) => a + nodes[k].y, 0) / kids.length;
      }
      return id;
    };
    build(
      0,
      valid.map((_, i) => i),
      -1,
    );
  }

  const fmt = (v: number) => String(v);

  const caption = isFinal
    ? `${winner?.values.join(" + ") ?? ""} = ${winner?.sum ?? 0}${unit ? ` ${unit}` : ""} in all`
    : step === 0
    ? `half of ${knownValue} is ${knownValue / 2} — not a whole number, so both neighbours must double`
    : !judged
    ? `stepping on, only ${valid.length} chains of whole numbers exist at all`
    : `just one of the ${valid.length} averages ends in ${clue}`;

  const note = failure
    ? failure
    : isFinal
    ? trap && trap.hit
      ? `the ${trap.c.sum} chain averages ${trap.c.avgStr} — choice ${trap.hit.label} is ${trap.hit.text}, the same whole number`
      : ""
    : step === 0
    ? `write every height as ${odd} × a power of 2 — the power steps ±1 and can never go below 0`
    : !judged
    ? `each fork is double-or-half, and a fork that would halve an odd number simply is not there`
    : valid.map((c) => `${c.sum} → ${c.avgStr}`).join(" · ");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {/* the row of measurements, drawn to true scale */}
        <AnimatePresence>
          {!branched && (
            <motion.g key="row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <line x1={12} x2={W - 12} y1={groundY} y2={groundY} stroke="#94a3b8" strokeWidth={1.6} />
              {Array.from({ length: count }).map((_, i) => {
                const v = forced[i];
                const known = i === knownIndex - 1;
                return (
                  <g key={i}>
                    {v == null ? (
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.08 }}>
                        <rect
                          x={treeX(i) - 14}
                          y={groundY - 46}
                          width={28}
                          height={46}
                          rx={4}
                          fill="none"
                          stroke="#cbd5e1"
                          strokeWidth={1.4}
                          strokeDasharray="4 3"
                        />
                        <text x={treeX(i)} y={groundY - 20} textAnchor="middle" fontSize="15" fontWeight="800" fill="#94a3b8" fontFamily={numberFont}>
                          ?
                        </text>
                      </motion.g>
                    ) : (
                      <motion.g
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 18, delay: known ? 0.2 : 1.2 + i * 0.12 }}
                        style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
                      >
                        {tree(treeX(i), v, false)}
                      </motion.g>
                    )}
                    {v != null && (
                      <motion.text
                        x={treeX(i)}
                        y={groundY - hOf(v) - 7}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="800"
                        fill={known ? INK : IND}
                        fontFamily={numberFont}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: known ? 0.4 : 1.5 + i * 0.12 }}
                      >
                        {fmt(v)}
                      </motion.text>
                    )}
                    <text x={treeX(i)} y={groundY + 14} textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b">
                      {label} {i + 1}
                    </text>
                  </g>
                );
              })}

              {/* the halving that never lands on a whole number */}
              {[knownIndex - 2, knownIndex].map((i) =>
                i >= 0 && i < count ? (
                  <motion.g
                    key={`x${i}`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.55 }}
                  >
                    <rect x={treeX(i) - 22} y={groundY - 108} width={44} height={17} rx={8} fill="#fee2e2" stroke={BAD} strokeWidth={0.9} />
                    <text x={treeX(i)} y={groundY - 96} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                      {knownValue / 2} ✗
                    </text>
                  </motion.g>
                ) : null,
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the branch diagram: every whole-number chain there is */}
        <AnimatePresence>
          {branched && !isFinal && (
            <motion.g key="tree" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {nodes.map((nd, i) =>
                nd.parent >= 0 ? (
                  <motion.line
                    key={`e${i}`}
                    x1={colX(nodes[nd.parent].col) + nodeW}
                    y1={nodes[nd.parent].y}
                    x2={colX(nd.col)}
                    y2={nd.y}
                    stroke="#cbd5e1"
                    strokeWidth={1.4}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 + nd.col * 0.18 }}
                  />
                ) : null,
              )}
              {nodes.map((nd, i) => {
                const good = judged && nd.chain >= 0 && valid[nd.chain].ok;
                const dim = judged && nd.chain >= 0 && !valid[nd.chain].ok;
                return (
                  <motion.g
                    key={`n${i}`}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: dim ? 0.35 : 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 17, delay: 0.2 + nd.col * 0.18 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <rect
                      x={colX(nd.col)}
                      y={nd.y - nodeH / 2}
                      width={nodeW}
                      height={nodeH}
                      rx={5}
                      fill={good ? "#dcfce7" : "#f8fafc"}
                      stroke={good ? WIN : "#cbd5e1"}
                      strokeWidth={good ? 1.8 : 1.2}
                    />
                    <text
                      x={colX(nd.col) + nodeW / 2}
                      y={nd.y + 4}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="800"
                      fill={good ? "#166534" : INK}
                      fontFamily={numberFont}
                    >
                      {fmt(nd.value)}
                    </text>
                  </motion.g>
                );
              })}

              {/* each finished chain, totalled and averaged */}
              <AnimatePresence>
                {judged &&
                  valid.map((c, k) => (
                    <motion.g
                      key={`s${k}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: c.ok ? 1 : 0.4, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 220, damping: 19, delay: 0.4 + k * 0.16 }}
                    >
                      <text x={colX(count - 1) + nodeW + 10} y={leafY(k) + 4} fontSize="10.5" fontWeight="800" fill={c.ok ? WIN : "#64748b"} fontFamily={numberFont}>
                        {c.sum} ÷ {count} = {c.avgStr}
                      </text>
                    </motion.g>
                  ))}
              </AnimatePresence>

              {!judged && (
                <motion.text
                  x={W / 2}
                  y={leafY(valid.length - 1) + 46}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#64748b"
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  {valid.length} chains, and the rain left one digit of the average
                </motion.text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the settled row, with the average laid across it */}
        <AnimatePresence>
          {isFinal && winner && (
            <motion.g key="fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <line x1={12} x2={W - 12} y1={groundY} y2={groundY} stroke="#94a3b8" strokeWidth={1.6} />
              {winner.values.map((v, i) => (
                <g key={i}>
                  <motion.g
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 + i * 0.1 }}
                    style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
                  >
                    {tree(treeX(i), v, false)}
                  </motion.g>
                  <text x={treeX(i)} y={groundY + 14} textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b">
                    {label} {i + 1}
                  </text>
                </g>
              ))}
              <motion.line
                x1={12}
                x2={W - 12}
                y1={groundY - hOf(winner.avg)}
                y2={groundY - hOf(winner.avg)}
                stroke={WIN}
                strokeWidth={1.6}
                strokeDasharray="6 4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              />
              {/* the chip sits clear of every treetop and leads down to the line */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15 }}>
                <line x1={55} x2={55} y1={40} y2={groundY - hOf(winner.avg)} stroke={WIN} strokeWidth={1} opacity={0.6} />
                <rect x={12} y={24} width={86} height={16} rx={8} fill="#dcfce7" stroke={WIN} strokeWidth={0.9} />
                <text x={55} y={36} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                  average {winner.avgStr}
                </text>
              </motion.g>

              {/* heights go on last, haloed, so the average line cannot cut them */}
              {winner.values.map((v, i) => (
                <motion.text
                  key={`h${i}`}
                  x={treeX(i)}
                  y={groundY - hOf(v) - 7}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="800"
                  fill={INK}
                  fontFamily={numberFont}
                  stroke="#fff"
                  strokeWidth={3}
                  paintOrder="stroke"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  {fmt(v)}
                </motion.text>
              ))}
              <motion.text
                x={W / 2}
                y={groundY + 34}
                textAnchor="middle"
                fontSize="14"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 16, delay: 1.3 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {winner.sum} ÷ {count} = {winner.avgStr}
              </motion.text>
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
          color: isFinal ? "#166534" : judged ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : judged ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : judged ? "#fde68a" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {note && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: numberFont,
              fontSize: 11.5,
              fontWeight: 700,
              color: failure ? BAD : "#94a3b8",
              textAlign: "center",
            }}
          >
            {note}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
