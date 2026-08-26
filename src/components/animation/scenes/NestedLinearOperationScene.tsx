import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", ORANGE = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

/** Run a nested custom linear operation through an inside-out machine, then balance the result. */
export function NestedLinearOperationScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const multiplier = num(data.multiplier, 0), innerLeft = num(data.innerLeft, 0), outerLeft = num(data.outerLeft, 0), target = num(data.target, 0);
  const innerConstant = multiplier * innerLeft;
  const outerConstant = multiplier * outerLeft;
  const offset = outerConstant - innerConstant;
  const solution = target - offset;
  const check = multiplier * outerLeft - (multiplier * innerLeft - solution);
  const choice = (problem.choices ?? []).find((item) => Number(String(item.text).replace("/", ".")) === solution || Number(item.text) === solution)?.label;
  const stored = Number(problem.shortAnswer);
  const ok = check === target && solution === stored && choice === problem.answer;
  const failure = check !== target ? `substitution gives ${check}, not target ${target}` : solution !== stored ? `computed ${solution}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);

  const Machine = ({ x, y, left, right, output, tone }: { x: number; y: number; left: string; right: string; output: string; tone: string }) => <g>
    <motion.rect x={x} y={y} width="190" height="86" rx="14" fill={`${tone}12`} stroke={tone} strokeWidth="2" initial={{ scale: 0.75 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
    <text x={x + 95} y={y + 19} textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>∗ machine</text>
    <rect x={x + 12} y={y + 30} width="48" height="28" rx="7" fill="#fff" stroke={tone} /><text x={x + 36} y={y + 49} textAnchor="middle" fontSize="12" fontWeight="900" fill={tone} fontFamily={FONT}>{left}</text>
    <text x={x + 70} y={y + 49} textAnchor="middle" fontSize="14" fontWeight="900" fill={INK}>∗</text>
    <rect x={x + 80} y={y + 30} width="55" height="28" rx="7" fill="#fff" stroke={tone} /><text x={x + 107.5} y={y + 49} textAnchor="middle" fontSize="11" fontWeight="900" fill={tone} fontFamily={FONT}>{right}</text>
    <motion.path d={`M ${x + 140} ${y + 44} H ${x + 160}`} stroke={tone} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><text x={x + 174} y={y + 49} textAnchor="middle" fontSize="10" fontWeight="900" fill={tone} fontFamily={FONT}>{output}</text>
    <text x={x + 95} y={y + 76} textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>{multiplier}·first − second</text>
  </g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 300" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "the ∗ machine triples its first input, then subtracts the second" : phase === 1 ? "run the inner 5 ∗ x machine before touching the outer one" : phase === 2 ? "feed the entire inner output into the second-input slot" : "balance x − 9 = 1 by adding 9 to both sides"}</text>

      {phase === 0 && <><g transform="translate(87 46)"><rect x="0" y="0" width="286" height="128" rx="16" fill="#eef2ff" stroke={IND} strokeWidth="2" /><text x="143" y="25" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>a ∗ b</text><motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>{Array.from({ length: multiplier }, (_, i) => <g key={i}><rect x={32 + i * 54} y="45" width="42" height="32" rx="8" fill="#c7d2fe" stroke={IND} /><text x={53 + i * 54} y="66" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>a</text></g>)}</motion.g><text x="199" y="66" textAnchor="middle" fontSize="18" fontWeight="900" fill={RED}>−</text><motion.rect x="220" y="45" width="42" height="32" rx="8" fill="#fee2e2" stroke={RED} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} /><text x="241" y="66" textAnchor="middle" fontSize="14" fontWeight="900" fill={RED} fontFamily={FONT}>b</text><text x="143" y="105" textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily={FONT}>= {multiplier}a − b</text></g><text x="230" y="211" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>first input → {multiplier} copies; second input → subtract once</text></>}

      {phase === 1 && <><Machine x={33} y={48} left={String(innerLeft)} right="x" output={`${innerConstant}−x`} tone={IND} /><g transform="translate(254 48)"><text x="88" y="15" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>inside expansion</text><text x="88" y="47" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>{innerLeft} ∗ x</text><text x="88" y="76" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>= {multiplier}({innerLeft}) − x</text><motion.rect x="29" y="93" width="118" height="40" rx="11" fill="#eef2ff" stroke={IND} initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="88" y="120" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>= {innerConstant} − x</text></g><motion.path d="M 128 150 V 194 H 230" fill="none" stroke={IND} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><rect x="164" y="194" width="132" height="39" rx="10" fill="#f8fafc" stroke="#cbd5e1" /><text x="230" y="219" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>inner result ready</text></>}

      {phase === 2 && <><Machine x={25} y={48} left={String(outerLeft)} right={`${innerConstant}−x`} output={`${outerConstant}−(…)`} tone={TEAL} /><motion.path d="M 215 92 C 245 92 245 62 273 62" fill="none" stroke={TEAL} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><g transform="translate(262 45)"><rect x="0" y="0" width="172" height="132" rx="13" fill="#ecfeff" stroke={TEAL} /><text x="86" y="22" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>outer expansion</text><text x="86" y="49" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{multiplier}({outerLeft}) − ({innerConstant} − x)</text><text x="86" y="76" textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT}>{outerConstant} − {innerConstant} + x</text><motion.rect x="33" y="91" width="106" height="31" rx="9" fill="#fff" stroke={TEAL} initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="86" y="112" textAnchor="middle" fontSize="17" fontWeight="900" fill={TEAL} fontFamily={FONT}>x − {Math.abs(offset)}</text></g><text x="230" y="226" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{outerLeft} ∗ ({innerLeft} ∗ x) = x − {Math.abs(offset)}</text></>}

      {phase === 3 && <><g transform="translate(60 55)"><rect x="0" y="0" width="340" height="80" rx="14" fill="#f8fafc" stroke="#cbd5e1" /><text x="170" y="25" textAnchor="middle" fontSize="18" fontWeight="900" fill={INK} fontFamily={FONT}>x − {Math.abs(offset)} = {target}</text><motion.g initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}><rect x="35" y="42" width="112" height="26" rx="8" fill="#eef2ff" stroke={IND} /><text x="91" y="60" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>+ {Math.abs(offset)}</text><rect x="193" y="42" width="112" height="26" rx="8" fill="#eef2ff" stroke={IND} /><text x="249" y="60" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>+ {Math.abs(offset)}</text></motion.g></g><motion.path d="M 230 145 V 171" stroke={GREEN} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><motion.rect x="155" y="176" width="150" height="48" rx="12" fill="#dcfce7" stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="230" y="208" textAnchor="middle" fontSize="22" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>x = {solution}</text><text x="172" y="275" textAnchor="middle" fontSize="9.3" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? `check: ${outerLeft} ∗ (${innerLeft} ∗ ${solution}) = ${check}` : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={252} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="292" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
