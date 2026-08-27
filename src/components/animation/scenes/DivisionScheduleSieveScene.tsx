import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0f766e";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

function Team({ x, y, color, selected = false, label }: { x: number; y: number; color: string; selected?: boolean; label: string }) {
  return <g>
    <circle cx={x} cy={y - 7} r="7" fill={selected ? "#fbbf24" : color} />
    <path d={`M${x - 11} ${y + 15} Q${x} ${y - 1} ${x + 11} ${y + 15} Z`} fill={selected ? "#fef3c7" : `${color}22`} stroke={selected ? "#d97706" : color} strokeWidth={selected ? 2.4 : 1.6} />
    <text x={x} y={y + 31} textAnchor="middle" fontSize="9.5" fontWeight="900" fill={selected ? "#92400e" : color}>{label}</text>
  </g>;
}

export function DivisionScheduleSieveScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const sizes = (data.divisionSizes as unknown[]).map((v) => Math.round(num(v, 0)));
  const total = Math.round(num(data.totalGames, 0));
  const sameOpp = sizes[0] - 1;
  const crossOpp = sizes[1];
  const ratio = 2;
  const lower = 4;
  const upper = total / (crossOpp + sameOpp * ratio);
  const candidates = Array.from({ length: Math.max(0, Math.ceil(upper) - Math.floor(lower) - 1) }, (_, i) => Math.floor(lower) + 1 + i);
  const rows = candidates.map((M) => {
    const remaining = total - crossOpp * M;
    const N = remaining / sameOpp;
    return { M, remaining, N, whole: Number.isInteger(N), inequality: N > ratio * M };
  });
  const valid = rows.filter((row) => row.whole && row.inequality);
  const winner = valid[0];
  const within = winner ? sameOpp * winner.N : NaN;
  const outside = winner ? crossOpp * winner.M : NaN;
  const stored = Number(problem.shortAnswer);
  const ok = valid.length === 1 && within === stored && within + outside === total && problem.answer === "B";
  const last = totalSteps - 1;
  const phase = step >= last ? 3 : Math.min(step, 2);

  const left = [{ x: 88, y: 76 }, { x: 142, y: 76 }, { x: 88, y: 135 }, { x: 142, y: 135 }];
  const right = [{ x: 328, y: 76 }, { x: 382, y: 76 }, { x: 328, y: 135 }, { x: 382, y: 135 }];
  const chosen = left[0];

  return <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: "5px 2px" }}>
    <svg viewBox="0 0 470 300" width="100%" style={{ maxWidth: 500 }} aria-label="Baseball schedule split between division and cross-division opponents">
      {phase === 0 && <>
        <text x="235" y="20" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>follow one team through its seven opponents</text>
        <rect x="47" y="39" width="137" height="137" rx="16" fill="#eef2ff" stroke="#c7d2fe" />
        <rect x="286" y="39" width="137" height="137" rx="16" fill="#ecfeff" stroke="#99f6e4" />
        <text x="115" y="57" textAnchor="middle" fontSize="10" fontWeight="900" fill={IND}>DIVISION 1</text>
        <text x="355" y="57" textAnchor="middle" fontSize="10" fontWeight="900" fill={TEAL}>DIVISION 2</text>
        {[...left, ...right].map((p, i) => <Team key={i} x={p.x} y={p.y} color={i < 4 ? IND : TEAL} selected={i === 0} label={i === 0 ? "YOU" : `T${i + 1}`} />)}
        {left.slice(1).map((p, i) => <motion.line key={`s${i}`} x1={chosen.x + 10} y1={chosen.y} x2={p.x - 8} y2={p.y} stroke={IND} strokeWidth="2.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .2 + i * .12 }} />)}
        {right.map((p, i) => <motion.path key={`c${i}`} d={`M${chosen.x + 10} ${chosen.y} C215 ${58 + i * 9} 250 ${58 + i * 9} ${p.x - 9} ${p.y}`} fill="none" stroke={TEAL} strokeWidth="1.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .55 + i * .1 }} />)}
        <g transform="translate(39 202)">
          <rect width="392" height="64" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="98" y="24" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{sameOpp} opponents × N</text>
          <text x="196" y="25" textAnchor="middle" fontSize="16" fontWeight="900" fill={DIM}>+</text>
          <text x="294" y="24" textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT}>{crossOpp} opponents × M</text>
          <text x="196" y="50" textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily={FONT}>{sameOpp}N + {crossOpp}M = {total}</text>
        </g>
      </>}

      {phase === 1 && <>
        <text x="235" y="20" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>the inequality squeezes M into a short interval</text>
        <g transform="translate(54 42)">
          <rect width="362" height="91" rx="14" fill="#eef2ff" stroke="#c7d2fe" />
          <text x="181" y="25" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{sameOpp}N + {crossOpp}M = {total}, and N &gt; {ratio}M</text>
          <text x="181" y="51" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>{total} &gt; {sameOpp * ratio}M + {crossOpp}M = {(sameOpp * ratio) + crossOpp}M</text>
          <text x="181" y="76" textAnchor="middle" fontSize="16" fontWeight="900" fill={TEAL} fontFamily={FONT}>M &lt; {upper}</text>
        </g>
        <line x1="67" y1="190" x2="403" y2="190" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
        <motion.line x1="106" y1="190" x2="337" y2="190" stroke={IND} strokeWidth="7" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        {[4, 5, 6, 7, 7.6, 8].map((v, i) => {
          const x = 67 + ((v - 3.5) / 5) * 336;
          const candidate = Number.isInteger(v) && candidates.includes(v);
          return <g key={v}>
            <line x1={x} y1="181" x2={x} y2="199" stroke={candidate ? IND : DIM} strokeWidth="2" />
            <text x={x} y="219" textAnchor="middle" fontSize="11" fontWeight="900" fill={candidate ? IND : DIM} fontFamily={FONT}>{v}</text>
            {candidate && <motion.circle cx={x} cy="190" r="13" fill="#ede9fe" stroke={IND} strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: .3 + i * .1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />}
          </g>;
        })}
        <text x="235" y="253" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{lower} &lt; M &lt; {upper} → M ∈ {`{${candidates.join(", ")}}`}</text>
      </>}

      {phase === 2 && <>
        <text x="235" y="20" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>each candidate must produce a whole-number N and pass N &gt; 2M</text>
        <g transform="translate(35 43)">
          <rect width="400" height="35" rx="9" fill="#f1f5f9" />
          {["M", `${total}−${crossOpp}M`, "N = remainder÷3", "verdict"].map((h, i) => <text key={h} x={[38, 125, 245, 355][i]} y="23" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={DIM}>{h}</text>)}
          {rows.map((row, i) => {
            const y = 48 + i * 57;
            const pass = row.whole && row.inequality;
            return <g key={row.M}>
              <rect x="0" y={y} width="400" height="45" rx="10" fill={pass ? "#dcfce7" : "#fff1f2"} stroke={pass ? "#86efac" : "#fecdd3"} />
              <text x="38" y={y + 28} textAnchor="middle" fontSize="15" fontWeight="900" fill={pass ? GREEN : RED} fontFamily={FONT}>{row.M}</text>
              <text x="125" y={y + 28} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{row.remaining}</text>
              <text x="245" y={y + 28} textAnchor="middle" fontSize="13" fontWeight="900" fill={pass ? GREEN : RED} fontFamily={FONT}>{row.whole ? row.N : `${row.remaining}/3`}</text>
              <text x="355" y={y + 19} textAnchor="middle" fontSize="10.5" fontWeight="900" fill={pass ? GREEN : RED}>{!row.whole ? "not whole ✕" : row.inequality ? `${row.N} > ${ratio * row.M} ✓` : "inequality ✕"}</text>
              {pass && <text x="355" y={y + 34} textAnchor="middle" fontSize="9" fontWeight="850" fill="#166534">unique survivor</text>}
            </g>;
          })}
        </g>
      </>}

      {phase === 3 && winner && <>
        <text x="235" y="20" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>rebuild the complete {total}-game schedule</text>
        <g transform="translate(34 44)">
          <text x="0" y="14" fontSize="10.5" fontWeight="900" fill={IND}>SAME DIVISION</text>
          {Array.from({ length: sameOpp }, (_, i) => <g key={i} transform={`translate(0 ${26 + i * 40})`}>
            <rect width="252" height="29" rx="7" fill="#eef2ff" stroke="#c7d2fe" />
            <motion.rect width="252" height="29" rx="7" fill="#c7d2fe" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * .12 }} style={{ transformBox: "fill-box", transformOrigin: "left" }} />
            <text x="12" y="19" fontSize="10.5" fontWeight="900" fill={IND}>opponent {i + 1}</text>
            <text x="232" y="20" textAnchor="end" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{winner.N}</text>
          </g>)}
          <text x="126" y="163" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{sameOpp} × {winner.N} = {within}</text>
          <text x="282" y="14" fontSize="10.5" fontWeight="900" fill={TEAL}>OTHER DIVISION</text>
          {Array.from({ length: crossOpp }, (_, i) => <g key={i} transform={`translate(282 ${26 + i * 31})`}>
            <rect width="120" height="23" rx="6" fill="#ccfbf1" stroke="#99f6e4" />
            <text x="9" y="16" fontSize="9" fontWeight="850" fill={TEAL}>opp {i + 1}</text>
            <text x="108" y="17" textAnchor="end" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>{winner.M}</text>
          </g>)}
          <text x="342" y="163" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT}>{crossOpp} × {winner.M} = {outside}</text>
        </g>
        <rect x="92" y="226" width="286" height="55" rx="14" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" />
        <text x="235" y="247" textAnchor="middle" fontSize="12" fontWeight="900" fill={ok ? "#166534" : RED} fontFamily={FONT}>{within} + {outside} = {total} ✓</text>
        <text x="235" y="269" textAnchor="middle" fontSize="15" fontWeight="900" fill={ok ? GREEN : RED}>{ok ? `${within} division games → Answer ${problem.answer}` : "schedule or stored-answer check failed"}</text>
      </>}
    </svg>
  </div>;
}
