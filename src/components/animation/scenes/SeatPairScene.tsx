import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const SEAT = "#e2e8f0";
const TAKEN = "#94a3b8";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** A seated passenger: head and shoulders, so a full seat reads at a glance. */
function Person({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  return (
    <g>
      <circle cx={x} cy={y - r * 0.55} r={r * 0.42} fill={fill} />
      <path d={`M ${x - r * 0.8},${y + r * 0.7} a ${r * 0.8} ${r * 0.75} 0 0 1 ${r * 1.6} 0 Z`} fill={fill} />
    </g>
  );
}

/**
 * Seats in rows, some already taken, asking for the chance that two adjacent
 * seats remain free in some row. Complementary counting is the route, and the
 * bad arrangements factor **row by row**: within one row of s seats only a few
 * empty-sets avoid an adjacent pair, so each row offers a fixed small menu and
 * the arrangements with no pair anywhere are just those menus combined to the
 * right total. The scene enumerates every arrangement to get the counts, derives
 * the per-row menu the same way, and shows the case split that reaches the bad
 * total. Nothing here is asserted — the probability comes from the enumeration.
 * Data: { rows, seatsPerRow, passengers }.
 */
export function SeatPairScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const R = Math.max(1, Math.round(num(data.rows, 4)));
  const S = Math.max(2, Math.round(num(data.seatsPerRow, 3)));
  const seats = R * S;
  const taken = Math.max(0, Math.round(num(data.passengers, 8)));
  const empties = Math.max(0, seats - taken);

  // every way the empty seats could fall
  const combos: number[][] = [];
  const build = (start: number, cur: number[]) => {
    if (cur.length === empties) {
      combos.push([...cur]);
      return;
    }
    for (let i = start; i < seats; i++) {
      cur.push(i);
      build(i + 1, cur);
      cur.pop();
    }
  };
  if (seats <= 24 && empties <= seats) build(0, []);
  const hasPair = (set: number[]) => {
    const e = new Set(set);
    for (let r = 0; r < R; r++) for (let c = 0; c + 1 < S; c++) if (e.has(r * S + c) && e.has(r * S + c + 1)) return true;
    return false;
  };
  const total = combos.length;
  const good = combos.filter(hasPair).length;
  const bad = total - good;
  const g = gcd(good, total) || 1;

  // a row's menu: how many empty-sets of each size avoid an adjacent pair
  const rowSafe: number[] = [];
  for (let k = 0; k <= S; k++) {
    let c = 0;
    const pick = (start: number, cur: number[]) => {
      if (cur.length === k) {
        const e = new Set(cur);
        let okk = true;
        for (let i = 0; i + 1 < S; i++) if (e.has(i) && e.has(i + 1)) okk = false;
        if (okk) c++;
        return;
      }
      for (let i = start; i < S; i++) {
        cur.push(i);
        pick(i + 1, cur);
        cur.pop();
      }
    };
    pick(0, []);
    rowSafe.push(c);
  }

  // which per-row splits make up the bad total
  const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
  const cases: { parts: number[]; orders: number; per: number; sub: number }[] = [];
  const walk = (row: number, left: number, cur: number[]) => {
    if (row === R) {
      if (left !== 0) return;
      const sorted = [...cur].sort((a, b) => b - a);
      if (cur.join() !== sorted.join()) return; // one representative per multiset
      const counts: Record<number, number> = {};
      cur.forEach((v) => (counts[v] = (counts[v] ?? 0) + 1));
      const orders = fact(R) / Object.values(counts).reduce((a, b) => a * fact(b), 1);
      const per = cur.reduce((a, k) => a * rowSafe[k], 1);
      if (per > 0) cases.push({ parts: sorted, orders, per, sub: orders * per });
      return;
    }
    for (let k = 0; k <= Math.min(S, left); k++) walk(row + 1, left - k, [...cur, k]);
  };
  walk(0, empties, []);
  const caseSum = cases.reduce((a, c) => a + c.sub, 0);
  const consistent = caseSum === bad && good + bad === total;
  const probStr = `${good / g}/${total / g}`;
  const agrees = problem.shortAnswer == null || String(problem.shortAnswer).replace(/\s/g, "") === probStr;

  // one arrangement of each kind, chosen the same way every render
  const goodEg = combos.find(hasPair) ?? [];
  const spread = combos.find((s) => {
    if (hasPair(s)) return false;
    const per = Array(R).fill(0);
    s.forEach((i) => per[Math.floor(i / S)]++);
    return per.every((v) => v <= 1);
  });
  const badEg = spread ?? combos.find((s) => !hasPair(s)) ?? [];

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showMenu = !isFinal && step === 2;
  const shown = showMenu ? badEg : goodEg;
  const emptySet = new Set(shown);

  // the adjacent pair the couple takes
  let pair: [number, number] | null = null;
  for (let r = 0; r < R && !pair; r++)
    for (let c = 0; c + 1 < S && !pair; c++)
      if (emptySet.has(r * S + c) && emptySet.has(r * S + c + 1)) pair = [r * S + c, r * S + c + 1];

  // ---- geometry ----
  const W = 340;
  const H = 200;
  const sz = 30;
  const gap = 6;
  const gx = 22;
  const gy = (H - (R * (sz + gap) - gap)) / 2;
  const SX = (i: number) => gx + (i % S) * (sz + gap);
  const SY = (i: number) => gy + Math.floor(i / S) * (sz + gap);
  const panelX = gx + S * (sz + gap) + 14;

  const caption = isFinal
    ? `${good} of the ${total} seatings work — ${probStr}`
    : step === 0
    ? `${taken} seated, ${empties} seats free — the couple needs two side by side`
    : step === 1
    ? `${empties} empty seats among ${seats}: C(${seats},${empties}) = ${total} ways`
    : `one row may hold 0, 1, or only its two outer seats empty — never all ${S}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the cabin */}
        {Array.from({ length: seats }).map((_, i) => {
          const free = emptySet.has(i);
          const isPair = isFinal && pair != null && (pair[0] === i || pair[1] === i);
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: i * 0.025 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect
                x={SX(i)}
                y={SY(i)}
                width={sz}
                height={sz}
                rx={7}
                fill={isPair ? "#dcfce7" : free ? "#fff" : SEAT}
                stroke={isPair ? WIN : INK}
                strokeWidth={isPair ? 2.4 : 1.3}
              />
              {!free && <Person x={SX(i) + sz / 2} y={SY(i) + sz / 2 + 3} r={9} fill={TAKEN} />}
              <AnimatePresence>
                {isPair && (
                  <motion.g
                    key="c"
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 15, delay: 0.7 + (pair![0] === i ? 0 : 0.15) }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <Person x={SX(i) + sz / 2} y={SY(i) + sz / 2 + 3} r={9} fill={WIN} />
                  </motion.g>
                )}
              </AnimatePresence>
            </motion.g>
          );
        })}

        {/* the adjacent free pair the couple can use */}
        <AnimatePresence>
          {step === 0 && !isFinal && pair && (
            <motion.rect
              key="rg"
              x={SX(pair[0]) - 3}
              y={SY(pair[0]) - 3}
              width={2 * sz + gap + 6}
              height={sz + 6}
              rx={9}
              fill="none"
              stroke={WIN}
              strokeWidth={2.4}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.6 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          )}
        </AnimatePresence>

        {/* the counting, one beat at a time */}
        {step === 0 && !isFinal && (
          <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
            <text x={panelX} y={gy + 22} fontSize="10.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              two free seats
            </text>
            <text x={panelX} y={gy + 36} fontSize="10.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              side by side ✓
            </text>
            <text x={panelX} y={gy + 60} fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
              but it depends
            </text>
            <text x={panelX} y={gy + 74} fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
              where the gaps fall
            </text>
          </motion.g>
        )}

        <AnimatePresence>
          {step === 1 && !isFinal && (
            <motion.g key="tot" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <text x={panelX} y={gy + 24} fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
                choose the {empties}
              </text>
              <text x={panelX} y={gy + 38} fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
                empty seats:
              </text>
              <text x={panelX} y={gy + 62} fontSize="15" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                {total}
              </text>
              <text x={panelX} y={gy + 88} fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                easier to count the
              </text>
              <text x={panelX} y={gy + 102} fontSize="9.5" fontWeight="700" fill={BAD} fontFamily={numberFont}>
                ones that fail
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* what a single row is allowed to look like */}
        <AnimatePresence>
          {showMenu && (
            <motion.g key="menu" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              {[
                { pat: [0, 0, 0], ok: true, note: `${rowSafe[0]}` },
                { pat: [1, 0, 0], ok: true, note: `${rowSafe[1]}` },
                { pat: [1, 0, 1], ok: true, note: `${rowSafe[2]}` },
                { pat: [1, 1, 0], ok: false, note: "" },
              ].map((row, i) => (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.2 + i * 0.15 }}
                >
                  {row.pat.slice(0, S).map((v, j) => (
                    <rect
                      key={j}
                      x={panelX + j * 15}
                      y={gy + 12 + i * 26}
                      width={12}
                      height={12}
                      rx={3}
                      fill={v ? "#fff" : TAKEN}
                      stroke={row.ok ? INK : BAD}
                      strokeWidth={1.2}
                    />
                  ))}
                  <text
                    x={panelX + 52}
                    y={gy + 22 + i * 26}
                    fontSize="9.5"
                    fontWeight="800"
                    fill={row.ok ? MARK : BAD}
                    fontFamily={numberFont}
                  >
                    {row.ok ? `${row.note} way${row.note === "1" ? "" : "s"}` : "adjacent ✗"}
                  </text>
                </motion.g>
              ))}
              <motion.text
                x={panelX}
                y={gy + 126}
                fontSize="10.5"
                fontWeight="800"
                fill={INK}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                menu: {rowSafe.join(", ")}
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the case split that adds up to the failures */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="cases" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
              {cases.map((c, i) => (
                <motion.g
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.15 }}
                >
                  <text x={panelX} y={gy + 12 + i * 16} fontSize="9" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                    {c.parts.join("+")}
                  </text>
                  <text x={panelX + 50} y={gy + 12 + i * 16} fontSize="9" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                    {c.orders}×{c.per}
                  </text>
                  <text x={W - 10} y={gy + 12 + i * 16} textAnchor="end" fontSize="9.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                    {c.sub}
                  </text>
                </motion.g>
              ))}
              <line x1={panelX} y1={gy + 18 + cases.length * 16} x2={W - 10} y2={gy + 18 + cases.length * 16} stroke="#cbd5e1" strokeWidth={1.2} />
              <text x={panelX} y={gy + 32 + cases.length * 16} fontSize="9.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                fail
              </text>
              <text x={W - 10} y={gy + 32 + cases.length * 16} textAnchor="end" fontSize="11" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                {bad}
              </text>
              <text x={panelX} y={gy + 50 + cases.length * 16} fontSize="9.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                work
              </text>
              <text x={W - 10} y={gy + 50 + cases.length * 16} textAnchor="end" fontSize="11" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {good}
              </text>
              <motion.text
                x={panelX}
                y={gy + 76 + cases.length * 16}
                fontSize="14"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.9 }}
                style={{ transformBox: "fill-box", transformOrigin: "left" }}
              >
                {probStr}
              </motion.text>
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
          color: isFinal ? "#166534" : showMenu ? "#991b1b" : "#4338ca",
          background: isFinal ? "#dcfce7" : showMenu ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showMenu ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {showMenu && (
          <motion.span
            key="nb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            so each row offers {rowSafe.filter((v) => v > 0).join(", ")} — never all {S} empty
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
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && consistent ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees && consistent
              ? `checked all ${total} seatings: ${good} work, ${bad} do not`
              : `the cases add to ${caseSum}, the enumeration says ${bad}`}
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
