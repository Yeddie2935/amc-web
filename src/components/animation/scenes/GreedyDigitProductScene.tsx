import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const FADE = "#94a3b8";

/** Greedily pick the largest 1-9 divisor at each slot; the classic construction for N. */
function greedyDigits(target: number, slots: number): { digits: number[]; remainders: number[]; failed9: number[] } {
  let remaining = target;
  const digits: number[] = [];
  const remainders: number[] = [];
  let failed9: number[] = [];
  for (let i = 0; i < slots; i++) {
    let d = 1;
    const failed: number[] = [];
    for (let cand = 9; cand >= 1; cand--) {
      if (remaining % cand === 0) {
        d = cand;
        break;
      }
      failed.push(cand);
    }
    if (i === 0) failed9 = failed;
    digits.push(d);
    remaining = remaining / d;
    remainders.push(remaining);
  }
  return { digits, remainders, failed9 };
}

/** Every distinct multiset of `slots` digits (1-9) whose product is `target`. */
function allDigitSets(target: number, slots: number): number[][] {
  const results: number[][] = [];
  const rec = (remaining: number, left: number, cur: number[]) => {
    if (left === 0) {
      if (remaining === 1) results.push([...cur]);
      return;
    }
    for (let d = 9; d >= 1; d--) {
      if (remaining % d === 0) {
        cur.push(d);
        rec(remaining / d, left - 1, cur);
        cur.pop();
      }
    }
  };
  rec(target, slots, []);
  const seen = new Set<string>();
  const uniq: number[][] = [];
  for (const r of results) {
    const sorted = [...r].sort((a, b) => b - a);
    const key = sorted.join(",");
    if (!seen.has(key)) {
      seen.add(key);
      uniq.push(sorted);
    }
  }
  uniq.sort((a, b) => Number(b.join("")) - Number(a.join("")));
  return uniq;
}

/**
 * Builds N by peeling the largest 1-9 divisor off the remaining product at
 * each of the five slots, then proves it's the greatest by laying every other
 * valid digit-set (same product, different digits) underneath it in order.
 * The other answer choices are exactly those alternatives' digit sums, so the
 * "trap" is the whole ranked list, not one hand-picked wrong turn.
 * Data: { target, slots }.
 */
export function GreedyDigitProductScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const target = Math.max(2, Math.round(num(data.target, 120)));
  const slots = Math.max(2, Math.min(6, Math.round(num(data.slots, 5))));

  const { digits, remainders, failed9 } = greedyDigits(target, slots);
  const N = digits.join("");
  const sum = digits.reduce((a, b) => a + b, 0);
  const agrees = problem.shortAnswer == null || String(problem.shortAnswer) === String(sum);

  const allSets = allDigitSets(target, slots);
  const maxSet = allSets[0] ?? digits;
  const consistent = maxSet.join("") === N;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showRest = step >= 1;

  // ---- geometry ----
  const sw = 44;
  const gap = 9;
  const slotsW = slots * sw + (slots - 1) * gap;
  const sx0 = (340 - slotsW) / 2;
  const sy = 46;
  const sh = 54;
  const slotX = (i: number) => sx0 + i * (sw + gap);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox="0 0 340 240" width="100%" style={{ maxWidth: 360 }}>
        <text x={170} y={20} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
          digits × digits × … = {target}
        </text>

        {/* the five digit slots */}
        {Array.from({ length: slots }).map((_, i) => {
          const revealed = i === 0 || showRest;
          return (
            <g key={i}>
              <rect
                x={slotX(i)}
                y={sy}
                width={sw}
                height={sh}
                rx={8}
                fill={revealed ? "#eef2ff" : "#fff"}
                stroke={revealed ? MARK : "#cbd5e1"}
                strokeWidth={1.6}
              />
              <AnimatePresence>
                {revealed && (
                  <motion.text
                    key={`d${i}`}
                    x={slotX(i) + sw / 2}
                    y={sy + sh / 2 + 8}
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="800"
                    fill={isFinal ? WIN : MARK}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16, delay: i === 0 ? 0.9 : 0.15 + i * 0.35 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {digits[i]}
                  </motion.text>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {revealed && (
                  <motion.text
                    key={`r${i}`}
                    x={slotX(i) + sw / 2}
                    y={sy + sh + 16}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="700"
                    fill={FADE}
                    fontFamily={numberFont}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i === 0 ? 1.1 : 0.35 + i * 0.35 }}
                  >
                    left {remainders[i]}
                  </motion.text>
                )}
              </AnimatePresence>
            </g>
          );
        })}

        {/* step 0: the divisor search that finds the first digit */}
        <AnimatePresence>
          {step === 0 && (
            <motion.g key="search" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {failed9.map((cand, i) => (
                <motion.text
                  key={cand}
                  x={slotX(0) + sw / 2}
                  y={sy - 14}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="800"
                  fill={BAD}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.55, delay: i * 0.3, times: [0, 0.2, 0.7, 1] }}
                >
                  {cand} ✗
                </motion.text>
              ))}
              <motion.text
                x={slotX(0) + sw / 2}
                y={sy - 14}
                textAnchor="middle"
                fontSize="12"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: failed9.length * 0.3 + 0.1 }}
              >
                {digits[0]} ✓
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* final: the running sum and the ranked list of every valid digit-set */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="sum" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.text
                x={170}
                y={sy + sh + 40}
                textAnchor="middle"
                fontSize="13"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.3 }}
              >
                {digits.join("+")} = {sum}
              </motion.text>

              {allSets.slice(0, 5).map((set, i) => {
                const setN = set.join("");
                const setSum = set.reduce((a, b) => a + b, 0);
                const isTop = i === 0;
                const rowY = sy + sh + 58 + i * 14;
                return (
                  <motion.g
                    key={setN}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.15 }}
                  >
                    <text x={90} y={rowY} textAnchor="end" fontSize="10" fontWeight={isTop ? 800 : 600} fill={isTop ? WIN : "#64748b"} fontFamily={numberFont}>
                      {setN}
                    </text>
                    <text x={104} y={rowY} fontSize="10" fontWeight={isTop ? 800 : 600} fill={isTop ? WIN : "#64748b"} fontFamily={numberFont}>
                      sum {setSum}
                    </text>
                    {isTop && (
                      <text x={210} y={rowY} fontSize="9" fontWeight="700" fill={WIN} fontFamily={numberFont}>
                        ← greatest
                      </text>
                    )}
                  </motion.g>
                );
              })}
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
        {step === 0
          ? `largest digit ≤9 dividing ${target}: ${digits[0]}, leaving ${remainders[0]}`
          : isFinal
          ? `N = ${N}, digit sum ${sum} — the greatest of every product-${target} option`
          : `keep peeling the largest divisor: N = ${N}`}
      </motion.span>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: agrees && consistent ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees && consistent
              ? `checked ${allSets.length} valid digit-sets: ${N} is the largest`
              : !consistent
              ? `greedy gave ${N} but the full search's greatest is ${maxSet.join("")}`
              : `computed sum ${sum} but the stored answer differs`}
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
