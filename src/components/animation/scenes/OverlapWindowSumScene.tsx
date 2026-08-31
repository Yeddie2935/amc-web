import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const A = "#4338ca";
const B = "#0d9488";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

/**
 * A list of `total` numbers where a front window and a back window of known
 * sum overlap in one shared slot. Adding the two window sums counts that
 * shared slot twice, so subtracting the true total of all `total` numbers
 * peels it back out to the slot's own value — no individual number besides
 * the shared one is ever known. The natural slip is never noticing the
 * double count and instead averaging the two sums over all `total` slots
 * (`(frontSum + backSum) / total`), which lands on 7 3/7 here — exactly
 * choice E — so that gets a dedicated beat before the correct subtraction.
 * Data: { total, frontCount, frontSum, backCount, backSum, totalSum }.
 */
export function OverlapWindowSumScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = Math.round(num(data.total, 7));
  const frontCount = Math.round(num(data.frontCount, 4));
  const frontSum = Math.round(num(data.frontSum, 20));
  const backCount = Math.round(num(data.backCount, 4));
  const backSum = Math.round(num(data.backSum, 32));
  const totalSum = Math.round(num(data.totalSum, 46));
  const overlapCount = frontCount + backCount - total; // slots counted in both windows
  const shared = frontSum + backSum - totalSum;
  const trapValue = frontSum + backSum;
  const trapDen = total;
  const trapWhole = Math.floor(trapValue / trapDen);
  const trapRemNum = trapValue - trapWhole * trapDen;
  const trapText = trapRemNum === 0 ? `${trapWhole}` : `${trapWhole} ${trapRemNum}/${trapDen}`;
  const trapLetter = (problem.choices ?? []).find((c) => c.text.trim() === trapText)?.label;
  const answer = answerOf(problem);
  const valid = String(shared) === problem.shortAnswer && overlapCount === 1;

  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), last);
  // 0: setup, 1: front window, 2: back window (overlap visible), 3: trap, 4: total, 5: subtract + answer
  const showFront = beat >= 1;
  const showBack = beat >= 2;
  const showTrap = beat === 3;
  const showTotal = beat >= 4;
  const showResult = beat >= 5;

  const tileW = 40;
  const gap = 8;
  const startX = 14;
  const W = startX * 2 + total * tileW + (total - 1) * gap;
  const H = 210;
  const rowY = 82;
  const tileH = 34;
  const tileX = (i: number) => startX + i * (tileW + gap);

  const overlapIndex = frontCount - 1; // shared slot (0-indexed)

  const caption =
    beat === 0
      ? `${total} numbers in a row — the value at slot ${frontCount} is unknown`
      : beat === 1
      ? `first ${frontCount} average to sum ${frontSum}`
      : beat === 2
      ? `last ${backCount} average to sum ${backSum} — slot ${frontCount} sits in both windows`
      : beat === 3
      ? `averaging ${frontSum} + ${backSum} over all ${total} gives ${trapText} — choice ${trapLetter ?? "E"}, but that ignores the double count`
      : beat === 4
      ? `all ${total} numbers together sum to ${totalSum}`
      : `${frontSum} + ${backSum} − ${totalSum} = ${shared}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px", boxSizing: "border-box" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 420, minWidth: 0, display: "block" }} aria-label="Seven numbers with an overlapping front and back window sharing one slot">
        {/* total-of-all brace, appears once the whole-list sum is introduced */}
        <AnimatePresence>
          {showTotal && (
            <motion.g key="total" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.path
                d={`M ${tileX(0)},18 H ${tileX(total - 1) + tileW}`}
                stroke={INK}
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
              <text x={W / 2} y="14" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>
                all {total}: sum {totalSum}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the seven tiles */}
        {Array.from({ length: total }, (_, i) => {
          const inFront = i < frontCount && showFront;
          const inBack = i >= total - backCount && showBack;
          const isShared = inFront && inBack;
          const x = tileX(i);
          const revealed = showResult && i === overlapIndex;
          const fill = isShared ? "url(#sharedStripe)" : inFront ? `${A}18` : inBack ? `${B}18` : "#f1f5f9";
          const stroke = isShared ? RED : inFront ? A : inBack ? B : "#cbd5e1";
          return (
            <motion.g key={i} initial={{ opacity: 0, y: -8, scale: 0.6 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.06 }}>
              <rect x={x} y={rowY} width={tileW} height={tileH} rx={7} fill={fill} stroke={stroke} strokeWidth={isShared ? 2.4 : 1.6} />
              <text x={x + tileW / 2} y={rowY + 21} textAnchor="middle" fontSize={revealed ? 15 : 13} fontWeight="900" fill={revealed ? GREEN : isShared ? RED : inFront || inBack ? INK : "#94a3b8"} fontFamily={FONT}>
                {revealed ? shared : "?"}
              </text>
              <text x={x + tileW / 2} y={rowY + tileH + 13} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={DIM} fontFamily={FONT}>
                {i + 1}
              </text>
            </motion.g>
          );
        })}
        <defs>
          <pattern id="sharedStripe" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill={`${A}18`} />
            <rect width="4" height="8" fill={`${B}22`} />
          </pattern>
        </defs>

        {/* front window brace */}
        <AnimatePresence>
          {showFront && (
            <motion.g key="front" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <path d={`M ${tileX(0)},${rowY - 8} H ${tileX(frontCount - 1) + tileW}`} stroke={A} strokeWidth="2" />
              <text x={(tileX(0) + tileX(frontCount - 1) + tileW) / 2} y={rowY - 14} textAnchor="middle" fontSize="10.5" fontWeight="900" fill={A} fontFamily={FONT}>
                first {frontCount}: {frontSum}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* back window brace */}
        <AnimatePresence>
          {showBack && (
            <motion.g key="back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <path d={`M ${tileX(total - backCount)},${rowY + tileH + 24} H ${tileX(total - 1) + tileW}`} stroke={B} strokeWidth="2" />
              <text
                x={(tileX(total - backCount) + tileX(total - 1) + tileW) / 2}
                y={rowY + tileH + 38}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="900"
                fill={B}
                fontFamily={FONT}
              >
                last {backCount}: {backSum}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* result callout on the shared slot */}
        <AnimatePresence>
          {showResult && (
            <motion.g key="callout" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <circle cx={tileX(overlapIndex) + tileW / 2} cy={rowY - 22} r="3.5" fill={RED} />
              </motion.g>
            )}
        </AnimatePresence>

        <SvgAnswerBadge show={showResult} answer={answer} cx={W - 60} y={rowY + tileH + 55} width={92} />
      </svg>

      <motion.span
        key={`${step}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 800,
          color: showTrap ? RED : showResult ? (valid ? "#166534" : RED) : INK,
          background: showTrap ? "#fef2f2" : showResult ? (valid ? "#dcfce7" : "#fef2f2") : "#eef2ff",
          border: `1px solid ${showTrap ? "#fecaca" : showResult ? (valid ? "#bbf7d0" : "#fecaca") : "#c7d2fe"}`,
          padding: "5px 12px",
          borderRadius: 10,
          textAlign: "center",
          maxWidth: 380,
        }}
      >
        {caption}
      </motion.span>
    </div>
  );
}
