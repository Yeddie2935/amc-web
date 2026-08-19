import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const BELOW = "#f59e0b";
const WIN = "#16a34a";
const BAD = "#dc2626";
const MUTE = "#94a3b8";

const W = 360;
const H = 214;
const BASE = 148; // centre of the bottom dot
const PITCH = 14;
const R = 5;
const AXIS = 158;

const tidy = (v: number) => String(Number(v.toFixed(4)));

/**
 * A dot plot of scores where some students get a fixed bonus, asking the fewest
 * boosts that lift the **median** to a target. Chasing the median directly is
 * hopeless; the unlock is that the median of `n` scores only cares about **how
 * many sit below the target**, and a fixed bonus moves a student out of that
 * group only if they were already within one bonus of it. So the group below the
 * target has to shrink to a fixed size, and only one column of the plot is even
 * eligible to leave it — which turns the whole problem into one subtraction.
 * The beats count the plot up to the two middle ranks (so the current median is
 * read off the dots, not asserted), draw the target line and measure the block
 * left of it, test both a boost that **fails to cross** and one that does, then
 * fly exactly the needed dots across and recount. The closing beat proves
 * minimality rather than claiming it: the scene brute-forces every combination
 * of how many to boost in each column and reports the **best median reachable
 * with k boosts** as a ladder, so the failures below the answer are visible.
 * Data: { scores: ["65|2", "70|2", ...], boost, targetMedian }.
 */
export function DotPlotShiftScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const boost = num(data.boost, 5);
  const target = num(data.targetMedian, 85);

  const cols = (Array.isArray(data.scores) ? data.scores : [])
    .map((s) => {
      const [v, c] = String(s).split("|");
      return { v: Number(v), n: Math.round(Number(c)) };
    })
    .filter((c) => Number.isFinite(c.v) && c.n > 0)
    .sort((a, b) => a.v - b.v);

  const flat: number[] = [];
  cols.forEach((c) => {
    for (let i = 0; i < c.n; i++) flat.push(c.v);
  });
  const n = flat.length;
  const medianOf = (arr: number[]) => {
    const s = [...arr].sort((a, b) => a - b);
    return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  };
  const current = medianOf(flat);

  // every way of choosing how many to boost in each column
  const bestFor: number[] = []; // best median reachable with exactly k boosts
  const hitsTarget: boolean[] = [];
  const walk = (i: number, used: number, acc: number[]) => {
    if (i === cols.length) {
      const arr: number[] = [];
      cols.forEach((c, j) => {
        for (let t = 0; t < c.n; t++) arr.push(c.v + (t < acc[j] ? boost : 0));
      });
      const m = medianOf(arr);
      bestFor[used] = Math.max(bestFor[used] ?? -Infinity, m);
      if (Math.abs(m - target) < 1e-9) hitsTarget[used] = true;
      return;
    }
    for (let k = 0; k <= cols[i].n; k++) walk(i + 1, used + k, [...acc, k]);
  };
  walk(0, 0, []);
  const minK = hitsTarget.findIndex(Boolean);

  // the same count, argued: the block below the target must shrink
  const allowedBelow = Math.ceil(n / 2) - 1;
  const belowNow = flat.filter((v) => v < target).length;
  const movable = cols.find((c) => c.v >= target - boost && c.v < target);
  const needed = Math.max(0, belowNow - allowedBelow);
  const agreesInternally = needed === minK;

  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value));
  const winner = opts.find((o) => o.value === minK);
  const agrees = !problem.answer || winner?.label === problem.answer;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const preSteps = Math.max(1, totalSteps - 1);
  const showLine = isFinal || step >= Math.max(1, Math.round(preSteps / 3));
  const showTest = isFinal || step >= Math.max(1, Math.round((preSteps * 2) / 3));

  // geometry
  const pitchX = Math.min(42, (W - 60) / Math.max(1, cols.length));
  const colX = (j: number) => (W - (cols.length - 1) * pitchX) / 2 + j * pitchX;
  const dotY = (i: number) => BASE - i * PITCH;
  const movableJ = cols.findIndex((c) => movable && c.v === movable.v);
  const targetJ = cols.findIndex((c) => c.v === target);
  const lineX = movableJ >= 0 && targetJ >= 0 ? (colX(movableJ) + colX(targetJ)) / 2 : colX(cols.length - 1) + pitchX / 2;
  // the column just below the movable one, used to show a boost that fails
  const shortJ = movableJ > 0 ? movableJ - 1 : -1;

  // the two middle ranks sit in whichever column their running count lands in
  const rankSpots: { j: number; i: number }[] = [];
  let run = 0;
  cols.forEach((c, j) => {
    for (let i = 0; i < c.n; i++) {
      run++;
      if (n % 2 === 0 ? run === n / 2 || run === n / 2 + 1 : run === (n + 1) / 2) rankSpots.push({ j, i });
    }
  });

  const caption = isFinal
    ? `${minK} boosts move the middle to ${tidy(target)} — and ${minK - 1} cannot`
    : !showLine
    ? `the middle two of ${n} are both ${tidy(current)}, so the median is ${tidy(current)} now`
    : !showTest
    ? `${belowNow} students sit below ${tidy(target)}; only ${allowedBelow} may stay there`
    : `+${tidy(boost)} only crosses the line from ${tidy(target - boost)} — everyone lower lands short`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* the block that has to shrink */}
        <AnimatePresence>
          {showLine && (
            <motion.g key="block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <rect x={colX(0) - pitchX / 2} y={62} width={lineX - (colX(0) - pitchX / 2)} height={AXIS - 62} fill={BELOW} opacity={0.12} />
              <line x1={lineX} y1={58} x2={lineX} y2={AXIS} stroke={WIN} strokeWidth={1.8} strokeDasharray="5 4" />
              {(!showTest || isFinal) && (
                <text x={lineX + 4} y={68} fontSize="8.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                  {tidy(target)}+
                </text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the axis */}
        <line x1={colX(0) - pitchX / 2} y1={AXIS} x2={colX(cols.length - 1) + pitchX / 2} y2={AXIS} stroke={INK} strokeWidth={1.6} />
        {cols.map((c, j) => (
          <text key={j} x={colX(j)} y={AXIS + 13} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
            {c.v}
          </text>
        ))}

        {/* every student, as a dot in their column */}
        {cols.map((c, j) =>
          Array.from({ length: c.n }).map((_, i) => {
            // the last `needed` dots of the movable column fly across at the end
            const moving = isFinal && j === movableJ && i >= c.n - needed;
            const landIndex = (cols[targetJ]?.n ?? 0) + (i - (c.n - needed));
            const isRank = !isFinal && rankSpots.some((r) => r.j === j && r.i === i);
            return (
              <motion.g
                key={`${j}-${i}`}
                initial={{ x: 0, y: 0 }}
                animate={{ x: moving ? colX(targetJ) - colX(j) : 0, y: moving ? dotY(landIndex) - dotY(i) : 0 }}
                transition={{ type: "spring", stiffness: 90, damping: 16, delay: moving ? 0.5 + (i - (c.n - needed)) * 0.18 : 0 }}
              >
                <circle
                  cx={colX(j)}
                  cy={dotY(i)}
                  r={isRank ? R + 1.5 : R}
                  fill={moving ? WIN : isRank ? MARK : INK}
                  stroke={isRank ? "#fff" : "none"}
                  strokeWidth={isRank ? 1.6 : 0}
                />
              </motion.g>
            );
          })
        )}

        {/* which dots are the middle two */}
        <AnimatePresence>
          {!showLine && rankSpots.length > 0 && (
            <motion.g key="rank" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              {rankSpots.map((r, k) => (
                <circle key={k} cx={colX(r.j)} cy={dotY(r.i)} r={R + 4} fill="none" stroke={MARK} strokeWidth={1.5} />
              ))}
              <text x={colX(rankSpots[0].j) + 14} y={dotY(rankSpots[rankSpots.length - 1].i) - 6} fontSize="9" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                {n % 2 === 0 ? `${n / 2}th & ${n / 2 + 1}th` : `${(n + 1) / 2}th`}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* one boost that crosses the line and one that does not */}
        <AnimatePresence>
          {showTest && !isFinal && (
            <motion.g key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {shortJ >= 0 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <path
                    d={`M ${colX(shortJ)} ${dotY(cols[shortJ].n - 1) - 10} Q ${(colX(shortJ) + colX(movableJ)) / 2} ${dotY(cols[shortJ].n - 1) - 30} ${colX(movableJ)} ${dotY(cols[movableJ].n - 1) - 10}`}
                    fill="none"
                    stroke={BAD}
                    strokeWidth={1.6}
                    markerEnd="url(#dps-bad)"
                  />
                  <text x={(colX(shortJ) + colX(movableJ)) / 2} y={dotY(cols[shortJ].n - 1) - 34} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                    still short
                  </text>
                </motion.g>
              )}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <path
                  d={`M ${colX(movableJ)} ${dotY(cols[movableJ].n - 1) - 10} Q ${lineX} ${dotY(cols[movableJ].n - 1) - 34} ${colX(targetJ)} ${dotY(cols[targetJ].n - 1) - 10}`}
                  fill="none"
                  stroke={WIN}
                  strokeWidth={1.8}
                  markerEnd="url(#dps-win)"
                />
                <text x={(colX(movableJ) + colX(targetJ)) / 2} y={dotY(cols[movableJ].n - 1) - 30} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                  crosses
                </text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>

        <defs>
          <marker id="dps-bad" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill={BAD} />
          </marker>
          <marker id="dps-win" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill={WIN} />
          </marker>
        </defs>

        {/* the running arithmetic */}
        <AnimatePresence mode="wait">
          <motion.g key={isFinal ? "f" : showTest ? "t" : showLine ? "l" : "s"} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {isFinal ? (
              <>
                <text x={W / 2} y={28} textAnchor="middle" fontSize="13" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                  move {needed}: {belowNow} − {needed} = {allowedBelow} left of the line
                </text>
                <text x={W / 2} y={44} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                  the middle two are both {tidy(target)}
                </text>
                {/* the best median each budget can buy, so the failures are visible */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                  <text x={W / 2} y={182} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                    best median each number of boosts can reach
                  </text>
                  {Array.from({ length: minK + 1 }).map((_, k) => {
                    const cw = Math.min(56, 300 / (minK + 1));
                    const x = W / 2 - ((minK + 1) * cw) / 2 + k * cw;
                    const ok = k === minK;
                    return (
                      <motion.g
                        key={k}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 220, damping: 18, delay: 1.7 + k * 0.14 }}
                      >
                        <rect x={x + 2} y={188} width={cw - 4} height={20} rx={4} fill={ok ? "#dcfce7" : "#fef2f2"} stroke={ok ? WIN : BAD} strokeWidth={1.2} />
                        <text x={x + cw / 2} y={196} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                          {k} boost{k === 1 ? "" : "s"}
                        </text>
                        <text x={x + cw / 2} y={205} textAnchor="middle" fontSize="9" fontWeight="800" fill={ok ? WIN : BAD} fontFamily={numberFont}>
                          {tidy(bestFor[k])}
                        </text>
                      </motion.g>
                    );
                  })}
                </motion.g>
              </>
            ) : showTest ? (
              <>
                <text x={W / 2} y={28} textAnchor="middle" fontSize="11" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                  a +{tidy(boost)} boost moves a score one column right
                </text>
                <text x={W / 2} y={44} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  only the {tidy(movable?.v ?? 0)}s can reach {tidy(target)}
                </text>
                <text x={W / 2} y={186} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  {belowNow} below − {allowedBelow} allowed = {needed} must move
                </text>
              </>
            ) : showLine ? (
              <>
                <text x={W / 2} y={28} textAnchor="middle" fontSize="11" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                  for the {n / 2}th score to reach {tidy(target)}…
                </text>
                <text x={W / 2} y={44} textAnchor="middle" fontSize="10" fontWeight="800" fill={BELOW} fontFamily={numberFont}>
                  at most {allowedBelow} students may stay below it
                </text>
                <text x={W / 2} y={186} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={BELOW} fontFamily={numberFont}>
                  {belowNow} are below {tidy(target)} right now
                </text>
              </>
            ) : (
              <>
                <text x={W / 2} y={28} textAnchor="middle" fontSize="11" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                  {n} students — count in to the middle two
                </text>
                <text x={W / 2} y={186} textAnchor="middle" fontSize="11" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                  median now = {tidy(current)}
                </text>
              </>
            )}
          </motion.g>
        </AnimatePresence>
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
            transition={{ delay: 2.6 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && agreesInternally ? MUTE : BAD, textAlign: "center" }}
          >
            {!agreesInternally
              ? `counting the block says ${needed} but the full search says ${minK}`
              : !agrees
              ? `the search finds ${minK}, not the stored answer`
              : `searched every split of boosts across the columns: ${minK - 1} can only reach ${tidy(bestFor[minK - 1])}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.7 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
