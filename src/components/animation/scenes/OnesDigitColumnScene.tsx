import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#cbd5e1";
const HOT = "#f59e0b";
const WIN = "#16a34a";

/**
 * The ones digit of a long subtraction. Only the ones column can affect the
 * answer, so the numbers are stacked in columns with that column lit: the digits
 * being taken away are added up, and their own ones digit is what actually gets
 * subtracted. The real value is computed too and used to confirm the digit.
 * Data: { first, subtract:[...] }.
 */
export function OnesDigitColumnScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const first = Math.round(num(data.first, 0));
  const subs = (Array.isArray(data.subtract) ? data.subtract : []).map((v) => Math.round(num(v, 0)));

  const ones = (v: number) => Math.abs(v) % 10;
  const subOnesSum = subs.reduce((s, v) => s + ones(v), 0);
  const subTotal = subs.reduce((s, v) => s + v, 0);
  const value = first - subTotal;
  const answerDigit = ((value % 10) + 10) % 10;

  const rows = [first, ...subs];
  const width = Math.max(...rows.map((v) => String(Math.abs(v)).length));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showOnes = step >= 1 || isFinal;
  const showSum = step >= 2 || isFinal;

  // ---- geometry ----
  const cw = 26;
  const ch = 22;
  const W = 340;
  const gridW = width * cw;
  const x0 = (W - gridW) / 2 + 10;
  const y0 = 22;
  const H = y0 + (rows.length + 2) * ch + 26;
  const colX = (c: number) => x0 + c * cw;
  const onesCol = width - 1;

  const Digits = ({ v, row, sign }: { v: number; row: number; sign?: string }) => {
    const s = String(Math.abs(v));
    const off = width - s.length;
    return (
      <g>
        {sign && (
          <text x={x0 - 12} y={y0 + row * ch + 15} textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
            {sign}
          </text>
        )}
        {s.split("").map((d, i) => {
          const c = off + i;
          const isOnes = c === onesCol;
          return (
            // the y animation must live on a wrapper g: on the <text> itself
            // Motion's transform would add to the y attribute and double it
            <motion.g
              key={i}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: row * 0.06 + i * 0.02 }}
            >
              <text
                x={colX(c) + cw / 2}
                y={y0 + row * ch + 15}
                textAnchor="middle"
                fontSize="14"
                fontWeight="800"
                fill={showOnes ? (isOnes ? "#92400e" : DIM) : INK}
                fontFamily={numberFont}
              >
                {d}
              </text>
            </motion.g>
          );
        })}
      </g>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* the only column that matters */}
        <AnimatePresence>
          {showOnes && (
            <motion.rect
              key="band"
              x={colX(onesCol) - 1}
              y={y0 - 4}
              width={cw + 2}
              height={(rows.length + (showSum ? 2 : 1)) * ch + 6}
              rx={5}
              fill="#fef3c7"
              stroke={HOT}
              strokeWidth={1.6}
              initial={{ opacity: 0, scaleY: 0.6 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              style={{ transformBox: "fill-box", transformOrigin: "top" }}
            />
          )}
        </AnimatePresence>

        {rows.map((v, i) => (
          <Digits key={i} v={v} row={i} sign={i === 0 ? undefined : "−"} />
        ))}

        <line x1={x0 - 18} y1={y0 + rows.length * ch + 2} x2={x0 + gridW} y2={y0 + rows.length * ch + 2} stroke={INK} strokeWidth={1.6} />

        {/* the result, revealed at the end */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="res" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              {String(value)
                .split("")
                .map((d, i) => {
                  const c = width - String(value).length + i;
                  const isOnes = c === onesCol;
                  return (
                    <text
                      key={i}
                      x={colX(c) + cw / 2}
                      y={y0 + (rows.length + 1) * ch + 12}
                      textAnchor="middle"
                      fontSize="15"
                      fontWeight="800"
                      fill={isOnes ? WIN : INK}
                      fontFamily={numberFont}
                    >
                      {d}
                    </text>
                  );
                })}
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
          color: isFinal ? "#166534" : showOnes ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : showOnes ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showOnes ? "#fde68a" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {!showOnes
          ? `only the ones column can change the ones digit`
          : !showSum
          ? `every number here ends in ${ones(first)}`
          : !isFinal
          ? `taken away: ${subs.map(() => ones(subs[0])).join(" + ")} = ${subOnesSum}, ending in ${subOnesSum % 10}`
          : `${ones(first)} − ${subOnesSum % 10} → ones digit ${answerDigit}`}
      </motion.span>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="check"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8" }}
          >
            check: the whole subtraction really is {value.toLocaleString("en-US")}
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
