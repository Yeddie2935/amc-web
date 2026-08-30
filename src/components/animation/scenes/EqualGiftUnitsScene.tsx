import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";
const CHIP = "#c7d2fe";
const GIFT = "#facc15";

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : Math.abs(a);
}

/**
 * Three friends' holdings are reconstructed from the equal gift x, then one
 * unit from each visibly moves into Ott's wallet. Data:
 * { names, denominators, giftCount }.
 */
export function EqualGiftUnitsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const names = Array.isArray(data.names) ? data.names.map(String) : [];
  const denominators = Array.isArray(data.denominators) ? data.denominators.map(Number) : [];
  const giftCount = Math.round(num(data.giftCount, names.length));
  const total = denominators.reduce((sum, value) => sum + value, 0);
  const common = gcd(giftCount, total);
  const result = `${giftCount / common}/${total / common}`;
  const answerChoice = (problem.choices ?? []).find((choice) => choice.text.trim() === result)?.label;
  const valid = result === problem.shortAnswer && answerChoice === problem.answer;

  const final = step >= totalSteps - 1;
  const showTotal = step >= 1;
  const showTransfer = final;
  const xs = [78, 210, 342];
  const unitW = 18;
  const gap = 3;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 420 300" width="100%" style={{ maxWidth: 460, minWidth: 0, display: "block" }}>
        <text x="210" y="18" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>
          {showTransfer ? "one equal gift from each friend goes to Ott" : showTotal ? "combine the friends' original money" : "the same gift x reveals each original amount"}
        </text>

        {denominators.map((count, row) => {
          const x0 = xs[row] - (count * unitW + (count - 1) * gap) / 2;
          return (
            <g key={names[row]}>
              <text x={xs[row]} y="48" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>{names[row]}</text>
              <text x={xs[row]} y="66" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND} fontFamily={FONT}>
                gives 1/{count} → had {count}x
              </text>
              {Array.from({ length: count }, (_, index) => {
                const isGift = index === count - 1;
                return (
                  <motion.g
                    key={index}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: showTransfer && isGift ? 0.22 : 1, y: 0 }}
                    transition={{ delay: row * 0.08 + index * 0.05 }}
                  >
                    <rect x={x0 + index * (unitW + gap)} y="82" width={unitW} height="30" rx="5" fill={isGift ? GIFT : CHIP} stroke={isGift ? "#a16207" : IND} strokeWidth="1.3" />
                    <text x={x0 + index * (unitW + gap) + unitW / 2} y="102" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>x</text>
                  </motion.g>
                );
              })}
              <text x={xs[row]} y="130" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>{count} units</text>
            </g>
          );
        })}

        <AnimatePresence>
          {showTotal && !showTransfer && (
            <motion.g key="total" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <path d="M 43 143 Q 43 154 55 154 H 365 Q 377 154 377 143" fill="none" stroke={IND} strokeWidth="2" />
              <text x="210" y="177" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>5x + 4x + 3x = {total}x total</text>
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTransfer && (
            <motion.g key="transfer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {xs.map((x, index) => (
                <motion.g key={x} initial={{ x: x - (178 + index * 22), y: -92 }} animate={{ x: 0, y: 0 }} transition={{ type: "spring", stiffness: 170, damping: 18, delay: index * 0.12 }}>
                  <rect x={178 + index * 22} y="184" width={unitW} height="30" rx="5" fill={GIFT} stroke="#a16207" strokeWidth="1.3" />
                  <text x={187 + index * 22} y="204" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>x</text>
                </motion.g>
              ))}
              <path d="M 160 174 Q 210 154 260 174" fill="none" stroke={GREEN} strokeWidth="2" />
              <text x="210" y="236" textAnchor="middle" fontSize="15" fontWeight="900" fill={valid ? GREEN : RED} fontFamily={FONT}>
                Ott: {giftCount}x ÷ group {total}x = {result}
              </text>
              <text x="210" y="253" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={valid ? GREEN : RED} fontFamily={FONT}>
                {valid ? "the group's total stays 12x as money changes hands" : `check failed: computed ${result}, stored ${problem.shortAnswer}`}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {!showTransfer && <text x="210" y="224" textAnchor="middle" fontSize="10.5" fontWeight="750" fill={DIM}>gold units are the equal gifts</text>}
        <SvgAnswerBadge show={final && valid} answer={problem.answer} cx={210} y={266} width={92} />
      </svg>
    </div>
  );
}
