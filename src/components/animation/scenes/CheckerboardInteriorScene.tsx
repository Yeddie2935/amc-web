import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const LIGHT = "#f8fafc";
const DARK = "#94a3b8";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/**
 * A checkerboard of n × n unit squares, asking for the odds a random square
 * misses every edge. "Not touching the edge" strips one ring all the way
 * around, leaving an (n−2) × (n−2) interior — the scene outlines that block
 * directly on the real checker pattern, then checks it against the classic
 * off-by-one slip of stripping only one side, (n−1) × (n−1).
 * Data: { boardSize }.
 */
export function CheckerboardInteriorScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(3, Math.round(num(data.boardSize, 8)));

  const total = n * n;
  const interiorSide = n - 2;
  const interior = interiorSide * interiorSide;
  const g = gcd(interior, total) || 1;
  const probNum = interior / g;
  const probDen = total / g;
  const matches = problem.shortAnswer == null || `${probNum}/${probDen}` === String(problem.shortAnswer);
  const failure = !matches ? `check failed: ${interior}/${total} = ${probNum}/${probDen}, stored answer is ${problem.shortAnswer}` : "";

  const trapSide = n - 1;
  const trapArea = trapSide * trapSide;
  const trapChoice = (problem.choices ?? []).find((c) => c.text.trim() === `${trapArea}/${total}`);

  const lastStep = totalSteps - 1;
  const showBorder = step >= 1;
  const showInterior = step >= 2;
  const showTrap = step === 3;
  const isFinal = step >= lastStep;

  // ---- geometry ----
  const cell = 13;
  const x0 = 20;
  const y0 = 16;
  const boardPx = n * cell;
  const W = x0 * 2 + boardPx;
  const H = y0 + boardPx + 20;
  const cx = (c: number) => x0 + c * cell;

  const caption = isFinal
    ? `${interior}/${total} = ${probNum}/${probDen}`
    : showTrap
    ? trapChoice
      ? `stripping just one side gives ${trapSide}×${trapSide} = ${trapArea} — choice ${trapChoice.label}, but both edges must go`
      : `stripping just one side gives ${trapSide}×${trapSide} = ${trapArea}, not the real interior`
    : showInterior
    ? `interior block: ${interiorSide} × ${interiorSide} = ${interior} squares`
    : showBorder
    ? `every square touching an edge forms a ring around the board`
    : `${n} × ${n} = ${total} unit squares`;

  const note = failure || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        {/* the real checker pattern */}
        {Array.from({ length: n }).map((_, r) =>
          Array.from({ length: n }).map((_, c) => (
            <rect key={`${r}-${c}`} x={cx(c)} y={y0 + r * cell} width={cell} height={cell} fill={(r + c) % 2 === 0 ? LIGHT : DARK} stroke="#cbd5e1" strokeWidth={0.6} />
          )),
        )}

        {/* the border ring, washed */}
        <AnimatePresence>
          {showBorder &&
            Array.from({ length: n }).map((_, r) =>
              Array.from({ length: n }).map((_, c) => {
                const onEdge = r === 0 || r === n - 1 || c === 0 || c === n - 1;
                if (!onEdge) return null;
                return (
                  <motion.rect
                    key={`edge-${r}-${c}`}
                    x={cx(c)}
                    y={y0 + r * cell}
                    width={cell}
                    height={cell}
                    fill={IND}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showInterior ? 0.28 : 0.45 }}
                    transition={{ duration: 0.4, delay: (r + c) * 0.006 }}
                  />
                );
              }),
            )}
        </AnimatePresence>

        {/* the true interior block, outlined */}
        <AnimatePresence>
          {showInterior && (
            <motion.rect
              key="interior"
              x={cx(1)}
              y={y0 + cell}
              width={interiorSide * cell}
              height={interiorSide * cell}
              fill="none"
              stroke={WIN}
              strokeWidth={2.4}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          )}
        </AnimatePresence>

        {/* the one-sided trap block, dashed red */}
        <AnimatePresence>
          {showTrap && (
            <motion.rect
              key="trap"
              x={cx(0)}
              y={y0}
              width={trapSide * cell}
              height={trapSide * cell}
              fill="none"
              stroke={BAD}
              strokeWidth={2}
              strokeDasharray="5 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>

        <rect x={x0} y={y0} width={boardPx} height={boardPx} fill="none" stroke={INK} strokeWidth={1.6} />
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
