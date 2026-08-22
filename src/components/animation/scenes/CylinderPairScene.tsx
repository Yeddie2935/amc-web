import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const AMB = "#b45309";
const COOL = "#0891b2";

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

/** Bottom-pinned growth: Motion pivots at the shape's own centre, so the scale
 *  needs the matching translation to keep the base of the fill on the ground. */
function fillKeys(fromH: number, toH: number) {
  const k = toH > 0 ? fromH / toH : 0;
  return {
    initial: { scaleY: k, y: (toH * (1 - k)) / 2 },
    animate: { scaleY: 1, y: 0 },
  };
}

/**
 * Two cylinders built from the **same pair of numbers with the roles swapped** —
 * one tall and narrow, one short and wide — asking how their volumes compare.
 *
 * The whole problem is that the swap is not a fair trade: `V = πr²h` squares the
 * radius but not the height, so doubling one and halving the other does not
 * cancel. The scene makes that countable rather than algebraic by drawing `r²`
 * as a **literal square of unit cells** beside each base — 3 × 3 against 6 × 6 —
 * and then partitioning the wide can's square into **four copies of the narrow
 * can's**, which is exact (a 6 × 6 grid really is four 3 × 3 grids). So "the
 * base quadruples" is read off the picture, and against it the height merely
 * halves.
 *
 * Volume itself is drawn as a sweep: the base disc lifts from the bottom of the
 * can to the top, filling it, which is `base × height` happening rather than
 * being asserted. Both cans stand on one ground line at one scale, so the short
 * wide one visibly holds more.
 *
 * The closing beat prices every misreading and matches each against
 * `problem.choices`: the naive "same numbers, same volume" (1 : 1), the base
 * ratio with the height forgotten (1 : 4), and both of those reversed — which on
 * this problem accounts for the **entire** answer list, so no distractor is left
 * unexplained. All arithmetic is exact integers in units of π (`r²h`), never
 * floating point, and the diameter → radius halving is called out because using
 * the diameter as the radius is the other classic slip; data
 * `{ cans: ["Alex|🧑|6|12", ...], unit? }` as name|icon|diameter|height.
 */
export function CylinderPairScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const unit = typeof data.unit === "string" ? data.unit : "cm";
  const cans = (Array.isArray(data.cans) ? data.cans : []).slice(0, 2).map((c, i) => {
    const [name, icon, d, h] = String(c).split("|");
    const dia = num(d, 0);
    return {
      name: name ?? `can ${i + 1}`,
      icon: icon || "🥫",
      dia,
      r: dia / 2,
      h: num(h, 0),
      color: i === 0 ? COOL : AMB,
    };
  });

  const ok2 = cans.length === 2 && cans.every((c) => c.r > 0 && c.h > 0);
  const A = cans[0];
  const B = cans[1];

  // ---------------- volumes, as exact integer multiples of π ----------------
  const kA = ok2 ? A.r * A.r * A.h : 0;
  const kB = ok2 ? B.r * B.r * B.h : 0;
  const g = gcd(kA, kB) || 1;
  const rA = kA / g;
  const rB = kB / g;

  // ---------------- every reading of the comparison, priced ----------------
  const norm = (s: string) => s.replace(/\s/g, "").replace(/[−–—]/g, "-");
  const findChoice = (a: number, b: number) => {
    const gg = gcd(a, b) || 1;
    const want = `${a / gg}:${b / gg}`;
    return (problem.choices ?? []).find((c) => norm(String(c.text)) === want);
  };
  const baseG = ok2 ? gcd(A.r * A.r, B.r * B.r) || 1 : 1;
  const readings = ok2
    ? [
        { key: "answer", a: rA, b: rB, why: "volume to volume", choice: findChoice(kA, kB) },
        { key: "flip", a: rB, b: rA, why: "the ratio the wrong way round", choice: findChoice(kB, kA) },
        {
          key: "base",
          a: (A.r * A.r) / baseG,
          b: (B.r * B.r) / baseG,
          why: "the bases only — height forgotten",
          choice: findChoice(A.r * A.r, B.r * B.r),
        },
        {
          key: "baseflip",
          a: (B.r * B.r) / baseG,
          b: (A.r * A.r) / baseG,
          why: "the bases, reversed",
          choice: findChoice(B.r * B.r, A.r * A.r),
        },
        { key: "same", a: 1, b: 1, why: "\"same two numbers, so the same\"", choice: findChoice(1, 1) },
      ]
    : [];
  const hits = readings.filter((r) => r.choice);
  const others = hits.filter((r) => r.key !== "answer");
  const allCovered = hits.length === (problem.choices ?? []).length;

  // how the trade actually goes: base ×(rB/rA)², height ×(hB/hA)
  const baseTimes = ok2 ? (B.r * B.r) / (A.r * A.r) : 0;
  const heightTimes = ok2 ? B.h / A.h : 0;

  // ---------------- self-checks ----------------
  const wholeOk = ok2 && Number.isInteger(A.r) && Number.isInteger(B.r);
  const storedOk =
    problem.shortAnswer == null || norm(String(problem.shortAnswer)) === `${rA}:${rB}`;
  const tradeOk = ok2 && Math.abs(baseTimes * heightTimes - kB / kA) < 1e-9;
  const check = ok2 && wholeOk && storedOk && tradeOk;
  const failed = !ok2
    ? "needs exactly two cans with real dimensions"
    : !wholeOk
    ? "a diameter is odd, so r² is not a whole grid of cells"
    : !storedOk
    ? `computed ${rA} : ${rB}, stored answer ${problem.shortAnswer}`
    : `base ×${baseTimes} and height ×${heightTimes} do not give ${kB}/${kA}`;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const phase = isFinal ? 3 : Math.min(step, 2);

  // ---------------- geometry ----------------
  const W = 480;
  const H = 278;
  const PPC = 9.5;
  const BASE_Y = 208;
  const PX = 262;
  const centre = [80, 188];
  const rx = (c: typeof A) => c.r * PPC;
  const ry = (c: typeof A) => c.r * PPC * 0.28;
  const bh = (c: typeof A) => c.h * PPC;

  // the r² grid: the same cell size for both, so 36 visibly dwarfs 9
  const CELLPX = 9;
  const GRIDX = PX + 4;
  const GRIDY = 62;

  const active = phase === 1 ? 0 : phase === 2 ? 1 : -1;
  const filled = (i: number) => (phase === 3 ? true : phase >= i + 1);

  const caption =
    !ok2
      ? "two cans needed"
      : phase === 0
      ? `both cans are built from ${A.dia} and ${A.h} ${unit} — just swapped over`
      : phase === 1
      ? `${A.name}: base π × ${A.r}² = ${A.r * A.r}π, swept up ${A.h} ${unit} → ${kA}π`
      : phase === 2
      ? `${B.name}: base π × ${B.r}² = ${B.r * B.r}π, swept up ${B.h} ${unit} → ${kB}π`
      : `${kA}π : ${kB}π = ${rA} : ${rB}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* the shelf both cans stand on, so the comparison is honest */}
        <line x1={20} y1={BASE_Y} x2={248} y2={BASE_Y} stroke="#cbd5e1" strokeWidth={2} />

        {ok2 &&
          cans.map((c, i) => {
            const cx = centre[i];
            const RX = rx(c);
            const RY = ry(c);
            const HH = bh(c);
            const top = BASE_Y - HH;
            const dim = active >= 0 && active !== i;
            const keys = fillKeys(0, HH);
            return (
              <motion.g key={c.name} animate={{ opacity: dim ? 0.35 : 1 }} transition={{ duration: 0.3 }}>
                {/* bottom disc, hidden behind the body except for its front arc */}
                <ellipse cx={cx} cy={BASE_Y} rx={RX} ry={RY} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1.2} />
                <rect x={cx - RX} y={top} width={RX * 2} height={HH} fill="#f1f5f9" stroke="none" />

                {/* the sweep: the base disc lifts from the floor to the lid */}
                {filled(i) && (
                  <g>
                    <motion.g
                      initial={keys.initial}
                      animate={keys.animate}
                      transition={{ duration: 0.9, delay: phase === 3 ? 0 : 0.55, ease: "easeOut" }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <rect x={cx - RX} y={top} width={RX * 2} height={HH} fill={c.color} opacity={0.32} />
                    </motion.g>
                    <motion.g
                      initial={{ y: HH }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.9, delay: phase === 3 ? 0 : 0.55, ease: "easeOut" }}
                    >
                      <ellipse cx={cx} cy={top} rx={RX} ry={RY} fill={c.color} opacity={0.75} />
                    </motion.g>
                  </g>
                )}

                {/* the can's own outline, over the fill */}
                <rect x={cx - RX} y={top} width={RX * 2} height={HH} fill="none" stroke={INK} strokeWidth={1.6} />
                <ellipse cx={cx} cy={top} rx={RX} ry={RY} fill="none" stroke={INK} strokeWidth={1.6} />

                {/* who it belongs to, and the two given measurements */}
                <text x={cx} y={BASE_Y + 20} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK}>
                  {c.icon} {c.name}
                </text>
                <text x={cx} y={BASE_Y + 33} textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b" fontFamily={numberFont}>
                  d {c.dia} · h {c.h}
                </text>

                {/* the diameter, and the radius it halves to */}
                {(phase === 0 || active === i) && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                    <line x1={cx - RX} y1={top} x2={cx + RX} y2={top} stroke={BAD} strokeWidth={1.6} />
                    <line x1={cx} y1={top} x2={cx + RX} y2={top} stroke={WIN} strokeWidth={2.6} />
                    {/* clear of the lid: a wide can's ellipse is deep, so
                        `top − 8` would land on the painted surface */}
                    <text x={cx + RX / 2} y={top - RY - 5} textAnchor="middle" fontSize="9" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                      r {c.r}
                    </text>
                  </motion.g>
                )}
              </motion.g>
            );
          })}

        {/* ---------------- the panel ---------------- */}
        {ok2 && phase === 0 && (
          <g>
            <text x={PX} y={26} fontSize="11.5" fontWeight="800" fill={INK}>
              the same numbers, swapped
            </text>
            {cans.map((c, i) => (
              <motion.g key={c.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.25 }}>
                <text x={PX} y={50 + i * 20} fontSize="11" fontWeight="700" fill={c.color} fontFamily={numberFont}>
                  {c.name}: {c.dia} wide, {c.h} tall
                </text>
              </motion.g>
            ))}
            {[
              { d: 1.0, t: "so it is tempting to call them", c: "#475569" },
              { d: 1.2, t: "equal — but the volume is", c: "#475569" },
              { d: 1.5, t: "π r² h, and only the radius", c: INK },
              { d: 1.7, t: "gets squared.", c: INK },
              { d: 2.1, t: `(and r is half of d: ${A.dia} → ${A.r})`, c: BAD },
            ].map((l, i) => (
              <motion.text key={i} x={PX} y={108 + i * 17} fontSize="10.5" fontWeight={l.c === INK ? "800" : "600"} fill={l.c} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: l.d }}>
                {l.t}
              </motion.text>
            ))}
          </g>
        )}

        {/* one can's volume, with r² drawn as a square you can count */}
        {ok2 && active >= 0 && (
          <g>
            {(() => {
              const c = cans[active];
              const n = c.r;
              const gridW = n * CELLPX;
              return (
                <g>
                  <text x={PX} y={26} fontSize="11.5" fontWeight="800" fill={c.color}>
                    {c.icon} {c.name}&apos;s can
                  </text>
                  <text x={PX} y={44} fontSize="10" fontWeight="600" fill="#475569">
                    r² is a square {n} by {n}:
                  </text>

                  {/* the r² cells */}
                  {Array.from({ length: n }, (_, rr) =>
                    Array.from({ length: n }, (_, cc) => (
                      <motion.rect
                        key={`${rr}-${cc}`}
                        x={GRIDX + cc * CELLPX}
                        y={GRIDY + rr * CELLPX}
                        width={CELLPX - 1}
                        height={CELLPX - 1}
                        fill={c.color}
                        opacity={0.55}
                        initial={{ opacity: 0, scale: 0.3 }}
                        animate={{ opacity: 0.55, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.25 + (rr + cc) * 0.03 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      />
                    )),
                  )}

                  {/* the wide can's square really is four copies of the narrow one */}
                  {active === 1 && B.r === 2 * A.r && (
                    <g>
                      {[
                        [0, 0],
                        [1, 0],
                        [0, 1],
                        [1, 1],
                      ].map(([qx, qy], i) => (
                        <motion.rect
                          key={i}
                          x={GRIDX + qx * A.r * CELLPX}
                          y={GRIDY + qy * A.r * CELLPX}
                          width={A.r * CELLPX - 1}
                          height={A.r * CELLPX - 1}
                          fill="none"
                          stroke={COOL}
                          strokeWidth={1.8}
                          strokeDasharray="3 2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.1 + i * 0.14 }}
                        />
                      ))}
                      <motion.text
                        x={GRIDX + gridW + 8}
                        y={GRIDY + gridW - 2}
                        fontSize="9.5"
                        fontWeight="800"
                        fill={COOL}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.7 }}
                      >
                        4 × {A.r * A.r}
                      </motion.text>
                    </g>
                  )}

                  {/* the arithmetic, one line per multiplication */}
                  {[
                    { d: 0.9, t: `r² = ${n * n}`, c: INK, s: 12 },
                    { d: 1.2, t: `base = ${n * n}π`, c: c.color, s: 13 },
                    { d: 1.6, t: `swept up h = ${c.h}`, c: "#475569", s: 10.5 },
                    { d: 2.0, t: `${n * n}π × ${c.h} = ${n * n * c.h}π`, c: IND, s: 15 },
                  ].map((l, i) => (
                    <motion.text
                      key={i}
                      x={PX}
                      y={GRIDY + Math.max(gridW, 30) + 26 + i * 21}
                      fontSize={l.s}
                      fontWeight={l.s > 11 ? "800" : "600"}
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
              );
            })()}
          </g>
        )}

        {/* ---------------- the comparison ---------------- */}
        {ok2 && phase === 3 && (
          <g>
            <text x={PX} y={24} fontSize="11.5" fontWeight="800" fill={INK}>
              the trade
            </text>

            {/* the two volumes as bars at one scale */}
            {[
              { c: A, k: kA },
              { c: B, k: kB },
            ].map((row, i) => {
              const full = 150;
              const w = (row.k / Math.max(kA, kB)) * full;
              return (
                <g key={row.c.name}>
                  <motion.rect
                    x={PX}
                    y={38 + i * 26}
                    width={w}
                    height={18}
                    rx={4}
                    fill={row.c.color}
                    opacity={0.75}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
                    style={{ transformBox: "fill-box", transformOrigin: "left" }}
                  />
                  <text x={PX + w + 6} y={51 + i * 26} fontSize="11" fontWeight="800" fill={row.c.color} fontFamily={numberFont}>
                    {row.k}π
                  </text>
                </g>
              );
            })}

            {[
              { d: 1.0, t: `base × ${baseTimes}, height × ${heightTimes === 0.5 ? "½" : heightTimes}`, c: "#475569", s: 10.5 },
              { d: 1.3, t: `so the volume × ${baseTimes * heightTimes}`, c: AMB, s: 11 },
              { d: 1.7, t: `${rA} : ${rB}`, c: WIN, s: 19 },
            ].map((l, i) => (
              <motion.text
                key={i}
                x={PX}
                y={110 + i * 22 + (i === 2 ? 6 : 0)}
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

            {/* every other reading, and the choice it lands on */}
            <motion.text x={PX} y={190} fontSize="9.5" fontWeight="700" fill="#64748b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
              {allCovered ? "the other choices are the slips:" : "other readings land on:"}
            </motion.text>
            {others.map((r, i) => (
              <motion.g key={r.key} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.3 + i * 0.15 }}>
                <text x={PX} y={205 + i * 14} fontSize="9.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                  {r.choice!.label}
                </text>
                <text x={PX + 14} y={205 + i * 14} fontSize="9.5" fontWeight="600" fill="#64748b">
                  {r.a} : {r.b} — {r.why}
                </text>
              </motion.g>
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

      {!check && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failed}</span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 3.0 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
