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
const WIN = "#16a34a";
const BAD = "#dc2626";

const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(3))));

/**
 * A triangle on the coordinate plane with a horizontal base and one unknown
 * vertex height, given its area. Because the base is horizontal, the area
 * depends only on how far the apex sits above that base line — its x coordinate
 * is irrelevant, which the scene shows by sliding ghost copies of the apex
 * sideways and watching the area hold. Then height = 2*area/base, and the answer
 * is the base's y plus that height, not the height itself. Base, height, the
 * apex coordinate and the shoelace area are all computed, and the result is
 * checked against both the given area and the stored answer.
 * Data: { ax, ay, bx, cx, area, above?, labels? }.
 */
export function TriangleBaseHeightScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const ax = num(data.ax, 0);
  const ay = num(data.ay, 0);
  const bx = num(data.bx, 1);
  const cx = num(data.cx, 0);
  const area = num(data.area, 1);
  const above = data.above !== false;
  const labels = (Array.isArray(data.labels) ? data.labels : ["A", "B", "C"]).map((l) => String(l));

  const base = Math.abs(bx - ax);
  const height = base > 0 ? (2 * area) / base : 0;
  const cy = above ? ay + height : ay - height;

  // shoelace on the solved triangle, as an independent check of the placement
  const shoelace = Math.abs(ax * (ay - cy) + bx * (cy - ay) + cx * (ay - ay)) / 2;
  const agrees = Math.abs(shoelace - area) < 1e-9 && (problem.shortAnswer == null || Math.abs(Number(problem.shortAnswer) - cy) < 1e-9);
  const footInside = cx >= Math.min(ax, bx) && cx <= Math.max(ax, bx);

  // apex positions to slide through: the area is the same at every one
  const ghosts = [ax + base / 2, Math.max(ax, bx)].filter((x) => Math.abs(x - cx) > 0.5);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showShear = !isFinal && step === 1;
  const showHeight = isFinal || step >= 2;

  // ---- geometry ----
  const W = 340;
  const xMin = Math.floor(Math.min(ax, bx, cx)) - 2;
  const xMax = Math.ceil(Math.max(ax, bx, cx)) + 2;
  const yMin = Math.floor(Math.min(ay, cy)) - 2;
  const yMax = Math.ceil(Math.max(ay, cy)) + 2;
  const padL = 38;
  const cell = Math.min(21, (W - padL - 14) / (xMax - xMin));
  const gTop = 16;
  const gW = (xMax - xMin) * cell;
  const gH = (yMax - yMin) * cell;
  const H = gTop + gH + 26;
  const X = (x: number) => padL + (x - xMin) * cell;
  const Y = (y: number) => gTop + (yMax - y) * cell;

  const tri = (apexX: number) => `${X(ax)},${Y(ay)} ${X(bx)},${Y(ay)} ${X(apexX)},${Y(cy)}`;

  const caption = isFinal
    ? `${labels[2]} sits ${tidy(height)} above the line ${labels[0]}${labels[1]}, so ${data.unknownName ?? "y"} = ${tidy(ay)} + ${tidy(height)} = ${tidy(cy)}`
    : step === 0
    ? `${labels[0]}${labels[1]} is horizontal, so the base is ${tidy(bx)} − ${tidy(ax)} = ${tidy(base)}`
    : showShear
    ? `slide ${labels[2]} sideways and the area never changes — only its height counts`
    : `½ × ${tidy(base)} × h = ${tidy(area)}, so h = 2 × ${tidy(area)} ÷ ${tidy(base)} = ${tidy(height)}`;

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
        {Array.from({ length: xMax - xMin + 1 }).map((_, i) =>
          (xMin + i) % 2 === 0 ? (
            <text key={`vx${i}`} x={X(xMin + i)} y={gTop + gH + 12} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={AXIS} fontFamily={numberFont}>
              {xMin + i}
            </text>
          ) : null
        )}
        {Array.from({ length: yMax - yMin + 1 }).map((_, i) =>
          (yMin + i) % 2 === 1 ? (
            <text key={`hy${i}`} x={padL - 6} y={Y(yMin + i) + 3} textAnchor="end" fontSize="8.5" fontWeight="700" fill={AXIS} fontFamily={numberFont}>
              {yMin + i}
            </text>
          ) : null
        )}

        {/* the base line, extended so the apex's foot has something to land on */}
        <line x1={padL} y1={Y(ay)} x2={padL + gW} y2={Y(ay)} stroke={BASE} strokeWidth={1} strokeDasharray="3 4" opacity={0.55} />

        {/* copies of the apex slid along its own height line */}
        <AnimatePresence>
          {showShear &&
            ghosts.map((gx, i) => (
              <motion.g
                key={`gh${i}`}
                initial={{ opacity: 0, x: X(cx) - X(gx) }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 130, damping: 20, delay: 0.15 + i * 0.25 }}
              >
                <polygon points={tri(gx)} fill="rgba(67,56,202,0.10)" stroke={MARK} strokeWidth={1.4} strokeDasharray="4 3" />
                <circle cx={X(gx)} cy={Y(cy)} r={3.5} fill={MARK} opacity={0.5} />
                <text x={X(gx)} y={Y(cy) - 7} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                  {tidy(area)}
                </text>
              </motion.g>
            ))}
        </AnimatePresence>

        {/* the original carries the same area label, so all three read alike */}
        <AnimatePresence>
          {showShear && (
            <motion.text
              key="own"
              x={(X(ax) + X(bx) + X(cx)) / 3}
              y={(2 * Y(ay) + Y(cy)) / 3}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="800"
              fill={MARK}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {tidy(area)}
            </motion.text>
          )}
        </AnimatePresence>

        {/* the triangle itself */}
        <motion.polygon
          points={tri(cx)}
          fill="rgba(67,56,202,0.14)"
          stroke={MARK}
          strokeWidth={2.2}
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* the base, measured */}
        <motion.line
          x1={X(ax)}
          y1={Y(ay)}
          x2={X(bx)}
          y2={Y(ay)}
          stroke={BASE}
          strokeWidth={3.4}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        />
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <rect x={(X(ax) + X(bx)) / 2 - 11} y={Y(ay) + 5} width={22} height={14} rx={6} fill="#ccfbf1" stroke={BASE} strokeWidth={1.1} />
          <text x={(X(ax) + X(bx)) / 2} y={Y(ay) + 15} textAnchor="middle" fontSize="9" fontWeight="800" fill="#0f766e" fontFamily={numberFont}>
            {tidy(base)}
          </text>
        </motion.g>

        {/* the height, dropped to the base line rather than the segment */}
        <AnimatePresence>
          {showHeight && (
            <motion.g key="ht" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.line
                x1={X(cx)}
                y1={Y(ay)}
                x2={X(cx)}
                y2={Y(cy)}
                stroke={HIGH}
                strokeWidth={2.4}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <path
                d={`M ${X(cx)},${Y(ay) - 8} L ${X(cx) + 8},${Y(ay) - 8} L ${X(cx) + 8},${Y(ay)}`}
                fill="none"
                stroke={HIGH}
                strokeWidth={1.3}
              />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <rect x={X(cx) - 30} y={(Y(ay) + Y(cy)) / 2 - 8} width={24} height={15} rx={6} fill="#fef3c7" stroke={HIGH} strokeWidth={1.1} />
                <text x={X(cx) - 18} y={(Y(ay) + Y(cy)) / 2 + 3} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#92400e" fontFamily={numberFont}>
                  {tidy(height)}
                </text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the three vertices */}
        {[
          { l: labels[0], x: ax, y: ay, dy: 15 },
          { l: labels[1], x: bx, y: ay, dy: 15 },
          { l: labels[2], x: cx, y: cy, dy: -9 },
        ].map((p, i) => (
          <motion.g
            key={p.l}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 16, delay: i * 0.1 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <circle cx={X(p.x)} cy={Y(p.y)} r={4.2} fill={INK} stroke="#fff" strokeWidth={1.4} />
            <text
              x={X(p.x) + (i === 2 ? 0 : 0)}
              y={Y(p.y) + p.dy}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="800"
              fill={i === 2 && isFinal ? WIN : INK}
              fontFamily={numberFont}
            >
              {p.l}({tidy(p.x)},{i === 2 && !isFinal ? String(data.unknownName ?? "y") : tidy(p.y)})
            </text>
          </motion.g>
        ))}
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
          color: isFinal ? "#166534" : showHeight ? "#92400e" : showShear ? "#4338ca" : "#0f766e",
          background: isFinal ? "#dcfce7" : showHeight ? "#fef3c7" : showShear ? "#eef2ff" : "#ccfbf1",
          border: `1px solid ${isFinal ? "#bbf7d0" : showHeight ? "#fde68a" : showShear ? "#c7d2fe" : "#99f6e4"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {showHeight && !isFinal && !footInside && (
          <motion.span
            key="foot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            the height meets the base <em>line</em>, past the end of {labels[0]}{labels[1]}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees
              ? `check: ½ × ${tidy(base)} × ${tidy(height)} = ${tidy(shoelace)}`
              : `this placement gives area ${tidy(shoelace)}, not ${tidy(area)}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.55 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
