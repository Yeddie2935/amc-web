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

/** A price tag: a rounded rect with a punch-hole, showing a percent-of-original price. */
function PriceTag({ x, y, w, h, value, color }: { x: number; y: number; w: number; h: number; value: string; color: string }) {
  return (
    <g>
      <path
        d={`M ${x + 14} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x + 14} ${y + h} L ${x} ${y + h / 2} Z`}
        fill={`${color}14`}
        stroke={color}
        strokeWidth={1.8}
      />
      <circle cx={x + 12} cy={y + h / 2} r={2.6} fill="#fff" stroke={color} strokeWidth={1.4} />
      <text x={x + 14 + (w - 14) / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="900" fill={color} fontFamily={FONT}>
        {value}
      </text>
    </g>
  );
}

/**
 * Two discounts applied in sequence — the second one taken off the already
 * reduced price, not the original. Six beats: (0) the full-price tag and a
 * full bar; (1) the half-price sale slashes the bar to 50; (2) the coupon
 * slashes 20% off *that* 50, landing at 40; (3) the trap — naively adding
 * the two percents (50%+20%=70% off) is checked against the real choices
 * and shown leaving only 30, a visibly different (and wrong) bar; (4) 100
 * minus the true final price gives the real percent off; (5) the badge.
 * Data: { firstPercentOff, secondPercentOff }.
 */
export function CompoundDiscountScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const p1 = num(data.firstPercentOff, 50);
  const p2 = num(data.secondPercentOff, 20);

  const afterFirst = 100 * (1 - p1 / 100);
  const afterSecond = afterFirst * (1 - p2 / 100);
  const trueOff = 100 - afterSecond;

  const naiveOff = p1 + p2;
  const naiveLeft = 100 - naiveOff;
  const trap = (problem.choices ?? []).find((c) => c.text.trim() === String(naiveOff));

  const last = totalSteps - 1;
  const showFirst = step >= 1;
  const showSecond = step >= 2;
  const isTrapStep = step === 3;
  const showConvert = step >= 4;
  const isFinal = step >= last;

  const value = showSecond ? afterSecond : showFirst ? afterFirst : 100;

  const W = 320;
  const H = 170;
  const barX = 20;
  const barY = 96;
  const barW = 280;
  const barH = 26;
  const scale = barW / 100;

  const tagY = 20;
  const tagH = 40;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <PriceTag x={W / 2 - 45} y={tagY} w={90} h={tagH} value={`${Math.round(value)}%`} color={isFinal ? WIN : showSecond ? TEAL : showFirst ? MARK : INK} />
        <text x={W / 2} y={tagY + tagH + 12} textAnchor="middle" fontSize="9" fontWeight="700" fill={DIM} fontFamily={FONT}>
          of original price
        </text>

        <rect x={barX} y={barY} width={barW} height={barH} rx={6} fill="none" stroke="#cbd5e1" strokeWidth={1.4} />
        <motion.rect
          x={barX}
          y={barY}
          height={barH}
          rx={6}
          animate={{ width: value * scale, fill: showSecond ? "#99f6e4" : showFirst ? "#c7d2fe" : "#eef2ff", stroke: showSecond ? TEAL : MARK }}
          strokeWidth={1.8}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
        />
        <text x={barX} y={barY - 6} fontSize="9" fontWeight="700" fill={DIM} fontFamily={FONT}>
          0
        </text>
        <text x={barX + barW} y={barY - 6} textAnchor="end" fontSize="9" fontWeight="700" fill={DIM} fontFamily={FONT}>
          100
        </text>

        <AnimatePresence>
          {showFirst && !showSecond && !isTrapStep && (
            <motion.g key="s1" initial={{ opacity: 0, rotate: -8, scale: 0.6 }} animate={{ opacity: 1, rotate: -8, scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={barX + afterFirst * scale - 30} y={barY - 4} width={64} height={16} rx={3} fill={BAD} />
              <text x={barX + afterFirst * scale + 2} y={barY + 7} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#fff" fontFamily={FONT}>
                −{p1}%
              </text>
            </motion.g>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showSecond && (
            <motion.g key="s2" initial={{ opacity: 0, rotate: -8, scale: 0.6 }} animate={{ opacity: 1, rotate: -8, scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={barX + afterSecond * scale - 26} y={barY - 4} width={56} height={16} rx={3} fill={BAD} />
              <text x={barX + afterSecond * scale + 2} y={barY + 7} textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily={FONT}>
                −{p2}%
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isTrapStep && (
            <motion.g key="trap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={barX} y={barY + barH + 10} width={barW} height={barH} rx={6} fill="none" stroke="#d97706" strokeWidth={1.4} strokeDasharray="3 3" />
              <motion.rect
                x={barX}
                y={barY + barH + 10}
                height={barH}
                rx={6}
                initial={{ width: 0 }}
                animate={{ width: naiveLeft * scale }}
                fill="#fde68a"
                stroke="#d97706"
                strokeWidth={1.6}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              />
              <text x={barX + (naiveLeft * scale) / 2} y={barY + barH + 10 + barH / 2 + 4} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#92400e" fontFamily={FONT}>
                {Math.round(naiveLeft)}% left
              </text>
            </motion.g>
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
          color: isFinal ? WIN : isTrapStep ? "#d97706" : showConvert ? MARK : showSecond ? TEAL : showFirst ? MARK : DIM,
        }}
      >
        {isFinal
          ? `${Math.round(trueOff)}% off the original`
          : showConvert
          ? `100 − ${Math.round(afterSecond)} = ${Math.round(trueOff)}% off`
          : isTrapStep
          ? `${p1}% + ${p2}% = ${naiveOff}% off? ${trap ? `matches choice ${trap.label}, but that's wrong` : ""}`
          : showSecond
          ? `${afterFirst} × (1 − 0.${p2 < 10 ? "0" : ""}${p2}) = ${Math.round(afterSecond)}`
          : showFirst
          ? `100 × (1 − 0.${p1 < 10 ? "0" : ""}${p1}) = ${Math.round(afterFirst)}`
          : "half price, then a coupon on the sale price"}
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
