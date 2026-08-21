import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WARN = "#b45309";

type Item = { name: string; color: string; short: string; pattern: string };

const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

function permute<T>(a: T[]): T[][] {
  if (a.length <= 1) return [a];
  return a.flatMap((v, i) => permute([...a.slice(0, i), ...a.slice(i + 1)]).map((r) => [v, ...r]));
}

/**
 * Arranging a row of distinct objects where **two named ones may not sit next to
 * each other**. Counting the good arrangements head-on means casework on where
 * the pair lands; the move is to count the *banned* ones instead, and those have
 * a shape: if the two must touch they behave as a **single glued block**, so the
 * row holds one fewer object and the count collapses to `(n−1)!` — times 2,
 * because the block can be laid down either way round.
 *
 * That `× 2` is the whole difficulty, and the scene gives it its own beat with a
 * real flip, because skipping it leaves `n! − (n−1)!` — which on 2020-10 is
 * exactly choice D. The closing beat prices the other two slips as well (taking
 * `n!` and ignoring the rule; stopping at `(n−1)!`), each recomputed and matched
 * against `problem.choices`, which here accounts for four of the five options.
 *
 * Everything is **enumerated**: all `n!` orders are generated and split by
 * whether the pair is adjacent, so the counts are discovered, and the closed form
 * `(n−1)! × 2` is then *checked* against the enumeration rather than assumed. The
 * survivors are drawn as a real gallery, so the answer can be counted off the
 * picture. Data
 * `{ items: ["Aggie|#b45309|A|band", ...], pair: ["Steelie","Tiger"], mode?: "apart" }`.
 */
export function GlueBlockScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const items: Item[] = (Array.isArray(data.items) ? data.items : []).map((raw) => {
    const [name, color, short, pattern] = String(raw).split("|");
    return {
      name: name ?? "",
      color: color || "#64748b",
      short: short || (name ?? "?").slice(0, 1),
      pattern: pattern || "plain",
    };
  });
  const pair = (Array.isArray(data.pair) ? data.pair : []).map(String);
  const mode = data.mode === "together" ? "together" : "apart";
  const n = items.length;
  const byName = (nm: string) => items.find((i) => i.name === nm);

  // ---- enumerate every order, then split on the banned adjacency ----
  const names = items.map((i) => i.name);
  const all = n > 0 && n <= 7 ? permute(names) : [];
  const touching = (order: string[]) => Math.abs(order.indexOf(pair[0]) - order.indexOf(pair[1])) === 1;
  const banned = all.filter(touching);
  const allowed = all.filter((o) => !touching(o));
  const survivors = mode === "apart" ? allowed : banned;

  const totalOrders = all.length;
  const blockOrders = factorial(n - 1);
  const bannedClosed = blockOrders * 2;
  const answer = survivors.length;

  // ---- the natural slips, recomputed and matched to the real answer list ----
  const choiceFor = (v: number) => {
    const t = String(Math.round(v));
    const hit = (problem.choices ?? []).find(
      (c) => String(c.text).replace(/[−–—]/g, "-").replace(/[^\d-]/g, "") === t
    );
    return hit ? hit.label : null;
  };
  const forgetFlip = totalOrders - blockOrders;
  const slips = [
    { value: totalOrders, why: "ignore the rule" },
    { value: forgetFlip, why: "forget the block flips" },
    { value: blockOrders, why: "stop at the block orders" },
  ]
    .map((s) => ({ ...s, letter: choiceFor(s.value) }))
    .filter((s) => s.letter && s.value !== answer);
  const accounted = new Set([...slips.map((s) => s.letter), problem.answer]).size;

  // ---- self-checks: the closed form must match the enumeration ----
  const pairOk = pair.length === 2 && pair.every((p) => byName(p));
  const splitOk = banned.length + allowed.length === totalOrders;
  const closedOk = banned.length === bannedClosed;
  const answerOk = problem.shortAnswer == null || String(answer) === String(problem.shortAnswer).replace(/[^\d]/g, "");
  const ok = pairOk && splitOk && closedOk && answerOk && totalOrders > 0;
  const failure = !pairOk
    ? "the banned pair does not name two of the items"
    : totalOrders === 0
    ? "no items to arrange"
    : !splitOk
    ? "the split does not cover every arrangement"
    : !closedOk
    ? `${banned.length} banned by count but ${bannedClosed} by (n−1)! × 2`
    : `counted ${answer}, answer says ${problem.shortAnswer}`;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 262;

  /** One marble: coloured glass, its own banding, and a specular highlight. */
  const Marble = ({ cx, cy, r, item }: { cx: number; cy: number; r: number; item?: Item }) => {
    if (!item) return null;
    // stripe chords sit inside the circle: half-length = sqrt(r² − d²)
    const chord = (d: number) => Math.sqrt(Math.max(0, r * r - d * d)) * 0.88;
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill={item.color} fillOpacity={0.9} stroke={INK} strokeWidth={Math.max(0.8, r * 0.09)} />
        {item.pattern === "stripe" &&
          [-0.38, 0.12].map((f) => {
            const d = f * r;
            return (
              <line
                key={f}
                x1={cx - chord(d)}
                y1={cy + d}
                x2={cx + chord(d)}
                y2={cy + d}
                stroke={INK}
                strokeOpacity={0.42}
                strokeWidth={r * 0.24}
                strokeLinecap="round"
              />
            );
          })}
        {item.pattern === "band" && (
          <line
            x1={cx - chord(0)}
            y1={cy}
            x2={cx + chord(0)}
            y2={cy}
            stroke="#fff"
            strokeOpacity={0.6}
            strokeWidth={r * 0.34}
            strokeLinecap="round"
          />
        )}
        <ellipse cx={cx - r * 0.32} cy={cy - r * 0.36} rx={r * 0.26} ry={r * 0.17} fill="#fff" fillOpacity={0.8} transform={`rotate(-32 ${cx - r * 0.32} ${cy - r * 0.36})`} />
      </g>
    );
  };

  /** A row of marbles with their initials underneath. */
  const Row = ({
    order,
    x0,
    cy,
    r,
    pitch,
    labels = true,
    ring,
  }: {
    order: string[];
    x0: number;
    cy: number;
    r: number;
    pitch: number;
    labels?: boolean;
    ring?: string[];
  }) => (
    <g>
      {ring &&
        (() => {
          const idx = ring.map((nm) => order.indexOf(nm)).filter((i) => i >= 0).sort((a, b) => a - b);
          if (idx.length < 2) return null;
          const a = x0 + idx[0] * pitch;
          const b = x0 + idx[idx.length - 1] * pitch;
          return (
            <rect
              x={a - r - 4}
              y={cy - r - 4}
              width={b - a + 2 * r + 8}
              height={2 * r + 8}
              rx={r + 4}
              fill="none"
              stroke={BAD}
              strokeWidth={1.8}
              strokeDasharray="4 3"
            />
          );
        })()}
      {order.map((nm, i) => (
        <g key={nm}>
          <Marble cx={x0 + i * pitch} cy={cy} r={r} item={byName(nm)} />
          {labels && (
            <text x={x0 + i * pitch} y={cy + r + 10} textAnchor="middle" fontSize={Math.max(6.5, r * 0.6)} fontWeight="800" fill={DIM} fontFamily={numberFont}>
              {byName(nm)?.short}
            </text>
          )}
        </g>
      ))}
    </g>
  );

  const others = names.filter((nm) => !pair.includes(nm));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ============ phase 0: every arrangement, rule ignored ============ */}
        {phase === 0 &&
          (() => {
            const R = 20;
            const PITCH = 74;
            const X0 = (W - (n - 1) * PITCH) / 2;
            const SHELF = 150;
            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  first ignore the rule: how many ways fill the shelf at all?
                </text>

                {/* the shelf */}
                <rect x={X0 - 44} y={SHELF} width={(n - 1) * PITCH + 88} height={7} rx={3} fill="#cbd5e1" />
                <rect x={X0 - 34} y={SHELF + 7} width={10} height={16} fill="#cbd5e1" />
                <rect x={X0 + (n - 1) * PITCH + 24} y={SHELF + 7} width={10} height={16} fill="#cbd5e1" />

                {names.map((nm, i) => (
                  <g key={nm}>
                    {/* how many marbles are still unplaced when this slot is filled */}
                    <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.2 + i * 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                      <circle cx={X0 + i * PITCH} cy={62} r={13} fill={IND} fillOpacity={0.14} stroke={IND} strokeWidth={1.4} />
                      <text x={X0 + i * PITCH} y={66} textAnchor="middle" fontSize="12" fontWeight="800" fill={IND} fontFamily={numberFont}>
                        {n - i}
                      </text>
                    </motion.g>
                    <text x={X0 + i * PITCH} y={40} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM}>
                      choices
                    </text>
                    {/* the marble drops onto the shelf */}
                    <motion.g initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 170, damping: 13, delay: 0.45 + i * 0.3 }}>
                      <Marble cx={X0 + i * PITCH} cy={SHELF - R} r={R} item={byName(nm)} />
                    </motion.g>
                    <text x={X0 + i * PITCH} y={SHELF + 36} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={INK}>
                      {byName(nm)?.name}
                    </text>
                  </g>
                ))}

                <motion.text x={W / 2} y={210} textAnchor="middle" fontSize="15" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }}>
                  {names.map((_, i) => n - i).join(" × ")} = {totalOrders}
                </motion.text>
                <motion.text x={W / 2} y={238} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.95 }}>
                  now: how many of those {totalOrders} put {byName(pair[0])?.name} next to {byName(pair[1])?.name}?
                </motion.text>
              </g>
            );
          })()}

        {/* ============ phase 1: glue the banned pair — n things become n−1 ============ */}
        {phase === 1 &&
          (() => {
            const R = 15;
            const PITCH = 44;
            const example = banned[0] ?? names;
            const exX0 = (W - (n - 1) * PITCH) / 2;
            const BR = 16;
            const BP = 34;
            // the three objects: the others, then the glued block
            const slotW = [...others.map(() => BP), BP * 2 + 14];
            const totalW = slotW.reduce((a, b) => a + b, 0) + (slotW.length - 1) * 26;
            let run = (W - totalW) / 2;
            const slots = slotW.map((w) => {
              const x = run;
              run += w + 26;
              return x;
            });
            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  count the banned ones instead — glue the pair together
                </text>

                {/* a genuine banned arrangement, with the offending pair ringed */}
                <Row order={example} x0={exX0} cy={62} r={R} pitch={PITCH} ring={pair} />
                <motion.text x={W / 2} y={98} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={BAD} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  ✗ touching — banned
                </motion.text>

                <motion.text x={W / 2} y={124} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  if they must touch, they travel as one piece
                </motion.text>

                {/* the n−1 objects */}
                {others.map((nm, i) => (
                  <motion.g key={nm} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.1 + i * 0.15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <Marble cx={slots[i] + BP / 2} cy={166} r={BR} item={byName(nm)} />
                  </motion.g>
                ))}
                {/* the glued block slides shut */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                  <rect x={slots[others.length] - 2} y={166 - BR - 8} width={BP * 2 + 18} height={2 * BR + 16} rx={10} fill={IND} fillOpacity={0.08} stroke={IND} strokeWidth={1.8} />
                  <text x={slots[others.length] + BP + 7} y={166 + BR + 20} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={IND}>
                    one piece
                  </text>
                </motion.g>
                {pair.map((nm, i) => (
                  <motion.g
                    key={nm}
                    initial={{ x: i === 0 ? -40 : 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 90, damping: 15, delay: 1.55 }}
                  >
                    <Marble cx={slots[others.length] + 7 + BP / 2 + i * BP} cy={166} r={BR} item={byName(nm)} />
                  </motion.g>
                ))}

                <motion.text x={W / 2} y={228} textAnchor="middle" fontSize="14" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0 }}>
                  {n - 1} pieces to arrange: {Array.from({ length: n - 1 }, (_, i) => n - 1 - i).join(" × ")} = {blockOrders}
                </motion.text>
                <motion.text x={W / 2} y={250} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
                  gluing two together drops the row from {n} pieces to {n - 1}
                </motion.text>
              </g>
            );
          })()}

        {/* ============ phase 2: the block has two faces ============ */}
        {phase === 2 &&
          (() => {
            const R = 17;
            const PITCH = 48;
            const X0 = (W - (n - 1) * PITCH) / 2;
            const base = banned[0] ?? names;
            const flipped = base.map((nm) => (nm === pair[0] ? pair[1] : nm === pair[1] ? pair[0] : nm));
            const idx = pair.map((nm) => base.indexOf(nm)).sort((a, b) => a - b);
            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  but the glued piece can be laid down either way round
                </text>

                {[
                  { order: base, cy: 66, delay: 0.2, tag: `${byName(pair[0])?.short} then ${byName(pair[1])?.short}` },
                  { order: flipped, cy: 158, delay: 1.0, tag: `${byName(pair[1])?.short} then ${byName(pair[0])?.short}`, swap: true },
                ].map((row) => (
                  <g key={row.tag}>
                    <rect x={X0 + idx[0] * PITCH - R - 5} y={row.cy - R - 5} width={PITCH + 2 * R + 10} height={2 * R + 10} rx={R + 5} fill={IND} fillOpacity={0.08} stroke={IND} strokeWidth={1.6} />
                    {row.order.map((nm, i) => {
                      // the two glued marbles swap seats between the rows
                      const swapDelta = row.swap && pair.includes(nm) ? (nm === pair[1] ? PITCH : -PITCH) : 0;
                      return (
                        <motion.g
                          key={nm}
                          initial={{ x: swapDelta, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 80, damping: 15, delay: row.delay + i * 0.06 }}
                        >
                          <Marble cx={X0 + i * PITCH} cy={row.cy} r={R} item={byName(nm)} />
                        </motion.g>
                      );
                    })}
                    <text x={X0 + idx[0] * PITCH + PITCH / 2} y={row.cy + R + 20} textAnchor="middle" fontSize="9" fontWeight="800" fill={IND} fontFamily={numberFont}>
                      {row.tag}
                    </text>
                  </g>
                ))}

                <motion.text x={W / 2} y={118} textAnchor="middle" fontSize="10" fontWeight="800" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  ↻ same piece, flipped — a different arrangement
                </motion.text>

                <motion.text x={W / 2} y={218} textAnchor="middle" fontSize="14.5" fontWeight="800" fill={BAD} fontFamily={numberFont} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }}>
                  {blockOrders} × 2 = {bannedClosed} banned
                </motion.text>
                <motion.text x={W / 2} y={242} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
                  every one of the {blockOrders} orders counts twice
                </motion.text>
              </g>
            );
          })()}

        {/* ============ phase 3: subtract, and count the survivors ============ */}
        {phase === 3 &&
          (() => {
            const R = 8;
            const PITCH = 19;
            const COLS = 4;
            const COLP = 108;
            const ROWP = 40;
            const gx = (c: number) => 30 + c * COLP;
            const gy = (r: number) => 78 + r * ROWP;
            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  take the banned ones away and count what is left
                </text>
                <motion.text
                  x={W / 2}
                  y={46}
                  textAnchor="middle"
                  fontSize="17"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {totalOrders} − {bannedClosed} = {answer}
                </motion.text>

                {survivors.slice(0, COLS * 3).map((order, k) => {
                  const c = k % COLS;
                  const r = Math.floor(k / COLS);
                  return (
                    <motion.g
                      key={order.join("")}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 250, damping: 17, delay: 0.5 + k * 0.055 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <Row order={order} x0={gx(c)} cy={gy(r)} r={R} pitch={PITCH} />
                    </motion.g>
                  );
                })}

                <motion.text x={W / 2} y={214} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={WIN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                  {answer <= COLS * 3 ? `all ${answer} drawn` : `${COLS * 3} of the ${answer} drawn`} — {byName(pair[0])?.name} never touches {byName(pair[1])?.name}
                </motion.text>
                {slips.length > 0 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                    <text x={W / 2} y={234} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={BAD}>
                      {slips.map((s) => `${s.letter} ${s.value}: ${s.why}`).join("   ·   ")}
                    </text>
                    <text x={W / 2} y={248} textAnchor="middle" fontSize="8" fontWeight="700" fill={DIM}>
                      {accounted} of the {(problem.choices ?? []).length} choices are exactly these slips
                    </text>
                  </motion.g>
                )}
              </g>
            );
          })()}
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
          color: phase === 3 ? "#166534" : "#4338ca",
          background: phase === 3 ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${phase === 3 ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {phase === 0
          ? `${n}! = ${totalOrders} arrangements in all`
          : phase === 1
          ? `glued: ${n - 1} pieces, ${blockOrders} orders`
          : phase === 2
          ? `${bannedClosed} of the ${totalOrders} are banned`
          : `${answer} keep them apart`}
      </motion.span>

      {!ok && <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>}

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
