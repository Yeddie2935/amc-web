import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MUTE = "#94a3b8";
const MARK = "#4338ca";
const ADD = "#f59e0b";
const CUT = "#dc2626";
const WIN = "#16a34a";

const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(4))));

/**
 * Raise a price by x, then lower it by the same x, drawn as area. The price is
 * a 1 by 1 square: the rise stretches it to 1 + x wide, and the cut shaves x off
 * the *new* price, so the strip that comes off spans the whole extra width and
 * is bigger than the one that went on. Sliding the leftover column up into the
 * gap turns the shape back into the original square with an x by x bite gone —
 * so (1 + x)(1 − x) = 1 − x², and the bite is what the store kept. The bite's
 * area is the trap: it is x², not x. x is solved from the given final percent
 * and checked against the stored answer.
 * Data: { finalPercent }.
 */
export function PercentSquareBiteScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const finalPct = num(data.finalPercent, 84);

  // the whole solve: (1+x)(1−x) = 1 − x² = final, so x = sqrt(1 − final)
  const finalFrac = finalPct / 100;
  const bite = 1 - finalFrac;
  const x = Math.sqrt(bite);
  const pct = x * 100;

  const product = (1 + x) * (1 - x);
  const productOk = Math.abs(product - finalFrac) < 1e-9;
  const storedPct = Number(String(problem.shortAnswer ?? "").replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));
  const storedOk = !Number.isFinite(storedPct) || Math.abs(storedPct - pct) < 1e-9;

  // the classic slip: reporting x² (the bite's area) instead of its side
  const trapPct = bite * 100;
  const trapLetter = problem.choices?.find(
    (c) => Math.abs(Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) - trapPct) < 1e-6
  )?.label;
  const showTrap = trapLetter != null && Math.abs(trapPct - pct) > 1e-9;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const cutOff = step >= 1;
  const moved = step >= 2;

  // ---- geometry: one unit of price is S px on a side ----
  const W = 340;
  const S = 100;
  const X0 = 56;
  const Y0 = 156;
  const H = 192;
  const PX = (u: number) => X0 + u * S;
  const PY = (v: number) => Y0 - v * S;

  // the bottom slab stays put; the top strip peels off; the right column travels
  const colX = PX(1);
  const colY = PY(1 - x);
  const colW = x * S;
  const colH = (1 - x) * S;
  // rotated 90° about its own centre, it must land in the gap on the top left
  const dx = PX(0) + ((1 - x) * S) / 2 - (colX + colW / 2);
  const dy = PY(1) + (x * S) / 2 - (colY + colH / 2);

  const tagX = Math.max(212, PX(1 + x) + 16);
  const tagW = W - tagX - 8;
  const tagCX = tagX + tagW / 2;
  const price = isFinal ? tidy(finalFrac) : moved ? "1 − x²" : cutOff ? "(1+x)(1−x)" : "1 + x";

  const caption = isFinal
    ? `x² = ${tidy(bite)} is the bite's area — its side is x = √${tidy(bite)} = ${tidy(x)}`
    : step === 0
    ? `raise by x: the price square stretches to 1 + x wide`
    : cutOff && !moved
    ? `the cut takes x of the new price, so a wider strip comes off than went on`
    : `slide the column up: the original square with an x by x bite gone`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* before the cut the price is two whole pieces, with no seam to imply one */}
        {!cutOff ? (
          <>
            <rect x={PX(0)} y={PY(1)} width={S} height={S} fill="rgba(67,56,202,0.14)" stroke={MARK} strokeWidth={1.6} />
            <motion.rect
              x={colX}
              y={PY(1)}
              width={colW}
              height={S}
              fill="rgba(245,158,11,0.28)"
              stroke={ADD}
              strokeWidth={1.6}
              initial={{ x: 54, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.2 }}
            />
          </>
        ) : (
          <>
            {/* the slab of the original square that survives the cut: never moves */}
            <rect x={PX(0)} y={PY(1 - x)} width={S} height={(1 - x) * S} fill="rgba(67,56,202,0.14)" stroke={MARK} strokeWidth={1.6} />

            {/* the leftover column, which later turns 90° into the gap on top */}
            <motion.rect
              x={colX}
              y={colY}
              width={colW}
              height={colH}
              fill="rgba(245,158,11,0.28)"
              stroke={ADD}
              strokeWidth={1.6}
              initial={{ x: 0, y: 0, rotate: 0 }}
              animate={{ x: moved ? dx : 0, y: moved ? dy : 0, rotate: moved ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.35 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          </>
        )}

        {/* the strip the cut takes off, spanning the whole new width */}
        <AnimatePresence>
          {cutOff && !moved && (
            <motion.g
              key="top"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -13, opacity: 0.62 }}
              exit={{ y: -46, opacity: 0 }}
              transition={{ type: "spring", stiffness: 110, damping: 15, delay: 0.25 }}
            >
              <rect
                x={PX(0)}
                y={PY(1)}
                width={(1 + x) * S}
                height={x * S}
                fill="rgba(220,38,38,0.20)"
                stroke={CUT}
                strokeWidth={1.6}
              />
              <motion.text
                x={PX((1 + x) / 2)}
                y={PY(1) + x * S * 0.62}
                textAnchor="middle"
                fontSize="10"
                fontWeight="800"
                fill={CUT}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                off: x(1 + x)
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* what the store kept: the bite the rearrangement uncovers */}
        <AnimatePresence>
          {moved && (
            <motion.g key="bite" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.9 }}>
              <motion.rect
                x={PX(1 - x)}
                y={PY(1)}
                width={x * S}
                height={x * S}
                fill="rgba(220,38,38,0.16)"
                stroke={CUT}
                strokeWidth={1.6}
                strokeDasharray="4 3"
                initial={{ scale: 0.2 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 13, delay: 0.9 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
              <text x={PX(1 - x / 2)} y={PY(1) + x * S * 0.44} textAnchor="middle" fontSize="11" fontWeight="800" fill={CUT} fontFamily={numberFont}>
                x²
              </text>
              {isFinal && (
                <motion.text
                  x={PX(1 - x / 2)}
                  y={PY(1) + x * S * 0.78}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="800"
                  fill={CUT}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.15 }}
                >
                  {tidy(trapPct)}%
                </motion.text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the original 1 by 1 square, back as a reference outline */}
        <AnimatePresence>
          {moved && (
            <motion.rect
              key="unit"
              x={PX(0)}
              y={PY(1)}
              width={S}
              height={S}
              fill="none"
              stroke={INK}
              strokeWidth={1.4}
              strokeDasharray="5 4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.85 }}
            />
          )}
        </AnimatePresence>

        {/* the side of the bite is the percent actually asked for */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="side" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 1.3 }}>
              <motion.line
                x1={PX(1 - x)}
                y1={PY(1) - 7}
                x2={PX(1)}
                y2={PY(1) - 7}
                stroke={ADD}
                strokeWidth={2.4}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, delay: 1.3 }}
              />
              <text x={PX(1 - x / 2)} y={PY(1) - 11} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#92400e" fontFamily={numberFont}>
                x = {tidy(x)}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* what is left of the price, labelled on the slab that never moved */}
        <motion.text
          key={`kept-${cutOff}`}
          x={PX(0.5)}
          y={PY(cutOff ? (1 - x) / 2 : 0.5) + 4}
          textAnchor="middle"
          fontSize="11"
          fontWeight="800"
          fill={cutOff ? (isFinal ? WIN : MARK) : MARK}
          fontFamily={numberFont}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {cutOff ? `${tidy(finalPct)}%` : "100%"}
        </motion.text>

        {/* the strip's own width, before it travels */}
        <AnimatePresence>
          {!moved && (
            <motion.text
              key="xlab"
              x={PX(1 + x / 2)}
              y={PY(cutOff ? (1 - x) / 2 : 0.5) + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill="#92400e"
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.55 }}
            >
              x
            </motion.text>
          )}
        </AnimatePresence>

        {/* width along the bottom, and height up the left side */}
        <line x1={PX(0)} y1={PY(0) + 8} x2={moved ? PX(1) : PX(1 + x)} y2={PY(0) + 8} stroke={MUTE} strokeWidth={1.2} />
        <text
          x={moved ? PX(0.5) : PX((1 + x) / 2)}
          y={PY(0) + 20}
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="700"
          fill={MUTE}
          fontFamily={numberFont}
        >
          {moved ? "1" : "1 + x"}
        </text>
        <line x1={PX(0) - 8} y1={PY(0)} x2={PX(0) - 8} y2={moved ? PY(1) : PY(cutOff ? 1 - x : 1)} stroke={MUTE} strokeWidth={1.2} />
        <text x={PX(0) - 12} y={PY(cutOff && !moved ? (1 - x) / 2 : 0.5) + 3} textAnchor="end" fontSize="9.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
          {moved ? "1" : cutOff ? "1 − x" : "1"}
        </text>

        {/* the shirt's price tag, rewritten as the picture is rearranged */}
        <text x={tagCX} y={48} textAnchor="middle" fontSize="24">
          👕
        </text>
        <rect x={tagX} y={58} width={tagW} height={30} rx={8} fill="#fff" stroke={INK} strokeWidth={1.4} />
        <circle cx={tagX + 12} cy={73} r={3.2} fill="none" stroke={INK} strokeWidth={1.2} />
        <motion.g
          key={`price-${step}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.3 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <text
            x={tagX + 10 + (tagW - 10) / 2}
            y={78}
            textAnchor="middle"
            fontSize="11"
            fontWeight="800"
            fill={isFinal ? WIN : MARK}
            fontFamily={numberFont}
          >
            {price}
          </text>
        </motion.g>
        <text x={tagCX} y={102} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
          price now
        </text>
        <AnimatePresence>
          {cutOff && (
            <motion.text
              key="given"
              x={tagCX}
              y={120}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.7 }}
            >
              = {tidy(finalPct)}% given
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
          color: isFinal ? "#166534" : cutOff && !moved ? "#b91c1c" : "#4338ca",
          background: isFinal ? "#dcfce7" : cutOff && !moved ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : cutOff && !moved ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {isFinal && showTrap && (
          <motion.span
            key="trap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.45 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: CUT, textAlign: "center" }}
          >
            stopping at x² = {tidy(bite)} answers {tidy(trapPct)} — choice {trapLetter}, the bite's area, not its side
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.55 }}
            style={{
              fontFamily: numberFont,
              fontSize: 11.5,
              fontWeight: 700,
              color: productOk && storedOk ? MUTE : CUT,
              textAlign: "center",
            }}
          >
            {!productOk
              ? `(1 + ${tidy(x)})(1 − ${tidy(x)}) = ${tidy(product)}, not ${tidy(finalFrac)}`
              : !storedOk
              ? `this gives ${tidy(pct)}%, not the stored ${tidy(storedPct)}%`
              : `check: ${tidy(1 + x)} × ${tidy(1 - x)} = ${tidy(product)} = ${tidy(finalPct)}%`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.65 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
