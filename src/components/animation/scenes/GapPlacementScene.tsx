import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const REP = "#fbbf24"; // the repeated letter — honey, for a beekeeper
const REP_EDGE = "#b45309";
const OTH = "#c7d2fe";
const OTH_EDGE = "#4338ca";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const MUTE = "#94a3b8";

const W = 360;
const H = 210;
const TW = 26; // working-row tile pitch
const TH = 30;
const ROW = 90;

const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const choose = (n: number, r: number): number => (r < 0 || r > n ? 0 : fact(n) / (fact(r) * fact(n - r)));

/** A letter tile drawn at the origin. */
function Tile({ ch, rep, w = TW - 2, h = TH, dim = false }: { ch: string; rep: boolean; w?: number; h?: number; dim?: boolean }) {
  return (
    <g opacity={dim ? 0.35 : 1}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={4} fill={rep ? REP : OTH} stroke={rep ? REP_EDGE : OTH_EDGE} strokeWidth={1.4} />
      <text x={0} y={h / 2 - 9} textAnchor="middle" fontSize={h * 0.55} fontWeight="800" fill={rep ? REP_EDGE : OTH_EDGE} fontFamily={numberFont}>
        {ch}
      </text>
    </g>
  );
}

/** A bee, drawn at the origin, facing right. */
function Bee() {
  return (
    <g>
      <ellipse cx={-2} cy={-4} rx={4.5} ry={3} fill="#e0f2fe" stroke={INK} strokeWidth={0.7} opacity={0.9} />
      <ellipse cx={3} cy={-4} rx={4.5} ry={3} fill="#e0f2fe" stroke={INK} strokeWidth={0.7} opacity={0.9} />
      <ellipse cx={0} cy={0} rx={6} ry={4} fill={REP} stroke={INK} strokeWidth={1} />
      <path d="M -2 -3.6 L -2 3.6 M 1.5 -3.8 L 1.5 3.8" stroke={INK} strokeWidth={1.1} />
      <circle cx={6.5} cy={-0.5} r={1} fill={INK} />
    </g>
  );
}

/**
 * Rearranging a word so that no two copies of its repeated letter touch. The
 * counting looks open-ended until the row is built the other way round: lay the
 * **other** letters down first and the gaps around them are the only places a
 * repeated letter may go — one per gap, or two would touch. Four other letters
 * make five gaps, and there are exactly five Es, so the fit has **no slack at
 * all**: every gap takes one, and the skeleton E _ E _ E _ E _ E is forced
 * before any choosing happens. The whole answer is therefore the order of the
 * four remaining letters, drawn as the multiplication principle on the real
 * slots (4 × 3 × 2 × 1).
 * The closing beat prices both neighbouring slips it can compute — the number of
 * ways to *place* the Es (1, an answer choice on its own) and the factorial of
 * the wrong set (5! = 120) — and names the choices they hit.
 * Letter counts, gaps, the placement count and the multinomial over the other
 * letters are all computed from the word, and the total is checked against the
 * stored answer.
 * Data: { word, letter }.
 */
export function GapPlacementScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const word = String(data.word ?? "BEEKEEPER").toUpperCase();
  const letter = String(data.letter ?? "E").toUpperCase().slice(0, 1);

  const chars = word.split("");
  const reps = chars.filter((c) => c === letter);
  const others = chars.filter((c) => c !== letter);
  const gaps = others.length + 1;
  const forced = reps.length === gaps;

  const mult: Record<string, number> = {};
  others.forEach((c) => (mult[c] = (mult[c] ?? 0) + 1));
  const orderWays = fact(others.length) / Object.values(mult).reduce((a, m) => a * fact(m), 1);
  const placeWays = choose(gaps, reps.length);
  const totalWays = placeWays * orderWays;

  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value));
  const winner = opts.find((o) => o.value === totalWays);
  const placeSlip = placeWays !== totalWays ? opts.find((o) => o.value === placeWays) : undefined;
  const repFactSlip = opts.find((o) => o.value === fact(reps.length) && fact(reps.length) !== totalWays);
  const agrees = !problem.answer || winner?.label === problem.answer;

  // the finished row: a repeated letter in every gap, the others between them
  const rowN = others.length + reps.length;
  const rowX0 = W / 2 - (rowN * TW) / 2;
  const slotX = (i: number) => rowX0 + i * TW + TW / 2; // i = 0..rowN-1
  const gapIdx = Array.from({ length: gaps }, (_, i) => 2 * i); // 0, 2, 4, …
  const othIdx = others.map((_, i) => 2 * i + 1);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const preSteps = Math.max(1, totalSteps - 1);
  const showSplit = !isFinal && step === 0;
  // the letters stay in place once dropped — the final beat still shows them
  const showDrop = !showSplit && (isFinal || step >= Math.max(1, preSteps - 1));
  const showGaps = !showSplit;

  // beat 4 shuffles the other letters and settles back
  const rot = othIdx.map((_, i) => othIdx[(i + 1) % othIdx.length]);
  const shuffleX = (i: number): number | number[] =>
    isFinal ? [slotX(othIdx[i]), slotX(rot[i]), slotX(othIdx[i])] : slotX(othIdx[i]);

  const caption = showSplit
    ? `${word} is ${reps.length} ${letter}'s and ${others.length} other letters: ${others.join(", ")}`
    : !showDrop
    ? `${others.length} letters in a row leave ${gaps} gaps, counting both ends`
    : !isFinal
    ? forced
      ? `${reps.length} ${letter}'s into ${gaps} gaps, at most one each — every gap takes exactly one`
      : `${reps.length} ${letter}'s into ${gaps} gaps, at most one each`
    : `the skeleton is forced, so only the order of ${others.join(", ")} is free: ${totalWays} ways`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {showSplit ? (
          <g>
            {/* the word, then its letters flying into two piles */}
            {chars.map((c, i) => {
              const homeX = W / 2 - (chars.length * 25) / 2 + i * 25 + 12.5;
              const isRep = c === letter;
              const pileI = isRep ? reps.findIndex((_, k) => chars.filter((d, j) => d === letter && j <= i).length - 1 === k) : others.findIndex((_, k) => chars.filter((d, j) => d !== letter && j <= i).length - 1 === k);
              const toX = isRep ? 46 + pileI * 28 : 224 + pileI * 28;
              return (
                <motion.g
                  key={i}
                  initial={{ x: homeX, y: 50 }}
                  animate={{ x: toX, y: 112 }}
                  transition={{ type: "spring", stiffness: 90, damping: 17, delay: 0.6 + i * 0.06 }}
                >
                  <Tile ch={c} rep={isRep} w={23} h={26} />
                </motion.g>
              );
            })}
            <motion.text x={W / 2} y={26} textAnchor="middle" fontSize="11" fontWeight="800" fill={MARK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {word}
            </motion.text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              <text x={46 + ((reps.length - 1) * 28) / 2} y={144} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={REP_EDGE} fontFamily={numberFont}>
                {reps.length} {letter}'s
              </text>
              <text x={46 + ((reps.length - 1) * 28) / 2} y={158} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                all identical
              </text>
              <text x={224 + ((others.length - 1) * 28) / 2} y={144} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={OTH_EDGE} fontFamily={numberFont}>
                {others.length} others
              </text>
              <text x={224 + ((others.length - 1) * 28) / 2} y={158} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                all different
              </text>
            </motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
              <text x={W / 2} y={184} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                no two {letter}'s may end up next to each other
              </text>
            </motion.g>
          </g>
        ) : (
          <g>
            {/* the gaps around the other letters — the only places an E may go */}
            {gapIdx.map((s, i) => {
              const filled = showDrop;
              return (
                <g key={`gap-${i}`}>
                  {!filled && (
                    <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.5 + i * 0.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                      <rect x={slotX(s) - TW / 2 + 1} y={ROW - TH / 2} width={TW - 2} height={TH} rx={4} fill="#f8fafc" stroke={REP_EDGE} strokeWidth={1.3} strokeDasharray="4 3" />
                      <text x={slotX(s)} y={ROW + 5} textAnchor="middle" fontSize="11" fontWeight="800" fill={REP_EDGE} fontFamily={numberFont}>
                        {i + 1}
                      </text>
                    </motion.g>
                  )}
                </g>
              );
            })}

            {/* the repeated letters dropping one per gap */}
            <AnimatePresence>
              {showDrop &&
                gapIdx.map((s, i) => (
                  <motion.g
                    key={`rep-${i}`}
                    initial={{ x: slotX(s), y: ROW - 46, opacity: 0 }}
                    animate={{ x: slotX(s), y: ROW, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.35 + i * 0.16 }}
                  >
                    <Tile ch={letter} rep />
                  </motion.g>
                ))}
            </AnimatePresence>

            {/* the other letters, which are the only thing left to order */}
            {others.map((c, i) => (
              <motion.g
                key={`oth-${i}`}
                initial={{ x: slotX(othIdx[i]), y: ROW }}
                animate={{ x: shuffleX(i), y: ROW }}
                transition={
                  isFinal
                    ? { duration: 1.4, times: [0, 0.5, 1], ease: "easeInOut", delay: 0.4 }
                    : { type: "spring", stiffness: 140, damping: 17, delay: 0.2 + i * 0.08 }
                }
              >
                <Tile ch={c} rep={false} />
              </motion.g>
            ))}

            {/* a bee doing the rounds as the honey-coloured tiles land */}
            {showDrop && (
              <motion.g
                initial={{ x: slotX(0), y: ROW - 30 }}
                animate={{ x: gapIdx.map((s) => slotX(s)), y: ROW - 30 }}
                transition={{ duration: 0.16 * gaps * 3, times: gapIdx.map((_, i) => i / Math.max(1, gaps - 1)), ease: "easeInOut", delay: 0.35 }}
              >
                <Bee />
              </motion.g>
            )}

            {/* how many gaps, and why the fit is exact */}
            <AnimatePresence mode="wait">
              {!showDrop ? (
                <motion.g key="g-count" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.text
                    x={W / 2}
                    y={ROW + 52}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    fill={MARK}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.5 + gaps * 0.1 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {others.length} letters → {gaps} gaps
                  </motion.text>
                  <motion.text x={W / 2} y={ROW + 70} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={MUTE} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + gaps * 0.1 }}>
                    the two ends count as gaps too
                  </motion.text>
                </motion.g>
              ) : !isFinal ? (
                <motion.g key="g-fit" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.text
                    x={W / 2}
                    y={ROW + 52}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    fill={forced ? WIN : MARK}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.4 + gaps * 0.16 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {reps.length} {letter}'s into {gaps} gaps: {placeWays} way{placeWays === 1 ? "" : "s"}
                  </motion.text>
                  {/* what a doubled-up gap would look like */}
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + gaps * 0.16 }}>
                    <rect x={W / 2 - 62} y={ROW + 60} width={30} height={20} rx={3} fill={REP} stroke={BAD} strokeWidth={1.2} />
                    <text x={W / 2 - 47} y={ROW + 74} textAnchor="middle" fontSize="11" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                      {letter}{letter}
                    </text>
                    <line x1={W / 2 - 64} y1={ROW + 82} x2={W / 2 - 30} y2={ROW + 58} stroke={BAD} strokeWidth={1.6} />
                    <text x={W / 2 - 24} y={ROW + 74} fontSize="9.5" fontWeight="700" fill={BAD} fontFamily={numberFont}>
                      two in one gap would touch
                    </text>
                  </motion.g>
                </motion.g>
              ) : (
                <motion.g key="g-fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* the multiplication principle, on the real slots */}
                  {others.map((_, i) => (
                    <motion.g
                      key={i}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 220, damping: 18, delay: 1.8 + i * 0.14 }}
                    >
                      <text x={slotX(othIdx[i])} y={ROW + 32} textAnchor="middle" fontSize="12" fontWeight="800" fill={OTH_EDGE} fontFamily={numberFont}>
                        {others.length - i}
                      </text>
                      {i < others.length - 1 && (
                        <text x={(slotX(othIdx[i]) + slotX(othIdx[i + 1])) / 2} y={ROW + 32} textAnchor="middle" fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                          ×
                        </text>
                      )}
                    </motion.g>
                  ))}
                  <motion.text
                    x={W / 2}
                    y={ROW + 58}
                    textAnchor="middle"
                    fontSize="15"
                    fontWeight="800"
                    fill={WIN}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 15, delay: 2.4 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {others.length}! = {totalWays}
                  </motion.text>
                  {(placeSlip || repFactSlip) && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}>
                      {placeSlip && (
                        <text x={W / 2} y={ROW + 76} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={BAD} fontFamily={numberFont}>
                          stopping at the forced skeleton gives {placeWays} = ({placeSlip.label})
                        </text>
                      )}
                      {repFactSlip && (
                        <text x={W / 2} y={ROW + 88} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={BAD} fontFamily={numberFont}>
                          ordering the {reps.length} {letter}'s instead gives {fact(reps.length)} = ({repFactSlip.label})
                        </text>
                      )}
                    </motion.g>
                  )}
                </motion.g>
              )}
            </AnimatePresence>
          </g>
        )}
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
            transition={{ delay: 3 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? MUTE : BAD, textAlign: "center" }}
          >
            {!agrees
              ? `this counts ${totalWays}, not the stored answer`
              : forced
              ? `${reps.length} ${letter}'s and ${gaps} gaps leave no slack, so the ${letter} positions were never a choice`
              : `${placeWays} ways to place the ${letter}'s × ${orderWays} orders of the rest`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 3.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
