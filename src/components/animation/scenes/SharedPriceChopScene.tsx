import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

/** Smallest divisor of `a` (other than 1 or the true gcd) that fails to divide `b`. */
function findTrapDivisor(a: number, b: number, g: number): number | null {
  for (let d = 2; d <= a; d++) {
    if (a % d === 0 && d !== g && b % d !== 0) return d;
  }
  return null;
}

/**
 * Two totals paid at the same unknown per-item price — the price must
 * divide both totals evenly, and more than one candidate divisor can look
 * plausible until checked against the second total. Six beats: (0) the two
 * totals, price unknown; (1) the trap — a real divisor of the first total
 * is tried and fails to split the second evenly, leaving a visible leftover
 * sliver; (2) the true shared price chops both totals evenly; (3) each
 * strip's segment count is read off; (4) the difference is found and
 * cross-checked against the totals' own difference; (5) the badge. Data:
 * { totalA, totalB, labelA?, labelB?, unit? }.
 */
export function SharedPriceChopScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const totalA = Math.round(num(data.totalA, 0));
  const totalB = Math.round(num(data.totalB, 0));
  const labelA = data.labelA != null ? String(data.labelA) : "A";
  const labelB = data.labelB != null ? String(data.labelB) : "B";
  const unit = data.unit != null ? String(data.unit) : "¢";

  const [lo, hi, loLabel, hiLabel] = totalA <= totalB ? [totalA, totalB, labelA, labelB] : [totalB, totalA, labelB, labelA];
  const price = gcd(lo, hi);
  const trapPrice = findTrapDivisor(lo, hi, price);
  const countLo = lo / price;
  const countHi = hi / price;
  const diff = countHi - countLo;

  const trapLoCount = trapPrice ? Math.floor(lo / trapPrice) : 0;
  const trapHiCount = trapPrice ? Math.floor(hi / trapPrice) : 0;
  const trapHiRemainder = trapPrice ? hi % trapPrice : 0;

  const last = totalSteps - 1;
  const isTrapStep = step === 1;
  const showPrice = step >= 2;
  const showCounts = step >= 3;
  const showDiff = step >= 4;
  const isFinal = step >= last;

  const W = 320;
  const H = 168;
  const barX = 20;
  const barW = 280;
  const barH = 26;
  const rowLoY = 44;
  const rowHiY = 92;
  const scale = barW / hi;

  const segStroke = isTrapStep ? "#d97706" : showPrice ? (isFinal ? WIN : TEAL) : "#cbd5e1";
  const segFillEven = isTrapStep ? "#fef3c7" : "#ccfbf1";
  const segFillOdd = isTrapStep ? "#fde68a" : "#99f6e4";

  const segsFor = (count: number, unitPrice: number) => Array.from({ length: count }, (_, i) => ({ x0: i * unitPrice * scale, w: unitPrice * scale }));

  const loSegs = isTrapStep && trapPrice ? segsFor(trapLoCount, trapPrice) : showPrice ? segsFor(countLo, price) : [];
  const hiSegs = isTrapStep && trapPrice ? segsFor(trapHiCount, trapPrice) : showPrice ? segsFor(countHi, price) : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <text x={barX} y={rowLoY - 8} fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>
          {loLabel}: {lo}{unit}
        </text>
        <rect x={barX} y={rowLoY} width={lo * scale} height={barH} rx={6} fill="none" stroke="#cbd5e1" strokeWidth={1.4} />
        {loSegs.map((s, i) => (
          <motion.rect
            key={i}
            x={barX + s.x0}
            y={rowLoY}
            height={barH}
            initial={{ width: 0 }}
            animate={{ width: s.w }}
            transition={{ type: "spring", stiffness: 220, damping: 20, delay: i * 0.03 }}
            fill={i % 2 ? segFillOdd : segFillEven}
            stroke={segStroke}
            strokeWidth={1}
          />
        ))}

        <text x={barX} y={rowHiY - 8} fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>
          {hiLabel}: {hi}{unit}
        </text>
        <rect x={barX} y={rowHiY} width={barW} height={barH} rx={6} fill="none" stroke="#cbd5e1" strokeWidth={1.4} />
        {hiSegs.map((s, i) => (
          <motion.rect
            key={i}
            x={barX + s.x0}
            y={rowHiY}
            height={barH}
            initial={{ width: 0 }}
            animate={{ width: s.w }}
            transition={{ type: "spring", stiffness: 220, damping: 20, delay: i * 0.03 }}
            fill={i % 2 ? segFillOdd : segFillEven}
            stroke={segStroke}
            strokeWidth={1}
          />
        ))}
        <AnimatePresence>
          {isTrapStep && trapPrice && trapHiRemainder > 0 && (
            <motion.rect
              key="leftover"
              x={barX + trapHiCount * trapPrice * scale}
              y={rowHiY}
              width={trapHiRemainder * scale}
              height={barH}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              fill="#fecaca"
              stroke={BAD}
              strokeWidth={1.6}
              strokeDasharray="3 2"
            />
          )}
        </AnimatePresence>
      </svg>

      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontFamily: FONT,
          fontSize: 11,
          fontWeight: 800,
          textAlign: "center",
          maxWidth: 320,
          color: isFinal ? WIN : showDiff ? WIN : showCounts ? TEAL : showPrice ? MARK : isTrapStep ? "#d97706" : DIM,
        }}
      >
        {isFinal
          ? `${diff} more pencils`
          : showDiff
          ? `${countHi} − ${countLo} = ${diff}, and ${diff} × ${price}${unit} = ${diff * price}${unit} = ${hi} − ${lo}`
          : showCounts
          ? `${lo} ÷ ${price} = ${countLo} pencils, ${hi} ÷ ${price} = ${countHi} pencils`
          : showPrice
          ? `${price}${unit} divides both totals evenly — the only shared price above a penny`
          : isTrapStep && trapPrice
          ? `try ${trapPrice}${unit}: ${lo} splits evenly (${trapLoCount}), but ${hi} leaves ${trapHiRemainder}${unit} left over — ${trapPrice}${unit} doesn't work for both`
          : `both bought the same pencils, at a price above a penny each`}
      </motion.div>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
