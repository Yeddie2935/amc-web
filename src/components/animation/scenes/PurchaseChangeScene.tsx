import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const APPLE = "#e0393f";
const BILL = "#2e7d4f";
const COIN = "#d4a017";

const parseMoney = (text: string) =>
  Number(String(text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));

const plural = (word: string, n: number) => (n === 1 ? word : /[^aeiou]y$/i.test(word) ? `${word.slice(0, -1)}ies` : `${word}s`);

/**
 * A flat purchase-and-change problem: buy N items at a fixed price, pay with a
 * bill, get the difference back. The whole solution is one subtraction, but
 * the reflex slip is stopping at the item cost — that's usually sitting right
 * there as another answer choice — so the scene spends a beat pricing the
 * items, a beat flagging that subtotal as a trap, then a beat doing the actual
 * subtraction and counting the change out as real bills and coins rather than
 * just printing a number.
 *
 * Change is broken into $1 bills then quarters/dimes/nickels/pennies by a
 * greedy pass in integer cents (US denominations, minimal by count), so the
 * pieces shown always sum to the true change instead of an invented split.
 *
 * data: { itemPrice, itemCount, itemName?, paid, currency? }
 */
export function PurchaseChangeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const currency = data.currency != null ? String(data.currency) : "$";
  const itemPriceCents = Math.round(num(data.itemPrice, 0.5) * 100);
  const itemCount = Math.round(num(data.itemCount, 3));
  const itemName = data.itemName != null ? String(data.itemName) : "apple";
  const paidCents = Math.round(num(data.paid, 5) * 100);

  const costCents = itemPriceCents * itemCount;
  const changeCents = paidCents - costCents;
  const money = (c: number) => `${currency}${(c / 100).toFixed(2)}`;

  // ---- self-checks ----
  const pricesOk = itemPriceCents > 0 && itemCount > 0 && paidCents > 0;
  const withinBudget = changeCents >= 0;
  const answerMatches = money(changeCents) === (problem.shortAnswer ?? "");

  // ---- the trap: whichever choice equals the item subtotal, not the change ----
  const trapChoice = (problem.choices ?? []).find(
    (c) => Math.round(parseMoney(String(c.text)) * 100) === costCents && String(c.label) !== problem.answer
  );

  // ---- change broken into real denominations, greedily, in cents ----
  const DENOMS: { cents: number; label: string; kind: "bill" | "coin" }[] = [
    { cents: 100, label: "$1", kind: "bill" },
    { cents: 25, label: "25¢", kind: "coin" },
    { cents: 10, label: "10¢", kind: "coin" },
    { cents: 5, label: "5¢", kind: "coin" },
    { cents: 1, label: "1¢", kind: "coin" },
  ];
  let remaining = changeCents;
  const pieces: { label: string; kind: "bill" | "coin" }[] = [];
  for (const d of DENOMS) {
    while (remaining >= d.cents) {
      pieces.push({ label: d.label, kind: d.kind });
      remaining -= d.cents;
    }
  }

  // ---- geometry ----
  const W = 340;
  const H = 300;
  const barX = 20;
  const barW = 300;
  const barY = 150;
  const barH = 28;
  const counterY = 106;
  const px = (cents: number) => (cents / paidCents) * barW;
  const seg = px(itemPriceCents);
  const costEnd = barX + px(costCents);

  // ---- beats: 0 setup, 1 compute cost, 2 the trap, 3 subtract + change ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 3));
  const isFinal = step >= last;

  const caption =
    beat === 0
      ? `${itemCount} ${plural(itemName, itemCount)} × ${money(itemPriceCents)}, paid with ${money(paidCents)}`
      : beat === 1
      ? `${itemCount} × ${money(itemPriceCents)} = ${money(costCents)}`
      : beat === 2
      ? `${money(costCents)} is what she spent — not the change`
      : `${money(paidCents)} − ${money(costCents)} = ${money(changeCents)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        <text x={W / 2} y={20} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
          paid with {money(paidCents)}
        </text>

        {/* the bill she hands over, always in frame */}
        <motion.g initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
          <Bill cx={W - 44} bottom={54} w={64} label={money(paidCents)} />
        </motion.g>

        {/* the counter and the items on it */}
        <path d={`M 12,${counterY} L ${W - 12},${counterY}`} stroke={INK} strokeWidth={2} />
        {Array.from({ length: itemCount }).map((_, i) => {
          const cx = barX + seg * (i + 0.5);
          return (
            <motion.g
              key={`a${i}`}
              initial={{ y: -46, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.15 + i * 0.15 }}
            >
              <Apple cx={cx} bottom={counterY - 2} w={30} />
              <text x={cx} y={counterY + 16} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                {money(itemPriceCents)}
              </text>
            </motion.g>
          );
        })}

        {/* the money bar: the whole $5 bill, item cost filling in from the left */}
        {beat >= 1 && (
          <g>
            <rect x={barX} y={barY} width={barW} height={barH} rx={4} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1.2} />
            {Array.from({ length: itemCount }).map((_, i) => (
              <motion.g
                key={`c${i}`}
                initial={{ opacity: 0, scaleX: 0.2 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.15 + i * 0.15 }}
                style={{ transformBox: "fill-box", transformOrigin: "left" }}
              >
                <rect
                  x={barX + seg * i}
                  y={barY}
                  width={seg}
                  height={barH}
                  fill={beat === 2 ? BAD : APPLE}
                  opacity={beat === 2 ? 0.85 : 1}
                  stroke="#fff"
                  strokeWidth={1}
                />
              </motion.g>
            ))}
            {beat === 3 && (
              <motion.rect
                x={costEnd}
                y={barY}
                width={px(changeCents)}
                height={barH}
                fill={WIN}
                initial={{ opacity: 0, scaleX: 0.2 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.6 }}
                style={{ transformBox: "fill-box", transformOrigin: "left" }}
              />
            )}
            <path d={`M ${barX + barW},${barY - 8} L ${barX + barW},${barY + barH + 8}`} stroke={INK} strokeWidth={1.6} />
            <text x={barX} y={barY + barH + 14} fontSize="9" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              {money(0)}
            </text>
            <text x={barX + barW} y={barY - 12} textAnchor="end" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {money(paidCents)}
            </text>
          </g>
        )}

        {/* the trap: the item cost flagged as not the change */}
        {beat === 2 && (
          <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <text x={(barX + costEnd) / 2} y={barY + barH / 2 + 5} textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff" fontFamily={numberFont}>
              ✗
            </text>
          </motion.g>
        )}

        {/* the change, counted out as real bills and coins */}
        {beat === 3 && (
          <g>
            {pieces.map((p, i) => {
              const cx = barX + 24 + i * 46;
              const y = barY + barH + 40;
              return (
                <motion.g
                  key={`p${i}`}
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 16, delay: 1 + i * 0.2 }}
                >
                  {p.kind === "bill" ? <Bill cx={cx} bottom={y + 20} w={40} label={p.label} /> : <Coin cx={cx} cy={y} r={15} label={p.label} />}
                </motion.g>
              );
            })}
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
        {beat === 2 && trapChoice && (
          <motion.span
            key="trap-note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center" }}
          >
            {`choice ${trapChoice.label} (${money(costCents)}) is the apple cost, not the change`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="notes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 + pieces.length * 0.2 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center" }}
          >
            {!pricesOk
              ? `check failed: price, count, and payment must all be positive`
              : !withinBudget
              ? `check failed: the payment doesn't cover the cost`
              : !answerMatches
              ? `check failed: computed change ${money(changeCents)} does not match the stored answer`
              : pieces.map((p) => p.label).join(" + ") + ` = ${money(changeCents)}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.2 + pieces.length * 0.2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A round apple: body, a short stem, and a leaf. */
function Apple({ cx, bottom, w }: { cx: number; bottom: number; w: number }) {
  const r = w / 2;
  const cy = bottom - r;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={APPLE} />
      <ellipse cx={cx - r * 0.35} cy={cy - r * 0.3} rx={r * 0.28} ry={r * 0.18} fill="#fff" opacity={0.35} />
      <path d={`M ${cx},${cy - r} L ${cx + 1},${cy - r - 7}`} stroke="#6b4226" strokeWidth={2} strokeLinecap="round" />
      <path d={`M ${cx + 1},${cy - r - 6} Q ${cx + 10},${cy - r - 10} ${cx + 9},${cy - r - 2} Q ${cx + 4},${cy - r - 2} ${cx + 1},${cy - r - 6} Z`} fill={WIN} />
    </g>
  );
}

/** A rectangular bill with a printed value. */
function Bill({ cx, bottom, w, label }: { cx: number; bottom: number; w: number; label: string }) {
  const h = w * 0.5;
  const x = cx - w / 2;
  const y = bottom - h;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={3} fill={BILL} stroke="#1c5c3a" strokeWidth={1} />
      <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} rx={2} fill="none" stroke="#fff" strokeWidth={0.8} opacity={0.6} />
      <text x={cx} y={y + h / 2 + 4} textAnchor="middle" fontSize={Math.max(9, w * 0.22)} fontWeight="800" fill="#fff" fontFamily={numberFont}>
        {label}
      </text>
    </g>
  );
}

/** A round coin with a printed value. */
function Coin({ cx, cy, r, label }: { cx: number; cy: number; r: number; label: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={COIN} stroke="#8a6a10" strokeWidth={1.4} />
      <circle cx={cx} cy={cy} r={r - 3} fill="none" stroke="#8a6a10" strokeWidth={0.8} opacity={0.6} />
      <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#5c4408" fontFamily={numberFont}>
        {label}
      </text>
    </g>
  );
}
