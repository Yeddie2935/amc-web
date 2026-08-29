import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const A_STROKE = "#0369a1";
const A_FILL = "#bae6fd";
const B_STROKE = "#15803d";
const B_FILL = "#86efac";

/**
 * Two rectangles compared by area, not by silhouette. Karl's 20×45 and
 * Makenna's 25×40 gardens have the *same perimeter* (130 ft each) — that's
 * the real trap here, since "same fence, same size" is the intuitive but
 * wrong read, and "the gardens are the same size" sits right there as a
 * choice. So the scene draws both plots to one shared scale, spends a beat
 * fencing each one to show the perimeters tie, then fills each in turn to
 * compute its area, and finally racks the two areas as bars to make the
 * 100 sq ft gap visible and countable rather than just printed.
 *
 * All areas/perimeters are derived from the two width/height pairs — never
 * asserted — and the closing check compares the computed larger-by-N string
 * against the stored answer text.
 *
 * data: { aName, aWidth, aHeight, bName, bWidth, bHeight }
 */
export function RectangleAreaCompareScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const aName = data.aName != null ? String(data.aName) : "A";
  const bName = data.bName != null ? String(data.bName) : "B";
  const aW = num(data.aWidth, 20);
  const aH = num(data.aHeight, 45);
  const bW = num(data.bWidth, 25);
  const bH = num(data.bHeight, 40);

  const areaA = aW * aH;
  const areaB = bW * bH;
  const perimA = 2 * (aW + aH);
  const perimB = 2 * (bW + bH);
  const samePerimeter = perimA === perimB;
  const diff = areaB - areaA;

  const largerName = diff > 0 ? bName : diff < 0 ? aName : null;
  const expected =
    diff === 0
      ? "The gardens are the same size."
      : `${largerName}'s garden is larger by ${Math.abs(diff)} square feet.`;
  const ok = expected === (problem.shortAnswer ?? "").trim();

  const trapChoice = (problem.choices ?? []).find((c) => /same size/i.test(String(c.text)));

  // ---- beats: 0 setup, 1 the perimeter trap, 2 A's area, 3 B's area, 4 compare ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 4));
  const isFinal = step >= last;

  // ---- geometry: both plots on one shared feet-per-pixel scale ----
  const W = 340;
  const H = 360;
  const baselineY = 214;
  const scale = 170 / Math.max(aH, bH, 1);
  const aRectW = aW * scale;
  const aRectH = aH * scale;
  const bRectW = bW * scale;
  const bRectH = bH * scale;
  const aCx = 95;
  const bCx = 245;
  const aX = aCx - aRectW / 2;
  const bX = bCx - bRectW / 2;
  const aY = baselineY - aRectH;
  const bY = baselineY - bRectH;

  const caption =
    beat === 0
      ? `${aName}: ${aW} ft × ${aH} ft    ${bName}: ${bW} ft × ${bH} ft`
      : beat === 1
      ? `both fences measure ${perimA} ft`
      : beat === 2
      ? `${aName}: ${aW} × ${aH} = ${areaA} ft²`
      : beat === 3
      ? `${bName}: ${bW} × ${bH} = ${areaB} ft²`
      : diff === 0
      ? `the gardens are the same size`
      : `${largerName}'s garden is larger by ${Math.abs(diff)} ft²`;

  // ---- bar chart for the final compare beat ----
  const barMaxH = 70;
  const barScale = barMaxH / Math.max(areaA, areaB, 1);
  const barAH = areaA * barScale;
  const barBH = areaB * barScale;
  const barBaseY = 340;
  const barAx = 120;
  const barBx = 200;
  const barW = 40;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        <path d={`M 14,${baselineY} L ${W - 14},${baselineY}`} stroke={INK} strokeWidth={2} />

        {/* ---- both garden outlines, always in frame ---- */}
        <motion.g initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 160, damping: 20 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }}>
          <rect x={aX} y={aY} width={aRectW} height={aRectH} fill={beat >= 2 ? A_FILL : "#fff"} stroke={A_STROKE} strokeWidth={2} />
        </motion.g>
        <motion.g initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.15 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }}>
          <rect x={bX} y={bY} width={bRectW} height={bRectH} fill={beat >= 3 ? B_FILL : "#fff"} stroke={B_STROKE} strokeWidth={2} />
        </motion.g>

        {/* the fence draw-on for the perimeter trap */}
        {beat === 1 && (
          <>
            <motion.rect x={aX} y={aY} width={aRectW} height={aRectH} fill="none" stroke={A_STROKE} strokeWidth={3.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1 }} />
            <motion.rect x={bX} y={bY} width={bRectW} height={bRectH} fill="none" stroke={B_STROKE} strokeWidth={3.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, delay: 0.2 }} />
            <motion.text x={aCx} y={baselineY + 32} textAnchor="middle" fontSize="12" fontWeight="800" fill={A_STROKE} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              {perimA} ft
            </motion.text>
            <motion.text x={bCx} y={baselineY + 32} textAnchor="middle" fontSize="12" fontWeight="800" fill={B_STROKE} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
              {perimB} ft
            </motion.text>
          </>
        )}

        {/* bracket labels above and beside each rectangle */}
        {beat !== 1 && (
          <>
            <path d={`M ${aX},${aY - 8} V ${aY - 16} H ${aX + aRectW} V ${aY - 8}`} fill="none" stroke={IND} strokeWidth={1.4} />
            <text x={aCx} y={aY - 20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND} fontFamily={FONT}>
              {aW} ft
            </text>
            <path d={`M ${aX - 8},${aY} H ${aX - 16} V ${baselineY} H ${aX - 8}`} fill="none" stroke={IND} strokeWidth={1.4} />
            <text x={aX - 24} y={(aY + baselineY) / 2} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND} fontFamily={FONT} transform={`rotate(-90 ${aX - 24} ${(aY + baselineY) / 2})`}>
              {aH} ft
            </text>

            <path d={`M ${bX},${bY - 8} V ${bY - 16} H ${bX + bRectW} V ${bY - 8}`} fill="none" stroke={IND} strokeWidth={1.4} />
            <text x={bCx} y={bY - 20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND} fontFamily={FONT}>
              {bW} ft
            </text>
            <path d={`M ${bX + bRectW + 8},${bY} H ${bX + bRectW + 16} V ${baselineY} H ${bX + bRectW + 8}`} fill="none" stroke={IND} strokeWidth={1.4} />
            <text x={bX + bRectW + 24} y={(bY + baselineY) / 2} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND} fontFamily={FONT} transform={`rotate(-90 ${bX + bRectW + 24} ${(bY + baselineY) / 2})`}>
              {bH} ft
            </text>

            <text x={aCx} y={baselineY + 16} textAnchor="middle" fontSize="10" fontWeight="700" fill={A_STROKE} fontFamily={FONT}>
              {aName}
            </text>
            <text x={bCx} y={baselineY + 16} textAnchor="middle" fontSize="10" fontWeight="700" fill={B_STROKE} fontFamily={FONT}>
              {bName}
            </text>
          </>
        )}

        {/* the sweep-fill that computes each area in turn */}
        {beat === 2 && (
          <motion.g initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "left" }}>
            <rect x={aX} y={aY} width={aRectW} height={aRectH} fill={A_FILL} stroke={A_STROKE} strokeWidth={2} />
          </motion.g>
        )}
        {beat === 3 && (
          <motion.g initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "left" }}>
            <rect x={bX} y={bY} width={bRectW} height={bRectH} fill={B_FILL} stroke={B_STROKE} strokeWidth={2} />
          </motion.g>
        )}
        {beat === 2 && (
          <motion.text x={aCx} y={aY + aRectH / 2} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, type: "spring", stiffness: 260, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {areaA} ft²
          </motion.text>
        )}
        {beat === 3 && (
          <motion.text x={bCx} y={bY + bRectH / 2} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, type: "spring", stiffness: 260, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {areaB} ft²
          </motion.text>
        )}

        {/* ---- final beat: the two areas racked as bars, the gap called out ---- */}
        {beat === 4 && (
          <g>
            <path d={`M 14,${barBaseY} L ${W - 14},${barBaseY}`} stroke="#cbd5e1" strokeWidth={1.4} />
            <motion.g initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.4 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }}>
              <rect x={barAx} y={barBaseY - barAH} width={barW} height={barAH} fill={A_FILL} stroke={A_STROKE} strokeWidth={2} />
            </motion.g>
            <motion.g initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.55 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }}>
              <rect x={barBx} y={barBaseY - barBH} width={barW} height={barBH} fill={B_FILL} stroke={B_STROKE} strokeWidth={2} />
            </motion.g>
            <text x={barAx + barW / 2} y={barBaseY - barAH - 6} textAnchor="middle" fontSize="10" fontWeight="800" fill={A_STROKE} fontFamily={FONT}>
              {areaA}
            </text>
            <text x={barBx + barW / 2} y={barBaseY - barBH - 6} textAnchor="middle" fontSize="10" fontWeight="800" fill={B_STROKE} fontFamily={FONT}>
              {areaB}
            </text>
            {diff !== 0 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                <path
                  d={`M ${barAx + barW + 6},${barBaseY - Math.min(barAH, barBH)} L ${barBx - 6},${barBaseY - Math.min(barAH, barBH)}`}
                  stroke={DIM}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <path d={`M ${(barAx + barBx + barW) / 2},${barBaseY - Math.max(barAH, barBH)} V ${barBaseY - Math.min(barAH, barBH)}`} stroke={INK} strokeWidth={1.4} />
                <text x={(barAx + barBx + barW) / 2 + 8} y={barBaseY - (barAH + barBH) / 2} fontSize="10.5" fontWeight="800" fill={INK} fontFamily={FONT}>
                  +{Math.abs(diff)}
                </text>
              </motion.g>
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
          color: isFinal ? "#166534" : beat === 1 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 1 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 1 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 1 && samePerimeter && (
          <motion.span
            key="trap-note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 260 }}
          >
            {trapChoice
              ? `same fence, different area — choice ${trapChoice.label} is a trap`
              : `same fence length does not mean the same area`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: "#dc2626", textAlign: "center" }}>
            {`check failed: computed "${expected}" but stored answer reads "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
