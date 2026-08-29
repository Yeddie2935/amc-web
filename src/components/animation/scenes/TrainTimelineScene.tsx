import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

const TRACK_X0 = 40, TRACK_X1 = 420, TRACK_Y = 200;

function Chip({ x, y, w, h, label, color }: { x: number; y: number; w: number; h: number; label: string; color: string }) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <rect x={x} y={y} width={w} height={h} rx="8" fill="#fff" stroke={color} strokeWidth="1.6" />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill={color} fontFamily={FONT}>{label}</text>
    </motion.g>
  );
}

// A single boxcar travels a track scaled to the crossing time; tick marks
// every unit-interval light up as it passes, and the cars-per-interval rate
// (reduced from the sample) scales up across the full crossing time.
// Data: { sampleCars, sampleSeconds, minutes, seconds }.
export function TrainTimelineScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const sampleCars = num(data.sampleCars, 6), sampleSeconds = num(data.sampleSeconds, 10);
  const minutes = num(data.minutes, 0), seconds = num(data.seconds, 0);
  const totalSeconds = minutes * 60 + seconds;

  const g = gcd(sampleCars, sampleSeconds);
  const unitCars = sampleCars / g, unitSeconds = sampleSeconds / g;
  const groups = unitSeconds > 0 ? totalSeconds / unitSeconds : 0;
  const estimated = groups * unitCars;

  const nearest = (problem.choices ?? []).reduce<{ label: string; value: number } | null>((best, c) => {
    const value = Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));
    if (!Number.isFinite(value)) return best;
    if (!best || Math.abs(value - estimated) < Math.abs(best.value - estimated)) return { label: c.label, value };
    return best;
  }, null);

  const groupsOk = Number.isInteger(groups);
  const answerOk = nearest != null && String(nearest.value) === String(problem.shortAnswer ?? "").trim();
  const ok = groupsOk && answerOk && nearest?.label === problem.answer;
  const failure = !groupsOk ? `${totalSeconds} is not a whole number of ${unitSeconds}-second groups` : !answerOk ? `computed ${estimated}, stored ${problem.shortAnswer}` : `choice ${nearest?.label ?? "missing"}, stored ${problem.answer}`;

  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  const scale = totalSeconds > 0 ? (TRACK_X1 - TRACK_X0) / totalSeconds : 0;
  const tickX = (t: number) => TRACK_X0 + t * scale;
  const activeEnd = phase === 0 ? 0 : phase === 1 ? sampleSeconds : totalSeconds;
  const ticks: number[] = [];
  for (let t = 0; t <= activeEnd + 0.01; t += unitSeconds) ticks.push(Math.round(t * 100) / 100);
  const midpoint = unitSeconds > 0 ? Math.round(totalSeconds / 2 / unitSeconds) * unitSeconds : totalSeconds / 2;
  const majorLabels = phase === 0 ? [0, totalSeconds] : phase === 1 ? [0, sampleSeconds] : [0, midpoint, totalSeconds];

  const carY = TRACK_Y - 17;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 460 320" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
        <text x="230" y="16" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "convert the crossing time to seconds" : phase === 1 ? "the first sample sets the rate" : "scale that rate across the whole crossing"}
        </text>

        {phase === 0 && (
          <>
            <Chip x={40} y={40} w={90} h={34} label={`${minutes} min`} color={IND} />
            <Chip x={150} y={40} w={90} h={34} label={`${seconds} sec`} color={IND} />
            <motion.text x="253" y="62" fontSize="16" fontWeight="900" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>+</motion.text>
            <motion.text x="285" y="62" fontSize="16" fontWeight="900" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>=</motion.text>
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x="305" y="40" width="110" height="34" rx="8" fill="#dcfce7" stroke={GREEN} strokeWidth="1.8" />
              <text x="360" y="62" textAnchor="middle" fontSize="14" fontWeight="900" fill={GREEN} fontFamily={FONT}>{totalSeconds} seconds</text>
            </motion.g>
          </>
        )}

        {phase >= 1 && (
          <motion.text x="230" y="60" textAnchor="middle" fontSize="13" fontWeight="850" fill={DIM} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            crossing takes {totalSeconds} seconds
          </motion.text>
        )}

        <line x1={TRACK_X0} y1={TRACK_Y} x2={TRACK_X1} y2={TRACK_Y} stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />

        {ticks.map((t, i) => (
          <motion.line key={i} x1={tickX(t)} y1={TRACK_Y - 7} x2={tickX(t)} y2={TRACK_Y + 7} stroke={phase === 2 ? GREEN : IND} strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + (t / (activeEnd || 1)) * 1.1 }} />
        ))}

        {majorLabels.map((t, i) => (
          <text key={i} x={tickX(t)} y={TRACK_Y + 24} textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM} fontFamily={FONT}>{t}s</text>
        ))}

        {phase >= 1 && (
          <motion.g initial={{ x: tickX(0) }} animate={{ x: tickX(activeEnd) }} transition={{ duration: 1.1, delay: 0.2, ease: "linear" }}>
            <rect x={-13} y={carY - 7} width="26" height="14" rx="3" fill={IND} stroke={INK} strokeWidth="1" />
            <circle cx={-8} cy={carY + 7} r="3" fill={INK} />
            <circle cx={8} cy={carY + 7} r="3" fill={INK} />
          </motion.g>
        )}
        {phase === 0 && (
          <g>
            <rect x={tickX(0) - 13} y={carY - 7} width="26" height="14" rx="3" fill="#eef2ff" stroke={IND} strokeWidth="1.4" strokeDasharray="3 3" />
            <circle cx={tickX(0) - 8} cy={carY + 7} r="3" fill={DIM} />
            <circle cx={tickX(0) + 8} cy={carY + 7} r="3" fill={DIM} />
          </g>
        )}

        {phase === 1 && (
          <motion.text x="230" y="250" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
            {sampleCars} cars in {sampleSeconds} s = {unitCars} cars per {unitSeconds} s
          </motion.text>
        )}

        {phase === 2 && (
          <>
            <motion.text x="230" y="248" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
              {totalSeconds} ÷ {unitSeconds} = {groups} groups
            </motion.text>
            <motion.text x="230" y="268" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.55 }}>
              {groups} × {unitCars} = {estimated} ≈ <tspan fill={GREEN}>{nearest?.value ?? "?"}</tspan>
            </motion.text>
            <text x="230" y="286" textAnchor="middle" fontSize="9.3" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>
              {ok ? "group count, rounded total, and choice verified" : failure}
            </text>
            <SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={294} width={100} />
          </>
        )}
      </svg>
    </div>
  );
}
