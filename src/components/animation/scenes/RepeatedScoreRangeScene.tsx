import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const FADE = "#94a3b8";

/**
 * Four equal test scores x and one higher score y must total a fixed sum.
 * The scene shows that conservation as bars — grow y and the four x bars
 * must shrink together to keep the total fixed — then switches to a number
 * line and hops through the divisibility step to land on every valid y.
 * Nothing is asserted: the valid list, the trap count, and the final bars
 * are all derived from the given tests/average/maxScore.
 * Data: { tests, average, maxScore }.
 */
export function RepeatedScoreRangeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const tests = Math.max(2, Math.round(num(data.tests, 5)));
  const maxScore = Math.max(1, Math.round(num(data.maxScore, 100)));
  const avg = Math.round(num(data.average, 82));
  const total = avg * tests;
  const equalCount = tests - 1;

  const valid: number[] = [];
  for (let y = avg + 1; y <= maxScore; y++) {
    const rem = total - y;
    if (rem % equalCount === 0) {
      const x = rem / equalCount;
      if (x >= 0 && x <= maxScore && y > x) valid.push(y);
    }
  }
  const count = valid.length;
  const agrees = problem.shortAnswer == null || String(problem.shortAnswer) === String(count);

  // the classic slip: allow y to equal the average too ("higher or the same")
  const trapList: number[] = [];
  for (let y = avg; y <= maxScore; y++) {
    const rem = total - y;
    if (rem % equalCount === 0) {
      const x = rem / equalCount;
      if (x >= 0 && x <= maxScore && y >= x) trapList.push(y);
    }
  }
  const trapCount = trapList.length;
  const trapChoice = problem.choices.find((c) => c.text.replace(/\s/g, "") === String(trapCount) && trapCount !== count);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showLine = step >= 1;

  const exampleY = valid[valid.length - 1] ?? avg;
  const exampleX = (total - exampleY) / equalCount;
  const phaseExample = step >= 1;

  // ---- geometry: bars ----
  const barCount = tests;
  const bw = 30;
  const gap = 10;
  const barsW = barCount * bw + (barCount - 1) * gap;
  const bx0 = (340 - barsW) / 2;
  const baseline = 108;
  const maxSlot = 68;
  const barX = (i: number) => bx0 + i * (bw + gap);

  // ---- geometry: number line, zoomed to where the action is ----
  const nlY = 172;
  const nlX0 = 44;
  const nlX1 = 300;
  const domainLo = Math.max(0, avg - equalCount * 3);
  const scaleX = (v: number) => nlX0 + ((v - domainLo) / (maxScore - domainLo)) * (nlX1 - nlX0);

  const caption = isFinal
    ? `${count} values work: ${valid.join(", ")}`
    : step === 0
    ? `5 tests average ${avg} → total ${total} = 4x + y`
    : `y must be > ${avg}, and ${total} − y must split evenly by ${equalCount}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox="0 0 340 210" width="100%" style={{ maxWidth: 360 }}>
        {/* the five score bars, conserving the total */}
        {Array.from({ length: barCount }).map((_, i) => {
          const isLast = i === barCount - 1;
          const value = phaseExample ? (isLast ? exampleY : exampleX) : avg;
          return (
            <g key={i}>
              <motion.rect
                x={barX(i)}
                y={baseline - maxSlot}
                width={bw}
                height={maxSlot}
                rx={4}
                fill={isLast ? (isFinal ? WIN : MARK) : "#c7d2fe"}
                stroke={isLast ? (isFinal ? WIN : MARK) : "#818cf8"}
                strokeWidth={1.2}
                initial={false}
                animate={{ scaleY: value / maxScore }}
                transition={{ type: "spring", stiffness: 90, damping: 16 }}
                style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
              />
              <motion.text
                x={barX(i) + bw / 2}
                y={baseline + 14}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="800"
                fill={isLast ? (isFinal ? WIN : MARK) : INK}
                fontFamily={numberFont}
              >
                {isLast ? "y" : "x"}
              </motion.text>
              <motion.g
                initial={false}
                animate={{ y: maxSlot * (1 - value / maxScore) }}
                transition={{ type: "spring", stiffness: 90, damping: 16 }}
              >
                <text
                  x={barX(i) + bw / 2}
                  y={baseline - maxSlot - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  fill={isLast ? (isFinal ? WIN : MARK) : "#64748b"}
                  fontFamily={numberFont}
                >
                  {value}
                </text>
              </motion.g>
            </g>
          );
        })}
        <text x={bx0 + barsW + 12} y={baseline - maxSlot / 2} fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {step === 0 ? `${equalCount}x+y` : `=${total}`}
        </text>

        {/* the number line of possible last-test scores */}
        <AnimatePresence>
          {showLine && (
            <motion.g key="line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <line x1={nlX0} y1={nlY} x2={nlX1} y2={nlY} stroke={INK} strokeWidth={1.6} />
              <line x1={nlX0} y1={nlY - 4} x2={nlX0} y2={nlY + 4} stroke={INK} strokeWidth={1.4} />
              <line x1={nlX1} y1={nlY - 4} x2={nlX1} y2={nlY + 4} stroke={INK} strokeWidth={1.4} />
              <text x={nlX0} y={nlY + 18} textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                {domainLo}
              </text>
              <text x={nlX1} y={nlY + 18} textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                {maxScore}
              </text>

              {/* the valid region, y > avg */}
              <motion.rect
                x={scaleX(avg)}
                y={nlY - 5}
                width={scaleX(maxScore) - scaleX(avg)}
                height={10}
                fill={MARK}
                fillOpacity={0.15}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />

              {/* the excluded boundary point */}
              <circle cx={scaleX(avg)} cy={nlY} r={4} fill="#fff" stroke={BAD} strokeWidth={1.6} />
              <text x={scaleX(avg)} y={nlY - 12} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={BAD} fontFamily={numberFont}>
                {avg} ✗
              </text>

              {/* the valid y values, hopping by equalCount */}
              <AnimatePresence>
                {isFinal &&
                  valid.map((y, i) => (
                    <motion.g
                      key={y}
                      initial={{ opacity: 0, scale: 0.3 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 + i * 0.22 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <circle cx={scaleX(y)} cy={nlY} r={5} fill={WIN} />
                      <text x={scaleX(y)} y={nlY - 12} textAnchor="middle" fontSize="9" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                        {y}
                      </text>
                      {i > 0 && (
                        <text
                          x={(scaleX(valid[i - 1]) + scaleX(y)) / 2}
                          y={nlY + 16}
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="700"
                          fill={FADE}
                          fontFamily={numberFont}
                        >
                          +{equalCount}
                        </text>
                      )}
                    </motion.g>
                  ))}
              </AnimatePresence>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={`${step}-cap`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
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
        {isFinal && trapChoice && (
          <motion.span
            key="trap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            allow y = {avg} too → {trapCount} (choice {trapChoice.label}) — not strictly higher
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees
              ? `example: x=${exampleX}, y=${exampleY} → ${equalCount}(${exampleX})+${exampleY}=${total}`
              : `computed ${count} values but the stored answer differs`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
