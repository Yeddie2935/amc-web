import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const GRID = "#e8edf3";
const AXIS = "#94a3b8";
const MARK = "#4338ca";
const BASE = "#0d9488";
const HIGH = "#f59e0b";
const BOX = "#7c3aed";
const WIN = "#16a34a";
const BAD = "#dc2626";

const LINE_INK = ["#4338ca", "#0284c7", "#db2777"];

const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(3))));
const signed = (v: number) => (v < 0 ? `−${tidy(-v)}` : tidy(v));
/** Negatives need brackets when they follow an operator: 4 − (−4), not 4 − −4. */
const paren = (v: number) => (v < 0 ? `(${signed(v)})` : signed(v));

interface Pt {
  x: number;
  y: number;
}

/** Parse "slope|intercept|label" rows into lines y = m x + b. */
export function parseLines(raw: unknown): { m: number; b: number; label: string }[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((row) => {
    const [m, b, ...rest] = String(row).split("|");
    return { m: Number(m), b: Number(b), label: rest.join("|") };
  });
}

/**
 * The triangle cut out by three lines y = m x + b. The lines draw themselves
 * across the plane, every vertex is solved from its own pair of equations, and
 * the base and height are measured off the picture. The closing beat is why the
 * ½ is there: the two corners of the surrounding base-by-height rectangle spin
 * 180° about their own centres and land exactly on the two halves of the
 * triangle, so the triangle is half the box. Vertices, base, height and a
 * shoelace area are all computed here and checked against the stored answer.
 * Data: { lines: ["m|b|label", ...] }.
 */
export function LineTriangleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const lines = parseLines(data.lines);

  // every pair of lines meets once: those three points are the triangle
  const pairs: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 2],
  ];
  const verts: Pt[] = pairs.map(([i, j]) => {
    const x = (lines[j].b - lines[i].b) / (lines[i].m - lines[j].m);
    return { x, y: lines[i].m * x + lines[i].b };
  });

  // the two vertices sharing a y are the base; the odd one out is the apex
  const flatPair = pairs.findIndex(([i, j]) => Math.abs(verts[i].y - verts[j].y) < 1e-9);
  const [li, ri] = pairs[flatPair];
  const left = verts[li].x <= verts[ri].x ? verts[li] : verts[ri];
  const right = verts[li].x <= verts[ri].x ? verts[ri] : verts[li];
  const apex = verts[3 - li - ri];

  const base = right.x - left.x;
  const height = Math.abs(apex.y - left.y);
  const area = (base * height) / 2;
  const shoelace =
    Math.abs(
      verts[0].x * (verts[1].y - verts[2].y) +
        verts[1].x * (verts[2].y - verts[0].y) +
        verts[2].x * (verts[0].y - verts[1].y)
    ) / 2;
  const stored = Number(problem.shortAnswer ?? num(data.area, NaN));
  const shoelaceOk = Math.abs(shoelace - area) < 1e-9;
  const storedOk = !Number.isFinite(stored) || Math.abs(stored - area) < 1e-9;

  // the classic slip: reading the base as only the half from the apex outward
  const halfBase = (base / 2) * height * 0.5;
  const trapLetter = problem.choices?.find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === halfBase
  )?.label;
  const showTrap = trapLetter != null && Math.abs(halfBase - area) > 1e-9;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showVerts = step >= 1;
  const showTri = step >= 2;
  const showMeasure = step >= 2;
  const showBox = isFinal;

  // ---- geometry ----
  const W = 340;
  const xs = verts.map((p) => p.x);
  const ys = verts.map((p) => p.y);
  const xMin = Math.floor(Math.min(...xs)) - 2;
  const xMax = Math.ceil(Math.max(...xs)) + 2;
  const yMin = Math.floor(Math.min(...ys)) - 2;
  const yMax = Math.ceil(Math.max(...ys)) + 2;
  const padL = 36;
  const gTop = 16;
  const cell = Math.min(21, (W - padL - 16) / (xMax - xMin));
  const gW = (xMax - xMin) * cell;
  const gH = (yMax - yMin) * cell;
  const H = gTop + gH + 26;
  const X = (x: number) => padL + (x - xMin) * cell;
  const Y = (y: number) => gTop + (yMax - y) * cell;

  // each line, clipped to the visible box, left end first
  const clipped = lines.map(({ m, b }) => {
    const pts: Pt[] = [];
    const add = (x: number, y: number) => {
      if (x < xMin - 1e-9 || x > xMax + 1e-9 || y < yMin - 1e-9 || y > yMax + 1e-9) return;
      if (pts.some((p) => Math.abs(p.x - x) < 1e-9 && Math.abs(p.y - y) < 1e-9)) return;
      pts.push({ x, y });
    };
    add(xMin, m * xMin + b);
    add(xMax, m * xMax + b);
    if (m !== 0) {
      add((yMin - b) / m, yMin);
      add((yMax - b) / m, yMax);
    }
    pts.sort((p, q) => p.x - q.x);
    return pts.slice(0, 2);
  });

  const tri = `${X(left.x)},${Y(left.y)} ${X(right.x)},${Y(right.y)} ${X(apex.x)},${Y(apex.y)}`;
  // the two corners the triangle leaves over inside the base-by-height box
  const corners = [
    `${X(left.x)},${Y(left.y)} ${X(left.x)},${Y(apex.y)} ${X(apex.x)},${Y(apex.y)}`,
    `${X(right.x)},${Y(right.y)} ${X(right.x)},${Y(apex.y)} ${X(apex.x)},${Y(apex.y)}`,
  ];

  const vertLabel = (p: Pt) => `(${signed(p.x)}, ${signed(p.y)})`;

  const caption = isFinal
    ? `the box is ${tidy(base)} × ${tidy(height)} = ${tidy(base * height)}, and the triangle is half of it: ${tidy(area)}`
    : step === 0
    ? `three lines, and each pair of them crosses once`
    : step === 1
    ? `set the pairs equal: ${vertLabel(left)}, ${vertLabel(right)}, ${vertLabel(apex)}`
    : `base ${paren(right.x)} − ${paren(left.x)} = ${tidy(base)}, height ${paren(left.y)} − ${paren(apex.y)} = ${tidy(height)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the coordinate grid */}
        {Array.from({ length: xMax - xMin + 1 }).map((_, i) => (
          <line key={`v${i}`} x1={X(xMin + i)} y1={gTop} x2={X(xMin + i)} y2={gTop + gH} stroke={GRID} strokeWidth={1} />
        ))}
        {Array.from({ length: yMax - yMin + 1 }).map((_, i) => (
          <line key={`h${i}`} x1={padL} y1={Y(yMin + i)} x2={padL + gW} y2={Y(yMin + i)} stroke={GRID} strokeWidth={1} />
        ))}
        {xMin <= 0 && xMax >= 0 && <line x1={X(0)} y1={gTop} x2={X(0)} y2={gTop + gH} stroke={AXIS} strokeWidth={1.3} />}
        {yMin <= 0 && yMax >= 0 && <line x1={padL} y1={Y(0)} x2={padL + gW} y2={Y(0)} stroke={AXIS} strokeWidth={1.3} />}
        {Array.from({ length: xMax - xMin + 1 }).map((_, i) =>
          (xMin + i) % 2 === 0 && xMin + i !== 0 ? (
            <text key={`vx${i}`} x={X(xMin + i)} y={gTop + gH + 12} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={AXIS} fontFamily={numberFont}>
              {signed(xMin + i)}
            </text>
          ) : null
        )}
        {Array.from({ length: yMax - yMin + 1 }).map((_, i) =>
          Math.abs((yMin + i) % 2) === 1 ? (
            <text key={`hy${i}`} x={padL - 6} y={Y(yMin + i) + 3} textAnchor="end" fontSize="8.5" fontWeight="700" fill={AXIS} fontFamily={numberFont}>
              {signed(yMin + i)}
            </text>
          ) : null
        )}

        {/* the three lines, drawn on */}
        {clipped.map((seg, i) => (
          <motion.line
            key={`ln${i}`}
            x1={X(seg[0].x)}
            y1={Y(seg[0].y)}
            x2={X(seg[1].x)}
            y2={Y(seg[1].y)}
            stroke={LINE_INK[i % LINE_INK.length]}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={showTri ? 0.45 : 0.95}
            initial={{ pathLength: step === 0 ? 0 : 1 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.55, delay: step === 0 ? i * 0.45 : 0 }}
          />
        ))}

        {/* a pencil rides each line as it is drawn */}
        <AnimatePresence>
          {step === 0 &&
            clipped.map((seg, i) => (
              <motion.g
                key={`pen${i}`}
                initial={{ x: X(seg[0].x), y: Y(seg[0].y), opacity: 0 }}
                animate={{ x: X(seg[1].x), y: Y(seg[1].y), opacity: [0, 1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, delay: i * 0.45, opacity: { duration: 0.55, delay: i * 0.45, times: [0, 0.08, 0.85, 1] } }}
              >
                <text x={0} y={0} fontSize="13" textAnchor="middle">
                  ✏️
                </text>
              </motion.g>
            ))}
        </AnimatePresence>

        {/* the enclosed triangle */}
        <AnimatePresence>
          {showTri && (
            <motion.polygon
              key="tri"
              points={tri}
              fill="rgba(67,56,202,0.16)"
              stroke={MARK}
              strokeWidth={2.4}
              strokeLinejoin="round"
              initial={{ opacity: 0, scale: 0.55 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 170, damping: 18 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          )}
        </AnimatePresence>

        {/* base and height, measured off the picture */}
        <AnimatePresence>
          {showMeasure && (
            <motion.g key="meas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.line
                x1={X(left.x)}
                y1={Y(left.y)}
                x2={X(right.x)}
                y2={Y(right.y)}
                stroke={BASE}
                strokeWidth={3.6}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                {/* off-centre: the line's own equation label owns the midpoint */}
                <rect x={X((left.x + apex.x) / 2) - 12} y={Y(left.y) - 21} width={24} height={15} rx={6} fill="#ccfbf1" stroke={BASE} strokeWidth={1.1} />
                <text x={X((left.x + apex.x) / 2)} y={Y(left.y) - 10} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#0f766e" fontFamily={numberFont}>
                  {tidy(base)}
                </text>
              </motion.g>
              <motion.line
                x1={X(apex.x)}
                y1={Y(left.y)}
                x2={X(apex.x)}
                y2={Y(apex.y)}
                stroke={HIGH}
                strokeWidth={2.6}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}>
                <rect x={X(apex.x) + 6} y={(Y(left.y) + Y(apex.y)) / 2 - 8} width={22} height={15} rx={6} fill="#fef3c7" stroke={HIGH} strokeWidth={1.1} />
                <text x={X(apex.x) + 17} y={(Y(left.y) + Y(apex.y)) / 2 + 3} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#92400e" fontFamily={numberFont}>
                  {tidy(height)}
                </text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the base-by-height box, whose two spare corners spin onto the triangle */}
        <AnimatePresence>
          {showBox && (
            <motion.g key="box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.rect
                x={X(left.x)}
                y={Math.min(Y(left.y), Y(apex.y))}
                width={Math.abs(X(right.x) - X(left.x))}
                height={Math.abs(Y(apex.y) - Y(left.y))}
                fill="none"
                stroke={BOX}
                strokeWidth={2}
                strokeDasharray="5 4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              />
              {corners.map((pts, i) => (
                <motion.polygon
                  key={`cor${i}`}
                  points={pts}
                  fill="rgba(124,58,237,0.22)"
                  stroke={BOX}
                  strokeWidth={1.6}
                  strokeLinejoin="round"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 180 }}
                  transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.5 + i * 0.35 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the three vertices, each solved from its own pair of lines */}
        <AnimatePresence>
          {showVerts &&
            [left, right, apex].map((p, i) => (
              <motion.g
                key={`vt${i}`}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 16, delay: step === 1 ? i * 0.3 : 0 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <circle cx={X(p.x)} cy={Y(p.y)} r={4.2} fill={INK} stroke="#fff" strokeWidth={1.4} />
                <rect x={X(p.x) - 25} y={Y(p.y) + (p === apex ? 7 : -21) } width={50} height={14} rx={5} fill="#fff" opacity={0.88} />
                <text
                  x={X(p.x)}
                  y={Y(p.y) + (p === apex ? 17 : -11)}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="800"
                  fill={INK}
                  fontFamily={numberFont}
                >
                  {vertLabel(p)}
                </text>
              </motion.g>
            ))}
        </AnimatePresence>

        {/* line equations, last so nothing is drawn across them */}
        {clipped.map((seg, i) => {
          const mid = { x: (seg[0].x + seg[1].x) / 2, y: (seg[0].y + seg[1].y) / 2 };
          const dx = lines[i].m > 0 ? 20 : lines[i].m < 0 ? -20 : 0;
          const dy = lines[i].m === 0 ? -12 : 13;
          const w = Math.max(34, lines[i].label.length * 5.6 + 8);
          return (
            <motion.g
              key={`lb${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: step === 0 ? 0.35 + i * 0.45 : 0 }}
            >
              <rect x={X(mid.x) + dx - w / 2} y={Y(mid.y) + dy - 9} width={w} height={14} rx={5} fill="#fff" opacity={0.9} />
              <text
                x={X(mid.x) + dx}
                y={Y(mid.y) + dy + 1}
                textAnchor="middle"
                fontSize="9"
                fontWeight="800"
                fill={LINE_INK[i % LINE_INK.length]}
                fontFamily={numberFont}
              >
                {lines[i].label}
              </text>
            </motion.g>
          );
        })}
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
          color: isFinal ? "#166534" : showMeasure ? "#0f766e" : "#4338ca",
          background: isFinal ? "#dcfce7" : showMeasure ? "#ccfbf1" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showMeasure ? "#99f6e4" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {showMeasure && !isFinal && showTrap && (
          <motion.span
            key="trap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.25 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            measuring only from x = {signed(apex.x)} out gives ½ × {tidy(base / 2)} × {tidy(height)} = {tidy(halfBase)} — choice {trapLetter}, the trap
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            style={{
              fontFamily: numberFont,
              fontSize: 11.5,
              fontWeight: 700,
              color: shoelaceOk && storedOk ? "#94a3b8" : BAD,
              textAlign: "center",
            }}
          >
            {!shoelaceOk
              ? `shoelace on these vertices gives ${tidy(shoelace)}, not ${tidy(area)}`
              : !storedOk
              ? `these lines enclose ${tidy(area)}, not the stored ${tidy(stored)}`
              : `check: shoelace on ${vertLabel(left)}, ${vertLabel(right)}, ${vertLabel(apex)} = ${tidy(shoelace)}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
