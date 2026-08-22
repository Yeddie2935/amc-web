import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const AMB = "#b45309";
const BAR = "#94a3b8";

/** Grow a horizontal bar from its **left** edge. Motion pivots about the shape's
 *  own centre, so scaling needs the matching x translation. */
function growX(w: number) {
  return { initial: { scaleX: 0, x: -w / 2 }, animate: { scaleX: 1, x: 0 } };
}

function median(vals: number[]): number {
  const s = [...vals].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/**
 * One reading in a chart turns out to be wrong; how do the **mean and the median
 * each** respond? The whole point is that they respond for entirely unrelated
 * reasons, and the scene gives each its own beat rather than reporting two
 * numbers side by side.
 *
 * The mean's reason is division: the correction adds a lump (+5 here) to the
 * total, and that lump is shared out over every day, so the mean moves by
 * `lump / n`. The scene animates exactly that — the correction breaks into `n`
 * equal chips that fly out one to each day, and the mean line slides over by one
 * chip's worth.
 *
 * The median's reason is **re-ordering**, and it is the better half of the
 * problem: the corrected day was the *smallest* value and after the fix it
 * overtakes two others and lands in the middle slot itself, so the median
 * changes because a different value now occupies the middle — not because
 * anything was averaged. The sorted tiles physically re-sort, with the corrected
 * tile sliding past the ones it overtakes.
 *
 * That the two deltas come out equal here is a coincidence of the numbers, and
 * the answer choices are built from confusing the two mechanisms — so the
 * closing beat **parses the real choice sentences** (clause by clause, since
 * "the mean increases by 1 and the median does not change" would otherwise let
 * the median's clause capture the mean) and names what each one gets wrong,
 * whether it hands the mean the undivided lump, hands the median the lump, or
 * freezes the median on the assumption the middle cannot move. Means, medians,
 * the overtakes and the parse are all computed, and the scene checks that
 * exactly one choice matches the truth and that it is the stored answer; data
 * `{ bars: ["Monday|20", ...], fixIndex, fixTo, unit?, icon? }`.
 */
export function StatCorrectionScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const unit = typeof data.unit === "string" ? data.unit : "students";
  const icon = typeof data.icon === "string" ? data.icon : "⚽";
  const bars = (Array.isArray(data.bars) ? data.bars : []).map((b, i) => {
    const [label, v] = String(b).split("|");
    return { label: label ?? `#${i + 1}`, value: num(v, 0) };
  });
  const fixIndex = Math.round(num(data.fixIndex, -1));
  const fixTo = num(data.fixTo, 0);

  const n = bars.length;
  const ok0 = n >= 3 && fixIndex >= 0 && fixIndex < n;

  const oldVals = bars.map((b) => b.value);
  const newVals = oldVals.map((v, i) => (i === fixIndex ? fixTo : v));
  const lump = ok0 ? fixTo - oldVals[fixIndex] : 0;

  const oldSum = oldVals.reduce((a, b) => a + b, 0);
  const newSum = newVals.reduce((a, b) => a + b, 0);
  const oldMean = ok0 ? oldSum / n : 0;
  const newMean = ok0 ? newSum / n : 0;
  const oldMed = ok0 ? median(oldVals) : 0;
  const newMed = ok0 ? median(newVals) : 0;
  const dMean = newMean - oldMean;
  const dMed = newMed - oldMed;

  // ---------------- the sorted orders, and what the fixed day overtakes -----
  const order = (vals: number[]) =>
    vals.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v || a.i - b.i);
  const oldOrder = ok0 ? order(oldVals) : [];
  const newOrder = ok0 ? order(newVals) : [];
  const oldSlot = oldOrder.findIndex((o) => o.i === fixIndex);
  const newSlot = newOrder.findIndex((o) => o.i === fixIndex);
  const overtakes = Math.abs(newSlot - oldSlot);
  const mid = (n - 1) / 2;
  const takesMiddle = Number.isInteger(mid) && newSlot === mid;

  // ---------------- what each answer choice actually claims ----------------
  // clause by clause: "the mean increases by 1 and the median does not change"
  // would otherwise let the median's wording be captured by the mean's search
  const claimOf = (text: string) => {
    const clauses = text.toLowerCase().split(/\band\b/);
    let mean: number | null = null;
    let med: number | null = null;
    clauses.forEach((c) => {
      const still = /(does not change|is unchanged|stays the same|remains)/.test(c);
      const m = c.match(/(increases|decreases|rises|falls)\s+by\s+(\d+(?:\.\d+)?)/);
      const val = still ? 0 : m ? (/(decreases|falls)/.test(m[1]) ? -1 : 1) * Number(m[2]) : null;
      if (val == null) return;
      if (c.includes("median")) med = val;
      else if (c.includes("mean")) mean = val;
    });
    return { mean, med };
  };
  const claims = (problem.choices ?? []).map((c) => ({ ...c, ...claimOf(String(c.text)) }));
  const truthy = claims.filter((c) => c.mean === dMean && c.med === dMed);
  const wrong = claims.filter((c) => !(c.mean === dMean && c.med === dMed) && c.mean != null && c.med != null);

  /** Why a choice is wrong, worked out from the numbers rather than authored.
   *  Kept short — the panel is only about 38 characters wide at this size. */
  const faultOf = (c: { mean: number | null; med: number | null }) => {
    const meanBad = c.mean !== dMean;
    const medBad = c.med !== dMed;
    if (meanBad && medBad && c.mean === lump && c.med === lump) return `both take the whole +${lump}`;
    const parts: string[] = [];
    if (meanBad) parts.push(c.mean === lump ? `mean takes the whole +${lump}` : "mean off");
    if (medBad) {
      if (c.med === 0) parts.push("median frozen");
      else if (c.med === lump) parts.push(`median takes the whole +${lump}`);
      else parts.push("median off");
    }
    return parts.join(", ");
  };

  // ---------------- self-checks ----------------
  const sumOk = ok0 && newSum - oldSum === lump;
  const meanOk = ok0 && Math.abs(dMean - lump / n) < 1e-9;
  const oneMatch = truthy.length === 1;
  const storedOk = !oneMatch || problem.answer == null || truthy[0].label === problem.answer;
  const check = ok0 && sumOk && meanOk && oneMatch && storedOk;
  const failed = !ok0
    ? "needs at least 3 bars and a real correction index"
    : !sumOk
    ? "the corrected total does not differ by the correction"
    : !meanOk
    ? `mean moved ${dMean} but the lump ÷ ${n} is ${lump / n}`
    : !oneMatch
    ? `${truthy.length} answer choices match (${dMean}, ${dMed}) — expected exactly 1`
    : `the matching choice is ${truthy[0]?.label}, stored answer ${problem.answer}`;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const phase = isFinal ? 3 : Math.min(step, 2);

  const shown = phase >= 1 ? newVals : oldVals;
  const sorted = phase >= 3 ? newOrder : oldOrder;
  const meanNow = phase >= 2 ? newMean : oldMean;
  const medNow = phase >= 3 ? newMed : oldMed;

  // ---------------- geometry ----------------
  const W = 480;
  const H = 262;
  const X0 = 68;
  const CHART_W = 180;
  const axisMax = Math.ceil((Math.max(...oldVals, ...newVals, 1) + 2) / 4) * 4;
  const sx = (v: number) => X0 + (v / axisMax) * CHART_W;
  const ROW = 30;
  const BH = 15;
  const rowY = (i: number) => 26 + i * ROW;
  const chartBottom = rowY(n - 1) + BH + 6;
  const TILE_W = Math.min(34, CHART_W / n - 2);
  const tileX = (k: number) => X0 + k * (TILE_W + 2);
  const TILE_Y = chartBottom + 34;
  const PX = 262;

  const caption = !ok0
    ? "chart data missing"
    : phase === 0
    ? `${oldSum} ÷ ${n} = ${oldMean}, and the middle of the sorted row is ${oldMed}`
    : phase === 1
    ? `${bars[fixIndex].label} was really ${fixTo}, not ${oldVals[fixIndex]} — that is +${lump}`
    : phase === 2
    ? `the +${lump} is shared by all ${n} days: the mean moves +${lump} ÷ ${n} = ${dMean}`
    : `${bars[fixIndex].label} overtakes ${overtakes} ${overtakes === 1 ? "day" : "days"} and takes the middle slot itself`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ---------------- the chart, in the contest figure's own style ------ */}
        {Array.from({ length: axisMax / 4 + 1 }, (_, k) => k * 4).map((v) => (
          <g key={v}>
            <line x1={sx(v)} y1={22} x2={sx(v)} y2={chartBottom} stroke="#e2e8f0" strokeWidth={1} />
            <text x={sx(v)} y={16} textAnchor="middle" fontSize="7.5" fill="#94a3b8" fontFamily={numberFont}>
              {v}
            </text>
          </g>
        ))}

        {ok0 &&
          bars.map((b, i) => {
            const v = shown[i];
            const w = sx(v) - X0;
            const isFix = i === fixIndex;
            const grew = isFix && phase >= 1;
            return (
              <g key={b.label}>
                <text x={X0 - 6} y={rowY(i) + 11} textAnchor="end" fontSize="8.5" fontWeight="700" fill={isFix && phase >= 1 ? AMB : "#475569"}>
                  {b.label}
                </text>

                {/* the original length stays as a ghost once it is corrected */}
                {grew && (
                  <rect x={X0} y={rowY(i)} width={sx(oldVals[i]) - X0} height={BH} fill="none" stroke={BAD} strokeWidth={1} strokeDasharray="3 2" />
                )}

                <motion.g
                  initial={phase === 0 ? growX(w).initial : false}
                  animate={phase === 0 ? growX(w).animate : { scaleX: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: "easeOut" }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <motion.rect
                    x={X0}
                    y={rowY(i)}
                    height={BH}
                    fill={grew ? AMB : BAR}
                    animate={{ width: w }}
                    initial={{ width: grew ? sx(oldVals[i]) - X0 : w }}
                    transition={{ type: "spring", stiffness: 120, damping: 18, delay: grew && phase === 1 ? 0.5 : 0 }}
                  />
                </motion.g>

                <text x={sx(v) + 5} y={rowY(i) + 11} fontSize="9" fontWeight="800" fill={grew ? AMB : INK} fontFamily={numberFont}>
                  {v}
                </text>
              </g>
            );
          })}

        {/* the mean, as a line the bars are measured against */}
        {ok0 && (
          <g>
            {/* on the mean's beat the line genuinely slides over by one share */}
            <motion.line
              y1={22}
              y2={chartBottom}
              stroke={IND}
              strokeWidth={2}
              strokeDasharray="4 3"
              initial={{ x1: sx(phase === 2 ? oldMean : meanNow), x2: sx(phase === 2 ? oldMean : meanNow) }}
              animate={{ x1: sx(meanNow), x2: sx(meanNow) }}
              transition={{ type: "spring", stiffness: 90, damping: 16, delay: phase === 2 ? 1.6 : 0 }}
            />
            <motion.g animate={{ x: 0 }} transition={{ duration: 0.3 }}>
              <rect x={sx(meanNow) - 27} y={chartBottom + 4} width={54} height={16} rx={8} fill="#eef2ff" stroke="#c7d2fe" />
              <text x={sx(meanNow)} y={chartBottom + 15} textAnchor="middle" fontSize="9" fontWeight="800" fill={IND} fontFamily={numberFont}>
                mean {meanNow}
              </text>
            </motion.g>
          </g>
        )}

        {/* the correction breaking into one share per day */}
        {ok0 && phase === 2 &&
          Array.from({ length: n }, (_, k) => (
            <motion.g
              key={`share${k}`}
              initial={{ x: sx(oldVals[fixIndex]) + 12 - (X0 + 14 + k * 26), y: rowY(fixIndex) + 8 - (chartBottom + 44) }}
              animate={{ x: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.5 + k * 0.12 }}
            >
              <circle cx={X0 + 14 + k * 26} cy={chartBottom + 44} r={9} fill="#eef2ff" stroke={IND} strokeWidth={1.3} />
              <text x={X0 + 14 + k * 26} y={chartBottom + 47} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                +{lump / n}
              </text>
            </motion.g>
          ))}

        {/* ---------------- the sorted row, where the median lives ---------- */}
        {ok0 && phase !== 2 && (
          <g>
            <text x={X0} y={TILE_Y - 8} fontSize="8.5" fontWeight="700" fill="#64748b">
              sorted:
            </text>
            {sorted.map((o, k) => {
              const isFix = o.i === fixIndex;
              const isMid = k === mid;
              const from = phase >= 3 ? oldOrder.findIndex((q) => q.i === o.i) : k;
              return (
                <motion.g
                  key={o.i}
                  initial={{ x: tileX(from) - tileX(k) }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 110, damping: 17, delay: phase >= 3 ? 0.5 + (isFix ? 0 : 0.35) : 0 }}
                >
                  <rect
                    x={tileX(k)}
                    y={TILE_Y}
                    width={TILE_W}
                    height={24}
                    rx={4}
                    fill={isMid ? "#dcfce7" : "#f1f5f9"}
                    stroke={isFix ? AMB : isMid ? WIN : "#cbd5e1"}
                    strokeWidth={isFix || isMid ? 1.8 : 1}
                  />
                  <text x={tileX(k) + TILE_W / 2} y={TILE_Y + 16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={isFix ? AMB : isMid ? "#166534" : INK} fontFamily={numberFont}>
                    {o.v}
                  </text>
                </motion.g>
              );
            })}
            {Number.isInteger(mid) && (
              <motion.text
                key={`mid${phase}`}
                x={tileX(mid) + TILE_W / 2}
                y={TILE_Y + 38}
                textAnchor="middle"
                fontSize="9"
                fontWeight="800"
                fill={WIN}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: phase >= 3 ? 1.4 : 0.9 }}
              >
                median {medNow}
              </motion.text>
            )}
          </g>
        )}

        {/* ---------------- side panel ---------------- */}
        {ok0 && phase === 0 && (
          <g>
            <text x={PX} y={26} fontSize="11.5" fontWeight="800" fill={INK}>
              {icon} as recorded
            </text>
            {[
              { d: 0.4, t: `total ${oldSum}`, c: "#475569", s: 10.5 },
              { d: 0.7, t: `mean = ${oldSum} ÷ ${n} = ${oldMean}`, c: IND, s: 12 },
              { d: 1.2, t: "sort them and take", c: "#475569", s: 10.5 },
              { d: 1.4, t: "the middle one:", c: "#475569", s: 10.5 },
              { d: 1.7, t: `median = ${oldMed}`, c: WIN, s: 12 },
            ].map((l, i) => (
              <motion.text key={i} x={PX} y={50 + i * 20} fontSize={l.s} fontWeight={l.s > 11 ? "800" : "600"} fill={l.c} fontFamily={l.s > 11 ? numberFont : undefined} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: l.d }}>
                {l.t}
              </motion.text>
            ))}
          </g>
        )}

        {ok0 && phase === 1 && (
          <g>
            <text x={PX} y={26} fontSize="11.5" fontWeight="800" fill={AMB}>
              the correction
            </text>
            {[
              { d: 0.3, t: `${bars[fixIndex].label}: ${oldVals[fixIndex]} → ${fixTo}`, c: AMB, s: 13 },
              { d: 0.9, t: `that is +${lump} ${unit}`, c: "#475569", s: 10.5 },
              { d: 1.3, t: `total ${oldSum} → ${newSum}`, c: INK, s: 12 },
              { d: 1.8, t: "one number moved —", c: "#475569", s: 10.5 },
              { d: 2.0, t: "but the mean and the", c: "#475569", s: 10.5 },
              { d: 2.2, t: "median answer to it", c: "#475569", s: 10.5 },
              { d: 2.4, t: "in different ways.", c: INK, s: 10.5 },
            ].map((l, i) => (
              <motion.text key={i} x={PX} y={50 + i * 19} fontSize={l.s} fontWeight={l.s > 11 ? "800" : "600"} fill={l.c} fontFamily={l.s > 11 ? numberFont : undefined} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: l.d }}>
                {l.t}
              </motion.text>
            ))}
          </g>
        )}

        {ok0 && phase === 2 && (
          <g>
            <text x={PX} y={26} fontSize="11.5" fontWeight="800" fill={IND}>
              the mean: divide
            </text>
            {[
              { d: 0.3, t: `the +${lump} lands in the total,`, c: "#475569", s: 10.5 },
              { d: 0.5, t: `which is shared by ${n} days`, c: "#475569", s: 10.5 },
              { d: 1.5, t: `+${lump} ÷ ${n} = +${dMean}`, c: IND, s: 15 },
              { d: 2.0, t: `mean ${oldMean} → ${newMean}`, c: INK, s: 12 },
            ].map((l, i) => (
              <motion.text key={i} x={PX} y={50 + i * 22 + (i >= 2 ? 8 : 0)} fontSize={l.s} fontWeight={l.s > 11 ? "800" : "600"} fill={l.c} fontFamily={l.s > 11 ? numberFont : undefined} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: l.d }}>
                {l.t}
              </motion.text>
            ))}
          </g>
        )}

        {ok0 && phase === 3 && (
          <g>
            <text x={PX} y={22} fontSize="11.5" fontWeight="800" fill={WIN}>
              the median: re-sort
            </text>
            {[
              // "was the smallest" would be a lie under a tie — say where it sat
              { d: 0.3, t: oldSlot === 0 ? `${bars[fixIndex].label} sat at the bottom;` : `${bars[fixIndex].label} sat in slot ${oldSlot + 1};`, c: "#475569", s: 9.5 },
              { d: 0.6, t: `it overtakes ${overtakes} of them and lands`, c: "#475569", s: 9.5 },
              { d: 0.9, t: takesMiddle ? "in the middle slot itself" : "further up the row", c: INK, s: 9.5 },
              { d: 1.5, t: `median ${oldMed} → ${newMed}   (+${dMed})`, c: WIN, s: 12 },
              { d: 1.8, t: `mean +${dMean}, median +${dMed}`, c: IND, s: 11 },
            ].map((l, i) => (
              <motion.text key={i} x={PX} y={42 + i * 17 + (i >= 3 ? 8 : 0)} fontSize={l.s} fontWeight={l.s > 11 ? "800" : "600"} fill={l.c} fontFamily={l.s > 11 ? numberFont : undefined} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: l.d }}>
                {l.t}
              </motion.text>
            ))}

            <motion.text x={PX} y={152} fontSize="9" fontWeight="700" fill="#64748b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
              the other choices mix the two up:
            </motion.text>
            {wrong.map((c, i) => (
              <motion.g key={c.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.4 + i * 0.15 }}>
                <text x={PX} y={167 + i * 14} fontSize="9" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                  {c.label}
                </text>
                <text x={PX + 13} y={167 + i * 14} fontSize="8.5" fontWeight="600" fill="#64748b">
                  {faultOf(c)}
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
        {caption}
      </motion.span>

      {!check && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failed}</span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 3.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
