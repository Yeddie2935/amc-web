import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const EXTRA = "#f59e0b";
const SLOT_COLORS = ["#4338ca", "#f59e0b", "#0891b2"];

/**
 * Numbers whose digits follow a repeating letter pattern (ababa, aabb, …) that
 * must be divisible by something. The pattern is the whole point: a letter
 * appearing in several slots means those slots hold **one digit**, so a rule
 * about the last slot is instantly a rule about the first — and a leading digit
 * cannot be 0, which is what collapses "0 or 5" down to a single value with no
 * casework at all.
 *
 * With the repeated letter pinned, the digit-sum test stops being a sum over
 * five digits and becomes a sum over one unknown: the pinned letter contributes
 * a fixed multiple, and only the free letter's coefficient can move the
 * remainder. The scene then **sweeps that free digit through 0–9** and marks
 * each one, so the surviving values are read off a sieve rather than asserted —
 * and the slot barred by the distinctness rule is flagged even when the
 * divisibility test would have rejected it anyway.
 *
 * The count is produced by brute-force enumeration over every assignment, and
 * the narrated route (last-digit rule, then digit sum) is checked to agree with
 * it; if it does not, the scene says so instead of showing the story.
 * Data: { pattern: "ababa", divisor, distinct? }.
 */
export function PatternDigitScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const pattern = (data.pattern != null ? String(data.pattern) : "ababa").trim();
  const divisor = Math.max(1, Math.round(num(data.divisor, 1)));
  const distinct = data.distinct !== false;

  const slots = pattern.split("");
  const letters = Array.from(new Set(slots));
  const countOf = (L: string) => slots.filter((s) => s === L).length;
  const leadLetter = slots[0];
  const lastLetter = slots[slots.length - 1];

  // the truth: every assignment, checked against the divisor itself
  const survivors: { digits: Record<string, number>; value: number }[] = [];
  let tried = 0;
  const sweep = (idx: number, chosen: Record<string, number>) => {
    if (idx === letters.length) {
      if (distinct && new Set(Object.values(chosen)).size !== letters.length) return;
      if (chosen[leadLetter] === 0) return;
      tried += 1;
      const value = Number(slots.map((s) => chosen[s]).join(""));
      if (value % divisor === 0) survivors.push({ digits: { ...chosen }, value });
      return;
    }
    for (let d = 0; d <= 9; d += 1) sweep(idx + 1, { ...chosen, [letters[idx]]: d });
  };
  sweep(0, {});

  // the story: what the last digit and the digit sum each force
  const wants5 = divisor % 5 === 0;
  const wants2 = divisor % 2 === 0;
  const sumMod = divisor % 9 === 0 ? 9 : divisor % 3 === 0 ? 3 : 0;
  const lastAllowed: number[] = [];
  for (let d = 0; d <= 9; d += 1) {
    if (wants5 && d % 5 !== 0) continue;
    if (wants2 && d % 2 !== 0) continue;
    lastAllowed.push(d);
  }
  // the last letter also leads, so 0 is off the table for it
  const pinnedOptions = lastLetter === leadLetter ? lastAllowed.filter((d) => d !== 0) : lastAllowed;
  const pinned = pinnedOptions.length === 1 ? pinnedOptions[0] : null;
  const freeLetter = letters.find((L) => L !== lastLetter) ?? "";
  const pinnedConst = pinned != null ? pinned * countOf(lastLetter) : 0;
  const freeCount = freeLetter ? countOf(freeLetter) : 0;

  const ladder = Array.from({ length: 10 }, (_, b) => {
    const total = pinnedConst + freeCount * b;
    const barred = distinct && pinned != null && b === pinned;
    return { b, total, ok: sumMod === 0 ? true : total % sumMod === 0, barred };
  });
  const keep = ladder.filter((row) => row.ok && !row.barred);

  const storyAgrees =
    pinned != null &&
    letters.length === 2 &&
    keep.length === survivors.length &&
    keep.every((row) => survivors.some((s) => s.digits[freeLetter] === row.b));
  const matchesStored = problem.shortAnswer == null || Number(problem.shortAnswer) === survivors.length;
  const failure =
    pinned == null
      ? `check failed: the last digit rule leaves ${pinnedOptions.length} options, so ${lastLetter} is not pinned`
      : !storyAgrees
      ? `check failed: the sieve keeps ${keep.length} values but enumeration finds ${survivors.length}`
      : !matchesStored
      ? `check failed: enumeration finds ${survivors.length}, the stored answer is ${problem.shortAnswer}`
      : "";

  const lastStep = totalSteps - 1;
  const isFinal = step >= lastStep;
  const pinnedShown = isFinal || step >= 1;
  const summed = isFinal || step >= 2;

  // ---- geometry ----
  const W = 360;
  const H = 240;
  const n = slots.length;
  const slotW = Math.min(44, (W - 60) / n - 7);
  const gap = 7;
  const rowW = n * slotW + (n - 1) * gap;
  const x0 = (W - rowW) / 2;
  const slotX = (i: number) => x0 + i * (slotW + gap);
  const slotY = 34;
  const slotH = 38;
  const colourOf = (L: string) => SLOT_COLORS[letters.indexOf(L) % SLOT_COLORS.length];

  // arcs joining the slots that must hold one and the same digit
  const chains = letters.flatMap((L) => {
    const idx = slots.map((s, i) => (s === L ? i : -1)).filter((i) => i >= 0);
    const below = L === leadLetter;
    return idx.slice(0, -1).map((i, k) => ({ L, from: i, to: idx[k + 1], below }));
  });

  const digitAt = (i: number) => {
    const L = slots[i];
    if (pinnedShown && L === lastLetter && pinned != null) return String(pinned);
    return null;
  };

  const caption = isFinal
    ? `${tried} flippy numbers of this length, and the two rules leave ${survivors.length}`
    : step === 0
    ? `only two digits exist in the whole number, and ${lastLetter} owns both ends`
    : !summed
    ? `divisible by ${divisor} needs ${lastAllowed.join(" or ")} last — and that slot leads too, so ${lastLetter} = ${pinned}`
    : `digit sum = ${pinnedConst} + ${freeCount}${freeLetter}, and ${pinnedConst} is already a multiple of ${sumMod}`;

  const note = failure
    ? failure
    : isFinal
    ? `checked by hand against every one of the ${tried}, not just the ones the rules picked`
    : step === 0
    ? `one letter, one digit — whatever pins one slot pins them all`
    : !summed
    ? `${lastLetter} = 0 would put a 0 out front, so ${lastAllowed.join(" or ")} collapses to one`
    : `${freeCount}${freeLetter} must clear ${sumMod}, so ${freeLetter} runs over ${keep.map((r) => r.b).join(", ")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {/* the slots the pattern lays out */}
        {slots.map((L, i) => (
          <motion.g
            key={`s${i}`}
            initial={{ opacity: 0, y: -14, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 17, delay: i * 0.08 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <rect
              x={slotX(i)}
              y={slotY}
              width={slotW}
              height={slotH}
              rx={5}
              fill={pinnedShown && L === lastLetter ? "#eef2ff" : "#f8fafc"}
              stroke={colourOf(L)}
              strokeWidth={1.8}
            />
            <text
              x={slotX(i) + slotW / 2}
              y={slotY + slotH / 2 + 6}
              textAnchor="middle"
              fontSize="17"
              fontWeight="800"
              fill={colourOf(L)}
              fontFamily={numberFont}
            >
              {digitAt(i) ?? L}
            </text>
          </motion.g>
        ))}

        {/* the same letter means the same digit — drawn as a real link */}
        {chains.map((c, i) => {
          const x1 = slotX(c.from) + slotW / 2;
          const x2 = slotX(c.to) + slotW / 2;
          const yEdge = c.below ? slotY + slotH : slotY;
          const yTip = c.below ? slotY + slotH + 20 : slotY - 20;
          return (
            <motion.path
              key={`c${i}`}
              d={`M ${x1},${yEdge} Q ${(x1 + x2) / 2},${yTip} ${x2},${yEdge}`}
              fill="none"
              stroke={colourOf(c.L)}
              strokeWidth={1.6}
              opacity={0.75}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.12 }}
            />
          );
        })}

        {/* beat two: the last-digit rule, and where it travels */}
        <AnimatePresence>
          {pinnedShown && !summed && (
            <motion.g key="last" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <rect x={slotX(n - 1) - 14} y={slotY + slotH + 26} width={slotW + 28} height={17} rx={8} fill="#fef3c7" stroke={EXTRA} strokeWidth={0.9} />
                <text
                  x={slotX(n - 1) + slotW / 2}
                  y={slotY + slotH + 38}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="800"
                  fill="#92400e"
                  fontFamily={numberFont}
                >
                  {lastAllowed.join(" or ")}
                </text>
              </motion.g>

              {/* the rule runs back along the chain to the leading slot */}
              <motion.circle
                r={4}
                fill={EXTRA}
                initial={{ cx: slotX(n - 1) + slotW / 2, cy: slotY + slotH + 20, opacity: 0 }}
                animate={{
                  cx: [slotX(n - 1) + slotW / 2, slotX(0) + slotW / 2],
                  cy: [slotY + slotH + 20, slotY + slotH + 20],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{ duration: 1, delay: 0.7, times: [0, 0.1, 0.85, 1] }}
              />

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
                <rect x={slotX(0) - 10} y={slotY + slotH + 26} width={slotW + 20} height={17} rx={8} fill="#fee2e2" stroke={BAD} strokeWidth={0.9} />
                <text x={slotX(0) + slotW / 2} y={slotY + slotH + 38} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                  not 0
                </text>
              </motion.g>

              <motion.text
                x={W / 2}
                y={slotY + slotH + 66}
                textAnchor="middle"
                fontSize="15"
                fontWeight="800"
                fill={IND}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 16, delay: 1.9 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {lastLetter} = {pinned}
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* beat one: how many slots each letter owns */}
        <AnimatePresence>
          {!pinnedShown && (
            <motion.g key="counts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 1.1 }}>
              {letters.map((L, i) => (
                <g key={L}>
                  <rect x={W / 2 - 92 + i * 96} y={slotY + slotH + 48} width={88} height={20} rx={10} fill="#f8fafc" stroke={colourOf(L)} strokeWidth={1.2} />
                  <text
                    x={W / 2 - 48 + i * 96}
                    y={slotY + slotH + 62}
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="800"
                    fill={colourOf(L)}
                    fontFamily={numberFont}
                  >
                    {L} in {countOf(L)} slot{countOf(L) === 1 ? "" : "s"}
                  </text>
                </g>
              ))}
              <text x={W / 2} y={slotY + slotH + 90} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                divisible by {divisor} = {sumMod ? `${sumMod} × ${divisor / sumMod}` : divisor}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* beat three: the digit sum, then the sieve over the free digit */}
        <AnimatePresence>
          {summed && !isFinal && (
            <motion.g key="sum" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.text
                x={W / 2}
                y={slotY + slotH + 30}
                textAnchor="middle"
                fontSize="13"
                fontWeight="800"
                fill={INK}
                fontFamily={numberFont}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.3 }}
              >
                {slots.map((L) => (L === lastLetter ? String(pinned) : L)).join(" + ")} = {pinnedConst} + {freeCount}
                {freeLetter}
              </motion.text>
              <motion.text
                x={W / 2}
                y={slotY + slotH + 50}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="700"
                fill={IND}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {pinnedConst} = {sumMod} × {pinnedConst / sumMod}, so {sumMod} must divide {freeCount}
                {freeLetter}
              </motion.text>

              {ladder.map((row, i) => {
                const cw = 30;
                const cx = (W - (10 * cw + 9 * 3)) / 2 + i * (cw + 3);
                const good = row.ok && !row.barred;
                return (
                  <motion.g
                    key={row.b}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 240, damping: 18, delay: 1 + i * 0.06 }}
                  >
                    <rect
                      x={cx}
                      y={slotY + slotH + 62}
                      width={cw}
                      height={48}
                      rx={5}
                      fill={good ? "#dcfce7" : "#f1f5f9"}
                      stroke={row.barred ? EXTRA : good ? "#86efac" : "#cbd5e1"}
                      strokeWidth={1.2}
                      strokeDasharray={row.barred ? "3 2" : undefined}
                    />
                    <text x={cx + cw / 2} y={slotY + slotH + 78} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                      {row.b}
                    </text>
                    <text x={cx + cw / 2} y={slotY + slotH + 92} textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                      {row.total}
                    </text>
                    <text
                      x={cx + cw / 2}
                      y={slotY + slotH + 106}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="800"
                      fill={good ? WIN : row.barred ? EXTRA : BAD}
                    >
                      {good ? "✓" : row.barred ? "=" : "✗"}
                    </text>
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the survivors, each divided out */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {survivors.map((s, i) => {
                const cw = Math.min(84, (W - 24) / Math.max(1, survivors.length) - 6);
                const cx = (W - (survivors.length * cw + (survivors.length - 1) * 6)) / 2 + i * (cw + 6);
                return (
                  <motion.g
                    key={s.value}
                    initial={{ opacity: 0, y: 16, scale: 0.7 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 230, damping: 17, delay: 0.3 + i * 0.13 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <rect x={cx} y={slotY + slotH + 34} width={cw} height={44} rx={6} fill="#dcfce7" stroke={WIN} strokeWidth={1.4} />
                    <text x={cx + cw / 2} y={slotY + slotH + 54} textAnchor="middle" fontSize="13" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                      {s.value}
                    </text>
                    {/* the division glyph turns into a "+" below ~10px */}
                    <text x={cx + cw / 2} y={slotY + slotH + 69} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#15803d" fontFamily={numberFont}>
                      ÷ {divisor} = {s.value / divisor}
                    </text>
                  </motion.g>
                );
              })}
              <motion.text
                x={W / 2}
                y={slotY + slotH + 102}
                textAnchor="middle"
                fontSize="15"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 16, delay: 1 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {survivors.length} in all
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
          color: isFinal ? "#166534" : summed ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : summed ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : summed ? "#fde68a" : "#c7d2fe"}`,
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
              color: failure ? BAD : "#94a3b8",
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
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
