import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const DIRT = "#e7e5e4";
const WIN = "#16a34a";
const BAD = "#dc2626";

/**
 * Sequences of up/down hops that start and end on the ground and never go below
 * it. The scene enumerates every sequence itself, so the survivors are found
 * rather than asserted: first the ones that finish off the ground are ruled out
 * (ups must equal downs), then the ones that dive underground, and each rejected
 * kind is shown as a real hop path with the walker falling through the ground
 * line. The last beat lays every survivor out as its own mountain profile.
 * Totals, the balanced count and the survivors are all computed.
 * Data: { hops, icon?, upLabel?, downLabel? }.
 */
export function HopPathScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(2, Math.min(14, Math.round(num(data.hops, 6))));
  const icon = data.icon != null ? String(data.icon) : "🐰";
  const U = data.upLabel != null ? String(data.upLabel) : "U";
  const D = data.downLabel != null ? String(data.downLabel) : "D";

  // enumerate every sequence, so the survivors are discovered, not assumed
  const all: string[] = [];
  for (let m = 0; m < 1 << n; m++) {
    let s = "";
    for (let i = 0; i < n; i++) s += (m >> i) & 1 ? D : U;
    all.push(s);
  }
  const profile = (s: string) => {
    const p = [0];
    let h = 0;
    for (const c of s) {
      h += c === U ? 1 : -1;
      p.push(h);
    }
    return p;
  };
  const balanced = all.filter((s) => profile(s)[n] === 0);
  const valid = balanced.filter((s) => profile(s).every((h) => h >= 0)).sort();
  const dipped = balanced.filter((s) => profile(s).some((h) => h < 0));
  // deterministic illustrations of each way to fail
  const offGround = all.filter((s) => profile(s).every((h) => h >= 0) && profile(s)[n] > 0).sort()[0] ?? "";
  const diveEx = [...dipped].sort()[0] ?? "";

  const agrees = problem.shortAnswer == null || Number(problem.shortAnswer) === valid.length;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showOff = !isFinal && step === 1;
  const showDive = !isFinal && step === 2;
  const shown = showOff ? offGround : showDive ? diveEx : "";
  const prof = shown ? profile(shown) : [0];

  // ---- geometry ----
  const W = 340;
  const lo = -3;
  const hi = 3;
  const lv = 19;
  const cTop = 18;
  const gx0 = 34;
  const gW = W - gx0 - 22;
  const pitch = gW / n;
  const X = (i: number) => gx0 + i * pitch;
  const Y = (h: number) => cTop + (hi - h) * lv;
  const bigH = 190;

  // gallery layout for the survivors
  const rowGap = 34;
  const gTop = 30;
  const mLv = 10;
  const mx0 = 74;
  const mW = W - mx0 - 24;
  const mPitch = mW / n;
  const MX = (i: number) => mx0 + i * mPitch;
  const MY = (r: number, h: number) => gTop + r * rowGap + 20 - h * mLv;
  const H = isFinal ? gTop + valid.length * rowGap + 16 : bigH;

  const hop = (x1: number, y1: number, x2: number, y2: number, lift: number) =>
    `M ${x1},${y1} Q ${(x1 + x2) / 2},${Math.min(y1, y2) - lift} ${x2},${y2}`;

  const caption = isFinal
    ? `${valid.length} hop sequences stay on or above the ground`
    : step === 0
    ? `${n} hops, each ${U} or ${D}, starting and finishing on the ground`
    : showOff
    ? `${shown} finishes ${prof[n]} up — the ${U}s and ${D}s must balance`
    : `${shown} balances, but it digs ${Math.abs(Math.min(...prof))} below the ground`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {!isFinal && (
          <>
            {/* the ground, and the dirt you are not allowed into */}
            <rect x={gx0 - 10} y={Y(0)} width={gW + 24} height={(0 - lo) * lv} fill={DIRT} />
            <line x1={gx0 - 10} y1={Y(0)} x2={gx0 + gW + 14} y2={Y(0)} stroke="#78716c" strokeWidth={2} />
            {Array.from({ length: hi }).map((_, i) => (
              <line key={`g${i}`} x1={gx0 - 6} y1={Y(i + 1)} x2={gx0 + gW + 10} y2={Y(i + 1)} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3 4" />
            ))}
            {Array.from({ length: hi - lo + 1 }).map((_, i) => (
              <text key={`l${i}`} x={gx0 - 14} y={Y(lo + i) + 3.5} textAnchor="end" fontSize="8.5" fontWeight="700" fill={lo + i === 0 ? "#78716c" : "#cbd5e1"} fontFamily={numberFont}>
                {lo + i}
              </text>
            ))}

            {/* the hop path being tried */}
            <AnimatePresence>
              {shown && (
                <motion.g key={shown} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {prof.slice(0, n).map((h, i) => (
                    <motion.path
                      key={i}
                      d={hop(X(i), Y(h), X(i + 1), Y(prof[i + 1]), 9)}
                      fill="none"
                      stroke={prof[i + 1] < 0 || prof[i] < 0 ? BAD : MARK}
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.28, delay: i * 0.22 }}
                    />
                  ))}
                  {prof.map((h, i) => (
                    <circle key={`p${i}`} cx={X(i)} cy={Y(h)} r={3} fill={h < 0 ? BAD : MARK} />
                  ))}
                  {/* where it went wrong */}
                  <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: n * 0.22 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <circle cx={X(showOff ? n : prof.indexOf(Math.min(...prof)))} cy={Y(showOff ? prof[n] : Math.min(...prof))} r={9} fill="none" stroke={BAD} strokeWidth={2.4} />
                  </motion.g>
                </motion.g>
              )}
            </AnimatePresence>

            {/* the hopper, travelling the path one hop at a time */}
            <motion.g
              key={`b${shown}`}
              initial={{ x: X(0) - X(shown ? n : 0), y: Y(0) - Y(shown ? prof[n] : 0) }}
              animate={{
                x: shown ? prof.map((_, i) => X(i) - X(n)) : 0,
                y: shown ? prof.map((h) => Y(h) - Y(prof[n])) : 0,
              }}
              transition={{ duration: shown ? n * 0.22 : 0.3, ease: "linear" }}
            >
              <text x={X(shown ? n : 0)} y={Y(shown ? prof[n] : 0) - 7} textAnchor="middle" fontSize="16">
                {icon}
              </text>
            </motion.g>

            {/* the sequence spelled out */}
            {shown && (
              <g>
                {[...shown].map((c, i) => (
                  <motion.text
                    key={i}
                    x={X(i) + pitch / 2}
                    y={Y(lo) + 22}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="800"
                    fill={c === U ? MARK : "#78716c"}
                    fontFamily={numberFont}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.22 }}
                  >
                    {c}
                  </motion.text>
                ))}
              </g>
            )}
            {!shown && (
              <text x={W / 2} y={Y(lo) + 22} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                the dirt below the line is off limits
              </text>
            )}
          </>
        )}

        {/* every sequence that survives */}
        {isFinal &&
          valid.map((s, r) => {
            const p = profile(s);
            return (
              <motion.g
                key={s}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: r * 0.12 }}
              >
                <text x={8} y={MY(r, 0) + 4} fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  {s}
                </text>
                <line x1={mx0 - 4} y1={MY(r, 0)} x2={mx0 + mW + 4} y2={MY(r, 0)} stroke="#78716c" strokeWidth={1.2} />
                {p.slice(0, n).map((h, i) => (
                  <motion.path
                    key={i}
                    d={hop(MX(i), MY(r, h), MX(i + 1), MY(r, p[i + 1]), 3)}
                    fill="none"
                    stroke={WIN}
                    strokeWidth={2}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.25, delay: 0.2 + r * 0.12 + i * 0.05 }}
                  />
                ))}
                {p.map((h, i) => (
                  <circle key={`d${i}`} cx={MX(i)} cy={MY(r, h)} r={2.2} fill={WIN} />
                ))}
                <text x={mx0 + mW + 10} y={MY(r, 0) + 4} fontSize="13">
                  {icon}
                </text>
              </motion.g>
            );
          })}
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
          color: isFinal ? "#166534" : shown ? "#991b1b" : "#4338ca",
          background: isFinal ? "#dcfce7" : shown ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : shown ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {showOff && (
          <motion.span
            key="bal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            {n / 2} {U}s and {n / 2} {D}s — {balanced.length} orders of those
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDive && (
          <motion.span
            key="dv"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            {dipped.length} of the {balanced.length} dive underground somewhere
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees
              ? `checked all ${all.length} sequences: ${balanced.length} balance, ${dipped.length} dive, ${valid.length} left`
              : `enumeration found ${valid.length}, not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
