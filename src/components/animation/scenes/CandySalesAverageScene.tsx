import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const BAR = "#94a3b8";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * A bar graph of monthly sales, asking for the average. Rather than just
 * stating total ÷ count, the scene physically levels the bars: after the
 * total is built up as a stacked column, every bar's height animates to the
 * same value — the average — visibly redistributing the same total area, so
 * "average" reads as leveling rather than an abstract formula.
 * Data: { sales:[100,60,40,120] }.
 */
export function CandySalesAverageScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const sales = (Array.isArray(data.sales) ? data.sales : [100, 60, 40, 120]).map((v) => Math.max(0, num(v, 0)));
  const n = sales.length;

  const total = sales.reduce((a, b) => a + b, 0);
  const avg = total / n;
  const matches = problem.shortAnswer == null || String(avg) === String(problem.shortAnswer);
  const failure = !matches ? `check failed: ${total} ÷ ${n} = ${avg}, stored answer is ${problem.shortAnswer}` : "";

  const lastStep = totalSteps - 1;
  const showSum = step >= 1;
  const showLevel = step >= 2;
  const showCheck = step === 3;
  const isFinal = step >= lastStep;

  // ---- geometry ----
  const W = 300;
  const H = 220;
  const padL = 34;
  const padR = 20;
  const padT = 20;
  const baseY = 170;
  const maxVal = Math.max(...sales, avg) * 1.15;
  const sy = (v: number) => baseY - (v / maxVal) * (baseY - padT);
  const barGap = (W - padL - padR) / n;
  const barW = barGap * 0.6;
  const barX = (i: number) => padL + i * barGap + (barGap - barW) / 2;

  const heightsAt = (i: number) => (showLevel ? avg : sales[i]);

  const caption = isFinal
    ? `${total} ÷ ${n} = ${avg} dollars per month`
    : showCheck
    ? `${n} × ${avg} = ${n * avg} — the total is conserved`
    : showLevel
    ? `leveling all ${n} bars to the same height gives the average`
    : showSum
    ? `${sales.join(" + ")} = ${total}`
    : `${n} months of candy sales`;

  const note = failure || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <line x1={padL} y1={baseY} x2={W - padR} y2={baseY} stroke={INK} strokeWidth={1.4} />

        {/* the average line, once leveling begins */}
        <AnimatePresence>
          {showLevel && (
            <motion.g key="avgline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.line
                x1={padL}
                x2={W - padR}
                y1={sy(avg)}
                y2={sy(avg)}
                stroke={WIN}
                strokeWidth={1.6}
                strokeDasharray="5 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              <text x={padL} y={12} textAnchor="start" fontSize="10" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                avg ${avg}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {sales.map((v, i) => {
          const h = baseY - sy(heightsAt(i));
          return (
            <g key={i}>
              <motion.rect
                x={barX(i)}
                width={barW}
                fill={showLevel ? WIN : BAR}
                fillOpacity={showLevel ? 0.75 : 0.6}
                stroke={showLevel ? WIN : "#64748b"}
                strokeWidth={1.4}
                initial={{ y: baseY, height: 0 }}
                animate={{ y: baseY - h, height: h }}
                transition={{ type: "spring", stiffness: 200, damping: showLevel ? 22 : 18, delay: showLevel ? 0.2 : i * 0.08 }}
              />
              <motion.text
                x={barX(i) + barW / 2}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="800"
                fill={showLevel ? "#166534" : INK}
                fontFamily={numberFont}
                initial={{ y: baseY - h - 8 }}
                animate={{ y: baseY - h - 8 }}
                transition={{ type: "spring", stiffness: 200, damping: showLevel ? 22 : 18, delay: showLevel ? 0.2 : i * 0.08 }}
              >
                {showLevel ? avg : v}
              </motion.text>
              <text x={barX(i) + barW / 2} y={baseY + 14} textAnchor="middle" fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                {MONTHS[i] ?? `#${i + 1}`}
              </text>
            </g>
          );
        })}

        {/* the running total, tallied above each bar in turn */}
        <AnimatePresence>
          {showSum && !showLevel && (
            <motion.g key="tally" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {(() => {
                let acc = 0;
                return sales.map((v, i) => {
                  acc += v;
                  const cum = acc;
                  return (
                    <motion.text
                      key={i}
                      x={barX(i) + barW / 2}
                      y={padT - 4}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="800"
                      fill={IND}
                      fontFamily={numberFont}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.25 }}
                    >
                      Σ={cum}
                    </motion.text>
                  );
                });
              })()}
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
