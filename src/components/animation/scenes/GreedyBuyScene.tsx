import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const KIND_COLORS = ["#0d9488", "#d97706", "#7c3aed", "#0891b2"];

type Kind = { price: number; name: string; shape: string; color: string; count: number; spent: number };

const parseChoice = (text: string) =>
  Number(String(text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));

/** English plural for the item names, so "sandwich" does not become "sandwichs". */
const plural = (word: string, n: number) => {
  if (n === 1) return word;
  if (/(?:s|x|z|ch|sh)$/i.test(word)) return `${word}es`;
  if (/[^aeiou]y$/i.test(word)) return `${word.slice(0, -1)}ies`;
  return `${word}s`;
};

/**
 * A fixed budget spent to a stated plan: as many of the dearest item as will fit,
 * then whatever is left on the next. It looks like one division, and the two
 * things that actually trip it up each get a beat.
 *
 * First, the count is a **floor, not a rounded quotient** — so rather than assert
 * it, the scene buys a seventh sandwich and lets its cost run visibly past the
 * end of the money bar, over the budget line. Rounding 6.67 up to 7 is normally
 * an answer choice, and the scene finds it among `problem.choices` rather than
 * being told.
 *
 * Second, the **change is the whole point**: 6 sandwiches leave exactly $3, and
 * because a drink costs exactly $1 the leftover converts one-for-one, so the tail
 * of the bar is magnified into three $1 blocks that are counted off. The closing
 * beat lines all the purchases up as one row of objects with the bar underneath
 * showing the budget spent to the cent — and flags that the question asks for
 * *items*, since the sandwich count alone is also on the answer list.
 *
 * All money is integer cents (0.1 + 0.2 arithmetic has no place in a budget), the
 * greedy pass is run per kind in the given order, and the scene checks that the
 * spend never exceeds the budget and that no further item of any kind could still
 * be afforded; data { budget, kinds: ["4.50|sandwich|sandwich", ...], currency? }.
 */
export function GreedyBuyScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const currency = data.currency != null ? String(data.currency) : "$";
  const budget = Math.round(num(data.budget, 30) * 100);
  const raw = (Array.isArray(data.kinds) ? data.kinds : []).map((k) => String(k).split("|"));

  // greedy, in the order the plan names them, all in cents
  let left = budget;
  const kinds: Kind[] = raw.map((parts, i) => {
    const price = Math.round(num(parts[0], 0) * 100);
    const count = price > 0 ? Math.floor(left / price) : 0;
    const spent = count * price;
    left -= spent;
    return {
      price,
      name: parts[1] ?? "item",
      shape: parts[2] ?? "dot",
      color: KIND_COLORS[i % KIND_COLORS.length],
      count,
      spent,
    };
  });
  const totalItems = kinds.reduce((a, k) => a + k.count, 0);
  const totalSpent = kinds.reduce((a, k) => a + k.spent, 0);
  const money = (c: number) => `${currency}${(c / 100).toFixed(2)}`;

  const first = kinds[0];
  const overCount = first ? first.count + 1 : 0;
  const overCost = first ? overCount * first.price : 0;
  const overBy = overCost - budget;
  const afterFirst = budget - (first?.spent ?? 0);

  // ---- self-checks ----
  const withinBudget = totalSpent <= budget;
  const maximal = kinds.every((k) => k.price > 0) && !kinds.some((k) => left >= k.price);
  const pricesOk = kinds.length >= 2 && kinds.every((k) => k.price > 0);

  // ---- price the wrong choices ----
  const slips = [
    { why: `counted only the ${plural(first?.name ?? "item", 2)}`, value: first?.count ?? 0 },
    { why: `rounded ${(budget / (first?.price || 1)).toFixed(2)} up instead of down`, value: overCount },
    { why: `counted only the ${plural(kinds[1]?.name ?? "item", 2)}`, value: kinds[1]?.count ?? 0 },
    { why: `spent it all on ${plural(kinds[1]?.name ?? "item", 2)}`, value: kinds[1] ? Math.floor(budget / kinds[1].price) : 0 },
  ];
  const wrong = (problem.choices ?? [])
    .map((c) => ({ label: String(c.label), value: parseChoice(String(c.text)) }))
    .filter((c) => Number.isFinite(c.value) && c.value !== totalItems);
  const priced = wrong
    .map((c) => {
      const hit = slips.find((s) => s.value === c.value);
      return hit ? { ...c, why: hit.why } : null;
    })
    .filter((c): c is { label: string; value: number; why: string } => c !== null);

  // ---- beats ----
  const last = totalSteps - 1;
  const isFinal = step >= last;
  const plan = totalSteps >= 4 ? [0, 1, 2] : totalSteps === 3 ? [0, 1] : [0];
  const beat = isFinal ? 3 : plan[Math.min(Math.max(step, 0), plan.length - 1)];

  // ---- geometry ----
  const W = 340;
  const H = 290;
  const barX = 20;
  const barW = 270;
  const barY = 142;
  const barH = 32;
  const px = (cents: number) => (cents / budget) * barW; // width in px for a cost
  const counterY = 108;

  const seg1 = px(first?.price ?? 0);
  const firstEnd = barX + px(first?.spent ?? 0);

  const caption =
    beat === 0
      ? `${first?.count} × ${money(first?.price ?? 0)} = ${money(first?.spent ?? 0)}`
      : beat === 1
      ? `${overCount} would cost ${money(overCost)} — ${money(overBy)} too much`
      : beat === 2
      ? `${money(afterFirst)} left buys ${kinds[1]?.count} ${plural(kinds[1]?.name ?? "item", kinds[1]?.count ?? 0)}`
      : `${kinds.map((k) => k.count).join(" + ")} = ${totalItems}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* ---- beats 0–2 share the counter and the money bar ---- */}
        {beat <= 2 && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {money(budget)} to spend
            </text>

            {/* the counter the food lands on */}
            <path d={`M 12,${counterY} L ${W - 12},${counterY}`} stroke={INK} strokeWidth={2} />

            {/* one of the first kind per chunk of the bar, sitting over its own cost */}
            {Array.from({ length: first?.count ?? 0 }).map((_, i) => {
              const cx = barX + seg1 * (i + 0.5);
              return (
                <motion.g
                  key={`k0-${i}`}
                  initial={{ y: -46, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.15 + i * 0.13 }}
                >
                  <Sandwich cx={cx} bottom={counterY - 2} w={34} />
                </motion.g>
              );
            })}

            {/* the seventh, which does not fit */}
            {beat === 1 && (
              <motion.g
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 0.95 }}
                transition={{ type: "spring", stiffness: 150, damping: 20, delay: 1 }}
              >
                <Sandwich cx={barX + seg1 * (overCount - 0.5)} bottom={counterY - 2} w={34} ghost />
                <text
                  x={barX + seg1 * (overCount - 0.5)}
                  y={counterY - 44}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="800"
                  fill={BAD}
                  fontFamily={numberFont}
                >
                  ✗
                </text>
              </motion.g>
            )}

            {/* the change, converted one-for-one into the cheaper item */}
            {beat === 2 &&
              Array.from({ length: kinds[1]?.count ?? 0 }).map((_, i) => (
                <motion.g
                  key={`k1-${i}`}
                  initial={{ y: -46, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18, delay: 1.5 + i * 0.18 }}
                >
                  <Cup cx={268 + i * 25} bottom={counterY - 2} w={22} />
                </motion.g>
              ))}

            {/* the money bar */}
            <rect x={barX} y={barY} width={barW} height={barH} rx={4} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1.2} />
            {Array.from({ length: first?.count ?? 0 }).map((_, i) => (
              <motion.g
                key={`c0-${i}`}
                initial={{ opacity: 0, scaleX: 0.2 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.2 + i * 0.13 }}
                style={{ transformBox: "fill-box", transformOrigin: "left" }}
              >
                <rect x={barX + seg1 * i} y={barY} width={seg1} height={barH} fill={first.color} stroke="#fff" strokeWidth={1} />
              </motion.g>
            ))}

            {/* the seventh chunk running past the budget line */}
            {beat === 1 && (
              <motion.g initial={{ opacity: 0, scaleX: 0.2 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ type: "spring", stiffness: 240, damping: 20, delay: 1.05 }} style={{ transformBox: "fill-box", transformOrigin: "left" }}>
                <rect x={firstEnd} y={barY} width={seg1} height={barH} fill={BAD} opacity={0.85} stroke="#fff" strokeWidth={1} />
              </motion.g>
            )}

            {/* the change still sitting in the bar */}
            {beat === 2 && (
              <>
                <motion.rect
                  x={firstEnd}
                  y={barY}
                  width={px(afterFirst)}
                  height={barH}
                  fill={kinds[1]?.color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                />
                {/* magnified, because $3 of a $30 bar is too narrow to count */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  <path d={`M ${firstEnd},${barY + barH} L 180,206`} stroke={kinds[1]?.color} strokeWidth={1} strokeDasharray="3 3" fill="none" />
                  <path d={`M ${barX + barW},${barY + barH} L 300,206`} stroke={kinds[1]?.color} strokeWidth={1} strokeDasharray="3 3" fill="none" />
                </motion.g>
                {Array.from({ length: kinds[1]?.count ?? 0 }).map((_, i) => {
                  const cw = 120 / (kinds[1]?.count || 1);
                  return (
                    <motion.g
                      key={`z${i}`}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 1.1 + i * 0.18 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <rect x={180 + i * cw} y={206} width={cw} height={24} fill={kinds[1].color} stroke="#fff" strokeWidth={1.2} />
                      <text x={180 + i * cw + cw / 2} y={222} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                        {money(kinds[1].price)}
                      </text>
                    </motion.g>
                  );
                })}
              </>
            )}

            {/* the budget line, which the seventh chunk crosses */}
            <path d={`M ${barX + barW},${barY - 10} L ${barX + barW},${barY + barH + 10}`} stroke={INK} strokeWidth={1.6} />
            <text x={barX + barW} y={barY - 14} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {money(budget)}
            </text>
            <text x={barX} y={barY + barH + 14} fontSize="9" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              {money(0)}
            </text>
          </g>
        )}

        {/* per-beat closing lines */}
        {beat === 0 && (
          <>
            <motion.text x={W / 2} y={210} textAnchor="middle" fontSize="11" fontWeight="700" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
              {`each ${first?.name} takes ${money(first?.price ?? 0)} off the bar`}
            </motion.text>
            <motion.text
              x={W / 2}
              y={238}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 1.3 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {`${first?.count} ${plural(first?.name ?? "item", first?.count ?? 0)} cost ${money(first?.spent ?? 0)}`}
            </motion.text>
          </>
        )}

        {beat === 1 && (
          <>
            <motion.text x={W / 2} y={210} textAnchor="middle" fontSize="11" fontWeight="800" fill={BAD} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
              {`${overCount} × ${money(first?.price ?? 0)} = ${money(overCost)}`}
            </motion.text>
            <motion.text x={W / 2} y={234} textAnchor="middle" fontSize="11" fontWeight="700" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.55 }}>
              {`that runs ${money(overBy)} past the budget`}
            </motion.text>
            <motion.text
              x={W / 2}
              y={262}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 1.7 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {`so ${first?.count} is the most that fit`}
            </motion.text>
          </>
        )}

        {beat === 2 && (
          <>
            <motion.text x={W / 2} y={250} textAnchor="middle" fontSize="11" fontWeight="700" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
              {`a ${kinds[1]?.name} costs exactly ${money(kinds[1]?.price ?? 0)}`}
            </motion.text>
            <motion.text
              x={W / 2}
              y={274}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 2.1 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {`${money(afterFirst)} → ${kinds[1]?.count} ${plural(kinds[1]?.name ?? "item", kinds[1]?.count ?? 0)}`}
            </motion.text>
          </>
        )}

        {/* ---- beat 3: everything on the counter, counted ---- */}
        {beat === 3 && (
          <g>
            <path d={`M 12,${counterY} L ${W - 12},${counterY}`} stroke={INK} strokeWidth={2} />
            {kinds.flatMap((k, ki) =>
              Array.from({ length: k.count }).map((_, i) => {
                const idx = kinds.slice(0, ki).reduce((a, x) => a + x.count, 0) + i;
                const gap = (W - 40) / totalItems;
                const cx = 20 + gap * (idx + 0.5);
                return (
                  <motion.g
                    key={`f${ki}-${i}`}
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.1 + idx * 0.08 }}
                  >
                    {k.shape === "cup" ? <Cup cx={cx} bottom={counterY - 2} w={20} /> : <Sandwich cx={cx} bottom={counterY - 2} w={28} />}
                    <text x={cx} y={counterY + 16} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={k.color} fontFamily={numberFont}>
                      {idx + 1}
                    </text>
                  </motion.g>
                );
              })
            )}

            {/* the budget, spent to the cent */}
            <rect x={barX} y={barY} width={barW} height={barH} rx={4} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1.2} />
            {kinds.flatMap((k, ki) =>
              Array.from({ length: k.count }).map((_, i) => {
                const before = kinds.slice(0, ki).reduce((a, x) => a + x.spent, 0) + i * k.price;
                const idx = kinds.slice(0, ki).reduce((a, x) => a + x.count, 0) + i;
                return (
                  <motion.g
                    key={`b${ki}-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + idx * 0.08 }}
                  >
                    <rect x={barX + px(before)} y={barY} width={px(k.price)} height={barH} fill={k.color} stroke="#fff" strokeWidth={1} />
                  </motion.g>
                );
              })
            )}
            <motion.text x={W / 2} y={barY + barH + 16} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              {totalSpent === budget ? `all ${money(budget)} spent` : `${money(totalSpent)} of ${money(budget)} spent`}
            </motion.text>

            <motion.text x={W / 2} y={216} textAnchor="middle" fontSize="11" fontWeight="700" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              {kinds.map((k) => `${k.count} ${plural(k.name, k.count)}`).join("  +  ")}
            </motion.text>
            <motion.g
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 14, delay: 1.4 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect x={W / 2 - 62} y={234} width={124} height={30} rx={15} fill={WIN} />
              <text x={W / 2} y={255} textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                {totalItems} items
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
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : beat === 1 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 1 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 1 ? "#fecaca" : "#c7d2fe"}`,
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
            key="notes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", lineHeight: 1.55 }}
          >
            {!pricesOk ? (
              `check failed: every kind needs a real price`
            ) : !withinBudget ? (
              `check failed: the plan spends ${money(totalSpent)} of a ${money(budget)} budget`
            ) : !maximal ? (
              `check failed: ${money(left)} is left, still enough for another item`
            ) : (
              <>
                {`the question asks for items, not just ${plural(first?.name ?? "item", 2)}`}
                {priced.map((c) => (
                  <span key={c.label}>
                    <br />
                    {`${c.label} ${c.value}: ${c.why}`}
                  </span>
                ))}
              </>
            )}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.7 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A side-on sandwich: bun, lettuce, filling, cheese, bun. */
function Sandwich({ cx, bottom, w, ghost }: { cx: number; bottom: number; w: number; ghost?: boolean }) {
  const x = cx - w / 2;
  const o = ghost ? 0.45 : 1;
  const h = w * 0.78;
  const y = bottom - h;
  return (
    <g opacity={o}>
      <path d={`M ${x},${y + 10} Q ${x},${y} ${x + w / 2},${y} Q ${x + w},${y} ${x + w},${y + 10} L ${x + w},${y + 12} L ${x},${y + 12} Z`} fill="#e0a952" />
      <rect x={x - 1} y={y + 12} width={w + 2} height={4} rx={2} fill="#6bbf59" />
      <rect x={x} y={y + 16} width={w} height={5} fill="#cf6a43" />
      <rect x={x - 1} y={y + 21} width={w + 2} height={3.5} rx={1} fill="#f2c14e" />
      <rect x={x} y={y + 24.5} width={w} height={h - 24.5} rx={2.5} fill="#e0a952" />
      {ghost && <path d={`M ${x},${y} L ${x + w},${y + h}`} stroke={BAD} strokeWidth={2} />}
    </g>
  );
}

/** A lidded soft-drink cup with a straw. */
function Cup({ cx, bottom, w }: { cx: number; bottom: number; w: number }) {
  const h = w * 1.7;
  const y = bottom - h;
  const inset = w * 0.14;
  return (
    <g>
      <path d={`M ${cx - w / 2 + 2},${y + 8} L ${cx + w / 2 - 2},${y + 8} L ${cx + w / 2 - 2 - inset},${bottom} L ${cx - w / 2 + 2 + inset},${bottom} Z`} fill="#e05a5a" />
      <path d={`M ${cx + 1},${y + 8} L ${cx + 5},${y - 6}`} stroke="#475569" strokeWidth={2} strokeLinecap="round" />
      <rect x={cx - w / 2} y={y + 3} width={w} height={6} rx={2} fill="#cbd5e1" />
    </g>
  );
}
