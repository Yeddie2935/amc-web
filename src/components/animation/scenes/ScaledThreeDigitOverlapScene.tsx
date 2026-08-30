import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Put two three-digit constraints on the shared x=n/divisor scale and intersect them. */
export function ScaledThreeDigitOverlapScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const min = num(data.threeDigitMin, 0), max = num(data.threeDigitMax, 0), divisor = num(data.divisor, 0), multiplier = num(data.multiplier, 0);
  const combined = divisor * multiplier;
  const firstLow = Math.ceil(min), firstHigh = Math.floor(max);
  const secondLow = Math.ceil(min / combined), secondHigh = Math.floor(max / combined);
  const low = Math.max(firstLow, secondLow), high = Math.min(firstHigh, secondHigh);
  const xs = Array.from({ length: Math.max(0, high - low + 1) }, (_, i) => low + i);
  const ns = xs.map(x => divisor * x);
  const valid = ns.every((n, i) => Number.isInteger(n / divisor) && n / divisor >= min && n / divisor <= max && multiplier * n >= min && multiplier * n <= max);
  const answer = xs.length;
  const choice = problem.choices?.find(c => Number(c.text) === answer)?.label;
  const ok = combined === 9 && low === 100 && high === 111 && valid && String(answer) === problem.shortAnswer && choice === problem.answer;
  const failure = combined !== 9 ? `combined scale is ${combined}` : low !== 100 || high !== 111 ? `overlap is ${low} through ${high}` : !valid ? "a mapped n fails a three-digit test" : String(answer) !== problem.shortAnswer ? `counted ${answer}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: 480, minWidth: 0, padding: "6px 4px", boxSizing: "border-box", overflow: "hidden" }}>
    <svg viewBox="0 0 460 320" width="100%" style={{ maxWidth: "100%", display: "block" }} aria-label="Three-digit constraints converted to overlapping intervals for x equals n divided by three">
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "rename n ÷ 3 as x, so both outputs use one scale" : phase === 1 ? "clamp the two three-digit windows to their overlap" : "each surviving x maps to exactly one positive integer n = 3x"}</text>

      {phase === 0 && <g>
        <g transform="translate(31 52)"><rect width="104" height="58" rx="12" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x="52" y="22" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>SUBSTITUTE</text><text x="52" y="45" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>x = n/{divisor}</text></g>
        <motion.path d="M135 81 H181" stroke={INK} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}/><path d="M174 75l9 6-9 6z" fill={INK}/>
        <g transform="translate(188 45)"><rect width="241" height="74" rx="13" fill="#f8fafc" stroke="#cbd5e1"/><text x="120.5" y="27" textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT}>n/{divisor} = x</text><text x="120.5" y="55" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{multiplier}n = {multiplier}·({divisor}x) = {combined}x</text></g>
        <g transform="translate(54 159)"><rect width="352" height="91" rx="14" fill="#f0fdf4" stroke={GREEN}/><text x="176" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>BOTH MUST PASS THE THREE-DIGIT GATE</text><g transform="translate(27 41)"><rect width="119" height="34" rx="9" fill="#fff" stroke={TEAL}/><text x="59.5" y="22" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT}>{min} ≤ x ≤ {max}</text></g><g transform="translate(206 41)"><rect width="119" height="34" rx="9" fill="#fff" stroke={IND}/><text x="59.5" y="22" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{min} ≤ {combined}x ≤ {max}</text></g></g>
        <text x="230" y="286" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>n disappears from the constraints, but returns one-to-one at the end</text>
      </g>}

      {phase === 1 && <g>
        <g transform="translate(43 51)"><text x="0" y="20" fontSize="11" fontWeight="900" fill={TEAL} fontFamily={FONT}>x is 3-digit</text><rect x="111" width="280" height="38" rx="10" fill="#ecfeff" stroke={TEAL}/><text x="251" y="24" textAnchor="middle" fontSize="15" fontWeight="900" fill={TEAL} fontFamily={FONT}>{firstLow} ≤ x ≤ {firstHigh}</text></g>
        <g transform="translate(43 113)"><text x="0" y="20" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>{combined}x is 3-digit</text><rect x="111" width="280" height="38" rx="10" fill="#eef2ff" stroke={IND}/><text x="251" y="24" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{secondLow} ≤ x ≤ {secondHigh}</text></g>
        <motion.path d="M183 166 C183 197 230 194 230 215 M391 166 C391 197 230 194 230 215" fill="none" stroke={GREEN} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}/>
        <g transform="translate(94 219)"><motion.rect width="272" height="61" rx="13" fill="#dcfce7" stroke={GREEN} strokeWidth="2" initial={{ scale: .75 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}/><text x="136" y="23" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>INTERSECTION</text><text x="136" y="47" textAnchor="middle" fontSize="19" fontWeight="900" fill={GREEN} fontFamily={FONT}>{low} ≤ x ≤ {high}</text></g>
        <text x="230" y="307" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>the lower bound comes from x; the upper bound comes from {combined}x</text>
      </g>}

      {phase === 2 && <g>
        <g transform="translate(36 51)">{xs.map((x, i) => { const col = i % 6, row = Math.floor(i / 6), px = col * 66, py = row * 82; return <motion.g key={x} initial={{ scale: .55 }} animate={{ scale: 1 }} transition={{ delay: i * .055 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x={px} y={py} width="54" height="31" rx="8" fill="#eef2ff" stroke={IND}/><text x={px + 27} y={py + 21} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>x={x}</text><path d={`M${px + 27} ${py + 33}v15`} stroke={GREEN} strokeWidth="2"/><path d={`M${px + 22} ${py + 43}l5 6 5-6`} fill="none" stroke={GREEN} strokeWidth="2"/><rect x={px} y={py + 51} width="54" height="25" rx="7" fill="#dcfce7" stroke={GREEN}/><text x={px + 27} y={py + 68} textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN} fontFamily={FONT}>{ns[i]}</text></motion.g>; })}</g>
        <g transform="translate(111 228)"><rect width="238" height="54" rx="12" fill={ok ? "#f0fdf4" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="2"/><text x="119" y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>INCLUSIVE INTEGER COUNT</text><text x="119" y="43" textAnchor="middle" fontSize="18" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{high} − {low} + 1 = {answer}</text></g>
        <text x="177" y="308" textAnchor="middle" fontSize="9" fontWeight="850" fill={ok ? GREEN : RED}>{ok ? `${answer} x-values give ${answer} distinct n-values` : failure}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={405} y={287} width={78}/>
      </g>}
    </svg>
  </div>;
}
