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
 * A crossword digit is shared by two numbers at once, so it has to satisfy
 * both — the scene lists every real 3-digit power of the down base, reads
 * off their shared middle digit, then has to survive the trap of grabbing
 * any 3-digit power of the across base without checking it actually starts
 * with that shared digit, before filtering the real candidates down to the
 * one that fits and reading its outlined digit.
 * Data: { downBase, acrossBase, downDigits, acrossDigits, sharedDownIndex,
 * outlinedAcrossIndex }.
 */
export function CrossNumberPowerScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const downBase = Math.max(2, Math.round(num(data.downBase, 5)));
  const acrossBase = Math.max(2, Math.round(num(data.acrossBase, 2)));
  const downDigits = Math.max(2, Math.round(num(data.downDigits, 3)));
  const acrossDigits = Math.max(2, Math.round(num(data.acrossDigits, 3)));
  const sharedDownIndex = Math.max(0, Math.round(num(data.sharedDownIndex, 1)));
  const outlinedAcrossIndex = Math.max(0, Math.round(num(data.outlinedAcrossIndex, 2)));

  const nDigitPowers = (base: number, digits: number) => {
    const lo = Math.pow(10, digits - 1);
    const hi = Math.pow(10, digits) - 1;
    const out: number[] = [];
    for (let e = 0; Math.pow(base, e) <= hi; e++) {
      const v = Math.pow(base, e);
      if (v >= lo) out.push(v);
    }
    return out;
  };

  const downCandidates = nDigitPowers(downBase, downDigits);
  const sharedDigits = downCandidates.map((v) => String(v)[sharedDownIndex]);
  const allSameShared = sharedDigits.every((d) => d === sharedDigits[0]);
  const sharedDigit = sharedDigits[0];

  const acrossAll = nDigitPowers(acrossBase, acrossDigits);
  const acrossMatches = acrossAll.filter((v) => String(v)[0] === sharedDigit);
  const winner = acrossMatches[0];
  const outlinedDigit = winner != null ? String(winner)[outlinedAcrossIndex] : "?";
  const answerOk = problem.shortAnswer == null || outlinedDigit === String(problem.shortAnswer).trim();
  const failure = !allSameShared
    ? "the down candidates don't share a common digit"
    : acrossMatches.length !== 1
    ? `${acrossMatches.length} across candidates start with ${sharedDigit}, expected exactly 1`
    : !answerOk
    ? `outlined digit computed as ${outlinedDigit}, stored answer is ${problem.shortAnswer}`
    : "";

  const trapWinner = acrossAll.find((v) => v !== winner);
  const trapDigit = trapWinner != null ? String(trapWinner)[outlinedAcrossIndex] : null;
  const trapChoice = trapDigit != null ? (problem.choices ?? []).find((c) => String(c.text).trim() === trapDigit) : undefined;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showFilter = step >= 2 || isFinal;

  const W = 300;
  const H = 200;
  const cell = 34;
  const gx = 40;
  const gy = 30;

  const caption = isFinal
    ? `${winner} starts with ${sharedDigit}, so the outlined digit is ${outlinedDigit}`
    : showFilter
    ? `only ${acrossBase}^m = ${winner} among {${acrossAll.join(", ")}} starts with ${sharedDigit}`
    : showTrap
    ? trapChoice
      ? `picking ${trapWinner} without checking gives digit ${trapDigit} — choice ${trapChoice.label}, but it doesn't start with ${sharedDigit}`
      : `any 3-digit power of ${acrossBase} might look right without checking the shared digit`
    : `${downBase}^n candidates: ${downCandidates.join(", ")} — both share digit ${sharedDigit} in position ${sharedDownIndex + 1}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {Array.from({ length: downDigits }).map((_, r) => (
          <rect key={`d${r}`} x={gx} y={gy + r * cell} width={cell} height={cell} fill="#fff" stroke={r === sharedDownIndex ? IND : "#cbd5e1"} strokeWidth={r === sharedDownIndex ? 2.2 : 1.4} />
        ))}
        {Array.from({ length: acrossDigits }).map((_, c) => (
          <rect
            key={`a${c}`}
            x={gx + c * cell}
            y={gy + sharedDownIndex * cell}
            width={cell}
            height={cell}
            fill={c === outlinedAcrossIndex ? (showFilter ? "#dcfce7" : "#fff") : "#fff"}
            stroke={c === outlinedAcrossIndex ? WIN : "#cbd5e1"}
            strokeWidth={c === outlinedAcrossIndex ? 2.6 : 1.4}
          />
        ))}

        <AnimatePresence>
          {downCandidates.length > 0 && (
            <motion.text key="shared" x={gx + cell / 2} y={gy + sharedDownIndex * cell + cell / 2 + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              {sharedDigit}
            </motion.text>
          )}
        </AnimatePresence>

        {(showTrap || showFilter) && (
          <motion.text key="acrossword" x={gx + cell + cell / 2} y={gy + sharedDownIndex * cell + cell / 2 + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={showFilter ? WIN : BAD} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {showFilter ? String(winner)[1] : String(trapWinner)[1]}
          </motion.text>
        )}
        {showFilter && (
          <motion.text key="outlined" x={gx + outlinedAcrossIndex * cell + cell / 2} y={gy + sharedDownIndex * cell + cell / 2 + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {outlinedDigit}
          </motion.text>
        )}
        {showTrap && (
          <motion.text key="trapOutlined" x={gx + outlinedAcrossIndex * cell + cell / 2} y={gy + sharedDownIndex * cell + cell / 2 + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={BAD} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {trapDigit}
          </motion.text>
        )}

        <text x={gx - 8} y={gy + sharedDownIndex * cell - 4} fontSize="8.5" fontWeight="800" fill={DIM}>
          1 down
        </text>
        <text x={gx + cell + 4} y={gy - 8} fontSize="8.5" fontWeight="800" fill={DIM}>
          2 across
        </text>
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 300,
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
