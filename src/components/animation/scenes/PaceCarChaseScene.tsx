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
const ROAD = "#cbd5e1";

const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(3))));
const tidy1 = (v: number) => (Number.isInteger(v) ? `${v}.0` : v.toFixed(1));

/**
 * A trip in two legs where the **overall average speed** is prescribed and the
 * second leg's distance is wanted. Setting up `(d₁+d)/(t₁+d/v₂) = target` and
 * clearing the fraction works but explains nothing, and the real trap is that an
 * average speed is *not* the average of the speeds. So the scene turns the
 * target into a **pace car**: averaging 50 mph for the whole trip means finishing
 * level with a car that simply drives a steady 50 the whole way. That reframes
 * the problem as a chase, which is something you can watch.
 *
 * The first leg then *loses ground* — in the same half hour the pace car covers
 * 25 miles to Qiang's 15, so he is 10 miles down — and the rest is a constant
 * closing speed: 55 against 50 gains 5 miles an hour, so a 10 mile gap takes 2
 * hours, and 2 hours at 55 is the answer. Both cars ride a real road drawn to
 * one mile scale, with a shared **time track** underneath filling at the same
 * rate for both, which is what makes "the same half hour" undeniable; the gap
 * band between them literally closes to nothing as they finish level.
 *
 * The closing beat prices every answer choice by **re-running the trip with that
 * distance** and reporting the average speed it actually produces — the averages
 * climb monotonically and cross the target exactly at the answer, so the
 * distractors are shown wrong rather than asserted wrong. Choice values are read
 * from `problem.choices` (normalising U+2212 to a hyphen first), and the
 * first-leg time, the deficit, the closing rate, the second leg and the final
 * total-over-total check are all computed; data
 * `{ distance, speed, nextSpeed, target, driver?, unit?, speedUnit?, timeUnit? }`.
 */
export function PaceCarChaseScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const distance = num(data.distance, 15);
  const speed = Math.max(1, num(data.speed, 30));
  const nextSpeed = Math.max(1, num(data.nextSpeed, 55));
  const target = Math.max(1, num(data.target, 50));
  const driver = typeof data.driver === "string" ? data.driver : "the driver";
  const unit = typeof data.unit === "string" ? data.unit : "miles";
  const speedUnit = typeof data.speedUnit === "string" ? data.speedUnit : "mph";

  // ---- the chase, entirely derived ----
  const t1 = distance / speed; // first leg's time
  const pace1 = target * t1; // where a steady-target car stands then
  const deficit = pace1 - distance; // how far behind that leaves him
  const gain = nextSpeed - target; // miles clawed back per hour
  const t2 = gain > 0 ? deficit / gain : 0; // hours needed to erase it
  const extra = nextSpeed * t2; // the answer
  const totalD = distance + extra;
  const totalT = t1 + t2;
  const avg = totalT > 0 ? totalD / totalT : 0;

  // ---- every choice re-run as a real trip ----
  const rows = (problem.choices ?? [])
    .map((c) => {
      const v = Number(
        String(c.text)
          .replace(/[−–—]/g, "-")
          .replace(/[^\d.-]/g, ""),
      );
      if (!Number.isFinite(v) || v < 0) return null;
      const a = (distance + v) / (t1 + v / nextSpeed);
      return { label: String(c.label), value: v, avg: a, exact: Math.abs(a - target) < 1e-9 };
    })
    .filter((r): r is { label: string; value: number; avg: number; exact: boolean } => r !== null);

  const stated = problem.shortAnswer == null ? null : Number(String(problem.shortAnswer).replace(/[^\d.]/g, ""));
  const fail =
    gain <= 0
      ? `the second speed ${nextSpeed} is not above the target ${target}`
      : deficit <= 0
        ? `the first leg is already at or above the target — no gap to close`
        : Math.abs(avg - target) > 1e-6
          ? `the finished trip averages ${tidy1(avg)}, not ${target}`
          : stated != null && Math.abs(stated - extra) > 1e-6
            ? `computed ${tidy(extra)} but the stored answer is ${tidy(stated)}`
            : null;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 272;

  // ---- one mile scale for the whole road ----
  const RX0 = 46;
  const RX1 = 446;
  const PXM = (RX1 - RX0) / Math.max(1, totalD);
  const mx = (m: number) => RX0 + m * PXM;

  const ROAD_TOP = 58;
  const ROAD_BOT = 134;
  const LANE_A = 85; // wheel line, driver
  const LANE_B = 121; // wheel line, pace car

  // ---- time track, shared by both cars so "the same half hour" is visible ----
  const TX0 = 128;
  const TX1 = 420;
  const tx = (h: number) => TX0 + (h / Math.max(1e-9, totalT)) * (TX1 - TX0);

  const mileStep = [5, 10, 25, 50, 100, 250].find((s) => totalD / s <= 6) ?? 100;
  const mileTicks: number[] = [];
  for (let m = 0; m <= totalD + 1e-9; m += mileStep) mileTicks.push(Number(m.toFixed(6)));

  const hourStep = totalT / 0.5 <= 6 ? 0.5 : totalT / 1 <= 6 ? 1 : totalT / 2;
  const hourTicks: number[] = [];
  for (let h = 0; h <= totalT + 1e-9; h += hourStep) hourTicks.push(Number(h.toFixed(6)));

  // ---- gap ladder: whole hours into the chase, plus the moment it closes ----
  const ladder: { h: number; gap: number }[] = [];
  for (let h = 0; h < t2 - 1e-9 && ladder.length < 3; h += 1) ladder.push({ h, gap: deficit - gain * h });
  ladder.push({ h: t2, gap: 0 });

  const DRIVE = { duration: 2.2, ease: "linear" as const };

  /** A little car drawn at the origin, facing right; wheels sit on y = 0. */
  const Car = ({ colour, ghost = false }: { colour: string; ghost?: boolean }) => (
    <g>
      <rect
        x={-17}
        y={-13}
        width={34}
        height={13}
        rx={3.5}
        fill={ghost ? "#fff" : colour}
        fillOpacity={ghost ? 0.9 : 1}
        stroke={colour}
        strokeWidth={1.6}
        strokeDasharray={ghost ? "3 2" : undefined}
      />
      <path
        d="M -9,-13 L -5,-21 L 7,-21 L 11,-13 Z"
        fill={ghost ? "#fff" : colour}
        fillOpacity={ghost ? 0.9 : 1}
        stroke={colour}
        strokeWidth={1.6}
        strokeDasharray={ghost ? "3 2" : undefined}
        strokeLinejoin="round"
      />
      <rect x={-6} y={-19.5} width={14} height={5.5} rx={1.5} fill={ghost ? "#e2e8f0" : "#dbeafe"} />
      <circle cx={-9} cy={0} r={4} fill="#334155" />
      <circle cx={9} cy={0} r={4} fill="#334155" />
    </g>
  );

  /** The road surface, identical on every beat so the beats stack up. */
  const Road = () => (
    <g>
      {/* wide enough that a car parked on the finish line still sits on tarmac */}
      <rect x={RX0 - 21} y={ROAD_TOP} width={RX1 - RX0 + 42} height={ROAD_BOT - ROAD_TOP} rx={6} fill={ROAD} />
      <line
        x1={RX0 - 8}
        y1={(LANE_A + LANE_B) / 2 + 3}
        x2={RX1 + 8}
        y2={(LANE_A + LANE_B) / 2 + 3}
        stroke="#fff"
        strokeWidth={2}
        strokeDasharray="10 8"
      />
    </g>
  );

  /** A lane's covered-ground trail: x is a fixed attribute, only width animates. */
  const Trail = ({ y, colour, from, to }: { y: number; colour: string; from: number; to: number }) => (
    <motion.rect
      x={RX0}
      y={y}
      height={4}
      rx={2}
      fill={colour}
      fillOpacity={0.95}
      initial={{ width: Math.max(0, from * PXM) }}
      animate={{ width: Math.max(0, to * PXM) }}
      transition={DRIVE}
    />
  );

  const MileRuler = () => (
    <g>
      <line x1={RX0} y1={150} x2={RX1} y2={150} stroke="#cbd5e1" strokeWidth={1.4} />
      {mileTicks.map((m) => (
        <g key={m}>
          <line x1={mx(m)} y1={146} x2={mx(m)} y2={154} stroke={DIM} strokeWidth={1.3} />
          <text x={mx(m)} y={165} textAnchor="middle" fontSize="9" fontWeight="700" fill={DIM} fontFamily={numberFont}>
            {tidy(m)}
          </text>
        </g>
      ))}
      <text x={RX0 - 10} y={165} textAnchor="end" fontSize="9" fontWeight="800" fill={DIM}>
        {unit}
      </text>
    </g>
  );

  const TimeTrack = ({ from, to }: { from: number; to: number }) => (
    <g>
      <text x={TX0 - 12} y={185} textAnchor="end" fontSize="10" fontWeight="800" fill={INK}>
        clock
      </text>
      <rect x={TX0} y={174} width={TX1 - TX0} height={11} rx={5.5} fill="#f1f5f9" stroke="#e2e8f0" strokeWidth={1} />
      <motion.rect
        x={TX0}
        y={174}
        height={11}
        rx={5.5}
        fill={WARN}
        fillOpacity={0.55}
        initial={{ width: Math.max(0, tx(from) - TX0) }}
        animate={{ width: Math.max(0, tx(to) - TX0) }}
        transition={DRIVE}
      />
      {hourTicks.map((h) => (
        <g key={h}>
          <line x1={tx(h)} y1={187} x2={tx(h)} y2={192} stroke={DIM} strokeWidth={1.2} />
          <text x={tx(h)} y={202} textAnchor="middle" fontSize="9" fontWeight="700" fill={DIM} fontFamily={numberFont}>
            {tidy(h)}
          </text>
        </g>
      ))}
      <text x={TX1 + 8} y={185} fontSize="9" fontWeight="800" fill={DIM}>
        hr
      </text>
    </g>
  );

  const title =
    phase === 0
      ? `${tidy(distance)} ${unit} at ${tidy(speed)} ${speedUnit} uses ${tidy(t1)} hours`
      : phase === 1
        ? `averaging ${tidy(target)} ${speedUnit} means finishing level with a steady ${tidy(target)} ${speedUnit} car`
        : phase === 2
          ? `${tidy(nextSpeed)} against ${tidy(target)} claws back ${tidy(gain)} ${unit} every hour`
          : `${tidy(t2)} hours at ${tidy(nextSpeed)} ${speedUnit} is ${tidy(extra)} more ${unit}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
          {title}
        </text>

        {/* ================= beat 0: the first leg spends half an hour ================= */}
        {phase === 0 && (
          <g>
            <Road />
            <Trail y={LANE_A + 5} colour={IND} from={0} to={distance} />
            <motion.g initial={{ x: mx(0) }} animate={{ x: mx(distance) }} transition={DRIVE}>
              <g transform={`translate(0 ${LANE_A})`}>
                <Car colour={IND} />
              </g>
            </motion.g>
            <text x={RX0 - 8} y={LANE_B - 4} fontSize="10" fontWeight="700" fill="#64748b">
              this lane is for the pace car
            </text>
            <MileRuler />
            <TimeTrack from={0} to={t1} />
            <motion.text
              x={W / 2}
              y={228}
              textAnchor="middle"
              fontSize="15"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.9 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {tidy(distance)} ÷ {tidy(speed)} = {tidy(t1)} hours
            </motion.text>
            <motion.text x={W / 2} y={252} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
              {tidy(speed)} is already below the {tidy(target)} {speedUnit} target, so {driver} starts out behind
            </motion.text>
          </g>
        )}

        {/* ================= beat 1: run the same half hour against a pace car ================= */}
        {phase === 1 && (
          <g>
            <Road />
            <Trail y={LANE_A + 5} colour={IND} from={0} to={distance} />
            <Trail y={LANE_B + 5} colour={WARN} from={0} to={pace1} />
            <motion.g initial={{ x: mx(0) }} animate={{ x: mx(distance) }} transition={DRIVE}>
              <g transform={`translate(0 ${LANE_A})`}>
                <Car colour={IND} />
              </g>
            </motion.g>
            <motion.g initial={{ x: mx(0) }} animate={{ x: mx(pace1) }} transition={DRIVE}>
              <g transform={`translate(0 ${LANE_B})`}>
                <Car colour={WARN} ghost />
              </g>
            </motion.g>
            {/* the gap they open in that one half hour */}
            <motion.rect
              x={mx(distance)}
              y={ROAD_TOP}
              width={Math.max(0, deficit * PXM)}
              height={ROAD_BOT - ROAD_TOP}
              fill={BAD}
              fillOpacity={0.18}
              stroke={BAD}
              strokeWidth={1.5}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 16, delay: 2.3 }}
              style={{ transformBox: "fill-box", transformOrigin: "left" }}
            />
            <motion.text
              x={mx((distance + pace1) / 2)}
              y={52}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill={BAD}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              {tidy(deficit)} {unit} behind
            </motion.text>
            <MileRuler />
            <TimeTrack from={0} to={t1} />
            <motion.text
              x={W / 2}
              y={228}
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 2.0 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {tidy(target)} × {tidy(t1)} = {tidy(pace1)}, and {tidy(pace1)} − {tidy(distance)} = {tidy(deficit)}
            </motion.text>
            <motion.text x={W / 2} y={252} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}>
              same clock for both cars — that half hour is where the whole deficit comes from
            </motion.text>
          </g>
        )}

        {/* ================= beat 2: 5 miles an hour closes the gap ================= */}
        {phase === 2 && (
          <g>
            <Road />
            <Trail y={LANE_A + 5} colour={IND} from={distance} to={totalD} />
            <Trail y={LANE_B + 5} colour={WARN} from={pace1} to={totalD} />
            <motion.g initial={{ x: mx(distance) }} animate={{ x: mx(totalD) }} transition={DRIVE}>
              <g transform={`translate(0 ${LANE_A})`}>
                <Car colour={IND} />
              </g>
            </motion.g>
            <motion.g initial={{ x: mx(pace1) }} animate={{ x: mx(totalD) }} transition={DRIVE}>
              <g transform={`translate(0 ${LANE_B})`}>
                <Car colour={WARN} ghost />
              </g>
            </motion.g>
            {/* the gap band travels with him and shrinks to nothing */}
            <motion.g initial={{ x: mx(distance) }} animate={{ x: mx(totalD) }} transition={DRIVE}>
              <motion.rect
                x={0}
                y={ROAD_TOP}
                height={ROAD_BOT - ROAD_TOP}
                fill={BAD}
                fillOpacity={0.18}
                stroke={BAD}
                strokeWidth={1.5}
                initial={{ width: Math.max(0, deficit * PXM) }}
                animate={{ width: 0 }}
                transition={DRIVE}
              />
            </motion.g>
            <MileRuler />
            <TimeTrack from={t1} to={totalT} />
            {/* the gap, hour by hour */}
            {ladder.map((row, i) => {
              const cw = 132;
              const cx = 38 + i * (cw + 12) + cw / 2;
              const closed = row.gap <= 1e-9;
              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.5 + i * 0.55 }}
                >
                  <rect
                    x={cx - cw / 2}
                    y={214}
                    width={cw}
                    height={40}
                    rx={8}
                    fill={closed ? "#dcfce7" : "#fef2f2"}
                    stroke={closed ? "#bbf7d0" : "#fecaca"}
                    strokeWidth={1.3}
                  />
                  <text x={cx} y={229} textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                    after {tidy(row.h)} hr
                  </text>
                  <text
                    x={cx}
                    y={246}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="800"
                    fill={closed ? WIN : BAD}
                    fontFamily={numberFont}
                  >
                    {closed ? "level" : `${tidy(row.gap)} ${unit} behind`}
                  </text>
                </motion.g>
              );
            })}
            <motion.text
              x={W / 2}
              y={268}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1 }}
            >
              {tidy(nextSpeed)} − {tidy(target)} = {tidy(gain)} gained per hour, so {tidy(deficit)} ÷ {tidy(gain)} = {tidy(t2)} hours
            </motion.text>
          </g>
        )}

        {/* ================= beat 3: the whole trip, and every choice re-run ================= */}
        {phase === 3 && (
          <g>
            <Road />
            {/* the two legs of the real trip */}
            <motion.rect
              x={RX0}
              y={LANE_A + 3}
              width={Math.max(0, distance * PXM)}
              height={6}
              rx={3}
              fill={IND}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.15 }}
              style={{ transformBox: "fill-box", transformOrigin: "left" }}
            />
            <motion.rect
              x={mx(distance)}
              y={LANE_A + 3}
              width={Math.max(0, extra * PXM)}
              height={6}
              rx={3}
              fill={WIN}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.5 }}
              style={{ transformBox: "fill-box", transformOrigin: "left" }}
            />
            <g transform={`translate(${mx(totalD)} ${LANE_A})`}>
              <Car colour={IND} />
            </g>
            <motion.rect
              x={RX0}
              y={LANE_B + 3}
              width={Math.max(0, totalD * PXM)}
              height={6}
              rx={3}
              fill={WARN}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.15 }}
              style={{ transformBox: "fill-box", transformOrigin: "left" }}
            />
            {/* the divider runs right through this label, so back it with the road */}
            <rect x={mx(totalD / 2) - 78} y={LANE_B - 20} width={156} height={16} rx={4} fill={ROAD} />
            <text x={mx(totalD / 2)} y={LANE_B - 8} textAnchor="middle" fontSize="10" fontWeight="800" fill={WARN} fontFamily={numberFont}>
              steady {tidy(target)} {speedUnit} → {tidy(totalD)} {unit}
            </text>
            <g transform={`translate(${mx(totalD)} ${LANE_B})`}>
              <Car colour={WARN} ghost />
            </g>
            {/* the two legs measured underneath */}
            {[
              { from: 0, to: distance, v: speed, d: distance, colour: IND },
              { from: distance, to: totalD, v: nextSpeed, d: extra, colour: WIN },
            ].map((seg, i) => (
              <g key={i}>
                <line x1={mx(seg.from) + 1} y1={146} x2={mx(seg.to) - 1} y2={146} stroke={seg.colour} strokeWidth={1.5} />
                <line x1={mx(seg.from) + 1} y1={142} x2={mx(seg.from) + 1} y2={150} stroke={seg.colour} strokeWidth={1.5} />
                <line x1={mx(seg.to) - 1} y1={142} x2={mx(seg.to) - 1} y2={150} stroke={seg.colour} strokeWidth={1.5} />
                <text x={(mx(seg.from) + mx(seg.to)) / 2} y={162} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={seg.colour} fontFamily={numberFont}>
                  {tidy(seg.d)} {unit}
                </text>
                <text x={(mx(seg.from) + mx(seg.to)) / 2} y={174} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM}>
                  at {tidy(seg.v)} {speedUnit}
                </text>
              </g>
            ))}
            <motion.text
              x={W / 2}
              y={192}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {tidy(distance)} + {tidy(extra)} = {tidy(totalD)} {unit} in {tidy(t1)} + {tidy(t2)} = {tidy(totalT)} hours
            </motion.text>
            <motion.text
              x={W / 2}
              y={208}
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.15 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {tidy(totalD)} ÷ {tidy(totalT)} = {tidy(target)} {speedUnit} ✓
            </motion.text>
            {/* every choice run as a real trip */}
            {rows.length > 0 && (
              <g>
                {rows.map((r, i) => {
                  const cw = (W - 40) / rows.length - 6;
                  const cx = 20 + i * ((W - 40) / rows.length) + cw / 2;
                  return (
                    <motion.g
                      key={r.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 190, damping: 17, delay: 1.4 + i * 0.13 }}
                    >
                      <rect
                        x={cx - cw / 2}
                        y={230}
                        width={cw}
                        height={38}
                        rx={7}
                        fill={r.exact ? "#dcfce7" : "#f8fafc"}
                        stroke={r.exact ? WIN : "#e2e8f0"}
                        strokeWidth={r.exact ? 1.8 : 1.2}
                      />
                      <text x={cx} y={244} textAnchor="middle" fontSize="10" fontWeight="800" fill={r.exact ? WIN : DIM} fontFamily={numberFont}>
                        {r.label}  {tidy(r.value)}
                      </text>
                      <text
                        x={cx}
                        y={260}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="800"
                        fill={r.exact ? WIN : r.avg < target ? BAD : WARN}
                        fontFamily={numberFont}
                      >
                        {tidy1(r.avg)}
                      </text>
                    </motion.g>
                  );
                })}
                <text x={W / 2} y={224} textAnchor="middle" fontSize="9" fontWeight="800" fill={DIM}>
                  each choice driven for real — the {speedUnit} it actually averages
                </text>
              </g>
            )}
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
          ? `${tidy(t1)} hours gone, only ${tidy(distance)} ${unit} covered`
          : phase === 1
            ? `${tidy(deficit)} ${unit} behind the pace car`
            : phase === 2
              ? `the gap closes after ${tidy(t2)} hours`
              : `${tidy(extra)} more ${unit} — the averages cross ${tidy(target)} exactly there`}
      </motion.span>

      {fail && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {fail}</span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
