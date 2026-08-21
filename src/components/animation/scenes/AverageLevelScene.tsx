import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const BAR = "#b9c4d4";
const BAR_EDGE = "#334155";
const EXTRA = "#f59e0b";
const EXTRA_EDGE = "#b45309";
const WIN = "#16a34a";
const IND = "#4338ca";
const BAD = "#dc2626";

const fmt = (v: number) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/**
 * A bar chart with far too many bars to add, and a dashed line marking the
 * average — so the total is average x count and the bars never have to be added
 * at all. The scene earns that: the part of every tall bar sticking up above the
 * line is lifted off and *poured into* the bars that fall short, and because the
 * line is the mean those two amounts are exactly equal, so the chart flattens
 * into equal bars with nothing left over. The levelled bars then slide together
 * into one rectangle, count wide and average tall, whose area is the total.
 *
 * Reading a line off a chart is only worth doing if the reading is allowed to be
 * loose, so the second beat draws the slack: the answer choices sit a fixed
 * distance apart, which is half that distance divided by the count in average
 * terms, and any reading inside that green band gives the same choice.
 *
 * The mean, every surplus and deficit, the transfers between them, the slack and
 * the nearest choice are all computed from the measured bars; the levelling is
 * done against the bars' own mean so it is exact, and the closing check reports
 * the measured total against the reading's total.
 * Data: { values:[...], readAverage, gridStep?, unit?, yLabel?, xLabel? }.
 */
export function AverageLevelScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const values = (Array.isArray(data.values) ? data.values : []).map((v) => num(v, 0));
  const n = values.length;
  const readAvg = num(data.readAverage, 0);
  const gridStep = num(data.gridStep, 2000);
  const unit = data.unit != null ? String(data.unit) : "";
  const yLabel = data.yLabel != null ? String(data.yLabel) : "";
  const xLabel = data.xLabel != null ? String(data.xLabel) : "";

  const sum = values.reduce((a, b) => a + b, 0);
  const mean = n > 0 ? sum / n : 0;
  const readTotal = readAvg * n;

  // how far the reading may drift and still land on the same choice
  const choiceVals = (problem.choices ?? [])
    .map((c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")))
    .filter((v) => Number.isFinite(v) && v !== 0)
    .sort((a, b) => a - b);
  let gap = 0;
  for (let i = 1; i < choiceVals.length; i += 1) {
    const d = choiceVals[i] - choiceVals[i - 1];
    if (d > 0 && (gap === 0 || d < gap)) gap = d;
  }
  const tol = gap > 0 && n > 0 ? gap / 2 / n : 0;
  const nearest = (t: number) =>
    choiceVals.length ? choiceVals.reduce((best, c) => (Math.abs(c - t) < Math.abs(best - t) ? c : best)) : t;
  const letterOf = (v: number) =>
    (problem.choices ?? []).find(
      (c) => Math.abs(Number(String(c.text).replace(/[^\d.-]/g, "")) - v) < 1e-9,
    )?.label ?? "";
  const nearMeasured = nearest(sum);
  const nearRead = nearest(readTotal);
  const agrees =
    n > 0 &&
    readAvg > 0 &&
    Math.abs(nearMeasured - nearRead) < 1e-9 &&
    (!problem.answer || letterOf(nearRead) === problem.answer);

  // every unit above the line has to come down into a gap below it, and since
  // the line is the mean the two totals match exactly — so pair them off
  const surplus = values.map((v, i) => ({ i, amt: Math.max(0, v - mean) })).filter((s) => s.amt > 1e-9);
  const deficit = values.map((v, i) => ({ i, amt: Math.max(0, mean - v) })).filter((d) => d.amt > 1e-9);
  const lifted = surplus.reduce((a, s) => a + s.amt, 0);
  const moves: { from: number; to: number; amt: number; srcBase: number; dstBase: number }[] = [];
  let si = 0;
  let di = 0;
  let taken = 0;
  let filled = 0;
  while (si < surplus.length && di < deficit.length) {
    const amt = Math.min(surplus[si].amt - taken, deficit[di].amt - filled);
    moves.push({
      from: surplus[si].i,
      to: deficit[di].i,
      amt,
      srcBase: mean + taken,
      dstBase: values[deficit[di].i] + filled,
    });
    taken += amt;
    filled += amt;
    if (surplus[si].amt - taken < 1e-9) {
      si += 1;
      taken = 0;
    }
    if (deficit[di].amt - filled < 1e-9) {
      di += 1;
      filled = 0;
    }
  }

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showLine = isFinal || step >= 1;
  const leveled = isFinal || step >= 2;
  const packed = isFinal;

  // ---- geometry ----
  const W = 360;
  const H = 244;
  const plotLeft = 42;
  const plotRight = 348;
  const plotTop = 28;
  const base = 176;
  const plotW = plotRight - plotLeft;
  const plotH = base - plotTop;
  const maxV = values.reduce((a, b) => Math.max(a, b), 0);
  const yMax = Math.max(gridStep, Math.ceil((maxV * 1.03) / 500) * 500);
  const yOf = (v: number) => base - (v / yMax) * plotH;
  const pitch = n > 0 ? plotW / n : plotW;
  const barW = Math.max(3, pitch * 0.76);
  const xOf = (i: number) => plotLeft + i * pitch + (pitch - barW) / 2;
  const packLeft = (plotLeft + plotRight) / 2 - (n * barW) / 2;
  const packX = (i: number) => packLeft + i * barW;
  const dx = (i: number) => (packed ? packX(i) - xOf(i) : 0);
  const gridLines: number[] = [];
  for (let g = gridStep; g < yMax; g += gridStep) gridLines.push(g);
  const clip = `avglvl-${problem.id}-${step}`;

  // lit windows inside a moving block, laid out from its own bottom up
  const windows = (x: number, top: number, height: number) => {
    const rows: { cx: number; cy: number }[] = [];
    for (let y = top + height - 4.5; y > top + 3; y -= 8) {
      rows.push({ cx: x + barW * 0.3, cy: y });
      rows.push({ cx: x + barW * 0.7, cy: y });
    }
    return rows;
  };

  const caption = isFinal
    ? `one block, ${n} ${xLabel || "columns"} wide and ${fmt(readAvg)}${unit ? ` ${unit}` : ""} tall — never add the bars`
    : step === 0
    ? `${n} bars, no numbers printed — you cannot add these by eye`
    : !leveled
    ? `the dashed line is the average: just under ${fmt(Math.ceil(mean / 1000) * 1000)}, about ${fmt(readAvg)}`
    : `the ${fmt(lifted)} above the line exactly fills the ${fmt(lifted)} missing below it`;

  const note = isFinal
    ? agrees
      ? `check: measuring all ${n} bars gives ${fmt(sum)} — nearest choice is still ${fmt(nearMeasured)}`
      : `check failed: the bars measure ${fmt(sum)}, nearest ${fmt(nearMeasured)}, but the reading gives ${fmt(nearRead)}`
    : step === 0
    ? `tallest ≈ ${fmt(maxV)}, shortest ≈ ${fmt(values.reduce((a, b) => Math.min(a, b), Infinity))} — ${n} different heights, none of them printed`
    : !leveled
    ? gap > 0
      ? `the choices are ${fmt(gap)} apart, so a reading anywhere within ±${fmt(tol)} gives the same answer`
      : ""
    : `so the ${n} uneven bars hold exactly what ${n} equal bars of ${fmt(mean)} hold`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        <defs>
          <clipPath id={clip}>
            <rect x={plotLeft - 1} y={plotTop - 14} width={plotW + 2} height={plotH + 15} />
          </clipPath>
        </defs>

        {/* axes and gridlines, as the contest chart prints them */}
        {gridLines.map((g) => (
          <g key={`g${g}`}>
            <line x1={plotLeft} x2={plotRight} y1={yOf(g)} y2={yOf(g)} stroke="#cbd5e1" strokeWidth={1} />
            <text x={plotLeft - 5} y={yOf(g) + 3} textAnchor="end" fontSize="7.5" fill="#64748b" fontFamily={numberFont}>
              {fmt(g)}
            </text>
          </g>
        ))}
        <line x1={plotLeft} x2={plotLeft} y1={plotTop - 12} y2={base} stroke={INK} strokeWidth={1.6} />
        <line x1={plotLeft} x2={plotRight} y1={base} y2={base} stroke={INK} strokeWidth={1.6} />
        {yLabel && (
          <text
            x={11}
            y={(plotTop + base) / 2}
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill="#475569"
            transform={`rotate(-90 11 ${(plotTop + base) / 2})`}
          >
            {yLabel}
          </text>
        )}

        <g clipPath={`url(#${clip})`}>
          {/* the part of each city that stays put: everything up to the line */}
          {values.map((v, i) => {
            const top = yOf(Math.min(v, mean));
            return (
              <motion.g
                key={`b${i}`}
                initial={{ y: plotH + 20, x: 0 }}
                animate={{ y: 0, x: dx(i) }}
                transition={{ type: "spring", stiffness: 150, damping: 20, delay: i * 0.025 }}
              >
                <motion.rect
                  x={xOf(i)}
                  y={top}
                  width={barW}
                  height={base - top}
                  fill={BAR}
                  stroke={BAR_EDGE}
                  strokeWidth={0.9}
                  animate={{ strokeOpacity: showLine ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.g>
            );
          })}

          {/* what each short city is missing, once the line is read */}
          <AnimatePresence>
            {showLine &&
              deficit.map((d) => (
                <motion.g
                  key={`d${d.i}`}
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: dx(d.i) }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.25 + d.i * 0.02 }}
                >
                  <rect
                    x={xOf(d.i)}
                    y={yOf(mean)}
                    width={barW}
                    height={yOf(values[d.i]) - yOf(mean)}
                    fill="#fffbeb"
                    stroke={EXTRA}
                    strokeWidth={0.9}
                    strokeDasharray="2 2"
                  />
                </motion.g>
              ))}
          </AnimatePresence>

          {/* the surplus: lit blocks that lift off the tall bars and pour into the gaps */}
          {moves.map((m, k) => {
            const srcTop = yOf(m.srcBase + m.amt);
            const h = yOf(m.srcBase) - srcTop;
            const homeX = xOf(m.from);
            const toX = packed ? packX(m.to) : xOf(m.to);
            const goX = leveled ? toX - homeX : 0;
            const goY = leveled ? yOf(m.dstBase + m.amt) - srcTop : 0;
            return (
              <motion.g
                key={`m${k}`}
                initial={{ y: plotH + 20, x: 0 }}
                animate={{ x: goX, y: goY }}
                transition={{ type: "spring", stiffness: 110, damping: 20, delay: leveled ? 0.15 + k * 0.06 : m.from * 0.025 }}
              >
                <motion.rect
                  x={homeX}
                  y={srcTop}
                  width={barW}
                  height={h}
                  stroke={EXTRA_EDGE}
                  animate={{ fill: showLine ? EXTRA : BAR, strokeOpacity: showLine ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: showLine ? 0.1 : 0 }}
                  strokeWidth={0.9}
                />
                {windows(homeX, srcTop, h).map((w, j) => (
                  <motion.circle
                    key={j}
                    cx={w.cx}
                    cy={w.cy}
                    r={1.15}
                    fill="#fef3c7"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showLine ? 0.95 : 0 }}
                    transition={{ duration: 0.3, delay: showLine ? 0.2 + j * 0.01 : 0 }}
                  />
                ))}
              </motion.g>
            );
          })}

          {/* before the line is read this is just the printed chart: one outline per city */}
          {values.map((v, i) => (
            <motion.g
              key={`o${i}`}
              initial={{ y: plotH + 20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 20, delay: i * 0.025 }}
            >
              <motion.rect
                x={xOf(i)}
                y={yOf(v)}
                width={barW}
                height={base - yOf(v)}
                fill="none"
                stroke={BAR_EDGE}
                strokeWidth={0.9}
                animate={{ opacity: showLine ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.g>
          ))}
        </g>

        {/* the slack the answer choices allow on the reading */}
        <AnimatePresence>
          {showLine && tol > 0 && (
            <motion.g key="tol" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.55 }}>
              <rect
                x={plotLeft}
                y={yOf(mean + tol)}
                width={plotW}
                height={Math.max(3, yOf(mean - tol) - yOf(mean + tol))}
                fill={WIN}
                opacity={0.18}
              />
              <rect x={plotLeft + 2} y={yOf(mean - tol) + 3} width={34} height={11} rx={5} fill="#dcfce7" stroke="#bbf7d0" strokeWidth={0.8} />
              <text x={plotLeft + 19} y={yOf(mean - tol) + 11} textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                ±{fmt(tol)}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the average itself */}
        <AnimatePresence>
          {showLine && (
            <motion.g key="avg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.15 }}>
              <line
                x1={plotLeft}
                x2={plotRight}
                y1={yOf(readAvg)}
                y2={yOf(readAvg)}
                stroke={INK}
                strokeWidth={1.7}
                strokeDasharray="6 4"
              />
              <rect x={plotLeft + 2} y={yOf(readAvg) - 16} width={62} height={12} rx={6} fill="#eef2ff" stroke="#c7d2fe" strokeWidth={0.8} />
              <text x={plotLeft + 33} y={yOf(readAvg) - 7} textAnchor="middle" fontSize="8" fontWeight="800" fill={IND} fontFamily={numberFont}>
                avg ≈ {fmt(readAvg)}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* levelled and packed: one rectangle, count wide and average tall */}
        <AnimatePresence>
          {packed && (
            <motion.g key="dims" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.9 }}>
              <path
                d={`M ${packLeft},${base + 5} v 7 H ${packLeft + n * barW} v -7`}
                fill="none"
                stroke={IND}
                strokeWidth={1.3}
              />
              <text x={(plotLeft + plotRight) / 2} y={base + 24} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                {n} {xLabel || "columns"}
              </text>
              <path
                d={`M ${packLeft + n * barW + 6},${yOf(readAvg)} h 6 V ${base} h -6`}
                fill="none"
                stroke={IND}
                strokeWidth={1.3}
              />
              <text
                x={packLeft + n * barW + 16}
                y={(yOf(readAvg) + base) / 2 + 3}
                fontSize="9"
                fontWeight="800"
                fill={IND}
                fontFamily={numberFont}
              >
                {fmt(readAvg)}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {!packed && xLabel && (
          <text x={(plotLeft + plotRight) / 2} y={base + 18} textAnchor="middle" fontSize="9" fontWeight="700" fill="#475569">
            {xLabel}
          </text>
        )}

        {/* the total the rectangle stands for */}
        <AnimatePresence>
          {packed && (
            <motion.text
              key="eq"
              x={W / 2}
              y={H - 6}
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 16, delay: 1.15 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {fmt(readAvg)} × {n} = {fmt(readTotal)}
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
          color: isFinal ? "#166534" : leveled ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : leveled ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : leveled ? "#fde68a" : "#c7d2fe"}`,
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
            transition={{ delay: 0.45 }}
            style={{
              fontFamily: numberFont,
              fontSize: 11.5,
              fontWeight: 700,
              color: isFinal && !agrees ? BAD : "#94a3b8",
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
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
