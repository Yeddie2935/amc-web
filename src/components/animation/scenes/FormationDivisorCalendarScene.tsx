import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

const divisors = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

function StudentDots({ x, y, columns, count, color = IND }: { x: number; y: number; columns: number; count: number; color?: string }) {
  return <>{Array.from({ length: count }, (_, i) => (
    <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.035 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <circle cx={x + (i % columns) * 12} cy={y + Math.floor(i / columns) * 15} r="4.2" fill={color} />
      <circle cx={x + (i % columns) * 12} cy={y + Math.floor(i / columns) * 15 - 5.5} r="2.5" fill={color} />
    </motion.g>
  ))}</>;
}

export function FormationDivisorCalendarScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const perRow = (data.knownPerRow as unknown[]).map((v) => Math.round(num(v, 0)));
  const successfulDays = Math.round(num(data.lastSuccessfulDay, 0));
  const failedDay = Math.round(num(data.firstFailedDay, 0));
  const requiredMultiple = lcm(perRow[0], perRow[2]);
  const firstCandidate = requiredMultiple;
  const nextCandidate = requiredMultiple * 2;
  const firstDivs = divisors(firstCandidate);
  const nextDivs = divisors(nextCandidate);
  const pairs = nextDivs.filter((d) => d <= nextCandidate / d).map((d) => [d, nextCandidate / d]);
  const stored = Number(problem.shortAnswer);
  const ok = nextDivs.length === successfulDays && nextCandidate === stored && problem.answer === "C";
  const last = totalSteps - 1;
  const phase = step >= last ? 3 : Math.min(step, 2);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "5px 2px" }}>
      <svg viewBox="0 0 470 292" width="100%" style={{ maxWidth: 500 }} aria-label="Student formations become divisor pairs across twelve calendar days">
        {phase === 0 && <>
          <text x="235" y="22" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>same students, different rectangular formations</text>
          <g transform="translate(25 48)">
            <rect width="128" height="158" rx="13" fill="#eef2ff" stroke="#c7d2fe" />
            <text x="64" y="23" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND}>JUNE 1</text>
            <StudentDots x={10} y={51} columns={5} count={15} />
            <text x="64" y="124" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{perRow[0]} per row</text>
            <text x="64" y="145" textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM}>N = rows × {perRow[0]}</text>
          </g>
          <g transform="translate(171 48)">
            <rect width="128" height="158" rx="13" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="64" y="23" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK}>JUNE 2</text>
            <StudentDots x={13} y={71} columns={9} count={9} color="#0f766e" />
            <text x="64" y="95" textAnchor="middle" fontSize="16" fontWeight="900" fill="#0f766e">…</text>
            <text x="64" y="124" textAnchor="middle" fontSize="13" fontWeight="900" fill="#0f766e" fontFamily={FONT}>N per row</text>
            <text x="64" y="145" textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM}>N = 1 × N</text>
          </g>
          <g transform="translate(317 48)">
            <rect width="128" height="158" rx="13" fill="#f0fdf4" stroke="#bbf7d0" />
            <text x="64" y="23" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN}>JUNE 3</text>
            <StudentDots x={44} y={48} columns={1} count={4} color={GREEN} />
            <text x="64" y="112" textAnchor="middle" fontSize="16" fontWeight="900" fill={GREEN}>⋮</text>
            <text x="64" y="132" textAnchor="middle" fontSize="13" fontWeight="900" fill={GREEN} fontFamily={FONT}>{perRow[1]} per row</text>
            <text x="64" y="150" textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM}>N = N × 1</text>
          </g>
          <motion.rect x="119" y="230" width="232" height="42" rx="12" fill="#ede9fe" stroke="#c4b5fd" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          <text x="235" y="256" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>students per row = a divisor of N</text>
        </>}

        {phase === 1 && <>
          <text x="235" y="22" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>each successful day uses one new divisor</text>
          {Array.from({ length: failedDay }, (_, i) => {
            const day = i + 1;
            const success = day <= successfulDays;
            const x = 31 + (i % 7) * 59;
            const y = 47 + Math.floor(i / 7) * 73;
            return <g key={day}>
              <rect x={x} y={y} width="48" height="54" rx="9" fill={success ? "#eef2ff" : "#fee2e2"} stroke={success ? IND : RED} strokeWidth="1.7" />
              <text x={x + 24} y={y + 17} textAnchor="middle" fontSize="9" fontWeight="850" fill={success ? DIM : RED}>JUNE</text>
              <text x={x + 24} y={y + 38} textAnchor="middle" fontSize="17" fontWeight="900" fill={success ? IND : RED} fontFamily={FONT}>{day}</text>
              <text x={x + 24} y={y + 50} textAnchor="middle" fontSize="8" fontWeight="900" fill={success ? GREEN : RED}>{success ? "NEW ✓" : "NONE"}</text>
            </g>;
          })}
          <motion.g initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x="120" y="218" width="230" height="51" rx="13" fill="#dcfce7" stroke="#86efac" />
            <text x="235" y="240" textAnchor="middle" fontSize="11" fontWeight="850" fill="#166534">12 new formations, then no thirteenth</text>
            <text x="235" y="258" textAnchor="middle" fontSize="16" fontWeight="900" fill={GREEN} fontFamily={FONT}>d(N) = {successfulDays}</text>
          </motion.g>
        </>}

        {phase === 2 && <>
          <text x="235" y="22" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>both given row lengths must divide N</text>
          <g transform="translate(35 45)">
            <rect width="118" height="59" rx="12" fill="#eef2ff" stroke="#c7d2fe" />
            <text x="59" y="24" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>{perRow[0]} = 3 × 5</text>
            <text x="59" y="44" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>students / row</text>
          </g>
          <g transform="translate(317 45)">
            <rect width="118" height="59" rx="12" fill="#ecfeff" stroke="#99f6e4" />
            <text x="59" y="24" textAnchor="middle" fontSize="16" fontWeight="900" fill="#0f766e" fontFamily={FONT}>{perRow[2]} = 2 × 3</text>
            <text x="59" y="44" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>students / row</text>
          </g>
          <motion.path d="M154 74 C185 74 191 113 218 118 M316 74 C285 74 279 113 252 118" fill="none" stroke={IND} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
          <motion.rect x="181" y="108" width="108" height="45" rx="12" fill="#ede9fe" stroke={IND} initial={{ scale: .7 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          <text x="235" y="127" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>LCM</text>
          <text x="235" y="145" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>2 × 3 × 5 = {requiredMultiple}</text>
          <text x="235" y="176" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>N = {requiredMultiple}k</text>
          <g transform="translate(35 194)">
            <rect width="400" height="66" rx="13" fill="#fff7ed" stroke="#fdba74" />
            <text x="55" y="27" textAnchor="middle" fontSize="13" fontWeight="900" fill="#9a3412" fontFamily={FONT}>k=1: {firstCandidate}</text>
            {firstDivs.map((d, i) => <motion.g key={d} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .35 + i * .07 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <circle cx={127 + i * 31} cy="25" r="12" fill="#ffedd5" stroke="#f97316" />
              <text x={127 + i * 31} y="29" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#9a3412" fontFamily={FONT}>{d}</text>
            </motion.g>)}
            <text x="200" y="53" textAnchor="middle" fontSize="11" fontWeight="900" fill={RED} fontFamily={FONT}>only {firstDivs.length} divisors ≠ {successfulDays} ✕</text>
          </g>
        </>}

        {phase === 3 && <>
          <text x="235" y="21" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>{nextCandidate}: pair the divisors into row formations</text>
          {pairs.map(([a, b], i) => {
            const x = 27 + (i % 3) * 148;
            const y = 46 + Math.floor(i / 3) * 82;
            const sourcePair = a === perRow[2] || b === perRow[0];
            return <g key={a}>
              <rect x={x} y={y} width="122" height="59" rx="12" fill={sourcePair ? "#dcfce7" : "#eef2ff"} stroke={sourcePair ? GREEN : IND} strokeWidth={sourcePair ? 2.4 : 1.5} />
              <text x={x + 61} y={y + 28} textAnchor="middle" fontSize="17" fontWeight="900" fill={sourcePair ? "#166534" : IND} fontFamily={FONT}>{a} × {b} = {nextCandidate}</text>
              <text x={x + 61} y={y + 47} textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>{a} rows × {b} per row</text>
            </g>;
          })}
          <g>
            <rect x="76" y="224" width="318" height="47" rx="13" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" />
            <text x="235" y="243" textAnchor="middle" fontSize="11" fontWeight="850" fill={ok ? "#166534" : RED}>{pairs.length} factor pairs × 2 = {nextDivs.length} divisors</text>
            <text x="235" y="261" textAnchor="middle" fontSize="15" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? `${nextCandidate} students → Answer ${problem.answer}` : "divisor or stored-answer check failed"}</text>
          </g>
        </>}
      </svg>
      <AnimatePresence>{phase === 2 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontFamily: FONT, fontSize: 12, fontWeight: 850, color: RED, textAlign: "center" }}>30 fails, so test the next multiple of 30.</motion.div>}</AnimatePresence>
    </div>
  );
}
