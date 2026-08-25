import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const FACE = "#64748b";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

function pointAt(cx: number, cy: number, deg: number, r: number) {
  const t = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(t), y: cy - r * Math.cos(t) };
}

function hoursToClock(h: number): string {
  const totalMin = Math.round(h * 60);
  const hour = Math.floor(totalMin / 60);
  const minute = ((totalMin % 60) + 60) % 60;
  let hour12 = hour % 12;
  if (hour12 <= 0) hour12 += 12;
  return `${hour12}:${String(minute).padStart(2, "0")}`;
}

/**
 * Two clocks racing at different, but proportional, speeds. Phase A plays the
 * given data point (35 car minutes against 30 real minutes) to expose the
 * 7:6 rate; phase B resets both hands to noon and sweeps them together at
 * that same rate — the car hand finishing its 7-hour lap exactly when the
 * watch hand finishes 6, which is the whole argument in one motion. Every
 * angle and label is computed from data, never asserted.
 * Data: { carMinutes, realMinutes, carElapsedHours }.
 */
export function RaceClockScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const carMin = Math.max(1, num(data.carMinutes, 35));
  const realMin = Math.max(1, num(data.realMinutes, 30));
  const carHours = Math.max(1, num(data.carElapsedHours, 7));

  const rg = gcd(carMin, realMin) || 1;
  const ratioCar = carMin / rg;
  const ratioReal = realMin / rg;
  const realHours = (carHours * realMin) / carMin;
  const answerStr = hoursToClock(realHours);
  const agrees = problem.shortAnswer == null || problem.shortAnswer === answerStr;

  // the classic slip: multiply by the ratio instead of dividing by it
  const trapHours = (carHours * carMin) / realMin;
  const trapStr = hoursToClock(trapHours);
  const trapChoice = problem.choices.find((c) => c.text.replace(/\s/g, "") === trapStr && trapStr !== answerStr);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const phaseA = step === 0;

  // phase A: the calibration minutes actually given
  const watchMinAngle = phaseA ? realMin * 6 : 0;
  const carMinAngle = phaseA ? carMin * 6 : 0;
  const watchHourAngleA = phaseA ? (realMin / 60) * 30 : 0;
  const carHourAngleA = phaseA ? (carMin / 60) * 30 : 0;

  // phase B: the full sweep to the elapsed hours
  const watchHourAngleB = !phaseA ? realHours * 30 : 0;
  const carHourAngleB = !phaseA ? carHours * 30 : 0;

  const R = 54;
  const wcx = 88;
  const ccx = 260;
  const cy = 86;
  const hourLen = R * 0.55;
  const minLen = R * 0.78;
  const formulaY = cy + R + 34;

  function Hand({ cx, deg, len, color, width }: { cx: number; deg: number; len: number; color: string; width: number }) {
    const tip = pointAt(cx, cy, deg, len);
    return (
      <motion.line
        x1={cx}
        y1={cy}
        initial={{ x2: cx, y2: cy - len }}
        animate={{ x2: tip.x, y2: tip.y }}
        transition={{ type: "spring", stiffness: 45, damping: 12 }}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    );
  }

  function Face({ cx, label, big }: { cx: number; label: string; big: boolean }) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={R} fill="#fff" stroke={INK} strokeWidth="2.4" />
        {Array.from({ length: 12 }).map((_, i) => {
          const n = i === 0 ? 12 : i;
          const p = pointAt(cx, cy, i * 30, R - 12);
          return (
            <text key={i} x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize="8" fontWeight={n === 12 ? 800 : 500} fill={n === 12 ? INK : FACE}>
              {n}
            </text>
          );
        })}
        <text x={cx} y={cy + R + 16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={big ? WIN : INK} fontFamily={numberFont}>
          {label}
        </text>
      </g>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox="0 0 340 200" width="100%" style={{ maxWidth: 360 }}>
        <text x={wcx} y={20} textAnchor="middle" fontSize="10" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          watch
        </text>
        <text x={ccx} y={20} textAnchor="middle" fontSize="10" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          car clock
        </text>

        <AnimatePresence mode="wait">
          {phaseA ? (
            <motion.g key="phaseA" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Face cx={wcx} label="12:00 + 30 min" big={false} />
              <Face cx={ccx} label="12:00 + 35 min" big={false} />
              <Hand cx={wcx} deg={watchHourAngleA} len={hourLen} color={INK} width={4} />
              <Hand cx={wcx} deg={watchMinAngle} len={minLen} color={MARK} width={3} />
              <Hand cx={ccx} deg={carHourAngleA} len={hourLen} color={INK} width={4} />
              <Hand cx={ccx} deg={carMinAngle} len={minLen} color={MARK} width={3} />
              <circle cx={wcx} cy={cy} r="4" fill={INK} />
              <circle cx={ccx} cy={cy} r="4" fill={INK} />
            </motion.g>
          ) : (
            <motion.g key="phaseB" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Face cx={wcx} label={isFinal ? answerStr : `${realHours} real hrs`} big={isFinal} />
              <Face cx={ccx} label={`${carHours} car hrs`} big={false} />
              <Hand cx={wcx} deg={watchHourAngleB} len={hourLen} color={isFinal ? WIN : INK} width={isFinal ? 5.5 : 4} />
              <Hand cx={ccx} deg={carHourAngleB} len={hourLen} color={INK} width={4} />
              <circle cx={wcx} cy={cy} r="4" fill={isFinal ? WIN : INK} />
              <circle cx={ccx} cy={cy} r="4" fill={INK} />
            </motion.g>
          )}
        </AnimatePresence>

        {/* the ratio, formed once both hands have finished their first sweep */}
        <AnimatePresence>
          {phaseA && (
            <motion.text
              key="ratio"
              x={170}
              y={formulaY}
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill={MARK}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.9 }}
            >
              {carMin}:{realMin} = {ratioCar}:{ratioReal}
            </motion.text>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!phaseA && (
            <motion.text
              key="conv"
              x={170}
              y={formulaY}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={isFinal ? WIN : MARK}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 15, delay: isFinal ? 0.2 : 1 }}
            >
              {isFinal ? `noon + ${realHours}h` : `${carHours} × ${ratioReal}/${ratioCar} = ${realHours}`}
            </motion.text>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={`${step}-cap`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {phaseA
          ? `${carMin} car minutes pass for ${realMin} real minutes → ${ratioCar}:${ratioReal}`
          : isFinal
          ? `${realHours} real hours after noon → ${answerStr}`
          : `${carHours} car hours × ${ratioReal}/${ratioCar} = ${realHours} real hours`}
      </motion.span>

      <AnimatePresence>
        {isFinal && trapChoice && (
          <motion.span
            key="trap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            flip the ratio instead → {trapStr} (choice {trapChoice.label}) — wrong direction
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees ? `${realHours} real hours checks out against ${carHours} car hours at ${ratioCar}:${ratioReal}` : `computed ${answerStr} but the stored answer differs`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.15 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
