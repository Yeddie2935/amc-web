import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const ODD = "#4338ca";
const EVEN = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WARN = "#b45309";
const LINE = "#cbd5e1";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** A die face drawn as a rounded tile, tinted by its parity. */
function Face({ x, y, s, v, muted = false }: { x: number; y: number; s: number; v: number; muted?: boolean }) {
  const c = v % 2 === 0 ? EVEN : ODD;
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} rx={s * 0.24} fill={muted ? "#f8fafc" : `${c}14`} stroke={muted ? LINE : c} strokeWidth={1.6} />
      <text
        x={x + s / 2}
        y={y + s / 2 + s * 0.17}
        textAnchor="middle"
        fontSize={s * 0.46}
        fontWeight="800"
        fill={muted ? DIM : c}
        fontFamily={numberFont}
      >
        {v}
      </text>
    </g>
  );
}

/**
 * Two dice with **arbitrary face values**, asking for the chance their sum has a
 * given parity. The sum is even exactly when the two faces **match in parity**,
 * so the whole problem is a counting one — and the picture that makes it obvious
 * is the 6×6 table of all 36 rolls. In the faces' printed order the winning
 * cells look **scattered**, but sorting the faces so the odds sit together
 * visibly snaps them into **two solid rectangles**: odd×odd and even×even. The
 * scene animates that sort (every cell springs from its printed position to its
 * sorted one), so the two blocks are discovered rather than asserted, and the
 * answer is then just their areas over the whole table.
 *
 * Nothing is asserted: all `n²` rolls are enumerated and their parities counted,
 * and that total is cross-checked against the block areas and against the stored
 * answer. The closing beat prices the slips — counting one block and forgetting
 * the other, assuming an **ordinary** die with half its faces odd (which is the
 * entire trap of this problem, and is normally an answer choice), and stopping
 * at the chance a single die is odd — each recomputed and matched against
 * `problem.choices`, so a slip hitting no choice is dropped rather than narrated.
 *
 * Data `{ faces: [1,2,3,5,7,8], want?: "even" | "odd" }`.
 */
export function ParityGridScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const faces = (Array.isArray(data.faces) ? data.faces : [])
    .map((v) => Math.round(Number(v)))
    .filter((v) => Number.isFinite(v));
  const want = String(data.want ?? "even") === "odd" ? "odd" : "even";
  const n = faces.length;
  const total = n * n;

  const odds = faces.filter((v) => v % 2 !== 0);
  const evens = faces.filter((v) => v % 2 === 0);
  const o = odds.length;
  const e = evens.length;

  // ---- enumerate every roll rather than trusting the block formula ----
  const wins = (() => {
    let c = 0;
    for (const a of faces) for (const b of faces) if ((a + b) % 2 === (want === "even" ? 0 : 1)) c += 1;
    return c;
  })();
  const blockSum = want === "even" ? o * o + e * e : 2 * o * e;
  const g = gcd(wins, total) || 1;
  const resNum = wins / g;
  const resDen = total / g;

  // ---- the sorted layout: odds first, then evens ----
  const sorted = [...odds, ...evens];
  const naturalIndex = (v: number) => faces.indexOf(v);
  const sortedIndex = (v: number) => sorted.indexOf(v);
  const isWin = (a: number, b: number) => (a + b) % 2 === (want === "even" ? 0 : 1);

  // winning rectangles in sorted-index space
  const blocks =
    want === "even"
      ? [
          { c0: 0, r0: 0, cw: o, rh: o, label: `${o} × ${o} = ${o * o}`, sub: "odd + odd" },
          { c0: o, r0: o, cw: e, rh: e, label: `${e} × ${e} = ${e * e}`, sub: "even + even" },
        ]
      : [
          { c0: o, r0: 0, cw: e, rh: o, label: `${o} × ${e} = ${o * e}`, sub: "odd + even" },
          { c0: 0, r0: o, cw: o, rh: e, label: `${e} × ${o} = ${o * e}`, sub: "even + odd" },
        ];

  // ---- answer choices as reduced fractions ----
  const asFraction = (text: string) => {
    const t = String(text).replace(/[−–—]/g, "-").trim();
    const m = t.match(/^(-?\d+)\s*(?:\/\s*(\d+))?$/);
    if (!m) return null;
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : 1;
    const k = gcd(a, b) || 1;
    return { n: a / k, d: b / k };
  };
  const choiceOf = (a: number, b: number) => {
    if (b === 0) return null;
    const k = gcd(a, b) || 1;
    return (
      (problem.choices ?? []).find((c) => {
        const f = asFraction(c.text);
        return f && f.n === a / k && f.d === b / k;
      })?.label ?? null
    );
  };

  const half = n / 2;
  const slips = [
    { label: `counted the ${blocks[0].sub} rolls but forgot ${blocks[1].sub}`, a: blocks[0].cw * blocks[0].rh, b: total },
    { label: `counted the ${blocks[1].sub} rolls but forgot ${blocks[0].sub}`, a: blocks[1].cw * blocks[1].rh, b: total },
    // a balanced die gives the same count either way: half² + half² = 2·half·half
    { label: `assumed an ordinary die, ${half} odd and ${half} even`, a: Number.isInteger(half) ? 2 * half * half : 0, b: total },
    { label: `stopped at the chance one die is odd`, a: o, b: n },
    { label: `stopped at the chance one die is even`, a: e, b: n },
  ]
    .map((s) => ({ ...s, choice: choiceOf(s.a, s.b) }))
    .filter((s) => s.a > 0 && s.choice != null && s.choice !== problem.answer)
    .filter((s, i, all) => all.findIndex((q) => q.choice === s.choice) === i)
    .sort((a, b) => String(a.choice).localeCompare(String(b.choice)));
  const choiceCount = (problem.choices ?? []).length;

  const stored = problem.shortAnswer != null ? asFraction(problem.shortAnswer) : null;
  const checks = [
    { ok: n >= 2, msg: "the die needs at least two faces" },
    { ok: o >= 1 && e >= 1, msg: "the two-block picture needs both an odd and an even face" },
    { ok: wins === blockSum, msg: `enumerating gives ${wins} winning rolls but the blocks cover ${blockSum}` },
    {
      ok: stored == null || (stored.n === resNum && stored.d === resDen),
      msg: `computed ${resNum}/${resDen} but the stored answer is ${problem.shortAnswer}`,
    },
  ];
  const failed = checks.find((c) => !c.ok);

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 480;
  const H = 258;

  // ---- beat 2 geometry ----
  const cell = 27;
  const GX = 96;
  const GY = 52;
  const colX = (v: number) => GX + sortedIndex(v) * cell;
  const rowY = (v: number) => GY + sortedIndex(v) * cell;
  const natColX = (v: number) => GX + naturalIndex(v) * cell;
  const natRowY = (v: number) => GY + naturalIndex(v) * cell;
  const PX = 282; // side panel

  // ---- beat 0 geometry ----
  const tile = 34;
  const stripGap = 8;
  const stripW = n * (tile + stripGap) - stripGap;
  const stripX = (W - stripW) / 2;

  const wantWord = want === "even" ? "even" : "odd";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 490 }}>
        <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
          {phase === 0
            ? `these are not ordinary dice — count the odd and even faces`
            : phase === 1
            ? `the sum is ${wantWord} exactly when the two faces ${want === "even" ? "match" : "differ"} in parity`
            : phase === 2
            ? `sort the faces and the winning rolls become solid blocks`
            : `${wins} winning rolls out of ${total}`}
        </text>

        {/* ================= beat 0: the faces and their parities ================= */}
        {phase === 0 && (
          <g>
            {[0, 1].map((d) => (
              <motion.g
                key={d}
                initial={{ opacity: 0, y: -10, rotate: d ? 8 : -8 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 + d * 0.12 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <rect x={W / 2 - 46 + d * 58} y={32} width={34} height={34} rx={8} fill="#fff" stroke={INK} strokeWidth={1.8} />
                <text x={W / 2 - 29 + d * 58} y={54} textAnchor="middle" fontSize="15" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  {faces[d % n]}
                </text>
              </motion.g>
            ))}
            <motion.text x={W / 2} y={84} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
              both dice carry the same six faces
            </motion.text>

            {faces.map((v, i) => (
              <motion.g
                key={`${v}-${i}`}
                initial={{ opacity: 0, y: 14, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 17, delay: 0.6 + i * 0.08 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <Face x={stripX + i * (tile + stripGap)} y={100} s={tile} v={v} />
                <text
                  x={stripX + i * (tile + stripGap) + tile / 2}
                  y={148}
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight="800"
                  fill={v % 2 === 0 ? EVEN : ODD}
                >
                  {v % 2 === 0 ? "even" : "odd"}
                </text>
              </motion.g>
            ))}

            {[
              { c: ODD, k: o, lab: "odd faces", x: W / 2 - 78 },
              { c: EVEN, k: e, lab: "even faces", x: W / 2 + 78 },
            ].map((r, i) => (
              <motion.g
                key={r.lab}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 14, delay: 1.3 + i * 0.2 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <rect x={r.x - 52} y={166} width={104} height={26} rx={13} fill={`${r.c}14`} stroke={r.c} strokeWidth={1.5} />
                <text x={r.x} y={183} textAnchor="middle" fontSize="11" fontWeight="800" fill={r.c} fontFamily={numberFont}>
                  {r.k} {r.lab}
                </text>
              </motion.g>
            ))}

            <motion.text x={W / 2} y={216} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
              an ordinary die splits {n / 2} and {n / 2} — this one does not, and that is the whole problem
            </motion.text>
          </g>
        )}

        {/* ================= beat 1: the parity rule on real faces ================= */}
        {phase === 1 && (
          <g>
            {[
              { a: odds[0], b: odds[1] ?? odds[0], tag: "odd + odd" },
              { a: evens[0], b: evens[1] ?? evens[0], tag: "even + even" },
              { a: odds[0], b: evens[0], tag: "odd + even" },
            ].map((r, i) => {
              const s = r.a + r.b;
              const good = s % 2 === (want === "even" ? 0 : 1);
              const y = 48 + i * 58;
              return (
                <g key={r.tag}>
                  {/* the two faces slide together, then the sum pops out */}
                  <motion.g
                    initial={{ opacity: 0, x: -26 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 + i * 0.35 }}
                  >
                    <Face x={112} y={y} s={34} v={r.a} />
                  </motion.g>
                  <motion.text x={158} y={y + 23} textAnchor="middle" fontSize="14" fontWeight="800" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.35 }}>
                    +
                  </motion.text>
                  <motion.g
                    initial={{ opacity: 0, x: 26 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 + i * 0.35 }}
                  >
                    <Face x={176} y={y} s={34} v={r.b} />
                  </motion.g>
                  <motion.text x={228} y={y + 23} textAnchor="middle" fontSize="14" fontWeight="800" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 + i * 0.35 }}>
                    =
                  </motion.text>
                  <motion.g
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.6 + i * 0.35 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <rect
                      x={248}
                      y={y}
                      width={44}
                      height={34}
                      rx={8}
                      fill={good ? "#dcfce7" : "#f1f5f9"}
                      stroke={good ? WIN : DIM}
                      strokeWidth={1.8}
                    />
                    <text x={270} y={y + 23} textAnchor="middle" fontSize="15" fontWeight="800" fill={good ? WIN : DIM} fontFamily={numberFont}>
                      {s}
                    </text>
                  </motion.g>
                  <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.85 + i * 0.35 }}>
                    <text x={306} y={y + 16} fontSize="10" fontWeight="800" fill={good ? WIN : DIM}>
                      {good ? "✓" : "✗"} {s % 2 === 0 ? "even" : "odd"} sum
                    </text>
                    <text x={306} y={y + 30} fontSize="9" fontWeight="700" fill={DIM}>
                      {r.tag}
                    </text>
                  </motion.g>
                </g>
              );
            })}
            <motion.text x={W / 2} y={228} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
              so the face values never matter — only whether the two parities {want === "even" ? "agree" : "disagree"}
            </motion.text>
          </g>
        )}

        {/* ================= beat 2: the 36-roll table, sorted into blocks ================= */}
        {phase === 2 && (
          <g>
            {/* column headers (die 1) */}
            {faces.map((v) => (
              <motion.g
                key={`c${v}`}
                initial={{ x: natColX(v) - colX(v), opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ opacity: { delay: 0.05 }, x: { type: "spring", stiffness: 170, damping: 20, delay: 1.35 } }}
              >
                <Face x={colX(v) + 3} y={26} s={21} v={v} />
              </motion.g>
            ))}
            {/* row headers (die 2) */}
            {faces.map((v) => (
              <motion.g
                key={`r${v}`}
                initial={{ y: natRowY(v) - rowY(v), opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ opacity: { delay: 0.05 }, y: { type: "spring", stiffness: 170, damping: 20, delay: 1.35 } }}
              >
                <Face x={70} y={rowY(v) + 3} s={21} v={v} />
              </motion.g>
            ))}

            {/* every roll, springing from its printed position into its sorted one */}
            {faces.map((rv, ri) =>
              faces.map((cv, ci) => {
                const good = isWin(rv, cv);
                const k = ri * n + ci;
                return (
                  <motion.g
                    key={`${rv}-${cv}`}
                    initial={{ x: natColX(cv) - colX(cv), y: natRowY(rv) - rowY(rv), opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{
                      opacity: { delay: 0.05 + k * 0.008 },
                      x: { type: "spring", stiffness: 170, damping: 20, delay: 1.35 },
                      y: { type: "spring", stiffness: 170, damping: 20, delay: 1.35 },
                    }}
                  >
                    <motion.rect
                      x={colX(cv) + 1}
                      y={rowY(rv) + 1}
                      width={cell - 2}
                      height={cell - 2}
                      rx={4}
                      stroke={LINE}
                      strokeWidth={0.8}
                      animate={{ fill: good ? "#dcfce7" : "#f8fafc" }}
                      transition={{ delay: 0.75 }}
                    />
                    <motion.text
                      x={colX(cv) + cell / 2}
                      y={rowY(rv) + cell / 2 + 3.5}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="800"
                      fontFamily={numberFont}
                      animate={{ fill: good ? WIN : DIM }}
                      transition={{ delay: 0.75 }}
                    >
                      {rv + cv}
                    </motion.text>
                  </motion.g>
                );
              })
            )}

            {/* the blocks the sort revealed */}
            {blocks.map((b, i) => (
              <motion.rect
                key={b.sub}
                x={GX + b.c0 * cell}
                y={GY + b.r0 * cell}
                width={b.cw * cell}
                height={b.rh * cell}
                rx={5}
                fill="none"
                stroke={WIN}
                strokeWidth={2.4}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 16, delay: 2.05 + i * 0.2 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            ))}

            {/* side panel: the two areas and their total */}
            {blocks.map((b, i) => (
              <motion.g key={`p${b.sub}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: 2.25 + i * 0.2 }}>
                <rect x={PX} y={60 + i * 44} width={182} height={36} rx={7} fill="#f0fdf4" stroke="#bbf7d0" strokeWidth={1.2} />
                <text x={PX + 10} y={75 + i * 44} fontSize="9.5" fontWeight="700" fill={DIM}>
                  {b.sub}
                </text>
                <text x={PX + 10} y={89 + i * 44} fontSize="12" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                  {b.label}
                </text>
              </motion.g>
            ))}
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 2.75 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <text x={PX + 10} y={168} fontSize="11" fontWeight="800" fill={INK}>
                {blocks[0].cw * blocks[0].rh} + {blocks[1].cw * blocks[1].rh} = {wins} winning rolls
              </text>
              <text x={PX + 10} y={186} fontSize="10" fontWeight="700" fill={DIM}>
                out of {n} × {n} = {total} in the table
              </text>
            </motion.g>
          </g>
        )}

        {/* ================= beat 3: the fraction, and what each wrong turn costs ================= */}
        {phase === 3 && (
          <g>
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.2 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <text x={150} y={58} textAnchor="middle" fontSize="15" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {wins}
              </text>
              <line x1={118} y1={66} x2={182} y2={66} stroke={INK} strokeWidth={1.8} />
              <text x={150} y={85} textAnchor="middle" fontSize="15" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {total}
              </text>
            </motion.g>
            {g > 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <text x={214} y={71} textAnchor="middle" fontSize="14" fontWeight="800" fill={DIM}>
                  =
                </text>
                <text x={214} y={94} textAnchor="middle" fontSize="12" fontWeight="700" fill={WARN} fontFamily={numberFont}>
                  ÷ {g}
                </text>
              </motion.g>
            )}
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.0 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <text x={280} y={58} textAnchor="middle" fontSize="17" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {resNum}
              </text>
              <line x1={244} y1={66} x2={316} y2={66} stroke={WIN} strokeWidth={2.2} />
              <text x={280} y={87} textAnchor="middle" fontSize="17" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {resDen}
              </text>
            </motion.g>

            {slips.length > 0 && (
              <motion.text x={W / 2} y={122} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                {slips.length + 1 >= choiceCount
                  ? "every other choice is a slip you can name"
                  : `${slips.length} of the ${choiceCount} choices are slips you can name`}
              </motion.text>
            )}
            {slips.map((s, i) => {
              const k = gcd(s.a, s.b) || 1;
              return (
                <motion.g key={String(s.choice)} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: 1.7 + i * 0.22 }}>
                  <rect x={22} y={132 + i * 28} width={436} height={24} rx={5} fill="#fffbeb" stroke="#fde68a" strokeWidth={1.2} />
                  <text x={34} y={149 + i * 28} fontSize="10" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                    {s.choice}
                  </text>
                  <text x={52} y={149 + i * 28} fontSize="9.5" fontWeight="700" fill={INK}>
                    {s.label}
                  </text>
                  <text x={446} y={149 + i * 28} textAnchor="end" fontSize="10" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                    {s.a}/{s.b} = {s.a / k}/{s.b / k}
                  </text>
                </motion.g>
              );
            })}
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
        {phase === 0
          ? `${o} odd faces, ${e} even faces`
          : phase === 1
          ? `${wantWord} sum needs ${want === "even" ? "matching" : "opposite"} parity`
          : phase === 2
          ? `${blocks[0].cw * blocks[0].rh} + ${blocks[1].cw * blocks[1].rh} = ${wins} of ${total}`
          : `${resNum}/${resDen}`}
      </motion.span>

      {failed && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failed.msg}</span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
