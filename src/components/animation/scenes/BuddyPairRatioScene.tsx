import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const SIXTH = "#4338ca";
const NINTH = "#0d9488";
const BUDDY = "#f59e0b";
const WIN = "#16a34a";
const DIM = "#94a3b8";
const BAD = "#dc2626";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const lcm = (a: number, b: number) => Math.abs(a * b) / (gcd(a, b) || 1);

function Student({ x, y, fill, older = false }: { x: number; y: number; fill: string; older?: boolean }) {
  const r = older ? 7 : 6;
  return (
    <g>
      <circle cx={x} cy={y - 8} r={r} fill={fill} />
      <path d={`M ${x - r - 3},${y + 12} Q ${x},${y - 1} ${x + r + 3},${y + 12} Z`} fill={fill} />
    </g>
  );
}

/**
 * Two grade populations contribute equal-sized selected subsets to one-to-one
 * buddy pairs. Fraction bars first show the unequal partitions; choosing the
 * smallest common selected count turns them into literal groups of students,
 * then pairing arcs zip the selected students together. Only the final beat
 * combines selected students over all students. Data:
 * { fractions:["Sixth graders|2|5", "Ninth graders|1|3"] }.
 */
export function BuddyPairRatioScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const raw = (Array.isArray(data.fractions) ? data.fractions : []).map((v) => String(v).split("|"));
  const groups = raw.map(([label, n, d]) => ({ label, numer: Math.round(num(n, 0)), den: Math.round(num(d, 1)) }));
  const A = groups[0] ?? { label: "Sixth graders", numer: 2, den: 5 };
  const B = groups[1] ?? { label: "Ninth graders", numer: 1, den: 3 };

  const pairedEach = lcm(A.numer, B.numer);
  const aTotal = (pairedEach * A.den) / A.numer;
  const bTotal = (pairedEach * B.den) / B.numer;
  const pairedStudents = pairedEach * 2;
  const totalStudents = aTotal + bTotal;
  const reduceBy = gcd(pairedStudents, totalStudents);
  const result = `${pairedStudents / reduceBy}/${totalStudents / reduceBy}`;
  const whole = [pairedEach, aTotal, bTotal, pairedStudents, totalStudents].every((v) => Number.isInteger(v) && v > 0);
  const fractionsOk = whole && (pairedEach * A.den === aTotal * A.numer) && (pairedEach * B.den === bTotal * B.numer);
  const answerOk = problem.shortAnswer == null || String(problem.shortAnswer).replace(/\s/g, "") === result;
  const failure = !fractionsOk ? "the selected counts do not reproduce both source fractions" : !answerOk ? `scene gets ${result}, problem says ${problem.shortAnswer}` : null;

  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);
  const W = 430;
  const H = 278;
  const rowY = [104, 196];
  const colors = [SIXTH, NINTH];
  const totals = [aTotal, bTotal];

  const people = (gi: number, showPairs: boolean) => {
    const count = totals[gi];
    const start = 91;
    const gap = 48;
    return Array.from({ length: count }).map((_, i) => {
      const selected = i < pairedEach;
      const x = start + i * gap + (6 - count) * 24;
      return (
        <motion.g key={`${gi}-${i}`} initial={{ opacity: 0, scale: 0.35, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.15 + i * 0.08 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <Student x={x} y={rowY[gi]} fill={selected && showPairs ? BUDDY : selected ? colors[gi] : "#cbd5e1"} older={gi === 1} />
          <text x={x} y={rowY[gi] + 29} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={selected ? colors[gi] : DIM}>{selected ? "paired" : "—"}</text>
        </motion.g>
      );
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", maxWidth: "100%", minWidth: 0, padding: "8px 4px", boxSizing: "border-box" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", maxWidth: 450 }}>
        {phase === 0 && (
          <g>
            <text x={W / 2} y={25} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>the buddy subsets must be the same size</text>
            {[A, B].map((g, gi) => {
              const x = 55;
              const y = 68 + gi * 94;
              const bw = 320;
              const sw = bw / g.den;
              return <g key={g.label}>
                <text x={x} y={y - 13} fontSize="11" fontWeight="800" fill={colors[gi]}>{g.label}</text>
                {Array.from({ length: g.den }).map((_, i) => <motion.rect key={i} x={x + i * sw} y={y} width={sw - 2} height={42} rx={5} fill={i < g.numer ? colors[gi] : "#f1f5f9"} fillOpacity={i < g.numer ? 0.75 : 1} stroke={colors[gi]} strokeWidth={1.3} initial={{ opacity: 0, scaleY: 0.3 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.15 + i * 0.08 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }} />)}
                <text x={W / 2} y={y + 28} textAnchor="middle" fontSize="15" fontWeight="900" fill={iColor(gi)} fontFamily={FONT}>{g.numer}/{g.den} selected</text>
              </g>;
            })}
            <text x={W / 2} y={266} textAnchor="middle" fontSize="12" fontWeight="800" fill={BUDDY} fontFamily={FONT}>{A.numer}/{A.den} of sixth = {B.numer}/{B.den} of ninth</text>
          </g>
        )}

        {phase === 1 && (
          <g>
            <text x={W / 2} y={23} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>use the smallest equal selected count</text>
            <text x={18} y={rowY[0] + 3} fontSize="10.5" fontWeight="800" fill={SIXTH}>6th</text>
            <text x={18} y={rowY[1] + 3} fontSize="10.5" fontWeight="800" fill={NINTH}>9th</text>
            {people(0, false)}{people(1, false)}
            <motion.text x={W / 2} y={52} textAnchor="middle" fontSize="13" fontWeight="900" fill={BUDDY} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>selected count = {pairedEach} on each side</motion.text>
            <text x={W - 16} y={rowY[0] + 4} textAnchor="end" fontSize="11" fontWeight="900" fill={SIXTH} fontFamily={FONT}>{A.numer}/{A.den} of {aTotal} = {pairedEach}</text>
            <text x={W - 16} y={rowY[1] + 4} textAnchor="end" fontSize="11" fontWeight="900" fill={NINTH} fontFamily={FONT}>{B.numer}/{B.den} of {bTotal} = {pairedEach}</text>
            <text x={W / 2} y={260} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>sixth : ninth = {aTotal} : {bTotal}</text>
          </g>
        )}

        {phase === 2 && (
          <g>
            <text x={W / 2} y={23} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>zip the selected students into one-to-one buddy pairs</text>
            {Array.from({ length: pairedEach }).map((_, i) => {
              const ax = 91 + i * 48 + (6 - aTotal) * 24;
              const bx = 91 + i * 48 + (6 - bTotal) * 24;
              return <motion.path key={i} d={`M ${ax},${rowY[0] + 14} C ${ax},145 ${bx},155 ${bx},${rowY[1] - 16}`} fill="none" stroke={BUDDY} strokeWidth={3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.45 + i * 0.22 }} />;
            })}
            {people(0, true)}{people(1, true)}
            <text x={18} y={rowY[0] + 3} fontSize="10.5" fontWeight="800" fill={SIXTH}>6th</text>
            <text x={18} y={rowY[1] + 3} fontSize="10.5" fontWeight="800" fill={NINTH}>9th</text>
            <text x={W - 18} y={85} textAnchor="end" fontSize="11" fontWeight="900" fill={BUDDY} fontFamily={FONT}>{pairedEach} + {pairedEach} selected</text>
            <text x={W - 18} y={239} textAnchor="end" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>{aTotal} + {bTotal} students total</text>
            <text x={W / 2} y={266} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM}>each line uses one student from each grade</text>
          </g>
        )}

        {phase === 3 && (
          <g>
            <text x={W / 2} y={25} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>combine the two paired groups over both grades</text>
            {Array.from({ length: totalStudents }).map((_, i) => {
              const selected = i < pairedEach || (i >= aTotal && i < aTotal + pairedEach);
              const x = 50 + i * 33;
              return <motion.g key={i} initial={{ opacity: 0, y: -10, scale: 0.4 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 270, damping: 17, delay: i * 0.055 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><Student x={x} y={91} fill={selected ? BUDDY : "#cbd5e1"} older={i >= aTotal} /></motion.g>;
            })}
            <motion.text x={W / 2} y={148} textAnchor="middle" fontSize="22" fontWeight="900" fill={WIN} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.75 }}>
              ({pairedEach} + {pairedEach}) / ({aTotal} + {bTotal}) = {result}
            </motion.text>
            <text x={W / 2} y={181} textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM} fontFamily={FONT}>check: {pairedEach}/{aTotal} = {A.numer}/{A.den} and {pairedEach}/{bTotal} = {B.numer}/{B.den}</text>
            <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 14, delay: 1.05 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={W / 2 - 55} y={214} width={110} height={32} rx={16} fill={WIN} />
              <text x={W / 2} y={235} textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff">Answer {problem.answer}</text>
            </motion.g>
          </g>
        )}
      </svg>
      <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: failure ? BAD : final ? "#166534" : SIXTH, background: failure ? "#fee2e2" : final ? "#dcfce7" : "#eef2ff", border: `1px solid ${failure ? "#fecaca" : final ? "#bbf7d0" : "#c7d2fe"}`, borderRadius: 999, padding: "4px 12px", textAlign: "center", maxWidth: "calc(100% - 16px)", boxSizing: "border-box" }}>
        {failure ?? (phase === 0 ? "equal buddy subsets, but differently partitioned grades" : phase === 1 ? `${aTotal} sixth graders and ${bTotal} ninth graders make the smallest whole model` : phase === 2 ? `${pairedEach} buddy pairs connect ${pairedStudents} students` : `${pairedStudents} of ${totalStudents} students have a buddy`)}
      </span>
    </div>
  );
}

function iColor(i: number) { return i === 0 ? SIXTH : NINTH; }
