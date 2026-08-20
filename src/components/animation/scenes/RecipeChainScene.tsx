import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WARN = "#b45309";
const TINT = ["#ca8a04", "#be185d", "#0284c7", "#0d9488"];

const W = 520;
const H = 280;
const X0 = 88;
const X1 = 508;
const CUP_MAX = 26;
const ROW_GAP = 24;
const TOP_Y = 48;

type Level = { name: string; icon: string; factor: number; color: string };

/**
 * A recipe (or any chain of "k times as much A as B" relations) where the given
 * quantity sits at one end of the chain and the asked-for one at the other. The
 * whole difficulty is that the links **compose**: one cup of lemon juice needs 2
 * cups of sugar, and each of *those* needs 4 cups of water, so a single cup of
 * lemon juice is worth 8 cups of water — not 4. Reaching straight for the last
 * factor is the classic slip and normally an answer choice, so the scene walks
 * one base cup all the way down the chain first, prices that slip against
 * `problem.choices`, and only then scales the whole tree up by the real amount.
 *
 * Drawn as actual cups: every level is a row of glasses, each parent cup fanning
 * out into its own cluster of children, so the totals are literally countable and
 * the final row *is* the answer. Layout is derived from the leaf row outward —
 * the widest level is laid out in clusters and every level above sits at the mean
 * of its own children — so the tree stays aligned at any counts.
 *
 * Counts, per-unit worth, the slip and the decoy choices are all computed; data
 * `{ amount, unit?, levels: ["lemon juice|🍋", "sugar|🍬|2|#be185d", ...] }`
 * where each level after the first carries how many of it one unit of the
 * previous level needs.
 */
export function RecipeChainScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const unit = String(data.unit ?? "cups");
  const amount = Math.max(1, Math.round(num(data.amount, 1)));
  const levels: Level[] = (Array.isArray(data.levels) ? data.levels : []).map((raw, i) => {
    const [name, icon, factor, color] = String(raw).split("|");
    return {
      name: name ?? "",
      icon: icon ?? "",
      factor: i === 0 ? 1 : Math.max(1, Math.round(num(factor, 1))),
      color: color && color.trim() ? color : TINT[i % TINT.length],
    };
  });
  const L = levels.length;

  // ---- the chain composes: counts scale the amount, perOne is one base unit ----
  const counts: number[] = [];
  const perOne: number[] = [];
  levels.forEach((lv, i) => {
    counts[i] = i === 0 ? amount : counts[i - 1] * lv.factor;
    perOne[i] = i === 0 ? 1 : perOne[i - 1] * lv.factor;
  });
  const goal = counts[L - 1];

  // ---- the slip: use only the last factor and skip everything in between ----
  const slip = amount * levels[L - 1].factor;
  const choiceFor = (value: number) => {
    const hit = (problem.choices ?? []).find((c) => {
      const n = Number(
        String(c.text)
          .replace(/[−–—]/g, "-")
          .replace(/[^\d.-]/g, "")
      );
      return Number.isFinite(n) && n === value;
    });
    return hit?.label ?? null;
  };
  const slipChoice = slip === goal ? null : choiceFor(slip);

  // decoys: every number met on the way that is itself an answer choice
  const decoys = [
    ...counts.slice(1, L - 1).map((v, i) => ({ v, why: `${levels[i + 1].name} total` })),
    { v: perOne[L - 1], why: `one ${unit.replace(/s$/, "")}'s worth` },
    { v: slip, why: "skipped link" },
  ]
    .filter((d, i, all) => d.v !== goal && all.findIndex((o) => o.v === d.v) === i)
    .map((d) => ({ ...d, label: choiceFor(d.v) }))
    .filter((d) => d.label);

  const answerNum = Number(String(problem.shortAnswer ?? "").replace(/[^\d.-]/g, ""));
  const answerOk = !Number.isFinite(answerNum) || answerNum === goal;
  const ok = L >= 2 && answerOk;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? L : Math.min(Math.max(beat, 0), L);
  // phase 0 = the links, phase 1 = one base unit, phase k>=2 = level k-1 filled in
  const reveal = phase >= 2 ? phase - 1 : L - 1;

  // ---------------- tree layout, derived from the widest (leaf) row ----------------
  function tree(all: number[]) {
    const P = all[L - 2];
    const f = all[L - 1] / P;
    const cols = Math.min(f, Math.ceil(Math.sqrt(f)));
    const subRows = Math.ceil(f / cols);
    const span = P * cols + 0.5 * (P - 1);
    const u = Math.min(70, (X1 - X0) / span);
    const left = X0 + (X1 - X0 - u * span) / 2;
    const leafX: number[] = [];
    const leafRow: number[] = [];
    for (let p = 0; p < P; p += 1) {
      const cx = left + p * (cols + 0.5) * u;
      for (let k = 0; k < f; k += 1) {
        leafX.push(cx + ((k % cols) + 0.5) * u);
        leafRow.push(Math.floor(k / cols));
      }
    }
    const xs: number[][] = [];
    xs[L - 1] = leafX;
    for (let i = L - 2; i >= 0; i -= 1) {
      const fi = all[i + 1] / all[i];
      xs[i] = Array.from({ length: all[i] }, (_, j) => {
        const kids = xs[i + 1].slice(j * fi, (j + 1) * fi);
        return kids.reduce((a, b) => a + b, 0) / kids.length;
      });
    }
    const cupW = xs.map((row, i) => {
      if (i === L - 1) return Math.min(CUP_MAX, u * 0.62);
      const gaps = row.slice(1).map((x, k) => x - row[k]);
      const gap = gaps.length ? Math.min(...gaps) : X1 - X0;
      return Math.min(CUP_MAX, gap * 0.62);
    });
    const rowH = (i: number) =>
      i === L - 1 ? cupW[i] * 1.12 * subRows + (subRows - 1) * 4 : cupW[i] * 1.12;
    const y: number[] = [];
    cupW.forEach((_, i) => {
      y[i] = i === 0 ? TOP_Y : y[i - 1] + rowH(i - 1) + ROW_GAP;
    });
    return { xs, cupW, y, leafRow, subRows, u };
  }

  const full = tree(counts);
  const single = tree(counts.map((_, i) => perOne[i]));
  const T = phase === 1 ? single : full;
  const shown = phase === 1 ? perOne : counts;

  const Cup = ({
    x,
    y,
    w,
    level,
    delay,
  }: {
    x: number;
    y: number;
    w: number;
    level: Level;
    delay: number;
  }) => {
    const h = w * 1.12;
    const top = w / 2;
    const bot = w * 0.36;
    const lipT = 0.24;
    const halfLip = top + (bot - top) * lipT;
    return (
      <motion.g
        initial={{ opacity: 0, scale: 0.25, y: -16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 17, delay }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <path
          d={`M ${x - halfLip},${y + h * lipT} L ${x - bot},${y + h} L ${x + bot},${y + h} L ${x + halfLip},${y + h * lipT} Z`}
          fill={level.color}
          fillOpacity={0.8}
        />
        <path
          d={`M ${x - top},${y} L ${x - bot},${y + h} L ${x + bot},${y + h} L ${x + top},${y} Z`}
          fill={level.color}
          fillOpacity={0.14}
          stroke={level.color}
          strokeWidth={Math.max(1, w * 0.05)}
          strokeLinejoin="round"
        />
        <line
          x1={x - top}
          y1={y}
          x2={x + top}
          y2={y}
          stroke={level.color}
          strokeWidth={Math.max(1.2, w * 0.08)}
          strokeLinecap="round"
        />
        {w >= 24 && (
          <text x={x} y={y + h * 0.78} textAnchor="middle" fontSize={w * 0.5}>
            {level.icon}
          </text>
        )}
      </motion.g>
    );
  };

  const rowLabel = (i: number, count: number, active: boolean) => (
    <motion.g key={`lbl${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.2 }}>
      <text x={12} y={T.y[i] + 14} fontSize="15">
        {levels[i].icon}
      </text>
      <text
        x={36}
        y={T.y[i] + 14}
        fontSize="13"
        fontWeight="800"
        fill={active ? IND : INK}
        fontFamily={numberFont}
      >
        {count}
      </text>
      <text x={10} y={T.y[i] + 28} fontSize="8" fontWeight="700" fill={DIM}>
        {levels[i].name}
      </text>
    </motion.g>
  );

  const eqY = 246;
  const noteY = 265;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 520 }}>
        {/* ================ phase 0: the recipe is a chain of links ================ */}
        {phase === 0 && (
          <g>
            <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              the recipe is a chain of links, each one measured against the last
            </text>
            {levels.slice(1).map((lv, k) => {
              const from = levels[k];
              const y = 66 + k * 96;
              const lx = 118;
              const gx0 = 252;
              const gs = Math.min(46, (X1 - gx0) / lv.factor);
              const gc = gx0 + ((lv.factor - 1) * gs) / 2;
              return (
                <g key={lv.name}>
                  <text x={W / 2} y={y - 14} textAnchor="middle" fontSize="10" fontWeight="700" fill={WARN} fontFamily={numberFont}>
                    {lv.name} = {lv.factor} × {from.name}
                  </text>
                  <text x={lx} y={y - 2} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    1 {unit.replace(/s$/, "")}
                  </text>
                  <Cup x={lx} y={y + 4} w={34} level={from} delay={0.15 + k * 0.35} />
                  <motion.path
                    d={`M ${lx + 34},${y + 24} L ${gx0 - 34},${y + 24}`}
                    stroke={DIM}
                    strokeWidth={1.8}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.45, delay: 0.5 + k * 0.35 }}
                  />
                  <path d={`M ${gx0 - 32},${y + 24} l -8,-4.5 l 0,9 z`} fill={DIM} />
                  <text x={(lx + 34 + gx0 - 34) / 2} y={y + 16} textAnchor="middle" fontSize="11" fontWeight="800" fill={IND} fontFamily={numberFont}>
                    needs × {lv.factor}
                  </text>
                  <text x={gc} y={y - 2} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    {lv.factor} {unit}
                  </text>
                  {Array.from({ length: lv.factor }).map((_, j) => (
                    <Cup key={j} x={gx0 + j * gs} y={y + 4} w={28} level={lv} delay={0.85 + k * 0.35 + j * 0.12} />
                  ))}
                </g>
              );
            })}
            <motion.text
              x={W / 2}
              y={noteY}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="700"
              fill={DIM}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              the {levels[0].name} is what we are given — it sits at the far end of the chain
            </motion.text>
          </g>
        )}

        {/* ================ phases 1+: the tree of cups ================ */}
        {phase >= 1 && (
          <g>
            <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              {phase === 1
                ? `follow a single ${unit.replace(/s$/, "")} of ${levels[0].name} down the whole chain`
                : `each ${unit.replace(/s$/, "")} of ${levels[reveal - 1].name} brings ${levels[reveal].factor} ${unit} of ${levels[reveal].name}`}
            </text>

            {/* edges: parent to each child, or to the cluster when there are many */}
            {levels.slice(1).map((lv, k) => {
              const i = k + 1;
              if (i > reveal) return null;
              const childCount = shown[i];
              const fi = childCount / shown[i - 1];
              const parentBottom = T.y[i - 1] + T.cupW[i - 1] * 1.12;
              const perChild = childCount <= 8;
              return (
                <g key={`edge${i}`}>
                  {T.xs[i - 1].map((px, p) => {
                    const kids = perChild
                      ? T.xs[i].slice(p * fi, (p + 1) * fi).map((cx, q) => ({
                          cx,
                          cy: T.y[i] + (i === L - 1 ? T.leafRow[p * fi + q] * (T.cupW[i] * 1.12 + 4) : 0),
                        }))
                      : [{ cx: px, cy: T.y[i] }];
                    return kids.map((kid, q) => (
                      <motion.path
                        key={`${p}-${q}`}
                        d={`M ${px},${parentBottom} L ${kid.cx},${kid.cy}`}
                        stroke={lv.color}
                        strokeOpacity={0.45}
                        strokeWidth={1.3}
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.35, delay: 0.2 + (i - 1) * 0.5 + p * 0.05 }}
                      />
                    ));
                  })}
                  {!perChild && (
                    <text
                      x={T.xs[i - 1][0] - 6}
                      y={(parentBottom + T.y[i]) / 2 + 4}
                      textAnchor="end"
                      fontSize="9.5"
                      fontWeight="800"
                      fill={lv.color}
                      fontFamily={numberFont}
                    >
                      × {lv.factor}
                    </text>
                  )}
                </g>
              );
            })}

            {/* the cups, row by row */}
            {levels.map((lv, i) => {
              if (i > reveal) return null;
              return (
                <g key={`row${i}`}>
                  {rowLabel(i, shown[i], i === reveal && phase >= 2)}
                  {T.xs[i].map((x, j) => (
                    <Cup
                      key={j}
                      x={x}
                      y={T.y[i] + (i === L - 1 ? T.leafRow[j] * (T.cupW[i] * 1.12 + 4) : 0)}
                      w={T.cupW[i]}
                      level={lv}
                      delay={0.15 + i * 0.5 + j * (i === L - 1 ? 0.035 : 0.1)}
                    />
                  ))}
                </g>
              );
            })}

            {/* the arithmetic for this beat */}
            <motion.text
              x={W / 2}
              y={eqY}
              textAnchor="middle"
              fontSize="15"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              {phase === 1
                ? `1 ${levels[0].icon} → ${levels
                    .slice(1)
                    .map((lv, k) => `${perOne[k + 1]} ${lv.icon}`)
                    .join(" → ")}`
                : `${levels[reveal].factor} × ${counts[reveal - 1]} = ${counts[reveal]} ${unit} of ${levels[reveal].name}`}
            </motion.text>

            {/* the slip that skips the middle of the chain */}
            {phase === 1 && slipChoice && (
              <motion.text
                x={W / 2}
                y={noteY}
                textAnchor="middle"
                fontSize="10"
                fontWeight="800"
                fill={BAD}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                {levels[L - 1].factor} × {amount} = {slip} jumps straight to the last link — that is choice {slipChoice}
              </motion.text>
            )}
            {isFinal && decoys.length > 0 && (
              <motion.text
                x={W / 2}
                y={noteY}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={WARN}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                on the answer list too: {decoys.map((d) => `${d.label} ${d.v} = ${d.why}`).join("  ·  ")}
              </motion.text>
            )}
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
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {phase === 0
          ? levels
              .slice(1)
              .map((lv, k) => `1 ${unit.replace(/s$/, "")} ${levels[k].icon} → ${lv.factor} ${unit} ${lv.icon}`)
              .join(",  ")
          : phase === 1
          ? `one ${unit.replace(/s$/, "")} of ${levels[0].name} is worth ${perOne[L - 1]} ${unit} of ${levels[L - 1].name}`
          : `${counts[reveal]} ${unit} of ${levels[reveal].name}`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          {L < 2
            ? "check failed: the chain needs at least two levels"
            : `check failed: the chain gives ${goal}, the stored answer is ${problem.shortAnswer}`}
        </span>
      )}

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
