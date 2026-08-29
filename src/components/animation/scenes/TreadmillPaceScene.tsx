import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

const TRACK_X0 = 120, TRACK_X1 = 330, ROW_Y = [60, 100, 140];

function fmt(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

function Runner({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y - 6} r="6" fill={color} stroke={INK} strokeWidth="1" />
      <line x1={x - 5} y1={y + 4} x2={x} y2={y - 1} stroke={INK} strokeWidth="2" />
      <line x1={x + 5} y1={y + 4} x2={x} y2={y - 1} stroke={INK} strokeWidth="2" />
    </g>
  );
}

// Three fixed-length treadmill tracks (the same real distance every day) —
// a runner crosses each one in an on-screen duration scaled to its actual
// minutes, so a slower pace visibly takes longer to finish, not just a
// bigger number. The same three tracks replay at one uniform pace to compare.
// Data: { distanceMiles, dayLabels[], daySpeeds[], baselineMph }.
export function TreadmillPaceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const distance = num(data.distanceMiles, 2);
  const labels = (Array.isArray(data.dayLabels) ? data.dayLabels : []).map(String);
  const speeds = (Array.isArray(data.daySpeeds) ? data.daySpeeds : []).map((v) => num(v, 0));
  const baselineMph = num(data.baselineMph, 4);

  const minutesOf = (mph: number) => (mph > 0 ? (distance / mph) * 60 : 0);
  const actualMinutes = speeds.map(minutesOf);
  const totalActual = actualMinutes.reduce((a, b) => a + b, 0);
  const baselineEach = minutesOf(baselineMph);
  const totalBaseline = labels.length * baselineEach;
  const diff = totalActual - totalBaseline;

  const choiceLabel = (problem.choices ?? []).find((c) => String(c.text).trim() === String(diff))?.label;
  const answerOk = String(diff) === String(problem.shortAnswer ?? "").trim();
  const ok = answerOk && choiceLabel === problem.answer;
  const failure = !answerOk ? `computed ${diff}, stored ${problem.shortAnswer}` : `choice ${choiceLabel ?? "missing"}, stored ${problem.answer}`;

  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  const maxMinutes = Math.max(...actualMinutes, baselineEach, 1);
  const durationOf = (m: number) => 0.5 + (m / maxMinutes) * 1.1;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 460 320" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
        <text x="230" y="16" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? `${distance} miles at three different paces` : phase === 1 ? `the same ${distance} miles at a steady ${baselineMph} mph` : "actual time minus the steady-pace time"}
        </text>

        {labels.map((label, i) => {
          const usingBaseline = phase !== 0;
          const mph = usingBaseline ? baselineMph : speeds[i];
          const minutes = usingBaseline ? baselineEach : actualMinutes[i];
          const color = usingBaseline ? TEAL : IND;
          const y = ROW_Y[i];
          const dur = durationOf(minutes);
          return (
            <g key={i}>
              <text x="40" y={y + 4} fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>{label}</text>
              <text x="40" y={y + 18} fontSize="9" fontWeight="700" fill={DIM} fontFamily={FONT}>{fmt(mph)} mph</text>
              <line x1={TRACK_X0} y1={y} x2={TRACK_X1} y2={y} stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
              <motion.g initial={{ x: TRACK_X0, y: 0 }} animate={{ x: TRACK_X1, y: 0 }} transition={{ duration: dur, ease: "linear" }}>
                <Runner x={0} y={y} color={color} />
              </motion.g>
              <motion.text x={TRACK_X1 + 20} y={y + 4} fontSize="11" fontWeight="900" fill={color} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: dur }}>
                {fmt(minutes)} min
              </motion.text>
            </g>
          );
        })}

        {phase === 0 && (
          <motion.text x="230" y="180" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.max(...actualMinutes.map(durationOf)) + 0.3 }}>
            {actualMinutes.map(fmt).join(" + ")} = {fmt(totalActual)} minutes
          </motion.text>
        )}

        {phase === 1 && (
          <motion.text x="230" y="180" textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: durationOf(baselineEach) + 0.3 }}>
            {labels.length} × {fmt(baselineEach)} = {fmt(totalBaseline)} minutes
          </motion.text>
        )}

        {phase === 2 && (
          <>
            <text x="230" y="180" textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM} fontFamily={FONT}>
              actual {fmt(totalActual)} min — steady {fmt(totalBaseline)} min
            </text>
            <motion.text x="230" y="204" textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily={FONT} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              {fmt(totalActual)} − {fmt(totalBaseline)} = <tspan fill={GREEN}>{fmt(diff)}</tspan> min
            </motion.text>
            <text x="230" y="226" textAnchor="middle" fontSize="9.3" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>
              {ok ? "actual total, steady total, and choice verified" : failure}
            </text>
            <SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={236} width={100} />
          </>
        )}
      </svg>
    </div>
  );
}
