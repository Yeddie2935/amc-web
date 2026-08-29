import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/** A tiny marble: a filled circle with a highlight. */
function Marble({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} stroke="#00000022" strokeWidth={0.6} />
      <ellipse cx={cx - r * 0.3} cy={cy - r * 0.35} rx={r * 0.28} ry={r * 0.18} fill="#ffffff" opacity={0.6} />
    </g>
  );
}

/**
 * Three "all but N are color X" clues on one jar of marbles — each clue is
 * really "count of the other two colors." Six beats: (0) the jar, count
 * unknown, the three clues stated; (1) each clue becomes an equation
 * (non-red, non-green, non-blue counts); (2) the trap — averaging the
 * three numbers looks like a shortcut and matches a real choice, but
 * that's not what the equations say; (3) adding all three counts each
 * marble twice, so the total is half the sum; (4) each color's count
 * follows from the total; (5) the badge, with the real jar of marbles.
 * Data: { notRed, notGreen, notBlue }.
 */
export function AllButCountScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const notRed = Math.round(num(data.notRed, 6));
  const notGreen = Math.round(num(data.notGreen, 8));
  const notBlue = Math.round(num(data.notBlue, 4));

  const sum = notRed + notGreen + notBlue;
  const total = sum / 2;
  const red = total - notRed;
  const green = total - notGreen;
  const blue = total - notBlue;

  const avgTrap = sum / 3;
  const trap = (problem.choices ?? []).find((c) => c.text.trim() === String(avgTrap));

  const valid = Number.isInteger(total) && red >= 0 && green >= 0 && blue >= 0 && red + green + blue === total;

  const last = totalSteps - 1;
  const showClues = step >= 1;
  const isTrapStep = step === 2;
  const showTotal = step >= 3;
  const showColors = step >= 4;
  const isFinal = step >= last;

  const W = 300;
  const H = showColors ? 190 : 130;

  const RED = "#dc2626";
  const GREEN = "#16a34a";
  const BLUE = "#2563eb";

  const marbles: { color: string }[] = showColors
    ? [...Array(red).fill(RED), ...Array(green).fill(GREEN), ...Array(blue).fill(BLUE)].map((c) => ({ color: c }))
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 300 }}>
        {!showClues && (
          <text x={W / 2} y={60} textAnchor="middle" fontSize="16" fontWeight="900" fill={DIM} fontFamily={FONT}>
            ? marbles
          </text>
        )}

        <AnimatePresence>
          {showClues && !showColors && (
            <motion.g key="clues" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: "not red", value: notRed, color: RED },
                { label: "not green", value: notGreen, color: GREEN },
                { label: "not blue", value: notBlue, color: BLUE },
              ].map((c, i) => (
                <motion.g key={c.label} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 240, damping: 17, delay: i * 0.12 }}>
                  <rect x={W / 2 - 90} y={20 + i * 32} width={180} height={26} rx={7} fill={isTrapStep ? "#f1f5f9" : `${c.color}12`} stroke={isTrapStep ? "#cbd5e1" : c.color} strokeWidth={1.6} />
                  <text x={W / 2 - 78} y={20 + i * 32 + 17} fontSize="10" fontWeight="800" fill={isTrapStep ? DIM : c.color} fontFamily={FONT}>
                    {c.label}
                  </text>
                  <text x={W / 2 + 78} y={20 + i * 32 + 17} textAnchor="end" fontSize="13" fontWeight="900" fill={isTrapStep ? DIM : c.color} fontFamily={FONT}>
                    {c.value}
                  </text>
                </motion.g>
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showColors && (
            <motion.g key="jar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={W / 2 - 60} y={16} width={120} height={90} rx={10} fill="#f8fafc" stroke={INK} strokeWidth={1.6} />
              {marbles.map((m, i) => {
                const cols = 3;
                const cx = W / 2 - 60 + 20 + (i % cols) * 40;
                const cy = 16 + 22 + Math.floor(i / cols) * 22;
                return (
                  <motion.g key={i} initial={{ opacity: 0, y: -12, scale: 0.5 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 280, damping: 17, delay: i * 0.08 }}>
                    <Marble cx={cx} cy={cy} r={8} color={m.color} />
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>
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
          color: isFinal ? WIN : showColors ? WIN : showTotal ? MARK : isTrapStep ? BAD : showClues ? MARK : DIM,
        }}
      >
        {isFinal
          ? `${total} marbles`
          : showColors
          ? `red = ${total}−${notRed} = ${red}, green = ${total}−${notGreen} = ${green}, blue = ${total}−${notBlue} = ${blue}`
          : showTotal
          ? `${notRed} + ${notGreen} + ${notBlue} = ${sum}, each marble counted twice: ${sum} ÷ 2 = ${total}`
          : isTrapStep
          ? `averaging the three clues: (${notRed}+${notGreen}+${notBlue})÷3 = ${avgTrap}${trap ? ` — matches choice ${trap.label}, but that's not what the clues say` : ""}`
          : showClues
          ? `each clue counts the marbles that are the other two colors`
          : `all but ${notRed} are red, all but ${notGreen} are green, all but ${notBlue} are blue`}
      </motion.div>

      <AnimatePresence>
        {isFinal && !valid && (
          <motion.div key="warn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 9.5, fontWeight: 700, color: BAD, textAlign: "center" }}>
            the counts don't add up consistently
          </motion.div>
        )}
      </AnimatePresence>

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
