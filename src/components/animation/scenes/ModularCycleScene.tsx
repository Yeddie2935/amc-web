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

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/**
 * Repeating an event every `stepDays` on a `labels.length`-day cycle, asking
 * which start keeps every occurrence off one forbidden day. A whole week changes
 * nothing, so only `stepDays mod M` matters — and the real unlock is a **counting**
 * one, not a search: because that stride and the cycle length share no factor,
 * hopping by it would visit *every* position in M hops, so taking only `count` of
 * them leaves exactly `M − count` positions untouched. With 6 coupons on a 7-day
 * week that is **one hole**, and the hole is precisely where the hop she never
 * takes would have landed, `count × stride ≡ 4`. The forbidden day has nowhere
 * else to be, so it *is* the hole, and the start is simply that many days before
 * it — no case-by-case checking. The scene still runs the case check as an
 * independent second route, reporting for every possible start which occurrence
 * first lands on the forbidden day, so uniqueness is proved rather than assumed.
 * Beats: a real calendar where one 10-day hop wraps a row and lands 3 columns
 * over; the star of chords the +3 hops trace round the dial; the untouched node
 * with the never-taken hop drawn to it; the day names flying on from that hole
 * and a marker walking backwards to the start; then the real six-stop tour.
 * Stride, offsets, the hole, the start and every elimination are computed; data
 * `{ labels, stepDays, count, avoid, icon? }`.
 */
export function ModularCycleScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const labels = (Array.isArray(data.labels) ? data.labels : []).map((l) => String(l));
  const M = Math.max(2, labels.length);
  const stepDays = Math.max(1, Math.round(num(data.stepDays, 1)));
  const count = Math.max(2, Math.min(M, Math.round(num(data.count, 2))));
  const icon = data.icon ? String(data.icon) : "●";
  const short = (i: number) => labels[((i % M) + M) % M].slice(0, 3);

  // ---- one whole cycle changes nothing, so only the remainder moves anything ----
  const stride = stepDays % M;
  const weeks = Math.floor(stepDays / M);
  const g = gcd(stride, M);
  const orbit = M / g; // how many hops before the walk repeats itself

  // ---- where each occurrence lands, as an offset from the first ----
  const offsets = Array.from({ length: count }, (_, k) => (k * stride) % M);
  const visited = new Set(offsets);
  const missed = Array.from({ length: M }, (_, i) => i).filter((o) => !visited.has(o));
  const nextOffset = (count * stride) % M; // the hop she never takes
  const holeIsNextHop = missed.length === 1 && missed[0] === nextOffset;
  const hole = missed.length ? missed[0] : nextOffset;

  // ---- the forbidden position, and every start checked against it ----
  const avoidName = String(data.avoid ?? "");
  const avoidIdx = Math.max(
    0,
    labels.findIndex((l) => l.toLowerCase() === avoidName.toLowerCase()),
  );
  const firstHit = (s: number) => offsets.findIndex((o) => (s + o) % M === avoidIdx);
  const safe = Array.from({ length: M }, (_, s) => s).filter((s) => firstHit(s) < 0);
  const start = safe.length ? safe[0] : (avoidIdx - hole + M * 2) % M;
  const tour = offsets.map((o) => (start + o) % M);

  // ---- self-check: the hole route and the case check must agree ----
  const holeStart = (avoidIdx - hole + M * 2) % M;
  const storedOk =
    problem.shortAnswer == null || labels[start].toLowerCase() === String(problem.shortAnswer).trim().toLowerCase();
  const failure =
    safe.length !== 1
      ? `${safe.length} safe starts, expected exactly 1`
      : holeStart !== start
      ? `the hole gives ${labels[holeStart]} but the case check gives ${labels[start]}`
      : !storedOk
      ? `computed ${labels[start]} ≠ stored ${problem.shortAnswer}`
      : null;

  const letterFor = (text: string): string | null => {
    const hit = (problem.choices ?? []).find((c) => String(c.text).trim().toLowerCase() === text.trim().toLowerCase());
    return hit ? String(hit.label) : null;
  };
  const answerLetter = letterFor(labels[start]);

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 4 : Math.min(beat, 3);

  const W = 470;
  const H = 264;

  // ---------- the weekly dial, shared by every beat after the calendar ----------
  const CX = 140;
  const CY = 132;
  const R = 82;
  const NR = 19;
  const ang = (i: number) => ((-90 + (i * 360) / M) * Math.PI) / 180;
  const NX = (i: number) => CX + R * Math.cos(ang(i));
  const NY = (i: number) => CY + R * Math.sin(ang(i));
  const PX = 254; // left edge of the side panel

  // ---------- phase 0 geometry: a real calendar ----------
  const cellW = 44;
  const cellPitch = 46;
  const calX0 = 235 - (M * cellPitch - (cellPitch - cellW)) / 2;
  const rowY = [42, 90];
  const cellCx = (i: number) => calX0 + (i % M) * cellPitch + cellW / 2;
  const cellCy = (i: number) => rowY[Math.min(rowY.length - 1, Math.floor(i / M))] + 17;
  const walkTo = Math.min(stepDays, rowY.length * M - 1);

  /** A dial node: circle plus caption, both drawn at fixed coordinates. */
  const Node = ({
    i,
    fill,
    stroke,
    color,
    text,
    dashed,
    r = NR,
  }: {
    i: number;
    fill: string;
    stroke: string;
    color: string;
    text: string;
    dashed?: boolean;
    r?: number;
  }) => (
    <g>
      <circle
        cx={NX(i)}
        cy={NY(i)}
        r={r}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.6}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <text
        x={NX(i)}
        y={NY(i) + 3.5}
        textAnchor="middle"
        fontSize="10"
        fontWeight="800"
        fill={color}
        fontFamily={numberFont}
      >
        {text}
      </text>
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ================= phase 0: one hop on a real calendar ================= */}
        {phase === 0 && (
          <g>
            <text x={235} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              one every {stepDays} days — how far along the week is that?
            </text>

            {Array.from({ length: rowY.length * M }).map((_, i) => {
              const on = i === 0 || i === walkTo;
              return (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.03 * i }}>
                  <rect
                    x={calX0 + (i % M) * cellPitch}
                    y={rowY[Math.floor(i / M)]}
                    width={cellW}
                    height={34}
                    rx={5}
                    fill={on ? "#dcfce7" : "#f8fafc"}
                    stroke={on ? WIN : "#e2e8f0"}
                    strokeWidth={on ? 1.6 : 1.1}
                  />
                  <text
                    x={calX0 + (i % M) * cellPitch + 6}
                    y={rowY[Math.floor(i / M)] + 13}
                    fontSize="8.5"
                    fontWeight="700"
                    fill={DIM}
                    fontFamily={numberFont}
                  >
                    {i + 1}
                  </text>
                </motion.g>
              );
            })}

            {/* the same column, one row down, is the same weekday */}
            <motion.line
              x1={cellCx(0)}
              y1={cellCy(0) + 8}
              x2={cellCx(0)}
              y2={cellCy(M) - 8}
              stroke={IND}
              strokeWidth={1.6}
              strokeDasharray="4 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.55 }}>
              <rect x={cellCx(0) + 5} y={rowY[1] - 14} width={104} height={13} rx={3} fill="#fff" />
              <text x={cellCx(0) + 9} y={rowY[1] - 4} fontSize="8.5" fontWeight="800" fill={IND}>
                +{M} → same column
              </text>
            </motion.g>

            {/* the leftover steps, measured under the second row */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
              <line x1={cellCx(M)} y1={cellCy(M) + 8} x2={cellCx(M)} y2={132} stroke={WARN} strokeWidth={1.1} strokeDasharray="3 2" />
              <line x1={cellCx(walkTo)} y1={cellCy(walkTo) + 8} x2={cellCx(walkTo)} y2={132} stroke={WARN} strokeWidth={1.1} strokeDasharray="3 2" />
              <line x1={cellCx(M)} y1={132} x2={cellCx(walkTo)} y2={132} stroke={WARN} strokeWidth={2} />
              <text x={(cellCx(M) + cellCx(walkTo)) / 2} y={148} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                +{stride} more columns
              </text>
            </motion.g>

            {/* the cone walks the ten days, one cell at a time */}
            <motion.g
              animate={{
                x: Array.from({ length: walkTo + 1 }, (_, i) => cellCx(i) - cellCx(0)),
                y: Array.from({ length: walkTo + 1 }, (_, i) => cellCy(i) - cellCy(0)),
              }}
              transition={{ duration: 1.3, ease: "linear", delay: 0.2 }}
            >
              <text x={cellCx(0)} y={cellCy(0) + 9} textAnchor="middle" fontSize="19">
                {icon}
              </text>
            </motion.g>

            <motion.text
              x={235}
              y={176}
              textAnchor="middle"
              fontSize="18"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 2.2 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {stepDays} = {weeks} × {M} + {stride}
            </motion.text>
            <motion.text
              x={235}
              y={200}
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.45 }}
            >
              {stepDays} ≡ {stride} (mod {M})
            </motion.text>
            <text x={235} y={226} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM}>
              a whole week lands on the same weekday, so only the extra {stride} move her
            </text>
            <text x={235} y={244} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM}>
              every coupon falls {stride} weekdays after the one before
            </text>
          </g>
        )}

        {/* ================= phases 1–4 all live on the weekly dial ================= */}
        {phase > 0 && (
          <g>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e2e8f0" strokeWidth={1.4} />

            {/* the chords the hops trace: a star, because the stride skips positions */}
            {phase <= 2 &&
              offsets.slice(0, -1).map((o, j) => (
                <motion.line
                  key={`c${j}`}
                  x1={NX(o)}
                  y1={NY(o)}
                  x2={NX(offsets[j + 1])}
                  y2={NY(offsets[j + 1])}
                  stroke={IND}
                  strokeWidth={1.8}
                  strokeOpacity={0.55}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.35, delay: 0.35 + j * 0.35 }}
                />
              ))}

            {/* the hop she never takes — the one that would close the star */}
            {phase === 2 && holeIsNextHop && (
              <motion.line
                x1={NX(offsets[count - 1])}
                y1={NY(offsets[count - 1])}
                x2={NX(hole)}
                y2={NY(hole)}
                stroke={WARN}
                strokeWidth={2.2}
                strokeDasharray="5 4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              />
            )}

            {/* the real tour, drawn only once the start is known */}
            {phase === 4 &&
              tour.slice(0, -1).map((d, j) => (
                <motion.line
                  key={`t${j}`}
                  x1={NX(d)}
                  y1={NY(d)}
                  x2={NX(tour[j + 1])}
                  y2={NY(tour[j + 1])}
                  stroke={WIN}
                  strokeWidth={1.8}
                  strokeOpacity={0.5}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + j * 0.4 }}
                />
              ))}

            {/* ---- the nodes ---- */}
            {Array.from({ length: M }).map((_, i) => {
              if (phase === 1) {
                const k = offsets.indexOf(i);
                const on = k >= 0;
                return (
                  <motion.g
                    key={i}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16, delay: on ? 0.4 + k * 0.35 : 0.1 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <Node
                      i={i}
                      fill={on ? "#eef2ff" : "#f8fafc"}
                      stroke={on ? IND : "#e2e8f0"}
                      color={on ? IND : DIM}
                      text={`+${i}`}
                    />
                  </motion.g>
                );
              }
              if (phase === 2) {
                const k = offsets.indexOf(i);
                const on = k >= 0;
                return (
                  <motion.g
                    key={i}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 + i * 0.06 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <Node
                      i={i}
                      fill={on ? "#dcfce7" : "#fef3c7"}
                      stroke={on ? WIN : WARN}
                      color={on ? "#166534" : WARN}
                      text={on ? `${k + 1}` : `+${i}`}
                      dashed={!on}
                      r={on ? NR : NR + 2}
                    />
                  </motion.g>
                );
              }
              // phases 3 and 4 carry the real names
              const dayIdx = (avoidIdx - hole + i + M * 2) % M;
              const isAvoid = dayIdx === avoidIdx;
              const isStart = i === 0;
              const inTour = phase === 4 && tour.includes(dayIdx);
              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 16,
                    delay: phase === 3 ? 0.2 + ((M - i) % M) * 0.16 : 0.1 + i * 0.05,
                  }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <Node
                    i={i}
                    fill={isAvoid ? "#fee2e2" : phase === 4 && inTour ? "#dcfce7" : isStart && phase === 3 ? "#dcfce7" : "#f8fafc"}
                    stroke={isAvoid ? BAD : phase === 4 && inTour ? WIN : isStart && phase === 3 ? WIN : "#cbd5e1"}
                    color={isAvoid ? BAD : phase === 4 && inTour ? "#166534" : isStart && phase === 3 ? "#166534" : DIM}
                    text={short(dayIdx)}
                    dashed={isAvoid}
                    r={isAvoid ? NR + 1 : NR}
                  />
                </motion.g>
              );
            })}

            {/* the cone rides the hops */}
            {(phase === 1 || phase === 4) && (
              <motion.g
                animate={{
                  x: offsets.map((o) => NX(o) - NX(offsets[0])),
                  y: offsets.map((o) => NY(o) - NY(offsets[0])),
                }}
                transition={{ duration: 0.35 * (count - 1), ease: "linear", delay: 0.35 }}
              >
                <text x={NX(offsets[0])} y={NY(offsets[0]) - NR - 5} textAnchor="middle" fontSize="17">
                  {icon}
                </text>
              </motion.g>
            )}

            {/* phase 3 walks a marker backwards from the hole to the start */}
            {phase === 3 &&
              Array.from({ length: hole + 1 }).map((_, t) => {
                const i = hole - t;
                if (t === 0) return null;
                return (
                  <motion.g key={`b${t}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 + t * 0.28 }}>
                    {/* inside the ring — outside it, the top node collides with the headline */}
                    <text
                      x={CX + (NX(i) - CX) * 0.62}
                      y={CY + (NY(i) - CY) * 0.62 + 3.5}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="800"
                      fill={t === hole ? WIN : WARN}
                      fontFamily={numberFont}
                    >
                      −{t}
                    </text>
                  </motion.g>
                );
              })}
            {phase === 3 && (
              <motion.g
                animate={{
                  x: Array.from({ length: hole + 1 }, (_, t) => NX(hole - t) - NX(hole)),
                  y: Array.from({ length: hole + 1 }, (_, t) => NY(hole - t) - NY(hole)),
                }}
                transition={{ duration: 0.28 * hole, ease: "linear", delay: 1.7 }}
              >
                <circle cx={NX(hole)} cy={NY(hole)} r={NR + 5} fill="none" stroke={WARN} strokeWidth={2.4} />
              </motion.g>
            )}

            {/* ---- the side panel ---- */}
            {phase === 1 && (
              <g>
                <text x={PX} y={20} fontSize="11" fontWeight="800" fill={INK}>
                  each coupon, {stride} weekdays on
                </text>
                {offsets.map((o, k) => {
                  const raw = k * stride;
                  return (
                    <motion.g
                      key={k}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.4 + k * 0.35 }}
                    >
                      <rect x={PX} y={32 + k * 30} width={200} height={24} rx={6} fill="#eef2ff" stroke={IND} strokeWidth={1.1} />
                      <text x={PX + 10} y={48 + k * 30} fontSize="11" fontWeight="800" fill={IND} fontFamily={numberFont}>
                        {icon} {k + 1}
                      </text>
                      <text x={PX + 52} y={48 + k * 30} fontSize="10.5" fontWeight="700" fill={INK} fontFamily={numberFont}>
                        +{raw}
                        {raw !== o ? ` ≡ +${o}` : ""} {raw !== o ? `(mod ${M})` : ""}
                      </text>
                    </motion.g>
                  );
                })}
                <motion.text
                  x={PX}
                  y={40 + count * 30}
                  fontSize="10"
                  fontWeight="700"
                  fill={DIM}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + count * 0.35 }}
                >
                  {count} different days — none repeats
                </motion.text>
              </g>
            )}

            {phase === 2 && (
              <g>
                <text x={PX} y={20} fontSize="11" fontWeight="800" fill={INK}>
                  why exactly one is left out
                </text>
                {[
                  `${stride} and ${M} share no factor,`,
                  `so hopping +${stride} would reach`,
                  `all ${M} days in ${orbit} hops.`,
                  ``,
                  `She takes only ${count} of them,`,
                  `so ${M - count} day${M - count === 1 ? " is" : "s are"} never touched.`,
                ].map((t, i) => (
                  <motion.text
                    key={i}
                    x={PX}
                    y={40 + i * 17}
                    fontSize="10"
                    fontWeight="700"
                    fill={DIM}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.14 }}
                  >
                    {t}
                  </motion.text>
                ))}
                {holeIsNextHop && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                    <rect x={PX} y={150} width={200} height={54} rx={8} fill="#fef3c7" stroke={WARN} strokeWidth={1.3} />
                    <text x={PX + 10} y={168} fontSize="10" fontWeight="800" fill={WARN}>
                      the hop she never takes:
                    </text>
                    <text x={PX + 10} y={188} fontSize="12.5" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                      +{stride} × {count} = +{count * stride} ≡ +{hole}
                    </text>
                  </motion.g>
                )}
                <motion.text
                  x={PX}
                  y={224}
                  fontSize="10.5"
                  fontWeight="800"
                  fill={INK}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  the gap sits +{hole} after the start
                </motion.text>
              </g>
            )}

            {phase === 3 && (
              <g>
                <text x={PX} y={20} fontSize="11" fontWeight="800" fill={INK}>
                  {avoidName} has nowhere else to go
                </text>
                {[
                  `No circled date is ${avoidName},`,
                  `but every day except the gap`,
                  `does get circled.`,
                  ``,
                  `So the gap is ${avoidName} itself.`,
                ].map((t, i) => (
                  <motion.text
                    key={i}
                    x={PX}
                    y={40 + i * 17}
                    fontSize="10"
                    fontWeight="700"
                    fill={DIM}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.14 }}
                  >
                    {t}
                  </motion.text>
                ))}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                  <rect x={PX} y={136} width={200} height={30} rx={8} fill="#fee2e2" stroke={BAD} strokeWidth={1.2} />
                  <text x={PX + 10} y={156} fontSize="11" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                    start + {hole} = {labels[avoidIdx]}
                  </text>
                </motion.g>
                <motion.g
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.7 + hole * 0.28 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <rect x={PX} y={176} width={200} height={34} rx={8} fill="#dcfce7" stroke={WIN} strokeWidth={1.4} />
                  <text x={PX + 10} y={198} fontSize="12" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                    start = {labels[start]}
                  </text>
                </motion.g>
                <motion.text
                  x={PX}
                  y={230}
                  fontSize="10"
                  fontWeight="700"
                  fill={DIM}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 + hole * 0.28 }}
                >
                  {hole} day{hole === 1 ? "" : "s"} back from {avoidName}
                </motion.text>
              </g>
            )}

            {phase === 4 && (
              <g>
                <text x={PX} y={18} fontSize="11" fontWeight="800" fill={INK}>
                  every other start does hit {avoidName}
                </text>
                {Array.from({ length: M }).map((_, s) => {
                  const j = firstHit(s);
                  const ok = j < 0;
                  return (
                    <motion.g
                      key={s}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "spring", stiffness: 240, damping: 19, delay: 1.6 + s * 0.11 }}
                    >
                      <rect
                        x={PX}
                        y={28 + s * 27}
                        width={200}
                        height={22}
                        rx={6}
                        fill={ok ? "#dcfce7" : "#f8fafc"}
                        stroke={ok ? WIN : "#e2e8f0"}
                        strokeWidth={ok ? 1.5 : 1}
                      />
                      <text x={PX + 9} y={43 + s * 27} fontSize="10" fontWeight="800" fill={ok ? "#166534" : INK} fontFamily={numberFont}>
                        {short(s)}
                      </text>
                      <text x={PX + 44} y={43 + s * 27} fontSize="9.5" fontWeight="700" fill={ok ? WIN : BAD} fontFamily={numberFont}>
                        {ok ? `✓ never lands on ${short(avoidIdx)}` : `✗ coupon ${j + 1} is a ${short(avoidIdx)}`}
                      </text>
                    </motion.g>
                  );
                })}
                <motion.text
                  x={PX}
                  y={236}
                  fontSize="9.5"
                  fontWeight="700"
                  fill={DIM}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 + M * 0.11 }}
                >
                  exactly one start survives
                </motion.text>
              </g>
            )}

            {/* headline for the dial beats */}
            <text x={CX} y={14} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK}>
              {phase === 1
                ? `${count} hops of +${stride}`
                : phase === 2
                ? `${M - count} day never circled`
                : phase === 3
                ? `the gap must be ${avoidName}`
                : `starting ${labels[start]}`}
            </text>
            {phase === 4 && (
              <motion.text
                x={CX}
                y={250}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                {tour.map((d) => short(d)).join(" · ")}
              </motion.text>
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
          color: phase === 4 ? "#166534" : "#4338ca",
          background: phase === 4 ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${phase === 4 ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {phase === 0
          ? `${stepDays} ≡ ${stride} (mod ${M})`
          : phase === 1
          ? `${count} hops land on ${visited.size} different days`
          : phase === 2
          ? `only +${hole} is never reached`
          : phase === 3
          ? `+${hole} = ${labels[avoidIdx]}, so start = ${labels[start]}`
          : `${labels[start]}${answerLetter ? ` — choice ${answerLetter}` : ""}`}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 3.2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
