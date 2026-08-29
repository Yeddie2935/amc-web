import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";

/**
 * Two trees in a fixed height ratio, where the difference between their
 * heights — the extra segment on top of the taller one — is given in feet.
 * That extra segment is exactly one ratio-part, so it sizes every part at
 * once. The real trap is which tree the question asks for: the shorter
 * tree's height (3 parts) is a clean number too, and it's sitting right on
 * the answer list, so the scene computes it explicitly and flags it before
 * landing on the taller tree.
 *
 * data: { shortParts, tallParts, diffFeet }
 */
export function TreeHeightRatioScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const shortParts = num(data.shortParts, 3);
  const tallParts = num(data.tallParts, 4);
  const diffFeet = num(data.diffFeet, 16);

  const partFeet = diffFeet / (tallParts - shortParts);
  const shortHeight = shortParts * partFeet;
  const tallHeight = tallParts * partFeet;
  const ok = String(Math.round(tallHeight)) === (problem.shortAnswer ?? "").trim();

  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === Math.round(shortHeight) && String(c.label) !== problem.answer
  );

  // ---- beats: 0 setup, 1 the difference is 1 part, 2 the trap (shorter tree), 3 the taller tree, 4 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 4));
  const isFinal = step >= last;

  const W = 340;
  const H = 280;
  const baseY = 230;
  const scale = 150 / tallHeight;
  const shortH = shortHeight * scale;
  const tallH = tallHeight * scale;
  const partH = partFeet * scale;
  const shortX = 110;
  const tallX = 220;
  const barW = 46;

  const caption =
    beat === 0
      ? `trees at a ${shortParts}:${tallParts} ratio, tops ${diffFeet} ft apart`
      : beat === 1
      ? `${tallParts} − ${shortParts} = 1 part = ${diffFeet} ft`
      : beat === 2
      ? `${shortParts} × ${partFeet} = ${shortHeight} ft — that's the shorter tree`
      : beat === 3
      ? `${tallParts} × ${partFeet} = ${tallHeight} ft`
      : `taller tree = ${tallHeight} ft`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        <line x1={40} y1={baseY} x2={W - 30} y2={baseY} stroke={INK} strokeWidth={2} />

        {/* the shorter tree */}
        <motion.rect
          x={shortX - barW / 2}
          width={barW}
          fill={TEAL}
          fillOpacity={beat === 2 ? 0.85 : 0.5}
          stroke={TEAL}
          strokeWidth={beat === 2 ? 2.4 : 1.6}
          initial={{ y: baseY, height: 0 }}
          animate={{ y: baseY - shortH, height: shortH }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
        />
        <text x={shortX} y={baseY + 16} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={TEAL} fontFamily={FONT}>
          {shortParts} parts
        </text>

        {/* the taller tree, split into its "shared" base + the extra top part */}
        <motion.rect
          x={tallX - barW / 2}
          width={barW}
          fill={IND}
          fillOpacity={beat === 3 || isFinal ? 0.85 : 0.5}
          stroke={IND}
          strokeWidth={beat === 3 || isFinal ? 2.4 : 1.6}
          initial={{ y: baseY, height: 0 }}
          animate={{ y: baseY - tallH, height: tallH }}
          transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.1 }}
        />
        <text x={tallX} y={baseY + 16} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={IND} fontFamily={FONT}>
          {tallParts} parts
        </text>

        {/* the extra top segment, called out once we're past setup */}
        {beat >= 1 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <rect x={tallX - barW / 2} y={baseY - tallH} width={barW} height={partH} fill={BAD} fillOpacity={0.35} stroke={BAD} strokeWidth={1.6} />
            <path d={`M ${tallX + barW / 2 + 6},${baseY - tallH} L ${tallX + barW / 2 + 6},${baseY - tallH + partH}`} stroke={BAD} strokeWidth={1.6} />
            <text x={tallX + barW / 2 + 10} y={baseY - tallH + partH / 2 + 4} fontSize="9.5" fontWeight="800" fill={BAD} fontFamily={FONT}>
              {diffFeet} ft
            </text>
          </motion.g>
        )}

        {/* beat 2: the trap flag on the shorter tree */}
        {beat === 2 && (
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.6 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <text x={shortX} y={baseY - shortH - 10} textAnchor="middle" fontSize="14" fontWeight="800" fill={BAD}>
              ✗
            </text>
          </motion.g>
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : beat === 2 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 2 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 2 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 2 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 260 }}>
            {trapChoice ? `choice ${trapChoice.label} (${Math.round(shortHeight)}) is the shorter tree — the question asks for the taller one` : `the question asks for the taller tree, not the shorter one`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${Math.round(tallHeight)} but stored answer reads "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
