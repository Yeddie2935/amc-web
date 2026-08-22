import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const AMB = "#b45309";
const DARK = "#0f172a";

type Cell = [number, number];

/** Binomial coefficient, exact for the sizes a contest board reaches. */
function binom(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i += 1) r = (r * (n - k + i)) / i;
  return Math.round(r);
}

/** Keyframe arrays that hop between points, lifting each segment's midpoint. */
function hopKeys(pts: { x: number; y: number }[], lift = 5) {
  const segs = pts.length - 1;
  if (segs <= 0) return { xs: [pts[0]?.x ?? 0], ys: [pts[0]?.y ?? 0], times: [0] };
  const xs: number[] = [];
  const ys: number[] = [];
  const times: number[] = [];
  pts.forEach((p, i) => {
    if (i > 0) {
      const a = pts[i - 1];
      xs.push((a.x + p.x) / 2);
      ys.push((a.y + p.y) / 2 - lift);
      times.push((i - 0.5) / segs);
    }
    xs.push(p.x);
    ys.push(p.y);
    times.push(i / segs);
  });
  return { xs, ys, times };
}

/** The marker: a checker piece, drawn at its home coordinates. */
function Disc({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} stroke="#fff" strokeWidth={1.4} />
      <circle cx={cx} cy={cy} r={r - 3.2} fill="none" stroke="#fff" strokeWidth={1} opacity={0.55} />
    </g>
  );
}

/** A drawn-on arrow with a head that pops at the far end. */
function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  delay,
  width = 2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  delay: number;
  width?: number;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const hx = x2 - ux * 4;
  const hy = y2 - uy * 4;
  const head = `${x2},${y2} ${hx - uy * 3.4},${hy + ux * 3.4} ${hx + uy * 3.4},${hy - ux * 3.4}`;
  return (
    <g>
      <motion.line
        x1={x1}
        y1={y1}
        x2={hx}
        y2={hy}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay }}
      />
      <motion.polygon
        points={head}
        fill={color}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: delay + 0.26 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </g>
  );
}

/**
 * Paths up a checkerboard, one diagonal step per row onto the white squares.
 * The counting itself is Pascal poured **upward** — each white square holds the
 * sum of the two white squares diagonally below it, since a path can only have
 * arrived from those — but the real content of the problem is the **edge**. On a
 * board with no sides the answer would be a plain binomial: the walk is a fixed
 * number of steps of which some are rights and the rest lefts, in any order, so
 * `C(steps, rights)` — and on this problem that number, 35, is sitting right
 * there as an answer choice, which the scene finds in `problem.choices` and
 * names. The board's right edge kills exactly the paths that would need a
 * column past the last one, and the scene **decomposes those by first escape**:
 * paths that reach an edge square and then step off it, counted as
 * (ways to reach it, staying on) x (ways to finish from outside, ignoring the
 * board). Those products are checked to sum to the gap between the free count
 * and the DP's, so the picture cannot disagree with the arithmetic. Beats: the
 * move rule with the marker walking a real path P to Q; the waterfall filling
 * the lower half with one cell's `a + b` shown; the upper half and Q; then the
 * free-board count, a marker walking off the edge into a ghost square, and the
 * subtraction. Every path is also enumerated independently and cross-checked
 * against the DP; data `{ size, from: [row, col], to: [row, col] }` with rows
 * numbered from the **bottom**.
 */
export function CheckerPathsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const size = Math.max(2, Math.round(num(data.size, 8)));
  const rawFrom = Array.isArray(data.from) ? data.from : [1, 1];
  const rawTo = Array.isArray(data.to) ? data.to : [size, 1];
  const pr = Math.round(num(rawFrom[0], 1));
  const pc = Math.round(num(rawFrom[1], 1));
  const qr = Math.round(num(rawTo[0], size));
  const qc = Math.round(num(rawTo[1], 1));
  const nSteps = qr - pr;

  // ---- the waterfall: paths to each square, staying on the board ----
  const cnt: number[][] = Array.from({ length: size + 2 }, () => Array(size + 2).fill(0));
  cnt[pr][pc] = 1;
  for (let r = pr + 1; r <= qr; r += 1) {
    for (let c = 1; c <= size; c += 1) {
      cnt[r][c] = (c > 1 ? cnt[r - 1][c - 1] : 0) + (c < size ? cnt[r - 1][c + 1] : 0);
    }
  }
  const answer = cnt[qr][qc];

  // ---- the same count with the sides taken away: pure left/right ordering ----
  const freeFrom = (r0: number, c0: number) => {
    const n = qr - r0;
    const d = qc - c0;
    if (n < 0 || (n + d) % 2 !== 0) return 0;
    return binom(n, (n + d) / 2);
  };
  const free = freeFrom(pr, pc);
  const rights = (nSteps + (qc - pc)) / 2;
  const lefts = nSteps - rights;

  // ---- the paths the edges kill, split by where they first step off ----
  const escapes: { r: number; c: number; out: number; onTo: number; after: number; count: number }[] = [];
  for (let r = pr; r < qr; r += 1) {
    for (const c of size > 1 ? [1, size] : [1]) {
      const out = c === 1 ? 0 : size + 1;
      const onTo = cnt[r][c];
      const after = freeFrom(r + 1, out);
      if (onTo * after > 0) escapes.push({ r, c, out, onTo, after, count: onTo * after });
    }
  }
  const lost = escapes.reduce((a, e) => a + e.count, 0);

  // ---- every path, enumerated independently of the waterfall ----
  const paths: Cell[][] = [];
  const dfs = (r: number, c: number, acc: Cell[]) => {
    if (paths.length > 600) return;
    if (r === qr) {
      if (c === qc) paths.push([...acc]);
      return;
    }
    for (const nc of [c - 1, c + 1]) if (nc >= 1 && nc <= size) dfs(r + 1, nc, [...acc, [r + 1, nc]]);
  };
  dfs(pr, pc, [[pr, pc]]);
  const demo = paths[Math.floor(paths.length / 2)] ?? [[pr, pc] as Cell];

  // one real path that walks into a wall, for the closing beat
  const site = escapes[0];
  const reach = (tr: number, tc: number): Cell[] => {
    let found: Cell[] | null = null;
    const go = (r: number, c: number, acc: Cell[]) => {
      if (found) return;
      if (r === tr) {
        if (c === tc) found = [...acc];
        return;
      }
      for (const nc of [c - 1, c + 1]) if (nc >= 1 && nc <= size) go(r + 1, nc, [...acc, [r + 1, nc]]);
    };
    go(pr, pc, [[pr, pc]]);
    return found ?? [];
  };
  const escDemo: Cell[] = site ? [...reach(site.r, site.c), [site.r + 1, site.out]] : [];

  // ---- self-checks ----
  const answerOk = problem.shortAnswer == null || String(answer) === String(problem.shortAnswer);
  const enumOk = paths.length <= 600 ? paths.length === answer : true;
  const gapOk = free - answer === lost;
  const ok = answerOk && enumOk && gapOk;
  const failed = !answerOk
    ? `waterfall gives ${answer}, stored answer ${problem.shortAnswer}`
    : !enumOk
    ? `waterfall ${answer} but ${paths.length} paths enumerated`
    : !gapOk
    ? `free ${free} − escapes ${lost} ≠ ${answer}`
    : "";

  // the free-board count is usually one of the distractors — find its letter
  const norm = (s: string) => s.replace(/[−–—]/g, "-").replace(/[^\d-]/g, "");
  const trap = (problem.choices ?? []).find((c) => norm(String(c.text)) === String(free));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const phase = isFinal ? 3 : Math.min(step, 2);

  const half = pr + Math.floor(nSteps / 2);
  const topRow = phase === 0 ? pr : phase === 1 ? half : qr;

  // the cell whose a + b is spelled out on the fill-in beat
  let show: Cell | null = null;
  if (phase === 1) {
    for (let c = 1; c <= size; c += 1) {
      if (cnt[half][c] > 0 && (!show || cnt[half][c] > cnt[show[0]][show[1]])) show = [half, c];
    }
  }
  const feeders = (cell: Cell) =>
    ([[cell[0] - 1, cell[1] - 1], [cell[0] - 1, cell[1] + 1]] as Cell[]).filter(
      ([r, c]) => c >= 1 && c <= size && cnt[r][c] > 0,
    );

  // ---------------- geometry ----------------
  const CELL = 23;
  const GX = 30;
  const GY = 24;
  const W = 480;
  const H = 236;
  const PX = 250;
  const isWhite = (r: number, c: number) => (r + c) % 2 === ((pr + pc) % 2 + 2) % 2;
  const sx = (c: number) => GX + (c - 1) * CELL;
  const sy = (r: number) => GY + (size - r) * CELL;
  const mx = (c: number) => sx(c) + CELL / 2;
  const my = (r: number) => sy(r) + CELL / 2;
  const home = { x: mx(pc), y: my(pr) };
  const toDelta = (cells: Cell[]) => cells.map(([r, c]) => ({ x: mx(c) - home.x, y: my(r) - home.y }));

  // the escaping marker keeps going past the ghost square and tumbles off, so
  // it does not sit on top of the count the ghost is there to carry
  const outDir = site ? (site.out > site.c ? 1 : -1) : 1;
  const walk = phase === 3 ? escDemo : demo;
  const pts = walk.map(([r, c]) => ({ x: mx(c), y: my(r) }));
  if (phase === 3 && pts.length) {
    const end = pts[pts.length - 1];
    pts.push({ x: end.x + outDir * 11, y: end.y + 17 });
  }
  const keys = hopKeys(pts.map((p) => ({ x: p.x - home.x, y: p.y - home.y })));
  const rest = pts[pts.length - 1] ?? home;
  const walkStart = phase === 3 ? 0.5 : 1.1;
  const walkDur = 0.3 * Math.max(1, pts.length - 1);
  const trailD = pts.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");

  const caption =
    phase === 0
      ? `each step: up one row, diagonally onto a white square`
      : phase === 1
      ? `every white square = the two counts just below it`
      : phase === 2
      ? `Q = ${feeders([qr, qc]).map(([r, c]) => cnt[r][c]).join(" + ")} = ${answer}`
      : `${free} free-board paths − ${lost} that fall off the edge = ${answer}`;

  const pLines =
    phase === 0
      ? ["the move", `up one row`, `one column left or right`, `always onto a white square`, `P to Q is ${nSteps} steps`]
      : phase === 1
      ? ["the count", `a path into a square arrives`, `from the two white squares`, `diagonally below it`]
      : phase === 2
      ? ["at the top", `only two squares feed Q`, `and the edge squares only`, `ever get one feeder`]
      : ["no edges?", "", "", ""];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ---------------- the board ---------------- */}
        {Array.from({ length: size }, (_, i) => size - i).map((r) =>
          Array.from({ length: size }, (_, j) => j + 1).map((c) => (
            <rect
              key={`b${r}-${c}`}
              x={sx(c)}
              y={sy(r)}
              width={CELL}
              height={CELL}
              fill={isWhite(r, c) ? "#ffffff" : DARK}
              stroke="#cbd5e1"
              strokeWidth={0.5}
            />
          )),
        )}
        <rect x={sx(1)} y={sy(size)} width={size * CELL} height={size * CELL} fill="none" stroke={INK} strokeWidth={1.4} />

        {/* the counts, filling upward row by row */}
        {Array.from({ length: topRow - pr + 1 }, (_, i) => pr + i).map((r) =>
          Array.from({ length: size }, (_, j) => j + 1)
            // in the top row only Q is asked about; the rest is noise
            .filter((c) => cnt[r][c] > 0 && phase > 0 && (r !== qr || c === qc))
            .map((c) => {
              const isQ = r === qr && c === qc;
              const dull = phase === 3 && !isQ && !escapes.some((e) => e.r === r && e.c === c);
              return (
                <motion.g
                  key={`n${r}-${c}`}
                  initial={{ opacity: 0, scale: 0.2 }}
                  animate={{ opacity: dull ? 0.32 : 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.1 + (r - pr) * 0.16 + c * 0.012 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <text
                    x={mx(c)}
                    y={my(r) + 4 + (isQ || (r === pr && c === pc) ? 4.5 : 0)}
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="800"
                    fill={isQ ? WIN : phase === 3 && !dull ? BAD : IND}
                    fontFamily={numberFont}
                  >
                    {cnt[r][c]}
                  </text>
                </motion.g>
              );
            }),
        )}

        {/* the two choices open at P — drawn from clear of the marker */}
        {phase === 0 &&
          ([pc - 1, pc + 1] as number[])
            .filter((c) => c >= 1 && c <= size)
            .map((c, i) => (
              <Arrow
                key={`o${c}`}
                x1={mx(pc) + (c - pc) * 6}
                y1={my(pr) - 10}
                x2={mx(c) - (c - pc) * 4}
                y2={my(pr + 1) + 7}
                color={IND}
                delay={0.25 + i * 0.2}
                width={2.2}
              />
            ))}

        {/* the a + b that makes the waterfall */}
        {phase === 1 && show && (
          <g>
            {feeders(show).map(([r, c], i) => (
              <Arrow key={`f${c}`} x1={mx(c)} y1={my(r) - 6} x2={mx(show![1])} y2={my(show![0]) + 8} color={WIN} delay={1.35 + i * 0.2} />
            ))}
            <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.85 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={mx(show[1]) - 33} y={sy(show[0]) - 22} width={66} height={17} rx={8} fill="#dcfce7" stroke="#bbf7d0" />
              <text x={mx(show[1])} y={sy(show[0]) - 10} textAnchor="middle" fontSize="10" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                {feeders(show).map(([r, c]) => cnt[r][c]).join(" + ")} = {cnt[show[0]][show[1]]}
              </text>
            </motion.g>
          </g>
        )}

        {/* the two squares that feed Q */}
        {phase === 2 &&
          feeders([qr, qc]).map(([r, c], i) => (
            <g key={`q${c}`}>
              <motion.rect
                x={sx(c)}
                y={sy(r)}
                width={CELL}
                height={CELL}
                fill="none"
                stroke={WIN}
                strokeWidth={2}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 + i * 0.18 }}
              />
              <Arrow x1={mx(c)} y1={my(r) - 6} x2={mx(qc)} y2={my(qr) + 8} color={WIN} delay={1.7 + i * 0.18} />
            </g>
          ))}

        {/* ---------------- the marker walking ---------------- */}
        {(phase === 0 || phase === 3) && (
          <g>
            <motion.path
              d={trailD}
              fill="none"
              stroke={phase === 3 ? BAD : AMB}
              strokeWidth={2.2}
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={0.75}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: walkDur, delay: walkStart, ease: "linear" }}
            />
            <motion.g
              initial={{ x: 0, y: 0 }}
              animate={{ x: keys.xs, y: keys.ys }}
              transition={{ duration: walkDur, times: keys.times, delay: walkStart, ease: "linear" }}
            >
              <Disc cx={home.x} cy={home.y} r={CELL / 2 - 3} color={AMB} />
            </motion.g>
            {phase === 3 && (
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 15, delay: walkStart + walkDur }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <Disc cx={rest.x} cy={rest.y} r={CELL / 2 - 3} color={BAD} />
              </motion.g>
            )}
          </g>
        )}

        {/* ---------------- the closing beat: the edge ---------------- */}
        {phase === 3 && (
          <g>
            {/* the wall the escaping paths hit */}
            <motion.line
              x1={sx(size) + CELL}
              y1={sy(size)}
              x2={sx(size) + CELL}
              y2={sy(size) + size * CELL}
              stroke={BAD}
              strokeWidth={3.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            />
            {escapes.map((e, i) => (
              <g key={`e${e.r}-${e.c}`}>
                <motion.rect
                  x={sx(e.out)}
                  y={sy(e.r + 1)}
                  width={CELL}
                  height={CELL}
                  fill="#fee2e2"
                  stroke={BAD}
                  strokeWidth={1.4}
                  strokeDasharray="3 2"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 16, delay: 1.5 + i * 0.25 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
                <motion.text
                  x={mx(e.out)}
                  y={my(e.r + 1) + 4}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="800"
                  fill={BAD}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 + i * 0.25 }}
                >
                  {e.count}
                </motion.text>
                <Arrow
                  x1={mx(e.c) + (e.out > e.c ? 1 : -1) * (CELL / 2 - 2)}
                  y1={sy(e.r) + 3}
                  x2={mx(e.out) - (e.out > e.c ? 1 : -1) * (CELL / 2 + 1)}
                  y2={sy(e.r + 1) + CELL - 1}
                  color={BAD}
                  delay={1.6 + i * 0.25}
                  width={1.8}
                />
              </g>
            ))}
          </g>
        )}

        {/* P and Q ride in the corner of their square, drawn last so the marker
            passing over them never hides which squares they are */}
        {([[pr, pc, "P"], [qr, qc, "Q"]] as [number, number, string][]).map(([r, c, lab]) => (
          <text
            key={lab}
            x={sx(c) + 4}
            y={sy(r) + 7.5}
            fontSize="8.5"
            fontWeight="800"
            fill={INK}
            stroke="#fff"
            strokeWidth={2.4}
            paintOrder="stroke"
            fontFamily="Georgia, serif"
            fontStyle="italic"
          >
            {lab}
          </text>
        ))}

        {/* ---------------- side panel ---------------- */}
        <text x={PX} y={GY + 10} fontSize="11" fontWeight="800" fill={INK}>
          {pLines[0]}
        </text>
        {phase !== 3 &&
          pLines.slice(1).map((t, i) => (
            <motion.text
              key={`${phase}-${i}`}
              x={PX}
              y={GY + 32 + i * 17}
              fontSize="10.5"
              fontWeight="600"
              fill={i === 3 ? IND : "#475569"}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.22 }}
            >
              {t}
            </motion.text>
          ))}

        {/* the sum rule, drawn small, on the fill-in beat */}
        {phase === 1 && (
          <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
            {[
              { x: PX + 22, y: GY + 118, t: "a" },
              { x: PX + 68, y: GY + 118, t: "b" },
              { x: PX + 45, y: GY + 92, t: "a+b" },
            ].map((s) => (
              <g key={s.t}>
                <rect x={s.x} y={s.y} width={24} height={24} fill="#fff" stroke="#cbd5e1" strokeWidth={1.2} />
                <text x={s.x + 12} y={s.y + 16} textAnchor="middle" fontSize={s.t.length > 1 ? 8.5 : 10.5} fontWeight="800" fill={IND} fontFamily={numberFont}>
                  {s.t}
                </text>
              </g>
            ))}
            <Arrow x1={PX + 34} y1={GY + 114} x2={PX + 53} y2={GY + 120} color={WIN} delay={1.4} />
            <Arrow x1={PX + 80} y1={GY + 114} x2={PX + 61} y2={GY + 120} color={WIN} delay={1.55} />
          </motion.g>
        )}

        {/* the closing arithmetic */}
        {phase === 3 && (
          <g>
            {[
              { d: 0.2, t: `${nSteps} steps: ${rights} right, ${lefts} left`, c: "#475569", s: 10.5 },
              { d: 0.5, t: `in any order: C(${nSteps},${lefts}) = ${free}`, c: IND, s: 12 },
              ...(trap ? [{ d: 0.8, t: `— which is choice ${trap.label}`, c: AMB, s: 10.5 }] : []),
              { d: 1.9, t: `but ${lost} step off the board:`, c: "#475569", s: 10.5 },
              { d: 2.15, t: escapes.map((e) => e.count).join(" + ") + ` = ${lost}`, c: BAD, s: 12 },
              { d: 2.5, t: `${free} − ${lost} = ${answer}`, c: WIN, s: 15 },
            ].map((l, i) => (
              <motion.text
                key={i}
                x={PX}
                y={GY + 32 + i * 24 + (i >= (trap ? 3 : 2) ? 14 : 0)}
                fontSize={l.s}
                fontWeight="800"
                fill={l.c}
                fontFamily={l.s > 11 ? numberFont : undefined}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: l.d }}
              >
                {l.t}
              </motion.text>
            ))}
          </g>
        )}
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
        {caption}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failed}</span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.9 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
