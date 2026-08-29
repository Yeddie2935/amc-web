import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, num, sceneData, SvgAnswerBadge } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const MEAT = "#92400e";
const BUN = "#f5b942";

/** A tiny side-view burger: bun / patty / bun. */
function Burger({ cx, cy, s = 1 }: { cx: number; cy: number; s?: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy - 3.2 * s} rx={5 * s} ry={2.6 * s} fill={BUN} stroke="#c07f12" strokeWidth={0.5} />
      <rect x={cx - 5 * s} y={cy - 1.4 * s} width={10 * s} height={2.8 * s} rx={0.8 * s} fill={MEAT} />
      <ellipse cx={cx} cy={cy + 2.4 * s} rx={5 * s} ry={2.3 * s} fill={BUN} stroke="#c07f12" strokeWidth={0.5} />
    </g>
  );
}

/** One pound of meat: a small stacked block with a top highlight. */
function MeatBlock({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2.5} fill={MEAT} stroke="#5c2a0a" strokeWidth={0.7} />
      <rect x={x + 1.5} y={y + 1.5} width={w - 3} height={h * 0.35} rx={1.5} fill="#ffffff" opacity={0.14} />
    </g>
  );
}

/**
 * A recipe (amount of a resource → count of items) scaled up by a whole-number
 * factor, in five beats: (0) only the given batch is real — the other two sit
 * as dashed outlines; (1) the burger count's ratio to 8 is computed (24 ÷ 8 = 3)
 * and those outlines fill in with burgers only; (2) the same factor multiplies
 * the meat (3 × 3 = 9) and the meat towers fill in; (3) the additive trap
 * (3 + 3 = 6) is checked against the choices; (4) the answer badge lands.
 * Data: { fromBatches, toBatches, fromAmount, unit? }.
 */
export function RecipeScaleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const fromBatches = num(data.fromBatches, 8);
  const toBatches = num(data.toBatches, 24);
  const fromAmount = num(data.fromAmount, 3);
  const unit = data.unit != null ? String(data.unit) : "lb";

  const factor = fromBatches > 0 ? toBatches / fromBatches : 0;
  const toAmount = fromAmount * factor;
  const batches = Math.round(factor) || 1;
  const perBatchItems = fromBatches;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const beat = (frac: number) => Math.min(Math.max(1, Math.round(frac * last)), last);
  const burgersBeat = beat(1 / 4);
  const meatBeat = beat(2 / 4);
  const trapBeat = beat(3 / 4);
  const showFactor = step >= burgersBeat;
  const showMeatBeat = step >= meatBeat;
  const showTrap = step >= trapBeat;

  const naiveAdd = fromAmount + factor;
  const trap = (problem.choices ?? []).find((c) => c.text.trim() === String(naiveAdd));

  const W = 320;
  const H = 232;
  const colW = 96;
  const gap = 8;
  const startX = (W - (batches * colW + (batches - 1) * gap)) / 2;
  const colX = (k: number) => startX + k * (colW + gap);

  const burgerCols = 4;
  const burgerRows = perBatchItems / burgerCols;
  const burgerPitchX = 17;
  const burgerPitchY = 15;
  const burgerTop = 36;

  const towerTop = 96;
  const towerBottom = 144;
  const cubeH = (towerBottom - towerTop - (fromAmount - 1) * 3) / fromAmount;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        {Array.from({ length: batches }).map((_, k) => {
          const x0 = colX(k);
          const cx = x0 + colW / 2;
          const burgersHere = k === 0 || showFactor;
          const meatHere = k === 0 || showMeatBeat;
          return (
            <g key={k}>
              <text x={cx} y={11} textAnchor="middle" fontSize="10" fontWeight="800" fill="#94a3b8" fontFamily={numberFont}>
                Batch {k + 1}
              </text>

              {!burgersHere && (
                <rect x={x0} y={burgerTop - 12} width={colW} height={burgerRows * burgerPitchY + 20} rx={6} fill="none" stroke="#cbd5e1" strokeDasharray="3 3" strokeWidth={1.2} />
              )}
              <AnimatePresence>
                {burgersHere && (
                  <motion.g key={`b${k}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {Array.from({ length: perBatchItems }).map((_, i) => {
                      const row = Math.floor(i / burgerCols);
                      const col = i % burgerCols;
                      const bx = x0 + (colW - (burgerCols - 1) * burgerPitchX) / 2 + col * burgerPitchX;
                      const by = burgerTop + row * burgerPitchY;
                      return (
                        <motion.g
                          key={i}
                          initial={{ opacity: 0, scale: 0.2, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 320, damping: 16, delay: k * 0.12 + i * 0.04 }}
                          style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        >
                          <Burger cx={bx} cy={by} s={0.95} />
                        </motion.g>
                      );
                    })}
                  </motion.g>
                )}
              </AnimatePresence>
              <text x={cx} y={burgerTop + burgerRows * burgerPitchY + 8} textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                {perBatchItems} burgers
              </text>

              {!meatHere && (
                <rect x={x0 + colW / 2 - 20} y={towerTop} width={40} height={towerBottom - towerTop} rx={5} fill="none" stroke="#cbd5e1" strokeDasharray="3 3" strokeWidth={1.2} />
              )}
              <AnimatePresence>
                {meatHere && (
                  <motion.g key={`m${k}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {Array.from({ length: fromAmount }).map((_, j) => {
                      const y = towerBottom - (j + 1) * cubeH - j * 3;
                      return (
                        <motion.g
                          key={j}
                          initial={{ opacity: 0, scaleY: 0.2 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 17, delay: k * 0.15 + j * 0.09 }}
                          style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
                        >
                          <MeatBlock x={cx - 20} y={y} w={40} h={cubeH} />
                        </motion.g>
                      );
                    })}
                  </motion.g>
                )}
              </AnimatePresence>
              <text x={cx} y={towerBottom + 12} textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                {fromAmount} {unit}
              </text>
            </g>
          );
        })}

        <AnimatePresence>
          {showFactor && (
            <motion.g key="factor" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <rect x={W / 2 - 48} y={17} width={96} height={14} rx={7} fill="#eef2ff" stroke={MARK} strokeWidth={1} />
              <text x={W / 2} y={27} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                {toBatches} ÷ {fromBatches} = ×{factor}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showMeatBeat && (
            <motion.text
              key="meatEq"
              x={W / 2}
              y={170}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.5 }}
            >
              {fromAmount} × {factor} = {toAmount} {unit}
            </motion.text>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTrap && trap && (
            <motion.g key="trap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <text x={W / 2} y={182} textAnchor="middle" fontSize="9" fontWeight="700" fill={BAD} fontFamily={numberFont}>
                trap: {fromAmount} + {factor} = {naiveAdd} → choice {trap.label}
              </text>
              <text x={W / 2} y={193} textAnchor="middle" fontSize="9" fontWeight="700" fill={BAD} fontFamily={numberFont}>
                (adding, not scaling)
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <SvgAnswerBadge show={isFinal} answer={problem.answer ?? answerOf(problem)} cx={W / 2} y={trap ? 200 : 178} width={80} />
      </svg>
    </div>
  );
}
