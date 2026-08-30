import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";
const PEAR = "#84cc16";
const PEAR_JUICE = "#bef264";
const ORANGE = "#f97316";
const ORANGE_JUICE = "#fdba74";

function Fruit({ kind, x, y, delay = 0 }: { kind: "pear" | "orange"; x: number; y: number; delay?: number }) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.35 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 230, damping: 16, delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      {kind === "pear" ? (
        <>
          <path d={`M ${x} ${y - 12} C ${x - 3} ${y - 3}, ${x - 13} ${y + 1}, ${x - 12} ${y + 12} C ${x - 11} ${y + 25}, ${x + 11} ${y + 25}, ${x + 12} ${y + 12} C ${x + 13} ${y + 1}, ${x + 3} ${y - 3}, ${x} ${y - 12} Z`} fill={PEAR} stroke="#4d7c0f" strokeWidth="1.5" />
          <path d={`M ${x} ${y - 12} q 4 -8 9 -7`} fill="none" stroke="#713f12" strokeWidth="2" />
        </>
      ) : (
        <>
          <circle cx={x} cy={y + 7} r="14" fill={ORANGE} stroke="#c2410c" strokeWidth="1.5" />
          <path d={`M ${x} ${y - 7} q 5 -6 10 -2`} fill="none" stroke="#15803d" strokeWidth="2" />
        </>
      )}
    </motion.g>
  );
}

/** Equal fruit counts are converted to per-fruit juice, then poured into one blend. */
export function EqualFruitBlendScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const pearBatch = Math.round(num(data.pearBatch, 3));
  const orangeBatch = Math.round(num(data.orangeBatch, 2));
  const batchOunces = num(data.batchOunces, 8);
  const pearPer = batchOunces / pearBatch;
  const orangePer = batchOunces / orangeBatch;
  const commonDen = pearBatch;
  const pearParts = batchOunces;
  const orangeParts = orangePer * commonDen;
  const totalParts = pearParts + orangeParts;
  const percent = (pearParts / totalParts) * 100;
  const choice = (problem.choices ?? []).find((c) => Number(String(c.text).replace(/[^\d.-]/g, "")) === percent)?.label;
  const valid = Number.isInteger(totalParts) && Number.isInteger(percent) && `${percent}%` === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 460 310" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }} aria-label="Pear and orange batches are juiced, one of each is blended, and the pear percentage is counted">
        <text x="230" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "divide each 8-ounce batch by its fruit count" : phase === 1 ? "equal counts: compare one pear with one orange" : "pour one of each into the blend"}
        </text>

        {phase === 0 && (
          <>
            {(["pear", "orange"] as const).map((kind, row) => {
              const count = row === 0 ? pearBatch : orangeBatch;
              const per = row === 0 ? pearPer : orangePer;
              const y = 63 + row * 89;
              return (
                <g key={kind}>
                  {Array.from({ length: count }, (_, i) => <Fruit key={i} kind={kind} x={54 + i * 38} y={y} delay={i * 0.08 + row * 0.15} />)}
                  <motion.path d={`M 163 ${y + 7} h 35`} stroke={IND} strokeWidth="2" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                  <rect x="208" y={y - 19} width="72" height="48" rx="8" fill={row === 0 ? PEAR_JUICE : ORANGE_JUICE} stroke={row === 0 ? "#4d7c0f" : "#c2410c"} strokeWidth="1.6" />
                  <text x="244" y={y + 1} textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>{batchOunces} oz</text>
                  <text x="244" y={y + 18} textAnchor="middle" fontSize="9" fontWeight="800" fill={INK}>{kind} juice</text>
                  <motion.path d={`M 290 ${y + 7} h 28`} stroke={IND} strokeWidth="2" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
                  <rect x="328" y={y - 19} width="92" height="48" rx="8" fill="#eef2ff" stroke={IND} strokeWidth="1.6" />
                  <text x="374" y={y + 2} textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{batchOunces} ÷ {count}</text>
                  <text x="374" y={y + 19} textAnchor="middle" fontSize="10" fontWeight="850" fill={INK} fontFamily={FONT}>= {Number.isInteger(per) ? per : "8/3"} oz each</text>
                </g>
              );
            })}
            <text x="230" y="251" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>pear: 8/3 oz   •   orange: 4 oz</text>
          </>
        )}

        {phase === 1 && (
          <>
            <Fruit kind="pear" x={105} y={74} />
            <Fruit kind="orange" x={355} y={74} />
            <text x="105" y="119" textAnchor="middle" fontSize="13" fontWeight="900" fill="#4d7c0f" fontFamily={FONT}>8/3 oz</text>
            <text x="355" y="119" textAnchor="middle" fontSize="13" fontWeight="900" fill="#c2410c" fontFamily={FONT}>4 oz = 12/3 oz</text>
            <motion.path d="M 105 132 Q 150 166 192 182" fill="none" stroke="#4d7c0f" strokeWidth="2.2" markerEnd="url(#arrowPear)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <motion.path d="M 355 132 Q 310 166 268 182" fill="none" stroke="#c2410c" strokeWidth="2.2" markerEnd="url(#arrowOrange)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <rect x="170" y="185" width="120" height="66" rx="12" fill="#fff7ed" stroke={IND} strokeWidth="1.8" />
            <text x="230" y="208" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>ONE EQUAL-COUNT PAIR</text>
            <text x="230" y="234" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>8/3 + 12/3</text>
            <text x="230" y="273" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK}>Every additional pear-orange pair has this same ratio.</text>
          </>
        )}

        <AnimatePresence>
          {phase === 2 && (
            <motion.g key="blend" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x="230" y="42" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>multiply both amounts by 3: 8 pear parts + 12 orange parts</text>
              <path d="M 89 67 h 282 l -22 172 q -2 18 -20 18 H 131 q -18 0 -20 -18 Z" fill="#fff" stroke={INK} strokeWidth="2" />
              {Array.from({ length: totalParts }, (_, i) => {
                const isPear = i < pearParts;
                const col = i % 10;
                const row = Math.floor(i / 10);
                return (
                  <motion.g key={i} initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.035, type: "spring", stiffness: 190, damping: 18 }}>
                    <rect x={119 + col * 22} y={199 - row * 54} width="20" height="50" rx="3" fill={isPear ? PEAR_JUICE : ORANGE_JUICE} stroke={isPear ? "#65a30d" : "#ea580c"} strokeWidth="1" />
                  </motion.g>
                );
              })}
              <text x="166" y="129" textAnchor="middle" fontSize="10" fontWeight="900" fill="#4d7c0f" fontFamily={FONT}>8 pear</text>
              <text x="294" y="129" textAnchor="middle" fontSize="10" fontWeight="900" fill="#c2410c" fontFamily={FONT}>12 orange</text>
              <text x="230" y="280" textAnchor="middle" fontSize="17" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>8 ÷ 20 = {percent}% pear juice</text>
              <text x="230" y="297" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? "one pair proves the ratio for any equal number of fruits" : `check failed: computed ${percent}%, stored ${problem.shortAnswer}`}</text>
            </motion.g>
          )}
        </AnimatePresence>

        <defs>
          <marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill={IND} /></marker>
          <marker id="arrowPear" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#4d7c0f" /></marker>
          <marker id="arrowOrange" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#c2410c" /></marker>
        </defs>
        <SvgAnswerBadge show={final && valid} answer={problem.answer} cx={400} y={270} width={72} />
      </svg>
    </div>
  );
}
