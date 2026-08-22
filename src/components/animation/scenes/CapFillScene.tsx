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
const SLATE = "#64748b";

/**
 * Bar keyframes that keep the **bottom edge pinned**. Motion pivots an SVG
 * group about its own centre and ignores a `transformOrigin`, so scaling a bar
 * from the baseline needs the matching translation: at scale k a bar of height h
 * has lifted its bottom by h(1−k)/2, so translate back down by exactly that.
 */
function barKeys(fromH: number, toH: number, bump = false) {
  const k0 = toH > 0 ? fromH / toH : 0;
  const ks = bump ? [k0, 1.05, 0.98, 1] : [k0, 1];
  return {
    initial: { scaleY: k0, y: (toH * (1 - k0)) / 2 },
    animate: { scaleY: ks, y: ks.map((k) => (toH * (1 - k)) / 2) },
  };
}

/**
 * A fixed total shared out over several slots where each slot carries a **cap**,
 * asking how small one slot can be (the "lowest test score" shape: five tests
 * averaging 81, three already written, each test out of 100).
 *
 * The average is drawn as a **level**: beat one stands all five bars at 81,
 * because that is what averaging 81 looks like, and the total is that level
 * times the count. The real scores then move off the level — each one's distance
 * from it chipped as a signed deviation — and whatever they have not spent is
 * what the blanks must supply.
 *
 * The heart of it is a **seesaw**: the two blanks are pinned to a fixed sum, so
 * every point one gains the other loses, and the scene animates them trading
 * point for point away from the even split. That even split is normally an
 * answer choice (74 here — the scene finds its letter), because it is exactly
 * what you get by forgetting that the other test can be pushed further. What
 * stops the slide is the **ceiling**: the rising bar bumps 100 and can go no
 * higher, so the falling one stops too.
 *
 * The closing beat is the sting: it computes each answer choice's partner and
 * discovers that *every* choice is a score she could actually earn — they are
 * all legal, only one is the least. Everything is computed (total, deviations,
 * the even split, the answer, each partner) and checked down a second route:
 * the deviations from the level must cancel, so the answer is also
 * `average − (sum of the other deviations)`; data
 * `{ average, count, known: [...], cap, label?, icon?, unit? }`.
 */
export function CapFillScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const average = num(data.average, 81);
  const count = Math.max(2, Math.round(num(data.count, 5)));
  const known = (Array.isArray(data.known) ? data.known : []).map((v) => num(v, 0));
  const cap = num(data.cap, 100);
  const label = typeof data.label === "string" ? data.label : "test";
  const icon = typeof data.icon === "string" ? data.icon : "📝";

  // ---------------- the arithmetic, all derived ----------------
  const total = average * count;
  const knownSum = known.reduce((a, b) => a + b, 0);
  const slots = count - known.length;
  const needed = total - knownSum;
  const evenSplit = needed / slots;
  // to make one slot as small as possible, every other blank takes the cap
  const answer = needed - cap * (slots - 1);

  // second route: deviations from the level have to cancel out
  const knownDev = knownSum - average * known.length;
  const devAnswer = average - (knownDev + (cap - average) * (slots - 1));

  // every answer choice, priced: what the other blank would have to be
  const norm = (s: string) => s.replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "");
  // with one blank left over, the partner is simply what this slot does not take
  const priced = (problem.choices ?? [])
    .map((c) => ({ label: c.label, v: Number(norm(String(c.text))) }))
    .filter((c) => Number.isFinite(c.v))
    .map((c) => ({ ...c, other: needed - c.v, legal: needed - c.v <= cap && needed - c.v >= 0 }))
    .sort((a, b) => a.v - b.v);
  const allLegal = priced.length > 0 && priced.every((c) => c.legal);
  const evenChoice = priced.find((c) => Math.abs(c.v - evenSplit) < 1e-9);

  // ---------------- self-checks ----------------
  const wholeOk = Number.isInteger(total);
  const rangeOk = answer >= 0 && answer <= cap;
  const routesOk = Math.abs(devAnswer - answer) < 1e-9;
  const storedOk = problem.shortAnswer == null || String(answer) === String(problem.shortAnswer);
  const sumOk = knownSum + answer + cap * (slots - 1) === total;
  const ok = wholeOk && rangeOk && routesOk && storedOk && sumOk;
  const failed = !wholeOk
    ? `${average} × ${count} = ${total} is not a whole total`
    : !rangeOk
    ? `the lowest slot comes out ${answer}, outside 0…${cap}`
    : !routesOk
    ? `counting gives ${answer}, the deviation route gives ${devAnswer}`
    : !storedOk
    ? `computed ${answer}, stored answer ${problem.shortAnswer}`
    : `the finished scores add to ${knownSum + answer + cap * (slots - 1)}, not ${total}`;

  const laststep = totalSteps - 1;
  const isFinal = step >= laststep;
  const phase = isFinal ? 3 : Math.min(step, 2);

  // ---------------- geometry ----------------
  const W = 480;
  const H = 252;
  const BASE = 208;
  const SC = 1.56;
  const BX = 46;
  const BW = 26;
  const STRIDE = 38;
  const PX = 244;
  const y = (v: number) => BASE - v * SC;
  const bx = (i: number) => BX + i * STRIDE;
  const right = bx(count - 1) + BW;

  // what each bar shows on this beat, and where it came from
  // partway up, but never landing on a score already on screen — two bars
  // wearing the same number reads as a mistake
  let midHigh = Math.round(evenSplit + (cap - evenSplit) * 0.7);
  while (midHigh > evenSplit && (known.includes(midHigh) || known.includes(needed - midHigh))) midHigh -= 1;
  const midLow = needed - midHigh;
  const blankNow = phase === 2 ? [midHigh, midLow] : phase === 3 ? [cap, answer] : [];
  const blankFrom = phase === 2 ? [evenSplit, evenSplit] : phase === 3 ? [midHigh, midLow] : [];

  const heights = Array.from({ length: count }, (_, i) => {
    if (i < known.length) return phase === 0 ? average : known[i];
    return blankNow[i - known.length] ?? 0;
  });
  const from = Array.from({ length: count }, (_, i) => {
    if (i < known.length) return phase === 0 ? 0 : phase === 1 ? average : known[i];
    return blankFrom[i - known.length] ?? 0;
  });

  const caption =
    phase === 0
      ? `averaging ${average} over ${count} ${label}s means ${average} × ${count} = ${total} points in all`
      : phase === 1
      ? `${known.join(" + ")} = ${knownSum}, so the last ${slots} must make ${needed}`
      : phase === 2
      ? `their total is stuck at ${needed} — every point one gains, the other loses`
      : `the high one jams at ${cap}, so the low one can fall no further than ${answer}`;

  const panelTitle =
    phase === 0 ? "the level" : phase === 1 ? "what is left" : phase === 2 ? "the seesaw" : "the ceiling";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ---------------- axis ---------------- */}
        <line x1={BX - 8} y1={BASE} x2={right + 8} y2={BASE} stroke={INK} strokeWidth={1.6} />
        <line x1={BX - 8} y1={BASE} x2={BX - 8} y2={y(cap) - 12} stroke="#cbd5e1" strokeWidth={1.2} />
        {[0, cap / 2, cap].map((v) => (
          <g key={v}>
            <line x1={BX - 11} y1={y(v)} x2={BX - 8} y2={y(v)} stroke="#cbd5e1" strokeWidth={1.2} />
            <text x={BX - 14} y={y(v) + 3.4} textAnchor="end" fontSize="8.5" fill="#94a3b8" fontFamily={numberFont}>
              {v}
            </text>
          </g>
        ))}

        {/* the cap: a hard ceiling nothing can pass */}
        {phase >= 2 && (
          <motion.line
            x1={BX - 8}
            y1={y(cap)}
            x2={right + 8}
            y2={y(cap)}
            stroke={BAD}
            strokeWidth={2}
            strokeDasharray="5 3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: phase === 2 ? 1.4 : 0.1 }}
          />
        )}

        {/* the level the average sits at */}
        <motion.line
          x1={BX - 8}
          y1={y(average)}
          x2={right + 8}
          y2={y(average)}
          stroke={IND}
          strokeWidth={1.8}
          strokeDasharray="4 3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: phase === 0 ? 0.15 : 0 }}
        />

        {/* both guide lines are named up here — a label sitting on the line
            itself lands on whatever bar happens to reach that height */}
        <g>
          <line x1={BX} y1={22} x2={BX + 14} y2={22} stroke={IND} strokeWidth={1.8} strokeDasharray="4 3" />
          <text x={BX + 19} y={25.5} fontSize="9" fontWeight="800" fill={IND}>
            average {average}
          </text>
          {phase >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: phase === 2 ? 1.5 : 0.15 }}>
              <line x1={BX + 96} y1={22} x2={BX + 110} y2={22} stroke={BAD} strokeWidth={2} strokeDasharray="5 3" />
              <text x={BX + 115} y={25.5} fontSize="9" fontWeight="800" fill={BAD}>
                max {cap}
              </text>
            </motion.g>
          )}
        </g>

        {/* ---------------- the bars ---------------- */}
        {Array.from({ length: count }, (_, i) => {
          const v = heights[i];
          const f = from[i];
          const isKnown = i < known.length;
          const blankIdx = i - known.length;
          const unknownNow = !isKnown && phase < 2;
          const h = Math.max(0, v * SC);
          const fill = isKnown ? SLATE : phase === 3 ? (blankIdx === 0 ? AMB : WIN) : IND;
          const keys = barKeys(Math.max(0, f * SC), h, phase === 3 && blankIdx === 0);
          const delay = phase === 0 ? 0.3 + i * 0.13 : phase === 1 ? 0.35 + i * 0.18 : 0.5 + blankIdx * 0.12;

          if (unknownNow) {
            // an empty slot: nothing is known about it yet
            return (
              <motion.g key={`slot${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 + i * 0.1 }}>
                <rect
                  x={bx(i)}
                  y={y(average)}
                  width={BW}
                  height={BASE - y(average)}
                  fill="#f8fafc"
                  stroke="#cbd5e1"
                  strokeWidth={1.4}
                  strokeDasharray="4 3"
                />
                <text x={bx(i) + BW / 2} y={y(average) + 26} textAnchor="middle" fontSize="15" fontWeight="800" fill="#94a3b8">
                  ?
                </text>
              </motion.g>
            );
          }

          return (
            <g key={`bar${i}`}>
              {/* where this bar started, left behind so the move is legible */}
              {phase >= 2 && !isKnown && f !== v && (
                <rect
                  x={bx(i)}
                  y={y(f)}
                  width={BW}
                  height={Math.max(0, BASE - y(f))}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth={1.2}
                  strokeDasharray="3 3"
                />
              )}
              <motion.g
                initial={keys.initial}
                animate={keys.animate}
                transition={{ duration: phase === 0 ? 0.6 : 0.9, delay, ease: "easeOut" }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <rect x={bx(i)} y={BASE - h} width={BW} height={h} rx={2} fill={fill} opacity={isKnown ? 0.9 : 1} />
              </motion.g>

              {/* the score chip rides the top of its bar, so it moves with it */}
              <motion.g
                initial={{ y: (v - f) * SC, opacity: f === v ? 1 : 0.001 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: phase === 0 ? 0.6 : 0.9, delay, ease: "easeOut" }}
              >
                <text
                  x={bx(i) + BW / 2}
                  y={BASE - h - 6}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill={fill === SLATE ? INK : fill}
                  fontFamily={numberFont}
                >
                  {v}
                </text>
              </motion.g>

              {/* deviation from the level, on the beat the real scores land */}
              {phase === 1 && isKnown && (
                <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 1.4 + i * 0.18 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  {/* a bar below the level leaves a band only a few px tall, and
                      its own score chip is already sitting in it — so hang the
                      shortfall chip inside the bar instead of in the band */}
                  {(() => {
                    const cy = known[i] >= average ? (y(average) + y(known[i])) / 2 : y(average) + 18;
                    return (
                      <g>
                        <rect
                          x={bx(i) + BW / 2 - 15}
                          y={cy - 8}
                          width={30}
                          height={15}
                          rx={7}
                          fill={known[i] >= average ? "#fef3c7" : "#cffafe"}
                          stroke={known[i] >= average ? "#fde68a" : "#a5f3fc"}
                        />
                        <text
                          x={bx(i) + BW / 2}
                          y={cy + 3}
                          textAnchor="middle"
                          fontSize="9.5"
                          fontWeight="800"
                          fill={known[i] >= average ? AMB : COOL}
                          fontFamily={numberFont}
                        >
                          {known[i] - average >= 0 ? "+" : "−"}
                          {Math.abs(known[i] - average)}
                        </text>
                      </g>
                    );
                  })()}
                </motion.g>
              )}
            </g>
          );
        })}

        {/* the seesaw arrows: one up, one down, pinned to the same total */}
        {phase === 2 && (
          <g>
            {[0, 1].map((k) => {
              const i = known.length + k;
              const up = k === 0;
              // outside its own bar, and clear of the neighbouring one
              const cx = up ? bx(i) - 7 : bx(i) + BW + 7;
              // inset proportionally, or a short swing leaves no arrow at all
              const span = Math.abs(y(blankNow[k]) - y(evenSplit));
              const inset = Math.min(6, span / 5);
              const y0 = y(evenSplit) + (up ? -inset : inset);
              const y1 = y(blankNow[k]) + (up ? inset + 5 : -inset - 5);
              return (
                <motion.g key={`arr${k}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 + k * 0.15 }}>
                  <motion.line
                    x1={cx}
                    y1={y0}
                    x2={cx}
                    y2={y1}
                    stroke={up ? AMB : COOL}
                    strokeWidth={2}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 1.05 + k * 0.15 }}
                  />
                  <polygon
                    points={`${cx},${y1 + (up ? -5 : 5)} ${cx - 3.4},${y1 + (up ? 2 : -2)} ${cx + 3.4},${y1 + (up ? 2 : -2)}`}
                    fill={up ? AMB : COOL}
                  />
                </motion.g>
              );
            })}
          </g>
        )}

        {/* ---------------- the labels under the bars ---------------- */}
        {Array.from({ length: count }, (_, i) => (
          <g key={`lab${i}`}>
            <text x={bx(i) + BW / 2} y={BASE + 13} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#94a3b8">
              {label} {i + 1}
            </text>
            <text x={bx(i) + BW / 2} y={BASE + 26} textAnchor="middle" fontSize="10">
              {i < known.length ? icon : "❓"}
            </text>
          </g>
        ))}

        {/* ---------------- side panel ---------------- */}
        <text x={PX} y={26} fontSize="11.5" fontWeight="800" fill={INK}>
          {panelTitle}
        </text>

        {phase === 0 &&
          [
            { d: 0.3, t: `every ${label} at ${average} would`, c: "#475569", s: 10.5 },
            { d: 0.5, t: "average exactly that —", c: "#475569", s: 10.5 },
            { d: 0.7, t: "so the whole pile is", c: "#475569", s: 10.5 },
            { d: 1.2, t: `${average} × ${count} = ${total}`, c: IND, s: 15 },
          ].map((l, i) => (
            <motion.text key={i} x={PX} y={50 + i * 19 + (i === 3 ? 8 : 0)} fontSize={l.s} fontWeight={l.s > 12 ? "800" : "600"} fill={l.c} fontFamily={l.s > 12 ? numberFont : undefined} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: l.d }}>
              {l.t}
            </motion.text>
          ))}

        {phase === 1 &&
          [
            { d: 0.4, t: `the ${known.length} real scores:`, c: "#475569", s: 10.5 },
            { d: 0.8, t: `${known.join(" + ")} = ${knownSum}`, c: INK, s: 12.5 },
            { d: 1.5, t: "so the blanks must supply", c: "#475569", s: 10.5 },
            { d: 1.9, t: `${total} − ${knownSum} = ${needed}`, c: IND, s: 15 },
            { d: 2.3, t: `(the level is ${knownDev >= 0 ? "+" : "−"}${Math.abs(knownDev)} up on the deal)`, c: "#94a3b8", s: 9.5 },
          ].map((l, i) => (
            <motion.text key={i} x={PX} y={50 + i * 21 + (i >= 3 ? 8 : 0)} fontSize={l.s} fontWeight={l.s > 12 ? "800" : "600"} fill={l.c} fontFamily={l.s > 11 ? numberFont : undefined} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: l.d }}>
              {l.t}
            </motion.text>
          ))}

        {phase === 2 &&
          [
            { d: 0.3, t: `split them evenly and each`, c: "#475569", s: 10.5 },
            { d: 0.5, t: `takes ${needed} ÷ ${slots} = ${evenSplit}`, c: INK, s: 12 },
            ...(evenChoice ? [{ d: 0.9, t: `— which is choice ${evenChoice.label}`, c: AMB, s: 10.5 }] : []),
            { d: 1.6, t: "but nothing forces them equal:", c: "#475569", s: 10.5 },
            { d: 1.9, t: "lift one, the other drops", c: "#475569", s: 10.5 },
            { d: 2.2, t: "by the very same amount", c: "#475569", s: 10.5 },
          ].map((l, i) => (
            <motion.text key={i} x={PX} y={50 + i * 20 + (i >= (evenChoice ? 3 : 2) ? 10 : 0)} fontSize={l.s} fontWeight={l.s > 11 ? "800" : "600"} fill={l.c} fontFamily={l.s > 11 ? numberFont : undefined} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: l.d }}>
              {l.t}
            </motion.text>
          ))}

        {phase === 3 && (
          <g>
            {[
              { d: 0.5, t: `push one to the ${cap} ceiling:`, c: "#475569", s: 10.5 },
              { d: 0.9, t: `${needed} − ${cap} = ${answer}`, c: WIN, s: 16 },
            ].map((l, i) => (
              <motion.text key={i} x={PX} y={50 + i * 24} fontSize={l.s} fontWeight="800" fill={l.c} fontFamily={l.s > 11 ? numberFont : undefined} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: l.d }}>
                {l.t}
              </motion.text>
            ))}

            {/* every choice, priced by the partner it forces */}
            <motion.text x={PX} y={116} fontSize="9.5" fontWeight="700" fill="#64748b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
              {allLegal ? "every choice is a score she could get:" : "each choice needs a partner of:"}
            </motion.text>
            {priced.map((c, i) => (
              <motion.g key={c.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8 + i * 0.16 }}>
                <text x={PX} y={132 + i * 15} fontSize="10" fontWeight="800" fill={i === 0 ? WIN : "#94a3b8"} fontFamily={numberFont}>
                  {c.label}
                </text>
                <text x={PX + 16} y={132 + i * 15} fontSize="10" fontWeight={i === 0 ? "800" : "600"} fill={i === 0 ? WIN : "#64748b"} fontFamily={numberFont}>
                  {c.v} with {c.other}
                </text>
                {c.other === cap && (
                  <text x={PX + 96} y={132 + i * 15} fontSize="9" fontWeight="800" fill={BAD}>
                    ← at the ceiling
                  </text>
                )}
              </motion.g>
            ))}
            {allLegal && (
              <motion.text x={PX} y={132 + priced.length * 15 + 12} fontSize="9.5" fontWeight="700" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.9 }}>
                only {answer} is the lowest of them.
              </motion.text>
            )}
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
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 3.2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
