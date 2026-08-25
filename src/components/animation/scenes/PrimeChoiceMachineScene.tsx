import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";
const COLORS = ["#2563eb", "#f59e0b", "#7c3aed"];
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";

const sup = (n: number) => String(n).split("").map((d) => SUP[Number(d)]).join("");

function factorize(value: number): { p: number; e: number }[] {
  const out: { p: number; e: number }[] = [];
  let n = Math.max(2, Math.round(value));
  for (let p = 2; p * p <= n; p += 1) {
    let e = 0;
    while (n % p === 0) {
      n /= p;
      e += 1;
    }
    if (e) out.push({ p, e });
  }
  if (n > 1) out.push({ p: n, e: 1 });
  return out;
}

/**
 * A number breaks into colored prime tokens. A friendly factor-building robot
 * then chooses how many tokens to take from each prime bin: exponent 0 through
 * the available maximum. The independent choice counts multiply to the number
 * of positive divisors. Data: { n }.
 */
export function PrimeChoiceMachineScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(2, Math.round(num(data.n, 2)));
  const primes = factorize(n);
  const divisorCount = primes.reduce((product, f) => product * (f.e + 1), 1);
  const rebuilt = primes.reduce((product, f) => product * Math.pow(f.p, f.e), 1);
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d]/g, ""));
  const ok = rebuilt === n && (!Number.isFinite(stored) || stored === divisorCount);
  const isFinal = step >= totalSteps - 1;
  const factorText = primes.map((f) => `${f.p}${f.e > 1 ? sup(f.e) : ""}`).join(" · ");
  const choiceText = primes.map((f) => f.e + 1).join(" · ");

  const W = 460;
  const binX = (i: number) => 70 + i * 145;
  const allTokens = primes.flatMap((f, pi) => Array.from({ length: f.e }, (_, j) => ({ pi, j, p: f.p })));

  const Token = ({ x, y, pi, p, r = 12 }: { x: number; y: number; pi: number; p: number; r?: number }) => (
    <g>
      <circle cx={x} cy={y} r={r} fill={COLORS[pi]} stroke={INK} strokeWidth="1.2" />
      <circle cx={x - 4} cy={y - 3} r="1.3" fill="#fff" />
      <circle cx={x + 4} cy={y - 3} r="1.3" fill="#fff" />
      <path d={`M ${x - 4} ${y + 3} Q ${x} ${y + 7} ${x + 4} ${y + 3}`} fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={r < 10 ? 7 : 0} fill="#fff">{r < 10 ? p : ""}</text>
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} 260`} width="100%" style={{ maxWidth: 470 }}>
        <text x={W / 2} y="18" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>
          {step === 0 ? "break the number into its prime building blocks" : isFinal ? "multiply the independent choices" : "choose how many tokens go into a factor"}
        </text>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.g key="factor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.text x={W / 2} y="53" textAnchor="middle" fontSize="21" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                {n.toLocaleString("en-US")}
              </motion.text>

              {allTokens.map((t, i) => {
                const sameBefore = allTokens.slice(0, i).filter((z) => z.pi === t.pi).length;
                const count = primes[t.pi].e;
                const targetX = binX(t.pi) + (sameBefore - (count - 1) / 2) * 20;
                return (
                  <motion.g key={`${t.pi}-${t.j}`} initial={{ x: W / 2, y: 48, opacity: 0 }} animate={{ x: targetX, y: 105, opacity: 1 }} transition={{ type: "spring", stiffness: 125, damping: 15, delay: 0.35 + i * 0.1 }}>
                    <Token x={0} y={0} pi={t.pi} p={t.p} />
                  </motion.g>
                );
              })}

              {primes.map((f, i) => (
                <motion.g key={f.p} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 + i * 0.16 }}>
                  <path d={`M ${binX(i) - 54} 126 L ${binX(i) - 45} 162 L ${binX(i) + 45} 162 L ${binX(i) + 54} 126`} fill={COLORS[i]} fillOpacity="0.12" stroke={COLORS[i]} strokeWidth="1.7" />
                  <text x={binX(i)} y="150" textAnchor="middle" fontSize="13" fontWeight="900" fill={COLORS[i]} fontFamily={FONT}>{f.e} copies of {f.p}</text>
                </motion.g>
              ))}

              <motion.text x={W / 2} y="202" textAnchor="middle" fontSize="19" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35 }}>
                {n.toLocaleString("en-US")} = {factorText}
              </motion.text>
              <motion.text x={W / 2} y="230" textAnchor="middle" fontSize="11" fontWeight="750" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                check: multiplying every token rebuilds {n.toLocaleString("en-US")}
              </motion.text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g key="choices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {primes.map((f, i) => (
                <g key={f.p}>
                  <text x={binX(i)} y="48" textAnchor="middle" fontSize="14" fontWeight="900" fill={COLORS[i]} fontFamily={FONT}>power of {f.p}</text>
                  {Array.from({ length: f.e + 1 }, (_, exponent) => {
                    const cardW = 82 / (f.e + 1);
                    const left = binX(i) - 41 + exponent * cardW;
                    return (
                      <motion.g key={exponent} initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.16 + exponent * 0.08 + i * 0.18 }}>
                        <rect x={left} y="88" width={cardW - 3} height="42" rx="5" fill={COLORS[i]} fillOpacity="0.12" stroke={COLORS[i]} strokeWidth="1.2" />
                        <text x={left + (cardW - 3) / 2} y="114" textAnchor="middle" fontSize="12" fontWeight="900" fill={COLORS[i]} fontFamily={FONT}>{exponent}</text>
                      </motion.g>
                    );
                  })}
                  <text x={binX(i)} y="151" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>{f.e + 1} choices</text>
                  <text x={binX(i)} y="171" textAnchor="middle" fontSize="9" fontWeight="750" fill={DIM} fontFamily={FONT}>0 through {f.e}</text>
                </g>
              ))}
              <motion.text x={W / 2} y="214" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                each exponent recipe makes one unique factor
              </motion.text>
            </motion.g>
          )}

          {isFinal && (
            <motion.g key="total" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x="30" y="55" fontSize="27">🤖</text>
              <text x="66" y="49" fontSize="11" fontWeight="800" fill={INK}>send one choice</text>
              <text x="66" y="63" fontSize="11" fontWeight="800" fill={INK}>from every bin!</text>
              {primes.map((f, i) => (
                <motion.g key={f.p} initial={{ y: -22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16, delay: i * 0.16 }}>
                  <rect x={binX(i) - 42} y="83" width="84" height="54" rx="10" fill={COLORS[i]} fillOpacity="0.13" stroke={COLORS[i]} strokeWidth="1.8" />
                  <text x={binX(i)} y="105" textAnchor="middle" fontSize="11" fontWeight="850" fill={COLORS[i]}>{f.e + 1} exponent</text>
                  <text x={binX(i)} y="124" textAnchor="middle" fontSize="11" fontWeight="850" fill={COLORS[i]}>choices</text>
                </motion.g>
              ))}
              <motion.path d="M 70 151 L 390 151" stroke={IND} strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.45 }} />
              {Array.from({ length: 7 }, (_, i) => <motion.circle key={i} cx={95 + i * 45} cy="151" r="4" fill={IND} initial={{ x: -28, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.55 + i * 0.08 }} />)}
              <text x={W / 2} y="191" textAnchor="middle" fontSize="21" fontWeight="900" fill={IND} fontFamily={FONT}>{choiceText} = {divisorCount}</text>
              <text x={W / 2} y="210" textAnchor="middle" fontSize="10" fontWeight="750" fill={DIM}>unique exponent recipes = positive factors</text>
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.7 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <rect x="181" y="224" width="98" height="24" rx="12" fill={ok ? WIN : "#dc2626"} />
                <text x={W / 2} y="240" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">Answer {ok ? problem.answer : "check data"}</text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
