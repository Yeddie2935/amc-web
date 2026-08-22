import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const AMB = "#b45309";

const TAKER_COLORS = ["#0891b2", "#be185d", "#b45309", "#7c3aed"];

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

/** One marble, drawn with a highlight so a hundred of them still read as objects. */
function Marble({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.32} r={r * 0.28} fill="#fff" opacity={0.65} />
    </g>
  );
}

/**
 * Successive gifts where each one is a fraction of **what is left**, not of the
 * original, asked as a percentage of the original.
 *
 * A percentage does not care how many marbles are really in the bag, so the
 * scene says so outright and takes the bag to be 100 — at which point every
 * percentage becomes a literal count of marbles and the answer can simply be
 * read off the grid. That is the whole reason the picture works: 20%, then 10%,
 * then 25% all come out whole (20, 8, 18), so nothing has to be rounded or
 * hand-waved, and the 54 that survive are countable squares on screen.
 *
 * The "of what is left" trap is made visible rather than asserted: on each
 * taker's beat the scene shows what that same percentage **would** have been
 * against the original bag beside what it actually was (Ebony takes 8, not 10;
 * Jimmy 18, not 25). The closing beat then prices the classic slip — charging
 * every gift to the original and subtracting, `100 − 20 − 10 − 25 = 45` — and
 * finds that value among `problem.choices`, which on this problem is the answer
 * choice sitting right next to the correct one.
 *
 * Marbles are taken in reading order so each taker's share is a contiguous block,
 * and they fly out of the grid into that taker's card, leaving dashed holes in
 * their colour — so the finished grid is the whole history, countable. Every
 * bite is exact integer arithmetic (`remaining × numer / den`), and the scene
 * cross-checks the count against the independent product route
 * `Π (den − numer)/den` kept as an exact reduced fraction; data
 * `{ start, cols?, keeper?, unit?, takers: ["Pedro|🧑|1|5", ...] }` as
 * name|icon|numerator|denominator.
 */
export function RemainingGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const start = Math.max(1, Math.round(num(data.start, 100)));
  const cols = Math.max(1, Math.round(num(data.cols, 10)));
  const unit = typeof data.unit === "string" ? data.unit : "marbles";
  const [keeperName, keeperIcon] = (typeof data.keeper === "string" ? data.keeper : "Gilda|👧").split("|");

  const takers = (Array.isArray(data.takers) ? data.takers : []).map((t, i) => {
    const [name, icon, n, d] = String(t).split("|");
    return {
      name: name ?? `friend ${i + 1}`,
      icon: icon || "🧑",
      numer: Math.round(num(n, 0)),
      den: Math.max(1, Math.round(num(d, 1))),
      color: TAKER_COLORS[i % TAKER_COLORS.length],
    };
  });

  // ---------------- the gifts, as exact whole counts ----------------
  let remaining = start;
  const gifts = takers.map((t) => {
    const before = remaining;
    const bite = (before * t.numer) / t.den;
    const whole = Number.isInteger(bite);
    remaining = before - bite;
    // what this same percentage would have taken from the untouched bag
    const naive = (start * t.numer) / t.den;
    const pct = (100 * t.numer) / t.den;
    return { ...t, before, bite, after: remaining, whole, naive, pct };
  });
  const kept = remaining;
  const keptPct = (100 * kept) / start;
  const givenTotal = gifts.reduce((a, g) => a + g.bite, 0);

  // the same answer down a second route: multiply the surviving fractions
  let pn = 1;
  let pd = 1;
  gifts.forEach((g) => {
    pn *= g.den - g.numer;
    pd *= g.den;
  });
  const pg = gcd(pn, pd) || 1;
  const routePct = (100 * pn) / pd;

  // ---------------- the classic slip: charge every gift to the original ----
  const naiveSum = gifts.reduce((a, g) => a + g.naive, 0);
  const naiveKept = start - naiveSum;
  const norm = (s: string) => s.replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "");
  const trap = (problem.choices ?? []).find(
    (c) => Math.abs(Number(norm(String(c.text))) - (100 * naiveKept) / start) < 1e-9,
  );

  // ---------------- self-checks ----------------
  const wholeOk = gifts.every((g) => g.whole);
  const routesOk = Math.abs(routePct - keptPct) < 1e-9;
  const storedOk =
    problem.shortAnswer == null || Math.abs(Number(norm(String(problem.shortAnswer))) - keptPct) < 1e-9;
  const sumOk = givenTotal + kept === start;
  const ok = wholeOk && routesOk && storedOk && sumOk && gifts.length > 0;
  const failed = !gifts.length
    ? "no takers in the data"
    : !wholeOk
    ? `${gifts.find((g) => !g.whole)?.name}'s share is not a whole ${unit.replace(/s$/, "")}`
    : !routesOk
    ? `counting gives ${keptPct}%, multiplying the fractions gives ${routePct}%`
    : !storedOk
    ? `counted ${keptPct}%, stored answer ${problem.shortAnswer}`
    : `the gifts and the keep add to ${givenTotal + kept}, not ${start}`;

  // ---------------- who holds which marble ----------------
  // taken in reading order, so every share is one contiguous block
  const owner = new Array<number>(start).fill(-1);
  let cursor = 0;
  gifts.forEach((g, k) => {
    for (let i = 0; i < g.bite && cursor < start; i += 1, cursor += 1) owner[cursor] = k;
  });

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const phase = isFinal ? gifts.length : Math.min(step, gifts.length);

  // ---------------- geometry ----------------
  const W = 480;
  const H = 268;
  const CELL = 14;
  const GX = 14;
  const GY = 34;
  const R = 5;
  const rows = Math.ceil(start / cols);
  const gridBottom = GY + rows * CELL;
  const gx = (i: number) => GX + (i % cols) * CELL + CELL / 2;
  const gy = (i: number) => GY + Math.floor(i / cols) * CELL + CELL / 2;

  const CX = 170;
  const CW = 300;
  const CH = 50;
  const cardY = (k: number) => 26 + k * (CH + 6);

  // a taker's marbles land in a mini cluster inside their own card — 5 to a row,
  // so the cluster stays a narrow column clear of the card's own text
  const CLUSTER_X = CX + 254;
  const CLUSTER_PITCH = 7;
  const CLUSTER_COLS = 5;
  const clusterPos = (k: number, j: number) => ({
    x: CLUSTER_X + (j % CLUSTER_COLS) * CLUSTER_PITCH + 3,
    y: cardY(k) + 13 + Math.floor(j / CLUSTER_COLS) * CLUSTER_PITCH,
  });
  // index of a marble within its own taker's share
  const shareIndex = (i: number) => {
    const k = owner[i];
    let base = 0;
    for (let q = 0; q < k; q += 1) base += gifts[q].bite;
    return i - base;
  };

  const acting = phase - 1; // the taker whose beat this is, or -1
  const gone = (k: number) => k <= acting;

  const caption =
    phase === 0
      ? `a percentage does not care how big the bag is — so call it ${start} ${unit}`
      : `${gifts[acting].name} takes ${gifts[acting].pct}% of the ${gifts[acting].before} still in the bag = ${gifts[acting].bite}`;
  const finalCaption = `${keeperName} keeps ${kept} of ${start} ${unit} = ${keptPct}%`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ---------------- the bag ---------------- */}
        <text x={GX} y={24} fontSize="11" fontWeight="800" fill={INK}>
          {keeperIcon} {keeperName}&apos;s bag
        </text>
        <rect
          x={GX - 5}
          y={GY - 5}
          width={cols * CELL + 10}
          height={rows * CELL + 10}
          rx={7}
          fill="#f8fafc"
          stroke="#e2e8f0"
          strokeWidth={1.4}
        />

        {/* holes, drawn under the marbles so a flying marble passes over them */}
        {owner.map((k, i) =>
          k >= 0 && gone(k) ? (
            <motion.circle
              key={`h${i}`}
              cx={gx(i)}
              cy={gy(i)}
              r={R}
              fill="none"
              stroke={gifts[k].color}
              strokeWidth={1.1}
              strokeDasharray="2 2"
              opacity={0.55}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ delay: k === acting ? 0.5 + shareIndex(i) * 0.012 : 0 }}
            />
          ) : null,
        )}

        {/* the marbles still in the bag */}
        {owner.map((k, i) =>
          k < 0 || !gone(k) ? (
            <motion.g
              key={`m${i}`}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 18,
                delay: phase === 0 ? 0.1 + (i % cols) * 0.012 + Math.floor(i / cols) * 0.03 : 0,
              }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <Marble cx={gx(i)} cy={gy(i)} r={R} color={k < 0 && phase === gifts.length ? WIN : IND} />
            </motion.g>
          ) : null,
        )}

        {/* what the keeper is left holding */}
        {phase > 0 && (
          <motion.g key={`keep${phase}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
            <rect
              x={GX - 5}
              y={gridBottom + 12}
              width={cols * CELL + 10}
              height={22}
              rx={11}
              fill={phase === gifts.length ? "#dcfce7" : "#eef2ff"}
              stroke={phase === gifts.length ? "#bbf7d0" : "#c7d2fe"}
            />
            <text
              x={GX + (cols * CELL) / 2}
              y={gridBottom + 27}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill={phase === gifts.length ? "#166534" : IND}
              fontFamily={numberFont}
            >
              {keeperIcon} still has {gifts[acting].after}
            </text>
          </motion.g>
        )}

        {/* ---------------- one card per taker ---------------- */}
        {gifts.map((g, k) => {
          const live = gone(k);
          const isNow = k === acting;
          return (
            <g key={g.name}>
              <motion.rect
                x={CX}
                y={cardY(k)}
                width={CW}
                height={CH}
                rx={9}
                fill={live ? "#fff" : "#f8fafc"}
                stroke={live ? g.color : "#e2e8f0"}
                strokeWidth={isNow ? 2 : 1.2}
                initial={false}
                animate={{ opacity: live ? 1 : 0.65 }}
              />
              <text x={CX + 12} y={cardY(k) + 30} fontSize="17" opacity={live ? 1 : 0.45}>
                {g.icon}
              </text>
              <text x={CX + 36} y={cardY(k) + 20} fontSize="11" fontWeight="800" fill={live ? g.color : "#94a3b8"}>
                {g.name}
              </text>
              <text x={CX + 34} y={cardY(k) + 36} fontSize="8.5" fontWeight="600" fill={live ? "#475569" : "#cbd5e1"}>
                {g.pct}% of the rest
              </text>

              {/* the count, and what it would have been off the full bag */}
              {live && (
                <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: isNow ? 0.25 : 0 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <text x={CX + 116} y={cardY(k) + 22} fontSize="12" fontWeight="800" fill={g.color} fontFamily={numberFont}>
                    {g.pct}% × {g.before} = {g.bite}
                  </text>
                  {g.naive !== g.bite && (
                    <text x={CX + 116} y={cardY(k) + 38} fontSize="9" fontWeight="700" fill={AMB}>
                      not {g.naive} — the bag shrank
                    </text>
                  )}
                </motion.g>
              )}

              {/* their marbles, flown in from the grid */}
              {live &&
                owner.map((o, i) => {
                  if (o !== k) return null;
                  const j = shareIndex(i);
                  const p = clusterPos(k, j);
                  return (
                    <motion.g
                      key={`c${i}`}
                      initial={isNow ? { x: gx(i) - p.x, y: gy(i) - p.y, scale: R / 2.6 } : false}
                      animate={{ x: 0, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 120, damping: 18, delay: isNow ? 0.4 + j * 0.03 : 0 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <Marble cx={p.x} cy={p.y} r={2.6} color={g.color} />
                    </motion.g>
                  );
                })}
            </g>
          );
        })}

        {/* ---------------- the closing arithmetic ---------------- */}
        {phase === 0 && (
          <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <text x={CX} y={cardY(gifts.length) + 16} fontSize="10.5" fontWeight="600" fill="#475569">
              the question asks for a percentage, so
            </text>
            <text x={CX} y={cardY(gifts.length) + 32} fontSize="10.5" fontWeight="600" fill="#475569">
              the real number of {unit} never matters —
            </text>
            <text x={CX} y={cardY(gifts.length) + 48} fontSize="10.5" fontWeight="600" fill="#475569">
              take {start}, and every share is a count.
            </text>
          </motion.g>
        )}

        {phase === gifts.length && gifts.length > 0 && (
          <g>
            <motion.text
              x={CX}
              y={cardY(gifts.length) + 18}
              fontSize="15"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
            >
              {kept} of {start} = {keptPct}%
            </motion.text>
            <motion.text
              x={CX}
              y={cardY(gifts.length) + 36}
              fontSize="10"
              fontWeight="700"
              fill="#64748b"
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              check: {gifts.map((g) => `${(g.den - g.numer)}/${g.den}`).join(" × ")} = {pn / pg}/{pd / pg} = {keptPct}%
            </motion.text>
            {trap && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
                <text x={CX} y={cardY(gifts.length) + 54} fontSize="9.5" fontWeight="700" fill={BAD}>
                  charging every gift to the first {start}:
                </text>
                <text x={CX} y={cardY(gifts.length) + 67} fontSize="9.5" fontWeight="700" fill={BAD}>
                  {start} − {gifts.map((g) => g.naive).join(" − ")} = {naiveKept}, choice {trap.label} — but only{" "}
                  {givenTotal} left the bag.
                </text>
              </motion.g>
            )}
          </g>
        )}
      </svg>

      <motion.span
        key={phase}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: phase === gifts.length ? "#166534" : "#4338ca",
          background: phase === gifts.length ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${phase === gifts.length ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {phase === gifts.length ? finalCaption : caption}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failed}</span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
