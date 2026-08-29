import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const CRUST = "#d97706";
const PEP = "#dc2626";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/**
 * A round pizza, and a row of pepperoni circles that fit exactly across its
 * diameter — the row itself is what sizes the pepperoni, so the scene
 * measures it directly rather than being told the radius. Once every
 * pepperoni's area is known, the total for all of them compares to the
 * whole pizza's area as a plain ratio of counts, since same-size circles
 * cancel their own π and radius² — a fact the closing beat states and
 * checks rather than assumes.
 *
 * data: { pizzaDiameter, acrossCount, pepperoniCount }
 */
export function PepperoniCoverageScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const pizzaDiameter = num(data.pizzaDiameter, 12);
  const acrossCount = Math.round(num(data.acrossCount, 6));
  const pepperoniCount = Math.round(num(data.pepperoniCount, 24));

  const pizzaRadius = pizzaDiameter / 2;
  const pepDiameter = pizzaDiameter / acrossCount;
  const pepRadius = pepDiameter / 2;
  const pepArea = Math.PI * pepRadius * pepRadius;
  const pizzaArea = Math.PI * pizzaRadius * pizzaRadius;
  const totalPepArea = pepperoniCount * pepArea;
  const fraction = totalPepArea / pizzaArea;

  // the ratio collapses to a count ratio, since same-size circles cancel π·r²
  const g = gcd(pepperoniCount, acrossCount * acrossCount) || 1;
  const num_ = pepperoniCount / g;
  const den_ = (acrossCount * acrossCount) / g;
  const fracStr = `${num_}/${den_}`;
  const ok = fracStr === (problem.shortAnswer ?? "").trim();

  // ---- beats: 0 pizza+row, 1 pepperoni size, 2 pepperoni area, 3 total area, 4 pizza area, 5 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  const W = 360;
  const H = 280;
  const cx = W / 2;
  const cy = 130;
  const scale = 90 / pizzaRadius; // px per inch
  const R = pizzaRadius * scale;
  const r = pepRadius * scale;

  const caption =
    beat === 0
      ? `${acrossCount} pepperonis fit across the ${pizzaDiameter}-in pizza`
      : beat === 1
      ? `each pepperoni: ${pizzaDiameter}/${acrossCount} = ${pepDiameter} in diameter, radius ${pepRadius}`
      : beat === 2
      ? `one pepperoni: π × ${pepRadius}² = π`
      : beat === 3
      ? `${pepperoniCount} pepperonis: ${pepperoniCount}π`
      : beat === 4
      ? `pizza: π × ${pizzaRadius}² = ${acrossCount * acrossCount}π`
      : `${pepperoniCount}π / ${acrossCount * acrossCount}π = ${fracStr}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {/* beat 0: the pizza, and the row of pepperonis that sizes them */}
        {beat === 0 && (
          <g>
            <circle cx={cx} cy={cy} r={R} fill="#fef3c7" stroke={CRUST} strokeWidth={2.4} />
            {Array.from({ length: acrossCount }).map((_, i) => (
              <motion.circle
                key={i}
                cx={cx - R + r + i * 2 * r}
                cy={cy}
                r={r}
                fill={PEP}
                fillOpacity={0.85}
                stroke="#fff"
                strokeWidth={1}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.3 + i * 0.1 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            ))}
            <motion.text x={cx} y={cy + R + 20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              {acrossCount} pepperonis span the {pizzaDiameter}-in diameter
            </motion.text>
          </g>
        )}

        {/* beat 1: derive the pepperoni's own size */}
        {beat === 1 && (
          <g>
            <circle cx={cx} cy={cy - 20} r={r * 2.4} fill={PEP} fillOpacity={0.15} stroke={PEP} strokeWidth={2} strokeDasharray="4 3" />
            <circle cx={cx} cy={cy - 20} r={r * 2.4} fill="none" />
            <motion.circle cx={cx} cy={cy - 20} r={r * 2.4} fill={PEP} fillOpacity={0.85} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <path d={`M ${cx - r * 2.4},${cy - 20 - r * 2.4 - 10} L ${cx + r * 2.4},${cy - 20 - r * 2.4 - 10}`} stroke={INK} strokeWidth={1.4} />
            <text x={cx} y={cy - 20 - r * 2.4 - 16} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={FONT}>
              diameter {pepDiameter}
            </text>
            <path d={`M ${cx},${cy - 20} L ${cx + r * 2.4},${cy - 20}`} stroke={IND} strokeWidth={1.8} />
            <text x={cx + r * 1.2} y={cy - 20 + 16} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={IND} fontFamily={FONT}>
              r = {pepRadius}
            </text>
          </g>
        )}

        {/* beat 2: one pepperoni's area */}
        {beat === 2 && (
          <g>
            <motion.circle cx={cx} cy={cy - 10} r={40} fill={PEP} fillOpacity={0.85} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <motion.text x={cx} y={cy + 60} textAnchor="middle" fontSize="15" fontWeight="800" fill={PEP} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              area = π
            </motion.text>
          </g>
        )}

        {/* beat 3: all 24 pepperonis, tallied */}
        {beat === 3 && (
          <g>
            {Array.from({ length: pepperoniCount }).map((_, i) => {
              const cols = 8;
              const row = Math.floor(i / cols);
              const col = i % cols;
              const gridW = cols * 30;
              const gx0 = (W - gridW) / 2 + 15;
              return (
                <motion.circle
                  key={i}
                  cx={gx0 + col * 30}
                  cy={50 + row * 34}
                  r={11}
                  fill={PEP}
                  fillOpacity={0.85}
                  stroke="#fff"
                  strokeWidth={1}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: i * 0.02 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              );
            })}
            <motion.text x={W / 2} y={210} textAnchor="middle" fontSize="16" fontWeight="800" fill={PEP} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              {pepperoniCount} × π = {pepperoniCount}π
            </motion.text>
          </g>
        )}

        {/* beat 4: the whole pizza's area */}
        {beat === 4 && (
          <g>
            <motion.circle cx={cx} cy={cy} r={R} fill="#fef3c7" stroke={CRUST} strokeWidth={2.4} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 160, damping: 18 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <path d={`M ${cx},${cy} L ${cx + R},${cy}`} stroke={CRUST} strokeWidth={1.8} />
            <text x={cx + R / 2} y={cy - 8} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={CRUST} fontFamily={FONT}>
              r = {pizzaRadius}
            </text>
            <motion.text x={cx} y={cy + R + 26} textAnchor="middle" fontSize="15" fontWeight="800" fill={CRUST} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.6 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              π × {pizzaRadius}² = {acrossCount * acrossCount}π
            </motion.text>
          </g>
        )}

        {/* beat 5: the ratio */}
        {beat === 5 && (
          <g>
            <text x={cx} y={100} textAnchor="middle" fontSize="22" fontWeight="800" fill={PEP} fontFamily={FONT}>
              {pepperoniCount}π
            </text>
            <line x1={cx - 40} y1={114} x2={cx + 40} y2={114} stroke={INK} strokeWidth={2} />
            <text x={cx} y={140} textAnchor="middle" fontSize="22" fontWeight="800" fill={CRUST} fontFamily={FONT}>
              {acrossCount * acrossCount}π
            </text>
            <motion.text x={cx} y={190} textAnchor="middle" fontSize="20" fontWeight="800" fill={WIN} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.6 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              = {fracStr}
            </motion.text>
          </g>
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
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
        {beat === 5 && (
          <motion.span key="note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 260 }}>
            same-size circles: the π and the radius² cancel, so it's just a count ratio
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${fracStr} but stored answer reads "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
