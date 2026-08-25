import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const AMBER = "#f59e0b";
const GREEN = "#16a34a";
const RED = "#dc2626";

type Sector = { name: string; percent: number; color: string };

function polar(cx: number, cy: number, r: number, degrees: number) {
  const a = ((degrees - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function wedge(cx: number, cy: number, r: number, start: number, end: number) {
  const a = polar(cx, cy, r, start);
  const b = polar(cx, cy, r, end);
  return `M ${cx} ${cy} L ${a.x} ${a.y} A ${r} ${r} 0 ${end - start > 180 ? 1 : 0} 1 ${b.x} ${b.y} Z`;
}

/** Election pie -> equal 10% ballot boxes. Data: candidates, percents,
 * highlightedCandidate, votes. The total is derived, never trusted. */
export function VotePieScaleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const names = Array.isArray(data.candidates) ? data.candidates.map(String) : [];
  const percents = Array.isArray(data.percents) ? data.percents.map((v) => num(v, 0)) : [];
  const highlighted = String(data.highlightedCandidate ?? "");
  const votes = num(data.votes, 0);
  const sectors: Sector[] = names.map((name, i) => ({ name, percent: percents[i], color: ["#c7d2fe", "#fde68a", "#bae6fd"][i] ?? "#e2e8f0" }));
  const focus = sectors.find((s) => s.name === highlighted);
  if (!focus) return null;

  const unitPercent = 10;
  const focusUnits = focus.percent / unitPercent;
  const votesPerUnit = votes / focusUnits;
  const allUnits = 100 / unitPercent;
  const total = votesPerUnit * allUnits;
  const stated = Number(String(problem.shortAnswer ?? "").replace(/,/g, ""));
  const percentSum = percents.reduce((a, b) => a + b, 0);
  const consistent = percentSum === 100 && Number.isInteger(focusUnits) && Number.isInteger(votesPerUnit) && (!problem.shortAnswer || stated === total);

  const last = totalSteps - 1;
  const final = step >= last;
  const split = step >= 1 || final;
  const boxCount = final ? allUnits : split ? focusUnits : 0;
  const cx = 100, cy = 102, r = 76;
  let angle = 0;

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "7px 4px" }}>
    <svg viewBox="0 0 390 224" width="100%" style={{ maxWidth: 440 }}>
      <circle cx={cx} cy={cy} r={r + 4} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      {sectors.map((s) => {
        const start = angle;
        const end = angle += s.percent * 3.6;
        const mid = (start + end) / 2;
        const p = polar(cx, cy, r * 0.57, mid);
        const isFocus = s.name === highlighted;
        return <motion.g key={s.name} animate={{ scale: isFocus && step === 0 ? [1, 1.045, 1] : 1 }} transition={{ duration: 0.9, repeat: isFocus && step === 0 ? Infinity : 0 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <path d={wedge(cx, cy, r, start, end)} fill={isFocus ? "#fbbf24" : s.color} stroke="#fff" strokeWidth="2" />
          <text x={p.x} y={p.y - 3} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK}>{s.name}</text>
          <text x={p.x} y={p.y + 11} textAnchor="middle" fontSize="11" fontWeight="900" fill={isFocus ? "#92400e" : INDIGO} fontFamily={mono}>{s.percent}%</text>
        </motion.g>;
      })}

      <AnimatePresence>
        {step === 0 && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <path d="M 158 150 Q 190 162 215 145" fill="none" stroke={AMBER} strokeWidth="2" markerEnd="url(#voteArrow)" />
          <rect x="218" y="127" width="150" height="38" rx="11" fill="#fffbeb" stroke={AMBER} />
          <text x="293" y="143" textAnchor="middle" fontSize="10" fontWeight="800" fill="#92400e">Brenda's slice</text>
          <text x="293" y="158" textAnchor="middle" fontSize="13" fontWeight="900" fill="#92400e" fontFamily={mono}>30% = 36 votes</text>
        </motion.g>}
      </AnimatePresence>

      {Array.from({ length: allUnits }).map((_, i) => {
        const col = i % 5, row = Math.floor(i / 5);
        const x = 218 + col * 31, y = 45 + row * 48;
        const shown = i < boxCount;
        return <AnimatePresence key={i}>{shown && <motion.g initial={{ opacity: 0, y: i < focusUnits ? 18 : -15, scale: 0.6 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 180, damping: 16, delay: i * 0.07 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x={x} y={y} width="27" height="34" rx="5" fill={i < focusUnits ? "#fef3c7" : "#eef2ff"} stroke={i < focusUnits ? AMBER : INDIGO} strokeWidth="1.3" />
          <path d={`M ${x + 7} ${y + 7} h 13 M ${x + 7} ${y + 11} h 13`} stroke={i < focusUnits ? "#b45309" : INDIGO} strokeWidth="1.3" />
          <text x={x + 13.5} y={y + 26} textAnchor="middle" fontSize="9" fontWeight="900" fill={INK} fontFamily={mono}>{votesPerUnit}</text>
          <text x={x + 13.5} y={y + 45} textAnchor="middle" fontSize="8" fontWeight="800" fill="#64748b" fontFamily={mono}>10%</text>
        </motion.g>}</AnimatePresence>;
      })}

      <AnimatePresence>{split && !final && <motion.text x="294" y="162" textAnchor="middle" fontSize="13" fontWeight="900" fill={INDIGO} fontFamily={mono} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        36 ÷ 3 = {votesPerUnit}
      </motion.text>}</AnimatePresence>
      <AnimatePresence>{final && consistent && <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 15, delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <rect x="224" y="155" width="140" height="32" rx="16" fill="#dcfce7" stroke={GREEN} />
        <text x="294" y="176" textAnchor="middle" fontSize="15" fontWeight="900" fill={GREEN} fontFamily={mono}>10 × {votesPerUnit} = {total}</text>
      </motion.g>}</AnimatePresence>
      <defs><marker id="voteArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6z" fill={AMBER} /></marker></defs>
    </svg>

    <motion.span key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: mono, fontSize: 12, fontWeight: 800, color: final ? "#166534" : INDIGO, textAlign: "center" }}>
      {step === 0 ? `${highlighted}'s ${focus.percent}% sector represents ${votes} votes` : final ? `${allUnits} equal 10% boxes complete the whole election` : `${focus.percent}% is ${focusUnits} groups of 10%, so each group has ${votesPerUnit} votes`}
    </motion.span>
    {!consistent && <span style={{ color: RED, fontFamily: mono, fontSize: 11, fontWeight: 800 }}>chart percentages, unit split, or stored answer failed its check</span>}
    <AnimatePresence>{final && consistent && problem.answer && <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.1 }} style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 700, fontSize: 15 }}>Answer {problem.answer}</motion.div>}</AnimatePresence>
  </div>;
}
