import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const WIN = "#16a34a";
const LEG_COLORS = ["#4338ca", "#0d9488", "#b45309", "#be123c", "#7c3aed", "#0369a1"];

interface Stop {
  label: string;
  x: number;
  y: number;
}

function readStops(value: unknown): Stop[] {
  if (!Array.isArray(value)) return [];
  return value.map((s, i) => {
    const o = (s ?? {}) as Record<string, unknown>;
    return {
      label: o.label != null ? String(o.label) : String(i + 1),
      x: num(o.x, 0),
      y: num(o.y, 0),
    };
  });
}

/** A delivery truck, drawn facing the direction of travel. */
function Truck({ flip }: { flip: boolean }) {
  return (
    <g transform={flip ? "scale(-1,1)" : undefined}>
      <rect x={-11} y={-9} width={14} height={10} rx={1.5} fill="#e0e7ff" stroke={INK} strokeWidth={1.2} />
      <path d="M 3,-9 L 9,-9 L 11,-4 L 11,1 L 3,1 Z" fill="#c7d2fe" stroke={INK} strokeWidth={1.2} />
      <circle cx={-6} cy={2} r={2.6} fill={INK} />
      <circle cx={6} cy={2} r={2.6} fill={INK} />
    </g>
  );
}

/**
 * Shortest route on a street grid through waypoints in order. Because streets
 * run only north-south and east-west, every shortest leg costs |Δx| + |Δy|
 * blocks no matter which staircase you take — so the answer is just the sum of
 * the legs' Manhattan distances, all computed here from the stop coordinates.
 * A truck drives one leg per step, drawing its path as it goes.
 * Data: { cols, rows, stops:[{label,x,y},...], closed?, unit? }.
 */
export function GridRouteScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const cols = Math.max(1, Math.round(num(data.cols, 8)));
  const rows = Math.max(1, Math.round(num(data.rows, 6)));
  const unit = data.unit != null ? String(data.unit) : "blocks";
  const stops = readStops(data.stops);
  const closed = data.closed !== false;

  // route: the stops in order, returning to the first when the round trip closes
  const route: Stop[] = stops.length > 0 && closed ? [...stops, stops[0]] : stops;
  const legs = route.slice(0, -1).map((a, i) => {
    const b = route[i + 1];
    const dx = Math.abs(b.x - a.x);
    const dy = Math.abs(b.y - a.y);
    return { a, b, dx, dy, d: dx + dy, color: LEG_COLORS[i % LEG_COLORS.length] };
  });
  const total = legs.reduce((s, l) => s + l.d, 0);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  // one leg per step after the map is set up; the last step always shows them all
  const shown = isFinal ? legs.length : Math.min(legs.length, Math.max(0, step));
  const runningTotal = legs.slice(0, shown).reduce((s, l) => s + l.d, 0);

  // ---- geometry ----
  const cell = 38;
  const mx = 26;
  const my = 24;
  const W = mx * 2 + cols * cell;
  const H = my * 2 + rows * cell;
  const X = (gx: number) => mx + gx * cell;
  const Y = (gy: number) => my + (rows - gy) * cell;

  // truck sits at the end of the last completed leg
  const at = route[Math.min(shown, route.length - 1)] ?? route[0];
  const prev = shown > 0 ? route[shown - 1] : null;
  const facingLeft = prev ? at.x < prev.x : false;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 430 }}>
        {/* streets */}
        {Array.from({ length: rows + 1 }).map((_, r) => (
          <line key={`h${r}`} x1={X(0)} y1={my + r * cell} x2={X(cols)} y2={my + r * cell} stroke="#cbd5e1" strokeWidth={1.2} />
        ))}
        {Array.from({ length: cols + 1 }).map((_, c) => (
          <line key={`v${c}`} x1={mx + c * cell} y1={Y(rows)} x2={mx + c * cell} y2={Y(0)} stroke="#cbd5e1" strokeWidth={1.2} />
        ))}

        {/* driven legs */}
        {legs.slice(0, shown).map((l, i) => (
          <g key={`leg${i}`}>
            <motion.path
              d={`M ${X(l.a.x)},${Y(l.a.y)} L ${X(l.b.x)},${Y(l.a.y)} L ${X(l.b.x)},${Y(l.b.y)}`}
              fill="none"
              stroke={l.color}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            />
            {/* leg length, on the longer run so it clears the corner */}
            <motion.text
              x={l.dx >= l.dy ? (X(l.a.x) + X(l.b.x)) / 2 : X(l.b.x) + 12}
              y={l.dx >= l.dy ? Y(l.a.y) - 7 : (Y(l.a.y) + Y(l.b.y)) / 2}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={l.color}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.15 }}
            >
              {l.d}
            </motion.text>
          </g>
        ))}

        {/* stops */}
        {stops.map((s, i) => (
          <g key={`s${i}`}>
            <circle cx={X(s.x)} cy={Y(s.y)} r={12} fill="#fff" stroke={INK} strokeWidth={1.6} />
            <text x={X(s.x)} y={Y(s.y) + 4.5} textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {s.label}
            </text>
          </g>
        ))}

        {/* the truck, parked at the latest stop reached */}
        <motion.g
          animate={{ x: X(at.x), y: Y(at.y) - 20 }}
          transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.35 }}
        >
          <Truck flip={facingLeft} />
        </motion.g>
      </svg>

      {/* per-leg arithmetic */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
        {legs.slice(0, shown).map((l, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 15, delay: i * 0.1 }}
            style={{
              fontFamily: numberFont,
              fontSize: 12,
              fontWeight: 800,
              color: l.color,
              background: "#f8fafc",
              border: `1px solid ${l.color}`,
              padding: "3px 9px",
              borderRadius: 999,
            }}
          >
            {l.a.label}→{l.b.label}: {l.dx}+{l.dy}={l.d}
          </motion.span>
        ))}
      </div>

      <AnimatePresence>
        {shown > 0 && (
          <motion.div
            key="run"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: numberFont, fontSize: 16, fontWeight: 800, color: INK }}
          >
            {legs.slice(0, shown).map((l) => l.d).join(" + ")} ={" "}
            <span style={{ color: isFinal ? WIN : "#4338ca" }}>{runningTotal}</span> {unit}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
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
