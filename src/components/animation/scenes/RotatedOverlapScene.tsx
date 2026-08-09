import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const BASE = "#cbd5e1";
const COPY = "#4338ca";
const OVER = "#f59e0b";
const WIN = "#16a34a";

const fmt = (v: number) => (Number.isInteger(v) ? `${v}` : `${Math.round(v * 1000) / 1000}`);

/**
 * A rectangle rotated a quarter turn about a point, asking for the area the two
 * copies cover together. A quarter turn keeps the copy axis-aligned, so the
 * overlap is itself a rectangle: the scene rotates the copy into place, shades
 * the intersection, and adds by inclusion–exclusion (2·area − overlap) so the
 * double-counted piece is visible. Rotated corners, overlap and union computed.
 * Data: { w, h, pivotX, pivotY, unit?, labels?:["A","B","C","D"] }.
 */
export function RotatedOverlapScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const w = num(data.w, 5);
  const h = num(data.h, 3);
  const px = num(data.pivotX, w / 2);
  const py = num(data.pivotY, 0);
  const unit = data.unit != null ? String(data.unit) : "in";
  const labels = Array.isArray(data.labels) ? data.labels.map((l) => String(l)) : ["A", "B", "C", "D"];

  // quarter turn clockwise about the pivot: (x,y) -> (px + (y−py), py − (x−px))
  const rot = (x: number, y: number): [number, number] => [px + (y - py), py - (x - px)];
  const corners = ([[0, 0], [w, 0], [w, h], [0, h]] as [number, number][]).map(([x, y]) => rot(x, y));
  const rx0 = Math.min(...corners.map((c) => c[0]));
  const rx1 = Math.max(...corners.map((c) => c[0]));
  const ry0 = Math.min(...corners.map((c) => c[1]));
  const ry1 = Math.max(...corners.map((c) => c[1]));

  const ox0 = Math.max(0, rx0);
  const ox1 = Math.min(w, rx1);
  const oy0 = Math.max(0, ry0);
  const oy1 = Math.min(h, ry1);
  const ow = Math.max(0, ox1 - ox0);
  const oh = Math.max(0, oy1 - oy0);
  const area = w * h;
  const overlap = ow * oh;
  const union = 2 * area - overlap;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showCopy = step >= 1 || isFinal;
  const showOverlap = step >= 2 || isFinal;

  // ---- screen mapping over the full extent of both rectangles ----
  const minX = Math.min(0, rx0);
  const maxX = Math.max(w, rx1);
  const minY = Math.min(0, ry0);
  const maxY = Math.max(h, ry1);
  const s = 40;
  const mx = 32;
  const my = 20;
  const X = (x: number) => mx + (x - minX) * s;
  const Y = (y: number) => my + (maxY - y) * s;
  const W = mx * 2 + (maxX - minX) * s;
  const H = my + (maxY - minY) * s + 26;

  const Mx = X(px);
  const My = Y(py);

  // vertex labels for the original rectangle: A top-left, B top-right, C bottom-right, D bottom-left
  const verts: { l: string; x: number; y: number; dx: number; dy: number }[] = [
    { l: labels[0], x: 0, y: h, dx: -10, dy: -7 },
    { l: labels[1], x: w, y: h, dx: 10, dy: -7 },
    { l: labels[2], x: w, y: 0, dx: 12, dy: 5 },
    { l: labels[3], x: 0, y: 0, dx: -11, dy: 5 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 330 }}>
        {/* the original rectangle */}
        <rect x={X(0)} y={Y(h)} width={w * s} height={h * s} fill={BASE} stroke={INK} strokeWidth={1.8} />

        {/* the rotated copy: same rectangle, spun a quarter turn about the pivot */}
        <AnimatePresence>
          {showCopy && (
            <motion.g
              key="copy"
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 90, opacity: 1 }}
              transition={{ rotate: { type: "spring", stiffness: 60, damping: 15, delay: 0.2 }, opacity: { duration: 0.2 } }}
              style={{ transformBox: "view-box", transformOrigin: `${Mx}px ${My}px` }}
            >
              <rect x={X(0)} y={Y(h)} width={w * s} height={h * s} fill="rgba(67,56,202,0.10)" stroke={COPY} strokeWidth={1.8} />
            </motion.g>
          )}
        </AnimatePresence>

        {/* the doubly-covered piece */}
        <AnimatePresence>
          {showOverlap && ow > 0 && oh > 0 && (
            <motion.g key="ov" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={X(ox0)} y={Y(oy1)} width={ow * s} height={oh * s} fill="rgba(245,158,11,0.42)" stroke={OVER} strokeWidth={2} />
              <text x={X((ox0 + ox1) / 2)} y={Y((oy0 + oy1) / 2) + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill="#92400e" fontFamily={numberFont}>
                {fmt(overlap)}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* pivot with its turn arrow */}
        <g>
          <path d={`M ${Mx - 15},${My} A 15,15 0 1 1 ${Mx},${My + 15}`} fill="none" stroke={INK} strokeWidth={1.4} />
          <path d={`M ${Mx - 4},${My + 11} L ${Mx},${My + 17} L ${Mx + 4},${My + 11} Z`} fill={INK} />
          <circle cx={Mx} cy={My} r={4} fill={INK} />
        </g>

        {/* vertex labels + side lengths */}
        {verts.map((v) => (
          <text key={v.l} x={X(v.x) + v.dx} y={Y(v.y) + v.dy} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
            {v.l}
          </text>
        ))}
        <text x={X(w / 2)} y={Y(h) - 6} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {fmt(w)}
        </text>
        <text x={X(0) - 12} y={Y(h / 2) + 4} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {fmt(h)}
        </text>
      </svg>

      {/* caption */}
      <motion.span
        key={`${showCopy}-${showOverlap}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 13,
          fontWeight: 800,
          color: isFinal ? "#166534" : showOverlap ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : showOverlap ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showOverlap ? "#fde68a" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {!showCopy
          ? `${fmt(w)} × ${fmt(h)} = ${fmt(area)} ${unit}² each`
          : !showOverlap
          ? `a quarter turn about the midpoint`
          : !isFinal
          ? `overlap = ${fmt(ow)} × ${fmt(oh)} = ${fmt(overlap)} ${unit}²`
          : `${fmt(area)} + ${fmt(area)} − ${fmt(overlap)} = ${fmt(union)} ${unit}²`}
      </motion.span>

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="why"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            adding both rectangles counts the shaded piece twice, so subtract it once
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.45 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
