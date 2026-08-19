import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DOT = "#475569";
const MARK = "#4338ca";
const SWEEP = "#f59e0b";
const WIN = "#16a34a";
const BAD = "#dc2626";
const GRID = "#e2e8f0";
const MUTE = "#94a3b8";

const W = 360;
const H = 214;
const X0 = 46; // weight 0
const Y0 = 186; // price 0
const AXMAX = 6;
const AYMAX = 6;
const XS = (328 - X0) / AXMAX;
const YS = (Y0 - 30) / AYMAX;

const money = (v: number) => `$${v.toFixed(2)}`;
const tidy = (v: number) => String(Number(v.toFixed(4)));

/**
 * A scatter plot of price against weight, asking which item is cheapest **per
 * unit**. Reading the plot for the lowest price finds the smallest item, and
 * reading it for the biggest item finds the dearest — neither is the question.
 * Price per ounce is `price ÷ weight`, which on this picture is the **slope of
 * the line from the origin** to a point, so the whole problem turns into
 * geometry: the best buy is the point whose ray from the origin is *shallowest*.
 * The beats earn that: one point gets its ray measured, then a single ray is
 * shown carrying **several points at once** (all the same price per ounce, which
 * is what makes a ray a price rather than a point), then a ray sweeps up from
 * flat and the **first point it touches** is the answer — with every other point
 * necessarily above it, and the scene counts them to say so. The closing beat
 * prices all five answer choices straight off the plot, since each choice is a
 * weight and the cheapest item at that weight is a real dot.
 * Every ratio, the winner, the runner-up, the shared-ray family and the
 * per-choice bests are computed from the plotted points, and the winning weight
 * is checked against the stored answer.
 * Data: { cols: ["1|1.2,1.7,2,2.8", ...] } as weight|comma-separated prices.
 */
export function SlopeSweepScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const unit = data.unit != null ? String(data.unit) : "oz";

  const pts: { w: number; p: number; r: number }[] = [];
  (Array.isArray(data.cols) ? data.cols : []).forEach((c) => {
    const [wStr, list] = String(c).split("|");
    const w = Number(wStr);
    if (!Number.isFinite(w) || w <= 0 || !list) return;
    list.split(",").forEach((s) => {
      const p = Number(s);
      if (Number.isFinite(p)) pts.push({ w, p, r: p / w });
    });
  });

  const sorted = [...pts].sort((a, b) => a.r - b.r);
  const best = sorted[0];
  const runnerUp = sorted[1];
  const dearest = sorted[sorted.length - 1];

  // the ray carrying the most points: same slope from the origin, same unit price
  const families = new Map<string, { w: number; p: number; r: number }[]>();
  pts.forEach((q) => {
    const key = q.r.toFixed(6);
    families.set(key, [...(families.get(key) ?? []), q]);
  });
  const family = [...families.values()].sort((a, b) => b.length - a.length)[0] ?? [];
  const familyR = family.length ? family[0].r : 0;

  // each answer choice is a weight, so the plot prices them directly
  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value))
    .map((c) => {
      const here = pts.filter((q) => Math.abs(q.w - c.value) < 1e-9).sort((a, b) => a.r - b.r)[0];
      return { ...c, pt: here };
    })
    .filter((c) => c.pt);
  const winner = opts.find((c) => Math.abs(c.value - best.w) < 1e-9);
  const agrees = !problem.answer || winner?.label === problem.answer;
  const above = pts.filter((q) => q.r > best.r).length;

  const xOf = (w: number) => X0 + w * XS;
  const yOf = (p: number) => Y0 - p * YS;
  const degOf = (r: number) => (Math.atan2(YS * r, XS) * 180) / Math.PI;
  const ticks = Array.from({ length: AXMAX - 1 }, (_, i) => i + 1);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const preSteps = Math.max(1, totalSteps - 1);
  const showOne = !isFinal && step === 0;
  const showFamily = !isFinal && step === 1 && totalSteps >= 4;
  const showSweep = !isFinal && step >= Math.max(1, preSteps - 1);

  const caption = showOne
    ? `the dearest: ${money(dearest.p)} for ${tidy(dearest.w)} ${unit} = ${money(dearest.r)} per ${unit}, the steepest ray from the origin`
    : showFamily
    ? `one ray, ${family.length} peppers, all ${money(familyR)} per ${unit} — a ray is a price, not a point`
    : showSweep
    ? `sweep the ray up from flat: the first point it touches is the cheapest per ${unit}`
    : `${best.w} ${unit} at ${money(best.p)} is ${money(best.r)} per ${unit} — the lowest on the plot`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        <defs>
          <clipPath id="ss-clip">
            <rect x={X0} y={30} width={328 - X0} height={Y0 - 30} />
          </clipPath>
        </defs>

        {/* the plot */}
        {ticks.map((t) => (
          <g key={`gx-${t}`}>
            <line x1={xOf(t)} y1={30} x2={xOf(t)} y2={Y0} stroke={GRID} strokeWidth={1} />
            <text x={xOf(t)} y={Y0 + 13} textAnchor="middle" fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
              {t}
            </text>
          </g>
        ))}
        {ticks.map((t) => (
          <g key={`gy-${t}`}>
            <line x1={X0} y1={yOf(t)} x2={328} y2={yOf(t)} stroke={GRID} strokeWidth={1} />
            <text x={X0 - 6} y={yOf(t) + 3.5} textAnchor="end" fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
              {t}
            </text>
          </g>
        ))}
        <line x1={X0} y1={24} x2={X0} y2={Y0} stroke={INK} strokeWidth={1.4} />
        <line x1={X0} y1={Y0} x2={334} y2={Y0} stroke={INK} strokeWidth={1.4} />
        <text x={(X0 + 328) / 2} y={Y0 + 27} textAnchor="middle" fontSize="9" fontWeight="800" fill={INK} fontFamily={numberFont}>
          weight ({unit})
        </text>
        <text x={13} y={108} textAnchor="middle" fontSize="9" fontWeight="800" fill={INK} fontFamily={numberFont} transform={`rotate(-90 13 108)`}>
          price ($)
        </text>

        {/* rays live under the dots so a line never strikes through a point */}
        <g clipPath="url(#ss-clip)">
          <AnimatePresence>
            {showOne && (
              <motion.line
                key="one"
                x1={X0}
                y1={Y0}
                x2={xOf(dearest.w * 3)}
                y2={yOf(dearest.p * 3)}
                stroke={BAD}
                strokeWidth={1.6}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 1.5 }}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showFamily && (
              <motion.line
                key="fam"
                x1={X0}
                y1={Y0}
                x2={xOf(AXMAX)}
                y2={yOf(familyR * AXMAX)}
                stroke={MARK}
                strokeWidth={1.8}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.4 }}
              />
            )}
          </AnimatePresence>
          {(showSweep || isFinal) && (
            <motion.g
              initial={{ rotate: 0 }}
              animate={{ rotate: -degOf(best.r) }}
              transition={{ duration: 1.7, ease: "easeOut", delay: 0.4 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {/* forces the rotation pivot onto the origin */}
              <circle cx={X0} cy={Y0} r={340} fill="transparent" />
              <line x1={X0} y1={Y0} x2={X0 + 340} y2={Y0} stroke={isFinal ? WIN : SWEEP} strokeWidth={2} />
            </motion.g>
          )}
        </g>

        {/* the thirty options */}
        {pts.map((q, i) => {
          const isBest = q === best;
          const inFamily = showFamily && family.includes(q);
          const lit = (showSweep || isFinal) && isBest;
          const dim = (showSweep || isFinal) && !isBest;
          return (
            <motion.circle
              key={i}
              cx={xOf(q.w)}
              cy={yOf(q.p)}
              r={lit ? 5 : 3.2}
              fill={lit ? WIN : inFamily ? MARK : DOT}
              opacity={dim ? 0.3 : 1}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: showOne ? 0.15 + i * 0.03 : 0.05 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          );
        })}

        {/* what one ray means */}
        <AnimatePresence>
          {showOne && (
            <motion.g key="one-lab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
              <circle cx={xOf(dearest.w)} cy={yOf(dearest.p)} r={5.5} fill="none" stroke={BAD} strokeWidth={1.6} />
              <rect x={X0 + 2} y={35} width={230} height={13} fill="#fff" />
              <text x={X0 + 6} y={44} fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                {pts.length} peppers — steeper ray = dearer per {unit}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* one ray, several peppers, one price */}
        <AnimatePresence>
          {showFamily && (
            <motion.g key="fam-lab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
              {family.map((q, i) => (
                <circle key={i} cx={xOf(q.w)} cy={yOf(q.p)} r={5.5} fill="none" stroke={MARK} strokeWidth={1.5} />
              ))}
              <rect x={X0 + 2} y={34} width={186} height={14} fill="#fff" />
              <text x={X0 + 6} y={44} fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                {family.length} peppers, all {money(familyR)} per {unit}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the sweep stops on the first point it meets */}
        <AnimatePresence>
          {showSweep && !isFinal && (
            <motion.g key="sw-lab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
              <text x={xOf(best.w) + 10} y={yOf(best.p) - 5} fontSize="10.5" fontWeight="800" fill={SWEEP} fontFamily={numberFont}>
                first one hit
              </text>
              <text x={X0 + 6} y={44} fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                the other {above} points all sit above this ray
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* every answer choice is a weight, so price them all off the plot */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {opts.map((o, i) => {
                const q = o.pt!;
                const good = o.label === winner?.label;
                return (
                  <motion.g
                    key={o.label}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 16, delay: 2.2 + i * 0.18 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <circle cx={xOf(q.w)} cy={yOf(q.p)} r={6} fill="none" stroke={good ? WIN : MUTE} strokeWidth={1.6} />
                    <text
                      x={xOf(q.w) + 9}
                      y={yOf(q.p) + 3.5}
                      fontSize={good ? 11 : 9}
                      fontWeight="800"
                      fill={good ? WIN : MUTE}
                      fontFamily={numberFont}
                    >
                      {money(q.r)}
                    </text>
                  </motion.g>
                );
              })}
              <motion.text
                x={X0 + 6}
                y={44}
                fontSize="11.5"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2 }}
              >
                {money(best.p)} ÷ {tidy(best.w)} = {money(best.r)} per {unit}
              </motion.text>
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
            transition={{ delay: 3.4 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? MUTE : BAD, textAlign: "center" }}
          >
            {!agrees
              ? `the lowest ratio on the plot is at ${best.w} ${unit}, not the stored answer`
              : `next best is ${runnerUp.w} ${unit} at ${money(runnerUp.r)} — the biggest jar is not the best value`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 3.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
