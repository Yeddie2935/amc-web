import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const TEAL = "#0d9488";

function parseAreaExpr(raw: string): number {
  const t = String(raw).replace(/\s+/g, "").toLowerCase();
  const sqrtMatch = t.match(/^sqrt\(pi\)(?:\/(\d+))?$/);
  if (sqrtMatch) return Math.sqrt(Math.PI) / (sqrtMatch[1] ? Number(sqrtMatch[1]) : 1);
  const powMatch = t.match(/^pi\^(\d+)$/);
  if (powMatch) return Math.PI ** Number(powMatch[1]);
  const multMatch = t.match(/^(\d+)pi$/);
  if (multMatch) return Number(multMatch[1]) * Math.PI;
  if (t === "pi") return Math.PI;
  return NaN;
}

/**
 * A square and a circle share the same area — same "amount of ink," two
 * different outlines. Equating s² and πr² makes r² cancel on both sides,
 * leaving (s/r)² = π. The real trap is stopping right there and reading off
 * s/r = π: that's the *squared* ratio, one square root short of the answer.
 * A to-scale square and circle at the derived ratio close the scene, proving
 * the two shapes really do enclose the same area.
 *
 * data: { radius }
 */
export function SquareCircleEqualAreaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const radius = num(data.radius, 1);
  const ratio = Math.sqrt(Math.PI);
  const side = ratio * radius;
  const circleArea = Math.PI * radius * radius;
  const squareArea = side * side;
  const ok = Math.abs(circleArea - squareArea) < 1e-9;

  const trapChoice = (problem.choices ?? []).find((c) => {
    const v = parseAreaExpr(c.text);
    return Number.isFinite(v) && Math.abs(v - Math.PI) < 1e-6 && String(c.label) !== problem.answer;
  });

  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  const W = 340;
  const H = 300;
  // schematic (not-to-scale) shapes used while the ratio is still unknown
  const sqX = 60, sqY = 60, sqSide = 90;
  const crCx = 250, crCy = 105, crR = 50;

  const caption =
    beat === 0
      ? "square side s, circle radius r — same area"
      : beat === 1
      ? "s² = πr²"
      : beat === 2
      ? "divide by r²: (s/r)² = π"
      : beat === 3
      ? "s/r = π — that's the squared ratio, not s/r"
      : beat === 4
      ? "take the square root: s/r = √π"
      : `to scale: r = ${radius}, s = √π ≈ ${side.toFixed(2)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* beats 0-4: schematic square + circle, labeled with variables */}
        {beat <= 4 && (
          <g>
            <motion.rect x={sqX} y={sqY} width={sqSide} height={sqSide} rx={4} fill={IND} fillOpacity={0.16} stroke={IND} strokeWidth={1.8} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <text x={sqX + sqSide / 2} y={sqY + sqSide / 2 + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={IND} fontFamily={FONT}>
              s
            </text>
            <motion.circle cx={crCx} cy={crCy} r={crR} fill={TEAL} fillOpacity={0.16} stroke={TEAL} strokeWidth={1.8} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <line x1={crCx} y1={crCy} x2={crCx + crR} y2={crCy} stroke={TEAL} strokeWidth={1.6} strokeDasharray="3 3" />
            <text x={crCx + crR / 2} y={crCy - 6} textAnchor="middle" fontSize="14" fontWeight="800" fill={TEAL} fontFamily={FONT}>
              r
            </text>

            {beat === 0 && (
              <motion.text x={W / 2} y={190} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                area(square) = area(circle)
              </motion.text>
            )}

            {beat === 1 && (
              <g>
                <motion.text x={sqX + sqSide / 2} y={sqY + sqSide + 24} textAnchor="middle" fontSize="14" fontWeight="800" fill={IND} fontFamily={FONT} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  s²
                </motion.text>
                <motion.text x={crCx} y={crCy + crR + 24} textAnchor="middle" fontSize="14" fontWeight="800" fill={TEAL} fontFamily={FONT} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  πr²
                </motion.text>
                <motion.text x={W / 2} y={230} textAnchor="middle" fontSize="18" fontWeight="800" fill={INK} fontFamily={FONT} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: "spring", stiffness: 220, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  s² = πr²
                </motion.text>
              </g>
            )}

            {beat === 2 && (
              <g>
                <text x={W / 2} y={192} textAnchor="middle" fontSize="14" fontWeight="700" fill={DIM} fontFamily={FONT}>
                  s² = πr²
                </text>
                <motion.text x={W / 2} y={210} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={BAD} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  ÷ r² each side
                </motion.text>
                <motion.text x={W / 2} y={242} textAnchor="middle" fontSize="20" fontWeight="800" fill={IND} fontFamily={FONT} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, type: "spring", stiffness: 220, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  (s/r)² = π
                </motion.text>
              </g>
            )}

            {beat === 3 && (
              <g>
                <text x={W / 2} y={200} textAnchor="middle" fontSize="14" fontWeight="700" fill={DIM} fontFamily={FONT}>
                  (s/r)² = π
                </text>
                <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.4 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <rect x={W / 2 - 55} y={214} width={110} height={40} rx={10} fill="#fee2e2" stroke={BAD} strokeWidth={1.8} />
                  <text x={W / 2} y={240} textAnchor="middle" fontSize="17" fontWeight="800" fill={BAD} fontFamily={FONT}>
                    s/r = π ✗
                  </text>
                </motion.g>
              </g>
            )}

            {beat === 4 && (
              <g>
                <text x={W / 2} y={190} textAnchor="middle" fontSize="14" fontWeight="700" fill={DIM} fontFamily={FONT}>
                  (s/r)² = π
                </text>
                <motion.text x={W / 2} y={208} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  take √ of both sides
                </motion.text>
                <motion.text x={W / 2} y={240} textAnchor="middle" fontSize="22" fontWeight="800" fill={WIN} fontFamily={FONT} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, type: "spring", stiffness: 220, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  s/r = √π
                </motion.text>
              </g>
            )}
          </g>
        )}

        {/* beat 5: to-scale confirmation, side by side like the schematic */}
        {beat === 5 && (
          <g>
            {(() => {
              const unit = 34;
              const sidePx = side * unit;
              const rPx = radius * unit;
              const sqCx = 110, sqCy = 130;
              const crCx2 = 240, crCy2 = 130;
              return (
                <g>
                  <motion.rect x={sqCx - sidePx / 2} y={sqCy - sidePx / 2} width={sidePx} height={sidePx} rx={4} fill={IND} fillOpacity={0.22} stroke={IND} strokeWidth={2} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
                  <text x={sqCx} y={sqCy + sidePx / 2 + 20} textAnchor="middle" fontSize="12" fontWeight="800" fill={IND} fontFamily={FONT}>
                    s = √π ≈ {side.toFixed(2)}
                  </text>
                  <motion.circle cx={crCx2} cy={crCy2} r={rPx} fill={TEAL} fillOpacity={0.22} stroke={TEAL} strokeWidth={2} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
                  <text x={crCx2} y={crCy2 + rPx + 20} textAnchor="middle" fontSize="12" fontWeight="800" fill={TEAL} fontFamily={FONT}>
                    r = {radius}
                  </text>
                  <motion.text x={W / 2} y={230} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={INK} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                    s² ≈ {squareArea.toFixed(2)} = πr² ≈ {circleArea.toFixed(2)}
                  </motion.text>
                </g>
              );
            })()}
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
          color: isFinal ? "#166534" : beat === 3 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 3 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 3 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 3 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 260 }}>
            {trapChoice ? `choice ${trapChoice.label} (π) is (s/r)² — one square root short` : `π is the squared ratio, not s/r itself`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: square area ${squareArea.toFixed(4)} ≠ circle area ${circleArea.toFixed(4)}`}
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
