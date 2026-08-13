import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const SHADE = "#a5b4fc";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(4))));

/**
 * Concentric circles where some rings are shaded whole and one ring is shaded
 * only across a central angle, with the shaded area required to be a set share
 * of the disc. The rings' areas come from the differences of squares, the whole
 * rings supply a fixed amount, and the sector has to make up the rest — so the
 * angle is just that shortfall as a fraction of its own ring, turned into
 * degrees. An annular sector is drawn as a thick stroked arc, which lets it
 * sweep open. Ring areas, the shortfall, the fraction and the angle are all
 * computed, and the finished figure's shaded area is checked against the target.
 * Data: { radii:[...], fullShaded:[i], sectorRing, targetFraction?, labels? }.
 */
export function ConcentricSectorScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const R = (Array.isArray(data.radii) ? data.radii : [1, 2, 3]).map((v) => num(v, 1)).sort((a, b) => a - b);
  const fullShaded = new Set((Array.isArray(data.fullShaded) ? data.fullShaded : [1]).map((v) => Math.round(num(v, 0))));
  const sectorRing = Math.round(num(data.sectorRing, R.length - 1));
  const share = num(data.targetFraction, 0.5);
  const labels = (Array.isArray(data.labels) ? data.labels : ["B", "C"]).map((l) => String(l));

  // ring areas are the differences of the squares
  const ringArea = (i: number) => Math.PI * (R[i] * R[i] - (i > 0 ? R[i - 1] * R[i - 1] : 0));
  const areas = R.map((_, i) => ringArea(i));
  const total = areas.reduce((a, b) => a + b, 0);
  const fixed = [...fullShaded].reduce((s, i) => s + (areas[i] ?? 0), 0);
  const target = share * total;
  const need = target - fixed;
  const frac = areas[sectorRing] ? need / areas[sectorRing] : 0;
  const angle = 360 * frac;

  const shadedNow = fixed + (angle / 360) * (areas[sectorRing] ?? 0);
  const balanced = Math.abs(shadedNow - target) < 1e-9;
  const agrees = problem.shortAnswer == null || Math.abs(Number(problem.shortAnswer) - angle) < 1e-9;

  const pi = (v: number) => {
    const m = v / Math.PI;
    return Math.abs(m - 1) < 1e-9 ? "π" : `${tidy(m)}π`;
  };
  const ringName = (i: number) => (i === 0 ? "inner disc" : i === R.length - 1 ? "outer ring" : "middle ring");

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showFixed = isFinal || step >= 1;
  const showFrac = isFinal || step >= 2;

  // ---- geometry ----
  const W = 340;
  const H = 194;
  const k = 62 / R[R.length - 1];
  const cx = 92;
  const cy = 98;
  const px = 176;
  const P = (rad: number, deg: number) => ({
    x: cx + rad * Math.cos((deg * Math.PI) / 180),
    y: cy - rad * Math.sin((deg * Math.PI) / 180),
  });
  // an annular sector is a thick arc, which also lets it sweep open
  const arcPath = (rad: number, a0: number, a1: number) => {
    const p0 = P(rad, a0);
    const p1 = P(rad, a1);
    const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
    return `M ${p0.x},${p0.y} A ${rad} ${rad} 0 ${large} 0 ${p1.x},${p1.y}`;
  };
  const midR = (i: number) => ((R[i] + (i > 0 ? R[i - 1] : 0)) / 2) * k;
  const bandW = (i: number) => (R[i] - (i > 0 ? R[i - 1] : 0)) * k;

  const caption = isFinal
    ? `${tidy(frac * 360)}° — the shaded and unshaded halves both measure ${pi(target)}`
    : step === 0
    ? `the rings measure ${areas.map(pi).join(" : ")}, total ${pi(total)}`
    : !showFrac
    ? `half of ${pi(total)} is ${pi(target)}; the whole rings give ${pi(fixed)}, so ${pi(need)} is missing`
    : `${pi(need)} out of the ${ringName(sectorRing)}'s ${pi(areas[sectorRing])} is ${tidy(need / Math.PI)}/${tidy(areas[sectorRing] / Math.PI)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the rings that are shaded outright */}
        {R.map((_, i) =>
          fullShaded.has(i) && showFixed ? (
            i === 0 ? (
              <motion.circle
                key={`s${i}`}
                cx={cx}
                cy={cy}
                r={R[0] * k}
                fill={SHADE}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <motion.circle
                key={`s${i}`}
                cx={cx}
                cy={cy}
                r={midR(i)}
                fill="none"
                stroke={SHADE}
                strokeWidth={bandW(i)}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7 }}
              />
            )
          ) : null
        )}

        {/* the sector: a thick arc, so it can sweep open */}
        <AnimatePresence>
          {isFinal && (
            <motion.path
              key="sec"
              d={arcPath(midR(sectorRing), -angle / 2, angle / 2)}
              fill="none"
              stroke={SHADE}
              strokeWidth={bandW(sectorRing)}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            />
          )}
        </AnimatePresence>

        {/* the ring the sector will come out of */}
        <AnimatePresence>
          {showFrac && !isFinal && (
            <motion.circle
              key="hl"
              cx={cx}
              cy={cy}
              r={midR(sectorRing)}
              fill="none"
              stroke={MARK}
              strokeWidth={bandW(sectorRing)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.16 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>

        {/* the circles themselves */}
        {R.map((r, i) => (
          <motion.circle
            key={`c${i}`}
            cx={cx}
            cy={cy}
            r={r * k}
            fill="none"
            stroke={INK}
            strokeWidth={1.5}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.12 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}

        {/* the two radii that cut the sector */}
        <AnimatePresence>
          {isFinal &&
            [angle / 2, -angle / 2].map((a, i) => {
              const e = P(R[R.length - 1] * k, a);
              return (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.12 }}>
                  <line x1={cx} y1={cy} x2={e.x} y2={e.y} stroke={INK} strokeWidth={1.6} />
                  <text x={e.x + (a > 0 ? 8 : 8)} y={e.y + (a > 0 ? -4 : 11)} fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    {labels[i]}
                  </text>
                </motion.g>
              );
            })}
        </AnimatePresence>
        <text x={cx - 12} y={cy + 4} fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          O
        </text>

        {/* the ring areas, then the arithmetic they feed */}
        {areas.map((a, i) => (
          <motion.g
            key={`p${i}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.15 + i * 0.12 }}
          >
            <rect
              x={px}
              y={22 + i * 20}
              width={W - px - 8}
              height={17}
              rx={5}
              fill={showFrac && i === sectorRing && !isFinal ? "#eef2ff" : fullShaded.has(i) && showFixed ? "#e0e7ff" : "#f8fafc"}
              stroke={showFrac && i === sectorRing && !isFinal ? MARK : fullShaded.has(i) && showFixed ? SHADE : "#e2e8f0"}
              strokeWidth={1.2}
            />
            <text x={px + 6} y={22 + i * 20 + 12} fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {ringName(i)}
            </text>
            <text x={W - 14} y={22 + i * 20 + 12} textAnchor="end" fontSize="9.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
              {pi(a)}
            </text>
          </motion.g>
        ))}
        <line x1={px} y1={22 + areas.length * 20 + 2} x2={W - 8} y2={22 + areas.length * 20 + 2} stroke="#cbd5e1" strokeWidth={1.2} />
        <text x={px + 6} y={22 + areas.length * 20 + 16} fontSize="9.5" fontWeight="800" fill="#64748b" fontFamily={numberFont}>
          total
        </text>
        <text x={W - 14} y={22 + areas.length * 20 + 16} textAnchor="end" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {pi(total)}
        </text>

        {[
          { show: showFixed, t: `half = ${pi(target)}` },
          { show: showFixed, t: `have ${pi(fixed)}, need ${pi(need)}` },
          { show: showFrac, t: `${tidy(need / Math.PI)}/${tidy(areas[sectorRing] / Math.PI)} of the ring` },
          { show: isFinal, t: `× 360° = ${tidy(angle)}°` },
        ].map((row, i) => (
          <AnimatePresence key={i}>
            {row.show && (
              <motion.text
                x={px + 6}
                y={22 + areas.length * 20 + 36 + i * 16}
                fontSize="9.5"
                fontWeight="800"
                fill={i === 3 ? WIN : "#64748b"}
                fontFamily={numberFont}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                {row.t}
              </motion.text>
            )}
          </AnimatePresence>
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
        {caption}
      </motion.span>

      <AnimatePresence>
        {step === 0 && !isFinal && (
          <motion.span
            key="odd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            each ring is a difference of squares: {R.map((r, i) => `${r}²${i > 0 ? `−${R[i - 1]}²` : ""}`).join(", ")}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && balanced ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees && balanced
              ? `check: ${pi(fixed)} + ${tidy(frac)} × ${pi(areas[sectorRing])} = ${pi(shadedNow)}`
              : `this angle shades ${pi(shadedNow)}, not ${pi(target)}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.7 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
