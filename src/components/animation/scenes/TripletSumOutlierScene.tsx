import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

type Triplet = { label: string; text: string; values: number[] };

function parseTriplets(raw: unknown): Triplet[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const o = (r ?? {}) as Record<string, unknown>;
    return {
      label: String(o.label ?? "?"),
      text: String(o.text ?? ""),
      values: Array.isArray(o.values) ? (o.values as unknown[]).map(Number) : [],
    };
  });
}

/**
 * Five triplets of numbers, four of which sum to a target and one which
 * doesn't. Rather than asserting the odd one out, every triplet's sum is
 * computed and checked, in the same grouped order the written solution
 * uses (the three easy ones together, then the trap, then the last check)
 * so the "different" one is discovered, not declared.
 * Data: { target, triplets: [{label, text, values:[a,b,c]}, ...] }.
 */
export function TripletSumOutlierScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const target = Number(data.target ?? 1);
  const triplets = parseTriplets(data.triplets);
  const EPS = 0.01;
  const sums = triplets.map((t) => t.values.reduce((a, b) => a + b, 0));
  const outlierIdx = sums.findIndex((s) => Math.abs(s - target) > EPS);
  const outlier = triplets[outlierIdx];
  const answer = answerOf(problem);
  const valid = outlierIdx >= 0 && triplets[outlierIdx]?.label === problem.answer;

  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), last);
  // 0: setup, 1: check A/B/C, 2: check D (mismatch), 3: check E, 4: conclude
  const revealedUpTo = beat === 1 ? 2 : beat === 2 ? 3 : beat >= 3 ? 4 : -1;
  const isRevealed = (i: number) => i <= revealedUpTo;

  const W = 400;
  const rowH = 38;
  const H = 40 + triplets.length * rowH + 44;

  const caption =
    beat === 0
      ? `five triplets — which one does NOT sum to ${target}?`
      : beat === 1
      ? "choices A, B, C each sum to 1"
      : beat === 2
      ? `choice D sums to ${sums[3]} — not ${target}`
      : beat === 3
      ? "choice E still sums to 1, confirming D is the only outlier"
      : `${outlier?.label ?? "?"} is the odd one out`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px", boxSizing: "border-box" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 420, minWidth: 0, display: "block" }} aria-label="Five triplets of numbers, checking each sum against the target">
        <text x={W / 2} y="18" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK} fontFamily={FONT}>
          which triplet does not sum to {target}?
        </text>

        {triplets.map((t, i) => {
          const y = 40 + i * rowH;
          const revealed = isRevealed(i);
          const isOutlier = revealed && i === outlierIdx;
          const rowColor = !revealed ? DIM : isOutlier ? RED : GREEN;
          return (
            <motion.g key={t.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <rect x="14" y={y} width={W - 28} height={rowH - 8} rx="8" fill={isOutlier ? "#fef2f2" : revealed ? "#f0fdf4" : "#f8fafc"} stroke={isOutlier ? RED : revealed ? GREEN : "#cbd5e1"} strokeWidth={isOutlier ? 2.2 : 1.3} />
              <text x="26" y={y + 20} fontSize="12" fontWeight="900" fill={rowColor} fontFamily={FONT}>
                {t.label}
              </text>
              <text x="54" y={y + 20} fontSize="11" fontWeight="700" fill={INK} fontFamily={FONT}>
                {t.text}
              </text>
              <AnimatePresence>
                {revealed && (
                  <motion.text key="sum" x={W - 40} y={y + 20} textAnchor="end" fontSize="13" fontWeight="950" fill={rowColor} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>
                    = {Number.isInteger(sums[i]) ? sums[i] : sums[i].toFixed(2)}
                  </motion.text>
                )}
              </AnimatePresence>
            </motion.g>
          );
        })}

        <SvgAnswerBadge show={beat >= 4} answer={answer} cx={W / 2} y={H - 32} width={230} />
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 11.5,
          fontWeight: 800,
          color: beat === 2 ? RED : beat >= 4 ? (valid ? "#166534" : RED) : INK,
          background: beat === 2 ? "#fef2f2" : beat >= 4 ? (valid ? "#dcfce7" : "#fef2f2") : "#eef2ff",
          border: `1px solid ${beat === 2 ? "#fecaca" : beat >= 4 ? (valid ? "#bbf7d0" : "#fecaca") : "#c7d2fe"}`,
          padding: "5px 12px",
          borderRadius: 10,
          textAlign: "center",
          maxWidth: 380,
        }}
      >
        {caption}
      </motion.span>
    </div>
  );
}
