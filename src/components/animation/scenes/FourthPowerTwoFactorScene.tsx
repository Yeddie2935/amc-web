import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

function twosIn(n: number) {
  let count = 0, rest = Math.abs(Math.round(n));
  while (rest > 0 && rest % 2 === 0) { count += 1; rest /= 2; }
  return { count, rest };
}

/** Split a fourth-power difference, then pull every factor-of-two token into a tray. */
export function FourthPowerTwoFactorScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const a = Math.round(num(data.a, 0)), b = Math.round(num(data.b, 0));
  const sumSquares = a * a + b * b, sum = a + b, difference = a - b;
  const parts = [sumSquares, sum, difference];
  const ledgers = parts.map(twosIn);
  const exponent = ledgers.reduce((n, item) => n + item.count, 0);
  const power = 2 ** exponent;
  const original = a ** 4 - b ** 4;
  const rebuilt = parts.reduce((product, value) => product * value, 1);
  const choice = problem.choices?.find((item) => Number(item.text) === power)?.label;
  const ok = rebuilt === original && original % power === 0 && original % (power * 2) !== 0 && String(power) === problem.shortAnswer && choice === problem.answer;
  const failure = rebuilt !== original ? `${parts.join(" × ")} = ${rebuilt}, not ${original}` : original % (power * 2) === 0 ? `${power * 2} still divides the expression` : power !== Number(problem.shortAnswer) ? `computed ${power}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const box = (x: number, y: number, w: number, text: string, tone: string) => <g><rect x={x} y={y} width={w} height="42" rx="10" fill={`${tone}12`} stroke={tone} strokeWidth="2" /><text x={x + w / 2} y={y + 27} textAnchor="middle" fontSize="14" fontWeight="900" fill={tone} fontFamily={FONT}>{text}</text></g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 285" width="100%" style={{ width: "100%", maxWidth: "100%", minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "split the fourth powers as a difference of squares" : phase === 1 ? "split the difference factor one more time" : "pull out every factor of 2 and count the tokens"}</text>

      {phase === 0 && <><motion.g initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>{box(139, 43, 182, `${a}⁴ − ${b}⁴`, INK)}</motion.g><path d="M230 85 V108 M116 108 H344 M116 108 V127 M344 108 V127" fill="none" stroke="#94a3b8" strokeWidth="2" />
        <motion.g initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .25 }}>{box(34, 127, 164, `${a}² + ${b}²`, TEAL)}</motion.g><motion.g initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .4 }}>{box(262, 127, 164, `${a}² − ${b}²`, IND)}</motion.g>
        <text x="230" y="215" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>({a}² + {b}²)({a}² − {b}²)</text><text x="230" y="245" textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>same value, now exposed as two factors</text></>}

      {phase === 1 && <><g transform="translate(25 40)">{box(0, 0, 130, `${a}² + ${b}²`, TEAL)}<text x="65" y="66" textAnchor="middle" fontFamily={FONT} fontSize="15" fontWeight="900" fill={TEAL}>= {sumSquares}</text></g><g transform="translate(184 40)">{box(0, 0, 130, `${a} + ${b}`, IND)}<text x="65" y="66" textAnchor="middle" fontFamily={FONT} fontSize="15" fontWeight="900" fill={IND}>= {sum}</text></g><g transform="translate(343 40)">{box(0, 0, 92, `${a} − ${b}`, IND)}<text x="46" y="66" textAnchor="middle" fontFamily={FONT} fontSize="15" fontWeight="900" fill={IND}>= {difference}</text></g>
        <motion.path d="M327 67 C327 127 249 127 249 148 M389 107 C389 137 249 137 249 148" fill="none" stroke="#a5b4fc" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <motion.g initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45 }}>{box(130, 154, 200, `${sumSquares} × ${sum} × ${difference}`, INK)}<text x="230" y="230" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>{sumSquares} × {sum} × {difference}</text><text x="230" y="257" textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>three boxes now hold all the factors</text></motion.g></>}

      {phase === 2 && <><g transform="translate(22 39)">{parts.map((value, i) => { const x = i * 145, info = ledgers[i]; return <motion.g key={value} initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .14 }}><rect x={x} width="124" height="80" rx="12" fill="#f8fafc" stroke={i ? IND : TEAL} strokeWidth="2" /><text x={x + 62} y="25" textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily={FONT}>{value}</text><text x={x + 62} y="51" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM} fontFamily={FONT}>= 2{info.count > 1 ? `^${info.count}` : ""} × {info.rest}</text><text x={x + 62} y="70" textAnchor="middle" fontSize="10" fontWeight="800" fill={i ? IND : TEAL}>{info.count} two{info.count === 1 ? "" : "s"}</text></motion.g>; })}</g>
        <path d="M84 121 C84 148 230 142 230 158 M229 121 V158 M374 121 C374 148 230 142 230 158" fill="none" stroke="#94a3b8" strokeWidth="2" />
        <g transform="translate(113 163)">{Array.from({ length: exponent }, (_, i) => <motion.g key={i} initial={{ opacity: 0, y: -22 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 190, damping: 15, delay: .25 + i * .1 }}><circle cx={i * 58 + 15} cy="15" r="15" fill={IND} /><text x={i * 58 + 15} y="21" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff" fontFamily={FONT}>2</text></motion.g>)}</g>
        <text x="230" y="223" textAnchor="middle" fontSize="18" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>2^{exponent} = {power}</text><text x="230" y="247" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={ok ? DIM : RED} fontFamily={FONT}>{ok ? `${original} ÷ ${power} is odd, so no sixth 2 remains` : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={254} width={84} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="278" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
