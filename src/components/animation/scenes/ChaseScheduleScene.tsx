import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, num } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const MUTE = "#94a3b8";
const RULE = "#cbd5e1";
const ROAD = "#64748b";
const BUSC = "#f59e0b";
const BUSD = "#a16207";
const WALK = "#0f766e";

const W = 380;
const H = 264;
const SX0 = 26;
const SX1 = 326;
const SIGN_Y = 28;
const POLE_B = 80; // sidewalk / Zia's feet
const ROAD_T = 86;
const ROAD_B = 112;
const BUS_Y = 108;

// the space-time graph
const GX0 = 36;
const GX1 = 352;
const GY0 = 242;
const GY1 = 162;

const tidy = (v: number) => String(Number(v.toFixed(2))).replace(/-/g, "−");

function Bus() {
  return (
    <g>
      <rect x={-17} y={-16} width={34} height={16} rx={3} fill={BUSC} stroke={BUSD} strokeWidth={1.2} />
      <rect x={-14.5} y={-13} width={8} height={6} rx={1} fill="#e0f2fe" stroke={BUSD} strokeWidth={0.5} />
      <rect x={-4.5} y={-13} width={8} height={6} rx={1} fill="#e0f2fe" stroke={BUSD} strokeWidth={0.5} />
      <rect x={6} y={-13} width={8} height={6} rx={1} fill="#e0f2fe" stroke={BUSD} strokeWidth={0.5} />
      <circle cx={-9} cy={0} r={3.2} fill={INK} />
      <circle cx={9} cy={0} r={3.2} fill={INK} />
    </g>
  );
}

function Walker() {
  return (
    <g stroke={WALK} strokeLinecap="round" fill="none">
      <circle cx={0} cy={-15.5} r={3.4} fill={WALK} stroke="none" />
      <line x1={0} y1={-12} x2={0} y2={-6} strokeWidth={2.2} />
      <line x1={0} y1={-6} x2={-3.6} y2={0} strokeWidth={2} />
      <line x1={0} y1={-6} x2={3.6} y2={0} strokeWidth={2} />
      <line x1={0} y1={-10.5} x2={4.2} y2={-7.5} strokeWidth={1.8} />
    </g>
  );
}

/**
 * A chase along a line of stops where the two travellers move to **different
 * rhythms** — a vehicle that drives for a while then dwells at every stop, and a
 * walker at a steady pace — and the walker only ever makes a decision at the
 * instants she reaches a stop. That decision is the whole problem, and it is not
 * "has the bus caught me" but the much weaker **"has the bus reached the stop
 * behind me"**, so the scene draws it as a literal catch-zone: a band starting at
 * the previous stop, with the bus either inside it or still short. The bus creeps
 * closer at every check and only lands in the band on the last one, which is what
 * makes the repetition worth watching rather than repetitive.
 * The vehicle's stutter is animated for real — position is sampled every quarter
 * minute and fed in as keyframes, so it visibly drives, pauses at a stop, drives
 * again — and the same schedule is replayed underneath as a **space-time graph**,
 * where the vehicle is a staircase and the walker a straight ramp that goes flat
 * the moment she decides to wait. The two meet exactly at that corner.
 * The closing beat prices the obvious slip: **ignoring the waiting rule** and
 * letting the two simply run into each other, which the scene finds by scanning
 * for the first stop the walker reaches while the vehicle is still standing there
 * — on this problem that lands squarely on an answer choice, whose letter is
 * looked up rather than authored. Arrival and departure times, every decision,
 * the boarding time and the slip are all computed from the rhythms.
 * Data: { busStart, walkerStart, driveTime, dwellTime, walkTime, walker?, vehicle?, destination? }
 * with stops numbered as the figure numbers them.
 */
export function ChaseScheduleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const busStart = num(data.busStart ?? 1);
  const walkerStart = num(data.walkerStart ?? 4);
  const drive = num(data.driveTime ?? 2);
  const dwell = num(data.dwellTime ?? 1);
  const walk = num(data.walkTime ?? 5);
  const who = String(data.walker ?? "Zia");
  const ride = String(data.vehicle ?? "bus");
  const dest = String(data.destination ?? "Library");

  // the vehicle leaves its starting stop at t = 0, then drives / dwells forever
  const busArrive = (s: number) => (s <= busStart ? 0 : (s - busStart) * drive + (s - busStart - 1) * dwell);
  const busDepart = (s: number) => (s <= busStart ? 0 : (s - busStart) * (drive + dwell));
  const busPosAt = (t: number) => {
    let s = busStart;
    while (s < busStart + 400 && busArrive(s + 1) <= t) s++;
    return t <= busDepart(s) ? s : s + (t - busDepart(s)) / drive;
  };
  const walkerArrive = (s: number) => (s - walkerStart) * walk;

  // she checks only when she reaches a stop: has the ride reached the stop behind her?
  const decisions: { stop: number; time: number; prev: number; busPos: number; waits: boolean }[] = [];
  let waitStop = -1;
  for (let k = walkerStart + 1; k <= walkerStart + 40; k++) {
    const time = walkerArrive(k);
    const prev = k - 1;
    const waits = busArrive(prev) <= time;
    decisions.push({ stop: k, time, prev, busPos: busPosAt(time), waits });
    if (waits) {
      waitStop = k;
      break;
    }
  }
  const boarded = waitStop >= 0;
  const waitTime = boarded ? walkerArrive(waitStop) : NaN;
  const boardTime = boarded ? busArrive(waitStop) : NaN;

  const walkerPosAt = (t: number) => (boarded && t >= waitTime ? waitStop : walkerStart + t / walk);

  // the slip: ignore the rule, keep walking, and simply run into the ride
  let naive = NaN;
  let naiveStop = NaN;
  for (let k = walkerStart + 1; k <= walkerStart + 40; k++) {
    const t = walkerArrive(k);
    if (busArrive(k) <= t && t <= busDepart(k)) {
      naive = t;
      naiveStop = k;
      break;
    }
  }

  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value));
  const letterFor = (v: number) => opts.find((o) => o.value === v)?.label;
  const agrees = !problem.answer || letterFor(boardTime) === problem.answer;
  const naiveLetter = Number.isFinite(naive) && naive !== boardTime ? letterFor(naive) : undefined;

  const firstStop = busStart;
  const lastStop = boarded ? waitStop : walkerStart + 3;
  const span = Math.max(1, lastStop - firstStop);
  const PITCH = (SX1 - SX0) / span;
  const xOf = (p: number) => SX0 + (p - firstStop) * PITCH;

  const isFinal = step >= totalSteps - 1;
  const pre = Math.max(1, totalSteps - 1);
  const perBeat = Math.max(1, Math.ceil(decisions.length / Math.max(1, pre - 1)));
  const shown = isFinal ? decisions.length : step <= 0 ? 0 : Math.min(decisions.length, step * perBeat);
  const active = !isFinal && shown > 0 ? decisions[shown - 1] : null;
  const tNow = isFinal ? boardTime : active ? active.time : 0;
  const tPrev = isFinal ? decisions[decisions.length - 1].time : shown <= 1 ? 0 : decisions[shown - 2].time;

  // sample both travellers so the ride's dwell really shows as a pause
  const steps = Math.max(1, Math.round((tNow - tPrev) / 0.25));
  const ts = Array.from({ length: steps + 1 }, (_, i) => tPrev + ((tNow - tPrev) * i) / steps);
  const times = ts.map((_, i) => i / Math.max(1, steps));
  const busKeys = ts.map((t) => xOf(busPosAt(t)));
  const walkKeys = ts.map((t) => xOf(walkerPosAt(t)));
  const moveDur = Math.max(0.2, (tNow - tPrev) * 0.22);

  const tMax = Math.max(boardTime + 1, 1);
  const gx = (t: number) => GX0 + (t / tMax) * (GX1 - GX0);
  const gy = (s: number) => GY0 - ((s - firstStop) / span) * (GY0 - GY1);

  // the graph's two trajectories, clipped to the time reached so far
  const busPts: [number, number][] = [];
  for (let s = firstStop; s <= lastStop; s++) {
    busPts.push([busArrive(s), s]);
    if (s < lastStop) busPts.push([busDepart(s), s]);
  }
  const walkPts: [number, number][] = [[0, walkerStart]];
  for (const d of decisions) walkPts.push([d.time, d.stop]);
  if (boarded) walkPts.push([boardTime, waitStop]);

  const clip = (pts: [number, number][], tEnd: number): [number, number][] => {
    const out: [number, number][] = [];
    for (let i = 0; i < pts.length; i++) {
      const [t, s] = pts[i];
      if (t <= tEnd) {
        out.push([t, s]);
        continue;
      }
      const prev = pts[i - 1];
      if (prev && prev[0] < tEnd) {
        const f = (tEnd - prev[0]) / (t - prev[0]);
        out.push([tEnd, prev[1] + (s - prev[1]) * f]);
      }
      break;
    }
    return out;
  };
  const poly = (pts: [number, number][]) => pts.map(([t, s]) => `${gx(t)},${gy(s)}`).join(" ");

  const caption = isFinal
    ? `she waits at stop ${lastStop}, and the ${ride} pulls in at ${tidy(boardTime)} min`
    : !active
    ? `the ${ride} gains a stop every ${tidy(drive + dwell)} min, ${who} every ${tidy(walk)} — but it starts ${tidy(walkerStart - busStart)} stops back`
    : active.waits
    ? `t = ${tidy(active.time)}: the ${ride} has reached stop ${active.prev} — ${who} waits`
    : `t = ${tidy(active.time)}: the ${ride} is still short of stop ${active.prev} — ${who} walks on`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {/* the catch-zone: reaching the stop behind her is enough */}
        <AnimatePresence>
          {active && (
            <motion.g key={`band${active.stop}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: moveDur + 0.15 }}>
              <rect
                x={xOf(active.prev)}
                y={22}
                width={xOf(active.stop) - xOf(active.prev)}
                height={94}
                fill={active.waits ? "#dcfce7" : "#f1f5f9"}
                stroke={active.waits ? WIN : RULE}
                strokeWidth={1}
                strokeDasharray="4 3"
              />
              <text
                x={(xOf(active.prev) + xOf(active.stop)) / 2}
                y={18}
                textAnchor="middle"
                fontSize="8"
                fontWeight="800"
                fill={active.waits ? WIN : MUTE}
                fontFamily={numberFont}
              >
                {active.waits ? `${ride} is here ✓` : `${ride} not here yet`}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the road and its stops */}
        <rect x={0} y={ROAD_T} width={W} height={ROAD_B - ROAD_T} fill="#e2e8f0" />
        <line x1={0} y1={ROAD_T} x2={W} y2={ROAD_T} stroke={ROAD} strokeWidth={1} />
        <line x1={0} y1={(ROAD_T + ROAD_B) / 2} x2={W} y2={(ROAD_T + ROAD_B) / 2} stroke="#fff" strokeWidth={1.4} strokeDasharray="8 7" />
        <line x1={0} y1={POLE_B} x2={W} y2={POLE_B} stroke={RULE} strokeWidth={1} />

        {Array.from({ length: span + 1 }).map((_, i) => {
          const s = firstStop + i;
          const lit = active ? s === active.prev || s === active.stop : false;
          return (
            <g key={`stop${s}`}>
              <line x1={xOf(s)} y1={SIGN_Y + 14} x2={xOf(s)} y2={POLE_B} stroke={lit ? INK : RULE} strokeWidth={lit ? 1.4 : 1} />
              <rect
                x={xOf(s) - 9}
                y={SIGN_Y}
                width={18}
                height={14}
                rx={2.5}
                fill={lit ? "#fff" : "#f8fafc"}
                stroke={lit ? INK : RULE}
                strokeWidth={lit ? 1.3 : 1}
              />
              <text x={xOf(s)} y={SIGN_Y + 10.5} textAnchor="middle" fontSize="9" fontWeight="800" fill={lit ? INK : MUTE} fontFamily={numberFont}>
                {s}
              </text>
            </g>
          );
        })}

        {/* the destination the figure names */}
        <g>
          <rect x={W - 44} y={ROAD_T - 26} width={40} height={22} rx={3} fill="#f8fafc" stroke={RULE} strokeWidth={1} />
          <text x={W - 24} y={ROAD_T - 11} textAnchor="middle" fontSize="7.5" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
            {dest}
          </text>
        </g>

        {/* the two travellers, moving for real */}
        <motion.g initial={{ x: busKeys[0], y: BUS_Y }} animate={{ x: busKeys, y: BUS_Y }} transition={{ duration: moveDur, times, ease: "linear" }}>
          <Bus />
        </motion.g>
        <motion.g initial={{ x: walkKeys[0], y: POLE_B }} animate={{ x: walkKeys, y: POLE_B }} transition={{ duration: moveDur, times, ease: "linear" }}>
          <Walker />
        </motion.g>

        {/* the head start, on the opening beat */}
        {!active && !isFinal && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <line x1={xOf(busStart)} y1={124} x2={xOf(walkerStart)} y2={124} stroke={MARK} strokeWidth={1.3} />
            <line x1={xOf(busStart)} y1={120} x2={xOf(busStart)} y2={128} stroke={MARK} strokeWidth={1.3} />
            <line x1={xOf(walkerStart)} y1={120} x2={xOf(walkerStart)} y2={128} stroke={MARK} strokeWidth={1.3} />
            <text x={(xOf(busStart) + xOf(walkerStart)) / 2} y={137} textAnchor="middle" fontSize="9" fontWeight="800" fill={MARK} fontFamily={numberFont}>
              {tidy(walkerStart - busStart)} stops behind
            </text>
            <text x={W / 2} y={151} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
              {ride} {tidy(drive)} + {tidy(dwell)} = {tidy(drive + dwell)} min per stop · {who} {tidy(walk)} min per stop
            </text>
          </motion.g>
        )}

        {/* the verdict for this check */}
        <AnimatePresence>
          {active && (
            <motion.g key={`v${active.stop}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: moveDur + 0.3 }}>
              <text x={W / 2} y={130} textAnchor="middle" fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                {ride} reaches stop {active.prev} at {tidy(busArrive(active.prev))} min · {who} is at stop {active.stop} at {tidy(active.time)} min
              </text>
              <text x={W / 2} y={144} textAnchor="middle" fontSize="11" fontWeight="800" fill={active.waits ? WIN : BAD} fontFamily={numberFont}>
                {tidy(busArrive(active.prev))} {active.waits ? "≤" : ">"} {tidy(active.time)} — {active.waits ? "wait" : "keep walking"}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {isFinal && (
          <motion.text
            x={W / 2}
            y={138}
            textAnchor="middle"
            fontSize="15"
            fontWeight="800"
            fill={WIN}
            fontFamily={numberFont}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 15, delay: moveDur + 0.4 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            boards at {tidy(boardTime)} min
          </motion.text>
        )}

        {/* the same schedule as a space-time graph */}
        <line x1={GX0} y1={GY1 - 8} x2={GX0} y2={GY0} stroke={INK} strokeWidth={1.1} />
        <line x1={GX0} y1={GY0} x2={GX1} y2={GY0} stroke={INK} strokeWidth={1.1} />
        <text x={GX0 - 4} y={GY1 - 2} textAnchor="end" fontSize="7" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
          stop
        </text>
        <text x={GX1} y={GY0 + 15} textAnchor="end" fontSize="7" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
          minutes
        </text>
        {Array.from({ length: span + 1 }).map((_, i) => (
          <text key={`gy${i}`} x={GX0 - 4} y={gy(firstStop + i) + 2.5} textAnchor="end" fontSize="7" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
            {firstStop + i}
          </text>
        ))}
        {Array.from({ length: Math.floor(tMax / 5) + 1 }).map((_, i) => (
          <g key={`gx${i}`}>
            <line x1={gx(i * 5)} y1={GY0} x2={gx(i * 5)} y2={GY0 + 3} stroke={MUTE} strokeWidth={1} />
            <text x={gx(i * 5)} y={GY0 + 12} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
              {i * 5}
            </text>
          </g>
        ))}

        <motion.polyline
          key={`bp${step}`}
          points={poly(clip(busPts, tNow))}
          fill="none"
          stroke={BUSC}
          strokeWidth={2.2}
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: moveDur, ease: "linear" }}
        />
        <motion.polyline
          key={`wp${step}`}
          points={poly(clip(walkPts, tNow))}
          fill="none"
          stroke={WALK}
          strokeWidth={2.2}
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: moveDur, ease: "linear" }}
        />

        <circle cx={gx(0)} cy={gy(busStart)} r={2.6} fill={BUSC} stroke={BUSD} strokeWidth={1} />
        <circle cx={gx(0)} cy={gy(walkerStart)} r={2.6} fill={WALK} stroke={WALK} strokeWidth={1} />

        {decisions.slice(0, shown).map((d) => (
          <motion.circle
            key={`dm${d.stop}`}
            cx={gx(d.time)}
            cy={gy(d.stop)}
            r={3}
            fill={d.waits ? WIN : "#fff"}
            stroke={d.waits ? WIN : WALK}
            strokeWidth={1.4}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 16, delay: moveDur + 0.1 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}

        {isFinal && boarded && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 15, delay: moveDur + 0.6 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <circle cx={gx(boardTime)} cy={gy(waitStop)} r={6} fill="none" stroke={WIN} strokeWidth={2} />
            <text x={gx(boardTime) - 8} y={gy(waitStop) - 8} textAnchor="end" fontSize="8.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {tidy(boardTime)}
            </text>
          </motion.g>
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
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: boarded && agrees ? MUTE : BAD, textAlign: "center", maxWidth: 380 }}
          >
            {!boarded
              ? `${who} never meets the ${ride}`
              : !agrees
              ? `this gives ${tidy(boardTime)} min, not the stored answer`
              : naiveLetter
              ? `forget the waiting rule and they only meet at stop ${tidy(naiveStop)}, at ${tidy(naive)} min = (${naiveLetter})`
              : `checked every stop ${who} reaches: the first one where the ${ride} is already behind her is stop ${tidy(lastStop)}`}
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
