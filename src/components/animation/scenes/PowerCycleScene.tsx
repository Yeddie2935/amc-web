import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/** The units-digit cycle of `d`, e.g. 3 → [3, 9, 7, 1] before it repeats. */
function unitsCycle(d: number): number[] {
  const seq: number[] = [];
  let cur = d % 10;
  seq.push(cur);
  for (let i = 0; i < 20; i++) {
    cur = (cur * d) % 10;
    if (cur === seq[0]) break;
    seq.push(cur);
  }
  return seq;
}

/**
 * A big power's units digit, read off a short repeating cycle. Six beats:
 * (0) only the base's units digit matters; (1) the cycle builds tile by
 * tile as successive powers are taken; (2) one more power loops back to
 * the start, closing the cycle and confirming its length; (3) the exponent
 * is located in the cycle via its remainder; (4) the trap — a remainder of
 * 0 tempts you to point at the *first* cycle slot, a real (wrong) choice,
 * when it actually means the *last* one; (5) the badge. Data: { base,
 * exponent }.
 */
export function PowerCycleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const base = Math.round(num(data.base, 3));
  const exponent = Math.round(num(data.exponent, 1));
  const d = ((base % 10) + 10) % 10;

  const cycle = unitsCycle(d);
  const L = cycle.length;
  const rem = exponent % L;
  const idx = rem === 0 ? L - 1 : rem - 1;
  const result = cycle[idx];

  const naiveIdx = 0;
  const naiveResult = cycle[naiveIdx];
  const trap = rem === 0 ? (problem.choices ?? []).find((c) => c.text.trim() === String(naiveResult)) : undefined;

  const last = totalSteps - 1;
  const showCycle = step >= 1;
  const cycleReveal = showCycle ? L : 0;
  const showLoop = step >= 2;
  const showLocate = step >= 3;
  const showTrap = step === 4;
  const isFinal = step >= last;

  const tw = 44;
  const gap = 10;
  const x0 = 20;
  const tileY = 40;
  const th = 46;
  const ghostVisible = showLoop;
  const tileCount = L + 1;
  const W = tileCount * tw + (tileCount - 1) * gap + x0 * 2;
  const H = 140;
  const tx = (i: number) => x0 + i * (tw + gap);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        <text x={W / 2} y={16} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>
          {base}^n behaves like {d}^n — only the units digit matters
        </text>

        {cycle.map((v, i) => {
          const revealed = i < cycleReveal;
          const isTarget = showLocate && i === idx;
          const isNaive = showTrap && i === naiveIdx && naiveIdx !== idx;
          return (
            <AnimatePresence key={i}>
              {revealed && (
                <motion.g initial={{ opacity: 0, y: -10, scale: 0.6 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.1 }}>
                  <rect
                    x={tx(i)}
                    y={tileY}
                    width={tw}
                    height={th}
                    rx={8}
                    fill={isFinal && isTarget ? "#dcfce7" : isTarget ? `${MARK}18` : isNaive ? "#fee2e2" : "#f1f5f9"}
                    stroke={isFinal && isTarget ? WIN : isTarget ? MARK : isNaive ? BAD : "#cbd5e1"}
                    strokeWidth={isTarget || isNaive ? 2.2 : 1.4}
                  />
                  <text x={tx(i) + tw / 2} y={tileY + th / 2 + 2} textAnchor="middle" fontSize="17" fontWeight="900" fill={isFinal && isTarget ? WIN : isTarget ? MARK : isNaive ? BAD : INK} fontFamily={FONT}>
                    {v}
                  </text>
                  <text x={tx(i) + tw / 2} y={tileY + th + 13} textAnchor="middle" fontSize="9" fontWeight="700" fill={DIM} fontFamily={FONT}>
                    {d}^{i + 1}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          );
        })}

        <AnimatePresence>
          {ghostVisible && (
            <motion.g key="ghost" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={tx(L)} y={tileY} width={tw} height={th} rx={8} fill="#faf5ff" stroke="#a78bfa" strokeWidth={1.6} strokeDasharray="4 3" />
              <text x={tx(L) + tw / 2} y={tileY + th / 2 + 2} textAnchor="middle" fontSize="17" fontWeight="900" fill="#7c3aed" fontFamily={FONT}>
                {cycle[0]}
              </text>
              <text x={tx(L) + tw / 2} y={tileY + th + 13} textAnchor="middle" fontSize="9" fontWeight="700" fill={DIM} fontFamily={FONT}>
                {d}^{L + 1}
              </text>
              <path
                d={`M ${tx(L) + tw / 2} ${tileY - 6} C ${tx(L) + tw / 2} ${tileY - 24}, ${tx(0) + tw / 2} ${tileY - 24}, ${tx(0) + tw / 2} ${tileY - 6}`}
                fill="none"
                stroke="#a78bfa"
                strokeWidth={1.6}
                markerEnd="url(#arrow)"
              />
            </motion.g>
          )}
        </AnimatePresence>

        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#a78bfa" />
          </marker>
        </defs>
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
          maxWidth: 320,
          color: isFinal ? WIN : showTrap ? BAD : showLocate ? MARK : showLoop ? "#7c3aed" : DIM,
        }}
      >
        {isFinal
          ? `units digit of ${base}^${exponent} = ${result}`
          : showTrap
          ? `remainder 0 might tempt "first slot" (${naiveResult})${trap ? ` — matches choice ${trap.label}` : ""}, but it means the *last* slot instead`
          : showLocate
          ? `${exponent} ÷ ${L} = ${Math.floor(exponent / L)} remainder ${rem}${rem === 0 ? ` — a whole number of cycles, so it lands on the last slot` : ` — lands on slot ${idx + 1}`}`
          : showLoop
          ? `${d}^${L + 1} ends in ${cycle[0]} again — the cycle repeats every ${L}`
          : showCycle
          ? `the units digit cycles through ${cycle.join(", ")}, then repeats`
          : `${base} has units digit ${d}, so ${base}^n and ${d}^n always end the same way`}
      </motion.div>

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
