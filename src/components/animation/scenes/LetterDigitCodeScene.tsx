import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";

/**
 * A code phrase whose letters stand for the digits 0–9 in order. The scene
 * lays out every letter of the phrase with its digit underneath, then looks
 * up one letter of the target word at a time, drawing a line from its spot
 * in the phrase down into the growing result — the number is built the same
 * way a reader decodes it, letter by letter, not asserted all at once.
 * Data: { codeGroups:["BEST","OF","LUCK"], targetWord:"CLUE" }.
 */
export function LetterDigitCodeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const codeGroups = (Array.isArray(data.codeGroups) ? data.codeGroups : ["BEST", "OF", "LUCK"]).map((g) => String(g).toUpperCase());
  const targetWord = String(data.targetWord ?? "CLUE").toUpperCase();

  const flat = codeGroups.join("");
  const letterToDigit = new Map<string, number>();
  flat.split("").forEach((ch, i) => letterToDigit.set(ch, i));
  const targetDigits = targetWord.split("").map((ch) => letterToDigit.get(ch) ?? -1);
  const result = targetDigits.join("");

  const matches = problem.shortAnswer == null || result === String(problem.shortAnswer);
  const failure = !matches ? `check failed: ${targetWord} → ${result}, stored answer is ${problem.shortAnswer}` : "";

  const lastStep = totalSteps - 1;
  const revealed = Math.min(targetWord.length, step);
  const isFinal = step >= lastStep;

  // ---- geometry: the code phrase as a row of tiles, grouped with gaps ----
  const tile = 26;
  const gap = 3;
  const groupGap = 12;
  let x = 16;
  const positions: { x: number; ch: string; idx: number }[] = [];
  codeGroups.forEach((g) => {
    g.split("").forEach((ch) => {
      positions.push({ x, ch, idx: flat.indexOf(ch) });
      x += tile + gap;
    });
    x += groupGap - gap;
  });
  const W = x + 12;
  const codeY = 34;
  const resX0 = 16;
  const resY = 130;
  const resTile = 34;
  const H = resY + resTile + 24;

  const targetPos = (ch: string) => positions.find((p) => p.ch === ch);

  const caption = isFinal
    ? `CLUE = ${result}`
    : revealed > 0
    ? `${targetWord[revealed - 1]} is letter ${targetDigits[revealed - 1]} in the code, so it stands for ${targetDigits[revealed - 1]}`
    : `${codeGroups.join(" ")} spells the digits 0 through 9, in order`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        {positions.map((p, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.03 }}
          >
            <rect x={p.x} y={codeY} width={tile} height={tile} rx={5} fill={targetWord.includes(p.ch) ? "#eef2ff" : "#f8fafc"} stroke={targetWord.includes(p.ch) ? IND : "#cbd5e1"} strokeWidth={targetWord.includes(p.ch) ? 1.6 : 1.1} />
            <text x={p.x + tile / 2} y={codeY + tile / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={targetWord.includes(p.ch) ? IND : INK} fontFamily={numberFont}>
              {p.ch}
            </text>
            <text x={p.x + tile / 2} y={codeY + tile + 12} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              {p.idx}
            </text>
          </motion.g>
        ))}

        {/* result slots for the target word */}
        {targetWord.split("").map((ch, i) => {
          const show = i < revealed;
          const rx = resX0 + i * (resTile + 6);
          const src = targetPos(ch);
          return (
            <g key={i}>
              <rect x={rx} y={resY} width={resTile} height={resTile} rx={6} fill={show ? "#dcfce7" : "#fff"} stroke={show ? WIN : "#cbd5e1"} strokeWidth={show ? 1.8 : 1.2} strokeDasharray={show ? undefined : "4 3"} />
              <text x={rx + resTile / 2} y={resY - 6} textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                {ch}
              </text>
              <AnimatePresence>
                {show && (
                  <>
                    <motion.line
                      key={`ln${i}`}
                      x1={src ? src.x + tile / 2 : rx + resTile / 2}
                      y1={codeY + tile + 4}
                      x2={rx + resTile / 2}
                      y2={resY - 2}
                      stroke={WIN}
                      strokeWidth={1.4}
                      strokeDasharray="3 3"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.35 }}
                    />
                    <motion.text
                      key={`d${i}`}
                      x={rx + resTile / 2}
                      y={resY + resTile / 2 + 5}
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight="900"
                      fill="#166534"
                      fontFamily={numberFont}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
                    >
                      {targetDigits[i]}
                    </motion.text>
                  </>
                )}
              </AnimatePresence>
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
        {failure && (
          <motion.span
            key="note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#dc2626", textAlign: "center" }}
          >
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
