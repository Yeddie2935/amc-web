import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const TAPE = "#a5b4fc";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(3))));

/**
 * A roll of tape seen in cross section, unrolled. Winding does not change how
 * much tape there is, so the ring's area and the flat strip's area are the same
 * quantity measured two ways: the ring is pi(R^2 - r^2), and the strip is its
 * length times its thickness. Dividing gives the length in one step. The scene
 * measures the ring, then extends the strip out of the roll, then divides — and
 * closes with the independent check that the number of layers times the average
 * circumference gives the same length. Radii, area, length, its rounding, the
 * layer count and that cross-check are all computed.
 * Data: { outerDiameter, innerDiameter, thickness, unit?, roundTo? }.
 */
export function UnrollTapeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const D = num(data.outerDiameter, 4);
  const d = num(data.innerDiameter, 2);
  const t = num(data.thickness, 0.015);
  const unit = data.unit != null ? String(data.unit) : "in";
  const roundTo = Math.max(1, Math.round(num(data.roundTo, 100)));

  const R = D / 2;
  const r = d / 2;
  const areaPi = R * R - r * r; // area = areaPi * pi
  const area = Math.PI * areaPi;
  const length = t > 0 ? area / t : 0;
  const lenPi = t > 0 ? areaPi / t : 0; // length = lenPi * pi
  const rounded = Math.round(length / roundTo) * roundTo;

  // the same length by a different route: layers x average circumference
  const layers = t > 0 ? (R - r) / t : 0;
  const avgC = 2 * Math.PI * ((R + r) / 2);
  const crossOk = Math.abs(layers * avgC - length) < 1e-9;
  const agrees = problem.shortAnswer == null || Number(problem.shortAnswer) === rounded;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showArea = isFinal || step >= 1;
  const showStrip = isFinal || step >= 2;

  // ---- geometry ----
  const W = 340;
  const H = 192;
  const k = 50 / R;
  const cx = 22 + R * k;
  const cy = 84;
  const RO = R * k;
  const RI = r * k;
  const th = 9; // the strip is drawn far thicker than scale, and says so
  const stripX = cx + RO;
  const stripEnd = W - 14;

  const caption = isFinal
    ? `${tidy(areaPi)}π ÷ ${t} = ${tidy(lenPi)}π ≈ ${Math.round(length)} → ${rounded} ${unit}`
    : step === 0
    ? `outer radius ${tidy(R)} ${unit}, inner radius ${tidy(r)} ${unit}`
    : !showStrip
    ? `ring area = π(${tidy(R)}² − ${tidy(r)}²) = ${tidy(areaPi)}π ≈ ${area.toFixed(2)} ${unit}²`
    : `unrolled it is the same ${tidy(areaPi)}π, now as length × ${t}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the strip coming off the roll */}
        <AnimatePresence>
          {showStrip && (
            <motion.g key="strip" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.rect
                x={stripX}
                y={cy - th / 2}
                height={th}
                fill={TAPE}
                stroke={MARK}
                strokeWidth={1.2}
                initial={{ width: 0 }}
                animate={{ width: stripEnd - stripX }}
                transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.2 }}
              />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <line x1={stripEnd - 2} y1={cy - th / 2 - 10} x2={stripEnd - 2} y2={cy - th / 2 - 2} stroke={MARK} strokeWidth={1.2} />
                <line x1={stripX + 2} y1={cy - th / 2 - 10} x2={stripX + 2} y2={cy - th / 2 - 2} stroke={MARK} strokeWidth={1.2} />
                <line x1={stripX + 2} y1={cy - th / 2 - 6} x2={stripEnd - 2} y2={cy - th / 2 - 6} stroke={MARK} strokeWidth={1.2} strokeDasharray="3 3" />
                <text x={(stripX + stripEnd) / 2} y={cy - th / 2 - 11} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                  {isFinal ? `≈ ${Math.round(length)} ${unit}` : "length ?"}
                </text>
                <text x={stripEnd} y={cy + th / 2 + 14} textAnchor="end" fontSize="8.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                  thickness {t} {unit} — not to scale
                </text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the roll in cross section */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={RO}
          fill={showArea ? TAPE : "#e2e8f0"}
          stroke={INK}
          strokeWidth={1.6}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={RI}
          fill="#fff"
          stroke={INK}
          strokeWidth={1.6}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.12 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />

        {/* the diameters, as the contest figure marks them */}
        {step === 0 && !isFinal && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <line x1={cx - RI} y1={cy} x2={cx + RI} y2={cy} stroke={INK} strokeWidth={1.3} markerStart="url(#tArrow)" markerEnd="url(#tArrow)" />
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {tidy(d)} {unit}
            </text>
            <line x1={cx - RO} y1={cy + RO + 16} x2={cx + RO} y2={cy + RO + 16} stroke={INK} strokeWidth={1.3} markerStart="url(#tArrow)" markerEnd="url(#tArrow)" />
            <text x={cx} y={cy + RO + 30} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {tidy(D)} {unit}
            </text>
          </motion.g>
        )}
        <defs>
          <marker id="tArrow" markerWidth="7" markerHeight="7" refX="3" refY="3" orient="auto">
            <path d="M 6,0 L 0,3 L 6,6 z" fill={INK} />
          </marker>
        </defs>

        {/* the ring's area, as a difference of squares */}
        <AnimatePresence>
          {showArea && !showStrip && (
            <motion.g key="ar" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={cx + RO + 22} y={cy - 30} width={150} height={60} rx={10} fill="#eef2ff" stroke={MARK} strokeWidth={1.6} />
              <text x={cx + RO + 97} y={cy - 10} textAnchor="middle" fontSize="12" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                π({tidy(R)}² − {tidy(r)}²)
              </text>
              <text x={cx + RO + 97} y={cy + 10} textAnchor="middle" fontSize="15" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                = {tidy(areaPi)}π
              </text>
              <text x={cx + RO + 97} y={cy + 25} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                ≈ {area.toFixed(2)} {unit}²
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the same area, now measured the other way */}
        <AnimatePresence>
          {showStrip && (
            <motion.g key="eq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}>
              <text x={W / 2} y={cy + 70} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                length × {t} = {tidy(areaPi)}π
              </text>
              {isFinal && (
                <motion.text
                  x={W / 2}
                  y={cy + 92}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.3 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  length = {tidy(lenPi)}π ≈ {Math.round(length)} {unit}
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
            transition={{ delay: 1.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && crossOk ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees && crossOk
              ? `check: ${layers.toFixed(1)} layers × ${avgC.toFixed(2)} average circumference = ${(layers * avgC).toFixed(0)}`
              : `this gives ${Math.round(length)}, which does not round to the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
