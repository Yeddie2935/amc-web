import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

function permutations(values: number[]): number[] {
  if (values.length === 0) return [0];
  return values.flatMap((value, i) => permutations(values.filter((_, j) => j !== i)).map((tail) => value * 10 ** (values.length - 1) + tail));
}

function DigitCards({ value, x, y, color = IND, delay = 0 }: { value: number; x: number; y: number; color?: string; delay?: number }) {
  return <g>{String(value).split("").map((digit, i) => <motion.g key={`${digit}-${i}`} initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: delay + i * 0.08, type: "spring" }}><rect x={x + i * 43} y={y} width="36" height="43" rx="7" fill={`${color}16`} stroke={color} strokeWidth="2" /><text x={x + 18 + i * 43} y={y + 29} textAnchor="middle" fontSize="19" fontWeight="950" fill={color} fontFamily={FONT}>{digit}</text></motion.g>)}</g>;
}

/** Bound the possible multiplier, sieve answer permutations by 2 and 3, and verify the unique digit-preserving quotient. */
export function PermutationMultipleSieveScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const digits = Array.isArray(data.digits) ? data.digits.map(Number) : [];
  const candidates = Array.isArray(data.candidates) ? data.candidates.map(Number) : [];
  const factors = Array.isArray(data.factors) ? data.factors.map(Number) : [];
  const all = permutations(digits).sort((a, b) => a - b);
  const allowed = new Set(all);
  const smallest = all[0];
  const largest = all[all.length - 1];
  const factorLimit = Math.floor(largest / smallest);
  const matches = candidates.flatMap((value) => factors.map((factor) => ({ value, factor, quotient: value / factor, works: Number.isInteger(value / factor) && allowed.has(value / factor) }))).filter((item) => item.works);
  const winner = matches[0];
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === winner?.value)?.label;
  const valid = matches.length === 1 && String(winner?.value) === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);

  const renderSieve = (factor: number) => (
    <>
      <g transform="translate(23 43)">
        {candidates.map((value, i) => {
          const quotient = value / factor;
          const integer = Number.isInteger(quotient);
          const works = integer && allowed.has(quotient);
          return <motion.g key={value} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1, type: "spring" }}>
            <rect x="0" y={i * 47} width="424" height="38" rx="9" fill={works ? "#dcfce7" : "#f8fafc"} stroke={works ? GREEN : "#cbd5e1"} strokeWidth={works ? 2.2 : 1.2} />
            <text x="45" y={i * 47 + 25} textAnchor="middle" fontSize="15" fontWeight="950" fill={INK} fontFamily={FONT}>{value}</text>
            <text x="104" y={i * 47 + 25} textAnchor="middle" fontSize="14" fontWeight="950" fill={IND} fontFamily={FONT}>÷ {factor}</text>
            <motion.path d={`M 137 ${i * 47 + 19} H 179`} stroke={works ? GREEN : DIM} strokeWidth="2" markerEnd="url(#permArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 + i * 0.08 }} />
            <text x="228" y={i * 47 + 25} textAnchor="middle" fontSize="15" fontWeight="950" fill={works ? GREEN : integer ? INK : DIM} fontFamily={FONT}>{integer ? quotient : "not whole"}</text>
            <text x="350" y={i * 47 + 25} textAnchor="middle" fontSize="10.5" fontWeight="900" fill={works ? GREEN : RED}>{works ? "same digits ✓" : integer ? "wrong digits ✕" : "odd number ✕"}</text>
          </motion.g>;
        })}
      </g>
      <rect x="124" y="283" width="222" height="27" rx="10" fill={factor === 2 ? "#fee2e2" : "#eef2ff"} stroke={factor === 2 ? RED : IND} />
      <text x="235" y="301" textAnchor="middle" fontSize="12" fontWeight="950" fill={factor === 2 ? RED : IND} fontFamily={FONT}>{factor === 2 ? "no ÷2 quotient reuses all four digits" : "only one ÷3 quotient passes"}</text>
    </>
  );

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 470 315" width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="The five candidate digit permutations pass through division-by-two and division-by-three gates; only 7425 divided by 3 gives another valid permutation, 2475">
        <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "bound the multiplier using the smallest and largest permutations" : phase === 1 ? "send every answer choice through the ÷2 gate" : phase === 2 ? "send every answer choice through the ÷3 gate" : "the winning quotient uses the same four digit cards"}
        </text>

        {phase === 0 && (
          <>
            <text x="117" y="50" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>SMALLEST PERMUTATION</text>
            <DigitCards value={smallest} x={35} y={62} color={IND} />
            <text x="353" y="50" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>LARGEST PERMUTATION</text>
            <DigitCards value={largest} x={271} y={62} color={GREEN} delay={0.2} />
            <motion.path d="M 117 129 C 157 177 310 177 353 129" fill="none" stroke={IND} strokeWidth="2.5" markerEnd="url(#permArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.55 }} />
            <rect x="81" y="166" width="308" height="64" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="235" y="192" textAnchor="middle" fontSize="15" fontWeight="950" fill={INK} fontFamily={FONT}>{smallest} × 4 = {smallest * 4}</text>
            <text x="235" y="216" textAnchor="middle" fontSize="11.5" fontWeight="900" fill={RED}>{smallest * 4} is already larger than {largest}</text>
            <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.85, type: "spring" }}>
              <rect x="118" y="254" width="234" height="45" rx="14" fill="#eef2ff" stroke={IND} strokeWidth="2" />
              <text x="235" y="282" textAnchor="middle" fontSize="18" fontWeight="950" fill={IND} fontFamily={FONT}>multiplier ∈ {`{2, 3}`}</text>
            </motion.g>
          </>
        )}

        {phase === 1 && renderSieve(factors[0])}
        {phase === 2 && renderSieve(factors[1])}

        <AnimatePresence>
          {phase === 3 && winner && (
            <motion.g key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x="122" y="52" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>ANSWER CHOICE D</text>
              <DigitCards value={winner.value} x={36} y={66} color={IND} />
              <motion.path d="M 220 88 H 255" stroke={GREEN} strokeWidth="2.5" markerEnd="url(#permArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <text x="237" y="76" textAnchor="middle" fontSize="11" fontWeight="950" fill={GREEN} fontFamily={FONT}>÷ {winner.factor}</text>
              <text x="353" y="52" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>ALLOWED PARTNER</text>
              <DigitCards value={winner.quotient} x={267} y={66} color={GREEN} delay={0.35} />
              <motion.path d="M 73 147 C 150 177 315 177 397 147" fill="none" stroke={GREEN} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.65 }} />
              <text x="235" y="187" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN}>same cards: 2, 4, 5, 7 exactly once</text>
              <rect x="101" y="210" width="268" height="57" rx="15" fill={valid ? "#dcfce7" : "#fee2e2"} stroke={valid ? GREEN : RED} strokeWidth="2" />
              <text x="235" y="244" textAnchor="middle" fontSize="21" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>{winner.quotient} × {winner.factor} = {winner.value}</text>
              <text x="195" y="302" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? "unique passing pair • product and choice verified" : `check failed: found ${matches.length} passing pairs`}</text>
              <SvgAnswerBadge show={valid} answer={problem.answer} cx={427} y={287} width={72} />
            </motion.g>
          )}
        </AnimatePresence>

        <defs><marker id="permArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill={GREEN} /></marker></defs>
      </svg>
    </div>
  );
}
