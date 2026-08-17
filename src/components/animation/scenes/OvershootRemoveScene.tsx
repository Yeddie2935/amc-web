import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const HUE = ["#0891b2", "#4338ca", "#b45309", "#be185d"];
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const W = 340;
const H = 212;
const SX = 34;
const PITCH = 14;
const SW = 11;
const SH = 20;

const com = (n: number) => n.toLocaleString("en-US");

/**
 * A hoard of items with fixed values and fixed stocks, asking for the **most**
 * items that come to an exact total. Reaching for the total by adding cheap
 * items first is guesswork; the move is to notice that taking *everything*
 * overshoots, which flips the question into "**remove the fewest items that shed
 * exactly the overshoot**" — and there the expensive items are the efficient
 * ones, because each removes the most value per item taken away. The beats lay
 * the whole hoard out with its total counting up, name the overshoot, lift the
 * removal off one item at a time while the total ticks down, then rule out every
 * smaller removal so the minimum is proved rather than assumed. A bounded DP
 * finds the fewest items summing to the overshoot and every set that achieves
 * it, so the scene can say whether the optimum is unique; the survivors' value is
 * re-added as a check. Data: { kinds: ["5|nickel|20", ...], target, unit? }.
 */
export function OvershootRemoveScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const itemWord = data.itemWord != null ? String(data.itemWord) : "stamps";
  const kinds = (Array.isArray(data.kinds) ? data.kinds : [])
    .map(String)
    .map((s) => s.split("|").map((p) => p.trim()))
    .filter((p) => p.length >= 3 && +p[0] > 0 && +p[2] > 0)
    .map((p) => ({ v: +p[0], label: p[1], stock: Math.round(+p[2]) }));
  const target = num(data.target, 0);
  const unit = data.unit != null ? String(data.unit) : "¢";
  if (kinds.length < 2 || target <= 0) return null;

  const stamps = kinds.reduce((s, k) => s + k.stock, 0);
  const full = kinds.reduce((s, k) => s + k.v * k.stock, 0);
  const over = full - target;

  // fewest items summing to exactly the overshoot, respecting stocks
  const INF = 1e9;
  let dp = Array<number>(over + 1).fill(INF);
  dp[0] = 0;
  for (const k of kinds) {
    const next = dp.slice();
    for (let c = 1; c <= k.stock; c++)
      for (let v = c * k.v; v <= over; v++) if (dp[v - c * k.v] + c < next[v]) next[v] = dp[v - c * k.v] + c;
    dp = next;
  }
  const best = dp[over];
  const feasible = best < INF;

  // which items to take off, and whether the choice is forced
  const removals: number[][] = [];
  const walk = (i: number, left: number, cur: number[]) => {
    if (removals.length > 40) return;
    if (left === 0) {
      if (cur.reduce((a, b) => a + b, 0) === best) removals.push([...cur]);
      return;
    }
    if (i >= kinds.length || cur.reduce((a, b) => a + b, 0) >= best) return;
    for (let c = Math.min(kinds[i].stock, Math.floor(left / kinds[i].v)); c >= 0; c--) {
      cur.push(c);
      walk(i + 1, left - c * kinds[i].v, cur);
      cur.pop();
    }
  };
  if (feasible) walk(0, over, []);
  const take = removals[0] ?? kinds.map(() => 0);
  const unique = removals.length === 1;

  // can any smaller number shed it? unbounded reachability is a superset,
  // so an "impossible" here is impossible with the real stocks too
  const reach: boolean[][] = Array.from({ length: best + 1 }, () => Array(over + 1).fill(false));
  reach[0][0] = true;
  for (let n = 1; n <= best; n++)
    for (let v = 1; v <= over; v++)
      reach[n][v] = kinds.some((k) => v >= k.v && reach[n - 1][v - k.v]);
  const smaller = Array.from({ length: Math.max(0, best - 1) }, (_, i) => i + 1).filter((n) => reach[n][over]);

  const left = kinds.map((k, i) => k.stock - take[i]);
  const kept = stamps - best;
  const value = kinds.reduce((s, k, i) => s + k.v * left[i], 0);
  const agrees = feasible && value === target && (problem.shortAnswer == null || Number(problem.shortAnswer) === kept);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const pulled = isFinal || step >= 2;

  const rowY = (i: number) => 28 + i * 38;
  const stampX = (j: number) => SX + j * PITCH;
  const goneIn = (i: number, j: number) => j >= kinds[i].stock - take[i];

  const caption = isFinal
    ? `${stamps} − ${best} = ${kept} ${itemWord}`
    : step === 0
    ? `all ${stamps} come to ${com(full)}${unit} — ${com(over)}${unit} too much`
    : step === 1
    ? `so take off the fewest worth exactly ${com(over)}${unit}`
    : `${best} of them do it: ${kinds
        .map((k, i) => (take[i] ? `${take[i]}×${k.v}` : ""))
        .filter(Boolean)
        .reverse()
        .join(" + ")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {kinds.map((k, i) => (
          <g key={k.label}>
            <text x={8} y={rowY(i) - 5} fontSize="8.5" fontWeight="800" fill={HUE[i % HUE.length]} fontFamily={numberFont}>
              {k.v}{unit} × {pulled ? left[i] : k.stock} = {com(k.v * (pulled ? left[i] : k.stock))}
            </text>
            {Array.from({ length: k.stock }).map((_, j) => {
              const gone = pulled && goneIn(i, j);
              return (
                <motion.g
                  key={j}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: gone ? 0.22 : 1, y: gone ? -14 : 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18, delay: gone ? 0.3 + (k.stock - j) * 0.18 : 0.1 + i * 0.12 + j * 0.02 }}
                >
                  <rect
                    x={stampX(j)}
                    y={rowY(i)}
                    width={SW}
                    height={SH}
                    rx={2}
                    fill={gone ? "#fff" : "#fff"}
                    stroke={gone ? BAD : HUE[i % HUE.length]}
                    strokeWidth={gone ? 1.4 : 1.2}
                    strokeDasharray={gone ? "2 2" : undefined}
                  />
                  <rect x={stampX(j) + 2} y={rowY(i) + 2} width={SW - 4} height={SH - 4} fill={gone ? "#fee2e2" : HUE[i % HUE.length]} opacity={gone ? 1 : 0.18} />
                  <text x={stampX(j) + SW / 2} y={rowY(i) + SH / 2 + 3} textAnchor="middle" fontSize="6.5" fontWeight="800" fill={gone ? BAD : HUE[i % HUE.length]} fontFamily={numberFont}>
                    {k.v}
                  </text>
                </motion.g>
              );
            })}
          </g>
        ))}

        {/* the running total */}
        <motion.text
          key={`tot-${pulled}`}
          x={8}
          y={152}
          fontSize="14"
          fontWeight="800"
          fill={pulled ? WIN : BAD}
          fontFamily={numberFont}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 15, delay: pulled ? 1.4 : 0.7 }}
          style={{ transformBox: "fill-box", transformOrigin: "left center" }}
        >
          {pulled ? `${com(value)}${unit} ✓` : `${com(full)}${unit}`}
        </motion.text>

        <AnimatePresence>
          {!pulled && (
            <motion.g key="over" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 1 }}>
              <text x={58} y={152} fontSize="12.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                − {com(over)}{unit} → {com(target)}{unit}
              </text>
              {step >= 1 && (
                <motion.text x={8} y={176} fontSize="11.5" fontWeight="800" fill={MARK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  removing a {kinds[kinds.length - 1].label} sheds the most per stamp
                </motion.text>
              )}
              {step >= 1 && (
                <motion.text x={8} y={196} fontSize="11.5" fontWeight="700" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  every stamp taken off is one fewer in the answer
                </motion.text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {pulled && !isFinal && (
            <motion.g key="mid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
              <text x={8} y={176} fontSize="11.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                {best} stamps gone, worth {com(over)}{unit} altogether
              </text>
              <text x={8} y={196} fontSize="11.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                but could {best - 1} have managed it?
              </text>
            </motion.g>
          )}
          {isFinal && (
            <motion.g key="fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.text x={8} y={176} fontSize="11.5" fontWeight="800" fill={BAD} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                {smaller.length === 0 ? `no ${best - 1} stamps or fewer can make ${com(over)}${unit}` : `${smaller.join(", ")} stamps can also make ${com(over)}${unit}`}
              </motion.text>
              <motion.text
                x={8}
                y={200}
                fontSize="17"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1 }}
                style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              >
                {stamps} − {best} = {kept}
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
            transition={{ delay: 1.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {!feasible
              ? `no set of stamps sheds exactly ${com(over)}${unit}`
              : agrees
              ? `${kinds.map((k, i) => `${left[i]}×${k.v}`).join(" + ")} = ${com(value)}${unit}${unique ? ", and that removal is the only one" : ""}`
              : `this leaves ${com(value)}${unit}, not the target`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
