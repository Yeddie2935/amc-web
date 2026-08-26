import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

/** Reverse two digit cards, combine their place values, then enumerate every legal ordered pair. */
export function DigitReversalPairCountScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const target = Math.round(num(data.target, 0));
  const base = Math.round(num(data.base, 10));
  const maxDigit = Math.round(num(data.maxDigit, 9));
  const factor = base + 1;
  const digitSum = target / factor;
  const pairs = Number.isInteger(digitSum)
    ? Array.from({ length: maxDigit }, (_, i) => i + 1).map((a) => [a, digitSum - a] as const).filter(([, b]) => Number.isInteger(b) && b >= 0 && b <= maxDigit)
    : [];
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === pairs.length)?.label;
  const ok = Number(problem.shortAnswer) === pairs.length && choice === problem.answer;
  const failure = !Number.isInteger(digitSum) ? `${target} is not divisible by ${factor}` : Number(problem.shortAnswer) !== pairs.length ? `counted ${pairs.length}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);

  const DigitCard = ({ x, y, value, tone = IND }: { x: number; y: number; value: string; tone?: string }) => <g><rect x={x} y={y} width="50" height="58" rx="10" fill={`${tone}12`} stroke={tone} strokeWidth="2" /><text x={x + 25} y={y + 38} textAnchor="middle" fontSize="25" fontWeight="900" fill={tone} fontFamily={FONT}>{value}</text></g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 300" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "two digit cards trade places when the number is reversed" : phase === 1 ? "each digit appears once in the tens place and once in the ones place" : phase === 2 ? `the shared place-value factor ${factor} leaves a digit sum of ${digitSum}` : "slide the tens digit from 3 through 9 to list every legal number"}</text>

      {phase === 0 && <><g transform="translate(72 55)"><text x="72" y="-10" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>original number</text><DigitCard x={15} y={0} value="a" /><DigitCard x={79} y={0} value="b" /><text x="72" y="82" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>{base}a + b</text></g><motion.path d="M 181 76 C 230 25 280 25 329 76 M 329 124 C 280 175 230 175 181 124" fill="none" stroke={TEAL} strokeWidth="2.4" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill={TEAL} /></marker></defs><g transform="translate(244 55)"><text x="72" y="-10" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>reversed number</text><DigitCard x={15} y={0} value="b" tone={TEAL} /><DigitCard x={79} y={0} value="a" tone={TEAL} /><text x="72" y="82" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>{base}b + a</text></g><g transform="translate(108 214)"><rect width="244" height="42" rx="11" fill="#f8fafc" stroke="#cbd5e1" /><text x="122" y="17" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>place values</text><text x="122" y="34" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>ab = {base}a+b   ↔   ba = {base}b+a</text></g></>}

      {phase === 1 && <><g transform="translate(126 42)" fontFamily={FONT}><text x="118" y="19" textAnchor="end" fontSize="23" fontWeight="900" fill={IND}>{base}a + b</text><text x="118" y="52" textAnchor="end" fontSize="23" fontWeight="900" fill={TEAL}>{base}b + a</text><line x1="0" y1="63" x2="124" y2="63" stroke={INK} strokeWidth="2" /><text x="-18" y="53" fontSize="20" fontWeight="900" fill={INK}>+</text><text x="118" y="94" textAnchor="end" fontSize="22" fontWeight="900" fill={INK}>{factor}a + {factor}b</text></g><motion.g initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}><g transform="translate(286 56)"><rect width="130" height="128" rx="14" fill="#eef2ff" stroke={IND} /><text x="65" y="21" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>collect each digit</text><text x="65" y="51" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{base}a + a = {factor}a</text><text x="65" y="79" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT}>{base}b + b = {factor}b</text><line x1="18" y1="93" x2="112" y2="93" stroke="#c7d2fe" /><text x="65" y="115" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>{factor}(a + b)</text></g></motion.g><g transform="translate(105 218)"><rect width="250" height="42" rx="11" fill="#f8fafc" stroke="#cbd5e1" /><text x="125" y="27" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>{factor}(a + b) = {target}</text></g></>}

      {phase === 2 && <><g transform="translate(74 55)"><rect width="312" height="66" rx="14" fill="#eef2ff" stroke={IND} strokeWidth="2" /><text x="156" y="27" textAnchor="middle" fontSize="19" fontWeight="900" fill={IND} fontFamily={FONT}>{factor}(a + b) = {target}</text><motion.line x1="37" y1="46" x2="275" y2="46" stroke={TEAL} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><text x="156" y="61" textAnchor="middle" fontSize="9" fontWeight="850" fill={TEAL}>divide both sides by {factor}</text></g><motion.path d="M 230 133 V 164" stroke={TEAL} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><motion.g initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x="145" y="169" width="170" height="55" rx="13" fill="#ecfeff" stroke={TEAL} strokeWidth="2" /><text x="230" y="204" textAnchor="middle" fontSize="22" fontWeight="900" fill={TEAL} fontFamily={FONT}>a + b = {digitSum}</text></motion.g><text x="230" y="255" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>a is 1–{maxDigit}; b is 0–{maxDigit}</text></>}

      {phase === 3 && <><g transform="translate(31 44)">{pairs.map(([a, b], i) => { const x = (i % 4) * 101, y = Math.floor(i / 4) * 75; return <motion.g key={`${a}-${b}`} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}><rect x={x} y={y} width="88" height="58" rx="10" fill="#eef2ff" stroke={IND} /><text x={x + 44} y={y + 25} textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>{a}{b}</text><text x={x + 44} y={y + 45} textAnchor="middle" fontSize="9.5" fontWeight="850" fill={TEAL} fontFamily={FONT}>{a}+{b}={digitSum}</text></motion.g>; })}</g><g transform="translate(91 205)"><rect width="278" height="46" rx="12" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" /><text x="139" y="19" textAnchor="middle" fontSize="10" fontWeight="850" fill={ok ? GREEN : RED}>{ok ? "all legal ordered digit pairs counted" : failure}</text><text x="139" y="38" textAnchor="middle" fontSize="17" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{pairs.length} two-digit numbers</text></g><text x="170" y="284" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? `${pairs.map(([a, b]) => `${a}${b}`).join(", ")}` : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={260} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="297" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
