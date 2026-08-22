import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const EVEN = "#0d9488";
const ODD = "#d97706";
const WIN = "#16a34a";
const NODE = "#eef2ff";
const EDGE = "#c7d2fe";
const BODY = "#94a3b8";
const PANEL = "#f8fafc";

type Edge = { level: number; from: number; to: number; bonus: boolean };
type Test = { level: number; v: number; verdict: string; ok: boolean };

const parseChoice = (text: string) =>
  Number(String(text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));

/**
 * A machine with two chutes — a multiple of `d` gets divided by `d`, anything
 * else gets `a·N + b` — run a fixed number of steps, with the *final* output
 * given and every starting value wanted. Forwards the problem is hopeless: there
 * is no way to guess which N to feed in. The unlock is to **turn the machine
 * around** and grow the possibilities backwards from the output.
 *
 * Reversing makes the branching visible and, more importantly, *lopsided*. Every
 * value v has one guaranteed ancestor, `d·v`, since a multiple of d is always
 * divided back down. The second door, `(v − b)/a`, is the whole problem: it opens
 * only when that quotient is a whole number **and** is not itself a multiple of d
 * — an even quotient would have been halved instead of tripled, so it never
 * produced v at all. The scene legitimises the reverse rule on the contest's own
 * worked example rather than asserting it: reversing the example's second term
 * recovers exactly the value the problem started from.
 *
 * The tree is then laid out tidily (each parent sits at the mean of its children,
 * with a minimum-separation pass), so the three rare bonus branches read as gold
 * detours off an otherwise straight doubling spine, and the bottom row *is* the
 * answer set. Levels, edges, leaves and the sum are all computed, every leaf is
 * re-run forwards as a check, and the closing note prices the distractors by
 * searching for the subset of leaves whose omission produces each wrong choice —
 * on this problem all four are the sum with a branch missed.
 * Data: { target, steps, example?, divide?, mul?, add? }.
 */
export function ReverseMachineScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const d = Math.max(2, Math.round(num(data.divide, 2)));
  const a = Math.max(1, Math.round(num(data.mul, 3)));
  const b = Math.round(num(data.add, 1));
  const target = Math.max(1, Math.round(num(data.target, 1)));
  const steps = Math.max(1, Math.round(num(data.steps, 6)));
  const example = Math.max(1, Math.round(num(data.example, 0)));

  const forward = (p: number) => (p % d === 0 ? p / d : a * p + b);

  // the contest's own worked chain, recomputed rather than copied
  const exChain: number[] = [];
  if (example > 0) {
    let v = example;
    exChain.push(v);
    for (let i = 0; i < steps; i++) {
      v = forward(v);
      exChain.push(v);
    }
  }

  // grow backwards from the output: d·v always works, (v − b)/a only when it is
  // a whole positive number that is *not* a multiple of d
  const levels: number[][] = [[target]];
  const edges: Edge[] = [];
  const tests: Test[] = [];
  for (let l = 0; l < steps; l++) {
    const next: number[] = [];
    const push = (value: number, from: number, bonus: boolean) => {
      let i = next.indexOf(value);
      if (i < 0) {
        next.push(value);
        i = next.length - 1;
      }
      edges.push({ level: l, from, to: i, bonus });
    };
    levels[l].forEach((v, pi) => {
      push(d * v, pi, false);
      const q = (v - b) / a;
      const ok = Number.isInteger(q) && q > 0 && q % d !== 0;
      // record why the second door did or did not open, in the order tried
      tests.push({
        level: l,
        v,
        ok,
        verdict: !Number.isInteger(q)
          ? "is not a whole number"
          : q <= 0
          ? `= ${q}, not positive`
          : q % d === 0
          ? `= ${q}, a multiple of ${d}`
          : `= ${q}, ${d === 2 ? "odd" : `not a multiple of ${d}`}`,
      });
      if (ok) push(q, pi, true);
    });
    levels.push(next);
  }

  const leaves = levels[steps];
  const total = leaves.reduce((s, v) => s + v, 0);
  const bonusUpTo = (l: number) => edges.filter((e) => e.level < l && e.bonus).length;

  // every leaf really must reach the output in exactly this many steps
  const allReach = leaves.every((n) => {
    let v = n;
    for (let i = 0; i < steps; i++) v = forward(v);
    return v === target;
  });
  // the output itself surviving as a starting value is the sneaky one
  const targetIsLeaf = leaves.includes(target);
  const targetChain: number[] = [];
  if (targetIsLeaf) {
    let v = target;
    targetChain.push(v);
    for (let i = 0; i < steps; i++) {
      v = forward(v);
      targetChain.push(v);
    }
  }

  // price each wrong choice: the fewest leaves whose omission lands on it
  const wrong = (problem.choices ?? [])
    .map((c) => ({ label: String(c.label), value: parseChoice(String(c.text)) }))
    .filter((c) => Number.isFinite(c.value) && c.value !== total)
    .map((c) => {
      let best: number[] | null = null;
      for (let m = 1; m < 1 << leaves.length; m++) {
        const sub = leaves.filter((_, i) => m & (1 << i));
        if (total - sub.reduce((s, v) => s + v, 0) !== c.value) continue;
        if (!best || sub.length < best.length) best = sub;
      }
      return { ...c, missing: best };
    });
  const explained = wrong.filter((c) => c.missing);
  const forgotTarget = explained.find((c) => c.missing!.length === 1 && c.missing![0] === target);

  // ---- beats ----
  const last = totalSteps - 1;
  const isFinal = step >= last;
  const plan = totalSteps >= 5 ? [0, 1, 2, 3] : totalSteps === 4 ? [0, 1, 3] : totalSteps === 3 ? [0, 1] : [0];
  const beat = isFinal ? 4 : plan[Math.min(Math.max(step, 0), plan.length - 1)];
  const shown = beat === 2 ? Math.min(3, steps) : steps;

  // ---- geometry ----
  const W = 340;
  const H = 300;
  const topY = 40;
  const rowGap = 30;
  const nh = 22;
  const nw = 44;
  const bandL = 34;
  const bandR = W - 8;
  const rowY = (l: number) => topY + l * rowGap;

  // tidy layout: leaves spread evenly, every parent centred over its children,
  // then a separation pass so a wide level can never collide
  const xs: number[][] = levels.map((lv) => lv.map(() => 0));
  const kLeaf = Math.max(1, leaves.length);
  xs[steps] = leaves.map((_, i) => bandL + ((i + 0.5) * (bandR - bandL)) / kLeaf);
  for (let l = steps - 1; l >= 0; l--) {
    xs[l] = levels[l].map((_, i) => {
      const kids = edges.filter((e) => e.level === l && e.from === i).map((e) => xs[l + 1][e.to]);
      return kids.length ? kids.reduce((s, v) => s + v, 0) / kids.length : (bandL + bandR) / 2;
    });
  }
  for (let l = 0; l <= steps; l++) {
    const order = xs[l].map((_, i) => i).sort((p, q) => xs[l][p] - xs[l][q]);
    const gap = nw + 6;
    for (let j = 1; j < order.length; j++) {
      const prev = xs[l][order[j - 1]];
      if (xs[l][order[j]] - prev < gap) xs[l][order[j]] = prev + gap;
    }
    const lo = Math.min(...xs[l]);
    const hi = Math.max(...xs[l]);
    const shift = Math.max(bandL + nw / 2 - lo, Math.min(0, bandR - nw / 2 - hi));
    if (shift !== 0) xs[l] = xs[l].map((x) => x + shift);
  }

  const caption =
    beat === 0
      ? exChain.length
        ? `${steps} steps take ${example} to ${exChain[steps]} — which N lands on ${target}?`
        : `which N lands on ${target} after ${steps} steps?`
      : beat === 1
      ? `backwards: × ${d} always works, (v − ${b}) / ${a} only sometimes`
      : beat === 2
      ? `${shown} steps back: ${levels[shown].length} value${levels[shown].length === 1 ? "" : "s"}, the second door opened ${bonusUpTo(shown)}×`
      : beat === 3
      ? `${steps} steps back: ${leaves.length} possible starting values`
      : `${leaves.join(" + ")} = ${total}`;

  // ---- sum row (final beat) ----
  const sumY = 256;
  const sumH = 26;
  const tileW = 40;
  const opW = 16;
  const totalW = 54;
  const sumWidth = leaves.length * tileW + (leaves.length - 1) * opW + opW + totalW;
  const sumX0 = (W - sumWidth) / 2;
  const tileX = (i: number) => sumX0 + i * (tileW + opW);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {beat === 0 && <ForwardBeat W={W} d={d} a={a} b={b} chain={exChain} start={example} />}
        {beat === 1 && <ReverseBeat W={W} d={d} a={a} b={b} chain={exChain} />}

        {beat >= 2 && (
          <>
            {/* the two doors, colour-matched to the branches below */}
            {[
              { text: `× ${d}  always`, fill: EVEN, x: W / 2 - 96 },
              { text: `(v − ${b}) / ${a}  sometimes`, fill: ODD, x: W / 2 - 96 + 88 },
            ].map((chip, i) => (
              <motion.g
                key={`door${i}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 17, delay: i * 0.08 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <rect x={chip.x} y={6} width={i === 0 ? 80 : 152} height={18} rx={9} fill="#fff" stroke={chip.fill} strokeWidth={1.5} />
                <text x={chip.x + (i === 0 ? 40 : 76)} y={18.5} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={chip.fill} fontFamily={numberFont}>
                  {chip.text}
                </text>
              </motion.g>
            ))}

            {/* how many steps back each row sits */}
            {levels.slice(0, shown + 1).map((_, l) => (
              <text key={`g${l}`} x={16} y={rowY(l) + 15} textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                {l}
              </text>
            ))}

            {/* branches, drawn as they are taken */}
            {edges
              .filter((e) => e.level < shown)
              .map((e, i) => {
                const x1 = xs[e.level][e.from];
                const y1 = rowY(e.level) + nh;
                const x2 = xs[e.level + 1][e.to];
                const y2 = rowY(e.level + 1);
                return (
                  <motion.path
                    key={`e${i}`}
                    d={`M ${x1},${y1} C ${x1},${y1 + 10} ${x2},${y2 - 10} ${x2},${y2}`}
                    fill="none"
                    stroke={e.bonus ? ODD : EVEN}
                    strokeWidth={e.bonus ? 2.6 : 1.8}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: e.bonus ? 1 : 0.7 }}
                    transition={{ duration: 0.4, delay: 0.15 + e.level * 0.12 }}
                  />
                );
              })}

            {/* the values reachable this many steps before the output */}
            {levels.slice(0, shown + 1).map((vals, l) => (
              <g key={`lv${l}`}>
                {vals.map((v, i) => {
                  const leaf = beat === 4 && l === steps;
                  return (
                    <motion.g
                      key={`n${l}-${i}`}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 16, delay: l * 0.12 + i * 0.05 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <rect
                        x={xs[l][i] - nw / 2}
                        y={rowY(l)}
                        width={nw}
                        height={nh}
                        rx={6}
                        fill={leaf ? "#dcfce7" : l === 0 ? "#fff" : NODE}
                        stroke={leaf ? WIN : l === 0 ? INK : EDGE}
                        strokeWidth={leaf || l === 0 ? 2 : 1.4}
                      />
                      <text
                        x={xs[l][i]}
                        y={rowY(l) + 15}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="800"
                        fill={leaf ? "#166534" : INK}
                        fontFamily={numberFont}
                      >
                        {v}
                      </text>
                    </motion.g>
                  );
                })}
              </g>
            ))}

            {/* why the second door opened where it did: the real tests, in the
                order the search tried them */}
            {beat === 2 && (
              <g>
                <motion.text
                  x={W / 2}
                  y={rowY(shown) + nh + 26}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="800"
                  fill={DIM}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  the second door, tried at every value so far
                </motion.text>
                {tests
                  .filter((t) => t.level < shown)
                  .slice(-5)
                  .map((t, i) => (
                    <motion.text
                      key={`t${i}`}
                      x={W / 2}
                      y={rowY(shown) + nh + 48 + i * 20}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fill={t.ok ? ODD : DIM}
                      fontFamily={numberFont}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.75 + i * 0.18 }}
                    >
                      {`(${t.v} − ${b}) / ${a} ${t.verdict}  ${t.ok ? "✓" : "✗"}`}
                    </motion.text>
                  ))}
              </g>
            )}

            {/* the row that answers the question — under the row, clear of the
                band the branches run through (on the final beat the sum row
                takes this space instead) */}
            {beat === 3 && (
              <motion.text
                x={W / 2}
                y={rowY(steps) + nh + 18}
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill={INK}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                these are the starting values N
              </motion.text>
            )}

            {/* the leaves lift out of the tree and add up */}
            {beat === 4 && (
              <>
                {leaves.map((v, i) => (
                  <motion.g
                    key={`s${i}`}
                    initial={{ opacity: 0, x: xs[steps][i] - (tileX(i) + tileW / 2), y: rowY(steps) - sumY }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ type: "spring", stiffness: 210, damping: 20, delay: 0.5 + i * 0.1 }}
                  >
                    <rect x={tileX(i)} y={sumY} width={tileW} height={sumH} rx={7} fill="#dcfce7" stroke={WIN} strokeWidth={1.8} />
                    <text x={tileX(i) + tileW / 2} y={sumY + 18} textAnchor="middle" fontSize="13" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                      {v}
                    </text>
                  </motion.g>
                ))}
                {leaves.slice(1).map((_, i) => (
                  <motion.text
                    key={`p${i}`}
                    x={tileX(i) + tileW + opW / 2}
                    y={sumY + 18}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    fill={DIM}
                    fontFamily={numberFont}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                  >
                    +
                  </motion.text>
                ))}
                <motion.g
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 15, delay: 1.05 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <text x={tileX(leaves.length - 1) + tileW + opW / 2} y={sumY + 18} textAnchor="middle" fontSize="13" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                    =
                  </text>
                  <rect x={tileX(leaves.length - 1) + tileW + opW} y={sumY} width={totalW} height={sumH} rx={7} fill={WIN} />
                  <text
                    x={tileX(leaves.length - 1) + tileW + opW + totalW / 2}
                    y={sumY + 18}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="800"
                    fill="#fff"
                    fontFamily={numberFont}
                  >
                    {total}
                  </text>
                </motion.g>
              </>
            )}
          </>
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
          color: beat === 4 ? "#166534" : "#4338ca",
          background: beat === 4 ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${beat === 4 ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 4 && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", lineHeight: 1.5 }}
          >
            {allReach
              ? `each of ${leaves.join(", ")} reaches ${target} in exactly ${steps} steps`
              : `check failed: a listed value does not reach ${target} in ${steps} steps`}
            {targetIsLeaf && <br />}
            {targetIsLeaf && `N = ${target} counts too: ${targetChain.join(" → ")}`}
            {explained.length > 0 && <br />}
            {explained.length === wrong.length && wrong.length > 0
              ? forgotTarget
                ? `every other choice is ${total} with a branch missed — ${forgotTarget.label} forgets N = ${target}`
                : `every other choice is ${total} with a branch missed`
              : explained.length > 0
              ? `${explained.map((c) => `${c.label} drops ${c.missing!.join(" and ")}`).join("; ")}`
              : ""}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {beat === 4 && problem.answer && (
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

/** The machine box from the contest figure: body, dial and two vents. */
function MachineBox({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={60} height={90} rx={4} fill={BODY} />
      <circle cx={x + 30} cy={y + 26} r={15} fill={PANEL} />
      <circle cx={x + 30} cy={y + 26} r={7} fill={BODY} />
      <rect x={x + 8} y={y + 52} width={44} height={14} rx={2} fill={PANEL} />
      <rect x={x + 12} y={y + 55} width={36} height={8} rx={1} fill={BODY} />
      <rect x={x + 8} y={y + 70} width={44} height={14} rx={2} fill={PANEL} />
      <rect x={x + 12} y={y + 73} width={36} height={8} rx={1} fill={BODY} />
    </g>
  );
}

/** Beat 1: the machine as given, running the contest's own worked example. */
function ForwardBeat({ W, d, a, b, chain, start }: { W: number; d: number; a: number; b: number; chain: number[]; start: number }) {
  const mx = 112;
  const my = 34;
  const pillW = 30;
  const pillGap = 14;
  const rowW = chain.length * pillW + Math.max(0, chain.length - 1) * pillGap;
  const px = (i: number) => (W - rowW) / 2 + i * (pillW + pillGap);
  return (
    <g>
      <MachineBox x={mx} y={my} />

      {/* N goes in */}
      <motion.path
        d={`M 28,${my + 45} L ${mx - 4},${my + 45}`}
        stroke={INK}
        strokeWidth={1.8}
        fill="none"
        markerEnd=""
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4 }}
      />
      <path d={`M ${mx - 4},${my + 45} l -8,-4 l 0,8 z`} fill={INK} />
      <text x={20} y={my + 49} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
        N
      </text>
      {start > 0 && (
        <motion.g initial={{ x: -70, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.35 }}>
          <circle cx={78} cy={my + 45} r={12} fill="#fff" stroke={INK} strokeWidth={1.8} />
          <text x={78} y={my + 49} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
            {start}
          </text>
        </motion.g>
      )}

      {/* the two chutes */}
      {[
        { y: my + 22, label: `if N is even`, out: `N / ${d}`, color: EVEN },
        { y: my + 72, label: `if N is odd`, out: `${a}N + ${b}`, color: ODD },
      ].map((c, i) => (
        <motion.g key={`ch${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 + i * 0.15 }}>
          <text x={208} y={c.y - 6} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={c.color} fontFamily={numberFont}>
            {c.label}
          </text>
          <path d={`M ${mx + 62},${c.y} L 240,${c.y}`} stroke={c.color} strokeWidth={1.8} fill="none" />
          <path d={`M 244,${c.y} l -8,-4 l 0,8 z`} fill={c.color} />
          <text x={250} y={c.y + 4} fontSize="11.5" fontWeight="800" fill={c.color} fontFamily={numberFont}>
            {c.out}
          </text>
        </motion.g>
      ))}

      {/* the chain the problem hands us, recomputed */}
      {chain.length > 1 && (
        <>
          <motion.text
            x={W / 2}
            y={158}
            textAnchor="middle"
            fontSize="10"
            fontWeight="800"
            fill={DIM}
            fontFamily={numberFont}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            the {chain.length - 1} steps the problem shows us
          </motion.text>
          {chain.map((v, i) => (
            <motion.g
              key={`pl${i}`}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 16, delay: 1.15 + i * 0.12 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect
                x={px(i)}
                y={170}
                width={pillW}
                height={24}
                rx={7}
                fill="#fff"
                stroke={v % d === 0 ? EVEN : ODD}
                strokeWidth={1.8}
              />
              <text x={px(i) + pillW / 2} y={186} textAnchor="middle" fontSize="11" fontWeight="800" fill={v % d === 0 ? EVEN : ODD} fontFamily={numberFont}>
                {v}
              </text>
            </motion.g>
          ))}
          {chain.slice(0, -1).map((v, i) => (
            <motion.path
              key={`ar${i}`}
              d={`M ${px(i) + pillW + 1},182 L ${px(i + 1) - 5},182`}
              stroke={v % d === 0 ? EVEN : ODD}
              strokeWidth={1.6}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: 1.22 + i * 0.12 }}
            />
          ))}
          <motion.text
            x={W / 2}
            y={214}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill={DIM}
            fontFamily={numberFont}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1 }}
          >
            teal = halved · amber = tripled
          </motion.text>
          <motion.text
            x={W / 2}
            y={238}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill={INK}
            fontFamily={numberFont}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.25 }}
          >
            but we are given the last number, not the first
          </motion.text>
          <motion.text
            x={W / 2}
            y={258}
            textAnchor="middle"
            fontSize="11"
            fontWeight="800"
            fill={INK}
            fontFamily={numberFont}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
          >
            so run the machine backwards
          </motion.text>
        </>
      )}
    </g>
  );
}

/**
 * Beat 2: the same machine read right to left. The reverse rule is checked
 * against the contest's own example — reversing its second term recovers the
 * value the problem started from.
 */
function ReverseBeat({ W, d, a, b, chain }: { W: number; d: number; a: number; b: number; chain: number[] }) {
  const mx = 140;
  const my = 46;
  // the example's second term is a value we know both inputs of
  const v = chain.length > 1 ? chain[1] : 0;
  const doubled = d * v;
  const q = (v - b) / a;
  const qOk = Number.isInteger(q) && q > 0 && q % d !== 0;

  const doors = [
    { y: my + 22, label: `× ${d}`, note: "always", value: doubled, color: EVEN },
    { y: my + 72, label: `(v − ${b}) / ${a}`, note: "sometimes", value: qOk ? q : null, color: ODD },
  ];

  return (
    <g>
      <MachineBox x={mx} y={my} />

      {/* the known output arrives from the right */}
      <motion.g initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 130, damping: 18 }}>
        <rect x={264} y={my + 33} width={44} height={24} rx={7} fill="#fff" stroke={INK} strokeWidth={2} />
        <text x={286} y={my + 49} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {v}
        </text>
      </motion.g>
      <text x={286} y={my + 26} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={numberFont}>
        output v
      </text>
      <motion.path
        d={`M 260,${my + 45} L ${mx + 66},${my + 45}`}
        stroke={INK}
        strokeWidth={1.8}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, delay: 0.3 }}
      />
      <path d={`M ${mx + 62},${my + 45} l 8,-4 l 0,8 z`} fill={INK} />

      {/* the two ways in */}
      {doors.map((door, i) => (
        <motion.g key={`dr${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.25 }}>
          <text x={98} y={door.y - 8} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={door.color} fontFamily={numberFont}>
            {door.label}
          </text>
          <path d={`M ${mx - 6},${door.y} L 68,${door.y}`} stroke={door.color} strokeWidth={2} fill="none" strokeDasharray={door.value == null ? "4 4" : undefined} />
          <path d={`M 64,${door.y} l 8,-4 l 0,8 z`} fill={door.color} />
          <text x={104} y={door.y + 14} textAnchor="middle" fontSize="9" fontWeight="700" fill={DIM} fontFamily={numberFont}>
            {door.note}
          </text>
          {door.value != null && (
            <motion.g
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 18, delay: 1 + i * 0.25 }}
            >
              <rect x={16} y={door.y - 12} width={44} height={24} rx={7} fill="#fff" stroke={door.color} strokeWidth={2} />
              <text x={38} y={door.y + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={door.color} fontFamily={numberFont}>
                {door.value}
              </text>
            </motion.g>
          )}
        </motion.g>
      ))}

      {/* both really are inputs that produce v — checked on the given chain */}
      <motion.text
        x={W / 2}
        y={172}
        textAnchor="middle"
        fontSize="10.5"
        fontWeight="700"
        fill={EVEN}
        fontFamily={numberFont}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {`${doubled} is a multiple of ${d}, so it is halved to ${v}`}
      </motion.text>
      {qOk && (
        <>
          <motion.text
            x={W / 2}
            y={192}
            textAnchor="middle"
            fontSize="10.5"
            fontWeight="700"
            fill={ODD}
            fontFamily={numberFont}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
          >
            {`${q} is odd, so it becomes ${a}·${q} + ${b} = ${v}`}
          </motion.text>
          <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 15, delay: 2 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={W / 2 - 138} y={204} width={276} height={22} rx={11} fill="#dcfce7" stroke={WIN} strokeWidth={1.4} />
            <text x={W / 2} y={219} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#166534" fontFamily={numberFont}>
              {`and the problem's own chain starts ${q} → ${v} ✓`}
            </text>
          </motion.g>
        </>
      )}
      <motion.text
        x={W / 2}
        y={248}
        textAnchor="middle"
        fontSize="10.5"
        fontWeight="800"
        fill={INK}
        fontFamily={numberFont}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        {`an even quotient would have been halved, not tripled`}
      </motion.text>
      <motion.text
        x={W / 2}
        y={266}
        textAnchor="middle"
        fontSize="10.5"
        fontWeight="800"
        fill={INK}
        fontFamily={numberFont}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.35 }}
      >
        — so that door stays shut
      </motion.text>
    </g>
  );
}
