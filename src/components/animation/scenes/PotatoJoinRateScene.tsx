import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * A helper who joins late only works the *remaining* pile at the *combined*
 * rate — the scene drains a real pile of potatoes at Homer's solo rate for
 * the real head-start minutes, switches to the combined rate once Christen
 * joins, and finds how long that second phase runs from the real leftover
 * amount. A beat is spent on the trap of reporting Homer's grand total
 * (counting his own head start) instead of Christen's.
 * Data: { total, homerRate, headStart, christenRate }.
 */
export function PotatoJoinRateScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = Math.max(1, Math.round(num(data.total, 44)));
  const homerRate = Math.max(1, num(data.homerRate, 3));
  const headStart = Math.max(1, num(data.headStart, 4));
  const christenRate = Math.max(1, num(data.christenRate, 5));

  const homerSolo = homerRate * headStart;
  const remaining = total - homerSolo;
  const combinedRate = homerRate + christenRate;
  const jointMinutes = remaining / combinedRate;
  const christenTotal = christenRate * jointMinutes;
  const answerOk = problem.shortAnswer == null || `${christenTotal} potatoes` === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${christenTotal}, stored answer is ${problem.shortAnswer}` : "";

  const homerTotalMinutes = headStart + jointMinutes;
  const homerGrandTotal = homerRate * homerTotalMinutes;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(homerGrandTotal));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showJoint = step >= 2 || isFinal;

  const W = 300;
  const H = 200;
  const pileX = 150;
  const pileTopY = 24;
  const pileH = 130;
  const afterSoloFrac = remaining / total;
  const level = showJoint ? 0 : afterSoloFrac;

  const caption = isFinal
    ? `${christenRate} × ${jointMinutes} = ${christenTotal} potatoes`
    : showJoint
    ? `${remaining} ÷ ${combinedRate} = ${jointMinutes} minutes together`
    : showTrap
    ? trapChoice
      ? `Homer's own total is ${homerRate} × ${homerTotalMinutes} = ${homerGrandTotal} — choice ${trapChoice.label}, but that's Homer's count, not Christen's`
      : `Homer's own total works out to ${homerGrandTotal}, not what's asked`
    : `Homer alone: ${homerRate} × ${headStart} = ${homerSolo}, leaving ${remaining}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <rect x={pileX - 50} y={pileTopY} width={100} height={pileH} fill="none" stroke={INK} strokeWidth={2.5} />
        <motion.rect
          x={pileX - 48}
          y={pileTopY + 2}
          width={96}
          height={pileH - 4}
          fill="#d4a373"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: level }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
        />
        <text x={pileX} y={pileTopY + pileH + 18} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {total} potatoes
        </text>

        <text x={40} y={40} fontSize="10.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
          Homer: {homerRate}/min
        </text>
        {showJoint && (
          <motion.text x={40} y={58} fontSize="10.5" fontWeight="800" fill={TEAL} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            Christen: {christenRate}/min
          </motion.text>
        )}

        {showTrap && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
            <rect x={30} y={150} width={240} height={30} rx={8} fill="#fee2e2" stroke={BAD} strokeWidth={1.3} />
            <text x={150} y={170} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
              Homer's grand total: {homerGrandTotal}?
            </text>
          </motion.g>
        )}

        {(showJoint || isFinal) && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
            <rect x={30} y={150} width={240} height={30} rx={8} fill="#dcfce7" stroke={WIN} strokeWidth={1.4} />
            <text x={150} y={170} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              Christen: {christenRate} × {jointMinutes} = {christenTotal}
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
          fontSize: 11.5,
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
