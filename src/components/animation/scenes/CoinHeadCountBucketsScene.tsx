import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";
const GOLD = "#facc15";

const enumerate = (tosses: number) => Array.from({ length: 2 ** tosses }, (_, value) =>
  Array.from({ length: tosses }, (_, bit) => ((value >> (tosses - bit - 1)) & 1) === 1 ? "H" : "T").join("")
);

function Coin({ x, y, side, delay = 0 }: { x: number; y: number; side: string; delay?: number }) {
  return (
    <motion.g initial={{ opacity: 0, rotateY: 90, scale: 0.45 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} transition={{ delay, type: "spring", stiffness: 220, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <circle cx={x} cy={y} r="15" fill={side === "H" ? GOLD : "#e2e8f0"} stroke={side === "H" ? "#a16207" : DIM} strokeWidth="1.5" />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="12" fontWeight="950" fill={INK} fontFamily={FONT}>{side}</text>
    </motion.g>
  );
}

/** Sort every fair-coin outcome by head count, then pack favorable outcomes into the sample-space grid. */
export function CoinHeadCountBucketsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const tosses = Math.round(num(data.tosses, 4));
  const minHeads = Math.round(num(data.minHeads, Math.ceil(tosses / 2)));
  const outcomes = enumerate(tosses);
  const buckets = Array.from({ length: tosses + 1 }, (_, heads) => outcomes.filter((s) => [...s].filter((c) => c === "H").length === heads));
  const favorable = outcomes.filter((s) => [...s].filter((c) => c === "H").length >= minHeads);
  const total = outcomes.length;
  const numerator = favorable.length;
  const fraction = `${numerator}/${total}`;
  const choice = (problem.choices ?? []).find((c) => c.text.trim() === fraction)?.label;
  const valid = fraction === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 480 315" width="100%" style={{ maxWidth: 510, minWidth: 0, display: "block" }} aria-label="All sixteen four-coin outcomes sort by head count, with eleven favorable outcomes">
        <text x="240" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "at least as many heads as tails means H ≥ 2" : phase === 1 ? "sort all 16 outcomes by number of heads" : "pack the favorable outcomes into the whole sample space"}
        </text>

        {phase === 0 && (
          <>
            <text x="116" y="53" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>FOUR TOSSES</text>
            {[0, 1, 2, 3].map((i) => <Coin key={i} x={65 + i * 34} y={83} side={i < 2 ? "H" : "T"} delay={i * 0.1} />)}
            <motion.path d="M 48 125 H 202" stroke={INK} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <polygon points="125,125 112,148 138,148" fill="#cbd5e1" stroke={INK} />
            <text x="76" y="119" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>heads</text>
            <text x="174" y="119" textAnchor="middle" fontSize="11" fontWeight="900" fill={DIM} fontFamily={FONT}>tails</text>
            <text x="125" y="172" textAnchor="middle" fontSize="13" fontWeight="950" fill={IND} fontFamily={FONT}>H ≥ T</text>

            <text x="350" y="48" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>HEAD-COUNT GATES</text>
            {[0, 1, 2, 3, 4].map((heads) => {
              const good = heads >= minHeads;
              return (
                <motion.g key={heads} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: heads * 0.1 }}>
                  <rect x={286 + (heads % 3) * 64} y={66 + Math.floor(heads / 3) * 58} width="52" height="42" rx="9" fill={good ? "#dcfce7" : "#f8fafc"} stroke={good ? GREEN : DIM} strokeWidth={good ? 2 : 1.3} />
                  <text x={312 + (heads % 3) * 64} y={84 + Math.floor(heads / 3) * 58} textAnchor="middle" fontSize="10" fontWeight="850" fill={good ? GREEN : DIM}>{heads} heads</text>
                  <text x={312 + (heads % 3) * 64} y={101 + Math.floor(heads / 3) * 58} textAnchor="middle" fontSize="13" fontWeight="950" fill={good ? GREEN : RED}>{good ? "OPEN" : "NO"}</text>
                </motion.g>
              );
            })}
            <text x="240" y="245" textAnchor="middle" fontSize="16" fontWeight="950" fill={IND} fontFamily={FONT}>favorable head counts: 2, 3, 4</text>
          </>
        )}

        {phase === 1 && (
          <>
            {buckets.map((bucket, heads) => {
              const x = 12 + heads * 92;
              const good = heads >= minHeads;
              return (
                <g key={heads}>
                  <rect x={x} y="40" width="82" height="208" rx="10" fill={good ? "#f0fdf4" : "#f8fafc"} stroke={good ? GREEN : "#cbd5e1"} strokeWidth={good ? 1.8 : 1.2} />
                  <text x={x + 41} y="58" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={good ? GREEN : DIM}>{heads} H</text>
                  {bucket.map((outcome, i) => (
                    <motion.g key={outcome} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (heads + i) * 0.055 }}>
                      <rect x={x + 9} y={68 + i * 25} width="64" height="20" rx="5" fill={good ? "#dcfce7" : "#fff"} stroke={good ? GREEN : DIM} />
                      <text x={x + 41} y={82 + i * 25} textAnchor="middle" fontSize="10" fontWeight="900" fill={good ? INK : DIM} fontFamily={FONT}>{outcome}</text>
                    </motion.g>
                  ))}
                  <text x={x + 41} y="269" textAnchor="middle" fontSize="14" fontWeight="950" fill={good ? GREEN : DIM} fontFamily={FONT}>{bucket.length}</text>
                </g>
              );
            })}
            <text x="332" y="292" textAnchor="middle" fontSize="16" fontWeight="950" fill={GREEN} fontFamily={FONT}>{buckets.slice(minHeads).map((b) => b.length).join(" + ")} = {numerator}</text>
          </>
        )}

        <AnimatePresence>
          {phase === 2 && (
            <motion.g key="sample" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x="160" y="43" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>ALL 2⁴ = {total} EQUALLY LIKELY OUTCOMES</text>
              {outcomes.map((outcome, i) => {
                const good = favorable.includes(outcome);
                const col = i % 4;
                const row = Math.floor(i / 4);
                const x = 36 + col * 65;
                const y = 56 + row * 48;
                return (
                  <motion.g key={outcome} initial={{ opacity: 0, scale: 0.35 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.045, type: "spring" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <rect x={x} y={y} width="56" height="38" rx="7" fill={good ? "#dcfce7" : "#f1f5f9"} stroke={good ? GREEN : DIM} strokeWidth={good ? 1.7 : 1.1} />
                    <text x={x + 28} y={y + 16} textAnchor="middle" fontSize="9.5" fontWeight="900" fill={good ? INK : DIM} fontFamily={FONT}>{outcome}</text>
                    <text x={x + 28} y={y + 30} textAnchor="middle" fontSize="8" fontWeight="850" fill={good ? GREEN : RED}>{good ? "keep" : "out"}</text>
                  </motion.g>
                );
              })}
              <g transform="translate(326 64)">
                <rect width="126" height="154" rx="14" fill={valid ? "#f0fdf4" : "#fef2f2"} stroke={valid ? GREEN : RED} strokeWidth="2" />
                <text x="63" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>PROBABILITY</text>
                <text x="63" y="62" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>{numerator} favorable</text>
                <line x1="25" y1="75" x2="101" y2="75" stroke={INK} strokeWidth="1.8" />
                <text x="63" y="99" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>{total} total</text>
                <text x="63" y="133" textAnchor="middle" fontSize="23" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>= {fraction}</text>
              </g>
              <text x="205" y="280" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? "6 + 4 + 1 favorable outcomes • choice verified" : `check failed: computed ${fraction}, stored ${problem.shortAnswer}`}</text>
              <SvgAnswerBadge show={valid} answer={problem.answer} cx={426} y={269} width={72} />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
