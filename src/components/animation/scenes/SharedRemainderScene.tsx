import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const WHOLE = "#cbd5e1";
const COLORS = ["#0d9488", "#d97706", "#7c3aed", "#db2777"];

type Frac = { n: number; d: number; whole: number; rem: number; color: string; value: number };

/**
 * A handful of fractions to be put in order, where every one of them is just
 * over the same whole number by the **same amount**. Cross-multiplying works but
 * hides why the problem was set: split each into whole part plus remainder and
 * the whole parts are identical *and* the remainder numerators are identical, so
 * the entire comparison collapses onto the denominators alone — and there it runs
 * **backwards**, since cutting the same 4 pieces out of more slices makes them
 * thinner.
 *
 * The scene draws that literally rather than asserting it. Each fraction becomes
 * a full chocolate bar plus a second bar cut into `d` pieces with `rem` of them
 * taken; the full bars are identical so they slide away together, and what is
 * left is three part-bars holding the same *number* of pieces at visibly
 * different widths. The order is then read straight off the shaded lengths, and
 * the closing beat plants all of them on a real number line above 1.
 *
 * Nothing is trusted: the whole parts and remainders are computed by division,
 * the scene checks they are genuinely shared before making the argument, the
 * denominator-descending order is cross-checked against an exact
 * cross-multiplication sort (no floats decide anything), and the resulting string
 * is matched against `problem.choices` — including a check for whether the exact
 * reversal is also on offer, which on this problem it is.
 * Data: { fractions: ["15/11", "19/15", "17/13"] }.
 */
export function SharedRemainderScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const fracs: Frac[] = (Array.isArray(data.fractions) ? data.fractions : [])
    .map((f, i) => {
      const [a, b] = String(f).split("/").map((v) => Math.round(Number(v)));
      const whole = Math.floor(a / b);
      return { n: a, d: b, whole, rem: a - whole * b, color: COLORS[i % COLORS.length], value: a / b };
    })
    .filter((f) => Number.isFinite(f.n) && Number.isFinite(f.d) && f.d > 0);

  // the premise: same whole part and same remainder numerator across the board
  const wholes = new Set(fracs.map((f) => f.whole));
  const rems = new Set(fracs.map((f) => f.rem));
  const shared = wholes.size === 1 && rems.size === 1 && fracs.length >= 2;
  const whole = fracs[0]?.whole ?? 0;
  const rem = fracs[0]?.rem ?? 0;

  // ordering by denominator, largest denominator first — and the exact check
  const byDen = [...fracs].sort((a, b) => b.d - a.d);
  const exact = [...fracs].sort((a, b) => a.n * b.d - b.n * a.d);
  const agrees = byDen.every((f, i) => f.n === exact[i].n && f.d === exact[i].d);
  const orderText = exact.map((f) => `${f.n}/${f.d}`).join(" < ");
  const reversedText = [...exact].reverse().map((f) => `${f.n}/${f.d}`).join(" < ");

  // which choice the order lands on, and whether the reversal is also offered
  const norm = (s: string) => String(s).replace(/\s+/g, "");
  const hit = (problem.choices ?? []).find((c) => norm(c.text) === norm(orderText));
  const reversedHit = (problem.choices ?? []).find((c) => norm(c.text) === norm(reversedText));
  const answerOk = !hit || !problem.answer || String(hit.label) === String(problem.answer);

  // ---- beats ----
  const last = totalSteps - 1;
  const isFinal = step >= last;
  const plan = totalSteps >= 4 ? [0, 1, 2] : totalSteps === 3 ? [0, 1] : [0];
  const beat = isFinal ? 3 : plan[Math.min(Math.max(step, 0), plan.length - 1)];

  // ---- geometry ----
  const W = 340;
  const H = 300;
  const rowH = 58;
  const top = 44;
  const labelW = 62;
  const barW = 84; // one whole bar
  const gap = 10;
  // centre the row block: the closing line sits one row below the last row
  const blockH = fracs.length * rowH + 34;
  const rowTop = top + Math.max(0, (H - top - blockH) / 2 - 10);
  const rowY = (i: number) => rowTop + i * rowH;
  const maxD = Math.max(...fracs.map((f) => f.d), 1);

  const caption =
    beat === 0
      ? `each one is ${whole} plus a bit`
      : beat === 1
      ? `same ${whole}, same ${rem} pieces — only the slicing differs`
      : beat === 2
      ? `more slices, thinner pieces`
      : `largest denominator first`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* ---- beats 0-2: one row per fraction ---- */}
        {beat <= 2 && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM} fontFamily={numberFont}>
              {beat === 0
                ? `split each bar into whole bars plus leftovers`
                : beat === 1
                ? `the whole bars are the same, so they cannot decide it`
                : `same ${rem} pieces, different slice sizes`}
            </text>

            {fracs.map((f, i) => {
              const y = rowY(i);
              // beat 0 shows the fraction, beats 1+ push the whole bar aside
              const wholeGone = beat >= 1;
              const partX = labelW + (wholeGone ? 0 : barW + gap);
              const partW = barW * (f.rem / f.d);
              return (
                <g key={`r${i}`}>
                  {/* the fraction, then its mixed-number reading */}
                  <motion.text
                    x={8}
                    y={y + 22}
                    fontSize="12.5"
                    fontWeight="800"
                    fill={f.color}
                    fontFamily={numberFont}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.12 }}
                  >
                    {`${f.n}/${f.d}`}
                  </motion.text>
                  {beat === 0 && (
                    <motion.text
                      x={8}
                      y={y + 38}
                      fontSize="10"
                      fontWeight="700"
                      fill={DIM}
                      fontFamily={numberFont}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.12 }}
                    >
                      {`${f.whole} + ${f.rem}/${f.d}`}
                    </motion.text>
                  )}

                  {/* the whole bar(s) — identical for every fraction, so they slide off */}
                  <AnimatePresence>
                    {!wholeGone && (
                      <motion.g
                        key={`wb${i}`}
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.35 + i * 0.12 }}
                      >
                        <rect x={labelW} y={y + 6} width={barW} height={24} rx={3} fill={WHOLE} stroke="#94a3b8" strokeWidth={1.2} />
                        <text x={labelW + barW / 2} y={y + 22} textAnchor="middle" fontSize="10" fontWeight="800" fill="#475569" fontFamily={numberFont}>
                          {whole} whole
                        </text>
                      </motion.g>
                    )}
                  </AnimatePresence>

                  {/* the leftover bar: d slices, rem of them taken */}
                  <motion.g
                    animate={{ x: partX - labelW }}
                    transition={{ type: "spring", stiffness: 170, damping: 22, delay: beat === 1 ? 0.3 + i * 0.1 : 0 }}
                  >
                    <rect x={labelW} y={y + 6} width={barW} height={24} rx={3} fill="#fff" stroke="#cbd5e1" strokeWidth={1.2} />
                    {/* every slice line, so the piece width is visible */}
                    {beat >= 2 &&
                      Array.from({ length: f.d - 1 }).map((_, k) => (
                        <motion.path
                          key={`sl${k}`}
                          d={`M ${labelW + (barW * (k + 1)) / f.d},${y + 6} L ${labelW + (barW * (k + 1)) / f.d},${y + 30}`}
                          stroke="#cbd5e1"
                          strokeWidth={0.8}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + i * 0.12 + k * 0.02 }}
                        />
                      ))}
                    {/* the taken pieces */}
                    <motion.rect
                      x={labelW}
                      y={y + 6}
                      height={24}
                      rx={2}
                      fill={f.color}
                      initial={{ width: 0 }}
                      animate={{ width: partW }}
                      transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.5 + i * 0.12 }}
                    />
                    {beat >= 2 &&
                      Array.from({ length: f.rem - 1 }).map((_, k) => (
                        <path
                          key={`ps${k}`}
                          d={`M ${labelW + (barW * (k + 1)) / f.d},${y + 6} L ${labelW + (barW * (k + 1)) / f.d},${y + 30}`}
                          stroke="#fff"
                          strokeWidth={1}
                        />
                      ))}
                    <motion.text
                      x={labelW + partW + 6}
                      y={y + 22}
                      fontSize="10.5"
                      fontWeight="800"
                      fill={f.color}
                      fontFamily={numberFont}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 + i * 0.12 }}
                    >
                      {`${f.rem}/${f.d}`}
                    </motion.text>
                  </motion.g>

                  {/* beat 2 names the slice count */}
                  {beat === 2 && (
                    <motion.text
                      x={W - 8}
                      y={y + 22}
                      textAnchor="end"
                      fontSize="9.5"
                      fontWeight="700"
                      fill={DIM}
                      fontFamily={numberFont}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + i * 0.12 }}
                    >
                      {`${f.d} slices`}
                    </motion.text>
                  )}
                </g>
              );
            })}

            {beat === 1 && (
              <motion.text
                x={W / 2}
                y={rowY(fracs.length) + 12}
                textAnchor="middle"
                fontSize="12.5"
                fontWeight="800"
                fill={IND}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 15, delay: 1.1 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {`compare ${fracs.map((f) => `${f.rem}/${f.d}`).join(", ")} only`}
              </motion.text>
            )}
            {beat === 2 && (
              <motion.text
                x={W / 2}
                y={rowY(fracs.length) + 12}
                textAnchor="middle"
                fontSize="12.5"
                fontWeight="800"
                fill={IND}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 15, delay: 1.4 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {`biggest denominator ⇒ smallest fraction`}
              </motion.text>
            )}
          </g>
        )}

        {/* ---- beat 3: all of them on one number line ---- */}
        {beat === 3 && (
          <g>
            <text x={W / 2} y={22} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM} fontFamily={numberFont}>
              {`ordered by denominator, largest first`}
            </text>

            {/* the sorted stack of leftover bars, longest last */}
            {exact.map((f, i) => {
              const y = 38 + i * 34;
              const bw = 150 * (f.rem / f.d) * (maxD / rem);
              return (
                <motion.g
                  key={`sb${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 240, damping: 20, delay: i * 0.16 }}
                >
                  <text x={8} y={y + 16} fontSize="11.5" fontWeight="800" fill={f.color} fontFamily={numberFont}>
                    {`${f.n}/${f.d}`}
                  </text>
                  <rect x={72} y={y + 4} width={bw} height={16} rx={2} fill={f.color} />
                  <text x={72 + bw + 6} y={y + 16} fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                    {`${f.rem}/${f.d}`}
                  </text>
                </motion.g>
              );
            })}

            {/* the real line, from the whole part up */}
            {(() => {
              const lx = 30;
              const lw = W - 60;
              const lo = whole;
              const hi = whole + rem / Math.min(...fracs.map((f) => f.d));
              const pad = (hi - lo) * 0.18;
              const ly = 38 + exact.length * 34 + 26;
              const at = (v: number) => lx + ((v - lo) / (hi - lo + pad)) * lw;
              return (
                <g>
                  <motion.path
                    d={`M ${lx},${ly} L ${lx + lw},${ly}`}
                    stroke={INK}
                    strokeWidth={1.6}
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  />
                  <path d={`M ${lx},${ly - 5} L ${lx},${ly + 5}`} stroke={INK} strokeWidth={1.6} />
                  <text x={lx} y={ly - 10} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    {whole}
                  </text>
                  {exact.map((f, i) => (
                    <motion.g
                      key={`pt${i}`}
                      initial={{ opacity: 0, y: -14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.9 + i * 0.16 }}
                    >
                      <circle cx={at(f.value)} cy={ly} r={4.5} fill={f.color} />
                      {/* the values sit close together, so the labels drop below
                          the line on staggered leaders — above it they would run
                          straight into the bars */}
                      <path d={`M ${at(f.value)},${ly + 6} L ${at(f.value)},${ly + 12 + i * 12}`} stroke={f.color} strokeWidth={1} />
                      <text
                        x={at(f.value)}
                        y={ly + 23 + i * 12}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="800"
                        fill={f.color}
                        fontFamily={numberFont}
                      >
                        {`${f.n}/${f.d}`}
                      </text>
                    </motion.g>
                  ))}
                </g>
              );
            })()}

            <motion.g
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 14, delay: 1.5 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect x={W / 2 - 92} y={H - 34} width={184} height={28} rx={14} fill={WIN} />
              <text x={W / 2} y={H - 15} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                {orderText}
              </text>
            </motion.g>
          </g>
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : IND,
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
            key="notes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", lineHeight: 1.55 }}
          >
            {!shared ? (
              `check failed: the fractions do not share one whole part and one remainder`
            ) : !agrees ? (
              `check failed: sorting by denominator disagrees with cross-multiplying`
            ) : !answerOk ? (
              `check failed: this order is choice ${hit?.label}, not ${problem.answer}`
            ) : (
              <>
                {`cross-multiplying agrees, so the denominators really do decide it`}
                {reversedHit && (
                  <>
                    <br />
                    {`${reversedHit.label} is the exact reversal — the trap of reading "bigger denominator" the wrong way`}
                  </>
                )}
              </>
            )}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.8 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
