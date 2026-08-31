import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const CLASS_COLORS = ["#4338ca", "#0d9488", "#ea580c", "#16a34a"];

type Pt = { label: string; x: number; y: number };

const dist = (a: Pt, b: Pt) => Math.round(Math.hypot(a.x - b.x, a.y - b.y) * 1000) / 1000;
const isCollinear = (a: Pt, b: Pt, c: Pt) => Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) < 1e-6;

/**
 * "How many shapes" is a counting question the scene answers by brute-force
 * classification rather than assertion: every 3-point combination from the
 * real six points (3 vertices + 3 midpoints) is tested for collinearity —
 * a beat spent on the trap of skipping that check entirely — and every
 * surviving triangle's own side lengths (computed from its real coordinates)
 * sort it into a congruence class, with one representative per class drawn
 * at the end. Data: { points: [{label,x,y}, ...] } (6 points).
 */
export function EquilateralMidpointShapeCountScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const pointsRaw = Array.isArray(data.points)
    ? data.points
    : ["R|0|1.732", "S|-1|0", "T|1|0", "X|0|0", "Y|0.5|0.866", "Z|-0.5|0.866"];
  const points: Pt[] = pointsRaw.map((s) => {
    const [label, x, y] = String(s).split("|");
    return { label, x: Number(x), y: Number(y) };
  });

  const combos: Pt[][] = [];
  for (let i = 0; i < points.length; i++)
    for (let j = i + 1; j < points.length; j++)
      for (let k = j + 1; k < points.length; k++) combos.push([points[i], points[j], points[k]]);

  const collinear = combos.filter(([a, b, c]) => isCollinear(a, b, c));
  const triangles = combos.filter(([a, b, c]) => !isCollinear(a, b, c));

  const sideKey = (t: Pt[]) => [dist(t[0], t[1]), dist(t[1], t[2]), dist(t[0], t[2])].sort((a, b) => a - b).map((v) => v.toFixed(2)).join(",");
  const classesMap = new Map<string, Pt[][]>();
  triangles.forEach((t) => {
    const k = sideKey(t);
    if (!classesMap.has(k)) classesMap.set(k, []);
    classesMap.get(k)!.push(t);
  });
  const classes = Array.from(classesMap.values());
  const answerOk = problem.shortAnswer == null || String(classes.length) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${classes.length} shapes, stored answer is ${problem.shortAnswer}` : "";

  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(combos.length));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showFilter = step >= 2 && !isFinal;

  const W = 300;
  const H = 220;
  const unit = 60;
  const ox = 150;
  const oy = 40;
  const px = (x: number) => ox + x * unit;
  const py = (y: number) => oy + (1.9 - y) * unit;

  const caption = isFinal
    ? `${classes.length} noncongruent shapes among ${triangles.length} real triangles`
    : showFilter
    ? `${combos.length} − ${collinear.length} collinear = ${triangles.length} real triangles`
    : showTrap
    ? trapChoice
      ? `all C(6,3) = ${combos.length} combos — choice ${trapChoice.label}, but ${collinear.length} of them are collinear, not triangles`
      : `all C(6,3) = ${combos.length} combos, but some points are collinear`
    : `6 points: 3 vertices, 3 midpoints`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {!isFinal && (
          <g>
            <polygon points={points.slice(0, 3).map((p) => `${px(p.x)},${py(p.y)}`).join(" ")} fill="none" stroke="#cbd5e1" strokeWidth={1.6} />
            {showFilter &&
              collinear.map((tri, i) => (
                <motion.line
                  key={i}
                  x1={px(tri[0].x)}
                  y1={py(tri[0].y)}
                  x2={px(tri[2].x)}
                  y2={py(tri[2].y)}
                  stroke={BAD}
                  strokeWidth={3}
                  strokeDasharray="4 3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.15 }}
                />
              ))}
            {points.map((p, i) => (
              <motion.g key={p.label} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: i * 0.08 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <circle cx={px(p.x)} cy={py(p.y)} r={i < 3 ? 6 : 5} fill={i < 3 ? IND : "#0d9488"} />
                <text x={px(p.x)} y={py(p.y) - 10} textAnchor="middle" fontSize="11" fontWeight="800" fill={i < 3 ? IND : "#0d9488"} fontFamily={numberFont}>
                  {p.label}
                </text>
              </motion.g>
            ))}
          </g>
        )}

        {isFinal && (
          <g>
            <text x={W / 2} y={14} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK}>
              one shape per congruence class
            </text>
            {classes.map((cls, i) => {
              const cx = 55 + (i % 2) * 150;
              const cy = 60 + Math.floor(i / 2) * 90;
              const t = cls[0];
              const scale = 22;
              const cxAvg = (t[0].x + t[1].x + t[2].x) / 3;
              const cyAvg = (t[0].y + t[1].y + t[2].y) / 3;
              const color = CLASS_COLORS[i % CLASS_COLORS.length];
              return (
                <motion.g key={i} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.2 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <polygon
                    points={t.map((p) => `${cx + (p.x - cxAvg) * scale},${cy - (p.y - cyAvg) * scale}`).join(" ")}
                    fill={color}
                    fillOpacity={0.25}
                    stroke={color}
                    strokeWidth={2.2}
                  />
                  <text x={cx} y={cy + 46} textAnchor="middle" fontSize="9" fontWeight="800" fill={color} fontFamily={numberFont}>
                    {t.map((p) => p.label).join("")} · {cls.length} triangle{cls.length === 1 ? "" : "s"}
                  </text>
                </motion.g>
              );
            })}
          </g>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11.5,
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
