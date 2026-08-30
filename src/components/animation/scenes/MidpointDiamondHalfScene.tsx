import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const BLUE = "#2563eb";
const ORANGE = "#f59e0b";
const DIM = "#94a3b8";

type Point = { x: number; y: number };
const polygon = (points: Point[]) => points.map((p) => `${p.x},${p.y}`).join(" ");

const S = 160; // outer square side, in local drawing units
const OX = 100; // left edge x
const OY = 40; // top edge y

const TL: Point = { x: OX, y: OY };
const TR: Point = { x: OX + S, y: OY };
const BR: Point = { x: OX + S, y: OY + S };
const BL: Point = { x: OX, y: OY + S };
const A: Point = { x: OX + S / 2, y: OY }; // top mid
const B: Point = { x: OX + S, y: OY + S / 2 }; // right mid
const C: Point = { x: OX + S / 2, y: OY + S }; // bottom mid
const D: Point = { x: OX, y: OY + S / 2 }; // left mid
const CENTER: Point = { x: OX + S / 2, y: OY + S / 2 };

/**
 * The four side midpoints of a square form an inner diamond square. The four
 * corner triangles pair one-for-one with the four triangles the diamond's own
 * diagonals cut it into (both share legs of half the outer side), so the
 * corners together equal the diamond — each is half of the outer square.
 * Data: { squareArea: 60 }.
 */
export function MidpointDiamondHalfScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const squareArea = num(data.squareArea, 60);
  const diamondArea = squareArea / 2;
  const cornerArea = squareArea / 8;

  const isFinal = step >= totalSteps - 1;
  const showSplit = step >= 1;
  const showPairs = step >= 2;

  const corners: [Point, Point, Point][] = [
    [TL, A, D],
    [TR, B, A],
    [BR, C, B],
    [BL, D, C],
  ];
  const wedges: [Point, Point, Point][] = [
    [CENTER, A, D],
    [CENTER, B, A],
    [CENTER, C, B],
    [CENTER, D, C],
  ];
  const pairColors = [BLUE, ORANGE, "#0891b2", "#a855f7"];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", maxWidth: 360, fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "connect the side midpoints A, B, C, D"
          : showPairs
            ? "each corner triangle matches a diamond wedge"
            : "the corners and the diamond wedges are both right triangles"}
      </div>
      <svg viewBox="0 0 360 320" width="100%" style={{ maxWidth: 400 }}>
        <rect x={TL.x} y={TL.y} width={S} height={S} fill="#f8fafc" stroke={INK} strokeWidth="2.2" />

        {showSplit &&
          corners.map((tri, i) => (
            <motion.polygon
              key={`corner-${i}`}
              points={polygon(tri)}
              fill={showPairs ? pairColors[i] : "#fca5a5"}
              fillOpacity={showPairs ? 0.4 : 0.5}
              stroke={showPairs ? pairColors[i] : "#dc2626"}
              strokeWidth="1.4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.1 * i }}
            />
          ))}

        {showPairs &&
          wedges.map((tri, i) => (
            <motion.polygon
              key={`wedge-${i}`}
              points={polygon(tri)}
              fill={pairColors[i]}
              fillOpacity="0.22"
              stroke={pairColors[i]}
              strokeWidth="1.2"
              strokeDasharray="4 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.35 + 0.1 * i }}
            />
          ))}

        <motion.polygon
          points={polygon([A, B, C, D])}
          fill="none"
          stroke={IND}
          strokeWidth="2.6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {[
          { p: A, t: "A", dx: 0, dy: -10 },
          { p: B, t: "B", dx: 14, dy: 4 },
          { p: C, t: "C", dx: 0, dy: 16 },
          { p: D, t: "D", dx: -14, dy: 4 },
        ].map(({ p, t, dx, dy }) => (
          <text key={t} x={p.x + dx} y={p.y + dy} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>
            {t}
          </text>
        ))}

        <text x="180" y="238" textAnchor="middle" fontSize="11" fontWeight="750" fill={DIM} fontFamily={FONT}>
          square area = {squareArea}
        </text>

        {isFinal && (
          <text x="180" y="256" textAnchor="middle" fontSize="13.5" fontWeight="900" fill={IND} fontFamily={FONT}>
            {squareArea} ÷ 2 = {diamondArea}
          </text>
        )}

        <SvgAnswerBadge show={isFinal} answer={problem.answer != null ? String(problem.answer) : null} cx={180} y={270} />
      </svg>
      {showPairs && (
        <div style={{ textAlign: "center", maxWidth: 340, fontSize: 11, fontWeight: 700, color: DIM, marginTop: -4 }}>
          {isFinal
            ? `each colored corner (area ${cornerArea}) matches a diamond wedge, so the 4 corners together equal the diamond`
            : `each colored corner (area ${cornerArea}) has the same two legs as its matching wedge`}
        </div>
      )}
    </div>
  );
}
