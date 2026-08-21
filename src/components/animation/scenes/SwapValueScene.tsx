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
const COPPER = "#b45309";
const SILVER = "#64748b";

/**
 * A fixed number of items of two values, with a floor on how few of each you may
 * hold, asking for the spread between the largest and smallest possible total.
 * Computing both extremes and subtracting works but hides the structure; the
 * unlock is that **swapping one cheap item for one dear one leaves the count
 * alone and moves the total by exactly the value gap**, so the whole problem is
 * a count of swaps: spread = swaps × gap, and the extremes never need adding up
 * at all.
 *
 * That framing is what the answer list is really testing. On 2020-08 the
 * neighbouring choices are 2017 × 4 and 2019 × 4 — one swap short and one swap
 * long — so the scene computes `k × gap` for the swap counts either side, matches
 * each against `problem.choices`, and names the letter it lands on, discovering
 * the distractors rather than asserting them. It also prices the slip of dropping
 * the floor entirely (all 2020 either way) and says outright when that value is
 * **not among the choices**, which is the case here.
 *
 * Beats: the hoard with the two values drawn as unit blocks so the gap is a
 * literal four squares; one swap performed in a slot, with a ledger showing the
 * count unmoved and the total up by the gap; both extremes as compressed coin
 * rows; then the swap count bracketed on a track a marker rides, times the gap,
 * cross-checked against the subtraction. Every quantity is computed from
 * `{ total, minEach, low, high }` and the two routes must agree; data
 * `{ total, minEach?, low: "1|penny|pennies", high: "5|nickel|nickels", unit? }`.
 */
export function SwapValueScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = Math.max(2, Math.round(num(data.total, 2)));
  const minEach = Math.max(0, Math.round(num(data.minEach, 1)));
  const [lowVs, lowName, lowPlural] = String(data.low ?? "1|penny|pennies").split("|");
  const [highVs, highName, highPlural] = String(data.high ?? "5|nickel|nickels").split("|");
  const lv = num(lowVs, 1);
  const hv = num(highVs, 5);
  const unit = typeof data.unit === "string" ? data.unit : "cent";

  const low = { v: lv, one: lowName ?? "low", many: lowPlural ?? `${lowName}s`, tone: COPPER };
  const high = { v: hv, one: highName ?? "high", many: highPlural ?? `${highName}s`, tone: SILVER };

  // ---- the whole problem in four numbers ----
  const gap = hv - lv;
  const kMin = minEach;             // fewest dear items allowed
  const kMax = total - minEach;     // most dear items allowed
  const swaps = kMax - kMin;
  const valueAt = (k: number) => (total - k) * lv + k * hv;
  const minValue = valueAt(kMin);
  const maxValue = valueAt(kMax);
  const difference = swaps * gap;

  // ---- price the near misses against the real answer list ----
  const choiceFor = (v: number) => {
    const target = String(Math.round(v));
    const hit = (problem.choices ?? []).find(
      (c) => String(c.text).replace(/[−–—]/g, "-").replace(/[^\d-]/g, "") === target
    );
    return hit ? hit.label : null;
  };
  const neighbours = [swaps - 1, swaps + 1]
    .filter((k) => k > 0 && k !== swaps)
    .map((k) => ({ k, value: k * gap, letter: choiceFor(k * gap) }))
    .filter((n) => n.letter);
  const noFloor = total * gap; // dropping the "at least one of each" rule entirely
  const noFloorLetter = choiceFor(noFloor);

  // ---- self-checks: the two routes have to agree, and match the stored answer ----
  const routesOk = maxValue - minValue === difference;
  const gapOk = gap > 0;
  const roomOk = total > 2 * minEach;
  const answerOk =
    problem.shortAnswer == null || String(difference) === String(problem.shortAnswer).replace(/[^\d]/g, "");
  const ok = routesOk && gapOk && roomOk && answerOk;
  const failure = !gapOk
    ? `${high.one} is not worth more than ${low.one}`
    : !roomOk
    ? `${total} items cannot spare ${minEach} of each kind`
    : !routesOk
    ? `${maxValue} − ${minValue} = ${maxValue - minValue}, but swaps give ${difference}`
    : `swaps give ${difference}, answer says ${problem.shortAnswer}`;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 262;
  const fmt = (n: number) => n.toLocaleString("en-US");

  /** One coin: rim, inner ring, face value. */
  const Coin = ({ cx, cy, r, kind }: { cx: number; cy: number; r: number; kind: typeof low }) => (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={kind.tone} fillOpacity={0.3} stroke={kind.tone} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r * 0.74} fill="none" stroke={kind.tone} strokeWidth={0.8} opacity={0.55} />
      <text x={cx} y={cy + r * 0.34} textAnchor="middle" fontSize={r * 0.92} fontWeight="800" fill={kind.tone} fontFamily={numberFont}>
        {kind.v}
      </text>
    </g>
  );

  /** A run of `count` coins, compressed with an ellipsis when it will not fit. */
  const MAX_SHOW = 4;
  const slotsFor = (count: number) => (count <= MAX_SHOW ? count : MAX_SHOW + 1);
  const CoinRun = ({
    x,
    cy,
    count,
    kind,
    r = 10,
    pitch = 24,
    delay = 0,
  }: {
    x: number;
    cy: number;
    count: number;
    kind: typeof low;
    r?: number;
    pitch?: number;
    delay?: number;
  }) => {
    const compressed = count > MAX_SHOW;
    const lead = compressed ? MAX_SHOW - 1 : count;
    return (
      <g>
        {Array.from({ length: lead }, (_, i) => (
          <motion.g key={i} initial={{ y: -26, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: delay + i * 0.08 }}>
            <Coin cx={x + r + i * pitch} cy={cy} r={r} kind={kind} />
          </motion.g>
        ))}
        {compressed && (
          <>
            <text x={x + r + lead * pitch} y={cy + 4} textAnchor="middle" fontSize="13" fontWeight="800" fill={DIM}>
              ⋯
            </text>
            <motion.g initial={{ y: -26, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: delay + 0.35 }}>
              <Coin cx={x + r + (lead + 1) * pitch} cy={cy} r={r} kind={kind} />
            </motion.g>
          </>
        )}
      </g>
    );
  };
  const runWidth = (count: number, pitch = 24) => slotsFor(count) * pitch;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ============ phase 0: the hoard, and what the two coins are worth ============ */}
        {phase === 0 && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              {fmt(total)} coins, and neither kind is allowed to run out
            </text>

            {/* a suggestive mixed row — the actual split is still unknown */}
            {[0, 1, 2, 3, 5, 6, 7, 8].map((slot, i) => (
              <motion.g key={slot} initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 + i * 0.06 }}>
                <Coin cx={112 + slot * 30} cy={46} r={12} kind={i % 2 === 0 ? low : high} />
              </motion.g>
            ))}
            <text x={112 + 4 * 30} y={51} textAnchor="middle" fontSize="14" fontWeight="800" fill={DIM}>
              ⋯
            </text>
            <motion.text x={W / 2} y={80} textAnchor="middle" fontSize="10" fontWeight="700" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              at least {minEach} {low.one} and at least {minEach} {high.one} — some of each, always
            </motion.text>

            {/* the value gap, drawn as real blocks rather than asserted */}
            {[
              { kind: low, cx: 140 },
              { kind: high, cx: 320 },
            ].map(({ kind, cx }) => (
              <g key={kind.one}>
                <text x={cx} y={104} textAnchor="middle" fontSize="10" fontWeight="800" fill={kind.tone}>
                  {kind.one}
                </text>
                <Coin cx={cx} cy={128} r={19} kind={kind} />
                {Array.from({ length: kind.v }, (_, i) => {
                  const bw = 14;
                  const bg = 3;
                  const rowW = kind.v * bw + (kind.v - 1) * bg;
                  const extra = i >= lv;
                  return (
                    <motion.rect
                      key={i}
                      x={cx - rowW / 2 + i * (bw + bg)}
                      y={156}
                      width={bw}
                      height={14}
                      rx={2.5}
                      fill={extra ? WARN : kind.tone}
                      fillOpacity={extra ? 0.35 : 0.25}
                      stroke={extra ? WARN : kind.tone}
                      strokeWidth={1.2}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 1.0 + i * 0.09 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    />
                  );
                })}
                <text x={cx} y={186} textAnchor="middle" fontSize="10" fontWeight="800" fill={kind.tone} fontFamily={numberFont}>
                  {kind.v} {unit}
                  {kind.v === 1 ? "" : "s"}
                </text>
              </g>
            ))}

            {/* the amber overhang is the gap */}
            {(() => {
              const bw = 14;
              const bg = 3;
              const rowW = high.v * bw + (high.v - 1) * bg;
              const x1 = 320 - rowW / 2 + lv * (bw + bg);
              const x2 = 320 + rowW / 2;
              return (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
                  <line x1={x1} y1={200} x2={x2} y2={200} stroke={WARN} strokeWidth={1.6} />
                  <line x1={x1} y1={195} x2={x1} y2={205} stroke={WARN} strokeWidth={1.6} />
                  <line x1={x2} y1={195} x2={x2} y2={205} stroke={WARN} strokeWidth={1.6} />
                  <text x={(x1 + x2) / 2} y={218} textAnchor="middle" fontSize="11" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                    +{gap}
                  </text>
                </motion.g>
              );
            })()}

            <motion.text x={W / 2} y={246} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={IND} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
              a {high.one} is worth exactly {gap} {unit}s more than a {low.one}
            </motion.text>
          </g>
        )}

        {/* ============ phase 1: one swap moves the total, not the count ============ */}
        {phase === 1 && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              trade one {low.one} for one {high.one}
            </text>

            {/* the slot the trade happens in */}
            <circle cx={235} cy={78} r={25} fill="none" stroke={DIM} strokeWidth={1.8} strokeDasharray="5 4" />
            <text x={235} y={120} textAnchor="middle" fontSize="9" fontWeight="700" fill={DIM}>
              one place in the pile
            </text>

            {/* the low coin leaves */}
            <motion.g initial={{ x: 0, opacity: 1 }} animate={{ x: -120, opacity: 0.25 }} transition={{ type: "spring", stiffness: 60, damping: 16, delay: 0.3 }}>
              <Coin cx={235} cy={78} r={22} kind={low} />
            </motion.g>
            <motion.text x={100} y={44} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={COPPER} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              out
            </motion.text>

            {/* the high coin arrives */}
            <motion.g initial={{ x: 135, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 60, damping: 16, delay: 0.9 }}>
              <Coin cx={235} cy={78} r={22} kind={high} />
            </motion.g>
            <motion.text x={378} y={44} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={SILVER} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              in
            </motion.text>

            {/* the ledger: one line does not move, the other does */}
            {[
              { label: "coins in the pile", before: fmt(total), after: fmt(total), delta: "unchanged", tone: WIN, y: 158 },
              { label: `${unit}s in the pile`, before: "V", after: `V + ${gap}`, delta: `+${gap}`, tone: WARN, y: 196 },
            ].map((row, i) => (
              <motion.g key={row.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 + i * 0.3 }}>
                <text x={30} y={row.y} fontSize="10" fontWeight="700" fill={INK}>
                  {row.label}
                </text>
                <text x={228} y={row.y} textAnchor="end" fontSize="11" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                  {row.before}
                </text>
                <text x={244} y={row.y} textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>
                  →
                </text>
                <text x={262} y={row.y} fontSize="11" fontWeight="800" fill={row.tone} fontFamily={numberFont}>
                  {row.after}
                </text>
                <rect x={370} y={row.y - 12} width={76} height={17} rx={8} fill={row.tone} fillOpacity={0.14} stroke={row.tone} strokeWidth={1.2} />
                <text x={408} y={row.y} textAnchor="middle" fontSize="9" fontWeight="800" fill={row.tone} fontFamily={numberFont}>
                  {row.delta}
                </text>
              </motion.g>
            ))}

            <motion.text x={W / 2} y={238} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={IND} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
              so the only question left is how many trades are allowed
            </motion.text>
          </g>
        )}

        {/* ============ phase 2: push the trades to each limit ============ */}
        {phase === 2 && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              trade as far as the rule lets you, each way
            </text>

            {[
              { title: "least", nLow: kMax, nHigh: kMin, value: minValue, cy: 74, tone: COPPER },
              { title: "greatest", nLow: total - kMax, nHigh: kMax, value: maxValue, cy: 168, tone: SILVER },
            ].map((row, ri) => {
              const aW = runWidth(row.nLow);
              const bX = 62 + aW + 22;
              return (
                <g key={row.title}>
                  <text x={16} y={row.cy - 26} fontSize="10.5" fontWeight="800" fill={row.tone}>
                    {row.title}
                  </text>
                  <CoinRun x={62} cy={row.cy} count={row.nLow} kind={low} delay={0.2 + ri * 0.5} />
                  <text x={62 + aW + 4} y={row.cy + 4} textAnchor="middle" fontSize="13" fontWeight="800" fill={DIM}>
                    +
                  </text>
                  <CoinRun x={bX} cy={row.cy} count={row.nHigh} kind={high} delay={0.45 + ri * 0.5} />
                  <text x={62 + aW / 2} y={row.cy + 26} textAnchor="middle" fontSize="9" fontWeight="700" fill={COPPER} fontFamily={numberFont}>
                    {fmt(row.nLow)} {row.nLow === 1 ? low.one : low.many}
                  </text>
                  <text x={bX + runWidth(row.nHigh) / 2} y={row.cy + 26} textAnchor="middle" fontSize="9" fontWeight="700" fill={SILVER} fontFamily={numberFont}>
                    {fmt(row.nHigh)} {row.nHigh === 1 ? high.one : high.many}
                  </text>
                  <motion.text
                    x={W - 16}
                    y={row.cy + 4}
                    textAnchor="end"
                    fontSize="12"
                    fontWeight="800"
                    fill={IND}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + ri * 0.5 }}
                  >
                    = {fmt(row.value)}
                  </motion.text>
                  <text x={W - 16} y={row.cy + 22} textAnchor="end" fontSize="8.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                    {fmt(row.nLow)}×{low.v} + {fmt(row.nHigh)}×{high.v}
                  </text>
                </g>
              );
            })}

            <motion.text x={W / 2} y={236} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
              the rule keeps one coin of each kind pinned in place at both ends
            </motion.text>
          </g>
        )}

        {/* ============ phase 3: count the trades ============ */}
        {phase === 3 &&
          (() => {
            const TX = 66;
            const TW = 340;
            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  the spread is just the number of trades, priced at {gap} each
                </text>

                {/* the track from one extreme to the other */}
                <line x1={TX} y1={92} x2={TX + TW} y2={92} stroke={INK} strokeWidth={1.8} />
                {[
                  { x: TX, k: kMin, v: minValue },
                  { x: TX + TW, k: kMax, v: maxValue },
                ].map((end) => (
                  <g key={end.k}>
                    <line x1={end.x} y1={84} x2={end.x} y2={100} stroke={INK} strokeWidth={1.8} />
                    <text x={end.x} y={114} textAnchor="middle" fontSize="9" fontWeight="700" fill={SILVER} fontFamily={numberFont}>
                      {fmt(end.k)} {end.k === 1 ? high.one : high.many}
                    </text>
                    <text x={end.x} y={128} textAnchor="middle" fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont}>
                      {fmt(end.v)}
                    </text>
                  </g>
                ))}

                {/* a coin rides the track, one trade at a time */}
                <motion.g initial={{ x: 0 }} animate={{ x: TW }} transition={{ type: "spring", stiffness: 26, damping: 18, delay: 0.4 }}>
                  <Coin cx={TX} cy={92} r={11} kind={high} />
                </motion.g>

                {/* the span of trades */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                  <line x1={TX} y1={60} x2={TX + TW} y2={60} stroke={WARN} strokeWidth={1.6} />
                  <line x1={TX} y1={55} x2={TX} y2={65} stroke={WARN} strokeWidth={1.6} />
                  <line x1={TX + TW} y1={55} x2={TX + TW} y2={65} stroke={WARN} strokeWidth={1.6} />
                  <text x={TX + TW / 2} y={50} textAnchor="middle" fontSize="11" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                    {fmt(kMax)} − {fmt(kMin)} = {fmt(swaps)} trades
                  </text>
                </motion.g>

                <motion.text
                  x={W / 2}
                  y={162}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  {fmt(swaps)} × {gap} = {fmt(difference)}
                </motion.text>
                <motion.text x={W / 2} y={186} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
                  check: {fmt(maxValue)} − {fmt(minValue)} = {fmt(difference)}
                </motion.text>

                {/* the neighbouring choices are wrong trade counts */}
                {neighbours.length > 0 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
                    <text x={W / 2} y={214} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={BAD}>
                      one coin out of place either way costs exactly one trade:
                    </text>
                    <text x={W / 2} y={230} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                      {neighbours.map((n) => `${n.letter} ${fmt(n.value)} = ${fmt(n.k)} trades`).join("   ·   ")}
                    </text>
                  </motion.g>
                )}
                <motion.text x={W / 2} y={250} textAnchor="middle" fontSize="9" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
                  dropping the rule entirely would give {fmt(noFloor)}
                  {noFloorLetter ? ` (choice ${noFloorLetter})` : " — not offered"}
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
          ? `${high.one} − ${low.one} = ${gap} ${unit}s`
          : phase === 1
          ? `every trade is worth exactly ${gap}`
          : phase === 2
          ? `${fmt(minValue)} at worst, ${fmt(maxValue)} at best`
          : `${fmt(swaps)} trades × ${gap} = ${fmt(difference)}`}
      </motion.span>

      {!ok && <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
