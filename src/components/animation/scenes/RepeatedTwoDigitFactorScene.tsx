import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

function Tiles({ text, x, y, color, filled = false, delay = 0 }: { text: string; x: number; y: number; color: string; filled?: boolean; delay?: number }) {
  return <g>{text.split("").map((char, i) => <motion.g key={i} initial={{ opacity: 0, scale: 0.45 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: delay + i * 0.08 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <rect x={x + i * 30} y={y} width="26" height="34" rx="6" fill={filled ? color : "#fff"} fillOpacity={filled ? 0.14 : 1} stroke={color} strokeWidth="1.8" />
    <text x={x + i * 30 + 13} y={y + 23} textAnchor="middle" fontSize="18" fontWeight="900" fill={color} fontFamily={FONT}>{char}</text>
  </motion.g>)}</g>;
}

/**
 * A repeated two-digit product block splits into a hundreds-shifted copy plus
 * one ordinary copy. The shared nonzero block cancels, leaving the three digit
 * slots of the other factor. Data: { multiplicand, block, product, shift }.
 */
export function RepeatedTwoDigitFactorScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const multiplicand = String(data.multiplicand ?? "");
  const block = String(data.block ?? "");
  const product = String(data.product ?? "");
  const shift = Math.round(num(data.shift, 0));
  const factor = shift + 1;
  const digits = String(factor).split("");
  const assignment = new Map<string, string>();
  let patternOk = digits.length === multiplicand.length;
  multiplicand.split("").forEach((letter, i) => {
    const known = assignment.get(letter);
    if (known != null && known !== digits[i]) patternOk = false;
    assignment.set(letter, digits[i]);
  });
  const A = Number(assignment.get("A"));
  const B = Number(assignment.get("B"));
  const sum = A + B;
  const choice = problem.choices?.find((c) => Number(c.text) === sum)?.label;
  const structureOk = product === block.repeat(2) && shift === 10 ** block.length && factor === 101;
  const digitOk = patternOk && Number.isInteger(A) && A !== 0 && Number.isInteger(B) && A !== B;
  const ok = structureOk && digitOk && String(sum) === String(problem.shortAnswer) && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "5px 3px" }}>
    <svg viewBox="0 0 420 278" width="100%" style={{ maxWidth: 450 }}>
      <text x="210" y="18" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>
        {phase === 0 ? `split ${product} into two copies of ${block}` : phase === 1 ? `both products contain the same nonzero ${block}` : `the pattern ${multiplicand} must be ${factor}`}
      </text>

      {phase === 0 && <>
        <g transform="translate(34 43)">
          <Tiles text={multiplicand} x={78} y={0} color={IND} />
          <text x="38" y="66" fontSize="22" fontWeight="900" fill={INK}>×</text>
          <Tiles text={block} x={108} y={42} color={TEAL} delay={0.2} />
          <line x1="34" y1="84" x2="176" y2="84" stroke={INK} strokeWidth="2" />
          <Tiles text={product} x={48} y={96} color={TEAL} delay={0.4} />
        </g>
        <motion.path d="M 230 115 H 258" stroke={DIM} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <path d="M 258 115 l -7 -5 v 10 z" fill={DIM} />
        <g transform="translate(270 50)">
          <Tiles text={block} x={0} y={0} color={TEAL} filled />
          <text x="30" y="51" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>× {shift}</text>
          <text x="30" y="81" textAnchor="middle" fontSize="20" fontWeight="900" fill={INK}>+</text>
          <Tiles text={block} x={0} y={93} color={TEAL} filled delay={0.3} />
          <text x="30" y="145" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>× 1</text>
        </g>
        <motion.text x="210" y="255" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          {product} = ({shift} + 1) · {block} = {factor} · {block}
        </motion.text>
      </>}

      {phase === 1 && <>
        <text x="210" y="61" textAnchor="middle" fontSize="18" fontWeight="900" fill={INK} fontFamily={FONT}>{multiplicand} · <tspan fill={TEAL}>{block}</tspan> = {factor} · <tspan fill={TEAL}>{block}</tspan></text>
        {[137, 288].map((x, i) => <motion.g key={x}>
          <rect x={x - 25} y="77" width="50" height="31" rx="7" fill="#ecfeff" stroke={TEAL} strokeWidth="1.6" />
          <text x={x} y="98" textAnchor="middle" fontSize="16" fontWeight="900" fill={TEAL} fontFamily={FONT}>{block}</text>
          <motion.line x1={x - 29} y1="104" x2={x + 29} y2="80" stroke={RED} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 + i * 0.12 }} />
        </motion.g>)}
        <text x="210" y="130" textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM}>{block} is a two-digit number, so it is not zero</text>
        <motion.path d="M 210 145 V 176" stroke={IND} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7 }} />
        <path d="M 210 180 l -6 -8 h 12 z" fill={IND} />
        <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x="128" y="190" width="164" height="48" rx="12" fill="#eef2ff" stroke={IND} strokeWidth="2" />
          <text x="210" y="221" textAnchor="middle" fontSize="23" fontWeight="950" fill={IND} fontFamily={FONT}>{multiplicand} = {factor}</text>
        </motion.g>
      </>}

      {phase === 2 && <>
        <Tiles text={multiplicand} x={112} y={46} color={IND} />
        <motion.path d="M 210 92 V 116" stroke={DIM} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <path d="M 210 120 l -6 -8 h 12 z" fill={DIM} />
        <Tiles text={digits.join("")} x={112} y={130} color={GREEN} filled delay={0.25} />
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
          <text x="210" y="190" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>A = {A},   B = {B}</text>
          <text x="210" y="222" textAnchor="middle" fontSize="24" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT}>A + B = {A} + {B} = {sum}</text>
          <text x="210" y="244" textAnchor="middle" fontSize="10" fontWeight="850" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? `${factor} · ${block} reproduces ${product} symbolically ✓` : "pattern or stored-answer check failed"}</text>
          <SvgAnswerBadge show={ok} answer={problem.answer == null ? null : String(problem.answer)} cx={210} y={250} width={86} />
        </motion.g>
      </>}
    </svg>
  </div>;
}
