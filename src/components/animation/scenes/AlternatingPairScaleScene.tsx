import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

/** Pair −odd with the next +even, count the +1 tiles, then apply the outside scale. */
export function AlternatingPairScaleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const lastTerm = Math.round(num(data.lastTerm, 0));
  const factor = Math.round(num(data.outsideFactor, 0));
  const pairs = lastTerm / 2;
  const pairValue = 1;
  const innerSum = pairs * pairValue;
  const result = factor * innerSum;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d.-]/g, ""));
  const choice = (problem.choices ?? []).find((c) => Number(String(c.text).replace(/[^\d.-]/g, "")) === result)?.label;
  const ok = Number.isFinite(stored) && stored === result && choice === problem.answer;
  const failure = stored !== result ? `computed ${result}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(Math.max(step, 0), 1);
  const shown = [[1, 2], [3, 4], [5, 6], [lastTerm - 1, lastTerm]];

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 440 270" width="100%" style={{ maxWidth: 470, minWidth: 0, display: "block" }}>
      <text x="220" y="20" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>
        {phase === 0 ? "neighboring terms snap into pairs" : phase === 1 ? "every pair leaves exactly one" : "the outside 4 scales the whole collection"}
      </text>

      <g transform="translate(24 45)">
        {shown.map(([odd, even], i) => {
          const x = [0, 86, 172, 294][i];
          return <g key={odd}>
            {i === 3 && <text x={x - 16} y="25" textAnchor="middle" fontSize="16" fill={DIM}>⋯</text>}
            <AnimatePresence mode="wait" initial={false}>
              {phase === 0 ? <motion.g key="terms" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <rect x={x} y="0" width="39" height="32" rx="7" fill="#fee2e2" stroke={RED} />
                <text x={x + 19.5} y="21" textAnchor="middle" fontSize="11" fontWeight="900" fill={RED} fontFamily={FONT}>−{odd}</text>
                <text x={x + 45} y="21" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK}>+</text>
                <rect x={x + 51} y="0" width="39" height="32" rx="7" fill="#eef2ff" stroke={IND} />
                <text x={x + 70.5} y="21" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>{even}</text>
                <path d={`M ${x},40 v5 h90 v-5`} fill="none" stroke={DIM} strokeWidth="1.3" />
              </motion.g> : <motion.g key="one" initial={{ opacity: 0, scale: 0.35 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 17, delay: i * 0.08 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <rect x={x + 24} y="2" width="44" height="38" rx="9" fill="#dcfce7" stroke={GREEN} strokeWidth="2" />
                <text x={x + 46} y="27" textAnchor="middle" fontSize="17" fontWeight="900" fill={GREEN} fontFamily={FONT}>+1</text>
              </motion.g>}
            </AnimatePresence>
            <text x={x + 45} y="62" textAnchor="middle" fontSize="9" fontWeight="800" fill={DIM} fontFamily={FONT}>{phase === 0 ? `−${odd} + ${even}` : "one pair"}</text>
          </g>;
        })}
      </g>

      {phase >= 1 && <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <rect x="55" y="127" width="330" height="48" rx="13" fill="#f8fafc" stroke="#cbd5e1" />
        <text x="220" y="148" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>terms 1 through {lastTerm} make {pairs} pairs</text>
        <text x="220" y="166" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{pairs} × (+1) = {innerSum}</text>
      </motion.g>}

      {phase === 2 && <motion.g initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 190, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx="86" cy="216" r="25" fill="#eef2ff" stroke={IND} strokeWidth="2" />
        <text x="86" y="222" textAnchor="middle" fontSize="20" fontWeight="900" fill={IND} fontFamily={FONT}>×{factor}</text>
        <path d="M 116 216 H 146" stroke={IND} strokeWidth="2.5" markerEnd="url(#arrow)" />
        <rect x="153" y="192" width="170" height="48" rx="12" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" />
        <text x="238" y="222" textAnchor="middle" fontSize="18" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{factor} × {innerSum} = {result}</text>
        <defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={IND} /></marker></defs>
      </motion.g>}
      {phase === 0 && <text x="220" y="211" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>(−1+2)+(−3+4)+⋯+(−999+1000)</text>}
      {phase === 1 && <text x="220" y="215" textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>the same +1 result repeats from the first pair to the last</text>}
      {final && <text x="220" y="260" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "pair count, product, and answer choice verified" : failure}</text>}
      <SvgAnswerBadge show={final && ok} answer={problem.answer ?? null} cx={380} y={194} width={80} />
    </svg>
  </div>;
}
