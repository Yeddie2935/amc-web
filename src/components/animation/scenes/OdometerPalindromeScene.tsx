import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const parseChoice = (text: string) => Number(String(text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));

/** A mechanical odometer digit wheel: dark cell, bright digits. */
function OdometerRow({ x0, y, digits, changed, color }: { x0: number; y: number; digits: string; changed: boolean[]; color: string }) {
  const cw = 26;
  return (
    <g>
      <rect x={x0 - 4} y={y - 4} width={digits.length * cw + 8} height={40} rx={4} fill="#1f2a44" />
      {digits.split("").map((d, i) => (
        <g key={i}>
          <rect x={x0 + i * cw} y={y} width={cw - 3} height={32} rx={2} fill={changed[i] ? color : "#334155"} />
          <text x={x0 + i * cw + (cw - 3) / 2} y={y + 23} textAnchor="middle" fontSize="18" fontWeight="800" fill="#fff" fontFamily={numberFont}>
            {d}
          </text>
        </g>
      ))}
    </g>
  );
}

/**
 * A bike odometer reads one palindrome, then another after riding two
 * separate stretches on two days. Distance is the odometer's own before and
 * after reading (with the changed wheels lit up), time is the two riding
 * stretches laid end to end, and speed is distance over that total time —
 * with a beat spent on the trap of miscounting the two days as one stretch
 * too many.
 * Data: { startReading, endReading, hours:[4,6] }.
 */
export function OdometerPalindromeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const startReading = String(Math.round(num(data.startReading, 1441)));
  const endReading = String(Math.round(num(data.endReading, 1661)));
  const hours = (Array.isArray(data.hours) ? data.hours : [4, 6]).map((v) => Math.max(0.1, num(v, 1)));

  const distance = Number(endReading) - Number(startReading);
  const totalHours = hours.reduce((a, b) => a + b, 0);
  const speed = distance / totalHours;
  const matches = problem.shortAnswer == null || String(speed) === String(problem.shortAnswer);
  const failure = !matches ? `check failed: ${distance} ÷ ${totalHours} = ${speed}, stored answer is ${problem.shortAnswer}` : "";

  const naiveHours = totalHours + 1;
  const naiveSpeed = distance / naiveHours;
  const trapChoice = (problem.choices ?? []).find((c) => Math.abs(parseChoice(c.text) - naiveSpeed) < 1e-9);

  const lastStep = totalSteps - 1;
  const showTime = step >= 1;
  const showTrap = step === 2;
  const showSpeed = step >= 3;
  const isFinal = step >= lastStep;

  const changed = startReading.split("").map((d, i) => d !== endReading[i]);
  const digitsShown = endReading;
  const changedShown = changed;

  // ---- geometry ----
  const W = 300;
  const H = 200;
  const odoX = (W - digitsShown.length * 26) / 2;
  const odoY = 20;
  const trackX0 = 30;
  const trackX1 = 270;
  const trackY = 130;
  const dayColors = ["#0d9488", "#4338ca"];

  const caption = isFinal
    ? `Barney's average speed was ${speed} mph`
    : showSpeed
    ? `${distance} ÷ ${totalHours} = ${speed} mph`
    : showTrap
    ? trapChoice
      ? `counting ${naiveHours} hours instead of ${totalHours} gives ${naiveSpeed} — choice ${trapChoice.label}, but there are only 2 riding stretches`
      : `counting ${naiveHours} hours instead of ${totalHours} gives ${naiveSpeed}, the wrong total`
    : showTime
    ? `${hours.join(" + ")} = ${totalHours} hours riding`
    : `${endReading} − ${startReading} = ${distance} miles`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <OdometerRow x0={odoX} y={odoY} digits={digitsShown} changed={changedShown} color={WIN} />

        <motion.text
          x={W / 2}
          y={odoY + 56}
          textAnchor="middle"
          fontSize="11"
          fontWeight="800"
          fill={WIN}
          fontFamily={numberFont}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {distance} miles
        </motion.text>

        {/* the two riding stretches, end to end */}
        <AnimatePresence>
          {showTime && (
            <motion.g key="time" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <line x1={trackX0} y1={trackY} x2={trackX1} y2={trackY} stroke="#e2e8f0" strokeWidth={10} strokeLinecap="round" />
              {(() => {
                let acc = 0;
                return hours.map((h, i) => {
                  const w = ((trackX1 - trackX0) * h) / totalHours;
                  const seg = (
                    <motion.rect
                      key={i}
                      x={trackX0 + acc}
                      y={trackY - 5}
                      height={10}
                      rx={5}
                      fill={dayColors[i % dayColors.length]}
                      initial={{ width: 0 }}
                      animate={{ width: w }}
                      transition={{ type: "spring", stiffness: 200, damping: 22, delay: i * 0.15 }}
                    />
                  );
                  acc += w;
                  return seg;
                });
              })()}
              {(() => {
                let acc = 0;
                return hours.map((h, i) => {
                  const w = ((trackX1 - trackX0) * h) / totalHours;
                  const cx = trackX0 + acc + w / 2;
                  acc += w;
                  return (
                    <text key={i} x={cx} y={trackY - 14} textAnchor="middle" fontSize="10" fontWeight="800" fill={dayColors[i % dayColors.length]} fontFamily={numberFont}>
                      day {i + 1}: {h}h
                    </text>
                  );
                });
              })()}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the trap: an extra hour tacked onto the track */}
        <AnimatePresence>
          {showTrap && (
            <motion.g key="trap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.rect
                x={trackX1}
                y={trackY - 5}
                width={(trackX1 - trackX0) / totalHours}
                height={10}
                rx={5}
                fill={BAD}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{ transformBox: "fill-box", transformOrigin: "left" }}
              />
              <text x={trackX1 + (trackX1 - trackX0) / totalHours / 2} y={trackY - 14} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                +1?
              </text>
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
          color: isFinal ? "#166534" : showTrap ? "#dc2626" : "#4338ca",
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {failure && (
          <motion.span key="note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.5 }} style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {failure}
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
