import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";

/**
 * A grid's black squares need a mirror partner across diagonal BD; the
 * squares missing that partner light up, then their reflected cells fill in.
 * Data: { size: 4, black: [[0,0],[0,2],[0,3],[2,3],[3,1]] } (row, col).
 */
export function DiagonalSymmetryGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const size = num(data.size, 4);
  const blackList = Array.isArray(data.black) ? (data.black as [number, number][]) : [
    [0, 0], [0, 2], [0, 3], [2, 3], [3, 1],
  ];
  const blackSet = new Set(blackList.map(([r, c]) => `${r},${c}`));

  const reflect = (r: number, c: number): [number, number] => [size - 1 - c, size - 1 - r];
  const needsPartner = blackList.filter(([r, c]) => {
    const [pr, pc] = reflect(r, c);
    return !(pr === r && pc === c) && !blackSet.has(`${pr},${pc}`);
  });
  const partners = needsPartner.map(([r, c]) => reflect(r, c));

  const isFinal = step >= totalSteps - 1;
  const showDiagonal = step >= 1;
  const showNeeded = step >= 2;
  const showFilled = isFinal;

  const cell = 42;
  const gx = 60;
  const gy = 20;
  const gridSize = cell * size;

  const cellColor = (r: number, c: number) => {
    const key = `${r},${c}`;
    if (blackSet.has(key)) {
      return showNeeded && needsPartner.some(([nr, nc]) => nr === r && nc === c) ? WIN : INK;
    }
    if (showFilled && partners.some(([pr, pc]) => pr === r && pc === c)) return "#4ade80";
    return "#fff";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "the grid's black squares"
          : isFinal
            ? "add the 4 missing partners"
            : showNeeded
              ? "these black squares have no mirror partner"
              : "reflect every square across diagonal BD"}
      </div>

      <svg viewBox="0 0 320 220" width="100%" style={{ maxWidth: 320 }}>
        <text x={gx} y="14" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>A</text>
        <text x={gx + gridSize} y="14" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>B</text>
        <text x={gx} y={gy + gridSize + 18} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>D</text>
        <text x={gx + gridSize} y={gy + gridSize + 18} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>C</text>

        {Array.from({ length: size }).map((_, r) =>
          Array.from({ length: size }).map((_, c) => (
            <motion.rect
              key={`${r}-${c}`}
              x={gx + c * cell}
              y={gy + r * cell}
              width={cell}
              height={cell}
              fill={cellColor(r, c)}
              stroke="#94a3b8"
              strokeWidth="1"
              animate={{ fill: cellColor(r, c) }}
              transition={{ duration: 0.3 }}
            />
          ))
        )}

        {showDiagonal && (
          <motion.line
            x1={gx + gridSize}
            y1={gy}
            x2={gx}
            y2={gy + gridSize}
            stroke={IND}
            strokeWidth="2.6"
            strokeDasharray="6 4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
      </svg>

      {isFinal && (
        <div style={{ textAlign: "center", fontSize: 12.5, fontWeight: 900, color: IND, fontFamily: FONT, marginTop: 2 }}>
          {partners.length} new black squares needed
        </div>
      )}

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 2 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
