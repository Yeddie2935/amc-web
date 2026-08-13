import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const TILE = "#eef2ff";
const TILE_EDGE = "#c7d2fe";
const MID = "#f59e0b";
const UNK = "#7c3aed";
const WIN = "#16a34a";

const fmt = (v: number) => (Number.isInteger(v) ? `${v}` : `${Math.round(v * 100) / 100}`);

/** Median of a numeric list (mean of the middle two when the count is even). */
function median(a: number[]): number {
  const s = [...a].sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/**
 * Insert one unknown into a list so the mean becomes a given multiple of the
 * median. With an even count the median is the middle pair's average, and once
 * the unknown is big enough to sit past that pair the median is pinned — which
 * fixes the mean, the required total, and therefore the unknown. The scene
 * derives the unknown itself and then re-checks the relation on the real list.
 * Data: { base:[...], multiplier, label? }.
 */
export function MeanMedianScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const base = Array.isArray(data.base) ? data.base.map((v) => num(v, 0)) : [];
  const k = num(data.multiplier, 2);
  const label = data.label != null ? String(data.label) : "N";

  const n = base.length + 1;
  const baseSum = base.reduce((a, b) => a + b, 0);
  // assume the unknown lands past the middle, so it does not disturb the pair
  const pinnedMedian = median([...base, Number.POSITIVE_INFINITY]);
  const mean = k * pinnedMedian;
  const total = n * mean;
  const N = total - baseSum;

  // re-check on the actual list
  const full = [...base, N].sort((a, b) => a - b);
  const okMedian = median(full);
  const okMean = full.reduce((a, b) => a + b, 0) / n;
  const consistent = Math.abs(okMean - k * okMedian) < 1e-9;
  const nIndex = full.indexOf(N);
  const midA = (n >> 1) - 1;
  const midB = n >> 1;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showN = step >= 1 || isFinal;
  const showMean = step >= 2 || isFinal;

  // ---- geometry ----
  const tw = 46;
  const gap = 8;
  const W = n * tw + (n - 1) * gap + 20;
  const x0 = 10;
  const tileY = 46;
  const th = 40;
  const H = 128;
  const tx = (i: number) => x0 + i * (tw + gap);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {full.map((v, i) => {
          const isN = i === nIndex;
          const isMid = i === midA || i === midB;
          const revealed = !isN || isFinal;
          // before it is inserted, the unknown is an empty slot waiting in place
          if (isN && !showN) {
            return (
              <rect
                key={i}
                x={tx(i)}
                y={tileY}
                width={tw}
                height={th}
                rx={7}
                fill="#faf5ff"
                stroke={UNK}
                strokeWidth={2}
                strokeDasharray="5 4"
                opacity={0.65}
              />
            );
          }
          return (
            <motion.g
              key={i}
              initial={isN ? { opacity: 0, y: -26 } : { opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 18, delay: isN ? 0.2 : i * 0.05 }}
            >
              <rect
                x={tx(i)}
                y={tileY}
                width={tw}
                height={th}
                rx={7}
                fill={isN && !isFinal ? "#f5f3ff" : isMid && showN ? "#fef3c7" : TILE}
                stroke={isN && !isFinal ? UNK : isMid && showN ? MID : TILE_EDGE}
                strokeWidth={isN || (isMid && showN) ? 2.2 : 1.4}
              />
              <text
                x={tx(i) + tw / 2}
                y={tileY + th / 2 + 6}
                textAnchor="middle"
                fontSize="16"
                fontWeight="800"
                fill={isN ? (isFinal ? WIN : UNK) : isMid && showN ? "#92400e" : INK}
                fontFamily={numberFont}
              >
                {revealed ? fmt(v) : label}
              </text>
            </motion.g>
          );
        })}

        {/* the middle pair is what the median reads */}
        <AnimatePresence>
          {showN && (
            <motion.g key="med" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.35 }}>
              <line x1={tx(midA)} y1={tileY + th + 8} x2={tx(midB) + tw} y2={tileY + th + 8} stroke={MID} strokeWidth={2} />
              <line x1={tx(midA)} y1={tileY + th + 4} x2={tx(midA)} y2={tileY + th + 12} stroke={MID} strokeWidth={2} />
              <line x1={tx(midB) + tw} y1={tileY + th + 4} x2={tx(midB) + tw} y2={tileY + th + 12} stroke={MID} strokeWidth={2} />
              <text
                x={(tx(midA) + tx(midB) + tw) / 2}
                y={tileY + th + 26}
                textAnchor="middle"
                fontSize="12"
                fontWeight="800"
                fill="#92400e"
                fontFamily={numberFont}
              >
                median = {fmt(pinnedMedian)}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* sorted-order note */}
        <text x={W / 2} y={22} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          {n} numbers in order
        </text>
      </svg>

      {/* caption */}
      <motion.span
        key={`${showN}-${showMean}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : showN ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : showN ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showN ? "#fde68a" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {!showN
          ? `with ${n} numbers the median is the middle pair's average`
          : !showMean
          ? `${label} sits past the pair, so the median stays ${fmt(pinnedMedian)}`
          : !isFinal
          ? `mean = ${fmt(k)} × ${fmt(pinnedMedian)} = ${fmt(mean)} → total = ${n} × ${fmt(mean)} = ${fmt(total)}`
          : `${label} = ${fmt(total)} − ${fmt(baseSum)} = ${fmt(N)}`}
      </motion.span>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="check"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: consistent ? "#94a3b8" : "#dc2626", textAlign: "center" }}
          >
            {consistent
              ? `check: ${fmt(N)} is past the pair, mean ${fmt(okMean)} = ${fmt(k)} × median ${fmt(okMedian)}`
              : `the derived value is not consistent with that placement`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.45 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
