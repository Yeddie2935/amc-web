import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

/**
 * An alternating sum 1 − 2 + 3 − 4 + ⋯ with one unpaired term left over.
 * Consecutive (odd − even) terms are shown as two small chips that collapse
 * into a single "−1" chip once paired; the first few pairs and the last pair
 * are drawn for real (with an ellipsis between), so the chip values are the
 * actual numbers, not placeholders. The pair count and running total are
 * computed from data and checked against the stored answer.
 * Data: { pairs, leftover } — the sequence runs 1..leftover in steps of 1,
 * odd terms positive, even terms negative, so pair k is (2k−1, −2k).
 */
export function SignPairSumScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const pairs = Math.max(1, Math.round(num(data.pairs, 1)));
  const leftover = num(data.leftover, 2 * pairs + 1);

  const pairSum = -pairs;
  const total = pairSum + leftover;
  const expected = Number(problem.shortAnswer ?? NaN);
  const mismatch = Number.isFinite(expected) && expected !== total;

  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^0-9.\-]/g, "")) === pairSum
  );

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const collapsed = step >= 1;

  const W = 340;
  const H = 210;
  const pitch = 54;
  const startX = 26;
  const midY = 70;
  const oddY = midY - 18;
  const evenY = midY + 16;

  const shownPairKs = pairs <= 4 ? Array.from({ length: pairs }, (_, i) => i + 1) : [1, 2, 3];
  const showEllipsis = pairs > shownPairKs.length + 1;
  const showLastPair = pairs > shownPairKs.length;

  type Slot = { kind: "pair"; k: number } | { kind: "ellipsis" } | { kind: "leftover" };
  const slots: Slot[] = [
    ...shownPairKs.map((k) => ({ kind: "pair" as const, k })),
    ...(showEllipsis ? [{ kind: "ellipsis" as const }] : []),
    ...(showLastPair ? [{ kind: "pair" as const, k: pairs }] : []),
    { kind: "leftover" as const },
  ];

  const xOf = (i: number) => startX + i * pitch;

  const caption = mismatch
    ? `check: sum comes to ${total}, expected ${expected}`
    : isFinal
    ? `${pairSum} + ${leftover} = ${total} — choice ${problem.answer}`
    : collapsed
    ? `${pairs} pairs × (−1) = ${pairSum}`
    : "group consecutive (odd − even) terms into pairs";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {slots.map((slot, i) => {
          const x = xOf(i);
          if (slot.kind === "ellipsis") {
            return (
              <text key="ellipsis" x={x} y={midY + 5} textAnchor="middle" fontSize="16" fontWeight="800" fill="#94a3b8" fontFamily={numberFont}>
                ⋯
              </text>
            );
          }
          if (slot.kind === "leftover") {
            return (
              <g key="leftover">
                <motion.rect
                  x={x - 22}
                  y={midY - 15}
                  width={44}
                  height={30}
                  rx={7}
                  fill="none"
                  stroke={isFinal ? WIN : "#ca8a04"}
                  strokeWidth={1.8}
                  strokeDasharray={isFinal ? undefined : "4 3"}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.2 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
                <text x={x} y={midY + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill={isFinal ? WIN : "#ca8a04"} fontFamily={numberFont}>
                  +{leftover}
                </text>
                <text x={x} y={midY + 34} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                  unpaired
                </text>
              </g>
            );
          }
          const oddVal = 2 * slot.k - 1;
          const evenVal = 2 * slot.k;
          return (
            <g key={`pair${slot.k}`}>
              <AnimatePresence mode="wait">
                {!collapsed ? (
                  <motion.g key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ delay: 0.06 * i }}>
                    <rect x={x - 20} y={oddY - 12} width={40} height={20} rx={5} fill={MARK} />
                    <text x={x} y={oddY + 3} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                      +{oddVal}
                    </text>
                    <rect x={x - 20} y={evenY - 8} width={40} height={20} rx={5} fill={BAD} />
                    <text x={x} y={evenY + 7} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                      −{evenVal}
                    </text>
                    <path d={`M ${x - 24},${oddY - 12} v -6 h 48 v 6`} fill="none" stroke="#94a3b8" strokeWidth={1.2} />
                  </motion.g>
                ) : (
                  <motion.g key="closed" initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.05 * i }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <rect x={x - 18} y={midY - 13} width={36} height={26} rx={6} fill={INK} />
                    <text x={x} y={midY + 5} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                      −1
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          );
        })}

        <AnimatePresence>
          {isFinal && (
            <motion.text
              key="finish"
              x={W / 2}
              y={H - 34}
              textAnchor="middle"
              fontSize="15"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.45 }}
            >
              {pairSum} + {leftover} = {total}
            </motion.text>
          )}
        </AnimatePresence>

        <SvgAnswerBadge show={isFinal} answer={problem.answer ?? null} cx={W / 2} y={H - 26} width={92} />
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11.5,
          fontWeight: 800,
          color: mismatch ? "#991b1b" : isFinal ? "#166534" : "#4338ca",
          background: mismatch ? "#fee2e2" : isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${mismatch ? "#fecaca" : isFinal ? "#bbf7d0" : "#c7d2fe"}`,
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
            transition={{ delay: 0.6 }}
            style={{ fontFamily: numberFont, fontSize: 10.5, fontWeight: 700, color: BAD, textAlign: "center", maxWidth: 320 }}
          >
            Forgetting the leftover +{leftover} gives {pairSum} (choice {trapChoice.label}) instead of {total}.
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
