import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const CRUST = "#d9a066";
const FILL = "#a78bfa";
const HUE = ["#4338ca", "#b45309", "#0891b2", "#be185d"];
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const W = 340;
const H = 210;
const CX = 98;
const CY = 104;
const R = 74;
const NX = 192;

const gg = (a: number, b: number): number => (b ? gg(b, a % b) : Math.abs(a));
type Fr = { n: number; d: number };
const fr = (n: number, d = 1): Fr => {
  const k = gg(Math.abs(n), Math.abs(d)) || 1;
  const s = d < 0 ? -1 : 1;
  return { n: (s * n) / k, d: (s * d) / k };
};
const mul = (a: Fr, b: Fr) => fr(a.n * b.n, a.d * b.d);
const sub = (a: Fr, b: Fr) => fr(a.n * b.d - b.n * a.d, a.d * b.d);
const txt = (a: Fr) => (a.d === 1 ? String(a.n) : `${a.n}/${a.d}`);
const lcm = (a: number, b: number) => (a * b) / gg(a, b);

/**
 * A whole thing eaten in turns, where each eater takes a fraction **of what is
 * left** rather than of the original. The scene cuts the pie into the smallest
 * number of equal slices that makes every single bite a whole number of them —
 * so the entire problem becomes counting slices, and the answer can be read
 * straight off the plate. Each eater's slices lift out along their own bisector
 * and fade, the survivors stay contiguous so the leftover is always one clean
 * wedge, and the closing beat reduces the slice count back to a fraction. The
 * slice count, every bite, the running remainder and the reduction are all
 * computed in exact rational arithmetic; the scene also prices the classic
 * misreading — taking each fraction **of the original** — and names the answer
 * choice it would land on. Data: { eaters: ["Harold|🧑|1|4", ...] }.
 */
export function PieBitesScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const eaters = (Array.isArray(data.eaters) ? data.eaters : [])
    .map(String)
    .map((s) => s.split("|").map((p) => p.trim()))
    .filter((p) => p.length >= 4 && Number.isFinite(+p[2]) && +p[3] > 0)
    .map((p) => ({ name: p[0], icon: p[1], f: fr(+p[2], +p[3]) }));
  if (!eaters.length) return null;

  let rem: Fr = fr(1);
  const rows = eaters.map((e) => {
    const before = rem;
    const bite = mul(e.f, before);
    rem = sub(before, bite);
    return { ...e, before, bite, after: rem };
  });

  // the fewest equal slices that make every bite a whole number of them
  let D = 1;
  for (const r of rows) D = lcm(lcm(D, r.before.d), lcm(r.bite.d, r.after.d));
  const sl = (f: Fr) => (f.n * D) / f.d;

  // the classic misreading: every fraction taken of the original
  let naive: Fr = fr(1);
  for (const e of eaters) naive = sub(naive, e.f);
  const opts = (problem.choices ?? []).map((c) => ({ label: c.label, text: String(c.text).trim() }));
  const naiveHit = opts.find((o) => o.text === txt(naive));
  const agrees = problem.shortAnswer == null || String(problem.shortAnswer).trim() === txt(rem);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const done = Math.max(0, Math.min(step, rows.length));

  // slices are handed out in order, so whatever survives stays one clean wedge
  const owner: number[] = [];
  let cut = 0;
  rows.forEach((r, i) => {
    for (let k = 0; k < sl(r.bite); k++) owner[cut++] = i;
  });
  for (; cut < D; cut++) owner[cut] = -1;

  const A = (i: number) => ((-90 + (i * 360) / D) * Math.PI) / 180;
  const slice = (i: number) => {
    const a0 = A(i);
    const a1 = A(i + 1);
    return `M ${CX} ${CY} L ${(CX + R * Math.cos(a0)).toFixed(2)} ${(CY + R * Math.sin(a0)).toFixed(2)} A ${R} ${R} 0 0 1 ${(CX + R * Math.cos(a1)).toFixed(2)} ${(CY + R * Math.sin(a1)).toFixed(2)} Z`;
  };
  const mid = (i: number) => (A(i) + A(i + 1)) / 2;

  const keptFirst = owner.indexOf(-1);
  const labelA = keptFirst < 0 ? 0 : (A(keptFirst) + A(D)) / 2;

  const cur = done > 0 ? rows[done - 1] : null;
  const caption = isFinal
    ? `${sl(rem)} of the ${D} slices are left — ${txt(rem)} of the pie`
    : step === 0
    ? `one whole pie, cut into ${D} equal slices`
    : cur
    ? sl(cur.before) === D
      ? `${cur.name} eats ${txt(cur.f)} of the pie — ${sl(cur.bite)} of the ${D} slices`
      : `${cur.name} eats ${txt(cur.f)} of the ${sl(cur.before)} slices still there, not of all ${D}`
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* crust */}
        <circle cx={CX} cy={CY} r={R + 5} fill={CRUST} />
        <circle cx={CX} cy={CY} r={R + 5} fill="none" stroke="#b97f43" strokeWidth={1.5} />

        {/* the slices */}
        {Array.from({ length: D }).map((_, i) => {
          const who = owner[i];
          const gone = who >= 0 && who < done;
          const kept = who < 0;
          const a = mid(i);
          return (
            <motion.g
              key={i}
              animate={{ x: gone ? Math.cos(a) * 42 : 0, y: gone ? Math.sin(a) * 42 : 0, opacity: gone ? 0 : 1 }}
              transition={{ type: "spring", stiffness: 110, damping: 18, delay: gone && who === done - 1 ? 0.2 + i * 0.08 : 0 }}
            >
              <motion.path
                d={slice(i)}
                stroke="#fff"
                strokeWidth={1.4}
                animate={{ fill: isFinal && kept ? WIN : who >= 0 && who === done - 1 ? HUE[who % HUE.length] : FILL }}
                transition={{ duration: 0.3 }}
              />
            </motion.g>
          );
        })}

        {/* what is left, named */}
        <AnimatePresence>
          {isFinal && keptFirst >= 0 && (
            <motion.text
              key="lab"
              x={CX + Math.cos(labelA) * R * 0.55}
              y={CY + Math.sin(labelA) * R * 0.55 + 5}
              textAnchor="middle"
              fontSize="16"
              fontWeight="800"
              fill="#fff"
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 15, delay: 1.1 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {txt(rem)}
            </motion.text>
          )}
        </AnimatePresence>

        {/* who ate what */}
        {rows.map((r, i) => (
          <AnimatePresence key={r.name}>
            {i < done && (
              <motion.g initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 }}>
                <text x={NX} y={38 + i * 38} fontSize="13">
                  {r.icon}
                </text>
                <text x={NX + 20} y={38 + i * 38} fontSize="10" fontWeight="800" fill={HUE[i % HUE.length]} fontFamily={numberFont}>
                  {txt(r.f)} of {sl(r.before)}
                </text>
                <text x={NX + 20} y={51 + i * 38} fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                  eats {sl(r.bite)}, {sl(r.after)} left
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        ))}

        {/* the leftover, reduced */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="fin" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.3 }} style={{ transformBox: "fill-box", transformOrigin: "left center" }}>
              <text x={NX} y={168} fontSize="15" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {sl(rem)}/{D} = {txt(rem)}
              </text>
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
            transition={{ delay: 1.6 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees
              ? naiveHit
                ? `taking each fraction of the whole pie instead would give ${txt(naive)} — choice (${naiveHit.label})`
                : `every bite was a whole number of the ${D} slices`
              : `the slices leave ${txt(rem)}, which is not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.7 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
