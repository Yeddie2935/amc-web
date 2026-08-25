import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", ORANGE = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";
const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);

/** Fill a four-digit lock from its odd units slot while removing used digit cards. */
export function DistinctOddDigitSlotsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const lower = Math.round(num(data.lower, 0)), upper = Math.round(num(data.upper, 0));
  const digitCount = Math.round(num(data.digitCount, 10)), length = Math.round(num(data.length, 4));
  const odds = (Array.isArray(data.oddUnits) ? data.oddUnits : []).map((v) => Math.round(num(v, -1)));
  const total = upper - lower + 1;
  const unitChoices = odds.length;
  const thousandsChoices = digitCount - 2;
  const hundredsChoices = digitCount - 2;
  const tensChoices = digitCount - 3;
  const favorable = unitChoices * thousandsChoices * hundredsChoices * tensChoices;
  const divisor = gcd(favorable, total);
  const numerator = favorable / divisor, denominator = total / divisor;
  const reduced = `${numerator}/${denominator}`;
  const choice = (problem.choices ?? []).find((c) => c.text.replace(/\s/g, "") === reduced)?.label;
  const ok = total === 9000 && odds.join(",") === "1,3,5,7,9" && favorable === 2240 && reduced === problem.shortAnswer?.replace(/\s/g, "") && choice === problem.answer;
  const failure = total !== 9000 ? `range contains ${total}, expected 9000` : favorable !== 2240 ? `counted ${favorable}, expected 2240` : `reduced to ${reduced}, stored ${problem.shortAnswer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 5 : Math.min(step, 4);
  const counts = [thousandsChoices, hundredsChoices, tensChoices, unitChoices];
  const names = ["thousands", "hundreds", "tens", "units"];
  const slotX = (i: number) => 112 + i * 62;

  const UsedDeck = ({ used, forbidZero }: { used: number; forbidZero: boolean }) => <g>
    {Array.from({ length: digitCount }).map((_, i) => {
      const crossed = i < used + (forbidZero ? 1 : 0);
      const label = forbidZero && i === 0 ? "0" : crossed ? "used" : "•";
      return <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.035 }}><rect x={72 + i * 32} y="164" width="25" height="31" rx="5" fill={crossed ? "#f1f5f9" : "#eef2ff"} stroke={crossed ? DIM : IND} strokeWidth="1.4" /><text x={84.5 + i * 32} y="184" textAnchor="middle" fontSize={label === "used" ? "7" : "12"} fontWeight="900" fill={crossed ? DIM : IND} fontFamily={FONT}>{label}</text>{crossed && <line x1={75 + i * 32} y1="190" x2={94 + i * 32} y2="168" stroke={RED} strokeWidth="1.5" />}</motion.g>;
    })}
  </g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 300" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "all four-digit integers form the equally likely universe" : phase === 1 ? "fill the units slot first: it must be odd" : phase === 2 ? "thousands cannot be 0 or repeat the units digit" : phase === 3 ? "hundreds may be 0, but two digits are already used" : phase === 4 ? "tens avoids all three used digits, completing the count" : "put favorable outcomes over all outcomes and reduce"}</text>

      {phase === 0 ? <><motion.line x1="67" y1="105" x2="393" y2="105" stroke={IND} strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><circle cx="67" cy="105" r="7" fill={IND} /><circle cx="393" cy="105" r="7" fill={IND} /><text x="67" y="87" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>{lower}</text><text x="393" y="87" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>{upper}</text><text x="230" y="145" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{upper} − {lower} + 1</text><motion.rect x="166" y="166" width="128" height="42" rx="12" fill="#eef2ff" stroke={IND} strokeWidth="2" initial={{ scale: 0.65 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="230" y="194" textAnchor="middle" fontSize="20" fontWeight="900" fill={IND} fontFamily={FONT}>= {total}</text><text x="230" y="237" textAnchor="middle" fontSize="12" fontWeight="850" fill={DIM}>this becomes the probability denominator</text></> : <>
        <text x="230" y="42" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>choices per slot</text>
        {names.map((name, i) => { const revealAt = i === 3 ? 1 : i + 2; const visible = phase >= revealAt; const active = phase === revealAt; return <g key={name}><motion.rect x={slotX(i)} y="53" width="50" height="58" rx="9" fill={visible ? (active ? "#eef2ff" : "#f8fafc") : "#fff"} stroke={visible ? (active ? IND : INK) : "#cbd5e1"} strokeWidth={active ? 2.5 : 1.5} initial={{ scale: 0.7 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x={slotX(i) + 25} y="87" textAnchor="middle" fontSize="23" fontWeight="900" fill={visible ? (active ? IND : INK) : DIM} fontFamily={FONT}>{visible ? counts[i] : "?"}</text><text x={slotX(i) + 25} y="128" textAnchor="middle" fontSize="9" fontWeight="800" fill={visible ? INK : DIM}>{name}</text></g>; })}
        {phase === 1 && <>{odds.map((d, i) => <motion.g key={d} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}><circle cx={150 + i * 40} cy="179" r="15" fill="#fff7ed" stroke={ORANGE} strokeWidth="2" /><text x={150 + i * 40} y="185" textAnchor="middle" fontSize="15" fontWeight="900" fill={ORANGE} fontFamily={FONT}>{d}</text></motion.g>)}<text x="230" y="220" textAnchor="middle" fontSize="14" fontWeight="900" fill={ORANGE} fontFamily={FONT}>{unitChoices} odd choices</text></>}
        {phase === 2 && <><UsedDeck used={1} forbidZero={true} /><text x="230" y="222" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{digitCount} − 1 zero − 1 used = {thousandsChoices}</text></>}
        {phase === 3 && <><UsedDeck used={2} forbidZero={false} /><text x="230" y="222" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{digitCount} − 2 used = {hundredsChoices}</text><text x="230" y="242" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={TEAL}>zero is allowed here</text></>}
        {phase === 4 && <><UsedDeck used={3} forbidZero={false} /><text x="230" y="222" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{digitCount} − 3 used = {tensChoices}</text><motion.text x="230" y="255" textAnchor="middle" fontSize="16" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ scale: 0.7 }} animate={{ scale: 1 }}>5 · 8 · 8 · 7 = {favorable}</motion.text></>}
        {phase === 5 && <><text x="230" y="162" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>favorable / total</text><text x="230" y="190" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>{favorable}/{total}</text><motion.text x="230" y="216" textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>÷ {divisor} on top and bottom</motion.text><motion.rect x="166" y="229" width="128" height="42" rx="12" fill="#dcfce7" stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="230" y="257" textAnchor="middle" fontSize="20" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{reduced}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={402} y={260} width={78} /></>}
      </>}
      {phase === 5 && <text x="165" y="293" textAnchor="middle" fontSize="9" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "slot counts, total, reduction, and choice verified" : failure}</text>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="292" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
