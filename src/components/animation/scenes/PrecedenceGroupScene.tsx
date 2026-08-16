import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const PROD = "#6366f1";
const LOOSE = "#f59e0b";
const MARK = "#4338ca";
const GONE = "#cbd5e1";
const WIN = "#16a34a";
const BAD = "#dc2626";

const GAP = 12;
const SQ = 10;
const W = 360;
const H = 196;

type Parsed = {
  items: { t: string; x: number; w: number; isNum: boolean }[];
  factorTokens: [number, number];
  a: number;
  b: number;
  product: number;
  loose: number;
  looseFirst: boolean;
  total: number;
  blockW: number;
  blockH: number;
};

const MUL = /^[×*·x]$/;

/** Lay a "a op b op c" expression out as measured tiles, and read its structure. */
function parse(src: string, x0: number): Parsed | null {
  const tokens = String(src).trim().split(/\s+/);
  if (tokens.length !== 5) return null;
  const nums = [tokens[0], tokens[2], tokens[4]].map(Number);
  if (nums.some((n) => !Number.isFinite(n))) return null;
  const mulFirst = MUL.test(tokens[1]);
  if (!mulFirst && !MUL.test(tokens[3])) return null;

  const items = [] as Parsed["items"];
  let x = x0;
  for (const t of tokens) {
    const isNum = /^\d+$/.test(t);
    const w = isNum ? 20 : 14;
    items.push({ t, x, w, isNum });
    x += w + 6;
  }

  const a = mulFirst ? nums[0] : nums[1];
  const b = mulFirst ? nums[1] : nums[2];
  const loose = mulFirst ? nums[2] : nums[0];
  return {
    items,
    factorTokens: mulFirst ? [0, 2] : [2, 4],
    a,
    b,
    product: a * b,
    loose,
    looseFirst: !mulFirst,
    total: a * b + loose,
    blockW: Math.max(a, b),
    blockH: Math.min(a, b),
  };
}

type Cell = { x: number; y: number; prod: boolean };

/** Tiles in reading order: the product as a real rectangle, the loose number as a run. */
function cells(p: Parsed, ox: number, oy: number, gridW: number): Cell[] {
  const out: Cell[] = [];
  const push = (c: number, r: number, prod: boolean) => out.push({ x: ox + c * GAP, y: oy + r * GAP, prod });
  const run = (n: number, startRow: number) => {
    let r = startRow;
    let c = 0;
    for (let i = 0; i < n; i++) {
      push(c, r, false);
      if (++c === gridW) {
        c = 0;
        r++;
      }
    }
    return c === 0 ? r : r + 1;
  };
  const block = (startRow: number) => {
    for (let r = 0; r < p.blockH; r++) for (let c = 0; c < p.blockW; c++) push(c, startRow + r, true);
    return startRow + p.blockH;
  };
  if (p.looseFirst) block(run(p.loose, 0));
  else run(p.loose, block(0));
  return out;
}

/**
 * Two arithmetic expressions built from the same numbers in the same order,
 * differing only in where the × sits — so the whole problem is that × binds
 * tighter than +, and its position decides which pair is multiplied. The scene
 * draws each product as a real rectangle of unit tiles (multiplication as area),
 * so the two expressions become visibly different amounts of stuff; then the
 * second collection flies up and covers part of the first, and what is left over
 * is the difference. Both expressions are evaluated by the scene (a × pass then
 * a left-to-right + pass), and the surviving tiles are counted as a check.
 * Data: { expressions: ["8 × 4 + 2", "8 + 4 × 2"], combine?: "−" }.
 */
export function PrecedenceGroupScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const raw = Array.isArray(data.expressions) ? (data.expressions as unknown[]) : [];
  const pa = parse(String(raw[0] ?? ""), 12);
  const pb = parse(String(raw[1] ?? ""), 12);
  const combine = data.combine != null ? String(data.combine) : "−";
  if (!pa || !pb) return null;

  const result = combine === "+" ? pa.total + pb.total : pa.total - pb.total;
  const gridW = Math.max(pa.blockW, pb.blockW, Math.min(pa.loose, 10), Math.min(pb.loose, 10));

  const dotsX = 150;
  const aTileY = 40;
  const bTileY = 112;
  const A = cells(pa, dotsX, 26, gridW);
  const B = cells(pb, dotsX, 108, gridW);

  // the removed tiles land on whole rows of the first collection where possible
  let startIdx = Math.floor((pa.total - pb.total) / gridW) * gridW;
  if (startIdx < 0 || startIdx + pb.total > pa.total) startIdx = Math.max(0, pa.total - pb.total);
  const gone = (i: number) => i >= startIdx && i < startIdx + pb.total;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showA = isFinal || step >= 1;
  const showB = isFinal || step >= 2;

  const survivors = A.filter((_, i) => !gone(i)).length;
  const consistent = survivors === result && (problem.shortAnswer == null || Number(problem.shortAnswer) === result);

  const bracket = (p: Parsed, tileY: number, on: boolean, key: string) => {
    if (!on) return null;
    const i1 = p.items[p.factorTokens[0]];
    const i2 = p.items[p.factorTokens[1]];
    const x1 = i1.x - 3;
    const x2 = i2.x + i2.w + 3;
    const yT = tileY + 22;
    const yB = tileY + 29;
    return (
      <motion.g key={key} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.path
          d={`M ${x1} ${yT} L ${x1} ${yB} L ${x2} ${yB} L ${x2} ${yT}`}
          fill="none"
          stroke={LOOSE}
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.text
          x={(x1 + x2) / 2}
          y={yB + 15}
          textAnchor="middle"
          fontSize="11.5"
          fontWeight="800"
          fill={MARK}
          fontFamily={numberFont}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.5 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          {p.a} × {p.b} = {p.product}
        </motion.text>
      </motion.g>
    );
  };

  const expression = (p: Parsed, tileY: number) =>
    p.items.map((it, i) => (
      <g key={i}>
        {it.isNum && <rect x={it.x} y={tileY} width={it.w} height={20} rx={4} fill="#eef2ff" stroke={MARK} strokeWidth={1.2} />}
        <text
          x={it.x + it.w / 2}
          y={tileY + 14}
          textAnchor="middle"
          fontSize={it.isNum ? 13 : 14}
          fontWeight="800"
          fill={it.isNum ? INK : MUL.test(it.t) ? LOOSE : "#94a3b8"}
          fontFamily={numberFont}
        >
          {it.t}
        </text>
      </g>
    ));

  const totalChip = (p: Parsed, tileY: number, on: boolean, key: string) => (
    <AnimatePresence key={key}>
      {on && (
        <motion.g
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.9 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <rect x={280} y={tileY - 2} width={66} height={24} rx={12} fill="#eef2ff" stroke={MARK} strokeWidth={1.5} />
          <text x={313} y={tileY + 14} textAnchor="middle" fontSize="14" fontWeight="800" fill={MARK} fontFamily={numberFont}>
            = {p.total}
          </text>
        </motion.g>
      )}
    </AnimatePresence>
  );

  const caption = isFinal
    ? `the smaller pile covers ${pb.total} of the ${pa.total} tiles — the rest is the answer`
    : step === 0
    ? "same digits in the same order — only the × moved one place"
    : step === 1
    ? `× goes first: ${pa.a} × ${pa.b} = ${pa.product}, then + ${pa.loose} → ${pa.total}`
    : `here the × grabs ${pb.a} and ${pb.b} instead: ${pb.product}, then + ${pb.loose} → ${pb.total}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 370 }}>
        {/* first expression */}
        {expression(pa, aTileY)}
        <AnimatePresence>{bracket(pa, aTileY, showA, "ba")}</AnimatePresence>
        {totalChip(pa, aTileY, showA, "ta")}

        {/* second expression */}
        {expression(pb, bTileY)}
        <AnimatePresence>{bracket(pb, bTileY, showB, "bb")}</AnimatePresence>
        {totalChip(pb, bTileY, showB, "tb")}

        {/* the × shifting one place, which is the whole difference */}
        <AnimatePresence>
          {step === 0 && !isFinal && (
            <motion.g key="shift" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <motion.path
                d={`M ${pa.items[1].x + 7} ${aTileY + 24} Q ${pa.items[1].x + 4} ${bTileY - 12} ${pb.items[3].x + 7} ${bTileY - 4}`}
                fill="none"
                stroke={LOOSE}
                strokeWidth={1.8}
                markerEnd="url(#pgArrow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              />
              <text x={118} y={82} fontSize="10.5" fontWeight="800" fill={LOOSE} fontFamily={numberFont}>
                the × moves
              </text>
              <text x={118} y={95} fontSize="10.5" fontWeight="800" fill={LOOSE} fontFamily={numberFont}>
                one place
              </text>
            </motion.g>
          )}
        </AnimatePresence>
        <defs>
          <marker id="pgArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M 0,0 L 6,3 L 0,6 z" fill={LOOSE} />
          </marker>
        </defs>

        {/* the first collection of unit tiles */}
        {showA &&
          A.map((c, i) => (
            <motion.rect
              key={`a${i}`}
              x={c.x}
              y={c.y}
              width={SQ}
              height={SQ}
              rx={2}
              stroke="#fff"
              strokeWidth={0.6}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                fill: isFinal ? (gone(i) ? GONE : WIN) : c.prod ? PROD : LOOSE,
              }}
              transition={{
                default: { type: "spring", stiffness: 320, damping: 22, delay: 0.15 + i * 0.012 },
                fill: { duration: 0.4, delay: isFinal ? (gone(i) ? 1.0 : 1.5) : 0 },
              }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          ))}

        {/* the second collection, which flies up and covers part of the first */}
        {showB &&
          B.map((c, j) => {
            const target = A[startIdx + j];
            const dx = isFinal && target ? target.x - c.x : 0;
            const dy = isFinal && target ? target.y - c.y : 0;
            return (
              <motion.g
                key={`b${j}`}
                animate={{ x: dx, y: dy }}
                transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.3 + j * 0.02 }}
              >
                <motion.rect
                  x={c.x}
                  y={c.y}
                  width={SQ}
                  height={SQ}
                  rx={2}
                  stroke="#fff"
                  strokeWidth={0.6}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, fill: isFinal ? GONE : c.prod ? PROD : LOOSE }}
                  transition={{
                    default: { type: "spring", stiffness: 320, damping: 22, delay: 0.15 + j * 0.012 },
                    fill: { duration: 0.4, delay: isFinal ? 1.0 : 0 },
                  }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              </motion.g>
            );
          })}

        {/* the difference */}
        <AnimatePresence>
          {isFinal && (
            <motion.text
              key="res"
              x={W / 2}
              y={182}
              textAnchor="middle"
              fontSize="16"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.7 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {pa.total} {combine} {pb.total} = {result}
            </motion.text>
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
            transition={{ delay: 1.9 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: consistent ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {consistent
              ? `counted the tiles: ${pa.total} laid out, ${pb.total} covered, ${survivors} left`
              : `the tiles leave ${survivors}, which does not match the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
