import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const EXTRA = "#f59e0b";
const ARC = "#0f172a";

/** Keep a surd exact: 225 comes back "15", 32 comes back "4√2". */
function fmtSqrt(n: number): string {
  if (n < 0) return "—";
  const root = Math.sqrt(n);
  if (Number.isInteger(root)) return String(root);
  let out = 1;
  let rest = Math.round(n);
  for (let f = 2; f * f <= rest; f += 1) {
    while (rest % (f * f) === 0) {
      out *= f;
      rest /= f * f;
    }
  }
  return out === 1 ? `√${rest}` : `${out}√${rest}`;
}

const parseChoice = (text: string) =>
  Number(String(text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));

/**
 * A rectangle standing on the diameter of a semicircle with its two upper
 * corners on the arc. The height looks like the hard part, but it is handed over
 * by a single radius: the corner is *on the circle*, so joining it to the centre
 * makes a right triangle whose hypotenuse is the radius, whose vertical leg is
 * the height, and whose horizontal leg is **half the rectangle's width** —
 * because the two leftover pieces of the diameter are equal, which is exactly
 * what centres the rectangle. So the whole problem is one Pythagoras step on
 * legs the figure already gives.
 *
 * The beats earn each piece: the diameter measures itself and halves into the
 * radius, the centre drops in and the width label *splits* into two halves at
 * it, a compass arm sweeps round the arc to show every arc point is one radius
 * from the centre before landing on the corner, then the triangle resolves and
 * the rectangle fills with unit lines so the area is countable.
 *
 * Everything is computed from the three lengths along the diameter, the height
 * is kept exact as a surd, the scene checks that the two end pieces really are
 * equal (nothing else can put both top corners on the arc), and the closing beat
 * prices the slips that use the radius or the width as the height, naming the
 * answer choice each one hits.
 * Data: { leftPad, width, rightPad, unit?, labels? }.
 */
export function SemicircleRectScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const leftPad = num(data.leftPad, 0);
  const width = Math.max(0.001, num(data.width, 1));
  const rightPad = num(data.rightPad, leftPad);
  const unit = data.unit != null ? String(data.unit) : "";
  const names = (data.labels != null ? String(data.labels) : "F,D,A,E,C,B").split(",").map((s) => s.trim());
  const [nF, nD, nA, nE, nC, nB] = [names[0] ?? "F", names[1] ?? "D", names[2] ?? "A", names[3] ?? "E", names[4] ?? "C", names[5] ?? "B"];

  const diameter = leftPad + width + rightPad;
  const r = diameter / 2;
  const half = width / 2;
  const hSq = r * r - half * half;
  const h = Math.sqrt(Math.max(0, hSq));
  const area = width * h;

  // only equal end pieces can put both upper corners on the arc
  const centred = Math.abs(leftPad - rightPad) < 1e-9;
  const matches = problem.shortAnswer == null || Math.abs(parseChoice(String(problem.shortAnswer)) - area) < 1e-6;
  const failure = !centred
    ? `check failed: the end pieces are ${leftPad} and ${rightPad}, so the rectangle is not centred and its corners cannot both sit on the arc`
    : hSq <= 0
    ? `check failed: a width of ${width} does not fit inside a diameter of ${diameter}`
    : !matches
    ? `check failed: the figure gives ${fmtSqrt(hSq)} × ${width} = ${area}, the stored answer is ${problem.shortAnswer}`
    : "";
  const triple = Number.isInteger(half) && Number.isInteger(h) && Number.isInteger(r);

  // the two slips this figure invites, priced against the real choices
  const letterOf = (v: number) =>
    (problem.choices ?? []).find((c) => Math.abs(parseChoice(String(c.text)) - v) < 1e-6)?.label ?? "";
  const slips = [
    { label: `the radius ${r} as the height`, value: width * r },
    { label: `a square, ${width} tall`, value: width * width },
  ]
    .map((s) => ({ ...s, letter: letterOf(s.value) }))
    .filter((s) => s.letter !== "" && Math.abs(s.value - area) > 1e-9);

  const lastStep = totalSteps - 1;
  const isFinal = step >= lastStep;
  const hasCentre = isFinal || step >= 1;
  const swept = isFinal || step >= 2;

  // ---- geometry ----
  const W = 360;
  const H = 236;
  const baseY = 168;
  const cx = W / 2;
  const s = 278 / Math.max(1, diameter);
  const rPx = r * s;
  const halfPx = half * s;
  const hPx = h * s;
  const xF = cx - rPx;
  const xE = cx + rPx;
  const xD = cx - halfPx;
  const xA = cx + halfPx;
  const rectTop = baseY - hPx;
  const arcTop = baseY - rPx;

  // the compass arm's sweep, from the left end round to the corner
  const bAngle = Math.atan2(-(baseY - rectTop), xA - cx);
  const armSteps = 14;
  const armX: number[] = [];
  const armY: number[] = [];
  for (let i = 0; i <= armSteps; i += 1) {
    const t = Math.PI + (bAngle - Math.PI) * (i / armSteps);
    armX.push(cx + rPx * Math.cos(t));
    armY.push(baseY + rPx * Math.sin(t));
  }

  const measure = (x1: number, x2: number, label: string, colour: string, delay: number, key: string) => (
    <motion.g key={key} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <path d={`M ${x1 + 2},${baseY - 20} v 5 M ${x1 + 2},${baseY - 17.5} H ${x2 - 2} M ${x2 - 2},${baseY - 20} v 5`} fill="none" stroke={colour} strokeWidth={1.1} />
      <text x={(x1 + x2) / 2} y={baseY - 24} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={colour} fontFamily={numberFont}>
        {label}
      </text>
    </motion.g>
  );

  const caption = isFinal
    ? `${width} × ${fmtSqrt(hSq)} = ${area}${unit ? ` square ${unit}` : ""}`
    : step === 0
    ? `${leftPad} + ${width} + ${rightPad} = ${diameter} across, so every arc point is ${r} from the middle`
    : !swept
    ? `the end pieces match, so the middle of ${nF}${nE} is also the middle of ${nD}${nA} — ${half} either side`
    : `${nB} is on the arc, so O${nB} is a radius: ${r}² − ${half}² = ${Math.round(hSq)}, height ${fmtSqrt(hSq)}`;

  const note = failure
    ? failure
    : isFinal
    ? slips.length
      ? `slips: ${slips.map((sl) => `${sl.label} gives ${sl.value} (${sl.letter})`).join(", ")}`
      : ""
    : step === 0
    ? `the height of the rectangle is nowhere in the figure — but the radius is`
    : !swept
    ? `unequal end pieces could not put both ${nC} and ${nB} on the arc`
    : triple
    ? `${half}–${fmtSqrt(hSq)}–${r} is a Pythagorean triple, so the height comes out whole`
    : `the height stays exact: √${Math.round(hSq)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {/* the arch */}
        <motion.path
          d={`M ${xF},${baseY} A ${rPx},${rPx} 0 0 1 ${xE},${baseY}`}
          fill="none"
          stroke={ARC}
          strokeWidth={2.2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9 }}
        />
        <motion.line
          x1={xF}
          y1={baseY}
          x2={xE}
          y2={baseY}
          stroke={ARC}
          strokeWidth={2.2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        />

        {/* the inscribed rectangle, drawn to scale as the contest figure does */}
        <motion.rect
          x={xD}
          y={rectTop}
          width={xA - xD}
          height={hPx}
          fill={isFinal ? "#dcfce7" : "#e2e8f0"}
          stroke={isFinal ? WIN : "#64748b"}
          strokeWidth={1.6}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />

        {/* the area, made countable */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {Array.from({ length: Math.max(0, Math.round(width) - 1) }).map((_, i) => (
                <motion.line
                  key={`v${i}`}
                  x1={xD + (i + 1) * s}
                  x2={xD + (i + 1) * s}
                  y1={rectTop}
                  y2={baseY}
                  stroke={WIN}
                  strokeWidth={0.5}
                  opacity={0.45}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.02 }}
                />
              ))}
              {Array.from({ length: Math.max(0, Math.round(h) - 1) }).map((_, i) => (
                <motion.line
                  key={`hz${i}`}
                  x1={xD}
                  x2={xA}
                  y1={baseY - (i + 1) * s}
                  y2={baseY - (i + 1) * s}
                  stroke={WIN}
                  strokeWidth={0.5}
                  opacity={0.45}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.02 }}
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the axis of symmetry the equal end pieces create */}
        <AnimatePresence>
          {hasCentre && !isFinal && (
            <motion.line
              key="axis"
              x1={cx}
              x2={cx}
              y1={arcTop}
              y2={baseY}
              stroke={IND}
              strokeWidth={1}
              strokeDasharray="4 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* the right triangle the radius creates */}
        <AnimatePresence>
          {swept && (
            <motion.g key="tri" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 1.2 }}>
              <polygon points={`${cx},${baseY} ${xA},${baseY} ${xA},${rectTop}`} fill={EXTRA} opacity={0.22} />
              <path d={`M ${xA - 8},${baseY} v -8 h 8`} fill="none" stroke={EXTRA} strokeWidth={1.4} />
              <line x1={cx} y1={baseY} x2={xA} y2={rectTop} stroke={EXTRA} strokeWidth={1.8} />
              {/* the bracket above already names this leg until the final beat */}
              {isFinal && (
                <text
                  x={(cx + xA) / 2}
                  y={baseY + 12}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill="#92400e"
                  fontFamily={numberFont}
                  stroke="#fff"
                  strokeWidth={2.4}
                  paintOrder="stroke"
                >
                  {half}
                </text>
              )}
              <text
                x={xA + 8}
                y={(baseY + rectTop) / 2 + 4}
                fontSize="11"
                fontWeight="800"
                fill="#92400e"
                fontFamily={numberFont}
                stroke="#fff"
                strokeWidth={2.4}
                paintOrder="stroke"
              >
                {isFinal ? fmtSqrt(hSq) : "?"}
              </text>
              <text
                x={(cx + xA) / 2 - 12}
                y={(baseY + rectTop) / 2 - 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill="#92400e"
                fontFamily={numberFont}
                stroke="#fff"
                strokeWidth={2.4}
                paintOrder="stroke"
              >
                {r}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the compass arm: every point of the arc is one radius out */}
        <AnimatePresence>
          {swept && !isFinal && (
            <motion.g key="arm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.line
                x1={cx}
                y1={baseY}
                stroke={IND}
                strokeWidth={1.6}
                initial={{ x2: armX[0], y2: armY[0] }}
                animate={{ x2: armX, y2: armY }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
              <motion.circle
                r={3.4}
                fill={IND}
                initial={{ cx: armX[0], cy: armY[0] }}
                animate={{ cx: armX, cy: armY }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
            </motion.g>
          )}
        </AnimatePresence>

        {/* the three pieces of the diameter */}
        <AnimatePresence>
          {!hasCentre && (
            <motion.g key="meas" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {measure(xF, xD, `${leftPad}`, "#64748b", 0.8, "m0")}
              {measure(xD, xA, `${width}`, INK, 0.95, "m1")}
              {measure(xA, xE, `${rightPad}`, "#64748b", 1.1, "m2")}
            </motion.g>
          )}
        </AnimatePresence>

        {/* once centred, the width label splits in two at the middle */}
        <AnimatePresence>
          {hasCentre && !isFinal && (
            <motion.g key="halves" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.35 }}>
              {measure(xD, cx, `${half}`, IND, 0.4, "h0")}
              {measure(cx, xA, `${half}`, IND, 0.55, "h1")}
              {measure(xF, xD, `${leftPad}`, WIN, 0.1, "e0")}
              {measure(xA, xE, `${rightPad}`, WIN, 0.1, "e1")}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the width is what the area is finally multiplied by */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="wfin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {measure(xD, xA, `${width}`, WIN, 0.35, "wf")}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the marked points */}
        {[
          { x: xF, label: nF },
          { x: xD, label: nD },
          { x: xA, label: nA },
          { x: xE, label: nE },
        ].map((p, i) => (
          <motion.g
            key={p.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.55 + i * 0.06 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <circle cx={p.x} cy={baseY} r={3.6} fill={ARC} />
            {/* point names are letters, so keep them out of the digit face — a
                monospace capital O is indistinguishable from a zero */}
            <text x={p.x} y={baseY + 16} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>
              {p.label}
            </text>
          </motion.g>
        ))}
        {[
          { x: xD, label: nC },
          { x: xA, label: nB },
        ].map((p, i) => (
          <motion.g
            key={p.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.7 + i * 0.06 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <circle cx={p.x} cy={rectTop} r={3.6} fill={ARC} />
            <text x={p.x + (p.label === nB ? 11 : -11)} y={rectTop - 5} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>
              {p.label}
            </text>
          </motion.g>
        ))}

        {/* the centre, and the radius it measures out */}
        <AnimatePresence>
          {hasCentre && (
            <motion.g
              key="O"
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 230, damping: 16, delay: 0.15 }}
            >
              <circle cx={cx} cy={baseY} r={4} fill={IND} />
              <text x={cx - 10} y={baseY + 16} textAnchor="middle" fontSize="12" fontWeight="800" fill={IND}>
                O
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* beat one: the diameter totalled and halved */}
        <AnimatePresence>
          {!hasCentre && (
            <motion.g key="dia" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 1.3 }}>
              <path d={`M ${xF},${baseY + 22} v 6 H ${xE} v -6`} fill="none" stroke={IND} strokeWidth={1.3} />
              <text x={cx} y={baseY + 40} textAnchor="middle" fontSize="12" fontWeight="800" fill={IND} fontFamily={numberFont}>
                {nF}{nE} = {leftPad} + {width} + {rightPad} = {diameter}, so r = {r}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the arithmetic each later beat produces */}
        <AnimatePresence>
          {swept && (
            <motion.text
              key="pyth"
              x={cx}
              y={baseY + 40}
              textAnchor="middle"
              fontSize={isFinal ? "13.5" : "12"}
              fontWeight="800"
              fill={isFinal ? WIN : IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 16, delay: isFinal ? 0.9 : 1.5 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {isFinal
                ? `${width} × ${fmtSqrt(hSq)} = ${area}`
                : `h = √(${r}² − ${half}²) = √${Math.round(hSq)} = ${fmtSqrt(hSq)}`}
            </motion.text>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasCentre && !swept && (
            <motion.text
              key="mid"
              x={cx}
              y={baseY + 40}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.85 }}
            >
              {leftPad} = {rightPad}, so O{nA} = {width} ÷ 2 = {half}
            </motion.text>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : swept ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : swept ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : swept ? "#fde68a" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {note && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: numberFont,
              fontSize: 11.5,
              fontWeight: 700,
              color: failure ? BAD : "#94a3b8",
              textAlign: "center",
            }}
          >
            {note}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
