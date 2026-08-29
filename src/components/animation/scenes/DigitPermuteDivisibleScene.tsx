import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

function permute(items: string[]): string[][] {
  if (items.length <= 1) return [items];
  const out: string[][] = [];
  for (let i = 0; i < items.length; i++) {
    const rest = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const tail of permute(rest)) out.push([items[i], ...tail]);
  }
  return out;
}

/**
 * Every arrangement of a set of distinct digits, asking how many are
 * divisible by some small number. Divisibility by that number depends only
 * on the last digit, so the scene lists every full arrangement, then
 * isolates and recolors just the last digit of each one — green where it's
 * a multiple of the divisor, red otherwise — before tallying and reducing
 * the fraction.
 * Data: { digits:["1","3","5"], divisor }.
 */
export function DigitPermuteDivisibleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const digits = (Array.isArray(data.digits) ? data.digits : ["1", "3", "5"]).map((v) => String(v));
  const divisor = Math.max(2, Math.round(num(data.divisor, 5)));

  const perms = permute(digits).map((p) => p.join(""));
  const total = perms.length;
  const hits = perms.filter((n) => Number(n[n.length - 1]) % divisor === 0);
  const favorable = hits.length;
  const g = gcd(favorable, total) || 1;
  const probNum = favorable / g;
  const probDen = total / g;

  const matches = problem.shortAnswer == null || `${probNum}/${probDen}` === String(problem.shortAnswer);
  const failure = !matches ? `check failed: ${favorable}/${total} = ${probNum}/${probDen}, stored answer is ${problem.shortAnswer}` : "";

  const lastStep = totalSteps - 1;
  const showPerms = step >= 1;
  const showLast = step >= 2;
  const showColor = step >= 3;
  const isFinal = step >= lastStep;

  const caption = isFinal
    ? `${favorable}/${total} = ${probNum}/${probDen}`
    : showColor
    ? `${favorable} of the ${total} arrangements end in a multiple of ${divisor}`
    : showLast
    ? `divisible by ${divisor} depends only on the last digit`
    : showPerms
    ? `${digits.length}! = ${total} ways to arrange ${digits.join(", ")}`
    : `arrange the digits ${digits.join(", ")} into a ${digits.length}-digit number`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <div style={{ display: "flex", gap: 6 }}>
        {digits.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -10, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.08 }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#eef2ff",
              border: `1.6px solid ${MARK}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 900,
              color: MARK,
            }}
          >
            {d}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showPerms && (
          <motion.div key="perms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", maxWidth: 300 }}>
            {perms.map((n, i) => {
              const hit = hits.includes(n);
              const bodyColor = showColor ? (hit ? WIN : "#94a3b8") : INK;
              const lastColor = showColor ? (hit ? WIN : BAD) : showLast ? MARK : bodyColor;
              const bg = showColor ? (hit ? "#dcfce7" : "#f8fafc") : "#f1f5f9";
              const border = showColor ? (hit ? WIN : "#cbd5e1") : "#cbd5e1";
              return (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, y: -8, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.08 }}
                  style={{
                    padding: "4px 9px",
                    borderRadius: 7,
                    background: bg,
                    border: `1.6px solid ${border}`,
                    fontFamily: FONT,
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                >
                  <span style={{ color: bodyColor }}>{n.slice(0, -1)}</span>
                  <span style={{ color: lastColor, textDecoration: showLast && !showColor ? "underline" : "none" }}>{n.slice(-1)}</span>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={`${step}-${isFinal}`}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 800,
          textAlign: "center",
          maxWidth: 320,
          color: isFinal ? WIN : showColor ? "#166534" : showLast ? MARK : DIM,
        }}
      >
        {caption}
      </motion.div>

      <AnimatePresence>
        {failure && (
          <motion.div key="note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 10.5, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {failure}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
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
