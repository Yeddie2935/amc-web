import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", AMBER = "#d97706", DIM = "#94a3b8", RED = "#dc2626";

const nums = (value: unknown) => Array.isArray(value) ? value.map((v) => Math.round(num(v, 0))) : [];
function isPrime(n: number) {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false;
  return true;
}

/**
 * Three two-sided cards share one sum. Parity fixes the unique even prime,
 * which fixes the common sum; the other backs follow by subtraction and their
 * tokens regroup into an average. Data: { visible, evenPrime }.
 */
export function EqualSumPrimeCardsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const visible = nums(data.visible);
  const evenPrime = Math.round(num(data.evenPrime, 2));
  const oddVisibleIndex = visible.findIndex((v) => Math.abs(v) % 2 === 1);
  const common = (visible[oddVisibleIndex] ?? 0) + evenPrime;
  const hidden = visible.map((v) => common - v);
  const average = hidden.reduce((a, b) => a + b, 0) / Math.max(hidden.length, 1);
  const choice = problem.choices?.find((c) => Number(c.text) === average)?.label;
  const allNumbers = [...visible, ...hidden];
  const valid = visible.length === 3 && oddVisibleIndex >= 0 && visible.filter((v) => v % 2 === 0).length === 2
    && hidden.every(isPrime) && hidden.filter((v) => v === evenPrime).length === 1
    && new Set(allNumbers).size === 6 && hidden.every((p, i) => visible[i] + p === common)
    && String(average) === String(problem.shortAnswer) && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 4 : Math.min(step, 3);
  const centers = [76, 210, 344];

  if (final) return <AverageBeat hidden={hidden} average={average} valid={valid} answer={problem.answer} />;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "5px 3px" }}>
    <svg viewBox="0 0 420 286" width="100%" style={{ maxWidth: 450 }}>
      <text x="210" y="17" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>
        {phase === 0 ? "three different prime backs — one shared card sum" : phase === 1 ? "the two even fronts need odd prime backs" : phase === 2 ? "an odd front needs the only even prime" : "subtract each front from the common sum"}
      </text>
      <rect x="137" y="28" width="146" height="30" rx="15" fill={phase >= 2 ? "#ecfdf5" : "#eef2ff"} stroke={phase >= 2 ? GREEN : "#c7d2fe"} />
      <text x="210" y="48" textAnchor="middle" fontSize="13" fontWeight="900" fill={phase >= 2 ? GREEN : IND} fontFamily={FONT}>
        common sum = {phase >= 2 ? common : "same on all 3"}
      </text>

      {visible.map((front, i) => {
        const x = centers[i];
        const evenFront = front % 2 === 0;
        const reveal = phase >= 3 || (phase >= 2 && i === oddVisibleIndex);
        return <motion.g key={front} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", delay: i * 0.12 }}>
          <rect x={x - 48} y="72" width="96" height="142" rx="10" fill="#fff" stroke={reveal ? GREEN : IND} strokeWidth="2" />
          <path d={`M ${x - 48} 143 H ${x + 48}`} stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x={x} y="112" textAnchor="middle" fontSize="24" fontWeight="900" fill={INK} fontFamily={FONT}>{front}</text>
          <text x={x} y="132" textAnchor="middle" fontSize="9" fontWeight="800" fill={evenFront ? IND : AMBER}>{evenFront ? "EVEN FRONT" : "ODD FRONT"}</text>
          {phase === 0 && <text x={x} y="184" textAnchor="middle" fontSize="27" fontWeight="900" fill={DIM}>?</text>}
          {phase === 1 && <>
            <circle cx={x} cy="176" r="22" fill={evenFront ? "#eef2ff" : "#f8fafc"} stroke={evenFront ? IND : DIM} strokeWidth="1.5" />
            <text x={x} y="172" textAnchor="middle" fontSize="10" fontWeight="900" fill={evenFront ? IND : DIM}>{evenFront ? "odd" : "?"}</text>
            <text x={x} y="187" textAnchor="middle" fontSize="9" fontWeight="800" fill={evenFront ? IND : DIM}>prime</text>
          </>}
          {phase >= 2 && !reveal && <>
            <circle cx={x} cy="176" r="22" fill="#eef2ff" stroke={IND} strokeWidth="1.5" />
            <text x={x} y="180" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND}>odd</text>
          </>}
          {reveal && <motion.g initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ type: "spring", delay: 0.25 + i * 0.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx={x} cy="176" r="24" fill="#ecfdf5" stroke={GREEN} strokeWidth="2" />
            <text x={x} y="183" textAnchor="middle" fontSize="20" fontWeight="900" fill={GREEN} fontFamily={FONT}>{hidden[i]}</text>
          </motion.g>}
          {phase >= 2 && <text x={x} y="235" textAnchor="middle" fontSize="11" fontWeight="900" fill={reveal ? GREEN : IND} fontFamily={FONT}>
            {phase === 2 && i === oddVisibleIndex ? `${front} + ${evenPrime} = ${common}` : phase >= 3 ? `${common} − ${front} = ${hidden[i]}` : evenFront ? "even + odd = odd" : "odd + even = odd"}
          </text>}
        </motion.g>;
      })}

      {phase === 1 && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <path d="M 76 246 Q 210 270 344 246" fill="none" stroke={IND} strokeWidth="2" />
        <text x="210" y="278" textAnchor="middle" fontSize="10" fontWeight="850" fill={IND} fontFamily={FONT}>distinct primes ⇒ they cannot both be 2</text>
      </motion.g>}
      {phase === 2 && <text x="210" y="270" textAnchor="middle" fontSize="11" fontWeight="900" fill={AMBER} fontFamily={FONT}>2 is the only even prime</text>}
      {phase === 3 && <text x="210" y="270" textAnchor="middle" fontSize="11" fontWeight="900" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? "17, 2, 23 are distinct primes ✓" : "prime/card-sum self-check failed"}</text>}
    </svg>
  </div>;
}

function AverageBeat({ hidden, average, valid, answer }: { hidden: number[]; average: number; valid: boolean; answer: string | number | null | undefined }) {
  return <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "5px 3px" }}>
    <svg viewBox="0 0 420 286" width="100%" style={{ maxWidth: 450 }}>
      <text x="210" y="20" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>regroup the three hidden prime cards</text>
      {hidden.map((p, i) => <motion.g key={p} initial={{ x: centersForAverage(i), y: 62, opacity: 0 }} animate={{ x: 134 + i * 76, y: 86, opacity: 1 }} transition={{ type: "spring", delay: i * 0.14 }}>
        <rect x="-27" y="-32" width="54" height="64" rx="8" fill="#ecfdf5" stroke={GREEN} strokeWidth="2" />
        <text x="0" y="8" textAnchor="middle" fontSize="22" fontWeight="900" fill={GREEN} fontFamily={FONT}>{p}</text>
      </motion.g>)}
      <motion.text x="210" y="154" textAnchor="middle" fontSize="22" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        ({hidden.join(" + ")}) ÷ {hidden.length}
      </motion.text>
      <motion.text x="210" y="192" textAnchor="middle" fontSize="25" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.8 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        {hidden.reduce((a, b) => a + b, 0)} ÷ {hidden.length} = {average}
      </motion.text>
      <text x="210" y="220" textAnchor="middle" fontSize="10" fontWeight="850" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? "all three card sums are 61 ✓" : "stored answer or card check failed"}</text>
      <SvgAnswerBadge show={valid} answer={answer == null ? null : String(answer)} cx={210} y={239} width={88} />
    </svg>
  </div>;
}

const centersForAverage = (i: number) => [76, 210, 344][i] ?? 210;
