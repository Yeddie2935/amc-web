import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const HUE = ["#4338ca", "#b45309", "#0891b2", "#be185d"];
const TINT = ["#e0e7ff", "#fef3c7", "#cffafe", "#fce7f3"];
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const W = 340;
const H = 212;
const GX = 46;
const GY = 46;
const GS = 112;
const NX = 172;

/**
 * A square table filled with a few symbols cycling by row and by column, asking
 * how many of each the finished table holds. The unlock is that the symbol
 * depends only on **r + c**, so the table is striped along its anti-diagonals —
 * once that is seen, counting is a residue count rather than a slog. Since the
 * side is not a multiple of the cycle, the residues of 1..n are *not* balanced
 * (20 = 3x6 + 2 gives seven rows each for two residues and six for the third),
 * and the letter totals are the products of those row and column counts summed
 * along the little 3x3 table's own anti-diagonals — which is exactly why one
 * letter runs ahead: it is the one collecting both a 7x7 and the 6x6. The beats
 * show the rule on the corner the figure gives (one anti-diagonal lit, all the
 * same letter), colour the whole table so the stripes are undeniable, band the
 * rows and columns by residue, then multiply out the 3x3 table. Every count is
 * obtained by actually walking the grid, and the totals are checked to sum to
 * n squared. Data: { size, letters: ["P","Q","R"], sample? }.
 */
export function DiagonalLetterGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.round(num(data.size, 20));
  const letters = (Array.isArray(data.letters) ? data.letters : ["P", "Q", "R"]).map(String);
  const sample = Math.round(num(data.sample, 5));
  const k = letters.length;
  if (n < k || k < 2) return null;

  /** The figure puts the first letter at the bottom-left, so row 1 is the bottom row. */
  const at = (r: number, c: number) => (r + c - 2) % k;

  const counts = Array(k).fill(0);
  for (let r = 1; r <= n; r++) for (let c = 1; c <= n; c++) counts[at(r, c)]++;
  const total = counts.reduce((a, b) => a + b, 0);

  // residues of 1..n, in the order 1, 2, ..., k-1, 0
  const order = Array.from({ length: k }, (_, i) => (i + 1) % k);
  const resCount = (a: number) => Array.from({ length: n }, (_, i) => i + 1).filter((r) => r % k === a).length;
  const rowsOf = order.map(resCount);

  const table = order.map((a, i) => order.map((b, j) => ({ a, b, v: rowsOf[i] * rowsOf[j], L: (a + b - 2 + 2 * k) % k })));
  const viaTable = Array(k).fill(0);
  table.forEach((row) => row.forEach((cell) => (viaTable[cell.L] += cell.v)));
  const consistent = counts.every((v, i) => v === viaTable[i]) && total === n * n;
  const best = counts.indexOf(Math.max(...counts));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const full = step >= 1;
  const bands = step >= 2;

  const cs = GS / n;
  const gx = (c: number) => GX + (c - 1) * cs;
  const gy = (r: number) => GY + GS - r * cs; // row 1 at the bottom
  const sc = GS / sample;

  // the anti-diagonal shown on the sample corner
  const lit = sample + 1;

  const caption = isFinal
    ? `${counts.map((v, i) => `${v} ${letters[i]}`).join(", ")}`
    : step === 0
    ? `the letter depends only on row + column, so each diagonal is one letter`
    : step === 1
    ? `the whole ${n} × ${n} table, striped along its diagonals`
    : `${n} = ${k} × ${Math.floor(n / k)} + ${n % k}, so the residues are not balanced`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the corner the figure gives, with one diagonal lit */}
        <AnimatePresence>
          {!full && (
            <motion.g key="samp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {Array.from({ length: sample }).map((_, ri) =>
                Array.from({ length: sample }).map((_, ci) => {
                  const r = ri + 1;
                  const c = ci + 1;
                  const L = at(r, c);
                  const on = r + c === lit;
                  return (
                    <motion.g
                      key={`${r}-${c}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.06 * (r + c) }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <rect
                        x={GX + ci * sc}
                        y={GY + GS - r * sc}
                        width={sc - 1}
                        height={sc - 1}
                        rx={2}
                        fill={on ? TINT[L % k] : "#fff"}
                        stroke={on ? HUE[L % k] : "#e2e8f0"}
                        strokeWidth={on ? 1.8 : 1}
                      />
                      <text
                        x={GX + ci * sc + sc / 2 - 0.5}
                        y={GY + GS - r * sc + sc / 2 + 5}
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="800"
                        fill={on ? HUE[L % k] : INK}
                        fontFamily={numberFont}
                      >
                        {letters[L]}
                      </text>
                    </motion.g>
                  );
                })
              )}
              <motion.text x={NX} y={70} fontSize="11.5" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                row + column = {lit}
              </motion.text>
              <motion.text x={NX} y={92} fontSize="13" fontWeight="800" fill={HUE[at(1, lit - 1) % k]} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                every one is {letters[at(1, lit - 1)]}
              </motion.text>
              <motion.text x={NX} y={118} fontSize="10.5" fontWeight="700" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                letter = (r + c − 2) mod {k}
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the finished table */}
        <AnimatePresence>
          {full && (
            <motion.g key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {Array.from({ length: n }).map((_, ri) =>
                Array.from({ length: n }).map((_, ci) => {
                  const L = at(ri + 1, ci + 1);
                  return (
                    <motion.rect
                      key={`${ri}-${ci}`}
                      x={gx(ci + 1)}
                      y={gy(ri + 1)}
                      width={cs}
                      height={cs}
                      fill={HUE[L % k]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.85 }}
                      transition={{ delay: 0.1 + (ri + ci) * 0.012 }}
                    />
                  );
                })
              )}
              <rect x={GX} y={GY} width={GS} height={GS} fill="none" stroke={INK} strokeWidth={1.3} />
            </motion.g>
          )}
        </AnimatePresence>

        {/* rows and columns banded by residue */}
        <AnimatePresence>
          {bands && (
            <motion.g key="band" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {Array.from({ length: n }).map((_, i) => {
                const a = (i + 1) % k;
                const c = HUE[order.indexOf(a) % k];
                return (
                  <g key={i}>
                    <rect x={GX - 9} y={gy(i + 1)} width={7} height={cs} fill={c} opacity={0.9} />
                    <rect x={gx(i + 1)} y={GY - 9} width={cs} height={7} fill={c} opacity={0.9} />
                  </g>
                );
              })}
              <text x={GX - 12} y={GY + GS + 12} textAnchor="start" fontSize="8" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                rows and columns by r mod {k}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* how many rows carry each residue */}
        <AnimatePresence>
          {bands && !isFinal && (
            <motion.g key="res" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {order.map((a, i) => (
                <motion.g key={a} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.3 + i * 0.25 }}>
                  <rect x={NX} y={50 + i * 30} width={12} height={12} rx={2} fill={HUE[i % k]} />
                  <text x={NX + 20} y={60 + i * 30} fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    {rowsOf[i]} with r ≡ {a}
                  </text>
                </motion.g>
              ))}
              <motion.text x={NX} y={158} fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                columns split the same way
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* every pairing of residues, and what it is worth */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {table.map((row, i) =>
                row.map((cell, j) => (
                  <motion.g
                    key={`${i}-${j}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 17, delay: 0.15 + (i + j) * 0.1 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <rect x={NX + 18 + j * 48} y={40 + i * 28} width={45} height={25} rx={4} fill={TINT[cell.L % k]} stroke={HUE[cell.L % k]} strokeWidth={1.2} />
                    <text x={NX + 18 + j * 48 + 22} y={40 + i * 28 + 16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={HUE[cell.L % k]} fontFamily={numberFont}>
                      {cell.v} {letters[cell.L]}
                    </text>
                  </motion.g>
                ))
              )}
              {order.map((a, i) => (
                <g key={`h${a}`}>
                  <text x={NX + 18 + i * 48 + 22} y={34} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                    c≡{a} ({rowsOf[i]})
                  </text>
                  <text x={NX + 14} y={40 + i * 28 + 16} textAnchor="end" fontSize="8" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                    r≡{a}
                  </text>
                </g>
              ))}
              {counts.map((v, i) => (
                <motion.text
                  key={`s${i}`}
                  x={NX}
                  y={148 + i * 20}
                  fontSize="13"
                  fontWeight="800"
                  fill={HUE[i % k]}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1 + i * 0.2 }}
                >
                  {letters[i]}: {table.flat().filter((t) => t.L === i).map((t) => t.v).join(" + ")} = {v}
                </motion.text>
              ))}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11.5,
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
            transition={{ delay: 1.7 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: consistent ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {consistent
              ? `${letters[best]} runs ahead — it takes both a ${rowsOf[0]}×${rowsOf[0]} and the ${rowsOf[k - 1]}×${rowsOf[k - 1]}; total ${total} = ${n}²`
              : `walking the grid and the table disagree`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.8 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
