import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", GOLD = "#d97706", RED = "#dc2626", DIM = "#94a3b8";
const list = (v: unknown) => Array.isArray(v) ? v.map((x) => Math.round(num(x, 0))) : [];
type Triple = [number, number, number];
const topOf = ([a, b, c]: Triple) => a + 2 * b + c;

function Cell({ x, y, text, color = INK, hot = false, delay = 0, small = false }: { x: number; y: number; text: string | number; color?: string; hot?: boolean; delay?: number; small?: boolean }) {
  const w = small ? 46 : 58, h = small ? 38 : 48;
  return <motion.g initial={{ opacity: 0, scale: 0.45 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="8" fill={hot ? "#eef2ff" : "#fff"} stroke={color} strokeWidth={hot ? 2.5 : 1.6} />
    <text x={x} y={y + (small ? 6 : 7)} textAnchor="middle" fontSize={small ? 15 : 18} fontWeight="900" fill={color} fontFamily={FONT}>{text}</text>
  </motion.g>;
}

function Pyramid({ values, symbolic = false, mini = false }: { values: Triple | [string, string, string]; symbolic?: boolean; mini?: boolean }) {
  const [a, b, c] = values;
  const secondL = symbolic ? `${a}+${b}` : Number(a) + Number(b);
  const secondR = symbolic ? `${b}+${c}` : Number(b) + Number(c);
  const top = symbolic ? `${a}+2${b}+${c}` : Number(secondL) + Number(secondR);
  const sx = mini ? 0.72 : 1;
  const X = (v: number) => 210 + (v - 210) * sx;
  const y0 = mini ? 177 : 206, y1 = mini ? 116 : 126, y2 = mini ? 55 : 52;
  return <g>
    <path d={`M ${X(110)} ${y0 - 25} L ${X(160)} ${y1 + 24} M ${X(210)} ${y0 - 25} L ${X(160)} ${y1 + 24} M ${X(210)} ${y0 - 25} L ${X(260)} ${y1 + 24} M ${X(310)} ${y0 - 25} L ${X(260)} ${y1 + 24} M ${X(160)} ${y1 - 24} L 210 ${y2 + 24} M ${X(260)} ${y1 - 24} L 210 ${y2 + 24}`} fill="none" stroke="#cbd5e1" strokeWidth="1.6" />
    <Cell x={X(110)} y={y0} text={a} color={IND} small={mini} delay={0.05} />
    <Cell x={X(210)} y={y0} text={b} color={GOLD} hot small={mini} delay={0.12} />
    <Cell x={X(310)} y={y0} text={c} color={TEAL} small={mini} delay={0.19} />
    <Cell x={X(160)} y={y1} text={secondL} color={IND} small={mini} delay={0.35} />
    <Cell x={X(260)} y={y1} text={secondR} color={TEAL} small={mini} delay={0.45} />
    <Cell x={210} y={y2} text={top} color={GREEN} hot small={mini} delay={0.65} />
  </g>;
}

/** An additive pyramid exposes weights 1,2,1; exhaustive distinct-digit triples supply the extrema. Data: { digits }. */
export function AdditivePyramidExtremaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const digits = list(sceneData(problem).digits);
  const triples: Triple[] = [];
  digits.forEach((a) => digits.forEach((b) => digits.forEach((c) => { if (a !== b && a !== c && b !== c) triples.push([a, b, c]); })));
  const ordered = [...triples].sort((p, q) => topOf(p) - topOf(q) || p[1] - q[1] || p[0] - q[0] || p[2] - q[2]);
  const minValue = topOf(ordered[0] ?? [0, 0, 0]);
  const maxValue = topOf(ordered.at(-1) ?? [0, 0, 0]);
  const minTriple = ordered.find((t) => topOf(t) === minValue && t[1] === digits[0] && t[0] === digits[1] && t[2] === digits[2]) ?? ordered[0] ?? [0, 0, 0];
  const maxTriple = ordered.find((t) => topOf(t) === maxValue && t[1] === digits.at(-1) && t[0] === digits.at(-3) && t[2] === digits.at(-2)) ?? ordered.at(-1) ?? [0, 0, 0];
  const difference = maxValue - minValue;
  const choice = problem.choices?.find((c) => Number(c.text) === difference)?.label;
  const exhaustive = triples.length === digits.length * (digits.length - 1) * (digits.length - 2);
  const ok = exhaustive && minValue === 7 && maxValue === 33 && String(difference) === String(problem.shortAnswer) && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "5px 3px" }}>
    <svg viewBox="0 0 420 300" width="100%" style={{ maxWidth: 450 }}>
      <text x="210" y="18" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>
        {phase === 0 ? "trace how each bottom slot reaches the top" : phase === 1 ? "smallest digit goes in the double-weighted center" : phase === 2 ? "largest digit goes in the double-weighted center" : "compare the two extreme top cells"}
      </text>

      {phase === 0 && <>
        <Pyramid values={["A", "B", "C"]} symbolic />
        <motion.path d="M 210 181 L 160 150 M 210 181 L 260 150" stroke={GOLD} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.55 }} />
        <text x="210" y="248" textAnchor="middle" fontSize="11" fontWeight="900" fill={GOLD} fontFamily={FONT}>B travels upward twice</text>
        <text x="210" y="274" textAnchor="middle" fontSize="19" fontWeight="950" fill={IND} fontFamily={FONT}>top = A + 2B + C</text>
      </>}

      {(phase === 1 || phase === 2) && <>
        <g transform="translate(0 17)"><Pyramid values={phase === 1 ? minTriple : maxTriple} /></g>
        <text x="210" y="278" textAnchor="middle" fontSize="15" fontWeight="900" fill={phase === 1 ? IND : GOLD} fontFamily={FONT}>
          {phase === 1 ? `${minTriple[0]} + 2(${minTriple[1]}) + ${minTriple[2]} = ${minValue}  minimum` : `${maxTriple[0]} + 2(${maxTriple[1]}) + ${maxTriple[2]} = ${maxValue}  maximum`}
        </text>
      </>}

      {phase === 3 && <>
        <g transform="translate(-12 15) scale(.58)"><Pyramid values={minTriple} mini /></g>
        <g transform="translate(188 15) scale(.58)"><Pyramid values={maxTriple} mini /></g>
        <text x="110" y="146" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>minimum {minValue}</text>
        <text x="310" y="146" textAnchor="middle" fontSize="11" fontWeight="900" fill={GOLD} fontFamily={FONT}>maximum {maxValue}</text>
        <motion.path d="M 131 181 H 289" stroke={GREEN} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
        <motion.text x="210" y="222" textAnchor="middle" fontSize="25" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.65 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          {maxValue} − {minValue} = {difference}
        </motion.text>
        <text x="210" y="247" textAnchor="middle" fontSize="10" fontWeight="850" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? `checked all ${triples.length} distinct-digit placements ✓` : "extrema or stored-answer check failed"}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer == null ? null : String(problem.answer)} cx={210} y={263} width={86} />
      </>}
    </svg>
  </div>;
}
