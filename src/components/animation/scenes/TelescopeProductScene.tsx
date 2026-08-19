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
const rangeProduct = (lo: number, hi: number) => {
  let p = 1;
  for (let i = lo; i <= hi; i++) p *= i;
  return p;
};

/**
 * A **telescoping product** of the terms `k / (k + gap)`, where almost everything
 * cancels and the whole question is *how much survives at each end*. The scene
 * refuses to hand that over: each numerator `k` is matched to the denominator of
 * the term `gap` places earlier — which is a real arc drawn between two cards on
 * screen — and the survivors are then whatever the matching **failed** to pair,
 * namely the first `gap` numerators (their partners would need denominators below
 * the first one) and the last `gap` denominators (their partners would need
 * numerators past the last one). So `gap` is not a rule to remember, it is a
 * count read off the picture, and the closing beat shows exactly that: the
 * distractors on this problem are wrong **survivor counts**, and the scene finds
 * them by re-running the product keeping one survivor instead of `gap` (choice A
 * here) and by applying the adjacent-telescoping rule of first-numerator over
 * last-denominator (choice E). Both are computed and matched against
 * `problem.choices`, so a slip that hits no choice is dropped rather than
 * narrated. The product is only ever drawn as a window — the first few terms and
 * the last few, with the ellipsis the contest itself uses — but the window is
 * sized from `gap` so that **every surviving term and at least one genuine
 * cancelling pair are inside it**. Everything is exact integer arithmetic on the
 * survivor ranges (the full product would overflow long before 20 terms), and the
 * reduced value is checked against the stored answer. Data `{ from, to, gap }`.
 */
export function TelescopeProductScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const from = Math.round(num(data.from, 1));
  const to = Math.round(num(data.to, 20));
  const gap = Math.max(1, Math.round(num(data.gap, 2)));

  // ---- survivors: what the pairing could not match ----
  const headLo = from;
  const headHi = from + gap - 1; // numerators with no denominator to cancel
  const tailLo = to + 1;
  const tailHi = to + gap; // denominators with no numerator to cancel
  const rawNum = rangeProduct(headLo, headHi);
  const rawDen = rangeProduct(tailLo, tailHi);
  const g = gcd(rawNum, rawDen) || 1;
  const resNum = rawNum / g;
  const resDen = rawDen / g;

  // ---- answer choices as reduced fractions ----
  const asFraction = (text: string) => {
    const t = String(text).replace(/[−–—]/g, "-").trim();
    const m = t.match(/^(-?\d+)\s*\/\s*(\d+)$/);
    if (!m) return null;
    const n = Number(m[1]);
    const d = Number(m[2]);
    const k = gcd(n, d) || 1;
    return { n: n / k, d: d / k };
  };
  const choiceOf = (n: number, d: number) => {
    const k = gcd(n, d) || 1;
    const rn = n / k;
    const rd = d / k;
    return (problem.choices ?? []).find((c) => {
      const f = asFraction(c.text);
      return f && f.n === rn && f.d === rd;
    })?.label ?? null;
  };

  // ---- slips, each recomputed rather than asserted ----
  const slips = [
    {
      label: `kept only ${from} on top, forgetting ${gap} numerators survive`,
      n: rangeProduct(headLo, headLo),
      d: rawDen,
    },
    {
      label: `used the adjacent rule: first numerator over last denominator`,
      n: from,
      d: to + gap,
    },
  ]
    .map((s) => ({ ...s, choice: choiceOf(s.n, s.d) }))
    .filter((s) => s.choice != null && s.choice !== problem.answer)
    .filter((s, i, all) => all.findIndex((o) => o.choice === s.choice) === i);

  const answerOk =
    problem.shortAnswer == null ||
    (() => {
      const f = asFraction(problem.shortAnswer);
      return f ? f.n === resNum && f.d === resDen : true;
    })();
  const ok = to > from && gap >= 1 && answerOk;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 248;

  // ---- the visible window: every survivor plus a real cancelling pair ----
  const headCount = Math.min(gap + 2, to - from + 1);
  const tailCount = Math.min(gap + 1, to - from + 1 - headCount);
  const headTerms = Array.from({ length: headCount }, (_, i) => from + i);
  const tailTerms = Array.from({ length: tailCount }, (_, i) => to - tailCount + 1 + i);
  const cards = [...headTerms.map((k) => ({ k, slot: "head" as const })), ...tailTerms.map((k) => ({ k, slot: "tail" as const }))];

  const cardW = 40;
  const cardGap = 9;
  const ellipsisW = 30;
  const totalW = cards.length * (cardW + cardGap) - cardGap + ellipsisW;
  const x0 = (W - totalW) / 2;
  // x of card i, allowing for the ellipsis sitting after the head block
  const cx = (i: number) => x0 + i * (cardW + cardGap) + (i >= headCount ? ellipsisW : 0);
  const indexOfTerm = (k: number) => cards.findIndex((c) => c.k === k);

  const rowY = 80;
  const numY = rowY - 8;
  const denY = rowY + 22;

  // in-window cancelling pairs: numerator k against the denominator of card k-gap
  const pairs = cards
    .map((c) => ({ numTerm: c.k, denTerm: c.k - gap }))
    .filter((p) => indexOfTerm(p.numTerm) >= 0 && indexOfTerm(p.denTerm) >= 0);

  const isHeadSurvivor = (k: number) => k >= headLo && k <= headHi;
  const isTailSurvivorDen = (k: number) => k + gap >= tailLo && k + gap <= tailHi;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
          {phase === 0
            ? `every term is k over k + ${gap} — the bottom runs ${gap} ahead of the top`
            : phase === 1
            ? `each numerator cancels the denominator ${gap} terms back`
            : phase === 2
            ? `the ends have no partner: ${gap} on top, ${gap} on the bottom`
            : `multiply the survivors and reduce`}
        </text>

        {/* ============ the product, drawn as a window of fraction cards ============ */}
        {phase <= 2 && (
          <g>
            {cards.map((c, i) => {
              const cancelledNum = phase >= 1 && !isHeadSurvivor(c.k);
              const cancelledDen = phase >= 1 && !isTailSurvivorDen(c.k);
              const litNum = phase === 2 && isHeadSurvivor(c.k);
              const litDen = phase === 2 && isTailSurvivorDen(c.k);
              return (
                <motion.g
                  key={c.k}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 240, damping: 18, delay: phase === 0 ? 0.15 + i * 0.09 : 0 }}
                >
                  {/* numerator */}
                  <motion.text
                    x={cx(i) + cardW / 2}
                    y={numY}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    fontFamily={numberFont}
                    animate={{ fill: litNum ? WIN : cancelledNum ? DIM : INK, opacity: cancelledNum ? 0.45 : 1 }}
                    transition={{ delay: phase === 1 ? 0.5 + i * 0.12 : 0.2 }}
                  >
                    {c.k}
                  </motion.text>
                  {/* fraction bar */}
                  <line x1={cx(i) + 5} y1={rowY} x2={cx(i) + cardW - 5} y2={rowY} stroke={INK} strokeWidth={1.6} />
                  {/* denominator */}
                  <motion.text
                    x={cx(i) + cardW / 2}
                    y={denY}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    fontFamily={numberFont}
                    animate={{ fill: litDen ? WIN : cancelledDen ? DIM : INK, opacity: cancelledDen ? 0.45 : 1 }}
                    transition={{ delay: phase === 1 ? 0.5 + i * 0.12 : 0.2 }}
                  >
                    {c.k + gap}
                  </motion.text>
                  {/* the strikes that retire a cancelled entry */}
                  {cancelledNum && (
                    <motion.line
                      x1={cx(i) + 8}
                      y1={numY - 4}
                      x2={cx(i) + cardW - 8}
                      y2={numY - 4}
                      stroke={BAD}
                      strokeWidth={1.5}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.12 }}
                    />
                  )}
                  {cancelledDen && (
                    <motion.line
                      x1={cx(i) + 8}
                      y1={denY - 4}
                      x2={cx(i) + cardW - 8}
                      y2={denY - 4}
                      stroke={BAD}
                      strokeWidth={1.5}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.12 }}
                    />
                  )}
                  {/* the dot between factors — the ellipsis owns the seam, so no dot there */}
                  {i < cards.length - 1 && i !== headCount - 1 && (
                    <text x={cx(i) + cardW + cardGap / 2} y={rowY + 5} textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>
                      ·
                    </text>
                  )}
                </motion.g>
              );
            })}
            {/* the contest's own ellipsis for the terms not drawn */}
            <text x={x0 + headCount * (cardW + cardGap) + ellipsisW / 2 - cardGap / 2} y={rowY + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill={DIM}>
              ⋯
            </text>

            {/* the gap, shown on one card */}
            {phase === 0 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                <path
                  d={`M ${cx(0) + 2} ${numY - 3} q -18 12 0 ${denY - numY - 2}`}
                  fill="none"
                  stroke={WARN}
                  strokeWidth={1.6}
                />
                <text x={cx(0) - 16} y={rowY + 4} textAnchor="end" fontSize="10" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                  +{gap}
                </text>
              </motion.g>
            )}

            {phase === 0 && (
              <g>
                {[
                  { lab: "on top", lo: from, hi: to, c: IND, y: 150 },
                  { lab: "underneath", lo: from + gap, hi: to + gap, c: TEAL, y: 174 },
                ].map((r, i) => (
                  <motion.g key={r.lab} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 + i * 0.3 }}>
                    <text x={116} y={r.y} textAnchor="end" fontSize="10" fontWeight="700" fill={DIM}>
                      {r.lab}
                    </text>
                    <text x={128} y={r.y} fontSize="11" fontWeight="800" fill={r.c} fontFamily={numberFont}>
                      {r.lo}, {r.lo + 1}, {r.lo + 2}, …, {r.hi}
                    </text>
                  </motion.g>
                ))}
                <motion.text x={W / 2} y={202} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
                  the same run of numbers, shifted along by {gap}
                </motion.text>
              </g>
            )}

            {/* the matching arcs, drawn under the row so they never cross a digit */}
            {phase === 1 &&
              pairs.map((p, i) => {
                const a = cx(indexOfTerm(p.numTerm)) + cardW / 2;
                const b = cx(indexOfTerm(p.denTerm)) + cardW / 2;
                const dip = 46 + Math.min(28, Math.abs(a - b) * 0.12);
                return (
                  <motion.path
                    key={`${p.numTerm}`}
                    d={`M ${a} ${denY + 8} Q ${(a + b) / 2} ${denY + dip} ${b} ${denY + 8}`}
                    fill="none"
                    stroke={TEAL}
                    strokeWidth={1.6}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.18 }}
                  />
                );
              })}
            {phase === 1 && (
              <motion.text
                x={W / 2}
                y={denY + 86}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="700"
                fill={DIM}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                the {from + gap} on top meets the {from + gap} underneath, and so on all the way along
              </motion.text>
            )}

            {/* the survivors, bracketed */}
            {phase === 2 && (
              <g>
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  <rect x={cx(0) - 5} y={numY - 17} width={gap * (cardW + cardGap) - cardGap + 10} height={22} rx={5} fill="none" stroke={WIN} strokeWidth={1.8} />
                  <text x={cx(0) + (gap * (cardW + cardGap) - cardGap) / 2} y={numY - 22} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={WIN}>
                    no denominator below {from + gap}
                  </text>
                </motion.g>
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                  <rect
                    x={cx(cards.length - gap) - 5}
                    y={denY - 13}
                    width={gap * (cardW + cardGap) - cardGap + 10}
                    height={22}
                    rx={5}
                    fill="none"
                    stroke={WIN}
                    strokeWidth={1.8}
                  />
                  <text x={cx(cards.length - gap) + (gap * (cardW + cardGap) - cardGap) / 2} y={denY + 24} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={WIN}>
                    no numerator past {to}
                  </text>
                </motion.g>
                <motion.text
                  x={W / 2}
                  y={denY + 62}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill={INK}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  a gap of {gap} leaves exactly {gap} unmatched at each end
                </motion.text>
                <motion.g
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.6 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <text x={W / 2} y={denY + 82} textAnchor="middle" fontSize="14" fontWeight="800" fill={IND} fontFamily={numberFont}>
                    {Array.from({ length: gap }, (_, i) => headLo + i).join(" · ")}
                  </text>
                  <line x1={W / 2 - 44} y1={denY + 90} x2={W / 2 + 44} y2={denY + 90} stroke={IND} strokeWidth={1.8} />
                  <text x={W / 2} y={denY + 108} textAnchor="middle" fontSize="14" fontWeight="800" fill={IND} fontFamily={numberFont}>
                    {Array.from({ length: gap }, (_, i) => tailLo + i).join(" · ")}
                  </text>
                </motion.g>
              </g>
            )}
          </g>
        )}

        {/* ============ phase 3: multiply out, reduce, and price the slips ============ */}
        {phase === 3 && (
          <g>
            {/* the surviving fraction, then the reduction */}
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.2 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <text x={110} y={50} textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {Array.from({ length: gap }, (_, i) => headLo + i).join(" · ")}
              </text>
              <line x1={62} y1={58} x2={158} y2={58} stroke={INK} strokeWidth={1.6} />
              <text x={110} y={76} textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {Array.from({ length: gap }, (_, i) => tailLo + i).join(" · ")}
              </text>
            </motion.g>
            <motion.text x={182} y={66} textAnchor="middle" fontSize="14" fontWeight="800" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              =
            </motion.text>
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <text x={232} y={50} textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {rawNum}
              </text>
              <line x1={204} y1={58} x2={260} y2={58} stroke={INK} strokeWidth={1.6} />
              <text x={232} y={76} textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {rawDen}
              </text>
            </motion.g>
            {g > 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                <text x={292} y={66} textAnchor="middle" fontSize="14" fontWeight="800" fill={DIM}>
                  =
                </text>
                <text x={292} y={86} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={WARN} fontFamily={numberFont}>
                  ÷ {g}
                </text>
              </motion.g>
            )}
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <text x={352} y={50} textAnchor="middle" fontSize="15" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {resNum}
              </text>
              <line x1={318} y1={58} x2={386} y2={58} stroke={WIN} strokeWidth={2} />
              <text x={352} y={78} textAnchor="middle" fontSize="15" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {resDen}
              </text>
            </motion.g>

            {slips.length > 0 && (
              <motion.text x={W / 2} y={116} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
                miscounting the survivors lands on a choice
              </motion.text>
            )}
            {slips.map((s, i) => (
              <motion.g key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: 2.1 + i * 0.25 }}>
                <rect x={26} y={128 + i * 30} width={418} height={26} rx={5} fill="#fffbeb" stroke="#fde68a" strokeWidth={1.2} />
                <text x={38} y={145 + i * 30} fontSize="10" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                  {s.choice}
                </text>
                <text x={54} y={145 + i * 30} fontSize="9.5" fontWeight="700" fill={INK}>
                  {s.label}
                </text>
                <text x={434} y={145 + i * 30} textAnchor="end" fontSize="10" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                  {s.n / (gcd(s.n, s.d) || 1)}/{s.d / (gcd(s.n, s.d) || 1)}
                </text>
              </motion.g>
            ))}

            <motion.text
              x={W / 2}
              y={148 + slips.length * 30 + 20}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={DIM}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.7 }}
            >
              the whole product collapses to {gap} number{gap === 1 ? "" : "s"} over {gap}
            </motion.text>
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
          ? `${to - from + 1} terms, each k / (k + ${gap})`
          : phase === 1
          ? `everything from ${from + gap} to ${to} cancels`
          : phase === 2
          ? `${rawNum} / ${rawDen} survives`
          : `${resNum}/${resDen}`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed:{" "}
          {to <= from
            ? "the product needs at least two terms"
            : `computed ${resNum}/${resDen} but the stored answer is ${problem.shortAnswer}`}
        </span>
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
