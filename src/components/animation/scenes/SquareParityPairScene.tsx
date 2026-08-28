import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Prove an even sum of two squares forces equal input parity. Data: { residues:[0,1], targetParity:"even" }. */
export function SquareParityPairScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const residues = (Array.isArray(data.residues) ? data.residues : []).map(Number);
  const target = String(data.targetParity);
  const cases = residues.flatMap((n) => residues.map((m) => ({ n, m, squareSum: (n * n + m * m) % 2, ordinarySum: (n + m) % 2 })));
  const survivors = cases.filter((c) => c.squareSum === 0);
  const impossibleOdd = survivors.every((c) => c.ordinarySum === 0);
  const choice = problem.choices?.find((c) => c.text === "n+m is odd")?.label;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const ok = target === "even" && survivors.length === 2 && impossibleOdd && problem.shortAnswer === "n+m is odd" && choice === problem.answer;
  const failure = survivors.length !== 2 ? `${survivors.length} same-parity cases survived; expected 2` : !impossibleOdd ? "a surviving case made n+m odd" : `choice ${choice ?? "missing"}; stored ${problem.answer}`;
  const parity = (r: number) => r === 0 ? "EVEN" : "ODD";
  const color = (r: number) => r === 0 ? TEAL : INDIGO;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 430 300" width="100%" style={{ maxWidth: 465, minWidth: 0, display: "block" }}>
      <text x="215" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
        {phase === 0 ? "squaring preserves parity" : phase === 1 ? "test every parity pair for n² + m²" : "the surviving pairs always make n + m even"}
      </text>

      {phase === 0 && <>
        {residues.map((r, i) => {
          const y = 48 + i * 103, c = color(r), squared = (r * r) % 2;
          return <motion.g key={r} initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.18 }}>
            <rect x="28" y={y} width="92" height="62" rx="12" fill={r ? "#eef2ff" : "#ecfeff"} stroke={c} strokeWidth="2" />
            <text x="74" y={y + 22} textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>input n</text>
            <text x="74" y={y + 47} textAnchor="middle" fontSize="17" fontWeight="900" fill={c} fontFamily={FONT}>{parity(r)}</text>
            <motion.path d={`M 126 ${y + 31} H 174`} fill="none" stroke={c} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .25 + i * .18 }} />
            <rect x="177" y={y + 4} width="70" height="54" rx="12" fill="#f8fafc" stroke={INK} strokeWidth="2" />
            <text x="212" y={y + 25} textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>SQUARE</text>
            <text x="212" y={y + 45} textAnchor="middle" fontSize="18" fontWeight="900" fill={INK} fontFamily={FONT}>n²</text>
            <motion.path d={`M 251 ${y + 31} H 299`} fill="none" stroke={c} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .5 + i * .18 }} />
            <rect x="303" y={y} width="99" height="62" rx="12" fill={squared ? "#eef2ff" : "#ecfeff"} stroke={color(squared)} strokeWidth="2" />
            <text x="352" y={y + 22} textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>output n²</text>
            <text x="352" y={y + 47} textAnchor="middle" fontSize="17" fontWeight="900" fill={color(squared)} fontFamily={FONT}>{parity(squared)}</text>
          </motion.g>;
        })}
        <rect x="91" y="258" width="248" height="34" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
        <text x="215" y="280" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>0² ≡ 0,   1² ≡ 1  (mod 2)</text>
      </>}

      {phase === 1 && <>
        <text x="214" y="43" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>columns: m parity</text>
        {residues.map((r, i) => <text key={`c${r}`} x={194 + i * 124} y="65" textAnchor="middle" fontSize="11" fontWeight="900" fill={color(r)}>{parity(r)}</text>)}
        <text x="68" y="138" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM} transform="rotate(-90 68 138)">rows: n parity</text>
        {cases.map((c, index) => {
          const row = Math.floor(index / 2), col = index % 2, x = 132 + col * 124, y = 77 + row * 93, survives = c.squareSum === 0;
          return <motion.g key={`${c.n}${c.m}`} initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * .13 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={x} y={y} width="110" height="78" rx="11" fill={survives ? "#dcfce7" : "#fee2e2"} stroke={survives ? GREEN : RED} strokeWidth={survives ? 2.5 : 1.7} />
            <text x={x + 55} y={y + 20} textAnchor="middle" fontSize="10" fontWeight="900" fill={INK} fontFamily={FONT}>{c.n}² + {c.m}²</text>
            <text x={x + 55} y={y + 47} textAnchor="middle" fontSize="19" fontWeight="900" fill={survives ? GREEN : RED} fontFamily={FONT}>≡ {c.squareSum}</text>
            <text x={x + 55} y={y + 67} textAnchor="middle" fontSize="9" fontWeight="900" fill={survives ? GREEN : RED}>{survives ? "EVEN ✓" : "ODD ✕"}</text>
          </motion.g>;
        })}
        {residues.map((r, i) => <text key={`r${r}`} x="111" y={123 + i * 93} textAnchor="middle" fontSize="11" fontWeight="900" fill={color(r)}>{parity(r)}</text>)}
        <rect x="113" y="267" width="234" height="28" rx="9" fill="#dcfce7" stroke={GREEN} />
        <text x="230" y="286" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN} fontFamily={FONT}>survivors: even/even, odd/odd</text>
      </>}

      {phase === 2 && <>
        {survivors.map((c, i) => {
          const y = 48 + i * 92, c1 = color(c.n);
          return <motion.g key={`${c.n}${c.m}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .16 }}>
            <rect x="34" y={y} width="362" height="70" rx="13" fill={c.n ? "#eef2ff" : "#ecfeff"} stroke={c1} strokeWidth="2" />
            <circle cx="82" cy={y + 35} r="23" fill="#fff" stroke={c1} strokeWidth="2" /><text x="82" y={y + 39} textAnchor="middle" fontSize="9.5" fontWeight="900" fill={c1}>n {parity(c.n).toLowerCase()}</text>
            <text x="126" y={y + 41} textAnchor="middle" fontSize="20" fontWeight="900" fill={INK}>+</text>
            <circle cx="171" cy={y + 35} r="23" fill="#fff" stroke={c1} strokeWidth="2" /><text x="171" y={y + 39} textAnchor="middle" fontSize="9.5" fontWeight="900" fill={c1}>m {parity(c.m).toLowerCase()}</text>
            <text x="216" y={y + 41} textAnchor="middle" fontSize="20" fontWeight="900" fill={INK}>=</text>
            <motion.rect x="244" y={y + 12} width="126" height="46" rx="10" fill="#dcfce7" stroke={GREEN} initial={{ scale: .6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <text x="307" y={y + 40} textAnchor="middle" fontSize="16" fontWeight="900" fill={GREEN} fontFamily={FONT}>n+m EVEN</text>
          </motion.g>;
        })}
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .42 }}>
          <rect x="91" y="244" width="248" height="47" rx="12" fill={ok ? "#fee2e2" : "#fff"} stroke={ok ? RED : DIM} strokeWidth="2.5" />
          <text x="215" y="264" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>therefore this is impossible</text>
          <text x="215" y="284" textAnchor="middle" fontSize="17" fontWeight="900" fill={ok ? RED : INK} fontFamily={FONT}>n + m is ODD</text>
          <line x1="145" y1="276" x2="285" y2="276" stroke={RED} strokeWidth="2.5" />
        </motion.g>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={380} y={263} width={76} />
      </>}
      <AnimatePresence>{final && !ok && <motion.text x="215" y="298" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
