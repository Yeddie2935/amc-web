import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const PLACE_NAMES = ["10k", "1k", "100", "10", "1"];

/**
 * Splitting all ten digits into two five-digit numbers for the largest
 * possible sum: the sum is maximized by putting the two largest digits in
 * the highest place value (across both numbers), the next two in the next
 * place, and so on — so a valid number takes exactly one digit from each
 * of those five pairs, in order. Six beats: (0) the ten digits pair up by
 * place value; (1) the trap — a choice with strictly decreasing digits
 * *looks* right but its leading digit isn't in the top pair; (2) the other
 * wrong choices are checked and each misses at some place; (3) the real
 * answer checks clean against every pair; (4) its complement completes the
 * maximum sum; (5) the badge. Data: { digits: string[] } — the ten digits,
 * any order (sorted internally).
 */
export function DigitPairPlaceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const rawDigits = (Array.isArray(data.digits) ? data.digits : []).map((d) => String(d));
  const digits = rawDigits.length === 10 ? [...rawDigits].sort((a, b) => Number(b) - Number(a)) : "9876543210".split("");

  const pairs = Array.from({ length: 5 }, (_, i) => [digits[i * 2], digits[i * 2 + 1]]);
  const pairSets = pairs.map((p) => new Set(p));

  const checkChoice = (text: string) => {
    const d = text.trim().split("");
    if (d.length !== 5) return { valid: false, marks: [] as boolean[] };
    const marks = d.map((c, i) => pairSets[i]?.has(c) ?? false);
    return { valid: marks.every(Boolean), marks };
  };

  const choices = (problem.choices ?? []).map((c) => ({ label: c.label, text: c.text.trim(), ...checkChoice(c.text) }));
  const validChoice = choices.find((c) => c.valid);
  const wrongChoices = choices.filter((c) => !c.valid);
  const firstWrong = wrongChoices[0];

  const complement = validChoice ? validChoice.text.split("").map((c, i) => [...pairSets[i]].find((x) => x !== c)!).join("") : "";
  const total = validChoice ? Number(validChoice.text) + Number(complement) : 0;

  const last = totalSteps - 1;
  const showTrap = step >= 1;
  const showOthers = step >= 2;
  const showValid = step >= 3;
  const showSum = step >= 4;
  const isFinal = step >= last;

  const W = 300;
  const boxW = 46;
  const gap = 10;
  const x0 = 20;
  const xFor = (i: number) => x0 + i * (boxW + gap);
  const pairY = 16;
  const pairH = 40;
  const rowH = 22;
  const rowsY0 = pairY + pairH + 14;

  const rows: { label: string; text: string; marks: boolean[]; color: string; show: boolean }[] = [
    { label: firstWrong?.label ?? "", text: firstWrong?.text ?? "", marks: firstWrong?.marks ?? [], color: BAD, show: showTrap },
    ...wrongChoices.slice(1).map((c) => ({ label: c.label, text: c.text, marks: c.marks, color: BAD, show: showOthers })),
    { label: validChoice?.label ?? "", text: validChoice?.text ?? "", marks: validChoice?.marks ?? [], color: isFinal ? WIN : MARK, show: showValid },
  ];
  const H = rowsY0 + rows.length * rowH + 10;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {pairs.map((p, i) => (
          <motion.g key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.08 }}>
            <rect x={xFor(i)} y={pairY} width={boxW} height={pairH} rx={7} fill="#eef2ff" stroke={MARK} strokeWidth={1.6} />
            <text x={xFor(i) + boxW / 2} y={pairY + 16} textAnchor="middle" fontSize="12" fontWeight="900" fill={MARK} fontFamily={FONT}>
              {p[0]}
            </text>
            <text x={xFor(i) + boxW / 2} y={pairY + 32} textAnchor="middle" fontSize="12" fontWeight="900" fill={MARK} fontFamily={FONT}>
              {p[1]}
            </text>
            <text x={xFor(i) + boxW / 2} y={pairY + pairH + 11} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM} fontFamily={FONT}>
              {PLACE_NAMES[i]}
            </text>
          </motion.g>
        ))}

        {rows.map((row, ri) => {
          const y = rowsY0 + ri * rowH;
          return (
            <AnimatePresence key={ri}>
              {row.show && row.text && (
                <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 240, damping: 18 }}>
                  <text x={x0 - 8} y={y + 13} textAnchor="end" fontSize="9" fontWeight="800" fill={DIM} fontFamily={FONT}>
                    {row.label}
                  </text>
                  {row.text.split("").map((c, i) => (
                    <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 280, damping: 16, delay: i * 0.08 }}>
                      <rect x={xFor(i)} y={y} width={boxW} height={rowH - 4} rx={5} fill={row.marks[i] ? `${row.color}18` : `${BAD}18`} stroke={row.marks[i] ? row.color : BAD} strokeWidth={1.4} />
                      <text x={xFor(i) + boxW / 2} y={y + 14} textAnchor="middle" fontSize="11" fontWeight="900" fill={row.marks[i] ? row.color : BAD} fontFamily={FONT}>
                        {c}
                      </text>
                    </motion.g>
                  ))}
                </motion.g>
              )}
            </AnimatePresence>
          );
        })}
      </svg>

      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontFamily: FONT,
          fontSize: 11,
          fontWeight: 800,
          textAlign: "center",
          maxWidth: 320,
          color: isFinal ? WIN : showSum ? WIN : showValid ? MARK : showOthers ? BAD : showTrap ? BAD : DIM,
        }}
      >
        {isFinal
          ? `${validChoice?.text} is one of the two numbers`
          : showSum
          ? `${validChoice?.text} + ${complement} = ${total}, the largest possible sum`
          : showValid
          ? `${validChoice?.text} takes exactly one digit from every pair, in order — valid`
          : showOthers
          ? wrongChoices
              .slice(1)
              .map((c) => `${c.text} misses at the ${PLACE_NAMES[c.marks.findIndex((m) => !m)]} place`)
              .join("; ")
          : showTrap
          ? `${firstWrong?.text}'s digits look nicely decreasing, but its lead digit isn't in the top pair — invalid`
          : `pair the digits by place value: the two largest go in the highest place, and so on`}
      </motion.div>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
