import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

// A walker and a runner start together at one end of a straight path. The runner
// goes to the far end (distance d) and returns to meet the walker, who has
// advanced x in the same time. With runner speed = ratio × walker speed, equal
// time gives ratio·x = d + (d − x) = 2d − x, so x/d = 2/(ratio+1). The fraction
// is DERIVED from the ratio, never assumed. Data:
// { speedRatio, walkerName?, walkerIcon?, runnerName?, runnerIcon?,
//   startLabel?, endLabel?, endIcon? }.
export function RoundTripChaseScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const ratio = Math.max(1, num(data.speedRatio, 5));
  const walker = data.walkerName != null ? String(data.walkerName) : "Walker";
  const runner = data.runnerName != null ? String(data.runnerName) : "Runner";
  const walkerIcon = data.walkerIcon != null ? String(data.walkerIcon) : "🚶";
  const runnerIcon = data.runnerIcon != null ? String(data.runnerIcon) : "🏃";
  const startLabel = data.startLabel != null ? String(data.startLabel) : "Start";
  const endLabel = data.endLabel != null ? String(data.endLabel) : "End";
  const endIcon = data.endIcon != null ? String(data.endIcon) : "🎯";

  // x/d = 2/(ratio+1), reduced.
  const fNum0 = 2;
  const fDen0 = ratio + 1;
  const g = gcd(fNum0, fDen0);
  const fNum = fNum0 / g;
  const fDen = fDen0 / g;
  const f = fNum0 / fDen0;

  const last = totalSteps - 1;
  const reveal = step >= last;
  // The choices are fractions, so the badge points back to the letter.
  const answer = problem.answer ?? null;

  // Geometry
  const leftX = 40;
  const rightX = 286;
  const lineY = 104;
  const span = rightX - leftX;
  const walkerX = leftX + f * span;

  const fracText = fNum === fDen ? "1" : `${fNum}/${fDen}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox="0 0 320 190" width="100%" style={{ maxWidth: 460 }}>
        <defs>
          <marker id="rtc-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#16a34a" />
          </marker>
          <marker id="rtc-indigo" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#4338ca" />
          </marker>
        </defs>

        {/* base path */}
        <line x1={leftX} y1={lineY} x2={rightX} y2={lineY} stroke="#cbd5e1" strokeWidth="3" />

        {/* start & end markers */}
        <circle cx={leftX} cy={lineY} r="4" fill="#1f2a44" />
        <text x={leftX} y={lineY + 24} textAnchor="middle" fontSize="11" fill="#64748b">{startLabel}</text>
        <text x={rightX} y={lineY - 12} textAnchor="middle" fontSize="22">{endIcon}</text>
        <text x={rightX} y={lineY + 24} textAnchor="middle" fontSize="11" fill="#64748b">{endLabel}</text>

        {/* full-distance bracket d */}
        <line x1={leftX} y1={lineY + 40} x2={rightX} y2={lineY + 40} stroke="#94a3b8" strokeWidth="1" />
        <line x1={leftX} y1={lineY + 36} x2={leftX} y2={lineY + 44} stroke="#94a3b8" strokeWidth="1" />
        <line x1={rightX} y1={lineY + 36} x2={rightX} y2={lineY + 44} stroke="#94a3b8" strokeWidth="1" />
        <text x={(leftX + rightX) / 2} y={lineY + 54} textAnchor="middle" fontSize="12" fontWeight="700" fill="#64748b" fontFamily={numberFont}>d</text>

        {!reveal && (
          <>
            {/* both start together, with speeds */}
            <text x={leftX} y={lineY - 12} textAnchor="middle" fontSize="18">{walkerIcon}</text>
            <text x={leftX} y={lineY - 30} textAnchor="middle" fontSize="11" fontWeight="700" fill="#4338ca" fontFamily={numberFont}>speed v</text>
            <text x={leftX + 30} y={lineY - 46} textAnchor="middle" fontSize="18">{runnerIcon}</text>
            <text x={leftX + 30} y={lineY - 62} textAnchor="middle" fontSize="11" fontWeight="700" fill="#16a34a" fontFamily={numberFont}>speed {ratio}v</text>
          </>
        )}

        {reveal && (
          <>
            {/* Luna out to the tree (above), then back to the walker (below) */}
            <path
              d={`M ${leftX} ${lineY - 6} Q ${(leftX + rightX) / 2} ${lineY - 52} ${rightX} ${lineY - 6}`}
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeDasharray="5 4"
              markerEnd="url(#rtc-green)"
            />
            <path
              d={`M ${rightX} ${lineY + 8} Q ${(rightX + walkerX) / 2} ${lineY + 30} ${walkerX + 4} ${lineY + 6}`}
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeDasharray="5 4"
              markerEnd="url(#rtc-green)"
            />
            <text x={(leftX + rightX) / 2} y={lineY - 56} textAnchor="middle" fontSize="11" fontWeight="700" fill="#16a34a" fontFamily={numberFont}>
              {runner}: {ratio}x = 2d − x
            </text>

            {/* Miguel's covered segment x */}
            <line x1={leftX} y1={lineY} x2={walkerX} y2={lineY} stroke="#4338ca" strokeWidth="4" markerEnd="url(#rtc-indigo)" />
            <text x={(leftX + walkerX) / 2} y={lineY + 18} textAnchor="middle" fontSize="12" fontWeight="700" fill="#4338ca" fontFamily={numberFont}>x</text>

            {/* both meet at walkerX */}
            <text x={walkerX} y={lineY - 12} textAnchor="middle" fontSize="18">{walkerIcon}</text>
            <text x={walkerX + 16} y={lineY - 12} textAnchor="middle" fontSize="16">{runnerIcon}</text>
          </>
        )}
      </svg>

      <AnimatePresence>
        {reveal && (
          <motion.div
            key="algebra"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ fontFamily: numberFont, fontSize: 16, fontWeight: 800, color: "#1f2a44", textAlign: "center" }}
          >
            {ratio}x = 2d − x&nbsp;&nbsp;→&nbsp;&nbsp;{ratio + 1}x = 2d&nbsp;&nbsp;→&nbsp;&nbsp;
            <span style={{ color: "#4338ca" }}>x = {fracText}·d</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reveal && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            {walker} covers {fracText} → Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
