import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const ROCK = "#9ca3af";
const MARK = "#4338ca";
const HOT = "#f59e0b";
const WIN = "#16a34a";
const BAD = "#dc2626";

const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(3))));

/**
 * Two overlapping right-angled "mountains" whose sides meet the ground at 45
 * degrees, with the union's area given and the height of the crossing point
 * wanted. Such a mountain of height H has base 2H, so its area is exactly H^2 —
 * which turns the whole problem into inclusion and exclusion on squares:
 * H1^2 + H2^2 - h^2 = union, because the overlap is another 45 degree mountain,
 * of height h. The peak separation is then derived too, so the figure is drawn
 * in the answer's own geometry. Areas, overlap, h and the separation are all
 * computed, and the drawn union is re-measured as a check.
 * Data: { heights:[H1,H2], totalArea, unit? }.
 */
export function MountainOverlapScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const hs = (Array.isArray(data.heights) ? data.heights : [8, 12]).map((v) => num(v, 1));
  const H1 = hs[0];
  const H2 = hs[1] ?? hs[0];
  const union = num(data.totalArea, 0);
  const unit = data.unit != null ? String(data.unit) : "";

  // a 45 degree mountain of height H spans 2H, so its area is H^2
  const a1 = H1 * H1;
  const a2 = H2 * H2;
  const sum = a1 + a2;
  const overlap = sum - union;
  const h = overlap > 0 ? Math.sqrt(overlap) : 0;

  // the separation that makes the overlap exactly 2h wide
  const sep = H1 + H2 - 2 * h;
  const x1 = 0;
  const x2 = sep;
  const crossX = (H1 - H2 + x1 + x2) / 2;
  const crossY = H1 - (crossX - x1);

  // re-measure the union from the drawn geometry
  const loX = Math.min(x1 - H1, x2 - H2);
  const hiX = Math.max(x1 + H1, x2 + H2);
  let measured = 0;
  const N = 4000;
  for (let i = 0; i < N; i++) {
    const x = loX + ((hiX - loX) * (i + 0.5)) / N;
    const p1 = Math.max(0, H1 - Math.abs(x - x1));
    const p2 = Math.max(0, H2 - Math.abs(x - x2));
    measured += Math.max(p1, p2) * ((hiX - loX) / N);
  }
  const consistent = Math.abs(measured - union) < 0.05 && Math.abs(crossY - h) < 1e-9;
  const agrees = problem.shortAnswer == null || Math.abs(Number(problem.shortAnswer) - h) < 1e-9;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showAreas = !isFinal && step === 1;
  const showOverlap = isFinal || step >= 2;

  // ---- geometry ----
  const W = 340;
  const H = 202;
  const span = hiX - loX;
  const k = Math.min(284 / span, 116 / Math.max(H1, H2));
  const gY = 150;
  const X = (x: number) => (W - span * k) / 2 + (x - loX) * k;
  const Y = (y: number) => gY - y * k;

  const tri = (px: number, ph: number) => `${X(px - ph)},${Y(0)} ${X(px)},${Y(ph)} ${X(px + ph)},${Y(0)}`;
  const overlapTri = `${X(x2 - H2)},${Y(0)} ${X(crossX)},${Y(crossY)} ${X(x1 + H1)},${Y(0)}`;

  const caption = isFinal
    ? `h² = ${tidy(overlap)}, so h = ${tidy(h)} ${unit}`
    : step === 0
    ? `peaks ${tidy(H1)} and ${tidy(H2)} ${unit} high, every slope at 45°`
    : showAreas
    ? `base is twice the height, so the area is just the height squared`
    : `${tidy(a1)} + ${tidy(a2)} = ${tidy(sum)}, but the art is ${tidy(union)} — the overlap is ${tidy(overlap)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the artwork: the union of the two mountains */}
        {[
          { px: x1, ph: H1, a: a1 },
          { px: x2, ph: H2, a: a2 },
        ].map((m, i) => (
          <motion.polygon
            key={i}
            points={tri(m.px, m.ph)}
            fill={showAreas ? (i === 0 ? "rgba(67,56,202,0.30)" : "rgba(13,148,136,0.28)") : ROCK}
            stroke={INK}
            strokeWidth={1.6}
            strokeLinejoin="round"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: i * 0.15 }}
          />
        ))}

        {/* the doubly counted piece */}
        <AnimatePresence>
          {showOverlap && (
            <motion.polygon
              key="ov"
              points={overlapTri}
              fill="rgba(245,158,11,0.55)"
              stroke={HOT}
              strokeWidth={2}
              strokeLinejoin="round"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 17, delay: 0.25 }}
              style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
            />
          )}
        </AnimatePresence>

        {/* the ground */}
        <line x1={X(loX) - 8} y1={Y(0)} x2={X(hiX) + 8} y2={Y(0)} stroke={INK} strokeWidth={2} />

        {/* right angles at the peaks, as the figure marks them */}
        {[
          { px: x1, ph: H1 },
          { px: x2, ph: H2 },
        ].map((m, i) => (
          <path
            key={`ra${i}`}
            d={`M ${X(m.px) - 7},${Y(m.ph) + 7} L ${X(m.px)},${Y(m.ph) + 14} L ${X(m.px) + 7},${Y(m.ph) + 7}`}
            fill="none"
            stroke={INK}
            strokeWidth={1.1}
          />
        ))}

        {/* peak heights */}
        {[
          { px: x1, ph: H1, side: -1 },
          { px: x2, ph: H2, side: 1 },
        ].map((m, i) => {
          const bx = m.side < 0 ? X(loX) - 4 : X(hiX) + 4;
          return (
            <motion.g key={`hh${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.12 }}>
              <line x1={bx} y1={Y(0)} x2={bx} y2={Y(m.ph)} stroke={INK} strokeWidth={1.1} />
              <line x1={bx} y1={Y(m.ph)} x2={X(m.px)} y2={Y(m.ph)} stroke={INK} strokeWidth={1} strokeDasharray="4 3" />
              <text x={bx + m.side * 10} y={Y(m.ph / 2) + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {tidy(m.ph)}
              </text>
            </motion.g>
          );
        })}

        {/* base = twice the height */}
        <AnimatePresence>
          {showAreas &&
            [
              { px: x1, ph: H1, a: a1, c: MARK, side: -1 },
              { px: x2, ph: H2, a: a2, c: "#0d9488", side: 1 },
            ].map((m, i) => (
              <motion.g
                key={`ba${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.25 + i * 0.2 }}
              >
                <line x1={X(m.px - m.ph)} y1={Y(0) + 10 + i * 12} x2={X(m.px + m.ph)} y2={Y(0) + 10 + i * 12} stroke={m.c} strokeWidth={2} />
                <text x={X(m.px)} y={Y(0) + 22 + i * 12} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={m.c} fontFamily={numberFont}>
                  {tidy(2 * m.ph)}
                </text>
                <text x={X(m.px + m.side * m.ph * 0.35)} y={Y(m.ph / 2) + 6} textAnchor="middle" fontSize="12" fontWeight="800" fill={m.c} fontFamily={numberFont}>
                  {tidy(m.ph)}² = {tidy(m.a)}
                </text>
              </motion.g>
            ))}
        </AnimatePresence>

        {/* the crossing point and the height asked for */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <line x1={X(crossX)} y1={Y(0)} x2={X(crossX)} y2={Y(crossY)} stroke={INK} strokeWidth={1.4} strokeDasharray="4 3" />
          <text x={X(crossX) + 8} y={Y(crossY / 2) + 5} fontSize="13" fontWeight="800" fill={isFinal ? WIN : INK} fontFamily={numberFont}>
            {isFinal ? tidy(h) : "h"}
          </text>
          <circle cx={X(crossX)} cy={Y(crossY)} r={3.5} fill={isFinal ? WIN : INK} />
        </motion.g>

        {/* the 45 degree feet */}
        {step === 0 && !isFinal && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <text x={X(loX) + 16} y={Y(0) - 5} fontSize="9.5" fontWeight="800" fill="#64748b" fontFamily={numberFont}>
              45°
            </text>
            <text x={X(hiX) - 16} y={Y(0) - 5} textAnchor="end" fontSize="9.5" fontWeight="800" fill="#64748b" fontFamily={numberFont}>
              45°
            </text>
          </motion.g>
        )}

        {/* the inclusion and exclusion arithmetic */}
        <AnimatePresence>
          {showOverlap && (
            <motion.g key="ie" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <text x={W / 2} y={Y(0) + 22} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {tidy(a1)} + {tidy(a2)} − h² = {tidy(union)}
              </text>
              {isFinal && (
                <motion.text
                  x={W / 2}
                  y={Y(0) + 40}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.9 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  h² = {tidy(overlap)} → h = {tidy(h)}
                </motion.text>
              )}
              {!isFinal && (
                <text x={W / 2} y={Y(0) + 40} textAnchor="middle" fontSize="11" fontWeight="800" fill={HOT} fontFamily={numberFont}>
                  overlap = {tidy(sum)} − {tidy(union)} = {tidy(overlap)}
                </text>
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
          color: isFinal ? "#166534" : showOverlap ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : showOverlap ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showOverlap ? "#fde68a" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {showAreas && (
          <motion.span
            key="sq"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            ½ × 2H × H = H², so the areas are {tidy(a1)} and {tidy(a2)}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOverlap && !isFinal && (
          <motion.span
            key="ov2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            the overlap is a 45° mountain too, of height h — so its area is h²
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && consistent ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees && consistent
              ? `drawn with the peaks ${tidy(sep)} apart, the shaded area measures ${measured.toFixed(0)}`
              : `the drawn figure measures ${measured.toFixed(1)}, not ${tidy(union)}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
