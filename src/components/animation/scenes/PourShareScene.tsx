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
const JUICE = "#f59e0b";
const JUICE_DEEP = "#b45309";
const GLASS = "#94a3b8";

const W = 520;
const H = 300;

/**
 * A vessel filled to a fraction of its capacity, emptied equally into a few
 * cups, asking what share of the **whole vessel** each cup received. The trap is
 * in that last phrase: each cup plainly gets one fifth *of the juice*, and one
 * fifth is 20% — which is an answer choice — but the question measures against
 * the pitcher, empty quarter included.
 *
 * The scene removes the arithmetic entirely by finding the **fewest equal slices
 * that make both the fill line and one cup's share land on slice boundaries**
 * (searched for, not asserted: 20 here, since the fill has to be a whole number
 * of slices *and* divisible by the number of cups). Then the juice is 15 slices,
 * each cup takes 3, and the answer reads straight off the ruler as 3 of 20. The
 * slices are real objects — they are ruled into the pitcher, then fly out of it
 * three at a time into the cups, so nothing is claimed that cannot be counted.
 *
 * The closing beat puts the two rulers side by side, the pitcher's 20 against the
 * juice's 15, so the distractor is *shown* to be the same 3 slices measured
 * against the wrong whole. Every slip is computed and matched against
 * `problem.choices` — a fifth of the juice, the unfilled part, a single slice;
 * data `{ numer, den, cups, drink?, icon?, vessel? }`.
 */
export function PourShareScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const numer = Math.max(1, Math.round(num(data.numer, 3)));
  const den = Math.max(2, Math.round(num(data.den, 4)));
  const cups = Math.max(1, Math.round(num(data.cups, 5)));
  const drink = String(data.drink ?? "juice");
  const vessel = String(data.vessel ?? "pitcher");
  const icon = String(data.icon ?? "🥤");

  // ---- the fewest equal slices that make the fill line *and* each cup whole ----
  let slices = 0;
  for (let s = 1; s <= den * cups; s += 1) {
    if ((s * numer) % den !== 0) continue;
    if (((s * numer) / den) % cups === 0) {
      slices = s;
      break;
    }
  }
  if (slices === 0) slices = den * cups;
  const juiceSlices = (slices * numer) / den;
  const perCup = juiceSlices / cups;
  const emptySlices = slices - juiceSlices;

  const pct = (part: number, whole: number) => {
    const v = (part / whole) * 100;
    return Number.isInteger(v) ? `${v}%` : `${v.toFixed(1)}%`;
  };
  const answerPct = (perCup / slices) * 100;

  // ---- slips, each matched against the real choices ----
  const choiceFor = (value: number) => {
    const hit = (problem.choices ?? []).find((c) => {
      const v = Number(
        String(c.text)
          .replace(/[−–—]/g, "-")
          .replace(/[^\d.-]/g, "")
      );
      return Number.isFinite(v) && Math.abs(v - value) < 1e-9;
    });
    return hit?.label ?? null;
  };
  const juiceShare = (perCup / juiceSlices) * 100;
  const emptyShare = (emptySlices / slices) * 100;
  const oneSlice = (1 / slices) * 100;
  const slips = [
    { v: juiceShare, why: `of the ${drink}` },
    { v: emptyShare, why: `the empty part` },
    { v: oneSlice, why: `one slice` },
  ]
    .filter((s, i, all) => Math.abs(s.v - answerPct) > 1e-9 && all.findIndex((o) => Math.abs(o.v - s.v) < 1e-9) === i)
    .map((s) => ({ ...s, label: choiceFor(s.v) }))
    .filter((s) => s.label);

  const answerNum = Number(String(problem.shortAnswer ?? "").replace(/[^\d.-]/g, ""));
  const answerOk = !Number.isFinite(answerNum) || Math.abs(answerNum - answerPct) < 1e-9;
  const ok = answerOk && juiceSlices % cups === 0;

  const lastStep = totalSteps - 1;
  const isFinal = beat >= lastStep;
  const phase = isFinal ? 3 : Math.min(Math.max(beat, 0), 3);

  // ---------------- geometry ----------------
  const bodyX = 52;
  const bodyW = 88;
  const yTop = 58;
  const yBot = 252;
  const bandH = (yBot - yTop) / slices;
  const sliceY = (i: number) => yBot - (i + 1) * bandH; // slice i counted from the bottom
  const juiceTop = yBot - juiceSlices * bandH;

  const body = `M ${bodyX},${yTop} L ${bodyX + bodyW},${yTop} L ${bodyX + bodyW},${yBot - 10} Q ${bodyX + bodyW},${yBot} ${bodyX + bodyW - 10},${yBot} L ${bodyX + 10},${yBot} Q ${bodyX},${yBot} ${bodyX},${yBot - 10} Z`;

  // cups sit in a row to the right
  const cupW = Math.min(48, (W - 200) / cups - 8);
  const cupGap = (W - 196 - cupW * cups) / (cups - 1 || 1);
  const cupX = (i: number) => 190 + i * (cupW + cupGap) + cupW / 2;
  const cupBot = 250;
  const cupTop = cupBot - 62;

  const Slice = ({
    x,
    y,
    w,
    fill,
    delay,
    dx = 0,
    dy = 0,
    lit = false,
  }: {
    x: number;
    y: number;
    w: number;
    fill: string;
    delay: number;
    dx?: number;
    dy?: number;
    lit?: boolean;
  }) => {
    const flying = dx !== 0 || dy !== 0;
    return (
      <motion.g
        initial={flying ? { x: dx, y: dy, opacity: 1 } : { opacity: 0, scaleY: 0 }}
        animate={flying ? { x: 0, y: 0, opacity: 1 } : { opacity: 1, scaleY: 1 }}
        transition={{ type: "spring", stiffness: 130, damping: 17, delay }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <rect
          x={x - w / 2}
          y={y}
          width={w}
          height={Math.max(2, bandH - 1.2)}
          rx={1.5}
          fill={fill}
          stroke={lit ? JUICE_DEEP : "none"}
          strokeWidth={lit ? 1.2 : 0}
        />
      </motion.g>
    );
  };

  const Pitcher = ({ ruled, empty }: { ruled: boolean; empty: boolean }) => (
    <g>
      {/* spout and handle */}
      <path d={`M ${bodyX},${yTop + 6} L ${bodyX - 18},${yTop + 18} L ${bodyX},${yTop + 30} Z`} fill="#f1f5f9" stroke={GLASS} strokeWidth={1.6} strokeLinejoin="round" />
      <path
        d={`M ${bodyX + bodyW},${yTop + 30} Q ${bodyX + bodyW + 30},${yTop + 60} ${bodyX + bodyW + 30},${yTop + 96} Q ${bodyX + bodyW + 30},${yTop + 128} ${bodyX + bodyW},${yTop + 150}`}
        fill="none"
        stroke={GLASS}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path d={body} fill="#f8fafc" stroke={GLASS} strokeWidth={2} strokeLinejoin="round" />
      <clipPath id="pitcherClip">
        <path d={body} />
      </clipPath>
      <g clipPath="url(#pitcherClip)">
        {!empty && (
          <motion.rect
            x={bodyX}
            y={juiceTop}
            width={bodyW}
            height={yBot - juiceTop}
            fill={JUICE}
            fillOpacity={0.75}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.2 }}
            style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
          />
        )}
        {/* the ruler: quarters first, then every slice */}
        {Array.from({ length: den - 1 }).map((_, i) => (
          <motion.line
            key={`q${i}`}
            x1={bodyX}
            y1={yBot - ((i + 1) * (yBot - yTop)) / den}
            x2={bodyX + bodyW}
            y2={yBot - ((i + 1) * (yBot - yTop)) / den}
            stroke={INK}
            strokeWidth={1.4}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.12 }}
          />
        ))}
        {ruled &&
          Array.from({ length: slices - 1 }).map((_, i) => (
            <motion.line
              key={`s${i}`}
              x1={bodyX}
              y1={sliceY(i)}
              x2={bodyX + bodyW}
              y2={sliceY(i)}
              stroke={INK}
              strokeWidth={0.7}
              strokeOpacity={0.5}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.35, delay: 0.6 + (i % (slices / den)) * 0.06 + Math.floor(i / (slices / den)) * 0.12 }}
              style={{ transformBox: "fill-box", transformOrigin: "left" }}
            />
          ))}
      </g>
      <text x={bodyX + bodyW / 2} y={yBot + 18} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK}>
        {icon} the {vessel}
      </text>
    </g>
  );

  const Cup = ({ x, delay }: { x: number; delay: number }) => (
    <motion.path
      d={`M ${x - cupW / 2},${cupTop} L ${x - cupW * 0.34},${cupBot} L ${x + cupW * 0.34},${cupBot} L ${x + cupW / 2},${cupTop}`}
      fill="#f8fafc"
      fillOpacity={0.9}
      stroke={GLASS}
      strokeWidth={1.8}
      strokeLinejoin="round"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 18, delay }}
    />
  );

  const title =
    phase === 0
      ? `${numer} of the ${vessel}'s ${den} quarters hold ${drink}`
      : phase === 1
      ? `rule it into ${slices} equal slices — the fill line and a fifth both land on one`
      : phase === 2
      ? `the ${juiceSlices} slices leave ${perCup} at a time`
      : `${perCup} slices out of the ${vessel}'s ${slices} — measure against the right whole`;

  const equation =
    phase === 0
      ? `${numer}/${den} full`
      : phase === 1
      ? `${numer}/${den} of ${slices} = ${juiceSlices} slices`
      : phase === 2
      ? `${juiceSlices} ÷ ${cups} = ${perCup} slices each`
      : `${perCup}/${slices} = ${pct(perCup, slices)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 520 }}>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
          {title}
        </text>

        {phase <= 2 && <Pitcher ruled={phase >= 1} empty={phase === 2} />}

        {/* ---------------- phase 0: the fill level against the quarters ------------- */}
        {phase === 0 && (
          <g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <line x1={bodyX + bodyW + 46} y1={juiceTop} x2={bodyX + bodyW + 46} y2={yBot} stroke={JUICE_DEEP} strokeWidth={1.6} />
              <line x1={bodyX + bodyW + 41} y1={juiceTop} x2={bodyX + bodyW + 51} y2={juiceTop} stroke={JUICE_DEEP} strokeWidth={1.6} />
              <line x1={bodyX + bodyW + 41} y1={yBot} x2={bodyX + bodyW + 51} y2={yBot} stroke={JUICE_DEEP} strokeWidth={1.6} />
              <text x={bodyX + bodyW + 58} y={(juiceTop + yBot) / 2 + 4} fontSize="13" fontWeight="800" fill={JUICE_DEEP} fontFamily={numberFont}>
                {numer}/{den} {drink}
              </text>
            </motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
              <line x1={bodyX + bodyW + 46} y1={yTop} x2={bodyX + bodyW + 46} y2={juiceTop} stroke={DIM} strokeWidth={1.4} strokeDasharray="4 3" />
              <text x={bodyX + bodyW + 58} y={(yTop + juiceTop) / 2 + 4} fontSize="11" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                {den - numer}/{den} empty — but still part of the {vessel}
              </text>
            </motion.g>
          </g>
        )}

        {/* ------------- phase 1: the ruling that makes every share whole ------------- */}
        {phase === 1 && (
          <g>
            <motion.text
              x={352}
              y={90}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill={INK}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              each quarter splits into {slices / den}
            </motion.text>
            <motion.text
              x={352}
              y={124}
              textAnchor="middle"
              fontSize="16"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.5 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {den} × {slices / den} = {slices} slices
            </motion.text>
            <motion.text
              x={352}
              y={156}
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill={JUICE_DEEP}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.9 }}
            >
              the {drink} fills {juiceSlices} of them
            </motion.text>
            <motion.text
              x={352}
              y={186}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="700"
              fill={DIM}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1 }}
            >
              and {juiceSlices} splits {cups} ways evenly
            </motion.text>
          </g>
        )}

        {/* ---------------- phase 2: the slices fly into the cups ---------------- */}
        {phase === 2 && (
          <g>
            {Array.from({ length: cups }).map((_, i) => (
              <Cup key={i} x={cupX(i)} delay={0.1 + i * 0.06} />
            ))}
            {Array.from({ length: juiceSlices }).map((_, j) => {
              const cup = Math.floor(j / perCup);
              const idx = j % perCup;
              const home = { x: bodyX + bodyW / 2, y: sliceY(juiceSlices - 1 - j) };
              const dest = { x: cupX(cup), y: cupBot - (idx + 1) * bandH - 2 };
              return (
                <Slice
                  key={j}
                  x={dest.x}
                  y={dest.y}
                  w={cupW * 0.7}
                  fill={JUICE}
                  dx={home.x - dest.x}
                  dy={home.y - dest.y}
                  delay={0.5 + cup * 0.3 + idx * 0.1}
                />
              );
            })}
            {Array.from({ length: cups }).map((_, i) => (
              <motion.text
                key={`c${i}`}
                x={cupX(i)}
                y={cupBot - perCup * bandH - 8}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="800"
                fill={JUICE_DEEP}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 + i * 0.3 }}
              >
                {perCup}
              </motion.text>
            ))}
          </g>
        )}

        {/* ------- phase 3: the same 3 slices against two different wholes ------- */}
        {phase === 3 &&
          (() => {
            const colW = 66;
            const colBot = 226;
            const h = 150;
            const cols = [
              { label: `the ${vessel}`, whole: slices, x: 132, good: true, pctText: pct(perCup, slices), tag: problem.answer ?? "" },
              { label: `only the ${drink}`, whole: juiceSlices, x: 300, good: false, pctText: pct(perCup, juiceSlices), tag: choiceFor(juiceShare) ?? "" },
            ];
            return (
              <g>
                {cols.map((col, ci) => {
                  const unit = h / slices; // both columns drawn on one scale
                  return (
                    <g key={col.label}>
                      <rect
                        x={col.x - colW / 2}
                        y={colBot - col.whole * unit}
                        width={colW}
                        height={col.whole * unit}
                        fill="#f8fafc"
                        stroke={GLASS}
                        strokeWidth={1.6}
                      />
                      {Array.from({ length: col.whole }).map((_, i) => (
                        <motion.rect
                          key={i}
                          x={col.x - colW / 2 + 1}
                          y={colBot - (i + 1) * unit + 0.6}
                          width={colW - 2}
                          height={unit - 1.2}
                          fill={i < perCup ? JUICE : "#e2e8f0"}
                          stroke={i < perCup ? JUICE_DEEP : "none"}
                          strokeWidth={i < perCup ? 1 : 0}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + ci * 0.4 + i * 0.02 }}
                        />
                      ))}
                      <text x={col.x} y={colBot + 18} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK}>
                        {col.label}
                      </text>
                      <motion.text
                        x={col.x}
                        y={colBot - col.whole * unit - 22}
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="800"
                        fill={col.good ? WIN : BAD}
                        fontFamily={numberFont}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.2 + ci * 0.35 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      >
                        {perCup}/{col.whole} = {col.pctText}
                      </motion.text>
                      <motion.text
                        x={col.x}
                        y={colBot - col.whole * unit - 8}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="800"
                        fill={col.good ? WIN : BAD}
                        fontFamily={numberFont}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 + ci * 0.35 }}
                      >
                        {col.good ? "✓" : "✗"} {col.tag}
                      </motion.text>
                    </g>
                  );
                })}
                <motion.text
                  x={510}
                  y={110}
                  textAnchor="end"
                  fontSize="10.5"
                  fontWeight="700"
                  fill={WARN}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  same {perCup} slices —
                </motion.text>
                <motion.text
                  x={510}
                  y={126}
                  textAnchor="end"
                  fontSize="10.5"
                  fontWeight="700"
                  fill={WARN}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.1 }}
                >
                  different whole
                </motion.text>
                {slips.map((s, i) => (
                  <motion.text
                    key={s.label}
                    x={510}
                    y={158 + i * 20}
                    textAnchor="end"
                    fontSize="9.5"
                    fontWeight="700"
                    fill={DIM}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.3 + i * 0.18 }}
                  >
                    {s.label} {pct(s.v, 100)} — {s.why}
                  </motion.text>
                ))}
              </g>
            );
          })()}

        <motion.text
          key={`eq${phase}`}
          x={W / 2}
          y={286}
          textAnchor="middle"
          fontSize="15"
          fontWeight="800"
          fill={IND}
          fontFamily={numberFont}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: phase === 0 ? 1.6 : 1.8 }}
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
          ? `${numer}/${den} of the ${vessel} is ${drink}`
          : phase === 1
          ? `${slices} slices, ${juiceSlices} of them ${drink}`
          : phase === 2
          ? `${perCup} slices in every cup`
          : `each cup got ${pct(perCup, slices)} of the ${vessel}`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          {juiceSlices % cups !== 0
            ? `check failed: ${juiceSlices} slices do not split ${cups} ways`
            : `check failed: the ruler gives ${pct(perCup, slices)}, the stored answer is ${problem.shortAnswer}`}
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.7 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
