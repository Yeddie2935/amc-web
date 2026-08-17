import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const GRID = "#e2e8f0";
const AXIS = "#94a3b8";
const HUE = ["#4338ca", "#0891b2", "#b45309"];
const WIN = "#16a34a";
const BAD = "#dc2626";

const W = 340;
const H = 206;
const PX = 26;
const PY = 12;
const PW = 194;
const PH = 162;
const NX = 226;

// ---- exact rational arithmetic: every input is an integer lattice point ----
const gg = (a: number, b: number): number => (b ? gg(b, a % b) : Math.abs(a));
type Fr = { n: number; d: number };
const fr = (n: number, d = 1): Fr => {
  const s = d < 0 ? -1 : 1;
  const k = gg(Math.abs(n), Math.abs(d)) || 1;
  return { n: (s * n) / k, d: (s * d) / k };
};
const cmp = (a: Fr, b: Fr) => a.n * b.d - b.n * a.d;
const val = (a: Fr) => a.n / a.d;
const txt = (a: Fr) => (a.d === 1 ? String(a.n) : `${a.n}/${a.d}`);

type Line = { name: string; x1: number; y1: number; x2: number; y2: number; dx: number; dy: number; K: number };

/** y where the line crosses this x, and x where it crosses this y. */
const yAt = (L: Line, x: number) => fr(L.dy * x - L.K, L.dx);
const xAt = (L: Line, y: number) => fr(L.K + L.dx * y, L.dy);

/** How the line meets the box: nothing, one point, or a whole segment. */
function clip(L: Line, x0: number, y0: number, x1: number, y1: number) {
  if (L.dx === 0) return L.x1 >= x0 && L.x1 <= x1 ? { kind: "segment" as const } : { kind: "empty" as const };
  if (L.dy === 0) return L.y1 >= y0 && L.y1 <= y1 ? { kind: "segment" as const } : { kind: "empty" as const };
  const a = xAt(L, y0);
  const b = xAt(L, y1);
  const lo = cmp(a, b) < 0 ? a : b;
  const hi = cmp(a, b) < 0 ? b : a;
  const L0 = cmp(lo, fr(x0)) > 0 ? lo : fr(x0);
  const H0 = cmp(hi, fr(x1)) < 0 ? hi : fr(x1);
  if (cmp(L0, H0) > 0) return { kind: "empty" as const };
  if (cmp(L0, H0) === 0) return { kind: "point" as const, x: L0, y: fr(L.dy * L0.n - L.K * L0.d, L.dx * L0.d) };
  return { kind: "segment" as const };
}

function eq(L: Line) {
  const m = fr(L.dy, L.dx);
  const b = fr(-L.K, L.dx);
  const ms = m.n === 0 ? "0" : m.d === 1 ? (m.n === 1 ? "x" : m.n === -1 ? "−x" : `${m.n}x`) : `${m.n === 1 ? "" : m.n === -1 ? "−" : m.n}x/${m.d}`;
  if (b.n === 0) return `y = ${ms}`;
  return `y = ${ms} ${b.n > 0 ? "+" : "−"} ${txt(fr(Math.abs(b.n), b.d))}`;
}

/**
 * A rectangle and some lines on the coordinate plane, asking how many points of
 * the rectangle lie on a line. The rectangle sits far from every point that
 * defines the lines, so the whole question is a **near miss you cannot judge by
 * eye** — and the beats answer it by zooming: the wide plane first, then the view
 * scales right down onto the box, where one line turns out to clip a single
 * corner exactly and the other slides underneath. Each line is examined on its
 * own beat, with its height chipped at the box's left and right edges against the
 * edge it would have to cross. Everything is done in **exact rational
 * arithmetic** on the integer lattice points, so `y = 16/3` stays 16/3 and a
 * graze is never rounded into a crossing or a miss; the clip reports empty, one
 * point, or a whole segment, and the total is checked against the stored answer.
 * Data: { rect: [x1,y1,x2,y2], lines: ["A 0 0 B 3 1", ...] }.
 */
export function LineBoxHitScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const r = (Array.isArray(data.rect) ? data.rect : []).map(Number);
  const raw = (Array.isArray(data.lines) ? data.lines : []).map(String);
  if (r.length < 4 || r.some((v) => !Number.isFinite(v)) || !raw.length) return null;

  const bx0 = Math.min(r[0], r[2]);
  const bx1 = Math.max(r[0], r[2]);
  const by0 = Math.min(r[1], r[3]);
  const by1 = Math.max(r[1], r[3]);

  const lines: Line[] = [];
  for (const s of raw) {
    const t = s.trim().split(/\s+/);
    if (t.length < 6) continue;
    const [n1, a, b, n2, c, d] = [t[0], +t[1], +t[2], t[3], +t[4], +t[5]];
    if (![a, b, c, d].every(Number.isFinite) || (a === c && b === d)) continue;
    lines.push({ name: `${n1}${n2}`, x1: a, y1: b, x2: c, y2: d, dx: c - a, dy: d - b, K: (d - b) * a - (c - a) * b });
  }
  if (!lines.length) return null;

  const hits = lines.map((L) => clip(L, bx0, by0, bx1, by1));
  const pts = hits.filter((h) => h.kind === "point") as { kind: "point"; x: Fr; y: Fr }[];
  const anySegment = hits.some((h) => h.kind === "segment");
  const distinct = new Set(pts.map((p) => `${txt(p.x)},${txt(p.y)}`)).size;
  const agrees = anySegment ? false : problem.shortAnswer == null || Number(problem.shortAnswer) === distinct;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const wide = step <= 0;
  const focus = step >= 2 ? Math.min(step - 2, lines.length - 1) : -1;

  // ---- the view: whole plane, then down onto the box ----
  const edgeYs = lines.flatMap((L) => (L.dx === 0 ? [] : [val(yAt(L, bx0)), val(yAt(L, bx1))]));
  const win = wide
    ? {
        x0: Math.min(0, bx0, ...lines.flatMap((L) => [L.x1, L.x2])) - 1,
        x1: Math.max(bx1, ...lines.flatMap((L) => [L.x1, L.x2])) + 1,
        y0: Math.min(0, by0, ...lines.flatMap((L) => [L.y1, L.y2])) - 1,
        y1: Math.max(by1, ...lines.flatMap((L) => [L.y1, L.y2])) + 1,
      }
    : { x0: bx0 - 0.3, x1: bx1 + 0.3, y0: Math.min(by0, ...edgeYs) - 0.5, y1: Math.max(by1, ...edgeYs) + 0.5 };
  const S = Math.min(PW / (win.x1 - win.x0), PH / (win.y1 - win.y0));
  const oX = PX + PW / 2 - ((win.x0 + win.x1) / 2) * S;
  const oY = PY + PH / 2 + ((win.y0 + win.y1) / 2) * S;
  const tx = (x: number) => oX + x * S;
  const ty = (y: number) => oY - y * S;
  const vx0 = (PX - oX) / S;
  const vx1 = (PX + PW - oX) / S;
  const vy0 = (oY - PY - PH) / S;
  const vy1 = (oY - PY) / S;

  const ticks = (lo: number, hi: number) => {
    const out: number[] = [];
    for (let v = Math.ceil(lo); v <= Math.floor(hi); v++) out.push(v);
    return out.length <= 24 ? out : out.filter((v) => v % 2 === 0);
  };

  const roomy = S >= 14; // enough pixels per unit to label every gridline

  const caption = isFinal
    ? anySegment
      ? "a line runs along the rectangle — infinitely many points"
      : `${distinct} point${distinct === 1 ? "" : "s"} of the rectangle lies on a line`
    : wide
    ? `the rectangle is only ${bx1 - bx0} by ${by1 - by0}, far out at x = ${bx0}`
    : focus < 0
    ? "zoom in — both lines run close, neither obviously hits"
    : hits[focus].kind === "point"
    ? `${lines[focus].name} is at y = ${txt(yAt(lines[focus], bx0))} and y = ${txt(yAt(lines[focus], bx1))} — it clips one corner`
    : `${lines[focus].name} is at y = ${txt(yAt(lines[focus], bx0))} and y = ${txt(yAt(lines[focus], bx1))} — it misses entirely`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        <defs>
          <clipPath id="lbPlot">
            <rect x={PX} y={PY} width={PW} height={PH} />
          </clipPath>
        </defs>
        <rect x={PX} y={PY} width={PW} height={PH} fill="#fff" stroke={GRID} strokeWidth={1} />

        <g clipPath="url(#lbPlot)">
          {/* integer grid */}
          {ticks(vx0, vx1).map((v) => (
            <motion.line key={`gx${v}`} animate={{ x1: tx(v), x2: tx(v) }} y1={PY} y2={PY + PH} stroke={v === 0 ? AXIS : GRID} strokeWidth={v === 0 ? 1.4 : 0.8} transition={{ type: "spring", stiffness: 90, damping: 20 }} />
          ))}
          {ticks(vy0, vy1).map((v) => (
            <motion.line key={`gy${v}`} x1={PX} x2={PX + PW} animate={{ y1: ty(v), y2: ty(v) }} stroke={v === 0 ? AXIS : GRID} strokeWidth={v === 0 ? 1.4 : 0.8} transition={{ type: "spring", stiffness: 90, damping: 20 }} />
          ))}

          {/* the rectangle */}
          <motion.rect
            animate={{ x: tx(bx0), y: ty(by1), width: (bx1 - bx0) * S, height: (by1 - by0) * S }}
            fill="#eef2ff"
            stroke={INK}
            strokeWidth={1.8}
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
          />

          {/* the lines */}
          {lines.map((L, i) => {
            const dim = focus >= 0 && focus !== i;
            const p =
              L.dx === 0
                ? { a: [L.x1, vy0], b: [L.x1, vy1] }
                : { a: [vx0, val(yAt(L, vx0))], b: [vx1, val(yAt(L, vx1))] };
            return (
              <motion.line
                key={L.name}
                animate={{ x1: tx(p.a[0]), y1: ty(p.a[1]), x2: tx(p.b[0]), y2: ty(p.b[1]), opacity: dim ? 0.2 : 1 }}
                stroke={HUE[i % HUE.length]}
                strokeWidth={2}
                initial={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 90, damping: 20 }}
              />
            );
          })}

          {/* the points that define each line */}
          {wide &&
            lines.flatMap((L, i) =>
              [
                [L.name[0], L.x1, L.y1],
                [L.name[1], L.x2, L.y2],
              ].map(([nm, x, y]) => (
                <motion.g key={`${L.name}${nm}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 + i * 0.15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <circle cx={tx(Number(x))} cy={ty(Number(y))} r={3} fill={HUE[i % HUE.length]} />
                  <text x={tx(Number(x)) + 5} y={ty(Number(y)) - 4} fontSize="9" fontWeight="800" fill={HUE[i % HUE.length]} fontFamily={numberFont}>
                    {nm}
                  </text>
                </motion.g>
              ))
            )}

          {/* where the focused line sits above the box's two upright edges */}
          {focus >= 0 &&
            [bx0, bx1].map((bx, k) => {
              const L = lines[focus];
              if (L.dx === 0) return null;
              const y = yAt(L, bx);
              const inside = val(y) >= by0 && val(y) <= by1;
              return (
                <motion.g key={`m${k}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + k * 0.25 }}>
                  <line x1={tx(bx)} y1={ty(val(y))} x2={tx(bx)} y2={ty(val(y) > by1 ? by1 : by0)} stroke={inside ? WIN : BAD} strokeWidth={1.2} strokeDasharray="3 3" />
                  <circle cx={tx(bx)} cy={ty(val(y))} r={3.2} fill={inside ? WIN : BAD} />
                  <rect x={tx(bx) + (k === 0 ? -46 : 6)} y={ty(val(y)) - 7.5} width={40} height={15} rx={7} fill="#fff" stroke={inside ? WIN : BAD} strokeWidth={1.1} />
                  <text x={tx(bx) + (k === 0 ? -26 : 26)} y={ty(val(y)) + 3.5} textAnchor="middle" fontSize="9" fontWeight="800" fill={inside ? WIN : BAD} fontFamily={numberFont}>
                    {txt(y)}
                  </text>
                </motion.g>
              );
            })}

          {/* the touch points, once found */}
          {(isFinal || focus >= 0) &&
            hits.map((h, i) =>
              h.kind === "point" && (focus < 0 || focus >= i || isFinal) ? (
                <motion.circle
                  key={`hit${i}`}
                  cx={tx(val(h.x))}
                  cy={ty(val(h.y))}
                  r={6}
                  fill="none"
                  stroke={WIN}
                  strokeWidth={2.4}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 14, delay: 1 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              ) : null
            )}
        </g>

        {/* axis numbers */}
        {ticks(vx0, vx1).map((v) =>
          roomy || v % 5 === 0 ? (
            <motion.text key={`tx${v}`} animate={{ x: tx(v) }} y={PY + PH + 11} textAnchor="middle" fontSize="8" fontWeight="700" fill={AXIS} fontFamily={numberFont} transition={{ type: "spring", stiffness: 90, damping: 20 }}>
              {v}
            </motion.text>
          ) : null
        )}
        {ticks(vy0, vy1).map((v) =>
          roomy || v % 5 === 0 ? (
            <motion.text key={`tyl${v}`} x={PX - 5} animate={{ y: ty(v) + 3 }} textAnchor="end" fontSize="8" fontWeight="700" fill={AXIS} fontFamily={numberFont} transition={{ type: "spring", stiffness: 90, damping: 20 }}>
              {v}
            </motion.text>
          ) : null
        )}

        {/* the notes */}
        {lines.map((L, i) => {
          const on = !wide;
          const lit = focus === i;
          const done = focus > i || (isFinal && focus >= i);
          if (!on) return null;
          return (
            <motion.g key={`n${i}`} initial={{ opacity: 0, x: 14 }} animate={{ opacity: lit || done ? 1 : 0.45, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 + i * 0.12 }}>
              <text x={NX} y={30 + i * 46} fontSize="10" fontWeight="800" fill={HUE[i % HUE.length]} fontFamily={numberFont}>
                {L.name}: {eq(L)}
              </text>
              {(lit || done) && (
                <text x={NX} y={46 + i * 46} fontSize="10" fontWeight="800" fill={hits[i].kind === "point" ? WIN : BAD} fontFamily={numberFont}>
                  {hits[i].kind === "point" ? "touches 1 corner" : hits[i].kind === "empty" ? "misses the box" : "runs along it"}
                </text>
              )}
            </motion.g>
          );
        })}

        {/* the box's own edges, named, so the comparison has something to land on */}
        {focus >= 0 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <text x={NX} y={128} fontSize="9.5" fontWeight="700" fill={INK} fontFamily={numberFont}>
              box top y = {by1}
            </text>
            <text x={NX} y={142} fontSize="9.5" fontWeight="700" fill={INK} fontFamily={numberFont}>
              box bottom y = {by0}
            </text>
          </motion.g>
        )}

        <AnimatePresence>
          {isFinal && (
            <motion.g key="tot" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.4 }} style={{ transformBox: "fill-box", transformOrigin: "left center" }}>
              <text x={NX} y={172} fontSize="15" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {distinct} point{distinct === 1 ? "" : "s"}
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
            transition={{ delay: 1.7 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees
              ? `clipped each line to the box in exact fractions: ${hits.map((h, i) => `${lines[i].name} ${h.kind === "point" ? "1" : "0"}`).join(", ")}`
              : `the clip gives ${distinct}, which is not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.8 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
