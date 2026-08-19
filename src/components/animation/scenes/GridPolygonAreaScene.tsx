import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WHOLE = "#a5b4fc";
const HALF = "#5eead4";
const SOLID = "#c8c8c8";

type P = [number, number];

const shoelace = (pts: P[]) => {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
};

/** Sutherland–Hodgman clip of a polygon against one unit cell. */
function clipCell(sub: P[], cx: number, cy: number): P[] {
  const planes: [number, number, number][] = [
    [1, 0, -cx],
    [-1, 0, cx + 1],
    [0, 1, -cy],
    [0, -1, cy + 1],
  ];
  let poly = sub;
  for (const [a, b, c] of planes) {
    const out: P[] = [];
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i];
      const q = poly[(i + 1) % poly.length];
      const fp = a * p[0] + b * p[1] + c;
      const fq = a * q[0] + b * q[1] + c;
      if (fp >= -1e-12) out.push(p);
      if (fp > 1e-12 !== fq > 1e-12 && Math.abs(fp - fq) > 1e-12) {
        const t = fp / (fp - fq);
        out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
      }
    }
    poly = out;
    if (!poly.length) return [];
  }
  // drop repeated points the clip leaves behind
  const clean: P[] = [];
  for (const p of poly) {
    const prev = clean[clean.length - 1];
    if (!prev || Math.abs(prev[0] - p[0]) > 1e-9 || Math.abs(prev[1] - p[1]) > 1e-9) clean.push(p);
  }
  if (clean.length > 1) {
    const a = clean[0];
    const b = clean[clean.length - 1];
    if (Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9) clean.pop();
  }
  return clean;
}

const COMPLEMENT: Record<string, string> = { BL: "TR", TR: "BL", BR: "TL", TL: "BR" };

/**
 * A figure outlined on ruled grid paper, asking for its **area**. The scene is
 * handed only the outline's lattice vertices and **discovers the decomposition
 * itself**, clipping the polygon against every unit cell: the cells it fills
 * whole, and the cells it cuts exactly in half along a diagonal. Nothing is
 * asserted — if some cell came out a quarter or three-quarters full the scene
 * says so rather than quietly rounding. The payoff beat is that half-cells come
 * in **complementary corners**, so a triangle with its right angle at the
 * bottom-right and one with its right angle at the top-left tile a cell exactly
 * by *translation alone* — no flipping — and the scene pairs them up and slides
 * each pair into an empty cell, where they land as whole squares that can simply
 * be counted. Landing cells are taken from empty rows scanning up from the
 * bottom, so the assembled squares line up in a countable row rather than
 * scattering. The total is cross-checked against the **shoelace area of the
 * outline**, an entirely independent route, so the picture and the arithmetic
 * cannot disagree; data `{ grid, outline: [[x,y], ...], unit? }` with the
 * outline in grid coordinates, y increasing downward.
 */
export function GridPolygonAreaScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const G = Math.max(2, Math.min(12, Math.round(num(data.grid, 6))));
  const outline: P[] = (Array.isArray(data.outline) ? data.outline : [])
    .filter((p) => Array.isArray(p) && (p as unknown[]).length >= 2)
    .map((p) => [num((p as unknown[])[0], 0), num((p as unknown[])[1], 0)] as P);
  const unit = typeof data.unit === "string" ? data.unit : "square inches";

  const exact = shoelace(outline);

  // ---- decompose: clip the outline against every cell ----
  const wholes: P[] = [];
  const halves: { cell: P; pts: P[]; type: string }[] = [];
  const odd: { cell: P; area: number }[] = [];
  for (let cy = 0; cy < G; cy++) {
    for (let cx = 0; cx < G; cx++) {
      const piece = clipCell(outline, cx, cy);
      if (piece.length < 3) continue;
      const a = shoelace(piece);
      if (Math.abs(a - 1) < 1e-9) wholes.push([cx, cy]);
      else if (Math.abs(a - 0.5) < 1e-9 && piece.length === 3) {
        // the right-angle corner: the vertex sharing an x with one other and a y with the third
        const ra =
          piece.find((v) =>
            piece.some((o) => o !== v && Math.abs(o[0] - v[0]) < 1e-9) &&
            piece.some((o) => o !== v && Math.abs(o[1] - v[1]) < 1e-9),
          ) ?? piece[0];
        const type = `${Math.abs(ra[1] - cy) < 1e-9 ? "T" : "B"}${Math.abs(ra[0] - cx) < 1e-9 ? "L" : "R"}`;
        halves.push({ cell: [cx, cy], pts: piece, type });
      } else if (a > 1e-9) odd.push({ cell: [cx, cy], area: a });
    }
  }

  // ---- empty cells, scanned from the bottom row up so pairs land in a tidy row ----
  const taken = new Set<string>();
  wholes.forEach(([x, y]) => taken.add(`${x},${y}`));
  halves.forEach((h) => taken.add(`${h.cell[0]},${h.cell[1]}`));
  const empties: P[] = [];
  for (let y = G - 1; y >= 0; y--) for (let x = 0; x < G; x++) if (!taken.has(`${x},${y}`)) empties.push([x, y]);

  // ---- pair complementary halves; each pair translates into one empty cell ----
  const landing = new Map<number, P>();
  const used = new Set<number>();
  let slot = 0;
  halves.forEach((h, i) => {
    if (used.has(i)) return;
    const j = halves.findIndex((o, k) => !used.has(k) && k !== i && o.type === COMPLEMENT[h.type]);
    if (j < 0 || slot >= empties.length) return;
    const cell = empties[slot++];
    used.add(i);
    used.add(j);
    landing.set(i, cell);
    landing.set(j, cell);
  });
  const madeSquares = landing.size / 2;
  const total = wholes.length + halves.length / 2;

  const answerOk = problem.shortAnswer == null || String(total) === String(problem.shortAnswer).trim();
  const ok =
    outline.length >= 3 &&
    odd.length === 0 &&
    Math.abs(total - exact) < 1e-9 &&
    landing.size === halves.length &&
    answerOk;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 264;

  // ---- geometry: grid on the left, running tally on the right ----
  const cell = 38;
  const gx = 18;
  const gy = 16;
  const X = (v: number) => gx + v * cell;
  const Y = (v: number) => gy + v * cell;
  const pts = (poly: P[]) => poly.map(([x, y]) => `${X(x)},${Y(y)}`).join(" ");
  const px = 274;

  const Row = ({ y, label, value, color, delay }: { y: number; label: string; value: string; color: string; delay: number }) => (
    <motion.g initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay }}>
      <text x={px} y={y} fontSize="11" fontWeight="700" fill={INK} fontFamily={numberFont}>
        {label}
      </text>
      <text x={W - 14} y={y} textAnchor="end" fontSize="13" fontWeight="800" fill={color} fontFamily={numberFont}>
        {value}
      </text>
    </motion.g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* landing pads for the assembled squares */}
        {phase === 3 &&
          empties.slice(0, madeSquares).map(([x, y], i) => (
            <motion.rect
              key={`pad${i}`}
              x={X(x)}
              y={Y(y)}
              width={cell}
              height={cell}
              fill="#dcfce7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            />
          ))}

        {/* the whole cells */}
        {wholes.map(([x, y], i) => (
          <motion.rect
            key={`w${i}`}
            x={X(x)}
            y={Y(y)}
            width={cell}
            height={cell}
            fill={phase >= 1 ? WHOLE : SOLID}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: phase === 1 ? 0.3 + i * 0.18 : 0.3 }}
          />
        ))}

        {/* the half cells — they translate into the landing cells on the last beat */}
        {halves.map((h, i) => {
          const tgt = landing.get(i);
          const dx = phase === 3 && tgt ? (tgt[0] - h.cell[0]) * cell : 0;
          const dy = phase === 3 && tgt ? (tgt[1] - h.cell[1]) * cell : 0;
          return (
            <motion.g
              key={`h${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: dx, y: dy }}
              transition={{
                opacity: { duration: 0.3, delay: phase === 2 ? 0.3 + i * 0.1 : 0.3 },
                default: { type: "spring", stiffness: 80, damping: 17, delay: 0.35 + i * 0.07 },
              }}
            >
              <polygon points={pts(h.pts)} fill={phase >= 2 ? HALF : SOLID} stroke={phase >= 2 ? "#0f766e" : "none"} strokeWidth={1} />
            </motion.g>
          );
        })}

        {/* the outline, drawing itself on the opening beat */}
        <motion.polygon
          points={pts(outline)}
          fill="none"
          stroke={INK}
          strokeWidth={2.2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, opacity: phase === 3 ? 0.3 : 1 }}
          transition={{ duration: phase === 0 ? 1.1 : 0.3 }}
        />

        {/* grid lines on top */}
        {Array.from({ length: G + 1 }, (_, i) => (
          <g key={`g${i}`}>
            <line x1={X(0)} y1={Y(i)} x2={X(G)} y2={Y(i)} stroke="#94a3b8" strokeWidth={0.9} />
            <line x1={X(i)} y1={Y(0)} x2={X(i)} y2={Y(G)} stroke="#94a3b8" strokeWidth={0.9} />
          </g>
        ))}

        {/* counters drawn over the pieces */}
        {phase === 1 &&
          wholes.map(([x, y], i) => (
            <motion.text
              key={`wn${i}`}
              x={X(x) + cell / 2}
              y={Y(y) + cell / 2 + 5}
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 15, delay: 0.4 + i * 0.18 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {i + 1}
            </motion.text>
          ))}
        {phase === 2 &&
          halves.map((h, i) => {
            const c: P = [
              h.pts.reduce((s, p) => s + p[0], 0) / h.pts.length,
              h.pts.reduce((s, p) => s + p[1], 0) / h.pts.length,
            ];
            return (
              <motion.text
                key={`hn${i}`}
                x={X(c[0])}
                y={Y(c[1]) + 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="800"
                fill="#0f766e"
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 15, delay: 0.4 + i * 0.1 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                ½
              </motion.text>
            );
          })}

        {/* ---- the running tally ---- */}
        <text x={px} y={30} fontSize="11.5" fontWeight="800" fill={INK}>
          {phase === 0
            ? "every corner sits on a grid line"
            : phase === 1
            ? "cells filled completely"
            : phase === 2
            ? "cells cut in half"
            : "each pair makes one square"}
        </text>

        {phase === 0 && (
          <motion.text x={px} y={56} fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            so every cell it touches is
          </motion.text>
        )}
        {phase === 0 && (
          <motion.text x={px} y={72} fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
            either whole or exactly half
          </motion.text>
        )}

        {phase >= 1 && <Row y={58} label="whole cells" value={`${wholes.length}`} color={IND} delay={0.4} />}
        {phase >= 2 && <Row y={82} label="half cells" value={`${halves.length}`} color="#0f766e" delay={0.4} />}
        {phase >= 3 && <Row y={106} label={`${halves.length} halves make`} value={`${madeSquares}`} color={WIN} delay={1.4} />}

        {phase === 2 && (
          <motion.text x={px} y={110} fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
            {halves.length} × ½ = {halves.length / 2}
          </motion.text>
        )}

        {phase === 3 && (
          <g>
            <motion.line
              x1={px}
              y1={118}
              x2={W - 14}
              y2={118}
              stroke={INK}
              strokeWidth={1.3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 1.7 }}
            />
            <motion.text
              x={px}
              y={142}
              fontSize="16"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9 }}
            >
              {wholes.length} + {madeSquares} = {total}
            </motion.text>
            <motion.text x={px} y={162} fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
              {unit}
            </motion.text>
            <motion.text x={px} y={190} fontSize="9.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }}>
              the outline's own area
            </motion.text>
            <motion.text x={px} y={204} fontSize="9.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.35 }}>
              agrees: {exact}
            </motion.text>
          </g>
        )}
      </svg>

      <motion.span
        key={phase}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: phase === 3 ? "#166534" : "#4338ca",
          background: phase === 3 ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${phase === 3 ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {phase === 0
          ? `the logo cuts only whole cells and half cells`
          : phase === 1
          ? `${wholes.length} cells are covered completely`
          : phase === 2
          ? `${halves.length} more are split along a diagonal`
          : `${wholes.length} + ${madeSquares} = ${total} ${unit}`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed: pieces give {total}, outline gives {exact}
          {odd.length ? `, ${odd.length} partial cells` : ""}
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
