import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const RED = "#dc2626";
const GREEN = "#16a34a";
const AMBER = "#d97706";

type Player = { name: string; wins: number | null; losses: number };

/** Every completed game contributes one token to each side of a win/loss ledger. */
export function GameResultBalanceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const players: Player[] = (Array.isArray(data.players) ? data.players : []).map((raw) => {
    const [name, wins, losses] = String(raw).split("|");
    const w = Math.round(num(wins, -1));
    return { name: name ?? "?", wins: w < 0 ? null : w, losses: Math.round(num(losses, 0)) };
  });
  const unknowns = players.filter((p) => p.wins == null);
  const knownWins = players.reduce((sum, p) => sum + (p.wins ?? 0), 0);
  const losses = players.reduce((sum, p) => sum + p.losses, 0);
  const missing = losses - knownWins;
  const winner = unknowns.length === 1 ? unknowns[0] : null;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d-]/g, ""));
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === missing)?.label;
  const ok = players.length === 3 && winner != null && missing >= 0 && missing === stored && choice === problem.answer;
  const failure = unknowns.length !== 1
    ? `${unknowns.length} players have unknown wins`
    : missing < 0
      ? `known wins ${knownWins} exceed losses ${losses}`
      : `computed ${missing}, stored answer ${problem.shortAnswer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);

  const Token = ({ cx, cy, kind, delay = 0, faded = false }: { cx: number; cy: number; kind: "W" | "L"; delay?: number; faded?: boolean }) => {
    const color = kind === "W" ? INDIGO : RED;
    return <motion.g initial={{ opacity: 0, y: -14, scale: 0.5 }} animate={{ opacity: faded ? 0.22 : 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 15, delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <circle cx={cx} cy={cy} r="12" fill={color} fillOpacity="0.13" stroke={color} strokeWidth="1.8" />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill={color} fontFamily={mono}>{kind}</text>
    </motion.g>;
  };

  const Ledger = ({ showWins, showLosses, fillMissing = false }: { showWins: boolean; showLosses: boolean; fillMissing?: boolean }) => <g>
    <text x="151" y="47" textAnchor="middle" fontSize="11" fontWeight="900" fill={INDIGO}>WINS</text>
    <text x="300" y="47" textAnchor="middle" fontSize="11" fontWeight="900" fill={RED}>LOSSES</text>
    {players.map((p, i) => {
      const y = 73 + i * 56;
      const shownWins = p.wins ?? (fillMissing ? missing : 0);
      return <g key={p.name}>
        <text x="18" y={y + 5} fontSize="11" fontWeight="900" fill={INK}>{p.name}</text>
        {showWins && Array.from({ length: shownWins }, (_, k) => <Token key={`w${k}`} cx={112 + k * 27} cy={y} kind="W" delay={0.08 * k + i * 0.12} />)}
        {showWins && p.wins == null && !fillMissing && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}><rect x="106" y={y - 15} width="90" height="30" rx="8" fill="#f8fafc" stroke="#94a3b8" strokeDasharray="4 3" /><text x="151" y={y + 5} textAnchor="middle" fontSize="14" fontWeight="900" fill="#64748b" fontFamily={mono}>?</text></motion.g>}
        {showLosses && Array.from({ length: p.losses }, (_, k) => <Token key={`l${k}`} cx={270 + k * 27} cy={y} kind="L" delay={0.08 * k + i * 0.12} />)}
      </g>;
    })}
    <line x1="94" y1="224" x2="235" y2="224" stroke="#cbd5e1" strokeWidth="1.5" />
    <line x1="248" y1="224" x2="370" y2="224" stroke="#cbd5e1" strokeWidth="1.5" />
    {showWins && <text x="151" y="246" textAnchor="middle" fontSize="15" fontWeight="900" fill={fillMissing ? GREEN : INDIGO} fontFamily={mono}>{fillMissing ? knownWins + missing : knownWins}{!fillMissing && " known"}</text>}
    {showLosses && <text x="300" y="246" textAnchor="middle" fontSize="15" fontWeight="900" fill={RED} fontFamily={mono}>{losses}</text>}
  </g>;

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "calc(100vw - 48px)", maxWidth: 480, minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 280" style={{ width: "calc(100vw - 48px)", maxWidth: 480, minWidth: 0, display: "block" }}>
      {phase === 0 && <g>
        <text x="230" y="20" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>every completed chess game makes a matched pair</text>
        <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 190, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x="170" y="50" width="120" height="70" rx="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <text x="230" y="79" textAnchor="middle" fontSize="25">♟</text><text x="230" y="104" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK}>one game</text>
        </motion.g>
        <motion.path d="M 190 126 C 160 148 135 150 112 166 M 270 126 C 300 148 325 150 348 166" fill="none" stroke="#94a3b8" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.45 }} />
        <Token cx={112} cy={181} kind="W" delay={0.75} /><Token cx={348} cy={181} kind="L" delay={0.85} />
        <text x="112" y="211" textAnchor="middle" fontSize="11" fontWeight="900" fill={INDIGO}>one winner</text><text x="348" y="211" textAnchor="middle" fontSize="11" fontWeight="900" fill={RED}>one loser</text>
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 }}><rect x="102" y="233" width="256" height="34" rx="12" fill="#eef2ff" stroke="#a5b4fc" /><text x="230" y="255" textAnchor="middle" fontSize="13" fontWeight="900" fill={INDIGO} fontFamily={mono}>total wins = total losses</text></motion.g>
      </g>}

      {phase === 1 && <g>
        <text x="230" y="20" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>stack the wins we already know</text>
        <Ledger showWins showLosses={false} />
        <motion.text x="151" y="271" textAnchor="middle" fontSize="12" fontWeight="900" fill={INDIGO} fontFamily={mono} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>{players.filter((p) => p.wins != null).map((p) => p.wins).join(" + ")} = {knownWins}</motion.text>
      </g>}

      {phase === 2 && <g>
        <text x="230" y="20" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>now stack every recorded loss</text>
        <Ledger showWins showLosses />
        <motion.path d="M 170 250 C 205 272 250 272 284 250" fill="none" stroke={AMBER} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.65, delay: 0.75 }} />
        <motion.text x="225" y="272" textAnchor="middle" fontSize="12" fontWeight="900" fill={AMBER} fontFamily={mono} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>{losses} − {knownWins} = {missing} win missing</motion.text>
      </g>}

      {phase === 3 && <g>
        <text x="230" y="20" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>give the missing win token to {winner?.name ?? "the unknown player"}</text>
        <Ledger showWins showLosses fillMissing />
        <motion.path d="M 230 248 L 230 261 L 300 261 L 300 248" fill="none" stroke={GREEN} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.8 }} />
        <text x="265" y="276" textAnchor="middle" fontSize="11" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={mono}>{ok ? `${knownWins} + ${missing} = ${losses}` : failure}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={344} y={248} width={72} />
      </g>}
    </svg>
    <AnimatePresence>{final && !ok && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: RED, fontFamily: mono, fontSize: 11, fontWeight: 800 }}>{failure}</motion.div>}</AnimatePresence>
  </div>;
}
