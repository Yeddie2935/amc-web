import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const SIDE = "#0d9488";
const LONG = "#7c3aed";
const SHORT = "#d97706";
const FILL = "#eef2ff";

const parseChoice = (text: string) =>
  Number(String(text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));

/**
 * A rhombus given its perimeter and one diagonal, asking for the area. Quoting
 * `d1 * d2 / 2` answers it, but the formula is the part worth earning, and this
 * figure hands over both halves of the derivation.
 *
 * The diagonals of a rhombus bisect each other at right angles, so half the given
 * diagonal and a whole side are two sides of a **right triangle** whose third
 * side is half the other diagonal — here 12 and 13 giving 5, the 5-12-13 triple.
 * That is the only computation in the problem.
 *
 * The area then comes out of a dissection rather than a formula. The two
 * diagonals cut the rhombus into four right triangles, and each one **rotates
 * 180 degrees about the midpoint of the rhombus edge it carries**, landing
 * exactly on the corner triangle outside — so the rhombus and its leftovers are
 * the same four shapes twice over, and the rhombus is precisely half of the
 * `d1 x d2` box its diagonals span. The rotation is genuine: for each of these
 * triangles the edge midpoint *is* its own bounding-box centre, so Motion's
 * own-centre pivot spins it onto its corner with no translation at all.
 *
 * Everything is computed from the perimeter and the diagonal — side, both
 * half-diagonals, the area by dissection and the area by formula — and the scene
 * checks the two routes agree, checks the drawn polygon's shoelace area, and
 * checks the four triangles really do tile the box.
 * Data: { perimeter, diagonal, unit?, corners? }.
 */
export function RhombusDiagonalScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const perimeter = Math.max(1, num(data.perimeter, 52));
  const d1 = Math.max(1, num(data.diagonal, 24));
  const unit = data.unit != null ? String(data.unit) : "";
  const corners = String(data.corners ?? "A,B,C,D").split(",");

  const side = perimeter / 4;
  const p = d1 / 2; // half the given diagonal
  const qsq = side * side - p * p;
  const q = qsq > 0 ? Math.sqrt(qsq) : 0; // half the other diagonal
  const d2 = 2 * q;
  const areaFormula = (d1 * d2) / 2;
  const triArea = (p * q) / 2;
  const areaPieces = 4 * triArea; // four right triangles
  const boxArea = d1 * d2;

  const nice = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2));

  // ---- self-checks ----
  const realQ = qsq > 0;
  const routesAgree = Math.abs(areaPieces - areaFormula) < 1e-9;
  const halfBox = Math.abs(areaFormula - boxArea / 2) < 1e-9;
  const pyth = Math.abs(p * p + q * q - side * side) < 1e-9;
  const answerVal = parseChoice(String(problem.shortAnswer ?? ""));
  const answerOk = !Number.isFinite(answerVal) || Math.abs(answerVal - areaFormula) < 1e-9;

  // ---- price the wrong choices ----
  const slips = [
    { why: `used half of ${corners[0]}${corners[2]} with the whole of ${corners[1]}${corners[3]}`, value: (p * d2) / 2 },
    { why: `multiplied the diagonals without halving`, value: d1 * d2 },
    { why: `squared the half-diagonal`, value: p * p },
    { why: `treated it as a square on the side`, value: side * side },
    { why: `counted only one of the four triangles`, value: triArea },
    { why: `side × half-diagonal`, value: side * q },
  ];
  const wrong = (problem.choices ?? [])
    .map((c) => ({ label: String(c.label), value: parseChoice(String(c.text)) }))
    .filter((c) => Number.isFinite(c.value) && Math.abs(c.value - areaFormula) > 1e-9);
  const priced = wrong
    .map((c) => {
      const hit = slips.find((s) => Math.abs(s.value - c.value) < 1e-9);
      return hit ? { ...c, why: hit.why } : null;
    })
    .filter((c): c is { label: string; value: number; why: string } => c !== null);

  // ---- beats ----
  const last = totalSteps - 1;
  const isFinal = step >= last;
  const plan = totalSteps >= 4 ? [0, 1, 2] : totalSteps === 3 ? [0, 1] : [0];
  const beat = isFinal ? 3 : plan[Math.min(Math.max(step, 0), plan.length - 1)];

  // ---- geometry: drawn in the answer's own proportions ----
  const W = 340;
  const H = 300;
  const k = Math.min(250 / d1, 130 / Math.max(d2, 1));
  const P = p * k;
  const Q = q * k;
  const cx = W / 2;
  const cy = 108;
  // A left, B top, C right, D bottom — the contest figure's lettering
  const V = {
    A: { x: cx - P, y: cy },
    B: { x: cx, y: cy - Q },
    C: { x: cx + P, y: cy },
    D: { x: cx, y: cy + Q },
  };
  const rhombus = `${V.A.x},${V.A.y} ${V.B.x},${V.B.y} ${V.C.x},${V.C.y} ${V.D.x},${V.D.y}`;
  // shoelace on the drawn polygon, converted back to real units
  const pts = [V.A, V.B, V.C, V.D];
  const shoelace =
    Math.abs(
      pts.reduce((a, v, i) => {
        const w = pts[(i + 1) % pts.length];
        return a + v.x * w.y - w.x * v.y;
      }, 0)
    ) / 2;
  const drawnOk = Math.abs(shoelace / (k * k) - areaFormula) < 1e-6;

  // the four inside triangles, each with the corner it folds onto
  const quads = [
    { a: V.A, b: V.B, sx: -1, sy: -1 },
    { a: V.B, b: V.C, sx: 1, sy: -1 },
    { a: V.C, b: V.D, sx: 1, sy: 1 },
    { a: V.D, b: V.A, sx: -1, sy: 1 },
  ];

  const caption =
    beat === 0
      ? `${perimeter} ÷ 4 = ${nice(side)} per side`
      : beat === 1
      ? `${nice(side)}² − ${nice(p)}² = ${nice(qsq)}, so the other half is ${nice(q)}`
      : beat === 2
      ? `the diagonals span a ${nice(d1)} × ${nice(d2)} box`
      : `four triangles in, four triangles out`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* the bounding box the diagonals span (beats 2-3) */}
        {beat >= 2 && (
          <motion.rect
            x={cx - P}
            y={cy - Q}
            width={2 * P}
            height={2 * Q}
            fill="none"
            stroke={INK}
            strokeWidth={1.8}
            strokeDasharray={beat === 2 ? "5 4" : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          />
        )}

        {/* the rhombus itself */}
        <motion.polygon
          points={rhombus}
          fill={beat >= 3 ? "none" : FILL}
          stroke={INK}
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 18 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />

        {/* vertex labels */}
        {(["A", "B", "C", "D"] as const).map((key, i) => {
          const v = V[key];
          const off =
            key === "A" ? { x: -14, y: 4 } : key === "C" ? { x: 14, y: 4 } : key === "B" ? { x: 0, y: -10 } : { x: 0, y: 16 };
          return (
            <text
              key={key}
              x={v.x + off.x}
              y={v.y + off.y}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill={INK}
              fontFamily="Georgia, serif"
            >
              {corners[i]}
            </text>
          );
        })}

        {/* ---- beat 0: four equal sides from the perimeter ---- */}
        {beat === 0 && (
          <g>
            {quads.map((t, i) => {
              const mx = (t.a.x + t.b.x) / 2;
              const my = (t.a.y + t.b.y) / 2;
              const ox = (mx - cx) * 0.28;
              const oy = (my - cy) * 0.55;
              return (
                <motion.g
                  key={`sd${i}`}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.5 + i * 0.14 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <rect x={mx + ox - 15} y={my + oy - 9} width={30} height={17} rx={8} fill="#fff" stroke={SIDE} strokeWidth={1.4} />
                  <text x={mx + ox} y={my + oy + 3.5} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={SIDE} fontFamily={numberFont}>
                    {nice(side)}
                  </text>
                </motion.g>
              );
            })}
            <motion.text
              x={W / 2}
              y={cy + Q + 52}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={DIM}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              a rhombus has four equal sides
            </motion.text>
            <motion.text
              x={W / 2}
              y={cy + Q + 78}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 1.4 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {`perimeter ${nice(perimeter)} ⇒ side ${nice(side)}`}
            </motion.text>
          </g>
        )}

        {/* ---- beat 1: the right triangle that gives the other half-diagonal ---- */}
        {beat === 1 && (
          <g>
            {/* both diagonals, drawing themselves in */}
            <motion.path
              d={`M ${V.A.x},${V.A.y} L ${V.C.x},${V.C.y}`}
              stroke={LONG}
              strokeWidth={2}
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <motion.path
              d={`M ${V.B.x},${V.B.y} L ${V.D.x},${V.D.y}`}
              stroke={SHORT}
              strokeWidth={2}
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
            {/* the right angle where they cross */}
            <motion.path
              d={`M ${cx + 9},${cy} L ${cx + 9},${cy - 9} L ${cx},${cy - 9}`}
              fill="none"
              stroke={INK}
              strokeWidth={1.4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            />
            {/* one of the four right triangles, lit */}
            <motion.polygon
              points={`${cx},${cy} ${V.A.x},${V.A.y} ${V.B.x},${V.B.y}`}
              fill="#ede9fe"
              stroke={IND}
              strokeWidth={1.8}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05 }}
            />
            {/* its three sides measured */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.25 }}>
              <text x={cx - P / 2} y={cy + 14} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={LONG} fontFamily={numberFont}>
                {nice(p)}
              </text>
              <text x={cx - 8} y={cy - Q / 2 + 4} textAnchor="end" fontSize="10.5" fontWeight="800" fill={SHORT} fontFamily={numberFont}>
                ?
              </text>
              <text
                x={(V.A.x + V.B.x) / 2 - 12}
                y={(V.A.y + V.B.y) / 2 - 4}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="800"
                fill={SIDE}
                fontFamily={numberFont}
              >
                {nice(side)}
              </text>
            </motion.g>
            <motion.text
              x={W / 2}
              y={cy + Q + 46}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={DIM}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.45 }}
            >
              they cut each other in half, at right angles
            </motion.text>
            <motion.text
              x={W / 2}
              y={cy + Q + 70}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              {`${nice(side)}² − ${nice(p)}² = ${nice(side * side)} − ${nice(p * p)} = ${nice(qsq)}`}
            </motion.text>
            <motion.text
              x={W / 2}
              y={cy + Q + 94}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 1.8 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {`the ${nice(q)}-${nice(p)}-${nice(side)} right triangle`}
            </motion.text>
          </g>
        )}

        {/* ---- beat 2: both diagonals measured, the box they span ---- */}
        {beat === 2 && (
          <g>
            <path d={`M ${V.A.x},${V.A.y} L ${V.C.x},${V.C.y}`} stroke={LONG} strokeWidth={2} />
            <path d={`M ${V.B.x},${V.B.y} L ${V.D.x},${V.D.y}`} stroke={SHORT} strokeWidth={2} />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <path d={`M ${cx - P},${cy + Q + 26} L ${cx + P},${cy + Q + 26}`} stroke={LONG} strokeWidth={2} />
              <text x={cx} y={cy + Q + 40} textAnchor="middle" fontSize="11" fontWeight="800" fill={LONG} fontFamily={numberFont}>
                {nice(d1)}
              </text>
            </motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <path d={`M ${cx - P - 26},${cy - Q} L ${cx - P - 26},${cy + Q}`} stroke={SHORT} strokeWidth={2} />
              <text x={cx - P - 30} y={cy - Q - 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={SHORT} fontFamily={numberFont}>
                {nice(d2)}
              </text>
            </motion.g>
            <motion.text
              x={W / 2}
              y={cy + Q + 62}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={DIM}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {`${nice(q)} above the centre and ${nice(q)} below ⇒ ${nice(d2)}`}
            </motion.text>
            <motion.text
              x={W / 2}
              y={cy + Q + 86}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 1.2 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {`the box around it is ${nice(d1)} × ${nice(d2)}`}
            </motion.text>
          </g>
        )}

        {/* ---- beat 3: the four triangles spin out and fill the box ---- */}
        {beat === 3 && (
          <g>
            {/* each triangle turns 180° about the midpoint of its rhombus edge —
                which for these triangles is exactly its own bounding-box centre,
                so Motion's own-centre pivot lands it on the corner unaided */}
            {quads.map((t, i) => (
              <motion.polygon
                key={`tri${i}`}
                points={`${cx},${cy} ${t.a.x},${t.a.y} ${t.b.x},${t.b.y}`}
                fill={i % 2 === 0 ? "#ccfbf1" : "#ede9fe"}
                stroke={i % 2 === 0 ? SIDE : IND}
                strokeWidth={1.4}
                initial={{ rotate: 0 }}
                animate={{ rotate: 180 }}
                transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.5 + i * 0.22 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            ))}
            {/* a ghost of where the rhombus was */}
            <polygon points={rhombus} fill="none" stroke={DIM} strokeWidth={1.2} strokeDasharray="4 3" />

            <motion.text
              x={W / 2}
              y={cy + Q + 34}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={DIM}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              the same four triangles fill the four corners
            </motion.text>
            <motion.text
              x={W / 2}
              y={cy + Q + 58}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.65 }}
            >
              so the rhombus is exactly half the box
            </motion.text>
            <motion.g
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 14, delay: 1.85 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect x={W / 2 - 96} y={cy + Q + 68} width={192} height={30} rx={15} fill={WIN} />
              <text x={W / 2} y={cy + Q + 88} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                {`${nice(d1)} × ${nice(d2)} ÷ 2 = ${nice(areaFormula)}`}
              </text>
            </motion.g>
          </g>
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
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
        {isFinal && (
          <motion.span
            key="notes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", lineHeight: 1.55 }}
          >
            {!realQ ? (
              `check failed: side ${nice(side)} is too short for a half-diagonal of ${nice(p)}`
            ) : !pyth ? (
              `check failed: ${nice(p)}² + ${nice(q)}² does not equal ${nice(side)}²`
            ) : !routesAgree ? (
              `check failed: four triangles give ${nice(areaPieces)}, the formula ${nice(areaFormula)}`
            ) : !halfBox ? (
              `check failed: the rhombus is not half of the ${nice(boxArea)} box`
            ) : !drawnOk ? (
              `check failed: the drawn figure measures ${nice(shoelace / (k * k))}`
            ) : !answerOk ? (
              `check failed: computed ${nice(areaFormula)}, stored ${nice(answerVal)}`
            ) : (
              <>
                {`four triangles of ${nice(p)} × ${nice(q)} ÷ 2 also give ${nice(areaPieces)}${unit ? ` sq ${unit}` : ""}`}
                {priced.map((c) => (
                  <span key={c.label}>
                    <br />
                    {`${c.label} ${nice(c.value)}: ${c.why}`}
                  </span>
                ))}
              </>
            )}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
