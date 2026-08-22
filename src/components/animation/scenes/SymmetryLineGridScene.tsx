import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const AMB = "#b45309";

type Pt = { x: number; y: number };

const LINE_COLORS = ["#0891b2", "#b45309", "#4338ca", "#be185d"];

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

/**
 * Reflect a point in the line through `o` at screen angle `ang` (radians, y
 * down). The linear part is [[cos2a, sin2a], [sin2a, -cos2a]] — which is also
 * exactly `rotate(2a) scaleY(-1)`, the transform the fold animation uses.
 */
function reflect(p: Pt, o: Pt, ang: number): Pt {
  const c = Math.cos(2 * ang);
  const s = Math.sin(2 * ang);
  const dx = p.x - o.x;
  const dy = p.y - o.y;
  return { x: o.x + c * dx + s * dy, y: o.y + s * dx - c * dy };
}

/** Sutherland–Hodgman clip of a polygon to one side of the line (o, ang). */
function clipHalf(poly: Pt[], o: Pt, ang: number): Pt[] {
  const nx = -Math.sin(ang);
  const ny = Math.cos(ang);
  const f = (p: Pt) => (p.x - o.x) * nx + (p.y - o.y) * ny;
  const out: Pt[] = [];
  poly.forEach((cur, i) => {
    const prev = poly[(i + poly.length - 1) % poly.length];
    const fp = f(prev);
    const fc = f(cur);
    if (fp * fc < 0) {
      const t = fp / (fp - fc);
      out.push({ x: prev.x + t * (cur.x - prev.x), y: prev.y + t * (cur.y - prev.y) });
    }
    if (fc >= 0) out.push(cur);
  });
  return out;
}

function bboxCentre(poly: Pt[]): Pt {
  const xs = poly.map((p) => p.x);
  const ys = poly.map((p) => p.y);
  return { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
}

/**
 * Half of the square folding over the line PQ. Motion pins an SVG group's pivot
 * to its own centre, so the reflection is expressed as an own-centre
 * `rotate(2a) scaleY(-1)` plus the translation that re-pivots it onto the real
 * line: `reflect(centre) − centre`. Interpolating `scaleY` 1 → −1 while the
 * rotation runs 0 → 2a passes through a flat line at angle a, so the tween *is*
 * the fold, not a slide.
 */
function FoldGhost({
  poly,
  o,
  ang,
  color,
  delay,
}: {
  poly: Pt[];
  o: Pt;
  ang: number;
  color: string;
  delay: number;
}) {
  if (poly.length < 3) return null;
  const c = bboxCentre(poly);
  const r = reflect(c, o, ang);
  const pts = poly.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay }}>
      <polygon points={pts} fill="none" stroke={color} strokeWidth={1} strokeDasharray="3 3" opacity={0.55} />
      <motion.g
        initial={{ x: 0, y: 0, rotate: 0, scaleY: 1 }}
        animate={{ x: r.x - c.x, y: r.y - c.y, rotate: (ang * 180) / Math.PI * 2, scaleY: -1 }}
        transition={{ duration: 1.15, delay: delay + 0.3, ease: "easeInOut" }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <polygon points={pts} fill={color} fillOpacity={0.3} stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      </motion.g>
    </motion.g>
  );
}

/**
 * "Is the line PQ a line of symmetry of the square?" on a grid of points with P
 * at the centre. The scene refuses to hand over "a square has 4 lines of
 * symmetry" as a fact to memorise: it **tests** each line by folding the square
 * along it, and the halves either land on each other or they do not. The
 * opening beat spends itself on a Q that fails — the half swings over and hangs
 * off the square in red — because that is what almost every Q does, and it is
 * what makes the four survivors worth counting.
 *
 * Which points are favourable is **discovered**, not asserted: every one of the
 * other n²−1 grid points is tried by reflecting the square's four corners in the
 * line PQ and checking the square comes back to itself. Those points are then
 * grouped by direction, which is where the 4 lines come from, and each turns out
 * to carry n−1 of them (the line's n grid points, less P itself). The lines meet
 * only at P, so nothing is double counted — the scene checks that too, by
 * counting the union rather than multiplying.
 *
 * The closing beat dims the 48 losers, leaves the 32 winners green, and reduces
 * 32/80 — then re-derives it a second way: 4 lines × (n−1) points over n²−1 is
 * 4(n−1)/((n−1)(n+1)) = 4/(n+1), which on a 9×9 grid is 4/10 without counting
 * anything at all. Both routes must agree or the scene says so; data
 * `{ size, decoy?: [col, row] }` with the decoy the failing Q of the first beat
 * (chosen automatically — the direction furthest from every mirror — if absent).
 */
export function SymmetryLineGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const rawN = Math.round(num(data.size, 9));
  const n = rawN >= 3 && rawN % 2 === 1 ? rawN : 9;
  const mid = (n - 1) / 2;

  // ---------------- geometry ----------------
  const W = 470;
  const H = 244;
  const GX = 20;
  const GY = 14;
  const S = 180;
  const gap = S / (n - 1);
  const PX = 238;
  const px = (i: number) => GX + i * gap;
  const py = (j: number) => GY + j * gap;
  const P: Pt = { x: px(mid), y: py(mid) };
  const square: Pt[] = [
    { x: GX, y: GY },
    { x: GX + S, y: GY },
    { x: GX + S, y: GY + S },
    { x: GX, y: GY + S },
  ];

  // ---------------- which Q make PQ a mirror line? ----------------
  // Tried, not assumed: reflect the square's corners in PQ and see whether the
  // square comes back to itself.
  const isMirror = (ang: number) =>
    square.every((corner) => {
      const r = reflect(corner, P, ang);
      return square.some((m) => Math.hypot(m.x - r.x, m.y - r.y) < 1e-6);
    });

  const others: { i: number; j: number; ang: number; good: boolean }[] = [];
  for (let j = 0; j < n; j += 1) {
    for (let i = 0; i < n; i += 1) {
      if (i === mid && j === mid) continue;
      const ang = Math.atan2(py(j) - P.y, px(i) - P.x);
      others.push({ i, j, ang, good: isMirror(ang) });
    }
  }
  const total = others.length;
  const favourable = others.filter((q) => q.good);

  // group the favourable points by direction — this is where "4 lines" comes from
  const key = (ang: number) => {
    let a = ((ang % Math.PI) + Math.PI) % Math.PI;
    if (Math.PI - a < 1e-9) a = 0;
    return Math.round((a * 180) / Math.PI * 1000) / 1000;
  };
  const byLine = new Map<number, { i: number; j: number }[]>();
  favourable.forEach((q) => {
    const k = key(q.ang);
    if (!byLine.has(k)) byLine.set(k, []);
    byLine.get(k)!.push({ i: q.i, j: q.j });
  });
  const lines = [...byLine.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([deg, pts], idx) => ({
      deg,
      ang: (deg * Math.PI) / 180,
      pts,
      color: LINE_COLORS[idx % LINE_COLORS.length],
      name:
        Math.abs(deg) < 1e-6
          ? "horizontal"
          : Math.abs(deg - 90) < 1e-6
          ? "vertical"
          : Math.abs(deg - 45) < 1e-6
          ? "diagonal ↘"
          : Math.abs(deg - 135) < 1e-6
          ? "diagonal ↗"
          : `${Math.round(deg)}°`,
    }));
  const perLine = lines.length ? lines[0].pts.length : 0;
  const lineIndex = new Map<string, number>();
  lines.forEach((ln, k) => ln.pts.forEach((p) => lineIndex.set(`${p.i},${p.j}`, k)));

  // ---------------- the fraction, and a second route to it ----------------
  const g = gcd(favourable.length, total) || 1;
  const rn = favourable.length / g;
  const rd = total / g;
  // 4 lines × (n−1) points over n²−1 collapses to 4/(n+1) — no counting at all
  const shortcutOk = lines.length * (n - 1) === favourable.length && total === n * n - 1;
  const g2 = gcd(lines.length, n + 1) || 1;
  const sn = lines.length / g2;
  const sd = (n + 1) / g2;

  // ---------------- self-checks ----------------
  const uniqueOk = new Set(favourable.map((q) => `${q.i},${q.j}`)).size === favourable.length;
  const evenOk = lines.every((ln) => ln.pts.length === perLine);
  const storedOk = problem.shortAnswer == null || `${rn}/${rd}` === String(problem.shortAnswer).replace(/\s/g, "");
  const routesOk = sn === rn && sd === rd;
  const ok = uniqueOk && evenOk && storedOk && routesOk && shortcutOk;
  const failed = !uniqueOk
    ? "the mirror lines share a point besides P"
    : !evenOk
    ? `lines hold ${lines.map((l) => l.pts.length).join(", ")} points — not all equal`
    : !storedOk
    ? `counted ${rn}/${rd}, stored answer ${problem.shortAnswer}`
    : !routesOk
    ? `counting gives ${rn}/${rd} but ${lines.length}/(n+1) gives ${sn}/${sd}`
    : "the shortcut does not apply to this grid";

  // ---------------- the failing Q of the opening beat ----------------
  const raw = Array.isArray(data.decoy) ? data.decoy : null;
  const given = raw
    ? others.find((q) => q.i === Math.round(num(raw[0], -1)) && q.j === Math.round(num(raw[1], -1)) && !q.good)
    : undefined;
  // otherwise: the direction furthest from every mirror line, so the fold fails
  // by the widest margin the lattice allows
  const spread = (ang: number) =>
    Math.min(...lines.map((ln) => {
      const d = Math.abs((((ang - ln.ang) % Math.PI) + Math.PI) % Math.PI);
      return Math.min(d, Math.PI - d);
    }));
  const decoy =
    given ??
    others
      .filter((q) => !q.good)
      .sort((a, b) => {
        const s = spread(b.ang) - spread(a.ang);
        if (Math.abs(s) > 1e-9) return s;
        return Math.hypot(px(b.i) - P.x, py(b.j) - P.y) - Math.hypot(px(a.i) - P.x, py(a.j) - P.y);
      })[0];

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const phase = isFinal ? 3 : Math.min(step, 2);

  // the line the successful fold is shown on: a diagonal if there is one, since
  // that is the one people forget, else the first mirror line
  const showLine = lines.find((l) => Math.abs(l.deg - 45) < 1e-6) ?? lines[0];

  /** Where a full chord through P leaves the square, in the given direction. */
  const exit = (ang: number, sign: number) => {
    const dx = Math.cos(ang) * sign;
    const dy = Math.sin(ang) * sign;
    const tx = Math.abs(dx) > 1e-9 ? S / 2 / Math.abs(dx) : Infinity;
    const ty = Math.abs(dy) > 1e-9 ? S / 2 / Math.abs(dy) : Infinity;
    const t = Math.min(tx, ty);
    return { x: P.x + dx * t, y: P.y + dy * t };
  };

  const dotFill = (i: number, j: number) => {
    const k = lineIndex.get(`${i},${j}`);
    if (phase === 3) return k != null ? WIN : "#cbd5e1";
    if (phase === 2) return k != null ? lines[k].color : "#94a3b8";
    if (decoy && i === decoy.i && j === decoy.j) return AMB;
    return INK;
  };
  const dotR = (i: number, j: number) => {
    const k = lineIndex.get(`${i},${j}`);
    if (phase >= 2 && k != null) return 3.4;
    if (decoy && phase === 0 && i === decoy.i && j === decoy.j) return 4;
    return 2.4;
  };
  const stepOut = (i: number, j: number) => Math.max(Math.abs(i - mid), Math.abs(j - mid));

  const caption =
    phase === 0
      ? "fold along PQ — the halves have to land on each other"
      : phase === 1
      ? `only ${lines.length} folds work, and every one runs through the centre P`
      : `${lines.length} lines × ${perLine} points = ${favourable.length} good choices of Q`
      ;
  const finalCaption = `${favourable.length} of the ${total} points  →  ${rn}/${rd}`;

  const panelTitle =
    phase === 0 ? "the test" : phase === 1 ? "the mirror lines" : phase === 2 ? "counting Q" : "the chance";
  const panelLines =
    phase === 0
      ? ["PQ is a line of symmetry when", "folding the square along it", "puts the square back on itself"]
      : phase === 1
      ? ["a square lands on itself in", `exactly ${lines.length} folds — and each`, "fold line runs through its centre,", "which is exactly where P sits"]
      : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ---------------- the square and its 81 points ---------------- */}
        <rect x={GX} y={GY} width={S} height={S} fill="#f8fafc" stroke={INK} strokeWidth={2} />

        {/* the mirror lines, drawn under the dots so they never cross a point */}
        {phase >= 1 &&
          lines.map((ln, k) => {
            const a = exit(ln.ang, 1);
            const b = exit(ln.ang, -1);
            return (
              <motion.line
                key={`L${ln.deg}`}
                x1={b.x}
                y1={b.y}
                x2={a.x}
                y2={a.y}
                stroke={ln.color}
                strokeWidth={phase === 1 && ln === showLine ? 2.6 : 2}
                strokeLinecap="round"
                opacity={0.85}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.85 }}
                transition={{ duration: 0.45, delay: phase === 1 ? (ln === showLine ? 0.15 : 2.1 + k * 0.22) : 0.1 + k * 0.2 }}
              />
            );
          })}

        {/* the failing candidate's line, drawn full: a mirror is a whole line */}
        {phase === 0 && decoy && (
          <motion.line
            x1={exit(decoy.ang, -1).x}
            y1={exit(decoy.ang, -1).y}
            x2={exit(decoy.ang, 1).x}
            y2={exit(decoy.ang, 1).y}
            stroke={AMB}
            strokeWidth={2.2}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          />
        )}

        {Array.from({ length: n }, (_, j) =>
          Array.from({ length: n }, (_, i) => {
            if (i === mid && j === mid) return null;
            const k = lineIndex.get(`${i},${j}`);
            const pop = phase === 2 && k != null;
            return (
              <motion.circle
                key={`d${i}-${j}`}
                cx={px(i)}
                cy={py(j)}
                r={dotR(i, j)}
                fill={dotFill(i, j)}
                initial={pop ? { scale: 0.5 } : { opacity: 0 }}
                animate={pop ? { scale: 1 } : { opacity: phase === 3 && k == null ? 0.85 : 1 }}
                transition={
                  pop
                    ? { type: "spring", stiffness: 320, damping: 15, delay: 0.35 + k * 0.5 + stepOut(i, j) * 0.09 }
                    : { duration: 0.25, delay: phase === 0 ? 0.02 * (i + j) : 0 }
                }
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            );
          }),
        )}

        {/* the fold itself */}
        {phase === 0 && decoy && (
          <FoldGhost poly={clipHalf(square, P, decoy.ang)} o={P} ang={decoy.ang} color={BAD} delay={1.15} />
        )}
        {phase === 1 && showLine && (
          <FoldGhost poly={clipHalf(square, P, showLine.ang)} o={P} ang={showLine.ang} color={WIN} delay={0.7} />
        )}

        {/* P — hollow, because P is not one of the 80 choices */}
        <circle cx={P.x} cy={P.y} r={5} fill="#fff" stroke={INK} strokeWidth={2.2} />
        <text
          x={P.x - 9}
          y={P.y - 7}
          fontSize="11"
          fontWeight="800"
          fill={INK}
          stroke="#fff"
          strokeWidth={2.6}
          paintOrder="stroke"
          fontFamily="Georgia, serif"
          fontStyle="italic"
        >
          P
        </text>
        {phase === 0 && decoy && (
          <motion.text
            x={px(decoy.i) + (decoy.i > mid ? -14 : 7)}
            y={py(decoy.j) - 8}
            fontSize="11"
            fontWeight="800"
            fill={AMB}
            stroke="#fff"
            strokeWidth={2.6}
            paintOrder="stroke"
            fontFamily="Georgia, serif"
            fontStyle="italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Q
          </motion.text>
        )}

        {/* per-line tallies, parked just outside the square on each line's exit */}
        {phase === 2 &&
          lines.map((ln, k) => {
            const e = exit(ln.ang, 1);
            const ux = Math.cos(ln.ang);
            const uy = Math.sin(ln.ang);
            return (
              <motion.g
                key={`t${ln.deg}`}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.35 + k * 0.5 + mid * 0.09 + 0.15 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <circle cx={e.x + ux * 13} cy={e.y + uy * 13} r={9.5} fill="#fff" stroke={ln.color} strokeWidth={1.8} />
                <text
                  x={e.x + ux * 13}
                  y={e.y + uy * 13 + 3.6}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="800"
                  fill={ln.color}
                  fontFamily={numberFont}
                >
                  {ln.pts.length}
                </text>
              </motion.g>
            );
          })}

        {/* ---------------- side panel ---------------- */}
        <text x={PX} y={GY + 12} fontSize="11.5" fontWeight="800" fill={INK}>
          {panelTitle}
        </text>

        {panelLines.map((t, i) => (
          <motion.text
            key={`${phase}-${i}`}
            x={PX}
            y={GY + 34 + i * 16}
            fontSize="10.5"
            fontWeight="600"
            fill="#475569"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.2 }}
          >
            {t}
          </motion.text>
        ))}

        {/* beat 1: the verdict on the failing fold */}
        {phase === 0 && decoy && (
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 2.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={PX} y={GY + 92} width={192} height={44} rx={9} fill="#fee2e2" stroke="#fecaca" />
            <text x={PX + 12} y={GY + 110} fontSize="12" fontWeight="800" fill={BAD}>
              ✗ the half hangs off
            </text>
            <text x={PX + 12} y={GY + 127} fontSize="10.5" fontWeight="600" fill="#991b1b">
              so this PQ is not a mirror line
            </text>
          </motion.g>
        )}

        {/* beat 2: the verdict on the fold that works */}
        {phase === 1 && (
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.95 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={PX} y={GY + 106} width={192} height={30} rx={9} fill="#dcfce7" stroke="#bbf7d0" />
            <text x={PX + 12} y={GY + 126} fontSize="12" fontWeight="800" fill="#166534">
              ✓ the halves match exactly
            </text>
          </motion.g>
        )}

        {/* beat 3: the tally, one row per line */}
        {phase === 2 && (
          <g>
            {lines.map((ln, k) => (
              <motion.g
                key={`r${ln.deg}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + k * 0.5 + mid * 0.09 + 0.15 }}
              >
                <rect x={PX} y={GY + 26 + k * 21} width={11} height={11} rx={2.5} fill={ln.color} />
                <text x={PX + 18} y={GY + 36 + k * 21} fontSize="10.5" fontWeight="600" fill="#475569">
                  {ln.name}
                </text>
                <text
                  x={PX + 150}
                  y={GY + 36 + k * 21}
                  textAnchor="end"
                  fontSize="11"
                  fontWeight="800"
                  fill={ln.color}
                  fontFamily={numberFont}
                >
                  {ln.pts.length}
                </text>
              </motion.g>
            ))}
            <motion.line
              x1={PX}
              y1={GY + 26 + lines.length * 21 + 4}
              x2={PX + 150}
              y2={GY + 26 + lines.length * 21 + 4}
              stroke="#cbd5e1"
              strokeWidth={1.2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 2.6 }}
            />
            <motion.text
              x={PX}
              y={GY + 26 + lines.length * 21 + 22}
              fontSize="12.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8 }}
            >
              {lines.length} × {perLine} = {favourable.length}
            </motion.text>
            <motion.text
              x={PX}
              y={GY + 26 + lines.length * 21 + 42}
              fontSize="10"
              fontWeight="600"
              fill="#64748b"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.1 }}
            >
              the lines cross only at P, which
            </motion.text>
            <motion.text
              x={PX}
              y={GY + 26 + lines.length * 21 + 55}
              fontSize="10"
              fontWeight="600"
              fill="#64748b"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2 }}
            >
              is not one of the choices
            </motion.text>
          </g>
        )}

        {/* beat 4: the fraction, then the same answer without counting */}
        {phase === 3 && (
          <g>
            {/* 32 over 80 */}
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.4 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <text x={PX + 24} y={GY + 40} textAnchor="middle" fontSize="17" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {favourable.length}
              </text>
              <line x1={PX + 4} y1={GY + 47} x2={PX + 44} y2={GY + 47} stroke={INK} strokeWidth={1.8} />
              <text x={PX + 24} y={GY + 66} textAnchor="middle" fontSize="17" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {total}
              </text>
            </motion.g>

            {/* ÷ g, with room around the glyph so it does not read as + */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
              <text x={PX + 56} y={GY + 47} fontSize="11" fontWeight="700" fill={AMB} fontFamily={numberFont}>
                ÷ {g}
              </text>
              <motion.line
                x1={PX + 56}
                y1={GY + 54}
                x2={PX + 100}
                y2={GY + 54}
                stroke={AMB}
                strokeWidth={1.6}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, delay: 1.1 }}
              />
            </motion.g>

            {/* the reduced fraction */}
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 1.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <text x={PX + 122} y={GY + 40} textAnchor="middle" fontSize="19" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {rn}
              </text>
              <line x1={PX + 104} y1={GY + 47} x2={PX + 140} y2={GY + 47} stroke={INK} strokeWidth={1.8} />
              <text x={PX + 122} y={GY + 67} textAnchor="middle" fontSize="19" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {rd}
              </text>
            </motion.g>

            {/* the second route: 4 lines of n−1 over n²−1 collapses to 4/(n+1) */}
            {[
              { d: 2.2, t: "no counting needed:", c: "#64748b", s: 10 },
              { d: 2.4, t: `${lines.length} lines × (${n} − 1) points`, c: "#475569", s: 10.5 },
              { d: 2.6, t: `over ${n}² − 1 = (${n} − 1)(${n} + 1)`, c: "#475569", s: 10.5 },
              { d: 2.9, t: `= ${lines.length} / (${n} + 1) = ${sn}/${sd}`, c: IND, s: 12.5 },
            ].map((l, i) => (
              <motion.text
                key={i}
                x={PX}
                y={GY + 100 + i * 19}
                fontSize={l.s}
                fontWeight={l.s > 11 ? "800" : "600"}
                fill={l.c}
                fontFamily={l.s > 11 ? numberFont : undefined}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: l.d }}
              >
                {l.t}
              </motion.text>
            ))}
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
        {phase === 3 ? finalCaption : caption}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failed}</span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 3.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
