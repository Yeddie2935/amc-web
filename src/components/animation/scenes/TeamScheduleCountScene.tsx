import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", ORANGE = "#ea580c", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

/** Count unique team pairings, turn each into home/away games, then add outside games. */
export function TeamScheduleCountScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const teams = Math.round(num(data.teamCount, 0));
  const gamesPerPair = Math.round(num(data.gamesPerPair, 0));
  const outsidePerTeam = Math.round(num(data.nonConferencePerTeam, 0));
  const pairs = teams * (teams - 1) / 2;
  const conference = pairs * gamesPerPair;
  const outside = teams * outsidePerTeam;
  const total = conference + outside;
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === total)?.label;
  const ok = Number.isInteger(pairs) && String(total) === problem.shortAnswer && choice === problem.answer;
  const failure = String(total) !== problem.shortAnswer ? `computed ${total}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);
  const labels = Array.from({ length: teams }, (_, i) => String.fromCharCode(65 + i));
  const pairCells = labels.flatMap((_, row) => labels.map((__, col) => ({ row, col })).filter(({ col }) => col > row));

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: 480, minWidth: 0, padding: "6px 4px", boxSizing: "border-box", overflow: "hidden" }}>
    <svg viewBox="0 0 460 310" width="100%" style={{ flex: "1 1 0", maxWidth: "100%", minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
        {phase === 0 ? "count each conference matchup once" : phase === 1 ? "every matchup becomes a home game and an away game" : phase === 2 ? "each conference team also schedules four outside opponents" : "combine the two disjoint game ledgers"}
      </text>

      {phase <= 1 && <>
        <g transform="translate(74 42)">
          {labels.map((label, i) => <g key={label}><text x={53 + i * 34} y="12" textAnchor="middle" fontSize="10" fontWeight="900" fill={INDIGO}>{label}</text><text x="16" y={39 + i * 27} textAnchor="middle" fontSize="10" fontWeight="900" fill={INDIGO}>{label}</text></g>)}
          {labels.flatMap((_, row) => labels.map((__, col) => {
            const active = col > row, diagonal = col === row;
            return <rect key={`${row}-${col}`} x={36 + col * 34} y={20 + row * 27} width="29" height="22" rx="4" fill={diagonal ? "#e2e8f0" : active ? (phase === 1 ? "#fff7ed" : "#eef2ff") : "#fff"} stroke={active ? (phase === 1 ? ORANGE : INDIGO) : "#e2e8f0"} strokeWidth={active ? 1.3 : 0.8} opacity={active || diagonal ? 1 : 0.3} />;
          }))}
          {pairCells.map(({ row, col }, i) => <motion.g key={`pair-${row}-${col}`} initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.025 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {phase === 0 ? <circle cx={50.5 + col * 34} cy={31 + row * 27} r="3.2" fill={INDIGO} /> : <><path d={`M ${42 + col * 34} ${31 + row * 27} h 8`} stroke={INDIGO} strokeWidth="3" strokeLinecap="round" /><path d={`M ${52 + col * 34} ${31 + row * 27} h 8`} stroke={ORANGE} strokeWidth="3" strokeLinecap="round" /></>}
          </motion.g>)}
        </g>
        <g transform="translate(94 273)"><rect width="272" height="28" rx="10" fill={phase === 0 ? "#eef2ff" : "#fff7ed"} stroke={phase === 0 ? INDIGO : ORANGE} /><text x="136" y="19" textAnchor="middle" fontSize="14" fontWeight="900" fill={phase === 0 ? INDIGO : ORANGE} fontFamily={FONT}>{phase === 0 ? `${teams}·${teams - 1} ÷ 2 = ${pairs} matchups` : `${pairs} matchups · ${gamesPerPair} = ${conference} games`}</text></g>
      </>}

      {phase === 2 && <>
        <g transform="translate(67 45)">{labels.map((label, row) => <motion.g key={label} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: row * 0.08 }}><circle cx="19" cy={16 + row * 27} r="11" fill={INDIGO} /><text x="19" y={20 + row * 27} textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff">{label}</text><path d={`M 34 ${16 + row * 27} H 72`} stroke="#cbd5e1" strokeWidth="1.5" />{Array.from({ length: outsidePerTeam }, (_, col) => <motion.g key={col} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + row * 0.08 + col * 0.06 }}><circle cx={88 + col * 48} cy={16 + row * 27} r="9" fill="#fff7ed" stroke={ORANGE} strokeWidth="1.5" /><path d={`M ${82 + col * 48} ${16 + row * 27} q 6 -7 12 0 q -6 7 -12 0`} fill="none" stroke={ORANGE} strokeWidth="1" /></motion.g>)}</motion.g>)}</g>
        <g transform="translate(114 273)"><rect width="232" height="28" rx="10" fill="#fff7ed" stroke={ORANGE} /><text x="116" y="19" textAnchor="middle" fontSize="14" fontWeight="900" fill={ORANGE} fontFamily={FONT}>{teams} teams · {outsidePerTeam} = {outside} games</text></g>
      </>}

      {phase === 3 && <>
        <g transform="translate(42 52)">
          <motion.g initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}><rect width="168" height="104" rx="15" fill="#eef2ff" stroke={INDIGO} strokeWidth="2" /><text x="84" y="25" textAnchor="middle" fontSize="11" fontWeight="850" fill={INDIGO}>CONFERENCE</text><text x="84" y="57" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>{pairs} · {gamesPerPair}</text><text x="84" y="88" textAnchor="middle" fontSize="27" fontWeight="900" fill={INDIGO} fontFamily={FONT}>{conference}</text></motion.g>
          <motion.g initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}><rect x="208" width="168" height="104" rx="15" fill="#fff7ed" stroke={ORANGE} strokeWidth="2" /><text x="292" y="25" textAnchor="middle" fontSize="11" fontWeight="850" fill={ORANGE}>NON-CONFERENCE</text><text x="292" y="57" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>{teams} · {outsidePerTeam}</text><text x="292" y="88" textAnchor="middle" fontSize="27" fontWeight="900" fill={ORANGE} fontFamily={FONT}>{outside}</text></motion.g>
          <motion.path d="M 84 119 C 84 151 156 151 180 172 M 292 119 C 292 151 220 151 196 172" fill="none" stroke={DIM} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        </g>
        <motion.g initial={{ opacity: 0, scale: 0.65 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 16, delay: 0.25 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x="126" y="222" width="208" height="56" rx="14" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2.5" /><text x="230" y="245" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{conference} + {outside}</text><text x="230" y="269" textAnchor="middle" fontSize="24" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>= {total}</text></motion.g>
        <text x="170" y="300" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? `${pairs} unique pairs; no conference game counted twice` : failure}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={278} width={78} />
      </>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="305" textAnchor="middle" fontSize="10" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
