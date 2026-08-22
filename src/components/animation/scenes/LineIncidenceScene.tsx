import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const EXTRA = "#f59e0b";
const LINE_COLORS = ["#e11d48", "#0891b2", "#7c3aed", "#ea580c", "#059669", "#c026d3"];

type Pt = { label: string; x: number; y: number; dir: string };

/**
 * Digits placed at the points of a figure, each of several lines contributing
 * the sum of the digits along it, with the grand total given. Adding the line
 * sums is really an **incidence count**: every point is added once per line
 * through it, so the total is (times on a line) x (its digit), summed. Here all
 * but one point sit on the same number of lines, so that many copies of *every*
 * digit come out as a fixed number — the digits 1..6 total 21 whatever the
 * arrangement — and the only thing left over is the extra copy of the one point
 * that is busier than the rest. That leftover is the answer, in one subtraction.
 *
 * The counting is watched rather than asserted: a traveller runs along each line
 * and drops a token into a point's column exactly as it passes through, so the
 * per-point tallies are built by the sweep. Incidence counts, the shared base,
 * the surplus point and its digit are all computed from the lines, and the scene
 * checks that the points it was handed really are collinear on every line.
 *
 * The closing beat says the thing this problem hides: the other digits are never
 * pinned down at all — only their total was ever needed.
 * Data: { points: ["A|x|y|W", ...], lines: ["A,B,C", ...], total, digitsFrom,
 * digitsTo, ask }, with x/y normalised 0-1.
 */
export function LineIncidenceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const pts: Pt[] = (Array.isArray(data.points) ? data.points : []).map((raw) => {
    const [label, x, y, dir] = String(raw).split("|");
    return { label: String(label), x: num(x, 0), y: num(y, 0), dir: dir ?? "N" };
  });
  const lines: string[][] = (Array.isArray(data.lines) ? data.lines : []).map((raw) =>
    String(raw)
      .split(",")
      .map((t) => t.trim()),
  );
  const total = num(data.total, 0);
  const from = num(data.digitsFrom, 1);
  const to = num(data.digitsTo, pts.length);
  const ask = data.ask != null ? String(data.ask) : "";

  const at = (label: string) => pts.find((p) => p.label === label);

  // adding the line sums counts each point once per line through it
  const counts = new Map<string, number[]>(); // label -> indices of its lines
  pts.forEach((p) => counts.set(p.label, []));
  lines.forEach((ln, i) => ln.forEach((l) => counts.get(l)?.push(i)));
  const countOf = (label: string) => counts.get(label)?.length ?? 0;
  const minC = pts.length ? Math.min(...pts.map((p) => countOf(p.label))) : 0;
  const digitSum = ((from + to) * (to - from + 1)) / 2;
  const base = minC * digitSum;
  const surplus = total - base;
  const extras = pts.filter((p) => countOf(p.label) > minC).map((p) => ({ ...p, over: countOf(p.label) - minC }));
  const odd = extras.length === 1 ? extras[0] : null;
  const value = odd && surplus % odd.over === 0 ? surplus / odd.over : null;
  const askedOk = odd != null && odd.label === ask;
  const inRange = value != null && value >= from && value <= to;
  const matchesStored = problem.shortAnswer == null || Number(problem.shortAnswer) === value;
  const failure = !odd
    ? `check failed: ${extras.length} points sit on more lines than the rest, so no single digit is forced`
    : !askedOk
    ? `check failed: the busiest point is ${odd.label}, not the ${ask} the question asks for`
    : value == null || !inRange
    ? `check failed: ${surplus} left over does not split into a digit between ${from} and ${to}`
    : !matchesStored
    ? `check failed: the counting gives ${value}, the stored answer is ${problem.shortAnswer}`
    : "";

  const lastStep = totalSteps - 1;
  const isFinal = step >= lastStep;
  const tallied = isFinal || step >= 1;
  const paired = isFinal || step >= 2;

  // ---- geometry ----
  const W = 360;
  const H = 292;
  const bx0 = 20;
  const by0 = 14;
  const bw = 320;
  const bh = 170;
  const px = (p: Pt) => bx0 + p.x * bw;
  const py = (p: Pt) => by0 + p.y * bh;

  // each line runs off the edge of the figure, as the contest prints it
  const clipped = lines.map((ln) => {
    const a = at(ln[0]);
    const b = at(ln[ln.length - 1]);
    if (!a || !b) return null;
    const ax = px(a);
    const ay = py(a);
    let dx = px(b) - ax;
    let dy = py(b) - ay;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    let tmin = -1e9;
    let tmax = 1e9;
    const edges: [number, number][] = [
      [-dx, ax - bx0],
      [dx, bx0 + bw - ax],
      [-dy, ay - by0],
      [dy, by0 + bh - ay],
    ];
    for (const [pE, qE] of edges) {
      if (Math.abs(pE) < 1e-9) {
        if (qE < 0) return null;
      } else if (pE < 0) tmin = Math.max(tmin, qE / pE);
      else tmax = Math.min(tmax, qE / pE);
    }
    return { x1: ax + dx * tmin, y1: ay + dy * tmin, x2: ax + dx * tmax, y2: ay + dy * tmax, len: tmax - tmin, t0: tmin };
  });

  // the figure is only honest if the listed points really are on the line
  const drift = lines.map((ln, i) => {
    const c = clipped[i];
    if (!c) return 99;
    const vx = c.x2 - c.x1;
    const vy = c.y2 - c.y1;
    const L = Math.hypot(vx, vy) || 1;
    return Math.max(
      ...ln.map((l) => {
        const p = at(l);
        if (!p) return 99;
        return Math.abs((px(p) - c.x1) * vy - (py(p) - c.y1) * vx) / L;
      }),
    );
  });
  const bentLine = drift.findIndex((d) => d > 1.6);

  // where each token lands: one column per point, one row per line through it
  const colX = (i: number) => bx0 + ((i + 0.5) * bw) / Math.max(1, pts.length);
  const rowY = (k: number) => 248 - k * 11;
  const tokenR = 4.6;

  const caption = isFinal
    ? `${ask} = ${total} − ${base} = ${value ?? "?"}`
    : step === 0
    ? `${lines.length} lines, ${pts.length} digits — and the ${lines.length} sums come to ${total}`
    : !paired
    ? `adding all ${lines.length} sums counts every point once per line — ${odd?.label ?? "?"} is on ${minC + (odd?.over ?? 0)}, the rest on ${minC}`
    : `${minC} of every digit is ${minC} × ${digitSum} = ${base}, whatever the arrangement — only the extra ${odd?.label ?? "?"} is left`;

  const note = isFinal
    ? failure
      ? failure
      : `the other ${pts.length - 1} digits are never pinned down — the count only ever needed their total, ${digitSum}`
    : step === 0
    ? `the digits ${from}–${to} go somewhere, one per point, but the figure does not say where`
    : !paired
    ? `${pts.length * minC + (odd?.over ?? 0)} tokens in all: ${minC} for each point, plus ${odd?.over ?? 0} extra on ${odd?.label ?? "?"}`
    : `${base} + ${ask} = ${total}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {/* the figure: every line runs to the edge, points marked on it */}
        {clipped.map((c, i) =>
          c ? (
            <motion.line
              key={`L${i}`}
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              stroke={LINE_COLORS[i % LINE_COLORS.length]}
              strokeWidth={1.7}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
            />
          ) : null,
        )}

        {/* the traveller that does the counting, one run per line */}
        <AnimatePresence>
          {tallied &&
            !paired &&
            clipped.map((c, i) =>
              c ? (
                <motion.g
                  key={`T${i}`}
                  initial={{ x: c.x1, y: c.y1, opacity: 0 }}
                  animate={{ x: [c.x1, c.x2], y: [c.y1, c.y2], opacity: [0, 1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.55, times: [0, 0.08, 0.9, 1] }}
                >
                  <circle cx={0} cy={0} r={5} fill={LINE_COLORS[i % LINE_COLORS.length]} opacity={0.55} />
                </motion.g>
              ) : null,
            )}
        </AnimatePresence>

        {pts.map((p, pi) => {
          const dir = p.dir.toUpperCase();
          const busiest = countOf(p.label) > minC;
          // the digit badge is far wider than the dot, so the label steps aside
          const push = isFinal && value != null && busiest ? 8 : 0;
          const ox = dir.includes("W") ? -12 - push : dir.includes("E") ? 12 + push : 0;
          const oy = dir.includes("N") ? -11 - push : dir.includes("S") ? 13 + push : 4;
          return (
            <motion.g
              key={p.label}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.5 + pi * 0.06 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <circle cx={px(p)} cy={py(p)} r={4.4} fill={INK} />
              {tallied && busiest && (
                <motion.circle
                  cx={px(p)}
                  cy={py(p)}
                  r={9}
                  fill="none"
                  stroke={EXTRA}
                  strokeWidth={1.8}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: paired ? 0.2 : 3 }}
                />
              )}
              <text
                x={px(p) + ox}
                y={py(p) + oy}
                textAnchor="middle"
                fontSize="12.5"
                fontWeight="800"
                fill={INK}
                fontFamily={numberFont}
                stroke="#fff"
                strokeWidth={2.6}
                paintOrder="stroke"
              >
                {p.label}
              </text>
            </motion.g>
          );
        })}

        {/* the digit, once the counting has produced it */}
        <AnimatePresence>
          {isFinal &&
            value != null &&
            odd != null &&
            (() => {
              const p = at(odd.label);
              if (!p) return null;
              return (
                <motion.g
                  key="dig"
                  initial={{ opacity: 0, y: -16, scale: 0.4 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.7 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <circle cx={px(p)} cy={py(p)} r={10} fill={WIN} />
                  <text x={px(p)} y={py(p) + 4.5} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                    {value}
                  </text>
                </motion.g>
              );
            })()}
        </AnimatePresence>

        {/* step one: the five sums exactly as the problem hands them over */}
        <AnimatePresence>
          {!tallied && (
            <motion.g key="sums" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {lines.map((ln, i) => (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.9 + i * 0.11 }}
                >
                  <rect x={W / 2 - 62} y={196 + i * 14 - 7} width={9} height={9} rx={2} fill={LINE_COLORS[i % LINE_COLORS.length]} />
                  <text x={W / 2 - 46} y={196 + i * 14 + 2} fontSize="11" fontWeight="700" fill={INK} fontFamily={numberFont}>
                    {ln.join(" + ")}
                  </text>
                </motion.g>
              ))}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                <line x1={W / 2 - 62} x2={W / 2 + 62} y1={196 + lines.length * 14 - 3} y2={196 + lines.length * 14 - 3} stroke={IND} strokeWidth={1.3} />
                <text
                  x={W / 2}
                  y={196 + lines.length * 14 + 12}
                  textAnchor="middle"
                  fontSize="12.5"
                  fontWeight="800"
                  fill={IND}
                  fontFamily={numberFont}
                >
                  all five = {total}
                </text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the tally the sweep builds: one column per point */}
        <AnimatePresence>
          {tallied && (
            <motion.g key="tally" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* the copies that every point shares, whatever the digits are */}
              {paired && (
                <motion.rect
                  x={bx0 + 2}
                  y={rowY(minC - 1) - 8}
                  height={minC * 11 + 4}
                  rx={6}
                  fill={WIN}
                  opacity={0.16}
                  initial={{ width: 0 }}
                  animate={{ width: bw - 4 }}
                  transition={{ type: "spring", stiffness: 70, damping: 20, delay: 0.2 }}
                />
              )}
              {pts.map((p, i) => (
                <g key={`c${p.label}`}>
                  <text
                    x={colX(i)}
                    y={264}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="800"
                    fill={countOf(p.label) > minC ? "#92400e" : INK}
                    fontFamily={numberFont}
                  >
                    {p.label}
                  </text>
                  {(counts.get(p.label) ?? []).map((lineIdx, k) => {
                    const extraOne = paired && k >= minC;
                    return (
                      <motion.g
                        key={k}
                        initial={{ x: px(p) - colX(i), y: py(p) - rowY(k), opacity: 0, scale: 0.4 }}
                        animate={{ x: 0, y: extraOne ? -9 : 0, opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 170,
                          damping: 18,
                          delay: paired ? 0.35 : 0.35 + lineIdx * 0.55,
                        }}
                      >
                        <motion.circle
                          cx={colX(i)}
                          cy={rowY(k)}
                          fill={LINE_COLORS[lineIdx % LINE_COLORS.length]}
                          stroke={extraOne ? EXTRA : "#fff"}
                          strokeWidth={extraOne ? 2 : 0.8}
                          animate={{ r: isFinal && extraOne ? 8.5 : tokenR }}
                          transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.6 }}
                        />
                        {/* the leftover token is the answer, so let it say so */}
                        {isFinal && extraOne && value != null && (
                          <motion.text
                            x={colX(i)}
                            y={rowY(k) + 3.2}
                            textAnchor="middle"
                            fontSize="9.5"
                            fontWeight="800"
                            fill="#fff"
                            fontFamily={numberFont}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.85 }}
                          >
                            {value}
                          </motion.text>
                        )}
                      </motion.g>
                    );
                  })}
                </g>
              ))}

              {/* what the shared copies come to, and what is left over */}
              {paired && odd != null && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.75 }}>
                  <text x={bx0 + 4} y={278} fontSize="10.5" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                    {minC} × {digitSum} = {base}
                  </text>
                  <text x={bx0 + bw - 4} y={278} textAnchor="end" fontSize="10.5" fontWeight="800" fill="#92400e" fontFamily={numberFont}>
                    + {odd.over > 1 ? `${odd.over} × ` : ""}
                    {odd.label} = {total}
                  </text>
                </motion.g>
              )}
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
          color: isFinal ? "#166534" : paired ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : paired ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : paired ? "#fde68a" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {(note || bentLine >= 0) && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: numberFont,
              fontSize: 11.5,
              fontWeight: 700,
              color: (isFinal && failure) || bentLine >= 0 ? BAD : "#94a3b8",
              textAlign: "center",
            }}
          >
            {bentLine >= 0 ? `check failed: ${lines[bentLine].join(", ")} are not collinear as drawn` : note}
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
