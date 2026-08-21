import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WARN = "#b45309";
const WOOD = "#cbd5e1";

/** A sock silhouette in an 18 × 21 box, cuff band included. */
const SOCK_D =
  "M4,2 L11,2 L11,13 L15,13 Q18,13 18,16.2 Q18,19.5 15,19.5 L4,19.5 Q1.6,19.5 1.6,16.6 L1.6,5 Q1.6,2 4,2 Z";

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const pctText = (v: number) => `${Number(v.toFixed(2))}%`;

type Kind = { name: string; color: string; count: number };

/**
 * A collection of coloured items where **only one colour gets topped up**, given
 * the share that colour ends on. Setting `(t + x)/(n + x) = p` and cross
 * multiplying works, but it hides the reason: everything that is *not* the target
 * colour **never changes**, so that fixed pile is the entire remainder — and at
 * the end it has to be exactly `1 − p` of the drawer. One division gives the
 * final total, and no equation is ever solved.
 *
 * The scene turns that into something countable by choosing the grid width from
 * the numbers themselves: laying the drawer out `gcd(others, finalTotal)` items
 * to a row makes the frozen pile a whole number of rows *and* the final total a
 * whole number of rows, so **one row is exactly one part of the ratio**. On
 * 2020-13 that is 9 columns, the frozen 18 socks are 2 rows, the drawer ends at 5
 * rows, and the answer is literally one more row of socks — 9 — rather than a
 * number that fell out of algebra.
 *
 * The closing beat sieves the real answer list by re-running the share for each
 * choice; because adding the target colour only ever raises its share the
 * percentages climb monotonically (57.14, 60, 62.5, 66.67, 70), which is what
 * makes the answer unique rather than merely correct — and the scene says so.
 * The final total, the part size, the addition and the closing percentage are all
 * computed and cross-checked against the stored answer; data
 * `{ kinds: ["green|#16a34a|6", "purple|#7c3aed|18", ...], target: "purple", percent: 60 }`.
 */
export function MixtureTopUpScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const kinds: Kind[] = (Array.isArray(data.kinds) ? data.kinds : []).map((raw) => {
    const [name, color, count] = String(raw).split("|");
    return { name: name ?? "", color: color || DIM, count: Math.max(0, Math.round(num(count, 0))) };
  });
  const targetName = typeof data.target === "string" ? data.target : kinds[0]?.name ?? "";
  const percent = num(data.percent, 60);
  const itemWord = typeof data.itemWord === "string" ? data.itemWord : "socks";

  const target = kinds.find((k) => k.name === targetName) ?? kinds[0];
  const others = kinds.filter((k) => k !== target);
  const frozen = others.reduce((s, k) => s + k.count, 0);
  const startTarget = target?.count ?? 0;
  const startTotal = frozen + startTarget;

  // ---- the rest is 1 − p of the drawer, and the rest never moves ----
  const restPctNum = 100 - percent;
  const d = gcd(Math.round(restPctNum), 100) || 1;
  const restNum = Math.round(restPctNum) / d; // 2
  const restDen = 100 / d; // 5
  const part = frozen / restNum; // one share of the ratio
  const finalTotal = part * restDen;
  const finalTarget = finalTotal - frozen;
  const added = finalTarget - startTarget;

  // ---- grid width: whole rows for both the frozen pile and the finished drawer ----
  const wide = gcd(frozen, Math.round(finalTotal));
  const cols =
    [...Array(wide).keys()]
      .map((i) => i + 1)
      .filter((c) => wide % c === 0 && c >= 5 && c <= 12)
      .pop() ?? Math.min(10, Math.max(5, wide || 9));
  const frozenRows = frozen / cols;
  const finalRows = finalTotal / cols;
  const addedRows = added / cols;

  // ---- sieve the real answer list ----
  const sieve = (problem.choices ?? [])
    .map((c) => ({ label: c.label, x: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) }))
    .filter((c) => Number.isFinite(c.x))
    .map((c) => {
      const p = ((startTarget + c.x) / (startTotal + c.x)) * 100;
      return { ...c, p, hit: Math.abs(p - percent) < 1e-9 };
    });
  const winners = sieve.filter((s) => s.hit);

  // ---- self-checks ----
  const wholeOk = Number.isInteger(finalTotal) && Number.isInteger(part) && Number.isInteger(added);
  const growOk = added > 0;
  const shareOk = Math.abs((finalTarget / finalTotal) * 100 - percent) < 1e-9;
  const gridOk = Number.isInteger(frozenRows) && Number.isInteger(finalRows);
  const uniqueOk = winners.length === 1;
  const answerOk = problem.shortAnswer == null || String(added) === String(problem.shortAnswer).replace(/[^\d]/g, "");
  const ok = wholeOk && growOk && shareOk && gridOk && uniqueOk && answerOk;
  const failure = !wholeOk
    ? `${frozen} ${itemWord} cannot make ${restPctNum}% of a whole drawer`
    : !growOk
    ? `the target share is already at or above ${percent}%`
    : !shareOk
    ? `${finalTarget}/${finalTotal} is not ${percent}%`
    : !gridOk
    ? `${cols} columns does not give whole rows`
    : !uniqueOk
    ? `${winners.length} of the choices reach ${percent}%`
    : `computed ${added}, answer says ${problem.shortAnswer}`;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 262;

  // ---- drawer geometry ----
  const PX = 24;
  const PY = 26;
  const PAD = 10;
  const GW = cols * PX;
  const GX = (W - GW) / 2 - 46; // leave the right-hand column for the panel
  const GY = 44;
  const cellX = (c: number) => GX + c * PX;
  const cellY = (r: number) => GY + r * PY;

  /** the colour of the item at reading-order index i, others first then target */
  const laid: string[] = [];
  others.forEach((k) => {
    for (let i = 0; i < k.count; i += 1) laid.push(k.color);
  });
  const targetColor = target?.color ?? IND;

  const Sock = ({ c, r, tone, s = 1 }: { c: number; r: number; tone: string; s?: number }) => (
    <g transform={`translate(${cellX(c) + 2},${cellY(r) + 2}) scale(${s})`}>
      <path d={SOCK_D} fill={tone} fillOpacity={0.88} stroke={INK} strokeWidth={1} strokeLinejoin="round" />
      <path d="M1.6,5.6 L11,5.6" stroke="#fff" strokeOpacity={0.75} strokeWidth={1.6} fill="none" />
    </g>
  );

  const Drawer = ({ rows, tone = WOOD }: { rows: number; tone?: string }) => (
    <g>
      <rect
        x={GX - PAD}
        y={GY - PAD}
        width={GW + 2 * PAD}
        height={rows * PY + 2 * PAD - 4}
        rx={7}
        fill="#f8fafc"
        stroke={tone}
        strokeWidth={2.4}
      />
      <rect x={GX + GW / 2 - 16} y={GY + rows * PY + PAD - 7} width={32} height={5} rx={2.5} fill={tone} />
    </g>
  );

  /** index → (col,row) in reading order */
  const at = (i: number) => ({ c: i % cols, r: Math.floor(i / cols) });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ============ phase 0: the drawer as it starts ============ */}
        {phase === 0 && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              the drawer as it starts — {startTotal} {itemWord} in all
            </text>

            <Drawer rows={startTotal / cols} />
            {Array.from({ length: startTotal }, (_, i) => {
              const { c, r } = at(i);
              const tone = i < frozen ? laid[i] : targetColor;
              return (
                <motion.g key={i} initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 + i * 0.018 }}>
                  <Sock c={c} r={r} tone={tone} />
                </motion.g>
              );
            })}

            {/* the tally */}
            {kinds.map((k, i) => (
              <motion.g key={k.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.15 }}>
                <rect x={368} y={50 + i * 20} width={11} height={11} rx={2.5} fill={k.color} fillOpacity={0.88} stroke={INK} strokeWidth={0.9} />
                <text x={385} y={60 + i * 20} fontSize="9.5" fontWeight="700" fill={INK} fontFamily={numberFont}>
                  {k.count} {k.name}
                </text>
              </motion.g>
            ))}
            <motion.text x={368} y={124} fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
              {startTotal} total
            </motion.text>

            <motion.text x={W / 2} y={GY + (startTotal / cols) * PY + 34} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}>
              {target?.name}: {startTarget} of {startTotal} = {pctText((startTarget / startTotal) * 100)}
            </motion.text>
            <motion.text x={W / 2} y={GY + (startTotal / cols) * PY + 58} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.85 }}>
              more {target?.name} {itemWord} go in until that reaches {percent}%
            </motion.text>
          </g>
        )}

        {/* ============ phase 1: everything else is frozen ============ */}
        {phase === 1 && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              only {target?.name} goes in — the other {frozen} never change
            </text>

            <Drawer rows={startTotal / cols} />
            {Array.from({ length: startTotal }, (_, i) => {
              const { c, r } = at(i);
              const isFrozen = i < frozen;
              return (
                <g key={i} opacity={isFrozen ? 1 : 0.35}>
                  <Sock c={c} r={r} tone={isFrozen ? laid[i] : targetColor} />
                </g>
              );
            })}

            {/* the frozen block, ringed */}
            <motion.rect
              x={GX - 4}
              y={GY - 4}
              width={GW + 8}
              height={frozenRows * PY + 4}
              rx={6}
              fill="none"
              stroke={WARN}
              strokeWidth={2.4}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.35 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            <motion.text x={GX + GW + 12} y={GY + (frozenRows * PY) / 2 + 4} fontSize="10" fontWeight="800" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              {frozen} frozen
            </motion.text>

            {/* the unknown addition, hovering */}
            {Array.from({ length: cols }, (_, c) => (
              <motion.g key={`ghost${c}`} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 0.45 }} transition={{ type: "spring", stiffness: 120, damping: 14, delay: 1.0 + c * 0.05 }}>
                <g transform={`translate(${cellX(c) + 2},${GY + (startTotal / cols) * PY + 16}) scale(1)`}>
                  <path d={SOCK_D} fill={targetColor} fillOpacity={0.3} stroke={targetColor} strokeWidth={1.1} strokeDasharray="3 2" strokeLinejoin="round" />
                </g>
              </motion.g>
            ))}
            <motion.text x={GX + GW + 12} y={GY + (startTotal / cols) * PY + 30} fontSize="10" fontWeight="800" fill={targetColor} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
              ? more
            </motion.text>

            <motion.text x={W / 2} y={202} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
              if {target?.name} ends on {percent}%, the rest ends on {restPctNum}%
            </motion.text>
            <motion.text x={W / 2} y={228} textAnchor="middle" fontSize="12" fontWeight="800" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.95 }}>
              and “the rest” is exactly those {frozen} {itemWord}
            </motion.text>
          </g>
        )}

        {/* ============ phase 2: the frozen block is 1 − p of the drawer ============ */}
        {phase === 2 && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              {frozen} {itemWord} = {restPctNum}% = {restNum} of {restDen} equal parts
            </text>

            <Drawer rows={finalRows} />
            {/* the frozen rows, real */}
            {Array.from({ length: frozen }, (_, i) => {
              const { c, r } = at(i);
              return <Sock key={i} c={c} r={r} tone={laid[i]} />;
            })}
            {/* the parts still to come, dashed */}
            {Array.from({ length: finalRows - frozenRows }, (_, k) => (
              <motion.rect
                key={k}
                x={GX - 2}
                y={cellY(frozenRows + k) - 2}
                width={GW + 4}
                height={PY - 2}
                rx={5}
                fill={targetColor}
                fillOpacity={0.05}
                stroke={targetColor}
                strokeWidth={1.6}
                strokeDasharray="5 3"
                initial={{ opacity: 0, scaleY: 0.4 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ type: "spring", stiffness: 130, damping: 15, delay: 1.0 + k * 0.2 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            ))}

            {/* one row = one part */}
            {Array.from({ length: finalRows }, (_, r) => (
              <motion.g key={r} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + r * 0.12 }}>
                <text x={GX - 16} y={cellY(r) + PY / 2 + 2} textAnchor="end" fontSize="9" fontWeight="800" fill={r < frozenRows ? WARN : targetColor} fontFamily={numberFont}>
                  {part}
                </text>
              </motion.g>
            ))}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              <line x1={GX - 34} y1={GY} x2={GX - 34} y2={cellY(frozenRows) - 4} stroke={WARN} strokeWidth={1.8} />
              <line x1={GX - 38} y1={GY} x2={GX - 30} y2={GY} stroke={WARN} strokeWidth={1.8} />
              <line x1={GX - 38} y1={cellY(frozenRows) - 4} x2={GX - 30} y2={cellY(frozenRows) - 4} stroke={WARN} strokeWidth={1.8} />
              <text x={GX - 42} y={GY + (frozenRows * PY) / 2 + 3} textAnchor="end" fontSize="9.5" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                {frozen}
              </text>
            </motion.g>

            <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}>
              <text x={368} y={70} fontSize="10" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                {restNum} rows = {frozen}
              </text>
              <text x={368} y={92} fontSize="11.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                1 row = {part}
              </text>
              <text x={368} y={116} fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {restDen} rows = {finalTotal}
              </text>
            </motion.g>

            <motion.text x={W / 2} y={222} textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }}>
              {frozen} ÷ {restNum} = {part} per row, so the drawer holds {finalTotal}
            </motion.text>
            <motion.text x={W / 2} y={246} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>
              no equation needed — one division did it
            </motion.text>
          </g>
        )}

        {/* ============ phase 3: fill the last rows and check ============ */}
        {phase === 3 && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              {target?.name} goes from {startTarget / part} rows to {finalTarget / part} — {addedRows} row{addedRows === 1 ? "" : "s"} added
            </text>

            <Drawer rows={finalRows} />
            {Array.from({ length: finalTotal }, (_, i) => {
              const { c, r } = at(i);
              const isFrozen = i < frozen;
              const isNew = i >= frozen + startTarget;
              return (
                <motion.g
                  key={i}
                  initial={isNew ? { y: -46, opacity: 0 } : { opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14, delay: isNew ? 0.7 + (i - frozen - startTarget) * 0.07 : 0.1 + i * 0.008 }}
                >
                  <Sock c={c} r={r} tone={isFrozen ? laid[i] : targetColor} />
                </motion.g>
              );
            })}
            {/* the added row, ringed */}
            <motion.rect
              x={GX - 4}
              y={cellY((frozen + startTarget) / cols) - 4}
              width={GW + 8}
              height={addedRows * PY + 2}
              rx={6}
              fill="none"
              stroke={WIN}
              strokeWidth={2.4}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 15, delay: 1.3 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            <motion.text x={GX + GW + 12} y={cellY((frozen + startTarget) / cols) + PY / 2 + 2} fontSize="11" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              +{added}
            </motion.text>

            <motion.text x={W / 2} y={cellY(finalRows) + 24} textAnchor="middle" fontSize="13" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.65 }}>
              {finalTarget} of {finalTotal} = {pctText((finalTarget / finalTotal) * 100)} ✓
            </motion.text>

            {/* every choice re-run through the real share */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
              {sieve.map((s, i) => (
                <g key={s.label}>
                  <text x={62 + i * 78} y={cellY(finalRows) + 44} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={s.hit ? WIN : BAD} fontFamily={numberFont}>
                    {s.label} +{s.x}
                  </text>
                  <text x={62 + i * 78} y={cellY(finalRows) + 56} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={s.hit ? WIN : DIM} fontFamily={numberFont}>
                    {pctText(s.p)}
                  </text>
                </g>
              ))}
              <text x={W / 2} y={cellY(finalRows) + 72} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={WARN}>
                adding {target?.name} only ever raises its share, so exactly one choice lands on {percent}%
              </text>
            </motion.g>
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
          ? `${startTarget} of ${startTotal} are ${target?.name}`
          : phase === 1
          ? `the other ${frozen} are stuck at ${restPctNum}%`
          : phase === 2
          ? `1 row = ${part}, drawer = ${finalTotal}`
          : `${added} ${itemWord} added`}
      </motion.span>

      {!ok && <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
