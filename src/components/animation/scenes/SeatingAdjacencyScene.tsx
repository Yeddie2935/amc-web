import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const H_COLOR = "#4338ca";
const V_COLOR = "#0891b2";
const WIN = "#16a34a";
const FADE = "#e2e8f0";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** A seated passenger: head and shoulders, so a filled seat reads at a glance. */
function Person({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  return (
    <g>
      <circle cx={x} cy={y - r * 0.55} r={r * 0.42} fill={fill} />
      <path d={`M ${x - r * 0.8},${y + r * 0.7} a ${r * 0.8} ${r * 0.75} 0 0 1 ${r * 1.6} 0 Z`} fill={fill} />
    </g>
  );
}

/**
 * Every unordered pair of seats in an R×C grid is one line of a complete
 * graph over the seats; the scene draws all of them (C(seats,2) total), then
 * keeps only the ones that share a row edge or a column edge — that subset is
 * exactly the "adjacent" pairs the probability counts. Nothing is asserted:
 * the counts come from walking the grid's own rows and columns.
 * Data: { rows, cols }.
 */
export function SeatingAdjacencyScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const R = Math.max(1, Math.round(num(data.rows, 2)));
  const C = Math.max(2, Math.round(num(data.cols, 3)));
  const seats = R * C;
  const rowOf = (i: number) => Math.floor(i / C);
  const colOf = (i: number) => i % C;

  const pairs: [number, number][] = [];
  for (let i = 0; i < seats; i++) for (let j = i + 1; j < seats; j++) pairs.push([i, j]);
  const total = pairs.length;

  const horizontal = pairs.filter((p) => rowOf(p[0]) === rowOf(p[1]) && Math.abs(colOf(p[0]) - colOf(p[1])) === 1);
  const vertical = pairs.filter((p) => colOf(p[0]) === colOf(p[1]) && Math.abs(rowOf(p[0]) - rowOf(p[1])) === 1);
  const adjacentOrdered = [...horizontal, ...vertical];
  const adjacent = adjacentOrdered.length;
  const adjIndex = new Map<string, number>();
  adjacentOrdered.forEach((p, idx) => adjIndex.set(`${p[0]}-${p[1]}`, idx));

  const g = gcd(adjacent, total) || 1;
  const probStr = `${adjacent / g}/${total / g}`;
  const agrees = problem.shortAnswer == null || String(problem.shortAnswer).replace(/\s/g, "") === probStr;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showAdjacent = step >= 1;
  const example = adjacentOrdered[0] ?? null;

  // ---- geometry ----
  const W = 340;
  const H = 200;
  const sz = 36;
  const gapX = 16;
  const gapY = 16;
  const gridW = C * sz + (C - 1) * gapX;
  const gridH = R * sz + (R - 1) * gapY;
  const gx = 22;
  const gy = (H - gridH) / 2 - 4;
  const cxOf = (i: number) => gx + colOf(i) * (sz + gapX) + sz / 2;
  const cyOf = (i: number) => gy + rowOf(i) * (sz + gapY) + sz / 2;
  const panelX = gx + gridW + 16;

  const caption = isFinal
    ? `${adjacent} of the ${total} seat pairs are adjacent — ${probStr}`
    : step === 0
    ? `${seats} seats → C(${seats},2) = ${total} possible pairs for Abby & Bridget`
    : `${horizontal.length} same-row pairs + ${vertical.length} same-column pairs = ${adjacent} adjacent`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* every edge between two seats */}
        {pairs.map(([i, j], idx) => {
          const key = `${i}-${j}`;
          const adjIdx = adjIndex.get(key);
          const adj = adjIdx != null;
          const horiz = rowOf(i) === rowOf(j);
          let stroke = "#94a3b8";
          let width = 1.1;
          let opacity = 1;
          let delay = idx * 0.035;
          if (showAdjacent) {
            if (isFinal) {
              opacity = adj ? 1 : 0;
              width = adj ? 2.4 : 1;
              stroke = WIN;
              delay = 0;
            } else if (adj) {
              stroke = horiz ? H_COLOR : V_COLOR;
              width = 2.4;
              opacity = 1;
              delay = 0.15 + (adjIdx as number) * 0.14;
            } else {
              stroke = FADE;
              width = 1;
              opacity = 0.5;
              delay = 0;
            }
          }
          return (
            <motion.line
              key={key}
              x1={cxOf(i)}
              y1={cyOf(i)}
              x2={cxOf(j)}
              y2={cyOf(j)}
              initial={false}
              animate={{ opacity, stroke, strokeWidth: width }}
              transition={{ duration: 0.35, delay }}
            />
          );
        })}

        {/* the six seats */}
        {Array.from({ length: seats }).map((_, i) => {
          const isExampleSeat = isFinal && example != null && (i === example[0] || i === example[1]);
          return (
            <motion.g
              key={`seat-${i}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: i * 0.03 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect
                x={cxOf(i) - sz / 2}
                y={cyOf(i) - sz / 2}
                width={sz}
                height={sz}
                rx={8}
                fill={isExampleSeat ? "#dcfce7" : "#fff"}
                stroke={isExampleSeat ? WIN : INK}
                strokeWidth={isExampleSeat ? 2.4 : 1.3}
              />
              {!isExampleSeat && (
                <text x={cxOf(i)} y={cyOf(i) + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                  {i + 1}
                </text>
              )}
              <AnimatePresence>
                {isExampleSeat && (
                  <motion.g
                    key="p"
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 15, delay: 0.5 + (example && i === example[0] ? 0 : 0.15) }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <Person x={cxOf(i)} y={cyOf(i) + 2} r={10} fill={WIN} />
                  </motion.g>
                )}
              </AnimatePresence>
            </motion.g>
          );
        })}

        {/* step 0: running total of every possible pair */}
        <AnimatePresence>
          {step === 0 && (
            <motion.g key="tot" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <text x={panelX} y={gy + 22} fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                choose 2 of
              </text>
              <text x={panelX} y={gy + 36} fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {seats} seats:
              </text>
              <motion.text
                x={panelX}
                y={gy + 62}
                fontSize="17"
                fontWeight="800"
                fill={H_COLOR}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 16, delay: (total - 1) * 0.035 + 0.3 }}
                style={{ transformBox: "fill-box", transformOrigin: "left" }}
              >
                {total}
              </motion.text>
              <text x={panelX} y={gy + 84} fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                ways in all
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* step 1: the row/column tally */}
        <AnimatePresence>
          {showAdjacent && !isFinal && (
            <motion.g key="tally" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <motion.text
                x={panelX}
                y={gy + 20}
                fontSize="10.5"
                fontWeight="800"
                fill={H_COLOR}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                {horizontal.length} same row
              </motion.text>
              <motion.text
                x={panelX}
                y={gy + 36}
                fontSize="10.5"
                fontWeight="800"
                fill={V_COLOR}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 + horizontal.length * 0.14 }}
              >
                {vertical.length} same column
              </motion.text>
              <line x1={panelX} y1={gy + 46} x2={panelX + 60} y2={gy + 46} stroke="#cbd5e1" strokeWidth={1.2} />
              <motion.text
                x={panelX}
                y={gy + 66}
                fontSize="15"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.15 + adjacent * 0.14 + 0.2 }}
                style={{ transformBox: "fill-box", transformOrigin: "left" }}
              >
                {adjacent}
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* final: the fraction */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="frac" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
              <text x={panelX} y={gy + 20} fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                adjacent
              </text>
              <text x={panelX} y={gy + 20} fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont} dx={62}>
                total
              </text>
              <motion.text
                x={panelX}
                y={gy + 44}
                fontSize="20"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.5 }}
                style={{ transformBox: "fill-box", transformOrigin: "left" }}
              >
                {probStr}
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>
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
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : "#dc2626", textAlign: "center" }}
          >
            {agrees
              ? `checked all ${total} pairs: ${adjacent} adjacent, ${total - adjacent} not`
              : `computed ${probStr} but the stored answer differs`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
