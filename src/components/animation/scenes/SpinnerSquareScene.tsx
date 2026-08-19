import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const MUTE = "#94a3b8";
const LINE = "#cbd5e1";
const SHADE = ["#eeeeee", "#a3a3a3", "#d4d4d4", "#c4c4c4"]; // as printed: TL, TR, BR, BL

const W = 360;
const H = 216;
const GX = 46; // grid left
const GY = 56; // grid top
const CW = 44;
const CH = 30;
const PX = 238; // side panel

/** Quadrant centres as the printed figure orders them: TL, TR, BR, BL. */
const QUAD_ANGLE = [315, 45, 135, 225];

function ints(value: unknown): number[] {
  return Array.isArray(value) ? value.map((v) => Number(v)).filter((n) => Number.isFinite(n)) : [];
}

/** One quadrant of a spinner face. */
function quadPath(cx: number, cy: number, r: number, i: number): string {
  const ends: [number, number][][] = [
    [[cx - r, cy], [cx, cy - r]],
    [[cx, cy - r], [cx + r, cy]],
    [[cx + r, cy], [cx, cy + r]],
    [[cx, cy + r], [cx - r, cy]],
  ];
  const [[sx, sy], [ex, ey]] = ends[i];
  return `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey} Z`;
}

/**
 * A spinner face with its needle. The needle group carries a transparent circle
 * of the same radius so its own bounding box is centred on the hub — Motion pins
 * an SVG group's rotation pivot to its bbox centre, and without that the needle
 * would swing about its own middle instead of the spindle.
 */
function Spinner({
  cx,
  cy,
  r,
  values,
  landing,
  spins,
  delay,
}: {
  cx: number;
  cy: number;
  r: number;
  values: number[];
  landing: number;
  spins: number;
  delay: number;
}) {
  return (
    <g>
      {values.map((v, i) => (
        <path key={i} d={quadPath(cx, cy, r, i)} fill={SHADE[i % 4]} stroke={INK} strokeWidth={1.3} />
      ))}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={1.6} />
      {values.map((v, i) => {
        const a = (QUAD_ANGLE[i % 4] * Math.PI) / 180;
        return (
          <text
            key={i}
            x={cx + Math.sin(a) * r * 0.62}
            y={cy - Math.cos(a) * r * 0.62 + 5}
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill={INK}
            fontFamily={numberFont}
          >
            {v}
          </text>
        );
      })}
      <motion.g
        initial={{ rotate: 0 }}
        animate={{ rotate: spins * 360 + QUAD_ANGLE[landing % 4] }}
        transition={{ duration: 1.5, ease: "easeOut", delay }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        {/* forces the bbox centre onto the hub */}
        <circle cx={cx} cy={cy} r={r} fill="transparent" />
        {/* stops short of the numbers — a full-length needle hides the very
            digit it is selecting */}
        <path d={`M ${cx} ${cy - r * 0.46} L ${cx - 4.5} ${cy + 4} L ${cx + 4.5} ${cy + 4} Z`} fill={MARK} stroke={INK} strokeWidth={1} strokeLinejoin="round" />
      </motion.g>
      <circle cx={cx} cy={cy} r={3.4} fill={INK} />
      <motion.path
        d={quadPath(cx, cy, r, landing % 4)}
        fill="none"
        stroke={MARK}
        strokeWidth={2.6}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 1.6 }}
      />
    </g>
  );
}

/**
 * Two spinners combined as N = 10·A + B, asking how often N is a perfect
 * square. The unlock is that "10 times one plus the other" is not arithmetic at
 * all — it **writes the two results side by side**, so A supplies the tens digit
 * and B the units, and the 16 outcomes are exactly a 4 × 4 block of two-digit
 * numbers. Once the block is on screen the search is bounded: only the squares
 * between the block's smallest and largest entries can possibly appear, which
 * here is just 8² and 9², with 7² falling short and 10² overshooting. Both
 * survivors are then **checked against the spinners** rather than assumed — a
 * square inside the window whose digits are not on the faces would be reported
 * as a miss — and each hit flies from the ladder onto its own cell.
 * Every outcome, the window, the squares in it, the hits and the reduced
 * probability are computed, and the result is checked against the stored answer.
 * Data: { a: [5,6,7,8], b: [1,2,3,4] } in the printed order TL, TR, BR, BL.
 */
export function SpinnerSquareScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const A = ints(data.a);
  const B = ints(data.b);

  const nOf = (i: number, j: number) => 10 * A[i] + B[j];
  const total = A.length * B.length;
  const isSquare = (n: number) => Number.isInteger(Math.sqrt(n));

  const lo = Math.min(...A) * 10 + Math.min(...B);
  const hi = Math.max(...A) * 10 + Math.max(...B);
  // only squares inside the block's range can possibly be an outcome, so the
  // ladder is exactly those plus the one that just falls short and the one that
  // just overshoots — the two that close the search off at both ends
  const kIn: number[] = [];
  for (let k = 1; k * k <= hi; k++) if (k * k >= lo) kIn.push(k);
  const kBelow = kIn.length ? kIn[0] - 1 : Math.floor(Math.sqrt(lo));
  const kAbove = kIn.length ? kIn[kIn.length - 1] + 1 : Math.ceil(Math.sqrt(hi));
  const ladder = [kBelow, ...kIn, kAbove]
    .filter((k) => k >= 1)
    .map((k) => {
      const v = k * k;
      const where = v < lo ? "below" : v > hi ? "above" : "in";
      const hit = where === "in" && A.includes(Math.floor(v / 10)) && B.includes(v % 10);
      return { k, v, where: where as "below" | "above" | "in", hit };
    });
  const hits: { i: number; j: number; v: number }[] = [];
  A.forEach((_, i) =>
    B.forEach((__, j) => {
      if (isSquare(nOf(i, j))) hits.push({ i, j, v: nOf(i, j) });
    })
  );

  const gcd = (x: number, y: number): number => (y ? gcd(y, x % y) : x);
  const g = Math.max(1, gcd(hits.length, total));
  const redNum = hits.length / g;
  const redDen = total / g;

  const opts = (problem.choices ?? []).map((c) => ({ label: c.label, text: String(c.text).trim() }));
  const choiceFor = (n: number, d: number) => {
    const gg = Math.max(1, gcd(n, d));
    const key = `${n / gg}/${d / gg}`;
    return opts.find((o) => o.text.replace(/\s/g, "") === key);
  };
  const winner = choiceFor(hits.length, total);
  const missOne = hits.length > 1 ? choiceFor(hits.length - 1, total) : undefined;
  const agrees = !problem.answer || winner?.label === problem.answer;

  // a demo outcome for the opening beat: a real one, but not a winning one
  const order: [number, number][] = [
    [Math.min(2, A.length - 1), Math.min(2, B.length - 1)],
    [1 % A.length, 1 % B.length],
    [0, 0],
    [A.length - 1, B.length - 1],
  ];
  const demo = order.find(([i, j]) => !isSquare(nOf(i, j))) ?? order[0];
  const [di, dj] = demo;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const preSteps = Math.max(1, totalSteps - 1);
  const showSpin = !isFinal && step === 0;
  const showLadder = isFinal || step >= Math.max(1, preSteps - 1);

  const caption = showSpin
    ? `10 × ${A[di]} + ${B[dj]} = ${nOf(di, dj)} — spinner A writes the tens digit, spinner B the units`
    : !showLadder
    ? `${A.length} × ${B.length} = ${total} equally likely two-digit outcomes`
    : !isFinal
    ? `only squares between ${lo} and ${hi} can appear: ${ladder.filter((l) => l.where === "in").map((l) => l.v).join(" and ")}`
    : `${hits.length} of the ${total} outcomes are perfect squares`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {showSpin ? (
          <g>
            <text x={92} y={22} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
              Spinner A
            </text>
            <text x={252} y={22} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
              Spinner B
            </text>
            <Spinner cx={92} cy={76} r={44} values={A} landing={di} spins={2} delay={0.2} />
            <Spinner cx={252} cy={76} r={44} values={B} landing={dj} spins={3} delay={0.35} />

            {/* the two results land side by side and simply read as one number */}
            <motion.text x={112} y={162} textAnchor="end" fontSize="14" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
              N =
            </motion.text>
            {[
              { v: A[di], from: 92, x: 122, label: "tens" },
              { v: B[dj], from: 252, x: 156, label: "units" },
            ].map((d, k) => (
              <motion.g
                key={k}
                initial={{ x: d.from - (d.x + 17), y: 76 - 154, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 90, damping: 16, delay: 1.9 + k * 0.25 }}
              >
                <rect x={d.x} y={140} width={34} height={30} rx={4} fill="#eef2ff" stroke={MARK} strokeWidth={1.4} />
                <text x={d.x + 17} y={162} textAnchor="middle" fontSize="19" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                  {d.v}
                </text>
                <text x={d.x + 17} y={182} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                  {d.label}
                </text>
              </motion.g>
            ))}
            {/* below the boxes: above them it runs into the spinner faces */}
            <motion.text
              x={W / 2}
              y={202}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="800"
              fill={MARK}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              10 × {A[di]} + {B[dj]} = {nOf(di, dj)}
            </motion.text>
          </g>
        ) : (
          <g>
            {/* headers */}
            <text x={GX + (CW * B.length) / 2} y={26} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
              Spinner B
            </text>
            <text x={14} y={GY + (CH * A.length) / 2} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={MARK} fontFamily={numberFont} transform={`rotate(-90 14 ${GY + (CH * A.length) / 2})`}>
              Spinner A
            </text>
            {B.map((b, j) => (
              <text key={j} x={GX + j * CW + CW / 2} y={GY - 6} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {b}
              </text>
            ))}
            {A.map((a, i) => (
              <text key={i} x={GX - 10} y={GY + i * CH + CH / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {a}
              </text>
            ))}

            {/* the 16 outcomes */}
            {A.map((a, i) =>
              B.map((b, j) => {
                const v = nOf(i, j);
                const hit = isSquare(v);
                const lit = showLadder && hit;
                return (
                  <motion.g
                    key={`${i}-${j}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.1 + (i * B.length + j) * 0.045 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <rect
                      x={GX + j * CW}
                      y={GY + i * CH}
                      width={CW}
                      height={CH}
                      fill={lit ? "#dcfce7" : "#fff"}
                      stroke={lit ? WIN : LINE}
                      strokeWidth={lit ? 1.8 : 1}
                    />
                    <text
                      x={GX + j * CW + CW / 2}
                      y={GY + i * CH + CH / 2 + 5}
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight={lit ? 800 : 700}
                      fill={lit ? WIN : showLadder ? MUTE : INK}
                      fontFamily={numberFont}
                    >
                      {v}
                    </text>
                  </motion.g>
                );
              })
            )}

            {/* the bounded search, and each hit flying onto its cell */}
            <AnimatePresence>
              {showLadder && (
                <motion.g key="ladder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <text x={PX} y={34} fontSize="9.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                    squares from {lo} to {hi}
                  </text>
                  {ladder.map((l, k) => {
                    const ry = 54 + k * 30;
                    return (
                      <motion.g key={l.k} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.5 + k * 0.25 }}>
                        <text x={PX} y={ry} fontSize="11.5" fontWeight="800" fill={l.hit ? WIN : BAD} fontFamily={numberFont}>
                          {l.k}² = {l.v}
                        </text>
                        <text x={PX} y={ry + 12} fontSize="8.5" fontWeight="700" fill={l.hit ? WIN : MUTE} fontFamily={numberFont}>
                          {l.where === "below" ? `below ${lo}` : l.where === "above" ? `above ${hi}` : l.hit ? `${Math.floor(l.v / 10)} and ${l.v % 10} ✓` : "digits not on the faces"}
                        </text>
                      </motion.g>
                    );
                  })}
                </motion.g>
              )}
            </AnimatePresence>

            {/* the winners travel from the ladder into the block */}
            {showLadder &&
              hits.map((h, k) => {
                const li = ladder.findIndex((l) => l.v === h.v);
                const fromX = PX + 18;
                const fromY = 54 + Math.max(0, li) * 30 - 4;
                const toX = GX + h.j * CW + CW / 2;
                const toY = GY + h.i * CH + CH / 2 + 5;
                return (
                  <motion.g
                    key={`fly-${k}`}
                    initial={{ x: fromX - toX, y: fromY - toY, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: [0, 1, 1] }}
                    transition={{ type: "spring", stiffness: 90, damping: 17, delay: 1.5 + k * 0.35 }}
                  >
                    <text x={toX} y={toY} textAnchor="middle" fontSize="13" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                      {h.v}
                    </text>
                  </motion.g>
                );
              })}

            {/* the probability */}
            <AnimatePresence>
              {isFinal && (
                <motion.g key="prob" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 2.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <text x={GX + (CW * B.length) / 2} y={GY + CH * A.length + 20} textAnchor="middle" fontSize="14" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                      {hits.length} / {total} = {redNum} / {redDen}
                    </text>
                  </motion.g>
                  {missOne && (
                    <motion.text
                      x={GX + (CW * B.length) / 2}
                      y={GY + CH * A.length + 36}
                      textAnchor="middle"
                      fontSize="8.5"
                      fontWeight="700"
                      fill={BAD}
                      fontFamily={numberFont}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.7 }}
                    >
                      finding only one of them gives {missOne.text} = ({missOne.label})
                    </motion.text>
                  )}
                </motion.g>
              )}
            </AnimatePresence>
          </g>
        )}
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
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
            transition={{ delay: 3 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? MUTE : BAD, textAlign: "center" }}
          >
            {agrees
              ? `every outcome runs from ${lo} to ${hi}, and only ${hits.map((h) => h.v).join(" and ")} are squares`
              : `this lands on ${redNum}/${redDen}, not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 3.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
