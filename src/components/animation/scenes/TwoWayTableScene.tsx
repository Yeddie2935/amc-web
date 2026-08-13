import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const LINE = "#cbd5e1";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** A sneaker: the raised heel marks a high-top, the fill marks its colour. */
function Shoe({ x, y, fill, high }: { x: number; y: number; fill: string; high: boolean }) {
  const back = high ? 2 : 8;
  return (
    <g>
      <path
        d={`M ${x},${y + 15} L ${x},${y + back} L ${x + 8},${y + back} L ${x + 9},${y + 9} L ${x + 22},${y + 12} L ${x + 22},${y + 15} Z`}
        fill={fill}
        stroke="#64748b"
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <rect x={x - 1} y={y + 15} width={24} height={4} rx={2} fill="#334155" />
    </g>
  );
}

/**
 * Two overlapping splits of one collection (colour and style), asking how small
 * one of the four combinations can be. The two splits fix all four margins, and
 * then a single cell fixes the whole table — the other three are just the margins
 * minus it. Pushing the chosen cell down eventually drives the *opposite* cell
 * negative, and that is the bound: the cell cannot fall below
 * row + column − total. Margins, the feasible range, the binding cell and the
 * reduced fraction are all computed, and the finished table is re-checked against
 * every margin.
 * Data: { total, rows:[{label,numer,den,color}], cols:[{label,numer,den}], minimize? }.
 */
export function TwoWayTableScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = Math.round(num(data.total, 15));
  const rowsIn = Array.isArray(data.rows) ? data.rows : [];
  const colsIn = Array.isArray(data.cols) ? data.cols : [];
  const readSide = (arr: unknown[], fallback: string[]) =>
    arr.map((o, i) => {
      const r = (o ?? {}) as Record<string, unknown>;
      return {
        label: r.label != null ? String(r.label) : fallback[i] ?? "?",
        numer: num(r.numer, NaN),
        den: num(r.den, NaN),
        color: r.color != null ? String(r.color) : i === 0 ? "#ef4444" : "#ffffff",
      };
    });
  const rows = readSide(rowsIn, ["A", "B"]);
  const cols = readSide(colsIn, ["X", "Y"]);
  const minimize = data.minimize !== false;

  const r0 = Number.isFinite(rows[0]?.numer) ? Math.round((total * rows[0].numer) / rows[0].den) : 0;
  const r1 = total - r0;
  const c0 = Number.isFinite(cols[0]?.numer) ? Math.round((total * cols[0].numer) / cols[0].den) : 0;
  const c1 = total - c0;

  // one cell fixes the table; feasibility pins it into a range
  const off = r0 + c0 - total; // the opposite cell is x - off
  const lo = Math.max(0, off);
  const hi = Math.min(r0, c0);
  const x = minimize ? lo : hi;
  const cellAt = (v: number) => [v, r0 - v, c0 - v, total - r0 - c0 + v];
  const [a, b, c, d] = cellAt(x);
  const ok = [a, b, c, d].every((v) => v >= 0) && a + b === r0 && c + d === r1 && a + c === c0 && b + d === c1;

  const g = gcd(x, total) || 1;
  const fracStr = x === 0 ? "0" : `${x / g}/${total / g}`;
  const agrees = problem.shortAnswer == null || String(problem.shortAnswer).replace(/\s/g, "") === fracStr;

  // the candidates just below and above the bound, to show what breaks
  const ladder: number[] = [];
  for (let v = lo + 2; v >= lo - 1; v--) if (v >= 0 || v === lo - 1) ladder.push(v);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showVars = !isFinal && step === 1;
  const showLadder = !isFinal && step === 2;

  // ---- geometry ----
  const W = 340;
  const H = 196;
  const lx = 4;
  const cw = 82;
  const cx0 = 46;
  const cx1 = cx0 + cw;
  const totX = cx1 + cw;
  const ch = 62;
  const cy0 = 38;
  const cy1 = cy0 + ch;
  const totY = cy1 + ch;
  const panelX = 258;

  const oppExpr = off >= 0 ? `x − ${off}` : `x + ${-off}`;
  const cellVal = (i: number) =>
    showVars
      ? ["x", `${r0} − x`, `${c0} − x`, oppExpr][i]
      : isFinal
      ? String([a, b, c, d][i])
      : "";

  const caption = isFinal
    ? `${x} of the ${total} pairs are ${rows[0].label} ${cols[0].label} — ${fracStr}`
    : step === 0
    ? `${rows[0].label} ${r0}, ${rows[1].label} ${r1}; ${cols[0].label} ${c0}, ${cols[1].label} ${c1}`
    : showVars
    ? `pick x, and the other three cells follow from the margins`
    : `${oppExpr} cannot be negative, so x is at least ${lo}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* column and row headings */}
        {[cols[0].label, cols[1].label].map((t, i) => (
          <text key={`ch${i}`} x={cx0 + i * cw + cw / 2} y={cy0 - 6} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
            {t}
          </text>
        ))}
        {[rows[0].label, rows[1].label].map((t, i) => (
          <text key={`rh${i}`} x={lx} y={cy0 + i * ch + ch / 2 + 3} fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
            {t}
          </text>
        ))}

        {/* the four cells */}
        {[0, 1, 2, 3].map((i) => {
          const col = i % 2;
          const row = i < 2 ? 0 : 1;
          const gx = cx0 + col * cw;
          const gy = cy0 + row * ch;
          const target = i === 0;
          const binding = i === 3;
          const shown = cellVal(i);
          return (
            <g key={i}>
              <rect
                x={gx}
                y={gy}
                width={cw}
                height={ch}
                fill={target ? "#eef2ff" : binding && (showLadder || showVars) ? "#fff7ed" : "#f8fafc"}
                stroke={LINE}
                strokeWidth={1.2}
              />
              <AnimatePresence>
                {(showVars || isFinal) && (
                  <motion.text
                    key={`v${showVars}`}
                    x={gx + cw / 2}
                    y={gy + ch / 2 + 5}
                    textAnchor="middle"
                    fontSize={showVars ? "14" : "17"}
                    fontWeight="800"
                    fill={target ? MARK : binding ? "#c2410c" : INK}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: isFinal ? 0.22 : 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 17, delay: i * 0.1 }}
                  >
                    {shown}
                  </motion.text>
                )}
              </AnimatePresence>
            </g>
          );
        })}

        {/* the real pairs, once the table is settled */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="shoes" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { n: a, col: 0, row: 0 },
                { n: b, col: 1, row: 0 },
                { n: c, col: 0, row: 1 },
                { n: d, col: 1, row: 1 },
              ].map((cell, ci) =>
                Array.from({ length: cell.n }).map((_, k) => (
                  <motion.g
                    key={`${ci}-${k}`}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 17, delay: 0.25 + ci * 0.1 + k * 0.05 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <Shoe
                      x={cx0 + cell.col * cw + 5 + (k % 3) * 26}
                      y={cy0 + cell.row * ch + 8 + Math.floor(k / 3) * 26}
                      fill={rows[cell.row].color}
                      high={cell.col === 0}
                    />
                  </motion.g>
                ))
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* margins */}
        {[r0, r1].map((v, i) => (
          <motion.text
            key={`rt${i}`}
            x={totX + 18}
            y={cy0 + i * ch + ch / 2 + 4}
            textAnchor="middle"
            fontSize="13"
            fontWeight="800"
            fill={MARK}
            fontFamily={numberFont}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.1 + i * 0.1 }}
          >
            {v}
          </motion.text>
        ))}
        {[c0, c1].map((v, i) => (
          <motion.text
            key={`ct${i}`}
            x={cx0 + i * cw + cw / 2}
            y={totY + 14}
            textAnchor="middle"
            fontSize="13"
            fontWeight="800"
            fill={MARK}
            fontFamily={numberFont}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.3 + i * 0.1 }}
          >
            {v}
          </motion.text>
        ))}
        <line x1={cx0} y1={totY} x2={totX} y2={totY} stroke={INK} strokeWidth={1.4} />
        <line x1={totX} y1={cy0} x2={totX} y2={totY} stroke={INK} strokeWidth={1.4} />
        <text x={totX + 18} y={totY + 14} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {total}
        </text>

        {/* how each margin was found */}
        {step === 0 && !isFinal && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <text x={panelX} y={cy0 + 16} fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
              {rows[0].numer}/{rows[0].den} × {total}
            </text>
            <text x={panelX} y={cy0 + 28} fontSize="9" fontWeight="800" fill={MARK} fontFamily={numberFont}>
              = {r0}
            </text>
            <text x={panelX} y={cy0 + 52} fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
              {cols[0].numer}/{cols[0].den} × {total}
            </text>
            <text x={panelX} y={cy0 + 64} fontSize="9" fontWeight="800" fill={MARK} fontFamily={numberFont}>
              = {c0}
            </text>
          </motion.g>
        )}

        {/* try smaller values of x and watch the opposite cell break */}
        <AnimatePresence>
          {showLadder && (
            <motion.g key="lad" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={panelX} y={cy0 - 6} fontSize="9" fontWeight="800" fill="#94a3b8" fontFamily={numberFont}>
                x → x−{off}
              </text>
              {ladder.map((v, i) => {
                const w = v - off;
                const dead = w < 0;
                return (
                  <motion.g
                    key={v}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.15 + i * 0.14 }}
                  >
                    <rect x={panelX} y={cy0 + i * 22} width={70} height={18} rx={5} fill={dead ? "#fee2e2" : v === lo ? "#dcfce7" : "#f8fafc"} stroke={dead ? BAD : v === lo ? WIN : "#e2e8f0"} strokeWidth={v === lo || dead ? 1.8 : 1} />
                    <text x={panelX + 8} y={cy0 + i * 22 + 13} fontSize="10" fontWeight="800" fill={dead ? BAD : v === lo ? "#166534" : "#94a3b8"} fontFamily={numberFont}>
                      {v} → {w}
                    </text>
                    {dead && <line x1={panelX + 4} y1={cy0 + i * 22 + 9} x2={panelX + 66} y2={cy0 + i * 22 + 9} stroke={BAD} strokeWidth={1.8} />}
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the answer as a fraction of the whole collection */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="fr" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.8 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={panelX - 4} y={cy0 + 18} width={80} height={26} rx={8} fill="#dcfce7" stroke={WIN} strokeWidth={1.8} />
              <text x={panelX + 36} y={cy0 + 36} textAnchor="middle" fontSize="15" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                {fracStr}
              </text>
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
          color: isFinal ? "#166534" : showLadder ? "#c2410c" : "#4338ca",
          background: isFinal ? "#dcfce7" : showLadder ? "#fff7ed" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showLadder ? "#fed7aa" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {showLadder && (
          <motion.span
            key="pig"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            only {c1} {cols[1].label} slots for {r0} {rows[0].label} pairs — at least {lo} must be {cols[0].label}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && ok ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees && ok ? `${a} + ${b} + ${c} + ${d} = ${total}, and every margin matches` : `this table does not satisfy the margins`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
