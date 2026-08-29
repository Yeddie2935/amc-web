import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const MODE = "#f59e0b";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const fmt = (v: number) => (Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100));

/**
 * A list of numbers plus one unknown, where the mean, median, and mode must
 * all come out equal. Six beats: (0) the list, with the value that already
 * repeats flagged as the natural mode candidate; (1) the trap — setting the
 * unknown to that same repeated value looks tempting and matches a real
 * choice, but the resulting mean isn't even a whole number; (2) the target
 * total is set from mean = target; (3) the unknown is solved from the
 * known sum; (4) all three statistics are checked against the same target;
 * (5) the badge. Data: { known: number[], target } — `known` given in
 * already-sorted order with the unknown's slot to be inserted at the end.
 */
export function TripleStatSolveScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const known = (Array.isArray(data.known) ? data.known : []).map((v) => num(v, 0));
  const target = num(data.target, 0);
  if (known.length < 3) return null;

  const n = known.length + 1;
  const knownSum = known.reduce((a, b) => a + b, 0);
  const totalNeeded = target * n;
  const x = totalNeeded - knownSum;

  // the repeated value among the known numbers (the natural mode candidate)
  const counts = new Map<number, number>();
  known.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  const repeated = [...counts.entries()].find(([, c]) => c >= 2)?.[0] ?? target;
  const repeatIdx = known.map((v, i) => (v === repeated ? i : -1)).filter((i) => i >= 0);

  const trapSum = knownSum + repeated;
  const trapMean = trapSum / n;
  const trapChoice = (problem.choices ?? []).find((c) => c.text.trim() === String(repeated));

  const full = [...known, x];
  const medianIdx = Math.floor(n / 2);
  const median = full[medianIdx];
  const finalCounts = new Map<number, number>();
  full.forEach((v) => finalCounts.set(v, (finalCounts.get(v) ?? 0) + 1));
  const modeVal = [...finalCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const modeIsUnique = [...finalCounts.values()].filter((c) => c === Math.max(...finalCounts.values())).length === 1;
  const mean = totalNeeded / n;
  const allEqual = modeIsUnique && modeVal === target && median === target && mean === target;

  const last = totalSteps - 1;
  const isTrapStep = step === 1;
  const showTarget = step >= 2;
  const showSolve = step >= 3;
  const showCheck = step >= 4;
  const isFinal = step >= last;

  const tw = 38;
  const gap = 8;
  const x0 = 14;
  const tileY = 24;
  const th = 38;
  const W = n * tw + (n - 1) * gap + x0 * 2;
  const H = 108;
  const tx = (i: number) => x0 + i * (tw + gap);

  const xLabel = isTrapStep ? String(repeated) : showSolve ? String(x) : "?";
  const xColor = isTrapStep ? "#d97706" : showSolve ? (isFinal ? WIN : MARK) : DIM;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {known.map((v, i) => {
          const isMode = repeatIdx.includes(i);
          return (
            <g key={i}>
              <rect
                x={tx(i)}
                y={tileY}
                width={tw}
                height={th}
                rx={7}
                fill={isMode ? `${MODE}22` : "#f1f5f9"}
                stroke={isMode ? MODE : "#cbd5e1"}
                strokeWidth={isMode ? 2 : 1.4}
              />
              <text x={tx(i) + tw / 2} y={tileY + th / 2 + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={isMode ? "#92400e" : INK} fontFamily={FONT}>
                {v}
              </text>
            </g>
          );
        })}

        <motion.g key={xLabel} initial={{ opacity: 0, y: -10, scale: 0.6 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>
          <rect
            x={tx(known.length)}
            y={tileY}
            width={tw}
            height={th}
            rx={7}
            fill={isTrapStep ? "#fef3c7" : showSolve ? `${xColor}18` : "#faf5ff"}
            stroke={xColor}
            strokeWidth={2}
            strokeDasharray={showSolve || isTrapStep ? undefined : "4 3"}
          />
          <text x={tx(known.length) + tw / 2} y={tileY + th / 2 + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={xColor} fontFamily={FONT}>
            {xLabel}
          </text>
          {isTrapStep && (
            <line x1={tx(known.length) + 4} y1={tileY + 4} x2={tx(known.length) + tw - 4} y2={tileY + th - 4} stroke={BAD} strokeWidth={2} />
          )}
        </motion.g>

        <AnimatePresence>
          {!isTrapStep && (
            <motion.g key="bracket" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <path
                d={`M ${tx(repeatIdx[0])} ${tileY - 5} L ${tx(repeatIdx[0])} ${tileY - 10} L ${tx(repeatIdx[repeatIdx.length - 1]) + tw} ${tileY - 10} L ${tx(repeatIdx[repeatIdx.length - 1]) + tw} ${tileY - 5}`}
                fill="none"
                stroke={MODE}
                strokeWidth={1.4}
              />
              <text x={(tx(repeatIdx[0]) + tx(repeatIdx[repeatIdx.length - 1]) + tw) / 2} y={tileY - 15} textAnchor="middle" fontSize="9" fontWeight="800" fill="#92400e" fontFamily={FONT}>
                repeats already
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCheck && (
            <motion.g key="median" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
              <path d={`M ${tx(medianIdx) + tw / 2} ${tileY + th + 6} L ${tx(medianIdx) + tw / 2 - 5} ${tileY + th + 14} L ${tx(medianIdx) + tw / 2 + 5} ${tileY + th + 14} Z`} fill={MARK} />
              <text x={tx(medianIdx) + tw / 2} y={tileY + th + 26} textAnchor="middle" fontSize="9" fontWeight="800" fill={MARK} fontFamily={FONT}>
                median
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontFamily: FONT,
          fontSize: 11,
          fontWeight: 800,
          textAlign: "center",
          maxWidth: 340,
          color: isFinal ? WIN : showCheck ? WIN : showSolve ? MARK : showTarget ? MARK : isTrapStep ? "#d97706" : DIM,
        }}
      >
        {isFinal
          ? `x = ${x}`
          : showCheck
          ? `median = ${median}, mode = ${modeVal} (unique), mean = ${totalNeeded}÷${n} = ${fmt(mean)} — all equal ${target}`
          : showSolve
          ? `${totalNeeded} − ${knownSum} = ${x}`
          : showTarget
          ? `mean = median = mode = ${target}, so the total must be ${n} × ${target} = ${totalNeeded}`
          : isTrapStep
          ? `${knownSum} + ${repeated} = ${trapSum}, mean = ${trapSum}/${n} ≈ ${fmt(Math.round(trapMean * 100) / 100)}${trapChoice ? ` — matches choice ${trapChoice.label}, but that's not a whole number` : ""}`
          : `${repeated} already appears twice — the natural mode candidate`}
      </motion.div>

      <AnimatePresence>
        {isFinal && !allEqual && (
          <motion.div key="warn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 9.5, fontWeight: 700, color: BAD, textAlign: "center" }}>
            mean/median/mode do not all agree at {target}
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
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
