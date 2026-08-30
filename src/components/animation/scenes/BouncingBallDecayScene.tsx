import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/**
 * A ball dropped from a fixed height bounces to a fraction of the previous
 * peak each time, asking which bounce first fails to clear a threshold. The
 * scene draws every peak as a real bar — the drop, then each bounce — next
 * to a dashed threshold line, revealing one bounce at a time and comparing
 * it live, so the first bar that dips under the line is found by looking,
 * not asserted.
 * Data: { dropHeight, firstNum, firstDen, ratioNum, ratioDen, thresholdNum, thresholdDen }.
 */
export function BouncingBallDecayScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const dropHeight = Math.max(0.1, num(data.dropHeight, 3));
  const firstNum = Math.max(1, Math.round(num(data.firstNum, 2)));
  const firstDen = Math.max(1, Math.round(num(data.firstDen, 1)));
  const ratioNum = Math.max(1, Math.round(num(data.ratioNum, 2)));
  const ratioDen = Math.max(1, Math.round(num(data.ratioDen, 3)));
  const thresholdNum = Math.max(1, Math.round(num(data.thresholdNum, 1)));
  const thresholdDen = Math.max(1, Math.round(num(data.thresholdDen, 2)));
  const threshold = thresholdNum / thresholdDen;

  type Bounce = { n: number; d: number; val: number; str: string };
  const bounces: Bounce[] = [];
  let n = firstNum;
  let d = firstDen;
  for (let i = 0; i < 10; i++) {
    const g = gcd(n, d) || 1;
    const rn = n / g;
    const rd = d / g;
    const val = rn / rd;
    bounces.push({ n: rn, d: rd, val, str: rd === 1 ? String(rn) : `${rn}/${rd}` });
    if (val < threshold) break;
    n = n * ratioNum;
    d = d * ratioDen;
  }
  const failBounce = bounces.length;
  const matches = problem.shortAnswer == null || String(failBounce) === String(problem.shortAnswer);
  const failure = !matches ? `check failed: bounce ${failBounce} first dips below ${thresholdNum}/${thresholdDen}, stored answer is ${problem.shortAnswer}` : "";

  const lastStep = totalSteps - 1;
  const revealed = Math.min(bounces.length, step);
  const isFinal = step >= lastStep;

  // ---- geometry ----
  const W = 320;
  const H = 200;
  const baseY = 170;
  const padT = 16;
  const maxVal = Math.max(dropHeight, ...bounces.map((b) => b.val)) * 1.1;
  const sy = (v: number) => baseY - (v / maxVal) * (baseY - padT);
  const slots = bounces.length + 1; // drop + each bounce
  const slotW = (W - 24) / slots;
  const barW = slotW * 0.6;
  const xOf = (i: number) => 12 + i * slotW + (slotW - barW) / 2;

  const current = revealed > 0 ? bounces[revealed - 1] : null;

  const caption = isFinal
    ? `bounce ${failBounce} is the first below ${thresholdNum}/${thresholdDen} m`
    : current
    ? `bounce ${revealed}: ${current.str} m ${current.val >= threshold ? "≥" : "<"} ${thresholdNum}/${thresholdDen} m`
    : `dropped from ${dropHeight} m`;

  const note = failure || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        {/* threshold line */}
        <line x1={8} x2={W - 8} y1={sy(threshold)} y2={sy(threshold)} stroke={BAD} strokeWidth={1.4} strokeDasharray="4 3" />
        <text x={xOf(0) + barW + 6} y={sy(threshold) - 5} textAnchor="start" fontSize="9" fontWeight="800" fill={BAD} fontFamily={numberFont}>
          {thresholdNum}/{thresholdDen} m
        </text>

        <line x1={12} x2={W - 12} y1={baseY} y2={baseY} stroke={INK} strokeWidth={1.4} />

        {/* the drop */}
        <motion.rect
          x={xOf(0)}
          width={barW}
          fill={DIM}
          fillOpacity={0.6}
          stroke="#64748b"
          strokeWidth={1.2}
          initial={{ y: baseY, height: 0 }}
          animate={{ y: sy(dropHeight), height: baseY - sy(dropHeight) }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
        <text x={xOf(0) + barW / 2} y={sy(dropHeight) - 6} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#64748b" fontFamily={numberFont}>
          {dropHeight}
        </text>
        <text x={xOf(0) + barW / 2} y={baseY + 12} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
          drop
        </text>

        {/* each bounce */}
        {bounces.map((b, i) => {
          const show = i < revealed;
          const below = b.val < threshold;
          const color = below ? BAD : IND;
          return (
            <g key={i}>
              <AnimatePresence>
                {show && (
                  <motion.rect
                    x={xOf(i + 1)}
                    width={barW}
                    fill={color}
                    fillOpacity={0.75}
                    stroke={color}
                    strokeWidth={1.4}
                    initial={{ y: baseY, height: 0 }}
                    animate={{ y: sy(b.val), height: baseY - sy(b.val) }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  />
                )}
              </AnimatePresence>
              {show && (
                <motion.text
                  x={xOf(i + 1) + barW / 2}
                  y={sy(b.val) - 6}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="800"
                  fill={color}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {b.str}
                </motion.text>
              )}
              <text x={xOf(i + 1) + barW / 2} y={baseY + 12} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                #{i + 1}
              </text>
            </g>
          );
        })}
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
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}
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
