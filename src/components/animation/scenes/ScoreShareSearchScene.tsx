import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MUTE = "#94a3b8";
const ALEXA = "#4338ca";
const BRIT = "#0284c7";
const CHEL = "#f59e0b";
const OTH = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

/**
 * Alexa and Brittany's shares are fixed *fractions* of the unknown team total
 * t, so their combined share only lands on a whole number of points when t is
 * a multiple of a common denominator — the bar below is divided into that many
 * equal ticks, independent of t's actual size. The next beat tries the
 * smallest three such multiples as real, to-scale scoreboards and checks each
 * one's leftover against what 7 players capped at a few points each could
 * possibly score; only one multiple survives. Every fraction, tick count,
 * candidate total, and pass/fail check is derived from the data, not asserted.
 * Data: { alexaNum, alexaDen, brittanyNum, brittanyDen, chelsea, otherPlayers, maxPerPlayer }.
 */
export function ScoreShareSearchScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const alexaNum = num(data.alexaNum, 1);
  const alexaDen = num(data.alexaDen, 4);
  const britNum = num(data.brittanyNum, 2);
  const britDen = num(data.brittanyDen, 7);
  const chelsea = num(data.chelsea, 15);
  const otherPlayers = num(data.otherPlayers, 7);
  const maxPerPlayer = num(data.maxPerPlayer, 2);
  const othersMax = otherPlayers * maxPerPlayer;

  const L = lcm(alexaDen, britDen);
  const alexaTicks = alexaNum * (L / alexaDen);
  const britTicks = britNum * (L / britDen);
  const numL = alexaTicks + britTicks;
  const remPerK = L - numL;
  const shareG = gcd(numL, L) || 1;
  const remG = gcd(remPerK, L) || 1;

  // the only place actual points enter: search whole multiples of L for the one
  // whose leftover fits 7 players scoring at most maxPerPlayer each
  let validK = 1;
  for (let k = 1; k <= 60; k++) {
    const x = remPerK * k - chelsea;
    if (x >= 0 && x <= othersMax) {
      validK = k;
      break;
    }
  }
  const kStart = Math.max(1, validK - 1);
  const candidates = [kStart, kStart + 1, kStart + 2].map((k) => {
    const t = k * L;
    const alexa = alexaNum * k * (L / alexaDen);
    const brit = britNum * k * (L / britDen);
    const x = remPerK * k - chelsea;
    return { k, t, alexa, brit, x, valid: x >= 0 && x <= othersMax };
  });
  const win = candidates.find((c) => c.k === validK) ?? candidates[0];
  const sumOk = win.alexa + win.brit + chelsea + win.x === win.t;

  const stage = step >= totalSteps - 1 ? 3 : Math.min(step, 2);

  // ---- shared layout ----
  const W = 340;
  const barW = 272;
  const barX = 30;
  const barH = 30;

  // fraction-only bar: widths are ratios of t, valid before t is ever known
  const alexaFrac = alexaNum / alexaDen;
  const britFrac = britNum / britDen;
  const restFrac = 1 - alexaFrac - britFrac;
  const alexaW = barW * alexaFrac;
  const britW = barW * britFrac;
  const restW = barW * restFrac;

  const caption =
    stage === 0
      ? `Alexa gets ${alexaNum}/${alexaDen} of the team's points, Brittany ${britNum}/${britDen} — Chelsea's ${chelsea} and the rest, x, are still unknown`
      : stage === 1
      ? `${alexaNum}/${alexaDen} + ${britNum}/${britDen} = ${numL}/${L}, a whole number of points only when t is a multiple of ${L}`
      : stage === 2
      ? `try t = ${candidates.map((c) => c.t).join(", ")}: only t = ${win.t} leaves x = ${win.x}, inside 0–${othersMax}`
      : `${win.alexa} + ${win.brit} + ${chelsea} + ${win.x} = ${win.t}, and ${win.x} ≤ ${othersMax} for ${otherPlayers} players`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <div style={{ fontSize: 22 }}>🏀</div>
      <svg viewBox={`0 0 ${W} ${stage === 2 ? 190 : 130}`} width="100%" style={{ maxWidth: 350 }}>
        {stage <= 1 && (
          <g>
            {/* the fraction-only bar: no t value needed to draw these widths */}
            <rect x={barX} y={40} width={barW} height={barH} rx={6} fill="none" stroke={MUTE} strokeWidth={1.2} />
            <motion.rect
              x={barX}
              y={40}
              width={alexaW}
              height={barH}
              fill={ALEXA}
              opacity={0.85}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
              style={{ transformOrigin: `${barX}px center` }}
            />
            <motion.rect
              x={barX + alexaW}
              y={40}
              width={britW}
              height={barH}
              fill={BRIT}
              opacity={0.85}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              style={{ transformOrigin: `${barX + alexaW}px center` }}
            />
            <rect x={barX + alexaW + britW} y={40} width={restW} height={barH} fill={CHEL} opacity={stage === 1 ? 0.35 : 0.55} />

            <AnimatePresence>
              {stage === 0 && (
                <motion.g key="labels0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.5 }}>
                  <text x={barX + alexaW / 2} y={60} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                    {alexaNum}/{alexaDen} t
                  </text>
                  <text x={barX + alexaW + britW / 2} y={60} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                    {britNum}/{britDen} t
                  </text>
                  <text x={barX + alexaW + britW + restW / 2} y={60} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#78350f" fontFamily={numberFont}>
                    {chelsea} + x
                  </text>
                </motion.g>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {stage === 1 && (
                <motion.g key="labels1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                  <text x={barX + (alexaW + britW) / 2} y={60} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                    {numL / shareG}/{L / shareG} t
                  </text>
                  <rect x={barX} y={30} width={alexaW + britW} height={8} rx={3} fill="none" stroke={ALEXA} strokeWidth={1.2} />
                  <text x={barX + (alexaW + britW) / 2} y={22} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={ALEXA} fontFamily={numberFont}>
                    Alexa + Brittany
                  </text>
                  <text x={barX + alexaW + britW + restW / 2} y={60} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#78350f" fontFamily={numberFont}>
                    {remPerK / remG}/{L / remG} of t
                  </text>

                  {/* t must land on one of these L ticks for every share to be whole */}
                  {Array.from({ length: L + 1 }).map((_, i) => (
                    <motion.line
                      key={`tick${i}`}
                      x1={barX + (i / L) * barW}
                      y1={72}
                      x2={barX + (i / L) * barW}
                      y2={80}
                      stroke={i === numL ? INK : MUTE}
                      strokeWidth={i === numL ? 1.8 : 1}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.01 }}
                    />
                  ))}
                  <text x={barX + barW / 2} y={94} textAnchor="middle" fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                    t split into {L} equal ticks
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </g>
        )}

        {stage === 2 && (
          <g>
            {candidates.map((c, i) => {
              const y = 12 + i * 52;
              const scale = c.t / candidates[candidates.length - 1].t;
              const w = barW * scale;
              const aw = w * (c.alexa / c.t);
              const bw = w * (c.brit / c.t);
              const cw = w * (chelsea / c.t);
              const xw = Math.max(0, w * (c.x / c.t));
              return (
                <motion.g key={c.k} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.3 }}>
                  <text x={4} y={y + 16} fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    t={c.t}
                  </text>
                  <rect x={barX} y={y} width={w} height={22} fill="none" stroke={MUTE} strokeWidth={1} />
                  <rect x={barX} y={y} width={aw} height={22} fill={ALEXA} opacity={0.85} />
                  <rect x={barX + aw} y={y} width={bw} height={22} fill={BRIT} opacity={0.85} />
                  <rect x={barX + aw + bw} y={y} width={cw} height={22} fill={CHEL} opacity={0.85} />
                  <rect
                    x={barX + aw + bw + cw}
                    y={y}
                    width={xw}
                    height={22}
                    fill={c.x < 0 ? BAD : OTH}
                    opacity={0.85}
                  />
                  <text
                    x={barX + w + 10}
                    y={y + 16}
                    fontSize="9.5"
                    fontWeight="800"
                    fill={c.valid ? WIN : BAD}
                    fontFamily={numberFont}
                  >
                    x={c.x}
                  </text>
                  <motion.text
                    x={barX + w + 42}
                    y={y + 16}
                    fontSize="13"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 12, delay: i * 0.3 + 0.35 }}
                  >
                    {c.valid ? "✅" : "❌"}
                  </motion.text>
                </motion.g>
              );
            })}
            <text x={barX} y={12 + candidates.length * 52 + 10} fontSize="8.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
              needs 0 ≤ x ≤ {othersMax} for {otherPlayers} players scoring at most {maxPerPlayer} each
            </text>
          </g>
        )}

        {stage === 3 && (
          <g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {(() => {
                const w = barW;
                const aw = w * (win.alexa / win.t);
                const bw = w * (win.brit / win.t);
                const cw = w * (chelsea / win.t);
                const xw = w * (win.x / win.t);
                const seg = (x0: number, wd: number, fill: string, label: string, val: number) => (
                  <>
                    <motion.rect x={x0} y={40} width={wd} height={barH} fill={fill} opacity={0.85} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4 }} style={{ transformOrigin: `${x0}px center` }} />
                    {wd > 24 && (
                      <text x={x0 + wd / 2} y={60} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                        {val}
                      </text>
                    )}
                    <text x={x0 + wd / 2} y={78} textAnchor="middle" fontSize="8" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                      {label}
                    </text>
                  </>
                );
                return (
                  <>
                    {seg(barX, aw, ALEXA, "Alexa", win.alexa)}
                    {seg(barX + aw, bw, BRIT, "Brittany", win.brit)}
                    {seg(barX + aw + bw, cw, CHEL, "Chelsea", chelsea)}
                    {seg(barX + aw + bw + cw, xw, OTH, "7 others", win.x)}
                  </>
                );
              })()}
              <text x={barX + barW / 2} y={16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                t = {win.t}
              </text>
            </motion.g>
          </g>
        )}
      </svg>

      <motion.span
        key={`${step}-${stage}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: stage === 3 ? "#166534" : stage === 2 ? "#1e3a8a" : "#4338ca",
          background: stage === 3 ? "#dcfce7" : stage === 2 ? "#eff6ff" : "#eef2ff",
          border: `1px solid ${stage === 3 ? "#bbf7d0" : stage === 2 ? "#bfdbfe" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {stage === 3 && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: sumOk ? MUTE : BAD, textAlign: "center" }}
          >
            {sumOk
              ? `check: ${win.alexa} + ${win.brit} + ${chelsea} + ${win.x} = ${win.t}`
              : `${win.alexa} + ${win.brit} + ${chelsea} + ${win.x} ≠ ${win.t}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 3 && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.65 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
