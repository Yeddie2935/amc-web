import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const COLORS = ["#2563eb", "#d97706", "#7c3aed"];
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const lcm = (values: number[]) => values.reduce((a, b) => Math.abs(a * b) / (gcd(a, b) || 1), 1);

/** Turn a shared remainder into a common multiple, then locate the first result. */
export function RemainderOneIntervalScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const divisors = (Array.isArray(data.divisors) ? data.divisors : []).map((v) => Math.round(num(v, 0)));
  const remainder = Math.round(num(data.remainder, 1));
  const period = lcm(divisors);
  const value = period + remainder;
  const intervals = (problem.choices ?? []).map((choice) => {
    const nums = String(choice.text).match(/-?\d+/g)?.map(Number) ?? [];
    return { label: choice.label, lo: nums[0] ?? NaN, hi: nums[1] ?? NaN };
  });
  const hits = intervals.filter((range) => range.lo < value && value < range.hi);
  const residues = divisors.map((d) => value % d);
  const storedHit = intervals.find((range) => range.label === problem.answer);
  const ok = divisors.length === 3 && residues.every((r) => r === remainder) && hits.length === 1 && hits[0].label === problem.answer && storedHit?.lo + " and " + storedHit?.hi === problem.shortAnswer;
  const failure = !residues.every((r) => r === remainder)
    ? `${value} gives remainders ${residues.join(", ")}`
    : hits.length !== 1
      ? `${value} lies in ${hits.length} choice intervals`
      : `computed choice ${hits[0]?.label ?? "none"}, stored answer ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "calc(100vw - 48px)", maxWidth: 480, minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 270" style={{ width: "calc(100vw - 48px)", maxWidth: 480, minWidth: 0, display: "block" }}>
      {phase === 0 && <g>
        <text x="230" y="18" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>remove the same one leftover from every division</text>
        {divisors.map((d, i) => {
          const y = 45 + i * 61;
          return <motion.g key={d} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 16, delay: i * 0.16 }}>
            <text x="24" y={y + 23} fontSize="12" fontWeight="900" fill={COLORS[i]} fontFamily={mono}>÷ {d}</text>
            {Array.from({ length: d }, (_, j) => <rect key={j} x={79 + j * 31} y={y} width="26" height="32" rx="5" fill="#e2e8f0" stroke="#cbd5e1" />)}
            <motion.circle cx={91 + d * 31} cy={y + 16} r="12" fill={COLORS[i]} initial={{ x: 0 }} animate={{ x: 38, opacity: 0.25 }} transition={{ duration: 0.75, delay: 0.7 + i * 0.12 }} />
            <text x={129 + d * 31} y={y + 20} fontSize="10.5" fontWeight="900" fill={COLORS[i]} fontFamily={mono}>remainder {remainder}</text>
          </motion.g>;
        })}
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
          <rect x="98" y="225" width="264" height="34" rx="12" fill="#eef2ff" stroke="#a5b4fc" />
          <text x="230" y="247" textAnchor="middle" fontSize="13" fontWeight="900" fill={INDIGO} fontFamily={mono}>n − {remainder} is divisible by {divisors.join(", ")}</text>
        </motion.g>
      </g>}

      {phase === 1 && <g>
        <text x="230" y="18" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>find the first synchronized full group</text>
        {divisors.map((d, i) => {
          const y = 55 + i * 53;
          const count = period / d;
          return <g key={d}>
            <text x="18" y={y + 4} fontSize="11" fontWeight="900" fill={COLORS[i]} fontFamily={mono}>multiples of {d}</text>
            <motion.line x1="128" y1={y} x2="402" y2={y} stroke="#cbd5e1" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.55, delay: i * 0.15 }} />
            {Array.from({ length: count + 1 }, (_, j) => <circle key={j} cx={128 + (274 * j) / count} cy={y} r={j === count ? 6 : 2.8} fill={j === count ? GREEN : COLORS[i]} />)}
            <text x="410" y={y + 4} fontSize="11" fontWeight="900" fill={GREEN} fontFamily={mono}>{period}</text>
          </g>;
        })}
        <motion.path d="M 403 37 L 403 180" stroke={GREEN} strokeWidth="2.5" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.65, duration: 0.6 }} />
        <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x="130" y="212" width="200" height="42" rx="12" fill="#eef2ff" stroke={INDIGO} strokeWidth="2" />
          <text x="230" y="238" textAnchor="middle" fontSize="17" fontWeight="900" fill={INDIGO} fontFamily={mono}>LCM({divisors.join(",")}) = {period}</text>
        </motion.g>
      </g>}

      {phase === 2 && <g>
        <text x="230" y="18" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>put the shared remainder token back</text>
        <motion.g initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 170, damping: 16 }}>
          <rect x="92" y="61" width="112" height="70" rx="12" fill="#eef2ff" stroke={INDIGO} strokeWidth="2" />
          <text x="148" y="104" textAnchor="middle" fontSize="28" fontWeight="900" fill={INDIGO} fontFamily={mono}>{period}</text>
        </motion.g>
        <text x="229" y="105" textAnchor="middle" fontSize="24" fontWeight="900" fill={INK}>+</text>
        <motion.circle cx="271" cy="96" r="22" fill="#fef3c7" stroke="#d97706" strokeWidth="2" initial={{ y: -42, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.35 }} />
        <text x="271" y="104" textAnchor="middle" fontSize="20" fontWeight="900" fill="#b45309" fontFamily={mono}>{remainder}</text>
        <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.7 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <text x="341" y="106" textAnchor="middle" fontSize="30" fontWeight="900" fill={GREEN} fontFamily={mono}>= {value}</text>
        </motion.g>
        {divisors.map((d, i) => <motion.g key={d} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 + i * 0.14 }}>
          <rect x={66 + i * 116} y="169" width="96" height="42" rx="10" fill="#f0fdf4" stroke="#86efac" />
          <text x={114 + i * 116} y="187" textAnchor="middle" fontSize="10" fontWeight="800" fill="#166534" fontFamily={mono}>{value} ÷ {d}</text>
          <text x={114 + i * 116} y="203" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN} fontFamily={mono}>remainder {value % d}</text>
        </motion.g>)}
        <text x="230" y="244" textAnchor="middle" fontSize="11" fontWeight="800" fill={GREEN}>all three checks agree</text>
      </g>}

      {phase === 3 && <g>
        <text x="230" y="18" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>drop {value} into the answer-choice intervals</text>
        {intervals.map((range, i) => {
          const y = 41 + i * 39;
          const hit = range.label === hits[0]?.label;
          return <motion.g key={range.label} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 16, delay: i * 0.09 }}>
            <circle cx="37" cy={y + 13} r="12" fill={hit ? GREEN : INDIGO} /><text x="37" y={y + 17} textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff">{range.label}</text>
            <line x1="68" y1={y + 13} x2="396" y2={y + 13} stroke={hit ? GREEN : "#cbd5e1"} strokeWidth={hit ? 3 : 2} />
            <text x="68" y={y + 8} fontSize="10" fontWeight="800" fill="#64748b" fontFamily={mono}>{range.lo}</text><text x="396" y={y + 8} textAnchor="end" fontSize="10" fontWeight="800" fill="#64748b" fontFamily={mono}>{range.hi}</text>
            {hit && <motion.g initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 190, damping: 14, delay: 0.8 }}><circle cx={68 + ((value - range.lo) / (range.hi - range.lo)) * 328} cy={y + 13} r="8" fill={GREEN} /><text x={68 + ((value - range.lo) / (range.hi - range.lo)) * 328} y={y - 2} textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN} fontFamily={mono}>{value}</text></motion.g>}
          </motion.g>;
        })}
        <text x="230" y="242" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={mono}>{ok ? `${hits[0].lo} < ${value} < ${hits[0].hi}` : failure}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={245} width={88} />
      </g>}
    </svg>
    <AnimatePresence>{final && !ok && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: RED, fontFamily: mono, fontSize: 11, fontWeight: 800 }}>{failure}</motion.div>}</AnimatePresence>
  </div>;
}
