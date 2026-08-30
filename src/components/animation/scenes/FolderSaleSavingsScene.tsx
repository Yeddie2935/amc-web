import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const ORANGE = "#f59e0b";
const RED = "#dc2626";
const DIM = "#94a3b8";

/**
 * A row of folders totals to a price, then a slice equal to the discount
 * percent peels off as the savings.
 * Data: { count: 5, price: 2.5, discountPct: 20 }.
 */
export function FolderSaleSavingsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const count = num(data.count, 5);
  const price = num(data.price, 2.5);
  const discountPct = num(data.discountPct, 20);

  const total = count * price;
  const savings = (discountPct / 100) * total;

  const isFinal = step >= totalSteps - 1;
  const showTotal = step >= 1;
  const showDiscount = step >= 2;

  const folderW = 34;
  const gap = 8;
  const startX = 40;

  const barW = 240;
  const barX = 40;
  const barY = 90;
  const discountW = (discountPct / 100) * barW;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? `${count} folders at $${price.toFixed(2)} each`
          : isFinal
            ? "compute the savings"
            : showDiscount
              ? `mark the ${discountPct}% discount`
              : "find the full price"}
      </div>

      <svg viewBox="0 0 320 165" width="100%" style={{ maxWidth: 340 }}>
        {Array.from({ length: count }).map((_, i) => (
          <motion.g key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i }}>
            <rect x={startX + i * (folderW + gap)} y="20" width={folderW} height="26" rx="4" fill="#fef3c7" stroke={ORANGE} strokeWidth="1.6" />
            <text x={startX + i * (folderW + gap) + folderW / 2} y="38" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={ORANGE} fontFamily={FONT}>
              ${price.toFixed(2)}
            </text>
          </motion.g>
        ))}

        <AnimatePresence>
          {showTotal && (
            <motion.text
              key="total"
              x="160"
              y="72"
              textAnchor="middle"
              fontSize="14"
              fontWeight="900"
              fill={IND}
              fontFamily={FONT}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {count} × ${price.toFixed(2)} = ${total.toFixed(2)}
            </motion.text>
          )}
        </AnimatePresence>

        {showDiscount && (
          <>
            <rect x={barX} y={barY} width={barW} height="24" rx="5" fill="#f1f5f9" stroke={INK} strokeWidth="1.2" />
            <rect x={barX} y={barY} width={barW - discountW} height="24" fill={ORANGE} fillOpacity="0.5" />
            <motion.rect x={barX + barW - discountW} y={barY} width={discountW} height="24" fill={RED} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            <text x={barX + barW - discountW / 2} y={barY + 40} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={RED} fontFamily={FONT}>
              {discountPct}% off
            </text>
          </>
        )}

        {isFinal && (
          <motion.g initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}>
            <text x="160" y="155" textAnchor="middle" fontSize="14" fontWeight="900" fill={RED} fontFamily={FONT}>
              {discountPct}% × ${total.toFixed(2)} = ${savings.toFixed(2)}
            </text>
          </motion.g>
        )}
      </svg>

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 2 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
