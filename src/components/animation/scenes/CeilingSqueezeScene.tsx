import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const AMBER = "#d97706";
const MUTE = "#94a3b8";
const RULE = "#cbd5e1";
const BALL = "#f97316";
const SEAM = "#9a3412";

const W = 380;
const H = 258;
const PITCH = 18; // one attempt slot; the same in every row so counts compare by eye
const R = 7;
const SX = 14;

const neg = (s: string) => s.replace(/-/g, "−");
const tidy = (v: number) => neg(String(Number(v.toFixed(4))));
const pct = (n: number, d: number) => {
  const v = (n / d) * 100;
  return `${Number.isInteger(v) ? v : v.toFixed(1)}%`;
};

/** Largest integer m with m/A strictly below R/Q. */
function strictCap(Rm: number, Q: number, A: number) {
  const t = Rm * A; // want m·Q < t
  const q = Math.floor(t / Q);
  return t % Q === 0 ? q - 1 : q;
}
/** The same bound with a tie allowed — the classic slip. */
function looseCap(Rm: number, Q: number, A: number) {
  return Math.floor((Rm * A) / Q);
}

/** Every way to split `total` across parts with the given caps. */
function enumerate(caps: number[], total: number): number[][] {
  const out: number[][] = [];
  const rec = (i: number, left: number, acc: number[]) => {
    if (out.length > 400) return;
    if (i === caps.length) {
      if (left === 0) out.push([...acc]);
      return;
    }
    for (let v = 0; v <= Math.min(caps[i], left); v++) rec(i + 1, left - v, [...acc, v]);
  };
  rec(0, total, []);
  return out;
}

function Ball({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={BALL} stroke={SEAM} strokeWidth={0.9} />
      <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke={SEAM} strokeWidth={0.7} />
      <path d={`M ${cx - r} ${cy} Q ${cx} ${cy - r * 0.6} ${cx + r} ${cy}`} fill="none" stroke={SEAM} strokeWidth={0.6} />
      <path d={`M ${cx - r} ${cy} Q ${cx} ${cy + r * 0.6} ${cx + r} ${cy}`} fill="none" stroke={SEAM} strokeWidth={0.6} />
    </g>
  );
}

/**
 * A total split across a few parts, where each part carries its own **strict
 * upper bound** from being beaten on a rate — and the bounds happen to add up to
 * exactly the total that is required. That is the whole problem: there is **no
 * slack**, so every part is pinned at its own ceiling and the split is forced
 * without any casework. The scene earns that rather than asserting it — it
 * derives each cap from the rival's rate (largest m with m/A strictly under
 * R/Q), lines the caps up end to end against the required total as one bar, and
 * shows the shortfall that appears the moment any part gives up a single unit.
 * The strictness is the hinge, so each cap gets its own beat: the rival's rate
 * applied to this part's attempts lands on a whole number, that number is drawn
 * as a real filled row, and then it is **struck out for tying rather than
 * beating** — one unit comes back off, which is where the ceiling comes from.
 * The closing beat prices exactly that slip: it re-runs the split with the tie
 * allowed in one part at a time, finds the extra solution each version admits,
 * and matches its answer against `problem.choices` — on a Simpson's-paradox
 * problem those two slips are usually the outer distractors. Caps, the forced
 * split, uniqueness (by enumeration) and every rate check are all computed.
 * Data: { rival, solver, halves: ["First Half|15|20|12", ...], unit? }
 * with each part `label|rivalMade|rivalAttempts|solverAttempts`.
 */
export function CeilingSqueezeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const rival = String(data.rival ?? "Rival");
  const solver = String(data.solver ?? "Solver");
  const unit = String(data.unit ?? "baskets");

  const halves = (Array.isArray(data.halves) ? data.halves : []).map((h) => {
    const [label, rMade, rAtt, sAtt] = String(h).split("|");
    return { label: label ?? "", rMade: Number(rMade), rAtt: Number(rAtt), sAtt: Number(sAtt) };
  });
  const n = halves.length;

  const rTotMade = halves.reduce((a, h) => a + h.rMade, 0);
  const rTotAtt = halves.reduce((a, h) => a + h.rAtt, 0);
  const sTotAtt = halves.reduce((a, h) => a + h.sAtt, 0);
  const sameAttempts = rTotAtt === sTotAtt;

  // matching the rival's overall rate over the solver's own attempts
  const needExact = (rTotMade * sTotAtt) / rTotAtt;
  const need = Math.round(needExact);
  const needWhole = Math.abs(needExact - need) < 1e-9;

  const caps = halves.map((h) => strictCap(h.rMade, h.rAtt, h.sAtt));
  const ties = halves.map((h) => looseCap(h.rMade, h.rAtt, h.sAtt));
  const capSum = caps.reduce((a, c) => a + c, 0);
  const slack = capSum - need;

  const sols = enumerate(caps, need);
  const forced = sols.length === 1 ? sols[0] : caps;
  const unique = sols.length === 1;
  const diff = n === 2 ? forced[1] - forced[0] : NaN;

  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value));
  const letterFor = (v: number) => opts.find((o) => o.value === v)?.label;
  const agrees = !problem.answer || letterFor(diff) === problem.answer;

  // price the tie-is-good-enough slip, one part at a time
  const slips = halves
    .map((_, i) => {
      const loose = caps.map((c, j) => (j === i ? ties[j] : c));
      const extra = enumerate(loose, need).filter((s) => s.some((v, j) => v !== forced[j]));
      if (!extra.length || n !== 2) return null;
      const s = extra[0];
      const d = s[1] - s[0];
      const letter = letterFor(d);
      return letter ? { i, s, d, letter } : null;
    })
    .filter(Boolean) as { i: number; s: number[]; d: number; letter: string }[];

  const isFinal = step >= totalSteps - 1;
  const shown = isFinal ? n : Math.max(0, Math.min(step, n));
  const active = isFinal ? -1 : shown - 1;
  const mode = isFinal ? "final" : shown === 0 ? "setup" : "ceilings";

  const slotX = (i: number) => SX + i * PITCH + R;
  // centre however many rows this beat shows, so a single row isn't stranded up top
  const rowY = (i: number) => (H - (Math.max(1, shown) * 84 - 20)) / 2 + 26 + i * 84;

  const caption = isFinal
    ? Number.isFinite(diff)
      ? `${tidy(forced[1])} − ${tidy(forced[0])} = ${tidy(diff)} more in the ${halves[1].label.toLowerCase()}`
      : `each part is pinned at its own ceiling`
    : mode === "setup"
    ? `same attempts and the same rate, so ${solver} needs ${tidy(need)} ${unit} too`
    : `${rival}'s ${pct(halves[active].rMade, halves[active].rAtt)} of ${tidy(halves[active].sAtt)} is ${tidy(ties[active])} — ${solver} must stay under it`;

  // the squeeze bar
  const BX = 32;
  const BW = 300;
  const uw = BW / Math.max(1, need);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        <AnimatePresence mode="wait">
          <motion.g key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {mode === "setup" && (
              <>
                {/* the contest's own table */}
                {(() => {
                  const cols = [130, 235];
                  const totalX = 333;
                  const hy = 40;
                  const r1 = 78;
                  const r2 = 136;
                  const cell = (cx: number, cy: number, top: string, bot: string, boxed: boolean, color: string) => (
                    <g>
                      {boxed ? (
                        <rect x={cx - 11} y={cy - 21} width={22} height={17} fill="none" stroke={color} strokeWidth={1.2} strokeDasharray="3 2" rx={2} />
                      ) : (
                        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="13" fontWeight="800" fill={color} fontFamily={numberFont}>
                          {top}
                        </text>
                      )}
                      <line x1={cx - 14} y1={cy - 1} x2={cx + 14} y2={cy - 1} stroke={color} strokeWidth={1.2} />
                      <text x={cx} y={cy + 13} textAnchor="middle" fontSize="13" fontWeight="800" fill={color} fontFamily={numberFont}>
                        {bot}
                      </text>
                    </g>
                  );
                  return (
                    <>
                      <line x1={8} y1={hy + 8} x2={372} y2={hy + 8} stroke={INK} strokeWidth={1.3} />
                      <line x1={68} y1={22} x2={68} y2={168} stroke={INK} strokeWidth={1.3} />
                      <line x1={292} y1={22} x2={292} y2={168} stroke={RULE} strokeWidth={1} />
                      {halves.map((h, i) => (
                        <text key={`hd${i}`} x={cols[i]} y={hy} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                          {h.label}
                        </text>
                      ))}
                      <text x={totalX} y={hy} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                        Total
                      </text>

                      <text x={12} y={r1 + 4} fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
                        {rival}
                      </text>
                      {halves.map((h, i) => (
                        <g key={`s${i}`}>
                          {cell(cols[i], r1, String(h.rMade), String(h.rAtt), false, INK)}
                          <motion.text
                            x={cols[i]}
                            y={r1 + 27}
                            textAnchor="middle"
                            fontSize="9.5"
                            fontWeight="800"
                            fill={MARK}
                            fontFamily={numberFont}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.3 + i * 0.2 }}
                            style={{ transformBox: "fill-box", transformOrigin: "center" }}
                          >
                            {pct(h.rMade, h.rAtt)}
                          </motion.text>
                        </g>
                      ))}
                      {cell(totalX, r1, String(rTotMade), String(rTotAtt), false, MARK)}

                      <text x={12} y={r2 + 4} fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
                        {solver}
                      </text>
                      {halves.map((h, i) => (
                        <g key={`c${i}`}>{cell(cols[i], r2, "", String(h.sAtt), true, INK)}</g>
                      ))}
                      {cell(totalX, r2, "", String(sTotAtt), true, MARK)}

                      {/* the two facts that pin the total */}
                      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.9 }}>
                        <text x={190} y={190} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={sameAttempts ? MUTE : BAD} fontFamily={numberFont}>
                          {halves.map((h) => tidy(h.rAtt)).join(" + ")} = {tidy(rTotAtt)}
                          {sameAttempts ? " = " : " ≠ "}
                          {halves.map((h) => tidy(h.sAtt)).join(" + ")} attempts
                        </text>
                        <text x={190} y={203} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                          same attempts, same overall rate {pct(rTotMade, rTotAtt)} → same {unit}
                        </text>
                      </motion.g>
                      <motion.text
                        x={190}
                        y={230}
                        textAnchor="middle"
                        fontSize="17"
                        fontWeight="800"
                        fill={MARK}
                        fontFamily={numberFont}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.4 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      >
                        {halves.map((_, i) => (i === 0 ? "x" : "y")).join(" + ")} = {tidy(need)}
                      </motion.text>
                    </>
                  );
                })()}

                {!needWhole && (
                  <text x={190} y={246} textAnchor="middle" fontSize="9" fontWeight="700" fill={BAD} fontFamily={numberFont}>
                    that rate does not give a whole number of {unit}
                  </text>
                )}
              </>
            )}

            {mode === "ceilings" &&
              halves.slice(0, shown).map((h, i) => {
                const live = i === active;
                const base = live ? 0.2 : 0;
                return (
                  <motion.g key={`row${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: live ? 0.1 : 0 }}>
                    <text x={SX} y={rowY(i) - 26} fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                      {h.label}
                    </text>
                    <text x={SX + 78} y={rowY(i) - 26} fontSize="9.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                      {rival} {tidy(h.rMade)}/{tidy(h.rAtt)} = {pct(h.rMade, h.rAtt)}
                    </text>

                    {/* one slot per attempt */}
                    {Array.from({ length: h.sAtt }).map((_, k) => (
                      <circle key={`e${k}`} cx={slotX(k)} cy={rowY(i)} r={R} fill="#fff" stroke={RULE} strokeWidth={1.2} strokeDasharray="2 2" />
                    ))}

                    {/* the rate applied to these attempts — a whole number, drawn */}
                    {Array.from({ length: Math.min(live ? ties[i] : caps[i], h.sAtt) }).map((_, k) => (
                      <motion.g
                        key={`b${k}`}
                        initial={{ opacity: 0, y: -14 }}
                        animate={{ opacity: k >= caps[i] && live ? [0, 1, 1, 0.25] : 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18, delay: base + k * 0.035, opacity: { duration: live ? 2.4 : 0, times: [0, 0.15, 0.62, 0.78], delay: base } }}
                      >
                        <Ball cx={slotX(k)} cy={rowY(i)} r={R} />
                      </motion.g>
                    ))}

                    {/* ties the rate exactly, so it is struck off */}
                    {live && ties[i] > caps[i] && (
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 1, 1] }} transition={{ duration: 2.4, times: [0, 0.5, 0.62, 1], delay: base }}>
                        <line
                          x1={slotX(caps[i]) - R - 2}
                          y1={rowY(i) - R - 2}
                          x2={slotX(ties[i] - 1) + R + 2}
                          y2={rowY(i) + R + 2}
                          stroke={BAD}
                          strokeWidth={1.8}
                        />
                        <text x={SX} y={rowY(i) + 24} fontSize="9" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                          {tidy(ties[i])}/{tidy(h.sAtt)} = {pct(ties[i], h.sAtt)} only ties {rival} — it has to be lower
                        </text>
                      </motion.g>
                    )}

                    <motion.text
                      x={SX}
                      y={rowY(i) + (ties[i] > caps[i] ? 38 : 24)}
                      fontSize="11.5"
                      fontWeight="800"
                      fill={AMBER}
                      fontFamily={numberFont}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 220, damping: 15, delay: live ? base + 1.9 : 0 }}
                      style={{ transformBox: "fill-box", transformOrigin: "left center" }}
                    >
                      {i === 0 ? "x" : "y"} ≤ {tidy(caps[i])}
                    </motion.text>
                  </motion.g>
                );
              })}

            {mode === "final" && (
              <>
                {/* the caps laid end to end against what is needed */}
                <text x={BX} y={30} fontSize="9.5" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                  the ceilings, end to end
                </text>
                {halves.map((_, i) => {
                  const before = caps.slice(0, i).reduce((a, c) => a + c, 0);
                  return (
                    <motion.rect
                      key={`cap${i}`}
                      x={BX + before * uw}
                      y={40}
                      height={20}
                      rx={3}
                      fill={i === 0 ? "#fed7aa" : "#fdba74"}
                      stroke={SEAM}
                      strokeWidth={1}
                      initial={{ width: 0 }}
                      animate={{ width: caps[i] * uw }}
                      transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.2 + i * 0.35 }}
                    />
                  );
                })}
                {halves.map((_, i) => {
                  const before = caps.slice(0, i).reduce((a, c) => a + c, 0);
                  return (
                    <motion.text
                      key={`cl${i}`}
                      x={BX + (before + caps[i] / 2) * uw}
                      y={54}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="800"
                      fill={SEAM}
                      fontFamily={numberFont}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.35 }}
                    >
                      {tidy(caps[i])}
                    </motion.text>
                  );
                })}
                <line x1={BX + BW} y1={32} x2={BX + BW} y2={70} stroke={WIN} strokeWidth={1.6} strokeDasharray="4 3" />
                <text x={BX + BW - 2} y={30} textAnchor="end" fontSize="9.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                  {tidy(need)} needed
                </text>
                <motion.text
                  x={BX}
                  y={74}
                  fontSize="10"
                  fontWeight="800"
                  fill={slack === 0 ? WIN : BAD}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  {caps.map((c) => tidy(c)).join(" + ")} = {tidy(capSum)}
                  {slack === 0 ? " — exactly enough, so no part can spare one" : ` — ${tidy(slack)} to spare`}
                </motion.text>

                {/* give one up and the total falls short */}
                {halves.map((_, i) => {
                  const y = 90 + i * 15;
                  const trial = caps.map((c, j) => (j === i ? c - 1 : c));
                  const tot = trial.reduce((a, c) => a + c, 0);
                  return (
                    <motion.g key={`sh${i}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1.4 + i * 0.2 }}>
                      <rect x={BX} y={y} width={tot * uw} height={9} rx={2} fill="#e2e8f0" />
                      <rect x={BX + tot * uw} y={y} width={(need - tot) * uw} height={9} rx={2} fill="#fecaca" stroke={BAD} strokeWidth={0.9} />
                      <text x={BX + BW + 4} y={y + 8} fontSize="8" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                        {tidy(need - tot)} short
                      </text>
                      <text x={BX - 4} y={y + 8} textAnchor="end" fontSize="8" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                        {trial.map((c) => tidy(c)).join("+")}
                      </text>
                    </motion.g>
                  );
                })}

                {/* the forced split, drawn */}
                {halves.map((h, i) => {
                  const y = 148 + i * 52;
                  return (
                    <g key={`fin${i}`}>
                      <text x={SX} y={y - 15} fontSize="9" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                        {h.label} — {tidy(forced[i])}/{tidy(h.sAtt)} = {pct(forced[i], h.sAtt)} under {pct(h.rMade, h.rAtt)} ✓
                      </text>
                      {Array.from({ length: h.sAtt }).map((_, k) => (
                        <circle key={`fe${k}`} cx={slotX(k)} cy={y} r={R} fill="#fff" stroke={RULE} strokeWidth={1.2} strokeDasharray="2 2" />
                      ))}
                      {Array.from({ length: forced[i] }).map((_, k) => (
                        <motion.g
                          key={`fb${k}`}
                          initial={{ opacity: 0, scale: 0.3 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 1.9 + i * 0.5 + k * 0.03 }}
                          style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        >
                          <Ball cx={slotX(k)} cy={y} r={R} />
                        </motion.g>
                      ))}
                      <motion.text
                        x={SX + h.sAtt * PITCH + 6}
                        y={y + 4}
                        fontSize="12"
                        fontWeight="800"
                        fill={SEAM}
                        fontFamily={numberFont}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.6 + i * 0.5 }}
                      >
                        {tidy(forced[i])}
                      </motion.text>
                    </g>
                  );
                })}
                {n === 2 && (
                  <motion.text
                    x={190}
                    y={244}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="800"
                    fill={WIN}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 15, delay: 3.3 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {tidy(forced[1])} − {tidy(forced[0])} = {tidy(diff)}
                  </motion.text>
                )}
              </>
            )}
          </motion.g>
        </AnimatePresence>
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
            transition={{ delay: 3.6 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: sameAttempts && needWhole && unique && agrees ? MUTE : BAD, textAlign: "center", maxWidth: 380 }}
          >
            {!sameAttempts
              ? `${rival} took ${tidy(rTotAtt)} attempts but ${solver} took ${tidy(sTotAtt)}`
              : !needWhole
              ? `matching that rate needs ${needExact} ${unit}, not a whole number`
              : !unique
              ? `${sols.length} splits fit the ceilings, so the answer is not forced`
              : !agrees
              ? `this gives ${tidy(diff)}, not the stored answer`
              : slips.length
              ? `letting a tie count instead: ${slips
                  .map((s) => `${tidy(s.s[s.i])}/${tidy(halves[s.i].sAtt)} in the ${halves[s.i].label.toLowerCase()} gives ${tidy(s.d)} = (${s.letter})`)
                  .join(", ")}`
              : `searched all ${tidy(need)}-splits under the ceilings: exactly one fits`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 3.7 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
