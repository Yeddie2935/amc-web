import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const TORT = "#0d9488";
const HARE = "#d97706";
const GRID = "#cbd5e1";

type Pt = [number, number];
type Graph = { label: string; hare: Pt[]; tortoise: Pt[] };

const EPS = 1e-6;

const parsePoly = (s: string): Pt[] =>
  s
    .trim()
    .split(/\s+/)
    .map((p) => {
      const [a, b] = p.split(",").map(Number);
      return [a, b] as Pt;
    })
    .filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]));

/** Distance travelled at time t, linearly interpolated along the polyline. */
function at(poly: Pt[], t: number): number {
  if (!poly.length) return 0;
  if (t <= poly[0][0]) return poly[0][1];
  for (let i = 1; i < poly.length; i++) {
    const [t0, d0] = poly[i - 1];
    const [t1, d1] = poly[i];
    if (t <= t1) return t1 === t0 ? d1 : d0 + ((d1 - d0) * (t - t0)) / (t1 - t0);
  }
  return poly[poly.length - 1][1];
}

/** The first time the polyline reaches the finish distance. */
function finishTime(poly: Pt[], finish: number): number {
  for (let i = 1; i < poly.length; i++) {
    const [t0, d0] = poly[i - 1];
    const [t1, d1] = poly[i];
    if (d1 >= finish - EPS && d0 < finish - EPS) {
      return d1 === d0 ? t1 : t0 + ((finish - d0) * (t1 - t0)) / (d1 - d0);
    }
  }
  return poly.length ? poly[poly.length - 1][0] : 0;
}

const slopes = (poly: Pt[]) =>
  poly.slice(1).map((p, i) => (p[0] === poly[i][0] ? 0 : (p[1] - poly[i][1]) / (p[0] - poly[i][0])));

/**
 * A story told in words with five candidate distance–time graphs, asking which
 * one it is. Squinting at all five at once is the trap; the way through is to
 * turn each clause of the story into a **property the curve must have**, then let
 * every graph be tested against it — so the eliminations are read off the shapes
 * rather than recalled.
 *
 * Three clauses, three tests, all evaluated from the polylines themselves: the
 * tortoise "walks at a slow steady pace" means its line has **one slope
 * throughout**; the hare "stops to take a nap" means its line has a genuinely
 * **flat stretch** and never runs backwards; and the tortoise being "already
 * there" means it reaches the finish **at an earlier time**, which is the only
 * thing separating the last two survivors — they have identical shapes and differ
 * solely in which curve hits the finish height first.
 *
 * The opening beat plays the race itself along the winning graph's own timeline,
 * so the hare's nap is watched rather than described, and the closing beat lifts
 * the two look-alikes side by side and drops a marker where each animal crosses
 * the finish line. Every verdict is computed by running the tests over the data,
 * and the scene checks that exactly one graph survives and that it is the stored
 * answer.
 * Data: { graphs: ["A|hare pts|tortoise pts", ...], finish, tMax? }.
 */
export function GraphMatchStoryScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const finish = num(data.finish, 4);
  const graphs: Graph[] = (Array.isArray(data.graphs) ? data.graphs : []).map((g) => {
    const [label, hare, tort] = String(g).split("|");
    return { label: label ?? "?", hare: parsePoly(hare ?? ""), tortoise: parsePoly(tort ?? "") };
  });
  const tMax = num(data.tMax, Math.max(1, ...graphs.flatMap((g) => [...g.hare, ...g.tortoise]).map((p) => p[0])));

  // ---- the three story clauses, as tests run over the real polylines ----
  const verdicts = graphs.map((g) => {
    const ts = slopes(g.tortoise);
    const hs = slopes(g.hare);
    const steady = ts.length > 0 && ts.every((s) => Math.abs(s - ts[0]) < 1e-3);
    const naps = hs.some((s) => Math.abs(s) < 1e-3);
    const forward = hs.every((s) => s > -1e-3) && ts.every((s) => s > -1e-3);
    const tF = finishTime(g.tortoise, finish);
    const hF = finishTime(g.hare, finish);
    const first = tF < hF - 1e-3;
    return { ...g, steady, naps, forward, first, tF, hF, ok: steady && naps && forward && first };
  });
  const survivors = verdicts.filter((v) => v.ok);
  const winner = survivors[0];

  // ---- self-checks ----
  const uniqueWin = survivors.length === 1;
  const matchesStored = !winner || !problem.answer || winner.label === String(problem.answer);

  // which graphs each test knocks out — discovered, not asserted
  const failSteady = verdicts.filter((v) => !v.steady);
  const failNap = verdicts.filter((v) => v.steady && (!v.naps || !v.forward));
  const failFirst = verdicts.filter((v) => v.steady && v.naps && v.forward && !v.first);

  // ---- beats ----
  const last = totalSteps - 1;
  const isFinal = step >= last;
  const plan = totalSteps >= 4 ? [0, 1, 2] : totalSteps === 3 ? [0, 1] : [0];
  const beat = isFinal ? 3 : plan[Math.min(Math.max(step, 0), plan.length - 1)];

  // a graph is out once its own test has been applied
  const outBy = (v: (typeof verdicts)[number]) => {
    if (!v.steady) return 1;
    if (!v.naps || !v.forward) return 2;
    if (!v.first) return 3;
    return 99;
  };
  const reason = (v: (typeof verdicts)[number]) =>
    !v.steady ? "not steady" : !v.forward ? "goes backwards" : !v.naps ? "never stops" : !v.first ? "hare wins" : "";

  const W = 340;
  const H = 300;

  const caption =
    beat === 0
      ? `the hare runs, naps, sprints — the tortoise plods and wins`
      : beat === 1
      ? `steady tortoise ⇒ one straight line: ${failSteady.map((v) => v.label).join(", ")} out`
      : beat === 2
      ? `a nap is a flat stretch: ${failNap.map((v) => v.label).join(", ")} out`
      : `the tortoise must reach the finish first`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* ---- beat 0: the race itself, run along the winning graph's timeline ---- */}
        {beat === 0 && winner && (
          <RaceBeat W={W} winner={winner} finish={finish} tMax={tMax} />
        )}

        {/* ---- beats 1-2: the gallery of five, tested ---- */}
        {(beat === 1 || beat === 2) && (
          <g>
            <text x={W / 2} y={11} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={numberFont}>
              {beat === 1 ? "one slope, all the way" : "flat for the nap, and never turning down"}
            </text>
            {verdicts.map((v, i) => {
              const col = i % 3;
              const row = Math.floor(i / 3);
              const gw = 100;
              const gh = 74;
              const gx = row === 0 ? 8 + col * 111 : 63 + col * 111;
              const gy = 26 + row * 104;
              const dead = outBy(v) <= beat;
              return (
                <motion.g
                  key={v.label}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: dead ? 0.4 : 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.08 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <MiniGraph
                    g={v}
                    x={gx}
                    y={gy}
                    w={gw}
                    h={gh}
                    tMax={tMax}
                    finish={finish}
                    highlight={outBy(v) === beat}
                    dead={dead}
                  />
                  <text x={gx + 4} y={gy - 4} fontSize="10.5" fontWeight="800" fill={dead ? DIM : INK} fontFamily={numberFont}>
                    {v.label}
                  </text>
                  {/* struck out on the beat its own test fires */}
                  <AnimatePresence>
                    {dead && (
                      <motion.g
                        key="x"
                        initial={{ opacity: 0, pathLength: 0 }}
                        animate={{ opacity: 1, pathLength: 1 }}
                        transition={{ duration: 0.35, delay: outBy(v) === beat ? 0.8 + i * 0.12 : 0 }}
                      >
                        <motion.path
                          d={`M ${gx + 6},${gy + 6} L ${gx + gw - 6},${gy + gh - 6}`}
                          stroke={BAD}
                          strokeWidth={2.2}
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.35, delay: outBy(v) === beat ? 0.8 + i * 0.12 : 0 }}
                        />
                        <text
                          x={gx + gw / 2}
                          y={gy + gh + 11}
                          textAnchor="middle"
                          fontSize="8.5"
                          fontWeight="800"
                          fill={BAD}
                          fontFamily={numberFont}
                        >
                          {reason(v)}
                        </text>
                      </motion.g>
                    )}
                  </AnimatePresence>
                </motion.g>
              );
            })}
            <motion.text
              x={W / 2}
              y={H - 44}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={DIM}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <tspan fill={TORT}>tortoise</tspan>
              {"  ·  "}
              <tspan fill={HARE}>hare</tspan>
            </motion.text>
            <motion.text
              x={W / 2}
              y={H - 24}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 1.7 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {`${verdicts.filter((v) => outBy(v) > beat).length} still standing`}
            </motion.text>
          </g>
        )}

        {/* ---- beat 3: the two look-alikes, decided at the finish line ---- */}
        {beat === 3 && (
          <g>
            <text x={W / 2} y={11} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={numberFont}>
              same shapes — only the finish order differs
            </text>
            {verdicts
              .filter((v) => v.steady && v.naps && v.forward)
              .slice(0, 2)
              .map((v, i) => {
                const gw = 148;
                const gh = 108;
                const gx = 14 + i * 164;
                const gy = 30;
                return (
                  <motion.g
                    key={v.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 240, damping: 20, delay: i * 0.2 }}
                  >
                    <MiniGraph g={v} x={gx} y={gy} w={gw} h={gh} tMax={tMax} finish={finish} highlight={false} dead={!v.ok} />
                    <text x={gx + 4} y={gy - 5} fontSize="11.5" fontWeight="800" fill={v.ok ? WIN : BAD} fontFamily={numberFont}>
                      {v.label}
                    </text>
                    {/* where each one crosses the finish height */}
                    {(
                      [
                        { t: v.tF, c: TORT, who: "🐢" },
                        { t: v.hF, c: HARE, who: "🐇" },
                      ] as const
                    ).map((m, j) => {
                      const mx = gx + (m.t / tMax) * gw;
                      return (
                        <motion.g
                          key={j}
                          initial={{ opacity: 0, y: -12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.7 + i * 0.2 + j * 0.15 }}
                        >
                          <path d={`M ${mx},${gy} L ${mx},${gy + gh}`} stroke={m.c} strokeWidth={1.2} strokeDasharray="3 3" />
                          <text x={mx} y={gy + gh + 13} textAnchor="middle" fontSize="10" fontFamily={numberFont}>
                            {m.who}
                          </text>
                        </motion.g>
                      );
                    })}
                    <motion.text
                      x={gx + gw / 2}
                      y={gy + gh + 30}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="800"
                      fill={v.ok ? WIN : BAD}
                      fontFamily={numberFont}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 + i * 0.2 }}
                    >
                      {v.ok ? "tortoise first ✓" : "hare first ✗"}
                    </motion.text>
                    {!v.ok && (
                      <motion.path
                        d={`M ${gx + 8},${gy + 8} L ${gx + gw - 8},${gy + gh - 8}`}
                        stroke={BAD}
                        strokeWidth={2.4}
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 1.4 }}
                      />
                    )}
                  </motion.g>
                );
              })}
            <motion.text
              x={W / 2}
              y={200}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={DIM}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              whichever curve reaches the finish height sooner, wins
            </motion.text>
            {winner && (
              <motion.g
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 14, delay: 1.85 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <rect x={W / 2 - 52} y={216} width={104} height={28} rx={14} fill={WIN} />
                <text x={W / 2} y={235} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                  graph {winner.label}
                </text>
              </motion.g>
            )}
          </g>
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : IND,
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
            key="notes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", lineHeight: 1.55 }}
          >
            {!uniqueWin ? (
              `check failed: ${survivors.length} graphs pass all three tests`
            ) : !matchesStored ? (
              `check failed: the tests single out ${winner?.label}, not ${problem.answer}`
            ) : (
              <>
                {`three clauses, three tests, one survivor`}
                {failSteady.length > 0 && (
                  <>
                    <br />
                    {`${failSteady.map((v) => v.label).join(", ")}: the tortoise speeds up partway`}
                  </>
                )}
                {failNap.length > 0 && (
                  <>
                    <br />
                    {failNap.map((v) => `${v.label} ${reason(v)}`).join("; ")}
                  </>
                )}
                {failFirst.length > 0 && (
                  <>
                    <br />
                    {`${failFirst.map((v) => v.label).join(", ")}: right shape, but the hare gets there first`}
                  </>
                )}
              </>
            )}
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

/** One candidate plot: dashed grid, axes, and the two curves. */
function MiniGraph({
  g,
  x,
  y,
  w,
  h,
  tMax,
  finish,
  highlight,
  dead,
}: {
  g: Graph & { steady?: boolean; naps?: boolean; forward?: boolean };
  x: number;
  y: number;
  w: number;
  h: number;
  tMax: number;
  finish: number;
  highlight: boolean;
  dead: boolean;
}) {
  const px = (t: number) => x + (t / tMax) * w;
  const py = (d: number) => y + h - (d / finish) * h;
  const path = (poly: Pt[]) => poly.map((p, i) => `${i ? "L" : "M"} ${px(p[0])},${py(p[1])}`).join(" ");
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#fff" stroke={GRID} strokeWidth={1} />
      {[1, 2, 3].map((i) => (
        <path key={`hg${i}`} d={`M ${x},${py((finish * i) / 4)} L ${x + w},${py((finish * i) / 4)}`} stroke={GRID} strokeWidth={0.6} strokeDasharray="3 3" />
      ))}
      {[1, 2, 3, 4, 5].map((i) => (
        <path key={`vg${i}`} d={`M ${px((tMax * i) / 6)},${y} L ${px((tMax * i) / 6)},${y + h}`} stroke={GRID} strokeWidth={0.6} strokeDasharray="3 3" />
      ))}
      <path d={`M ${x},${y} L ${x},${y + h} L ${x + w},${y + h}`} stroke={INK} strokeWidth={1.2} fill="none" />
      <motion.path
        d={path(g.tortoise)}
        stroke={TORT}
        strokeWidth={highlight && !g.steady ? 3 : 2}
        fill="none"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        d={path(g.hare)}
        stroke={HARE}
        strokeWidth={highlight && g.steady ? 3 : 2}
        fill="none"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      />
      {/* ring the offending corner on the beat that rules this graph out */}
      {highlight && !g.steady && g.tortoise.length > 2 && (
        <motion.circle
          cx={px(g.tortoise[g.tortoise.length - 2][0])}
          cy={py(g.tortoise[g.tortoise.length - 2][1])}
          r={6}
          fill="none"
          stroke={BAD}
          strokeWidth={1.8}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 15, delay: 0.5 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      )}
      {highlight && g.steady && !g.forward && (
        <motion.circle
          cx={px(g.hare[1]?.[0] ?? 0)}
          cy={py(g.hare[1]?.[1] ?? 0)}
          r={6}
          fill="none"
          stroke={BAD}
          strokeWidth={1.8}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 15, delay: 0.5 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      )}
    </g>
  );
}

/** The race played out along the winning graph's own timeline. */
function RaceBeat({ W, winner, finish, tMax }: { W: number; winner: Graph; finish: number; tMax: number }) {
  const x0 = 34;
  const x1 = W - 34;
  const span = x1 - x0;
  const N = 40;
  const ts = Array.from({ length: N + 1 }, (_, i) => (i * tMax) / N);
  const times = ts.map((t) => t / tMax);
  const lane = (poly: Pt[]) => ts.map((t) => x0 + (at(poly, t) / finish) * span);
  const dur = 4.4;

  return (
    <g>
      <text x={W / 2} y={16} textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM} fontFamily={numberFont}>
        the story, run as a race
      </text>

      {/* the track, one lane each */}
      {[
        { y: 54, poly: winner.hare, c: HARE, who: "🐇", name: "hare" },
        { y: 104, poly: winner.tortoise, c: TORT, who: "🐢", name: "tortoise" },
      ].map((l, i) => (
        <g key={i}>
          <path d={`M ${x0},${l.y + 14} L ${x1},${l.y + 14}`} stroke={GRID} strokeWidth={2} />
          <text x={8} y={l.y + 18} fontSize="9" fontWeight="800" fill={l.c} fontFamily={numberFont}>
            {l.name}
          </text>
          <motion.text
            fontSize="18"
            initial={{ x: 0 }}
            animate={{ x: lane(l.poly).map((v) => v - x0) }}
            transition={{ duration: dur, times, ease: "linear", delay: 0.3 }}
          >
            <tspan x={x0 - 9} y={l.y + 10}>
              {l.who}
            </tspan>
          </motion.text>
        </g>
      ))}

      {/* the finish line */}
      <path d={`M ${x1},${40} L ${x1},${124}`} stroke={INK} strokeWidth={2} />
      <text x={x1 + 2} y={36} textAnchor="middle" fontSize="11">
        🏁
      </text>

      {/* the nap, marked where the hare's line actually goes flat */}
      {(() => {
        const hs = slopes(winner.hare);
        const j = hs.findIndex((s) => Math.abs(s) < 1e-3);
        if (j < 0) return null;
        const nx = x0 + (winner.hare[j][1] / finish) * span;
        return (
          <motion.g
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: dur, times: [winner.hare[j][0] / tMax, winner.hare[j][0] / tMax + 0.04, winner.hare[j + 1][0] / tMax - 0.04, winner.hare[j + 1][0] / tMax], delay: 0.3 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <text x={nx + 14} y={46} fontSize="12" fontWeight="800" fill={HARE} fontFamily={numberFont}>
              💤
            </text>
          </motion.g>
        );
      })()}

      {/* what the graph therefore has to show */}
      {[
        { t: "the tortoise never changes pace", c: TORT },
        { t: "the hare stops dead for a while", c: HARE },
        { t: "the tortoise reaches the finish first", c: INK },
      ].map((r, i) => (
        <motion.g key={`d${i}`} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 240, damping: 20, delay: 2.6 + i * 0.25 }}>
          <circle cx={30} cy={168 + i * 26} r={7} fill="#fff" stroke={r.c} strokeWidth={1.6} />
          <text x={30} y={171.5 + i * 26} textAnchor="middle" fontSize="9" fontWeight="800" fill={r.c} fontFamily={numberFont}>
            {i + 1}
          </text>
          <text x={44} y={172 + i * 26} fontSize="10.5" fontWeight="700" fill={INK} fontFamily={numberFont}>
            {r.t}
          </text>
        </motion.g>
      ))}
      <motion.text
        x={W / 2}
        y={262}
        textAnchor="middle"
        fontSize="11.5"
        fontWeight="800"
        fill={IND}
        fontFamily={numberFont}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 15, delay: 3.5 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        test all five against these three
      </motion.text>
    </g>
  );
}
