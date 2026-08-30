import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";
const ZERO = "#facc15";

function Pattern({ x, y, zeroAt, rejected = false }: { x: number; y: number; zeroAt: number; rejected?: boolean }) {
  return (
    <g>
      {[0, 1, 2].map((slot) => (
        <motion.g key={slot} initial={{ opacity: 0, y: -10 }} animate={{ opacity: rejected ? 0.52 : 1, y: 0 }} transition={{ delay: slot * 0.08 }}>
          <rect x={x + slot * 55} y={y} width="47" height="58" rx="8" fill={slot === zeroAt ? "#fef9c3" : "#eef2ff"} stroke={slot === zeroAt ? "#a16207" : IND} strokeWidth="1.7" />
          <text x={x + slot * 55 + 23.5} y={y + 37} textAnchor="middle" fontSize="24" fontWeight="950" fill={slot === zeroAt ? "#a16207" : IND} fontFamily={FONT}>{slot === zeroAt ? "0" : slot === 0 || (zeroAt === 0 && slot === 1) ? "a" : "b"}</text>
        </motion.g>
      ))}
      {rejected && <motion.path d={`M ${x - 5} ${y + 4} L ${x + 52} ${y + 54} M ${x + 52} ${y + 4} L ${x - 5} ${y + 54}`} stroke={RED} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
    </g>
  );
}

function ChoiceGrid({ x, y, color, delay = 0 }: { x: number; y: number; color: string; delay?: number }) {
  const cell = 12;
  return (
    <g>
      {Array.from({ length: 81 }, (_, i) => (
        <motion.rect key={i} x={x + (i % 9) * cell} y={y + Math.floor(i / 9) * cell} width="10" height="10" rx="2" fill={`${color}28`} stroke={color} strokeWidth="0.8" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: delay + i * 0.008 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      ))}
    </g>
  );
}

/** Reject a leading zero, count the two legal zero-position cases, and join their 9×9 outcome grids. */
export function ZeroSlotCaseGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const places = Math.round(num(data.places, 3));
  const nonzeroDigits = Array.isArray(data.nonzeroDigits) ? data.nonzeroDigits.map(Number) : [];
  const legalZeroPlaces = places - 1;
  const choicesPerCase = nonzeroDigits.length ** (places - 1);
  const total = legalZeroPlaces * choicesPerCase;
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === total)?.label;
  const valid = String(total) === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 480 315" width="100%" style={{ maxWidth: 510, minWidth: 0, display: "block" }} aria-label="The zero may occupy the tens or ones place, producing two grids of eighty-one three-digit numbers">
        <text x="240" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "try the single zero card in each three-digit slot" : phase === 1 ? "each legal pattern has two independent nonzero digits" : "join the two disjoint case grids"}
        </text>

        {phase === 0 && (
          <>
            <g transform="translate(24 52)"><Pattern x={0} y={0} zeroAt={0} rejected /><text x="78" y="80" textAnchor="middle" fontSize="10" fontWeight="900" fill={RED}>not three-digit</text></g>
            <motion.path d="M 194 82 H 225" stroke={DIM} strokeWidth="2" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <g transform="translate(236 52)"><Pattern x={0} y={0} zeroAt={1} /><text x="78" y="80" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN} fontFamily={FONT}>a0b</text></g>
            <motion.path d="M 194 181 H 225" stroke={DIM} strokeWidth="2" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25 }} />
            <g transform="translate(236 151)"><Pattern x={0} y={0} zeroAt={2} /><text x="78" y="80" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN} fontFamily={FONT}>ab0</text></g>
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, type: "spring" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x="119" y="258" width="242" height="38" rx="12" fill="#dcfce7" stroke={GREEN} />
              <text x="240" y="282" textAnchor="middle" fontSize="15" fontWeight="950" fill={GREEN} fontFamily={FONT}>2 legal zero positions</text>
            </motion.g>
          </>
        )}

        {phase === 1 && (
          <>
            {[0, 1].map((caseIndex) => {
              const x = 30 + caseIndex * 240;
              const color = caseIndex === 0 ? IND : "#0d9488";
              return (
                <g key={caseIndex}>
                  <text x={x + 90} y="47" textAnchor="middle" fontSize="17" fontWeight="950" fill={color} fontFamily={FONT}>{caseIndex === 0 ? "a0b" : "ab0"}</text>
                  <text x={x + 90} y="66" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>a and b each choose 1–9</text>
                  <text x={x - 3} y="93" textAnchor="end" fontSize="8" fontWeight="850" fill={DIM} fontFamily={FONT}>a</text>
                  <text x={x + 54} y="202" textAnchor="middle" fontSize="8" fontWeight="850" fill={DIM} fontFamily={FONT}>b →</text>
                  <ChoiceGrid x={x} y={83} color={color} delay={caseIndex * 0.2} />
                  <text x={x + 54} y="226" textAnchor="middle" fontSize="16" fontWeight="950" fill={color} fontFamily={FONT}>9 × 9 = {choicesPerCase}</text>
                </g>
              );
            })}
            <text x="240" y="278" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>The cases cannot overlap: their zero is in a different place.</text>
          </>
        )}

        <AnimatePresence>
          {phase === 2 && (
            <motion.g key="merge" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x="240" y="43" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>EVERY DOT IS ONE VALID THREE-DIGIT NUMBER</text>
              <motion.g initial={{ x: -100 }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 130, damping: 18 }}><ChoiceGrid x={75} y={62} color={IND} /></motion.g>
              <motion.g initial={{ x: 100 }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 130, damping: 18 }}><ChoiceGrid x={195} y={62} color="#0d9488" delay={0.15} /></motion.g>
              <text x="129" y="187" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>a0b: {choicesPerCase}</text>
              <text x="249" y="187" textAnchor="middle" fontSize="12" fontWeight="900" fill="#0d9488" fontFamily={FONT}>ab0: {choicesPerCase}</text>
              <motion.path d="M 136 204 Q 190 232 240 245 M 242 204 Q 240 225 240 245" fill="none" stroke={GREEN} strokeWidth="2.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <rect x="111" y="246" width="258" height="45" rx="13" fill={valid ? "#dcfce7" : "#fee2e2"} stroke={valid ? GREEN : RED} strokeWidth="2" />
              <text x="240" y="275" textAnchor="middle" fontSize="20" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>{choicesPerCase} + {choicesPerCase} = {total}</text>
              <text x="198" y="306" textAnchor="middle" fontSize="9" fontWeight="800" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? "two zero positions • exact-one-zero check • choice verified" : `check failed: computed ${total}, stored ${problem.shortAnswer}`}</text>
              <SvgAnswerBadge show={valid} answer={problem.answer} cx={428} y={286} width={72} />
            </motion.g>
          )}
        </AnimatePresence>
        <defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill={DIM} /></marker></defs>
      </svg>
    </div>
  );
}
