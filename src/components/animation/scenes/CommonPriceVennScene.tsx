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

function factorize(nInput: number): number[] {
  const out: number[] = [];
  let n = nInput;
  for (let p = 2; p * p <= n; p++) {
    while (n % p === 0) {
      out.push(p);
      n /= p;
    }
  }
  if (n > 1) out.push(n);
  return out;
}

function Tile({ x, y, p, delay, color = IND }: { x: number; y: number; p: number; delay: number; color?: string }) {
  return (
    <motion.g initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 18, delay }}>
      <rect x={x - 13} y={y - 11} width={26} height={22} rx={5} fill="#eef2ff" stroke={color} strokeWidth={1.4} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="12" fontWeight="900" fill={color} fontFamily={numberFont}>
        {p}
      </text>
    </motion.g>
  );
}

/**
 * Two groups pay different totals for the same unknown whole-cent price, so
 * the price is a shared prime factor of both totals. The scene factors each
 * total into prime tiles, drops the shared primes into the overlap of a Venn
 * diagram to read off the price, then divides each total by that price to
 * get a headcount and subtracts the two.
 * Data: { totalA, totalB, labelA, labelB, unit }.
 */
export function CommonPriceVennScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const totalA = Math.max(1, Math.round(num(data.totalA, 143)));
  const totalB = Math.max(1, Math.round(num(data.totalB, 195)));
  const labelA = data.labelA != null ? String(data.labelA) : "A";
  const labelB = data.labelB != null ? String(data.labelB) : "B";
  const unit = data.unit != null ? String(data.unit) : "¢";

  const factorsA = factorize(totalA);
  const factorsB = factorize(totalB);
  const bagB = [...factorsB];
  const overlap: number[] = [];
  const onlyA: number[] = [];
  for (const p of factorsA) {
    const idx = bagB.indexOf(p);
    if (idx >= 0) {
      overlap.push(p);
      bagB.splice(idx, 1);
    } else {
      onlyA.push(p);
    }
  }
  const onlyB = bagB;
  const price = overlap.reduce((a, b) => a * b, 1);

  const countA = totalA / price;
  const countB = totalB / price;
  const diff = countB - countA;

  const priceOk = totalA % price === 0 && totalB % price === 0;
  const matches = problem.shortAnswer == null || String(diff) === String(problem.shortAnswer);
  const failure = !priceOk
    ? `check failed: ${price}${unit} does not divide both totals evenly`
    : !matches
    ? `check failed: ${countB} − ${countA} = ${diff}, stored answer is ${problem.shortAnswer}`
    : "";

  const lastStep = totalSteps - 1;
  const phase = Math.min(step, 4);

  const W = 380;
  const H = 250;

  const tilesRow = (tiles: number[], cx: number, y: number, delayBase: number, color = IND) => {
    const w = tiles.length * 30;
    return tiles.map((p, i) => <Tile key={i} x={cx - w / 2 + 15 + i * 30} y={y} p={p} delay={delayBase + i * 0.12} color={color} />);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        {phase === 0 && (
          <>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM} fontFamily={numberFont}>
              same whole-cent price, two totals
            </text>
            {[
              { l: labelA, v: totalA, cx: 130 },
              { l: labelB, v: totalB, cx: 250 },
            ].map((g) => (
              <motion.g key={g.l} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <text x={g.cx} y={100} textAnchor="middle" fontSize="20" fontWeight="900" fill={INK} fontFamily={numberFont}>
                  {g.v}
                  {unit}
                </text>
                <text x={g.cx} y={122} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                  {g.l}
                </text>
              </motion.g>
            ))}
          </>
        )}

        {phase === 1 && (
          <>
            <text x={130} y={50} textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={numberFont}>
              {totalA}
            </text>
            <text x={250} y={50} textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={numberFont}>
              {totalB}
            </text>
            {tilesRow(factorsA, 130, 90, 0.1)}
            {tilesRow(factorsB, 250, 90, 0.1)}
            <motion.text x={130} y={140} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + factorsA.length * 0.12 + 0.2 }}>
              {totalA} = {factorsA.join(" × ")}
            </motion.text>
            <motion.text x={250} y={140} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + factorsB.length * 0.12 + 0.2 }}>
              {totalB} = {factorsB.join(" × ")}
            </motion.text>
          </>
        )}

        {phase === 2 && (
          <>
            <circle cx={150} cy={130} r={85} fill={`${IND}10`} stroke={IND} strokeWidth={1.6} />
            <circle cx={260} cy={130} r={85} fill={`${TEAL}10`} stroke={TEAL} strokeWidth={1.6} />
            <text x={85} y={45} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={numberFont}>
              {totalA}
            </text>
            <text x={325} y={45} textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={numberFont}>
              {totalB}
            </text>
            {tilesRow(onlyA, 90, 130, 0)}
            {tilesRow(overlap, 205, 130, 0.2, WIN)}
            {tilesRow(onlyB, 325, 130, 0)}
            <text x={205} y={228} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={numberFont}>
              shared prime factor
            </text>
            <motion.text x={205} y={245} textAnchor="middle" fontSize="13" fontWeight="900" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              price = {price}{unit}
            </motion.text>
          </>
        )}

        {phase === 3 && (
          <>
            {[
              { l: labelA, total: totalA, count: countA, y: 90 },
              { l: labelB, total: totalB, count: countB, y: 150 },
            ].map((g) => (
              <motion.g key={g.l} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
                <text x={W / 2} y={g.y} textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={numberFont}>
                  {g.total} ÷ {price} = {g.count}
                </text>
                <text x={W / 2} y={g.y + 16} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                  {g.l} who bought a pencil
                </text>
              </motion.g>
            ))}
          </>
        )}

        {phase === 4 && (
          <>
            <motion.text
              x={W / 2}
              y={110}
              textAnchor="middle"
              fontSize="18"
              fontWeight="900"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {countB} − {countA} = <tspan fill={WIN}>{diff}</tspan>
            </motion.text>
            <text x={W / 2} y={132} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={failure ? BAD : DIM} fontFamily={numberFont}>
              {failure || `${labelB} more than ${labelA}`}
            </text>
          </>
        )}
      </svg>

      <AnimatePresence>
        {step >= lastStep && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
