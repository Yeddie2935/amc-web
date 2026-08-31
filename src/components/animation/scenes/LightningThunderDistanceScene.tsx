import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * Sound covers a real distance during the real delay between flash and
 * thunder, so the scene races a lightning bolt's instant flash against a
 * sound wave that only starts after the real gap, travels at the real
 * speed, and gets converted from feet to miles before rounding to the
 * nearest half-mile — with a beat on the trap of rounding up out of habit
 * instead of down to the nearer half-mile mark.
 * Data: { delaySeconds, speedFtPerSec, feetPerMile, roundTo }.
 */
export function LightningThunderDistanceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const delay = Math.max(0.1, num(data.delaySeconds, 10));
  const speed = Math.max(1, num(data.speedFtPerSec, 1088));
  const feetPerMile = Math.max(1, num(data.feetPerMile, 5280));
  const roundTo = Math.max(0.1, num(data.roundTo, 0.5));

  const feet = speed * delay;
  const miles = feet / feetPerMile;
  const rounded = Math.round(miles / roundTo) * roundTo;
  const roundedUp = Math.ceil(miles / roundTo) * roundTo;
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1).replace(/\.0$/, ""));
  const answerOk = problem.shortAnswer == null || `${fmt(rounded)} miles` === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${fmt(rounded)} miles, stored answer is ${problem.shortAnswer}` : "";

  const normalize = (t: string) => t.replace(/[−–—]/g, "-");
  const parseChoice = (text: string) => {
    const t = normalize(text).trim();
    const m = t.match(/^(\d+)\s+(\d+)\/(\d+)$/);
    if (m) return Number(m[1]) + Number(m[2]) / Number(m[3]);
    return Number(t.replace(/[^\d.]/g, ""));
  };
  const trapChoice = (problem.choices ?? []).find((c) => Math.abs(parseChoice(c.text) - roundedUp) < 1e-9 && roundedUp !== rounded);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showFeet = step >= 1;
  const showMiles = step >= 2 || isFinal;
  const showRoundTrap = step === 2 && !isFinal;

  const W = 300;
  const H = 190;
  const trackX0 = 30;
  const trackX1 = 270;
  const trackY = 90;

  const caption = isFinal
    ? `${miles.toFixed(2)} rounds to ${fmt(rounded)} miles`
    : showRoundTrap
    ? trapChoice
      ? `rounding up gives ${fmt(roundedUp)} — choice ${trapChoice.label} — but ${miles.toFixed(2)} is closer to ${fmt(rounded)}`
      : `${miles.toFixed(2)} rounds to the nearer half-mile, ${fmt(rounded)}`
    : showMiles
    ? `${feet} ÷ ${feetPerMile} ≈ ${miles.toFixed(2)} miles`
    : showFeet
    ? `${speed} × ${delay} = ${feet} feet`
    : `flash, then ${delay} seconds later, thunder`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <text x={trackX0 - 10} y={30} fontSize="20">
          ⚡
        </text>
        <text x={trackX1 - 6} y={30} fontSize="16">
          👂
        </text>
        <line x1={trackX0} y1={trackY} x2={trackX1} y2={trackY} stroke="#e2e8f0" strokeWidth={8} strokeLinecap="round" />

        {showFeet && (
          <motion.rect
            x={trackX0}
            y={trackY - 4}
            width={trackX1 - trackX0}
            height={8}
            rx={4}
            fill={IND}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: "linear" }}
            style={{ transformBox: "fill-box", transformOrigin: "left" }}
          />
        )}

        <text x={(trackX0 + trackX1) / 2} y={trackY - 16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {delay}s at {speed} ft/s
        </text>

        {showFeet && (
          <motion.text x={(trackX0 + trackX1) / 2} y={trackY + 26} textAnchor="middle" fontSize="13" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16, delay: 1 }}>
            {feet} feet
          </motion.text>
        )}

        {showMiles && (
          <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={W / 2 - 80} y={140} width={160} height={30} rx={8} fill="#eef2ff" stroke={IND} strokeWidth={1.3} />
            <text x={W / 2} y={160} textAnchor="middle" fontSize="12" fontWeight="800" fill={IND} fontFamily={numberFont}>
              ÷ {feetPerMile} ≈ {miles.toFixed(2)} mi
            </text>
          </motion.g>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : showRoundTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showRoundTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showRoundTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
