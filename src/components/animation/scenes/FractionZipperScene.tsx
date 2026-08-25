import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#cbd5e1";

/**
 * A telescoping product of factors (n+1)/n. Each fraction's numerator equals
 * the next fraction's denominator, so a diagonal line drawn from one to the
 * other doubles as both the "these cancel" connector and the strike mark.
 * Only the very first denominator and the very last numerator have no partner
 * and survive; everything else fades. Data: { count } — factors run n = 1..count.
 */
export function FractionZipperScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const count = Math.max(2, Math.round(num(data.count, 2)));
  const terms = Array.from({ length: count }, (_, i) => ({ n: i + 1, num: i + 2, den: i + 1 }));
  const result = terms[terms.length - 1].num / terms[0].den;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showMixed = step === 0;
  const showCancel = step >= 1;

  const leftMargin = 30;
  const pitch = 50;
  const W = leftMargin * 2 + count * pitch;
  const H = 190;
  const mixedY = 26;
  const topY = 74;
  const ruleY = 82;
  const botY = 102;
  const eqY = 138;

  const xOf = (k: number) => leftMargin + (k - 0.5) * pitch;

  const numColor = (k: number) => (isFinal && k === count ? WIN : showCancel && k < count ? DIM : MARK);
  const denColor = (k: number) => (isFinal && k === 1 ? WIN : showCancel && k > 1 ? DIM : MARK);

  const expected = Number(problem.shortAnswer ?? NaN);
  const mismatch = Number.isFinite(expected) && expected !== result;

  const caption = mismatch
    ? `check: chain gives ${result}, expected ${expected}`
    : isFinal
    ? `only the first denominator (1) and the last numerator (${terms[terms.length - 1].num}) survive → ${result}`
    : showCancel
    ? "each numerator cancels the next fraction's denominator"
    : `1 + 1/n = (n+1)/n for n = 1…${count}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        <AnimatePresence>
          {showMixed && (
            <motion.g key="mixed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {terms.map((t) => (
                <text key={t.n} x={xOf(t.n)} y={mixedY} textAnchor="middle" fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                  1+1/{t.n}
                </text>
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* multiplication dots between fractions */}
        {terms.slice(0, -1).map((t) => (
          <text key={`dot${t.n}`} x={(xOf(t.n) + xOf(t.n + 1)) / 2} y={ruleY + 4} textAnchor="middle" fontSize="13" fontWeight="800" fill="#94a3b8" fontFamily={numberFont}>
            ·
          </text>
        ))}

        {/* the fraction chain */}
        {terms.map((t, i) => (
          <motion.g
            key={t.n}
            initial={{ opacity: 0, scale: 0.5, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 18, delay: i * 0.08 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <text x={xOf(t.n)} y={topY} textAnchor="middle" fontSize="15" fontWeight="800" fill={numColor(t.n)} fontFamily={numberFont}>
              {t.num}
            </text>
            <line x1={xOf(t.n) - 13} x2={xOf(t.n) + 13} y1={ruleY} y2={ruleY} stroke={showCancel ? "#e2e8f0" : MARK} strokeWidth={1.6} />
            <text x={xOf(t.n)} y={botY} textAnchor="middle" fontSize="15" fontWeight="800" fill={denColor(t.n)} fontFamily={numberFont}>
              {t.den}
            </text>
          </motion.g>
        ))}

        {/* diagonal cancel lines: numerator of term k to denominator of term k+1 */}
        <AnimatePresence>
          {showCancel &&
            terms.slice(0, -1).map((t, i) => (
              <motion.line
                key={`cancel${t.n}`}
                x1={xOf(t.n) + 8}
                y1={topY - 4}
                x2={xOf(t.n + 1) - 8}
                y2={botY - 4}
                stroke={BAD}
                strokeWidth={2}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: i * 0.12, duration: 0.35 }}
              />
            ))}
        </AnimatePresence>

        <AnimatePresence>
          {isFinal && (
            <motion.text
              key="eq"
              x={W / 2}
              y={eqY}
              textAnchor="middle"
              fontSize="16"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.55 }}
            >
              = {result}
            </motion.text>
          )}
        </AnimatePresence>

        <SvgAnswerBadge show={isFinal} answer={problem.answer ?? null} cx={W / 2} y={eqY + 16} width={92} />
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: mismatch ? "#991b1b" : isFinal ? "#166534" : "#4338ca",
          background: mismatch ? "#fee2e2" : isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${mismatch ? "#fecaca" : isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>
    </div>
  );
}
