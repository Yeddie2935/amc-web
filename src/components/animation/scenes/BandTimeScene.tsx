import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const GRID = "#e2e8f0";
const AXIS = "#94a3b8";
const CURVE = "#4338ca";
const OUT = "#cbd5e1";
const BAND = "#fef3c7";
const HOT = "#b45309";
const WIN = "#16a34a";
const BAD = "#dc2626";

const W = 340;
const H = 206;
const PX = 34;
const PY = 12;
const PW = 286;
const PH = 132;

const r1 = (v: number) => Math.round(v * 10) / 10;
const tidy = (v: number) => String(r1(v));

/**
 * A quantity plotted against time, with the question asking how long it stays
 * between two levels. The whole problem is that the curve **enters and leaves
 * the band more than once** — it dips under the floor and pokes over the
 * ceiling — so the answer is a sum of several separate stretches, and missing
 * either exit merges two stretches into one and lands squarely on a distractor.
 * The beats draw the curve (a skier riding along it), shade the band in, pop a
 * dot at every crossing while the in-band arcs light green and the rest dim,
 * then drop the stretches onto a time ruler as bars that add up. The curve is
 * interpolated once and **both drawn and scanned from the same samples**, so the
 * crossings reported are exactly the ones in the picture; the scene also prices
 * each missed exit and says which answer choice it would give.
 * Data: { points: [t,e, t,e, ...], low, high, unit?, yLabel?, icon? }.
 */
export function BandTimeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const flat = (Array.isArray(data.points) ? data.points : []).map(Number);
  if (flat.length < 8 || flat.length % 2 !== 0 || flat.some((v) => !Number.isFinite(v))) return null;
  const P: [number, number][] = [];
  for (let i = 0; i < flat.length; i += 2) P.push([flat[i], flat[i + 1]]);

  const low = num(data.low, 4);
  const high = num(data.high, 7);
  const unit = data.unit != null ? String(data.unit) : "seconds";
  const yLabel = data.yLabel != null ? String(data.yLabel) : "elevation";
  const icon = data.icon != null ? String(data.icon) : "⛷️";

  // one interpolation, used for both the drawing and the crossing scan
  const at = (t: number) => {
    for (let i = 0; i < P.length - 1; i++) {
      if (t >= P[i][0] && t <= P[i + 1][0]) {
        const p0 = P[Math.max(i - 1, 0)];
        const p1 = P[i];
        const p2 = P[i + 1];
        const p3 = P[Math.min(i + 2, P.length - 1)];
        const u = (t - p1[0]) / (p2[0] - p1[0]);
        return (
          0.5 *
          (2 * p1[1] +
            (-p0[1] + p2[1]) * u +
            (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u * u +
            (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u * u * u)
        );
      }
    }
    return P[P.length - 1][1];
  };

  const t0 = P[0][0];
  const tEnd = P[P.length - 1][0];
  const N = 1200;
  const samples = Array.from({ length: N + 1 }, (_, i) => {
    const t = t0 + (i * (tEnd - t0)) / N;
    return { t, e: at(t) };
  });

  // the stretches inside the band, found on the very samples that get drawn
  const inside = (e: number) => e >= low && e <= high;
  /** Where between two samples the curve met a band edge. */
  const cross = (a: { t: number; e: number }, b: { t: number; e: number }, edge: number) =>
    b.e === a.e ? b.t : a.t + ((edge - a.e) / (b.e - a.e)) * (b.t - a.t);

  const runs: { a: number; b: number }[] = [];
  let open: number | null = inside(samples[0].e) ? samples[0].t : null;
  for (let i = 1; i < samples.length; i++) {
    const prev = samples[i - 1];
    const cur = samples[i];
    const was = inside(prev.e);
    const now = inside(cur.e);
    if (!was && now) open = cross(prev, cur, prev.e < low ? low : high);
    else if (was && !now && open != null) {
      runs.push({ a: open, b: cross(prev, cur, cur.e < low ? low : high) });
      open = null;
    }
  }
  if (open != null) runs.push({ a: open, b: samples[samples.length - 1].t });

  const total = runs.reduce((s, r) => s + (r.b - r.a), 0);
  const gaps = runs.slice(1).map((r, i) => r.a - runs[i].b);
  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[^\d.-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value));
  const missPrice = gaps.map((g) => total + g);
  const missHit = opts.find((o) => missPrice.some((m) => Math.abs(m - o.value) < 0.15));
  const agrees = problem.shortAnswer == null || Math.abs(Number(problem.shortAnswer) - total) < 0.15;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showBand = isFinal || step >= 1;
  const showCross = isFinal || step >= 2;

  const tMax = Math.ceil(tEnd / 2) * 2;
  const eMax = Math.ceil(Math.max(...P.map((p) => p[1])) / 4) * 4;
  const tx = (t: number) => PX + (t / tMax) * PW;
  const ty = (e: number) => PY + PH - (e / eMax) * PH;

  const seg = (list: { t: number; e: number }[]) => list.map((s, i) => `${i ? "L" : "M"} ${tx(s.t).toFixed(2)} ${ty(s.e).toFixed(2)}`).join(" ");

  // split the drawn curve into in-band and out-of-band pieces
  const pieces: { d: string; on: boolean }[] = [];
  {
    let cur: { t: number; e: number }[] = [samples[0]];
    let on = inside(samples[0].e);
    for (let i = 1; i < samples.length; i++) {
      const f = inside(samples[i].e);
      cur.push(samples[i]);
      if (f !== on) {
        pieces.push({ d: seg(cur), on });
        cur = [samples[i]];
        on = f;
      }
    }
    pieces.push({ d: seg(cur), on });
  }

  const rideT = Array.from({ length: 26 }, (_, i) => t0 + (i * (tEnd - t0)) / 25);
  const RY = 168;

  const caption = isFinal
    ? `${tidy(total)} of the ${tidy(tEnd)} ${unit} are spent inside the band`
    : step === 0
    ? `${yLabel} over ${tidy(tEnd)} ${unit}`
    : step === 1
    ? `only the band from ${low} to ${high} counts`
    : `she crosses in and out ${runs.length * 2 - (inside(samples[0].e) ? 1 : 0)} times — ${runs.length} separate stretches`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* grid */}
        {Array.from({ length: tMax / 2 + 1 }).map((_, i) => (
          <line key={`gx${i}`} x1={tx(i * 2)} y1={PY} x2={tx(i * 2)} y2={PY + PH} stroke={GRID} strokeWidth={0.8} />
        ))}
        {Array.from({ length: eMax / 2 + 1 }).map((_, i) => (
          <line key={`gy${i}`} x1={PX} y1={ty(i * 2)} x2={PX + PW} y2={ty(i * 2)} stroke={GRID} strokeWidth={0.8} />
        ))}

        {/* the band */}
        <AnimatePresence>
          {showBand && (
            <motion.g key="band" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.rect
                x={PX}
                width={PW}
                fill={BAND}
                initial={{ y: (ty(low) + ty(high)) / 2, height: 0 }}
                animate={{ y: ty(high), height: ty(low) - ty(high) }}
                transition={{ type: "spring", stiffness: 110, damping: 18 }}
              />
              {[low, high].map((v) => (
                <g key={v}>
                  <line x1={PX} y1={ty(v)} x2={PX + PW} y2={ty(v)} stroke={HOT} strokeWidth={1.3} />
                  <text x={PX - 4} y={ty(v) + 3.5} textAnchor="end" fontSize="9" fontWeight="800" fill={HOT} fontFamily={numberFont}>
                    {v}
                  </text>
                </g>
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* axes */}
        <line x1={PX} y1={PY + PH} x2={PX + PW} y2={PY + PH} stroke={AXIS} strokeWidth={1.4} />
        <line x1={PX} y1={PY} x2={PX} y2={PY + PH} stroke={AXIS} strokeWidth={1.4} />
        {Array.from({ length: tMax / 2 + 1 }).map((_, i) => (
          <text key={`tx${i}`} x={tx(i * 2)} y={PY + PH + 11} textAnchor="middle" fontSize="8" fontWeight="700" fill={AXIS} fontFamily={numberFont}>
            {i * 2}
          </text>
        ))}
        {Array.from({ length: eMax / 4 + 1 }).map((_, i) =>
          Math.abs(i * 4 - low) > 1.5 && Math.abs(i * 4 - high) > 1.5 ? (
            <text key={`ty${i}`} x={PX - 4} y={ty(i * 4) + 3.5} textAnchor="end" fontSize="8" fontWeight="700" fill={AXIS} fontFamily={numberFont}>
              {i * 4}
            </text>
          ) : null
        )}

        {/* the curve */}
        {pieces.map((p, i) => (
          <motion.path
            key={i}
            d={p.d}
            fill="none"
            stroke={showCross ? (p.on ? WIN : OUT) : CURVE}
            strokeWidth={showCross && p.on ? 3 : 2.2}
            strokeLinecap="round"
            initial={{ pathLength: step <= 0 ? 0 : 1, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: step <= 0 ? 1.2 : 0.3 }}
          />
        ))}

        {/* the skier riding down */}
        {step <= 0 && (
          <motion.g
            initial={{ x: tx(rideT[0]), y: ty(at(rideT[0])) }}
            animate={{ x: rideT.map(tx), y: rideT.map((t) => ty(at(t))) }}
            transition={{ duration: 1.2, ease: "linear" }}
          >
            <text x={0} y={-4} fontSize="13" textAnchor="middle">
              {icon}
            </text>
          </motion.g>
        )}

        {/* every crossing */}
        {showCross &&
          runs.flatMap((r, i) =>
            [r.a, r.b].map((t, k) => (
              <motion.g
                key={`c${i}-${k}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.2 + (i * 2 + k) * 0.16 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <circle cx={tx(t)} cy={ty(at(t))} r={3.4} fill={WIN} stroke="#fff" strokeWidth={1.2} />
                <text x={tx(t)} y={ty(at(t)) - 7} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                  {tidy(t)}
                </text>
              </motion.g>
            ))
          )}

        {/* the stretches, dropped onto a time ruler */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="ruler" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={PX} y1={RY + 7} x2={PX + PW} y2={RY + 7} stroke={GRID} strokeWidth={1.2} />
              {runs.map((r, i) => (
                <motion.g key={i} initial={{ y: -22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 150, damping: 18, delay: 0.3 + i * 0.2 }}>
                  <rect x={tx(r.a)} y={RY} width={tx(r.b) - tx(r.a)} height={14} rx={4} fill={WIN} />
                  <text x={(tx(r.a) + tx(r.b)) / 2} y={RY + 11} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                    {tidy(r.b - r.a)}
                  </text>
                </motion.g>
              ))}
              <motion.text
                x={PX}
                y={RY + 34}
                fontSize="14"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.1 }}
                style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              >
                {runs.map((r) => tidy(r.b - r.a)).join(" + ")} = {tidy(total)} {unit}
              </motion.text>
            </motion.g>
          )}
          {showCross && !isFinal && (
            <motion.g key="warn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
              <text x={PX} y={RY + 4} fontSize="10" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                she dips below {low} and later climbs above {high},
              </text>
              <text x={PX} y={RY + 19} fontSize="10" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                so the band is left and re-entered twice
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
            transition={{ delay: 1.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees
              ? missHit
                ? `missing either exit merges two stretches and gives ${tidy(missPrice[0])} — choice (${missHit.label})`
                : `scanned the whole curve: ${runs.length} stretches inside the band`
              : `the curve gives ${tidy(total)}, which is not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
