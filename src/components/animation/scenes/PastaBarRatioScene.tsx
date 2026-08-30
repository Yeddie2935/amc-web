import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const DIM = "#cbd5e1";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/**
 * A bar graph of four categories, asking for the ratio between two of them.
 * The scene draws all four bars faithfully to the real survey counts, then
 * isolates the two asked-about bars and chops each into equal-size unit
 * blocks of their greatest common divisor — the simplified ratio is
 * literally how many blocks each bar breaks into, not just an arithmetic
 * assertion.
 * Data: { categories:[{label,count}], askIndex, ofIndex }.
 */
export function PastaBarRatioScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const categories = (Array.isArray(data.categories) ? data.categories : []).map((c) => {
    const o = (c ?? {}) as Record<string, unknown>;
    return { label: o.label != null ? String(o.label) : "?", count: Math.max(0, Math.round(num(o.count, 0))) };
  });
  const askIndex = Math.min(categories.length - 1, Math.max(0, Math.round(num(data.askIndex, 3))));
  const ofIndex = Math.min(categories.length - 1, Math.max(0, Math.round(num(data.ofIndex, 1))));
  const ask = categories[askIndex] ?? { label: "A", count: 0 };
  const of = categories[ofIndex] ?? { label: "B", count: 0 };

  const g = gcd(ask.count, of.count) || 1;
  const simpAsk = ask.count / g;
  const simpOf = of.count / g;
  const ratioStr = `${simpAsk}/${simpOf}`;

  const matches = problem.shortAnswer == null || ratioStr === String(problem.shortAnswer).trim();
  const failure = !matches ? `check failed: ${ask.count}/${of.count} → ${ratioStr}, stored answer is ${problem.shortAnswer}` : "";

  const lastStep = totalSteps - 1;
  const showFocus = step >= 1;
  const showRatio = step >= 2;
  const showChop = step >= 3;
  const isFinal = step >= lastStep;

  // ---- geometry ----
  const W = 320;
  const baseY = 170;
  const padT = 16;
  const maxVal = Math.max(...categories.map((c) => c.count), 1) * 1.15;
  const barGap = (W - 24) / categories.length;
  const barW = barGap * 0.62;
  const xOf = (i: number) => 12 + i * barGap + (barGap - barW) / 2;
  const sy = (v: number) => baseY - (v / maxVal) * (baseY - padT);

  const chopH = 14;
  const chopW = 22;
  const H = showChop ? baseY + 100 : baseY + 40;

  const caption = isFinal
    ? `${ask.count}/${of.count} = ${ratioStr}`
    : showChop
    ? `${ask.label} breaks into ${simpAsk} blocks of ${g}, ${of.label} into ${simpOf}`
    : showRatio
    ? `${ask.label} to ${of.label}: ${ask.count}/${of.count}`
    : showFocus
    ? `focus on ${ask.label} and ${of.label}`
    : `650 students surveyed on pasta preference`;

  const note = failure || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 340 }}>
        <line x1={12} x2={W - 12} y1={baseY} y2={baseY} stroke={INK} strokeWidth={1.4} />

        {categories.map((c, i) => {
          const focused = i === askIndex || i === ofIndex;
          const color = focused ? (i === askIndex ? IND : TEAL) : DIM;
          const dim = showFocus && !focused;
          return (
            <g key={i}>
              <motion.rect
                x={xOf(i)}
                width={barW}
                fill={color}
                fillOpacity={dim ? 0.25 : 0.75}
                stroke={color}
                strokeWidth={1.4}
                initial={{ y: baseY, height: 0 }}
                animate={{ y: sy(c.count), height: baseY - sy(c.count), opacity: showChop && focused ? 0 : 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.08 }}
              />
              <text x={xOf(i) + barW / 2} y={sy(c.count) - 6} textAnchor="middle" fontSize="9" fontWeight="800" fill={dim ? "#94a3b8" : color} fontFamily={numberFont} opacity={showChop && focused ? 0 : 1}>
                {c.count}
              </text>
              <text x={xOf(i) + barW / 2} y={baseY + 12} textAnchor="middle" fontSize="8" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                {c.label}
              </text>
            </g>
          );
        })}

        {/* chopped unit blocks for the two focused bars, once revealed */}
        <AnimatePresence>
          {showChop && (
            <motion.g key="chop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { c: ask, i: askIndex, blocks: simpAsk, color: IND, row: 0 },
                { c: of, i: ofIndex, blocks: simpOf, color: TEAL, row: 1 },
              ].map((set) => (
                <g key={set.i}>
                  <text x={16} y={baseY + 32 + set.row * 34} fontSize="9.5" fontWeight="800" fill={set.color} fontFamily={numberFont}>
                    {set.c.label}
                  </text>
                  {Array.from({ length: set.blocks }).map((_, b) => (
                    <motion.rect
                      key={b}
                      x={78 + b * (chopW + 4)}
                      y={baseY + 20 + set.row * 34}
                      width={chopW}
                      height={chopH}
                      rx={3}
                      fill={set.color}
                      fillOpacity={0.75}
                      stroke={set.color}
                      strokeWidth={1.2}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 280, damping: 17, delay: b * 0.1 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    />
                  ))}
                  <text x={78 + set.blocks * (chopW + 4) + 6} y={baseY + 20 + set.row * 34 + 11} fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                    × {g} = {set.c.count}
                  </text>
                </g>
              ))}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
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
        {note && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#dc2626", textAlign: "center" }}
          >
            {note}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
