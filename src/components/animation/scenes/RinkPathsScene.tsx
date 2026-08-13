import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const RINK = "#94a3b8";
const BASE = "#4338ca";
const SHORT = "#16a34a";
const LONG = "#f59e0b";
const BAD = "#dc2626";
const RANK = ["#16a34a", "#0d9488", "#f59e0b", "#dc2626"];

type Piece = { id: string; d: string; part: "ends" | "middle" };

/**
 * Laps of a stadium-shaped rink (a rectangle capped with two semicircles),
 * ordered by length. Every lap splits into two independent choices: what it does
 * at the curved ends (follow the arc, or cut straight across) and how it crosses
 * the middle (straight up the walls, or slanting corner to corner k times). The
 * middle is 2*sqrt(L^2 + 4k^2 r^2) for k crossings, which covers no-crossing,
 * one-X and two-X paths with one formula, so the comparisons are pairwise: same
 * middle and different ends, or same ends and one more crossing. Lengths, the
 * comparison chain and the final order are all computed from the geometry, and
 * the order is checked against the stored answer.
 * Data: { radius, straight, cutAngleDeg?, paths:[{label, ends, crossings}] }.
 */
export function RinkPathsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const r = num(data.radius, 19);
  const L = num(data.straight, 62);
  const th = (num(data.cutAngleDeg, 40) * Math.PI) / 180;

  const paths = (Array.isArray(data.paths) ? data.paths : []).map((p) => {
    const o = (p ?? {}) as Record<string, unknown>;
    const k = Math.max(0, Math.round(num(o.crossings, 0)));
    const ends = o.ends === "cut" ? "cut" : "arc";
    // one formula for the middle: k = 0 is the two straight walls, k >= 1 is
    // 2k slants that each cover the full width but only L/k of the climb
    const middle = 2 * Math.sqrt(L * L + 4 * k * k * r * r);
    const endLen =
      ends === "arc"
        ? 2 * Math.PI * r
        : 2 * (Math.hypot(r + r * Math.sin(th), r * Math.cos(th)) + Math.hypot(r - r * Math.sin(th), r * Math.cos(th)));
    return { label: o.label != null ? String(o.label) : "?", ends, k, middle, endLen, len: middle + endLen };
  });

  // the comparison chain: same middle but different ends, then same ends with
  // one more crossing each time
  const arcPaths = paths.filter((p) => p.ends === "arc").sort((a, b) => a.k - b.k);
  const comps: { short: typeof paths[number]; long: typeof paths[number]; part: "ends" | "middle" }[] = [];
  for (const cut of paths.filter((p) => p.ends === "cut")) {
    const twin = arcPaths.find((a) => a.k === cut.k);
    if (twin) comps.push({ short: cut, long: twin, part: "ends" });
  }
  for (let i = 0; i + 1 < arcPaths.length; i++) comps.push({ short: arcPaths[i], long: arcPaths[i + 1], part: "middle" });

  const sorted = [...paths].sort((a, b) => a.len - b.len);
  const order = sorted.map((p) => p.label).join(", ");
  const agrees = problem.shortAnswer == null || order === String(problem.shortAnswer).replace(/\s+/g, " ").trim();

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const comp = !isFinal && step >= 1 && step - 1 < comps.length ? comps[step - 1] : null;

  // ---- geometry ----
  const W = 340;
  const n = Math.max(1, paths.length);
  const pitch = W / n;
  const rr = Math.min(15, pitch * 0.19);
  const LL = (L / r) * rr;
  const top = 20;
  const cy = top + LL / 2 + rr;
  const labelY = cy + LL / 2 + rr + 14;
  const barTop = labelY + 14;
  const barH = 14;
  const barGap = 5;
  const H = isFinal ? barTop + n * (barH + barGap) + 8 : labelY + 8;

  const cxOf = (i: number) => pitch * (i + 0.5);

  const outlineOf = (cx: number) =>
    `M ${cx + rr},${cy - LL / 2} L ${cx + rr},${cy + LL / 2} A ${rr} ${rr} 0 0 1 ${cx - rr},${cy + LL / 2}` +
    ` L ${cx - rr},${cy - LL / 2} A ${rr} ${rr} 0 0 1 ${cx + rr},${cy - LL / 2} Z`;

  const piecesOf = (p: typeof paths[number], cx: number): Piece[] => {
    const out: Piece[] = [];
    const yT = cy - LL / 2;
    const yB = cy + LL / 2;
    if (p.ends === "arc") {
      out.push({ id: "e0", d: `M ${cx - rr},${yT} A ${rr} ${rr} 0 0 1 ${cx + rr},${yT}`, part: "ends" });
      out.push({ id: "e1", d: `M ${cx + rr},${yB} A ${rr} ${rr} 0 0 1 ${cx - rr},${yB}`, part: "ends" });
    } else {
      // a straight cut across each end, peaking off-centre exactly as the figure
      // draws it (the two cuts are 180-degree rotations of each other)
      const ax = rr * Math.sin(th);
      const ay = rr * Math.cos(th);
      out.push({ id: "e0", d: `M ${cx - rr},${yT} L ${cx + ax},${yT - ay} L ${cx + rr},${yT}`, part: "ends" });
      out.push({ id: "e1", d: `M ${cx + rr},${yB} L ${cx - ax},${yB + ay} L ${cx - rr},${yB}`, part: "ends" });
    }
    if (p.k === 0) {
      out.push({ id: "m0", d: `M ${cx - rr},${yT} L ${cx - rr},${yB}`, part: "middle" });
      out.push({ id: "m1", d: `M ${cx + rr},${yT} L ${cx + rr},${yB}`, part: "middle" });
    } else {
      const band = LL / p.k;
      for (let i = 0; i < p.k; i++) {
        const a = yT + i * band;
        const b = a + band;
        out.push({ id: `m${i}a`, d: `M ${cx - rr},${a} L ${cx + rr},${b}`, part: "middle" });
        out.push({ id: `m${i}b`, d: `M ${cx + rr},${a} L ${cx - rr},${b}`, part: "middle" });
      }
    }
    return out;
  };

  const maxLen = Math.max(...paths.map((p) => p.len), 1);
  const barX = 46;
  const barW = W - barX - 62;

  const caption = isFinal
    ? `${sorted.map((p) => p.label).join("  <  ")}`
    : comp == null
    ? `same rink, four laps — each is two ends plus a crossing pattern`
    : comp.part === "ends"
    ? `${comp.short.label} and ${comp.long.label} share the middle: a straight cut beats the curve`
    : comp.short.k === 0
    ? `${comp.short.label} and ${comp.long.label} share the ends: ${comp.short.label} climbs straight, ${comp.long.label} takes the hypotenuse`
    : `${comp.short.label} and ${comp.long.label} share the ends: ${comp.long.label} crosses ${comp.long.k}×, so each slant is steeper`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {paths.map((p, i) => {
          const cx = cxOf(i);
          const inComp = comp != null && (comp.short.label === p.label || comp.long.label === p.label);
          const isShort = comp != null && comp.short.label === p.label;
          const rank = sorted.findIndex((s) => s.label === p.label);
          return (
            <motion.g
              key={p.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: comp != null && !inComp ? 0.18 : 1, y: 0 }}
              transition={{ type: "spring", stiffness: 210, damping: 20, delay: i * 0.07 }}
            >
              <path d={outlineOf(cx)} fill="#f8fafc" stroke={RINK} strokeWidth={1.4} />
              {piecesOf(p, cx).map((piece) => {
                const hot = inComp && piece.part === comp!.part;
                const stroke = hot ? (isShort ? SHORT : LONG) : isFinal ? RANK[Math.min(rank, RANK.length - 1)] : BASE;
                return (
                  <motion.path
                    // re-keyed on the beat it matters, so it draws itself again
                    key={`${piece.id}-${hot ? step : "base"}-${isFinal ? "f" : "n"}`}
                    d={piece.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={hot ? 3.6 : 2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0.4 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.55, delay: hot ? 0.15 : i * 0.08 }}
                  />
                );
              })}

              {/* the curve the cut skipped, lit on the rink wall itself so the
                  long way and the short way are contrasted inside one figure */}
              <AnimatePresence>
                {inComp && comp!.part === "ends" && p.ends === "cut" && (
                  <motion.g key="ghost" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.45 }}>
                    <path
                      d={`M ${cx - rr},${cy - LL / 2} A ${rr} ${rr} 0 0 1 ${cx + rr},${cy - LL / 2}`}
                      fill="none"
                      stroke={LONG}
                      strokeWidth={2.4}
                    />
                    <path
                      d={`M ${cx + rr},${cy + LL / 2} A ${rr} ${rr} 0 0 1 ${cx - rr},${cy + LL / 2}`}
                      fill="none"
                      stroke={LONG}
                      strokeWidth={2.4}
                    />
                  </motion.g>
                )}
              </AnimatePresence>

              {/* the slant is the hypotenuse over this climb and this width */}
              <AnimatePresence>
                {inComp && comp!.part === "middle" && !isShort && (
                  <motion.g key="tri" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.5 }}>
                    <path
                      d={`M ${cx - rr},${cy - LL / 2} L ${cx - rr},${cy - LL / 2 + LL / Math.max(1, p.k)} L ${cx + rr},${
                        cy - LL / 2 + LL / Math.max(1, p.k)
                      }`}
                      fill="none"
                      stroke={LONG}
                      strokeWidth={2.4}
                      strokeDasharray="4 3"
                    />
                  </motion.g>
                )}
              </AnimatePresence>

              <text x={cx} y={labelY} textAnchor="middle" fontSize="12" fontWeight="800" fill={inComp || comp == null ? INK : "#94a3b8"} fontFamily={numberFont}>
                {p.label}
              </text>
            </motion.g>
          );
        })}

        {/* the payoff: every lap straightened out into a bar */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="bars" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              {sorted.map((p, i) => {
                const y = barTop + i * (barH + barGap);
                return (
                  <g key={p.label}>
                    <text x={barX - 8} y={y + barH - 3} textAnchor="end" fontSize="11.5" fontWeight="800" fill={RANK[Math.min(i, RANK.length - 1)]} fontFamily={numberFont}>
                      {p.label}
                    </text>
                    <motion.rect
                      x={barX}
                      y={y}
                      height={barH}
                      rx={4}
                      fill={RANK[Math.min(i, RANK.length - 1)]}
                      initial={{ width: 0 }}
                      animate={{ width: (p.len / maxLen) * barW }}
                      transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.3 + i * 0.12 }}
                    />
                    <text
                      x={barX + (p.len / maxLen) * barW + 7}
                      y={y + barH - 3}
                      fontSize="10.5"
                      fontWeight="700"
                      fill="#64748b"
                      fontFamily={numberFont}
                    >
                      {(p.len / r).toFixed(1)} r
                    </text>
                  </g>
                );
              })}
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
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees ? `and none of it depended on the rink's proportions` : `computed order ${order} does not match the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: SHORT, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
