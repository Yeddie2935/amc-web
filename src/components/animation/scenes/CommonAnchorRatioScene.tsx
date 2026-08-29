import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GOLD = "#d97706", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (a: number, b: number) => a / gcd(a, b) * b;

/** Match the shared group in two ratios at its LCM, then merge the attached groups. */
export function CommonAnchorRatioScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const first = (Array.isArray(data.firstRatio) ? data.firstRatio : []).map((v) => Math.round(num(v, 0)));
  const second = (Array.isArray(data.secondRatio) ? data.secondRatio : []).map((v) => Math.round(num(v, 0)));
  const labels = (Array.isArray(data.labels) ? data.labels : []).map(String);
  const common = lcm(first[0] ?? 1, second[0] ?? 1), scale1 = common / first[0], scale2 = common / second[0];
  const sixth = first[1] * scale1, seventh = second[1] * scale2, total = common + sixth + seventh;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d.-]/g, ""));
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === total)?.label;
  const ok = stored === total && choice === problem.answer;
  const failure = stored !== total ? `computed ${total}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1, phase = final ? 3 : Math.min(Math.max(step, 0), 2);
  const colors = [IND, GOLD, TEAL];

  const Dots = ({ count, x, y, color, cols = 10 }: { count: number; x: number; y: number; color: string; cols?: number }) => <g>{Array.from({ length: count }, (_, i) => <motion.circle key={i} cx={x + (i % cols) * 9} cy={y + Math.floor(i / cols) * 9} r="3.2" fill={color} initial={{ opacity: 0, scale: .2 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * .012 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />)}</g>;
  const Roster = ({ label, count, x, y, color, width = 116 }: { label: string; count: number; x: number; y: number; color: string; width?: number }) => <g><rect x={x} y={y} width={width} height="74" rx="11" fill={`${color}12`} stroke={color} /><text x={x + width / 2} y={y + 17} textAnchor="middle" fontSize="10" fontWeight="900" fill={color}>{label}: {count}</text><Dots count={count} x={x + 13} y={y + 30} color={color} cols={10} /></g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 430 330" width="100%" style={{ maxWidth: 465, minWidth: 0, display: "block" }}>
      <text x="215" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "make the two 8th-grade counts meet for the first time" : phase === 1 ? "expand 5:3 until the 8th-grade group reaches 40" : phase === 2 ? "expand 8:5 until the same group reaches 40" : "merge the shared 8th-grade group only once"}</text>

      {phase === 0 && <g>
        <g transform="translate(28 46)"><rect width="170" height="63" rx="12" fill="#eef2ff" stroke={IND} /><text x="85" y="21" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>{labels[0]} : {labels[1]}</text><text x="85" y="48" textAnchor="middle" fontSize="22" fontWeight="900" fill={IND} fontFamily={FONT}>{first[0]} : {first[1]}</text></g>
        <g transform="translate(232 46)"><rect width="170" height="63" rx="12" fill="#ecfeff" stroke={TEAL} /><text x="85" y="21" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>{labels[0]} : {labels[2]}</text><text x="85" y="48" textAnchor="middle" fontSize="22" fontWeight="900" fill={TEAL} fontFamily={FONT}>{second[0]} : {second[1]}</text></g>
        <text x="113" y="139" textAnchor="middle" fontSize="10" fontWeight="900" fill={IND} fontFamily={FONT}>{Array.from({ length: scale1 }, (_, i) => (i + 1) * first[0]).join("  ")}</text>
        <text x="317" y="139" textAnchor="middle" fontSize="10" fontWeight="900" fill={TEAL} fontFamily={FONT}>{Array.from({ length: scale2 }, (_, i) => (i + 1) * second[0]).join("  ")}</text>
        <motion.path d="M 113 148 C 140 190 176 190 205 203 M 317 148 C 290 190 254 190 225 203" fill="none" stroke={GOLD} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <motion.circle cx="215" cy="213" r="30" fill="#fef3c7" stroke={GOLD} strokeWidth="3" initial={{ scale: .4 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="215" y="220" textAnchor="middle" fontSize="21" fontWeight="900" fill={GOLD} fontFamily={FONT}>{common}</text>
        <text x="215" y="260" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>LCM({first[0]}, {second[0]}) = {common}</text><text x="215" y="283" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>the smallest shared 8th-grade count</text>
      </g>}

      {phase === 1 && <g>
        <text x="215" y="49" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>{first[0]}:{first[1]} × {scale1} → {common}:{sixth}</text>
        <Roster label={labels[0]} count={common} x={65} y={72} color={IND} width={132} /><Roster label={labels[1]} count={sixth} x={233} y={72} color={GOLD} width={132} />
        <g transform="translate(75 184)"><rect width="280" height="55" rx="12" fill="#eef2ff" stroke={IND} /><text x="140" y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>multiply both parts by the same factor</text><text x="140" y="43" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>{first[0]}×{scale1} = {common} · {first[1]}×{scale1} = {sixth}</text></g>
      </g>}

      {phase === 2 && <g>
        <text x="215" y="49" textAnchor="middle" fontSize="16" fontWeight="900" fill={TEAL} fontFamily={FONT}>{second[0]}:{second[1]} × {scale2} → {common}:{seventh}</text>
        <Roster label={labels[0]} count={common} x={65} y={72} color={IND} width={132} /><Roster label={labels[2]} count={seventh} x={233} y={72} color={TEAL} width={132} />
        <g transform="translate(75 184)"><rect width="280" height="55" rx="12" fill="#ecfeff" stroke={TEAL} /><text x="140" y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>multiply both parts by the same factor</text><text x="140" y="43" textAnchor="middle" fontSize="17" fontWeight="900" fill={TEAL} fontFamily={FONT}>{second[0]}×{scale2} = {common} · {second[1]}×{scale2} = {seventh}</text></g>
      </g>}

      {phase === 3 && <g>
        <Roster label={labels[0]} count={common} x={18} y={45} color={IND} /><Roster label={labels[2]} count={seventh} x={157} y={45} color={TEAL} /><Roster label={labels[1]} count={sixth} x={296} y={45} color={GOLD} />
        <motion.path d="M 76 130 C 76 164 168 164 205 190 M 215 130 V 184 M 354 130 C 354 164 262 164 225 190" fill="none" stroke={DIM} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <g transform="translate(60 195)"><motion.rect width="310" height="61" rx="13" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: .8 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="155" y="21" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>8th + 7th + 6th graders</text><text x="155" y="48" textAnchor="middle" fontSize="20" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{common} + {seventh} + {sixth} = {total}</text></g>
        <text x="215" y="278" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>40 is the first common anchor, so this total is smallest</text>
      </g>}
      <SvgAnswerBadge show={final && ok} answer={problem.answer ?? null} cx={215} y={291} width={78} />
      <AnimatePresence>{final && !ok && <motion.text x="215" y="328" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
