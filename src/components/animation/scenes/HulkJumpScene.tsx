import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

const MARGIN = 30, BASELINE = 220, UNIT_H = 7, BAR_W = 20;
const SPACING = (460 - 2 * MARGIN) / 12;
const barX = (n: number) => MARGIN + (n - 1) * SPACING;
const barTop = (n: number) => BASELINE - n * UNIT_H;

function fmt(v: number): string {
  return v.toLocaleString("en-US");
}

// Each jump doubles the last, drawn as a rising staircase where bar height
// tracks the jump number (so every step reads clearly) while the label on
// each bar carries its true doubled distance. Color flips once that real
// value crosses the threshold — the first green bar is the answer.
// Data: { firstJumpMeters, thresholdMeters, maxJump }.
export function HulkJumpScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const firstJump = num(data.firstJumpMeters, 1);
  const threshold = num(data.thresholdMeters, 1000);
  const maxJump = Math.round(num(data.maxJump, 13));

  const valueOf = (n: number) => firstJump * 2 ** (n - 1);
  let firstN = maxJump;
  for (let n = 1; n <= maxJump; n++) {
    if (valueOf(n) > threshold) { firstN = n; break; }
  }

  const choiceLabel = (problem.choices ?? []).find((c) => parseInt(String(c.text), 10) === firstN)?.label;
  const answerOk = firstN === parseInt(String(problem.shortAnswer ?? ""), 10);
  const ok = answerOk && choiceLabel === problem.answer;
  const failure = !answerOk ? `computed jump ${firstN}, stored ${problem.shortAnswer}` : `choice ${choiceLabel ?? "missing"}, stored ${problem.answer}`;

  const trapJump = firstN - 1;
  const trapLabel = (problem.choices ?? []).find((c) => parseInt(String(c.text), 10) === trapJump)?.label;

  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const upTo = phase === 0 ? Math.min(8, maxJump) : phase === 1 ? Math.min(firstN, maxJump) : maxJump;

  const hopRange = phase === 0 ? Array.from({ length: upTo }, (_, i) => i + 1) : phase === 1 ? Array.from({ length: firstN - 8 > 0 ? firstN - 8 : 0 }, (_, i) => 9 + i) : [];
  const hopXs = hopRange.map((n) => barX(n) + BAR_W / 2);
  const hopYs = hopRange.map((n) => barTop(n) - 12);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 460 330" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
        <text x="230" y="16" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "jump n is double the one before — jump n = 2^(n−1)" : phase === 1 ? `hunting the first jump past ${fmt(threshold)} m` : "the 11th jump is the first one over"}
        </text>

        <line x1={MARGIN - 8} y1={BASELINE} x2={430} y2={BASELINE} stroke="#cbd5e1" strokeWidth="2" />

        {Array.from({ length: upTo }, (_, i) => i + 1).map((n) => {
          const v = valueOf(n);
          const over = v > threshold;
          const isAnswer = phase === 2 && n === firstN;
          return (
            <g key={n}>
              <motion.rect x={barX(n)} y={barTop(n)} width={BAR_W} height={n * UNIT_H} rx="4" fill={over ? "#dcfce7" : "#eef2ff"} stroke={over ? GREEN : IND} strokeWidth={isAnswer ? 2.6 : 1.6} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.04 * n }} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }} />
              <text x={barX(n) + BAR_W / 2} y={barTop(n) - 6} textAnchor="middle" fontSize="8.3" fontWeight="800" fill={over ? GREEN : INK} fontFamily={FONT}>{fmt(v)}</text>
              <text x={barX(n) + BAR_W / 2} y={BASELINE + 14} textAnchor="middle" fontSize="9" fontWeight="800" fill={DIM} fontFamily={FONT}>{n}</text>
              {isAnswer && (
                <motion.text x={barX(n) + BAR_W / 2} y={barTop(n) - 18} textAnchor="middle" fontSize="13" fill={GREEN} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>★</motion.text>
              )}
            </g>
          );
        })}

        {phase >= 1 && firstN > 1 && firstN <= upTo && (
          <motion.line x1={(barX(firstN - 1) + BAR_W + barX(firstN)) / 2} y1="30" x2={(barX(firstN - 1) + BAR_W + barX(firstN)) / 2} y2={BASELINE} stroke={RED} strokeWidth="1.4" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
        )}

        {hopXs.length > 0 && (
          <motion.g initial={{ x: hopXs[0], y: hopYs[0] }} animate={{ x: hopXs, y: hopYs }} transition={{ duration: 0.35 * hopXs.length, ease: "easeInOut", delay: 0.5 }}>
            <circle r="8" fill={GREEN} stroke={INK} strokeWidth="1.2" />
            <line x1="-8" y1="0" x2="-13" y2="6" stroke={INK} strokeWidth="1.6" />
            <line x1="8" y1="0" x2="13" y2="6" stroke={INK} strokeWidth="1.6" />
          </motion.g>
        )}

        {phase === 1 && (
          <motion.text x="230" y="256" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + 0.35 * hopXs.length }}>
            2^9 = {fmt(valueOf(10))} (not enough) — 2^10 = <tspan fill={GREEN}>{fmt(valueOf(11))}</tspan> (over {fmt(threshold)}!)
          </motion.text>
        )}

        {phase === 2 && (
          <>
            <text x="230" y="252" textAnchor="middle" fontSize="13" fontWeight="900" fill={GREEN} fontFamily={FONT}>
              jump {firstN}: 2^{firstN - 1} = {fmt(valueOf(firstN))} m — first past {fmt(threshold)} m
            </text>
            {trapLabel && (
              <text x="230" y="271" textAnchor="middle" fontSize="9" fontWeight="700" fill={DIM} fontFamily={FONT}>
                careless slip: 2^{trapJump} = {fmt(valueOf(firstN))} looks like jump {trapJump}, but jump {trapJump} is 2^{trapJump - 1} = {fmt(valueOf(trapJump))} m
              </text>
            )}
            <text x="230" y="290" textAnchor="middle" fontSize="9.3" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>
              {ok ? "first-over jump and choice verified" : failure}
            </text>
            <SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={298} width={100} />
          </>
        )}
      </svg>
    </div>
  );
}
