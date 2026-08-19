import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const SHADE = "#b8b8b8";

const fmt = (v: number) => Number(v.toFixed(4)).toString();

/**
 * Two copies of the same triangle, each cut once by a line parallel to the base,
 * shaded on opposite sides, with the two shaded pieces required to have equal
 * area. Reading the shaded pieces as `whole − T(top)` and `T(h − bottom)`, the
 * equality rearranges into something much friendlier: **whole = T(top) +
 * T(h − bottom)**, the big triangle is exactly the two small ones put together.
 * Areas of similar triangles go as the *square* of the height — the scene shows
 * this by inflating the small triangle up to the whole, both directions
 * stretching at once — so that becomes `h² = top² + (h − bottom)²`, drawn as
 * three real squares with the two small ones pouring into the big one as two
 * bands of exactly the right area. The punchline is that this Pythagorean-looking
 * equation is **not quadratic**: `h²` sits on both sides and cancels, leaving
 * `2·bottom·h = top² + bottom²` and a single division. The scene solves it in
 * closed form, then re-measures both shaded fractions from the drawing and checks
 * them against each other and against the stored answer; the figure is drawn in
 * the answer's own geometry, so the cuts sit where they really would; data
 * `{ topHeight, bottomHeight, labels? }`.
 */
export function TriangleAreaSplitScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const top = Math.max(0.01, num(data.topHeight, 11));
  const bot = Math.max(0.01, num(data.bottomHeight, 5));

  // ---- whole = T(top) + T(h − bot) ⇒ h² = top² + (h − bot)² ⇒ the h² cancels ----
  const h = (top * top + bot * bot) / (2 * bot);
  const mid = h - bot;
  const leftShaded = 1 - (top / h) ** 2;
  const rightShaded = (mid / h) ** 2;

  const equalOk = Math.abs(leftShaded - rightShaded) < 1e-9;
  const pythOk = Math.abs(top * top + mid * mid - h * h) < 1e-9;
  const answerOk = problem.shortAnswer == null || fmt(h) === String(problem.shortAnswer).trim();
  const ok = equalOk && pythOk && answerOk && mid > 0;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 262;

  // ---- the triangles, drawn in the answer's own geometry ----
  const TW = 106;
  const TH = 150;
  const topY = 58;
  const baseY = topY + TH;
  const yAt = (heightFromApex: number) => topY + (heightFromApex / h) * TH;
  const halfAt = (heightFromApex: number) => (heightFromApex / h) * (TW / 2);

  const tri = (cx: number) => `${cx},${topY} ${cx + TW / 2},${baseY} ${cx - TW / 2},${baseY}`;
  /** The trapezoid of the copy below a cut at the given depth. */
  const trap = (cx: number, depth: number) => {
    const y = yAt(depth);
    const hw = halfAt(depth);
    return `${cx - hw},${y} ${cx + hw},${y} ${cx + TW / 2},${baseY} ${cx - TW / 2},${baseY}`;
  };
  const capTri = (cx: number, depth: number) => {
    const y = yAt(depth);
    const hw = halfAt(depth);
    return `${cx},${topY} ${cx + hw},${y} ${cx - hw},${y}`;
  };

  const LX = 96;
  const RX = 366;

  // ---- the three squares of phase 2 ----
  const sq = 100 / h; // px per unit of height
  const sTop = top * sq;
  const sMid = mid * sq;
  const sBig = h * sq;
  const sqBase = 206;
  const bigX = 262;
  const fracTop = (top * top) / (h * h);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ================= phase 0: the two copies ================= */}
        {phase === 0 && (
          <g>
            <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              same triangle twice, one cut each — and the two shaded pieces match
            </text>

            {/* the shared height */}
            <line x1={W / 2} y1={topY} x2={W / 2} y2={baseY} stroke={DIM} strokeWidth={1.3} strokeDasharray="4 3" />
            <line x1={LX} y1={topY} x2={W / 2} y2={topY} stroke={DIM} strokeWidth={1} strokeDasharray="3 4" />
            <line x1={W / 2} y1={topY} x2={RX} y2={topY} stroke={DIM} strokeWidth={1} strokeDasharray="3 4" />
            <line x1={LX} y1={baseY} x2={RX} y2={baseY} stroke={DIM} strokeWidth={1} strokeDasharray="3 4" />
            <text x={W / 2 + 9} y={(topY + baseY) / 2} fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
              h
            </text>

            {[
              { cx: LX, shadedIsCap: false, depth: top, mark: top, markFromApex: true },
              { cx: RX, shadedIsCap: true, depth: mid, mark: bot, markFromApex: false },
            ].map((s, i) => (
              <g key={i}>
                <motion.polygon
                  points={s.shadedIsCap ? capTri(s.cx, s.depth) : trap(s.cx, s.depth)}
                  fill={SHADE}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.35 }}
                />
                <polygon points={tri(s.cx)} fill="none" stroke={INK} strokeWidth={1.8} />
                <line
                  x1={s.cx - halfAt(s.depth)}
                  y1={yAt(s.depth)}
                  x2={s.cx + halfAt(s.depth)}
                  y2={yAt(s.depth)}
                  stroke={INK}
                  strokeWidth={1.6}
                />
                {/* the marked height */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.2 }}>
                  <line
                    x1={s.cx}
                    y1={s.markFromApex ? topY : yAt(s.depth)}
                    x2={s.cx}
                    y2={s.markFromApex ? yAt(s.depth) : baseY}
                    stroke={INK}
                    strokeWidth={1.2}
                    strokeDasharray="4 3"
                  />
                  <text
                    x={s.cx + 7}
                    y={s.markFromApex ? (topY + yAt(s.depth)) / 2 : (yAt(s.depth) + baseY) / 2 + 4}
                    fontSize="12"
                    fontWeight="800"
                    fill={INK}
                    fontFamily={numberFont}
                  >
                    {fmt(s.mark)}
                  </text>
                </motion.g>
                <text x={s.cx} y={topY - 8} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  B
                </text>
                <text x={s.cx - TW / 2 - 9} y={baseY + 12} fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  A
                </text>
                <text x={s.cx + TW / 2 + 2} y={baseY + 12} fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  C
                </text>
              </g>
            ))}
            <motion.text
              x={W / 2}
              y={baseY + 26}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.3 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              shaded = shaded
            </motion.text>
            <motion.text
              x={W / 2}
              y={baseY + 44}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={DIM}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              the right copy's shaded top falls {fmt(bot)} short of the base, so it stands h − {fmt(bot)} tall
            </motion.text>
          </g>
        )}

        {/* ================= phase 1: similar means areas go as height² ================= */}
        {phase === 1 && (
          <g>
            <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              stretch a cut-off top back up to the whole — both directions grow at once
            </text>
            {/* the small triangle inflating to the whole */}
            <polygon points={tri(LX)} fill="none" stroke={DIM} strokeWidth={1.5} strokeDasharray="4 3" />
            <motion.polygon
              points={tri(LX)}
              fill={IND}
              fillOpacity={0.2}
              stroke={IND}
              strokeWidth={2}
              initial={{ scaleX: top / h, scaleY: top / h, y: -(TH * (1 - top / h)) / 2 }}
              animate={{ scaleX: [top / h, top / h, 1, 1], scaleY: [top / h, top / h, 1, 1], y: [-(TH * (1 - top / h)) / 2, -(TH * (1 - top / h)) / 2, 0, 0] }}
              transition={{ duration: 3.2, times: [0, 0.25, 0.7, 1], repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            <text x={LX} y={baseY + 16} textAnchor="middle" fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont}>
              height × h/{fmt(top)}
            </text>
            <text x={LX} y={baseY + 29} textAnchor="middle" fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont}>
              width × h/{fmt(top)}
            </text>
            <motion.text
              x={LX}
              y={baseY + 47}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              area × (h/{fmt(top)})²
            </motion.text>

            {/* the two triangles the problem hands us */}
            {[
              { x: 244, label: `${fmt(top)}`, frac: `(${fmt(top)}/h)² of △ABC`, c: IND, dep: top, who: "the left copy's white top" },
              { x: 372, label: `h − ${fmt(bot)}`, frac: `((h−${fmt(bot)})/h)² of △ABC`, c: TEAL, dep: mid, who: "the right copy's shaded top" },
            ].map((t, i) => (
              <motion.g
                key={t.x}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1.5 + i * 0.35 }}
              >
                <polygon points={tri(t.x)} fill="none" stroke={DIM} strokeWidth={1.3} />
                <polygon points={capTri(t.x, t.dep)} fill={t.c} fillOpacity={0.28} stroke={t.c} strokeWidth={1.8} />
                <text x={t.x} y={yAt(t.dep) - 6} textAnchor="middle" fontSize="10" fontWeight="800" fill={t.c} fontFamily={numberFont}>
                  {t.label}
                </text>
                <text x={t.x} y={baseY + 16} textAnchor="middle" fontSize="10" fontWeight="800" fill={t.c} fontFamily={numberFont}>
                  {t.frac}
                </text>
                <text x={t.x} y={baseY + 29} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM}>
                  {t.who}
                </text>
              </motion.g>
            ))}
          </g>
        )}

        {/* ================= phase 2: the whole is the two small ones ================= */}
        {phase === 2 && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              whole − top = other top, so the whole is the two tops put together
            </text>
            <motion.text
              x={W / 2}
              y={44}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              whole = T({fmt(top)}) + T(h − {fmt(bot)})
            </motion.text>
            <motion.text
              x={W / 2}
              y={62}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="700"
              fill={DIM}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              and areas go as the square of the height — so draw a square on each
            </motion.text>

            {/* the two small squares */}
            {[
              { x: 40, s: sTop, c: IND, lab: `${fmt(top)}²` },
              { x: 40 + sTop + 26, s: sMid, c: TEAL, lab: `(h−${fmt(bot)})²` },
            ].map((q, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.6 + i * 0.25 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <rect x={q.x} y={sqBase - q.s} width={q.s} height={q.s} fill={q.c} fillOpacity={0.28} stroke={q.c} strokeWidth={1.8} />
                <text x={q.x + q.s / 2} y={sqBase - q.s / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={q.c} fontFamily={numberFont}>
                  {q.lab}
                </text>
              </motion.g>
            ))}
            <text x={40 + sTop + 13} y={sqBase - 12} textAnchor="middle" fontSize="15" fontWeight="800" fill={INK} fontFamily={numberFont}>
              +
            </text>
            <text x={bigX - 22} y={sqBase - 40} textAnchor="middle" fontSize="15" fontWeight="800" fill={INK} fontFamily={numberFont}>
              =
            </text>

            {/* the big square, filling with the two areas */}
            <motion.rect
              x={bigX}
              y={sqBase - sBig}
              width={sBig}
              height={sBig}
              fill="#fff"
              stroke={INK}
              strokeWidth={2}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16, delay: 1.1 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            <motion.rect
              x={bigX}
              y={sqBase - sBig * fracTop}
              width={sBig}
              height={sBig * fracTop}
              fill={IND}
              fillOpacity={0.28}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ type: "spring", stiffness: 60, damping: 15, delay: 1.5 }}
              style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
            />
            <motion.rect
              x={bigX}
              y={sqBase - sBig}
              width={sBig}
              height={sBig * (1 - fracTop)}
              fill={TEAL}
              fillOpacity={0.28}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ type: "spring", stiffness: 60, damping: 15, delay: 2 }}
              style={{ transformBox: "fill-box", transformOrigin: "top" }}
            />
            <text x={bigX + sBig / 2} y={sqBase + 16} textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
              h²
            </text>
            <motion.text
              x={W / 2}
              y={sqBase + 42}
              textAnchor="middle"
              fontSize="15"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4 }}
            >
              h² = {fmt(top)}² + (h − {fmt(bot)})²
            </motion.text>
          </g>
        )}

        {/* ================= phase 3: the h² cancels ================= */}
        {phase === 3 &&
          (() => {
            const L2 = `h² = ${fmt(top * top)} + h² − ${fmt(2 * bot)}h + ${fmt(bot * bot)}`;
            const fs = 13.5;
            const cw = fs * 0.6; // monospace: exact, so the strikes land on the real tokens
            const x0 = W / 2 - (L2.length * cw) / 2;
            const hits: number[] = [];
            for (let i = L2.indexOf("h²"); i >= 0; i = L2.indexOf("h²", i + 1)) hits.push(i);
            const lines = [
              { t: `h² = ${fmt(top)}² + (h − ${fmt(bot)})²`, c: INK, big: false },
              { t: L2, c: INK, big: false, strike: true },
              { t: `${fmt(2 * bot)}h = ${fmt(top * top)} + ${fmt(bot * bot)} = ${fmt(top * top + bot * bot)}`, c: IND, big: false },
              { t: `h = ${fmt(top * top + bot * bot)} ÷ ${fmt(2 * bot)} = ${fmt(h)}`, c: WIN, big: true },
            ];
            // the settled figure
            const mx = 92;
            const my = 130;
            const mh = 76;
            const mw = 42;
            const k = mid / h;
            return (
              <g>
                <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  it looks quadratic, but h² sits on both sides and cancels
                </text>
                {lines.map((l, i) => {
                  const y = 52 + i * 28;
                  return (
                    <motion.g
                      key={i}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 + i * 0.45 }}
                    >
                      <text
                        x={W / 2}
                        y={y}
                        textAnchor="middle"
                        fontSize={l.big ? 16 : fs}
                        fontWeight="800"
                        fill={l.c}
                        fontFamily={numberFont}
                      >
                        {l.t}
                      </text>
                      {l.strike &&
                        hits.map((idx) => (
                          <motion.line
                            key={idx}
                            x1={x0 + idx * cw - 1}
                            y1={y - 4}
                            x2={x0 + (idx + 2) * cw + 1}
                            y2={y - 4}
                            stroke={BAD}
                            strokeWidth={2}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.25, delay: 1.5 }}
                          />
                        ))}
                    </motion.g>
                  );
                })}

                {/* the settled triangle, with the cut where it really lands */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
                  <polygon points={`${mx},${my} ${mx + mw},${my + mh} ${mx - mw},${my + mh}`} fill="none" stroke={INK} strokeWidth={1.6} />
                  <polygon
                    points={`${mx},${my} ${mx + mw * k},${my + mh * k} ${mx - mw * k},${my + mh * k}`}
                    fill={TEAL}
                    fillOpacity={0.3}
                    stroke={TEAL}
                    strokeWidth={1.5}
                  />
                  <text x={mx} y={my + mh + 14} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                    h = {fmt(h)}, top = {fmt(mid)}
                  </text>
                </motion.g>
                <motion.text
                  x={186}
                  y={196}
                  fontSize="11.5"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                >
                  {fmt(top)}² + {fmt(mid)}² = {fmt(top * top + mid * mid)}
                </motion.text>
                <motion.text
                  x={186}
                  y={216}
                  fontSize="11.5"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.6 }}
                >
                  {fmt(h)}² = {fmt(h * h)} ✓
                </motion.text>
                <motion.text
                  x={186}
                  y={236}
                  fontSize="9.5"
                  fontWeight="700"
                  fill={DIM}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.7 }}
                >
                  both shaded pieces come to {(leftShaded * 100).toFixed(1)}% of the triangle
                </motion.text>
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
          ? `left shaded = whole − T(${fmt(top)}),  right shaded = T(h − ${fmt(bot)})`
          : phase === 1
          ? `a similar triangle's area is (height ratio)² of the whole`
          : phase === 2
          ? `the big square is exactly the two small squares`
          : `h = ${fmt(h)}`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed: h = {fmt(h)}, shaded {fmt(leftShaded)} vs {fmt(rightShaded)}
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.8 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
