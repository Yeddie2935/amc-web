import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WARN = "#b45309";
const DARK = "#64748b";
const LIGHT = "#cbd5e1";

const W = 520;
const H = 300;
const SQ3 = Math.sqrt(3);

type Cell = { q: number; r: number };

/** Hex (axial) distance from the centre — the band a dot sits in. */
const band = (c: Cell) => (Math.abs(c.q) + Math.abs(c.r) + Math.abs(c.q + c.r)) / 2;

/** Every dot within `k` bands of the centre. */
function disc(k: number): Cell[] {
  const out: Cell[] = [];
  for (let q = -k; q <= k; q += 1) {
    for (let r = Math.max(-k, -q - k); r <= Math.min(k, -q + k); r += 1) out.push({ q, r });
  }
  return out;
}

/**
 * The band at distance k, walked in order so it splits into 6 straight arms of
 * k dots — which is where 6k comes from.
 */
function ring(k: number): Cell[] {
  if (k === 0) return [{ q: 0, r: 0 }];
  const dirs = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
  ];
  const out: Cell[] = [];
  let q = dirs[4][0] * k;
  let r = dirs[4][1] * k;
  for (let i = 0; i < 6; i += 1) {
    for (let j = 0; j < k; j += 1) {
      out.push({ q, r });
      q += dirs[i][0];
      r += dirs[i][1];
    }
  }
  return out;
}

/**
 * Hexagons of dots growing by one band at a time (centred hexagonal numbers),
 * asking for the next total. The contest figure already **colours the bands**,
 * which is the whole structure: a hexagon is a centre plus rings, and the ring at
 * distance k holds exactly `6k` dots because it walks 6 straight arms of k. The
 * scene earns that rather than asserting it — it walks the ring in order, lifts
 * the 6 arms out of the figure's *own* third hexagon and stacks them in a row, so
 * `6 × 2 = 12` is checked against a hexagon whose total the reader can already
 * see (7 + 12 = 19). Only then does the same rule build the next one.
 *
 * The trap is an off-by-one: the 4th hexagon's new band is the ring at distance
 * **3**, not 4, so `6 × 4 = 24` gives 43 — normally an answer choice, and the
 * scene finds its letter in `problem.choices` rather than being told. The closing
 * beat also re-adds the dots **by rows** (4+5+6+7+6+5+4), the route the written
 * solution takes, so the two independent counts have to agree.
 *
 * Every dot is generated from axial hex coordinates, so the totals, the bands,
 * the arms and the row counts are all counted off the figure the scene drew;
 * data `{ target, shown? }` — which hexagon is asked for, and how many the
 * contest figure shows.
 */
export function HexRingsScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const target = Math.max(2, Math.round(num(data.target, 4)));
  const shown = Math.min(target - 1, Math.max(1, Math.round(num(data.shown, 3))));

  // ---- counted off the generated figure, never from a formula ----
  const totalOf = (n: number) => disc(n - 1).length;
  const totals = Array.from({ length: target }, (_, i) => totalOf(i + 1));
  const goal = totals[target - 1];
  const prev = totals[target - 2];
  const newBand = target - 1; // the band the next hexagon adds
  const added = ring(newBand).length;
  const proofBand = shown - 1; // the outer band of the last hexagon the figure shows
  const proofAdded = ring(proofBand).length;

  const rowsOf = (k: number) => {
    const byRow = new Map<number, number>();
    disc(k).forEach((c) => byRow.set(c.r, (byRow.get(c.r) ?? 0) + 1));
    return [...byRow.entries()].sort((a, b) => a[0] - b[0]).map(([, n]) => n);
  };
  const rows = rowsOf(target - 1);
  const rowSum = rows.reduce((a, b) => a + b, 0);

  // ---- the off-by-one: the new band is ring target-1, not ring target ----
  const choiceFor = (value: number) => {
    const hit = (problem.choices ?? []).find((c) => {
      const v = Number(
        String(c.text)
          .replace(/[−–—]/g, "-")
          .replace(/[^\d.-]/g, "")
      );
      return Number.isFinite(v) && v === value;
    });
    return hit?.label ?? null;
  };
  const slipAdded = 6 * target;
  const slipTotal = prev + slipAdded;
  const slipChoice = slipTotal === goal ? null : choiceFor(slipTotal);

  const answerNum = Number(String(problem.shortAnswer ?? "").replace(/[^\d.-]/g, ""));
  const answerOk = !Number.isFinite(answerNum) || answerNum === goal;
  const rowsOk = rowSum === goal;
  const ok = answerOk && rowsOk;

  const lastStep = totalSteps - 1;
  const isFinal = beat >= lastStep;
  const phase = isFinal ? 3 : Math.min(Math.max(beat, 0), 3);

  // ---------------- drawing ----------------
  const at = (c: Cell, s: number, cx: number, cy: number) => ({
    x: cx + s * (c.q + c.r / 2),
    y: cy + s * (SQ3 / 2) * c.r,
  });

  const Outline = ({ k, s, cx, cy, dotR, delay }: { k: number; s: number; cx: number; cy: number; dotR: number; delay: number }) => {
    const R = s * k + dotR * 1.25;
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i;
      return `${cx + R * Math.cos(a)},${cy + R * Math.sin(a)}`;
    }).join(" ");
    return (
      <motion.polygon
        points={pts}
        fill="none"
        stroke={INK}
        strokeWidth={1.6}
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18, delay }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    );
  };

  const Dot = ({
    x,
    y,
    r,
    fill,
    delay,
    dx = 0,
    dy = 0,
    ringed = false,
  }: {
    x: number;
    y: number;
    r: number;
    fill: string;
    delay: number;
    dx?: number;
    dy?: number;
    ringed?: boolean;
  }) => {
    const flying = dx !== 0 || dy !== 0;
    return (
      <motion.g
        initial={flying ? { x: dx, y: dy, opacity: 1 } : { opacity: 0, scale: 0 }}
        animate={flying ? { x: 0, y: 0, opacity: 1 } : { opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 16, delay }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <circle cx={x} cy={y} r={r} fill={fill} stroke={ringed ? WARN : "none"} strokeWidth={ringed ? 1.6 : 0} />
      </motion.g>
    );
  };

  // band colours follow the contest figure: the bands alternate
  const bandFill = (b: number) => (b % 2 === 0 ? DARK : LIGHT);

  const title =
    phase === 0
      ? `each hexagon keeps the one before it and adds one more band`
      : phase === 1
      ? `a band is 6 straight arms — the band ${proofBand} out has ${6} × ${proofBand} = ${proofAdded} dots`
      : phase === 2
      ? `hexagon ${target} is hexagon ${target - 1} plus the band ${newBand} out`
      : `count the same dots by rows as a check`;

  const equation =
    phase === 0
      ? totals.slice(0, shown).join(",  ") + ",  ?"
      : phase === 1
      ? `${totals[shown - 2]} + ${proofAdded} = ${totals[shown - 1]}`
      : phase === 2
      ? `${prev} + 6 × ${newBand} = ${goal}`
      : `${rows.join(" + ")} = ${rowSum}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 520 }}>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
          {title}
        </text>

        {/* ============ phase 0: the hexagons the figure shows, band by band ============ */}
        {phase === 0 &&
          (() => {
            const s = 19;
            const dotR = s * 0.42;
            const widths = Array.from({ length: shown }, (_, i) => 2 * (s * i + dotR * 1.25));
            const gap = 30;
            const span = widths.reduce((a, b) => a + b, 0) + gap * (shown - 1);
            let run = (W - span) / 2;
            return (
              <g>
                {Array.from({ length: shown }).map((_, i) => {
                  const k = i;
                  const cx = run + widths[i] / 2;
                  run += widths[i] + gap;
                  const cy = 130;
                  return (
                    <g key={i}>
                      <Outline k={k} s={s} cx={cx} cy={cy} dotR={dotR} delay={0.1 + i * 0.3} />
                      {disc(k).map((c, j) => {
                        const p = at(c, s, cx, cy);
                        return (
                          <Dot
                            key={j}
                            x={p.x}
                            y={p.y}
                            r={dotR}
                            fill={bandFill(band(c))}
                            delay={0.25 + i * 0.3 + band(c) * 0.12}
                          />
                        );
                      })}
                      <motion.text
                        x={cx}
                        y={196}
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="800"
                        fill={IND}
                        fontFamily={numberFont}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.9 + i * 0.3 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      >
                        {totals[i]}
                      </motion.text>
                    </g>
                  );
                })}
                <motion.text
                  x={W / 2}
                  y={228}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="700"
                  fill={DIM}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.7 }}
                >
                  the figure shades the bands — that is the pattern to follow
                </motion.text>
              </g>
            );
          })()}

        {/* ====== phase 1: lift the outer band out and split it into its 6 arms ====== */}
        {phase === 1 &&
          (() => {
            const s = 22;
            const dotR = s * 0.42;
            const cx = 128;
            const cy = 150;
            const armDots = ring(proofBand);
            const rowX = 300;
            const rowGapY = Math.min(26, 150 / 6);
            return (
              <g>
                <Outline k={proofBand} s={s} cx={cx} cy={cy} dotR={dotR} delay={0.05} />
                {disc(proofBand)
                  .filter((c) => band(c) < proofBand)
                  .map((c, j) => {
                    const p = at(c, s, cx, cy);
                    return <Dot key={j} x={p.x} y={p.y} r={dotR} fill={bandFill(band(c))} delay={0.1 + j * 0.03} />;
                  })}
                {/* the holes the band left behind, so the lift is unambiguous */}
                {armDots.map((c, j) => {
                  const p = at(c, s, cx, cy);
                  return (
                    <motion.circle
                      key={`h${j}`}
                      cx={p.x}
                      cy={p.y}
                      r={dotR}
                      fill="none"
                      stroke={DIM}
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + j * 0.02 }}
                    />
                  );
                })}
                {/* the 6 arms, each flying from its place in the band into its own row */}
                {armDots.map((c, j) => {
                  const arm = Math.floor(j / proofBand);
                  const idx = j % proofBand;
                  const home = at(c, s, cx, cy);
                  const dest = { x: rowX + idx * (dotR * 2 + 6), y: 66 + arm * rowGapY };
                  return (
                    <Dot
                      key={`a${j}`}
                      x={dest.x}
                      y={dest.y}
                      r={dotR}
                      fill={bandFill(proofBand)}
                      dx={home.x - dest.x}
                      dy={home.y - dest.y}
                      delay={0.6 + arm * 0.16 + idx * 0.05}
                      ringed
                    />
                  );
                })}
                {Array.from({ length: 6 }).map((_, a) => (
                  <motion.text
                    key={`t${a}`}
                    x={rowX - 18}
                    y={70 + a * rowGapY}
                    textAnchor="end"
                    fontSize="10"
                    fontWeight="800"
                    fill={DIM}
                    fontFamily={numberFont}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + a * 0.16 }}
                  >
                    arm {a + 1}
                  </motion.text>
                ))}
                <motion.text
                  x={rowX + 20}
                  y={66 + 6 * rowGapY + 22}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="800"
                  fill={WARN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.8 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  6 × {proofBand} = {proofAdded}
                </motion.text>
              </g>
            );
          })()}

        {/* ============ phases 2 and 3: the hexagon being asked for ============ */}
        {phase >= 2 &&
          (() => {
            const k = target - 1;
            const s = 22;
            const dotR = s * 0.42;
            const cx = phase === 2 ? 168 : 190;
            const outlineR = s * k + dotR * 1.25;
            const cy = 156;
            const byRow = new Map<number, Cell[]>();
            disc(k).forEach((c) => byRow.set(c.r, [...(byRow.get(c.r) ?? []), c]));
            return (
              <g>
                <Outline k={k} s={s} cx={cx} cy={cy} dotR={dotR} delay={0.05} />
                {disc(k)
                  .filter((c) => band(c) < k)
                  .map((c, j) => {
                    const p = at(c, s, cx, cy);
                    return <Dot key={j} x={p.x} y={p.y} r={dotR} fill={bandFill(band(c))} delay={0.05 + j * 0.012} />;
                  })}
                {ring(k).map((c, j) => {
                  const p = at(c, s, cx, cy);
                  const arm = Math.floor(j / k);
                  return (
                    <Dot
                      key={`n${j}`}
                      x={p.x}
                      y={p.y}
                      r={dotR}
                      fill={phase === 2 ? WARN : bandFill(k)}
                      delay={phase === 2 ? 0.7 + arm * 0.22 + (j % k) * 0.06 : 0.05 + j * 0.012}
                      ringed={phase === 2}
                    />
                  );
                })}

                {/* row counts, read off the rows the scene drew */}
                {phase === 3 &&
                  [...byRow.entries()]
                    .sort((a, b) => a[0] - b[0])
                    .map(([r, cs], i) => {
                      const labelX = cx - outlineR - 13;
                      return (
                        <motion.g
                          key={r}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.5 + i * 0.16 }}
                        >
                          <circle cx={labelX} cy={cy + s * (SQ3 / 2) * r} r={9} fill="#eef2ff" stroke={IND} strokeWidth={1.2} />
                          <text
                            x={labelX}
                            y={cy + s * (SQ3 / 2) * r + 3.5}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="800"
                            fill={IND}
                            fontFamily={numberFont}
                          >
                            {cs.length}
                          </text>
                        </motion.g>
                      );
                    })}

                {/* right panel */}
                {phase === 2 && (
                  <g>
                    <motion.text
                      x={392}
                      y={110}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="800"
                      fill={INK}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      6 arms of {newBand} dots
                    </motion.text>
                    <motion.text
                      x={392}
                      y={140}
                      textAnchor="middle"
                      fontSize="17"
                      fontWeight="800"
                      fill={WARN}
                      fontFamily={numberFont}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.9 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      + {added}
                    </motion.text>
                    <motion.text
                      x={392}
                      y={170}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fill={DIM}
                      fontFamily={numberFont}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.1 }}
                    >
                      onto the {prev} already there
                    </motion.text>
                  </g>
                )}
                {phase === 3 && (
                  <g>
                    {[
                      { how: `band ${newBand}: 6 × ${newBand} = ${added}`, v: goal, tag: problem.answer ?? "", good: true },
                      ...(slipChoice
                        ? [{ how: `band ${target}: 6 × ${target} = ${slipAdded}`, v: slipTotal, tag: slipChoice, good: false }]
                        : []),
                    ].map((row, i) => (
                      <motion.g
                        key={row.tag + i}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 180, damping: 18, delay: 1.6 + i * 0.3 }}
                      >
                        <rect x={300} y={104 + i * 34} width={206} height={28} rx={5} fill={row.good ? "#dcfce7" : "#fef2f2"} stroke={row.good ? WIN : BAD} strokeWidth={1.1} />
                        <text x={308} y={116 + i * 34} fontSize="9.5" fontWeight="800" fill={row.good ? "#166534" : BAD} fontFamily={numberFont}>
                          {row.how}
                        </text>
                        <text x={308} y={127 + i * 34} fontSize="9.5" fontWeight="700" fill={row.good ? "#166534" : BAD} fontFamily={numberFont}>
                          {prev} + {row.good ? added : slipAdded} = {row.v} {row.good ? "✓" : "✗"} {row.tag}
                        </text>
                      </motion.g>
                    ))}
                    <motion.text
                      x={403}
                      y={186}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="700"
                      fill={DIM}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.2 }}
                    >
                      hexagon {target}'s new band is {newBand} out, not {target}
                    </motion.text>
                  </g>
                )}
              </g>
            );
          })()}

        <motion.text
          key={`eq${phase}`}
          x={W / 2}
          y={274}
          textAnchor="middle"
          fontSize="15"
          fontWeight="800"
          fill={IND}
          fontFamily={numberFont}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: phase === 0 ? 1.4 : 1.6 }}
        >
          {equation}
        </motion.text>
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
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {phase === 0
          ? `hexagons 1 to ${shown} hold ${totals.slice(0, shown).join(", ")} dots`
          : phase === 1
          ? `every band is 6 arms, so band ${proofBand} holds ${proofAdded}`
          : phase === 2
          ? `${prev} + ${added} = ${goal} dots`
          : `${goal} dots either way`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          {!rowsOk
            ? `check failed: the rows add to ${rowSum} but the bands give ${goal}`
            : `check failed: the figure holds ${goal}, the stored answer is ${problem.shortAnswer}`}
        </span>
      )}

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
