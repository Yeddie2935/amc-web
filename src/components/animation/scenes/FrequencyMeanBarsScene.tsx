import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const BAR = "#b9c4d4";
const BAR_EDGE = "#334155";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const numberFmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2));

/**
 * A frequency bar chart where the bars are counts of *people*, not the
 * quantity being measured — so the mean is not "average bar height" but a
 * weighted sum divided by how many people there are. The trap is doing
 * exactly that forbidden average-of-heights instead. The beats grow the bars
 * from the given frequencies, multiply each bar's value by its own height to
 * build the weighted total, add the heights themselves to count the people,
 * then divide — drawing the quotient as a level line across the chart so it
 * visibly sits between the shortest and tallest bars. Every product, both
 * sums, the mean and the average-of-heights trap are computed from the given
 * values and frequencies; the scene flags a mean that misses the choices.
 * Data: { values: [1,2,3,4,5,6,7], freqs: [1,3,2,6,8,3,2], xLabel?, yLabel? }.
 */
export function FrequencyMeanBarsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const values = (Array.isArray(data.values) ? data.values : []).map((v) => num(v, 0));
  const freqs = (Array.isArray(data.freqs) ? data.freqs : []).map((v) => Math.round(num(v, 0)));
  const xLabel = data.xLabel != null ? String(data.xLabel) : "";
  const yLabel = data.yLabel != null ? String(data.yLabel) : "";
  const n = values.length;
  if (n < 2 || freqs.length !== n || freqs.some((f) => f < 0)) return null;

  const products = values.map((v, i) => v * freqs[i]);
  const weightedTotal = products.reduce((a, b) => a + b, 0);
  const peopleTotal = freqs.reduce((a, b) => a + b, 0);
  if (peopleTotal <= 0) return null;
  const mean = weightedTotal / peopleTotal;

  const trapMean = peopleTotal / n;
  const trapChoice = problem.choices?.find(
    (c) => Math.abs(Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) - trapMean) < 0.005
  );
  const agrees = problem.shortAnswer == null || Math.abs(Number(String(problem.shortAnswer)) - mean) < 0.005;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showProducts = step === 0;
  const showPeopleSum = step === 1 || isFinal;
  const showLine = isFinal;

  // ---- geometry ----
  const W = 340;
  const H = 226;
  const plotLeft = 34;
  const plotRight = 322;
  const plotTop = 58;
  const base = 168;
  const plotW = plotRight - plotLeft;
  const plotH = base - plotTop;
  const maxF = Math.max(...freqs, 1);
  const yOf = (v: number) => base - (v / maxF) * plotH;
  const pitch = plotW / n;
  const barW = Math.max(6, pitch * 0.62);
  const xOf = (i: number) => plotLeft + i * pitch + (pitch - barW) / 2;

  const caption = isFinal
    ? `${weightedTotal} ÷ ${peopleTotal} = ${numberFmt(mean)}`
    : step === 0
    ? `each bar contributes value × frequency: ${products.map((p, i) => `${values[i]}×${freqs[i]}`).join(" + ")} = ${weightedTotal}`
    : `add the heights to count the people: ${freqs.join(" + ")} = ${peopleTotal}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        <line x1={plotLeft} x2={plotLeft} y1={plotTop - 8} y2={base} stroke={INK} strokeWidth={1.4} />
        <line x1={plotLeft} x2={plotRight} y1={base} y2={base} stroke={INK} strokeWidth={1.4} />
        {yLabel && (
          <text x={10} y={(plotTop + base) / 2} textAnchor="middle" fontSize="8" fontWeight="700" fill="#475569" transform={`rotate(-90 10 ${(plotTop + base) / 2})`}>
            {yLabel}
          </text>
        )}
        {xLabel && (
          <text x={(plotLeft + plotRight) / 2} y={H - 6} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#475569">
            {xLabel}
          </text>
        )}

        {/* the bars, grown from the given frequencies */}
        {freqs.map((f, i) => (
          <g key={i}>
            <motion.rect
              x={xOf(i)}
              width={barW}
              fill={BAR}
              stroke={BAR_EDGE}
              strokeWidth={1}
              initial={{ y: base, height: 0 }}
              animate={{ y: yOf(f), height: base - yOf(f) }}
              transition={{ type: "spring", stiffness: 170, damping: 20, delay: i * 0.07 }}
            />
            <text x={xOf(i) + barW / 2} y={base + 13} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={INK} fontFamily={numberFont}>
              {values[i]}
            </text>
            {!showProducts && (
              <motion.text
                x={xOf(i) + barW / 2}
                y={yOf(f) - 5}
                textAnchor="middle"
                fontSize="9"
                fontWeight="800"
                fill={showPeopleSum ? MARK : DIM}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.07 + 0.25 }}
              >
                {f}
              </motion.text>
            )}
          </g>
        ))}

        {/* value x frequency products, step 0 */}
        <AnimatePresence>
          {showProducts && (
            <motion.g key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {values.map((v, i) => (
                <motion.text
                  key={i}
                  x={xOf(i) + barW / 2}
                  y={yOf(freqs[i]) - 6}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="800"
                  fill={MARK}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.12 }}
                >
                  {v}×{freqs[i]}={products[i]}
                </motion.text>
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the mean, drawn as a level line across the chart */}
        <AnimatePresence>
          {showLine && (
            <motion.g key="line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <line x1={plotLeft} x2={plotRight} y1={yOf(mean)} y2={yOf(mean)} stroke={WIN} strokeWidth={1.8} strokeDasharray="6 4" />
              <rect x={plotRight - 46} y={yOf(mean) - 16} width={46} height={13} rx={6} fill="#dcfce7" stroke="#bbf7d0" strokeWidth={0.8} />
              <text x={plotRight - 23} y={yOf(mean) - 6.5} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {numberFmt(mean)}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11,
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
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {!agrees
              ? `this gives ${numberFmt(mean)}, which is not the stored answer`
              : trapChoice
              ? `averaging the heights instead of weighting gives ${trapMean.toFixed(2)} — choice ${trapChoice.label}`
              : `checks out: ${weightedTotal} ÷ ${peopleTotal} = ${numberFmt(mean)}`}
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
