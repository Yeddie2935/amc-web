import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** A frog: body, eyes, and a mouth line, so a row of them reads as an army. */
function Frog({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y + r * 0.15} rx={r} ry={r * 0.8} fill={fill} stroke="#00000033" strokeWidth={0.7} />
      <circle cx={x - r * 0.45} cy={y - r * 0.6} r={r * 0.34} fill={fill} stroke="#00000033" strokeWidth={0.7} />
      <circle cx={x + r * 0.45} cy={y - r * 0.6} r={r * 0.34} fill={fill} stroke="#00000033" strokeWidth={0.7} />
      <circle cx={x - r * 0.45} cy={y - r * 0.62} r={r * 0.14} fill="#1f2a44" />
      <circle cx={x + r * 0.45} cy={y - r * 0.62} r={r * 0.14} fill="#1f2a44" />
    </g>
  );
}

/**
 * A fixed population split between two states, where some members switch each
 * way and the ratio changes. Because nobody joins or leaves, both ratios are
 * shares of the *same* total, so the boundary between them simply slides: the
 * first group's share moves from one fraction to another, and that jump — a
 * single sliver of the whole — has to hold exactly the net number who switched.
 * That gives the total in one division. The shares, the exact jump as a reduced
 * fraction, the total, both splits and the answer are computed with integer
 * arithmetic, and the result is re-checked against both ratios.
 * Data: { before:[a,b], after:[a,b], moves:[{from,to,count}], labels, colors }.
 */
export function RatioShiftScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const before = (Array.isArray(data.before) ? data.before : [3, 1]).map((v) => Math.round(num(v, 1)));
  const after = (Array.isArray(data.after) ? data.after : [4, 1]).map((v) => Math.round(num(v, 1)));
  const moves = (Array.isArray(data.moves) ? data.moves : []).map((m) => {
    const o = (m ?? {}) as Record<string, unknown>;
    return { from: Math.round(num(o.from, 0)), to: Math.round(num(o.to, 1)), count: Math.round(num(o.count, 0)) };
  });
  const labels = (Array.isArray(data.labels) ? data.labels : ["A", "B"]).map((l) => String(l));
  const colors = (Array.isArray(data.colors) ? data.colors : ["#16a34a", "#eab308"]).map((c) => String(c));

  // exact integer arithmetic: the share jump is (a0*b1 - b0*a1) / ((a0+a1)(b0+b1))
  const bSum = before[0] + before[1];
  const aSum = after[0] + after[1];
  const jumpNum = after[0] * before[1] - before[0] * after[1];
  const jumpDen = aSum * bSum;
  const jg = gcd(Math.abs(jumpNum), jumpDen) || 1;
  const jN = jumpNum / jg;
  const jD = jumpDen / jg;

  const inflow = moves.filter((m) => m.to === 0).reduce((s, m) => s + m.count, 0);
  const outflow = moves.filter((m) => m.from === 0).reduce((s, m) => s + m.count, 0);
  const net = inflow - outflow;

  const total = jumpNum !== 0 ? (net * jumpDen) / jumpNum : 0;
  const g0 = (before[0] * total) / bSum;
  const y0 = total - g0;
  const g1 = (after[0] * total) / aSum;
  const y1 = total - g1;
  const diff = g1 - y1;

  const whole = [total, g0, y0, g1, y1].every((v) => Number.isInteger(v) && v >= 0);
  const consistent = whole && g0 - outflow + inflow === g1 && y0 + outflow - inflow === y1;
  const agrees = problem.shortAnswer == null || Number(problem.shortAnswer) === diff;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showMove = !isFinal && step === 1;
  const showSliver = !isFinal && step === 2;

  // ---- geometry ----
  const W = 340;
  const H = 198;
  const bx = 20;
  const bw = 300;
  const by = 58;
  const bh = 44;
  const cutBefore = bx + (bw * before[0]) / bSum;
  const cutAfter = bx + (bw * after[0]) / aSum;
  const cut = showMove || step === 0 ? cutBefore : cutAfter;

  const caption = isFinal
    ? `${g1} − ${y1} = ${diff}`
    : step === 0
    ? `${labels[0]} : ${labels[1]} = ${before.join(" : ")}, so ${labels[0]} is ${before[0]}/${bSum} of the army`
    : showMove
    ? `${moves.map((m) => `${m.count} ${labels[m.from]} → ${labels[m.to]}`).join(", ")} — the army stays the same size`
    : `the share went ${before[0]}/${bSum} → ${after[0]}/${aSum}, a jump of ${jN}/${jD} — and that sliver holds ${net}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the army as one bar: nobody joins or leaves, so its length never changes */}
        <motion.rect
          x={bx}
          y={by}
          width={bw}
          height={bh}
          rx={6}
          fill="#f8fafc"
          stroke="#94a3b8"
          strokeWidth={1.4}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <motion.rect
          x={bx}
          y={by}
          height={bh}
          rx={6}
          fill={colors[0]}
          opacity={0.28}
          initial={false}
          animate={{ width: cut - bx }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        />
        <motion.rect
          y={by}
          height={bh}
          fill={colors[1]}
          opacity={0.28}
          initial={false}
          animate={{ x: cut, width: bx + bw - cut }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        />

        {/* the equal parts the ratio cuts the army into */}
        {step === 0 && !isFinal &&
          Array.from({ length: bSum - 1 }).map((_, i) => (
            <motion.line
              key={i}
              x1={bx + (bw * (i + 1)) / bSum}
              y1={by}
              x2={bx + (bw * (i + 1)) / bSum}
              y2={by + bh}
              stroke="#fff"
              strokeWidth={1.6}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            />
          ))}

        {/* the two boundary positions, and the sliver between them */}
        <AnimatePresence>
          {showSliver && (
            <motion.g key="sl" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.rect
                x={Math.min(cutBefore, cutAfter)}
                y={by - 6}
                width={Math.abs(cutAfter - cutBefore)}
                height={bh + 12}
                fill="rgba(67,56,202,0.25)"
                stroke={MARK}
                strokeWidth={1.6}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 }}
                style={{ transformBox: "fill-box", transformOrigin: "left" }}
              />
              <text x={(cutBefore + cutAfter) / 2} y={by - 12} textAnchor="middle" fontSize="10" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                {jN}/{jD}
              </text>
              <text x={(cutBefore + cutAfter) / 2} y={by + bh + 22} textAnchor="middle" fontSize="10" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                = {net}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the frogs that switch sides */}
        <AnimatePresence>
          {showMove &&
            moves.flatMap((m, mi) =>
              Array.from({ length: m.count }).map((_, k) => {
                const toGreen = m.to === 0;
                const homeX = cutBefore + (toGreen ? -14 - k * 16 : 14 + k * 16);
                const fromX = cutBefore + (toGreen ? 16 + k * 16 : -16 - k * 16);
                return (
                  <motion.g
                    key={`${mi}-${k}`}
                    initial={{ x: fromX - homeX, y: 0, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.2 + mi * 0.3 + k * 0.08 }}
                  >
                    <Frog x={homeX} y={by + (toGreen ? 16 : 32)} r={6} fill={colors[m.to]} />
                  </motion.g>
                );
              })
            )}
        </AnimatePresence>
        <AnimatePresence>
          {showMove &&
            moves.map((m, mi) => (
              <motion.text
                key={`lb${mi}`}
                x={W / 2}
                y={by + bh + 18 + mi * 15}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="800"
                fill={colors[m.to] === "#eab308" ? "#a16207" : colors[m.to]}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 + mi * 0.2 }}
              >
                {m.count} {labels[m.from]} → {labels[m.to]}
              </motion.text>
            ))}
        </AnimatePresence>

        {/* once the total is known, the army is drawn frog by frog */}
        <AnimatePresence>
          {isFinal && whole && total <= 80 && (
            <motion.g key="army" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {Array.from({ length: total }).map((_, i) => {
                const rows = 2;
                const per = Math.ceil(total / rows);
                const row = Math.floor(i / per);
                const col = i % per;
                const stepX = (bw - 12) / per;
                // split every row at the same fraction, so the colour change in
                // the rows lines up with the boundary drawn on the bar
                const rowCount = Math.min(per, total - row * per);
                const greenHere = Math.floor((g1 * rowCount) / total) + (row < g1 % rows ? 1 : 0);
                return (
                  <motion.g
                    key={i}
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.35 + i * 0.012 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <Frog x={bx + 6 + col * stepX + stepX / 2} y={by + 13 + row * 20} r={Math.min(6, stepX / 2 - 0.5)} fill={col < greenHere ? colors[0] : colors[1]} />
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the counts on each side */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="cnt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <text x={bx + 6} y={by - 12} fontSize="12" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {g1} {labels[0]}
              </text>
              <text x={bx + bw - 6} y={by - 12} textAnchor="end" fontSize="12" fontWeight="800" fill="#a16207" fontFamily={numberFont}>
                {y1} {labels[1]}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* what the sliver forces the army size to be */}
        <AnimatePresence>
          {showSliver && (
            <motion.text
              key="tot"
              x={W / 2}
              y={by + bh + 46}
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill={MARK}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.7 }}
            >
              {net} ÷ {jN}/{jD} = {total} frogs in all
            </motion.text>
          )}
        </AnimatePresence>

        {/* the difference the question asks for */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="dif" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <line x1={bx + 4} y1={by + bh + 12} x2={cutAfter - 2} y2={by + bh + 12} stroke={WIN} strokeWidth={2} />
              <line x1={cutAfter + 2} y1={by + bh + 12} x2={bx + bw - 4} y2={by + bh + 12} stroke="#a16207" strokeWidth={2} />
              <text x={(bx + cutAfter) / 2} y={by + bh + 28} textAnchor="middle" fontSize="12" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {g1}
              </text>
              <text x={(cutAfter + bx + bw) / 2} y={by + bh + 28} textAnchor="middle" fontSize="12" fontWeight="800" fill="#a16207" fontFamily={numberFont}>
                {y1}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <text x={bx} y={by - 30} fontSize="10" fontWeight="800" fill="#94a3b8" fontFamily={numberFont}>
          {step === 0 && !isFinal ? before.join(" : ") : isFinal || showSliver ? after.join(" : ") : ""}
        </text>
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
            transition={{ delay: 1.1 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && consistent ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees && consistent
              ? `${g0}:${y0} → ${g1}:${y1}, both ratios exact, ${total} frogs throughout`
              : `these counts do not satisfy both ratios`}
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
