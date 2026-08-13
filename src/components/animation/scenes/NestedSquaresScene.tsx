import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const GRAY = "#b8c0cc";
const WHITE = "#ffffff";
const MARK = "#4338ca";
const WIN = "#16a34a";

/**
 * Squares stacked largest to smallest with two corners aligned, alternating
 * colour. Each square is hidden by the next one down except for an L-shaped band,
 * so the visible area of one colour is the sum of s² − (next s)² over that
 * colour's squares. Bands are computed, and because they partition the largest
 * square the scene can check its own arithmetic.
 * Data: { squares:[{side,color}], target }.
 */
export function NestedSquaresScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const target = data.target != null ? String(data.target) : "gray";
  const sq = (Array.isArray(data.squares) ? data.squares : [])
    .map((r) => {
      const o = (r ?? {}) as Record<string, unknown>;
      return { s: num(o.side, 0), c: o.color != null ? String(o.color) : "white" };
    })
    .filter((q) => q.s > 0)
    .sort((a, b) => b.s - a.s);

  const bands = sq.map((q, i) => {
    const nxt = i + 1 < sq.length ? sq[i + 1].s : 0;
    return { ...q, band: q.s * q.s - nxt * nxt, inner: nxt };
  });
  const targetBands = bands.filter((b) => b.c === target);
  const visible = targetBands.reduce((a, b) => a + b.band, 0);
  const allBands = bands.reduce((a, b) => a + b.band, 0);
  const partitions = sq.length > 0 && allBands === sq[0].s * sq[0].s;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  // the whole stack is always drawn (it animates in largest-first); otherwise a
  // half-built stack would show a lower square through a hole that belongs to
  // one not yet placed
  const shown = sq.length;
  const showOutlines = step >= 1 || isFinal;
  const showBands = step >= 2 || isFinal;

  // ---- geometry: aligned at the bottom-left ----
  const S = sq.length ? sq[0].s : 1;
  const k = 19;
  const m = 26;
  const W = m * 2 + S * k;
  const H = m * 2 + S * k;
  const X = (x: number) => m + x * k;
  const Y = (y: number) => m + (S - y) * k;

  // an L: the square minus the next one down, both anchored bottom-left
  const lPath = (s: number, t: number) =>
    `M ${X(0)},${Y(0)} L ${X(s)},${Y(0)} L ${X(s)},${Y(s)} L ${X(0)},${Y(s)} Z` +
    (t > 0 ? ` M ${X(0)},${Y(0)} L ${X(t)},${Y(0)} L ${X(t)},${Y(t)} L ${X(0)},${Y(t)} Z` : "");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 300 }}>
        {/* painter's order: biggest first, each new one covers the last */}
        {bands.slice(0, shown).map((b, i) => (
          <motion.rect
            key={i}
            x={X(0)}
            y={Y(b.s)}
            width={b.s * k}
            height={b.s * k}
            fill={b.c === "gray" ? GRAY : WHITE}
            stroke={INK}
            strokeWidth={1.6}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.12 }}
            style={{ transformBox: "fill-box", transformOrigin: "bottom left" }}
          />
        ))}

        {/* at first just outline every band, to show what "visible" means */}
        {showOutlines &&
          !showBands &&
          bands.map((b, i) => (
            <motion.path
              key={`o${i}`}
              d={lPath(b.s, b.inner)}
              fillRule="evenodd"
              fill="none"
              stroke={MARK}
              strokeWidth={1.6}
              strokeDasharray="4 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 0.25, delay: i * 0.1 }}
            />
          ))}

        {/* the L-band each target square actually shows */}
        <AnimatePresence>
          {showBands &&
            targetBands.map((b, i) => (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 + i * 0.18 }}>
                <path d={lPath(b.s, b.inner)} fillRule="evenodd" fill="rgba(67,56,202,0.18)" stroke={MARK} strokeWidth={2.2} />
                <text
                  x={X(b.inner + (b.s - b.inner) / 2)}
                  y={Y(b.inner + (b.s - b.inner) / 2) + 5}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="800"
                  fill={MARK}
                  fontFamily={numberFont}
                >
                  {b.band}
                </text>
              </motion.g>
            ))}
        </AnimatePresence>

        {/* side labels along the bottom edge */}
        {bands.slice(0, shown).map((b, i) => (
          <text key={`l${i}`} x={X(b.s)} y={H - 8} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#64748b" fontFamily={numberFont}>
            {b.s}
          </text>
        ))}
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
        {!showOutlines
          ? `stack them biggest first — each covers the one below`
          : !showBands
          ? `every square shows only an L beyond the next one`
          : !isFinal
          ? `each ${target} square shows only an L: ${targetBands.map((b) => `${b.s}² − ${b.inner}² = ${b.band}`).join("  ")}`
          : `${targetBands.map((b) => b.band).join(" + ")} = ${visible}`}
      </motion.span>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: partitions ? "#94a3b8" : "#dc2626" }}
          >
            {partitions
              ? `check: all the bands add to ${allBands} = the big square`
              : `bands do not partition the largest square`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.45 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
