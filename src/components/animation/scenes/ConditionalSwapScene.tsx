import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num as numOf, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WARN = "#b45309";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
type Frac = [number, number];
const reduce = ([n, d]: Frac): Frac => {
  const k = gcd(Math.abs(n), Math.abs(d)) || 1;
  return [n / k, d / k];
};
const show = (f: Frac) => {
  const [n, d] = reduce(f);
  return d === 1 ? `${n}` : `${n}/${d}`;
};
const eq = (a: Frac, b: Frac) => a[0] * b[1] === b[0] * a[1];

/**
 * Two overlapping groups where the **overlap is given as a fraction of one of
 * them**, and the question flips which group you are standing in. The whole
 * problem is that the two conditional probabilities share a numerator: the
 * people in both groups are **one fixed set of individuals**, counted once, and
 * swapping the condition changes only what you divide by. So the scene never
 * re-derives the overlap — it builds those 14 people on screen and then walks
 * them into the other crowd, where they are visibly the same 14 against a
 * different backdrop (35 becomes 50). The fraction is made concrete rather than
 * multiplied: the cap crowd **splits into `den` equal groups** and `num` of them
 * put sunglasses on, so `2/5 of 35` is a count of people, not an arithmetic step;
 * and the final reduction regroups the 50 into `gcd` -sized boxes so `14/50 = 7/25`
 * is read off as *whole boxes*, not asserted. The closing beat prices every slip
 * — dividing by the two rosters added, assuming the answer is symmetric, applying
 * the fraction to the wrong group, and forgetting it entirely — matching each
 * against `problem.choices`; on 2019-15 those four **account for every remaining
 * choice**, so no distractor is authored. Overlap, answer, reduction and every
 * slip are computed, and the scene flags a fraction that does not cut the group
 * into whole people; data
 * `{ aLabel, aCount, bLabel, bCount, givenNum, givenDen }` with the fraction
 * measured inside group B and the question asked about group A.
 */
export function ConditionalSwapScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const aCount = Math.max(1, Math.round(numOf(data.aCount, 1)));
  const bCount = Math.max(1, Math.round(numOf(data.bCount, 1)));
  const gNum = Math.max(0, Math.round(numOf(data.givenNum, 0)));
  const gDen = Math.max(1, Math.round(numOf(data.givenDen, 1)));
  const aLabel = String(data.aLabel ?? "group A");
  const bLabel = String(data.bLabel ?? "group B");

  // ---- the overlap: one fixed set of people, counted from B's side ----
  const both = (bCount * gNum) / gDen;
  const wholePeople = Number.isInteger(both);
  const perGroup = bCount / gDen; // one fifth of the cap crowd
  const cleanSplit = Number.isInteger(perGroup);

  // ---- the answer: same numerator, new denominator ----
  const answer = reduce([both, aCount]);
  const g = gcd(both, aCount) || 1;
  const boxes = aCount / g; // the 50 regrouped into 25 pairs
  const litBoxes = both / g; // 7 of them

  // ---- every slip, priced against the real choices ----
  const parse = (s: string): Frac | null => {
    const t = String(s).replace(/\s/g, "").replace(/[−–—]/g, "-");
    const m = t.match(/^(-?\d+)\/(\d+)$/);
    if (m) return [Number(m[1]), Number(m[2])];
    const v = Number(t.replace(/[^\d.-]/g, ""));
    return Number.isFinite(v) && t !== "" ? [v, 1] : null;
  };
  const letterFor = (f: Frac): string | null => {
    const hit = (problem.choices ?? []).find((c) => {
      const p = parse(String(c.text));
      return p != null && p[1] !== 0 && eq(p, f);
    });
    return hit ? String(hit.label) : null;
  };
  const slipSource: { f: Frac | null; why: string }[] = [
    { f: [both, aCount + bCount], why: `divided by ${aCount} + ${bCount}` },
    { f: [gNum, gDen], why: "assumed it reads the same both ways" },
    {
      f: Number.isInteger((aCount * gNum) / gDen) ? [(aCount * gNum) / gDen, bCount] : null,
      why: `took ${gNum}/${gDen} of the ${aCount} instead`,
    },
    { f: [bCount, aCount], why: "forgot the fraction" },
  ];
  const slips = slipSource
    .map((s) => (s.f ? { ...s, f: s.f as Frac, letter: letterFor(s.f as Frac) } : null))
    .filter((s): s is { f: Frac; why: string; letter: string | null } => s != null && s.letter != null && !eq(s.f, answer));
  const answerLetter = letterFor(answer);
  const named = slips.length + (answerLetter ? 1 : 0);
  const totalChoices = (problem.choices ?? []).length;

  // ---- self-check ----
  const storedOk =
    problem.shortAnswer == null || (() => {
      const p = parse(String(problem.shortAnswer));
      return p != null && eq(p, answer);
    })();
  const failure = !wholePeople
    ? `${gNum}/${gDen} of ${bCount} is not a whole number of people`
    : both > aCount
    ? `${both} in both exceeds the ${aCount} in ${aLabel}`
    : !storedOk
    ? `computed ${show(answer)} ≠ stored ${problem.shortAnswer}`
    : null;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 264;

  /** One beachgoer: a cap is a red dome, sunglasses a dark bar, both turns the body green. */
  const Person = ({ x, y, cap, sun }: { x: number; y: number; cap?: boolean; sun?: boolean }) => (
    <g>
      <rect x={x - 4.5} y={y + 5} width={9} height={10} rx={3.5} fill={cap && sun ? WIN : "#cbd5e1"} />
      <circle cx={x} cy={y} r={5.5} fill="#fcd34d" stroke="#f59e0b" strokeWidth={0.6} />
      {cap && (
        <g>
          <path d={`M ${x - 6} ${y - 1.4} A 6 6 0 0 1 ${x + 6} ${y - 1.4} Z`} fill={BAD} />
          <rect x={x - 7.6} y={y - 2.3} width={10.5} height={1.9} rx={0.9} fill="#b91c1c" />
        </g>
      )}
      {sun && <rect x={x - 5.6} y={y + 0.6} width={11.2} height={3.2} rx={1.2} fill={INK} />}
    </g>
  );

  /** Row-major slot position inside a block. */
  const slot = (i: number, cols: number, cw: number, ch: number, x0: number, y0: number) => ({
    x: x0 + (i % cols) * cw + cw / 2,
    y: y0 + Math.floor(i / cols) * ch + ch / 2,
  });

  // ---------- phase 0: the two rosters, overlap unknown ----------
  const capBlock = (i: number) => slot(i, 7, 24, 28, 26, 42);
  const sunBlock = (i: number) => slot(i, 10, 24, 28, 214, 42);

  // ---------- phase 1: the cap crowd sorts itself into fifths ----------
  const fifthCols = Math.min(3, perGroup);
  const fifthW = fifthCols * 22 + 10;
  const fifthPitch = (W - 40) / gDen;
  const fifthPos = (grp: number, k: number) => {
    const bx = 20 + grp * fifthPitch + (fifthPitch - fifthW) / 2;
    return { x: bx + 5 + (k % fifthCols) * 22 + 11, y: 54 + Math.floor(k / fifthCols) * 26 + 13 };
  };

  // ---------- phase 2: the same overlap, seen from the other crowd ----------
  // 26 is the tightest row pitch a figure fits in — at 22 the bodies run into
  // the heads of the row below and the block smears into stripes
  const capSmall = (i: number) => slot(i, 7, 21, 26, 26, 52);
  const sunBig = (i: number) => slot(i, 10, 22, 26, 210, 52);

  // ---------- phase 3: the 50 regrouped into gcd-sized boxes ----------
  const boxCols = Math.min(5, boxes);
  const boxW = g * 16 + 10;
  const boxH = 29;
  const boxAt = (b: number) => ({
    x: 16 + (b % boxCols) * (boxW + 4),
    y: 40 + Math.floor(b / boxCols) * (boxH + 4),
  });
  const PX = 250;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ================= phase 0: two rosters, and an unknown overlap ================= */}
        {phase === 0 && (
          <g>
            <text x={235} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              two counts on one beach — some people are on both lists
            </text>

            {Array.from({ length: bCount }).map((_, i) => {
              const p = capBlock(i);
              return (
                <motion.g
                  key={`c${i}`}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 + i * 0.014 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <Person x={p.x} y={p.y} cap />
                </motion.g>
              );
            })}
            {Array.from({ length: aCount }).map((_, i) => {
              const p = sunBlock(i);
              return (
                <motion.g
                  key={`s${i}`}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 + i * 0.014 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <Person x={p.x} y={p.y} sun />
                </motion.g>
              );
            })}

            <text x={26 + (7 * 24) / 2} y={198} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
              {bCount} in {bLabel}
            </text>
            <text x={214 + (10 * 24) / 2} y={198} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {aCount} in {aLabel}
            </text>

            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              <line x1={176} y1={110} x2={206} y2={110} stroke={WARN} strokeWidth={1.8} strokeDasharray="4 3" />
              <text x={191} y={102} textAnchor="middle" fontSize="13" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                ?
              </text>
            </motion.g>

            <motion.text
              x={235}
              y={222}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="800"
              fill={IND}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              pick a {bLabel.replace(/s$/, "")} wearer at random: {show([gNum, gDen])} of them also wear {aLabel}
            </motion.text>
            <text x={235} y={244} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM}>
              nobody is drawn twice yet — first find how many wear both
            </text>
          </g>
        )}

        {/* ================= phase 1: the fraction, cut into real people ================= */}
        {phase === 1 && (
          <g>
            <text x={235} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              {gNum} in every {gDen} of the {bCount} — so split them into {gDen} equal groups
            </text>

            {cleanSplit &&
              Array.from({ length: gDen }).map((_, grp) => {
                const lit = grp < gNum;
                const bx = 20 + grp * fifthPitch + (fifthPitch - fifthW) / 2;
                const rows = Math.ceil(perGroup / fifthCols);
                return (
                  <motion.g
                    key={`box${grp}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 + grp * 0.1 }}
                  >
                    <rect
                      x={bx}
                      y={46}
                      width={fifthW}
                      height={rows * 26 + 14}
                      rx={8}
                      fill={lit ? "#dcfce7" : "#f8fafc"}
                      stroke={lit ? WIN : "#e2e8f0"}
                      strokeWidth={lit ? 1.6 : 1.2}
                    />
                    <text
                      x={bx + fifthW / 2}
                      y={46 + rows * 26 + 28}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="800"
                      fill={lit ? WIN : DIM}
                      fontFamily={numberFont}
                    >
                      {perGroup}
                    </text>
                  </motion.g>
                );
              })}

            {/* every cap wearer walks from the single block into its fifth */}
            {cleanSplit &&
              Array.from({ length: bCount }).map((_, i) => {
                const grp = Math.floor(i / perGroup);
                const k = i % perGroup;
                const from = capBlock(i);
                const to = fifthPos(grp, k);
                const lit = grp < gNum;
                return (
                  <motion.g
                    key={`p${i}`}
                    initial={{ x: from.x - to.x, y: from.y - to.y }}
                    animate={{ x: 0, y: 0 }}
                    transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.15 + grp * 0.12 + k * 0.02 }}
                  >
                    <Person x={to.x} y={to.y} cap sun={lit} />
                  </motion.g>
                );
              })}

            <motion.text
              x={235}
              y={186}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={DIM}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {gNum} of those {gDen} groups put sunglasses on
            </motion.text>
            <motion.text
              x={235}
              y={214}
              textAnchor="middle"
              fontSize="18"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.75 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {gNum} × {perGroup} = {both} wear both
            </motion.text>
            <motion.text
              x={235}
              y={240}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="700"
              fill={DIM}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              {show([gNum, gDen])} × {bCount} = {both}
            </motion.text>
          </g>
        )}

        {/* ================= phase 2: the same people, the other crowd ================= */}
        {phase === 2 && (
          <g>
            <text x={235} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              those {both} are the very same people in the {aLabel} crowd
            </text>

            {/* the cap crowd stays put; the overlap is ghosted where it came from */}
            {Array.from({ length: bCount }).map((_, i) => {
              const p = capSmall(i);
              const isBoth = i < both;
              return (
                <g key={`cs${i}`} opacity={isBoth ? 0.28 : 1}>
                  <Person x={p.x} y={p.y} cap sun={isBoth} />
                </g>
              );
            })}
            <text x={26 + (7 * 21) / 2} y={200} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
              {bCount} {bLabel}
            </text>

            {/* the sunglasses-only people fill in around them */}
            {Array.from({ length: aCount }).map((_, i) => {
              if (i < both) return null;
              const p = sunBig(i);
              return (
                <motion.g
                  key={`so${i}`}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 + (i - both) * 0.016 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <Person x={p.x} y={p.y} sun />
                </motion.g>
              );
            })}

            {/* the overlap walks across */}
            {Array.from({ length: both }).map((_, i) => {
              const from = capSmall(i);
              const to = sunBig(i);
              return (
                <motion.g
                  key={`mv${i}`}
                  initial={{ x: from.x - to.x, y: from.y - to.y }}
                  animate={{ x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 90, damping: 17, delay: 0.7 + i * 0.055 }}
                >
                  <Person x={to.x} y={to.y} cap sun />
                </motion.g>
              );
            })}
            <text x={210 + (10 * 22) / 2} y={200} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {aCount} {aLabel}
            </text>

            <motion.text
              x={235}
              y={226}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              {both} of {bCount} became {both} of {aCount} — only the crowd changed
            </motion.text>
            <text x={235} y={246} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM}>
              the {both} are counted once; they are on both lists
            </text>
          </g>
        )}

        {/* ================= phase 3: regroup, reduce, and price every slip ================= */}
        {phase === 3 && (
          <g>
            <text x={16} y={16} fontSize="11" fontWeight="800" fill={INK}>
              {g > 1 ? `group the ${aCount} into ${boxes} ${g === 2 ? "pairs" : `${g}s`}` : `${both} of the ${aCount}`}
            </text>

            {Array.from({ length: boxes }).map((_, b) => {
              const pos = boxAt(b);
              const lit = b < litBoxes;
              return (
                <motion.g
                  key={`b${b}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 + b * 0.03 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <rect
                    x={pos.x}
                    y={pos.y}
                    width={boxW}
                    height={boxH}
                    rx={6}
                    fill={lit ? "#dcfce7" : "#f8fafc"}
                    stroke={lit ? WIN : "#e2e8f0"}
                    strokeWidth={lit ? 1.5 : 1}
                  />
                  {Array.from({ length: g }).map((_, k) => (
                    <Person key={k} x={pos.x + 5 + k * 16 + 8} y={pos.y + 9} sun cap={lit} />
                  ))}
                </motion.g>
              );
            })}

            <motion.text
              x={16}
              y={40 + Math.ceil(boxes / boxCols) * (boxH + 4) + 18}
              fontSize="10.5"
              fontWeight="700"
              fill={DIM}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {litBoxes} of the {boxes} {g === 2 ? "pairs are both" : `groups are all ${g}`} cap wearers
            </motion.text>
            <motion.text
              x={16}
              y={40 + Math.ceil(boxes / boxCols) * (boxH + 4) + 46}
              fontSize="19"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.3 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {both}/{aCount} = {show(answer)}
            </motion.text>

            {/* the slips */}
            <text x={PX} y={16} fontSize="11" fontWeight="800" fill={INK}>
              where the other choices come from
            </text>
            {slips.map((s, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 19, delay: 1.6 + i * 0.18 }}
              >
                <rect x={PX} y={26 + i * 40} width={206} height={34} rx={7} fill="#fef2f2" stroke="#fecaca" strokeWidth={1.1} />
                <text x={PX + 9} y={42 + i * 40} fontSize="11.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                  {show(s.f)}
                </text>
                <text x={PX + 58} y={42 + i * 40} fontSize="9" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                  choice {s.letter}
                </text>
                <text x={PX + 9} y={54 + i * 40} fontSize="9" fontWeight="700" fill={DIM}>
                  {s.why}
                </text>
              </motion.g>
            ))}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 + slips.length * 0.18 }}>
              <rect x={PX} y={26 + slips.length * 40} width={206} height={34} rx={7} fill="#dcfce7" stroke={WIN} strokeWidth={1.4} />
              <text x={PX + 9} y={42 + slips.length * 40} fontSize="11.5" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                {show(answer)}
              </text>
              {answerLetter && (
                <text x={PX + 58} y={42 + slips.length * 40} fontSize="9" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                  choice {answerLetter}
                </text>
              )}
              <text x={PX + 9} y={54 + slips.length * 40} fontSize="9" fontWeight="700" fill={WIN}>
                the {both} over the {aCount} they sit in
              </text>
            </motion.g>
            {totalChoices > 0 && (
              <motion.text
                x={PX}
                y={40 + (slips.length + 1) * 40 + 8}
                fontSize="9.5"
                fontWeight="700"
                fill={DIM}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.6 }}
              >
                {named === totalChoices
                  ? `every one of the ${totalChoices} choices is a named slip`
                  : `${named} of the ${totalChoices} choices accounted for`}
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
        {phase === 0
          ? `${aCount} ${aLabel}, ${bCount} ${bLabel}, overlap unknown`
          : phase === 1
          ? `${show([gNum, gDen])} × ${bCount} = ${both} wear both`
          : phase === 2
          ? `same ${both} people, now out of ${aCount}`
          : `${both}/${aCount} = ${show(answer)}`}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
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
