import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const AMBER = "#b45309";
const WIN = "#16a34a";
const DIM = "#cbd5e1";

/**
 * Every student owns a dog or a cat or both — no one owns neither, so the
 * two ownership ranges must together cover the whole line of students. The
 * scene lines every student up in one row, pushes the dog-owning range in
 * from the left and the cat-owning range in from the right, and since their
 * combined length overshoots the row, they are forced to overlap in the
 * middle — that forced overlap band, counted directly, is the answer.
 * Data: { total, aCount, bCount, aLabel, bLabel, aIcon, bIcon }.
 */
export function PetOverlapLineScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = Math.max(1, Math.round(num(data.total, 39)));
  const aCount = Math.max(0, Math.round(num(data.aCount, 20)));
  const bCount = Math.max(0, Math.round(num(data.bCount, 26)));
  const aLabel = data.aLabel != null ? String(data.aLabel) : "dog";
  const bLabel = data.bLabel != null ? String(data.bLabel) : "cat";
  const aIcon = data.aIcon != null ? String(data.aIcon) : "🐶";
  const bIcon = data.bIcon != null ? String(data.bIcon) : "🐱";

  const aStart = 0;
  const aEnd = Math.min(total, aCount) - 1;
  const bStart = Math.max(0, total - bCount);
  const bEnd = total - 1;
  const overlapStart = Math.max(aStart, bStart);
  const overlapEnd = Math.min(aEnd, bEnd);
  const both = Math.max(0, overlapEnd - overlapStart + 1);

  const naive = aCount + bCount - total;
  const matches = problem.shortAnswer == null || String(both) === String(problem.shortAnswer);
  const failure = both !== naive ? `check failed: overlap band is ${both}, but ${aCount}+${bCount}-${total}=${naive}` : !matches ? `check failed: overlap ${both}, stored answer is ${problem.shortAnswer}` : "";

  const lastStep = totalSteps - 1;
  const showA = step >= 1;
  const showB = step >= 2;
  const showOverlap = step >= 3;
  const isFinal = step >= lastStep;

  // ---- geometry: one row of `total` small dots ----
  const spacing = Math.min(9, 300 / total);
  const r = Math.min(3.2, spacing * 0.4);
  const W = total * spacing + 24;
  const H = 140;
  const rowY = 40;
  const x0 = 12;
  const cx = (i: number) => x0 + i * spacing + spacing / 2;

  const barY = (n: number) => rowY + 16 + n * 14;

  const caption = isFinal
    ? `${aCount} + ${bCount} − ${total} = ${both}`
    : showOverlap
    ? `${aCount} + ${bCount} = ${aCount + bCount}, which is ${both} more than ${total} — they must overlap by ${both}`
    : showB
    ? `${bCount} have a ${bLabel}, pushed in from the right`
    : showA
    ? `${aCount} have a ${aLabel}, pushed in from the left`
    : `${total} students, each with a ${aLabel} or a ${bLabel} or both`;

  const note = failure || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* the row of students */}
        {Array.from({ length: total }).map((_, i) => {
          const inA = showA && i >= aStart && i <= aEnd;
          const inB = showB && i >= bStart && i <= bEnd;
          const inOverlap = showOverlap && i >= overlapStart && i <= overlapEnd;
          const fill = inOverlap ? AMBER : inA && inB ? AMBER : inB ? TEAL : inA ? IND : DIM;
          return <circle key={i} cx={cx(i)} cy={rowY} r={r} fill={fill} />;
        })}

        {/* dog range bracket */}
        <AnimatePresence>
          {showA && (
            <motion.g key="a" initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ type: "spring", stiffness: 180, damping: 20 }} style={{ transformBox: "fill-box", transformOrigin: "left" }}>
              <line x1={cx(aStart) - r} x2={cx(aEnd) + r} y1={barY(0)} y2={barY(0)} stroke={IND} strokeWidth={3} strokeLinecap="round" />
            </motion.g>
          )}
        </AnimatePresence>
        {showA && (
          <text x={x0} y={barY(0) + 12} fontSize="9.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
            {aIcon} {aLabel}: {aCount}
          </text>
        )}

        {/* cat range bracket */}
        <AnimatePresence>
          {showB && (
            <motion.g key="b" initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ type: "spring", stiffness: 180, damping: 20 }} style={{ transformBox: "fill-box", transformOrigin: "right" }}>
              <line x1={cx(bStart) - r} x2={cx(bEnd) + r} y1={barY(1)} y2={barY(1)} stroke={TEAL} strokeWidth={3} strokeLinecap="round" />
            </motion.g>
          )}
        </AnimatePresence>
        {showB && (
          <text x={W - 12} y={barY(1) + 12} textAnchor="end" fontSize="9.5" fontWeight="800" fill={TEAL} fontFamily={numberFont}>
            {bIcon} {bLabel}: {bCount}
          </text>
        )}

        {/* overlap band, called out */}
        <AnimatePresence>
          {showOverlap && (
            <motion.g key="ov" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.2 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={cx(overlapStart) - r - 2} y={rowY - 8} width={cx(overlapEnd) - cx(overlapStart) + 2 * r + 4} height={16} rx={4} fill="none" stroke={AMBER} strokeWidth={1.6} strokeDasharray="3 2" />
              <text x={(cx(overlapStart) + cx(overlapEnd)) / 2} y={barY(2) + 14} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={AMBER} fontFamily={numberFont}>
                both: {both}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
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
        {caption}
      </motion.span>

      <AnimatePresence>
        {note && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#dc2626", textAlign: "center" }}
          >
            {note}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
