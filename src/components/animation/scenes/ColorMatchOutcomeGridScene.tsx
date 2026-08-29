import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", YELLOW = "#d97706", DIM = "#64748b";
const tones: Record<string, { fill: string; stroke: string }> = {
  green: { fill: "#bbf7d0", stroke: GREEN }, red: { fill: "#fecaca", stroke: RED }, yellow: { fill: "#fef3c7", stroke: YELLOW },
};
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);

/** Deal both hands onto a complete pick-pair board and illuminate equal-color cells. */
export function ColorMatchOutcomeGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const abe = (Array.isArray(data.abeColors) ? data.abeColors : []).map(String);
  const bob = (Array.isArray(data.bobColors) ? data.bobColors : []).map(String);
  const outcomes = abe.flatMap((a, row) => bob.map((b, col) => ({ a, b, row, col, match: a === b })));
  const greenMatches = outcomes.filter((o) => o.match && o.a === "green");
  const redMatches = outcomes.filter((o) => o.match && o.a === "red");
  const matches = outcomes.filter((o) => o.match);
  const divisor = gcd(matches.length, outcomes.length) || 1;
  const answer = `${matches.length / divisor}/${outcomes.length / divisor}`;
  const choice = problem.choices?.find((item) => item.text === answer)?.label;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const ok = outcomes.length === 8 && greenMatches.length === 1 && redMatches.length === 2 && answer === problem.shortAnswer && choice === problem.answer;
  const failure = outcomes.length !== 8 ? `generated ${outcomes.length} outcomes, expected 8` : matches.length !== 3 ? `counted ${matches.length} matches, expected 3` : answer !== problem.shortAnswer ? `computed ${answer}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const bean = (x: number, y: number, color: string, scale = 1) => { const tone = tones[color] ?? tones.yellow; return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M-15,-8 C-23,0 -16,15 -3,14 C10,14 20,5 16,-6 C12,-17 -5,-15 -15,-8 Z" fill={tone.fill} stroke={tone.stroke} strokeWidth="2" /><path d="M-8,-7 C-2,-3 2,1 4,7" fill="none" stroke={tone.stroke} strokeWidth="1.3" opacity=".45" /></g>; };

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 330" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "green meets green in exactly one pick-pair cell" : phase === 1 ? "Abe's red meets either of Bob's two red beans" : "three matching cells out of eight equally likely pick pairs"}</text>

      <text x="42" y="57" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>ABE ↓</text>
      <text x="258" y="38" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>BOB →</text>
      {bob.map((color, col) => <motion.g key={`bob-${col}`} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: col * .08 }}>{bean(143 + col * 76, 56, color, .85)}</motion.g>)}
      {abe.map((color, row) => <motion.g key={`abe-${row}`} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: row * .12 }}>{bean(69, 104 + row * 75, color, .85)}</motion.g>)}

      {outcomes.map((outcome, index) => {
        const x = 108 + outcome.col * 76, y = 76 + outcome.row * 75;
        const revealed = outcome.match && (outcome.a === "green" || phase >= 1);
        const tone = tones[outcome.a] ?? tones.yellow;
        return <motion.g key={`${outcome.row}-${outcome.col}`} initial={{ opacity: 0, scale: .65 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .25 + index * .055 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x={x} y={y} width="68" height="66" rx="11" fill={revealed ? tone.fill : "#f8fafc"} stroke={revealed ? tone.stroke : "#cbd5e1"} strokeWidth={revealed ? 2.5 : 1.3} />
          {revealed ? <><motion.path d={`M${x + 21} ${y + 35} l8 8 18 -22`} fill="none" stroke={tone.stroke} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .5 + index * .04 }} /><text x={x + 34} y={y + 58} textAnchor="middle" fontSize="8.5" fontWeight="850" fill={tone.stroke}>MATCH</text></> : <><circle cx={x + 26} cy={y + 33} r="4" fill={tones[outcome.a]?.stroke} /><text x={x + 34} y={y + 37} textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>≠</text><circle cx={x + 43} cy={y + 33} r="4" fill={tones[outcome.b]?.stroke} /></>}
        </motion.g>;
      })}

      {phase === 0 && <g transform="translate(95 239)"><rect width="270" height="48" rx="12" fill="#f0fdf4" stroke={GREEN} /><text x="135" y="19" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={GREEN}>GREEN MATCH</text><text x="135" y="39" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>1 cell out of 2 × 4 = 8</text></g>}
      {phase === 1 && <g transform="translate(72 239)"><rect width="316" height="48" rx="12" fill="#fff1f2" stroke={RED} /><text x="158" y="18" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={RED}>RED MATCHES</text><text x="158" y="39" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>1 green cell + 2 red cells</text></g>}
      {phase === 2 && <>
        <g transform="translate(78 236)"><text x="38" y="24" textAnchor="middle" fontSize="22" fontWeight="900" fill={GREEN} fontFamily={FONT}>{matches.length}</text><line x1="21" y1="31" x2="55" y2="31" stroke={INK} strokeWidth="2" /><text x="38" y="54" textAnchor="middle" fontSize="22" fontWeight="900" fill={INDIGO} fontFamily={FONT}>{outcomes.length}</text><text x="91" y="39" textAnchor="middle" fontSize="20" fontWeight="900" fill={DIM}>=</text><motion.rect x="121" y="0" width="106" height="60" rx="13" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: .65 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="174" y="39" textAnchor="middle" fontSize="24" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{answer}</text></g>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={382} y={253} width={78} />
      </>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="321" textAnchor="middle" fontSize="9.5" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
