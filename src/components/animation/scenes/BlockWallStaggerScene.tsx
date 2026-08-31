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
 * The fewest blocks for one row uses only 2-foot pieces, but repeating that
 * same row every time lines up every vertical join, which the staggering
 * rule forbids — so every other row needs 1-foot blocks at both ends to
 * shift its joins. The scene builds one plain row, has to survive the trap
 * of just repeating it for all seven rows, then builds the real staggered
 * row and stacks the true alternating mix.
 * Data: { wallLength, wallHeight, blockLong, blockShort }.
 */
export function BlockWallStaggerScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const wallLength = Math.max(2, Math.round(num(data.wallLength, 100)));
  const wallHeight = Math.max(1, Math.round(num(data.wallHeight, 7)));
  const blockLong = Math.max(2, Math.round(num(data.blockLong, 2)));
  const blockShort = Math.max(1, Math.round(num(data.blockShort, 1)));

  const plainRowBlocks = wallLength / blockLong;
  const staggeredMiddle = (wallLength - 2 * blockShort) / blockLong;
  const staggeredRowBlocks = staggeredMiddle + 2;

  const plainRows = Math.ceil(wallHeight / 2);
  const staggeredRows = wallHeight - plainRows;
  const total = plainRows * plainRowBlocks + staggeredRows * staggeredRowBlocks;
  const answerOk = problem.shortAnswer == null || String(total) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${total}, stored answer is ${problem.shortAnswer}` : "";

  const trapTotal = wallHeight * plainRowBlocks;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapTotal));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showStagger = step >= 2 || isFinal;

  const W = 300;
  const H = 200;
  const unit = 2.2;
  const x0 = 20;
  const y0 = 20;
  const rowH = 22;

  const rowsToDraw = isFinal ? wallHeight : showStagger ? 3 : showTrap ? Math.min(wallHeight, 3) : 1;

  const PlainRow = ({ y }: { y: number }) => (
    <g>
      {Array.from({ length: plainRowBlocks }).map((_, i) => (
        <rect key={i} x={x0 + i * blockLong * unit} y={y} width={blockLong * unit - 2} height={rowH - 2} fill="#eef2ff" stroke={IND} strokeWidth={1} />
      ))}
    </g>
  );

  const StaggerRow = ({ y }: { y: number }) => (
    <g>
      <rect x={x0} y={y} width={blockShort * unit - 2} height={rowH - 2} fill="#dcfce7" stroke={WIN} strokeWidth={1} />
      {Array.from({ length: staggeredMiddle }).map((_, i) => (
        <rect key={i} x={x0 + blockShort * unit + i * blockLong * unit} y={y} width={blockLong * unit - 2} height={rowH - 2} fill="#eef2ff" stroke={IND} strokeWidth={1} />
      ))}
      <rect x={x0 + blockShort * unit + staggeredMiddle * blockLong * unit} y={y} width={blockShort * unit - 2} height={rowH - 2} fill="#dcfce7" stroke={WIN} strokeWidth={1} />
    </g>
  );

  const caption = isFinal
    ? `${plainRows} × ${plainRowBlocks} + ${staggeredRows} × ${staggeredRowBlocks} = ${total}`
    : showStagger
    ? `staggered row: ${blockShort} + ${blockLong} × ${staggeredMiddle} + ${blockShort} = ${staggeredRowBlocks} blocks`
    : showTrap
    ? trapChoice
      ? `repeating the plain row ${wallHeight} times: ${wallHeight} × ${plainRowBlocks} = ${trapTotal} — choice ${trapChoice.label}, but every join lines up`
      : `repeating the plain row for all rows gives ${trapTotal}, ignoring the stagger rule`
    : `one row, fewest blocks: ${wallLength} ÷ ${blockLong} = ${plainRowBlocks}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {Array.from({ length: rowsToDraw }).map((_, r) => {
          const y = y0 + (rowsToDraw - 1 - r) * rowH;
          const useStagger = showStagger && r % 2 === 1;
          return (
            <motion.g key={r} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: r * 0.15 }}>
              {useStagger ? <StaggerRow y={y} /> : <PlainRow y={y} />}
            </motion.g>
          );
        })}
        {isFinal && (
          <text x={x0} y={y0 + rowsToDraw * rowH + 14} fontSize="9" fontWeight="800" fill={DIM} fontFamily={numberFont}>
            {wallHeight} rows total ({plainRows} plain + {staggeredRows} staggered)
          </text>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 300,
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
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
