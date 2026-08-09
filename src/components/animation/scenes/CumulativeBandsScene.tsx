import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const WIN = "#16a34a";
const NEUTRAL = "#94a3b8";
const BAND_COLORS = ["#7c3aed", "#0369a1", "#0d9488", "#b45309", "#be123c", "#4338ca"];

interface Cut {
  atLeast: number;
  count: number;
}

function readCuts(value: unknown): Cut[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((c) => {
      const o = (c ?? {}) as Record<string, unknown>;
      return { atLeast: num(o.atLeast, 0), count: Math.max(0, Math.round(num(o.count, 0))) };
    })
    .sort((a, b) => b.atLeast - a.atLeast); // highest cutoff first
}

/**
 * Cumulative "at least X" tallies turned into exclusive bands. Because each
 * group is nested inside the next, the count in a range is the difference of two
 * cutoffs — and equally the sum of the bands it spans. Individuals are drawn as
 * dots that fly apart from one pooled group into their bands, so both routes to
 * the answer are visible at once. Bands, target and totals are all computed.
 * Data: { cutoffs:[{atLeast,count},...], rangeLow, rangeHigh, unit?, label? }.
 */
export function CumulativeBandsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const cuts = readCuts(data.cutoffs);
  const unit = data.unit != null ? String(data.unit) : "students";
  const label = data.label != null ? String(data.label) : "%";
  const rangeLow = num(data.rangeLow, 0);
  const rangeHigh = num(data.rangeHigh, Infinity);

  // exclusive bands: [cut.atLeast, next-higher cutoff)
  const bands = cuts.map((c, i) => {
    const above = i === 0 ? 0 : cuts[i - 1].count;
    const hi = i === 0 ? null : cuts[i - 1].atLeast;
    return {
      lo: c.atLeast,
      hi,
      count: c.count - above,
      inRange: c.atLeast >= rangeLow && c.atLeast < rangeHigh,
      color: BAND_COLORS[i % BAND_COLORS.length],
    };
  });
  const totalAll = cuts.length ? cuts[cuts.length - 1].count : 0;

  // two routes to the same number
  const bandSum = bands.filter((b) => b.inRange).reduce((s, b) => s + b.count, 0);
  const lowCut = cuts.find((c) => c.atLeast === rangeLow)?.count ?? totalAll;
  const highCut = cuts.find((c) => c.atLeast === rangeHigh)?.count ?? 0;
  const target = lowCut - highCut;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showBands = step >= 1 || isFinal;
  const showPick = step >= 2 || isFinal;

  // ---- layout ----
  const pitch = 17;
  const rDot = 5.6;
  const perRowSolo = 10;
  const perRowBand = 12;
  const rowH = 19;
  const bandX = 96;
  const W = 340;

  // vertical placement of each band block
  const bandRows = bands.map((b) => Math.max(1, Math.ceil(b.count / perRowBand)));
  const bandTop: number[] = [];
  let yCur = 22;
  bandRows.forEach((r, i) => {
    bandTop[i] = yCur;
    yCur += r * rowH + 12;
  });
  const H = Math.max(160, yCur + 4);

  const soloRows = Math.ceil(totalAll / perRowSolo);
  const soloX = (W - (perRowSolo - 1) * pitch) / 2;
  const soloY = (H - (soloRows - 1) * rowH) / 2 - 6;

  // dots, ordered band by band so membership is contiguous
  const dots: { b: number; k: number }[] = [];
  bands.forEach((b, bi) => {
    for (let k = 0; k < b.count; k++) dots.push({ b: bi, k });
  });

  const posOf = (i: number) => {
    const dsel = dots[i];
    if (!showBands) {
      const r = Math.floor(i / perRowSolo);
      const c = i % perRowSolo;
      return { x: soloX + c * pitch, y: soloY + r * rowH };
    }
    const r = Math.floor(dsel.k / perRowBand);
    const c = dsel.k % perRowBand;
    return { x: bandX + c * pitch, y: bandTop[dsel.b] + r * rowH };
  };

  const rangeText = `${rangeLow}${label} – ${rangeHigh}${label}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 430 }}>
        {/* band labels appear once the dots have split */}
        <AnimatePresence>
          {showBands &&
            bands.map((b, i) => (
              <motion.g
                key={`lab${i}`}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: showPick && !b.inRange ? 0.35 : 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 + i * 0.07 }}
              >
                <text x={86} y={bandTop[i] + 4} textAnchor="end" fontSize="11" fontWeight="800" fill={b.color} fontFamily={numberFont}>
                  {b.hi == null ? `≥${b.lo}${label}` : `${b.lo}–${b.hi}${label}`}
                </text>
                <text x={86} y={bandTop[i] + 16} textAnchor="end" fontSize="10" fontWeight="700" fill={NEUTRAL} fontFamily={numberFont}>
                  {b.count}
                </text>
              </motion.g>
            ))}
        </AnimatePresence>

        {/* one dot per person */}
        {dots.map((dsel, i) => {
          const p = posOf(i);
          const b = bands[dsel.b];
          const dim = showPick && !b.inRange;
          return (
            <motion.circle
              key={i}
              r={rDot}
              initial={{ opacity: 0 }}
              animate={{
                cx: p.x,
                cy: p.y,
                opacity: dim ? 0.22 : 1,
                fill: showBands ? b.color : NEUTRAL,
              }}
              transition={{
                opacity: { duration: 0.25, delay: i * 0.006 },
                fill: { duration: 0.4, delay: 0.1 + dsel.b * 0.08 },
                default: { type: "spring", stiffness: 110, damping: 16, delay: i * 0.006 },
              }}
            />
          );
        })}

        {/* bracket around the picked bands */}
        <AnimatePresence>
          {showPick && (() => {
            const picked = bands.map((b, i) => ({ b, i })).filter((x) => x.b.inRange);
            if (picked.length === 0) return null;
            const first = picked[0].i;
            const lastI = picked[picked.length - 1].i;
            const y1 = bandTop[first] - 9;
            const y2 = bandTop[lastI] + bandRows[lastI] * rowH - 6;
            return (
              <motion.g key="br" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.45 }}>
                <line x1={W - 14} y1={y1} x2={W - 14} y2={y2} stroke={WIN} strokeWidth={2} />
                <line x1={W - 18} y1={y1} x2={W - 14} y2={y1} stroke={WIN} strokeWidth={2} />
                <line x1={W - 18} y1={y2} x2={W - 14} y2={y2} stroke={WIN} strokeWidth={2} />
                <text x={W - 22} y={(y1 + y2) / 2 + 4} textAnchor="end" fontSize="13" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                  {bandSum}
                </text>
              </motion.g>
            );
          })()}
        </AnimatePresence>
      </svg>

      {/* running caption */}
      <motion.span
        key={`${showBands}-${showPick}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 13,
          fontWeight: 800,
          color: showPick ? "#166534" : "#4338ca",
          background: showPick ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${showPick ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {!showBands
          ? `${totalAll} ${unit} scored ≥${rangeLow}${label}`
          : !showPick
          ? `each "at least" group splits into bands`
          : `keep the bands inside ${rangeText}`}
      </motion.span>

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="calc"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}
          >
            <span style={{ fontFamily: numberFont, fontSize: 17, fontWeight: 800, color: INK }}>
              {lowCut} − {highCut} = <span style={{ color: WIN }}>{target}</span>
            </span>
            <span style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: NEUTRAL }}>
              same as the bands:{" "}
              {bands
                .filter((b) => b.inRange)
                .slice()
                .sort((a, b) => a.lo - b.lo) // read low band first, as the range is phrased
                .map((b) => b.count)
                .join(" + ")}{" "}
              = {bandSum}
            </span>
          </motion.div>
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
