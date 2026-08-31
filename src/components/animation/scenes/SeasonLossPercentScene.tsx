import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const WIN_BLUE = "#4338ca";
const LOSS_RED = "#dc2626";
const GREEN = "#16a34a";

/** A win:loss ratio becomes a literal season ledger, then a loss fraction and a rounded percent. Data: { wins, losses }. */
export function SeasonLossPercentScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const wins = Math.round(num(data.wins, 0));
  const losses = Math.round(num(data.losses, 0));
  const total = wins + losses;
  const exactPercent = (losses / total) * 100;
  const roundedPercent = Math.round(exactPercent);
  const choice = problem.choices?.find((item) => Number(item.text) === roundedPercent)?.label;
  const stored = Number((problem.shortAnswer ?? "").replace("%", ""));
  const ok = roundedPercent === stored && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const tileW = 20;
  const gap = 3;
  const startX = (400 - total * tileW - (total - 1) * gap) / 2;

  const GameTile = ({ i, x, y, muted = false }: { i: number; x: number; y: number; muted?: boolean }) => {
    const isWin = i < wins;
    const color = isWin ? WIN_BLUE : LOSS_RED;
    return (
      <motion.g
        initial={{ opacity: 0, y: -12, scale: 0.5 }}
        animate={{ opacity: muted && isWin ? 0.22 : 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.045 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <rect x={x} y={y} width={tileW} height="34" rx="6" fill={muted && isWin ? "#f1f5f9" : `${color}18`} stroke={muted && isWin ? "#cbd5e1" : color} strokeWidth="1.5" />
        <text x={x + tileW / 2} y={y + 22} textAnchor="middle" fontSize="12" fontWeight="900" fill={muted && isWin ? "#94a3b8" : color} fontFamily={FONT}>{isWin ? "W" : "L"}</text>
      </motion.g>
    );
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "5px 3px" }}>
      <svg viewBox="0 0 400 278" width="100%" style={{ maxWidth: 430 }}>
        <text x="200" y="18" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK} fontFamily={FONT}>MIDDIES’ GAME LEDGER</text>

        {phase === 0 && (
          <g>
            <text x="200" y="42" textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>each tile is one ratio part — one game</text>
            {Array.from({ length: total }, (_, i) => <GameTile key={i} i={i} x={startX + i * (tileW + gap)} y={58} />)}
            <motion.path d={`M ${startX} 103 v 8 H ${startX + wins * (tileW + gap) - gap} v -8`} fill="none" stroke={WIN_BLUE} strokeWidth="1.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.65 }} />
            <motion.path d={`M ${startX + wins * (tileW + gap)} 103 v 8 H ${startX + total * (tileW + gap) - gap} v -8`} fill="none" stroke={LOSS_RED} strokeWidth="1.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.82 }} />
            <text x={startX + (wins * (tileW + gap) - gap) / 2} y="127" textAnchor="middle" fontSize="12" fontWeight="900" fill={WIN_BLUE} fontFamily={FONT}>{wins} wins</text>
            <text x={startX + wins * (tileW + gap) + (losses * (tileW + gap) - gap) / 2} y="127" textAnchor="middle" fontSize="12" fontWeight="900" fill={LOSS_RED} fontFamily={FONT}>{losses} losses</text>
            <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x="105" y="158" width="190" height="58" rx="14" fill="#eef2ff" stroke="#c7d2fe" strokeWidth="1.8" />
              <text x="200" y="178" textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={FONT}>ALL RATIO PARTS</text>
              <text x="200" y="202" textAnchor="middle" fontSize="20" fontWeight="950" fill={WIN_BLUE} fontFamily={FONT}>{wins} + {losses} = {total} games</text>
            </motion.g>
            <text x="200" y="246" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK} fontFamily={FONT}>win : loss = {wins} : {losses}</text>
          </g>
        )}

        {phase === 1 && (
          <g>
            <text x="200" y="42" textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>select the loss tiles from all {total} games</text>
            {Array.from({ length: total }, (_, i) => <GameTile key={i} i={i} x={startX + i * (tileW + gap)} y={58} muted />)}
            {Array.from({ length: losses }, (_, i) => (
              <motion.g key={i} initial={{ x: 92 + i * 23, y: -68 }} animate={{ x: 0, y: 0 }} transition={{ type: "spring", stiffness: 170, damping: 18, delay: 0.18 + i * 0.1 }}>
                <rect x={154 + i * 23} y="132" width={tileW} height="30" rx="6" fill="#fee2e2" stroke={LOSS_RED} strokeWidth="1.6" />
                <text x={164 + i * 23} y="152" textAnchor="middle" fontSize="11" fontWeight="900" fill={LOSS_RED} fontFamily={FONT}>L</text>
              </motion.g>
            ))}
            <motion.line x1="153" y1="176" x2="247" y2="176" stroke={INK} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7 }} />
            <motion.text x="200" y="200" textAnchor="middle" fontSize="20" fontWeight="950" fill={INK} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>{total}</motion.text>
            <motion.text x="200" y="230" textAnchor="middle" fontSize="19" fontWeight="950" fill={LOSS_RED} fontFamily={FONT} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>loss fraction = {losses}/{total}</motion.text>
          </g>
        )}

        {phase === 2 && (
          <g>
            <motion.text x="200" y="49" textAnchor="middle" fontSize="18" fontWeight="950" fill={LOSS_RED} fontFamily={FONT} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>{losses} ÷ {total} × 100 = {exactPercent.toFixed(2)}%</motion.text>
            <text x="200" y="73" textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={FONT}>nearest whole percent</text>
            <line x1="55" y1="136" x2="345" y2="136" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            {[25, 26, 27, 28].map((value) => {
              const x = 55 + (value - 25) * (290 / 3);
              return <g key={value}><line x1={x} y1="127" x2={x} y2="145" stroke={value === roundedPercent ? GREEN : INK} strokeWidth={value === roundedPercent ? 3 : 2} /><text x={x} y="164" textAnchor="middle" fontSize="12" fontWeight="900" fill={value === roundedPercent ? GREEN : INK} fontFamily={FONT}>{value}%</text></g>;
            })}
            {(() => {
              const markerX = 55 + (exactPercent - 25) * (290 / 3);
              const roundedX = 55 + (roundedPercent - 25) * (290 / 3);
              return <>
                <motion.circle cx={markerX} cy="136" r="8" fill={LOSS_RED} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.35 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
                <text x={markerX} y="111" textAnchor="middle" fontSize="11" fontWeight="900" fill={LOSS_RED} fontFamily={FONT}>{exactPercent.toFixed(2)}%</text>
                <motion.path d={`M ${markerX} 122 Q ${(markerX + roundedX) / 2} 88 ${roundedX} 119`} fill="none" stroke={GREEN} strokeWidth="2.5" markerEnd="url(#round-arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7 }} />
              </>;
            })()}
            <defs><marker id="round-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill={GREEN} /></marker></defs>
            <motion.text x="200" y="208" textAnchor="middle" fontSize="22" fontWeight="950" fill={ok ? GREEN : LOSS_RED} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: 0.95 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>{ok ? `${exactPercent.toFixed(2)}% rounds to ${roundedPercent}%` : "stored-answer check failed"}</motion.text>
            <SvgAnswerBadge show={ok} answer={problem.answer == null ? null : String(problem.answer)} cx={200} y={230} width={84} />
          </g>
        )}
      </svg>
    </div>
  );
}
