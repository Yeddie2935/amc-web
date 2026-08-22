import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const PRIME_COLORS = ["#2563eb", "#f59e0b", "#7c3aed"];
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";

const sup = (n: number) =>
  String(n)
    .split("")
    .map((d) => SUP[Number(d)])
    .join("");

function factorize(n: number): { p: number; e: number }[] {
  const out: { p: number; e: number }[] = [];
  let m = Math.max(1, Math.round(n));
  for (let p = 2; p * p <= m; p += 1) {
    let e = 0;
    while (m % p === 0) {
      m /= p;
      e += 1;
    }
    if (e) out.push({ p, e });
  }
  if (m > 1) out.push({ p: m, e: 1 });
  return out;
}

/**
 * "How many divisors of n have more than k factors?" Testing all twelve
 * divisors one by one is the slow road; the picture is that a divisor of
 * 2020 = 2² x 5 x 101 is nothing but a **choice of exponents** — how many 2s,
 * how many 5s, how many 101s — so the divisors form a 3 x 2 x 2 box of cells,
 * drawn here as two panels of a grid.
 *
 * Every cell carries its prime factors as coloured tokens, and that turns the
 * question into a statement about colour: a divisor's own factor count is
 * (a+1)(b+1)(c+1), so the moment **two different primes** appear, two of those
 * brackets are at least 2 and the count is already at least 4. Only the cells
 * built from a single colour can fall short, and they sit exactly on the three
 * axes leading out of the corner cell 1 — so the answer is the whole box minus
 * one arm per prime.
 *
 * Nothing is asserted: the scene factorises n itself, generates every divisor,
 * counts each one's own divisors, applies the threshold, and then *checks*
 * whether the shortfall cells really are the single-prime ones before saying so.
 * Data: { n, moreThan }.
 */
export function DivisorLatticeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(2, Math.round(num(data.n, 2)));
  const moreThan = Math.max(0, Math.round(num(data.moreThan, 3)));

  const pf = factorize(n);
  const k = pf.length;
  const cols = (pf[0]?.e ?? 0) + 1;
  const rows = k > 1 ? (pf[1]?.e ?? 0) + 1 : 1;
  const panels = k > 2 ? (pf[2]?.e ?? 0) + 1 : 1;

  // every divisor is one choice of exponents, so walk the whole box
  type Cell = { a: number; b: number; c: number; value: number; d: number; solo: boolean };
  const cells: Cell[] = [];
  for (let c = 0; c < panels; c += 1) {
    for (let b = 0; b < rows; b += 1) {
      for (let a = 0; a < cols; a += 1) {
        const es = [a, b, c].slice(0, k);
        const value = es.reduce((acc, e, i) => acc * Math.pow(pf[i].p, e), 1);
        const d = es.reduce((acc, e) => acc * (e + 1), 1);
        cells.push({ a, b, c, value, d, solo: es.filter((e) => e > 0).length <= 1 });
      }
    }
  }
  const short = cells.filter((z) => z.d <= moreThan);
  const kept = cells.filter((z) => z.d > moreThan);
  // is "too few factors" really the same as "built from one prime here"?
  const soloRule = short.every((z) => z.solo) && cells.filter((z) => z.solo).every((z) => z.d <= moreThan);
  const matches = problem.shortAnswer == null || Number(problem.shortAnswer) === kept.length;
  const failure = !matches ? `check failed: the box gives ${kept.length}, the stored answer is ${problem.shortAnswer}` : "";

  const factorText = pf.map((f) => (f.e === 1 ? `${f.p}` : `${f.p}${sup(f.e)}`)).join(" × ");
  const choiceText = pf.map((f) => f.e + 1).join(" × ");

  const lastStep = totalSteps - 1;
  const isFinal = step >= lastStep;
  const boxed = isFinal || step >= 1;
  const judged = isFinal || step >= 2;

  // ---- geometry ----
  const W = 360;
  const H = 240;
  const cellW = 48;
  const cellH = 36;
  const gridW = cols * cellW;
  const gridH = rows * cellH;
  const gridTop = 74;
  const gap = 30;
  const panelX = (c: number) => (W - (panels * gridW + (panels - 1) * gap)) / 2 + c * (gridW + gap);
  const cx = (z: Cell) => panelX(z.c) + z.a * cellW;
  const cy = (z: Cell) => gridTop + z.b * cellH;

  // beat one: peel one prime off at a time
  const ladder: number[] = [];
  pf.forEach((f) => {
    for (let i = 0; i < f.e; i += 1) ladder.push(f.p);
  });
  const chain = [n];
  ladder.forEach((p) => chain.push(chain[chain.length - 1] / p));
  const ladderY = (i: number) => 46 + i * 26;

  const caption = isFinal
    ? `the whole box, minus one arm per prime: ${kept.length} left`
    : step === 0
    ? `divide primes out until 1 is left — ${ladder.length} of them, ${pf.length} different`
    : !judged
    ? `a divisor is just a choice of exponents: ${choiceText} = ${cells.length} of them`
    : `two different primes already means (≥2) × (≥2) = at least 4 factors`;

  const note = isFinal
    ? failure
      ? failure
      : `the ${kept.length} survivors have ${kept.map((z) => z.d).join(", ")} factors — every one over ${moreThan}`
    : step === 0
    ? `${ladder.length} primes in all, so the exponents are ${pf.map((f) => `${f.p}: 0–${f.e}`).join(", ")}`
    : !judged
    ? `every cell is ${pf.map((f) => f.p).join(" × ")} raised to its own row, column and panel`
    : soloRule
    ? `so only the ${short.length} single-colour cells can fall short: ${short.map((z) => `${z.value} has ${z.d}`).join(", ")}`
    : `checking each: ${short.map((z) => `${z.value} has ${z.d}`).join(", ")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {/* beat one: the division ladder that produces the factorisation */}
        <AnimatePresence>
          {!boxed && (
            <motion.g key="ladder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <line x1={168} x2={168} y1={36} y2={ladderY(chain.length - 1) + 8} stroke="#cbd5e1" strokeWidth={1.4} />
              {chain.map((v, i) => (
                <motion.g
                  key={`q${i}`}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.28 }}
                >
                  <text x={182} y={ladderY(i) + 4} fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    {v}
                  </text>
                </motion.g>
              ))}
              {ladder.map((p, i) => {
                const ci = pf.findIndex((f) => f.p === p);
                return (
                  <motion.g
                    key={`p${i}`}
                    initial={{ opacity: 0, x: 26 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.14 + i * 0.28 }}
                  >
                    <circle cx={148} cy={ladderY(i) + 9} r={5.4} fill={PRIME_COLORS[ci % PRIME_COLORS.length]} />
                    <text x={136} y={ladderY(i) + 13} textAnchor="end" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                      ÷ {p}
                    </text>
                  </motion.g>
                );
              })}
              <motion.g
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.3 + ladder.length * 0.28 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <text x={W / 2} y={ladderY(chain.length - 1) + 42} textAnchor="middle" fontSize="15" fontWeight="800" fill={IND} fontFamily={numberFont}>
                  {n} = {factorText}
                </text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the factorisation stays as a header once the box is up */}
        <AnimatePresence>
          {boxed && (
            <motion.g key="hdr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={W / 2} y={22} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                {n} = {factorText}
              </text>
              {pf.map((f, i) => (
                <g key={f.p}>
                  <circle cx={W / 2 - (pf.length * 46) / 2 + i * 46 + 10} cy={34} r={4} fill={PRIME_COLORS[i % PRIME_COLORS.length]} />
                  <text
                    x={W / 2 - (pf.length * 46) / 2 + i * 46 + 18}
                    y={38}
                    fontSize="9.5"
                    fontWeight="800"
                    fill="#64748b"
                    fontFamily={numberFont}
                  >
                    = {f.p}
                  </text>
                </g>
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the box of divisors: one cell per choice of exponents */}
        <AnimatePresence>
          {boxed && (
            <motion.g key="box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {Array.from({ length: panels }).map((_, c) => (
                <g key={`pt${c}`}>
                  {k > 2 && (
                    <text
                      x={panelX(c) + gridW / 2}
                      y={gridTop - 22}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="800"
                      fill={PRIME_COLORS[2 % PRIME_COLORS.length]}
                      fontFamily={numberFont}
                    >
                      × {pf[2].p}
                      {sup(c)}
                    </text>
                  )}
                  {Array.from({ length: cols }).map((__, a) => (
                    <text
                      key={a}
                      x={panelX(c) + a * cellW + cellW / 2}
                      y={gridTop - 6}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="700"
                      fill="#94a3b8"
                      fontFamily={numberFont}
                    >
                      {pf[0].p}
                      {sup(a)}
                    </text>
                  ))}
                  {k > 1 &&
                    Array.from({ length: rows }).map((__, b) => (
                      <text
                        key={b}
                        x={panelX(c) - 5}
                        y={gridTop + b * cellH + cellH / 2 + 3}
                        textAnchor="end"
                        fontSize="9"
                        fontWeight="700"
                        fill="#94a3b8"
                        fontFamily={numberFont}
                      >
                        {pf[1].p}
                        {sup(b)}
                      </text>
                    ))}
                </g>
              ))}

              {cells.map((z, i) => {
                const keep = z.d > moreThan;
                const fill = !judged ? "#f8fafc" : keep ? "#dcfce7" : "#fee2e2";
                const stroke = !judged ? "#cbd5e1" : keep ? "#86efac" : "#fca5a5";
                const tokens = ([z.a, z.b, z.c].slice(0, k) as number[]).flatMap((e, pi) =>
                  Array.from({ length: e }, () => PRIME_COLORS[pi % PRIME_COLORS.length]),
                );
                return (
                  <motion.g
                    key={`c${z.value}`}
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1, y: isFinal && keep ? -3 : 0 }}
                    transition={{ type: "spring", stiffness: 240, damping: 17, delay: i * 0.045 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <motion.rect
                      x={cx(z) + 1.5}
                      y={cy(z) + 1.5}
                      width={cellW - 3}
                      height={cellH - 3}
                      rx={4}
                      animate={{ fill, stroke }}
                      transition={{ duration: 0.35, delay: judged ? 0.5 + i * 0.03 : 0 }}
                      strokeWidth={1.2}
                    />
                    <text
                      x={cx(z) + cellW / 2}
                      y={cy(z) + 15}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight="800"
                      fill={INK}
                      fontFamily={numberFont}
                    >
                      {z.value}
                    </text>
                    {tokens.map((col, t) => (
                      <motion.circle
                        key={t}
                        cx={cx(z) + 8 + t * 6}
                        cy={cy(z) + 26}
                        r={2.4}
                        fill={col}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.35 + i * 0.045 + t * 0.03 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      />
                    ))}
                    {judged && (
                      <motion.g
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.55 + i * 0.03 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      >
                        <circle cx={cx(z) + cellW - 11} cy={cy(z) + 26} r={7.5} fill={keep ? WIN : BAD} />
                        <text
                          x={cx(z) + cellW - 11}
                          y={cy(z) + 29}
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="800"
                          fill="#fff"
                          fontFamily={numberFont}
                        >
                          {z.d}
                        </text>
                      </motion.g>
                    )}
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>

        {/* what the box is worth: the choice count, then the two verdicts */}
        <AnimatePresence>
          {boxed && !judged && (
            <motion.g key="choices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {pf.map((f, i) => (
                <motion.g
                  key={f.p}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.9 + i * 0.14 }}
                >
                  <circle cx={92} cy={gridTop + gridH + 18 + i * 18} r={4} fill={PRIME_COLORS[i % PRIME_COLORS.length]} />
                  <text
                    x={104}
                    y={gridTop + gridH + 22 + i * 18}
                    fontSize="11"
                    fontWeight="700"
                    fill={INK}
                    fontFamily={numberFont}
                  >
                    {Array.from({ length: f.e + 1 }, (__, e) => (e === 0 ? "0" : String(e))).join(", ")} of {f.p} — {f.e + 1} ways
                  </text>
                </motion.g>
              ))}
              <motion.text
                x={W / 2}
                y={gridTop + gridH + 28 + pf.length * 18}
                textAnchor="middle"
                fontSize="14"
                fontWeight="800"
                fill={IND}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 16, delay: 1.5 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {choiceText} = {cells.length} divisors
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {judged && (
            <motion.g key="verdict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.text
                x={W / 2}
                y={gridTop + gridH + 28}
                textAnchor="middle"
                fontSize={isFinal ? "16" : "12"}
                fontWeight="800"
                fill={isFinal ? WIN : "#92400e"}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 16, delay: isFinal ? 0.9 : 1.1 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {isFinal
                  ? `${cells.length} − ${short.length} = ${kept.length}`
                  : `${short.length} cells use a single prime, and all fall short`}
              </motion.text>
              {!isFinal && (
                <motion.text
                  x={W / 2}
                  y={gridTop + gridH + 54}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight="700"
                  fill={INK}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.35 }}
                >
                  {pf.map((f, i) => `${f.p}^${"abc"[i]}`).join(" × ")} has {pf.map((_, i) => `(${"abc"[i]}+1)`).join("")} factors
                </motion.text>
              )}
              {isFinal && (
                <motion.text
                  x={W / 2}
                  y={gridTop + gridH + 50}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#64748b"
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  the green cells: {kept.map((z) => z.value).join(", ")}
                </motion.text>
              )}
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
          color: isFinal ? "#166534" : judged ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : judged ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : judged ? "#fde68a" : "#c7d2fe"}`,
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
              color: isFinal && failure ? BAD : "#94a3b8",
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
