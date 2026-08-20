import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, num } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const MUTE = "#94a3b8";
const RULE = "#cbd5e1";
const TRI = "#4338ca";
const CIR = "#ea580c";

const W = 380;
const H = 268;

const tidy = (v: number) => String(v).replace(/-/g, "−");

function Sym({ kind, cx, cy, r }: { kind: 0 | 1; cx: number; cy: number; r: number }) {
  if (kind === 1) return <circle cx={cx} cy={cy} r={r * 0.82} fill="none" stroke={CIR} strokeWidth={Math.max(1, r * 0.22)} />;
  const p = `${cx},${cy - r} ${cx - r * 0.92},${cy + r * 0.7} ${cx + r * 0.92},${cy + r * 0.7}`;
  return <polygon points={p} fill="none" stroke={TRI} strokeWidth={Math.max(1, r * 0.22)} strokeLinejoin="round" />;
}

/**
 * An n x n grid filled with two symbols, counting the fillings that contain a
 * **full line of each**. The counting looks like it needs inclusion–exclusion
 * over eight tic-tac-toe lines, and the whole problem collapses once you notice
 * the two lines **cannot share a cell** — that cell would have to carry both
 * symbols — so they must be *disjoint*, and in a 3 x 3 grid the only disjoint
 * pairs of lines are two rows or two columns. That one fact does two jobs at
 * once: it **eliminates the diagonals entirely** (a diagonal meets every row,
 * every column and the other diagonal), and it proves the row family and the
 * column family can never both occur, which is exactly what licenses adding
 * their counts instead of inclusion–excluding them.
 * The scene refuses to assert any of it. It builds all the lines, tests **every
 * unordered pair for disjointness** and reports the tally by kind, so "only
 * parallel pairs survive" is discovered on screen; it counts one family by
 * typing each row as all-first, all-second, or mixed (the 2^n − 2 mixed patterns
 * are drawn out, so the multiplier is counted rather than quoted) and grouping
 * the type-vectors that carry at least one of each; and it **brute-forces all
 * 2^(n²) fillings** as a completely independent check that the family counts add
 * to the total. The closing beat prices the two natural slips — stopping at one
 * family, and doubling the uncorrected 3·2·2^n — and names the answer choice each
 * one hits.
 * Data: { size, sample: ["010", "010", "001"] } with 0 the first symbol.
 */
export function LinePairGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(2, Math.min(4, num(data.size ?? 3)));
  const sample = (Array.isArray(data.sample) ? data.sample : []).map((r) => String(r));
  const cellOf = (r: number, c: number) => (sample[r]?.[c] === "1" ? 1 : 0) as 0 | 1;

  // every line of the grid, as a list of cells and as a bitmask
  const idx = (r: number, c: number) => r * n + c;
  const lines: { name: string; kind: "row" | "col" | "diag"; cells: [number, number][] }[] = [];
  for (let r = 0; r < n; r++) lines.push({ name: `row ${r + 1}`, kind: "row", cells: Array.from({ length: n }, (_, c) => [r, c]) });
  for (let c = 0; c < n; c++) lines.push({ name: `col ${c + 1}`, kind: "col", cells: Array.from({ length: n }, (_, r) => [r, c]) });
  lines.push({ name: "diagonal ＼", kind: "diag", cells: Array.from({ length: n }, (_, i) => [i, i]) });
  lines.push({ name: "diagonal ／", kind: "diag", cells: Array.from({ length: n }, (_, i) => [i, n - 1 - i]) });
  const maskOf = (cells: [number, number][]) => cells.reduce((m, [r, c]) => m | (1 << idx(r, c)), 0);
  const masks = lines.map((L) => maskOf(L.cells));

  // which pairs of lines could ever hold the two different symbols?
  const pairKind = (a: (typeof lines)[0], b: (typeof lines)[0]) =>
    a.kind === "diag" || b.kind === "diag" ? "with a diagonal" : a.kind === b.kind ? (a.kind === "row" ? "two rows" : "two columns") : "a row and a column";
  const tally = new Map<string, { total: number; free: number }>();
  for (let i = 0; i < lines.length; i++)
    for (let j = i + 1; j < lines.length; j++) {
      const k = pairKind(lines[i], lines[j]);
      const cur = tally.get(k) ?? { total: 0, free: 0 };
      cur.total++;
      if ((masks[i] & masks[j]) === 0) cur.free++;
      tally.set(k, cur);
    }
  const tallyRows = [...tally.entries()].sort((a, b) => (b[1].free > 0 ? 1 : 0) - (a[1].free > 0 ? 1 : 0));
  const diagFree = (tally.get("with a diagonal")?.free ?? 0) === 0;

  // one family: type every row as all-first, all-second, or mixed
  const mixed = Math.pow(2, n) - 2;
  const fact = (k: number) => (k <= 1 ? 1 : k * fact(k - 1));
  const groups: { a: number; o: number; m: number; orders: number; ways: number }[] = [];
  for (let a = 1; a <= n; a++)
    for (let o = 1; a + o <= n; o++) {
      const m = n - a - o;
      const orders = fact(n) / (fact(a) * fact(o) * fact(m));
      groups.push({ a, o, m, orders, ways: orders * Math.pow(mixed, m) });
    }
  groups.sort((x, y) => y.ways - x.ways);
  const family = groups.reduce((s, g) => s + g.ways, 0);

  // and, independently, every filling of the grid
  const cells = n * n;
  let brute = 0;
  if (cells <= 16) {
    for (let cfg = 0; cfg < 1 << cells; cfg++) {
      let hasA = false;
      let hasB = false;
      for (let i = 0; i < masks.length; i++) {
        if ((cfg & masks[i]) === 0) hasA = true;
        else if ((cfg & masks[i]) === masks[i]) hasB = true;
      }
      if (hasA && hasB) brute++;
    }
  }
  const total = family * 2;
  const matches = brute === total;

  // does the problem's own sample qualify?
  const sampleCfg = sample.length === n ? Array.from({ length: cells }, (_, i) => cellOf(Math.floor(i / n), i % n)).reduce((m, v, i) => m | (v << i), 0) : -1;
  const sampleLineA = sampleCfg >= 0 ? lines.findIndex((_, i) => (sampleCfg & masks[i]) === 0) : -1;
  const sampleLineB = sampleCfg >= 0 ? lines.findIndex((_, i) => (sampleCfg & masks[i]) === masks[i]) : -1;

  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value));
  const letterFor = (v: number) => opts.find((o) => o.value === v)?.label;
  const agrees = !problem.answer || letterFor(total) === problem.answer;
  // stopping at one family, and doubling the uncorrected n·(n−1)·2^n
  const rawFamily = n * (n - 1) * Math.pow(2, n);
  const slips = [
    { v: family, why: "only counting rows" },
    { v: rawFamily * 2, why: "never removing the double-counted all-uniform rows" },
  ]
    .map((s) => ({ ...s, letter: letterFor(s.v) }))
    .filter((s) => s.letter && s.v !== total);

  const isFinal = step >= totalSteps - 1;
  const phase = isFinal ? 3 : Math.min(2, step);

  // the crossing that cannot happen: a row of one symbol, a column of the other
  const rowPick = Math.floor(n / 2);
  const colPick = Math.floor(n / 2);

  const C = 40;
  const gx = (c: number, x0: number) => x0 + c * C;
  const gy = (r: number, y0: number) => 42 + r * C;

  const caption =
    phase === 0
      ? sampleLineB < 0
        ? `the sample has a ${"△"} line (${lines[sampleLineA]?.name}) but no ${"○"} line — it does not count`
        : `the sample already has both lines`
      : phase === 1
      ? `the two lines share no cell, so they are ${tallyRows.filter((t) => t[1].free > 0).map((t) => t[0]).join(" or ")}`
      : phase === 2
      ? `type each row: all △, all ○, or one of the ${tidy(mixed)} mixed rows`
      : `rows and columns can never both happen, so the counts simply add`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        <AnimatePresence mode="wait">
          <motion.g key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* the sample the contest prints */}
            {phase === 0 && (
              <>
                {Array.from({ length: n }).map((_, r) =>
                  Array.from({ length: n }).map((__, c) => (
                    <rect key={`s${r}${c}`} x={gx(c, 24)} y={gy(r, 0)} width={C} height={C} fill="#fff" stroke={RULE} strokeWidth={1.2} />
                  ))
                )}
                {sampleLineA >= 0 && (
                  <motion.rect
                    x={gx(Math.min(...lines[sampleLineA].cells.map((p) => p[1])), 24)}
                    y={gy(Math.min(...lines[sampleLineA].cells.map((p) => p[0])), 0)}
                    width={lines[sampleLineA].kind === "row" ? n * C : C}
                    height={lines[sampleLineA].kind === "row" ? C : n * C}
                    fill="#eef2ff"
                    stroke={TRI}
                    strokeWidth={2}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  />
                )}
                {Array.from({ length: n }).map((_, r) =>
                  Array.from({ length: n }).map((__, c) => (
                    <motion.g
                      key={`g${r}${c}`}
                      initial={{ opacity: 0, scale: 0.3 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.15 + (r * n + c) * 0.06 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <Sym kind={cellOf(r, c)} cx={gx(c, 24) + C / 2} cy={gy(r, 0) + C / 2} r={12} />
                    </motion.g>
                  ))
                )}

                <text x={166} y={58} fontSize="10" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                  we need both
                </text>
                <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1.2 }}>
                  <Sym kind={0} cx={176} cy={82} r={9} />
                  <text x={192} y={86} fontSize="10.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                    line ✓ {sampleLineA >= 0 ? lines[sampleLineA].name : ""}
                  </text>
                </motion.g>
                <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1.7 }}>
                  <Sym kind={1} cx={176} cy={108} r={9} />
                  <text x={192} y={112} fontSize="10.5" fontWeight="800" fill={sampleLineB < 0 ? BAD : WIN} fontFamily={numberFont}>
                    line {sampleLineB < 0 ? "✗ none" : `✓ ${lines[sampleLineB].name}`}
                  </text>
                </motion.g>
                <motion.text x={166} y={140} fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
                  so this one is not counted
                </motion.text>
                <motion.text x={166} y={158} fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }}>
                  {tidy(lines.length)} lines · {tidy(Math.pow(2, cells))} fillings
                </motion.text>

                <text x={W / 2} y={196} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  how many of the {tidy(Math.pow(2, cells))} fillings have a line of each?
                </text>
              </>
            )}

            {/* the two lines cannot cross */}
            {phase === 1 && (
              <>
                {Array.from({ length: n }).map((_, r) =>
                  Array.from({ length: n }).map((__, c) => (
                    <rect key={`c${r}${c}`} x={gx(c, 14)} y={gy(r, 0)} width={C} height={C} fill="#fff" stroke={RULE} strokeWidth={1.2} />
                  ))
                )}
                <motion.rect
                  x={gx(0, 14)}
                  y={gy(rowPick, 0)}
                  width={n * C}
                  height={C}
                  fill="#eef2ff"
                  stroke={TRI}
                  strokeWidth={2}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.2 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
                <motion.rect
                  x={gx(colPick, 14)}
                  y={gy(0, 0)}
                  width={C}
                  height={n * C}
                  fill="#fff7ed"
                  fillOpacity={0.85}
                  stroke={CIR}
                  strokeWidth={2}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.7 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
                {Array.from({ length: n }).map((_, c) =>
                  c === colPick ? null : (
                    <motion.g key={`t${c}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                      <Sym kind={0} cx={gx(c, 14) + C / 2} cy={gy(rowPick, 0) + C / 2} r={12} />
                    </motion.g>
                  )
                )}
                {Array.from({ length: n }).map((_, r) =>
                  r === rowPick ? null : (
                    <motion.g key={`o${r}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                      <Sym kind={1} cx={gx(colPick, 14) + C / 2} cy={gy(r, 0) + C / 2} r={12} />
                    </motion.g>
                  )
                )}
                {/* the contested cell */}
                <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.4 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <rect x={gx(colPick, 14)} y={gy(rowPick, 0)} width={C} height={C} fill="#fee2e2" stroke={BAD} strokeWidth={2.2} />
                  <Sym kind={0} cx={gx(colPick, 14) + C / 2} cy={gy(rowPick, 0) + C / 2} r={12} />
                  <Sym kind={1} cx={gx(colPick, 14) + C / 2} cy={gy(rowPick, 0) + C / 2} r={12} />
                  <line
                    x1={gx(colPick, 14) + 5}
                    y1={gy(rowPick, 0) + 5}
                    x2={gx(colPick, 14) + C - 5}
                    y2={gy(rowPick, 0) + C - 5}
                    stroke={BAD}
                    strokeWidth={2.4}
                  />
                </motion.g>
                <motion.text x={14 + (n * C) / 2} y={42 + n * C + 15} textAnchor="middle" fontSize="9" fontWeight="800" fill={BAD} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
                  one cell, two symbols
                </motion.text>

                {/* so which pairs of lines are actually free of each other? */}
                <text x={162} y={40} fontSize="9" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                  pairs of lines sharing no cell
                </text>
                {tallyRows.map(([k, v], i) => (
                  <motion.g key={k} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1.9 + i * 0.22 }}>
                    <text x={162} y={60 + i * 22} fontSize="9.5" fontWeight="800" fill={v.free > 0 ? WIN : BAD} fontFamily={numberFont}>
                      {v.free > 0 ? "✓" : "✗"} {k}
                    </text>
                    <text x={162} y={71 + i * 22} fontSize="8" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                      {tidy(v.free)} of {tidy(v.total)} pairs
                    </text>
                  </motion.g>
                ))}
                <motion.text x={162} y={72 + tallyRows.length * 22} fontSize="9" fontWeight="800" fill={diagFree ? MUTE : BAD} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
                  {diagFree ? "no diagonal ever qualifies" : "a diagonal can qualify"}
                </motion.text>
              </>
            )}

            {/* counting one family */}
            {phase === 2 && (
              <>
                <text x={W / 2} y={26} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                  two of the {tidy(n)} rows must be uniform, one △ and one ○
                </text>
                {groups.map((g, i) => {
                  const cx = 66 + i * 124;
                  const mc = 20;
                  const types = [...Array(g.a).fill(0), ...Array(g.o).fill(1), ...Array(g.m).fill(2)];
                  return (
                    <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.3 + i * 0.4 }}>
                      {types.map((t, r) =>
                        Array.from({ length: n }).map((_, c) => (
                          <g key={`${r}${c}`}>
                            <rect
                              x={cx - (n * mc) / 2 + c * mc}
                              y={44 + r * mc}
                              width={mc}
                              height={mc}
                              fill={t === 2 ? "#f8fafc" : "#fff"}
                              stroke={t === 2 ? RULE : t === 0 ? TRI : CIR}
                              strokeWidth={1}
                              strokeDasharray={t === 2 ? "2 2" : undefined}
                            />
                            {t === 2 ? (
                              <text x={cx - (n * mc) / 2 + c * mc + mc / 2} y={44 + r * mc + mc / 2 + 3.5} textAnchor="middle" fontSize="9" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                                ?
                              </text>
                            ) : (
                              <Sym kind={t as 0 | 1} cx={cx - (n * mc) / 2 + c * mc + mc / 2} cy={44 + r * mc + mc / 2} r={6} />
                            )}
                          </g>
                        ))
                      )}
                      <text x={cx} y={44 + n * mc + 16} textAnchor="middle" fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                        {tidy(g.orders)} order{g.orders === 1 ? "" : "s"}
                        {g.m > 0 ? ` × ${tidy(mixed)}${g.m > 1 ? `^${g.m}` : ""}` : ""}
                      </text>
                      <text x={cx} y={44 + n * mc + 31} textAnchor="middle" fontSize="13" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                        {tidy(g.ways)}
                      </text>
                    </motion.g>
                  );
                })}

                {/* the mixed rows, drawn so the multiplier is counted not quoted */}
                <text x={W / 2} y={176} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                  a row is one of {tidy(Math.pow(2, n))} patterns — {tidy(mixed)} of them are mixed
                </text>
                {Array.from({ length: Math.pow(2, n) }).map((_, p) => {
                  const uniform = p === 0 || p === Math.pow(2, n) - 1;
                  const sw = 9;
                  const bw = n * sw + 5;
                  const x0 = W / 2 - (Math.pow(2, n) * bw) / 2 + p * bw;
                  return (
                    <motion.g key={`p${p}`} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 1.6 + p * 0.07 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                      {Array.from({ length: n }).map((__, c) => (
                        <rect key={c} x={x0 + c * sw} y={184} width={sw} height={sw} fill={uniform ? "#f1f5f9" : "#fff"} stroke={uniform ? MUTE : RULE} strokeWidth={0.8} />
                      ))}
                      {Array.from({ length: n }).map((__, c) => (
                        <Sym key={`s${c}`} kind={((p >> c) & 1) as 0 | 1} cx={x0 + c * sw + sw / 2} cy={188.5} r={2.9} />
                      ))}
                    </motion.g>
                  );
                })}

                <motion.text
                  x={W / 2}
                  y={216}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="800"
                  fill={MARK}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15, delay: 2.6 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  {groups.map((g) => tidy(g.ways)).join(" + ")} = {tidy(family)} with two rows
                </motion.text>
              </>
            )}

            {/* the families are exclusive, so add */}
            {phase === 3 && (
              <>
                {[0, 1].map((fam) => {
                  const x0 = fam === 0 ? 22 : 226;
                  const mc = 44;
                  return (
                    <motion.g key={fam} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 + fam * 0.35 }}>
                      {Array.from({ length: n }).map((_, r) =>
                        Array.from({ length: n }).map((__, c) => {
                          const line = fam === 0 ? r : c;
                          const t = line === 0 ? 0 : line === 1 ? 1 : 2;
                          return (
                            <g key={`${r}${c}`}>
                              <rect
                                x={x0 + c * mc}
                                y={44 + r * mc}
                                width={mc}
                                height={mc}
                                fill={t === 2 ? "#f8fafc" : t === 0 ? "#eef2ff" : "#fff7ed"}
                                stroke={t === 2 ? RULE : t === 0 ? TRI : CIR}
                                strokeWidth={1.1}
                                strokeDasharray={t === 2 ? "2 2" : undefined}
                              />
                              {t === 2 ? (
                                <text x={x0 + c * mc + mc / 2} y={44 + r * mc + mc / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                                  ?
                                </text>
                              ) : (
                                <Sym kind={t as 0 | 1} cx={x0 + c * mc + mc / 2} cy={44 + r * mc + mc / 2} r={12} />
                              )}
                            </g>
                          );
                        })
                      )}
                      <text x={x0 + (n * mc) / 2} y={36} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                        {fam === 0 ? "two rows" : "two columns"}
                      </text>
                      <text x={x0 + (n * mc) / 2} y={44 + n * mc + 18} textAnchor="middle" fontSize="15" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                        {tidy(family)}
                      </text>
                    </motion.g>
                  );
                })}

                <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <text x={W / 2} y={100} textAnchor="middle" fontSize="17" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    +
                  </text>
                  <text x={W / 2} y={126} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                    never
                  </text>
                  <text x={W / 2} y={136} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                    both
                  </text>
                </motion.g>

                <motion.text
                  x={W / 2}
                  y={220}
                  textAnchor="middle"
                  fontSize="19"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.6 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  {tidy(family)} + {tidy(family)} = {tidy(total)}
                </motion.text>
                <motion.text x={W / 2} y={240} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={matches ? MUTE : BAD} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
                  {matches
                    ? `all ${tidy(Math.pow(2, cells))} fillings checked one by one: ${tidy(brute)} ✓`
                    : `checking every filling gives ${tidy(brute)}, not ${tidy(total)}`}
                </motion.text>
              </>
            )}
          </motion.g>
        </AnimatePresence>
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
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
            transition={{ delay: 2.4 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: matches && agrees ? MUTE : BAD, textAlign: "center", maxWidth: 380 }}
          >
            {!matches
              ? `the two routes disagree: ${tidy(total)} against ${tidy(brute)}`
              : !agrees
              ? `this gives ${tidy(total)}, not the stored answer`
              : slips.length
              ? `slips: ${slips.map((s) => `${s.why} gives ${tidy(s.v)} = (${s.letter})`).join(", ")}`
              : `every one of the ${tidy(Math.pow(2, cells))} fillings was checked`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
