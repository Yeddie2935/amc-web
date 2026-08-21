import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const COCOA = "#8b5e3c";
const COCOA_Y = "#a9714a";
const GROOVE = "#4a2f1c";
const GOLD = "#f59e0b";
const GOLD_EDGE = "#b45309";

type Frac = { n: number; d: number };

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** Pill wide enough for its own text — monospace runs about 0.6 x the size. */
const chipW = (text: string, fontSize: number) => text.length * fontSize * 0.6 + 20;

function reduce(f: Frac): Frac {
  const g = gcd(f.n, f.d) || 1;
  return { n: f.n / g, d: f.d / g };
}

/** "133 1/3", "3/4" or "75" — exact, never a rounded decimal. */
function fmtFrac(f: Frac): string {
  const r = reduce(f);
  if (r.d === 1) return String(r.n);
  const w = Math.trunc(r.n / r.d);
  const rem = Math.abs(r.n % r.d);
  return w === 0 ? `${r.n}/${r.d}` : `${w} ${rem}/${r.d}`;
}

/** Answer choices may be written as mixed numbers ("133 1/3"), so parse exactly. */
function parseChoice(text: string): Frac | null {
  const t = text.replace(/[−–—]/g, "-").replace(/[%,]/g, "").trim();
  let m = t.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (m) {
    const w = Number(m[1]);
    const sign = w < 0 ? -1 : 1;
    return { n: sign * (Math.abs(w) * Number(m[3]) + Number(m[2])), d: Number(m[3]) };
  }
  m = t.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (m) return { n: Number(m[1]), d: Number(m[2]) };
  const v = Number(t.replace(/[^\d.-]/g, ""));
  return Number.isFinite(v) && t.length > 0 ? { n: v, d: 1 } : null;
}

/**
 * "p% of A equals q% of B — what percent of A is B?" Both percentages are whole
 * numbers of some common step (15 and 20 are both whole 5s), so cut each
 * quantity into 100/step equal slices and the given fact becomes a statement
 * about *counting* slices: 3 of A's slices weigh the same as 4 of B's. That
 * forces one of B's slices to be 3/4 of one of A's, and since B is 20 of its own
 * slices, B is 20 x 3/4 = 15 of A's — 15 of the 20, which reads straight off as
 * the percentage.
 *
 * The bars are drawn as chocolate bars because the slicing *is* the picture. They
 * start the same length (nothing yet says otherwise) and B then shrinks until its
 * shaded run genuinely lines up with A's, so the condition is enforced on screen
 * rather than assumed; every later measurement is read off that settled figure.
 *
 * The step, slice counts, the shrink ratio, the answer and every distractor
 * (the reversed question, and the sum/difference/product of the two percentages)
 * are computed and matched against `problem.choices` by exact fraction, so a slip
 * that hits no choice is dropped rather than narrated.
 * Data: { leftPercent, rightPercent, leftName?, rightName? }.
 */
export function PercentSliceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const p = num(data.leftPercent, 0);
  const q = num(data.rightPercent, 0);
  const A = data.leftName != null ? String(data.leftName) : "x";
  const B = data.rightName != null ? String(data.rightName) : "y";

  // the coarsest slice both percentages are a whole number of, and that also
  // divides the whole — so one ruler serves both bars
  const unit = gcd(gcd(p, q), 100) || 1;
  const N = 100 / unit;
  const aSlices = p / unit;
  const bSlices = q / unit;
  const ratio = q > 0 ? p / q : 1; // B measured in A
  const bInA = (N * p) / q; // B's length in A's slices
  const answer: Frac = { n: 100 * p, d: q };
  const reversal: Frac = { n: 100 * q, d: p };

  const letterOf = (f: Frac) =>
    (problem.choices ?? []).find((c) => {
      const v = parseChoice(String(c.text));
      return v != null && v.n * f.d === f.n * v.d;
    })?.label ?? "";
  const slips = [
    { label: `${p} + ${q}`, value: { n: p + q, d: 1 } as Frac },
    { label: `${Math.max(p, q)} − ${Math.min(p, q)}`, value: { n: Math.abs(q - p), d: 1 } as Frac },
    { label: `${p} × ${q}`, value: { n: p * q, d: 1 } as Frac },
  ]
    .map((s) => ({ ...s, letter: letterOf(s.value) }))
    .filter((s) => s.letter !== "" && s.letter !== problem.answer);
  const agrees = !problem.answer || letterOf(answer) === problem.answer;

  const lastStep = totalSteps - 1;
  const isFinal = step >= lastStep;
  const settled = isFinal || step >= 1; // B has shrunk to satisfy the given
  const measured = isFinal || step >= 2; // B measured against A's ruler

  // ---- geometry ----
  const W = 360;
  const H = 208;
  const x0 = 40;
  const full = 300;
  // draw whichever bar is longer at full width, so both always fit
  const aLen = full / Math.max(1, ratio);
  const bLen = aLen * ratio;
  const aTop = 40;
  const bTop = 108;
  const barH = 26;
  const aStep = aLen / N;
  const bStep = (settled ? bLen : aLen) / N;
  const goldEnd = x0 + aSlices * aStep; // where both shaded runs end once settled
  const bEnd = x0 + (settled ? bLen : aLen);
  const measureEnd = x0 + bInA * aStep; // same place as bEnd, via A's ruler
  const givenText = `${p}% of ${A} = ${q}% of ${B}`;
  const measureText = `all of ${B} = ${bInA} slices of ${A}`;
  const readText = `${bInA}/${N} = ${fmtFrac(answer)}% of ${A}`;

  const chocolate = (
    top: number,
    slices: number,
    shaded: number,
    stepW: number,
    body: string,
    key: string,
    delayBase: number,
  ) => (
    <g key={key}>
      <rect x={x0 - 2} y={top - 2} width={slices * stepW + 4} height={barH + 4} rx={3} fill={GROOVE} opacity={0.9} />
      {Array.from({ length: slices }).map((_, i) => {
        const lit = i < shaded;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18, delay: delayBase + i * 0.02 }}
          >
            <motion.rect
              x={x0}
              y={top + 1.4}
              height={barH - 2.8}
              rx={1.8}
              fill={lit ? GOLD : body}
              stroke={lit ? GOLD_EDGE : GROOVE}
              strokeWidth={0.7}
              animate={{ x: i * stepW + 0.7, width: Math.max(0.6, stepW - 1.4) }}
              transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 + i * 0.012 }}
            />
            {lit && (
              <motion.g
                animate={{ x: i * stepW + stepW / 2 }}
                transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 + i * 0.012 }}
              >
                <text
                  x={x0}
                  y={top + barH / 2 + 3}
                  textAnchor="middle"
                  fontSize={Math.min(8.5, stepW * 0.62)}
                  fontWeight="800"
                  fill="#7c2d12"
                  fontFamily={numberFont}
                >
                  {i + 1}
                </text>
              </motion.g>
            )}
          </motion.g>
        );
      })}
    </g>
  );

  const caption = isFinal
    ? `${bInA} of ${A}'s ${N} slices — ${B} is ${fmtFrac(answer)}% of ${A}`
    : step === 0
    ? `${p}% and ${q}% are both whole numbers of ${unit}% — so slice each bar into ${N}`
    : !measured
    ? `${bSlices} slices of ${B} = ${aSlices} slices of ${A}, so one ${B}-slice is ${aSlices}/${bSlices} of an ${A}-slice`
    : `${B} is ${N} of its own slices = ${N} × ${aSlices}/${bSlices} = ${bInA} of ${A}'s`;

  const note = isFinal
    ? !agrees
      ? `check failed: ${fmtFrac(answer)}% matches no choice, or not the stored answer`
      : slips.length
      ? `the other choices are just ${slips.map((s) => `${s.label} (${s.letter})`).join(", ")} — none of them measure anything`
      : ""
    : step === 0
    ? `the two bars are drawn the same for now — nothing yet says how they compare`
    : !measured
    ? `${B}'s bar had to shrink: its ${bSlices} shaded slices must cover exactly what ${A}'s ${aSlices} cover`
    : `${bInA} out of ${N} slices, and each slice is ${unit}%`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {/* percent ruler over A, the bar everything is measured against */}
        {Array.from({ length: 5 }).map((_, k) => {
          const sliceIdx = k * Math.max(1, Math.round(N / 4));
          if (sliceIdx > N) return null;
          const x = x0 + sliceIdx * aStep;
          return (
            <g key={`t${k}`}>
              <line x1={x} x2={x} y1={aTop - 7} y2={aTop - 2} stroke="#94a3b8" strokeWidth={0.9} />
              <text x={x} y={aTop - 10} textAnchor="middle" fontSize="7.5" fill="#64748b" fontFamily={numberFont}>
                {sliceIdx * unit}%
              </text>
            </g>
          );
        })}

        {/* the two quantities, cut into slices of the common step */}
        {chocolate(aTop, N, aSlices, aStep, COCOA, "abar", 0.05)}
        {chocolate(bTop, N, bSlices, bStep, COCOA_Y, "bbar", 0.35)}
        <text x={x0 - 8} y={aTop + barH / 2 + 4} textAnchor="end" fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {A}
        </text>
        <text x={x0 - 8} y={bTop + barH / 2 + 4} textAnchor="end" fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {B}
        </text>
        <text x={30} y={aTop - 9} textAnchor="end" fontSize="11">
          🍫
        </text>

        {/* what the two percentages come to, once both bars carry the same ruler */}
        <AnimatePresence>
          {!settled && (
            <motion.g key="counts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.9 }}>
              {[
                { pc: p, name: A, k: aSlices, yy: 152 },
                { pc: q, name: B, k: bSlices, yy: 174 },
              ].map((row) => (
                <g key={row.name}>
                  <rect x={W / 2 - 90} y={row.yy} width={180} height={18} rx={9} fill="#fef3c7" stroke={GOLD} strokeWidth={0.9} />
                  <text
                    x={W / 2}
                    y={row.yy + 12.5}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="800"
                    fill="#92400e"
                    fontFamily={numberFont}
                  >
                    {row.pc}% of {row.name} = {row.k} slices of {row.name}
                  </text>
                </g>
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the given fact, enforced: both shaded runs end on the same line */}
        <AnimatePresence>
          {settled && (
            <motion.g key="eq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.55 }}>
              <line
                x1={goldEnd}
                x2={goldEnd}
                y1={aTop - 2}
                y2={bTop + barH + 4}
                stroke={GOLD_EDGE}
                strokeWidth={1.2}
                strokeDasharray="3 3"
              />
              {!measured && (
                <>
                  <path
                    d={`M ${goldEnd / 2 + x0 / 2},${aTop + barH + 6} v ${bTop - aTop - barH - 12}`}
                    stroke={GOLD_EDGE}
                    strokeWidth={1.2}
                  />
                  <rect
                    x={Math.max(x0, (goldEnd + x0) / 2 - chipW(givenText, 9) / 2)}
                    y={(aTop + barH + bTop) / 2 - 8}
                    width={chipW(givenText, 9)}
                    height={16}
                    rx={8}
                    fill="#fef3c7"
                    stroke={GOLD}
                    strokeWidth={0.9}
                  />
                  <text
                    x={Math.max(x0, (goldEnd + x0) / 2 - chipW(givenText, 9) / 2) + chipW(givenText, 9) / 2}
                    y={(aTop + barH + bTop) / 2 + 4}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="800"
                    fill="#92400e"
                    fontFamily={numberFont}
                  >
                    {givenText}
                  </text>
                </>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* one slice against one slice — the bridge to counting */}
        <AnimatePresence>
          {settled && !measured && (
            <motion.g key="slice" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.85 }}>
              <text x={W / 2} y={bTop + barH + 20} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#64748b">
                one slice of each, enlarged
              </text>
              <rect x={W / 2 - 78} y={bTop + barH + 26} width={72} height={22} rx={2} fill={COCOA} stroke={GROOVE} strokeWidth={0.8} />
              <text x={W / 2 - 42} y={bTop + barH + 41} textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                1 of {A}
              </text>
              <motion.rect
                x={W / 2 + 6}
                y={bTop + barH + 26}
                height={22}
                rx={2}
                fill={COCOA_Y}
                stroke={GROOVE}
                strokeWidth={0.8}
                initial={{ width: 72 }}
                animate={{ width: (72 * aSlices) / bSlices }}
                transition={{ type: "spring", stiffness: 120, damping: 20, delay: 1.05 }}
              />
              <rect
                x={W / 2 + 6}
                y={bTop + barH + 26}
                width={72}
                height={22}
                rx={2}
                fill="none"
                stroke={COCOA_Y}
                strokeWidth={0.8}
                strokeDasharray="3 3"
              />
              <text
                x={W / 2 + 6 + (72 * aSlices) / bSlices / 2}
                y={bTop + barH + 41}
                textAnchor="middle"
                fontSize="9"
                fontWeight="800"
                fill="#fff"
                fontFamily={numberFont}
              >
                1 of {B}
              </text>
              <text x={W / 2 + 84} y={bTop + barH + 41} fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont}>
                = {aSlices}/{bSlices}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* lay A's ruler over B: the measuring band sweeps out and stops on a tick */}
        <AnimatePresence>
          {measured && (
            <motion.g key="meas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }}>
              <motion.rect
                x={x0}
                y={aTop - 2}
                height={barH + 4}
                rx={3}
                fill={WIN}
                opacity={0.32}
                initial={{ width: 0 }}
                animate={{ width: bInA * aStep }}
                transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.3 }}
              />
              <line x1={measureEnd} x2={measureEnd} y1={aTop - 2} y2={bTop + barH + 4} stroke={WIN} strokeWidth={1.4} strokeDasharray="4 3" />
              <line x1={x0} x2={bEnd} y1={bTop + barH + 9} y2={bTop + barH + 9} stroke={WIN} strokeWidth={1.4} />
              <path d={`M ${x0},${bTop + barH + 5} v 8 M ${bEnd},${bTop + barH + 5} v 8`} stroke={WIN} strokeWidth={1.4} />
              <rect
                x={(x0 + bEnd) / 2 - chipW(measureText, 9.5) / 2}
                y={bTop + barH + 15}
                width={chipW(measureText, 9.5)}
                height={17}
                rx={8}
                fill="#dcfce7"
                stroke="#bbf7d0"
                strokeWidth={0.9}
              />
              <text
                x={(x0 + bEnd) / 2}
                y={bTop + barH + 27}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="800"
                fill="#166534"
                fontFamily={numberFont}
              >
                {measureText}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the reading: that many of A's slices, out of N */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.75 }}>
              <path
                d={`M ${x0},${aTop + barH + 6} v 6 H ${measureEnd} v -6`}
                fill="none"
                stroke={IND}
                strokeWidth={1.3}
              />
              <rect
                x={(x0 + measureEnd) / 2 - chipW(readText, 9.5) / 2}
                y={aTop + barH + 14}
                width={chipW(readText, 9.5)}
                height={17}
                rx={8}
                fill="#eef2ff"
                stroke="#c7d2fe"
                strokeWidth={0.9}
              />
              <text
                x={(x0 + measureEnd) / 2}
                y={aTop + barH + 26}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="800"
                fill={IND}
                fontFamily={numberFont}
              >
                {readText}
              </text>
              <text
                x={W / 2}
                y={H - 6}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="#64748b"
                fontFamily={numberFont}
              >
                read the other way: {A} is {fmtFrac(reversal)}% of {B}
                {letterOf(reversal) ? `  (choice ${letterOf(reversal)})` : ""}
              </text>
            </motion.g>
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
          color: isFinal ? "#166534" : settled ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : settled ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : settled ? "#fde68a" : "#c7d2fe"}`,
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
            transition={{ delay: 0.5 }}
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
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
