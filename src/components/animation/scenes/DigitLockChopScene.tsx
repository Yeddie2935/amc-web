import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const TILE = "#eef2ff";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const W = 340;
const H = 210;
const TW = 44;
const GAP = 6;
const TY = 34;

/**
 * A digit-sum rule finds the missing units digit, then a place-value chop
 * finds a remainder. The two rules are unrelated arithmetic tricks glued to
 * one number, so the scene treats them as two separate acts: first the known
 * digits drop into a running sum and the only reachable multiple of
 * `divisor1` pins down U, then the finished number splits at the boundary
 * where powers of ten first become multiples of `divisor2` — everything left
 * of that boundary is provably irrelevant, and only the tail gets divided.
 * The trap is chopping one digit short (a power of ten that is *not* yet a
 * multiple of the divisor), which is computed and matched against the
 * choices. U, the full number, the chop width, quotient and remainder are
 * all derived; the scene flags a digit sum with zero or multiple solutions.
 * Data: { digits: [2,0,1,8], divisor1: 9, divisor2: 8 }.
 */
export function DigitLockChopScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const digits = (Array.isArray(data.digits) ? data.digits : []).map((d) => Math.round(num(d, -1)));
  const divisor1 = Math.round(num(data.divisor1, 0));
  const divisor2 = Math.round(num(data.divisor2, 0));
  if (digits.length < 2 || digits.some((d) => d < 0 || d > 9) || divisor1 < 2 || divisor2 < 2) return null;

  const knownSum = digits.reduce((a, b) => a + b, 0);
  const candidates = Array.from({ length: 10 }, (_, u) => u).filter((u) => (knownSum + u) % divisor1 === 0);
  if (candidates.length !== 1) return null;
  const U = candidates[0];
  const fullDigits = [...digits, U];
  const fullNumber = fullDigits.join("");
  const target = knownSum + U;

  let chopWidth = 1;
  while (Math.pow(10, chopWidth) % divisor2 !== 0 && chopWidth < fullDigits.length) chopWidth += 1;
  const headDigits = fullDigits.slice(0, fullDigits.length - chopWidth);
  const tailDigits = fullDigits.slice(fullDigits.length - chopWidth);
  const tailNumber = Number(tailDigits.join(""));
  const quotient = Math.floor(tailNumber / divisor2);
  const remainder = tailNumber - quotient * divisor2;

  const windowLo = knownSum - 4;
  const windowSpan = 17;
  const nearbyMultiples: number[] = [];
  for (let m = Math.ceil(windowLo / divisor1) * divisor1; m <= windowLo + windowSpan; m += divisor1) {
    nearbyMultiples.push(m);
  }

  const shortTail = fullDigits.slice(fullDigits.length - (chopWidth - 1));
  const shortTailNumber = chopWidth > 1 ? Number(shortTail.join("")) : NaN;
  const shortRemainder = chopWidth > 1 ? shortTailNumber % divisor2 : NaN;
  const trapChoice = problem.choices?.find(
    (c) => Math.abs(Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) - shortRemainder) < 1e-9
  );
  const agrees = problem.shortAnswer == null || String(problem.shortAnswer).trim() === String(remainder);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showU = step >= 1;
  const showChop = isFinal;

  const totalW = fullDigits.length * TW + (fullDigits.length - 1) * GAP;
  const X0 = (W - totalW) / 2;
  const tileX = (i: number) => X0 + i * (TW + GAP);

  const caption =
    step === 0
      ? `digit sum = ${digits.join(" + ")} + U = ${knownSum} + U`
      : step === 1
      ? `${knownSum} + U is a multiple of ${divisor1} only at ${target}, so U = ${U}`
      : `only the last ${chopWidth} digits matter mod ${divisor2}: ${tailDigits.join("")} = ${divisor2}×${quotient} + ${remainder}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the digit tiles, unknown last */}
        {fullDigits.map((d, i) => {
          const isUnknown = i === fullDigits.length - 1;
          const chopped = showChop && i >= fullDigits.length - chopWidth;
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 17, delay: i * 0.15 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect
                x={tileX(i)}
                y={TY}
                width={TW}
                height={TW}
                rx={6}
                fill={chopped ? "#dcfce7" : TILE}
                stroke={chopped ? WIN : isUnknown && !showU ? DIM : MARK}
                strokeWidth={chopped ? 2.2 : 1.6}
              />
              <AnimatePresence mode="wait">
                <motion.text
                  key={isUnknown && !showU ? "q" : String(isUnknown ? U : d)}
                  x={tileX(i) + TW / 2}
                  y={TY + TW / 2 + 7}
                  textAnchor="middle"
                  fontSize="20"
                  fontWeight="800"
                  fill={chopped ? WIN : isUnknown && !showU ? DIM : INK}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, rotateX: 90 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {isUnknown && !showU ? "?" : d}
                </motion.text>
              </AnimatePresence>
              {isUnknown && (
                <text x={tileX(i) + TW / 2} y={TY - 8} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                  U
                </text>
              )}
            </motion.g>
          );
        })}

        {/* chop boundary between head and tail */}
        <AnimatePresence>
          {showChop && headDigits.length > 0 && (
            <motion.line
              key="cut"
              x1={tileX(headDigits.length) - GAP / 2}
              y1={TY - 10}
              x2={tileX(headDigits.length) - GAP / 2}
              y2={TY + TW + 10}
              stroke={BAD}
              strokeWidth={2}
              strokeDasharray="4 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* running digit sum, step 0 */}
        {step === 0 && (
          <motion.text
            x={W / 2}
            y={112}
            textAnchor="middle"
            fontSize="13"
            fontWeight="800"
            fill={MARK}
            fontFamily={numberFont}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: digits.length * 0.15 + 0.2 }}
          >
            {digits.join(" + ")} + U = {knownSum} + U
          </motion.text>
        )}

        {/* the reachable-multiple search, step 1 */}
        <AnimatePresence>
          {step === 1 && (
            <motion.g key="track" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <line x1={40} y1={120} x2={300} y2={120} stroke={DIM} strokeWidth={1.2} />
              <motion.rect
                x={40 + ((knownSum - windowLo) / windowSpan) * 260}
                y={114}
                width={(9 / windowSpan) * 260}
                height={12}
                fill="#eef2ff"
                stroke={MARK}
                strokeWidth={1}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{ transformBox: "fill-box", transformOrigin: "left center" }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
              {nearbyMultiples.map((m) => {
                const x = 40 + ((m - windowLo) / windowSpan) * 260;
                const reachable = m === target;
                return (
                  <motion.g
                    key={m}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.6 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <circle cx={x} cy={120} r={reachable ? 8 : 5} fill={reachable ? WIN : "#fff"} stroke={reachable ? WIN : DIM} strokeWidth={1.4} />
                    <text x={x} y={reachable ? 145 : 143} textAnchor="middle" fontSize="9" fontWeight="800" fill={reachable ? WIN : DIM} fontFamily={numberFont}>
                      {m}
                    </text>
                  </motion.g>
                );
              })}
              <motion.text
                x={W / 2}
                y={168}
                textAnchor="middle"
                fontSize="12"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.1 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {target} − {knownSum} = {U}
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the chop working, final step */}
        <AnimatePresence>
          {showChop && (
            <motion.g key="fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.text
                x={W / 2}
                y={110}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="800"
                fill={DIM}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {Math.pow(10, chopWidth)} ≡ 0 (mod {divisor2}) → {headDigits.join("") || "0"} drops out
              </motion.text>
              <motion.text
                x={W / 2}
                y={140}
                textAnchor="middle"
                fontSize="15"
                fontWeight="800"
                fill={MARK}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.9 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {tailDigits.join("")} = {divisor2} × {quotient} + {remainder}
              </motion.text>
              <motion.text
                x={W / 2}
                y={164}
                textAnchor="middle"
                fontSize="19"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.4 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                remainder {remainder}
              </motion.text>
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
          fontSize: 11.5,
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
            transition={{ delay: 1.8 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {!agrees
              ? `this gives ${remainder}, which is not the stored answer`
              : trapChoice
              ? `chopping one digit short (${shortTail.join("")}) gives ${shortRemainder} — choice ${trapChoice.label}`
              : `${fullNumber} ÷ ${divisor2} leaves remainder ${remainder}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.9 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
