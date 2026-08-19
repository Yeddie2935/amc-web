import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const PASTA = "#fbbf24";
const PASTA_EDGE = "#b45309";
const EATEN = "#fca5a5";
const EATEN_EDGE = "#dc2626";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const MUTE = "#94a3b8";

const W = 360;
const H = 206;
const X0 = 24;
const STRAND_W = W - 2 * X0;
const ROW_Y = 92; // top of the strand row
const ROW_H = 15;

const tidy = (v: number) => String(Number(v.toFixed(4)));

/** Donkey head, muzzle at the origin; `chomp` drops the jaw. */
function Donkey({ chomp = 0 }: { chomp?: number }) {
  return (
    <g>
      <path d="M -10 -26 q -4 -13 0 -15 q 5 -1 5 12 Z" fill="#9ca3af" stroke="#4b5563" strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M 10 -26 q 4 -13 0 -15 q -5 -1 -5 12 Z" fill="#9ca3af" stroke="#4b5563" strokeWidth={1.2} strokeLinejoin="round" />
      <ellipse cx={0} cy={-16} rx={13} ry={11} fill="#9ca3af" stroke="#4b5563" strokeWidth={1.3} />
      <circle cx={-5.5} cy={-18} r={1.5} fill={INK} />
      <circle cx={5.5} cy={-18} r={1.5} fill={INK} />
      <ellipse cx={0} cy={-4} rx={8.5} ry={7} fill="#d1d5db" stroke="#4b5563" strokeWidth={1.2} />
      <circle cx={-3} cy={-6} r={1.1} fill="#4b5563" />
      <circle cx={3} cy={-6} r={1.1} fill="#4b5563" />
      <path d={`M -5 ${-0.5 + chomp} q 5 3 10 0`} stroke="#4b5563" strokeWidth={1.2} fill="none" strokeLinecap="round" />
    </g>
  );
}

/** A rectangle whose far end is torn, so no length is claimed for that piece. */
function tornPath(x: number, y: number, w: number, h: number, side: "left" | "right"): string {
  const teeth = 4;
  const dy = h / teeth;
  const d = 5;
  let p = side === "left" ? `M ${x + w} ${y} L ${x + w} ${y + h}` : `M ${x} ${y} L ${x} ${y + h}`;
  for (let i = teeth; i >= 0; i--) {
    const jag = i % 2 ? d : 0;
    p += side === "left" ? ` L ${x + jag} ${y + i * dy}` : ` L ${x + w - jag} ${y + i * dy}`;
  }
  return `${p} Z`;
}

/** A measuring brace under a span, with its label. */
function Brace({ x1, x2, y, label, color }: { x1: number; x2: number; y: number; label: string; color: string }) {
  return (
    <g>
      <path d={`M ${x1} ${y} l 0 5 L ${x2} ${y + 5} l 0 -5`} fill="none" stroke={color} strokeWidth={1.3} />
      <text x={(x1 + x2) / 2} y={y + 17} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={color} fontFamily={numberFont}>
        {label}
      </text>
    </g>
  );
}

/**
 * Something repeatedly bitten **through the middle**, so every bite both removes
 * a fixed length and splits one piece into two. Working forwards invites the
 * classic off-by-one (one bite per piece); the scene runs it backwards instead,
 * laying the surviving pieces out in a row so the bites become the **gaps
 * between them** — and a row of 10 pieces has 9 gaps, which is the whole
 * problem, the fence-post count made literal. The beats show the rule once up
 * close (a strand running off both edges, so no length is implied), hop a donkey
 * along the row numbering the gaps, drop a chunk back into every gap so the
 * strand is whole again, then un-interleave it into two solid bars — what is
 * left and what was eaten — whose lengths add to the original.
 * The closing table is the payoff: every answer choice is decoded back into the
 * bite count it implies, so the distractors line up as a ladder of 7, 8, 9, 10
 * bites and only one of them leaves the right number of pieces. Bites, eaten
 * length, total and each choice's implied count are computed, and the total is
 * checked against the stored answer.
 * Data: { remaining, pieces, biteLen, unit?, item? }.
 */
export function BiteSplitScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const remaining = num(data.remaining, 17);
  const pieces = Math.max(2, Math.round(num(data.pieces, 10)));
  const biteLen = num(data.biteLen, 3);
  const unit = data.unit != null ? String(data.unit) : "in";

  const bites = pieces - 1;
  const eaten = bites * biteLen;
  const total = remaining + eaten;

  // every choice decoded back into the bite count it would need
  const opts = (problem.choices ?? [])
    .map((c) => ({
      label: c.label,
      value: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")),
    }))
    .filter((c) => Number.isFinite(c.value))
    .map((c) => {
      const k = (c.value - remaining) / biteLen;
      const whole = Math.abs(k - Math.round(k)) < 1e-9 && k >= 0;
      return { ...c, bites: whole ? Math.round(k) : null };
    });
  const winner = opts.find((o) => Math.abs(o.value - total) < 1e-9);
  const agrees = !problem.answer || winner?.label === problem.answer;
  const ladder = opts.filter((o) => o.bites != null && o.bites !== bites).length;

  const S = STRAND_W / total; // px per unit — the row is drawn to scale
  const pieceW = (remaining / pieces) * S;
  const gapW = biteLen * S;
  const pitch = pieceW + gapW;
  const pieceX = (i: number) => X0 + i * pitch;
  const gapX = (j: number) => X0 + pieceW + j * pitch;
  // beat 4 slides everything apart into two solid bars
  const packPieceX = (i: number) => X0 + i * pieceW;
  const packGapX = (j: number) => X0 + pieces * pieceW + j * gapW;
  const splitAt = X0 + pieces * pieceW;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showRule = !isFinal && step === 0;
  const showCount = !isFinal && step === 1;
  const showRefill = !isFinal && step >= 2;

  // beat 1 draws a generic piece running off both edges, so no length is implied
  const Z = 22; // px per unit, zoomed
  const biteZ = biteLen * Z;
  const midX = W / 2;

  const caption = showRule
    ? `each bite takes ${tidy(biteLen)} ${unit} out of the middle, so one piece becomes two`
    : showCount
    ? `${pieces} pieces in a row have ${bites} gaps between them — so ${bites} bites, not ${pieces}`
    : showRefill && !isFinal
    ? `every gap is one bite: ${bites} × ${tidy(biteLen)} = ${tidy(eaten)} ${unit} eaten`
    : `${tidy(remaining)} ${unit} left + ${tidy(eaten)} ${unit} eaten = ${tidy(total)} ${unit} to start`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        <defs>
          <pattern id="bs-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill={EATEN} />
            <line x1="0" y1="0" x2="0" y2="6" stroke={EATEN_EDGE} strokeWidth="1.6" opacity={0.5} />
          </pattern>
        </defs>

        {showRule ? (
          /* the rule, once, on a strand whose ends run off the canvas */
          <g>
            <motion.g initial={{ x: 0 }} animate={{ x: -7 }} transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.9 }}>
              <path d={tornPath(8, 70, midX - biteZ / 2 - 8, 20, "left")} fill={PASTA} stroke={PASTA_EDGE} strokeWidth={1.4} strokeLinejoin="round" />
              <text x={midX - biteZ / 2 - 34} y={84} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={PASTA_EDGE} fontFamily={numberFont}>
                piece 1
              </text>
            </motion.g>
            <motion.g initial={{ x: 0 }} animate={{ x: 7 }} transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.9 }}>
              <path d={tornPath(midX + biteZ / 2, 70, W - 8 - (midX + biteZ / 2), 20, "right")} fill={PASTA} stroke={PASTA_EDGE} strokeWidth={1.4} strokeLinejoin="round" />
              <text x={midX + biteZ / 2 + 34} y={84} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={PASTA_EDGE} fontFamily={numberFont}>
                piece 2
              </text>
            </motion.g>

            {/* the mouthful, lifted out of the middle */}
            <motion.g
              initial={{ y: 0, rotate: 0 }}
              animate={{ y: -42, rotate: -12 }}
              transition={{ type: "spring", stiffness: 110, damping: 15, delay: 0.55 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect x={midX - biteZ / 2} y={70} width={biteZ} height={20} fill="url(#bs-hatch)" stroke={EATEN_EDGE} strokeWidth={1.4} />
            </motion.g>

            <motion.g initial={{ y: -26, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.15 }}>
              <g transform={`translate(${midX} 26)`}>
                <Donkey chomp={2} />
              </g>
            </motion.g>

            {/* the hole it left, measured */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
              <line x1={midX - biteZ / 2 - 7} y1={100} x2={midX + biteZ / 2 + 7} y2={100} stroke={EATEN_EDGE} strokeWidth={1.3} />
              <line x1={midX - biteZ / 2 - 7} y1={96} x2={midX - biteZ / 2 - 7} y2={104} stroke={EATEN_EDGE} strokeWidth={1.3} />
              <line x1={midX + biteZ / 2 + 7} y1={96} x2={midX + biteZ / 2 + 7} y2={104} stroke={EATEN_EDGE} strokeWidth={1.3} />
              <text x={midX} y={116} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={EATEN_EDGE} fontFamily={numberFont}>
                {tidy(biteLen)} {unit} gone
              </text>
            </motion.g>

            <motion.text
              x={midX}
              y={142}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="800"
              fill={MARK}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.4 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              every bite: −{tidy(biteLen)} {unit}, +1 piece
            </motion.text>
            <motion.text x={midX} y={160} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={MUTE} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
              (torn ends: a piece can be any length — only the bite is 3 in)
            </motion.text>
          </g>
        ) : (
          /* the row: surviving pieces, the gaps between them, and the rebuild */
          <g>
            {/* what he ate — one chunk per gap */}
            {Array.from({ length: bites }).map((_, j) => {
              const home = gapX(j);
              const dx = isFinal ? packGapX(j) - home : 0;
              return (
                <motion.g
                  key={`chunk-${j}`}
                  initial={{ x: 0, y: showRefill && !isFinal ? -34 : 0, opacity: showRefill ? 0 : 1 }}
                  animate={{ x: dx, y: 0, opacity: showRefill ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 17, delay: isFinal ? 0.5 + j * 0.03 : 0.3 + j * 0.09 }}
                >
                  <rect x={home} y={ROW_Y} width={gapW} height={ROW_H} fill="url(#bs-hatch)" stroke={EATEN_EDGE} strokeWidth={1.2} />
                </motion.g>
              );
            })}

            {/* the pieces that survived */}
            {Array.from({ length: pieces }).map((_, i) => {
              const home = pieceX(i);
              const dx = isFinal ? packPieceX(i) - home : 0;
              return (
                <motion.g
                  key={`piece-${i}`}
                  initial={{ x: 0, opacity: 0, scale: 0.4 }}
                  animate={{ x: dx, opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 150, damping: 17, delay: isFinal ? 0.5 + i * 0.03 : 0.1 + i * 0.05 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <rect x={home} y={ROW_Y} width={pieceW} height={ROW_H} rx={2} fill={PASTA} stroke={PASTA_EDGE} strokeWidth={1.3} />
                </motion.g>
              );
            })}

            {/* counting the gaps: the donkey hops along, numbering them */}
            <AnimatePresence>
              {showCount && (
                <motion.g key="count" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {Array.from({ length: bites }).map((_, j) => (
                    <motion.g
                      key={j}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.5 + j * 0.16 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <circle cx={gapX(j) + gapW / 2} cy={ROW_Y + ROW_H + 12} r={7.5} fill={MARK} />
                      <text x={gapX(j) + gapW / 2} y={ROW_Y + ROW_H + 15.5} textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                        {j + 1}
                      </text>
                    </motion.g>
                  ))}
                  <motion.g
                    initial={{ x: gapX(0) + gapW / 2 }}
                    animate={{ x: Array.from({ length: bites }, (_, j) => gapX(j) + gapW / 2) }}
                    transition={{ duration: 0.16 * bites, times: Array.from({ length: bites }, (_, j) => j / Math.max(1, bites - 1)), ease: "linear", delay: 0.5 }}
                  >
                    <g transform={`translate(0 ${ROW_Y - 4})`}>
                      <Donkey chomp={1} />
                    </g>
                  </motion.g>
                </motion.g>
              )}
            </AnimatePresence>

            {/* headline arithmetic per beat */}
            <AnimatePresence mode="wait">
              {showCount ? (
                <motion.g key="h-count" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.text
                    x={W / 2}
                    y={38}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    fill={MARK}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.5 + bites * 0.16 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {pieces} pieces → {bites} gaps → {bites} bites
                  </motion.text>
                  <motion.text x={W / 2} y={58} textAnchor="middle" fontSize="10" fontWeight="800" fill={BAD} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + bites * 0.16 }}>
                    {pieces} bites would have left {pieces + 1} pieces
                  </motion.text>
                  {/* below the badges — the donkey's head sweeps the band above the row */}
                  <motion.text
                    x={W / 2}
                    y={ROW_Y + ROW_H + 36}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="700"
                    fill={MUTE}
                    fontFamily={numberFont}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 + bites * 0.16 }}
                  >
                    the pieces total {tidy(remaining)} {unit}; their individual lengths are not given
                  </motion.text>
                </motion.g>
              ) : showRefill && !isFinal ? (
                <motion.g key="h-refill" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.text
                    x={W / 2}
                    y={46}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="800"
                    fill={EATEN_EDGE}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.3 + bites * 0.09 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {bites} × {tidy(biteLen)} = {tidy(eaten)} {unit}
                  </motion.text>
                  <motion.text x={W / 2} y={66} textAnchor="middle" fontSize="10" fontWeight="700" fill={MUTE} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + bites * 0.09 }}>
                    put every mouthful back and the strand is whole again
                  </motion.text>
                </motion.g>
              ) : isFinal ? (
                <motion.g key="h-fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
                    <Brace x1={X0} x2={splitAt} y={ROW_Y + ROW_H + 6} label={`${tidy(remaining)} ${unit} left`} color={PASTA_EDGE} />
                    <Brace x1={splitAt} x2={X0 + STRAND_W} y={ROW_Y + ROW_H + 6} label={`${tidy(eaten)} ${unit} eaten`} color={EATEN_EDGE} />
                  </motion.g>
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
                    <path d={`M ${X0} ${ROW_Y - 6} l 0 -5 L ${X0 + STRAND_W} ${ROW_Y - 11} l 0 5`} fill="none" stroke={WIN} strokeWidth={1.4} />
                  </motion.g>
                  <motion.text
                    x={W / 2}
                    y={ROW_Y - 20}
                    textAnchor="middle"
                    fontSize="15"
                    fontWeight="800"
                    fill={WIN}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.55 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {tidy(remaining)} + {tidy(eaten)} = {tidy(total)} {unit}
                  </motion.text>

                  {/* every choice decoded into the bite count it needs */}
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                    {winner && (
                      <rect
                        x={54 + opts.indexOf(winner) * 58}
                        y={158}
                        width={54}
                        height={42}
                        rx={6}
                        fill="#dcfce7"
                        stroke={WIN}
                        strokeWidth={1.3}
                      />
                    )}
                    {["length", "bites", "pieces"].map((lab, r) => (
                      <text key={lab} x={16} y={172 + r * 14} fontSize="8.5" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                        {lab}
                      </text>
                    ))}
                    {opts.map((o, i) => {
                      const cx = 54 + i * 58 + 27;
                      const good = o.label === winner?.label;
                      return (
                        <motion.g
                          key={o.label}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1.9 + i * 0.12 }}
                        >
                          <text x={cx} y={172} textAnchor="middle" fontSize="10" fontWeight="800" fill={good ? WIN : INK} fontFamily={numberFont}>
                            ({o.label}) {tidy(o.value)}
                          </text>
                          <text x={cx} y={186} textAnchor="middle" fontSize="10" fontWeight="800" fill={good ? WIN : o.bites == null ? BAD : MUTE} fontFamily={numberFont}>
                            {o.bites == null ? "—" : o.bites}
                          </text>
                          <text x={cx} y={200} textAnchor="middle" fontSize="10" fontWeight="800" fill={good ? WIN : o.bites == null ? BAD : MUTE} fontFamily={numberFont}>
                            {o.bites == null ? "—" : o.bites + 1}
                          </text>
                        </motion.g>
                      );
                    })}
                  </motion.g>
                </motion.g>
              ) : null}
            </AnimatePresence>
          </g>
        )}
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
            transition={{ delay: 2.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? MUTE : BAD, textAlign: "center" }}
          >
            {!agrees
              ? `this rebuilds to ${tidy(total)} ${unit}, not the stored answer`
              : `${ladder} of the other choices are just different bite counts — only ${bites} leaves ${pieces} pieces`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
