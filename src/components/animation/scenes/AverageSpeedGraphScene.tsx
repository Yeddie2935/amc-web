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
const GRID = "#e2e8f0";

type Trip = {
  name: string;
  icon: string;
  color: string;
  pts: [number, number][];
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  dist: number;
  span: number;
  speed: number;
};

/** Reduce a fraction so 10/60 prints as 1/6. */
function reduce(a: number, b: number): [number, number] {
  const g = (p: number, q: number): number => (q === 0 ? p : g(q, p % q));
  const d = g(Math.abs(a), Math.abs(b)) || 1;
  return [a / d, b / d];
}
const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(2))));

/**
 * A distance–time graph carrying two journeys, asking for the difference in
 * **average** speeds. The graph is deliberately busy — the bus waits at the kerb,
 * halts at a stop halfway, then sprints; the bike rests three separate times — and
 * the entire point is that **none of it matters**. Average speed is total distance
 * over total time, so it sees only where each journey started and where it
 * finished, and every wiggle, pause and slope change in between is decoration.
 *
 * So the scene draws the real polylines from the contest figure, with the bus and
 * the bike genuinely riding along them (keyframed `x`/`y` arrays whose `times` are
 * the real clock, so the vehicles visibly stop when the graph is flat), and then
 * **collapses each journey onto its chord**: every vertex slides vertically onto
 * the straight line from start to finish while the wiggly path greys out. The
 * chord's slope *is* the average speed, and the two endpoints are all that
 * survived.
 *
 * The closing beat is unusually complete: on 2020-11 **every one of the five
 * choices** is a slip the scene can recompute and match against `problem.choices`
 * — the distance alone, the slower speed alone, the time gap read as though it
 * were a speed, and the distance divided by that gap. Each is derived from the
 * journeys rather than authored, and any that fails to hit a choice is dropped.
 *
 * Speeds come from the polylines' own endpoints, the minutes→hours conversion is
 * kept as an exact reduced fraction, and the difference is checked against the
 * stored answer; data
 * `{ xMax, yMax, perHour, xUnit, yUnit, speedUnit,
 *    travellers: ["Naomi|🚌|#dc2626|0,0 1.8,0 5.5,3.7 8,3.7 10,6", ...] }`.
 */
export function AverageSpeedGraphScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const xMax = Math.max(1, num(data.xMax, 30));
  const yMax = Math.max(1, num(data.yMax, 6));
  const perHour = Math.max(1, num(data.perHour, 60));
  const xUnit = typeof data.xUnit === "string" ? data.xUnit : "minutes";
  const yUnit = typeof data.yUnit === "string" ? data.yUnit : "miles";
  const speedUnit = typeof data.speedUnit === "string" ? data.speedUnit : "mph";

  const trips: Trip[] = (Array.isArray(data.travellers) ? data.travellers : []).map((raw) => {
    const [name, icon, color, pts] = String(raw).split("|");
    const parsed: [number, number][] = String(pts ?? "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => {
        const [a, b] = p.split(",");
        return [num(a, 0), num(b, 0)] as [number, number];
      });
    const first = parsed[0] ?? [0, 0];
    const lastP = parsed[parsed.length - 1] ?? [0, 0];
    const dist = lastP[1] - first[1];
    const span = lastP[0] - first[0];
    return {
      name: name ?? "",
      icon: icon || "•",
      color: color || IND,
      pts: parsed,
      x0: first[0],
      y0: first[1],
      x1: lastP[0],
      y1: lastP[1],
      dist,
      span,
      speed: span > 0 ? dist / (span / perHour) : 0,
    };
  });

  const fast = [...trips].sort((a, b) => b.speed - a.speed)[0];
  const slow = [...trips].sort((a, b) => a.speed - b.speed)[0];
  const difference = fast && slow ? fast.speed - slow.speed : 0;
  const gap = fast && slow ? slow.span - fast.span : 0;
  const sharedDist = fast?.dist ?? 0;

  // ---- price every natural slip against the real answer list ----
  const choiceFor = (v: number) => {
    const t = tidy(v);
    const hit = (problem.choices ?? []).find(
      (c) => String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "") === t
    );
    return hit ? hit.label : null;
  };
  const slips = [
    { value: slow?.speed ?? 0, why: `${slow?.name}'s speed on its own` },
    { value: gap, why: `the gap in ${xUnit}, read as ${speedUnit}` },
    { value: sharedDist, why: `the ${yUnit} travelled` },
    { value: gap > 0 ? sharedDist / (gap / perHour) : 0, why: `${yUnit} ÷ the time gap` },
  ]
    .map((s) => ({ ...s, letter: choiceFor(s.value) }))
    .filter((s) => s.letter && Math.abs(s.value - difference) > 1e-9);
  const accounted = new Set([...slips.map((s) => s.letter), problem.answer]).size;

  // ---- self-checks ----
  const twoOk = trips.length === 2;
  const risesOk = trips.every((t) => t.span > 0 && t.pts.every((p, i) => i === 0 || p[0] >= t.pts[i - 1][0]));
  const sameDistOk = twoOk && Math.abs(trips[0].dist - trips[1].dist) < 1e-9;
  const answerOk =
    problem.shortAnswer == null || tidy(difference) === String(problem.shortAnswer).replace(/[^\d.]/g, "");
  const ok = twoOk && risesOk && answerOk;
  const failure = !twoOk
    ? `${trips.length} journeys — a difference needs exactly 2`
    : !risesOk
    ? "a journey travels backwards in time"
    : `computed ${tidy(difference)}, answer says ${problem.shortAnswer}`;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 262;

  // ---- plot geometry ----
  const PL = 54;
  const PR = 302;
  const PT = 32;
  const PB = 180;
  const sx = (t: number) => PL + (t / xMax) * (PR - PL);
  const sy = (d: number) => PB - (d / yMax) * (PB - PT);
  const xStep = xMax <= 10 ? 2 : xMax <= 40 ? 5 : 10;
  const yStep = yMax <= 8 ? 1 : 2;
  const PX = 312; // right-hand panel

  /** where the chord for this trip sits at time t */
  const chordY = (t: Trip, at: number) => t.y0 + ((at - t.x0) * (t.y1 - t.y0)) / (t.x1 - t.x0);

  const Axes = ({ faint = false }: { faint?: boolean }) => (
    <g opacity={faint ? 0.5 : 1}>
      {Array.from({ length: Math.floor(yMax / yStep) + 1 }, (_, i) => i * yStep).map((d) => (
        <g key={`y${d}`}>
          <line x1={PL} y1={sy(d)} x2={PR} y2={sy(d)} stroke={GRID} strokeWidth={1} />
          <text x={PL - 6} y={sy(d) + 3} textAnchor="end" fontSize="7.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
            {d}
          </text>
        </g>
      ))}
      {Array.from({ length: Math.floor(xMax / xStep) + 1 }, (_, i) => i * xStep).map((t) => (
        <g key={`x${t}`}>
          <line x1={sx(t)} y1={PT} x2={sx(t)} y2={PB} stroke={GRID} strokeWidth={1} />
          <text x={sx(t)} y={PB + 12} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
            {t}
          </text>
        </g>
      ))}
      <line x1={PL} y1={PT} x2={PL} y2={PB} stroke={INK} strokeWidth={1.6} />
      <line x1={PL} y1={PB} x2={PR} y2={PB} stroke={INK} strokeWidth={1.6} />
      <text x={(PL + PR) / 2} y={PB + 26} textAnchor="middle" fontSize="8" fontWeight="700" fill={INK}>
        {xUnit}
      </text>
      <text x={16} y={(PT + PB) / 2} textAnchor="middle" fontSize="8" fontWeight="700" fill={INK} transform={`rotate(-90 16 ${(PT + PB) / 2})`}>
        {yUnit}
      </text>
    </g>
  );

  const pathOf = (t: Trip) => t.pts.map((p) => `${sx(p[0])},${sy(p[1])}`).join(" ");
  const chordOf = (t: Trip) => `${sx(t.x0)},${sy(t.y0)} ${sx(t.x1)},${sy(t.y1)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ============ phases 0-2 share the graph ============ */}
        {phase < 3 && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              {phase === 0
                ? "both journeys stop and start — read only the ends"
                : phase === 1
                ? "average speed never sees the middle of the journey"
                : "each chord's slope is that journey's average speed"}
            </text>

            <Axes />

            {trips.map((t, ti) => (
              <g key={t.name}>
                {/* the journey as it really happened */}
                <motion.polyline
                  points={pathOf(t)}
                  fill="none"
                  stroke={t.color}
                  strokeWidth={phase === 0 ? 2.2 : 1.4}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity={phase === 0 ? 1 : 0.28}
                  initial={phase === 0 ? { pathLength: 0 } : { pathLength: 1 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, delay: 0.15 + ti * 0.5 }}
                />

                {/* the vehicle actually rides it, pausing where the graph is flat */}
                {phase === 0 && (
                  <motion.g
                    initial={{ x: sx(t.pts[0][0]), y: sy(t.pts[0][1]), opacity: 0 }}
                    animate={{
                      x: t.pts.map((p) => sx(p[0])),
                      y: t.pts.map((p) => sy(p[1])),
                      opacity: 1,
                    }}
                    transition={{
                      duration: 1.1,
                      delay: 0.15 + ti * 0.5,
                      times: t.pts.map((p) => (p[0] - t.x0) / t.span),
                      opacity: { duration: 0.2, delay: 0.15 + ti * 0.5 },
                    }}
                  >
                    <text x={0} y={0} textAnchor="middle" fontSize="15">
                      {t.icon}
                    </text>
                  </motion.g>
                )}

                {/* the chord: start and finish, nothing else */}
                {phase >= 1 && (
                  <motion.polyline
                    points={chordOf(t)}
                    fill="none"
                    stroke={t.color}
                    strokeWidth={2.6}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 + ti * 0.35 }}
                  />
                )}

                {/* every kink slides vertically onto the chord */}
                {phase === 1 &&
                  t.pts.slice(1, -1).map((p, i) => (
                    <motion.g
                      key={i}
                      initial={{ y: sy(p[1]) - sy(chordY(t, p[0])), opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 70, damping: 15, delay: 1.2 + ti * 0.35 + i * 0.05 }}
                    >
                      <circle cx={sx(p[0])} cy={sy(chordY(t, p[0]))} r={2.6} fill={t.color} />
                    </motion.g>
                  ))}

                {/* the two endpoints, which are all that matter */}
                {[
                  [t.x0, t.y0],
                  [t.x1, t.y1],
                ].map(([px, py], i) => (
                  <motion.g
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 15, delay: (phase === 0 ? 1.3 : 0.3) + ti * 0.3 + i * 0.12 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <circle cx={sx(px)} cy={sy(py)} r={4} fill={t.color} stroke="#fff" strokeWidth={1.4} />
                  </motion.g>
                ))}

                {/* the run bracket, once the chords are the subject */}
                {phase === 2 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 + ti * 0.25 }}>
                    <line x1={sx(t.x0)} y1={PB + 38 + ti * 13} x2={sx(t.x1)} y2={PB + 38 + ti * 13} stroke={t.color} strokeWidth={1.5} />
                    <line x1={sx(t.x0)} y1={PB + 34 + ti * 13} x2={sx(t.x0)} y2={PB + 42 + ti * 13} stroke={t.color} strokeWidth={1.5} />
                    <line x1={sx(t.x1)} y1={PB + 34 + ti * 13} x2={sx(t.x1)} y2={PB + 42 + ti * 13} stroke={t.color} strokeWidth={1.5} />
                    <text x={sx(t.x1) + 6} y={PB + 41 + ti * 13} fontSize="8" fontWeight="800" fill={t.color} fontFamily={numberFont}>
                      {tidy(t.span)}
                    </text>
                  </motion.g>
                )}

                {/* below the endpoint, so the riding vehicle never sits on the label */}
                <text x={sx(t.x1) - 6} y={sy(t.y1) + 16} textAnchor="end" fontSize="9" fontWeight="800" fill={t.color}>
                  {t.icon} {t.name}
                </text>
              </g>
            ))}

            {/* ---- right-hand panel, one story per beat ---- */}
            {phase === 0 && (
              <g>
                <text x={PX} y={54} fontSize="9" fontWeight="800" fill={INK}>
                  both reach {tidy(sharedDist)} {yUnit}
                </text>
                {trips.map((t, ti) => (
                  <motion.g key={t.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 + ti * 0.25 }}>
                    <text x={PX} y={78 + ti * 20} fontSize="9" fontWeight="800" fill={t.color} fontFamily={numberFont}>
                      {t.icon} {t.name}: {tidy(t.span)} {xUnit}
                    </text>
                  </motion.g>
                ))}
                <motion.text x={PX} y={132} fontSize="8.5" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>
                  the flat bits are
                </motion.text>
                <motion.text x={PX} y={144} fontSize="8.5" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>
                  waits and rests
                </motion.text>
              </g>
            )}
            {phase === 1 && (
              <g>
                <text x={PX} y={54} fontSize="9" fontWeight="800" fill={INK}>
                  average speed =
                </text>
                <text x={PX} y={70} fontSize="8.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                  total {yUnit}
                </text>
                <line x1={PX} y1={75} x2={PX + 74} y2={75} stroke={IND} strokeWidth={1.2} />
                <text x={PX} y={87} fontSize="8.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                  total {xUnit}
                </text>
                <motion.text x={PX} y={114} fontSize="8.5" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                  so the stops and
                </motion.text>
                <motion.text x={PX} y={126} fontSize="8.5" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                  the changing slopes
                </motion.text>
                <motion.text x={PX} y={138} fontSize="8.5" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                  never enter it
                </motion.text>
                <motion.text x={PX} y={162} fontSize="8.5" fontWeight="800" fill={WIN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>
                  only the 2 ends do
                </motion.text>
              </g>
            )}
            {phase === 2 &&
              trips.map((t, ti) => {
                const [rn, rd] = reduce(t.span, perHour);
                return (
                  <motion.g key={t.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + ti * 0.4 }}>
                    <text x={PX} y={52 + ti * 62} fontSize="9" fontWeight="800" fill={t.color}>
                      {t.icon} {t.name}
                    </text>
                    <text x={PX} y={68 + ti * 62} fontSize="8" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                      {tidy(t.span)} {xUnit} = {rn}/{rd} h
                    </text>
                    <text x={PX} y={84 + ti * 62} fontSize="9.5" fontWeight="800" fill={t.color} fontFamily={numberFont}>
                      {tidy(t.dist)} ÷ {rn}/{rd} = {tidy(t.speed)}
                    </text>
                    <text x={PX} y={97 + ti * 62} fontSize="8" fontWeight="700" fill={DIM}>
                      {speedUnit}
                    </text>
                  </motion.g>
                );
              })}
          </g>
        )}

        {/* ============ phase 3: the two speeds, and the gap between them ============ */}
        {phase === 3 &&
          (() => {
            const maxSp = Math.max(...trips.map((t) => t.speed), 1);
            const BX = 92;
            const BW = 330;
            const px = (v: number) => (v / maxSp) * BW;
            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  line the two speeds up — the answer is the overhang
                </text>

                {trips.map((t, ti) => (
                  <g key={t.name}>
                    <text x={BX - 8} y={54 + ti * 36} textAnchor="end" fontSize="9.5" fontWeight="800" fill={t.color}>
                      {t.icon} {t.name}
                    </text>
                    <motion.rect
                      x={BX}
                      y={40 + ti * 36}
                      width={px(t.speed)}
                      height={22}
                      rx={4}
                      fill={t.color}
                      fillOpacity={0.3}
                      stroke={t.color}
                      strokeWidth={1.6}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.25 + ti * 0.3 }}
                      style={{ transformBox: "fill-box", transformOrigin: "left" }}
                    />
                    <text x={BX + 8} y={56 + ti * 36} fontSize="11.5" fontWeight="800" fill={t.color} fontFamily={numberFont}>
                      {tidy(t.speed)} {speedUnit}
                    </text>
                  </g>
                ))}

                {/* the overhang, measured underneath so neither bar is tinted twice */}
                {[slow?.speed ?? 0, fast?.speed ?? 0].map((v, i) => (
                  <motion.line
                    key={i}
                    x1={BX + px(v)}
                    y1={i === 0 ? 62 : 98}
                    x2={BX + px(v)}
                    y2={120}
                    stroke={WIN}
                    strokeWidth={1.3}
                    strokeDasharray="3 2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  />
                ))}
                <motion.rect
                  x={BX + px(slow?.speed ?? 0)}
                  y={120}
                  width={px(difference)}
                  height={18}
                  rx={4}
                  fill={WIN}
                  fillOpacity={0.22}
                  stroke={WIN}
                  strokeWidth={1.8}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 110, damping: 16, delay: 1.15 }}
                  style={{ transformBox: "fill-box", transformOrigin: "left" }}
                />
                <motion.text
                  x={BX + px(slow?.speed ?? 0) + px(difference) / 2}
                  y={134}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.45 }}
                >
                  {tidy(difference)} {speedUnit}
                </motion.text>

                <motion.text x={W / 2} y={162} textAnchor="middle" fontSize="13.5" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}>
                  {tidy(fast?.speed ?? 0)} − {tidy(slow?.speed ?? 0)} = {tidy(difference)} {speedUnit}
                </motion.text>

                {slips.length > 0 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
                    <text x={W / 2} y={186} textAnchor="middle" fontSize="9" fontWeight="800" fill={BAD}>
                      {accounted === (problem.choices ?? []).length
                        ? "every other choice is a number you meet on the way:"
                        : "some choices are numbers you meet on the way:"}
                    </text>
                    {slips.map((s, i) => (
                      <text key={s.letter} x={W / 2} y={202 + i * 13} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={BAD}>
                        {s.letter} {tidy(s.value)} — {s.why}
                      </text>
                    ))}
                  </motion.g>
                )}
              </g>
            );
          })()}
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
          ? `same ${tidy(sharedDist)} ${yUnit}, different clocks`
          : phase === 1
          ? "only the start and the finish survive"
          : `${trips.map((t) => `${tidy(t.speed)}`).join(" and ")} ${speedUnit}`
        }
      </motion.span>

      {!ok && <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>}
      {ok && !sameDistOk && phase === 3 && (
        <span style={{ fontFamily: numberFont, fontSize: 10, fontWeight: 700, color: WARN }}>
          note: the journeys cover different distances
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
