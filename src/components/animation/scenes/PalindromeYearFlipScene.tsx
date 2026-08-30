import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * A 4-digit palindrome is just its first half mirrored, so the next one after
 * 2002 isn't found by walking every year — it's built by bumping the first
 * half (20 → 21) and reflecting it (21 → 2112). The scene shows the starting
 * year checked against its own reverse, the half incremented, the mirror
 * built tile by tile, and finally the digit product of the result computed
 * live. Data: { startYear }.
 */
export function PalindromeYearFlipScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const startYear = Math.round(num(data.startYear, 2002));
  const yearStr = String(startYear).padStart(4, "0");
  const half = yearStr.slice(0, 2);
  const nextHalfNum = Number(half) + 1;
  const nextHalf = String(nextHalfNum).padStart(2, "0");
  const mirrored = nextHalf + [...nextHalf].reverse().join("");
  const digits = mirrored.split("").map(Number);
  const product = digits.reduce((a, b) => a * b, 1);
  const answerOk = problem.shortAnswer == null || String(product) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed product ${product}, stored answer is ${problem.shortAnswer}` : "";

  const sumInstead = digits.reduce((a, b) => a + b, 0);
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(sumInstead));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showCheck = step >= 0;
  const showHalf = step >= 1;
  const showMirror = step >= 2 || isFinal;
  const showProduct = step >= 3 || isFinal;

  const W = 300;
  const H = 200;
  const cw = 34;
  const tileY = 30;
  const startX = (yr: string) => (W - yr.length * cw) / 2;

  const Tile = ({ x, y, d, color, delay }: { x: number; y: number; d: string; color: string; delay: number }) => (
    <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <rect x={x} y={y} width={cw - 4} height={40} rx={4} fill={color} />
      <text x={x + (cw - 4) / 2} y={y + 27} textAnchor="middle" fontSize="18" fontWeight="800" fill="#fff" fontFamily={numberFont}>
        {d}
      </text>
    </motion.g>
  );

  const caption = isFinal
    ? `${digits.join(" × ")} = ${product} — the answer is ${problem.answer}`
    : showProduct
    ? `${digits.join(" × ")} = ${product}`
    : showMirror
    ? `mirror ${nextHalf} → ${mirrored}`
    : showHalf
    ? `bump the first half: ${half} → ${nextHalf}`
    : `${yearStr} reads the same forward and backward`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {!showMirror && (
          <g>
            {showCheck &&
              yearStr.split("").map((d, i) => <Tile key={`s${i}`} x={startX(yearStr) + i * cw} y={tileY} d={d} color={INK} delay={i * 0.12} />)}
            {showHalf && (
              <g>
                <motion.rect x={startX(yearStr) - 4} y={tileY - 4} width={2 * cw + 4} height={48} rx={6} fill="none" stroke={IND} strokeWidth={2} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
                <motion.text x={W / 2} y={100} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                  {half} + 1 = {nextHalf}
                </motion.text>
              </g>
            )}
          </g>
        )}

        {showMirror && (
          <g>
            <text x={W / 2} y={18} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK}>
              next palindrome
            </text>
            {mirrored.split("").map((d, i) => (
              <Tile key={`m${i}`} x={startX(mirrored) + i * cw} y={tileY + 6} d={d} color={i < 2 ? IND : "#0d9488"} delay={i * 0.18} />
            ))}
            <motion.text x={W / 2} y={100} textAnchor="middle" fontSize="15" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              {mirrored}
            </motion.text>
          </g>
        )}

        {showProduct && (
          <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={W / 2 - 70} y={126} width={140} height={30} rx={9} fill="#dcfce7" stroke={WIN} strokeWidth={1.4} />
            <text x={W / 2} y={146} textAnchor="middle" fontSize="13" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {digits.join(" × ")} = {product}
            </text>
          </motion.g>
        )}

        {showProduct && trapChoice && (
          <motion.text x={W / 2} y={172} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            (adding instead of multiplying gives {sumInstead} — choice {trapChoice.label})
          </motion.text>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : IND,
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
