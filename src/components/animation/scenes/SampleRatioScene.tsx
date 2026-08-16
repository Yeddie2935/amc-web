import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARKED = "#f59e0b";
const OTHER = "#94a3b8";
const WATER = "#e0f2fe";
const MESH = "#7dd3fc";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const W = 340;
const H = 196;
const PITCH = 10;
const ROW = 13;
const BLOCKS = 3;
const GX = 22;
const GY = 46;

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** A fish, nose to the right, drawn at the origin. */
function Fish({ color }: { color: string }) {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={3.4} ry={2.2} fill={color} />
      <path d="M 3.2 0 L 6.4 -2.4 L 6.4 2.4 Z" fill={color} />
      <circle cx={-1.6} cy={-0.6} r={0.55} fill="#fff" />
    </g>
  );
}

/**
 * A sample drawn from a population where one kind is counted in both, and the
 * population total is wanted. The unlock is that the sample's ratio is a
 * **recipe**: if the catch splits into groups each holding exactly one marked
 * individual, then the whole population splits the same way, so the total is
 * simply the marked count times the group size. The beats haul the catch up in a
 * net with the marked fish scattered through it, then **sort them** so one leads
 * every group of six — which is what makes the reduced fraction visible rather
 * than asserted — then carry that one group over to the population as a bar of
 * equal bands, one band being the known marked count, and fill the rest in.
 * The reduction, group size, total and the closing cross-ratio are all computed.
 * Data: { sampleTotal, sampleMarked, populationMarked, markedLabel?, unit? }.
 */
export function SampleRatioScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const sampleTotal = Math.round(num(data.sampleTotal, 180));
  const sampleMarked = Math.round(num(data.sampleMarked, 30));
  const popMarked = Math.round(num(data.populationMarked, 250));
  const markedLabel = data.markedLabel != null ? String(data.markedLabel) : "trout";
  const unit = data.unit != null ? String(data.unit) : "fish";
  if (sampleMarked <= 0 || sampleTotal % sampleMarked !== 0) return null;

  const groupSize = sampleTotal / sampleMarked;
  const groups = sampleMarked;
  const g = gcd(sampleMarked, sampleTotal);
  const total = popMarked * groupSize;
  const agrees = problem.shortAnswer == null || Number(problem.shortAnswer) === total;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const sorted = step >= 1;
  const onBar = isFinal || step >= 2;

  const rows = Math.ceil(groups / BLOCKS);
  const slot = (i: number) => {
    const grp = Math.floor(i / groupSize);
    const j = i % groupSize;
    const col = grp % BLOCKS;
    const row = Math.floor(grp / BLOCKS);
    return { x: GX + col * (groupSize * PITCH + 8) + j * PITCH, y: GY + row * ROW };
  };

  // where each fish starts: the marked ones scattered through the net
  const scatter = (() => {
    const idx = Array.from({ length: sampleTotal }, (_, i) => i);
    let seed = 12345;
    for (let i = idx.length - 1; i > 0; i--) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      const j = seed % (i + 1);
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return new Set(idx.slice(0, sampleMarked));
  })();

  // and where it ends: one marked fish leading every group
  const leaders: number[] = [];
  const rest: number[] = [];
  for (let i = 0; i < sampleTotal; i++) (i % groupSize === 0 ? leaders : rest).push(i);
  const home = new Array<number>(sampleTotal);
  let li = 0;
  let ri = 0;
  for (let i = 0; i < sampleTotal; i++) home[i] = scatter.has(i) ? leaders[li++] : rest[ri++];

  const netW = BLOCKS * (groupSize * PITCH + 8) - 8 + 8;
  const netH = rows * ROW + 4;

  // the population bar
  const BX = 30;
  const BY = 118;
  const BH = 30;
  const BW = 276;
  const seg = BW / groupSize;

  const caption = isFinal
    ? `${popMarked} ${markedLabel} means ${popMarked} groups of ${groupSize}: ${groupSize} × ${popMarked} = ${total}`
    : step === 0
    ? `${sampleTotal} ${unit} come up in the net — ${sampleMarked} of them ${markedLabel}`
    : step === 1
    ? `sorted into ${groups} groups of ${groupSize}: exactly one ${markedLabel} in each`
    : `so ${markedLabel} are 1 in every ${groupSize}, in the lake just as in the net`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        <defs>
          <clipPath id="srNet">
            <rect x={GX - 8} y={GY - 8} width={netW} height={netH} rx={10} />
          </clipPath>
        </defs>

        {/* the catch, still in the net */}
        <AnimatePresence>
          {!onBar && (
            <motion.g key="net" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <rect x={GX - 8} y={GY - 8} width={netW} height={netH} rx={10} fill={WATER} stroke={MESH} strokeWidth={1.4} />
              <g clipPath="url(#srNet)" opacity={0.5}>
                {Array.from({ length: 26 }).map((_, i) => (
                  <line key={i} x1={GX - 8 + i * 12 - netH} y1={GY - 8 + netH} x2={GX - 8 + i * 12} y2={GY - 8} stroke={MESH} strokeWidth={0.7} />
                ))}
              </g>

              {Array.from({ length: sampleTotal }).map((_, i) => {
                const from = slot(i);
                const to = slot(home[i]);
                const mine = scatter.has(i);
                return (
                  <motion.g
                    key={i}
                    initial={{ x: from.x, y: from.y }}
                    animate={{ x: sorted ? to.x : from.x, y: sorted ? to.y : from.y }}
                    transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.2 + (i % 30) * 0.012 }}
                  >
                    <Fish color={mine ? MARKED : OTHER} />
                  </motion.g>
                );
              })}

              {/* one ring per group, once they are sorted */}
              {sorted &&
                Array.from({ length: groups }).map((_, grp) => {
                  const p = slot(grp * groupSize);
                  return (
                    <motion.rect
                      key={`r${grp}`}
                      x={p.x - 5}
                      y={p.y - 5}
                      width={groupSize * PITCH}
                      height={10}
                      rx={5}
                      fill="none"
                      stroke={MARK}
                      strokeWidth={0.9}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1 + grp * 0.02 }}
                    />
                  );
                })}
            </motion.g>
          )}
        </AnimatePresence>

        {/* counts for the catch */}
        <AnimatePresence>
          {!onBar && (
            <motion.g key="tally" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <text x={GX - 8} y={30} fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
                the catch: {sampleTotal} {unit}
              </text>
              <text x={GX - 8} y={H - 8} fontSize="11.5" fontWeight="800" fill={MARKED} fontFamily={numberFont}>
                {sampleMarked} {markedLabel}
              </text>
              {sorted && (
                <motion.text
                  x={W - 12}
                  y={H - 8}
                  textAnchor="end"
                  fontSize="13"
                  fontWeight="800"
                  fill={MARK}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.7 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  {sampleMarked}/{sampleTotal} = {sampleMarked / g}/{sampleTotal / g}
                </motion.text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the recipe, carried over to the lake */}
        <AnimatePresence>
          {onBar && (
            <motion.g key="bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {Array.from({ length: groupSize }).map((_, j) => (
                <motion.g
                  key={`rec${j}`}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.1 + j * 0.06 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <g transform={`translate(${44 + j * 13} 40)`}>
                    <Fish color={j === 0 ? MARKED : OTHER} />
                  </g>
                </motion.g>
              ))}
              <rect x={34} y={31} width={groupSize * 13 + 2} height={18} rx={9} fill="none" stroke={MARK} strokeWidth={1.1} />
              <text x={44 + groupSize * 13 + 8} y={44} fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
                1 {markedLabel} in every {groupSize}
              </text>

              {/* the lake as equal bands, one of them the known count */}
              {Array.from({ length: groupSize }).map((_, j) => (
                <motion.rect
                  key={`b${j}`}
                  x={BX + j * seg}
                  y={BY}
                  width={seg}
                  height={BH}
                  fill={j === 0 ? MARKED : "#e2e8f0"}
                  stroke="#fff"
                  strokeWidth={1.2}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: j === 0 || isFinal ? 1 : 0.15, scaleX: 1 }}
                  transition={{ type: "spring", stiffness: 150, damping: 18, delay: j === 0 ? 0.5 : 0.9 + j * 0.12 }}
                  style={{ transformBox: "fill-box", transformOrigin: "left center" }}
                />
              ))}
              {Array.from({ length: groupSize }).map((_, j) => (
                <motion.text
                  key={`bt${j}`}
                  x={BX + j * seg + seg / 2}
                  y={BY + BH / 2 + 4}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="800"
                  fill={j === 0 ? "#fff" : INK}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: j === 0 || isFinal ? 1 : 0 }}
                  transition={{ delay: j === 0 ? 0.8 : 1.3 + j * 0.12 }}
                >
                  {popMarked}
                </motion.text>
              ))}
              <text x={BX} y={BY - 7} fontSize="10" fontWeight="800" fill={MARKED} fontFamily={numberFont}>
                {popMarked} {markedLabel}
              </text>

              <AnimatePresence>
                {isFinal && (
                  <motion.g key="tot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
                    <path
                      d={`M ${BX} ${BY + BH + 6} L ${BX} ${BY + BH + 12} L ${BX + BW} ${BY + BH + 12} L ${BX + BW} ${BY + BH + 6}`}
                      fill="none"
                      stroke={WIN}
                      strokeWidth={1.5}
                    />
                    <text x={BX + BW / 2} y={BY + BH + 28} textAnchor="middle" fontSize="14" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                      {groupSize} × {popMarked} = {total} {unit}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </motion.g>
          )}
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
            transition={{ delay: 2.1 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees
              ? `check: ${popMarked}/${total} = ${sampleMarked}/${sampleTotal} = ${sampleMarked / g}/${sampleTotal / g}`
              : `this gives ${total}, which is not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
