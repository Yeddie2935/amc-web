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
const TOKEN = ["#ef4444", "#3b82f6", "#a855f7", "#14b8a6"];

const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sup = (n: number) => String(n).split("").map((d) => SUP[+d]).join("");

/**
 * Split a number into a strictly increasing run of factors — every way of
 * writing it as `a < b < c`. The search looks open-ended but is **completely
 * bounded**, and the scene derives both bounds rather than trying divisors at
 * random: since `a` is the smallest, `a³ < abc`, so `a` is below the cube root
 * and must divide the product, which here leaves only three candidates; then for
 * each `a`, `b² < bc = product/a` puts `b` in a window whose ends are `a` and a
 * square root, and only the divisors *inside* that window can start a triple.
 * One candidate's window comes out empty, which is what makes the sweep visibly
 * finish rather than trail off. The closing beat draws each answer as a **deal of
 * the prime tokens into three boxes** — every row holds the same four tokens
 * arranged differently, so the factorisations are seen to be re-splittings of one
 * pile — and cross-checks the count a second way: all ordered factorisations,
 * minus those with a repeated entry, divided by the orderings of three distinct
 * things. Divisors, both bounds, every window, the triples and both counts are
 * computed, and the two routes must agree; data `{ product, parts? }`.
 */
export function FactorTripleScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const N = Math.max(2, Math.round(num(data.product, 100)));
  const parts = Math.max(2, Math.min(3, Math.round(num(data.parts, 3))));

  // ---- factorisation and divisors ----
  const primes: [number, number][] = [];
  let m = N;
  for (let p = 2; p * p <= m; p++) {
    let e = 0;
    while (m % p === 0) {
      m /= p;
      e++;
    }
    if (e) primes.push([p, e]);
  }
  if (m > 1) primes.push([m, 1]);
  const divs: number[] = [];
  for (let d = 1; d <= N; d++) if (N % d === 0) divs.push(d);

  /** The multiset of prime tokens making up a value. */
  const tokensOf = (v: number) => {
    const out: number[] = [];
    primes.forEach(([p], pi) => {
      let x = v;
      while (x % p === 0) {
        out.push(pi);
        x /= p;
      }
    });
    return out;
  };

  // ---- bound a by the cube root, then sweep ----
  const aCands = divs.filter((a) => Math.pow(a, parts) < N);
  const rows = aCands.map((a) => {
    const rest = N / a;
    const lim = Math.sqrt(rest);
    const bs = divs.filter((b) => b > a && rest % b === 0 && rest / b > b);
    return { a, rest, lim, bs, trips: bs.map((b) => [a, b, rest / b] as number[]) };
  });
  const triples = rows.flatMap((r) => r.trips);

  // ---- independent count: ordered factorisations minus the ones with a repeat ----
  let ordered = 0;
  let repeated = 0;
  for (const a of divs)
    for (const b of divs) {
      if (N % (a * b) !== 0) continue;
      const c = N / (a * b);
      if (!Number.isInteger(c) || c < 1) continue;
      ordered++;
      if (a === b || b === c || a === c) repeated++;
    }
  const distinct = ordered - repeated;
  const crossCheck = distinct / 6;
  const answerOk = problem.shortAnswer == null || String(triples.length) === String(problem.shortAnswer).trim();
  const ok = triples.length === crossCheck && answerOk && aCands.length > 0;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 264;

  const Token = ({ x, y, pi, r = 6 }: { x: number; y: number; pi: number; r?: number }) => (
    <g>
      <circle cx={x} cy={y} r={r} fill={TOKEN[pi % TOKEN.length]} fillOpacity={0.85} />
      <text x={x} y={y + r * 0.55} textAnchor="middle" fontSize={r * 1.35} fontWeight="800" fill="#fff" fontFamily={numberFont}>
        {primes[pi]?.[0]}
      </text>
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ================= phase 0: the prime tokens and the divisors ================= */}
        {phase === 0 && (
          <g>
            <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              every factor is built from the same pile of primes
            </text>
            <motion.text
              x={W / 2}
              y={56}
              textAnchor="middle"
              fontSize="19"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {N} = {primes.map(([p, e]) => `${p}${e > 1 ? sup(e) : ""}`).join(" × ")}
            </motion.text>

            {/* the tokens flying out of the number */}
            {(() => {
              const all = primes.flatMap(([, e], pi) => Array.from({ length: e }, () => pi));
              return all.map((pi, i) => (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, x: 0, y: -28 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.6 + i * 0.12 }}
                >
                  <Token x={W / 2 - ((all.length - 1) * 30) / 2 + i * 30} y={92} pi={pi} r={11} />
                </motion.g>
              ));
            })()}
            <motion.text x={W / 2} y={122} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              a triple shares these {primes.reduce((s, [, e]) => s + e, 0)} tokens between three boxes
            </motion.text>

            {/* the divisor ladder */}
            <motion.text x={W / 2} y={158} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
              so each of a, b, c is one of the {divs.length} divisors
            </motion.text>
            {divs.map((d, i) => (
              <motion.g
                key={d}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 16, delay: 1.6 + i * 0.08 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <rect x={30 + i * 46} y={176} width={40} height={26} rx={6} fill="#eef2ff" stroke={IND} strokeWidth={1.2} />
                <text x={50 + i * 46} y={194} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                  {d}
                </text>
              </motion.g>
            ))}
            <motion.text x={W / 2} y={230} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}>
              but they have to come in strictly increasing order, which cuts the list down fast
            </motion.text>
          </g>
        )}

        {/* ================= phase 1: the cube-root bound on a ================= */}
        {phase === 1 && (
          <g>
            <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              a is the smallest, so a × a × a is less than a × b × c = {N}
            </text>
            {divs.slice(0, 6).map((d, i) => {
              const cube = Math.pow(d, parts);
              const alive = cube < N;
              const x = 44 + i * 68;
              const h = Math.min(110, (cube / N) * 78);
              return (
                <motion.g
                  key={d}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.22 }}
                >
                  <motion.rect
                    x={x}
                    y={178 - h}
                    width={44}
                    height={h}
                    rx={4}
                    fill={alive ? WIN : BAD}
                    fillOpacity={0.28}
                    stroke={alive ? WIN : BAD}
                    strokeWidth={1.4}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.3 + i * 0.22 }}
                    style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
                  />
                  <text x={x + 22} y={192} textAnchor="middle" fontSize="11" fontWeight="800" fill={alive ? WIN : BAD} fontFamily={numberFont}>
                    {d}
                  </text>
                  <text x={x + 22} y={206} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                    {cube.toLocaleString()}
                  </text>
                </motion.g>
              );
            })}
            <motion.line
              x1={30}
              y1={100}
              x2={W - 30}
              y2={100}
              stroke={INK}
              strokeWidth={1.6}
              strokeDasharray="5 3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            />
            <text x={W - 26} y={95} textAnchor="end" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {N}
            </text>
            <text x={30} y={44} fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              a{sup(parts)} for each divisor a
            </text>
            <motion.text
              x={W / 2}
              y={230}
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.8 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              only a = {aCands.join(", ")} can start a triple
            </motion.text>
            <motion.text x={W / 2} y={250} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
              every larger divisor already overshoots on its own
            </motion.text>
          </g>
        )}

        {/* ================= phase 2: sweep a, with b squeezed into a window ================= */}
        {phase === 2 && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              for each a, b must beat a and stay under √(bc) — a finite window
            </text>
            {rows.map((r, i) => {
              const y = 52 + i * 62;
              // the divisors of what is left, evenly spaced — a log axis collides 4 with 5
              const slots = divs.filter((d) => r.rest % d === 0);
              const ax0 = 152;
              const ax1 = 430;
              const pitch = slots.length > 1 ? (ax1 - ax0) / (slots.length - 1) : 0;
              const X = (idx: number) => ax0 + idx * pitch;
              let lastLow = 0;
              slots.forEach((d, k) => {
                if (d <= r.a) lastLow = k;
              });
              const firstHigh = slots.findIndex((d) => d >= r.lim);
              const wx0 = X(lastLow + 0.5);
              const wx1 = X((firstHigh < 0 ? slots.length - 1 : firstHigh) - 0.5);
              return (
                <motion.g
                  key={r.a}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 + i * 0.45 }}
                >
                  <text x={16} y={y + 4} fontSize="12" fontWeight="800" fill={IND} fontFamily={numberFont}>
                    a = {r.a}
                  </text>
                  <text x={16} y={y + 18} fontSize="9" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                    b·c = {r.rest}
                  </text>
                  <rect
                    x={wx0}
                    y={y - 13}
                    width={Math.max(16, wx1 - wx0)}
                    height={28}
                    rx={6}
                    fill={r.bs.length ? "#dcfce7" : "#fee2e2"}
                    stroke={r.bs.length ? WIN : BAD}
                    strokeWidth={1.3}
                    strokeDasharray={r.bs.length ? undefined : "4 3"}
                  />
                  <text
                    x={wx0 + Math.max(16, wx1 - wx0) / 2}
                    y={y - 18}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="800"
                    fill={r.bs.length ? WIN : BAD}
                    fontFamily={numberFont}
                  >
                    {r.a} &lt; b &lt; {Number(r.lim.toFixed(2))}
                  </text>
                  {slots.map((d, k) => {
                    const good = r.bs.includes(d);
                    return (
                      <motion.g
                        key={d}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.5 + i * 0.45 + k * 0.05 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      >
                        <circle cx={X(k)} cy={y + 1} r={good ? 11 : 8} fill={good ? WIN : "#fff"} stroke={good ? WIN : DIM} strokeWidth={1.2} />
                        <text
                          x={X(k)}
                          y={y + 4}
                          textAnchor="middle"
                          fontSize={good ? 9 : 7.5}
                          fontWeight="800"
                          fill={good ? "#fff" : DIM}
                          fontFamily={numberFont}
                        >
                          {d}
                        </text>
                      </motion.g>
                    );
                  })}
                  <motion.text
                    x={16}
                    y={y + 36}
                    fontSize="9.5"
                    fontWeight="800"
                    fill={r.trips.length ? WIN : BAD}
                    fontFamily={numberFont}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 + i * 0.45 }}
                  >
                    {r.trips.length ? r.trips.map((t) => `(${t.join(",")})`).join("  ") : "no divisor fits — nothing here"}
                  </motion.text>
                </motion.g>
              );
            })}
            <motion.text
              x={W / 2}
              y={244}
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              {rows.map((r) => r.trips.length).join(" + ")} = {triples.length}
            </motion.text>
          </g>
        )}

        {/* ================= phase 3: the deals, and a second count ================= */}
        {phase === 3 && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              the same {primes.reduce((s, [, e]) => s + e, 0)} tokens, shared out {triples.length} different ways
            </text>
            {triples.map((t, i) => {
              const y = 44 + i * 42;
              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 + i * 0.28 }}
                >
                  <text x={16} y={y + 21} fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    ({t.join(", ")})
                  </text>
                  {t.map((v, k) => {
                    const toks = tokensOf(v);
                    const bx = 116 + k * 62;
                    return (
                      <g key={k}>
                        <rect x={bx} y={y} width={54} height={30} rx={6} fill="#f8fafc" stroke={DIM} strokeWidth={1.1} />
                        {toks.length === 0 ? (
                          <text x={bx + 27} y={y + 20} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                            empty
                          </text>
                        ) : (
                          toks.map((pi, ti) => (
                            <motion.g
                              key={ti}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.45 + i * 0.28 + ti * 0.07 }}
                              style={{ transformBox: "fill-box", transformOrigin: "center" }}
                            >
                              <Token x={bx + 27 - ((toks.length - 1) * 15) / 2 + ti * 15} y={y + 15} pi={pi} r={6.5} />
                            </motion.g>
                          ))
                        )}
                      </g>
                    );
                  })}
                </motion.g>
              );
            })}

            {/* the second count */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
              <line x1={20} y1={218} x2={W - 20} y2={218} stroke="#e2e8f0" strokeWidth={1.3} />
              <text x={20} y={236} fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                counting another way: {ordered} ordered triples − {repeated} with a repeat
              </text>
              <text x={20} y={252} fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                = {distinct}, and each set of three distinct factors was counted 6 times → {crossCheck}
              </text>
            </motion.g>
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
          ? `${N} = ${primes.map(([p, e]) => `${p}${e > 1 ? sup(e) : ""}`).join(" × ")}, with ${divs.length} divisors`
          : phase === 1
          ? `a³ < ${N} leaves only ${aCands.length} candidates`
          : phase === 2
          ? `the ${aCands[aCands.length - 1]} window is empty, so the search is finished`
          : `${triples.length} ways`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed: listed {triples.length}, counted {crossCheck}
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
