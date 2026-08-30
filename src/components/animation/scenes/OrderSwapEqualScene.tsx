import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const BLUE = "#2563eb";
const ORANGE = "#f59e0b";
const WIN = "#16a34a";

/**
 * Two clerks apply the same tax and discount multipliers in opposite order;
 * multiplication commutes, so both arrows land on the same final total.
 * Data: { price: 90, taxRate: 0.06, discountRate: 0.2 }.
 */
export function OrderSwapEqualScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const price = num(data.price, 90);
  const taxRate = num(data.taxRate, 0.06);
  const discountRate = num(data.discountRate, 0.2);

  const taxMult = 1 + taxRate;
  const discMult = 1 - discountRate;
  const jackTotal = Math.round(price * taxMult * discMult * 100) / 100;
  const jillTotal = Math.round(price * discMult * taxMult * 100) / 100;
  const diff = Math.round((jackTotal - jillTotal) * 100) / 100;

  const isFinal = step >= totalSteps - 1;
  const showJack = step >= 1;
  const showJill = step >= 2;

  const chain = (label: string, cx: number, color1: string, color2: string, first: string, second: string, result: number, show: boolean) => (
    <g>
      <text x={cx} y="18" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>
        {label}
      </text>
      <rect x={cx - 34} y="26" width="68" height="26" rx="6" fill="#f8fafc" stroke={INK} strokeWidth="1.6" />
      <text x={cx} y="43" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>
        ${price.toFixed(2)}
      </text>
      {show && (
        <>
          <text x={cx} y="66" textAnchor="middle" fontSize="11" fontWeight="800" fill={color1} fontFamily={FONT}>
            × {first}
          </text>
          <text x={cx} y="84" textAnchor="middle" fontSize="11" fontWeight="800" fill={color2} fontFamily={FONT}>
            × {second}
          </text>
          <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={cx - 34} y="92" width="68" height="26" rx="6" fill="#e0e7ff" stroke={IND} strokeWidth="1.6" />
            <text x={cx} y="109" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>
              ${result.toFixed(2)}
            </text>
          </motion.g>
        </>
      )}
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? `$${price} coat, ${Math.round(discountRate * 100)}% discount, ${Math.round(taxRate * 100)}% tax — order swapped`
          : isFinal
            ? "multiplication order doesn't change the product"
            : showJill
              ? "Jill: discount, then tax"
              : "Jack: tax, then discount"}
      </div>

      <svg viewBox="0 0 260 130" width="100%" style={{ maxWidth: 280 }}>
        {chain("Jack", 65, ORANGE, BLUE, "1.06 (tax)", "0.80 (discount)", jackTotal, showJack)}
        {chain("Jill", 195, BLUE, ORANGE, "0.80 (discount)", "1.06 (tax)", jillTotal, showJill)}
      </svg>

      <AnimatePresence>
        {isFinal && (
          <motion.div initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", fontSize: 13, fontWeight: 900, color: WIN, fontFamily: FONT, marginTop: 2 }}>
            ${jackTotal.toFixed(2)} − ${jillTotal.toFixed(2)} = ${diff.toFixed(2)}
          </motion.div>
        )}
      </AnimatePresence>

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 2 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
