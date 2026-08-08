import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

interface Pt {
  x: number;
  y: number;
}
const unit = (from: Pt, to: Pt): Pt => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const d = Math.hypot(dx, dy) || 1;
  return { x: dx / d, y: dy / d };
};
const along = (p: Pt, u: Pt, k: number): Pt => ({ x: p.x + u.x * k, y: p.y + u.y * k });
const poly = (pts: Pt[]) => pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
const mid = (a: Pt, b: Pt): Pt => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

// Geometry of an equilateral triangle (unit side L) with corner equilateral
// triangles of sizes [a,b,c] cut off, leaving an inscribed equiangular hexagon.
function geom(A: Pt, B: Pt, C: Pt, L: number, cuts: number[]) {
  const [a, b, c] = cuts;
  const s = Math.hypot(B.x - A.x, B.y - A.y) / L;
  const P1 = along(A, unit(A, B), a * s);
  const P2 = along(B, unit(B, A), b * s);
  const P3 = along(B, unit(B, C), b * s);
  const P4 = along(C, unit(C, B), c * s);
  const P5 = along(C, unit(C, A), c * s);
  const P6 = along(A, unit(A, C), a * s);
  return {
    hex: [P1, P2, P3, P4, P5, P6],
    cornerA: [A, P1, P6],
    cornerB: [B, P2, P3],
    cornerC: [C, P4, P5],
  };
}

// One equilateral triangle (side L) with corner cuts drawn and the hexagon
// filled. Used both for the big worked example and the small gallery tiles.
function HexTriangle({
  L,
  cuts,
  W,
  H,
  showLabels,
  animateCut,
}: {
  L: number;
  cuts: number[];
  W: number;
  H: number;
  showLabels?: boolean;
  animateCut?: boolean;
}) {
  const pad = 14;
  const side = W - pad * 2;
  const h = side * Math.sqrt(3) / 2;
  const A: Pt = { x: pad, y: pad + h };
  const B: Pt = { x: pad + side, y: pad + h };
  const C: Pt = { x: pad + side / 2, y: pad };
  const g = geom(A, B, C, L, cuts);
  const flats = [L - cuts[0] - cuts[1], L - cuts[1] - cuts[2], L - cuts[2] - cuts[0]];
  const corners = [g.cornerA, g.cornerB, g.cornerC];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }}>
      {/* full triangle outline */}
      <polygon points={poly([A, B, C])} fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* corner triangles (cut away) */}
      {corners.map((tri, i) => (
        <motion.polygon
          key={i}
          points={poly(tri)}
          fill="#fecaca"
          stroke="#f87171"
          strokeWidth="1"
          initial={animateCut ? { opacity: 1 } : { opacity: 0.55 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 0.5, delay: 0.4 + i * 0.25 }}
        />
      ))}
      {/* hexagon */}
      <motion.polygon
        points={poly(g.hex)}
        fill="#c7d2fe"
        stroke="#4338ca"
        strokeWidth="1.75"
        initial={animateCut ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: animateCut ? 1.2 : 0 }}
      />
      {showLabels && (
        <>
          {/* corner cut sizes */}
          {[
            { p: A, v: cuts[0] },
            { p: B, v: cuts[1] },
            { p: C, v: cuts[2] },
          ].map((d, i) => {
            const towardCentroid = unit(d.p, { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 });
            const lp = along(d.p, towardCentroid, 16);
            return (
              <text key={`c${i}`} x={lp.x} y={lp.y} textAnchor="middle" fontSize="11" fontWeight="800" fill="#b91c1c" fontFamily={numberFont}>
                {d.v}
              </text>
            );
          })}
          {/* flats: on AB (P1P2), BC (P3P4), CA (P5P6) */}
          {[
            { m: mid(g.hex[0], g.hex[1]), out: { x: 0, y: 1 } },
            { m: mid(g.hex[2], g.hex[3]), out: unit({ x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 }, mid(g.hex[2], g.hex[3])) },
            { m: mid(g.hex[4], g.hex[5]), out: unit({ x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 }, mid(g.hex[4], g.hex[5])) },
          ].map((d, i) => {
            const lp = along(d.m, d.out, 12);
            return (
              <text key={`f${i}`} x={lp.x} y={lp.y + 3} textAnchor="middle" fontSize="11" fontWeight="800" fill="#4338ca" fontFamily={numberFont}>
                {flats[i]}
              </text>
            );
          })}
        </>
      )}
    </svg>
  );
}

// Count equiangular hexagons with positive-integer sides inscribed in an
// equilateral triangle of side L: this is choosing corner-cut sizes a,b,c ≥ 1
// with every flat L−(two adjacent cuts) ≥ 1, i.e. every pair of cuts ≤ L−1,
// counted up to the triangle's rotation/reflection (unordered triples). The
// valid triples and the total are computed here. Data: { side, example? }.
export function CornerCutHexagonScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const L = num(data.side, 6);
  const example = Array.isArray(data.example) ? data.example.map((v) => num(v, 1)) : [1, 2, 2];

  // valid unordered triples (a ≤ b ≤ c), each pair ≤ L−1
  const triples: number[][] = [];
  for (let a = 1; a <= L; a++)
    for (let b = a; b <= L; b++)
      for (let c = b; c <= L; c++)
        if (a + b <= L - 1 && b + c <= L - 1 && a + c <= L - 1) triples.push([a, b, c]);
  const total = triples.length;

  const last = totalSteps - 1;
  const showRule = step >= 1;
  const showGallery = step >= last;
  const answer = problem.answer ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", padding: "8px 4px" }}>
      {!showGallery && (
        <>
          <HexTriangle L={L} cuts={example} W={220} H={200} showLabels animateCut={!showRule} />
          <div style={{ fontFamily: numberFont, fontSize: 13, fontWeight: 700, color: "#64748b", textAlign: "center" }}>
            side {L} triangle − corners ({example.join(", ")}) → hexagon
          </div>
          {showRule && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}
            >
              {["a", "b", "c"].map((_, i) => {
                const pair = [
                  ["a", "b"],
                  ["b", "c"],
                  ["c", "a"],
                ][i];
                return (
                  <span
                    key={i}
                    style={{ fontFamily: numberFont, fontSize: 13, fontWeight: 800, color: "#4338ca", background: "#eef2ff", border: "1px solid #c7d2fe", padding: "3px 10px", borderRadius: 999 }}
                  >
                    {pair[0]}+{pair[1]} ≤ {L - 1}
                  </span>
                );
              })}
            </motion.div>
          )}
        </>
      )}

      {showGallery && (
        <>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 0.4 }}>
            ALL CORNER TRIPLES (up to symmetry)
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, width: "100%", maxWidth: 420 }}>
            {triples.map((t, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 16, delay: i * 0.08 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: 4, borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <HexTriangle L={L} cuts={t} W={84} H={78} />
                <span style={{ fontFamily: numberFont, fontSize: 12, fontWeight: 800, color: "#1f2a44" }}>
                  {"{"}{t.join(",")}{"}"}
                </span>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {showGallery && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 + total * 0.08 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            {total} hexagons → Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
