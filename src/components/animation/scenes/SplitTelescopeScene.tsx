import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WARN = "#b45309";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** A stacked fraction centred on `x` with its bar on `y` — never an inline `a/b`. */
function Frac({
  x,
  y,
  top,
  bottom,
  color,
  size = 13,
  half = 24,
}: {
  x: number;
  y: number;
  top: string;
  bottom: string;
  color: string;
  size?: number;
  half?: number;
}) {
  return (
    <g>
      <text x={x} y={y - 7} textAnchor="middle" fontSize={size} fontWeight="800" fill={color} fontFamily={numberFont}>
        {top}
      </text>
      <line x1={x - half} y1={y} x2={x + half} y2={y} stroke={color} strokeWidth={1.6} />
      <text x={x} y={y + size + 3} textAnchor="middle" fontSize={size} fontWeight="800" fill={color} fontFamily={numberFont}>
        {bottom}
      </text>
    </g>
  );
}

/**
 * A product of the factors `n(n+2) / (n+1)²`, which looks like one telescoping
 * chain and is really **two**. Splitting each factor into `n/(n+1)` and
 * `(n+2)/(n+1)` gives two chains that cancel in **opposite directions** — in the
 * first, a numerator kills the denominator of the term *before* it; in the
 * second, the term *after* it — so the survivors are not a head and a tail but
 * the **four corners** of the two lanes: `from` and `to+1` from one chain,
 * `to+2` and `from+1` from the other. The split is drawn as a real pull-apart
 * (each factor's left half flies up into one lane and its right half down into
 * the other, every card carrying the same delta), and the cancellations are arcs
 * that visibly point backwards in one lane and forwards in the other.
 *
 * The closing beat is the payoff: on this problem **every** distractor is a
 * place the cancelling could have been stopped — keeping only the left corners
 * (`from/(from+1)`), only the right corners (`(to+2)/(to+1)`), only the second
 * chain (`(to+2)/(from+1)`), or evaluating just the final factor — and the scene
 * finds each by recomputing it and matching against `problem.choices`, so a slip
 * that hits no choice is dropped rather than narrated.
 *
 * The product is drawn as the **contest's own window** (three factors, its
 * ellipsis, two more), which is exactly wide enough to hold both end pairs and
 * genuine adjacent cancellations at each end. Arithmetic is exact: the whole
 * product is re-multiplied factor by factor, reducing after each step (the
 * running value never exceeds ~`to`, so nothing overflows), and checked against
 * the survivor route and the stored answer. Data `{ from, to }`.
 */
export function SplitTelescopeScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const from = Math.round(num(data.from, 1));
  const to = Math.round(num(data.to, 98));
  const count = to - from + 1;

  // ---- survivors: the four numbers the two chains could not pair off ----
  const aTop = from; // chain A numerator with no earlier denominator
  const aBot = to + 1; // chain A denominator with no later numerator
  const bTop = to + 2; // chain B numerator with no later denominator
  const bBot = from + 1; // chain B denominator with no earlier numerator
  const rawNum = aTop * bTop;
  const rawDen = aBot * bBot;
  const g = gcd(rawNum, rawDen) || 1;
  const resNum = rawNum / g;
  const resDen = rawDen / g;

  // ---- independent route: multiply every factor, reducing as we go ----
  const brute = (() => {
    let n = 1;
    let d = 1;
    for (let k = from; k <= to; k++) {
      n *= k * (k + 2);
      d *= (k + 1) * (k + 1);
      const q = gcd(n, d) || 1;
      n /= q;
      d /= q;
    }
    return { n, d };
  })();

  // ---- answer choices as reduced fractions (integers count as n/1) ----
  const asFraction = (text: string) => {
    const t = String(text).replace(/[−–—]/g, "-").trim();
    const m = t.match(/^(-?\d+)\s*(?:\/\s*(\d+))?$/);
    if (!m) return null;
    const n = Number(m[1]);
    const d = m[2] ? Number(m[2]) : 1;
    const k = gcd(n, d) || 1;
    return { n: n / k, d: d / k };
  };
  const choiceOf = (n: number, d: number) => {
    const k = gcd(n, d) || 1;
    return (
      (problem.choices ?? []).find((c) => {
        const f = asFraction(c.text);
        return f && f.n === n / k && f.d === d / k;
      })?.label ?? null
    );
  };

  // ---- slips: each one a place the cancelling could have been stopped ----
  const slips = [
    { label: `kept only the left corners, ${aTop} over ${bBot}`, n: aTop, d: bBot },
    { label: `kept only the right corners, ${bTop} over ${aBot}`, n: bTop, d: aBot },
    { label: `worked out just the last factor`, n: to * (to + 2), d: (to + 1) * (to + 1) },
    { label: `kept only the second chain`, n: bTop, d: bBot },
  ]
    .map((s) => ({ ...s, choice: choiceOf(s.n, s.d) }))
    .filter((s) => s.choice != null && s.choice !== problem.answer)
    .filter((s, i, all) => all.findIndex((o) => o.choice === s.choice) === i)
    .sort((a, b) => String(a.choice).localeCompare(String(b.choice)));
  const allNamed = slips.length + 1 === (problem.choices ?? []).length;

  const stored = problem.shortAnswer != null ? asFraction(problem.shortAnswer) : null;
  const checks = [
    { ok: count >= 3, msg: "the product needs at least three factors" },
    {
      ok: brute.n === resNum && brute.d === resDen,
      msg: `the chains give ${resNum}/${resDen} but multiplying every factor gives ${brute.n}/${brute.d}`,
    },
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

  // ---- the contest's own window: three factors, the ellipsis, two more ----
  const showAll = count <= 5;
  const headVals = showAll ? Array.from({ length: count }, (_, i) => from + i) : [from, from + 1, from + 2];
  const tailVals = showAll ? [] : [to - 1, to];
  const cards = [...headVals, ...tailVals];
  const headCount = headVals.length;

  const cardW = 60;
  const cardGap = 12;
  const ellipsisW = showAll ? 0 : 32;
  const totalW = cards.length * (cardW + cardGap) - cardGap + ellipsisW;
  const x0 = (W - totalW) / 2;
  const left = (i: number) => x0 + i * (cardW + cardGap) + (i >= headCount ? ellipsisW : 0);
  const cx = (i: number) => left(i) + cardW / 2;
  const ellipsisX = x0 + headCount * (cardW + cardGap) + ellipsisW / 2 - cardGap / 2;

  // rows: the product, then the two lanes it splits into
  const rowY = 112;
  const rowNumY = 103;
  const rowDenY = 133;
  const yA = 66;
  const yB = 176;
  const numOff = -9;
  const denOff = 21;

  // pairs of cards that are genuinely adjacent inside the window
  const adjacent = cards
    .map((_, i) => i)
    .filter((i) => i + 1 < cards.length && cards[i + 1] === cards[i] + 1);

  // far enough that the multiplication dot never touches a three-digit factor
  const halfSpacing = 16;
  // a ring wide enough for the digits it circles ("100" needs more than "1")
  const ringRx = (v: number) => String(v).length * 3.45 + 7;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 490 }}>
        <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
          {phase === 0
            ? `${count} factors, every one of them n(n+2) over (n+1)²`
            : phase === 1
            ? `split each factor in two — one chain from the left halves, one from the right`
            : phase === 2
            ? `the two chains cancel in opposite directions`
            : `multiply the four survivors`}
        </text>

        {/* ================= phase 0: the product as the contest writes it ================= */}
        {phase === 0 && (
          <g>
            {cards.map((n, i) => (
              <motion.g
                key={n}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.15 + i * 0.1 }}
              >
                <text x={cx(i) - halfSpacing} y={rowNumY} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  {n}
                </text>
                <text x={cx(i)} y={rowNumY} textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM}>
                  ·
                </text>
                <text x={cx(i) + halfSpacing} y={rowNumY} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  {n + 2}
                </text>
                <line x1={cx(i) - 27} y1={rowY} x2={cx(i) + 27} y2={rowY} stroke={INK} strokeWidth={1.6} />
                <text x={cx(i) - halfSpacing} y={rowDenY} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  {n + 1}
                </text>
                <text x={cx(i)} y={rowDenY} textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM}>
                  ·
                </text>
                <text x={cx(i) + halfSpacing} y={rowDenY} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  {n + 1}
                </text>
                {i < cards.length - 1 && i !== headCount - 1 && (
                  <text x={cx(i) + cardW / 2 + cardGap / 2} y={rowY + 5} textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>
                    ·
                  </text>
                )}
              </motion.g>
            ))}
            {!showAll && (
              <text x={ellipsisX} y={rowY + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill={DIM}>
                ⋯
              </text>
            )}

            {/* the brace that says how many factors the row stands for */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + cards.length * 0.1 + 0.3 }}>
              <path
                d={`M ${x0} 152 q 0 8 8 8 L ${W / 2 - 34} 160 q 8 0 8 7 q 0 -7 8 -7 L ${x0 + totalW - 8} 160 q 8 0 8 -8`}
                fill="none"
                stroke={DIM}
                strokeWidth={1.4}
              />
              <text x={W / 2} y={184} textAnchor="middle" fontSize="11" fontWeight="800" fill={IND} fontFamily={numberFont}>
                n = {from}, {from + 1}, {from + 2}, …, {to}
              </text>
            </motion.g>
            <motion.text x={W / 2} y={210} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              every factor is a shade under 1, and there are {count} of them
            </motion.text>
          </g>
        )}

        {/* ================= phases 1–2: the two lanes ================= */}
        {(phase === 1 || phase === 2) && (
          <g>
            <text x={W / 2} y={36} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND}>
              chain A — each n over the next number up
            </text>
            <text x={W / 2} y={228} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={TEAL}>
              chain B — each n+2 over the number just below it
            </text>

            {cards.map((n, i) => {
              // every number in a lane card carries the same delta back to the
              // half of the product row it was pulled out of
              const lanes = [
                { key: "A", y: yA, top: n, bottom: n + 1, color: IND, dx: -halfSpacing, dy: rowNumY - (yA + numOff) },
                { key: "B", y: yB, top: n + 2, bottom: n + 1, color: TEAL, dx: halfSpacing, dy: rowNumY - (yB + numOff) },
              ];
              return lanes.map((L) => {
                const topSurvives = L.key === "A" ? n === from : n === to;
                const botSurvives = L.key === "A" ? n === to : n === from;
                const topDead = phase === 2 && !topSurvives;
                const botDead = phase === 2 && !botSurvives;
                const topLit = phase === 2 && topSurvives;
                const botLit = phase === 2 && botSurvives;
                return (
                  <motion.g
                    key={`${L.key}${n}`}
                    initial={phase === 1 ? { x: L.dx, y: L.dy, opacity: 0.55 } : false}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 170, damping: 20, delay: phase === 1 ? 0.15 + i * 0.08 : 0 }}
                  >
                    <motion.text
                      x={cx(i)}
                      y={L.y + numOff}
                      textAnchor="middle"
                      fontSize="12.5"
                      fontWeight="800"
                      fontFamily={numberFont}
                      animate={{ fill: topLit ? WIN : topDead ? DIM : L.color, opacity: topDead ? 0.4 : 1 }}
                      transition={{ delay: phase === 2 ? 0.5 + i * 0.12 : 0.2 }}
                    >
                      {L.top}
                    </motion.text>
                    <line x1={cx(i) - 18} y1={L.y} x2={cx(i) + 18} y2={L.y} stroke={L.color} strokeWidth={1.6} />
                    <motion.text
                      x={cx(i)}
                      y={L.y + denOff}
                      textAnchor="middle"
                      fontSize="12.5"
                      fontWeight="800"
                      fontFamily={numberFont}
                      animate={{ fill: botLit ? WIN : botDead ? DIM : L.color, opacity: botDead ? 0.4 : 1 }}
                      transition={{ delay: phase === 2 ? 0.5 + i * 0.12 : 0.2 }}
                    >
                      {L.bottom}
                    </motion.text>
                    {/* the surviving corners get ringed */}
                    {(topLit || botLit) && (
                      <motion.ellipse
                        cx={cx(i)}
                        cy={(topLit ? L.y + numOff : L.y + denOff) - 4}
                        rx={ringRx(topLit ? L.top : L.bottom)}
                        ry={11}
                        fill="none"
                        stroke={WIN}
                        strokeWidth={1.8}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 220, damping: 14, delay: 1.5 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      />
                    )}
                    {i < cards.length - 1 && i !== headCount - 1 && (
                      <text
                        x={cx(i) + cardW / 2 + cardGap / 2}
                        y={L.y + 5}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="800"
                        fill={DIM}
                        opacity={phase === 2 ? 0.25 : 1}
                      >
                        ·
                      </text>
                    )}
                  </motion.g>
                );
              });
            })}

            {!showAll &&
              [yA, yB].map((y) => (
                <text key={y} x={ellipsisX} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill={DIM}>
                  ⋯
                </text>
              ))}

            {/* the identity that licenses the split */}
            {phase === 1 && (
              <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <Frac x={160} y={126} top="n(n+2)" bottom="(n+1)²" color={INK} half={28} />
                <text x={206} y={131} textAnchor="middle" fontSize="13" fontWeight="800" fill={DIM}>
                  =
                </text>
                <Frac x={244} y={126} top="n" bottom="n+1" color={IND} half={20} />
                <text x={276} y={131} textAnchor="middle" fontSize="12" fontWeight="800" fill={DIM}>
                  ·
                </text>
                <Frac x={312} y={126} top="n+2" bottom="n+1" color={TEAL} half={22} />
              </motion.g>
            )}

            {/* the cancelling arcs — backwards in chain A, forwards in chain B */}
            {phase === 2 &&
              adjacent.map((i, k) => (
                <g key={i}>
                  <motion.path
                    d={`M ${cx(i + 1) - 12} ${yA + numOff + 4} Q ${(cx(i) + cx(i + 1)) / 2} ${yA + numOff + 32} ${cx(i) + 12} ${yA + denOff - 11}`}
                    fill="none"
                    stroke={IND}
                    strokeWidth={1.6}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.45, delay: 0.5 + k * 0.2 }}
                  />
                  <motion.path
                    d={`M ${cx(i) + 12} ${yB + numOff + 4} Q ${(cx(i) + cx(i + 1)) / 2} ${yB + numOff + 32} ${cx(i + 1) - 12} ${yB + denOff - 11}`}
                    fill="none"
                    stroke={TEAL}
                    strokeWidth={1.6}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.45, delay: 0.5 + k * 0.2 }}
                  />
                </g>
              ))}

            {phase === 2 && (
              <g>
                <motion.text x={W / 2} y={120} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                  chain A cancels backwards, chain B forwards — so only the four corners are left
                </motion.text>
                <motion.text x={W / 2} y={138} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
                  {aTop} and {aBot} from chain A · {bTop} and {bBot} from chain B
                </motion.text>
              </g>
            )}
          </g>
        )}

        {/* ================= phase 3: multiply out and price every wrong turn ================= */}
        {phase === 3 && (
          <g>
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.2 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <Frac x={97} y={66} top={String(aTop)} bottom={String(aBot)} color={WIN} half={24} />
            </motion.g>
            <motion.text x={139} y={71} textAnchor="middle" fontSize="13" fontWeight="800" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              ×
            </motion.text>
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.6 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <Frac x={183} y={66} top={String(bTop)} bottom={String(bBot)} color={WIN} half={26} />
            </motion.g>
            <motion.text x={227} y={71} textAnchor="middle" fontSize="13" fontWeight="800" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              =
            </motion.text>
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 1.0 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <Frac x={273} y={66} top={String(rawNum)} bottom={String(rawDen)} color={INK} half={28} />
            </motion.g>
            {g > 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                <text x={323} y={71} textAnchor="middle" fontSize="13" fontWeight="800" fill={DIM}>
                  =
                </text>
                <text x={323} y={94} textAnchor="middle" fontSize="12" fontWeight="700" fill={WARN} fontFamily={numberFont}>
                  ÷ {g}
                </text>
              </motion.g>
            )}
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <Frac x={383} y={66} top={String(resNum)} bottom={String(resDen)} color={WIN} size={15} half={32} />
            </motion.g>

            {slips.length > 0 && (
              <motion.text x={W / 2} y={118} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
                {allNamed
                  ? "every other choice is a place the cancelling could have stopped"
                  : "stopping the cancelling early lands on a choice"}
              </motion.text>
            )}
            {slips.map((s, i) => {
              const k = gcd(s.n, s.d) || 1;
              return (
                <motion.g key={String(s.choice)} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: 2.1 + i * 0.2 }}>
                  <rect x={22} y={128 + i * 27} width={436} height={23} rx={5} fill="#fffbeb" stroke="#fde68a" strokeWidth={1.2} />
                  <text x={34} y={144 + i * 27} fontSize="10" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                    {s.choice}
                  </text>
                  <text x={52} y={144 + i * 27} fontSize="9.5" fontWeight="700" fill={INK}>
                    {s.label}
                  </text>
                  <text x={446} y={144 + i * 27} textAnchor="end" fontSize="10" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                    {s.n / k}
                    {s.d / k === 1 ? "" : `/${s.d / k}`}
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
          ? `${count} factors to multiply`
          : phase === 1
          ? `one product becomes two chains`
          : phase === 2
          ? `chain A → ${aTop}/${aBot} · chain B → ${bTop}/${bBot}`
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
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
