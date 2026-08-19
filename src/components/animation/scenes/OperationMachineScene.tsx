import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const CUT = "#fecaca";

type Kind = "sq-diff" | "diff-sq";

const OPS: Record<Kind, { form: (x: string, y: string) => string; calc: (x: number, y: number) => number }> = {
  "sq-diff": { form: (x, y) => `${x}² − ${y}²`, calc: (x, y) => x * x - y * y },
  "diff-sq": { form: (x, y) => `(${x} − ${y})²`, calc: (x, y) => (x - y) ** 2 },
};

/**
 * Two made-up operations applied one after the other. The pair is always the
 * same joke — one squares *then* subtracts and the other subtracts *then*
 * squares — so the whole problem is whether you reach for the right machine at
 * the right moment, and the scene makes that concrete by drawing each operation
 * as **area**: `a² − b²` is a big square with a small one lifted out of its
 * corner, leaving an L that can be counted, while `(a − b)²` is a single square
 * built on the shortened side. Feeding both machines the *same* inputs on the
 * opening beat shows them handing back visibly different amounts of stuff.
 * The closing beat is the real payoff: the scene evaluates **every route through
 * the two machines** — first-then-second, first-twice, second-twice,
 * second-then-first — plus stopping after one, matches each value against
 * `problem.choices`, and finds that on a well-made problem they account for the
 * entire answer list, so each distractor is named as the exact slip that
 * produces it. Values, routes and the choice matching are all computed; data
 * `{ a, b, c, first, second, symbols? }` with each op one of `sq-diff` or
 * `diff-sq`.
 */
export function OperationMachineScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const a = Math.round(num(data.a, 5));
  const b = Math.round(num(data.b, 3));
  const c = Math.round(num(data.c, 6));
  const k1 = (String(data.first) in OPS ? String(data.first) : "sq-diff") as Kind;
  const k2 = (String(data.second) in OPS ? String(data.second) : "diff-sq") as Kind;
  const sym = (Array.isArray(data.symbols) ? data.symbols : ["◆", "★"]).map((s) => String(s));
  const S1 = sym[0] ?? "◆";
  const S2 = sym[1] ?? "★";

  const mid = OPS[k1].calc(a, b);
  const out = OPS[k2].calc(mid, c);
  const alt = OPS[k2].calc(a, b); // the other machine on the same first inputs

  // ---- every route through the two machines, plus stopping early ----
  const kinds: [Kind, string][] = [
    [k1, S1],
    [k2, S2],
  ];
  const routes: { label: string; value: number; asked: boolean }[] = [];
  for (const [f, fs] of kinds) {
    for (const [s, ss] of kinds) {
      routes.push({
        label: `${fs} then ${ss}`,
        value: OPS[s].calc(OPS[f].calc(a, b), c),
        asked: f === k1 && s === k2,
      });
    }
  }
  routes.push({ label: `stop after ${S1}`, value: mid, asked: false });

  const choiceOf = (v: number) =>
    (problem.choices ?? []).find(
      (ch) => Number(String(ch.text).replace(/[\u2212\u2013\u2014]/g, "-").replace(/[^\d-]/g, "")) === v,
    )?.label ?? null;
  const covered = routes.filter((r) => choiceOf(r.value) != null).length;
  const allChoices = (problem.choices ?? []).length;

  const answerOk = problem.shortAnswer == null || String(out) === String(problem.shortAnswer).trim();
  const ok = answerOk && routes.filter((r) => r.asked).length === 1;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 262;

  /** A grid of unit cells, optionally with a corner block marked as removed. */
  const Grid = ({
    x,
    y,
    n,
    cell,
    cut,
    color,
    delay,
    lift,
  }: {
    x: number;
    y: number;
    n: number;
    cell: number;
    cut?: number;
    color: string;
    delay: number;
    lift?: boolean;
  }) => (
    <g>
      {Array.from({ length: n * n }, (_, i) => {
        const r = Math.floor(i / n);
        const cIdx = i % n;
        const isCut = cut != null && r < cut && cIdx < cut;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={
              isCut && lift
                ? { opacity: [1, 1, 0], scale: 1, x: [0, 0, -26], y: [0, 0, 30] }
                : { opacity: 1, scale: 1 }
            }
            transition={
              isCut && lift
                ? { duration: 2, times: [0, 0.45, 1], delay: delay + 0.6 }
                : { type: "spring", stiffness: 300, damping: 18, delay: delay + i * 0.012 }
            }
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <rect
              x={x + cIdx * cell}
              y={y + r * cell}
              width={cell}
              height={cell}
              fill={isCut ? CUT : color}
              fillOpacity={isCut ? 1 : 0.4}
              stroke={isCut ? BAD : color}
              strokeWidth={0.8}
            />
          </motion.g>
        );
      })}
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ================= phase 0: the two machines on the same inputs ================= */}
        {phase === 0 &&
          (() => {
            const cell = 15;
            const base = 168;
            return (
              <g>
                <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  one squares then subtracts, the other subtracts then squares
                </text>
                {[
                  { s: S1, k: k1, val: mid, col: IND, cx: 118, side: a, cut: b },
                  { s: S2, k: k2, val: alt, col: TEAL, cx: 352, side: Math.abs(a - b), cut: undefined as number | undefined },
                ].map((m, i) => (
                  <g key={m.s}>
                    <text x={m.cx} y={44} textAnchor="middle" fontSize="13" fontWeight="800" fill={m.col} fontFamily={numberFont}>
                      a {m.s} b = {OPS[m.k].form("a", "b")}
                    </text>
                    <Grid
                      x={m.cx - (m.side * cell) / 2}
                      y={base - m.side * cell}
                      n={m.side}
                      cell={cell}
                      cut={m.cut}
                      color={m.col}
                      delay={0.2 + i * 0.5}
                    />
                    <text x={m.cx} y={base + 18} textAnchor="middle" fontSize="11" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                      {a} {m.s} {b} = {OPS[m.k].form(String(a), String(b))}
                    </text>
                    <motion.text
                      x={m.cx}
                      y={base + 40}
                      textAnchor="middle"
                      fontSize="17"
                      fontWeight="800"
                      fill={m.col}
                      fontFamily={numberFont}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.1 + i * 0.4 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      {m.val}
                    </motion.text>
                  </g>
                ))}
                <text x={235} y={110} textAnchor="middle" fontSize="15" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                  vs
                </text>
                <motion.text x={W / 2} y={236} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                  same two inputs, very different amounts of stuff
                </motion.text>
              </g>
            );
          })()}

        {/* ================= phase 1: run the first machine ================= */}
        {phase === 1 &&
          (() => {
            const cell = 26;
            const gx = 46;
            const gy = 54;
            return (
              <g>
                <text x={W / 2} y={22} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  {a} {S1} {b} = {OPS[k1].form(String(a), String(b))}
                </text>
                <Grid x={gx} y={gy} n={a} cell={cell} cut={b} color={IND} delay={0.2} lift />
                <text x={gx + (a * cell) / 2} y={gy + a * cell + 18} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                  {a} × {a} = {a * a} squares
                </text>
                <motion.g initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.9 }}>
                  <text x={230} y={92} fontSize="11.5" fontWeight="700" fill={BAD} fontFamily={numberFont}>
                    lift out the {b} × {b} = {b * b}
                  </text>
                  <text x={230} y={126} fontSize="11.5" fontWeight="700" fill={INK} fontFamily={numberFont}>
                    {a * a} − {b * b}
                  </text>
                </motion.g>
                <motion.text
                  x={230}
                  y={162}
                  fontSize="20"
                  fontWeight="800"
                  fill={IND}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 2.1 }}
                  style={{ transformBox: "fill-box", transformOrigin: "left center" }}
                >
                  = {mid}
                </motion.text>
                <motion.text x={230} y={186} fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }}>
                  the L-shape left behind
                </motion.text>
              </g>
            );
          })()}

        {/* ================= phase 2: feed it into the second machine ================= */}
        {phase === 2 &&
          (() => {
            const barCell = 17;
            const bx = 30;
            const by = 52;
            const side = Math.abs(mid - c);
            const sq = Math.min(15, 132 / Math.max(1, side));
            return (
              <g>
                <text x={W / 2} y={22} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  {mid} {S2} {c} = {OPS[k2].form(String(mid), String(c))}
                </text>

                {/* the first output as a bar, with c chopped off the end */}
                {Array.from({ length: mid }, (_, i) => {
                  const gone = i >= mid - c;
                  return (
                    <motion.g
                      key={i}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={gone ? { opacity: [1, 1, 0], y: [0, 0, -26] } : { opacity: 1, scale: 1 }}
                      transition={
                        gone
                          ? { duration: 1.6, times: [0, 0.4, 1], delay: 0.7 }
                          : { type: "spring", stiffness: 300, damping: 18, delay: 0.15 + i * 0.03 }
                      }
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <rect
                        x={bx + i * barCell}
                        y={by}
                        width={barCell}
                        height={barCell}
                        fill={gone ? CUT : TEAL}
                        fillOpacity={gone ? 1 : 0.4}
                        stroke={gone ? BAD : TEAL}
                        strokeWidth={0.8}
                      />
                    </motion.g>
                  );
                })}
                <text x={bx} y={by - 8} fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                  the {mid} from the {S1} machine
                </text>
                <motion.text
                  x={bx + ((mid - c) * barCell) / 2}
                  y={by + barCell + 17}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill={TEAL}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                >
                  {mid} − {c} = {side}
                </motion.text>

                {/* the shortened side sweeps out into a square */}
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
                  <Grid x={W / 2 - (side * sq) / 2} y={94} n={side} cell={sq} color={TEAL} delay={2} />
                </motion.g>
                <motion.text
                  x={W / 2}
                  y={94 + side * sq + 20}
                  textAnchor="middle"
                  fontSize="17"
                  fontWeight="800"
                  fill={TEAL}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 2.9 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  {side} × {side} = {out}
                </motion.text>
              </g>
            );
          })()}

        {/* ================= phase 3: every route lands on a different choice ================= */}
        {phase === 3 && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              every way of picking the machines lands on a different answer choice
            </text>
            {routes.map((r, i) => {
              const letter = choiceOf(r.value);
              const y = 52 + i * 34;
              return (
                <motion.g
                  key={r.label}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 + i * 0.28 }}
                >
                  {r.asked && <rect x={26} y={y - 18} width={W - 52} height={28} rx={7} fill="#dcfce7" stroke={WIN} strokeWidth={1.4} />}
                  <text x={42} y={y} fontSize="12" fontWeight="800" fill={r.asked ? WIN : INK} fontFamily={numberFont}>
                    {r.label}
                  </text>
                  <text x={210} y={y} fontSize="12" fontWeight="800" fill={r.asked ? WIN : DIM} fontFamily={numberFont}>
                    = {r.value}
                  </text>
                  {letter && (
                    <g>
                      <circle cx={300} cy={y - 4} r={11} fill={r.asked ? WIN : "#f1f5f9"} stroke={r.asked ? WIN : DIM} strokeWidth={1.3} />
                      <text x={300} y={y} textAnchor="middle" fontSize="11" fontWeight="800" fill={r.asked ? "#fff" : DIM} fontFamily={numberFont}>
                        {letter}
                      </text>
                    </g>
                  )}
                  <text x={324} y={y} fontSize="10" fontWeight="700" fill={r.asked ? WIN : DIM}>
                    {r.asked ? "what was asked" : "a wrong machine"}
                  </text>
                </motion.g>
              );
            })}
            <motion.text
              x={W / 2}
              y={244}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={DIM}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              {covered === allChoices && allChoices > 0
                ? `all ${allChoices} choices are accounted for — nothing else to pick`
                : `${covered} of the ${allChoices} choices come from these routes`}
            </motion.text>
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
          color: phase === 3 ? "#166534" : "#4338ca",
          background: phase === 3 ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${phase === 3 ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {phase === 0
          ? `${a} ${S1} ${b} = ${mid}, but ${a} ${S2} ${b} = ${alt}`
          : phase === 1
          ? `the ${S1} machine gives ${mid}`
          : phase === 2
          ? `the ${S2} machine turns ${mid} and ${c} into ${out}`
          : `(${a} ${S1} ${b}) ${S2} ${c} = ${out}`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed: result {out}
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
