import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

type Pt = { x: number; y: number };

/** Shoelace area of a simple polygon (grid units). */
function area(pts: Pt[]): number {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    s += a.x * b.y - b.x * a.y;
  }
  return Math.abs(s) / 2;
}

/** Real perimeter from real vertex-to-vertex distances (grid units). */
function perimeter(pts: Pt[]): number {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    s += Math.hypot(a.x - b.x, a.y - b.y);
  }
  return s;
}

/**
 * Two shapes can look very different in spread but still enclose the same
 * grid area — the scene plots both real quadrilaterals from their own
 * vertices, computes each area with the shoelace formula (not a visual
 * guess), spends a beat on the trap of judging area by how "spread out" a
 * shape looks, then computes each real perimeter from the actual vertex
 * distances to find which is longer.
 * Data: { shapeI: [{x,y},...], shapeII: [{x,y},...] } (grid coordinates).
 */
export function GeoboardTwoShapeCompareScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const parsePts = (raw: unknown, fallback: Pt[]): Pt[] => {
    if (!Array.isArray(raw)) return fallback;
    const pts = raw.map((s) => {
      const [x, y] = String(s).split(",").map(Number);
      return { x, y };
    });
    return pts.length >= 3 ? pts : fallback;
  };
  const shapeI = parsePts(data.shapeI, [{ x: 0, y: 4 }, { x: 1, y: 3 }, { x: 1, y: 2 }, { x: 0, y: 3 }]);
  const shapeII = parsePts(data.shapeII, [{ x: 2, y: 3 }, { x: 4, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }]);

  const areaI = Math.round(area(shapeI) * 100) / 100;
  const areaII = Math.round(area(shapeII) * 100) / 100;
  const periI = Math.round(perimeter(shapeI) * 1000) / 1000;
  const periII = Math.round(perimeter(shapeII) * 1000) / 1000;

  const areaSame = Math.abs(areaI - areaII) < 0.01;
  const periCompare = periI < periII ? "less than" : periI > periII ? "more than" : "equal to";
  const answerOk = problem.shortAnswer == null || (areaSame && String(problem.shortAnswer).toLowerCase().includes(periCompare.split(" ")[0]));
  const failure = !areaSame ? `areas differ: I=${areaI}, II=${areaII}` : !answerOk ? `computed perimeter I ${periCompare} II, check against stored answer` : "";

  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).toLowerCase().includes("i is less than") && String(c.text).toLowerCase().includes("area"));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showArea = step >= 2 || isFinal;

  const unit = 30;
  const ox = 30;
  const oy = 20;
  const px = (p: Pt) => ox + p.x * unit;
  const py = (p: Pt) => oy + p.y * unit;
  const W = 300;
  const H = 190;

  const caption = isFinal
    ? `perimeter I (${periI.toFixed(2)}) ${periCompare} perimeter II (${periII.toFixed(2)})`
    : showArea
    ? `shoelace area: I = ${areaI}, II = ${areaII} — equal`
    : showTrap
    ? trapChoice
      ? `II looks more spread out, tempting to think its area is bigger — choice ${trapChoice.label}, but the grid says otherwise`
      : `a shape that looks bigger doesn't always enclose more area`
    : `plot both real quadrilaterals on the geoboard grid`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {Array.from({ length: 5 }).flatMap((_, gx) =>
          Array.from({ length: 5 }).map((_, gy) => <circle key={`${gx}-${gy}`} cx={ox + gx * unit} cy={oy + gy * unit} r={2} fill="#cbd5e1" />),
        )}

        <motion.polygon
          points={shapeI.map((p) => `${px(p)},${py(p)}`).join(" ")}
          fill={showArea || isFinal ? WIN : IND}
          fillOpacity={0.3}
          stroke={IND}
          strokeWidth={2}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
        <motion.polygon
          points={shapeII.map((p) => `${px(p)},${py(p)}`).join(" ")}
          fill={showTrap ? BAD : showArea || isFinal ? WIN : "#0d9488"}
          fillOpacity={0.3}
          stroke={showTrap ? BAD : "#0d9488"}
          strokeWidth={2}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        />

        <text x={px(shapeI[0]) - 4} y={py(shapeI[0]) - 10} fontSize="11" fontWeight="800" fill={IND} fontFamily={numberFont}>
          I
        </text>
        <text x={px(shapeII[1]) + 6} y={py(shapeII[1])} fontSize="11" fontWeight="800" fill="#0d9488" fontFamily={numberFont}>
          II
        </text>

        {isFinal && (
          <>
            {shapeI.map((p, i) => {
              const q = shapeI[(i + 1) % shapeI.length];
              return <line key={`li${i}`} x1={px(p)} y1={py(p)} x2={px(q)} y2={py(q)} stroke={IND} strokeWidth={3} strokeOpacity={0.5} />;
            })}
            {shapeII.map((p, i) => {
              const q = shapeII[(i + 1) % shapeII.length];
              return <line key={`lii${i}`} x1={px(p)} y1={py(p)} x2={px(q)} y2={py(q)} stroke="#0d9488" strokeWidth={3} strokeOpacity={0.5} />;
            })}
          </>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 300,
        }}
      >
        {caption}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
