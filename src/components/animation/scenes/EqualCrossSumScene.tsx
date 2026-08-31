import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

function equalPairing(values: number[]) {
  for (let i = 1; i < values.length; i++) {
    const rest = values.filter((_, index) => index !== 0 && index !== i);
    if (values[0] + values[i] === rest[0] + rest[1]) return [[values[0], values[i]], rest] as [number[], number[]];
  }
  return null;
}

/** Five number tiles fill a cross whose two three-cell rails share the center. Data: { numbers }. */
export function EqualCrossSumScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const numbers = (data.numbers as number[]).map(Number);
  const total = numbers.reduce((sum, value) => sum + value, 0);
  const candidates = numbers.map((center) => {
    const outside = numbers.filter((value) => value !== center);
    const pairing = equalPairing(outside);
    const common = (total + center) / 2;
    return { center, common, pairing, valid: Number.isInteger(common) && pairing !== null };
  });
  const winner = candidates.filter((item) => item.valid).sort((a, b) => b.common - a.common)[0];
  const choice = problem.choices?.find((item) => Number(item.text) === winner.common)?.label;
  const ok = winner.common === Number(problem.shortAnswer) && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);
  const cells = [{ x: 176, y: 34 }, { x: 112, y: 98 }, { x: 176, y: 98 }, { x: 240, y: 98 }, { x: 176, y: 162 }];

  const Cross = ({ values, centerGlow = false, muted = false }: { values?: Array<number | string>; centerGlow?: boolean; muted?: boolean }) => (
    <g>
      <motion.rect x="101" y="97" width="202" height="66" rx="12" fill="#eef2ff" fillOpacity={muted ? 0.42 : 0.9} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.45 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      <motion.rect x="175" y="23" width="66" height="202" rx="12" fill="#ecfeff" fillOpacity={muted ? 0.42 : 0.82} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.45, delay: 0.15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      {cells.map((cell, i) => <motion.g key={i} initial={{ opacity: 0, scale: 0.65 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: i * 0.07 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <rect x={cell.x} y={cell.y} width="64" height="64" rx="10" fill={i === 2 && centerGlow ? "#fef3c7" : "#fff"} stroke={i === 2 && centerGlow ? "#d97706" : i === 0 || i === 4 ? TEAL : IND} strokeWidth={i === 2 && centerGlow ? 3 : 1.8} />
        <text x={cell.x + 32} y={cell.y + 39} textAnchor="middle" fontSize="20" fontWeight="950" fill={i === 2 && centerGlow ? "#b45309" : INK} fontFamily={FONT}>{values?.[i] ?? "?"}</text>
      </motion.g>)}
      <text x="81" y="134" textAnchor="middle" fontSize="10" fontWeight="850" fill={IND} fontFamily={FONT}>row S</text>
      <text x="208" y="239" textAnchor="middle" fontSize="10" fontWeight="850" fill={TEAL} fontFamily={FONT}>column S</text>
    </g>
  );

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "4px 3px" }}>
    <svg viewBox="0 0 416 310" width="100%" style={{ maxWidth: 450 }}>
      <text x="208" y="17" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK} fontFamily={FONT}>EQUAL-SUM CROSS</text>

      {phase === 0 && <g>
        <Cross centerGlow />
        <motion.path d="M 208 130 C 332 72 356 166 303 205" fill="none" stroke="#d97706" strokeWidth="2" markerEnd="url(#amber-arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
        <rect x="292" y="202" width="112" height="45" rx="10" fill="#fffbeb" stroke="#f59e0b" />
        <text x="348" y="220" textAnchor="middle" fontSize="9.5" fontWeight="850" fill="#92400e" fontFamily={FONT}>SHARED CENTER</text>
        <text x="348" y="237" textAnchor="middle" fontSize="11" fontWeight="900" fill="#b45309" fontFamily={FONT}>used in both sums</text>
        <defs><marker id="amber-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#d97706" /></marker></defs>
        <text x="208" y="283" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>horizontal S + vertical S</text>
      </g>}

      {phase === 1 && <g>
        <Cross values={["a", "b", "c", "d", "e"]} centerGlow muted />
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <rect x="63" y="254" width="290" height="42" rx="12" fill="#eef2ff" stroke="#c7d2fe" />
          <text x="208" y="272" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK} fontFamily={FONT}>two S sums count all five tiles + center again</text>
          <text x="208" y="290" textAnchor="middle" fontSize="15" fontWeight="950" fill={IND} fontFamily={FONT}>2S = {total} + c   →   S = ({total} + c) ÷ 2</text>
        </motion.g>
      </g>}

      {phase === 2 && <g>
        <text x="208" y="42" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK} fontFamily={FONT}>try each real number in the shared center</text>
        {candidates.map((candidate, i) => {
          const x = 18 + i * 80;
          const selected = candidate.center === winner.center;
          return <motion.g key={candidate.center} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", delay: i * 0.1 }}>
            <rect x={x} y="62" width="60" height="118" rx="12" fill={selected ? "#dcfce7" : candidate.valid ? "#eef2ff" : "#f8fafc"} stroke={selected ? GREEN : candidate.valid ? IND : "#cbd5e1"} strokeWidth={selected ? 2.5 : 1.5} />
            <text x={x + 30} y="82" textAnchor="middle" fontSize="9" fontWeight="800" fill={DIM} fontFamily={FONT}>center</text>
            <text x={x + 30} y="108" textAnchor="middle" fontSize="22" fontWeight="950" fill={selected ? GREEN : INK} fontFamily={FONT}>{candidate.center}</text>
            <line x1={x + 9} y1="119" x2={x + 51} y2="119" stroke="#cbd5e1" />
            <text x={x + 30} y="139" textAnchor="middle" fontSize="9" fontWeight="850" fill={INK} fontFamily={FONT}>S =</text>
            <text x={x + 30} y="159" textAnchor="middle" fontSize="15" fontWeight="950" fill={candidate.valid ? (selected ? GREEN : IND) : RED} fontFamily={FONT}>{Number.isInteger(candidate.common) ? candidate.common : candidate.common.toFixed(1)}</text>
            <text x={x + 30} y="174" textAnchor="middle" fontSize="10" fontWeight="950" fill={candidate.valid ? GREEN : RED}>{candidate.valid ? "✓" : "×"}</text>
          </motion.g>;
        })}
        <motion.path d={`M ${18 + numbers.indexOf(winner.center) * 80 + 30} 184 L ${18 + numbers.indexOf(winner.center) * 80 + 30} 220`} stroke={GREEN} strokeWidth="2.5" markerEnd="url(#green-arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.85 }} />
        <defs><marker id="green-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill={GREEN} /></marker></defs>
        <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: 0.95 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x="107" y="229" width="202" height="54" rx="13" fill="#dcfce7" stroke="#86efac" />
          <text x="208" y="249" textAnchor="middle" fontSize="10" fontWeight="850" fill="#166534" fontFamily={FONT}>LARGEST VALID CENTER</text>
          <text x="208" y="272" textAnchor="middle" fontSize="18" fontWeight="950" fill={GREEN} fontFamily={FONT}>c = {winner.center} → S = {winner.common}</text>
        </motion.g>
      </g>}

      {phase === 3 && (() => {
        const [horizontal, vertical] = winner.pairing!;
        const values = [vertical[0], horizontal[0], winner.center, horizontal[1], vertical[1]];
        return <g>
          <Cross values={values} centerGlow />
          <motion.rect x="91" y="89" width="234" height="82" rx="14" fill="none" stroke={IND} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
          <motion.rect x="167" y="15" width="82" height="218" rx="14" fill="none" stroke={TEAL} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
          <motion.text x="208" y="260" textAnchor="middle" fontSize="15" fontWeight="950" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>{horizontal[0]} + {winner.center} + {horizontal[1]} = {winner.common}</motion.text>
          <motion.text x="208" y="281" textAnchor="middle" fontSize="15" fontWeight="950" fill={TEAL} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.72 }}>{vertical[0]} + {winner.center} + {vertical[1]} = {winner.common}</motion.text>
          <SvgAnswerBadge show={ok} answer={problem.answer == null ? null : String(problem.answer)} cx={363} y={269} width={78} />
          {!ok && <text x="208" y="303" textAnchor="middle" fontSize="10" fontWeight="850" fill={RED} fontFamily={FONT}>pairing or stored-answer check failed</text>}
        </g>;
      })()}
    </svg>
  </div>;
}
