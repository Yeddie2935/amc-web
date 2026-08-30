import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

/**
 * A haunted house facade with n windows: a ghost flies into one chosen
 * entrance, then fans out to every OTHER window as a possible exit — a beat
 * is spent on the trap of looping back into the entrance itself (n x n,
 * which double-counts staying put), before landing on n x (n-1).
 * Data: { windowCount }.
 */
export function WindowEntryExitScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(3, Math.min(9, Math.round(num(data.windowCount, 6))));
  const entranceIdx = Math.floor(n / 2) - 1 >= 0 ? Math.floor(n / 2) - 1 : 0;

  const total = n * (n - 1);
  const trapTotal = n * n;

  const matches = problem.shortAnswer == null || String(total) === String(problem.shortAnswer);
  const failure = !matches ? `check failed: ${n}×${n - 1} = ${total}, stored answer is ${problem.shortAnswer}` : "";

  const trapChoice = (problem.choices ?? []).find((c) => c.text.trim() === String(trapTotal));

  const lastStep = totalSteps - 1;
  const showEntrance = step >= 1;
  const showExitFan = step >= 2;
  const showTrap = step === 3;
  const showTally = step >= 4;
  const isFinal = step >= lastStep;

  const caption = isFinal
    ? `${n} × ${n - 1} = ${total}`
    : showTally
    ? `every entrance pairs with ${n - 1} exits: ${total} ways total`
    : showTrap && trapChoice
    ? `${n}×${n} = ${trapTotal} — choice ${trapChoice.label}, but the exit can't be the entrance`
    : showExitFan
    ? `${n - 1} windows remain for the exit`
    : showEntrance
    ? `${n} choices for the entrance`
    : `a haunted house with ${n} windows`;

  const note = failure || "";

  // ---- geometry ----
  const W = 320;
  const H = 210;
  const winW = 28;
  const gap = 10;
  const totalW = n * winW + (n - 1) * gap;
  const startX = (W - totalW) / 2;
  const winY = 90;
  const winH = 60;
  const xOf = (i: number) => startX + i * (winW + gap);
  const cxOf = (i: number) => xOf(i) + winW / 2;

  const entranceCx = cxOf(entranceIdx);
  const entranceCy = winY + winH / 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        {/* house wall */}
        <rect x={startX - 16} y={winY - 20} width={totalW + 32} height={winH + 60} rx={4} fill="#312e42" />
        <polygon points={`${startX - 24},${winY - 20} ${W / 2},${winY - 56} ${startX + totalW + 24},${winY - 20}`} fill="#241f33" />

        {/* windows */}
        {Array.from({ length: n }).map((_, i) => {
          const isEntrance = i === entranceIdx;
          const isExitOption = showExitFan && !isEntrance;
          const fill = isEntrance && showEntrance ? "#fde68a" : isExitOption ? "#bbf7d0" : "#e0e7ff";
          const stroke = isEntrance && showEntrance ? "#b45309" : isExitOption ? WIN : IND;
          return (
            <motion.rect
              key={i}
              x={xOf(i)}
              y={winY}
              width={winW}
              height={winH}
              rx={5}
              fill={fill}
              stroke={stroke}
              strokeWidth={1.6}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 18, delay: i * 0.05 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          );
        })}

        {/* exit fan: arrows from entrance to every other window */}
        <AnimatePresence>
          {showExitFan &&
            Array.from({ length: n }).map((_, i) => {
              if (i === entranceIdx) return null;
              return (
                <motion.line
                  key={`fan-${i}`}
                  x1={entranceCx}
                  y1={entranceCy}
                  x2={cxOf(i)}
                  y2={winY}
                  stroke={WIN}
                  strokeWidth={1.6}
                  markerEnd="url(#arrowGreen)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.35, delay: Math.abs(i - entranceIdx) * 0.08 }}
                />
              );
            })}
        </AnimatePresence>

        {/* trap: a dashed red loop back into the entrance itself */}
        <AnimatePresence>
          {showTrap && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.path
                d={`M ${entranceCx - 10} ${entranceCy} C ${entranceCx - 40} ${entranceCy - 40}, ${entranceCx + 40} ${entranceCy - 40}, ${entranceCx + 10} ${entranceCy}`}
                fill="none"
                stroke={BAD}
                strokeWidth={1.8}
                strokeDasharray="4 3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              <text x={entranceCx} y={entranceCy - 46} textAnchor="middle" fontSize="14" fill={BAD} fontWeight="800">
                ✕
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the ghost: hovers, then settles into the entrance window */}
        <motion.g
          initial={{ x: W / 2, y: 24 }}
          animate={{ x: showEntrance ? entranceCx : W / 2, y: showEntrance ? entranceCy : 24 }}
          transition={{ type: "spring", stiffness: 160, damping: 16 }}
        >
          <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontSize="22">
            👻
          </text>
        </motion.g>

        {/* tally: compact dot grid, one dot per ordered entrance-exit pair */}
        <AnimatePresence>
          {showTally && (
            <motion.g key="tally" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {Array.from({ length: n }).map((_, r) =>
                Array.from({ length: n - 1 }).map((_, c) => (
                  <motion.circle
                    key={`${r}-${c}`}
                    cx={startX + c * ((totalW - 10) / (n - 1)) + 5}
                    cy={winY + winH + 26 + r * 9}
                    r={2.4}
                    fill={IND}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15, delay: (r * (n - 1) + c) * 0.006 }}
                  />
                )),
              )}
            </motion.g>
          )}
        </AnimatePresence>

        <defs>
          <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={WIN} />
          </marker>
        </defs>
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
          color: isFinal ? "#166534" : showTrap ? BAD : "#4338ca",
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
