import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const WATER = "#38bdf8";

const fmt = (n: number) => n.toLocaleString("en-US");

/**
 * Several hoses fill a pool at a combined rate; the total gallons divided by
 * that rate gives minutes, then minutes divided by 60 gives hours. The pool
 * fills as a real water level tied to the combined rate, and the final
 * minutes are regrouped into a grid of hour-blocks (60 minutes each) so the
 * last division is something counted, not just stated.
 * Data: { gallons, hoseCount, hoseRate }.
 */
export function PoolFillRateScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const gallons = Math.max(1, num(data.gallons, 24000));
  const hoseCount = Math.max(1, Math.round(num(data.hoseCount, 4)));
  const hoseRate = Math.max(0.01, num(data.hoseRate, 2.5));

  const totalRate = hoseCount * hoseRate;
  const minutes = gallons / totalRate;
  const hours = minutes / 60;
  const matches = problem.shortAnswer == null || Math.abs(Number(problem.shortAnswer) - hours) < 1e-9;
  const failure = !matches ? `check failed: ${fmt(minutes)} ÷ 60 = ${hours}, stored answer is ${problem.shortAnswer}` : "";

  const lastStep = totalSteps - 1;
  const showRate = step >= 1;
  const showFill = step >= 2;
  const showHours = step >= 3;
  const isFinal = step >= lastStep;

  // ---- geometry ----
  const W = 370;
  const H = 220;
  const poolX = 96;
  const poolY = 54;
  const poolW = 92;
  const poolH = 108;
  const fillFrac = showHours ? 1 : showFill ? 0.35 : 0;
  const fillH = poolH * fillFrac;

  const gridCols = Math.min(10, Math.round(hours));
  const gridRows = Math.max(1, Math.ceil(Math.round(hours) / gridCols));
  const cell = 12;
  const gridX = poolX + poolW + 26;
  const gridY = poolY + 4;

  const caption = isFinal
    ? `${fmt(minutes)} min ÷ 60 = ${hours} hours`
    : showHours
    ? `regroup ${fmt(minutes)} minutes into hours`
    : showFill
    ? `${fmt(gallons)} ÷ ${totalRate} = ${fmt(minutes)} minutes to fill`
    : showRate
    ? `${hoseCount} × ${hoseRate} = ${totalRate} gal/min combined`
    : `${hoseCount} hoses, each ${hoseRate} gal/min`;

  const note = failure || (isFinal ? `${fmt(gallons)} gal ÷ ${totalRate} gal/min ÷ 60 = ${hours} hr` : "");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {/* hoses above the pool */}
        {Array.from({ length: hoseCount }).map((_, i) => {
          const hx = poolX + 12 + i * ((poolW - 24) / Math.max(1, hoseCount - 1 || 1));
          return (
            <g key={i}>
              <text x={hx} y={24} fontSize="14" textAnchor="middle" dominantBaseline="central">
                🚿
              </text>
              <AnimatePresence>
                {showRate && (
                  <motion.line
                    key="stream"
                    x1={hx}
                    y1={30}
                    x2={hx}
                    y2={poolY - 4}
                    stroke={WATER}
                    strokeWidth={2}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                  />
                )}
              </AnimatePresence>
            </g>
          );
        })}
        <text x={poolX + poolW / 2} y={40} textAnchor="middle" fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          {hoseRate} gal/min each
        </text>

        {/* the pool itself */}
        <rect x={poolX} y={poolY} width={poolW} height={poolH} fill="#f8fafc" stroke={INK} strokeWidth={1.8} />
        <motion.rect
          x={poolX}
          width={poolW}
          fill={WATER}
          fillOpacity={0.55}
          initial={{ height: 0, y: poolY + poolH }}
          animate={{ height: fillH, y: poolY + poolH - fillH }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
        <text x={poolX + poolW / 2} y={poolY + poolH + 16} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {fmt(gallons)} gal
        </text>

        <AnimatePresence>
          {showRate && (
            <motion.text
              x={poolX + poolW / 2}
              y={poolY + poolH / 2}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.4 }}
            >
              {totalRate} gal/min
            </motion.text>
          )}
        </AnimatePresence>

        {/* regrouping the minutes into hour-blocks */}
        <AnimatePresence>
          {showHours && (
            <motion.g key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={gridX} y={gridY - 8} fontSize="9.5" fontWeight="800" fill="#94a3b8" fontFamily={numberFont}>
                60 min = 1 hr
              </text>
              {Array.from({ length: Math.round(hours) }).map((_, i) => {
                const c = i % gridCols;
                const r = Math.floor(i / gridCols);
                return (
                  <motion.rect
                    key={i}
                    x={gridX + c * (cell + 2)}
                    y={gridY + r * (cell + 2)}
                    width={cell}
                    height={cell}
                    rx={2}
                    fill={isFinal ? "#dcfce7" : "#eef2ff"}
                    stroke={isFinal ? WIN : IND}
                    strokeWidth={1.2}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.05 * i }}
                  />
                );
              })}
              <motion.text
                x={gridX}
                y={gridY + gridRows * (cell + 2) + 12}
                fontSize="11"
                fontWeight="800"
                fill={isFinal ? WIN : IND}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 * Math.round(hours) + 0.2 }}
              >
                {hours} hours
              </motion.text>
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
            style={{
              fontFamily: numberFont,
              fontSize: 11.5,
              fontWeight: 700,
              color: failure ? BAD : "#94a3b8",
              textAlign: "center",
            }}
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
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
