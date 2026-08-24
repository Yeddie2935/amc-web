import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const TOP = "#4338ca";
const BOT = "#64748b";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WARN = "#b45309";
const LINE = "#cbd5e1";

/**
 * A double round-robin where the leading teams finish level, asking the greatest
 * total they can share. The picture that settles it is the **crosstable**: with
 * every pair meeting twice, the table's off-diagonal cells are exactly the games,
 * one per ordered pair, so the whole tournament is countable at a glance. Sorting
 * the leaders to the front then cuts it into blocks, and the argument is a
 * **budget**: the leaders can win all `top × (teams − top) × meetings` games
 * against the rest, but the games they play *each other* hand their points to a
 * leader no matter who wins — while the games among the trailing teams can never
 * reach them at all. That caps the leaders' shared pile, and dividing by their
 * number caps each one.
 *
 * A ceiling alone proves nothing, so the closing beat **builds a tournament that
 * reaches it**: every leader beats every trailing team, and among themselves the
 * home side wins, which splits the internal games evenly. The scene fills its own
 * table with the winner of each game and then *counts the letters* to get every
 * team's total, so the construction is verified on screen rather than asserted —
 * including that the trailing teams finish far enough back to really be trailing.
 *
 * Distractors are priced against the budget: any choice needing more than the
 * whole pile is struck out with the arithmetic that kills it, and the scene
 * separately recognises the "won every single game" value, which is the tempting
 * one. Data `{ teams, top, meetings, win }`.
 */
export function TournamentBudgetScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const teams = Math.round(num(data.teams, 6));
  const top = Math.round(num(data.top, 3));
  const meetings = Math.round(num(data.meetings, 2));
  const win = Math.round(num(data.win, 3));
  const rest = teams - top;

  const pairs = (k: number) => (k * (k - 1)) / 2;
  const internalGames = pairs(top) * meetings;
  const crossGames = top * rest * meetings;
  const restGames = pairs(rest) * meetings;
  const totalGames = pairs(teams) * meetings;

  const crossPts = crossGames * win;
  const internalPts = internalGames * win;
  const restPts = restGames * win;
  const budget = crossPts + internalPts;
  const ceiling = Math.floor(budget / top);

  // ---- a tournament that actually reaches the ceiling ----
  // cell (i, j) is the game i hosts against j; exactly one leader wins it,
  // otherwise the host does — which splits the leaders' own games evenly
  const winnerOf = (i: number, j: number) => {
    const ti = i < top;
    const tj = j < top;
    if (ti && !tj) return i;
    if (tj && !ti) return j;
    return i;
  };
  const built = Array.from({ length: teams }, () => 0);
  for (let i = 0; i < teams; i++) {
    for (let j = 0; j < teams; j++) if (i !== j) built[winnerOf(i, j)] += win;
  }
  const topTotals = built.slice(0, top);
  const restTotals = built.slice(top);
  const achieved = topTotals[0];
  const restBest = restTotals.length ? Math.max(...restTotals) : 0;

  const label = (i: number) => String.fromCharCode(65 + i);
  const sweep = win * meetings * (teams - 1); // winning every game you play

  // ---- choices the budget rules out ----
  const asInt = (text: string) => {
    const t = String(text).replace(/[−–—]/g, "-").trim();
    return /^-?\d+$/.test(t) ? Number(t) : null;
  };
  const overBudget = (problem.choices ?? [])
    .map((c) => ({ label: c.label, v: asInt(c.text) }))
    .filter((c): c is { label: string; v: number } => c.v != null && c.v * top > budget);

  const checks = [
    { ok: teams > top && top >= 2, msg: "there must be at least two leaders and someone below them" },
    { ok: meetings === 2, msg: "the crosstable only draws one cell per game when every pair meets twice" },
    { ok: new Set(topTotals).size === 1, msg: `the construction leaves the leaders on ${topTotals.join(", ")} rather than level` },
    { ok: achieved === ceiling, msg: `the budget allows ${ceiling} each but the construction only reaches ${achieved}` },
    { ok: restBest < achieved, msg: `a trailing team reaches ${restBest}, so the leaders are not the top ${top}` },
    {
      ok: problem.shortAnswer == null || Number(problem.shortAnswer) === achieved,
      msg: `computed ${achieved} but the stored answer is ${problem.shortAnswer}`,
    },
  ];
  const failed = checks.find((c) => !c.ok);

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 480;
  const H = 262;

  // ---- crosstable geometry ----
  const cell = 25;
  const GX = 92;
  const GY = 58;
  const cxAt = (c: number) => GX + c * cell;
  const cyAt = (r: number) => GY + r * cell;
  const PX = 258; // side panel

  // ---- budget bar geometry (beat 2) ----
  const barX = 40;
  const barW = 400;
  const perPt = barW / (crossPts + internalPts + restPts);

  const blocks = [
    { r0: 0, c0: 0, rh: top, cw: top, games: internalGames, tint: "#fef3c7", edge: WARN, name: `the top ${top} against each other` },
    { r0: 0, c0: top, rh: top, cw: rest, games: crossGames / 2, tint: "#dcfce7", edge: WIN, name: `top ${top} at home to the rest` },
    { r0: top, c0: 0, rh: rest, cw: top, games: crossGames / 2, tint: "#dcfce7", edge: WIN, name: `the rest at home to the top ${top}` },
    { r0: top, c0: top, rh: rest, cw: rest, games: restGames, tint: "#f1f5f9", edge: DIM, name: `the bottom ${rest} against each other` },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 490 }}>
        <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
          {phase === 0
            ? `${teams} teams, every pair twice — one cell per game`
            : phase === 1
            ? `split the table into blocks: which games can pay the top ${top}?`
            : phase === 2
            ? `the most the top ${top} can hold between them`
            : `a tournament that actually reaches ${achieved}`}
        </text>

        {/* ================= the crosstable (beats 0, 1 and 3) ================= */}
        {phase !== 2 && (
          <g>
            {/* block tints, drawn first so the grid lines and letters sit on top */}
            {phase >= 1 &&
              blocks.map((b, i) => (
                <motion.rect
                  key={`t${i}`}
                  x={cxAt(b.c0)}
                  y={cyAt(b.r0)}
                  width={b.cw * cell}
                  height={b.rh * cell}
                  fill={b.tint}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: phase === 1 ? 0.3 + i * 0.35 : 0.1 }}
                />
              ))}

            {/* column and row headers */}
            {Array.from({ length: teams }, (_, i) => (
              <motion.g key={`h${i}`} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.05 + i * 0.05 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <rect x={cxAt(i) + 2} y={34} width={21} height={21} rx={5} fill={i < top ? `${TOP}14` : "#f1f5f9"} stroke={i < top ? TOP : LINE} strokeWidth={1.4} />
                <text x={cxAt(i) + 12.5} y={49} textAnchor="middle" fontSize="11" fontWeight="800" fill={i < top ? TOP : BOT} fontFamily={numberFont}>
                  {label(i)}
                </text>
                <rect x={66} y={cyAt(i) + 2} width={21} height={21} rx={5} fill={i < top ? `${TOP}14` : "#f1f5f9"} stroke={i < top ? TOP : LINE} strokeWidth={1.4} />
                <text x={76.5} y={cyAt(i) + 17} textAnchor="middle" fontSize="11" fontWeight="800" fill={i < top ? TOP : BOT} fontFamily={numberFont}>
                  {label(i)}
                </text>
              </motion.g>
            ))}

            {/* the cells: one game each, blanked on the diagonal */}
            {Array.from({ length: teams }, (_, r) =>
              Array.from({ length: teams }, (_, c) => {
                const same = r === c;
                const k = r * teams + c;
                const w = same ? -1 : winnerOf(r, c);
                const litRow = phase === 0 && (r === 0 || c === 0) && !same;
                return (
                  <motion.g key={`${r}-${c}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 + k * 0.012 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <motion.rect
                      x={cxAt(c) + 1}
                      y={cyAt(r) + 1}
                      width={cell - 2}
                      height={cell - 2}
                      rx={3}
                      fill={same ? "#e2e8f0" : "none"}
                      stroke={litRow ? TOP : LINE}
                      strokeWidth={litRow ? 1.8 : 0.8}
                      animate={{ stroke: litRow ? TOP : LINE, strokeWidth: litRow ? 1.8 : 0.8 }}
                      transition={{ delay: 1.1 }}
                    />
                    {same && <line x1={cxAt(c) + 6} y1={cyAt(r) + 19} x2={cxAt(c) + 19} y2={cyAt(r) + 6} stroke={DIM} strokeWidth={1.2} />}
                    {/* beat 3 writes the winner of each game into its cell */}
                    {phase === 3 && !same && (
                      <motion.text
                        x={cxAt(c) + cell / 2}
                        y={cyAt(r) + cell / 2 + 4}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="800"
                        fill={w < top ? WIN : BOT}
                        fontFamily={numberFont}
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.5 + k * 0.02 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      >
                        {label(w)}
                      </motion.text>
                    )}
                  </motion.g>
                );
              })
            )}

            {/* block outlines */}
            {phase === 1 &&
              blocks.map((b, i) => (
                <motion.rect
                  key={`o${i}`}
                  x={cxAt(b.c0)}
                  y={cyAt(b.r0)}
                  width={b.cw * cell}
                  height={b.rh * cell}
                  fill="none"
                  stroke={b.edge}
                  strokeWidth={2.2}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.35 }}
                />
              ))}

            <text x={cxAt(0) + (teams * cell) / 2} y={28} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM}>
              away team
            </text>

            {/* ---- panel ---- */}
            {phase === 0 && (
              <g>
                <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <rect x={PX} y={62} width={200} height={40} rx={8} fill={`${TOP}10`} stroke={TOP} strokeWidth={1.5} />
                  <text x={PX + 100} y={87} textAnchor="middle" fontSize="14" fontWeight="800" fill={TOP} fontFamily={numberFont}>
                    {totalGames} games
                  </text>
                </motion.g>
                <motion.text x={PX} y={124} fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15 }}>
                  every cell off the diagonal is
                </motion.text>
                <motion.text x={PX} y={138} fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15 }}>
                  one game: the row team at home
                </motion.text>
                <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.45 }}>
                  <text x={PX} y={168} fontSize="10.5" fontWeight="800" fill={TOP} fontFamily={numberFont}>
                    row A + column A = {meetings * (teams - 1)}
                  </text>
                  <text x={PX} y={184} fontSize="9.5" fontWeight="700" fill={DIM}>
                    so each team plays {meetings * (teams - 1)} games,
                  </text>
                  <text x={PX} y={197} fontSize="9.5" fontWeight="700" fill={DIM}>
                    worth at most {sweep} points
                  </text>
                </motion.g>
              </g>
            )}

            {phase === 1 && (
              <g>
                {[
                  { name: `top ${top} v top ${top}`, games: internalGames, c: WARN, note: "a leader wins either way" },
                  { name: `top ${top} v bottom ${rest}`, games: crossGames, c: WIN, note: "all winnable" },
                  { name: `bottom ${rest} v bottom ${rest}`, games: restGames, c: DIM, note: "never reach a leader" },
                ].map((r, i) => (
                  <motion.g key={r.name} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.5 + i * 0.35 }}>
                    <rect x={PX} y={56 + i * 46} width={202} height={40} rx={7} fill="#fff" stroke={r.c} strokeWidth={1.5} />
                    <text x={PX + 9} y={72 + i * 46} fontSize="10" fontWeight="800" fill={r.c}>
                      {r.name}
                    </text>
                    <text x={PX + 9} y={87 + i * 46} fontSize="9" fontWeight="700" fill={DIM}>
                      {r.games} games — {r.note}
                    </text>
                  </motion.g>
                ))}
                <motion.text x={PX} y={214} fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
                  {internalGames} + {crossGames} + {restGames} = {totalGames}
                </motion.text>
              </g>
            )}

            {phase === 3 && (
              <g>
                <motion.text x={PX} y={44} fontSize="9.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  each cell holds the winner
                </motion.text>
                {Array.from({ length: teams }, (_, i) => (
                  <motion.g key={`tot${i}`} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: 1.4 + i * 0.13 }}>
                    <rect x={PX} y={54 + i * 25} width={202} height={21} rx={5} fill={i < top ? "#f0fdf4" : "#f8fafc"} stroke={i < top ? WIN : LINE} strokeWidth={1.2} />
                    <text x={PX + 9} y={69 + i * 25} fontSize="10" fontWeight="800" fill={i < top ? WIN : BOT} fontFamily={numberFont}>
                      {label(i)}
                    </text>
                    <text x={PX + 26} y={69 + i * 25} fontSize="9" fontWeight="700" fill={DIM}>
                      {built[i] / win} wins × {win}
                    </text>
                    <text x={PX + 193} y={69 + i * 25} textAnchor="end" fontSize="11" fontWeight="800" fill={i < top ? WIN : BOT} fontFamily={numberFont}>
                      {built[i]}
                    </text>
                  </motion.g>
                ))}
                <motion.text x={PX} y={222} fontSize="9.5" fontWeight="700" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                  the rest finish on {restBest}, so these really
                </motion.text>
                <motion.text x={PX} y={235} fontSize="9.5" fontWeight="700" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                  are the top {top} — and they are level
                </motion.text>
              </g>
            )}
          </g>
        )}

        {/* ================= beat 2: the points budget ================= */}
        {phase === 2 && (
          <g>
            <text x={W / 2} y={40} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM}>
              every game hands out {win} points, so {totalGames} games put {totalGames * win} on the table
            </text>

            {[
              { pts: crossPts, c: WIN, fill: "#dcfce7", lab: `${crossGames} games, top ${top} beat the rest` },
              { pts: internalPts, c: WARN, fill: "#fef3c7", lab: `${internalGames} among the top ${top}` },
              { pts: restPts, c: DIM, fill: "#f1f5f9", lab: `${restGames} among the rest` },
            ].map((s, i, all) => {
              const before = all.slice(0, i).reduce((a, q) => a + q.pts, 0);
              return (
                <g key={s.lab}>
                  <motion.rect
                    x={barX + before * perPt}
                    y={56}
                    height={30}
                    rx={4}
                    fill={s.fill}
                    stroke={s.c}
                    strokeWidth={1.6}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: s.pts * perPt, opacity: i === 2 ? 0.45 : 1 }}
                    transition={{ type: "spring", stiffness: 150, damping: 22, delay: 0.2 + i * 0.3 }}
                  />
                  <motion.text
                    x={barX + before * perPt + (s.pts * perPt) / 2}
                    y={76}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="800"
                    fill={s.c}
                    fontFamily={numberFont}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.3 }}
                  >
                    {s.pts}
                  </motion.text>
                  <motion.text
                    x={barX + before * perPt + (s.pts * perPt) / 2}
                    y={100}
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="700"
                    fill={i === 2 ? DIM : s.c}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65 + i * 0.3 }}
                  >
                    {s.lab}
                  </motion.text>
                </g>
              );
            })}

            <motion.text x={W / 2} y={124} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
              the greyed block can never pay a leader — the other two can
            </motion.text>

            {/* the budget, split three ways */}
            <motion.rect
              x={barX}
              y={140}
              height={32}
              rx={4}
              fill="#eef2ff"
              stroke={TOP}
              strokeWidth={1.8}
              initial={{ width: 0 }}
              animate={{ width: budget * perPt }}
              transition={{ type: "spring", stiffness: 150, damping: 22, delay: 1.6 }}
            />
            {Array.from({ length: top }, (_, i) => (
              <motion.g key={`sp${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 + i * 0.15 }}>
                {i > 0 && <line x1={barX + (i * budget * perPt) / top} y1={140} x2={barX + (i * budget * perPt) / top} y2={172} stroke={TOP} strokeWidth={1.8} />}
                <text
                  x={barX + ((i + 0.5) * budget * perPt) / top}
                  y={161}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="800"
                  fill={TOP}
                  fontFamily={numberFont}
                >
                  {ceiling}
                </text>
              </motion.g>
            ))}
            <motion.text x={barX + budget * perPt + 10} y={161} fontSize="12" fontWeight="800" fill={TOP} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
              {budget} ÷ {top}
            </motion.text>

            {overBudget.length > 0 && (
              <motion.text x={W / 2} y={196} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                anything higher asks for points that do not exist
              </motion.text>
            )}
            {overBudget.map((c, i) => (
              <motion.g key={c.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: 2.7 + i * 0.2 }}>
                <rect x={44} y={204 + i * 26} width={392} height={22} rx={5} fill="#fffbeb" stroke="#fde68a" strokeWidth={1.2} />
                <text x={56} y={219 + i * 26} fontSize="10" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                  {c.label}
                </text>
                <text x={74} y={219 + i * 26} fontSize="9.5" fontWeight="700" fill={INK} fontFamily={numberFont}>
                  {top} × {c.v} = {top * c.v} needed, only {budget} exist
                  {c.v === sweep ? "  (winning every game)" : ""}
                </text>
              </motion.g>
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
        {phase === 0
          ? `${totalGames} games in all`
          : phase === 1
          ? `${crossGames} winnable + ${internalGames} shared`
          : phase === 2
          ? `${budget} ÷ ${top} = ${ceiling} at most`
          : `${achieved} each`}
      </motion.span>

      {failed && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failed.msg}</span>
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
