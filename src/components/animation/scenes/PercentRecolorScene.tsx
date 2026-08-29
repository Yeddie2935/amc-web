import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const BLUE = "#2563eb";
const BROWN = "#92400e";
const RED = "#dc2626";
const YELLOW = "#ca8a04";
const GREEN = "#16a34a";

/**
 * A jar of gumdrops given mostly by percent, with one color pinned down as a
 * raw count. That count is the anchor: since the four known percents leave a
 * fixed share for the last color, its actual count reveals the jar's total.
 * From there, "half the blue gumdrops become brown" is a percent merge (half
 * of blue's share folds into brown's), not a count you can read off directly
 * — the real trap is stopping at that merged percent and mistaking it for
 * the gumdrop count itself, when it still needs multiplying by the total.
 *
 * data: { bluePercent, brownPercent, redPercent, yellowPercent, greenCount }
 */
export function PercentRecolorScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const bluePercent = num(data.bluePercent, 30);
  const brownPercent = num(data.brownPercent, 20);
  const redPercent = num(data.redPercent, 15);
  const yellowPercent = num(data.yellowPercent, 10);
  const greenCount = Math.round(num(data.greenCount, 30));

  const knownPercent = bluePercent + brownPercent + redPercent + yellowPercent;
  const greenPercent = 100 - knownPercent;
  const total = Math.round(greenCount / (greenPercent / 100));

  const blueCount = Math.round((bluePercent / 100) * total);
  const brownCount = Math.round((brownPercent / 100) * total);
  const redCount = Math.round((redPercent / 100) * total);
  const yellowCount = Math.round((yellowPercent / 100) * total);
  const greenCountCalc = Math.round((greenPercent / 100) * total);

  const halfBlue = blueCount / 2;
  const newBrownPercent = brownPercent + bluePercent / 2;
  const newBrownCount = Math.round((newBrownPercent / 100) * total);
  const ok = greenCountCalc === greenCount && Number.isInteger(halfBlue) && String(newBrownCount) === (problem.shortAnswer ?? "").trim();

  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === newBrownPercent && String(c.label) !== problem.answer
  );

  // ---- beats: 0 setup, 1 total, 2 real counts, 3 percent merge, 4 trap, 5 convert+land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  const W = 340;
  const H = 300;

  // fixed 20-slot icon grid, scaled from real counts (1 icon per ~total/20 gumdrops)
  const ICONS = 20;
  const scale = total / ICONS;
  const iconCounts = {
    blue: Math.max(1, Math.round(blueCount / scale)),
    brown: Math.max(1, Math.round(brownCount / scale)),
    red: Math.max(1, Math.round(redCount / scale)),
    yellow: Math.max(1, Math.round(yellowCount / scale)),
    green: Math.max(1, Math.round(greenCount / scale)),
  };
  const order: Array<{ key: keyof typeof iconCounts; color: string }> = [
    { key: "blue", color: BLUE },
    { key: "brown", color: BROWN },
    { key: "red", color: RED },
    { key: "yellow", color: YELLOW },
    { key: "green", color: GREEN },
  ];
  const slotColors: string[] = [];
  order.forEach((o) => {
    for (let i = 0; i < iconCounts[o.key]; i += 1) slotColors.push(o.color);
  });
  while (slotColors.length < ICONS) slotColors.push(GREEN);
  const halfBlueIcons = Math.round(iconCounts.blue / 2);
  const recolored = beat >= 5;
  const displaySlotColors = slotColors.map((c, i) => (recolored && c === BLUE && i < halfBlueIcons ? BROWN : c));

  const cols = 5;
  const cellW = 34;
  const cellH = 34;
  const gridX = W / 2 - (cols * cellW) / 2 + cellW / 2;
  const gridY = 56;

  const Gumdrop = ({ cx, cy, color, delay }: { cx: number; cy: number; color: string; delay: number }) => (
    <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18, delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <motion.circle cx={cx} cy={cy} r={11} initial={false} animate={{ fill: color }} transition={{ duration: 0.5 }} stroke="#00000022" strokeWidth={1} />
      <ellipse cx={cx - 3.5} cy={cy - 4} rx={3} ry={1.8} fill="#ffffff88" />
    </motion.g>
  );

  const Chip = ({ label, value, color, x, y, w }: { label: string; value: string; color: string; x: number; y: number; w: number }) => (
    <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16 }}>
      <rect x={x} y={y} width={w} height={30} rx={8} fill={color} fillOpacity={0.16} stroke={color} strokeWidth={1.6} />
      <text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize="10" fontWeight="700" fill={color} fontFamily={FONT}>
        {label}
      </text>
      <text x={x + w / 2} y={y + 26} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={color} fontFamily={FONT}>
        {value}
      </text>
    </motion.g>
  );

  const caption =
    beat === 0
      ? `blue ${bluePercent}%, brown ${brownPercent}%, red ${redPercent}%, yellow ${yellowPercent}%, green = ${greenCount}`
      : beat === 1
      ? `green = ${greenPercent}% = ${greenCount} → total = ${total}`
      : beat === 2
      ? `blue ${blueCount}, brown ${brownCount}, red ${redCount}, yellow ${yellowCount}, green ${greenCount}`
      : beat === 3
      ? `half of blue (${bluePercent / 2}%) joins brown: ${brownPercent}% + ${bluePercent / 2}% = ${newBrownPercent}%`
      : beat === 4
      ? `${newBrownPercent} — that's a percent, not a gumdrop count`
      : `${newBrownPercent}% of ${total} = ${newBrownCount}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* beat 0: percent chips, green shown only as a raw count */}
        {beat === 0 && (
          <g>
            <Chip label="blue" value={`${bluePercent}%`} color={BLUE} x={20} y={30} w={62} />
            <Chip label="brown" value={`${brownPercent}%`} color={BROWN} x={90} y={30} w={62} />
            <Chip label="red" value={`${redPercent}%`} color={RED} x={160} y={30} w={62} />
            <Chip label="yellow" value={`${yellowPercent}%`} color={YELLOW} x={230} y={30} w={62} />
            <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.3 }}>
              <rect x={110} y={100} width={120} height={40} rx={10} fill={GREEN} fillOpacity={0.14} stroke={GREEN} strokeWidth={1.6} strokeDasharray="4 3" />
              <text x={170} y={120} textAnchor="middle" fontSize="11" fontWeight="700" fill={GREEN} fontFamily={FONT}>
                green = {greenCount} gumdrops
              </text>
              <text x={170} y={134} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} fontFamily={FONT}>
                (percent unknown)
              </text>
            </motion.g>
          </g>
        )}

        {/* beat 1: green's percent revealed, total lands */}
        {beat === 1 && (
          <g>
            <text x={W / 2} y={40} textAnchor="middle" fontSize="11" fontWeight="700" fill={DIM} fontFamily={FONT}>
              {bluePercent}+{brownPercent}+{redPercent}+{yellowPercent} = {knownPercent}%, so green = {greenPercent}%
            </text>
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.4 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={100} y={70} width={140} height={44} rx={10} fill={GREEN} fillOpacity={0.16} stroke={GREEN} strokeWidth={1.8} />
              <text x={170} y={98} textAnchor="middle" fontSize="14" fontWeight="800" fill={GREEN} fontFamily={FONT}>
                {greenCount} = {greenPercent}%
              </text>
            </motion.g>
            <motion.text x={W / 2} y={150} textAnchor="middle" fontSize="20" fontWeight="800" fill={IND} fontFamily={FONT} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
              total = {total}
            </motion.text>
          </g>
        )}

        {/* beats 2, 3(dimmed), 5: the icon jar */}
        {(beat === 2 || beat === 5) && (
          <g>
            <rect x={gridX - cellW / 2 - 8} y={gridY - cellH / 2 - 8} width={cols * cellW + 16} height={4 * cellH + 16} rx={14} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={1.4} />
            {displaySlotColors.map((color, i) => {
              const col = i % cols;
              const row = Math.floor(i / cols);
              return <Gumdrop key={i} cx={gridX + col * cellW} cy={gridY + row * cellH} color={color} delay={beat === 2 ? i * 0.035 : (recolored && i < halfBlueIcons ? i * 0.12 : 0)} />;
            })}
          </g>
        )}
        {beat === 2 && (
          <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={FONT}>
            each dot ≈ {Math.round(scale)} gumdrops
          </text>
        )}

        {/* beat 3: percent merge — half of blue folds into brown */}
        {beat === 3 && (
          <g>
            <Chip label="blue" value={`${bluePercent}%`} color={BLUE} x={40} y={40} w={70} />
            <Chip label="brown" value={`${brownPercent}%`} color={BROWN} x={230} y={40} w={70} />
            <motion.path d={`M 78 70 Q 170 110 232 62`} fill="none" stroke={IND} strokeWidth={2} markerEnd="url(#pr-arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.3 }} />
            <defs>
              <marker id="pr-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={IND} />
              </marker>
            </defs>
            <motion.text x={170} y={95} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              half of blue = {bluePercent / 2}%
            </motion.text>
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={110} y={140} width={120} height={40} rx={10} fill={BROWN} fillOpacity={0.16} stroke={BROWN} strokeWidth={1.8} />
              <text x={170} y={165} textAnchor="middle" fontSize="14" fontWeight="800" fill={BROWN} fontFamily={FONT}>
                {brownPercent}% + {bluePercent / 2}% = {newBrownPercent}%
              </text>
            </motion.g>
          </g>
        )}

        {/* beat 4: the trap — 35 read as a count */}
        {beat === 4 && (
          <g>
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={W / 2 - 65} y={70} width={130} height={44} rx={10} fill="#fee2e2" stroke={BAD} strokeWidth={1.8} />
              <text x={W / 2} y={98} textAnchor="middle" fontSize="20" fontWeight="800" fill={BAD} fontFamily={FONT}>
                {newBrownPercent} ✗
              </text>
            </motion.g>
            <motion.text x={W / 2} y={140} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              that's {newBrownPercent}% of the jar, not {newBrownPercent} gumdrops
            </motion.text>
          </g>
        )}

        {/* beat 5: convert, land */}
        {beat === 5 && (
          <motion.text x={W / 2} y={H - 26} textAnchor="middle" fontSize="13.5" fontWeight="800" fill={WIN} fontFamily={FONT} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            {newBrownPercent}% × {total} = {newBrownCount}
          </motion.text>
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : beat === 4 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 4 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 4 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 4 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 260 }}>
            {trapChoice ? `choice ${trapChoice.label} (${newBrownPercent}) is the percent, not the count of brown gumdrops` : `convert the percent to a count before matching a choice`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${newBrownCount} but stored answer reads "${problem.shortAnswer}"`}
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
