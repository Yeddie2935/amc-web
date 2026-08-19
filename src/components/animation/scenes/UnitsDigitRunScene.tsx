import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const LIVE = "#16a34a";
const DEAD = "#dc2626";
const MUTE = "#94a3b8";
const CARD = "#eef2ff";

const W = 360;
const H = 210;
const SY = 52; // strip top
const SH = 38;

const tidy = (v: number) => String(Number(v.toFixed(4)));

/**
 * A sum of a thousand growing products, asking only for its **units digit**.
 * The sum cannot be computed and does not need to be: each term is built from
 * the one before by one more factor, so its units digit is the previous units
 * digit times that factor — and the moment a factor ending in 0 joins the chain,
 * the units digit is 0 and can never come back, because every later term keeps
 * that same factor. So the tail of the sum contributes nothing at all and only a
 * short head is live.
 * The scene derives that rather than asserting it: it runs the units digit
 * forward across every term, finds where it dies, checks it never revives, and
 * reports how many terms were killed (1007 of 1011 here). The beats build one
 * term factor by factor with its running product, lay the head out with each
 * units digit read off, blow the first dead term open so the factor ending in 0
 * is visible inside it while a `0` stamp sweeps down the whole tail, then drop
 * the survivors into a column sum. The closing beat prices both off-by-one slips
 * on the live range — dropping the first survivor or the last — and names the
 * answer choices they hit.
 * Data: { first, step, last }.
 */
export function UnitsDigitRunScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const first = Math.round(num(data.first, 2));
  const stepBy = Math.max(1, Math.round(num(data.step, 2)));
  const lastN = Math.round(num(data.last, 2022));
  const count = Math.max(1, Math.floor((lastN - first) / stepBy) + 1);
  const nOf = (k: number) => first + k * stepBy;

  // the units digit of each term, carried forward one factor at a time
  const units: number[] = [];
  let u = 1;
  for (let k = 0; k < count; k++) {
    u = (u * (nOf(k) % 10)) % 10;
    units.push(u);
  }
  // exact values, kept only while they stay readable
  const exact: (number | null)[] = [];
  let prod = 1;
  for (let k = 0; k < count; k++) {
    prod *= nOf(k);
    exact.push(prod <= 1e12 ? prod : null);
  }

  const live = units.map((v, k) => ({ v, k })).filter((t) => t.v !== 0);
  const firstDead = units.findIndex((v) => v === 0);
  const staysDead = firstDead >= 0 && units.slice(firstDead).every((v) => v === 0);
  const deadCount = count - live.length;
  const liveSum = live.reduce((a, t) => a + t.v, 0);
  const result = liveSum % 10;

  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value));
  const choiceFor = (v: number) => opts.find((o) => o.value === v);
  const winner = choiceFor(result);
  const agrees = !problem.answer || winner?.label === problem.answer;
  const slips = [
    { why: `missing the first term`, v: (liveSum - live[0].v) % 10 },
    { why: `stopping one term early`, v: (liveSum - live[live.length - 1].v) % 10 },
  ]
    .map((s) => ({ ...s, choice: choiceFor(s.v) }))
    .filter((s) => s.choice && s.v !== result);

  // the strip: every live term, the first dead one, an ellipsis, the last term
  const strip = [...live.map((t) => t.k), ...(firstDead >= 0 ? [firstDead] : []), -1, count - 1];
  const pitch = Math.min(50, (W - 24) / strip.length);
  const cwid = pitch - 5;
  const sx = (i: number) => (W - strip.length * pitch) / 2 + i * pitch;

  // the worked example is the problem's own: the last term that still lives
  const exK = live[live.length - 1].k;
  const exFactors = Array.from({ length: exK + 1 }, (_, i) => nOf(i));
  const exRunning = exFactors.map((_, i) => exact[i]);

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const preSteps = Math.max(1, totalSteps - 1);
  const showBuild = !isFinal && beat === 0;
  const showKill = !isFinal && beat >= Math.max(1, preSteps - 1);
  const killed = isFinal || showKill; // the tail stays struck out on the final beat

  const caption = isFinal
    ? `${live.map((t) => t.v).join(" + ")} = ${liveSum}, so the sum ends in ${result}`
    : showBuild
    ? `${nOf(exK)}!! multiplies every even number up to ${nOf(exK)}: ${exFactors.join(" · ")} = ${exact[exK]}`
    : !showKill
    ? `only ${live.length} terms have a units digit at all: ${live.map((t) => t.v).join(", ")}`
    : `${nOf(firstDead)}!! contains the factor 10, and so does every term after it — ${deadCount} of them end in 0`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {showBuild ? (
          <g>
            <text x={W / 2} y={30} textAnchor="middle" fontSize="10" fontWeight="800" fill={MARK} fontFamily={numberFont}>
              multiply the even numbers, one at a time
            </text>
            {exFactors.map((f, i) => {
              const fw = Math.min(38, 300 / exFactors.length);
              const fp = fw + 12;
              const fx = W / 2 - (exFactors.length * fp - 12) / 2 + i * fp;
              return (
                <g key={i}>
                  <motion.g
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 17, delay: 0.2 + i * 0.35 }}
                  >
                    <rect x={fx} y={56} width={fw} height={30} rx={5} fill={CARD} stroke="#c7d2fe" strokeWidth={1.4} />
                    <text x={fx + fw / 2} y={77} textAnchor="middle" fontSize="14" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                      {f}
                    </text>
                  </motion.g>
                  {i > 0 && (
                    <text x={fx - 6} y={77} textAnchor="middle" fontSize="11" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                      ·
                    </text>
                  )}
                  {/* the running product after this factor joins */}
                  <motion.g
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.45 + i * 0.35 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <line x1={fx + fw / 2} y1={88} x2={fx + fw / 2} y2={100} stroke={MUTE} strokeWidth={1.1} />
                    <text x={fx + fw / 2} y={116} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                      {exRunning[i]}
                    </text>
                  </motion.g>
                </g>
              );
            })}
            <motion.g
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.6 + exFactors.length * 0.35 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <text x={W / 2} y={158} textAnchor="middle" fontSize="15" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {nOf(exK)}!! = {exact[exK]}
              </text>
              <rect x={W / 2 + 30} y={168} width={22} height={22} rx={5} fill="#dcfce7" stroke={LIVE} strokeWidth={1.5} />
              <text x={W / 2 + 41} y={184} textAnchor="middle" fontSize="13" fontWeight="800" fill={LIVE} fontFamily={numberFont}>
                {units[exK]}
              </text>
              <text x={W / 2 + 24} y={184} textAnchor="end" fontSize="9.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                units digit
              </text>
            </motion.g>
          </g>
        ) : (
          <g>
            <text x={W / 2} y={30} textAnchor="middle" fontSize="10" fontWeight="800" fill={MARK} fontFamily={numberFont}>
              {count} terms: {first}!! + {nOf(1)}!! + ⋯ + {lastN}!!
            </text>

            {/* the strip of terms */}
            {strip.map((k, i) => {
              const isGap = k < 0;
              const dead = !isGap && units[k] === 0;
              const revealed = isGap || !dead || killed;
              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.15 + i * 0.08 }}
                >
                  {!isGap && (
                    <rect
                      x={sx(i)}
                      y={SY}
                      width={cwid}
                      height={SH}
                      rx={5}
                      fill={dead && killed ? "#fef2f2" : CARD}
                      stroke={dead && killed ? DEAD : "#c7d2fe"}
                      strokeWidth={1.4}
                      strokeDasharray={dead && !killed ? "4 3" : undefined}
                    />
                  )}
                  <text
                    x={sx(i) + cwid / 2}
                    y={SY + 15}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="800"
                    fill={isGap ? MUTE : dead && killed ? DEAD : MARK}
                    fontFamily={numberFont}
                  >
                    {isGap ? "⋯" : `${nOf(k)}!!`}
                  </text>
                  {!isGap && revealed && (
                    <text
                      x={sx(i) + cwid / 2}
                      y={SY + 30}
                      textAnchor="middle"
                      fontSize={dead ? 9 : 11}
                      fontWeight="800"
                      fill={dead ? DEAD : INK}
                      fontFamily={numberFont}
                    >
                      {dead ? "…0" : exact[k]}
                    </text>
                  )}
                </motion.g>
              );
            })}

            {/* the units digit under each term */}
            {strip.map((k, i) => {
              if (k < 0) return null;
              const dead = units[k] === 0;
              if (dead && !killed) return null;
              return (
                <motion.g
                  key={`u-${i}`}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 16, delay: (dead ? 0.9 : 0.5) + i * 0.1 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <rect
                    x={sx(i) + cwid / 2 - 11}
                    y={SY + SH + 6}
                    width={22}
                    height={20}
                    rx={5}
                    fill={dead ? "#fef2f2" : "#dcfce7"}
                    stroke={dead ? DEAD : LIVE}
                    strokeWidth={1.4}
                  />
                  <text
                    x={sx(i) + cwid / 2}
                    y={SY + SH + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="800"
                    fill={dead ? DEAD : LIVE}
                    fontFamily={numberFont}
                  >
                    {units[k]}
                  </text>
                </motion.g>
              );
            })}
            <text x={W / 2} y={SY + SH + 40} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
              units digit of each term
            </text>

            {/* why the tail dies, then what the head adds to */}
            <AnimatePresence mode="wait">
              {isFinal ? (
                <motion.g key="sum" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {live.map((t, i) => {
                    const from = sx(i) + cwid / 2;
                    const to = W / 2 - (live.length * 26) / 2 + i * 26 + 13;
                    return (
                      <motion.g
                        key={t.k}
                        initial={{ x: from - to, y: SY + SH + 16 - 168, opacity: 0 }}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 110, damping: 17, delay: 0.4 + i * 0.18 }}
                      >
                        <text x={to} y={168} textAnchor="middle" fontSize="15" fontWeight="800" fill={LIVE} fontFamily={numberFont}>
                          {t.v}
                        </text>
                        {i < live.length - 1 && (
                          <text x={to + 13} y={168} textAnchor="middle" fontSize="11" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                            +
                          </text>
                        )}
                      </motion.g>
                    );
                  })}
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                    <text x={W / 2 + (live.length * 26) / 2 + 12} y={168} fontSize="15" fontWeight="800" fill={INK} fontFamily={numberFont}>
                      = {liveSum}
                    </text>
                  </motion.g>
                  <motion.g
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.6 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <text x={W / 2} y={194} textAnchor="middle" fontSize="13" fontWeight="800" fill={LIVE} fontFamily={numberFont}>
                      {liveSum} ends in {result}
                    </text>
                  </motion.g>
                </motion.g>
              ) : showKill ? (
                <motion.g key="kill" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <text x={W / 2} y={150} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                    inside {nOf(firstDead)}!!
                  </text>
                  {Array.from({ length: firstDead + 1 }).map((_, i) => {
                    const fw = 26;
                    const fp = fw + 10;
                    const fx = W / 2 - ((firstDead + 1) * fp - 10) / 2 + i * fp;
                    const tens = nOf(i) % 10 === 0;
                    return (
                      <motion.g
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.3 + i * 0.12 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      >
                        <rect x={fx} y={158} width={fw} height={24} rx={4} fill={tens ? "#fef2f2" : "#fff"} stroke={tens ? DEAD : "#cbd5e1"} strokeWidth={tens ? 1.8 : 1.2} />
                        <text x={fx + fw / 2} y={175} textAnchor="middle" fontSize="11" fontWeight="800" fill={tens ? DEAD : INK} fontFamily={numberFont}>
                          {nOf(i)}
                        </text>
                      </motion.g>
                    );
                  })}
                  <motion.text
                    x={W / 2}
                    y={198}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    fill={DEAD}
                    fontFamily={numberFont}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + firstDead * 0.12 }}
                  >
                    every later term keeps that 10 — {deadCount} terms end in 0
                  </motion.text>
                </motion.g>
              ) : (
                <motion.g key="head" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <text x={W / 2} y={166} textAnchor="middle" fontSize="10" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                    the rest are not worked out yet
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </g>
        )}
      </svg>

      <motion.span
        key={beat}
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
            transition={{ delay: 2 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && staysDead ? MUTE : DEAD, textAlign: "center" }}
          >
            {!staysDead
              ? `the units digit comes back after ${nOf(firstDead)}!!, so the tail cannot be dropped`
              : !agrees
              ? `this ends in ${result}, not the stored answer`
              : slips.length
              ? slips.map((s) => `${s.why} gives ${tidy(s.v)} = (${s.choice!.label})`).join("; ")
              : `${live.length} live terms out of ${count}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: LIVE, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
