import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** Renders a value as a reduced fraction when one exists within a small denominator, else decimal. */
function formatValue(value: number): string {
  for (let den = 1; den <= 12; den++) {
    const n = value * den;
    if (Math.abs(n - Math.round(n)) < 1e-9) {
      const rn = Math.round(n);
      const g = gcd(Math.abs(rn), den) || 1;
      const num = rn / g;
      const dn = den / g;
      return dn === 1 ? `${num}` : `${num}/${dn}`;
    }
  }
  return value.toFixed(3);
}

/**
 * Two circles whose diameter is a radius of the big one sit side by side
 * along a full diameter, so they're forced onto the big circle's own
 * horizontal diameter and their combined area is exactly half of it — no
 * matter what the big radius actually is. The scene draws that forced
 * layout, then reasons in real square units: big = 2×(the two circles),
 * so the shaded crescents left over equal the two circles again.
 * Data: { combinedSmallArea }.
 */
export function CrescentCircleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const combined = Math.max(0.01, num(data.combinedSmallArea, 1));
  const bigArea = 2 * combined;
  const shaded = bigArea - combined;
  const shadedStr = formatValue(shaded);
  const agrees = problem.shortAnswer == null || String(problem.shortAnswer).replace(/\s/g, "") === shadedStr;

  // classic slip: shade only one crescent instead of both
  const trap = shaded / 2;
  const trapStr = formatValue(trap);
  const trapChoice = problem.choices.find((c) => c.text.replace(/\s/g, "") === trapStr && trap !== shaded);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showAreas = step >= 1;

  const cx = 170;
  const cy = 96;
  const R = 66;
  const r = R / 2;
  const leftC = { x: cx - r, y: cy };
  const rightC = { x: cx + r, y: cy };

  const barX0 = 60;
  const barW = 220;
  const barY = 176;
  const barH = 18;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox="0 0 340 216" width="100%" style={{ maxWidth: 360 }}>
        {/* the big circle, filled so the leftover crescents read as shaded */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={R}
          initial={false}
          animate={{ fill: isFinal ? "#bbf7d0" : "#eef2ff" }}
          stroke={INK}
          strokeWidth={2}
        />
        {/* the two small circles, punched out in white so the crescents show */}
        <circle cx={leftC.x} cy={leftC.y} r={r} fill="#fff" stroke={MARK} strokeWidth={1.6} />
        <circle cx={rightC.x} cy={rightC.y} r={r} fill="#fff" stroke={MARK} strokeWidth={1.6} />

        {/* step 0: the forced radius/diameter equality */}
        <AnimatePresence>
          {step === 0 && (
            <motion.g key="radii" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <line x1={cx} y1={cy} x2={cx} y2={cy - R} stroke={INK} strokeWidth={2} />
              <text x={cx + 6} y={cy - R / 2} fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                R
              </text>
              <line x1={cx - R} y1={cy} x2={cx} y2={cy} stroke={MARK} strokeWidth={3} strokeLinecap="round" />
              <text x={cx - R / 2} y={cy - 6} textAnchor="middle" fontSize="10" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                R
              </text>
              <text x={cx - R / 2} y={cy + 16} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={MARK} fontFamily={numberFont}>
                diameter of small circle
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the running area accounting, in real square units */}
        <AnimatePresence>
          {showAreas && (
            <motion.g key="bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <rect x={barX0} y={barY} width={barW} height={barH} rx={5} fill="#f1f5f9" stroke={INK} strokeWidth={1.2} />
              {/* left half: the two small circles combined */}
              <motion.rect
                x={barX0}
                y={barY}
                width={barW / 2}
                height={barH}
                fill={MARK}
                fillOpacity={0.85}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              {/* right half: the shaded crescents, lit up once we get there */}
              <AnimatePresence>
                {isFinal && (
                  <motion.rect
                    key="shadedHalf"
                    x={barX0 + barW / 2}
                    y={barY}
                    width={barW / 2}
                    height={barH}
                    fill={WIN}
                    fillOpacity={0.85}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                )}
              </AnimatePresence>
              <line x1={barX0 + barW / 2} y1={barY - 4} x2={barX0 + barW / 2} y2={barY + barH + 4} stroke={INK} strokeWidth={1.2} strokeDasharray="2,2" />
              <text x={barX0 + barW / 4} y={barY + barH + 16} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                {combined}
              </text>
              <text x={barX0 + barW * 0.75} y={barY + barH + 16} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={isFinal ? "#fff" : "#64748b"} fontFamily={numberFont}>
                {shadedStr}
              </text>
              <text x={barX0 + barW / 2} y={barY - 10} textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                big circle = {bigArea}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={`${step}-cap`}
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
        {step === 0
          ? "each small circle's diameter is the big circle's radius"
          : isFinal
          ? `shaded = big − small circles = ${bigArea} − ${combined} = ${shadedStr}`
          : `radius halved → area quartered: two circles = half the big circle = ${combined}`}
      </motion.span>

      <AnimatePresence>
        {isFinal && trapChoice && (
          <motion.span
            key="trap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            shade only one crescent → {trapStr} (choice {trapChoice.label}) — there are two
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees ? `the two crescents equal the two circles again: ${shadedStr} = ${combined}` : `computed ${shadedStr} but the stored answer differs`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
