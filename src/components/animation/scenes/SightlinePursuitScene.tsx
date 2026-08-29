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

const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(2))));

/**
 * A faster rider overtakes a slower one, staying in sight while the gap
 * between them is at most a fixed distance in front or behind. Switched
 * into the faster rider's own point of view, the slower rider drifts at a
 * constant relative speed from one edge of that visible window straight
 * through to the other — so the whole problem is one crossing at one
 * steady rate, watched rather than computed piecewise.
 *
 * The real trap is stopping at the pass: the moment the gap hits zero looks
 * like the natural endpoint, but the window is symmetric, so the ride
 * behind is exactly as long as the approach. The scene computes that
 * half-distance slip explicitly and checks it against the choices before
 * crossing the whole window.
 *
 * data: { gapMiles, fastSpeed, slowSpeed, fastName?, slowName? }
 */
export function SightlinePursuitScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const gapMiles = num(data.gapMiles, 0.5);
  const fastSpeed = num(data.fastSpeed, 12);
  const slowSpeed = num(data.slowSpeed, 8);
  const fastName = data.fastName != null ? String(data.fastName) : "Emily";
  const slowName = data.slowName != null ? String(data.slowName) : "Emerson";

  const relSpeed = fastSpeed - slowSpeed;
  const totalDist = 2 * gapMiles;
  const totalMin = (totalDist / relSpeed) * 60;
  const ok = tidy(Math.round(totalMin)) === (problem.shortAnswer ?? "").trim();

  const trapMin = (gapMiles / relSpeed) * 60;
  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === Math.round(trapMin) && String(c.label) !== problem.answer
  );

  // ---- beats: 0 setup, 1 relative speed, 2 into her frame, 3 the trap, 4 full crossing, 5 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  // ---- geometry ----
  const W = 380;
  const H = 260;
  const roadY = 130;
  const gx0 = 60;
  const gx1 = 320;
  const cx = (gx0 + gx1) / 2; // Emily's fixed position, the frame's origin
  const pxPerMile = (gx1 - gx0) / (2 * gapMiles);
  const posX = (miles: number) => cx + miles * pxPerMile;

  // Emerson's relative position: +gap (ahead) at t=0, sweeping down to -gap (behind) at t = totalMin
  const relPos = beat === 2 ? gapMiles : beat === 3 ? 0 : beat >= 4 ? -gapMiles : gapMiles;

  const caption =
    beat === 0
      ? `${fastName} spots ${slowName} ${tidy(gapMiles)} mi ahead`
      : beat === 1
      ? `${fastSpeed} − ${slowSpeed} = ${relSpeed} mph, closing`
      : beat === 2
      ? `from ${fastName}'s view, ${slowName} drifts at ${relSpeed} mph`
      : beat === 3
      ? `${tidy(gapMiles)} / ${relSpeed} × 60 = ${tidy(trapMin)} min — just the pass`
      : beat === 4
      ? `${tidy(gapMiles)} + ${tidy(gapMiles)} = ${tidy(totalDist)} mi, edge to edge`
      : `${tidy(totalDist)} / ${relSpeed} × 60 = ${tidy(Math.round(totalMin))} min`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        {/* beats 0-1: the real road, both riders at their true positions */}
        {beat <= 1 && (
          <g>
            <line x1={30} y1={roadY} x2={W - 30} y2={roadY} stroke={DIM} strokeWidth={2} />
            <motion.g initial={{ x: posX(-gapMiles) }} animate={{ x: posX(-gapMiles) }}>
              <text x={0} y={roadY - 10} textAnchor="middle" fontSize="20">
                🚲
              </text>
              <text x={0} y={roadY + 20} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={IND} fontFamily={FONT}>
                {fastName}
              </text>
            </motion.g>
            <motion.g initial={{ x: posX(gapMiles) }} animate={{ x: posX(gapMiles) }}>
              <text x={0} y={roadY - 10} textAnchor="middle" fontSize="20">
                ⛸️
              </text>
              <text x={0} y={roadY + 20} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={TEAL} fontFamily={FONT}>
                {slowName}
              </text>
            </motion.g>
            <text x={(posX(-gapMiles) + posX(gapMiles)) / 2} y={roadY - 30} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={FONT}>
              {tidy(gapMiles)} mi
            </text>
            {beat === 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <path d={`M ${posX(gapMiles) + 14},${roadY - 44} L ${posX(-gapMiles) + 24},${roadY - 44}`} stroke={BAD} strokeWidth={2} markerEnd="url(#arrow)" />
                <text x={(posX(-gapMiles) + posX(gapMiles)) / 2} y={roadY - 52} textAnchor="middle" fontSize="10" fontWeight="800" fill={BAD} fontFamily={FONT}>
                  closing at {relSpeed} mph
                </text>
              </motion.g>
            )}
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill={BAD} />
              </marker>
            </defs>
          </g>
        )}

        {/* beats 2-5: Emily's own frame — fixed at center, Emerson drifts */}
        {beat >= 2 && (
          <g>
            <rect x={gx0} y={roadY - 22} width={gx1 - gx0} height={44} rx={8} fill={beat >= 4 ? "#dcfce7" : "#f1f5f9"} stroke={beat >= 4 ? WIN : DIM} strokeWidth={1.4} opacity={0.6} />
            <line x1={gx0} y1={roadY} x2={gx1} y2={roadY} stroke={DIM} strokeWidth={1.6} />
            <path d={`M ${gx0},${roadY - 26} L ${gx0},${roadY + 26}`} stroke={INK} strokeWidth={1.2} strokeDasharray="3 3" />
            <path d={`M ${gx1},${roadY - 26} L ${gx1},${roadY + 26}`} stroke={INK} strokeWidth={1.2} strokeDasharray="3 3" />
            <text x={gx0} y={roadY + 40} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM} fontFamily={FONT}>
              −{tidy(gapMiles)} mi
            </text>
            <text x={gx1} y={roadY + 40} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM} fontFamily={FONT}>
              +{tidy(gapMiles)} mi
            </text>

            {/* Emily, fixed */}
            <text x={cx} y={roadY - 12} textAnchor="middle" fontSize="20">
              🚲
            </text>
            <text x={cx} y={roadY + 22} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={IND} fontFamily={FONT}>
              {fastName}
            </text>

            {/* Emerson, drifting per beat — always starts the sweep from the ahead edge */}
            <motion.g initial={{ x: posX(gapMiles) - cx }} animate={{ x: posX(relPos) - cx }} transition={{ type: "spring", stiffness: 90, damping: 18 }}>
              <text x={cx} y={roadY - 34} textAnchor="middle" fontSize="18">
                ⛸️
              </text>
            </motion.g>

            {/* beat 3: only the approach half shaded */}
            {beat === 3 && (
              <motion.rect x={cx} y={roadY - 22} width={gx1 - cx} height={44} fill={BAD} opacity={0.12} initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} transition={{ delay: 0.3 }} />
            )}
          </g>
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
          color: isFinal ? "#166534" : beat === 3 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 3 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 3 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 3 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 270 }}>
            {trapChoice ? `choice ${trapChoice.label} (${Math.round(trapMin)}) only counts the approach, not the ride behind too` : `she stays visible behind him just as long as she was catching up`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${tidy(Math.round(totalMin))} but stored answer reads "${problem.shortAnswer}"`}
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
