import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

function factorTree(nInput: number): { leaves: number[] } {
  const leaves: number[] = [];
  let n = nInput;
  for (let p = 2; p * p <= n; p++) {
    while (n % p === 0) {
      leaves.push(p);
      n /= p;
    }
  }
  if (n > 1) leaves.push(n);
  return { leaves };
}

/**
 * A number split down a real binary factor tree until every leaf is prime,
 * then the leaves are collected and deduplicated to find the distinct
 * primes — a beat is spent on the trap of adding two *repeated* leaves
 * instead of two *distinct* primes, which prices out to a real choice.
 * Data: { n, countSmallest }.
 */
export function PrimeFactorTreeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(4, Math.round(num(data.n, 250)));
  const countSmallest = Math.max(1, Math.round(num(data.countSmallest, 2)));

  const { leaves } = factorTree(n);
  const sortedLeaves = [...leaves].sort((a, b) => a - b);
  const distinct = [...new Set(sortedLeaves)];
  const picked = distinct.slice(0, countSmallest);
  const sum = picked.reduce((a, b) => a + b, 0);

  const matches = problem.shortAnswer == null || String(sum) === String(problem.shortAnswer);
  const failure = !matches ? `check failed: ${picked.join("+")} = ${sum}, stored answer is ${problem.shortAnswer}` : "";

  // trap: skipping the very first prime found and taking the next
  // `countSmallest` leaves instead (an off-by-one misreading of "smallest")
  const repSlice = sortedLeaves.slice(1, 1 + countSmallest);
  const repTrap = repSlice.reduce((a, b) => a + b, 0);
  const trapChoice = repSlice.length === countSmallest && repTrap !== sum ? (problem.choices ?? []).find((c) => c.text.trim() === String(repTrap)) : null;

  const lastStep = totalSteps - 1;
  const showLeaves = step >= 1;
  const showDedupe = step === lastStep - 1;
  const isFinal = step >= lastStep;

  // reveal leaves progressively across the middle steps
  const leafSteps = Math.max(1, lastStep - 2);
  const leavesShown = showLeaves ? Math.min(leaves.length, Math.ceil((Math.min(step, leafSteps) / leafSteps) * leaves.length)) : 0;

  const caption = isFinal
    ? `${picked.join(" + ")} = ${sum}`
    : showDedupe
    ? trapChoice
      ? `${repSlice.join("+")} = ${repTrap} — choice ${trapChoice.label}, but that skips ${sortedLeaves[0]}`
      : `distinct primes: ${distinct.join(", ")}`
    : showLeaves
    ? `${n} = ${leaves.slice(0, leavesShown).join(" × ")}${leavesShown < leaves.length ? " × ..." : ""}`
    : `factor ${n} down to primes`;

  const note = failure || "";

  // ---- geometry: simple binary tree, one branch per prime found ----
  const W = 300;
  const H = 190;
  const rowH = 44;
  const nodeR = 16;

  type Node = { x: number; y: number; val: number; isLeaf: boolean };
  const nodes: Node[] = [];
  const edges: [Node, Node][] = [];
  let running = n;
  const leftX = 60;
  for (let i = 0; i < leaves.length; i++) {
    const parent: Node = i === 0 ? { x: W / 2, y: 20, val: n, isLeaf: false } : nodes[nodes.length - 1];
    if (i === 0) nodes.push(parent);
    const p = leaves[i];
    const rest = running / p;
    const leafNode: Node = { x: leftX + i * 8, y: parent.y + rowH, val: p, isLeaf: true };
    const restNode: Node = { x: parent.x + (i === leaves.length - 1 ? 0 : 30), y: parent.y + rowH, val: rest, isLeaf: rest === 1 || i === leaves.length - 1 };
    nodes.push(leafNode);
    if (rest !== 1) nodes.push(restNode);
    edges.push([parent, leafNode]);
    if (rest !== 1) edges.push([parent, restNode]);
    running = rest;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {edges.slice(0, leavesShown + Math.max(0, leavesShown - 1)).map(([a, b], i) => (
          <motion.line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#cbd5e1"
            strokeWidth={1.4}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          />
        ))}

        {/* root */}
        <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <circle cx={W / 2} cy={20} r={nodeR} fill="#f8fafc" stroke={INK} strokeWidth={1.6} />
          <text x={W / 2} y={24} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
            {n}
          </text>
        </motion.g>

        {/* branch + leaf nodes, revealed one level per leaf found */}
        {(() => {
          const shown: JSX.Element[] = [];
          let rem = n;
          let py = 20,
            px = W / 2;
          for (let i = 0; i < leavesShown; i++) {
            const p = leaves[i];
            const rest = rem / p;
            const ly = py + rowH;
            const lx = leftX + i * 6;
            const rx = rest === 1 ? px : px + 26;
            shown.push(
              <motion.g key={`l${i}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <circle cx={lx} cy={ly} r={nodeR - 2} fill="#eef2ff" stroke={IND} strokeWidth={1.6} />
                <text x={lx} y={ly + 4} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                  {p}
                </text>
              </motion.g>,
            );
            if (rest !== 1) {
              shown.push(
                <motion.g key={`r${i}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.15 + 0.05 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <circle cx={rx} cy={ly} r={nodeR} fill="#f8fafc" stroke={INK} strokeWidth={1.6} />
                  <text x={rx} y={ly + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    {rest}
                  </text>
                </motion.g>,
              );
            }
            py = ly;
            px = rx;
            rem = rest;
          }
          return shown;
        })()}

        {/* the leaf collection row: all prime leaves found, then deduped */}
        <AnimatePresence>
          {showDedupe || isFinal ? (
            <motion.g key="collect" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {sortedLeaves.map((v, i) => {
                const keepIndex = sortedLeaves.findIndex((x) => x === v);
                const isFirstOccurrence = keepIndex === i;
                const fade = isFinal && !isFirstOccurrence;
                return (
                  <motion.g key={i} initial={{ opacity: 0, y: -6 }} animate={{ opacity: fade ? 0.25 : 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.08 }}>
                    <rect x={40 + i * 32} y={H - 34} width={26} height={22} rx={5} fill={isFirstOccurrence ? "#dcfce7" : "#fee2e2"} stroke={isFirstOccurrence ? WIN : BAD} strokeWidth={1.3} />
                    <text x={40 + i * 32 + 13} y={H - 19} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={isFirstOccurrence ? "#166534" : BAD} fontFamily={numberFont}>
                      {v}
                    </text>
                  </motion.g>
                );
              })}
            </motion.g>
          ) : null}
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
          color: isFinal ? "#166534" : showDedupe ? "#dc2626" : "#4338ca",
          background: isFinal ? "#dcfce7" : showDedupe ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showDedupe ? "#fecaca" : "#c7d2fe"}`,
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
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}
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
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
