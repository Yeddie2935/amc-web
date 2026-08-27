import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const WARN = "#b45309";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

type Pt = { x: number; y: number };

/** Area of the lens where two circles of radius R and r, centres d apart, meet. */
function lensArea(R: number, r: number, d: number): number {
  if (d >= R + r) return 0;
  if (d <= Math.abs(R - r)) return Math.PI * Math.min(R, r) ** 2;
  return (
    R * R * Math.acos((d * d + R * R - r * r) / (2 * d * R)) +
    r * r * Math.acos((d * d + r * r - R * R) / (2 * d * r)) -
    0.5 * Math.sqrt((-d + r + R) * (d + r - R) * (d - r + R) * (d + r + R))
  );
}

/**
 * Fill a region with exactly `n` evenly spread points. A hex grid is laid over
 * the region and its spacing bisected until it just holds n points, so the
 * dots come out as spread as the region allows; the few extras are dropped
 * from the region's rim (farthest from the centroid of what the grid found).
 */
function pack(inside: (x: number, y: number) => boolean, box: number[], n: number): Pt[] {
  const [x0, y0, x1, y1] = box;
  const gen = (s: number): Pt[] => {
    const pts: Pt[] = [];
    const dy = (s * Math.sqrt(3)) / 2;
    for (let row = 0, y = y0; y <= y1; row += 1, y += dy) {
      for (let x = x0 + (row % 2 ? s / 2 : 0); x <= x1; x += s) {
        if (inside(x, y)) pts.push({ x, y });
      }
    }
    return pts;
  };
  let lo = 3;
  let hi = 120;
  for (let i = 0; i < 36; i += 1) {
    const mid = (lo + hi) / 2;
    if (gen(mid).length >= n) lo = mid;
    else hi = mid;
  }
  const pts = gen(lo);
  const cx = pts.reduce((a, p) => a + p.x, 0) / (pts.length || 1);
  const cy = pts.reduce((a, p) => a + p.y, 0) / (pts.length || 1);
  return pts
    .sort((p, q) => (p.x - cx) ** 2 + (p.y - cy) ** 2 - ((q.x - cx) ** 2 + (q.y - cy) ** 2))
    .slice(0, n);
}

/**
 * Two overlapping groups inside a known population — inclusion–exclusion. The
 * whole idea is that the two **rosters** hold more names than there are people:
 * anyone in both groups is written down twice, everyone else once, so laying
 * the rosters end to end overshoots the headcount by *exactly* the size of the
 * overlap. The scene makes that literal — the two roster bars grow past a grey
 * headcount track and the sticking-out piece is measured — and then the Venn
 * beat pays it off by drawing the shared students **twice**, one dot per
 * roster, and letting the pairs visibly **merge into one**, so 124 names
 * collapse into 93 people in front of you. The closing beat lifts the overlap
 * back out of the asked-for circle, leaving a countable answer.
 *
 * The Venn is drawn **area-proportional**: the radii come from the counts and
 * the centre distance is bisected until the lens area really is the overlap's
 * share, so every region's area is proportional to the number of people in it
 * and the dots sit at one uniform density across the whole diagram. Every dot
 * is a real person — the regions are packed with exactly aOnly / both / bOnly
 * points, so the answer can be counted off the picture.
 *
 * The overlap, both exclusive counts and the region areas are all computed, the
 * parts are re-checked against the total, and the closing beat **prices the
 * near misses** — never subtracting, stopping at the overlap, or subtracting
 * the two rosters — matching each against `problem.choices` so distractors are
 * discovered rather than authored; data
 * `{ total, sets: ["Math|70|➗", "Language|54|🌍"], ask?, neither?, unit? }`
 * with `ask` one of `a-only` (default), `b-only`, `both`, `neither`.
 */
export function TwoSetOverlapScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = Math.max(1, Math.round(num(data.total, 1)));
  const neither = Math.max(0, Math.round(num(data.neither, 0)));
  const unit = String(data.unit ?? "students");
  const raw = (Array.isArray(data.sets) ? data.sets : []).map((s) => String(s).split("|"));
  const sets = raw.map(([label, count, icon]) => ({
    label: label ?? "",
    count: Math.round(num(count, 0)),
    icon: icon ?? "",
  }));
  const A = sets[0] ?? { label: "A", count: 0, icon: "" };
  const B = sets[1] ?? { label: "B", count: 0, icon: "" };

  // ---- inclusion–exclusion: the roster overshoot is the overlap ----
  const union = total - neither;
  const names = A.count + B.count;
  const both = names - union;
  const aOnly = A.count - both;
  const bOnly = B.count - both;
  const ask = String(data.ask ?? "a-only");
  const asked =
    ask === "both" ? both : ask === "b-only" ? bOnly : ask === "neither" ? neither : aOnly;
  const askedLabel =
    ask === "both"
      ? `in both classes`
      : ask === "neither"
      ? `in neither class`
      : `only ${ask === "b-only" ? B.label.toLowerCase() : A.label.toLowerCase()}`;

  const stated = problem.shortAnswer == null ? null : Number(String(problem.shortAnswer).replace(/[^\d.-]/g, ""));
  const partsOk = aOnly + both + bOnly + neither === total;
  const signOk = both >= 0 && aOnly >= 0 && bOnly >= 0;
  const answerOk = stated == null || stated === asked;
  const failure = !signOk
    ? `regions came out negative (both ${both})`
    : !partsOk
    ? `${aOnly} + ${both} + ${bOnly} + ${neither} ≠ ${total}`
    : !answerOk
    ? `scene gets ${asked}, problem says ${stated}`
    : null;

  // ---- near misses, discovered by matching real slips against the choices ----
  const choiceFor = (v: number) =>
    (problem.choices ?? []).find(
      (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === v
    )?.label ?? null;
  const slips = [
    { v: A.count, why: "never subtracts" },
    { v: both, why: "stops at the overlap" },
    { v: Math.abs(A.count - B.count), why: `${A.count} − ${B.count}` },
  ]
    .map((s) => ({ ...s, letter: choiceFor(s.v) }))
    .filter((s) => s.letter != null && s.v !== asked)
    .filter((s, i, all) => all.findIndex((t) => t.letter === s.letter) === i);

  // ---- area-proportional Venn: every region's area matches its headcount ----
  const rA0 = Math.sqrt(A.count / Math.PI);
  const rB0 = Math.sqrt(B.count / Math.PI);
  let lo = Math.abs(rA0 - rB0) + 1e-6;
  let hi = rA0 + rB0 - 1e-6;
  for (let i = 0; i < 70; i += 1) {
    const mid = (lo + hi) / 2;
    if (lensArea(rA0, rB0, mid) > both) lo = mid;
    else hi = mid;
  }
  const f = 240 / (rA0 + (lo + hi) / 2 + rB0);
  const rA = rA0 * f;
  const rB = rB0 * f;
  const d = ((lo + hi) / 2) * f;

  const W = 470;
  const H = 300;
  const cy = 150;
  const cAx = (W - (rA + d + rB)) / 2 + rA;
  const cBx = cAx + d;
  const PAD = 8;
  const dA = (x: number, y: number) => Math.hypot(x - cAx, y - cy);
  const dB = (x: number, y: number) => Math.hypot(x - cBx, y - cy);
  const box = [cAx - rA, cy - rA, cBx + rB, cy + rA];
  const ptsA = pack((x, y) => dA(x, y) <= rA - PAD && dB(x, y) >= rB + PAD, box, aOnly);
  const ptsM = pack((x, y) => dA(x, y) <= rA - PAD && dB(x, y) <= rB - PAD, box, both);
  const ptsB = pack((x, y) => dB(x, y) <= rB - PAD && dA(x, y) >= rA + PAD, box, bOnly);

  // the notch directly above where the arcs cross is outside both circles, so a
  // label for the lens can sit there without landing on any dot
  const xi = (d * d + rA * rA - rB * rB) / (2 * d);
  const notchX = cAx + xi;
  const notchY = cy - Math.sqrt(Math.max(1, rA * rA - xi * xi));

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const drop = Math.max(0, 4 - totalSteps);
  const phase = isFinal ? 3 : Math.min(beat + drop, 2);

  const Dot = ({ p, fill, r = 4.6, delay = 0 }: { p: Pt; fill: string; r?: number; delay?: number }) => (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 18, delay }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      <circle cx={p.x} cy={p.y} r={r} fill={fill} />
    </motion.g>
  );

  const Circles = ({ slide = false }: { slide?: boolean }) => (
    <g>
      <motion.g
        initial={slide ? { x: -46, opacity: 0 } : { opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
      >
        <circle cx={cAx} cy={cy} r={rA} fill={IND} fillOpacity={0.07} stroke={IND} strokeWidth={2} />
      </motion.g>
      <motion.g
        initial={slide ? { x: 46, opacity: 0 } : { opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
      >
        <circle cx={cBx} cy={cy} r={rB} fill={TEAL} fillOpacity={0.07} stroke={TEAL} strokeWidth={2} />
      </motion.g>
    </g>
  );

  const SideLabel = ({ side, icon, label, count, colour }: { side: "l" | "r"; icon: string; label: string; count: number; colour: string }) => (
    <g>
      <text x={side === "l" ? 8 : W - 8} y={cy - 6} textAnchor={side === "l" ? "start" : "end"} fontSize="11" fontWeight="800" fill={colour}>
        {icon} {label}
      </text>
      <text x={side === "l" ? 8 : W - 8} y={cy + 12} textAnchor={side === "l" ? "start" : "end"} fontSize="14" fontWeight="800" fill={colour} fontFamily={numberFont}>
        {count}
      </text>
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", maxWidth: "100%", minWidth: 0, overflow: "hidden", boxSizing: "border-box", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", maxWidth: 480, minWidth: 0 }}>
        {/* ============ phase 0: the whole class, counted once each ============ */}
        {phase === 0 &&
          (() => {
            if (total > 80) {
              const x = 42;
              const w = W - 84;
              const unionW = (w * union) / total;
              return (
                <g>
                  <text x={W / 2} y={30} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                    begin with all {total} students
                  </text>
                  <rect x={x} y={72} width={w} height={52} rx={9} fill="#e2e8f0" stroke={DIM} strokeWidth={1.5} />
                  <motion.rect x={x} y={72} width={unionW} height={52} rx={9} fill={IND} fillOpacity={0.82} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.2 }} style={{ transformBox: "fill-box", transformOrigin: "left" }} />
                  <motion.text x={x + unionW / 2} y={95} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                    {union} favor ≥ 1 issue
                  </motion.text>
                  <motion.text x={x + unionW + (w - unionW) / 2} y={94} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                    {neither}
                  </motion.text>
                  <text x={x + unionW + (w - unionW) / 2} y={108} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM}>neither</text>
                  <motion.text x={W / 2} y={151} textAnchor="middle" fontSize="17" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 }}>
                    {total} − {neither} = {union}
                  </motion.text>
                  {[
                    { set: A, colour: IND, x: 46 },
                    { set: B, colour: TEAL, x: 246 },
                  ].map((c, i) => (
                    <motion.g key={c.set.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 140, damping: 16, delay: 1.3 + i * 0.18 }}>
                      <rect x={c.x} y={186} width={178} height={48} rx={10} fill={c.colour} fillOpacity={0.1} stroke={c.colour} strokeWidth={1.5} />
                      <text x={c.x + 14} y={215} fontSize="17">{c.set.icon}</text>
                      <text x={c.x + 40} y={205} fontSize="10.5" fontWeight="800" fill={c.colour}>{c.set.label}</text>
                      <text x={c.x + 40} y={222} fontSize="12" fontWeight="800" fill={c.colour} fontFamily={numberFont}>{c.set.count} yes votes</text>
                    </motion.g>
                  ))}
                  <text x={W / 2} y={268} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM}>
                    these two rosters can overlap inside the {union}
                  </text>
                </g>
              );
            }
            const cols = 16;
            const s = 25;
            const gx = (W - cols * s) / 2 + s / 2;
            return (
              <g>
                <text x={W / 2} y={26} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  {total} {unit} — each one counted exactly once
                </text>
                {Array.from({ length: total }).map((_, i) => {
                  const row = Math.floor(i / cols);
                  const rowN = Math.min(cols, total - row * cols);
                  const col = i - row * cols;
                  const x = gx + col * s + ((cols - rowN) * s) / 2;
                  const y = 74 + row * s;
                  const inUnion = i < union;
                  return <Dot key={i} p={{ x, y }} fill={inUnion ? IND : "#cbd5e1"} r={7.5} delay={0.15 + i * 0.012} />;
                })}
                {[
                  { set: A, colour: IND, x: 46 },
                  { set: B, colour: TEAL, x: 246 },
                ].map((c, i) => (
                  <motion.g
                    key={c.set.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 140, damping: 16, delay: 1.35 + i * 0.22 }}
                  >
                    <rect x={c.x} y={238} width={178} height={38} rx={10} fill={c.colour} fillOpacity={0.1} stroke={c.colour} strokeWidth={1.5} />
                    <text x={c.x + 14} y={262} fontSize="17">
                      {c.set.icon}
                    </text>
                    <text x={c.x + 40} y={255} fontSize="10.5" fontWeight="800" fill={c.colour}>
                      {c.set.label} class
                    </text>
                    <text x={c.x + 40} y={269} fontSize="12" fontWeight="800" fill={c.colour} fontFamily={numberFont}>
                      {c.set.count} {unit}
                    </text>
                  </motion.g>
                ))}
                <motion.text x={W / 2} y={224} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                  {neither === 0 ? "everyone is in at least one group" : `${total} − ${neither} = ${union} favor at least one issue`}
                </motion.text>
              </g>
            );
          })()}

        {/* ============ phase 1: the two rosters hold more names than there are people ============ */}
        {phase === 1 &&
          (() => {
            const x0 = 36;
            const px = 396 / names;
            const wA = A.count * px;
            const wB = B.count * px;
            const edge = x0 + union * px;
            const endX = x0 + names * px;
            const Bar = ({ x, w, colour, delay, label }: { x: number; w: number; colour: string; delay: number; label: string }) => (
              <g>
                <motion.rect
                  x={x}
                  y={68}
                  width={w}
                  height={34}
                  rx={5}
                  fill={colour}
                  fillOpacity={0.35}
                  stroke={colour}
                  strokeWidth={1.6}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ type: "spring", stiffness: 55, damping: 16, delay }}
                  style={{ transformBox: "fill-box", transformOrigin: "left" }}
                />
                {/* left-anchored, so the overshoot block cannot sit on top of it */}
                <motion.text
                  x={x + 12}
                  y={90}
                  textAnchor="start"
                  fontSize="13"
                  fontWeight="800"
                  fill={colour}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: delay + 0.5 }}
                >
                  {label}
                </motion.text>
              </g>
            );
            return (
              <g>
                <text x={W / 2} y={26} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  lay the two rosters end to end
                </text>

                <Bar x={x0} w={wA} colour={IND} delay={0.55} label={`${A.count}`} />
                <Bar x={x0 + wA} w={wB} colour={TEAL} delay={1.15} label={`${B.count}`} />
                {/* left-anchored too, so the dashed headcount line misses them */}
                <text x={x0 + 12} y={122} fontSize="10" fontWeight="700" fill={IND}>
                  {A.icon} {A.label} roster
                </text>
                <text x={x0 + wA + 12} y={122} fontSize="10" fontWeight="700" fill={TEAL}>
                  {B.icon} {B.label} roster
                </text>

                {/* the real headcount, drawn underneath so the overshoot is visible */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                  <rect x={x0} y={150} width={union * px} height={26} rx={5} fill="#e2e8f0" stroke={DIM} strokeWidth={1.4} />
                  <text x={x0 + (union * px) / 2} y={168} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    only {union} {unit}
                  </text>
                </motion.g>

                <motion.path
                  d={`M ${edge},56 L ${edge},188`}
                  stroke={INK}
                  strokeWidth={1.6}
                  strokeDasharray="5 4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.85 }}
                />

                {/* the piece sticking out past the headcount */}
                <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 180, damping: 16, delay: 2.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <rect x={edge} y={68} width={endX - edge} height={34} rx={5} fill={WARN} fillOpacity={0.85} />
                  <path d={`M ${edge},50 L ${endX},50`} stroke={WARN} strokeWidth={1.8} />
                  <path d={`M ${edge},44 L ${edge},56`} stroke={WARN} strokeWidth={1.8} />
                  <path d={`M ${endX},44 L ${endX},56`} stroke={WARN} strokeWidth={1.8} />
                  <text x={(edge + endX) / 2} y={38} textAnchor="middle" fontSize="12" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                    {ask === "both" ? "shared?" : both}
                  </text>
                </motion.g>

                <motion.text x={W / 2} y={218} textAnchor="middle" fontSize="16" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                  {A.count} + {B.count} = {names} names
                </motion.text>
                <motion.text x={W / 2} y={250} textAnchor="middle" fontSize="16" fontWeight="800" fill={WARN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }}>
                  {ask === "both" ? `${names} − ${union} = shared students` : `${names} − ${union} = ${both} names too many`}
                </motion.text>
                <motion.text x={W / 2} y={276} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}>
                  {ask === "both" ? "the overhang is exactly the twice-counted overlap" : `so ${both} ${unit} must have been written down twice`}
                </motion.text>
              </g>
            );
          })()}

        {/* ============ phase 2: the twice-written names merge into single people ============ */}
        {phase === 2 && (
          <g>
            <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              a student in both classes is on both rosters — one person, two names
            </text>
            <Circles slide />
            {ptsA.map((p, i) => (
              <Dot key={`a${i}`} p={p} fill={IND} delay={0.75 + i * 0.012} />
            ))}
            {ptsB.map((p, i) => (
              <Dot key={`b${i}`} p={p} fill={TEAL} delay={0.75 + i * 0.012} />
            ))}
            {/* each shared student drawn once per roster, then the pair merges */}
            {ptsM.map((p, i) => (
              <g key={`m${i}`}>
                {[
                  { off: -4.4, fill: IND },
                  { off: 4.4, fill: TEAL },
                ].map((half) => (
                  <motion.g
                    key={half.fill}
                    initial={{ x: half.off, y: half.off, opacity: 0 }}
                    animate={{ x: [half.off, half.off, 0], y: [half.off, half.off, 0], opacity: [0, 1, 1] }}
                    transition={{ duration: 2.4, times: [0, 0.28, 1], delay: 0.9 + i * 0.012 }}
                  >
                    <circle cx={p.x} cy={p.y} r={4.2} fill={half.fill} />
                  </motion.g>
                ))}
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r={5}
                  fill={WARN}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0, 1] }}
                  transition={{ duration: 2.7, times: [0, 0.82, 1], delay: 0.9 + i * 0.012 }}
                />
              </g>
            ))}

            <SideLabel side="l" icon={A.icon} label={A.label} count={A.count} colour={IND} />
            <SideLabel side="r" icon={B.icon} label={B.label} count={B.count} colour={TEAL} />

            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 3.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <path d={`M ${notchX},${notchY - 4} L ${notchX},52`} stroke={WARN} strokeWidth={1.5} />
              <rect x={notchX - 40} y={30} width={80} height={22} rx={11} fill={WARN} />
              <text x={notchX} y={45} textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                {ask === "both" ? "same students" : `${both} in both`}
              </text>
            </motion.g>

            <motion.text x={W / 2} y={H - 8} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.4 }}>
              {ask === "both" ? `${names} roster entries collapse to ${union} unique students` : `${names} names collapse to ${union} ${unit}`}
            </motion.text>
          </g>
        )}

        {/* ============ phase 3: lift the overlap back out of the asked-for circle ============ */}
        {phase === 3 && ask === "both" && (
          <g>
            <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              the excess roster entries identify the overlap
            </text>
            <Circles />
            {ptsA.map((p, i) => <Dot key={`fa${i}`} p={p} fill={IND} delay={0.08 + i * 0.005} />)}
            {ptsB.map((p, i) => <Dot key={`fb${i}`} p={p} fill={TEAL} delay={0.08 + i * 0.005} />)}
            {ptsM.map((p, i) => <Dot key={`fm${i}`} p={p} fill={WARN} delay={0.35 + i * 0.006} />)}
            <SideLabel side="l" icon={A.icon} label={A.label} count={A.count} colour={IND} />
            <SideLabel side="r" icon={B.icon} label={B.label} count={B.count} colour={TEAL} />
            <motion.g initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 190, damping: 15, delay: 1.25 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={notchX - 43} y={30} width={86} height={24} rx={12} fill={WARN} />
              <text x={notchX} y={46} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                both = {both}
              </text>
            </motion.g>
            <motion.text x={W / 2} y={H - 31} textAnchor="middle" fontSize="16" fontWeight="800" fill={WARN} fontFamily={numberFont} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.45 }}>
              {names} − {union} = {both}
            </motion.text>
            <motion.text x={W / 2} y={H - 9} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
              check: {aOnly} only first + {both} both + {bOnly} only second + {neither} neither = {total}
            </motion.text>
          </g>
        )}

        {phase === 3 && ask !== "both" && (
          <g>
            <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              take the {both} who also take {B.label.toLowerCase()} off the {A.label.toLowerCase()} roster
            </text>
            <Circles />
            {/* the empty lens, once its people have gone */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
              <path
                d={`M ${notchX},${notchY} A ${rA},${rA} 0 0 1 ${notchX},${2 * cy - notchY} A ${rB},${rB} 0 0 1 ${notchX},${notchY}`}
                fill="#fff"
                fillOpacity={0.85}
                stroke={WARN}
                strokeWidth={1.6}
                strokeDasharray="5 4"
              />
            </motion.g>
            {ptsB.map((p, i) => (
              <Dot key={`b${i}`} p={p} fill={TEAL} delay={0.1 + i * 0.008} />
            ))}
            {ptsM.map((p, i) => (
              <motion.g
                key={`m${i}`}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: H - 40 - p.y, opacity: [1, 1, 0] }}
                transition={{ duration: 1.5, times: [0, 0.2, 1], delay: 0.5 + i * 0.02 }}
              >
                <circle cx={p.x} cy={p.y} r={4.6} fill={WARN} />
              </motion.g>
            ))}
            {ptsA.map((p, i) => (
              <motion.g key={`a${i}`} initial={{ opacity: 1 }} animate={{ opacity: 1 }}>
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r={4.6}
                  initial={{ fill: IND }}
                  animate={{ fill: WIN }}
                  transition={{ duration: 0.4, delay: 1.8 + i * 0.014 }}
                />
              </motion.g>
            ))}

            <SideLabel side="r" icon={B.icon} label={B.label} count={B.count} colour={TEAL} />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }}>
              <text x={8} y={cy - 6} fontSize="11" fontWeight="800" fill={WIN}>
                {A.icon} {A.label} only
              </text>
              <text x={8} y={cy + 12} fontSize="14" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {aOnly}
              </text>
            </motion.g>

            <motion.text x={W / 2} y={H - 12} textAnchor="middle" fontSize="17" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 160, damping: 16, delay: 2.5 }}>
              {A.count} − {both} = {aOnly}
            </motion.text>
          </g>
        )}
      </svg>

      <motion.span
        key={phase}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
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
          maxWidth: "calc(100% - 16px)",
          boxSizing: "border-box",
          whiteSpace: "normal",
        }}
      >
        {phase === 0
          ? `${aOnly + both + bOnly + neither} ${unit}, ${A.count} in ${A.label.toLowerCase()}, ${B.count} in ${B.label.toLowerCase()}`
          : phase === 1
          ? ask === "both" ? `${names} roster entries extend past ${union} unique students` : `${names} names − ${union} ${unit} = ${both} counted twice`
          : phase === 2
          ? ask === "both" ? "each paired dot is one student recorded on both rosters" : `the ${both} in the middle are on both rosters`
          : `${asked} ${unit} are ${askedLabel}`}
      </motion.span>

      {isFinal && slips.length > 0 && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2 }}
          style={{ fontSize: 10.5, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 460 }}
        >
          {slips.length} of the {(problem.choices ?? []).length} choices are near misses:{" "}
          {slips.map((s) => `${s.letter} = ${s.v} (${s.why})`).join(" · ")}
        </motion.span>
      )}

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed: {failure}
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
