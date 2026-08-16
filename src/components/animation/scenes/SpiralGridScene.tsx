import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const LINE = "#94a3b8";
const SHADE = "#cbd5e1";
const TRAIL = "#a5b4fc";
const WIN = "#16a34a";
const BAD = "#dc2626";

const W = 340;
const H = 210;
const CELL = 25;
const GX = 16;
const GY = 18;

const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};

/** Trial divisors actually needed: the primes up to sqrt(n), and the first that hits. */
function trial(n: number) {
  const tried: number[] = [];
  for (let d = 2; d * d <= n; d++) {
    if (!isPrime(d)) continue; // if 2 misses then 4 cannot hit, so only primes are worth trying
    tried.push(d);
    if (n % d === 0) return { tried, factor: d, cofactor: n / d };
  }
  return { tried, factor: null as number | null, cofactor: 0 };
}

/**
 * Numbers laid out in a square spiral from the centre, with a few squares
 * shaded, asking how many shaded values are prime. The scene **walks the spiral
 * itself** — east 1, north 1, west 2, south 2, east 3, … — so every number in
 * the grid is generated rather than asserted, and the shaded cells simply report
 * whatever the walk put there. The beats build the grid along a self-drawing
 * trail, lift the shaded values out into a column, then **trial-divide each one**
 * with a chip per divisor tested, so the composite is caught by a divisor you
 * can see rather than by assertion. The last beat colours the shaded squares
 * back on the grid, green for prime and red for the one that factored.
 * Data: { size, marked: [r,c, r,c, ...] }.
 */
export function SpiralGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(3, Math.round(num(data.size, 7)));
  const flat = (Array.isArray(data.marked) ? data.marked : []).map(Number);

  // walk the spiral: run lengths 1,1,2,2,3,3,... turning E -> N -> W -> S
  const grid: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const order: [number, number][] = [];
  {
    const dirs = [
      [0, 1],
      [-1, 0],
      [0, -1],
      [1, 0],
    ];
    let r = (n - 1) >> 1;
    let c = (n - 1) >> 1;
    let count = 1;
    let run = 1;
    let d = 0;
    grid[r][c] = 1;
    order.push([r, c]);
    while (count < n * n) {
      for (let rep = 0; rep < 2 && count < n * n; rep++) {
        for (let s = 0; s < run && count < n * n; s++) {
          r += dirs[d][0];
          c += dirs[d][1];
          if (r < 0 || r >= n || c < 0 || c >= n) break;
          grid[r][c] = ++count;
          order.push([r, c]);
        }
        d = (d + 1) % 4;
      }
      run++;
    }
  }

  const marked: { r: number; c: number; v: number }[] = [];
  for (let i = 0; i + 1 < flat.length; i += 2) {
    const r = flat[i];
    const c = flat[i + 1];
    if (r >= 0 && r < n && c >= 0 && c < n) marked.push({ r, c, v: grid[r][c] });
  }
  if (!marked.length) return null;

  const tests = marked.map((m) => ({ ...m, ...trial(m.v), prime: isPrime(m.v) }));
  const primes = tests.filter((t) => t.prime).length;
  const agrees = problem.shortAnswer == null || Number(problem.shortAnswer) === primes;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showValues = isFinal || step >= 1;
  const showTests = isFinal || step >= 2;

  const cx = (c: number) => GX + c * CELL + CELL / 2;
  const cy = (r: number) => GY + r * CELL + CELL / 2;
  const trailD = order.map(([r, c], i) => `${i ? "L" : "M"} ${cx(c)} ${cy(r)}`).join(" ");

  const panelX = 200;
  const rowY = (i: number) => 46 + i * 30;

  const caption = isFinal
    ? `${primes} of the ${marked.length} shaded squares hold a prime`
    : step === 0
    ? `1 in the middle, then spiral outward to ${n * n}`
    : step === 1
    ? `the shaded squares hold ${marked.map((m) => m.v).join(", ")}`
    : tests.some((t) => t.factor)
    ? `only ${tests.filter((t) => t.factor).map((t) => t.v).join(" and ")} splits up`
    : "none of them splits up";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* cells */}
        {grid.map((row, r) =>
          row.map((v, c) => {
            const hit = tests.find((t) => t.r === r && t.c === c);
            const fill = hit ? (isFinal ? (hit.prime ? "#dcfce7" : "#fee2e2") : SHADE) : "#fff";
            const edge = hit && isFinal ? (hit.prime ? WIN : BAD) : LINE;
            return (
              <motion.rect
                key={`${r}-${c}`}
                x={GX + c * CELL}
                y={GY + r * CELL}
                width={CELL}
                height={CELL}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, fill, stroke: edge }}
                strokeWidth={hit && isFinal ? 1.8 : 0.8}
                transition={{ duration: 0.2, delay: (v - 1) * 0.016 }}
              />
            );
          })
        )}

        {/* the spiral trail */}
        <motion.path
          d={trailD}
          fill="none"
          stroke={TRAIL}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1 }}
        />

        {/* the numbers */}
        {grid.map((row, r) =>
          row.map((v, c) => (
            <motion.g
              key={`t${r}-${c}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: (v - 1) * 0.016 }}
            >
              <rect
                x={cx(c) - 9}
                y={cy(r) - 7}
                width={18}
                height={14}
                rx={3}
                fill={tests.some((t) => t.r === r && t.c === c) ? (isFinal ? (isPrime(v) ? "#dcfce7" : "#fee2e2") : SHADE) : "#fff"}
              />
            <text
              x={cx(c)}
              y={cy(r) + 3.5}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight={tests.some((t) => t.r === r && t.c === c) ? 800 : 600}
              fill={INK}
              fontFamily={numberFont}
            >
              {v}
            </text>
            </motion.g>
          ))
        )}

        {/* outer border */}
        <rect x={GX} y={GY} width={n * CELL} height={n * CELL} fill="none" stroke={INK} strokeWidth={1.6} />

        {/* the shaded values, lifted out and tested */}
        <AnimatePresence>
          {showValues && (
            <motion.g key="panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {tests.map((t, i) => (
                <motion.g
                  key={t.v}
                  initial={{ x: GX + t.c * CELL - panelX, y: GY + t.r * CELL - rowY(i) + 12 }}
                  animate={{ x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.15 + i * 0.12 }}
                >
                  <rect
                    x={panelX}
                    y={rowY(i) - 12}
                    width={32}
                    height={22}
                    rx={5}
                    fill={isFinal ? (t.prime ? "#dcfce7" : "#fee2e2") : SHADE}
                    stroke={isFinal ? (t.prime ? WIN : BAD) : LINE}
                    strokeWidth={1.2}
                  />
                  <text x={panelX + 16} y={rowY(i) + 3} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    {t.v}
                  </text>
                </motion.g>
              ))}

              {showTests &&
                tests.map((t, i) =>
                  t.factor ? (
                    <motion.text
                      key={`f${t.v}`}
                      x={panelX + 40}
                      y={rowY(i) + 3}
                      fontSize="10.5"
                      fontWeight="800"
                      fill={BAD}
                      fontFamily={numberFont}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.7 + i * 0.25 }}
                      style={{ transformBox: "fill-box", transformOrigin: "left center" }}
                    >
                      = {t.factor} × {t.cofactor}
                    </motion.text>
                  ) : (
                    <motion.g key={`d${t.v}`}>
                      {t.tried.map((d, j) => (
                        <motion.g
                          key={d}
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.7 + i * 0.25 + j * 0.12 }}
                          style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        >
                          <rect x={panelX + 40 + j * 24} y={rowY(i) - 10} width={20} height={18} rx={4} fill="#f1f5f9" stroke={LINE} strokeWidth={0.8} />
                          <text x={panelX + 50 + j * 24} y={rowY(i) + 3} textAnchor="middle" fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                            ∤{d}
                          </text>
                        </motion.g>
                      ))}
                    </motion.g>
                  )
                )}

              {isFinal &&
                tests.map((t, i) => (
                  <motion.text
                    key={`v${t.v}`}
                    x={W - 12}
                    y={rowY(i) + 4}
                    textAnchor="end"
                    fontSize="13"
                    fontWeight="800"
                    fill={t.prime ? WIN : BAD}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 15, delay: 1.1 + i * 0.15 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {t.prime ? "✓" : "✗"}
                  </motion.text>
                ))}
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isFinal && (
            <motion.text
              key="sum"
              x={panelX}
              y={182}
              fontSize="13"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.8 }}
              style={{ transformBox: "fill-box", transformOrigin: "left center" }}
            >
              {primes} prime
            </motion.text>
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
            transition={{ delay: 2 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees
              ? `walked the spiral to ${n * n}, then trial-divided each shaded value`
              : `the spiral gives ${marked.map((m) => m.v).join(", ")} — ${primes} prime, not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
