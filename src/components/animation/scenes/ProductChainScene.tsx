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

const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const SUB = "₀₁₂₃₄₅₆₇₈₉";
const sup = (n: number) => String(n).split("").map((d) => SUP[+d]).join("");
const sub = (n: number) => String(n).split("").map((d) => SUB[+d]).join("");
const power = (base: string, e: number) => (e === 0 ? "" : e === 1 ? base : base + sup(e));
const monomial = (ea: number, eb: number, A = "A", B = "B") => power(A, ea) + power(B, eb) || "1";

const factorise = (n: number) => {
  const f: [number, number][] = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    let e = 0;
    while (m % p === 0) {
      m /= p;
      e++;
    }
    if (e) f.push([p, e]);
  }
  if (m > 1) f.push([m, 1]);
  return f;
};

/**
 * A sequence where each term is the **product** of the previous two, with one
 * later term given and the first one wanted. Working forward blindly is hopeless
 * because the terms explode, and the unlock is that multiplying terms *adds*
 * their exponents — so writing everything in terms of the first two, the
 * exponents of A and B march up the **Fibonacci numbers** (A: 1,0,1,1,2,3 and
 * B: 0,1,1,2,3,5), and the given term is `A³B⁵`. Factorising it then has to
 * produce exactly those two exponents, which pins each prime to a slot: the
 * prime carrying the exponent 5 must be B and the one carrying 3 must be A — so
 * the answer is the prime with the *smaller* exponent, and swapping them is the
 * classic error (worth 25000 instead of 4000, and normally an answer choice,
 * whose letter the scene finds). Beats: the chain built term by term with each
 * new box fed by two arcs, one from each of its parents; the same arcs re-read
 * as **addition** on an exponent table, with the Fibonacci run called out; the
 * factorisation matched slot by slot with the swap struck through; then the
 * real numbers poured back down the chain to land on the target. All pairs
 * `(A, B)` with `A^ea · B^eb = target` are enumerated, so both the solution and
 * its uniqueness are discovered, and the rebuilt sequence is re-multiplied as a
 * check; data `{ length, target }`.
 */
export function ProductChainScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(3, Math.min(9, Math.round(num(data.length, 6))));
  const target = Math.max(2, Math.round(num(data.target, 4000)));

  // ---- exponents: multiplying terms adds them, so they run Fibonacci ----
  const ea = [1, 0];
  const eb = [0, 1];
  for (let i = 2; i < n; i++) {
    ea.push(ea[i - 1] + ea[i - 2]);
    eb.push(eb[i - 1] + eb[i - 2]);
  }
  const EA = ea[n - 1];
  const EB = eb[n - 1];

  // ---- every (A, B) with A^EA · B^EB = target ----
  const sols: { A: number; B: number }[] = [];
  for (let A = 1; A <= target; A++) {
    if (target % A) continue;
    const pa = Math.pow(A, EA);
    if (pa > target || target % pa !== 0) continue;
    const r = target / pa;
    let B = 1;
    while (Math.pow(B, EB) < r) B++;
    if (Math.pow(B, EB) === r) sols.push({ A, B });
  }
  const best = sols[0] ?? { A: 0, B: 0 };

  // the sequence, rebuilt and re-multiplied as a check
  const seq: number[] = [best.A, best.B];
  for (let i = 2; i < n; i++) seq.push(seq[i - 1] * seq[i - 2]);
  const rebuiltOk = seq[n - 1] === target;

  const primes = factorise(target);
  const swapped = primes.length === 2 ? Math.pow(best.B, EA) * Math.pow(best.A, EB) : 0;
  const swapChoice = (problem.choices ?? []).find((c) => Number(String(c.text).replace(/[^\d]/g, "")) === best.B);

  const answerOk = problem.shortAnswer == null || String(best.A) === String(problem.shortAnswer);
  const ok = sols.length === 1 && rebuiltOk && answerOk;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 250;

  // ---- chain geometry ----
  const bw = 58;
  const pitch = 68;
  const x0 = 56;
  const bx = (i: number) => x0 + i * pitch;
  const bcx = (i: number) => bx(i) + bw / 2;
  const by = 108;
  const bh = 36;

  const upArc = (i: number) => {
    const x1 = bcx(i - 2);
    const x2 = bcx(i);
    return { d: `M ${x1},${by} Q ${(x1 + x2) / 2},${by - 68} ${x2},${by}`, mx: (x1 + x2) / 2, my: by - 34, x2 };
  };
  const downArc = (i: number) => {
    const x1 = bcx(i - 1);
    const x2 = bcx(i);
    return { d: `M ${x1},${by + bh} Q ${(x1 + x2) / 2},${by + bh + 40} ${x2},${by + bh}`, mx: (x1 + x2) / 2, my: by + bh + 20, x2 };
  };

  const showChain = phase === 0 || phase === 1 || phase === 3;
  const op = phase === 1 ? "+" : "×";

  const Boxes = ({ label, fill }: { label: (i: number) => string; fill: (i: number) => string }) => (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <motion.g
          key={`b${i}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 16, delay: i < 2 ? 0.1 + i * 0.12 : 0.45 + (i - 2) * 0.4 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <rect x={bx(i)} y={by} width={bw} height={bh} rx={7} fill={fill(i)} stroke={i === n - 1 && phase === 3 ? WIN : "#cbd5e1"} strokeWidth={i === n - 1 && phase === 3 ? 2 : 1.4} />
          <text x={bx(i) + 5} y={by + 11} fontSize="8" fontWeight="800" fill={DIM} fontFamily={numberFont}>
            a{sub(i + 1)}
          </text>
          <text x={bcx(i)} y={by + 27} textAnchor="middle" fontSize="14" fontWeight="800" fill={i === n - 1 && phase === 3 ? WIN : INK} fontFamily={numberFont}>
            {label(i)}
          </text>
        </motion.g>
      ))}
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ================= the chain ================= */}
        {showChain && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              {phase === 0
                ? "each term is the product of the two before it"
                : phase === 1
                ? "multiplying the terms adds the exponents"
                : `first term ${best.A}, and every product lands where it should`}
            </text>

            {/* arcs: the far parent above, the near parent below */}
            {Array.from({ length: n - 2 }, (_, j) => {
              const i = j + 2;
              const u = upArc(i);
              const d = downArc(i);
              const delay = 0.5 + j * 0.4;
              return (
                <motion.g key={`a${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay }}>
                  <motion.path d={u.d} fill="none" stroke={IND} strokeWidth={1.5} opacity={0.7} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay }} />
                  <path d={`M ${u.x2},${by} l -3.5,-6 l 7,0 z`} fill={IND} opacity={0.8} />
                  <motion.path d={d.d} fill="none" stroke={TEAL} strokeWidth={1.5} opacity={0.7} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: delay + 0.08 }} />
                  <path d={`M ${d.x2},${by + bh} l -3.5,6 l 7,0 z`} fill={TEAL} opacity={0.8} />
                  <text x={u.mx} y={u.my - 3} textAnchor="middle" fontSize="11" fontWeight="800" fill={IND} fontFamily={numberFont}>
                    {op}
                  </text>
                </motion.g>
              );
            })}

            <Boxes
              label={(i) => (phase === 3 ? seq[i].toLocaleString() : monomial(ea[i], eb[i]))}
              fill={(i) => (phase === 3 && i === n - 1 ? "#dcfce7" : i < 2 ? "#eef2ff" : "#fff")}
            />

            {/* phase 1: the exponents, marching up the Fibonacci numbers */}
            {phase === 1 && (
              <g>
                {[
                  { row: 0, e: ea, c: IND, name: "A" },
                  { row: 1, e: eb, c: TEAL, name: "B" },
                ].map(({ row, e, c, name }) => (
                  <g key={name}>
                    <text x={30} y={196 + row * 26} textAnchor="middle" fontSize="11" fontWeight="800" fill={c} fontFamily={numberFont}>
                      {name}
                    </text>
                    {e.map((v, i) => (
                      <motion.g
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.9 + i * 0.16 + row * 0.05 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      >
                        <circle cx={bcx(i)} cy={191 + row * 26} r={11} fill={i >= 2 ? c : "#fff"} fillOpacity={i >= 2 ? 0.16 : 1} stroke={c} strokeWidth={1.3} />
                        <text x={bcx(i)} y={195 + row * 26} textAnchor="middle" fontSize="11" fontWeight="800" fill={c} fontFamily={numberFont}>
                          {v}
                        </text>
                      </motion.g>
                    ))}
                  </g>
                ))}
                <motion.text x={W / 2} y={240} textAnchor="middle" fontSize="11" fontWeight="800" fill={WARN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }}>
                  each one is the sum of the two before — the Fibonacci numbers
                </motion.text>
              </g>
            )}

            {/* phase 0: what the last term comes to */}
            {phase === 0 && (
              <motion.text
                x={W / 2}
                y={222}
                textAnchor="middle"
                fontSize="15"
                fontWeight="800"
                fill={IND}
                fontFamily={numberFont}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (n - 2) * 0.4 }}
              >
                a{sub(n)} = {monomial(EA, EB)} = {target.toLocaleString()}
              </motion.text>
            )}

            {/* phase 3: the check */}
            {phase === 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + (n - 2) * 0.4 }}>
                <text x={W / 2} y={210} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  {seq[n - 3].toLocaleString()} × {seq[n - 2].toLocaleString()} = {target.toLocaleString()} ✓
                </text>
                <text x={W / 2} y={234} textAnchor="middle" fontSize="15" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                  the first term is {best.A}
                </text>
              </motion.g>
            )}
          </g>
        )}

        {/* ================= phase 2: factor and match ================= */}
        {phase === 2 && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              the exponents {EA} and {EB} have to come out of {target.toLocaleString()} itself
            </text>
            <motion.text
              x={W / 2}
              y={54}
              textAnchor="middle"
              fontSize="17"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {target.toLocaleString()} = {primes.map(([p, e]) => `${p}${sup(e)}`).join(" × ")}
            </motion.text>

            {/* slot ↔ prime matching */}
            {[
              { slot: "B", e: EB, c: TEAL, val: best.B },
              { slot: "A", e: EA, c: IND, val: best.A },
            ].map((s, i) => (
              <motion.g key={s.slot} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.8 + i * 0.4 }}>
                <rect x={92} y={82 + i * 40} width={78} height={30} rx={7} fill="#fff" stroke={s.c} strokeWidth={1.6} />
                <text x={131} y={102 + i * 40} textAnchor="middle" fontSize="14" fontWeight="800" fill={s.c} fontFamily={numberFont}>
                  {s.slot}
                  {sup(s.e)}
                </text>
                <motion.path
                  d={`M 176,${97 + i * 40} L 246,${97 + i * 40}`}
                  stroke={s.c}
                  strokeWidth={1.6}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 1 + i * 0.4 }}
                />
                <path d={`M 250,${97 + i * 40} l -7,-4 l 0,8 z`} fill={s.c} />
                <text x={200} y={92 + i * 40} textAnchor="middle" fontSize="9" fontWeight="700" fill={DIM}>
                  exponent {s.e}
                </text>
                <rect x={256} y={82 + i * 40} width={78} height={30} rx={7} fill="#fff" stroke={s.c} strokeWidth={1.6} />
                <text x={295} y={102 + i * 40} textAnchor="middle" fontSize="14" fontWeight="800" fill={s.c} fontFamily={numberFont}>
                  {s.val}
                  {sup(s.e)}
                </text>
                <text x={352} y={102 + i * 40} fontSize="13" fontWeight="800" fill={s.c} fontFamily={numberFont}>
                  {s.slot} = {s.val}
                </text>
              </motion.g>
            ))}

            {/* the swap — the classic slip */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
              {(() => {
                const swapText = `the other way round: ${best.B}${sup(EA)} × ${best.A}${sup(EB)} = ${swapped.toLocaleString()}`;
                const half = (swapText.length * 11 * 0.6) / 2;
                return (
                  <g>
                    <text x={W / 2} y={182} textAnchor="middle" fontSize="11" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                      {swapText}
                    </text>
                    <line x1={W / 2 - half} y1={178} x2={W / 2 + half} y2={178} stroke={BAD} strokeWidth={1.4} />
                  </g>
                );
              })()}
              <text x={W / 2} y={200} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM}>
                the bigger exponent belongs to B, not A
                {swapChoice ? ` — that slip gives choice ${swapChoice.label}` : ""}
              </text>
            </motion.g>
            <motion.text x={W / 2} y={230} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }}>
              {sols.length === 1 ? "and no other pair of positive integers works" : `${sols.length} pairs work`}
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
          ? `write everything with the first two terms A and B`
          : phase === 1
          ? `so a${sub(n)} comes out as ${monomial(EA, EB)} — consecutive Fibonacci exponents`
          : phase === 2
          ? `${target.toLocaleString()} has exactly the two exponents the chain needs`
          : `${seq.slice(0, 3).join(", ")}, … , ${target.toLocaleString()}`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed: {sols.length} solutions, rebuilt {seq[n - 1]}
        </span>
      )}

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
