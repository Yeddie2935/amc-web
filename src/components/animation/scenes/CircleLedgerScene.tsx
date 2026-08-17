import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const SHADE = "#cbd5e1";
const MARK = "#4338ca";
const HOT = "#b45309";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const W = 340;
const H = 210;
const CX = 92;
const CY = 102;
const RPX = 84;
const NX = 186;

const gg = (a: number, b: number): number => (b ? gg(b, a % b) : Math.abs(a));
const rad = (r: number) => (Number.isInteger(r) ? String(r) : r === 0.5 ? "1/2" : String(r));

type C = { x: number; y: number; r: number; shaded: boolean };

/**
 * Circles nested inside a big one, some shaded, asking what fraction of the big
 * one is shaded. Every area is pi r squared, so **pi cancels out of the ratio**
 * and the whole problem is a signed sum of squared radii. The scene goes one
 * better and measures everything in units of the **smallest circle's area**,
 * which turns every entry into a whole number — radius 1/2 is 1 unit, radius 1
 * is 4, radius 2 is 16, radius 3 is 36 — so the answer's numerator and
 * denominator can be read straight off a ledger. Each circle's sign is
 * **derived by containment**: a circle counts + if it is shaded on a white
 * background and − if it is a white hole punched in a shaded one, and it counts
 * nothing at all if it matches its parent (the containment test must require the
 * parent to be strictly larger, or a big circle gets adopted by a small one).
 * Beats: the figure, the unit badges, the big disc minus its holes, then the
 * strays added and the fraction reduced. Every unit count, the parent of each
 * circle, the total and the reduction are computed, and the scene flags a circle
 * that does not fit inside the outer one.
 * Data: { radius, circles: ["-1|0|2|1", ...] } as x|y|r|shaded.
 */
export function CircleLedgerScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const R = num(data.radius, 3);
  const circles: C[] = (Array.isArray(data.circles) ? data.circles : [])
    .map(String)
    .map((s) => s.split("|").map((p) => p.trim()))
    .filter((p) => p.length >= 4 && p.slice(0, 3).every((v) => Number.isFinite(+v)) && +p[2] > 0)
    .map((p) => ({ x: +p[0], y: +p[1], r: +p[2], shaded: p[3] === "1" || p[3] === "true" }));
  if (R <= 0 || !circles.length) return null;

  // a circle's parent is the smallest circle strictly larger that contains it
  const EPS = 1e-9;
  const holds = (c: C, p: C) => p.r > c.r + EPS && Math.hypot(c.x - p.x, c.y - p.y) <= p.r - c.r + EPS;
  const parentOf = circles.map((c) => {
    let best = -1;
    circles.forEach((p, j) => {
      if (p !== c && holds(c, p) && (best < 0 || p.r < circles[best].r)) best = j;
    });
    return best;
  });
  const signOf = circles.map((c, i) => {
    const pShaded = parentOf[i] < 0 ? false : circles[parentOf[i]].shaded; // the outer circle is white
    return c.shaded === pShaded ? 0 : c.shaded ? 1 : -1;
  });
  const stray = circles.find((c) => Math.hypot(c.x, c.y) > R - c.r + 1e-6);

  // measure in units of the smallest circle so every entry is a whole number
  let m = 1;
  while (m <= 24 && ![...circles.map((c) => c.r), R].every((r) => Math.abs(r * m - Math.round(r * m)) < 1e-9)) m++;
  const rMin = Math.min(...circles.map((c) => c.r));
  const unitsOf = (r: number) => Math.round((r * m) ** 2) / Math.round((rMin * m) ** 2);
  const whole = [...circles.map((c) => c.r), R].every((r) => Number.isInteger(unitsOf(r)));

  const outerUnits = unitsOf(R);
  const totalUnits = circles.reduce((s, c, i) => s + signOf[i] * unitsOf(c.r), 0);
  const g = gg(Math.round(totalUnits), Math.round(outerUnits)) || 1;
  const fracN = Math.round(totalUnits) / g;
  const fracD = Math.round(outerUnits) / g;
  const agrees = problem.shortAnswer == null || String(problem.shortAnswer).trim() === `${fracN}/${fracD}`;

  // one ledger row per (radius, sign) family
  type Row = { r: number; sign: number; count: number; each: number };
  const rows: Row[] = [];
  circles.forEach((c, i) => {
    if (!signOf[i]) return;
    const hit = rows.find((t) => t.r === c.r && t.sign === signOf[i]);
    if (hit) hit.count++;
    else rows.push({ r: c.r, sign: signOf[i], count: 1, each: unitsOf(c.r) });
  });
  rows.sort((a, b) => b.r - a.r);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const badges = isFinal || step >= 1;
  const shown = isFinal ? rows.length : step >= 2 ? Math.min(2, rows.length) : 0;
  const litRows = rows.slice(0, shown);
  const running = litRows.reduce((s, t) => s + t.sign * t.each * t.count, 0);

  const tx = (x: number) => CX + (x / R) * RPX;
  const ty = (y: number) => CY - (y / R) * RPX;
  const px = (r: number) => (r / R) * RPX;

  /** A spot inside this circle that is clear of everything it contains. */
  const labelAt = (i: number) => {
    const c = i < 0 ? { x: 0, y: 0, r: R } : circles[i];
    const kids = circles.filter((k, j) => j !== i && holds(k, c));
    const clear = (X: number, Y: number, pad: number) => kids.every((k) => Math.hypot(X - k.x, Y - k.y) > k.r + pad);
    for (const pad of [0.34, 0.12]) {
      for (const f of [0, 0.4, 0.55, 0.7]) {
        for (let a = 0; a < 16; a++) {
          const X = c.x + Math.cos((a * Math.PI) / 8) * c.r * f;
          const Y = c.y + Math.sin((a * Math.PI) / 8) * c.r * f;
          if (clear(X, Y, pad)) return { X, Y };
        }
      }
    }
    return { X: c.x, Y: c.y };
  };

  const caption = isFinal
    ? `${Math.round(totalUnits)} units out of ${Math.round(outerUnits)} — ${fracN}/${fracD}`
    : step === 0
    ? `a circle of radius ${rad(R)} holding ${circles.length} smaller ones`
    : step === 1
    ? `every area is πr², so measure in units of the smallest circle`
    : `the shaded disc is ${rows[0]?.each} units with ${rows[1]?.count ?? 0} holes punched out`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the outer circle */}
        <circle cx={CX} cy={CY} r={RPX} fill="#fff" stroke={INK} strokeWidth={1.8} />

        {/* the nested circles, biggest first so the small ones sit on top */}
        {circles
          .map((c, i) => ({ c, i }))
          .sort((a, b) => b.c.r - a.c.r)
          .map(({ c, i }) => {
            const lit = shown > 0 && litRows.some((t) => t.r === c.r && t.sign === signOf[i]);
            return (
              <motion.circle
                key={i}
                cx={tx(c.x)}
                cy={ty(c.y)}
                r={px(c.r)}
                stroke={lit ? (signOf[i] > 0 ? WIN : BAD) : INK}
                strokeWidth={lit ? 2.4 : 1.4}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, fill: c.shaded ? SHADE : "#fff" }}
                transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.1 + (R - c.r) * 0.12 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            );
          })}

        {/* how many units each one is worth */}
        <AnimatePresence>
          {badges && (
            <motion.g key="bad" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {circles.map((c, i) => {
                const p = labelAt(i);
                return (
                  <motion.text
                    key={i}
                    x={tx(p.X)}
                    y={ty(p.Y) + 4}
                    textAnchor="middle"
                    fontSize={c.r >= 1 ? 12 : 9}
                    fontWeight="800"
                    fill={shown > 0 ? (signOf[i] > 0 ? WIN : signOf[i] < 0 ? BAD : DIM) : MARK}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.2 + i * 0.1 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {unitsOf(c.r)}
                  </motion.text>
                );
              })}
              {(() => {
                const p = labelAt(-1);
                return (
                  <motion.text
                    x={tx(p.X)}
                    y={ty(p.Y) + 4}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="800"
                    fill={MARK}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.2 + circles.length * 0.1 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {outerUnits}
                  </motion.text>
                );
              })()}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the ledger */}
        <text x={NX} y={22} fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={numberFont}>
          {badges ? `radius ${rad(rMin)} circle = 1 unit` : "area = π r²"}
        </text>

        {litRows.map((t, i) => (
          <motion.g key={`${t.r}-${t.sign}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.3 + i * 0.25 }}>
            <circle cx={NX + 7} cy={40 + i * 30} r={6} fill={t.sign > 0 ? SHADE : "#fff"} stroke={t.sign > 0 ? WIN : BAD} strokeWidth={1.6} />
            <text x={NX + 20} y={44 + i * 30} fontSize="12" fontWeight="800" fill={t.sign > 0 ? WIN : BAD} fontFamily={numberFont}>
              {t.sign > 0 ? "+" : "−"} {t.count} × {t.each} = {t.sign > 0 ? "+" : "−"}{t.count * t.each}
            </text>
            <text x={NX + 20} y={55 + i * 30} fontSize="8.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              radius {rad(t.r)} {t.sign > 0 ? (t.count > 1 ? "circles" : "circle") : t.count > 1 ? "holes" : "hole"}
            </text>
          </motion.g>
        ))}

        <AnimatePresence>
          {shown > 0 && !isFinal && (
            <motion.text key="run" x={NX} y={40 + shown * 30 + 10} fontSize="13" fontWeight="800" fill={MARK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              so far {running} units
            </motion.text>
          )}
          {isFinal && (
            <motion.g key="fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={NX} y1={40 + rows.length * 30 - 6} x2={NX + 130} y2={40 + rows.length * 30 - 6} stroke={DIM} strokeWidth={1} />
              <motion.text
                x={NX}
                y={40 + rows.length * 30 + 10}
                fontSize="13"
                fontWeight="800"
                fill={MARK}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {Math.round(totalUnits)} of {Math.round(outerUnits)} units
              </motion.text>
              <motion.text
                x={NX}
                y={40 + rows.length * 30 + 34}
                fontSize="19"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.2 }}
                style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              >
                {fracN}/{fracD}
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
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && whole && !stray ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {stray
              ? "a circle does not fit inside the outer one"
              : !whole
              ? "these radii do not share a common unit circle"
              : agrees
              ? `π divides out of both sides, leaving squared radii: ${fracN}/${fracD}`
              : `the ledger gives ${fracN}/${fracD}, which is not the stored answer`}
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
