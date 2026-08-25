import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const CARD = "#eef2ff";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const SEG = ["#0891b2", "#4338ca", "#b45309", "#be185d", "#65a30d"];

type Fr = { n: number; d: number };
const gg = (a: number, b: number): number => (b ? gg(b, a % b) : Math.abs(a));
const frac = (n: number, d: number): Fr => {
  const g = gg(n, d) || 1;
  const s = d < 0 ? -1 : 1;
  return { n: (s * n) / g, d: (s * d) / g };
};
const add = (a: Fr, b: Fr): Fr => frac(a.n * b.d + b.n * a.d, a.d * b.d);
const divInt = (a: Fr, k: number): Fr => frac(a.n, a.d * k);
const recip = (a: Fr): Fr => frac(a.d, a.n);
const val = (a: Fr): number => a.n / a.d;
const txt = (a: Fr): string => (a.d === 1 ? String(a.n) : `${a.n}/${a.d}`);

/**
 * The harmonic mean is "flip every number, average like normal, flip back" —
 * three physical moves, not one formula. The trap is stopping after the
 * middle move (the arithmetic mean of the reciprocals is not the harmonic
 * mean until it is flipped back), or skipping the flips altogether and
 * averaging the numbers directly. The beats flip each given number to its
 * reciprocal and lay the results end to end on a fraction bar to build the
 * sum, split that bar into equal shares to find the average share, then flip
 * the average itself to land on the harmonic mean. Every reciprocal, the
 * sum, the average and the final flip are computed as exact fractions; the
 * plain arithmetic mean is computed too and matched against the choices as
 * the classic skip-the-flips trap.
 * Data: { values: [1, 2, 4] } — positive integers.
 */
export function HarmonicMeanFlipScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const values = (Array.isArray(data.values) ? data.values : []).map((v) => Math.round(num(v, 0)));
  const n = values.length;
  if (n < 2 || values.some((v) => v <= 0)) return null;

  const reciprocals = values.map((v) => frac(1, v));
  const sum = reciprocals.reduce((a, b) => add(a, b), frac(0, 1));
  const average = divInt(sum, n);
  const harmonicMean = recip(average);
  const arithmeticMean = frac(values.reduce((a, b) => a + b, 0), n);

  const parseChoice = (t: string) => {
    const s = String(t).replace(/[−–—]/g, "-").trim();
    if (s.includes("/")) {
      const [p, q] = s.split("/").map(Number);
      return q ? p / q : NaN;
    }
    return Number(s.replace(/[^\d.-]/g, ""));
  };
  const trapChoice = problem.choices?.find((c) => Math.abs(parseChoice(c.text) - val(arithmeticMean)) < 1e-9);
  const agrees = problem.shortAnswer == null || String(problem.shortAnswer).trim() === txt(harmonicMean);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showAverage = step >= 1;
  const showFlipBack = isFinal;

  const W = 340;
  const H = 226;
  const cardW = 56;
  const gap = 14;
  const rowW = n * cardW + (n - 1) * gap;
  const X0 = (W - rowW) / 2;
  const cardY = 24;
  const barY = 118;
  const barX0 = 40;
  const barX1 = 300;
  const barW = barX1 - barX0;
  const scale = barW / (val(sum) * 1.08);
  let cursor = 0;
  const segs = reciprocals.map((r, i) => {
    const w = val(r) * scale;
    const seg = { x: barX0 + cursor, w, i };
    cursor += w;
    return seg;
  });

  const caption = isFinal
    ? `flip the average: reciprocal of ${txt(average)} is ${txt(harmonicMean)}`
    : step === 0
    ? `flip each number: ${values.map((v, i) => `1/${v}`).join(" + ")} = ${txt(sum)}`
    : `split ${txt(sum)} into ${n} equal shares: ${txt(sum)} ÷ ${n} = ${txt(average)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* each number flips to its reciprocal */}
        {values.map((v, i) => {
          const cx = X0 + i * (cardW + gap);
          return (
            <g key={i}>
              <rect x={cx} y={cardY} width={cardW} height={40} rx={6} fill={CARD} stroke={MARK} strokeWidth={1.4} />
              <text x={cx + cardW / 2} y={cardY + 16} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                {v} →
              </text>
              <motion.text
                x={cx + cardW / 2}
                y={cardY + 32}
                textAnchor="middle"
                fontSize="14"
                fontWeight="800"
                fill={SEG[i % SEG.length]}
                fontFamily={numberFont}
                initial={{ opacity: 0, rotateX: 90 }}
                animate={{ opacity: 1, rotateX: 0 }}
                transition={{ duration: 0.4, delay: i * 0.18 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {txt(reciprocals[i])}
              </motion.text>
            </g>
          );
        })}

        {/* the reciprocals laid end to end on a fraction bar */}
        <rect x={barX0} y={barY} width={barW} height={22} fill="none" stroke={DIM} strokeWidth={1} />
        {segs.map((s) => (
          <motion.rect
            key={s.i}
            x={s.x}
            y={barY}
            height={22}
            fill={SEG[s.i % SEG.length]}
            opacity={0.75}
            initial={{ width: 0 }}
            animate={{ width: s.w }}
            transition={{ duration: 0.5, delay: 0.9 + s.i * 0.25 }}
          />
        ))}
        <motion.text
          x={barX0 + val(sum) * scale + 8}
          y={barY + 16}
          fontSize="12"
          fontWeight="800"
          fill={MARK}
          fontFamily={numberFont}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 + n * 0.25 + 0.2 }}
        >
          = {txt(sum)}
        </motion.text>

        {/* the bar split into n equal shares, one highlighted as the average */}
        <AnimatePresence>
          {showAverage && (
            <motion.g key="split" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {Array.from({ length: n - 1 }).map((_, i) => (
                <motion.line
                  key={i}
                  x1={barX0 + ((i + 1) / n) * val(sum) * scale}
                  x2={barX0 + ((i + 1) / n) * val(sum) * scale}
                  y1={barY - 3}
                  y2={barY + 25}
                  stroke={INK}
                  strokeWidth={1.4}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.15 }}
                />
              ))}
              <motion.rect
                x={barX0}
                y={barY - 3}
                width={(val(sum) * scale) / n}
                height={28}
                fill="none"
                stroke={WIN}
                strokeWidth={2}
                rx={2}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              />
              <motion.text
                x={barX0 + (val(sum) * scale) / n / 2}
                y={barY + 46}
                textAnchor="middle"
                fontSize="12"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.9 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {txt(average)}
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* flip the average back to the harmonic mean */}
        <AnimatePresence>
          {showFlipBack && (
            <motion.g key="flip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
              <text x={W / 2} y={196} textAnchor="middle" fontSize="11" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                {txt(average)} →
              </text>
              <motion.text
                x={W / 2}
                y={216}
                textAnchor="middle"
                fontSize="19"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, rotateX: 90 }}
                animate={{ opacity: 1, rotateX: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {txt(harmonicMean)}
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {!agrees
              ? `this gives ${txt(harmonicMean)}, which is not the stored answer`
              : trapChoice
              ? `skipping the flips and averaging ${values.join(", ")} directly gives ${txt(arithmeticMean)} — choice ${trapChoice.label}`
              : `checks out: reciprocal of ${txt(average)} is ${txt(harmonicMean)}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
