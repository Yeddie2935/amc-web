import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const DIM = "#94a3b8";

/**
 * A point located a stated fraction of the way along a number-line segment.
 * The segment is split into as many equal parts as the fraction's
 * denominator, so the target point lands exactly on a division mark rather
 * than at an eyeballed position, then that mark's milepost is read off
 * directly instead of only computed algebraically.
 * Data: { start, end, num, den }.
 */
export function IntervalFractionMarkScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const start = Math.round(num(data.start, 40));
  const end = Math.round(num(data.end, 160));
  const fracNum = Math.round(num(data.num, 3));
  const fracDen = Math.round(num(data.den, 4));
  const distance = end - start;
  const partLen = distance / fracDen;
  const offset = partLen * fracNum;
  const target = start + offset;
  const answer = answerOf(problem);
  const valid = String(target) === (problem.shortAnswer ?? "").replace(/[^\d]/g, "");

  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), last);
  // 0: two endpoints, 1: total distance, 2: split into den equal parts, 3: count num parts, 4: add to start + answer
  const showDistance = beat >= 1;
  const showSplit = beat >= 2;
  const showCount = beat >= 3;
  const showConclude = beat >= 4;

  const W = 380;
  const H = 190;
  const lineY = 70;
  const x0 = 30;
  const x1 = W - 30;
  const px = (v: number) => x0 + ((v - start) / distance) * (x1 - x0);

  const caption =
    beat === 0
      ? `exits at milepost ${start} and ${end}`
      : beat === 1
      ? `distance: ${end} − ${start} = ${distance}`
      : beat === 2
      ? `split into ${fracDen} equal parts of ${partLen} miles each`
      : beat === 3
      ? `${fracNum}/${fracDen} of the way: ${fracNum} × ${partLen} = ${offset}`
      : `${start} + ${offset} = ${target}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px", boxSizing: "border-box" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 420, minWidth: 0, display: "block" }} aria-label="A number line from the third exit to the tenth exit, marking three-fourths of the way">
        <line x1={x0} y1={lineY} x2={x1} y2={lineY} stroke={INK} strokeWidth="2.4" />

        {/* endpoints */}
        <circle cx={x0} cy={lineY} r="5" fill={INK} />
        <text x={x0} y={lineY - 14} textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>
          {start}
        </text>
        <circle cx={x1} cy={lineY} r="5" fill={INK} />
        <text x={x1} y={lineY - 14} textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>
          {end}
        </text>

        {/* distance brace */}
        <AnimatePresence>
          {showDistance && !showSplit && (
            <motion.text key="dist" x={(x0 + x1) / 2} y={lineY + 30} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {distance} miles apart
            </motion.text>
          )}
        </AnimatePresence>

        {/* division marks */}
        <AnimatePresence>
          {showSplit &&
            Array.from({ length: fracDen + 1 }, (_, i) => {
              const v = start + i * partLen;
              const x = px(v);
              const isTargetMark = i === fracNum;
              const passed = showCount && i <= fracNum;
              return (
                <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, type: "spring" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <line x1={x} y1={lineY - 8} x2={x} y2={lineY + 8} stroke={isTargetMark && showCount ? GREEN : passed ? IND : DIM} strokeWidth={isTargetMark && showCount ? 3 : 1.6} />
                  {i > 0 && i < fracDen && (
                    <text x={x} y={lineY + 24} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={passed ? IND : DIM} fontFamily={FONT}>
                      {i}/{fracDen}
                    </text>
                  )}
                </motion.g>
              );
            })}
        </AnimatePresence>

        {/* target marker */}
        <AnimatePresence>
          {showCount && (
            <motion.g key="target" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 15 }}>
              <circle cx={px(target)} cy={lineY} r="7" fill={GREEN} stroke="#fff" strokeWidth="1.6" />
              <text x={px(target)} y={lineY - 32} textAnchor="middle" fontSize="13" fontWeight="950" fill={GREEN} fontFamily={FONT}>
                service center
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <text x={W / 2} y={H - 40} textAnchor="middle" fontSize="12" fontWeight="900" fill={showConclude ? (valid ? GREEN : "#dc2626") : INK} fontFamily={FONT}>
          {showConclude ? `milepost ${target}` : ""}
        </text>

        <SvgAnswerBadge show={showConclude} answer={answer} cx={W / 2} y={H - 30} width={92} />
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
          color: showConclude ? (valid ? "#166534" : "#dc2626") : INK,
          background: showConclude ? (valid ? "#dcfce7" : "#fef2f2") : "#eef2ff",
          border: `1px solid ${showConclude ? (valid ? "#bbf7d0" : "#fecaca") : "#c7d2fe"}`,
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
