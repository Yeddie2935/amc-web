import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const OUT = "#2563eb";
const STAY = "#7c3aed";
const BACK = "#0d9488";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const GRID = "#e2e8f0";
const MUTE = "#94a3b8";

const W = 360;
const H = 236;
const X0 = 44;
const X1 = 344;
const Y0 = 196; // distance 0
const Y1 = 40; // top of the distance axis

const tidy = (v: number) => String(Number(v.toFixed(4)));

/** 14.5 → "2:30 PM", 15 → "3 PM". */
function clock(h: number): string {
  const hh = Math.floor(h + 1e-9);
  const mm = Math.round((h - hh) * 60);
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return mm ? `${h12}:${String(mm).padStart(2, "0")} ${ampm}` : `${h12} ${ampm}`;
}

/** The car, drawn at the origin so a wrapper can place and tilt it. */
function Car({ color = OUT }: { color?: string }) {
  return (
    <g>
      <path d="M -7 -3.5 L -4.5 -8 L 4 -8 L 6.5 -3.5 Z" fill="#bfdbfe" stroke={INK} strokeWidth={1} strokeLinejoin="round" />
      <rect x={-10} y={-4} width={20} height={7} rx={2.4} fill={color} stroke={INK} strokeWidth={1} />
      <circle cx={-5} cy={3.6} r={2.4} fill={INK} />
      <circle cx={5} cy={3.6} r={2.4} fill={INK} />
    </g>
  );
}

/** Ling on the trail, drawn at the origin with her feet on the baseline. */
function Hiker() {
  return (
    <g>
      <circle cx={0} cy={-14.5} r={3.3} fill="#fcd34d" stroke={INK} strokeWidth={0.9} />
      <path d="M 0 -11 L 0 -4.5" stroke={INK} strokeWidth={1.7} strokeLinecap="round" />
      <path d="M 0 -4.5 L -3.6 1.5 M 0 -4.5 L 3.6 1.5" stroke={INK} strokeWidth={1.7} strokeLinecap="round" />
      <path d="M 0 -9 L 5 -6" stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
      <rect x={-5.4} y={-12} width={4.2} height={6.4} rx={1.3} fill="#16a34a" stroke={INK} strokeWidth={0.8} />
    </g>
  );
}

/**
 * "Which graph shows the trip?" — a distance-from-home graph built by driving
 * the journey along it. The three legs are the three things the graph can do:
 * a straight climb at the outbound speed, a **flat stretch while the car sits
 * parked** (the hike changes nothing about where the *car* is, which is what is
 * plotted), and a steeper fall home because the return speed is higher, so the
 * drive back takes less time than the drive out — the whole discrimination.
 * The closing beat swaps the chart for the contest's own five candidates, and
 * rejects them by arithmetic rather than by eye: each candidate is stored only
 * as its **peak height and the time it reaches zero**, from which the scene
 * computes the outbound speed (peak ÷ hours out) and the return speed
 * (peak ÷ hours down) that graph would imply, and checks both against the
 * speeds in the statement. Exactly one survives. The ghost return drawn on the
 * third beat is the same-speed-back mistake, and the scene finds which
 * candidate that ghost *is* rather than asserting it.
 * Data: { startHour, outHours, outSpeed, stayHours, backSpeed, unit?,
 *         stayLabel?, candidates: ["A|90|15", ...] } as label|peak|homeHour.
 */
export function TripGraphScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const startHour = num(data.startHour, 8);
  const outHours = num(data.outHours, 2);
  const outSpeed = num(data.outSpeed, 45);
  const stayHours = num(data.stayHours, 3);
  const backSpeed = num(data.backSpeed, 60);
  const unit = data.unit != null ? String(data.unit) : "miles";
  const rateUnit = data.rateUnit != null ? String(data.rateUnit) : "mph";
  const stayLabel = data.stayLabel != null ? String(data.stayLabel) : "hiking";

  const peak = outSpeed * outHours;
  const backHours = peak / backSpeed;
  const tArrive = startHour + outHours;
  const tLeave = tArrive + stayHours;
  const tHome = tLeave + backHours;

  const cands = (Array.isArray(data.candidates) ? data.candidates : [])
    .map((c) => String(c).split("|"))
    .filter((p) => p.length >= 3)
    .map(([label, pk, home]) => {
      const cPeak = Number(pk);
      const cHome = Number(home);
      const cOut = cPeak / outHours;
      const cBack = cPeak / (cHome - tLeave);
      return {
        label,
        peak: cPeak,
        home: cHome,
        out: cOut,
        back: cBack,
        outOk: Math.abs(cOut - outSpeed) < 1e-9,
        backOk: Math.abs(cBack - backSpeed) < 1e-9,
      };
    });
  const survivors = cands.filter((c) => c.outOk && c.backOk);
  const winner = survivors[0];
  const agrees = survivors.length === 1 && (!problem.answer || winner?.label === problem.answer);

  // the same-speed-home mistake, and which candidate it actually is
  const ghostHome = tLeave + peak / outSpeed;
  const ghostCand = cands.find((c) => Math.abs(c.peak - peak) < 1e-9 && Math.abs(c.home - ghostHome) < 1e-9);

  const maxY = Math.max(30, Math.ceil((Math.max(peak, ...cands.map((c) => c.peak)) * 1.25) / 30) * 30);
  const tEnd = Math.ceil(Math.max(tHome, ...cands.map((c) => c.home)));
  const xOf = (h: number) => X0 + ((h - startHour) / (tEnd - startHour)) * (X1 - X0);
  const yOf = (d: number) => Y0 - (d / maxY) * (Y0 - Y1);
  const hours = Array.from({ length: tEnd - startHour + 1 }, (_, i) => startHour + i);
  const rings = Array.from({ length: Math.floor(maxY / 30) }, (_, i) => (i + 1) * 30);

  const axisLabel = (h: number) => {
    const h12 = h % 12 === 0 ? 12 : h % 12;
    if (h === startHour) return `${h12}AM`;
    if (h === tEnd) return `${h12}PM`;
    return String(h12);
  };

  const P = [
    { x: xOf(startHour), y: yOf(0) },
    { x: xOf(tArrive), y: yOf(peak) },
    { x: xOf(tLeave), y: yOf(peak) },
    { x: xOf(tHome), y: yOf(0) },
  ];
  const legColor = [OUT, STAY, BACK];
  const angleOf = (i: number) => (Math.atan2(P[i + 1].y - P[i].y, P[i + 1].x - P[i].x) * 180) / Math.PI;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const preSteps = Math.max(1, totalSteps - 1);
  const legsShown = Math.min(3, Math.max(1, Math.ceil((3 * (step + 1)) / preSteps)));
  const leg = Math.min(2, legsShown - 1);

  const caption = isFinal
    ? `only one graph gives both ${tidy(outSpeed)} ${rateUnit} out and ${tidy(backSpeed)} ${rateUnit} back`
    : leg === 0
    ? `${tidy(outSpeed)} ${rateUnit} for ${tidy(outHours)} hours climbs to ${tidy(peak)} ${unit} from home`
    : leg === 1
    ? `${tidy(stayHours)} hours ${stayLabel}: the car sits at the trail, so the graph runs flat`
    : `${tidy(backSpeed)} ${rateUnit} is faster, so the way home is steeper and shorter — ${clock(tHome)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {isFinal ? (
          /* the contest's five candidates, each judged by the speeds it implies */
          <g>
            {cands.map((c, i) => {
              const row = i < 3 ? 0 : 1;
              const col = i < 3 ? i : i - 3;
              const cellX = (row === 0 ? 3 : 62) + col * 118;
              const cellY = row === 0 ? 14 : 126;
              const gx0 = cellX + 20;
              const gx1 = cellX + 112;
              const gy0 = cellY + 66;
              const gy1 = cellY + 14;
              const mx = (h: number) => gx0 + ((h - startHour) / (tEnd - startHour)) * (gx1 - gx0);
              const my = (d: number) => gy0 - (d / maxY) * (gy0 - gy1);
              const good = c.outOk && c.backOk;
              const d = `M ${mx(startHour)} ${my(0)} L ${mx(tArrive)} ${my(c.peak)} L ${mx(tLeave)} ${my(c.peak)} L ${mx(c.home)} ${my(0)}`;
              return (
                <motion.g key={c.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.12 }}>
                  {good && <rect x={cellX + 1} y={cellY - 4} width={114} height={106} rx={8} fill="#f0fdf4" stroke={WIN} strokeWidth={1.4} />}
                  <text x={cellX + 3} y={cellY + 8} fontSize="10" fontWeight="800" fill={good ? WIN : INK} fontFamily={numberFont}>
                    ({c.label})
                  </text>
                  <line x1={gx0} y1={gy1 - 3} x2={gx0} y2={gy0} stroke={MUTE} strokeWidth={1} />
                  <line x1={gx0} y1={gy0} x2={gx1 + 3} y2={gy0} stroke={MUTE} strokeWidth={1} />
                  <line x1={gx0 - 2.5} y1={my(c.peak)} x2={gx0 + 2.5} y2={my(c.peak)} stroke={MUTE} strokeWidth={1} />
                  <text x={gx0 - 4} y={my(c.peak) + 3} textAnchor="end" fontSize="7.5" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                    {tidy(c.peak)}
                  </text>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={good ? WIN : INK}
                    strokeWidth={1.8}
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, delay: 0.25 + i * 0.12 }}
                  />
                  <circle cx={mx(c.home)} cy={my(0)} r={2.4} fill={good ? WIN : INK} />
                  <text x={mx(c.home)} y={gy0 + 10} textAnchor="middle" fontSize="7.5" fontWeight="800" fill={good ? WIN : MUTE} fontFamily={numberFont}>
                    {clock(c.home)}
                  </text>
                  <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.12 }}>
                    <text x={cellX + 20} y={cellY + 88} fontSize="8" fontWeight="800" fill={c.outOk ? WIN : BAD} fontFamily={numberFont}>
                      out {tidy(c.out)} {c.outOk ? "✓" : "✗"}
                    </text>
                    <text x={cellX + 20} y={cellY + 99} fontSize="8" fontWeight="800" fill={c.backOk ? WIN : BAD} fontFamily={numberFont}>
                      back {tidy(c.back)} {c.backOk ? "✓" : "✗"}
                    </text>
                  </motion.g>
                </motion.g>
              );
            })}
          </g>
        ) : (
          /* the journey, driven onto the graph one leg per beat */
          <g>
            {rings.map((d) => (
              <g key={d}>
                <line x1={X0} y1={yOf(d)} x2={X1} y2={yOf(d)} stroke={GRID} strokeWidth={1} />
                <text x={X0 - 6} y={yOf(d) + 3.5} textAnchor="end" fontSize="8.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                  {d}
                </text>
              </g>
            ))}
            {hours.map((h) => (
              <g key={h}>
                <line x1={xOf(h)} y1={Y1} x2={xOf(h)} y2={Y0} stroke={GRID} strokeWidth={1} />
                <text x={xOf(h)} y={Y0 + 13} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                  {axisLabel(h)}
                </text>
              </g>
            ))}
            <line x1={X0} y1={Y1 - 6} x2={X0} y2={Y0} stroke={INK} strokeWidth={1.4} />
            <line x1={X0} y1={Y0} x2={X1 + 6} y2={Y0} stroke={INK} strokeWidth={1.4} />
            {/* inside the plot: outside it collides with the top tick and the headline */}
            <text x={X0 + 6} y={Y1 + 12} fontSize="8.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {unit}
            </text>

            {/* the slope triangle that fixes the peak */}
            <AnimatePresence>
              {leg === 0 && (
                <motion.g key="slope" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                  <line x1={P[0].x} y1={P[0].y} x2={P[1].x} y2={P[0].y} stroke={OUT} strokeWidth={1.2} strokeDasharray="4 3" />
                  <line x1={P[1].x} y1={P[0].y} x2={P[1].x} y2={P[1].y} stroke={OUT} strokeWidth={1.2} strokeDasharray="4 3" />
                  <text x={(P[0].x + P[1].x) / 2} y={P[0].y - 6} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={OUT} fontFamily={numberFont}>
                    {tidy(outHours)} hours
                  </text>
                  <text x={P[1].x + 7} y={(P[0].y + P[1].y) / 2} fontSize="9.5" fontWeight="800" fill={OUT} fontFamily={numberFont}>
                    {tidy(peak)} {unit}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>

            {/* the hike: the clock runs but the car does not move */}
            <AnimatePresence>
              {leg === 1 && (
                <motion.g key="stay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* she walks the trail and comes back to the car, riding above
                      the flat line so she never sits on top of it */}
                  <motion.g
                    initial={{ x: P[1].x + 18, y: P[1].y - 17 }}
                    animate={{ x: [P[1].x + 18, P[2].x - 30, P[2].x - 14], y: P[1].y - 17 }}
                    transition={{ duration: 1.6, times: [0, 0.62, 1], ease: "easeInOut", delay: 0.35 }}
                  >
                    <Hiker />
                  </motion.g>
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                    <path d={`M ${P[1].x} ${P[1].y + 8} l 0 6 L ${P[2].x} ${P[2].y + 14} l 0 -6`} fill="none" stroke={STAY} strokeWidth={1.3} />
                    <text x={(P[1].x + P[2].x) / 2} y={P[1].y + 27} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={STAY} fontFamily={numberFont}>
                      {tidy(stayHours)} hours, same {tidy(peak)} {unit}
                    </text>
                  </motion.g>
                </motion.g>
              )}
            </AnimatePresence>

            {/* the way home, against the way home at the outbound speed */}
            <AnimatePresence>
              {leg === 2 && (
                <motion.g key="back" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.path
                    d={`M ${P[2].x} ${P[2].y} L ${xOf(ghostHome)} ${yOf(0)}`}
                    fill="none"
                    stroke={BAD}
                    strokeWidth={1.4}
                    strokeDasharray="4 3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  />
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                    <circle cx={xOf(ghostHome)} cy={yOf(0)} r={2.6} fill={BAD} />
                    <text x={xOf(ghostHome) + 4} y={yOf(0) - 7} fontSize="8.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                      {clock(ghostHome)}
                    </text>
                  </motion.g>
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                    <circle cx={P[3].x} cy={P[3].y} r={2.8} fill={BACK} />
                    {/* clear of the car, which parks on this foot */}
                    <text x={P[3].x + 5} y={P[3].y - 24} fontSize="9" fontWeight="800" fill={BACK} fontFamily={numberFont}>
                      {clock(tHome)}
                    </text>
                  </motion.g>
                </motion.g>
              )}
            </AnimatePresence>

            {/* the trip itself */}
            {[0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d={`M ${P[i].x} ${P[i].y} L ${P[i + 1].x} ${P[i + 1].y}`}
                fill="none"
                stroke={legColor[i]}
                strokeWidth={2.6}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: legsShown > i ? 1 : 0 }}
                /* a round cap still paints a dot at pathLength 0, so hide it outright */
                opacity={legsShown > i ? 1 : 0}
                transition={{ duration: 0.9, delay: i === leg ? 0.3 : 0 }}
              />
            ))}
            {P.slice(0, legsShown + 1).map((p, i) => (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={3}
                fill={INK}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 + i * 0.1 }}
              />
            ))}

            {/* the car rides the leg this beat is about */}
            <motion.g
              initial={{ x: P[leg].x, y: P[leg].y, rotate: angleOf(leg) }}
              animate={{ x: P[leg + 1].x, y: P[leg + 1].y, rotate: angleOf(leg) }}
              transition={{ duration: 0.9, ease: "linear", delay: 0.3 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <Car color={legColor[leg]} />
            </motion.g>

            {/* the arithmetic for this leg */}
            <AnimatePresence mode="wait">
              <motion.g key={leg} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                {leg === 0 ? (
                  <text x={W / 2} y={22} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={OUT} fontFamily={numberFont}>
                    {tidy(outSpeed)} {rateUnit} × {tidy(outHours)} h = {tidy(peak)} {unit}
                  </text>
                ) : leg === 1 ? (
                  <text x={W / 2} y={22} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={STAY} fontFamily={numberFont}>
                    the car is parked — the graph goes flat
                  </text>
                ) : (
                  <>
                    <text x={W / 2} y={19} textAnchor="middle" fontSize="12" fontWeight="800" fill={BACK} fontFamily={numberFont}>
                      {tidy(peak)} ÷ {tidy(backSpeed)} = {tidy(backHours)} h → home {clock(tHome)}
                    </text>
                    <text x={W / 2} y={33} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                      at {tidy(outSpeed)} {rateUnit} it would take {tidy(peak / outSpeed)} h → {clock(ghostHome)}
                      {ghostCand ? ` (that is graph ${ghostCand.label})` : ""}
                    </text>
                  </>
                )}
              </motion.g>
            </AnimatePresence>
          </g>
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
            transition={{ delay: 2 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? MUTE : BAD, textAlign: "center" }}
          >
            {survivors.length !== 1
              ? `${survivors.length} graphs match both speeds — the data does not single one out`
              : !agrees
              ? `this lands on (${winner.label}), not the stored answer`
              : `${cands.filter((c) => !c.outOk).length} graphs get the peak wrong and ${cands.filter((c) => c.outOk && !c.backOk).length} gets the way home wrong`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
