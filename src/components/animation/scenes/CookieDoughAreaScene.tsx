import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const NAVY = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const COLORS = ["#f59e0b", "#0ea5e9", "#a855f7", "#ef4444"];
const S = 8; // px per inch, shared by all four shapes so sizes compare fairly
const BASE_Y = 78;

function toPts(x0: number, local: [number, number][]): string {
  return local.map(([lx, ly]) => `${x0 + lx},${BASE_Y - ly}`).join(" ");
}

/**
 * Four cookie shapes (Art's trapezoid, Roger's rectangle, Paul's
 * parallelogram, Trisha's triangle) drawn to the same scale so their areas
 * compare visually, then a shared "same dough" argument: batch area = Art's
 * area x his count, and everyone else's count is that batch area divided by
 * their own cookie's area. `mode` picks which question this run answers, so
 * problems 8/9/10 (which share this exact setup in their own statements)
 * reuse one scene instead of three copies of the same drawing.
 * Data: { artTop, artBottom, artHeight, artCount, rogerWidth, rogerHeight,
 * paulBase, paulHeight, trishaBase, trishaHeight, mode: "fewest"|"price"|"count",
 * artPrice? }.
 */
export function CookieDoughAreaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const artTop = num(data.artTop, 3);
  const artBottom = num(data.artBottom, 5);
  const artHeight = num(data.artHeight, 3);
  const artCount = num(data.artCount, 12);
  const rogerWidth = num(data.rogerWidth, 4);
  const rogerHeight = num(data.rogerHeight, 2);
  const paulBase = num(data.paulBase, 3);
  const paulHeight = num(data.paulHeight, 2);
  const trishaBase = num(data.trishaBase, 3);
  const trishaHeight = num(data.trishaHeight, 4);
  const mode = data.mode != null ? String(data.mode) : "fewest";
  const artPrice = num(data.artPrice, 60);

  const artArea = ((artTop + artBottom) / 2) * artHeight;
  const rogerArea = rogerWidth * rogerHeight;
  const paulArea = paulBase * paulHeight;
  const trishaArea = (trishaBase * trishaHeight) / 2;
  const areas = [
    { name: "Art", area: artArea, count: artCount },
    { name: "Roger", area: rogerArea, count: 0 },
    { name: "Paul", area: paulArea, count: 0 },
    { name: "Trisha", area: trishaArea, count: 0 },
  ];
  const batchArea = artArea * artCount;
  areas[1].count = batchArea / rogerArea;
  areas[2].count = batchArea / paulArea;
  areas[3].count = batchArea / trishaArea;
  const fewestOwner = areas.reduce((best, r) => (r.area > best.area ? r : best), areas[0]);
  const artRevenue = artCount * artPrice;
  const rogerPrice = artRevenue / areas[1].count;

  const last = totalSteps - 1;
  const showAreas = step >= 1;
  const extra = Math.max(0, step - 2);
  const isFinal = step >= last;

  // ---- shape geometry, all sharing baseline BASE_Y ----
  const colX = [10, 92, 176, 256];
  const trapPts = toPts(colX[0], [
    [0, 0],
    [artBottom * S, 0],
    [artBottom * S, artHeight * S],
    [(artBottom - artTop) * S, artHeight * S],
  ]);
  const rectPts = toPts(colX[1], [
    [0, 0],
    [rogerWidth * S, 0],
    [rogerWidth * S, rogerHeight * S],
    [0, rogerHeight * S],
  ]);
  const shift = paulHeight * S * 0.5;
  const paraPts = toPts(colX[2], [
    [0, 0],
    [paulBase * S, 0],
    [paulBase * S + shift, paulHeight * S],
    [shift, paulHeight * S],
  ]);
  const triPts = toPts(colX[3], [
    [0, 0],
    [trishaBase * S, 0],
    [trishaBase * S, trishaHeight * S],
  ]);
  const shapes = [
    { pts: trapPts, name: "Art", area: artArea, count: areas[0].count },
    { pts: rectPts, name: "Roger", area: rogerArea, count: areas[1].count },
    { pts: paraPts, name: "Paul", area: paulArea, count: areas[2].count },
    { pts: triPts, name: "Trisha", area: trishaArea, count: areas[3].count },
  ];

  const modeCaption =
    mode === "fewest"
      ? extra === 0
        ? `Art's cookie (${artArea}) is the largest of the four`
        : extra === 1
        ? "same dough for everyone: a bigger cookie means fewer cookies from the batch"
        : `${fewestOwner.name}'s cookie is largest, so ${fewestOwner.name} gets the fewest cookies`
      : mode === "price"
      ? extra === 0
        ? `batch area: ${artArea} × ${artCount} = ${batchArea} in²`
        : extra === 1
        ? `Roger's count: ${batchArea} ÷ ${rogerArea} = ${areas[1].count} cookies`
        : `Art earns ${artCount}×${artPrice}=${artRevenue}¢; Roger needs ${artRevenue}÷${areas[1].count}=${rogerPrice}¢ per cookie`
      : extra === 0
      ? `batch area: ${artArea} × ${artCount} = ${batchArea} in²`
      : `Trisha's count: ${batchArea} ÷ ${trishaArea} = ${areas[3].count} cookies`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox="0 0 320 100" width="100%" style={{ maxWidth: 340 }}>
        {shapes.map((s, i) => (
          <motion.polygon
            key={s.name}
            points={s.pts}
            fill={`${COLORS[i]}33`}
            stroke={COLORS[i]}
            strokeWidth={1.6}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: i * 0.12 }}
          />
        ))}
        {shapes.map((s, i) => (
          <text key={`n${s.name}`} x={colX[i] + 30} y={92} textAnchor="middle" fontSize="9" fontWeight="700" fill={NAVY} fontFamily={FONT}>
            {s.name}
          </text>
        ))}
        <AnimatePresence>
          {showAreas &&
            shapes.map((s, i) => (
              <motion.text
                key={`a${s.name}`}
                x={colX[i] + 30}
                y={20}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="900"
                fill={mode === "fewest" && isFinal && s.name === fewestOwner.name ? GREEN : COLORS[i]}
                fontFamily={FONT}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 20 }}
                transition={{ delay: i * 0.1 }}
              >
                {s.area} in²
              </motion.text>
            ))}
        </AnimatePresence>
      </svg>

      <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: NAVY, textAlign: "center", maxWidth: 320 }}>
        {!showAreas
          ? "four cookie shapes, one batch of dough each"
          : step === 1
          ? "same thickness, so area alone measures how much dough each cookie uses"
          : modeCaption}
      </motion.div>

      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            key="conclude"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: FONT, fontSize: 14, fontWeight: 800, color: isFinal ? GREEN : INDIGO }}
          >
            {mode === "fewest" && isFinal
              ? `${fewestOwner.name} — fewest cookies`
              : mode === "price" && isFinal
              ? `${rogerPrice}¢ per Roger cookie`
              : mode === "count" && isFinal
              ? `${areas[3].count} Trisha cookies`
              : ""}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
