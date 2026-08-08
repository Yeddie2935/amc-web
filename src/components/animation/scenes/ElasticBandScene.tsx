import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

interface V {
  x: number;
  y: number;
}
const sub = (a: V, b: V): V => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: V, b: V): V => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: V, k: number): V => ({ x: a.x * k, y: a.y * k });
const len = (a: V): number => Math.hypot(a.x, a.y);
const norm = (a: V): V => mul(a, 1 / (len(a) || 1));
const dot = (a: V, b: V): number => a.x * b.x + a.y * b.y;

function readPts(value: unknown): V[] {
  return Array.isArray(value)
    ? value
        .filter((p) => Array.isArray(p) && p.length >= 2)
        .map((p) => ({ x: num((p as number[])[0], 0), y: num((p as number[])[1], 0) }))
    : [];
}

// An elastic band wrapped tightly around a cluster of equal circles. The band is
// straight tangent segments between the outer centers (each segment = the
// center-to-center distance) plus arcs hugging the outer coins; going once
// around, the arcs turn a full 360°, so they sum to one circle's circumference
// (2πr). Straight total and curved total are computed from the geometry.
// Data: { radius, unit?, coins:[[x,y],...], hull:[i,j,...] (outer centers in
// travel order) }.
export function ElasticBandScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const r = num(data.radius, 2);
  const unit = data.unit != null ? String(data.unit) : "cm";
  const coins = readPts(data.coins);
  const hullIdx = Array.isArray(data.hull) ? data.hull.map((i) => num(i, 0)) : coins.map((_, i) => i);
  const hull = hullIdx.map((i) => coins[i]).filter(Boolean);
  const nH = hull.length;

  // ---- geometry in cm ----
  const centroid = mul(hull.reduce((a, p) => add(a, p), { x: 0, y: 0 }), 1 / (nH || 1));
  // outward unit normal of each edge V[i] -> V[i+1]
  const edgeNormal: V[] = hull.map((A, i) => {
    const B = hull[(i + 1) % nH];
    const d = norm(sub(B, A));
    const n1: V = { x: -d.y, y: d.x };
    const mid = mul(add(A, B), 0.5);
    return dot(n1, sub(mid, centroid)) > 0 ? n1 : mul(n1, -1);
  });
  const edgeLen = hull.map((A, i) => len(sub(hull[(i + 1) % nH], A)));
  const straightTotal = edgeLen.reduce((a, b) => a + b, 0);

  // per-vertex band tangent points + sampled arc
  const vert = hull.map((Vp, i) => {
    const nIn = edgeNormal[(i - 1 + nH) % nH];
    const nOut = edgeNormal[i];
    const pIn = add(Vp, mul(nIn, r));
    const pOut = add(Vp, mul(nOut, r));
    let a1 = Math.atan2(pIn.y - Vp.y, pIn.x - Vp.x);
    let a2 = Math.atan2(pOut.y - Vp.y, pOut.x - Vp.x);
    let delta = a2 - a1;
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta <= -Math.PI) delta += 2 * Math.PI;
    const N = 12;
    const arc: V[] = Array.from({ length: N + 1 }, (_, k) => {
      const a = a1 + (delta * k) / N;
      return { x: Vp.x + r * Math.cos(a), y: Vp.y + r * Math.sin(a) };
    });
    return { pIn, pOut, arc };
  });

  // ---- screen mapping ----
  const s = 23;
  const xs = coins.map((c) => c.x);
  const ys = coins.map((c) => c.y);
  const minX = Math.min(...xs) - r;
  const maxY = Math.max(...ys) + r;
  const P = (p: V): V => ({ x: 34 + (p.x - minX) * s, y: 40 + (maxY - p.y) * s });
  const rPx = r * s;
  const vwW = 34 + (Math.max(...xs) + r - minX) * s + 24;
  const vwH = 40 + (maxY - (Math.min(...ys) - r)) * s + 12;

  const bandPts = vert.flatMap((v) => v.arc.map(P));
  const bandPath = bandPts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const last = totalSteps - 1;
  const showStraight = step >= 1;
  const showCurved = step >= last;
  const answer = problem.answer ?? null;
  const curvedText = `2π·${r} = ${2 * r}π`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${vwW.toFixed(0)} ${vwH.toFixed(0)}`} width="100%" style={{ maxWidth: 380 }}>
        {/* coins */}
        {coins.map((c, i) => {
          const sc = P(c);
          return <circle key={i} cx={sc.x} cy={sc.y} r={rPx} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5" />;
        })}

        {/* center polygon (revealed with the straight step) */}
        <AnimatePresence>
          {showStraight && (
            <motion.polygon
              key="poly"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              points={hull.map((v) => { const p = P(v); return `${p.x},${p.y}`; }).join(" ")}
              fill="none"
              stroke="#4338ca"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />
          )}
        </AnimatePresence>

        {/* base band */}
        <motion.polyline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          points={bandPath}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* straight highlights + edge labels */}
        {showStraight &&
          vert.map((v, i) => {
            const a = P(v.pOut);
            const b = P(vert[(i + 1) % nH].pIn);
            const midV = mul(add(hull[i], hull[(i + 1) % nH]), 0.5);
            const mp = P(add(midV, mul(edgeNormal[i], -0.5)));
            return (
              <g key={i}>
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 20, delay: i * 0.12 }}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke="#4338ca" strokeWidth="6" strokeLinecap="round"
                />
                <text x={mp.x} y={mp.y} textAnchor="middle" fontSize="12" fontWeight="800" fill="#4338ca" fontFamily={numberFont}>
                  {Number(edgeLen[i].toFixed(2))}
                </text>
              </g>
            );
          })}

        {/* arc highlights */}
        {showCurved &&
          vert.map((v, i) => (
            <motion.polyline
              key={`arc${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.12 }}
              points={v.arc.map(P).map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}
              fill="none"
              stroke="#ea580c"
              strokeWidth="6"
              strokeLinecap="round"
            />
          ))}
      </svg>

      {/* captions per step */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        {showStraight && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 15 }}
            style={{ fontFamily: numberFont, fontSize: 13, fontWeight: 800, color: "#4338ca", background: "#eef2ff", border: "1px solid #c7d2fe", padding: "4px 12px", borderRadius: 999 }}
          >
            straight = {edgeLen.map((e) => Number(e.toFixed(2))).join(" + ")} = {Number(straightTotal.toFixed(2))} {unit}
          </motion.span>
        )}
        {showCurved && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.2 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: numberFont, fontSize: 13, fontWeight: 800, color: "#ea580c", background: "#fff7ed", border: "1px solid #fed7aa", padding: "4px 12px", borderRadius: 999 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="#ea580c" strokeWidth="2.5" /></svg>
            arcs → 1 full circle = {curvedText}
          </motion.span>
        )}
      </div>

      <AnimatePresence>
        {showCurved && (
          <motion.div
            key="total"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontFamily: numberFont, fontSize: 18, fontWeight: 800, color: "#1f2a44" }}
          >
            band = <span style={{ color: "#ea580c" }}>{2 * r}π</span> + <span style={{ color: "#4338ca" }}>{Number(straightTotal.toFixed(2))}</span> {unit}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCurved && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
