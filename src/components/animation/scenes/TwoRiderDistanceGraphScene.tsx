import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const A_COLOR = "#4338ca";
const B_COLOR = "#0d9488";
const GREEN = "#16a34a";
const DIM = "#94a3b8";

/**
 * Two riders' distance-vs-time lines, both starting from the origin, read
 * at a fixed hour mark. Each line is drawn growing from the origin to its
 * own reading (matching the two-line diagram this problem shows), then a
 * vertical mark at the target hour isolates both riders' distances so the
 * gap between them is a real, visible segment length before it's subtracted.
 * Data: { hours, maxMiles, readAt, aName, aMiles, bName, bMiles }.
 */
export function TwoRiderDistanceGraphScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const hours = Math.round(num(data.hours, 5));
  const maxMiles = Math.round(num(data.maxMiles, 75));
  const readAt = Math.round(num(data.readAt, 4));
  const aName = data.aName != null ? String(data.aName) : "Alberto";
  const aMiles = Math.round(num(data.aMiles, 60));
  const bName = data.bName != null ? String(data.bName) : "Bjorn";
  const bMiles = Math.round(num(data.bMiles, 35));
  const diff = aMiles - bMiles;
  const answer = answerOf(problem);
  const valid = String(diff) === (problem.shortAnswer ?? "").replace(/[^\d]/g, "");

  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), last);
  // 0: axes, 1: draw A's line, 2: draw B's line, 3: mark hour 4 + both points, 4: subtract + answer
  const showA = beat >= 1;
  const showB = beat >= 2;
  const showMark = beat >= 3;
  const showResult = beat >= 4;

  const W = 340;
  const H = 320;
  const plotX0 = 44;
  const plotY0 = 20;
  const plotW = 260;
  const plotH = 220;
  const x = (h: number) => plotX0 + (h / hours) * plotW;
  const y = (m: number) => plotY0 + plotH - (m / maxMiles) * plotH;

  const caption =
    beat === 0
      ? `${aName} and ${bName} both start at 0 miles`
      : beat === 1
      ? `${aName} reaches about ${aMiles} miles by hour ${readAt}`
      : beat === 2
      ? `${bName} reaches about ${bMiles} miles by hour ${readAt}`
      : beat === 3
      ? `at hour ${readAt}: ${aName} ${aMiles}, ${bName} ${bMiles}`
      : `${aMiles} − ${bMiles} = ${diff} miles`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px", boxSizing: "border-box" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380, minWidth: 0, display: "block" }} aria-label="Distance-time graph for two riders, comparing their distances at a fixed hour">
        {/* axes */}
        <line x1={plotX0} y1={plotY0} x2={plotX0} y2={plotY0 + plotH} stroke={INK} strokeWidth="2" />
        <line x1={plotX0} y1={plotY0 + plotH} x2={plotX0 + plotW} y2={plotY0 + plotH} stroke={INK} strokeWidth="2" />
        {Array.from({ length: hours + 1 }, (_, i) => (
          <text key={`hx${i}`} x={x(i)} y={plotY0 + plotH + 14} textAnchor="middle" fontSize="9" fontWeight="700" fill={DIM} fontFamily={FONT}>
            {i}
          </text>
        ))}
        {[0, maxMiles / 3, (2 * maxMiles) / 3, maxMiles].map((m, i) => (
          <text key={`my${i}`} x={plotX0 - 6} y={y(m) + 3} textAnchor="end" fontSize="9" fontWeight="700" fill={DIM} fontFamily={FONT}>
            {Math.round(m)}
          </text>
        ))}
        <text x={plotX0 + plotW / 2} y={270} textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>
          HOURS
        </text>
        <text x="10" y={plotY0 + plotH / 2} textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM} transform={`rotate(-90 10 ${plotY0 + plotH / 2})`}>
          MILES
        </text>

        {/* legend, kept off the lines themselves so it never overlaps them */}
        <AnimatePresence>
          {showA && (
            <motion.g key="legendA" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={plotX0 + 8} y1={plotY0 + 10} x2={plotX0 + 26} y2={plotY0 + 10} stroke={A_COLOR} strokeWidth="3" />
              <text x={plotX0 + 32} y={plotY0 + 13} fontSize="10.5" fontWeight="900" fill={A_COLOR} fontFamily={FONT}>
                {aName}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showB && (
            <motion.g key="legendB" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={plotX0 + 8} y1={plotY0 + 26} x2={plotX0 + 26} y2={plotY0 + 26} stroke={B_COLOR} strokeWidth="3" />
              <text x={plotX0 + 32} y={plotY0 + 29} fontSize="10.5" fontWeight="900" fill={B_COLOR} fontFamily={FONT}>
                {bName}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* A's line */}
        <AnimatePresence>
          {showA && (
            <motion.line key="a" x1={x(0)} y1={y(0)} x2={x(readAt)} y2={y(aMiles)} stroke={A_COLOR} strokeWidth="2.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
          )}
        </AnimatePresence>

        {/* B's line */}
        <AnimatePresence>
          {showB && (
            <motion.line key="b" x1={x(0)} y1={y(0)} x2={x(readAt)} y2={y(bMiles)} stroke={B_COLOR} strokeWidth="2.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
          )}
        </AnimatePresence>

        {/* vertical mark at the read hour + both points */}
        <AnimatePresence>
          {showMark && (
            <motion.g key="mark" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={x(readAt)} y1={plotY0} x2={x(readAt)} y2={plotY0 + plotH} stroke={DIM} strokeWidth="1.4" strokeDasharray="4 3" />
              <circle cx={x(readAt)} cy={y(aMiles)} r="4.5" fill={A_COLOR} />
              <circle cx={x(readAt)} cy={y(bMiles)} r="4.5" fill={B_COLOR} />
              {/* the gap segment */}
              <line x1={x(readAt) + 8} y1={y(aMiles)} x2={x(readAt) + 8} y2={y(bMiles)} stroke={GREEN} strokeWidth="2.4" />
            </motion.g>
          )}
        </AnimatePresence>

        <SvgAnswerBadge show={showResult} answer={answer} cx={W / 2} y={288} width={170} />
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 800,
          color: showResult ? (valid ? "#166534" : "#dc2626") : INK,
          background: showResult ? (valid ? "#dcfce7" : "#fef2f2") : "#eef2ff",
          border: `1px solid ${showResult ? (valid ? "#bbf7d0" : "#fecaca") : "#c7d2fe"}`,
          padding: "5px 12px",
          borderRadius: 10,
          textAlign: "center",
          maxWidth: 320,
        }}
      >
        {caption}
      </motion.span>
    </div>
  );
}
