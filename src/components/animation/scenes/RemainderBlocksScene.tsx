import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const FULL = "#cbd5e1";
const FULL_EDGE = "#94a3b8";
const REM = "#f59e0b";
const BAD = "#dc2626";
const WIN = "#16a34a";
const PICK = "#4338ca";

/**
 * "Erase one number so the rest is a multiple of k." Every number is drawn as
 * blocks stacked in rows of k: the whole rows are the part already divisible by
 * k, the short top row is its remainder. All the remainders pool together, and
 * the pool's own leftover is the total's remainder — so the number that must go
 * is the one whose remainder equals it. Remainders, the total, the culprit and
 * the resulting sum are all computed from the numbers and the divisor.
 * Data: { numbers:[...], divisor }.
 */
export function RemainderBlocksScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const divisor = Math.max(2, Math.round(num(data.divisor, 4)));
  const numbers = Array.isArray(data.numbers) ? data.numbers.map((v) => Math.max(0, Math.round(num(v, 0)))) : [];

  const total = numbers.reduce((a, b) => a + b, 0);
  const totalRem = total % divisor;
  const rems = numbers.map((n) => n % divisor);
  // the number to erase: its remainder must match the total's
  const eraseIdx = rems.findIndex((r) => r === totalRem);
  const erased = eraseIdx >= 0 ? numbers[eraseIdx] : null;
  const after = erased != null ? total - erased : total;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showPool = step >= 1 || isFinal;
  const showMatch = step >= 2 || isFinal;

  // ---- geometry ----
  const u = 8; // block pitch
  const box = 6.4; // block size
  const colGap = 66;
  const mx = 26;
  const baseY = 96;
  const colX = (i: number) => mx + i * colGap;
  const W = mx * 2 + Math.max(1, numbers.length - 1) * colGap + divisor * u;
  const poolBaseY = 186;
  const poolX = W / 2 - (divisor * u) / 2;
  const H = 210;

  // remainder blocks, with a pool slot for each one still in play
  const remBlocks: { i: number; j: number; poolK: number | null }[] = [];
  let k = 0;
  numbers.forEach((_, i) => {
    const dropped = isFinal && i === eraseIdx;
    for (let j = 0; j < rems[i]; j++) {
      remBlocks.push({ i, j, poolK: dropped ? null : k++ });
    }
  });
  const poolCount = k;
  const poolStray = poolCount % divisor;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 440 }}>
        {numbers.map((n, i) => {
          const fullRows = Math.floor(n / divisor);
          const gone = isFinal && i === eraseIdx;
          const picked = showMatch && i === eraseIdx;
          return (
            <motion.g key={i} animate={{ opacity: gone ? 0.28 : 1 }} transition={{ duration: 0.4 }}>
              {/* whole rows of k — the part already divisible */}
              {Array.from({ length: fullRows }).map((_, r) =>
                Array.from({ length: divisor }).map((__, c) => (
                  <motion.rect
                    key={`${r}-${c}`}
                    x={colX(i) + c * u}
                    y={baseY - r * u}
                    width={box}
                    height={box}
                    rx={1.2}
                    fill={FULL}
                    stroke={FULL_EDGE}
                    strokeWidth={0.7}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.06 + r * 0.02 }}
                  />
                ))
              )}
              {/* the number itself */}
              <text x={colX(i) + (divisor * u) / 2 - u / 2 + box / 2} y={baseY + 22} textAnchor="middle" fontSize="14" fontWeight="800" fill={gone ? BAD : INK} fontFamily={numberFont}>
                {n}
              </text>
              <text x={colX(i) + (divisor * u) / 2 - u / 2 + box / 2} y={baseY + 36} textAnchor="middle" fontSize="10" fontWeight="700" fill={picked ? PICK : "#94a3b8"} fontFamily={numberFont}>
                rem {rems[i]}
              </text>
              {/* ring the culprit */}
              <AnimatePresence>
                {picked && (
                  <motion.rect
                    key="ring"
                    x={colX(i) - 6}
                    y={baseY - (Math.ceil(n / divisor) - 1) * u - 6}
                    width={divisor * u + 6}
                    height={Math.ceil(n / divisor) * u + 46}
                    rx={7}
                    fill="none"
                    stroke={gone ? BAD : PICK}
                    strokeWidth={2}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 240, damping: 16 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  />
                )}
              </AnimatePresence>
            </motion.g>
          );
        })}

        {/* remainder blocks: they sit on their column, then fly into the pool */}
        {remBlocks.map((b, idx) => {
          const home = {
            x: colX(b.i) + b.j * u,
            y: baseY - Math.floor(numbers[b.i] / divisor) * u,
          };
          const inPool = showPool && b.poolK != null;
          const pos = inPool
            ? { x: poolX + (b.poolK! % divisor) * u, y: poolBaseY - Math.floor(b.poolK! / divisor) * u }
            : home;
          const stray = inPool && b.poolK! >= poolCount - poolStray && poolStray > 0;
          return (
            <motion.rect
              key={`r${idx}`}
              width={box}
              height={box}
              rx={1.2}
              fill={stray ? BAD : isFinal && inPool ? WIN : REM}
              stroke="none"
              initial={{ x: home.x, y: home.y, opacity: 0 }}
              animate={{ x: pos.x, y: pos.y, opacity: b.poolK == null && isFinal ? 0 : 1 }}
              transition={{ type: "spring", stiffness: 110, damping: 17, delay: 0.15 + idx * 0.04 }}
            />
          );
        })}

        {/* pool frame + caption */}
        <AnimatePresence>
          {showPool && (
            <motion.g key="pool" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }}>
              <text x={W / 2} y={poolBaseY - Math.ceil(poolCount / divisor) * u - 6} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={poolStray ? BAD : WIN} fontFamily={numberFont}>
                {poolStray
                  ? `${poolCount} left over = ${Math.floor(poolCount / divisor)}×${divisor} + ${poolStray}`
                  : `${poolCount} left over = ${poolCount / divisor}×${divisor} exactly`}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* running statement */}
      <motion.span
        key={`${showPool}-${showMatch}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 13,
          fontWeight: 800,
          color: isFinal ? "#166534" : showPool ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : showPool ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showPool ? "#fde68a" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {!showPool
          ? `each number = whole rows of ${divisor} + a remainder`
          : !showMatch
          ? `total ${total} leaves remainder ${totalRem}`
          : !isFinal
          ? `erase the number with remainder ${totalRem} → ${erased}`
          : `${total} − ${erased} = ${after} = ${divisor} × ${after / divisor}`}
      </motion.span>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.45 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            erase {erased} → Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
