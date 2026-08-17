import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const BUILD = "#e2e8f0";
const ROAD = "#4338ca";
const HOT = "#b45309";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const W = 340;
const H = 210;
const X0 = 24;
const RY = 96;

const tidy = (v: number) => String(Number(v.toFixed(4)));
const gg = (a: number, b: number): number => (b ? gg(b, a % b) : Math.abs(a));

/**
 * A walk on a fixed timetable that gets a detour partway, asking how fast the
 * rest must be covered. The trap is grinding out miles and hours; the point is
 * that **the clock never changes** — the minutes left are exactly what they were
 * — so only the distance moves, and speed scales by the same ratio the blocks
 * do. Swapping one blocked block for a three-block bump turns 5 blocks left into
 * 7, and 7/5 of the distance in the same time is 7/5 of the speed. The beats walk
 * the normal route end to end to fix the usual pace, drop the barrier at the
 * halfway corner with the clock split into gone and left, draw the bump over it
 * with each of its three legs marked one block, then scale the pace by the block
 * ratio — closing with the direct miles-over-hours division as a second route.
 * Block length, normal pace, blocks remaining, the ratio and the answer are all
 * computed, and the scene flags a detour that does not fit the route.
 * Data: { blocks, minutes, distance, unit?, walked, detourBlocks, icon? }.
 */
export function DetourPaceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const blocks = Math.round(num(data.blocks, 10));
  const minutes = num(data.minutes, 10);
  const distance = num(data.distance, 0.5);
  const unit = data.unit != null ? String(data.unit) : "mile";
  const walked = Math.round(num(data.walked, 5));
  const detour = Math.round(num(data.detourBlocks, 3));
  const icon = data.icon != null ? String(data.icon) : "🚶";
  if (blocks < 2 || minutes <= 0 || distance <= 0 || walked < 1 || walked >= blocks || detour < 2) return null;

  const blockLen = distance / blocks;
  const normal = (distance * 60) / minutes;
  const minsLeft = minutes - (walked * minutes) / blocks;
  const wasLeft = blocks - walked;
  const nowLeft = wasLeft - 1 + detour;
  const g = gg(nowLeft, wasLeft) || 1;
  const required = (normal * nowLeft) / wasLeft;
  const direct = (nowLeft * blockLen) / (minsLeft / 60);
  const agrees = Math.abs(required - direct) < 1e-9 && (problem.shortAnswer == null || Math.abs(Number(problem.shortAnswer) - required) < 1e-6);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const stopped = step >= 1;
  const bump = isFinal || step >= 2;

  const BW = (W - 2 * X0 - 12) / blocks;
  const bx = (i: number) => X0 + i * BW;
  const hit = walked; // the blocked block is the next one after what he has walked
  const top = RY - BW;

  const caption = isFinal
    ? `${nowLeft} blocks in the time meant for ${wasLeft}`
    : step === 0
    ? `${blocks} blocks, ${tidy(minutes)} minutes, ${distance} ${unit} — ${tidy(normal)} mph`
    : step === 1
    ? `${walked} blocks done, ${tidy(minsLeft)} minutes and ${wasLeft} blocks left`
    : `the bump swaps 1 block for ${detour}, so ${wasLeft} − 1 + ${detour} = ${nowLeft} blocks`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the city block by block */}
        {Array.from({ length: blocks }).map((_, i) => (
          <g key={i}>
            {!(bump && i === hit) && <rect x={bx(i) + 4} y={30} width={BW - 8} height={30} rx={2} fill={BUILD} stroke={DIM} strokeWidth={0.9} />}
            <rect x={bx(i) + 4} y={110} width={BW - 8} height={30} rx={2} fill={BUILD} stroke={DIM} strokeWidth={0.9} />
          </g>
        ))}

        {/* the street, with the detour bump replacing one block */}
        <motion.path
          d={
            bump
              ? `M ${X0} ${RY} L ${bx(hit)} ${RY} L ${bx(hit)} ${top} L ${bx(hit + 1)} ${top} L ${bx(hit + 1)} ${RY} L ${bx(blocks)} ${RY}`
              : `M ${X0} ${RY} L ${bx(blocks)} ${RY}`
          }
          fill="none"
          stroke={ROAD}
          strokeWidth={2.4}
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
        {Array.from({ length: blocks + 1 }).map((_, i) => (
          <line key={i} x1={bx(i)} y1={RY - 4} x2={bx(i)} y2={RY + 4} stroke={ROAD} strokeWidth={1} opacity={0.5} />
        ))}

        {/* school and the walker */}
        <rect x={bx(blocks) + 1} y={RY - 10} width={30} height={20} rx={3} fill="#fff" stroke={INK} strokeWidth={1.3} />
        <text x={bx(blocks) + 16} y={RY + 4} textAnchor="middle" fontSize="7" fontWeight="800" fill={INK} fontFamily={numberFont}>
          School
        </text>
        <motion.g
          initial={{ x: X0, y: RY }}
          animate={
            step === 0
              ? { x: Array.from({ length: blocks + 1 }, (_, i) => bx(i)), y: RY }
              : { x: bx(walked), y: RY }
          }
          transition={{ duration: step === 0 ? 1.4 : 0.6, ease: "linear" }}
        >
          <text x={0} y={-6} textAnchor="middle" fontSize="14">
            {icon}
          </text>
        </motion.g>

        {/* the blocked stretch */}
        <AnimatePresence>
          {stopped && (
            <motion.g key="bar" initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.4 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={bx(hit) + 3} y={RY - 4} width={BW - 6} height={8} rx={2} fill="#fca5a5" stroke={BAD} strokeWidth={1.2} />
            </motion.g>
          )}
        </AnimatePresence>

        {/* each leg of the bump is one block long */}
        <AnimatePresence>
          {bump && (
            <motion.g key="legs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              {[
                { x: bx(hit) - 12, y: (RY + top) / 2 + 3, t: "1" },
                { x: (bx(hit) + bx(hit + 1)) / 2, y: top - 5, t: "1" },
                { x: bx(hit + 1) + 12, y: (RY + top) / 2 + 3, t: "1" },
              ].map((l, i) => (
                <motion.text
                  key={i}
                  x={l.x}
                  y={l.y}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="800"
                  fill={HOT}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.6 + i * 0.2 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  {l.t}
                </motion.text>
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the working */}
        <text x={X0} y={162} fontSize="11" fontWeight="800" fill={ROAD} fontFamily={numberFont}>
          {step === 0
            ? `${blocks} blocks = ${distance} ${unit}, so 1 block = ${blockLen} ${unit}`
            : `${walked} blocks walked — the clock says ${tidy(minsLeft)} minutes left`}
        </text>

        <AnimatePresence>
          {step === 0 && (
            <motion.text key="s0" x={X0} y={186} fontSize="15" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.4 }} style={{ transformBox: "fill-box", transformOrigin: "left center" }}>
              usual pace {tidy(normal)} mph
            </motion.text>
          )}
          {step === 1 && (
            <motion.text key="s1" x={X0} y={186} fontSize="12" fontWeight="800" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              {wasLeft} blocks in {tidy(minsLeft)} minutes would still be {tidy(normal)} mph
            </motion.text>
          )}
          {bump && !isFinal && (
            <motion.text key="s2" x={X0} y={186} fontSize="13" fontWeight="800" fill={HOT} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              now {nowLeft} blocks — same {tidy(minsLeft)} minutes
            </motion.text>
          )}
          {isFinal && (
            <motion.g key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.text x={X0} y={184} fontSize="12" fontWeight="800" fill={HOT} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                same time, {nowLeft / g}/{wasLeft / g} the distance → {nowLeft / g}/{wasLeft / g} the speed
              </motion.text>
              <motion.text
                x={X0}
                y={204}
                fontSize="16"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.8 }}
                style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              >
                {tidy(normal)} × {nowLeft}/{wasLeft} = {tidy(required)} mph
              </motion.text>
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
          fontSize: 11.5,
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
            transition={{ delay: 1.3 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees
              ? `the long way round: ${nowLeft} × ${blockLen} = ${tidy(nowLeft * blockLen)} ${unit} in ${tidy(minsLeft)} min = ${tidy(direct)} mph`
              : `the two routes disagree: ${tidy(required)} against ${tidy(direct)}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
