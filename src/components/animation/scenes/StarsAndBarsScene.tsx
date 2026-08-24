import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MUTE = "#94a3b8";
const MARK = "#4338ca";
const BAR = "#f59e0b";
const WIN = "#16a34a";
const BAD = "#dc2626";

const PEOPLE_EMOJI = ["🧒", "👧", "🧑"];

const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));
const choose = (n: number, k: number) => factorial(n) / (factorial(k) * factorial(n - k));

/**
 * Handing out the guaranteed minimum first turns "at least 2 each" into
 * "any way at all" for what's left: the 18 leftover apples become stars in a
 * row, and splitting them among 3 people is the same as dropping 2 bars
 * somewhere in that row — one arrangement of stars and bars is exactly one way
 * to share. The count is then just "which 2 of the 20 slots are bars," so the
 * scene builds the row, slides the bars to a couple of different slots to show
 * different splits are really different arrangements, and reads off C(20, 2).
 * Data: { totalApples, people, minEach }.
 */
export function StarsAndBarsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const totalApples = Math.max(1, Math.round(num(data.totalApples, 24)));
  const people = Math.max(2, Math.round(num(data.people, 3)));
  const minEach = Math.max(0, Math.round(num(data.minEach, 2)));

  const given = people * minEach;
  const remaining = totalApples - given;
  const bars = people - 1;
  const slots = remaining + bars;
  const ways = choose(slots, bars);

  // two example splits of the remaining apples, purely to show different bar
  // placements are different arrangements — not asserted as "the" split
  const evenBase = Math.floor(remaining / people);
  const evenRem = remaining % people;
  const splitEven = Array.from({ length: people }, (_, i) => evenBase + (i < evenRem ? 1 : 0));
  const splitSkew = Array.from({ length: people }, (_, i) => (i === 0 ? remaining : 0));

  const toSeq = (split: number[]) => {
    const seq: ("star" | "bar")[] = [];
    split.forEach((count, i) => {
      for (let j = 0; j < count; j++) seq.push("star");
      if (i < split.length - 1) seq.push("bar");
    });
    return seq;
  };

  // the classic slip: treating the 2 bar-slots as ordered instead of a choice
  const trapValue = bars === 2 ? slots * (slots - 1) : undefined;
  const trapLetter =
    trapValue != null
      ? problem.choices?.find((c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === trapValue)?.label
      : undefined;
  const showTrap = trapLetter != null && trapValue !== ways;

  const storedWays = Number(problem.shortAnswer ?? NaN);
  const waysOk = !Number.isFinite(storedWays) || storedWays === ways;

  const stage = step >= totalSteps - 1 ? 3 : Math.min(step, 2);

  const W = 340;
  const cell = 13;
  const gap = 2;
  const perRow = Math.min(12, totalApples);

  const appleGrid = (n: number, highlightTaken: boolean) => (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const row = Math.floor(i / perRow);
        const col = i % perRow;
        const taken = highlightTaken && i >= n - given;
        return (
          <motion.text
            key={i}
            x={col * (cell + gap)}
            y={row * (cell + gap) + 10}
            fontSize={cell}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: taken ? 0.28 : 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.012 }}
          >
            🍎
          </motion.text>
        );
      })}
    </g>
  );

  const rowOf = (seq: ("star" | "bar")[], y: number, delayBase: number) => {
    const w = Math.min(W - 20, seq.length * 15);
    const cw = w / seq.length;
    return (
      <g>
        {seq.map((tok, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: delayBase + i * 0.02 }}
          >
            {tok === "star" ? (
              <text x={10 + i * cw} y={y} fontSize="11" textAnchor="middle">
                ⭐
              </text>
            ) : (
              <rect x={10 + i * cw - 1.6} y={y - 11} width={3.2} height={14} rx={1.4} fill={BAR} />
            )}
          </motion.g>
        ))}
      </g>
    );
  };

  const splitLabel = (split: number[]) => split.map((v) => v + minEach).join(" + ") + ` = ${totalApples}`;

  const caption =
    stage === 0
      ? `give each of ${people} people ${minEach} apples first: ${given} used, ${remaining} left over`
      : stage === 1
      ? `line the ${remaining} leftover apples up as stars — splitting them into ${people} shares takes ${bars} dividers`
      : stage === 2
      ? `sliding the ${bars} bars to different slots gives different splits — each arrangement of the row is one way to share`
      : `choosing which ${bars} of the ${slots} slots are bars: C(${slots}, ${bars}) = ${ways}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${stage === 0 ? 120 : stage === 2 ? 150 : 100}`} width="100%" style={{ maxWidth: 350 }}>
        {stage === 0 && (
          <g transform="translate(14,6)">
            {appleGrid(totalApples, true)}
            <text x={0} y={Math.ceil(totalApples / perRow) * (cell + gap) + 20} fontSize="9.5" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
              {PEOPLE_EMOJI.slice(0, people).join(" ")} each take {minEach}
            </text>
          </g>
        )}

        {stage === 1 && (
          <g>
            {rowOf(Array.from({ length: remaining }, () => "star" as const), 60, 0.1)}
            <text x={W / 2} y={86} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
              {remaining} stars, {bars} bars still to place among them
            </text>
          </g>
        )}

        {stage === 2 && (
          <g>
            <text x={10} y={20} fontSize="9" fontWeight="800" fill={MARK} fontFamily={numberFont}>
              {splitLabel(splitEven)}
            </text>
            {rowOf(toSeq(splitEven), 36, 0.1)}
            <text x={10} y={78} fontSize="9" fontWeight="800" fill={MARK} fontFamily={numberFont}>
              {splitLabel(splitSkew)}
            </text>
            {rowOf(toSeq(splitSkew), 94, 0.5)}
            <text x={W / 2} y={118} textAnchor="middle" fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
              same {remaining} stars, bars in different slots
            </text>
          </g>
        )}

        {stage === 3 && (
          <g>
            <text x={W / 2} y={22} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
              C({slots}, {bars}) = {slots}! / ({bars}! × {remaining}!)
            </text>
            <motion.text
              x={W / 2}
              y={54}
              textAnchor="middle"
              fontSize="16"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.35 }}
            >
              = {ways}
            </motion.text>
          </g>
        )}
      </svg>

      <motion.span
        key={`${step}-${stage}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: stage === 3 ? "#166534" : "#4338ca",
          background: stage === 3 ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${stage === 3 ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {stage === 3 && showTrap && (
          <motion.span
            key="trap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            ordering the {bars} bar slots instead of choosing them gives {slots} × {slots - 1} = {trapValue} — choice {trapLetter}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 3 && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: waysOk ? MUTE : BAD, textAlign: "center" }}
          >
            {waysOk ? `check: ${slots}!/(${bars}!×${remaining}!) = ${ways}` : `this gives ${ways}, not the stored ${storedWays}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 3 && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.95 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
