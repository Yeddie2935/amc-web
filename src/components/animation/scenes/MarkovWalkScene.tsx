import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";

// ---- exact rational arithmetic (probabilities are dyadic here) ----
type R = [number, number];
function g(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}
function reduce([n, d]: R): R {
  if (d < 0) [n, d] = [-n, -d];
  const k = g(n, d);
  return [n / k, d / k];
}
function rAdd([a, b]: R, [c, d]: R): R {
  return reduce([a * d + c * b, b * d]);
}
function rMul([a, b]: R, [c, d]: R): R {
  return reduce([a * c, b * d]);
}
function parseR(s: unknown): R {
  const str = String(s).trim();
  if (str.includes("/")) {
    const [n, d] = str.split("/");
    return reduce([parseInt(n, 10), parseInt(d, 10)]);
  }
  return [num(str, 0), 1];
}
function rStr([n, d]: R): string {
  return d === 1 ? `${n}` : `${n}/${d}`;
}
function rNum([n, d]: R): number {
  return n / d;
}

interface Pt {
  x: number;
  y: number;
}
// Outer tips + inner crossing points of a regular pentagram.
function pentagram(cx: number, cy: number, R0: number): { outer: Pt[]; inner: Pt[]; lines: [number, number][] } {
  const r = R0 * 0.381966; // inner pentagon circumradius of a {5/2} star
  const pt = (deg: number, rad: number): Pt => {
    const a = (deg * Math.PI) / 180;
    return { x: cx + rad * Math.cos(a), y: cy - rad * Math.sin(a) };
  };
  const outer = [90, 162, 234, 306, 18].map((d) => pt(d, R0));
  const inner = [126, 198, 270, 342, 54].map((d) => pt(d, r));
  // the 5 straight lines connect outer tips two apart
  const lines: [number, number][] = [[0, 2], [1, 3], [2, 4], [3, 0], [4, 1]];
  return { outer, inner, lines };
}

// Probability of being in each state class after k random moves, tracked as a
// Markov chain and computed with exact fractions from the transition matrix —
// never hardcoded. The distribution index equals the step, so a 4-step timeline
// shows start → move 1 → move 2 → move 3. When shape==="pentagram" it also draws
// the star web with a spider, shading each class by its current probability.
// Data: { states:[...], transition:[["0","1"],["1/2","1/2"]], startIndex,
//         target, moves, shape? }.
export function MarkovWalkScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const states = Array.isArray(data.states) ? data.states.map((s) => String(s)) : ["A", "B"];
  const n = states.length;
  const T: R[][] = Array.isArray(data.transition)
    ? (data.transition as unknown[]).map((row) => (Array.isArray(row) ? row.map(parseR) : []))
    : [];
  const startIndex = num(data.startIndex, 0);
  const target = num(data.target, 0);
  const moves = num(data.moves, totalSteps - 1);
  const shape = data.shape != null ? String(data.shape) : "";

  // distribution after `distIndex` moves (distIndex === step)
  const distIndex = Math.min(step, moves);
  let dist: R[] = states.map((_, i) => (i === startIndex ? [1, 1] : [0, 1]));
  for (let s = 0; s < distIndex; s++) {
    const next: R[] = states.map(() => [0, 1] as R);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (T[i]?.[j]) next[j] = rAdd(next[j], rMul(dist[i], T[i][j]));
      }
    }
    dist = next;
  }

  const last = totalSteps - 1;
  const final = step >= last;
  const targetProb = dist[target];
  // The bars already show the target fraction, so the badge points to the letter.
  const answer = problem.answer ?? null;

  const STATE_COLORS = ["#4338ca", "#0d9488", "#f59e0b", "#db2777"];
  const heading = distIndex === 0 ? `Start — on ${states[startIndex]}` : `After move ${distIndex}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", padding: "8px 4px" }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#475569", letterSpacing: 0.3 }}>{heading}</div>

      {shape === "pentagram" && <StarWeb pO={rNum(dist[0])} pI={rNum(dist[1] ?? [0, 1])} />}

      {/* probability bars per class */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 360 }}>
        {states.map((name, i) => {
          const p = rNum(dist[i]);
          const isTarget = i === target;
          const color = isTarget && final ? "#16a34a" : STATE_COLORS[i % STATE_COLORS.length];
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr 46px", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1f2a44" }}>{name}</span>
              <div style={{ position: "relative", height: 18, background: "#f1f5f9", borderRadius: 9, overflow: "hidden" }}>
                <motion.div
                  animate={{ width: `${Math.max(0, p * 100)}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  style={{ position: "absolute", inset: 0, right: "auto", background: color, borderRadius: 9 }}
                />
              </div>
              <span style={{ fontFamily: numberFont, fontSize: 14, fontWeight: 800, color, textAlign: "right" }}>
                {rStr(dist[i])}
              </span>
            </div>
          );
        })}
      </div>

      {/* transition rule legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: 11.5, color: "#64748b", fontFamily: numberFont }}>
        {states.map((from, i) => {
          const outs = states
            .map((to, j) => (T[i]?.[j] && rNum(T[i][j]) > 0 ? `${to} (${rStr(T[i][j])})` : null))
            .filter(Boolean);
          return (
            <div key={i}>
              <b style={{ color: STATE_COLORS[i % STATE_COLORS.length] }}>{from}</b> → {outs.join(", ")}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {final && (
          <motion.div
            key="calc"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: numberFont, fontSize: 15, fontWeight: 800, color: "#1f2a44" }}
          >
            P({states[target]}) = <span style={{ color: "#16a34a" }}>{rStr(targetProb)}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {final && answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// The 5-pointed star web. Outer tips shaded by P(outer), inner points by
// P(inner); the spider sits at the starting tip.
function StarWeb({ pO, pI }: { pO: number; pI: number }) {
  const { outer, inner, lines } = pentagram(100, 98, 84);
  const shade = (base: string, p: number) => ({ fill: base, fillOpacity: 0.2 + 0.8 * Math.min(1, Math.max(0, p)) });
  return (
    <svg viewBox="0 0 200 196" width="100%" style={{ maxWidth: 260 }}>
      {lines.map(([a, b], i) => (
        <line key={i} x1={outer[a].x} y1={outer[a].y} x2={outer[b].x} y2={outer[b].y} stroke="#cbd5e1" strokeWidth="2" />
      ))}
      {inner.map((p, i) => (
        <circle key={`i${i}`} cx={p.x} cy={p.y} r="6" stroke="#0d9488" strokeWidth="1.5" {...shade("#0d9488", pI)} />
      ))}
      {outer.map((p, i) => (
        <motion.circle
          key={`o${i}`}
          cx={p.x}
          cy={p.y}
          r="7"
          stroke="#4338ca"
          strokeWidth="1.5"
          initial={false}
          animate={{ fillOpacity: 0.2 + 0.8 * Math.min(1, Math.max(0, pO)) }}
          fill="#4338ca"
        />
      ))}
      {/* spider at the starting outer tip (top) */}
      <text x={outer[0].x} y={outer[0].y - 11} textAnchor="middle" fontSize="18">🕷️</text>
    </svg>
  );
}
