import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const parseChoice = (text: string) => Number(String(text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));

/**
 * Bridget's leftover apples — Cassie's share plus her own — are exactly half
 * the bag, so the scene builds that remainder as a row of apple emoji, checks
 * it against the trap choice that equals the remainder alone, then mirrors
 * the row to reconstruct Ann's half and double the count, undoing the "gave
 * away half" step the same way the written solution does.
 * Data: { cassie, self }.
 */
export function AppleBagBacktrackScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const cassie = Math.max(1, Math.round(num(data.cassie, 3)));
  const self = Math.max(1, Math.round(num(data.self, 4)));
  const remainder = cassie + self;
  const total = remainder * 2;

  const matches = problem.shortAnswer == null || String(total) === String(problem.shortAnswer);
  const failure = !matches ? `check failed: 2 × (${cassie} + ${self}) = ${total}, stored answer is ${problem.shortAnswer}` : "";

  const trapChoice = (problem.choices ?? []).find((c) => parseChoice(c.text) === remainder);

  const lastStep = totalSteps - 1;
  const merged = step >= 1;
  const showTrap = step >= 2;
  const doubled = step >= 3;
  const isFinal = step >= lastStep;

  // ---- geometry ----
  const W = 360;
  const H = 280;
  const x0 = 32;
  const spacing = 44;
  const bottomY = 195;
  const topY = 128;
  const appleFont = 20;
  const annWidth = remainder * spacing - (spacing - 28);

  const cassieX = (i: number) => x0 + i * spacing;
  const selfXBefore = (i: number) => x0 + (cassie + 1 + i) * spacing;
  const selfXAfter = (i: number) => x0 + (cassie + i) * spacing;
  const annX = (i: number) => x0 + i * spacing;

  const caption = isFinal
    ? `Bridget bought ${total} apples`
    : doubled
    ? `Ann's half must match: 2 × ${remainder} = ${total}`
    : showTrap
    ? `${remainder} matches choice ${trapChoice?.label ?? "?"} — but that's only half the bag`
    : merged
    ? `${cassie} + ${self} = ${remainder} apples left after Ann's half was gone`
    : `Cassie got ${cassie}, Bridget kept ${self} — Ann's half is still unknown`;

  const note = failure
    ? failure
    : isFinal
    ? `${remainder} + ${remainder} = ${total}`
    : showTrap && !doubled
    ? trapChoice
      ? `choice ${trapChoice.label} is ${trapChoice.text} — the un-doubled remainder, not the full bag`
      : ""
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="11" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          🧺 Bridget's bag — how many apples?
        </text>

        {/* Ann's half: unknown cloud, then a mirrored row once we double back */}
        <AnimatePresence mode="wait">
          {!doubled ? (
            <motion.g key="ann-unknown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <rect
                x={x0 - 14}
                y={topY - 22}
                width={annWidth}
                height={40}
                rx={10}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth={1.4}
                strokeDasharray="5 4"
              />
              <text x={x0 - 14 + annWidth / 2} y={topY + 3} textAnchor="middle" fontSize="13" fontWeight="800" fill="#94a3b8" fontFamily={numberFont}>
                Ann's half — ?
              </text>
            </motion.g>
          ) : (
            <motion.g key="ann-revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={x0 - 14 + annWidth / 2} y={topY - 26} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                Ann's half = {remainder} too
              </text>
              {Array.from({ length: remainder }).map((_, i) => (
                <motion.text
                  key={i}
                  x={annX(i)}
                  y={topY}
                  fontSize={appleFont}
                  textAnchor="middle"
                  dominantBaseline="central"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.15 + i * 0.06 }}
                >
                  🍏
                </motion.text>
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Cassie's apples: fixed slots */}
        {Array.from({ length: cassie }).map((_, i) => (
          <motion.text
            key={`c${i}`}
            y={bottomY}
            fontSize={appleFont}
            textAnchor="middle"
            dominantBaseline="central"
            initial={{ opacity: 0, scale: 0, x: cassieX(i) }}
            animate={{ opacity: 1, scale: 1, x: cassieX(i) }}
            transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.1 + i * 0.06 }}
          >
            🍎
          </motion.text>
        ))}

        {/* Bridget's own apples: slide out of the gap into a contiguous row on merge */}
        {Array.from({ length: self }).map((_, i) => (
          <motion.text
            key={`s${i}`}
            y={bottomY}
            fontSize={appleFont}
            textAnchor="middle"
            dominantBaseline="central"
            initial={{ opacity: 0, scale: 0, x: 0 }}
            animate={{ opacity: 1, scale: 1, x: merged ? selfXAfter(i) : selfXBefore(i) }}
            transition={
              merged
                ? { type: "spring", stiffness: 170, damping: 20 }
                : { type: "spring", stiffness: 240, damping: 16, delay: 0.1 + (cassie + i) * 0.06 }
            }
          >
            🍎
          </motion.text>
        ))}

        <text x={x0 + ((cassie - 1) * spacing) / 2} y={bottomY + 24} textAnchor="middle" fontSize="10.5" fontWeight={700} fill="#0d9488" fontFamily={numberFont}>
          Cassie
        </text>
        <motion.text
          y={bottomY + 24}
          textAnchor="middle"
          fontSize="10.5"
          fontWeight={700}
          fill={IND}
          fontFamily={numberFont}
          animate={{ x: merged ? (selfXAfter(0) + selfXAfter(self - 1)) / 2 : (selfXBefore(0) + selfXBefore(self - 1)) / 2 }}
          transition={{ type: "spring", stiffness: 170, damping: 20 }}
        >
          Bridget kept
        </motion.text>

        {merged && (
          <motion.text
            x={x0 + ((cassie + self - 1) * spacing) / 2}
            y={bottomY + 40}
            textAnchor="middle"
            fontSize="13"
            fontWeight="800"
            fill={INK}
            fontFamily={numberFont}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {cassie} + {self} = {remainder}
          </motion.text>
        )}

        {/* trap: the answer choices, with the remainder-only value called out */}
        <AnimatePresence>
          {showTrap && !isFinal && (
            <motion.g key="choices" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {(problem.choices ?? []).map((c, i) => {
                const isTrap = trapChoice?.label === c.label;
                const cx = 46 + i * 62;
                return (
                  <g key={c.label}>
                    <rect
                      x={cx - 24}
                      y={254}
                      width={48}
                      height={20}
                      rx={10}
                      fill={isTrap ? "#fee2e2" : "#f8fafc"}
                      stroke={isTrap ? BAD : "#cbd5e1"}
                      strokeWidth={isTrap ? 1.6 : 1}
                    />
                    <text x={cx} y={268} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={isTrap ? BAD : "#64748b"} fontFamily={numberFont}>
                      {c.label}: {c.text}
                    </text>
                  </g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>

        {/* final total, drawn once the doubling lands */}
        <AnimatePresence>
          {isFinal && (
            <motion.text
              x={W / 2}
              y={topY - 42}
              textAnchor="middle"
              fontSize="15"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.5 }}
            >
              {total} apples in all
            </motion.text>
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
          color: isFinal ? "#166534" : showTrap && !doubled ? "#dc2626" : "#4338ca",
          background: isFinal ? "#dcfce7" : showTrap && !doubled ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap && !doubled ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {note && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: numberFont,
              fontSize: 11.5,
              fontWeight: 700,
              color: failure ? BAD : "#94a3b8",
              textAlign: "center",
            }}
          >
            {note}
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
