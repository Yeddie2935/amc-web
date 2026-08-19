import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const GIVEN = "#1f2a44";
const XCOL = "#16a34a";
const RIVAL = ["#dc2626", "#f59e0b", "#0891b2"];
const WIN = "#16a34a";
const BAD = "#dc2626";
const GRID = "#cbd5e1";
const MUTE = "#94a3b8";

const W = 360;
const H = 222;
const GX = 10; // grid left
const GY = 44;
const CELL = 42;
// the chart
const CX0 = 168;
const CX1 = 348;
const CY0 = 176;
const CY1 = 52;

/** A cell value as `c + k·x`. */
type Lin = { c: number; k: number };

const neg = (s: string) => s.replace(/-/g, "−");
const tidy = (v: number) => neg(String(Number(v.toFixed(4))));

function fmt(e: Lin): string {
  if (e.k === 0) return tidy(e.c);
  const xs = Math.abs(e.k) === 1 ? "x" : `${Math.abs(e.k)}x`;
  if (e.c === 0) return e.k > 0 ? xs : `−${xs}`;
  return `${tidy(e.c)} ${e.k > 0 ? "+" : "−"} ${xs}`;
}

/**
 * A grid whose rows and columns must all share one sum, with a few cells blank
 * and the named one required to beat the others. Two facts do all the work and
 * the scene derives both. First, **some line is already complete**, so the
 * common sum is simply read off it — and a second complete line agrees, which is
 * what licenses using it everywhere. Then every blank sits in a line holding
 * exactly one blank, so the grid **fills itself by cascade** with each entry a
 * linear expression in x; the line that is left over becomes a free consistency
 * check rather than new information.
 * The payoff is the third beat, which is what makes this a *slide* rather than
 * algebra: x is walked upward one integer at a time with the live values shown
 * in the real cells, and the rivals move too — the one written as `sum − x`
 * falls as x rises, so the two race toward each other and **cross**. That
 * crossing is the whole answer, and the other rivals are visibly never in
 * contention. The scene solves the cascade, turns each `x > c + k·x` into a real
 * bound, takes the binding one, and independently brute-forces the smallest
 * integer that beats all three, flagging a disagreement.
 * Data: { grid: ["-2,9,5", "?,?,-1", "x,?,8"], unknown?: "x" }.
 */
export function MagicGridSlideScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const xName = data.unknown != null ? String(data.unknown) : "x";
  const rows = (Array.isArray(data.grid) ? data.grid : []).map((r) => String(r).split(",").map((s) => s.trim()));
  const n = rows.length;

  // parse: a number, the unknown, or a blank
  const cells: (Lin | null)[] = [];
  let xAt = -1;
  rows.forEach((r, i) =>
    r.forEach((s, j) => {
      const idx = i * n + j;
      if (s === xName) {
        cells[idx] = { c: 0, k: 1 };
        xAt = idx;
      } else if (s === "?" || s === "") {
        cells[idx] = null;
      } else {
        cells[idx] = { c: Number(neg(s).replace(/−/g, "-")), k: 0 };
      }
    })
  );
  const blanks = cells.map((c, i) => (c === null ? i : -1)).filter((i) => i >= 0);

  // lines: every row then every column
  const lines: { idx: number[]; label: string }[] = [];
  for (let i = 0; i < n; i++) lines.push({ idx: Array.from({ length: n }, (_, j) => i * n + j), label: `row ${i + 1}` });
  for (let j = 0; j < n; j++) lines.push({ idx: Array.from({ length: n }, (_, i) => i * n + j), label: `column ${j + 1}` });

  // the common sum comes from a line that is already complete
  const sumOf = (idx: number[], cs: (Lin | null)[]) =>
    idx.reduce<Lin | null>((a, i) => (a && cs[i] ? { c: a.c + cs[i]!.c, k: a.k + cs[i]!.k } : null), { c: 0, k: 0 });
  const full = lines.filter((L) => L.idx.every((i) => cells[i] && cells[i]!.k === 0));
  const S = full.length ? sumOf(full[0].idx, cells)!.c : 0;
  const agreeing = full.filter((L) => sumOf(L.idx, cells)!.c === S);

  // fill by cascade: any line with exactly one blank solves it
  const work = [...cells];
  const order: { at: number; via: string; expr: Lin }[] = [];
  for (let guard = 0; guard < 20 && work.some((c) => c === null); guard++) {
    const L = lines.find((l) => l.idx.filter((i) => work[i] === null).length === 1);
    if (!L) break;
    const at = L.idx.find((i) => work[i] === null)!;
    const rest = sumOf(L.idx.filter((i) => i !== at), work)!;
    const expr = { c: S - rest.c, k: -rest.k };
    work[at] = expr;
    order.push({ at, via: L.label, expr });
  }
  const solved = work.every((c) => c !== null);
  // whatever line was never needed re-checks the arithmetic for free
  const leftover = lines.find((L) => !order.some((o) => L.idx.includes(o.at) && L.label === o.via) && L.idx.some((i) => blanks.includes(i)));
  const allLinesOk = solved && lines.every((L) => {
    const s = sumOf(L.idx, work)!;
    return s.k === 0 && s.c === S;
  });

  const rivals = order.filter((o) => o.at !== xAt).map((o, i) => ({ ...o, color: RIVAL[i % RIVAL.length] }));

  // x > c + k·x turns into a real bound on x
  const bounds = rivals.map((r) => {
    const d = 1 - r.expr.k;
    if (d > 0) return { ...r, kind: "lower" as const, at: r.expr.c / d };
    if (d < 0) return { ...r, kind: "upper" as const, at: r.expr.c / d };
    return { ...r, kind: r.expr.c < 0 ? ("always" as const) : ("never" as const), at: NaN };
  });
  const lowers = bounds.filter((b) => b.kind === "lower");
  const binding = lowers.length ? lowers.reduce((a, b) => (b.at > a.at ? b : a)) : undefined;

  // and independently: the smallest integer that actually beats all of them
  const valueAt = (e: Lin, x: number) => e.c + e.k * x;
  let brute = NaN;
  for (let x = Math.floor(Math.min(...bounds.map((b) => (Number.isFinite(b.at) ? b.at : 0)), 0)) - 4; x <= 400; x++) {
    if (rivals.every((r) => x > valueAt(r.expr, x))) {
      brute = x;
      break;
    }
  }
  const answer = brute;
  const agreesInternally = !binding || answer === Math.floor(binding.at) + 1;

  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value));
  const winner = opts.find((o) => o.value === answer);
  const agrees = !problem.answer || winner?.label === problem.answer;

  // the walk: integers around the crossing
  const xLo = Math.min(...bounds.filter((b) => Number.isFinite(b.at)).map((b) => Math.floor(b.at)), answer - 2);
  const xHi = answer + 2;
  const xs = Array.from({ length: Math.max(2, xHi - xLo + 1) }, (_, i) => xLo + i);
  const K = xs.length;
  const times = xs.map((_, i) => i / Math.max(1, K - 1));

  const vals = xs.flatMap((x) => [x, ...rivals.map((r) => valueAt(r.expr, x))]);
  const vLo = Math.min(...vals) - 1;
  const vHi = Math.max(...vals) + 1;
  const cxOf = (x: number) => CX0 + ((x - xLo) / Math.max(1, xHi - xLo)) * (CX1 - CX0);
  const cyOf = (v: number) => CY0 - ((v - vLo) / Math.max(1, vHi - vLo)) * (CY0 - CY1);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const preSteps = Math.max(1, totalSteps - 1);
  const showFill = isFinal || step >= Math.max(1, Math.round(preSteps / 3));
  const showSlide = !isFinal && step >= Math.max(1, Math.round((preSteps * 2) / 3));

  // every line the chart draws: x itself, then each rival
  const plotted = [
    { expr: { c: 0, k: 1 } as Lin, color: XCOL, name: xName },
    ...rivals.map((r) => ({ expr: r.expr, color: r.color, name: fmt(r.expr) })),
  ];

  const cellX = (j: number) => GX + j * CELL;
  const cellY = (i: number) => GY + i * CELL;

  const caption = isFinal
    ? `${xName} = ${tidy(answer)} beats ${rivals.map((r) => tidy(valueAt(r.expr, answer))).join(", ")}`
    : !showFill
    ? `${agreeing.length} complete lines both add to ${tidy(S)}, so every line must`
    : !showSlide
    ? `each blank sits in a line with one blank left — the grid fills itself in ${xName}`
    : binding
    ? `as ${xName} climbs, ${fmt(binding.expr)} falls — they cross at ${tidy(binding.at)}`
    : `walk ${xName} up and watch the others`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* the grid */}
        {Array.from({ length: n }).map((_, i) =>
          Array.from({ length: n }).map((__, j) => {
            const idx = i * n + j;
            const isX = idx === xAt;
            const isBlank = blanks.includes(idx);
            const filled = showFill && isBlank;
            return (
              <rect
                key={`c${idx}`}
                x={cellX(j)}
                y={cellY(i)}
                width={CELL}
                height={CELL}
                fill={isX ? "#dcfce7" : filled ? "#eef2ff" : "#fff"}
                stroke={isX ? XCOL : GRID}
                strokeWidth={isX ? 1.8 : 1.2}
              />
            );
          })
        )}

        {/* given numbers, and the unknown */}
        {cells.map((c, idx) => {
          if (c === null) return null;
          const i = Math.floor(idx / n);
          const j = idx % n;
          const isX = idx === xAt;
          if (isX && (showSlide || isFinal)) return null; // a real value takes over
          return (
            <text
              key={`g${idx}`}
              x={cellX(j) + CELL / 2}
              y={cellY(i) + CELL / 2 + 5}
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              fill={isX ? XCOL : GIVEN}
              fontFamily={numberFont}
            >
              {isX ? xName : tidy(c.c)}
            </text>
          );
        })}

        {/* the blanks, filled by cascade as expressions in x */}
        {showFill &&
          !showSlide &&
          !isFinal &&
          order.map((o, k) => {
            const i = Math.floor(o.at / n);
            const j = o.at % n;
            const col = rivals.find((r) => r.at === o.at)?.color ?? MARK;
            return (
              <motion.g
                key={`f${o.at}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.4 + k * 0.55 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <text
                  x={cellX(j) + CELL / 2}
                  y={cellY(i) + CELL / 2 + 4}
                  textAnchor="middle"
                  fontSize={fmt(o.expr).length > 4 ? 9.5 : 13}
                  fontWeight="800"
                  fill={col}
                  fontFamily={numberFont}
                >
                  {fmt(o.expr)}
                </text>
                <text x={cellX(j) + CELL / 2} y={cellY(i) + CELL - 5} textAnchor="middle" fontSize="6.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                  {o.via}
                </text>
              </motion.g>
            );
          })}

        {/* the live grid: one text per candidate, only one lit at a time */}
        {showSlide &&
          [{ at: xAt, expr: { c: 0, k: 1 } as Lin, color: XCOL }, ...rivals].map((cell) =>
            xs.map((x, q) => (
              <motion.text
                key={`l${cell.at}-${x}`}
                x={cellX(cell.at % n) + CELL / 2}
                y={cellY(Math.floor(cell.at / n)) + CELL / 2 + 5}
                textAnchor="middle"
                fontSize="14"
                fontWeight="800"
                fill={cell.color}
                fontFamily={numberFont}
                initial={{ opacity: q === 0 ? 1 : 0 }}
                animate={{ opacity: xs.map((_, t) => (t === q ? 1 : 0)) }}
                transition={{ duration: 0.34 * K, times, delay: 0.4 }}
              >
                {tidy(valueAt(cell.expr, x))}
              </motion.text>
            ))
          )}

        {/* the filled grid, with every line's sum checked */}
        <AnimatePresence>
          {isFinal && solved && (
            <motion.g key="fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {work.map((e, idx) => {
                if (!blanks.includes(idx) && idx !== xAt) return null;
                const i = Math.floor(idx / n);
                const j = idx % n;
                return (
                  <motion.text
                    key={`fv${idx}`}
                    x={cellX(j) + CELL / 2}
                    y={cellY(i) + CELL / 2 + 5}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="800"
                    fill={idx === xAt ? XCOL : MARK}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.2 + blanks.indexOf(idx) * 0.16 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {tidy(valueAt(e!, answer))}
                  </motion.text>
                );
              })}
              {/* row and column totals, all landing on S */}
              {Array.from({ length: n }).map((_, i) => (
                <motion.text
                  key={`rs${i}`}
                  x={GX + n * CELL + 8}
                  y={cellY(i) + CELL / 2 + 4}
                  fontSize="11"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18, delay: 1 + i * 0.14 }}
                >
                  {tidy(S)}
                </motion.text>
              ))}
              {Array.from({ length: n }).map((_, j) => (
                <motion.text
                  key={`cs${j}`}
                  x={cellX(j) + CELL / 2}
                  y={GY + n * CELL + 14}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18, delay: 1.4 + j * 0.14 }}
                >
                  {tidy(S)}
                </motion.text>
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the panel */}
        <AnimatePresence mode="wait">
          <motion.g key={isFinal ? "f" : showSlide ? "s" : showFill ? "c" : "u"} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            {isFinal ? (
              <>
                <text x={CX0 - 4} y={40} fontSize="9.5" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                  the last crossing sets the floor
                </text>
                {binding && (
                  <>
                    <text x={CX0 - 4} y={62} fontSize="11.5" fontWeight="800" fill={binding.color} fontFamily={numberFont}>
                      {xName} &gt; {fmt(binding.expr)}
                    </text>
                    <text x={CX0 - 4} y={80} fontSize="11.5" fontWeight="800" fill={binding.color} fontFamily={numberFont}>
                      {xName} &gt; {tidy(binding.at)}
                    </text>
                  </>
                )}
                <motion.text
                  x={CX0 - 4}
                  y={108}
                  fontSize="19"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.7 }}
                  style={{ transformBox: "fill-box", transformOrigin: "left center" }}
                >
                  {xName} = {tidy(answer)}
                </motion.text>
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                  <text x={CX0 - 4} y={134} fontSize="8.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                    every row and column adds
                  </text>
                  <text x={CX0 - 4} y={145} fontSize="8.5" fontWeight="700" fill={allLinesOk ? MUTE : BAD} fontFamily={numberFont}>
                    to {tidy(S)} {allLinesOk ? "✓" : "✗"}
                  </text>
                </motion.g>
              </>
            ) : showSlide ? (
              <g>
                {/* axes */}
                <line x1={CX0} y1={CY1 - 4} x2={CX0} y2={CY0} stroke={INK} strokeWidth={1.2} />
                <line x1={CX0} y1={CY0} x2={CX1 + 4} y2={CY0} stroke={INK} strokeWidth={1.2} />
                <text x={(CX0 + CX1) / 2} y={CY0 + 14} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                  value of {xName}
                </text>
                {xs.filter((x) => x % 2 === 0).map((x) => (
                  <text key={`tx${x}`} x={cxOf(x)} y={CY0 + 9} textAnchor="middle" fontSize="7" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                    {tidy(x)}
                  </text>
                ))}

                {/* x itself, and each rival */}
                {plotted.map((L, k) => (
                  <motion.g key={`ln${k}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + k * 0.15 }}>
                    <motion.line
                      x1={cxOf(xLo)}
                      y1={cyOf(valueAt(L.expr, xLo))}
                      x2={cxOf(xHi)}
                      y2={cyOf(valueAt(L.expr, xHi))}
                      stroke={L.color}
                      strokeWidth={k === 0 ? 2.4 : 1.6}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 + k * 0.15 }}
                    />
                    {(() => {
                      // fan the labels along their own lines so converging ones
                      // separate, and keep them inside the plot
                      const rising = L.expr.k > 0;
                      const rank = plotted.slice(0, k).filter((p) => (p.expr.k > 0) === rising).length;
                      const t = rising ? 0.88 - rank * 0.2 : 0.18 + rank * 0.2;
                      const xv = xLo + t * (xHi - xLo);
                      const dy = rising ? 13 : -7;
                      return (
                        <text
                          x={cxOf(xv)}
                          y={cyOf(valueAt(L.expr, xv)) + dy}
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="800"
                          fill={L.color}
                          fontFamily={numberFont}
                        >
                          {L.name}
                        </text>
                      );
                    })()}
                  </motion.g>
                ))}

                {/* where x overtakes each one */}
                {bounds
                  .filter((b) => Number.isFinite(b.at) && b.at >= xLo && b.at <= xHi)
                  .map((b, k) => (
                    <motion.g key={`cr${k}`} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 1 + k * 0.2 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                      <circle cx={cxOf(b.at)} cy={cyOf(b.at)} r={b === binding ? 5 : 3.4} fill="none" stroke={b.color} strokeWidth={b === binding ? 2 : 1.4} />
                      {b === binding && (
                        <text x={cxOf(b.at) - 9} y={cyOf(b.at) - 6} textAnchor="end" fontSize="8.5" fontWeight="800" fill={b.color} fontFamily={numberFont}>
                          {tidy(b.at)}
                        </text>
                      )}
                    </motion.g>
                  ))}

                {/* the sweep, in step with the live grid */}
                <motion.line
                  y1={CY1 - 4}
                  y2={CY0}
                  x1={0}
                  x2={0}
                  stroke={MARK}
                  strokeWidth={1.3}
                  strokeDasharray="4 3"
                  initial={{ x: cxOf(xLo) }}
                  animate={{ x: xs.map(cxOf) }}
                  transition={{ duration: 0.34 * K, times, delay: 0.4 }}
                />
              </g>
            ) : showFill ? (
              <>
                <text x={CX0 - 4} y={40} fontSize="9.5" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                  one blank per line, so
                </text>
                <text x={CX0 - 4} y={52} fontSize="9.5" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                  each is forced in turn
                </text>
                {order.map((o, k) => (
                  <motion.g key={k} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.4 + k * 0.55 }}>
                    <text x={CX0 - 4} y={76 + k * 22} fontSize="8" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                      {o.via}
                    </text>
                    <text x={CX0 - 4} y={87 + k * 22} fontSize="11" fontWeight="800" fill={rivals.find((r) => r.at === o.at)?.color ?? MARK} fontFamily={numberFont}>
                      {fmt(o.expr)}
                    </text>
                  </motion.g>
                ))}
                {leftover && (
                  <motion.text x={CX0 - 4} y={82 + order.length * 22} fontSize="8" fontWeight="700" fill={allLinesOk ? MUTE : BAD} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + order.length * 0.55 }}>
                    {leftover.label} then checks out {allLinesOk ? "✓" : "✗"}
                  </motion.text>
                )}
              </>
            ) : (
              <>
                <text x={CX0 - 4} y={44} fontSize="9.5" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                  these lines are already full
                </text>
                {agreeing.map((L, k) => (
                  <motion.g key={k} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.4 + k * 0.4 }}>
                    <text x={CX0 - 4} y={68 + k * 26} fontSize="8" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                      {L.label}
                    </text>
                    <text x={CX0 - 4} y={80 + k * 26} fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                      {L.idx.map((i) => tidy(cells[i]!.c)).join(" + ")} = {tidy(S)}
                    </text>
                  </motion.g>
                ))}
                <motion.text
                  x={CX0 - 4}
                  y={78 + agreeing.length * 26 + 14}
                  fontSize="14"
                  fontWeight="800"
                  fill={MARK}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.5 + agreeing.length * 0.4 }}
                  style={{ transformBox: "fill-box", transformOrigin: "left center" }}
                >
                  every line = {tidy(S)}
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
            transition={{ delay: 2.2 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && agreesInternally && allLinesOk ? MUTE : BAD, textAlign: "center" }}
          >
            {!allLinesOk
              ? `the filled grid does not give every line the sum ${tidy(S)}`
              : !agreesInternally
              ? `the bound says ${tidy(Math.floor(binding!.at) + 1)} but the search says ${tidy(answer)}`
              : !agrees
              ? `this gives ${xName} = ${tidy(answer)}, not the stored answer`
              : `searched upward from ${tidy(xs[0])}: ${tidy(answer)} is the first ${xName} beating all ${rivals.length}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
