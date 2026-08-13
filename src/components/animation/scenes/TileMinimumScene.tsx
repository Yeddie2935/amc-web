import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const GRID = "#e2e8f0";
const MARK = "#4338ca";
const WARN = "#f59e0b";
const WIN = "#16a34a";
const BAD = "#dc2626";
const TILE_FILL = ["#c7d2fe", "#fde68a", "#bae6fd", "#fbcfe8", "#ddd6fe"];
const TILE_EDGE = ["#4338ca", "#d97706", "#0284c7", "#db2777", "#7c3aed"];

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

type Tile = { w: number; h: number; r: number; c: number };

/**
 * Cover a rectangle with a few big tiles plus 1x1 fillers, using as few fillers
 * as possible. Two independent bounds meet: every big tile that fits covers an
 * even number of squares in each row, so an odd-width board keeps an odd number
 * of holes in every row (at least one each); and the holes are congruent to the
 * board's area modulo the tiles' common area. The answer is the smallest count
 * satisfying both, which the given packing then achieves. Which orientations fit,
 * both bounds and the packing's own hole count are computed, and the scene says
 * so loudly if the packing overlaps or misses the bound.
 * Data: { cols, rows, shapes:[{w,h}], solution:[{w,h,r,c}] }.
 */
export function TileMinimumScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const cols = Math.max(1, Math.round(num(data.cols, 7)));
  const rows = Math.max(1, Math.round(num(data.rows, 3)));
  const shapes = (Array.isArray(data.shapes) ? data.shapes : []).map((s) => {
    const o = (s ?? {}) as Record<string, unknown>;
    return { w: Math.round(num(o.w, 1)), h: Math.round(num(o.h, 1)) };
  });
  const solution: Tile[] = (Array.isArray(data.solution) ? data.solution : []).map((s) => {
    const o = (s ?? {}) as Record<string, unknown>;
    return { w: Math.round(num(o.w, 1)), h: Math.round(num(o.h, 1)), r: Math.round(num(o.r, 0)), c: Math.round(num(o.c, 0)) };
  });

  // every way a shape could be laid down, and whether the board has room for it
  const orients = shapes.flatMap((s) => (s.w === s.h ? [s] : [s, { w: s.h, h: s.w }]));
  const fitting = orients.filter((o) => o.w <= cols && o.h <= rows);
  const rejected = orients.filter((o) => !(o.w <= cols && o.h <= rows));

  // bound 1: a tile of width w puts w squares in each row it touches, so when
  // every fitting tile has even width an odd-width board cannot fill any row
  const area = rows * cols;
  const evenWidths = fitting.length > 0 && fitting.every((o) => o.w % 2 === 0);
  const rowBound = evenWidths && cols % 2 === 1 ? rows : 0;

  // bound 2: the big tiles all cover a multiple of g squares
  const g = fitting.length ? fitting.map((o) => o.w * o.h).reduce((a, b) => gcd(a, b)) : 1;
  const residue = ((area % g) + g) % g;
  const ladder: number[] = [];
  for (let m = residue; m <= area; m += g) ladder.push(m);
  const minHoles = ladder.find((m) => m >= rowBound) ?? area;

  // what the given packing actually achieves
  const covered = new Set<string>();
  let overlap = false;
  for (const t of solution)
    for (let i = 0; i < t.h; i++)
      for (let j = 0; j < t.w; j++) {
        const key = `${t.r + i},${t.c + j}`;
        if (covered.has(key) || t.r + i >= rows || t.c + j >= cols) overlap = true;
        covered.add(key);
      }
  const holes: [number, number][] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (!covered.has(`${r},${c}`)) holes.push([r, c]);
  const ok = !overlap && holes.length === minHoles;

  // two tiles on disjoint rows make the cleanest demonstration of the row rule
  const demoA = solution[0];
  const demoB = solution.find((t) => demoA && (t.r >= demoA.r + demoA.h || t.r + t.h <= demoA.r));
  const demo = [demoA, demoB].filter(Boolean) as Tile[];
  const rowCover = Array.from({ length: rows }, (_, r) =>
    demo.reduce((n, t) => n + (r >= t.r && r < t.r + t.h ? t.w : 0), 0)
  );

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showRows = !isFinal && step === 1;
  const showLadder = !isFinal && step === 2;

  // ---- geometry ----
  const W = 340;
  const cell = 28;
  const x0 = 26;
  const y0 = 56;
  const gw = cols * cell;
  const gh = rows * cell;
  const H = 208;
  const X = (c: number) => x0 + c * cell;
  const Y = (r: number) => y0 + r * cell;
  const sideX = x0 + gw + 12;
  // each legend chip is as wide as its own tile, so lay them out cumulatively
  const legendX: number[] = [];
  fitting.reduce((x, o) => {
    legendX.push(x);
    return x + o.w * 9 + 40;
  }, 30);
  legendX.push(legendX[legendX.length - 1] + (fitting.length ? fitting[fitting.length - 1].w * 9 + 40 : 0));

  const caption = isFinal
    ? `${solution.length} big tiles leave exactly ${holes.length} — and ${minHoles} was the floor`
    : step === 0
    ? `${rows} × ${cols} = ${area} squares${rejected.length ? `, and an upright ${rejected[0].w}×${rejected[0].h} will not fit` : ""}`
    : step === 1
    ? `every tile covers an even number in each row, so each row keeps an odd hole count`
    : `holes ≡ ${area} ≡ ${residue} (mod ${g}), and at least ${rowBound} — so at least ${minHoles}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* the tiles on offer */}
        {fitting.map((o, i) => {
          const s = 9;
          const bx = legendX[i];
          return (
            <motion.g
              key={`lg${i}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.08 }}
            >
              <rect x={bx} y={22 - (o.h * s) / 2} width={o.w * s} height={o.h * s} rx={2} fill={TILE_FILL[i % TILE_FILL.length]} stroke={TILE_EDGE[i % TILE_EDGE.length]} strokeWidth={1.4} />
              <text x={bx + o.w * s + 6} y={26} fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {o.w}×{o.h}
              </text>
            </motion.g>
          );
        })}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <rect x={legendX[fitting.length]} y={17} width={9} height={9} rx={2} fill="#dcfce7" stroke={WIN} strokeWidth={1.4} />
          <text x={legendX[fitting.length] + 15} y={26} fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
            1×1
          </text>
        </motion.g>

        {/* the board */}
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((__, c) => (
            <motion.rect
              key={`${r}-${c}`}
              x={X(c) + 0.5}
              y={Y(r) + 0.5}
              width={cell - 1}
              height={cell - 1}
              rx={2}
              fill="#f8fafc"
              stroke={GRID}
              strokeWidth={1}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 20, delay: (r + c) * 0.02 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          ))
        )}
        <rect x={x0} y={y0} width={gw} height={gh} rx={3} fill="none" stroke={INK} strokeWidth={1.6} />

        {/* an upright tile the board is too short for */}
        <AnimatePresence>
          {step === 0 && rejected.length > 0 && (
            <motion.g
              key="rej"
              initial={{ opacity: 0, y: -22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 190, damping: 17, delay: 0.45 }}
            >
              <rect
                x={sideX + 6}
                y={y0 + gh - rejected[0].h * cell}
                width={rejected[0].w * cell}
                height={rejected[0].h * cell}
                rx={3}
                fill="#fee2e2"
                stroke={BAD}
                strokeWidth={1.8}
              />
              <line x1={sideX} y1={y0} x2={sideX + 46} y2={y0} stroke={BAD} strokeWidth={1.4} strokeDasharray="4 3" />
              <text x={sideX + 6 + rejected[0].w * cell + 6} y={y0 + gh - 6} fontSize="11" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                {rejected[0].h} &gt; {rows}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* two tiles put down to show the row rule */}
        <AnimatePresence>
          {showRows &&
            demo.map((t, i) => (
              <motion.g
                key={`demo${i}`}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 190, damping: 18, delay: i * 0.25 }}
              >
                <rect
                  x={X(t.c) + 2}
                  y={Y(t.r) + 2}
                  width={t.w * cell - 4}
                  height={t.h * cell - 4}
                  rx={4}
                  fill={TILE_FILL[i % TILE_FILL.length]}
                  stroke={TILE_EDGE[i % TILE_EDGE.length]}
                  strokeWidth={2}
                />
              </motion.g>
            ))}
        </AnimatePresence>

        {/* per-row tally: an even cover always leaves an odd remainder */}
        <AnimatePresence>
          {showRows &&
            rowCover.map((cov, r) => (
              <motion.g
                key={`rw${r}`}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.5 + r * 0.14 }}
              >
                <text x={sideX} y={Y(r) + cell / 2 + 4} fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  {cols}−{cov}=
                </text>
                <text x={sideX + 52} y={Y(r) + cell / 2 + 4} fontSize="12" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                  {cols - cov}
                </text>
              </motion.g>
            ))}
        </AnimatePresence>
        <AnimatePresence>
          {showRows && (
            <motion.text
              key="rowsum"
              x={W / 2}
              y={y0 + gh + 22}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="800"
              fill={MARK}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.95 }}
            >
⇒ at least {rowBound} holes in all
            </motion.text>
          )}
        </AnimatePresence>

        {/* the counts the area allows, with the too-small ones ruled out */}
        <AnimatePresence>
          {showLadder && (
            <motion.g key="ladder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={W / 2} y={y0 + gh + 20} textAnchor="middle" fontSize="11" fontWeight="800" fill="#64748b" fontFamily={numberFont}>
                holes the area allows:
              </text>
              {ladder.map((m, i) => {
                const bw = 30;
                const bx = W / 2 - (ladder.length * (bw + 4)) / 2 + i * (bw + 4);
                const dead = m < rowBound;
                const pick = m === minHoles;
                return (
                  <motion.g
                    key={m}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 17, delay: 0.15 + i * 0.09 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <rect
                      x={bx}
                      y={y0 + gh + 28}
                      width={bw}
                      height={22}
                      rx={5}
                      fill={pick ? "#dcfce7" : dead ? "#fee2e2" : "#f8fafc"}
                      stroke={pick ? WIN : dead ? BAD : "#e2e8f0"}
                      strokeWidth={pick ? 2.2 : 1.2}
                    />
                    <text
                      x={bx + bw / 2}
                      y={y0 + gh + 43}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="800"
                      fill={pick ? "#166534" : dead ? BAD : "#94a3b8"}
                      fontFamily={numberFont}
                    >
                      {m}
                    </text>
                    {dead && <line x1={bx + 4} y1={y0 + gh + 39} x2={bx + bw - 4} y2={y0 + gh + 39} stroke={BAD} strokeWidth={2} />}
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the packing that reaches the floor */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="sol" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {solution.map((t, i) => (
                <motion.g
                  key={`t${i}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 17, delay: i * 0.16 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <rect
                    x={X(t.c) + 2}
                    y={Y(t.r) + 2}
                    width={t.w * cell - 4}
                    height={t.h * cell - 4}
                    rx={4}
                    fill={TILE_FILL[i % TILE_FILL.length]}
                    stroke={TILE_EDGE[i % TILE_EDGE.length]}
                    strokeWidth={2}
                  />
                </motion.g>
              ))}
              {holes.map(([r, c], i) => (
                <motion.rect
                  key={`h${r}-${c}`}
                  x={X(c) + 4}
                  y={Y(r) + 4}
                  width={cell - 8}
                  height={cell - 8}
                  rx={3}
                  fill="#dcfce7"
                  stroke={WIN}
                  strokeWidth={2}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.7 + i * 0.09 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              ))}
              <motion.text
                x={W / 2}
                y={y0 + gh + 26}
                textAnchor="middle"
                fontSize="13"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {holes.length} unit tiles
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
            transition={{ delay: 0.4 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: ok ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {ok
              ? `holes per row: ${Array.from({ length: rows }, (_, r) => holes.filter((h) => h[0] === r).length).join(", ")} — odd, as promised`
              : overlap
              ? `the given packing overlaps or runs off the board`
              : `the given packing leaves ${holes.length}, not the bound ${minHoles}`}
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
