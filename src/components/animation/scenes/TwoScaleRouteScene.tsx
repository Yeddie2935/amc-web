import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const ROAD = "#e2e8f0";
const HUE = ["#0891b2", "#b45309", "#7c3aed"];
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const W = 340;
const H = 210;
const X0 = 44;
const X1 = 300;
const RY = 56;
const RH = 28;

const gg = (a: number, b: number): number => (b ? gg(b, a % b) : Math.abs(a));
const lcm = (a: number, b: number) => (a * b) / gg(a, b);
type Fr = { n: number; d: number };
const fr = (n: number, d: number): Fr => {
  const k = gg(Math.abs(n), Math.abs(d)) || 1;
  const s = d < 0 ? -1 : 1;
  return { n: (s * n) / k, d: (s * d) / k };
};
const txt = (a: Fr) => (a.d === 1 ? String(a.n) : `${a.n}/${a.d}`);
const val = (a: Fr) => a.n / a.d;

/**
 * One route with **two different sets of evenly spaced markers** laid along it,
 * and the distance between one marker of each set given. Markers evenly spaced
 * *between* the ends cut the route into one more part than there are markers, so
 * each set is really a ruler in eighths and in thirds — and the whole problem is
 * that those two rulers nearly coincide: the 3rd eighth and the 1st third are
 * only **one twenty-fourth of the route apart**. The beats draw the road with
 * both sets on it, bracket each chosen marker's position as a fraction, put both
 * fractions over their common denominator so the two ticks land side by side on
 * a 24-tick ruler, then price that single tick at the given distance and multiply
 * back up. Closes by re-labelling every marker with real mileages and checking
 * the stated gap. Part counts, both fractions, the common denominator, the sliver
 * and the total are computed in exact rational arithmetic, and the scene flags a
 * gap that does not come out positive.
 * Data: { scales: ["7|water|💧", "2|repair|🔧"], pick: [3,1], gap, unit? }.
 */
export function TwoScaleRouteScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const scales = (Array.isArray(data.scales) ? data.scales : [])
    .map(String)
    .map((s) => s.split("|").map((p) => p.trim()))
    .filter((p) => p.length >= 2 && Number.isFinite(+p[0]) && +p[0] > 0)
    .map((p) => ({ count: Math.round(+p[0]), label: p[1], icon: p[2] ?? "" }));
  const pick = (Array.isArray(data.pick) ? data.pick : []).map(Number);
  const gap = num(data.gap, 0);
  const unit = data.unit != null ? String(data.unit) : "miles";
  if (scales.length < 2 || pick.length < 2 || gap <= 0) return null;

  const parts = scales.map((s) => s.count + 1);
  const pos = scales.map((_, i) => fr(pick[i], parts[i]));
  const D = lcm(parts[0], parts[1]);
  const on = pos.map((p) => (p.n * D) / p.d); // numerators over the common denominator, unreduced
  const diff = fr(pos[0].n * pos[1].d - pos[1].n * pos[0].d, pos[0].d * pos[1].d);
  const ok = diff.n > 0;
  const total = ok ? gap / val(diff) : 0;

  // check the whole thing back on real mileages
  const spacing = scales.map((_, i) => total / parts[i]);
  const realGap = spacing[0] * pick[0] - spacing[1] * pick[1];
  const agrees = ok && (problem.shortAnswer == null || Math.abs(Number(problem.shortAnswer) - total) < 1e-9);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const brackets = step === 1;
  const ruler = isFinal || step >= 2;

  const tx = (f: number) => X0 + f * (X1 - X0);
  const sliverA = tx(on[1] / D);
  const sliverB = tx(on[0] / D);

  const caption = isFinal
    ? `${txt(diff)} of the race is ${gap} ${unit}, so the race is ${total} ${unit}`
    : step === 0
    ? `${scales[0].count} ${scales[0].label} stations cut it into ${parts[0]}, ${scales[1].count} ${scales[1].label} into ${parts[1]}`
    : step === 1
    ? `station ${pick[0]} of ${scales[0].count} is ${txt(pos[0])} along; station ${pick[1]} of ${scales[1].count} is ${txt(pos[1])}`
    : `over ${D}ths they are neighbours: ${on[0]}/${D} and ${on[1]}/${D}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the road */}
        <rect x={X0} y={RY} width={X1 - X0} height={RH} fill={ROAD} stroke={INK} strokeWidth={1.4} />
        <line x1={X0} y1={RY + RH / 2} x2={X1} y2={RY + RH / 2} stroke="#fff" strokeWidth={2} strokeDasharray="7 6" />
        {[
          { x: 12, w: 32, t: "Start" },
          { x: X1, w: 32, t: "Finish" },
        ].map((b) => (
          <g key={b.t}>
            <rect x={b.x} y={RY - 8} width={b.w} height={RH + 16} rx={3} fill="#fff" stroke={INK} strokeWidth={1.4} />
            <text x={b.x + b.w / 2} y={RY + RH / 2 + 3} textAnchor="middle" fontSize="7.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {b.t}
            </text>
          </g>
        ))}

        {/* both sets of stations: one below the road, one above */}
        {scales.map((s, si) => {
          const below = si === 0;
          return Array.from({ length: s.count }).map((_, k) => {
            const i = k + 1;
            const x = tx(i / parts[si]);
            const chosen = i === pick[si];
            return (
              <motion.g
                key={`${si}-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.15 + si * 0.4 + k * 0.06 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <line
                  x1={x}
                  y1={below ? RY + RH : RY}
                  x2={x}
                  y2={below ? RY + RH + 11 : RY - 11}
                  stroke={chosen ? HUE[si] : DIM}
                  strokeWidth={chosen ? 2.4 : 1.3}
                />
                <text x={x} y={below ? RY + RH + 21 : RY - 14} textAnchor="middle" fontSize="8" fontWeight="800" fill={chosen ? HUE[si] : DIM} fontFamily={numberFont}>
                  {isFinal ? Math.round(spacing[si] * i) : i}
                </text>
                {s.icon && (
                  <text x={x} y={below ? RY + RH - 4 : RY + 12} textAnchor="middle" fontSize="8.5">
                    {s.icon}
                  </text>
                )}
              </motion.g>
            );
          });
        })}
        <text x={6} y={RY - 25} textAnchor="start" fontSize="8.5" fontWeight="800" fill={HUE[1]} fontFamily={numberFont}>
          {scales[1].label} {scales[1].icon}
        </text>
        <text x={6} y={RY + RH + 21} textAnchor="start" fontSize="8.5" fontWeight="800" fill={HUE[0]} fontFamily={numberFont}>
          {scales[0].label} {scales[0].icon}
        </text>

        {/* how far along each chosen station sits */}
        <AnimatePresence>
          {brackets && (
            <motion.g key="br" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {[0, 1].map((si) => {
                const y = 112 + si * 26;
                const x = tx(val(pos[si]));
                return (
                  <motion.g key={si} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + si * 0.4 }}>
                    <path d={`M ${X0} ${y - 5} L ${X0} ${y} L ${x} ${y} L ${x} ${y - 5}`} fill="none" stroke={HUE[si]} strokeWidth={1.6} />
                    <text x={(X0 + x) / 2} y={y + 13} textAnchor="middle" fontSize="11" fontWeight="800" fill={HUE[si]} fontFamily={numberFont}>
                      {txt(pos[si])} of the race
                    </text>
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>

        {/* both fractions over one denominator */}
        <AnimatePresence>
          {ruler && (
            <motion.g key="rl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={X0} y1={122} x2={X1} y2={122} stroke={DIM} strokeWidth={1.2} />
              {Array.from({ length: D + 1 }).map((_, i) => (
                <motion.line
                  key={i}
                  x1={tx(i / D)}
                  y1={122}
                  x2={tx(i / D)}
                  y2={122 - (i === on[0] || i === on[1] ? 12 : 5)}
                  stroke={i === on[0] ? HUE[0] : i === on[1] ? HUE[1] : DIM}
                  strokeWidth={i === on[0] || i === on[1] ? 2.4 : 0.9}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.02 }}
                />
              ))}
              <text x={X0} y={136} fontSize="8.5" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                the race in {D}ths
              </text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <rect x={sliverA} y={100} width={Math.max(sliverB - sliverA, 2)} height={22} fill={WIN} opacity={0.35} />
                <text x={(sliverA + sliverB) / 2} y={96} textAnchor="middle" fontSize="10" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                  {txt(diff)}
                </text>
              </motion.g>
              <text x={X1} y={136} textAnchor="end" fontSize="9.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                {txt(pos[0])} = {on[0]}/{D} · {txt(pos[1])} = {on[1]}/{D}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the sliver priced, and the race measured */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.text
                x={X0}
                y={160}
                fontSize="12.5"
                fontWeight="800"
                fill={MARK}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {txt(diff)} of the race = {gap} {unit}
              </motion.text>
              <motion.text
                x={X0}
                y={186}
                fontSize="18"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.9 }}
                style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              >
                {diff.d} × {gap} = {total} {unit}
              </motion.text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.text key="hint" x={X0} y={186} fontSize="10.5" fontWeight="800" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              {scales[0].count} stations make {parts[0]} gaps, not {scales[0].count}
            </motion.text>
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
            transition={{ delay: 1.4 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {!ok
              ? "those two stations do not sit in that order"
              : agrees
              ? `check: ${scales[0].label} every ${spacing[0]}, ${scales[1].label} every ${spacing[1]} — ${spacing[0] * pick[0]} − ${spacing[1] * pick[1]} = ${realGap}`
              : `this gives ${total}, which is not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
