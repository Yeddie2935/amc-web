import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const PLUS = "#16a34a";
const MINUS = "#dc2626";
const MARK = "#4338ca";
const WIN = "#16a34a";
const MUTE = "#94a3b8";
const CARD = "#eef2ff";

const W = 360;
const H = 204;
const ROW = 66; // top of the card row
const CH = 38;

const tidy = (v: number) => String(Number(v.toFixed(4)));

/** A squared bracket spanning x1..x2, arms pointing toward the cards. */
function Bracket({ x1, x2, y, up, color }: { x1: number; x2: number; y: number; up: boolean; color: string }) {
  const a = up ? 7 : -7;
  return <path d={`M ${x1} ${y + a} L ${x1} ${y} L ${x2} ${y} L ${x2} ${y + a}`} fill="none" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />;
}

/**
 * A row of numbers with **overlapping pair averages**, asking for something no
 * single pair mentions. The individual numbers are not determined — one free
 * parameter runs through the whole row — so grinding for them is a dead end; the
 * question is answerable only because the wanted combination is what survives
 * when the given pairs are added and subtracted.
 * The scene makes that a covering picture rather than algebra: the pairs are
 * drawn as brackets over the row, and they split by *parity* into two families
 * that never overlap — the odd-numbered pairs tile **every** slot exactly once,
 * and the even-numbered ones tile exactly the **interior** slots once. So adding
 * the first family and subtracting the second leaves a net count of 1 on the two
 * ends and 0 everywhere between, which the scene prints as a per-slot ledger
 * (`1 − 0 = 1`, `1 − 1 = 0`, …) rather than asserting the cancellation.
 * The closing beat is the point of the whole problem: three different rows are
 * built from three different starting values, every entry visibly different, and
 * the two ends still add to the same total every time.
 * Sums, the two families, the per-slot coverage, the total and the sample rows
 * are all computed, the coverage is checked to be 1,0,…,0,1, and the answer is
 * checked against the stored one.
 * Data: { averages: [21, 26, 30], labels? }.
 */
export function OverlapPairsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const averages = (Array.isArray(data.averages) ? data.averages : []).map((v) => Number(v)).filter((v) => Number.isFinite(v));
  const k = averages.length;
  const n = k + 1;
  const sums = averages.map((a) => 2 * a);
  const labels = (Array.isArray(data.labels) ? data.labels : []).map((s) => String(s));
  const nameOf = (i: number) => labels[i] ?? ["1st", "2nd", "3rd", "4th", "5th", "6th"][i] ?? `#${i + 1}`;

  // pairs alternate: the odd-numbered ones tile everything, the even ones the middle
  const plus = averages.map((_, i) => i).filter((i) => i % 2 === 0);
  const minus = averages.map((_, i) => i).filter((i) => i % 2 === 1);
  const cover = Array.from({ length: n }, (_, s) => {
    const p = plus.filter((i) => i === s || i + 1 === s).length;
    const m = minus.filter((i) => i === s || i + 1 === s).length;
    return { p, m, net: p - m };
  });
  const coverOk = cover.every((c, i) => c.net === (i === 0 || i === n - 1 ? 1 : 0));

  const total = plus.reduce((a, i) => a + sums[i], 0);
  const middle = minus.reduce((a, i) => a + sums[i], 0);
  const endsSum = total - middle;
  const result = endsSum / 2;

  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value));
  const winner = opts.find((o) => Math.abs(o.value - result) < 1e-9);
  const agrees = !problem.answer || winner?.label === problem.answer;

  // the row is one free parameter wide: pick the first entry, the rest follow
  const rowFor = (t: number) => {
    const v = [t];
    for (let i = 0; i < k; i++) v.push(sums[i] - v[i]);
    return v;
  };
  const okT: number[] = [];
  for (let t = 1; t <= Math.max(...sums, 1); t++) if (rowFor(t).every((x) => x > 0)) okT.push(t);
  const samples = [0.25, 0.5, 0.75]
    .map((f) => okT[Math.floor(f * (okT.length - 1))])
    .filter((t, i, arr) => t != null && arr.indexOf(t) === i)
    .map(rowFor);

  const pitch = Math.min(62, 300 / n);
  const cw = pitch - 10;
  const x0 = W / 2 - (n * pitch - (pitch - cw)) / 2;
  const cx = (i: number) => x0 + i * pitch;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const preSteps = Math.max(1, totalSteps - 1);
  const showSums = !isFinal && step === 0;
  const showPlus = !isFinal && step >= 1;
  const showMinus = !isFinal && step >= Math.max(1, preSteps - 1);

  const caption = isFinal
    ? `the row is never pinned down, but ${nameOf(0)} + ${nameOf(n - 1)} is always ${endsSum}`
    : showSums
    ? `each average doubles into a pair sum: ${averages.map((a, i) => `${a} → ${sums[i]}`).join(", ")}`
    : !showMinus
    ? `the ${plus.length} outer brackets cover every number exactly once: ${plus.map((i) => sums[i]).join(" + ")} = ${total}`
    : `taking the middle bracket away cancels the inner numbers: ${total} − ${middle} = ${endsSum}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {isFinal ? (
          <g>
            <motion.text
              x={W / 2}
              y={40}
              textAnchor="middle"
              fontSize="17"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.2 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {endsSum} ÷ 2 = {result}
            </motion.text>

            {/* three genuinely different rows, one invariant */}
            {samples.map((row, r) => {
              const mw = Math.min(38, 200 / n);
              const mx0 = 30;
              return (
                <motion.g
                  key={r}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.7 + r * 0.35 }}
                >
                  {row.map((v, i) => {
                    const end = i === 0 || i === n - 1;
                    return (
                      <g key={i}>
                        <rect
                          x={mx0 + i * (mw + 4)}
                          y={66 + r * 40}
                          width={mw}
                          height={26}
                          rx={4}
                          fill={end ? "#dcfce7" : CARD}
                          stroke={end ? WIN : "#c7d2fe"}
                          strokeWidth={1.3}
                        />
                        <text
                          x={mx0 + i * (mw + 4) + mw / 2}
                          y={84 + r * 40}
                          textAnchor="middle"
                          fontSize="12"
                          fontWeight="800"
                          fill={end ? WIN : MARK}
                          fontFamily={numberFont}
                        >
                          {tidy(v)}
                        </text>
                      </g>
                    );
                  })}
                  <text x={mx0 + n * (mw + 4) + 10} y={84 + r * 40} fontSize="11" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                    {tidy(row[0])} + {tidy(row[n - 1])} = {endsSum}
                  </text>
                </motion.g>
              );
            })}
            <motion.text
              x={W / 2}
              y={66 + samples.length * 40 + 14}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="700"
              fill={MUTE}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + samples.length * 0.35 }}
            >
              every entry changes; the two ends always add to {endsSum}
            </motion.text>
          </g>
        ) : (
          <g>
            {/* the row */}
            {Array.from({ length: n }).map((_, i) => {
              const dropped = showMinus && cover[i].net === 0;
              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: dropped ? 0.3 : 1, y: dropped ? 8 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 + i * 0.07 }}
                >
                  <rect x={cx(i)} y={ROW} width={cw} height={CH} rx={5} fill={CARD} stroke="#c7d2fe" strokeWidth={1.4} />
                  <text x={cx(i) + cw / 2} y={ROW + 24} textAnchor="middle" fontSize="13" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                    {nameOf(i)}
                  </text>
                </motion.g>
              );
            })}

            {/* the pairs, split by parity so the two families never overlap */}
            {averages.map((a, i) => {
              const isPlus = i % 2 === 0;
              const shown = isPlus ? true : showMinus;
              const lit = isPlus ? showPlus : showMinus;
              const yB = isPlus ? ROW - 12 : ROW + CH + 12;
              const color = !lit ? MUTE : isPlus ? PLUS : MINUS;
              return (
                <AnimatePresence key={i}>
                  {shown && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: isPlus ? 0.4 + i * 0.12 : 0.3 }}>
                      <Bracket x1={cx(i)} x2={cx(i + 1) + cw} y={yB} up={isPlus} color={color} />
                      <text
                        x={(cx(i) + cx(i + 1) + cw) / 2}
                        y={isPlus ? yB - 16 : yB + 26}
                        textAnchor="middle"
                        fontSize="12.5"
                        fontWeight="800"
                        fill={color}
                        fontFamily={numberFont}
                      >
                        {sums[i]}
                      </text>
                      <motion.text
                        x={(cx(i) + cx(i + 1) + cw) / 2}
                        y={isPlus ? yB - 5 : yB + 15}
                        textAnchor="middle"
                        fontSize="8.5"
                        fontWeight="700"
                        fill={MUTE}
                        fontFamily={numberFont}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.12 }}
                      >
                        avg {a} × 2
                      </motion.text>
                    </motion.g>
                  )}
                </AnimatePresence>
              );
            })}

            {/* the ledger: how many brackets land on each slot, net */}
            <AnimatePresence>
              {showPlus && (
                <motion.g key="cov" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {cover.map((c, i) => (
                    <motion.text
                      key={i}
                      x={cx(i) + cw / 2}
                      y={172}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="800"
                      fill={showMinus ? (c.net ? PLUS : MINUS) : PLUS}
                      fontFamily={numberFont}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 240, damping: 16, delay: (showMinus ? 0.7 : 0.9) + i * 0.1 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      {showMinus ? `${c.p} − ${c.m} = ${c.net}` : `+${c.p}`}
                    </motion.text>
                  ))}
                  <text x={W / 2} y={158} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                    brackets landing on each number
                  </text>
                </motion.g>
              )}
            </AnimatePresence>

            {/* the running arithmetic */}
            <AnimatePresence mode="wait">
              <motion.g key={showMinus ? "m" : showPlus ? "p" : "s"} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                {showMinus ? (
                  <text x={W / 2} y={192} textAnchor="middle" fontSize="13" fontWeight="800" fill={MINUS} fontFamily={numberFont}>
                    {total} − {middle} = {endsSum} = {nameOf(0)} + {nameOf(n - 1)}
                  </text>
                ) : showPlus ? (
                  <text x={W / 2} y={192} textAnchor="middle" fontSize="13" fontWeight="800" fill={PLUS} fontFamily={numberFont}>
                    {plus.map((i) => sums[i]).join(" + ")} = {total} = every number once
                  </text>
                ) : (
                  <text x={W / 2} y={192} textAnchor="middle" fontSize="11" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                    a pair averaging {averages[0]} is a pair adding to {sums[0]}
                  </text>
                )}
              </motion.g>
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
            transition={{ delay: 2.4 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && coverOk ? MUTE : MINUS, textAlign: "center" }}
          >
            {!coverOk
              ? `these brackets do not cancel to the two ends — coverage ${cover.map((c) => c.net).join(",")}`
              : !agrees
              ? `this lands on ${result}, not the stored answer`
              : `the ${minus.length === 1 ? "middle bracket takes" : "middle brackets take"} the inner numbers out exactly once each`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
