import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";

const parseChoice = (text: string) => Number(String(text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));

/** A simple person icon: circle head, rounded body. */
function Person({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy - 6} r={5} fill={color} />
      <path d={`M ${cx - 7},${cy + 10} Q ${cx - 7},${cy - 1} ${cx},${cy - 1} Q ${cx + 7},${cy - 1} ${cx + 7},${cy + 10} Z`} fill={color} />
    </g>
  );
}

/**
 * Two rooms, each with its own headcount and average age, merged into one.
 * The scene draws every person as a real figure in their room, converts each
 * room's average into its total by multiplying by headcount, then physically
 * merges both rooms into one before dividing by the combined count — a beat
 * is spent on the trap of just averaging the two averages, which silently
 * drops the headcounts and lands on a real answer choice.
 * Data: { countA, avgA, countB, avgB }.
 */
export function RoomAverageMergeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const countA = Math.max(1, Math.round(num(data.countA, 6)));
  const avgA = Math.max(0, num(data.avgA, 40));
  const countB = Math.max(1, Math.round(num(data.countB, 4)));
  const avgB = Math.max(0, num(data.avgB, 25));

  const totalA = countA * avgA;
  const totalB = countB * avgB;
  const combinedTotal = totalA + totalB;
  const combinedCount = countA + countB;
  const combinedAvg = combinedTotal / combinedCount;

  const matches = problem.shortAnswer == null || String(combinedAvg) === String(problem.shortAnswer);
  const failure = !matches ? `check failed: (${totalA}+${totalB}) ÷ ${combinedCount} = ${combinedAvg}, stored answer is ${problem.shortAnswer}` : "";

  const naiveAvg = (avgA + avgB) / 2;
  const trapChoice = (problem.choices ?? []).find((c) => Math.abs(parseChoice(c.text) - naiveAvg) < 1e-9);

  const lastStep = totalSteps - 1;
  const showTotalA = step >= 1;
  const showTotalB = step >= 2;
  const showTrap = step === 3;
  const showMerge = step >= 4;
  const isFinal = step >= lastStep;

  // ---- geometry ----
  const W = 320;
  const H = 230;
  const roomY = 30;
  const rowGap = 20;
  const perRow = 5;
  const posOf = (i: number, x0: number) => ({
    cx: x0 + (i % perRow) * rowGap,
    cy: roomY + Math.floor(i / perRow) * rowGap,
  });
  const ax0 = 44;
  const bx0 = 220;

  const caption = isFinal
    ? `(${totalA} + ${totalB}) ÷ ${combinedCount} = ${combinedAvg}`
    : showMerge
    ? `${combinedTotal} total years over ${combinedCount} people`
    : showTrap
    ? trapChoice
      ? `(${avgA} + ${avgB}) ÷ 2 = ${naiveAvg} — choice ${trapChoice.label}, but that ignores the different headcounts`
      : `(${avgA} + ${avgB}) ÷ 2 = ${naiveAvg} ignores the different headcounts`
    : showTotalB
    ? `Room B: ${countB} × ${avgB} = ${totalB}`
    : showTotalA
    ? `Room A: ${countA} × ${avgA} = ${totalA}`
    : `Room A has ${countA} people, Room B has ${countB}`;

  const note = failure || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        {/* Room A */}
        <AnimatePresence>
          {!showMerge && (
            <motion.g key="roomA" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={ax0} y={14} textAnchor="middle" fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont}>
                Room A
              </text>
              {Array.from({ length: countA }).map((_, i) => {
                const p = posOf(i, ax0 - (Math.min(countA, perRow) - 1) * rowGap / 2);
                return (
                  <motion.g key={i} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.06 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <Person cx={p.cx} cy={p.cy} color={IND} />
                  </motion.g>
                );
              })}
              <AnimatePresence>
                {showTotalA && (
                  <motion.text x={ax0} y={roomY + Math.ceil(countA / perRow) * rowGap + 14} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    avg {avgA} → {totalA}
                  </motion.text>
                )}
              </AnimatePresence>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Room B */}
        <AnimatePresence>
          {!showMerge && (
            <motion.g key="roomB" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={bx0} y={14} textAnchor="middle" fontSize="10" fontWeight="800" fill={TEAL} fontFamily={numberFont}>
                Room B
              </text>
              {Array.from({ length: countB }).map((_, i) => {
                const p = posOf(i, bx0 - (Math.min(countB, perRow) - 1) * rowGap / 2);
                return (
                  <motion.g key={i} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.06 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <Person cx={p.cx} cy={p.cy} color={TEAL} />
                  </motion.g>
                );
              })}
              <AnimatePresence>
                {showTotalB && (
                  <motion.text x={bx0} y={roomY + Math.ceil(countB / perRow) * rowGap + 14} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={TEAL} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    avg {avgB} → {totalB}
                  </motion.text>
                )}
              </AnimatePresence>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the trap: naive average of the two averages, ignoring headcount */}
        <AnimatePresence>
          {showTrap && (
            <motion.g key="trap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <rect x={W / 2 - 60} y={130} width={120} height={26} rx={8} fill="#fee2e2" stroke={BAD} strokeWidth={1.4} />
              <text x={W / 2} y={147} textAnchor="middle" fontSize="11" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                ({avgA}+{avgB})÷2 = {naiveAvg} ✗
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the merged group: all people together, one room */}
        <AnimatePresence>
          {showMerge && (
            <motion.g key="merged" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={W / 2} y={14} textAnchor="middle" fontSize="10" fontWeight="800" fill="#64748b" fontFamily={numberFont}>
                combined room
              </text>
              {Array.from({ length: combinedCount }).map((_, i) => {
                const perRowM = 5;
                const x0m = W / 2 - (Math.min(combinedCount, perRowM) - 1) * rowGap / 2;
                const cx = x0m + (i % perRowM) * rowGap;
                const cy = roomY + Math.floor(i / perRowM) * rowGap;
                return (
                  <motion.g key={i} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 17, delay: i * 0.05 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <Person cx={cx} cy={cy} color={i < countA ? IND : TEAL} />
                  </motion.g>
                );
              })}
              <motion.text
                x={W / 2}
                y={roomY + Math.ceil(combinedCount / 5) * rowGap + 20}
                textAnchor="middle"
                fontSize="12"
                fontWeight="800"
                fill={isFinal ? WIN : INK}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {totalA} + {totalB} = {combinedTotal}
              </motion.text>
              {isFinal && (
                <motion.text
                  x={W / 2}
                  y={roomY + Math.ceil(combinedCount / 5) * rowGap + 40}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="900"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.7 }}
                >
                  {combinedTotal} ÷ {combinedCount} = {combinedAvg}
                </motion.text>
              )}
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
        {note && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}
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
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
