import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", TEAL = "#0d9488", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626";

/** Count an annual event inclusively, then rewind a stated age to the birth year. Data: { firstYear, ordinal, age }. */
export function InclusiveContestBirthYearScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const first = Math.round(num(data.firstYear, 0)), ordinal = Math.round(num(data.ordinal, 0)), age = Math.round(num(data.age, 0));
  const contestYear = first + ordinal - 1, birthYear = contestYear - age;
  const final = step >= totalSteps - 1;
  const choice = problem.choices?.find((c) => Number(c.text) === birthYear)?.label;
  const consistent = birthYear === Number(problem.shortAnswer) && choice === problem.answer;

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "100%", padding: "5px 4px" }}>
    <svg viewBox="0 0 360 239" width="100%" style={{ maxWidth: 430 }}>
      {!final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x="180" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">COUNT THE FIRST CONTEST AS #1</text>
        {Array.from({ length: ordinal }, (_, i) => {
          const x = 18 + i * 47, year = first + i, winner = i === ordinal - 1;
          return <motion.g key={year} initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <rect x={x} y="38" width="42" height="61" rx="7" fill={winner ? "#dcfce7" : "#eef2ff"} stroke={winner ? GREEN : INDIGO} strokeWidth={winner ? 2.3 : 1.4} />
            <rect x={x} y="38" width="42" height="15" rx="7" fill={winner ? GREEN : INDIGO} />
            <text x={x + 21} y="49" textAnchor="middle" fontSize="8" fontWeight="900" fill="#fff">AMC 8</text>
            <text x={x + 21} y="73" textAnchor="middle" fontSize="12" fontWeight="900" fill={winner ? GREEN : INK} fontFamily={FONT}>{year}</text>
            <text x={x + 21} y="91" textAnchor="middle" fontSize="10" fontWeight="900" fill={winner ? GREEN : INDIGO} fontFamily={FONT}>#{i + 1}</text>
          </motion.g>;
        })}
        <motion.path d="M 39 119 H 321" stroke={TEAL} strokeWidth="3" strokeLinecap="round" markerEnd="url(#yearArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.8 }} />
        {Array.from({ length: ordinal - 1 }, (_, i) => <text key={i} x={62 + i * 47} y="137" textAnchor="middle" fontSize="9" fontWeight="900" fill={TEAL}>+1</text>)}
        <rect x="62" y="158" width="236" height="40" rx="11" fill="#ecfeff" stroke={TEAL} strokeWidth="2" />
        <text x="180" y="184" textAnchor="middle" fontSize="18" fontWeight="900" fill={TEAL} fontFamily={FONT}>{first} + ({ordinal} − 1) = {contestYear}</text>
        <text x="180" y="220" textAnchor="middle" fontSize="12" fontWeight="900" fill={AMBER}>seven contests need only six year-hops</text>
        <defs><marker id="yearArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6z" fill={TEAL} /></marker></defs>
      </motion.g>}

      {final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x="180" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">REWIND 12 BIRTHDAY INTERVALS FROM 1991</text>
        <line x1="28" y1="111" x2="332" y2="111" stroke={INK} strokeWidth="2" />
        {Array.from({ length: age + 1 }, (_, i) => {
          const year = birthYear + i, x = 30 + i * (300 / age), endpoint = i === 0 || i === age;
          return <motion.g key={year} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (age - i) * 0.045 }}>
            <line x1={x} y1={endpoint ? 99 : 104} x2={x} y2={endpoint ? 123 : 118} stroke={endpoint ? GREEN : "#94a3b8"} strokeWidth={endpoint ? 3 : 1.3} />
            {(endpoint || i % 3 === 0) && <text x={x} y="138" textAnchor="middle" fontSize={endpoint ? 10 : 8.5} fontWeight="900" fill={endpoint ? GREEN : "#64748b"} fontFamily={FONT}>{year}</text>}
          </motion.g>;
        })}
        <motion.path d="M 326 80 H 35" stroke={INDIGO} strokeWidth="3" strokeLinecap="round" markerEnd="url(#backArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
        <text x="180" y="69" textAnchor="middle" fontSize="12" fontWeight="900" fill={INDIGO} fontFamily={FONT}>age 12 → age 0</text>
        <g transform="translate(300 24)"><circle cx="16" cy="13" r="8" fill={AMBER} /><path d="M 3 39 Q 16 17 29 39 Z" fill="#fef3c7" stroke={AMBER} /><text x="16" y="52" textAnchor="middle" fontSize="9" fontWeight="900" fill={AMBER}>age {age}</text></g>
        <g transform="translate(12 52)"><circle cx="16" cy="13" r="7" fill={GREEN} /><path d="M 5 36 Q 16 18 27 36 Z" fill="#dcfce7" stroke={GREEN} /><text x="16" y="49" textAnchor="middle" fontSize="9" fontWeight="900" fill={GREEN}>born</text></g>
        <rect x="71" y="162" width="218" height="45" rx="12" fill="#dcfce7" stroke={consistent ? GREEN : RED} strokeWidth="2" />
        <text x="180" y="191" textAnchor="middle" fontSize="20" fontWeight="900" fill={consistent ? GREEN : RED} fontFamily={FONT}>{contestYear} − {age} = {birthYear}</text>
        <text x="180" y="228" textAnchor="middle" fontSize="11" fontWeight="800" fill="#64748b">check: {birthYear} + {age} = {contestYear}</text>
        <defs><marker id="backArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6z" fill={INDIGO} /></marker></defs>
      </motion.g>}
    </svg>
    <motion.span key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: final ? "#166534" : INDIGO, textAlign: "center" }}>
      {final ? `born ${age} years before ${contestYear}: ${birthYear}` : `the ${ordinal}th AMC 8 was in ${contestYear}`}
    </motion.span>
    <AnimatePresence>{final && consistent && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.65 }} style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 800, fontSize: 15 }}>Answer {problem.answer}</motion.div>}</AnimatePresence>
    {final && !consistent && <span style={{ color: RED, fontSize: 11, fontWeight: 800 }}>contest year, birth year, or stored answer check failed</span>}
  </div>;
}
