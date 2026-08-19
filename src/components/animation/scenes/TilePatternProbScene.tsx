import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const GRAY = "#a8a8a8";
const BLOCK = ["#4338ca", "#0d9488", "#b45309", "#be185d"];

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** Corner holding the gray half: 0 = top-left, 1 = top-right, 2 = bottom-left, 3 = bottom-right. */
const CORNER = ["top-left", "top-right", "bottom-left", "bottom-right"];
/** Clockwise turn that carries the base tile onto each orientation. */
const ANGLE = [0, 90, 270, 180];

function triPoints(x: number, y: number, s: number, k: number) {
  const pts: Record<number, number[][]> = {
    0: [[x, y], [x + s, y], [x, y + s]],
    1: [[x + s, y], [x, y], [x + s, y + s]],
    2: [[x, y + s], [x, y], [x + s, y + s]],
    3: [[x + s, y + s], [x + s, y], [x, y + s]],
  };
  return pts[k].map((p) => p.join(",")).join(" ");
}

/**
 * A grid whose every square is filled independently with one of a few rotations
 * of the same tile, asking the chance some window of the grid shows a particular
 * pattern. A specific window needs each of its cells in one exact orientation,
 * so it has probability `(1/options)^(window²)` — and the whole question is then
 * whether the windows can double up. They cannot, and the reason is a single
 * square: the **centre cell belongs to every window**, and each window wants it
 * pointing at its own middle, which are all different directions. So the centre
 * tile alone *names* the only window that could possibly hold the pattern — the
 * scene spins it through its orientations and lights the matching window each
 * time, which is the whole exclusivity argument in one square. With the events
 * disjoint the chances simply add. Beats: the tile set and a random tiling; the
 * pattern assembled by **rotating each tile into place about its own cell
 * centre** (a right triangle's bounding box is exactly its cell, so Motion's
 * own-centre pivot is the cell centre); the centre square selecting a window;
 * the sum. The union is computed by exact inclusion–exclusion over the windows,
 * every pairwise conflict is discovered rather than asserted, and the sample
 * tiling is checked to contain no copy of the pattern; data
 * `{ grid, options, window, pattern: [...], sample?: [...] }`.
 */
export function TilePatternProbScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const G = Math.max(2, Math.min(5, Math.round(num(data.grid, 3))));
  const K = Math.max(2, Math.min(8, Math.round(num(data.options, 4))));
  const Wn = Math.max(2, Math.min(G, Math.round(num(data.window, 2))));
  const pattern = (Array.isArray(data.pattern) ? data.pattern : [3, 2, 1, 0]).map((v) => Math.round(num(v, 0)));
  const sample = (Array.isArray(data.sample) ? data.sample : []).map((v) => Math.round(num(v, 0)));

  // ---- the windows and what each demands ----
  const wins: { r: number; c: number }[] = [];
  for (let r = 0; r + Wn <= G; r++) for (let c = 0; c + Wn <= G; c++) wins.push({ r, c });
  const demands = (w: { r: number; c: number }) =>
    pattern.map((p, i) => ({ r: w.r + Math.floor(i / Wn), c: w.c + (i % Wn), need: p }));

  // ---- exact inclusion–exclusion over the windows ----
  let union = 0;
  let anyPairFits = false;
  for (let mask = 1; mask < 1 << wins.length; mask++) {
    const need = new Map<number, number>();
    let fits = true;
    let bits = 0;
    for (let i = 0; i < wins.length; i++) {
      if (!(mask & (1 << i))) continue;
      bits++;
      for (const d of demands(wins[i])) {
        const key = d.r * G + d.c;
        const had = need.get(key);
        if (had != null && had !== d.need) fits = false;
        else need.set(key, d.need);
      }
    }
    if (!fits) continue;
    if (bits >= 2) anyPairFits = true;
    union += (bits % 2 ? 1 : -1) * Math.pow(K, G * G - need.size);
  }
  const totalTilings = Math.pow(K, G * G);
  const g = gcd(union, totalTilings) || 1;
  const pn = union / g;
  const pd = totalTilings / g;
  const perWindow = Math.pow(K, Wn * Wn);

  // ---- the square every window shares, and what each wants of it ----
  const mid = { r: Math.floor(G / 2), c: Math.floor(G / 2) };
  const wantsAtMid = wins.map((w) => demands(w).find((d) => d.r === mid.r && d.c === mid.c)?.need ?? -1);
  const midDecides = wantsAtMid.every((v, i) => v >= 0 && wantsAtMid.indexOf(v) === i);

  const sampleClean = sample.length !== G * G || !wins.some((w) => demands(w).every((d) => sample[d.r * G + d.c] === d.need));
  const answerOk = problem.shortAnswer == null || `${pn}/${pd}` === String(problem.shortAnswer).replace(/\s/g, "");
  const ok = !anyPairFits && midDecides && sampleClean && answerOk && union === wins.length * Math.pow(K, G * G - Wn * Wn);

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 258;

  const Tile = ({ x, y, s, k, fill, from }: { x: number; y: number; s: number; k: number; fill?: string; from?: number }) => (
    <g>
      <rect x={x} y={y} width={s} height={s} fill="#fff" stroke="#94a3b8" strokeWidth={1} />
      <motion.polygon
        points={triPoints(x, y, s, k)}
        fill={fill ?? GRAY}
        initial={from != null ? { rotate: ANGLE[from] - ANGLE[k] } : { opacity: 0 }}
        animate={from != null ? { rotate: 0 } : { opacity: 1 }}
        transition={from != null ? { type: "spring", stiffness: 60, damping: 14, delay: 0.5 } : { duration: 0.3 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ================= phase 0: the tiles and a random tiling ================= */}
        {phase === 0 &&
          (() => {
            const ts = 34;
            const pitch = 46;
            const lx = (W - K * pitch + (pitch - ts)) / 2;
            const cell = 44;
            const gx = (W - G * cell) / 2;
            const gy = 108;
            return (
              <g>
                <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  every square takes one of the {K} tiles, each equally likely
                </text>
                {Array.from({ length: K }, (_, k) => (
                  <motion.g
                    key={`t${k}`}
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 + k * 0.12 }}
                  >
                    <Tile x={lx + k * pitch} y={36} s={ts} k={k} />
                    <text x={lx + k * pitch + ts / 2} y={84} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                      1 of {K}
                    </text>
                  </motion.g>
                ))}
                {sample.length === G * G &&
                  sample.map((k, i) => {
                    const r = Math.floor(i / G);
                    const c = i % G;
                    return (
                      <motion.g
                        key={`s${i}`}
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 250, damping: 16, delay: 0.7 + i * 0.09 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      >
                        <Tile x={gx + c * cell} y={gy + r * cell} s={cell} k={k} />
                      </motion.g>
                    );
                  })}
                <motion.text
                  x={W / 2}
                  y={252}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="800"
                  fill={IND}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                >
                  {K} choices × {G * G} squares → {K}
                  <tspan baselineShift="super" fontSize="9">
                    {G * G}
                  </tspan>{" "}
                  = {totalTilings.toLocaleString()} tilings
                </motion.text>
              </g>
            );
          })()}

        {/* ================= phase 1: what makes the pattern ================= */}
        {phase === 1 &&
          (() => {
            const cell = 62;
            const bxx = 52;
            const byy = 74;
            const cx = bxx + Wn * cell / 2;
            const cy = byy + Wn * cell / 2;
            return (
              <g>
                <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  a diamond means all {Wn * Wn} tiles turn their gray corner to the middle
                </text>
                {pattern.map((k, i) => {
                  const r = Math.floor(i / Wn);
                  const c = i % Wn;
                  return (
                    <Tile
                      key={`p${i}`}
                      x={bxx + c * cell}
                      y={byy + r * cell}
                      s={cell}
                      k={k}
                      from={(k + 1 + i) % K}
                    />
                  );
                })}
                {/* dividers on top, so the block still reads as four separate tiles */}
                {Array.from({ length: Wn + 1 }, (_, i) => (
                  <g key={`gl${i}`}>
                    <line x1={bxx + i * cell} y1={byy} x2={bxx + i * cell} y2={byy + Wn * cell} stroke="#64748b" strokeWidth={1.2} />
                    <line x1={bxx} y1={byy + i * cell} x2={bxx + Wn * cell} y2={byy + i * cell} stroke="#64748b" strokeWidth={1.2} />
                  </g>
                ))}
                <motion.polygon
                  points={`${cx},${cy - cell} ${cx + cell},${cy} ${cx},${cy + cell} ${cx - cell},${cy}`}
                  fill="none"
                  stroke={WIN}
                  strokeWidth={2.6}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14, delay: 1.5 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
                {[
                  { y: 96, t: `each tile has ${K} orientations` },
                  { y: 120, t: `only 1 of them points inward` },
                  { y: 144, t: `and all ${Wn * Wn} must do it` },
                ].map((row, i) => (
                  <motion.text
                    key={row.t}
                    x={222}
                    y={row.y}
                    fontSize="11"
                    fontWeight="700"
                    fill={i === 1 ? IND : INK}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1.7 + i * 0.25 }}
                  >
                    {row.t}
                  </motion.text>
                ))}
                <motion.text
                  x={222}
                  y={182}
                  fontSize="16"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 2.5 }}
                  style={{ transformBox: "fill-box", transformOrigin: "left center" }}
                >
                  (1/{K})
                  <tspan baselineShift="super" fontSize="10">
                    {Wn * Wn}
                  </tspan>{" "}
                  = 1/{perWindow}
                </motion.text>
              </g>
            );
          })()}

        {/* ================= phases 2 and 3: the grid of windows ================= */}
        {(phase === 2 || phase === 3) &&
          (() => {
            const cell = 48;
            const gx = 44;
            const gy = 66;
            const cellX = (c: number) => gx + c * cell;
            const cellY = (r: number) => gy + r * cell;
            return (
              <g>
                <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  {phase === 2
                    ? `the middle square sits in all ${wins.length} blocks — and each wants it turned a different way`
                    : `so at most one block can hold a diamond: the chances just add`}
                </text>

                {/* the plain grid */}
                {Array.from({ length: G * G }, (_, i) => (
                  <rect
                    key={`c${i}`}
                    x={cellX(i % G)}
                    y={cellY(Math.floor(i / G))}
                    width={cell}
                    height={cell}
                    fill="#fff"
                    stroke="#cbd5e1"
                    strokeWidth={1}
                  />
                ))}

                {/* each window, outlined and inset so all four stay visible */}
                {wins.map((w, i) => (
                  <motion.rect
                    key={`w${i}`}
                    x={cellX(w.c) + 3 + i}
                    y={cellY(w.r) + 3 + i}
                    width={Wn * cell - 6 - 2 * i}
                    height={Wn * cell - 6 - 2 * i}
                    rx={5}
                    fill="none"
                    stroke={BLOCK[i % BLOCK.length]}
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.2 + i * 0.22 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  />
                ))}

                {/* the shared middle square, cycling through what each block asks of it */}
                {phase === 2 && (
                  <g>
                    {wantsAtMid.map((k, i) => (
                      <motion.polygon
                        key={`m${i}`}
                        points={triPoints(cellX(mid.c), cellY(mid.r), cell, k)}
                        fill={BLOCK[i % BLOCK.length]}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0, 0.75, 0.75, 0] }}
                        transition={{
                          duration: wins.length * 1.1,
                          times: [0, i / wins.length, (i + 0.18) / wins.length, (i + 0.85) / wins.length, (i + 1) / wins.length],
                          repeat: Infinity,
                          delay: 1.2,
                        }}
                      />
                    ))}
                    <rect x={cellX(mid.c)} y={cellY(mid.r)} width={cell} height={cell} fill="none" stroke={INK} strokeWidth={2.2} />
                  </g>
                )}

                {/* the four demands on the middle square, listed */}
                {phase === 2 && (
                  <g>
                    {wantsAtMid.map((k, i) => (
                      <motion.g
                        key={`d${i}`}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1.4 + i * 0.2 }}
                      >
                        <Tile x={244} y={66 + i * 40} s={30} k={k} fill={BLOCK[i % BLOCK.length]} />
                        <text x={282} y={86 + i * 40} fontSize="10.5" fontWeight="700" fill={INK} fontFamily={numberFont}>
                          the {["top-left", "top-right", "bottom-left", "bottom-right"][i] ?? `#${i + 1}`} block
                        </text>
                        <text x={282} y={98 + i * 40} fontSize="9" fontWeight="700" fill={DIM}>
                          wants the {CORNER[k]} corner
                        </text>
                      </motion.g>
                    ))}
                    <motion.text
                      x={W / 2}
                      y={248}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="800"
                      fill={BAD}
                      fontFamily={numberFont}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.4 }}
                    >
                      {wins.length} different demands, one square — so no two blocks can both do it
                    </motion.text>
                  </g>
                )}

                {/* the final sum */}
                {phase === 3 && (
                  <g>
                    {wins.map((w, i) => (
                      <motion.text
                        key={`s${i}`}
                        x={252}
                        y={78 + i * 26}
                        fontSize="12"
                        fontWeight="800"
                        fill={BLOCK[i % BLOCK.length]}
                        fontFamily={numberFont}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.6 + i * 0.2 }}
                      >
                        1/{perWindow}
                      </motion.text>
                    ))}
                    <motion.line
                      x1={244}
                      y1={90 + wins.length * 26}
                      x2={340}
                      y2={90 + wins.length * 26}
                      stroke={INK}
                      strokeWidth={1.4}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: 1.5 }}
                    />
                    <motion.text
                      x={244}
                      y={112 + wins.length * 26}
                      fontSize="15"
                      fontWeight="800"
                      fill={INK}
                      fontFamily={numberFont}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.7 }}
                    >
                      {wins.length}/{perWindow} = <tspan fill={WIN}>{pn}/{pd}</tspan>
                    </motion.text>
                    <motion.text
                      x={244}
                      y={132 + wins.length * 26}
                      fontSize="9.5"
                      fontWeight="700"
                      fill={DIM}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.9 }}
                    >
                      {union.toLocaleString()} of the {totalTilings.toLocaleString()} tilings
                    </motion.text>
                  </g>
                )}
              </g>
            );
          })()}
      </svg>

      <motion.span
        key={phase}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: phase === 3 ? "#166534" : "#4338ca",
          background: phase === 3 ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${phase === 3 ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {phase === 0
          ? `every one of the ${totalTilings.toLocaleString()} tilings is equally likely`
          : phase === 1
          ? `one named block gives a diamond with probability 1/${perWindow}`
          : phase === 2
          ? `the middle tile alone names the only block that could work`
          : `${wins.length} × 1/${perWindow} = ${pn}/${pd}`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed: {union}/{totalTilings}, pairs fit {String(anyPairFits)}
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
