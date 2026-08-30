import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const MARK = "#4338ca";
const WIN = "#16a34a";

/**
 * Single-elimination bracket: every round halves the field and every game
 * removes exactly one team, so the games needed equal the teams that must
 * be eliminated. Reveals one round per step — 16 teams collapsing to 8, to
 * 4, to 2, to the champion — tallying games alongside, then names the trap
 * (the round count, not the game count) before landing the total.
 * Data: { teams }.
 */
export function SingleEliminationBracketScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const teams = Math.round(num(data.teams, 16));
  const rounds = Math.round(Math.log2(teams));
  if (teams < 2 || 2 ** rounds !== teams) return null;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const roundsShown = Math.min(step, rounds);

  const rowH = 13;
  const topY = 10;
  const positions: number[][] = [Array.from({ length: teams }, (_, i) => topY + i * rowH + rowH / 2)];
  for (let r = 1; r <= rounds; r++) {
    const prev = positions[r - 1];
    const next: number[] = [];
    for (let i = 0; i < prev.length / 2; i++) next.push((prev[2 * i] + prev[2 * i + 1]) / 2);
    positions.push(next);
  }

  const colGap = 50;
  const x0 = 24;
  const x = (r: number) => x0 + r * colGap;
  const W = x(rounds) + 46;
  const H = topY + teams * rowH + 16;

  const gamesInRound = (r: number) => teams / 2 ** r;
  const eliminatedThrough = (r: number) => teams - teams / 2 ** r;
  const totalGames = teams - 1;

  const roundsTrap = (problem.choices ?? []).find((c) => c.text.trim() === String(rounds));

  const caption =
    step === 0
      ? `${teams} teams enter — each game eliminates exactly one team`
      : `round ${roundsShown}: ${gamesInRound(roundsShown)} game${gamesInRound(roundsShown) === 1 ? "" : "s"}, ${eliminatedThrough(roundsShown)} teams eliminated so far`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 300 }}>
        {positions[0].map((y, i) => (
          <rect key={i} x={x(0) - 8} y={y - 5.5} width={16} height={11} rx={3} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={1} />
        ))}

        {Array.from({ length: roundsShown }).map((_, ri) => {
          const r = ri + 1;
          return (
            <motion.g key={r} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {positions[r].map((y, i) => {
                const c1 = positions[r - 1][2 * i];
                const c2 = positions[r - 1][2 * i + 1];
                return (
                  <g key={i}>
                    <motion.path
                      d={`M ${x(r - 1) + 8} ${c1} H ${x(r) - 8} M ${x(r - 1) + 8} ${c2} H ${x(r) - 8} M ${x(r) - 8} ${c1} V ${c2}`}
                      fill="none"
                      stroke={MARK}
                      strokeWidth={1.2}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    />
                    <motion.rect
                      x={x(r) - 8}
                      y={y - 5.5}
                      width={16}
                      height={11}
                      rx={3}
                      fill={r === rounds ? "#dcfce7" : `${WIN}18`}
                      stroke={WIN}
                      strokeWidth={1.2}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.25 + i * 0.05 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    />
                  </g>
                );
              })}
              <text x={(x(r - 1) + x(r)) / 2} y={H - 4} textAnchor="middle" fontSize="8" fontWeight="800" fill={MARK} fontFamily={FONT}>
                {gamesInRound(r)}g
              </text>
            </motion.g>
          );
        })}
      </svg>

      <motion.span
        key={`${step}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 800,
          color: "#4338ca",
          background: "#eef2ff",
          border: "1px solid #c7d2fe",
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      {isFinal && (
        <>
          <div style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 700, color: "#b45309", textAlign: "center", maxWidth: 280 }}>
            {rounds} rounds{roundsTrap ? ` traps you at choice ${roundsTrap.label}` : ""} — but the question asks for games, not rounds.
          </div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.3 }}
            style={{
              fontFamily: FONT,
              fontSize: 12.5,
              fontWeight: 800,
              color: "#166534",
              background: "#dcfce7",
              border: "1px solid #bbf7d0",
              padding: "4px 12px",
              borderRadius: 999,
              textAlign: "center",
            }}
          >
            {Array.from({ length: rounds }, (_, r) => gamesInRound(r + 1)).join(" + ")} = {totalGames} games
          </motion.div>
          {problem.answer && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.6 }}
              style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
            >
              Answer {problem.answer}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
