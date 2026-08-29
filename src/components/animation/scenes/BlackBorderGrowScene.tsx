import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const BLACK = "#1f2a44";
const WHITE = "#ffffff";
const EDGE = "#94a3b8";

/**
 * A square tile pattern gets a one-tile border of black added all the way
 * around, and the question is the new black:white ratio. The whole trap is
 * that the ratio looks like it "should" stay put — it's the same pattern,
 * just framed — so the scene spends a beat on that exact wrong instinct
 * before growing the border for real.
 *
 * The inner size×size pattern is drawn from the real black-cell coordinates
 * (read off the contest figure, not guessed), so the 8-black/17-white count
 * comes from counting real cells, not from being told. The border ring is
 * every cell of the (size+2)×(size+2) grid outside the inner square — its
 * count (49−25=24 here) falls out of that same grid, and every added cell is
 * black, so white never moves while black picks up the whole ring.
 *
 * data: { size, blackCells: ["r,c", ...] } — coordinates 0-indexed within
 * the inner size×size pattern.
 */
export function BlackBorderGrowScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const size = Math.max(1, Math.round(num(data.size, 5)));
  const blackCells = new Set(
    (Array.isArray(data.blackCells) ? data.blackCells : []).map((s) => String(s))
  );
  const blackCount = blackCells.size;
  const whiteCount = size * size - blackCount;

  const outerSize = size + 2;
  const ringCount = outerSize * outerSize - size * size;
  const totalBlack = blackCount + ringCount;
  const totalWhite = whiteCount;
  const expected = `${totalBlack}:${totalWhite}`;
  const ok = expected === (problem.shortAnswer ?? "").trim();

  const trapChoice = (problem.choices ?? []).find(
    (c) => String(c.text).replace(/\s+/g, "") === `${blackCount}:${whiteCount}`
  );

  // ---- beats: 0 setup, 1 the same-ratio trap, 2 grow the border, 3 recount, 4 form the ratio ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 4));
  const isFinal = step >= last;

  // ---- geometry: everything laid out in the final (size+2)^2 grid frame ----
  const W = 340;
  const H = 320;
  const cell = Math.min(28, 176 / outerSize);
  const gridW = outerSize * cell;
  const gx = (W - gridW) / 2;
  const gy = 44;

  const showRing = beat >= 2;
  const inCells: { r: number; c: number; black: boolean }[] = [];
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) inCells.push({ r, c, black: blackCells.has(`${r},${c}`) });
  const ringCells: { r: number; c: number }[] = [];
  for (let r = 0; r < outerSize; r++)
    for (let c = 0; c < outerSize; c++)
      if (r === 0 || r === outerSize - 1 || c === 0 || c === outerSize - 1) ringCells.push({ r, c });

  const caption =
    beat === 0
      ? `${blackCount} black, ${whiteCount} white in the ${size}×${size} pattern`
      : beat === 1
      ? `the ratio isn't staying ${blackCount}:${whiteCount}`
      : beat === 2
      ? `${outerSize}×${outerSize} − ${size}×${size} = ${ringCount} new black tiles`
      : beat === 3
      ? `${blackCount}+${ringCount}=${totalBlack} black, ${whiteCount} white — unchanged`
      : `${totalBlack}:${totalWhite}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        <text x={W / 2} y={20} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>
          {beat < 2 ? `${size} × ${size} pattern` : `${outerSize} × ${outerSize} with a black border`}
        </text>

        {/* the border ring drawn first so the inner pattern sits on top */}
        {showRing && (
          <>
            <motion.rect
              x={gx}
              y={gy}
              width={gridW}
              height={gridW}
              fill="none"
              stroke={IND}
              strokeWidth={2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
            {ringCells.map((cellPos, i) => (
              <motion.rect
                key={`ring${cellPos.r}-${cellPos.c}`}
                x={gx + cellPos.c * cell}
                y={gy + cellPos.r * cell}
                width={cell}
                height={cell}
                fill={BLACK}
                stroke={WHITE}
                strokeWidth={1}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 + i * 0.02 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            ))}
          </>
        )}

        {/* the inner pattern, from real cell data, present every beat */}
        {inCells.map((cellData, i) => (
          <motion.rect
            key={`in${cellData.r}-${cellData.c}`}
            x={gx + (cellData.c + 1) * cell}
            y={gy + (cellData.r + 1) * cell}
            width={cell}
            height={cell}
            fill={cellData.black ? BLACK : WHITE}
            stroke={EDGE}
            strokeWidth={1}
            initial={beat === 0 ? { opacity: 0, scale: 0.3 } : { opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: beat === 0 ? 0.05 + i * 0.02 : 0 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}
        <rect x={gx + cell} y={gy + cell} width={size * cell} height={size * cell} fill="none" stroke={INK} strokeWidth={1.6} />

        {/* the trap: the old ratio, crossed out */}
        {beat === 1 && (
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={W / 2 - 48} y={gy + gridW + 16} width={96} height={30} rx={8} fill="#fee2e2" stroke={BAD} strokeWidth={1.4} />
            <text x={W / 2} y={gy + gridW + 36} textAnchor="middle" fontSize="14" fontWeight="800" fill={BAD} fontFamily={FONT}>
              {blackCount}:{whiteCount} ✗
            </text>
          </motion.g>
        )}

        {/* beat 3: the recount, tallied */}
        {beat === 3 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <text x={W / 2} y={gy + gridW + 24} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={FONT}>
              black: {blackCount} + {ringCount} = {totalBlack}
            </text>
            <text x={W / 2} y={gy + gridW + 44} textAnchor="middle" fontSize="12" fontWeight="800" fill={DIM} fontFamily={FONT}>
              white: {whiteCount} + 0 = {totalWhite}
            </text>
          </motion.g>
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : beat === 1 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 1 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 1 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 1 && (
          <motion.span
            key="trap-note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 260 }}
          >
            {trapChoice
              ? `every new border tile is black, so choice ${trapChoice.label} (${blackCount}:${whiteCount}) can't be right`
              : `every new border tile is black, so the ratio has to shift`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${expected} but stored answer reads "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
