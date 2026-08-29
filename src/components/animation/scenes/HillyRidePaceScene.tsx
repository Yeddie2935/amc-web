import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const GRID = "#e2e8f0";

const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(2))));

/**
 * A single hilly bike ride, read straight off a distance–time graph with
 * five real legs of very different steepness. The trap here is concrete: one
 * leg (the steep hill climb) has a slope that happens to equal one of the
 * wrong answer choices, so a solver who reads a slope off the graph instead
 * of the two endpoints lands exactly on that choice. The scene draws the
 * real polyline, labels every leg's own speed, flags the slow leg by name,
 * then collapses the whole wiggly ride onto its start-finish chord — average
 * speed only ever sees those two points.
 *
 * data: { points: [[0,0],[1,5], ...], xUnit?, yUnit?, speedUnit? }
 */
export function HillyRidePaceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const pts = (Array.isArray(data.points) ? data.points : []).map((p) => {
    const [x, y] = Array.isArray(p) ? p : String(p).split(",");
    return [num(x, 0), num(y, 0)] as [number, number];
  });
  const xUnit = data.xUnit != null ? String(data.xUnit) : "hours";
  const yUnit = data.yUnit != null ? String(data.yUnit) : "miles";
  const speedUnit = data.speedUnit != null ? String(data.speedUnit) : "mph";

  const first = pts[0] ?? [0, 0];
  const lastP = pts[pts.length - 1] ?? [0, 0];
  const totalDist = lastP[1] - first[1];
  const totalTime = lastP[0] - first[0];
  const avg = totalTime > 0 ? totalDist / totalTime : 0;

  const legs = pts.slice(1).map((p, i) => {
    const prev = pts[i];
    const dt = p[0] - prev[0];
    const dd = p[1] - prev[1];
    return { x0: prev[0], y0: prev[1], x1: p[0], y1: p[1], dt, dd, speed: dt > 0 ? dd / dt : 0 };
  });
  const slowest = legs.reduce((a, b) => (b.speed < a.speed ? b : a), legs[0] ?? { speed: 0 });
  const slowIdx = legs.indexOf(slowest);

  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === slowest?.speed && String(c.label) !== problem.answer
  );
  const ok = tidy(avg) === (problem.shortAnswer ?? "").trim();

  // ---- beats: 0 trace the ride, 1 leg speeds, 2 the trap, 3 collapse to chord, 4 compute, 5 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  // ---- geometry ----
  const W = 380;
  const H = 280;
  const PL = 46;
  const PR = 350;
  const PT = 26;
  const PB = 190;
  const xMax = Math.max(1, lastP[0]);
  const yMax = Math.max(1, Math.max(...pts.map((p) => p[1])));
  const sx = (t: number) => PL + (t / xMax) * (PR - PL);
  const sy = (d: number) => PB - (d / yMax) * (PB - PT);
  const xStep = xMax <= 10 ? 1 : Math.ceil(xMax / 8);
  const yStep = yMax <= 10 ? 2 : Math.ceil(yMax / 8 / 5) * 5;

  const pathPts = pts.map((p) => `${sx(p[0])},${sy(p[1])}`).join(" ");
  const chordPts = `${sx(first[0])},${sy(first[1])} ${sx(lastP[0])},${sy(lastP[1])}`;
  const chordY = (t: number) => first[1] + ((t - first[0]) * (lastP[1] - first[1])) / (lastP[0] - first[0]);

  const caption =
    beat === 0
      ? `Carmen's ride, ${xMax} ${xUnit}`
      : beat === 1
      ? `each hill has its own pace`
      : beat === 2
      ? `${tidy(slowest?.speed ?? 0)} ${speedUnit} — just the steepest climb`
      : beat === 3
      ? `average speed only sees the start and the finish`
      : beat === 4
      ? `${tidy(totalDist)} ÷ ${tidy(totalTime)} = ${tidy(avg)} ${speedUnit}`
      : `${tidy(avg)} ${speedUnit}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        {/* axes */}
        {Array.from({ length: Math.floor(yMax / yStep) + 1 }, (_, i) => i * yStep).map((d) => (
          <g key={`y${d}`}>
            <line x1={PL} y1={sy(d)} x2={PR} y2={sy(d)} stroke={GRID} strokeWidth={1} />
            <text x={PL - 6} y={sy(d) + 3} textAnchor="end" fontSize="8" fontWeight="700" fill={DIM} fontFamily={FONT}>
              {d}
            </text>
          </g>
        ))}
        {Array.from({ length: Math.floor(xMax / xStep) + 1 }, (_, i) => i * xStep).map((t) => (
          <g key={`x${t}`}>
            <line x1={sx(t)} y1={PT} x2={sx(t)} y2={PB} stroke={GRID} strokeWidth={1} />
            <text x={sx(t)} y={PB + 14} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM} fontFamily={FONT}>
              {t}
            </text>
          </g>
        ))}
        <line x1={PL} y1={PT} x2={PL} y2={PB} stroke={INK} strokeWidth={1.6} />
        <line x1={PL} y1={PB} x2={PR} y2={PB} stroke={INK} strokeWidth={1.6} />
        <text x={(PL + PR) / 2} y={PB + 28} textAnchor="middle" fontSize="9" fontWeight="700" fill={INK}>
          {xUnit}
        </text>
        <text x={14} y={(PT + PB) / 2} textAnchor="middle" fontSize="9" fontWeight="700" fill={INK} transform={`rotate(-90 14 ${(PT + PB) / 2})`}>
          {yUnit}
        </text>

        {/* the ride itself, present through beat 2 */}
        {beat <= 2 && (
          <motion.polyline
            points={pathPts}
            fill="none"
            stroke={IND}
            strokeWidth={2.2}
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={beat === 0 ? { pathLength: 0 } : false}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2 }}
          />
        )}
        {beat === 0 && (
          <motion.g
            initial={{ x: sx(first[0]), y: sy(first[1]) }}
            animate={{ x: pts.map((p) => sx(p[0])), y: pts.map((p) => sy(p[1])) }}
            transition={{ duration: 1.2, times: pts.map((p) => (p[0] - first[0]) / (xMax || 1)) }}
          >
            <text x={0} y={0} textAnchor="middle" fontSize="16">
              🚲
            </text>
          </motion.g>
        )}

        {/* beat 1-2: each leg's own speed, in a small chip at its midpoint */}
        {(beat === 1 || beat === 2) &&
          legs.map((l, i) => {
            const mx = sx((l.x0 + l.x1) / 2);
            const my = sy((l.y0 + l.y1) / 2) - 12;
            const isSlow = i === slowIdx;
            const color = beat === 2 && isSlow ? BAD : IND;
            return (
              <motion.g key={i} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: i * 0.12 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <rect x={mx - 16} y={my - 10} width={32} height={16} rx={5} fill={beat === 2 && isSlow ? "#fee2e2" : "#eef2ff"} stroke={color} strokeWidth={1.4} />
                <text x={mx} y={my + 1} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={color} fontFamily={FONT}>
                  {tidy(l.speed)}
                </text>
              </motion.g>
            );
          })}
        {beat === 2 && (
          <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.6 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <text x={sx((slowest.x0 + slowest.x1) / 2)} y={sy((slowest.y0 + slowest.y1) / 2) + 24} textAnchor="middle" fontSize="13" fontWeight="800" fill={BAD} fontFamily={FONT}>
              ✗
            </text>
          </motion.g>
        )}

        {/* beat 3: collapse every kink onto the straight chord */}
        {beat === 3 && (
          <g>
            <polyline points={pathPts} fill="none" stroke={IND} strokeWidth={1.4} opacity={0.25} />
            <motion.polyline
              points={chordPts}
              fill="none"
              stroke={WIN}
              strokeWidth={2.6}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9 }}
            />
            {pts.slice(1, -1).map((p, i) => (
              <motion.circle
                key={i}
                cx={sx(p[0])}
                r={3}
                fill={WIN}
                initial={{ cy: sy(p[1]) }}
                animate={{ cy: sy(chordY(p[0])) }}
                transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.5 + i * 0.08 }}
              />
            ))}
            {[first, lastP].map((p, i) => (
              <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r={4.5} fill={WIN} stroke="#fff" strokeWidth={1.4} />
            ))}
          </g>
        )}

        {/* beats 4-5: the chord alone, with the division */}
        {beat >= 4 && (
          <g>
            <polyline points={pathPts} fill="none" stroke={IND} strokeWidth={1.2} opacity={0.18} />
            <polyline points={chordPts} fill="none" stroke={WIN} strokeWidth={2.6} strokeLinecap="round" />
            {[first, lastP].map((p, i) => (
              <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r={4.5} fill={WIN} stroke="#fff" strokeWidth={1.4} />
            ))}
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.4 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={W / 2 - 66} y={(PT + PB) / 2 - 16} width={132} height={32} rx={9} fill="#dcfce7" stroke={WIN} strokeWidth={1.6} />
              <text x={W / 2} y={(PT + PB) / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill={WIN} fontFamily={FONT}>
                {tidy(totalDist)} / {tidy(totalTime)} = {tidy(avg)}
              </text>
            </motion.g>
          </g>
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : beat === 2 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 2 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 2 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 2 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 270 }}>
            {trapChoice ? `choice ${trapChoice.label} (${tidy(slowest.speed)}) is just this one hill, not the whole ride` : `one leg's speed isn't the average of the whole ride`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${tidy(avg)} but stored answer reads "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
