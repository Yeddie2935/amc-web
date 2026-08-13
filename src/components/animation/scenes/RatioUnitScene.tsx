import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const lcm = (a: number, b: number) => Math.abs(a * b) / (gcd(a, b) || 1);

/** A marble: a filled disc with a highlight, so a half one reads as half. */
function Marble({ cx, cy, r, color, half }: { cx: number; cy: number; r: number; color: string; half?: boolean }) {
  return (
    <g>
      {half ? (
        <path d={`M ${cx},${cy - r} A ${r} ${r} 0 0 0 ${cx},${cy + r} Z`} fill={color} stroke="#00000022" strokeWidth={0.8} />
      ) : (
        <circle cx={cx} cy={cy} r={r} fill={color} stroke="#00000022" strokeWidth={0.8} />
      )}
      <ellipse cx={cx - r * 0.3} cy={cy - r * 0.35} rx={r * 0.26} ry={r * 0.18} fill="#ffffff" opacity={half ? 0.5 : 0.75} />
    </g>
  );
}

/**
 * Quantities tied to one base quantity by fractions ("half as many red as green,
 * twice as many blue"), asking which totals are possible. Taking the base as 1
 * generally breaks a count into a fraction of an object, so the base must be a
 * multiple of the denominators; the smallest whole group is then an indivisible
 * unit and every possible total is a whole number of copies of it. The scene
 * tries the naive base first and shows the half object it produces, then builds
 * the real group and tests each answer choice for divisibility. The smallest
 * base, the counts, the group size and each choice's remainder are computed, and
 * it flags the case where the choices do not leave exactly one survivor.
 * Data: { items:[{label, numer, den, color}], unit? }.
 */
export function RatioUnitScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const unit = data.unit != null ? String(data.unit) : "items";
  const items = (Array.isArray(data.items) ? data.items : []).map((it) => {
    const o = (it ?? {}) as Record<string, unknown>;
    return {
      label: o.label != null ? String(o.label) : "?",
      numer: num(o.numer, 1),
      den: num(o.den, 1) || 1,
      color: o.color != null ? String(o.color) : "#94a3b8",
    };
  });
  const baseItem = items.find((i) => i.numer === 1 && i.den === 1) ?? items[0];

  // the base has to clear every denominator, or some colour needs a part of one
  const baseMin = items.reduce((m, i) => lcm(m, i.den), 1);
  const countsAt = (b: number) => items.map((i) => (b * i.numer) / i.den);
  const counts = countsAt(baseMin);
  const groupSize = counts.reduce((a, b) => a + b, 0);

  // the answer choices, tested against the group size
  const picks = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[^0-9.\-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value));
  const fits = picks.filter((c) => groupSize > 0 && c.value % groupSize === 0);
  const winner = fits.length ? fits[0] : null;
  const single = fits.length === 1;
  const copies = winner ? winner.value / groupSize : 0;
  const finalCounts = counts.map((c) => c * copies);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const tryNaive = !isFinal && step === 1;
  const shownBase = tryNaive ? 1 : baseMin;
  const shown = countsAt(shownBase);
  const broken = shown.some((c) => !Number.isInteger(c));
  const showMarbles = isFinal || step >= 1;
  const showGroup = isFinal || step >= 2;

  const relationOf = (i: (typeof items)[number]) =>
    i === baseItem
      ? `the base`
      : i.den === 1
      ? `= ${i.numer} × ${baseItem.label}`
      : i.numer === 1
      ? `= ${baseItem.label} ÷ ${i.den}`
      : `= ${i.numer}/${i.den} × ${baseItem.label}`;

  // ---- geometry ----
  const W = 340;
  const r = 8;
  const pitch = 20;
  const mx = 74;
  const rowY = (i: number) => 34 + i * 27;
  const rowsH = 34 + items.length * 27;
  const braceY = rowsH + 4;
  const chipY = braceY + 26;
  const H = isFinal ? chipY + 56 : braceY + 24;

  const caption = isFinal
    ? winner
      ? `${winner.value} = ${copies} × ${groupSize}, the only choice that splits evenly`
      : `no choice is a multiple of ${groupSize}`
    : step === 0
    ? `every colour is pinned to ${baseItem.label}`
    : tryNaive
    ? broken
      ? `${baseItem.label} = 1 would need half a ${items.find((_, k) => !Number.isInteger(shown[k]))?.label} — impossible`
      : `${baseItem.label} = 1 already works`
    : `smallest whole group: ${counts.map((c, k) => `${c} ${items[k].label}`).join(", ")} = ${groupSize}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        <text x={W / 2} y={16} textAnchor="middle" fontSize="11" fontWeight="800" fill="#94a3b8" fontFamily={numberFont}>
          {step === 0 && !isFinal ? `${baseItem.label} = ?` : `${baseItem.label} = ${shownBase}`}
        </text>

        {items.map((it, i) => {
          const c = isFinal ? counts[i] : shown[i];
          const whole = Math.floor(c + 1e-9);
          const hasHalf = !Number.isInteger(c);
          return (
            <g key={it.label}>
              <text x={10} y={rowY(i) + 4} fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {it.label}
              </text>
              <AnimatePresence>
                {showMarbles && (
                  <motion.g key={`m${shownBase}-${isFinal}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {Array.from({ length: whole }).map((_, k) => (
                      <motion.g
                        key={k}
                        initial={{ opacity: 0, scale: 0.2, y: -14 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 320, damping: 16, delay: i * 0.1 + k * 0.06 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      >
                        <Marble cx={mx + k * pitch} cy={rowY(i)} r={r} color={it.color} />
                      </motion.g>
                    ))}
                    {hasHalf && (
                      <motion.g
                        initial={{ opacity: 0, scale: 0.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      >
                        <Marble cx={mx + whole * pitch} cy={rowY(i)} r={r} color={it.color} half />
                        <line x1={mx + whole * pitch - 10} y1={rowY(i) - 10} x2={mx + whole * pitch + 10} y2={rowY(i) + 10} stroke={BAD} strokeWidth={2.2} />
                        <text x={mx + whole * pitch + 16} y={rowY(i) + 4} fontSize="10" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                          half a {it.label}!
                        </text>
                      </motion.g>
                    )}
                  </motion.g>
                )}
              </AnimatePresence>
              {(
                <text x={W - 8} y={rowY(i) + 4} textAnchor="end" fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                  {relationOf(it)}
                </text>
              )}
            </g>
          );
        })}

        {/* the indivisible group everything is built from */}
        <AnimatePresence>
          {showGroup && (
            <motion.g key="brace" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.45 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={mx - 12} y={22} width={Math.max(...counts) * pitch + 4} height={items.length * 27 - 4} rx={8} fill="none" stroke={MARK} strokeWidth={1.6} strokeDasharray="5 3" />
              <text x={mx - 16} y={braceY + 8} fontSize="11.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                1 group = {groupSize} {unit}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* every choice tested for a whole number of groups */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="picks" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {picks.map((p, i) => {
                const cw = (W - 16) / picks.length;
                const bx = 8 + i * cw;
                const good = groupSize > 0 && p.value % groupSize === 0;
                const q = Math.floor(p.value / groupSize);
                return (
                  <motion.g
                    key={p.label}
                    initial={{ opacity: 0, scale: 0.4, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 17, delay: 0.4 + i * 0.09 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <rect
                      x={bx + 3}
                      y={chipY}
                      width={cw - 6}
                      height={34}
                      rx={6}
                      fill={good ? "#dcfce7" : "#f8fafc"}
                      stroke={good ? WIN : "#e2e8f0"}
                      strokeWidth={good ? 2.2 : 1.2}
                    />
                    <text x={bx + cw / 2} y={chipY + 15} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={good ? "#166534" : "#94a3b8"} fontFamily={numberFont}>
                      {p.value}
                    </text>
                    <text x={bx + cw / 2} y={chipY + 28} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={good ? WIN : BAD} fontFamily={numberFont}>
                      {good ? `${q}×${groupSize}` : `${q}×${groupSize}+${p.value % groupSize}`}
                    </text>
                  </motion.g>
                );
              })}
              {winner && (
                <motion.text
                  x={W / 2}
                  y={chipY + 50}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill={INK}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {finalCounts.map((c, k) => `${c} ${items[k].label}`).join(" · ")}
                </motion.text>
              )}
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
          color: isFinal ? "#166534" : broken ? "#991b1b" : "#4338ca",
          background: isFinal ? "#dcfce7" : broken ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : broken ? "#fecaca" : "#c7d2fe"}`,
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
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: single ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {single
              ? `any total must be a whole number of groups, so a multiple of ${groupSize}`
              : `${fits.length} choices are multiples of ${groupSize} — the choices do not decide it`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
