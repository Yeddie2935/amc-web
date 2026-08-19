import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WARN = "#b45309";

const fmt = (v: number) => Number(v.toFixed(4)).toString();

/**
 * Three equally spaced numbers with the **middle one given** and the outer two
 * tied by a ratio. The trap is treating the spacing as the unknown and grinding
 * out an equation; the unlock is that equal spacing makes the middle the
 * **average** of the outer two, so their sum is `2 × middle` — pinned before the
 * spacing is known at all. The scene earns that rather than stating it: the two
 * outer points slide in and out symmetrically about the middle, a whole family of
 * candidates, and then the two outer values are drawn as bars that **level off**,
 * the tall one pouring into the short one until both stand at the middle, with
 * the combined length never changing. That leaves a fixed total split in a known
 * ratio, so the bar cuts into `1 + ratio` equal parts and the smallest is one of
 * them — the answer read straight off a part. The closing beat plants all three
 * on the line, measures both gaps to confirm they match, re-checks the ratio, and
 * points out that the **numbers passed through on the way are themselves answer
 * choices** (the ratio and the part count), which is where the distractors come
 * from. Sum, parts, unit, both gaps and the ratio are all computed and
 * cross-checked; data `{ middle, ratio }`.
 */
export function SpacedRatioScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const middle = Math.max(1, num(data.middle, 15));
  const ratio = Math.max(2, num(data.ratio, 4));

  // ---- the middle is the average, so the outer two are pinned in total ----
  const outerSum = 2 * middle;
  const parts = 1 + ratio;
  const unit = outerSum / parts;
  const small = unit;
  const large = ratio * unit;
  const gapLo = middle - small;
  const gapHi = large - middle;

  const choiceOf = (v: number) =>
    (problem.choices ?? []).find(
      (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === v,
    )?.label ?? null;
  const passed = [
    { name: "the ratio", v: ratio },
    { name: `1 + ${fmt(ratio)}`, v: parts },
  ].filter((p) => choiceOf(p.v) != null);

  const spacedOk = Math.abs(gapLo - gapHi) < 1e-9;
  const ratioOk = Math.abs(large - ratio * small) < 1e-9;
  const answerOk = problem.shortAnswer == null || fmt(small) === String(problem.shortAnswer).trim();
  const ok = spacedOk && ratioOk && answerOk && small > 0;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  // the sum beat and the split beat carry the argument, so a short timeline drops
  // the setup rather than one of those
  const phase = isFinal ? 3 : totalSteps <= 3 ? Math.min(beat + 1, 2) : Math.min(beat, 2);

  const W = 470;
  const H = 262;

  // ---- the number line ----
  const span = large + Math.max(2, large * 0.2);
  const tick = (() => {
    const raw = span / 6;
    const pow = Math.pow(10, Math.floor(Math.log10(raw)));
    return [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? 10 * pow;
  })();
  const vMax = Math.ceil(span / tick) * tick;
  const axL = 40;
  const axR = 432;
  const X = (v: number) => axL + (v / vMax) * (axR - axL);
  const lineY = 118;

  // ---- bars ----
  const BW = 340 / outerSum; // px per unit
  const bx = 62;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ================= phases 0 and 3: the number line ================= */}
        {(phase === 0 || phase === 3) && (
          <g>
            <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              {phase === 0
                ? `the middle is stuck at ${fmt(middle)}, but the spacing could still be anything`
                : `${fmt(small)}, ${fmt(middle)}, ${fmt(large)} — equally spaced, and the ratio is right`}
            </text>

            <line x1={axL - 8} y1={lineY} x2={axR + 8} y2={lineY} stroke="#cbd5e1" strokeWidth={2} />
            {Array.from({ length: Math.round(vMax / tick) + 1 }, (_, i) => i * tick).map((v) => (
              <g key={v}>
                <line x1={X(v)} y1={lineY - 5} x2={X(v)} y2={lineY + 5} stroke={DIM} strokeWidth={1.2} />
                <text x={X(v)} y={lineY + 18} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                  {fmt(v)}
                </text>
              </g>
            ))}

            {/* the middle, pinned */}
            <circle cx={X(middle)} cy={lineY} r={7} fill={IND} />
            <text x={X(middle)} y={lineY - 14} textAnchor="middle" fontSize="12" fontWeight="800" fill={IND} fontFamily={numberFont}>
              {fmt(middle)}
            </text>

            {phase === 0 &&
              (() => {
                // a family of candidates, sliding symmetrically about the middle
                const ds = [gapLo * 0.45, gapLo * 1.35, gapLo * 0.8];
                const keys = [...ds, ds[0]];
                const spin = { duration: 4.2, repeat: Infinity, ease: "easeInOut" } as const;
                return (
                  <g>
                    {/* the two gaps stay equal however far the ends travel */}
                    {[-1, 1].map((sign) => {
                      const ends = keys.map((d) => X(middle + sign * d));
                      return (
                        <g key={`d${sign}`}>
                          <motion.line
                            y1={lineY - 40}
                            y2={lineY - 40}
                            stroke={IND}
                            strokeWidth={1.6}
                            initial={{ x1: X(middle), x2: ends[0] }}
                            animate={{ x1: X(middle), x2: ends }}
                            transition={spin}
                          />
                          <motion.line
                            y1={lineY - 45}
                            y2={lineY - 35}
                            stroke={IND}
                            strokeWidth={1.6}
                            initial={{ x1: ends[0], x2: ends[0] }}
                            animate={{ x1: ends, x2: ends }}
                            transition={spin}
                          />
                          <motion.text
                            y={lineY - 48}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="800"
                            fill={IND}
                            fontFamily={numberFont}
                            initial={{ x: (X(middle) + ends[0]) / 2 }}
                            animate={{ x: ends.map((e) => (X(middle) + e) / 2) }}
                            transition={spin}
                          >
                            d
                          </motion.text>
                        </g>
                      );
                    })}
                    <line x1={X(middle)} y1={lineY - 45} x2={X(middle)} y2={lineY - 35} stroke={IND} strokeWidth={1.6} />
                    <text x={W / 2} y={lineY - 62} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM}>
                      equally spaced = the same gap d on both sides
                    </text>
                    {[-1, 1].map((sign) => (
                      <motion.g
                        key={sign}
                        animate={{ x: keys.map((d) => X(middle + sign * d) - X(middle)) }}
                        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <circle cx={X(middle)} cy={lineY} r={6} fill={sign < 0 ? TEAL : WARN} />
                        <text
                          x={X(middle)}
                          y={lineY + 34}
                          textAnchor="middle"
                          fontSize="9.5"
                          fontWeight="800"
                          fill={sign < 0 ? TEAL : WARN}
                          fontFamily={numberFont}
                        >
                          {sign < 0 ? "smallest" : "largest"}
                        </text>
                      </motion.g>
                    ))}
                    <motion.text
                      x={W / 2}
                      y={196}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fill={DIM}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      whatever the spacing, the two ends stay mirror images of {fmt(middle)}
                    </motion.text>
                    <motion.text
                      x={W / 2}
                      y={222}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="800"
                      fill={WARN}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3 }}
                    >
                      the ratio largest = {fmt(ratio)} × smallest is what pins it down
                    </motion.text>
                  </g>
                );
              })()}

            {phase === 3 && (
              <g>
                {[
                  { v: small, c: TEAL, label: "smallest" },
                  { v: large, c: WARN, label: "largest" },
                ].map((p) => (
                  <motion.g
                    key={p.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <circle cx={X(p.v)} cy={lineY} r={7} fill={p.c} />
                    <text x={X(p.v)} y={lineY - 14} textAnchor="middle" fontSize="12" fontWeight="800" fill={p.c} fontFamily={numberFont}>
                      {fmt(p.v)}
                    </text>
                  </motion.g>
                ))}
                {/* both gaps, measured */}
                {[
                  { a: small, b: middle, g: gapLo },
                  { a: middle, b: large, g: gapHi },
                ].map((s, i) => (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 + i * 0.25 }}>
                    <line x1={X(s.a)} y1={lineY + 38} x2={X(s.b)} y2={lineY + 38} stroke={WIN} strokeWidth={1.8} />
                    <line x1={X(s.a)} y1={lineY + 33} x2={X(s.a)} y2={lineY + 43} stroke={WIN} strokeWidth={1.8} />
                    <line x1={X(s.b)} y1={lineY + 33} x2={X(s.b)} y2={lineY + 43} stroke={WIN} strokeWidth={1.8} />
                    <text x={(X(s.a) + X(s.b)) / 2} y={lineY + 56} textAnchor="middle" fontSize="11" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                      {fmt(s.g)}
                    </text>
                  </motion.g>
                ))}
                {/* the ratio, checked across the top of the line */}
                <motion.path
                  d={`M ${X(small)} ${lineY - 34} Q ${(X(small) + X(large)) / 2} ${lineY - 84} ${X(large)} ${lineY - 34}`}
                  fill="none"
                  stroke={IND}
                  strokeWidth={2}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                />
                {(() => {
                  // barbs taken from the curve's own end tangent, not guessed
                  const tx = X(large) - (X(small) + X(large)) / 2;
                  const ty = 50;
                  const m = Math.hypot(tx, ty);
                  const barb = (deg: number) => {
                    const a = (deg * Math.PI) / 180;
                    const ux = -tx / m;
                    const uy = -ty / m;
                    return `l ${(ux * Math.cos(a) - uy * Math.sin(a)) * 9} ${(ux * Math.sin(a) + uy * Math.cos(a)) * 9}`;
                  };
                  return (
                    <motion.path
                      d={`M ${X(large)} ${lineY - 34} ${barb(25)} M ${X(large)} ${lineY - 34} ${barb(-25)}`}
                      fill="none"
                      stroke={IND}
                      strokeWidth={2}
                      strokeLinecap="round"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.1 }}
                    />
                  );
                })()}
                <motion.text
                  x={(X(small) + X(large)) / 2}
                  y={lineY - 70}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="800"
                  fill={IND}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15, delay: 2.1 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  × {fmt(ratio)} ✓
                </motion.text>
                <motion.text
                  x={W / 2}
                  y={218}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="700"
                  fill={DIM}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  {passed.length
                    ? `watch out — ${passed.map((p) => `${fmt(p.v)} (choice ${choiceOf(p.v)})`).join(" and ")} turn up on the way`
                    : ""}
                </motion.text>
              </g>
            )}
          </g>
        )}

        {/* ================= phase 1: the two ends level off at the middle ================= */}
        {phase === 1 && (
          <g>
            <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              equal spacing means {fmt(middle)} is the average of the two ends
            </text>
            {[
              { v: small, level: middle, c: TEAL, label: "smallest", y: 44 },
              { v: large, level: middle, c: WARN, label: "largest", y: 86 },
            ].map((b) => (
              <g key={b.label}>
                <text x={bx - 10} y={b.y + 18} textAnchor="end" fontSize="10.5" fontWeight="700" fill={b.c}>
                  {b.label}
                </text>
                <motion.rect
                  x={bx}
                  y={b.y}
                  height={28}
                  rx={4}
                  fill={b.c}
                  fillOpacity={0.32}
                  stroke={b.c}
                  strokeWidth={1.6}
                  initial={{ width: b.v * BW }}
                  animate={{ width: [b.v * BW, b.v * BW, b.level * BW, b.level * BW] }}
                  transition={{ duration: 3.6, times: [0, 0.28, 0.72, 1], repeat: Infinity, repeatDelay: 0.4 }}
                />
                <motion.text
                  x={bx + 10}
                  y={b.y + 19}
                  fontSize="12"
                  fontWeight="800"
                  fill={b.c}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0, 1, 1] }}
                  transition={{ duration: 3.6, times: [0, 0.6, 0.78, 1], repeat: Infinity, repeatDelay: 0.4 }}
                >
                  {fmt(middle)}
                </motion.text>
              </g>
            ))}
            {/* the two laid end to end: the ends slide, the far edge never does */}
            {(() => {
              const kSmall = [small * BW, small * BW, middle * BW, middle * BW];
              const kLarge = [large * BW, large * BW, middle * BW, middle * BW];
              const loop = { duration: 3.6, times: [0, 0.28, 0.72, 1], repeat: Infinity, repeatDelay: 0.4 } as const;
              return (
                <g>
                  <text x={bx - 10} y={152} textAnchor="end" fontSize="10.5" fontWeight="700" fill={INK}>
                    together
                  </text>
                  <motion.rect y={134} height={26} rx={4} fill={TEAL} fillOpacity={0.32} stroke={TEAL} strokeWidth={1.6}
                    initial={{ x: bx, width: small * BW }} animate={{ x: bx, width: kSmall }} transition={loop} />
                  <motion.rect y={134} height={26} rx={4} fill={WARN} fillOpacity={0.32} stroke={WARN} strokeWidth={1.6}
                    initial={{ x: bx + small * BW, width: large * BW }}
                    animate={{ x: kSmall.map((w) => bx + w), width: kLarge }}
                    transition={loop} />
                  {/* the far edge, pinned */}
                  <line x1={bx + outerSum * BW} y1={128} x2={bx + outerSum * BW} y2={172} stroke={INK} strokeWidth={1.6} strokeDasharray="4 3" />
                  <line x1={bx} y1={128} x2={bx} y2={172} stroke={INK} strokeWidth={1.6} strokeDasharray="4 3" />
                </g>
              );
            })()}
            <motion.text x={W / 2} y={186} textAnchor="middle" fontSize="11" fontWeight="700" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              one end grows exactly as much as the other shrinks
            </motion.text>
            <motion.text
              x={W / 2}
              y={216}
              textAnchor="middle"
              fontSize="16"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.4 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              smallest + largest = 2 × {fmt(middle)} = {fmt(outerSum)}
            </motion.text>
            <motion.text x={W / 2} y={240} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
              and that is true before the spacing is known
            </motion.text>
          </g>
        )}

        {/* ================= phase 2: the ratio cuts the total into equal parts ================= */}
        {phase === 2 && (
          <g>
            <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              the largest is {fmt(ratio)} of the smallest, so {fmt(outerSum)} splits into 1 + {fmt(ratio)} equal parts
            </text>
            {Array.from({ length: parts }, (_, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.3 + i * 0.18 }}
                style={{ transformBox: "fill-box", transformOrigin: "left" }}
              >
                <rect
                  x={bx + i * unit * BW}
                  y={62}
                  width={unit * BW - 2}
                  height={40}
                  rx={4}
                  fill={i === 0 ? TEAL : WARN}
                  fillOpacity={0.32}
                  stroke={i === 0 ? TEAL : WARN}
                  strokeWidth={1.6}
                />
                <text
                  x={bx + i * unit * BW + (unit * BW - 2) / 2}
                  y={87}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="800"
                  fill={i === 0 ? TEAL : WARN}
                  fontFamily={numberFont}
                >
                  {fmt(unit)}
                </text>
              </motion.g>
            ))}
            {/* which parts belong to whom */}
            {[
              { from: 0, to: 1, c: TEAL, t: "smallest = 1 part" },
              { from: 1, to: parts, c: WARN, t: `largest = ${fmt(ratio)} parts` },
            ].map((s, i) => (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 + i * 0.2 }}>
                <line x1={bx + s.from * unit * BW} y1={114} x2={bx + s.to * unit * BW - 2} y2={114} stroke={s.c} strokeWidth={1.8} />
                <line x1={bx + s.from * unit * BW} y1={109} x2={bx + s.from * unit * BW} y2={119} stroke={s.c} strokeWidth={1.8} />
                <line x1={bx + s.to * unit * BW - 2} y1={109} x2={bx + s.to * unit * BW - 2} y2={119} stroke={s.c} strokeWidth={1.8} />
                <text
                  x={(bx + s.from * unit * BW + bx + s.to * unit * BW) / 2}
                  y={132}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="800"
                  fill={s.c}
                  fontFamily={numberFont}
                >
                  {s.t}
                </text>
              </motion.g>
            ))}
            <motion.text
              x={W / 2}
              y={178}
              textAnchor="middle"
              fontSize="15"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
            >
              {fmt(outerSum)} ÷ {fmt(parts)} = {fmt(unit)} per part
            </motion.text>
            <motion.text
              x={W / 2}
              y={206}
              textAnchor="middle"
              fontSize="17"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 2 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              smallest = {fmt(small)}
            </motion.text>
            <motion.text x={W / 2} y={230} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
              and the largest takes the other {fmt(ratio)} parts, {fmt(large)}
            </motion.text>
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
        {phase === 0
          ? `one number known, one relationship to use`
          : phase === 1
          ? `the ends add to ${fmt(outerSum)} whatever the spacing`
          : phase === 2
          ? `${fmt(outerSum)} into ${fmt(parts)} parts of ${fmt(unit)}`
          : `the smallest is ${fmt(small)}`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed:{" "}
          {!spacedOk
            ? `gaps ${fmt(gapLo)} and ${fmt(gapHi)} differ`
            : !ratioOk
            ? `${fmt(large)} is not ${fmt(ratio)} × ${fmt(small)}`
            : !answerOk
            ? `computed ${fmt(small)} but the stored answer is ${problem.shortAnswer}`
            : `smallest came out ${fmt(small)}`}
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.8 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
