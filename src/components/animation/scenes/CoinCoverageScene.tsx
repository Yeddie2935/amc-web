import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

type Coin = { name: string; value: number; count: number; color: string };

const COLORS: Record<string, string> = { penny: "#b45309", nickel: "#94a3b8", dime: "#0d9488", quarter: "#4338ca" };

function parseCoins(raw: unknown[]): Coin[] {
  return raw.map((r) => {
    const [name, value, count] = String(r).split("|");
    return { name: name ?? "coin", value: Number(value), count: Math.round(Number(count)), color: COLORS[name] ?? DIM };
  });
}

/** Flatten a coin-kind list into individual coin values, e.g. [{dime,2}] -> [10,10]. */
function flatten(coins: Coin[]): number[] {
  return coins.flatMap((c) => Array.from({ length: c.count }, () => c.value));
}

/** Every amount 1..limit that some subset of `values` can make exactly. */
function reachable(values: number[], limit: number): boolean[] {
  const ok = new Array(limit + 1).fill(false);
  ok[0] = true;
  for (const v of values) {
    for (let t = limit; t >= v; t--) if (ok[t - v]) ok[t] = true;
  }
  return ok;
}

/** One subset of `values` (with original indices) that sums to `target`, or null. */
/** The fewest-coin subset of `values` summing to `target` (a real demo shouldn't hand back a wasteful combo). */
function findSubset(values: number[], target: number): number[] | null {
  const n = values.length;
  let best: number[] | null = null;
  for (let mask = 1; mask < 1 << n; mask++) {
    let sum = 0;
    const idx: number[] = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        sum += values[i];
        idx.push(i);
      }
    }
    if (sum === target && (best == null || idx.length < best.length)) best = idx;
  }
  return best;
}

const money = (c: number) => `${c}¢`;

/**
 * A fixed purse of pennies, nickels, dimes and quarters, asked for the
 * smallest set that can pay any amount from 1 to 99 cents. The real trap is
 * a purse that looks generous — a handful of dimes and quarters — but is
 * missing pennies: without at least 4 of them, amounts like 2, 3, and 4
 * cents simply can't be made, no matter how much total value sits in the
 * purse. The scene tests that trap purse directly (a real subset-sum
 * search, not an assertion) before building the real 10-coin purse and
 * spot-checking a few amounts across the full 1–99 range.
 *
 * data: { coins: ["penny|1|4","nickel|5|1","dime|10|2","quarter|25|3"],
 *         trapCoins: ["penny|1|1","nickel|5|1","dime|10|2","quarter|25|2"] }
 */
export function CoinCoverageScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const coins = parseCoins(Array.isArray(data.coins) ? data.coins : []);
  const trapCoins = parseCoins(Array.isArray(data.trapCoins) ? data.trapCoins : []);

  const totalCoins = coins.reduce((a, c) => a + c.count, 0);
  const values = flatten(coins);
  const ok99 = reachable(values, 99);
  const fullyCovers = ok99.slice(1).every(Boolean);
  const ok = String(totalCoins) === (problem.shortAnswer ?? "").trim() && fullyCovers;

  const trapValues = flatten(trapCoins);
  const trapTotal = trapCoins.reduce((a, c) => a + c.count, 0);
  const trapOk = reachable(trapValues, 9);
  const trapMisses = [2, 3, 4].filter((v) => !trapOk[v]);
  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === trapTotal && String(c.label) !== problem.answer
  );

  const pennyKind = coins.find((c) => c.name === "penny");
  const nickelKind = coins.find((c) => c.name === "nickel");
  const dimeKind = coins.find((c) => c.name === "dime");
  const quarterKind = coins.find((c) => c.name === "quarter");

  const demoTargets = [39, 67, 94].filter((t) => t <= 99);
  const demoIdx = demoTargets.map((t) => findSubset(values, t));

  // ---- beats: 0 setup, 1 ones-digit coins, 2 the trap, 3 tens coverage demo, 4 tally, 5 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  const W = 380;
  const H = 300;

  const caption =
    beat === 0
      ? `pay any amount from 1¢ to 99¢`
      : beat === 1
      ? `${pennyKind?.count} pennies + ${nickelKind?.count} nickel make 0–9¢`
      : beat === 2
      ? `only ${trapCoins.find((c) => c.name === "penny")?.count} penny — can't make ${trapMisses.map(money).join(", ")}`
      : beat === 3
      ? `dimes and quarters reach into the 10s, 20s, ... 90s`
      : beat === 4
      ? `${pennyKind?.count}+${nickelKind?.count}+${dimeKind?.count}+${quarterKind?.count} = ${totalCoins} coins`
      : `${totalCoins} coins cover every amount from 1¢ to 99¢`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        {/* beat 0: the whole purse, coin kinds as labeled stacks */}
        {beat === 0 && (
          <g>
            {coins.map((c, i) => (
              <motion.g key={c.name} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: i * 0.15 }}>
                <CoinIcon cx={70 + i * 80} cy={90} r={26} color={c.color} label={money(c.value)} />
                <text x={70 + i * 80} y={140} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={INK} fontFamily={FONT}>
                  {c.name}
                </text>
              </motion.g>
            ))}
          </g>
        )}

        {/* beat 1: pennies + nickel, digits 0-9 reachable */}
        {beat === 1 && (
          <g>
            {Array.from({ length: pennyKind?.count ?? 0 }).map((_, i) => (
              <motion.g key={`p${i}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.1 }}>
                <CoinIcon cx={60 + i * 46} cy={60} r={18} color={COLORS.penny} label="1¢" />
              </motion.g>
            ))}
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.5 }}>
              <CoinIcon cx={60 + (pennyKind?.count ?? 0) * 46} cy={60} r={18} color={COLORS.nickel} label="5¢" />
            </motion.g>
            {Array.from({ length: 10 }).map((_, v) => (
              <motion.g key={`d${v}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.8 + v * 0.08 }}>
                <rect x={20 + v * 33} y={130} width={28} height={24} rx={5} fill="#dcfce7" stroke={WIN} strokeWidth={1.4} />
                <text x={34 + v * 33} y={146} textAnchor="middle" fontSize="10" fontWeight="800" fill="#166534" fontFamily={FONT}>
                  {v}¢
                </text>
              </motion.g>
            ))}
          </g>
        )}

        {/* beat 2: the trap purse, missing pennies */}
        {beat === 2 && (
          <g>
            {trapCoins.flatMap((c, ci) =>
              Array.from({ length: c.count }).map((_, i) => {
                const idx = trapCoins.slice(0, ci).reduce((a, x) => a + x.count, 0) + i;
                return (
                  <motion.g key={`t${idx}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: idx * 0.1 }}>
                    <CoinIcon cx={40 + idx * 52} cy={60} r={20} color={c.color} label={money(c.value)} />
                  </motion.g>
                );
              })
            )}
            {[2, 3, 4].map((v, i) => (
              <motion.g key={v} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.8 + i * 0.15 }}>
                <rect x={100 + i * 60} y={130} width={40} height={30} rx={7} fill="#fee2e2" stroke={BAD} strokeWidth={1.6} />
                <text x={120 + i * 60} y={150} textAnchor="middle" fontSize="12" fontWeight="800" fill={BAD} fontFamily={FONT}>
                  {v}¢ ✗
                </text>
              </motion.g>
            ))}
          </g>
        )}

        {/* beat 3: dimes + quarters, three demo targets across the range — pitch shrinks so any combo fits */}
        {beat === 3 && (
          <g>
            {demoTargets.map((t, ti) => {
              const combo = demoIdx[ti] ?? [];
              const y = 50 + ti * 80;
              const rowW = 300;
              const pitch = Math.min(40, rowW / Math.max(1, combo.length));
              const r = Math.min(16, pitch / 2 - 2);
              return (
                <motion.g key={t} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: ti * 0.3 }}>
                  <text x={20} y={y + 4} fontSize="12" fontWeight="800" fill={INK} fontFamily={FONT}>
                    {money(t)}
                  </text>
                  {combo.map((vi, k) => (
                    <motion.g key={k} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: ti * 0.3 + 0.3 + k * 0.1 }}>
                      <CoinIcon cx={70 + k * pitch} cy={y} r={r} color={values[vi] === 1 ? COLORS.penny : values[vi] === 5 ? COLORS.nickel : values[vi] === 10 ? COLORS.dime : COLORS.quarter} label={money(values[vi])} />
                    </motion.g>
                  ))}
                </motion.g>
              );
            })}
          </g>
        )}

        {/* beat 4: the tally */}
        {beat === 4 && (
          <g>
            {coins.map((c, i) => (
              <motion.g key={c.name} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: i * 0.15 }}>
                <CoinIcon cx={60 + i * 74} cy={70} r={24} color={c.color} label={money(c.value)} />
                <text x={60 + i * 74} y={116} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={FONT}>
                  × {c.count}
                </text>
              </motion.g>
            ))}
            <motion.text x={W / 2} y={170} textAnchor="middle" fontSize="16" fontWeight="800" fill={IND} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.8 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              {coins.map((c) => c.count).join(" + ")} = {totalCoins}
            </motion.text>
          </g>
        )}

        {/* beat 5: the full purse, settled */}
        {beat === 5 && (
          <g>
            {coins.map((c, i) => (
              <g key={c.name}>
                <CoinIcon cx={60 + i * 74} cy={70} r={24} color={c.color} label={money(c.value)} />
                <text x={60 + i * 74} y={116} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={FONT}>
                  × {c.count}
                </text>
              </g>
            ))}
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.4 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={W / 2 - 70} y={150} width={140} height={34} rx={9} fill="#dcfce7" stroke={WIN} strokeWidth={1.8} />
              <text x={W / 2} y={172} textAnchor="middle" fontSize="15" fontWeight="800" fill="#166534" fontFamily={FONT}>
                {totalCoins} coins
              </text>
            </motion.g>
          </g>
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : beat === 2 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 2 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 2 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 2 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 270 }}>
            {trapChoice ? `choice ${trapChoice.label} (${trapTotal}) has plenty of value but too few pennies` : `total value isn't the point — every amount needs to be exactly makeable`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {!fullyCovers ? `check failed: this purse can't make every amount from 1¢ to 99¢` : `check failed: ${totalCoins} coins but stored answer reads "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A round coin with its value printed on the face. */
function CoinIcon({ cx, cy, r, color, label }: { cx: number; cy: number; r: number; color: string; label: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} stroke="#fff" strokeWidth={1.6} />
      <circle cx={cx} cy={cy} r={r - 4} fill="none" stroke="#fff" strokeWidth={0.8} opacity={0.5} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={Math.max(8, r * 0.42)} fontWeight="800" fill="#fff" fontFamily={FONT}>
        {label}
      </text>
    </g>
  );
}
