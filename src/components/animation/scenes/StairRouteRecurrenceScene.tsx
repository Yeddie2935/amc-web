import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", TEAL = "#0d9488", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Count stair routes by merging route piles according to the final jump. Data: { stairs, jumpSizes }. */
export function StairRouteRecurrenceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const stairs = Math.round(num(data.stairs, 0));
  const jumps = (Array.isArray(data.jumpSizes) ? data.jumpSizes : []).map((v) => Math.round(num(v, 0))).sort((a, b) => a-b);
  const ways = Array(stairs + 1).fill(0) as number[];
  ways[0] = 1;
  for (let n = 1; n <= stairs; n++) ways[n] = jumps.reduce((sum, j) => sum + (n-j >= 0 ? ways[n-j] : 0), 0);
  const routes = (n: number) => {
    const out: string[] = [];
    const walk = (left: number, path: number[]) => {
      if (left === 0) { out.push(path.join("+")); return; }
      jumps.forEach((j) => { if (j <= left) walk(left-j, [...path, j]); });
    };
    walk(n, []); return out;
  };
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const result = ways[stairs];
  const choice = problem.choices?.find((c) => Number(c.text) === result)?.label;
  const ok = result === Number(problem.shortAnswer) && choice === problem.answer;
  const fail = `computed f(${stairs})=${result}; stored ${problem.shortAnswer ?? "missing"}`;
  const W = 460;
  const stairX = (n: number) => 31 + n * 61;
  const stairY = (n: number) => 205 - n * 24;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 320" width="100%" style={{ maxWidth: 490, display: "block" }}>
      <text x="230" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
        {phase === 0 ? "sort routes by Jo’s final jump onto a stair" : phase === 1 ? "count the tiny staircases directly" : "sweep the three-pile rule up to stair six"}
      </text>

      {phase === 0 && <>
        {Array.from({ length: stairs + 1 }, (_, n) => <g key={n}>
          <rect x={stairX(n)-26} y={stairY(n)} width="52" height={205-stairY(n)+24} fill={n===stairs ? "#eef2ff" : "#f8fafc"} stroke={n===stairs ? INDIGO : "#cbd5e1"} strokeWidth={n===stairs ? 2.5 : 1.3} />
          <text x={stairX(n)} y={stairY(n)+17} textAnchor="middle" fontSize="11" fontWeight="900" fill={n===stairs ? INDIGO : DIM} fontFamily={FONT}>{n}</text>
        </g>)}
        {jumps.map((j, i) => {
          const from = stairs-j, x1=stairX(from), y1=stairY(from)-4, x2=stairX(stairs), y2=stairY(stairs)-4;
          return <motion.g key={j} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i*.3 }}>
            <motion.path d={`M ${x1} ${y1} Q ${(x1+x2)/2} ${Math.min(y1,y2)-28-i*8} ${x2} ${y2}`} fill="none" stroke={[TEAL,GOLD,INDIGO][i]} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i*.3 }} />
            <circle cx={x1} cy={y1} r="6" fill={[TEAL,GOLD,INDIGO][i]} /><text x={x1} y={y1-11} textAnchor="middle" fontSize="11" fontWeight="950" fill={[TEAL,GOLD,INDIGO][i]} fontFamily={FONT}>+{j}</text>
          </motion.g>;
        })}
        <rect x="68" y="252" width="324" height="47" rx="12" fill="#eef2ff" stroke={INDIGO} strokeWidth="2" />
        <text x="230" y="281" textAnchor="middle" fontSize="18" fontWeight="950" fill={INDIGO} fontFamily={FONT}>f(n) = f(n−1) + f(n−2) + f(n−3)</text>
      </>}

      {phase === 1 && <>
        {[1,2,3].map((n, col) => {
          const rs = routes(n), x = 30 + col*145;
          return <motion.g key={n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: col*.18 }}>
            <rect x={x} y="48" width="112" height="190" rx="14" fill={col===2 ? "#eef2ff" : "#f8fafc"} stroke={col===2 ? INDIGO : "#cbd5e1"} strokeWidth="2" />
            <text x={x+56} y="73" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK}>reach stair {n}</text>
            {rs.map((r, i) => <motion.g key={r} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .25+col*.18+i*.1 }}>
              <rect x={x+13} y={88+i*27} width="86" height="21" rx="7" fill="#fff" stroke={TEAL} />
              <text x={x+56} y={103+i*27} textAnchor="middle" fontSize="11" fontWeight="900" fill={TEAL} fontFamily={FONT}>{r}</text>
            </motion.g>)}
            <text x={x+56} y="222" textAnchor="middle" fontSize="19" fontWeight="950" fill={col===2 ? INDIGO : TEAL} fontFamily={FONT}>f({n}) = {rs.length}</text>
          </motion.g>;
        })}
        <text x="230" y="272" textAnchor="middle" fontSize="12" fontWeight="850" fill={DIM}>order matters: 1+2 and 2+1 are different climbs</text>
      </>}

      {phase === 2 && <>
        <text x="230" y="45" textAnchor="middle" fontSize="16" fontWeight="950" fill={INK} fontFamily={FONT}>f(n) = f(n−1) + f(n−2) + f(n−3)</text>
        {Array.from({ length: stairs }, (_, i) => i+1).map((n) => {
          const x=25+(n-1)*70, solved=n<=3, delay=n<=3 ? 0 : (n-3)*.35;
          return <motion.g key={n} initial={{ opacity: 0, y: solved ? 0 : -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
            <rect x={x} y="72" width="58" height="57" rx="11" fill={n===stairs ? "#dcfce7" : solved ? "#f0fdfa" : "#eef2ff"} stroke={n===stairs ? GREEN : solved ? TEAL : INDIGO} strokeWidth={n===stairs ? 2.8 : 2} />
            <text x={x+29} y="92" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM} fontFamily={FONT}>f({n})</text>
            <text x={x+29} y="118" textAnchor="middle" fontSize="22" fontWeight="950" fill={n===stairs ? GREEN : solved ? TEAL : INDIGO} fontFamily={FONT}>{ways[n]}</text>
          </motion.g>;
        })}
        {[4,5,6].filter((n)=>n<=stairs).map((n,i)=><motion.g key={n} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35+i*.35 }}>
          <rect x="73" y={157+i*38} width="314" height="29" rx="9" fill={n===stairs ? "#dcfce7" : "#f8fafc"} stroke={n===stairs ? GREEN : "#cbd5e1"} />
          <text x="230" y={177+i*38} textAnchor="middle" fontSize="14" fontWeight="900" fill={n===stairs ? GREEN : INK} fontFamily={FONT}>f({n}) = {ways[n-1]} + {ways[n-2]} + {ways[n-3]} = {ways[n]}</text>
        </motion.g>)}
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={420} y={287} width={72} />
        {!ok && <text x="230" y="312" textAnchor="middle" fontSize="9" fill={RED}>{fail}</text>}
      </>}
    </svg>
  </div>;
}
