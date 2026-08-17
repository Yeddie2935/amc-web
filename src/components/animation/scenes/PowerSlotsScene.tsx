import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const TILE = "#eef2ff";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const W = 340;
const H = 200;
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sup = (n: number) => String(n).split("").map((c) => SUP[Number(c)] ?? c).join("");

type Arr = number[];

/** Every distinct way to deal the digits into the slots. */
function arrangements(digits: number[]): Arr[] {
  const out = new Map<string, Arr>();
  const walk = (left: number[], cur: number[]) => {
    if (!left.length) {
      out.set(cur.join(","), [...cur]);
      return;
    }
    for (let i = 0; i < left.length; i++) {
      cur.push(left[i]);
      walk([...left.slice(0, i), ...left.slice(i + 1)], cur);
      cur.pop();
    }
  };
  walk(digits, []);
  return [...out.values()];
}

/**
 * Digits dealt into the slots of a product of powers, arranged to make the
 * value as large as possible. The whole problem is **where the 0 goes**: in a
 * base it wipes the entire product out, and in an exponent it quietly turns its
 * factor into 1 — so the real question is only which single power the remaining
 * digits should build. The beats walk up through the answer choices in order,
 * each one a genuine arrangement: the 0 lands in a base and everything collapses
 * to zero, then it moves to an exponent and leaves a stray factor of 1, then the
 * leftover digits are compared as powers and the best wins. Every arrangement is
 * **enumerated**, so the count, the zero cases, the runner-up and the maximum are
 * all discovered, and the closing line reports which answer choices are not the
 * value of any arrangement at all. Data: { digits: [2,0,2,3] }.
 */
export function PowerSlotsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const digits = (Array.isArray(data.digits) ? data.digits : []).map(Number);
  if (digits.length < 4 || digits.length % 2 !== 0 || digits.some((d) => !Number.isFinite(d))) return null;

  const factors = digits.length / 2;
  const all = arrangements(digits);
  const valueOf = (p: Arr) => {
    let v = 1;
    for (let f = 0; f < factors; f++) {
      if (p[2 * f] === 0 && p[2 * f + 1] === 0) return null; // 0^0 is not defined
      v *= p[2 * f] ** p[2 * f + 1];
    }
    return v;
  };
  const scored = all.map((p) => ({ p, v: valueOf(p) })).filter((r): r is { p: Arr; v: number } => r.v != null);
  if (!scored.length) return null;

  const firstFactor = (p: Arr) => p[0] ** p[1];
  const zeroBase = scored.filter((r) => r.p.some((_, i) => i % 2 === 0 && r.p[i] === 0));
  const values = [...new Set(scored.map((r) => r.v))].sort((a, b) => b - a);
  const bestV = values[0];
  const runnerV = values.find((v) => v !== bestV && v !== 0) ?? bestV;

  const pick = (pool: typeof scored, big = true) =>
    [...pool].sort((a, b) => (big ? firstFactor(b.p) - firstFactor(a.p) : firstFactor(a.p) - firstFactor(b.p)))[0];

  const shownZero = pick(zeroBase, false) ?? scored[0];
  const shownRunner = pick(scored.filter((r) => r.v === runnerV)) ?? scored[0];
  const shownBest = pick(scored.filter((r) => r.v === bestV)) ?? scored[0];

  // the surviving shapes once the 0 is out of the way, one row per distinct one
  const survivors = (() => {
    const seen = new Map<string, { p: Arr; v: number }>();
    for (const r of scored) {
      if (r.v === 0) continue;
      const key = Array.from({ length: factors }, (_, f) => `${r.p[2 * f]}^${r.p[2 * f + 1]}`).sort().join("|");
      const cur = seen.get(key);
      if (!cur || firstFactor(r.p) > firstFactor(cur.p)) seen.set(key, r);
    }
    return [...seen.values()].sort((a, b) => b.v - a.v);
  })();

  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[^\d.-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value));
  const reachable = new Set(scored.map((r) => r.v));
  const unreachable = opts.filter((o) => !reachable.has(o.value));
  const agrees = problem.shortAnswer == null || Number(problem.shortAnswer) === bestV;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const stage = step <= 0 ? "empty" : step === 1 ? "zero" : isFinal ? "best" : "runner";
  const shown = stage === "empty" ? null : stage === "zero" ? shownZero : stage === "runner" ? shownRunner : shownBest;

  // ---- layout ----
  const BX = 44;
  const BY = 56;
  const T = 26;
  const E = 18;
  const PITCH = 68;
  const slotX = (i: number) => BX + Math.floor(i / 2) * PITCH + (i % 2 ? T + 2 : 0);
  const slotY = (i: number) => (i % 2 ? BY - 12 : BY);
  const slotW = (i: number) => (i % 2 ? E : T);
  const trayX = (i: number) => BX + i * 32;

  const caption =
    stage === "empty"
      ? `${digits.length} digits, ${digits.length} slots — ${scored.length} different arrangements`
      : stage === "zero"
      ? `a 0 in a base wipes the whole product out — ${zeroBase.length} of the ${scored.length} do that`
      : stage === "runner"
      ? "a 0 in an exponent makes that factor 1, so only the other power counts"
      : `the leftover digits build ${shownBest.p[0]}${sup(shownBest.p[1])} = ${bestV}, the largest available`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the expression */}
        {Array.from({ length: digits.length }).map((_, i) => {
          const d = shown?.p[i];
          const isBase = i % 2 === 0;
          const dead = stage === "zero" && shown != null && shown.p[i - (i % 2)] === 0;
          return (
            <g key={`slot${i}`}>
              <rect
                x={slotX(i)}
                y={slotY(i)}
                width={slotW(i)}
                height={slotW(i)}
                rx={5}
                fill={d == null ? "#fff" : dead ? "#fee2e2" : TILE}
                stroke={d == null ? DIM : dead ? BAD : MARK}
                strokeWidth={1.4}
                strokeDasharray={d == null ? "4 3" : undefined}
              />
              <AnimatePresence mode="wait">
                {d != null && (
                  <motion.text
                    key={`${i}-${d}-${stage}`}
                    x={slotX(i) + slotW(i) / 2}
                    y={slotY(i) + slotW(i) / 2 + (isBase ? 5 : 4)}
                    textAnchor="middle"
                    fontSize={isBase ? 15 : 11}
                    fontWeight="800"
                    fill={dead ? BAD : d === 0 ? "#b45309" : INK}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 + i * 0.08 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {d}
                  </motion.text>
                )}
              </AnimatePresence>
            </g>
          );
        })}

        {/* × between the factors, and the result */}
        {Array.from({ length: factors - 1 }).map((_, k) => (
          <text key={`x${k}`} x={BX + k * PITCH + T + E + 12} y={BY + 18} fontSize="15" fontWeight="800" fill={DIM} fontFamily={numberFont}>
            ×
          </text>
        ))}
        {shown && (
          <>
            <text x={BX + (factors - 1) * PITCH + T + E + 12} y={BY + 18} fontSize="15" fontWeight="800" fill={DIM} fontFamily={numberFont}>
              =
            </text>
            <motion.g
              key={`res-${shown.v}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.55 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect
                x={BX + (factors - 1) * PITCH + T + E + 28}
                y={BY - 2}
                width={54}
                height={30}
                rx={8}
                fill={isFinal ? "#dcfce7" : shown.v === 0 ? "#fee2e2" : TILE}
                stroke={isFinal ? WIN : shown.v === 0 ? BAD : MARK}
                strokeWidth={1.6}
              />
              <text
                x={BX + (factors - 1) * PITCH + T + E + 55}
                y={BY + 19}
                textAnchor="middle"
                fontSize="16"
                fontWeight="800"
                fill={isFinal ? WIN : shown.v === 0 ? BAD : MARK}
                fontFamily={numberFont}
              >
                {shown.v}
              </text>
            </motion.g>
          </>
        )}

        {/* what each factor is worth */}
        {shown &&
          Array.from({ length: factors }).map((_, f) => {
            const fv = shown.p[2 * f] ** shown.p[2 * f + 1];
            const zeroExp = shown.p[2 * f + 1] === 0;
            return (
              <motion.text
                key={`fv${f}-${fv}-${stage}`}
                x={BX + f * PITCH + (T + E + 2) / 2}
                y={BY + 48}
                textAnchor="middle"
                fontSize="12.5"
                fontWeight="800"
                fill={fv === 0 ? BAD : zeroExp ? WIN : MARK}
                fontFamily={numberFont}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + f * 0.15 }}
              >
                {fv}
              </motion.text>
            );
          })}
        {shown && stage === "runner" && (
          <motion.text
            key={`hint-${stage}`}
            x={W / 2}
            y={BY + 66}
            textAnchor="middle"
            fontSize="10.5"
            fontWeight="700"
            fill={WIN}
            fontFamily={numberFont}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            anything{sup(0)} = 1, so that factor is out of the way
          </motion.text>
        )}
        {shown && stage === "zero" && (
          <motion.text
            key="hint0"
            x={W / 2}
            y={BY + 66}
            textAnchor="middle"
            fontSize="10.5"
            fontWeight="700"
            fill={BAD}
            fontFamily={numberFont}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            0 times anything is 0, whatever the other factor does
          </motion.text>
        )}

        {/* the digits waiting to be dealt */}
        <AnimatePresence>
          {stage === "empty" && (
            <motion.g key="tray" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={BX} y={126} fontSize="10.5" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                digits to place
              </text>
              {digits.map((d, i) => (
                <motion.g
                  key={i}
                  initial={{ y: 26, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.15 + i * 0.12 }}
                >
                  <rect x={trayX(i)} y={136} width={T} height={T} rx={5} fill={d === 0 ? "#fef3c7" : TILE} stroke={d === 0 ? "#b45309" : MARK} strokeWidth={1.4} />
                  <text x={trayX(i) + T / 2} y={136 + T / 2 + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={d === 0 ? "#b45309" : INK} fontFamily={numberFont}>
                    {d}
                  </text>
                </motion.g>
              ))}
              <text x={BX} y={182} fontSize="10.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                the 0 is the whole problem
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the shapes that survive, once the 0 is an exponent */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="cands" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={BX} y={128} fontSize="10.5" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                every arrangement with the 0 up top:
              </text>
              {survivors.map((s, i) => {
                const win = s.v === bestV;
                return (
                  <motion.g
                    key={s.p.join()}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1 + i * 0.22 }}
                  >
                    <rect x={BX - 4} y={136 + i * 21} width={168} height={19} rx={6} fill={win ? "#dcfce7" : "#f8fafc"} stroke={win ? WIN : "#e2e8f0"} strokeWidth={win ? 1.5 : 1} />
                    <text x={BX + 4} y={136 + i * 21 + 13.5} fontSize="12" fontWeight="800" fill={win ? WIN : DIM} fontFamily={numberFont}>
                      {Array.from({ length: factors }, (_, f) => `${s.p[2 * f]}${sup(s.p[2 * f + 1])}`).join(" × ")} = {s.v}
                    </text>
                    {win && (
                      <text x={BX + 172} y={136 + i * 21 + 13.5} fontSize="12" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                        ← largest
                      </text>
                    )}
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the count of dead arrangements */}
        <AnimatePresence>
          {stage === "zero" && (
            <motion.g key="cnt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <text x={BX} y={140} fontSize="11.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                {zeroBase.length} of the {scored.length} arrangements put a 0 in a base
              </text>
              <text x={BX} y={160} fontSize="11.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                all of them are worth 0 — move the 0 up
              </text>
            </motion.g>
          )}
          {stage === "runner" && (
            <motion.g key="cnt2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <text x={BX} y={140} fontSize="11.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                that leaves {digits.length - 1} digits to build one power
              </text>
              <text x={BX} y={160} fontSize="11.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                but is {runnerV} the best they can do?
              </text>
            </motion.g>
          )}
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
            transition={{ delay: 2 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees
              ? `checked all ${scored.length} arrangements${unreachable.length ? ` — ${unreachable.map((o) => o.value).join(" and ")} never come up at all` : ""}`
              : `the arrangements top out at ${bestV}, not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

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
