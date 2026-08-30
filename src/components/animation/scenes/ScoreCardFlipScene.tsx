import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

function SymbolicStack({ x, label, score, good }: { x: number; label: string; score: string; good: boolean }) {
  const color = good ? GREEN : RED;
  return (
    <motion.g initial={{ opacity: 0, scale: 0.55 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 17 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      {[0, 1, 2].map((i) => <rect key={i} x={x + i * 9} y={75 - i * 5} width="74" height="74" rx="11" fill={good ? "#dcfce7" : "#fee2e2"} stroke={color} strokeWidth="1.7" />)}
      <text x={x + 55} y="111" textAnchor="middle" fontSize="24" fontWeight="950" fill={color} fontFamily={FONT}>{label}</text>
      <text x={x + 55} y="137" textAnchor="middle" fontSize="11" fontWeight="900" fill={color} fontFamily={FONT}>{score}</text>
    </motion.g>
  );
}

/** Model c correct and 10−c incorrect cards, then solve by flipping from the all-wrong baseline. */
export function ScoreCardFlipScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const totalProblems = Math.round(num(data.totalProblems, 10));
  const correctPoints = num(data.correctPoints, 5);
  const incorrectPenalty = num(data.incorrectPenalty, 2);
  const finalScore = num(data.finalScore, 29);
  const baseline = -totalProblems * incorrectPenalty;
  const gainPerFlip = correctPoints + incorrectPenalty;
  const correct = (finalScore - baseline) / gainPerFlip;
  const incorrect = totalProblems - correct;
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === correct)?.label;
  const valid = Number.isInteger(correct) && correct >= 0 && correct <= totalProblems && String(correct) === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 480 315" width="100%" style={{ maxWidth: 510, minWidth: 0, display: "block" }} aria-label="Ten contest answer cards flip from incorrect to correct, gaining seven points each until the score reaches twenty-nine">
        <text x="240" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "all 10 answer cards split into correct and incorrect groups" : phase === 1 ? "attach each group's score contribution" : "start all wrong, then flip cards to correct"}
        </text>

        {phase === 0 && (
          <>
            {Array.from({ length: totalProblems }, (_, i) => (
              <motion.g key={i} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.055 }}>
                <rect x={31 + i * 43} y="61" width="35" height="49" rx="7" fill="#f8fafc" stroke={IND} strokeWidth="1.5" />
                <text x={48.5 + i * 43} y="91" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{i + 1}</text>
              </motion.g>
            ))}
            <motion.path d="M 48 130 Q 137 158 226 130" fill="none" stroke={GREEN} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <motion.path d="M 254 130 Q 343 158 432 130" fill="none" stroke={RED} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <text x="137" y="172" textAnchor="middle" fontSize="20" fontWeight="950" fill={GREEN} fontFamily={FONT}>c correct</text>
            <text x="343" y="172" textAnchor="middle" fontSize="20" fontWeight="950" fill={RED} fontFamily={FONT}>{totalProblems} − c incorrect</text>
            <motion.g initial={{ opacity: 0, scale: 0.65 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.65, type: "spring" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x="115" y="226" width="250" height="42" rx="12" fill="#eef2ff" stroke={IND} />
              <text x="240" y="252" textAnchor="middle" fontSize="17" fontWeight="950" fill={IND} fontFamily={FONT}>c + ({totalProblems} − c) = {totalProblems}</text>
            </motion.g>
          </>
        )}

        {phase === 1 && (
          <>
            <SymbolicStack x={70} label="c" score={`+${correctPoints} each`} good />
            <SymbolicStack x={300} label={`${totalProblems}−c`} score={`−${incorrectPenalty} each`} good={false} />
            <motion.path d="M 172 119 H 232 M 288 119 H 248" stroke={IND} strokeWidth="2" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <circle cx="240" cy="119" r="25" fill="#eef2ff" stroke={IND} strokeWidth="2" />
            <text x="240" y="126" textAnchor="middle" fontSize="18" fontWeight="950" fill={IND} fontFamily={FONT}>{finalScore}</text>
            <rect x="82" y="206" width="316" height="55" rx="13" fill="#eef2ff" stroke={IND} strokeWidth="2" />
            <text x="240" y="227" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>TOTAL SCORE</text>
            <text x="240" y="250" textAnchor="middle" fontSize="18" fontWeight="950" fill={IND} fontFamily={FONT}>{correctPoints}c − {incorrectPenalty}({totalProblems} − c) = {finalScore}</text>
          </>
        )}

        <AnimatePresence>
          {phase === 2 && (
            <motion.g key="flips" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x="240" y="43" textAnchor="middle" fontSize="11" fontWeight="900" fill={RED} fontFamily={FONT}>all wrong: {totalProblems} × (−{incorrectPenalty}) = {baseline}</text>
              {Array.from({ length: totalProblems }, (_, i) => {
                const flipped = i < correct;
                const x = 31 + i * 43;
                return (
                  <motion.g key={i} initial={{ rotateY: flipped ? 180 : 0, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ delay: i * 0.09, type: "spring", stiffness: 190, damping: 18 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <rect x={x} y="65" width="35" height="58" rx="7" fill={flipped ? "#dcfce7" : "#fee2e2"} stroke={flipped ? GREEN : RED} strokeWidth="1.7" />
                    <text x={x + 17.5} y="88" textAnchor="middle" fontSize="15" fontWeight="950" fill={flipped ? GREEN : RED}>{flipped ? "✓" : "×"}</text>
                    <text x={x + 17.5} y="108" textAnchor="middle" fontSize="9" fontWeight="900" fill={flipped ? GREEN : RED} fontFamily={FONT}>{flipped ? `+${correctPoints}` : `−${incorrectPenalty}`}</text>
                  </motion.g>
                );
              })}
              <text x="240" y="147" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>each flip: −{incorrectPenalty} → +{correctPoints}, so gain {gainPerFlip}</text>
              {Array.from({ length: correct + 1 }, (_, i) => {
                const score = baseline + i * gainPerFlip;
                const x = 70 + i * 48;
                return <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.11 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><circle cx={x} cy="188" r="15" fill={i === correct ? "#dcfce7" : "#eef2ff"} stroke={i === correct ? GREEN : IND} /><text x={x} y="192" textAnchor="middle" fontSize="9" fontWeight="900" fill={i === correct ? GREEN : IND} fontFamily={FONT}>{score}</text>{i < correct && <text x={x + 24} y="192" textAnchor="middle" fontSize="10" fontWeight="900" fill={DIM}>+7</text>}</motion.g>;
              })}
              <rect x="75" y="230" width="330" height="52" rx="13" fill={valid ? "#dcfce7" : "#fee2e2"} stroke={valid ? GREEN : RED} strokeWidth="2" />
              <text x="240" y="251" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>NEEDED GAIN</text>
              <text x="240" y="273" textAnchor="middle" fontSize="16" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>({finalScore} − ({baseline})) ÷ {gainPerFlip} = {correct} correct</text>
              <text x="202" y="305" textAnchor="middle" fontSize="9" fontWeight="800" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? `${correct} correct + ${incorrect} incorrect = ${totalProblems} • score and choice verified` : `check failed: computed ${correct}, stored ${problem.shortAnswer}`}</text>
              <SvgAnswerBadge show={valid} answer={problem.answer} cx={430} y={285} width={72} />
            </motion.g>
          )}
        </AnimatePresence>
        <defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill={IND} /></marker></defs>
      </svg>
    </div>
  );
}
