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
const TEAL = "#0d9488";

const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const fmt = (n: number) => n.toLocaleString("en-US");

/**
 * An equation multiplying two factorials against a coefficient times a third,
 * `a! · b! = k · N!`. Multiplying the whole thing out works but the numbers run to
 * eight digits; the move is to notice the coefficient is **already hiding inside
 * the smaller factorial**, and that whatever is left over is exactly the rung
 * `b!` needs to climb.
 *
 * The scene doesn't assert that split — it **searches the factors** of `a!` for a
 * subset whose product is `k`, and keeps the one whose complement multiplies to
 * `b + 1`. On 2020-12 that search returns 5! = [4,3] × [5,2,1] = 12 × 10, so the
 * five tiles physically regroup into a 12 and a 10, the 10 then flies onto the
 * head of the 9! ladder to make 10!, and the two 12s cancel off either side. Each
 * stage is re-multiplied and checked, so the regrouping is verified arithmetic
 * rather than a claim; if no such subset exists the scene falls back to the plain
 * `a!/k` leftover and says so.
 *
 * The closing beat sieves **the real answer list**: every choice is evaluated as
 * `k · N!` against the left-hand side, and because consecutive factorials differ
 * by a whole factor the wrong ones overshoot by 11×, 132×, 1716×, 24024× — a
 * pattern the scene reports, since it is what makes the answer unique rather than
 * merely correct. Factorials are capped so every value stays an exact integer in
 * a double; data `{ left: [5, 9], coef: 12, unknown?: "N" }`.
 */
export function FactorialRegroupScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const pair = (Array.isArray(data.left) ? data.left : [5, 9]).map((v) => Math.round(num(v, 1)));
  const A = Math.max(1, pair[0] ?? 5);
  const B = Math.max(1, pair[1] ?? 9);
  const coef = Math.max(1, Math.round(num(data.coef, 12)));
  const unknown = typeof data.unknown === "string" ? data.unknown : "N";

  // ---- solve it ----
  const fA = fact(A);
  const fB = fact(B);
  const lhs = fA * fB;
  let N = 0;
  for (let n = 1; n <= 20; n += 1) if (coef * fact(n) === lhs) N = n;
  const leftover = fA / coef;

  // ---- find which factors of a! make up the coefficient ----
  const factors = Array.from({ length: A }, (_, i) => A - i); // a, a-1, …, 1
  let take: number[] | null = null;
  let rest: number[] = [];
  for (let mask = 1; mask < 1 << A && !take; mask += 1) {
    const t = factors.filter((_, i) => mask & (1 << i));
    const r = factors.filter((_, i) => !(mask & (1 << i)));
    const tp = t.reduce((x, y) => x * y, 1);
    const rp = r.reduce((x, y) => x * y, 1);
    if (tp === coef && rp === B + 1) {
      take = t;
      rest = r;
    }
  }
  const splitFound = take !== null;

  // ---- sieve the real answer list ----
  const choices = (problem.choices ?? []).map((c) => ({
    label: c.label,
    n: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d-]/g, "")),
  }));
  const sieve = choices
    .filter((c) => Number.isFinite(c.n) && c.n > 0 && c.n <= 20)
    .map((c) => {
      const v = coef * fact(c.n);
      return { ...c, value: v, hit: v === lhs, ratio: v / lhs };
    });
  const winners = sieve.filter((s) => s.hit);

  // ---- self-checks ----
  const solvedOk = N > 0;
  const divisorOk = fA % coef === 0;
  const climbOk = leftover * fB === fact(B + 1);
  const uniqueOk = winners.length === 1;
  const answerOk = problem.shortAnswer == null || String(N) === String(problem.shortAnswer).replace(/[^\d]/g, "");
  const ok = solvedOk && divisorOk && climbOk && uniqueOk && answerOk;
  const failure = !divisorOk
    ? `${coef} does not divide ${A}!`
    : !solvedOk
    ? `no ${unknown} makes ${coef} · ${unknown}! equal ${fmt(lhs)}`
    : !climbOk
    ? `${leftover} × ${B}! is not ${B + 1}!`
    : !uniqueOk
    ? `${winners.length} of the choices balance the equation`
    : `solved ${unknown} = ${N}, answer says ${problem.shortAnswer}`;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 262;
  const TW = 20;
  const TH = 22;
  const PITCH = 23;

  const Tile = ({
    x,
    y,
    v,
    tone,
    w = TW,
    h = TH,
  }: {
    x: number;
    y: number;
    v: number | string;
    tone: string;
    w?: number;
    h?: number;
  }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={tone} fillOpacity={0.16} stroke={tone} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={tone} fontFamily={numberFont}>
        {v}
      </text>
    </g>
  );

  /** Lay a row of tiles out and hand back each one's x, so moves can be measured. */
  const rowXs = (x0: number, count: number) => Array.from({ length: count }, (_, i) => x0 + i * PITCH);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ============ phase 0: both sides written out as products ============ */}
        {phase === 0 &&
          (() => {
            const aX = rowXs(20, A);
            const bX = rowXs(20 + A * PITCH + 22, B);
            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  a factorial is just a run of factors — write both out
                </text>

                <text x={aX[0]} y={48} fontSize="10.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                  {A}!
                </text>
                {factors.map((v, i) => (
                  <motion.g key={v} initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 210, damping: 15, delay: 0.15 + i * 0.06 }}>
                    <Tile x={aX[i]} y={58} v={v} tone={IND} />
                  </motion.g>
                ))}
                <text x={aX[0] + (A * PITCH - 3) / 2} y={96} textAnchor="middle" fontSize="9" fontWeight="700" fill={IND} fontFamily={numberFont}>
                  = {fmt(fA)}
                </text>

                {/* the product dot belongs between the two runs, not over one of them */}
                <text x={(aX[A - 1] + TW + bX[0]) / 2} y={58 + TH / 2 + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={DIM}>
                  ·
                </text>
                <text x={bX[0]} y={48} fontSize="10.5" fontWeight="800" fill={TEAL} fontFamily={numberFont}>
                  {B}!
                </text>
                {Array.from({ length: B }, (_, i) => B - i).map((v, i) => (
                  <motion.g key={v} initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 210, damping: 15, delay: 0.5 + i * 0.05 }}>
                    <Tile x={bX[i]} y={58} v={v} tone={TEAL} />
                  </motion.g>
                ))}
                <text x={bX[0] + (B * PITCH - 3) / 2} y={96} textAnchor="middle" fontSize="9" fontWeight="700" fill={TEAL} fontFamily={numberFont}>
                  = {fmt(fB)}
                </text>

                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                  <text x={W / 2} y={140} textAnchor="middle" fontSize="15" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    {fmt(fA)} × {fmt(fB)} = {coef} × {unknown}!
                  </text>
                  <text x={W / 2} y={164} textAnchor="middle" fontSize="13" fontWeight="800" fill={IND} fontFamily={numberFont}>
                    {fmt(lhs)} = {coef} × {unknown}!
                  </text>
                </motion.g>
                <motion.text x={W / 2} y={200} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                  dividing that out works, but there is no need
                </motion.text>
                <motion.text x={W / 2} y={224} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={WIN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.85 }}>
                  the {coef} is already sitting inside {A}!
                </motion.text>
              </g>
            );
          })()}

        {/* ============ phase 1: the coefficient peels out of a! ============ */}
        {phase === 1 &&
          (() => {
            const topX = rowXs((W - (A * PITCH - 3)) / 2, A);
            const grpTake = take ?? [];
            const boxAw = grpTake.length * PITCH + 14;
            const boxBw = rest.length * PITCH + 14;
            const boxAx = W / 2 - boxAw - 26;
            const boxBx = W / 2 + 26;
            const takeX = rowXs(boxAx + 7, grpTake.length);
            const restX = rowXs(boxBx + 7, rest.length);
            const slotOf = (v: number) => factors.indexOf(v);
            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  {splitFound
                    ? `sort ${A}!'s factors into the ${coef} and what is left`
                    : `${A}! = ${coef} × ${leftover}`}
                </text>

                {/* the factors in their original order, ghosted where they came from */}
                {factors.map((v, i) => (
                  <g key={v}>
                    <rect x={topX[i]} y={44} width={TW} height={TH} rx={4} fill="none" stroke={DIM} strokeWidth={1.2} strokeDasharray="3 2" />
                    <text x={topX[i] + TW / 2} y={44 + TH / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                      {v}
                    </text>
                  </g>
                ))}
                <text x={topX[0] - 8} y={44 + TH / 2 + 4} textAnchor="end" fontSize="10.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                  {A}!
                </text>

                {splitFound && (
                  <>
                    {/* two boxes, and each tile slides from its old slot into one */}
                    <motion.rect x={boxAx} y={104} width={boxAw} height={TH + 14} rx={8} fill={BAD} fillOpacity={0.06} stroke={BAD} strokeWidth={1.8} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />
                    <motion.rect x={boxBx} y={104} width={boxBw} height={TH + 14} rx={8} fill={WIN} fillOpacity={0.06} stroke={WIN} strokeWidth={1.8} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />

                    {grpTake.map((v, i) => (
                      <motion.g
                        key={`t${v}`}
                        initial={{ x: topX[slotOf(v)] - takeX[i], y: 44 - 111, opacity: 0 }}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.35 + i * 0.12 }}
                      >
                        <Tile x={takeX[i]} y={111} v={v} tone={BAD} />
                      </motion.g>
                    ))}
                    {rest.map((v, i) => (
                      <motion.g
                        key={`r${v}`}
                        initial={{ x: topX[slotOf(v)] - restX[i], y: 44 - 111, opacity: 0 }}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.35 + (grpTake.length + i) * 0.12 }}
                      >
                        <Tile x={restX[i]} y={111} v={v} tone={WIN} />
                      </motion.g>
                    ))}

                    <motion.text x={boxAx + boxAw / 2} y={158} textAnchor="middle" fontSize="13" fontWeight="800" fill={BAD} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                      = {coef}
                    </motion.text>
                    <motion.text x={boxBx + boxBw / 2} y={158} textAnchor="middle" fontSize="13" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.45 }}>
                      = {leftover}
                    </motion.text>
                  </>
                )}

                <motion.text x={W / 2} y={196} textAnchor="middle" fontSize="14.5" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }}>
                  {A}! = {coef} × {leftover}
                </motion.text>
                <motion.text x={W / 2} y={226} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
                  the {coef} matches the right-hand side — the {leftover} still needs a home
                </motion.text>
              </g>
            );
          })()}

        {/* ============ phase 2: the leftover becomes b!'s next rung ============ */}
        {phase === 2 &&
          (() => {
            const newRow = Array.from({ length: B + 1 }, (_, i) => B + 1 - i); // b+1, b, …, 1
            const nX = rowXs((W - ((B + 1) * PITCH - 3)) / 2, B + 1);
            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  {leftover} × {B}! adds one more rung to the run
                </text>

                {/* the old b! row, for comparison */}
                <text x={nX[1] - 8} y={58} textAnchor="end" fontSize="10" fontWeight="800" fill={TEAL} fontFamily={numberFont}>
                  {B}!
                </text>
                {Array.from({ length: B }, (_, i) => B - i).map((v, i) => (
                  <g key={`old${v}`}>
                    <rect x={nX[i + 1]} y={46} width={TW} height={TH} rx={4} fill="none" stroke={DIM} strokeWidth={1.2} strokeDasharray="3 2" />
                    <text x={nX[i + 1] + TW / 2} y={46 + TH / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                      {v}
                    </text>
                  </g>
                ))}

                {/* the new row: the leftover lands at the head, the rest shift along */}
                {newRow.map((v, i) => {
                  const isNew = i === 0;
                  return (
                    <motion.g
                      key={`new${v}`}
                      initial={isNew ? { y: -62, opacity: 0 } : { x: nX[i - 1] - nX[i], y: 46 - 116, opacity: 0 }}
                      animate={{ x: 0, y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: isNew ? 110 : 80, damping: 15, delay: isNew ? 0.9 : 0.3 + i * 0.04 }}
                    >
                      <Tile x={nX[i]} y={116} v={v} tone={isNew ? WIN : TEAL} />
                    </motion.g>
                  );
                })}
                <motion.text x={nX[0] + TW / 2} y={108} textAnchor="middle" fontSize="9" fontWeight="800" fill={WIN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.25 }}>
                  the {leftover}
                </motion.text>
                <text x={nX[0] - 8} y={116 + TH / 2 + 4} textAnchor="end" fontSize="10.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                  {B + 1}!
                </text>

                <motion.text x={W / 2} y={186} textAnchor="middle" fontSize="14.5" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
                  {leftover} × {B}! = {B + 1}!
                </motion.text>
                <motion.text x={W / 2} y={210} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
                  {leftover} × {fmt(fB)} = {fmt(fact(B + 1))}
                </motion.text>
                <motion.text x={W / 2} y={238} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
                  so the left side is {coef} × {B + 1}!
                </motion.text>
              </g>
            );
          })()}

        {/* ============ phase 3: cancel, then sieve the answer list ============ */}
        {phase === 3 &&
          (() => {
            // laid out token by token so each coefficient can be struck exactly
            const FS = 16;
            const CW = FS * 0.6;
            const tokens = [String(coef), "·", `${B + 1}!`, "=", String(coef), "·", `${unknown}!`];
            const widths = tokens.map((t) => t.length * CW);
            const GAP = 9;
            const totalW = widths.reduce((a, b) => a + b, 0) + GAP * (tokens.length - 1);
            let run = W / 2 - totalW / 2;
            const xs = widths.map((w) => {
              const x = run;
              run += w + GAP;
              return x;
            });
            const strikeIdx = [0, 4];
            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  the same {coef} stands on both sides — strike it out
                </text>

                {tokens.map((t, i) => (
                  <text
                    key={i}
                    x={xs[i]}
                    y={54}
                    fontSize={FS}
                    fontWeight="800"
                    fill={strikeIdx.includes(i) ? BAD : INK}
                    fontFamily={numberFont}
                  >
                    {t}
                  </text>
                ))}
                {strikeIdx.map((i) => (
                  <motion.line
                    key={i}
                    x1={xs[i] - 2}
                    y1={48}
                    x2={xs[i] + widths[i] + 2}
                    y2={48}
                    stroke={BAD}
                    strokeWidth={2.2}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.35, delay: 0.4 + i * 0.05 }}
                  />
                ))}

                <motion.text x={W / 2} y={86} textAnchor="middle" fontSize="15" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                  {B + 1}! = {unknown}!   so   {unknown} = {N}
                </motion.text>

                {/* every choice tried against the real left-hand side */}
                <text x={W / 2} y={116} textAnchor="middle" fontSize="9" fontWeight="800" fill={DIM}>
                  test each choice against {fmt(lhs)}:
                </text>
                {sieve.map((s, i) => (
                  <motion.g key={s.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.15 + i * 0.13 }}>
                    <text x={96} y={134 + i * 15} fontSize="9" fontWeight="800" fill={s.hit ? WIN : BAD} fontFamily={numberFont}>
                      {s.label}
                    </text>
                    <text x={112} y={134 + i * 15} fontSize="9" fontWeight="700" fill={s.hit ? WIN : INK} fontFamily={numberFont}>
                      {coef} · {s.n}! = {fmt(s.value)}
                    </text>
                    <text x={W - 96} y={134 + i * 15} textAnchor="end" fontSize="9" fontWeight="800" fill={s.hit ? WIN : BAD} fontFamily={numberFont}>
                      {s.hit ? "✓ balances" : `${fmt(Math.round(s.ratio))}× too big`}
                    </text>
                  </motion.g>
                ))}

                <motion.text x={W / 2} y={140 + sieve.length * 15 + 12} textAnchor="middle" fontSize="9" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>
                  each rung up multiplies by the next integer, so only one can land
                </motion.text>
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
          ? `${A}! · ${B}! = ${coef} · ${unknown}!`
          : phase === 1
          ? `${A}! = ${coef} × ${leftover}`
          : phase === 2
          ? `${leftover} × ${B}! = ${B + 1}!`
          : `${unknown} = ${N}`}
      </motion.span>

      {!ok && <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>}

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
