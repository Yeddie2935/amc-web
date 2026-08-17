import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const DIM = "#94a3b8";
const HOT = "#b45309";
const WIN = "#16a34a";
const BAD = "#dc2626";

const W = 340;
const H = 205;
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sup = (n: number) => String(n).split("").map((c) => SUP[Number(c)] ?? c).join("");
const com = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });

/** Round to a single significant digit, normalising 9.7 -> 1 x 10^(e+1). */
function oneSig(n: number) {
  const e0 = Math.floor(Math.log10(Math.abs(n)));
  let d = Math.round(n / 10 ** e0);
  let e = e0;
  if (d === 10) {
    d = 1;
    e += 1;
  }
  return { d, e };
}

/**
 * A division whose answer choices sit whole decades apart, so the real work is
 * never the long division — it is **rounding both numbers to one digit and
 * counting the zeros**. The beats fly the journey first, then climb a unit
 * ladder turning the given time into the asked-for unit one factor at a time,
 * then knock every digit but the leading one off both numbers (the discarded
 * digits actually grey out in place), then divide the single digits and subtract
 * the exponents — which here lands exactly on one of the choices. Closes by
 * running the exact division anyway and measuring the gap to the two nearest
 * choices, since the question asks which is *closest*. The ladder product, both
 * roundings, the estimate, the exact value and the winning margin are computed,
 * and the scene says whether the one-digit estimate hit a choice on the nose.
 * Data: { value, valueUnit, chain: ["6.5|months", "30|days per month", ...],
 * perUnit, icon? }.
 */
export function MagnitudeEstimateScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const value = num(data.value, 0);
  const valueUnit = data.valueUnit != null ? String(data.valueUnit) : "miles";
  const perUnit = data.perUnit != null ? String(data.perUnit) : "hour";
  const icon = data.icon != null ? String(data.icon) : "🚀";
  // "6.5|months" then "30|days|days in a month": number, unit it becomes, what the factor is
  const chain = (Array.isArray(data.chain) ? data.chain : [])
    .map(String)
    .map((s) => s.split("|").map((p) => p.trim()))
    .filter((p) => p.length >= 2 && Number.isFinite(+p[0]))
    .map((p) => ({ n: +p[0], unit: p[1], why: p[2] ?? "" }));
  if (value <= 0 || chain.length < 2) return null;

  // climb the ladder: each factor converts one more unit
  const rungs: { value: number; unit: string; by: number; why: string }[] = [];
  let acc = chain[0].n;
  rungs.push({ value: acc, unit: chain[0].unit, by: 0, why: "" });
  for (let i = 1; i < chain.length; i++) {
    acc *= chain[i].n;
    rungs.push({ value: acc, unit: chain[i].unit, by: chain[i].n, why: chain[i].why });
  }
  const time = acc;

  const a = oneSig(value);
  const b = oneSig(time);
  const estimate = (a.d / b.d) * 10 ** (a.e - b.e);
  const exact = value / time;

  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[^\d.]/g, "")) }))
    .filter((c) => Number.isFinite(c.value) && c.value > 0);
  const ranked = [...opts].sort((x, y) => Math.abs(x.value - exact) - Math.abs(y.value - exact));
  const best = ranked[0];
  const runnerUp = ranked[1];
  const onTheNose = best && Math.abs(estimate - best.value) < 1e-6;
  const agrees = !best || !problem.answer || best.label === problem.answer;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const stage = step <= 0 ? "trip" : step === 1 ? "ladder" : isFinal ? "divide" : "round";

  const mant = (x: { d: number; e: number }) => `${x.d} × 10${sup(x.e)}`;
  const ratio = a.d / b.d;

  const caption =
    stage === "trip"
      ? `${com(value)} ${valueUnit} in ${chain[0].n} ${chain[0].unit}`
      : stage === "ladder"
      ? `${chain[0].n} ${chain[0].unit} works out to ${com(time)} ${perUnit}s`
      : stage === "round"
      ? "the choices are whole decades apart, so one digit each is plenty"
      : onTheNose
      ? `the one-digit estimate lands exactly on ${com(estimate)}`
      : `about ${com(estimate)} ${valueUnit} per ${perUnit}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the journey */}
        <AnimatePresence>
          {stage === "trip" && (
            <motion.g key="trip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.path
                d="M 58 118 Q 170 62 282 118"
                fill="none"
                stroke={DIM}
                strokeWidth={1.6}
                strokeDasharray="5 4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              <circle cx={46} cy={124} r={17} fill="#3b82f6" />
              <path d="M 34 120 q 8 -6 14 0 q 6 5 12 -1" fill="none" stroke="#4ade80" strokeWidth={4} strokeLinecap="round" />
              <text x={46} y={158} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                launch
              </text>
              <circle cx={292} cy={124} r={13} fill="#c2410c" />
              <circle cx={288} cy={120} r={3.5} fill="#9a3412" />
              <text x={292} y={152} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                landing
              </text>
              <motion.g
                initial={{ x: 58, y: 118 }}
                animate={{
                  x: Array.from({ length: 21 }, (_, i) => 58 * (1 - i / 20) ** 2 + 2 * 170 * (i / 20) * (1 - i / 20) + 282 * (i / 20) ** 2),
                  y: Array.from({ length: 21 }, (_, i) => 118 * (1 - i / 20) ** 2 + 2 * 62 * (i / 20) * (1 - i / 20) + 118 * (i / 20) ** 2),
                }}
                transition={{ duration: 1.4, ease: "linear" }}
              >
                <text x={0} y={0} fontSize="16" textAnchor="middle">
                  {icon}
                </text>
              </motion.g>
              <text x={W / 2} y={44} textAnchor="middle" fontSize="14" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                {com(value)} {valueUnit}
              </text>
              <text x={W / 2} y={186} textAnchor="middle" fontSize="13" fontWeight="800" fill={HOT} fontFamily={numberFont}>
                {chain[0].n} {chain[0].unit}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* months into hours, one factor at a time */}
        <AnimatePresence>
          {stage === "ladder" && (
            <motion.g key="lad" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {rungs.map((r, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 + i * 0.5 }}>
                  <rect x={92} y={22 + i * 60} width={156} height={30} rx={8} fill={i === rungs.length - 1 ? "#dcfce7" : "#eef2ff"} stroke={i === rungs.length - 1 ? WIN : MARK} strokeWidth={1.5} />
                  <text x={170} y={42 + i * 60} textAnchor="middle" fontSize="13" fontWeight="800" fill={i === rungs.length - 1 ? WIN : MARK} fontFamily={numberFont}>
                    {com(r.value)} {r.unit}
                  </text>
                  {i > 0 && (
                    <>
                      <line x1={170} y1={4 + i * 60} x2={170} y2={20 + i * 60} stroke={HOT} strokeWidth={1.5} markerEnd="url(#meArr)" />
                      <text x={180} y={16 + i * 60} fontSize="10.5" fontWeight="800" fill={HOT} fontFamily={numberFont}>
                        × {r.by} {r.why}
                      </text>
                    </>
                  )}
                </motion.g>
              ))}
              <defs>
                <marker id="meArr" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                  <path d="M 0,0 L 6,3 L 0,6 z" fill={HOT} />
                </marker>
              </defs>
            </motion.g>
          )}
        </AnimatePresence>

        {/* keep the leading digit, count the rest as zeros */}
        <AnimatePresence>
          {stage === "round" && (
            <motion.g key="rnd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {[
                { n: value, s: a, unit: valueUnit, y: 52 },
                { n: time, s: b, unit: `${perUnit}s`, y: 130 },
              ].map((row, k) => {
                const digits = com(row.n).split("");
                const wide = 9.2;
                const x0 = 170 - (digits.length * wide) / 2;
                return (
                  <g key={k}>
                    {digits.map((c, i) => (
                      <motion.text
                        key={i}
                        x={x0 + i * wide + wide / 2}
                        y={row.y}
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="800"
                        fill={i === 0 ? INK : DIM}
                        fontFamily={numberFont}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: i === 0 ? 1 : 0.4 }}
                        transition={{ delay: 0.5 + k * 0.5 + i * 0.05 }}
                      >
                        {c}
                      </motion.text>
                    ))}
                    <motion.text
                      x={170}
                      y={row.y + 24}
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight="800"
                      fill={MARK}
                      fontFamily={numberFont}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.1 + k * 0.5 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      ≈ {mant(row.s)} {row.unit}
                    </motion.text>
                  </g>
                );
              })}
              <text x={170} y={96} textAnchor="middle" fontSize="11" fontWeight="800" fill={HOT} fontFamily={numberFont}>
                ÷
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* divide the digits, subtract the exponents */}
        <AnimatePresence>
          {stage === "divide" && (
            <motion.g key="div" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={170} y={30} textAnchor="middle" fontSize="14" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                {mant(a)} ÷ {mant(b)}
              </text>
              <motion.text
                x={170}
                y={56}
                textAnchor="middle"
                fontSize="13"
                fontWeight="800"
                fill={HOT}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                = ({a.d} ÷ {b.d}) × (10{sup(a.e)} ÷ 10{sup(b.e)}) = {ratio} × 10{sup(a.e - b.e)}
              </motion.text>
              <motion.text
                x={170}
                y={86}
                textAnchor="middle"
                fontSize="19"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.8 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                ≈ {com(estimate)}
              </motion.text>
              <motion.text x={170} y={110} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
                the real division gives {com(Math.round(exact))}
              </motion.text>

              {opts.map((o, i) => {
                const win = best && o.label === best.label;
                const cw = 60;
                const x = 20 + i * 62;
                return (
                  <motion.g key={o.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1.3 + i * 0.1 }}>
                    <rect x={x} y={132} width={cw} height={26} rx={7} fill={win ? "#dcfce7" : "#f8fafc"} stroke={win ? WIN : "#e2e8f0"} strokeWidth={win ? 1.8 : 1} />
                    <text x={x + cw / 2} y={149} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={win ? WIN : DIM} fontFamily={numberFont}>
                      {com(o.value)}
                    </text>
                    <text x={x + cw / 2} y={170} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={win ? WIN : DIM} fontFamily={numberFont}>
                      ({o.label})
                    </text>
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11.5,
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
            transition={{ delay: 1.9 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees && best && runnerUp
              ? `${com(Math.round(exact))} is ${com(Math.round(Math.abs(best.value - exact)))} from ${com(best.value)} but ${com(Math.round(Math.abs(runnerUp.value - exact)))} from ${com(runnerUp.value)}`
              : agrees
              ? `rounded both to one digit and subtracted the exponents`
              : `this lands on (${best?.label}), not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

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
