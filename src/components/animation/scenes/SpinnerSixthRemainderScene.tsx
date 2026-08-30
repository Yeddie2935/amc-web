import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";
const AMBER = "#d97706";

const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b);

function sectorPath(cx: number, cy: number, r: number, start: number, end: number) {
  const point = (angle: number) => [cx + r * Math.cos(angle * Math.PI / 180), cy + r * Math.sin(angle * Math.PI / 180)];
  const [x1, y1] = point(start);
  const [x2, y2] = point(end);
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
}

/** Partition a spinner into common probability shares, remove A and B, and reveal C as the sole remainder. */
export function SpinnerSixthRemainderScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const numerators = Array.isArray(data.numerators) ? data.numerators.map(Number) : [];
  const denominators = Array.isArray(data.denominators) ? data.denominators.map(Number) : [];
  const labels = Array.isArray(data.labels) ? data.labels.map(String) : [];
  const common = lcm(denominators[0] || 1, denominators[1] || 1);
  const shares = numerators.map((n, i) => n * common / denominators[i]);
  const remainder = common - shares.reduce((sum, value) => sum + value, 0);
  const answer = `${remainder}/${common}`;
  const choice = (problem.choices ?? []).find((item) => item.text.trim() === answer)?.label;
  const valid = remainder > 0 && answer === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const cx = phase === 2 ? 140 : 235;
  const cy = 147;
  const radius = phase === 2 ? 98 : 105;
  const wedgeLabels = Array.from({ length: common }, (_, i) => i < shares[0] ? labels[0] : i < shares[0] + shares[1] ? labels[1] : labels[2]);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 470 315" width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="A spinner is divided into six equal probability shares; A takes two, B takes three, and C is the one remaining share">
        <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "the whole spinner is one complete probability" : phase === 1 ? "rewrite thirds and halves as equal sixth-shares" : "remove A and B; the untouched share must be C"}
        </text>

        {Array.from({ length: common }, (_, i) => {
          const start = -90 + i * 360 / common;
          const end = -90 + (i + 1) * 360 / common;
          const middle = (start + end) / 2;
          const known = i < shares[0] + shares[1];
          const isA = i < shares[0];
          const color = phase === 0 ? "#c7d2fe" : isA ? "#93c5fd" : known ? "#fcd34d" : "#86efac";
          const dx = phase === 2 && known ? Math.cos(middle * Math.PI / 180) * 18 : 0;
          const dy = phase === 2 && known ? Math.sin(middle * Math.PI / 180) * 18 : 0;
          const lx = cx + Math.cos(middle * Math.PI / 180) * radius * 0.64 + dx;
          const ly = cy + Math.sin(middle * Math.PI / 180) * radius * 0.64 + dy;
          return <motion.g key={i} animate={{ x: dx, y: dy, opacity: phase === 2 && known ? 0.22 : 1 }} transition={{ delay: i * 0.07, type: "spring" }}>
            <motion.path d={sectorPath(cx, cy, radius, start, end)} fill={color} stroke="#fff" strokeWidth="3" initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.08, type: "spring", stiffness: 180, damping: 18 }} style={{ transformBox: "fill-box", transformOrigin: `${cx}px ${cy}px` }} />
            {phase >= 1 && <text x={lx - dx} y={ly - dy + 5} textAnchor="middle" fontSize="14" fontWeight="950" fill={phase === 2 && known ? DIM : INK}>{wedgeLabels[i]}</text>}
          </motion.g>;
        })}

        <circle cx={cx} cy={cy} r="12" fill="#fff" stroke={INK} strokeWidth="2" />
        <motion.g animate={{ rotate: phase === 0 ? 300 : phase === 1 ? 120 : 300 }} transition={{ duration: 1.2, type: "spring", stiffness: 90, damping: 14 }} style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <path d={`M ${cx} ${cy - 7} L ${cx - 5} ${cy - 61} L ${cx + 5} ${cy - 61} Z`} fill={IND} />
          <circle cx={cx} cy={cy} r="5" fill={IND} />
        </motion.g>

        {phase === 0 && (
          <>
            <motion.circle cx={cx} cy={cy} r={radius + 4} fill="none" stroke={IND} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <rect x="143" y="272" width="184" height="30" rx="11" fill="#eef2ff" stroke={IND} />
            <text x="235" y="292" textAnchor="middle" fontSize="16" fontWeight="950" fill={IND} fontFamily={FONT}>total = {common}/{common} = 1</text>
          </>
        )}

        {phase === 1 && (
          <>
            <rect x="36" y="268" width="180" height="34" rx="11" fill="#eff6ff" stroke="#3b82f6" />
            <text x="126" y="290" textAnchor="middle" fontSize="14" fontWeight="950" fill="#2563eb" fontFamily={FONT}>A: 1/3 = {shares[0]}/{common}</text>
            <rect x="254" y="268" width="180" height="34" rx="11" fill="#fffbeb" stroke={AMBER} />
            <text x="344" y="290" textAnchor="middle" fontSize="14" fontWeight="950" fill={AMBER} fontFamily={FONT}>B: 1/2 = {shares[1]}/{common}</text>
          </>
        )}

        <AnimatePresence>
          {phase === 2 && (
            <motion.g key="remainder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <path d="M 259 62 H 447 V 236 H 259 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="353" y="89" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>PROBABILITY LEFT</text>
              <text x="353" y="121" textAnchor="middle" fontSize="15" fontWeight="950" fill={INK} fontFamily={FONT}>{common}/{common} − {shares[0]}/{common} − {shares[1]}/{common}</text>
              <motion.path d="M 286 139 H 420" stroke={IND} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
              <text x="353" y="171" textAnchor="middle" fontSize="24" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>= {answer}</text>
              <text x="353" y="203" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN}>one of six equal shares</text>
              <text x="204" y="303" textAnchor="middle" fontSize="10" fontWeight="850" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? "2 + 3 + 1 = 6 • fraction and choice verified" : `check failed: computed ${answer}, stored ${problem.shortAnswer}`}</text>
              <SvgAnswerBadge show={valid} answer={problem.answer} cx={427} y={286} width={72} />
            </motion.g>
          )}
        </AnimatePresence>

        {phase === 2 && <text x="140" y="276" textAnchor="middle" fontSize="16" fontWeight="950" fill={GREEN}>C is the remainder</text>}
      </svg>
    </div>
  );
}
