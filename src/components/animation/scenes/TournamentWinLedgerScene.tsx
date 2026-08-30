import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", GOLD = "#d97706", RED = "#dc2626", DIM = "#94a3b8";
const list = (v: unknown) => Array.isArray(v) ? v.map((x) => Math.round(num(x, 0))) : [];
const point = (i: number, n: number, cx: number, cy: number, r: number) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }; };

function feasibleScores(target: number[]) {
  const edges: [number, number][] = [];
  for (let i = 0; i < target.length; i++) for (let j = i + 1; j < target.length; j++) edges.push([i, j]);
  for (let mask = 0; mask < 2 ** edges.length; mask++) {
    const scores = Array(target.length).fill(0);
    edges.forEach(([a, b], k) => scores[(mask >> k) & 1 ? a : b]++);
    if (scores.every((s, i) => s === target[i])) return true;
  }
  return false;
}

function WinToken({ x, y, delay = 0, color = GOLD }: { x: number; y: number; delay?: number; color?: string }) {
  return <motion.g initial={{ opacity: 0, scale: 0.3, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <circle cx={x} cy={y} r="8" fill="#fffbeb" stroke={color} strokeWidth="1.7" /><path d={`M ${x - 3} ${y - 2} h 6 l -1 5 h -4 z`} fill={color} /><path d={`M ${x - 5} ${y - 3} q -3 0 -1 4 M ${x + 5} ${y - 3} q 3 0 1 4`} fill="none" stroke={color} strokeWidth="1" />
  </motion.g>;
}

/** A complete graph contributes one win token per edge; known stacks consume tokens and the unknown stack receives the rest. Data: { names, knownWins, unknownIndex }. */
export function TournamentWinLedgerScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const names = Array.isArray(data.names) ? data.names.map(String) : [];
  const knownWins = list(data.knownWins), unknownIndex = Math.round(num(data.unknownIndex, -1));
  const n = names.length, totalGames = n * (n - 1) / 2, knownTotal = knownWins.reduce((a, b) => a + b, 0), unknownWins = totalGames - knownTotal;
  const scores = names.map((_, i) => i === unknownIndex ? unknownWins : knownWins[i < unknownIndex ? i : i - 1]);
  const choice = problem.choices?.find((c) => Number(c.text) === unknownWins)?.label;
  const feasible = n <= 6 && feasibleScores(scores);
  const ok = Number.isInteger(totalGames) && unknownWins >= 0 && unknownWins < n && scores.reduce((a, b) => a + b, 0) === totalGames && feasible && String(unknownWins) === String(problem.shortAnswer) && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const knownNames = names.filter((_, i) => i !== unknownIndex);

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "5px 3px" }}>
    <svg viewBox="0 0 430 320" width="100%" style={{ maxWidth: 460 }}>
      <text x="215" y="18" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>
        {phase === 0 ? "one edge for every pair — one winner for every edge" : phase === 1 ? "pour the five known win stacks into the ledger" : "the unclaimed win tokens belong to Monica"}
      </text>

      {phase === 0 && <>
        {(() => {
          const ps = names.map((_, i) => point(i, n, 215, 130, 94));
          const edges: [number, number][] = [];
          for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) edges.push([i, j]);
          return <g>{edges.map(([a, b], k) => <motion.line key={`${a}-${b}`} x1={ps[a].x} y1={ps[a].y} x2={ps[b].x} y2={ps[b].y} stroke={IND} strokeWidth="1.3" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: .45 }} transition={{ delay: k * .045 }} />)}
            {ps.map((p, i) => <motion.g key={names[i]} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: i * .08 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><circle cx={p.x} cy={p.y} r="20" fill="#fff" stroke={i === unknownIndex ? TEAL : IND} strokeWidth="2.3" /><text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fontWeight="900" fill={i === unknownIndex ? TEAL : IND}>{names[i][0]}</text></motion.g>)}
          </g>;
        })()}
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .9 }}>
          <rect x="95" y="242" width="240" height="38" rx="12" fill="#eef2ff" stroke="#c7d2fe" />
          <text x="215" y="267" textAnchor="middle" fontSize="17" fontWeight="950" fill={IND} fontFamily={FONT}>{n} × {n - 1} ÷ 2 = {totalGames} games</text>
        </motion.g>
      </>}

      {phase === 1 && <>
        <g transform="translate(35 51)">{knownNames.map((name, col) => {
          const x = 34 + col * 76, wins = knownWins[col];
          return <g key={name}><circle cx={x} cy="20" r="17" fill="#eef2ff" stroke={IND} strokeWidth="1.8" /><text x={x} y="24" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND}>{name[0]}</text><text x={x} y="50" textAnchor="middle" fontSize="9" fontWeight="850" fill={INK}>{name}</text>
            {Array.from({ length: wins }, (_, i) => <WinToken key={i} x={x} y={83 + i * 25} delay={col * .1 + i * .06} />)}
            <text x={x} y="198" textAnchor="middle" fontSize="18" fontWeight="950" fill={GOLD} fontFamily={FONT}>{wins}</text></g>;
        })}</g>
        <motion.path d="M 42 256 H 388" stroke={DIM} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .65 }} />
        <text x="215" y="281" textAnchor="middle" fontSize="18" fontWeight="950" fill={IND} fontFamily={FONT}>{knownWins.join(" + ")} = {knownTotal} known wins</text>
      </>}

      {phase === 2 && <>
        <text x="215" y="46" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>all {totalGames} game-wins</text>
        <g transform="translate(50 63)">{Array.from({ length: totalGames }, (_, i) => {
          const row = Math.floor(i / 5), col = i % 5, remaining = i >= knownTotal;
          return <motion.g key={i} initial={{ opacity: 0, x: remaining ? -70 : 0 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", delay: i * .035 }}><rect x={col * 68} y={row * 46} width="54" height="34" rx="8" fill={remaining ? "#ecfeff" : "#f8fafc"} stroke={remaining ? TEAL : DIM} strokeWidth={remaining ? 2 : 1.2} /><WinToken x={col * 68 + 27} y={row * 46 + 17} delay={0} color={remaining ? TEAL : GOLD} /></motion.g>;
        })}</g>
        <text x="215" y="222" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM} fontFamily={FONT}>{knownTotal} claimed   +   {unknownWins} unclaimed</text>
        <motion.text x="215" y="253" textAnchor="middle" fontSize="23" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: .65 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>Monica: {totalGames} − {knownTotal} = {unknownWins}</motion.text>
        <text x="215" y="273" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "a tournament with these six win totals exists ✓" : "score-ledger or stored-answer check failed"}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer == null ? null : String(problem.answer)} cx={215} y={289} width={86} />
      </>}
    </svg>
  </div>;
}
