import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";
const COLORS = ["#2563eb", "#d97706", "#7c3aed"];

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const lcm = (values: number[]) => values.reduce((acc, value) => Math.abs(acc * value) / gcd(acc, value), 1);

/**
 * Three congruences whose remainders are each four below their divisor. Moving
 * four steps back turns all three into a common-multiple target; their LCM then
 * produces every solution. Data: { divisors, remainders, solutions }.
 */
export function ThreeRemaindersScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const divisors = (Array.isArray(data.divisors) ? data.divisors : []).map((v) => Math.round(num(v, 0)));
  const remainders = (Array.isArray(data.remainders) ? data.remainders : []).map((v) => Math.round(num(v, 0)));
  const supplied = (Array.isArray(data.solutions) ? data.solutions : []).map((v) => Math.round(num(v, 0)));
  const shift = divisors.length ? divisors[0] - remainders[0] : 0;
  const period = lcm(divisors);
  const derived = Array.from({ length: Math.max(0, Math.floor((999 + shift) / period)) }, (_, i) => period * (i + 1) - shift)
    .filter((value) => value >= 100 && value <= 999);
  const aligned = divisors.length === 3 && remainders.length === 3 && divisors.every((d, i) => d - remainders[i] === shift);
  const sameSolutions = supplied.length === derived.length && supplied.every((value, i) => value === derived[i]);
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d]/g, ""));
  const ok = aligned && sameSolutions && Number.isFinite(stored) && stored === derived.length;
  const isFinal = step >= totalSteps - 1;
  const W = 460;

  const lane = (d: number, r: number, i: number) => {
    const y = 68 + i * 48;
    const x = 86;
    const cell = 24;
    return (
      <motion.g key={d} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 210, damping: 18, delay: i * 0.16 }}>
        <text x="14" y={y + 17} fontSize="11" fontWeight="900" fill={COLORS[i]} fontFamily={FONT}>mod {d}</text>
        {Array.from({ length: d }, (_, j) => (
          <rect key={j} x={x + j * cell} y={y} width={cell - 2} height="30" rx="4" fill={j < r ? COLORS[i] : "#e2e8f0"} fillOpacity={j < r ? 0.8 : 1} />
        ))}
        <text x={x + d * cell + 8} y={y + 19} fontSize="12" fontWeight="850" fill={COLORS[i]} fontFamily={FONT}>remainder {r}</text>
      </motion.g>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} 270`} width="100%" style={{ maxWidth: 470 }}>
        <text x={W / 2} y="18" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>
          {step === 0 ? "each remainder is the same distance from a full group" : isFinal ? "one synchronized stop every 198, then step back 4" : "move back 4 to land on a common multiple"}
        </text>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.g key="remainders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {divisors.map((d, i) => lane(d, remainders[i], i))}
              <motion.text x={W / 2} y="235" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ scale: 0.65 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                {divisors.map((d, i) => `${d} − ${remainders[i]}`).join(" = ")} = {shift}
              </motion.text>
              <text x={W / 2} y="254" textAnchor="middle" fontSize="11" fontWeight="750" fill={DIM}>so n + {shift} is divisible by 6, 9, and 11</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g key="lcm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {divisors.map((d, i) => {
                const y = 64 + i * 46;
                const count = period / d;
                return (
                  <g key={d}>
                    <text x="24" y={y + 5} fontSize="12" fontWeight="900" fill={COLORS[i]} fontFamily={FONT}>multiples of {d}</text>
                    <motion.line x1="159" y1={y} x2="410" y2={y} stroke="#cbd5e1" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.55, delay: i * 0.15 }} />
                    {Array.from({ length: Math.min(count + 1, 12) }, (_, j) => <circle key={j} cx={159 + (251 * j) / count} cy={y} r={j === count ? 6 : 3} fill={j === count ? WIN : COLORS[i]} />)}
                    <text x="417" y={y + 5} fontSize="12" fontWeight="900" fill={WIN} fontFamily={FONT}>198</text>
                  </g>
                );
              })}
              <motion.path d="M 418 46 L 418 178" stroke={WIN} strokeWidth="2.5" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.65, duration: 0.7 }} />
              <motion.text x={W / 2} y="222" textAnchor="middle" fontSize="19" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
                LCM(6, 9, 11) = {period}
              </motion.text>
              <text x={W / 2} y="247" textAnchor="middle" fontSize="15" fontWeight="850" fill={INK} fontFamily={FONT}>n = {period}k − {shift}</text>
            </motion.g>
          )}

          {isFinal && (
            <motion.g key="count" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x="28" y="35" width="18" height="24" rx="4" fill="#e0e7ff" stroke={IND} strokeWidth="1.5" />
              <circle cx="37" cy="42" r="4" fill={WIN} />
              <path d="M 37 59 L 37 71" stroke={INK} strokeWidth="2" strokeLinecap="round" />
              <text x="67" y="54" fontSize="11" fontWeight="850" fill={INK}>three-digit stops</text>
              <motion.line x1="38" y1="146" x2="422" y2="146" stroke="#94a3b8" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
              <text x="38" y="169" textAnchor="middle" fontSize="10" fill={DIM} fontFamily={FONT}>100</text>
              <text x="422" y="169" textAnchor="middle" fontSize="10" fill={DIM} fontFamily={FONT}>999</text>
              {derived.map((value, i) => {
                const x = 38 + ((value - 100) / 899) * 384;
                return (
                  <motion.g key={value} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.18 + i * 0.14 }}>
                    <circle cx={x} cy="146" r="8" fill={WIN} />
                    <text x={x} y="128" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{value}</text>
                    <text x={x} y="151" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff">{i + 1}</text>
                  </motion.g>
                );
              })}
              <motion.text x={W / 2} y="209" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}>
                {derived.join(", ")}
              </motion.text>
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <rect x="181" y="230" width="98" height="25" rx="12.5" fill={ok ? WIN : "#dc2626"} />
                <text x={W / 2} y="247" textAnchor="middle" fontSize="12" fontWeight="850" fill="#fff">Answer {ok ? problem.answer : "check data"}</text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
