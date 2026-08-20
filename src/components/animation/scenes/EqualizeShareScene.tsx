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
const CASH = "#15803d";
const CASH_FILL = "#bbf7d0";
const MOVE = "#b45309";
const MOVE_FILL = "#fde68a";

const W = 520;
const H = 296;
const BASE = 244;
const PITCH = 16;
const NOTE_H = 13;

/**
 * People holding unequal amounts that get pooled and shared out equally, asking
 * how much one of them hands over. The unlock is that every amount is a whole
 * number of one common note (15, 20, 25 and 40 are 3, 4, 5 and 8 fives), so the
 * whole problem becomes **levelling four stacks** — and the notes the tall stack
 * sheds are exactly the ones the short stacks are missing. The scene works in
 * that note (the gcd of the amounts and the share), so nothing is drawn to scale
 * that could not be counted.
 *
 * The beats are the story: four unequal stacks, every note flying into one pot,
 * the pot dealt back out in equal piles with the share line drawn across, then
 * the original stacks again with the surplus notes physically travelling into
 * the gaps. That last beat gives the answer twice over — the giver's overhang,
 * and the receivers' shortfalls, which have to add to the same amount because no
 * money enters or leaves. Surplus notes are paired to deficit slots by walking
 * both lists, so the transfer is discovered rather than authored, and the closing
 * line names any number met on the way that is itself an answer choice.
 *
 * Share, note value, every stack, the pairing and the totals are computed; data
 * `{ amounts: [15, 20, 25, 40], icons?: ["🧒", ...], unit?, ask? }` with `ask`
 * the index of the person the question is about.
 */
export function EqualizeShareScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const unit = String(data.unit ?? "$");
  const amounts = (Array.isArray(data.amounts) ? data.amounts : []).map((a) => Math.max(0, Math.round(num(a, 0))));
  const icons = (Array.isArray(data.icons) ? data.icons : []).map((i) => String(i));
  const n = Math.max(1, amounts.length);
  const total = amounts.reduce((a, b) => a + b, 0);
  const share = total / n;
  const ask = Math.min(n - 1, Math.max(0, Math.round(num(data.ask, n - 1))));
  const money = (v: number) => (unit === "$" ? `$${v}` : `${v} ${unit}`);

  // ---- one note that measures every stack and the share exactly ----
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const noteVal = [...amounts, share].reduce((g, v) => gcd(g, Math.round(v)), 0) || 1;
  const bills = amounts.map((a) => Math.round(a / noteVal));
  const shareBills = Math.round(share / noteVal);
  const N = bills.reduce((a, b) => a + b, 0);

  // ---- who is over the line, who is under, and which note fills which gap ----
  const gives = amounts.map((a) => a - share);
  const surplus: { i: number; k: number }[] = [];
  const gaps: { i: number; k: number }[] = [];
  bills.forEach((b, i) => {
    for (let k = shareBills; k < b; k += 1) surplus.push({ i, k });
    for (let k = b; k < shareBills; k += 1) gaps.push({ i, k });
  });
  const moves = surplus.map((from, j) => ({ from, to: gaps[j] })).filter((m) => m.to);

  const askGive = gives[ask];
  const answerNum = Number(String(problem.shortAnswer ?? "").replace(/[^\d.-]/g, ""));

  // numbers met on the way that are themselves answer choices
  const choiceFor = (value: number) => {
    const hit = (problem.choices ?? []).find((c) => {
      const v = Number(
        String(c.text)
          .replace(/[−–—]/g, "-")
          .replace(/[^\d.-]/g, "")
      );
      return Number.isFinite(v) && v === value;
    });
    return hit?.label ?? null;
  };
  const shareChoice = share === Math.abs(askGive) ? null : choiceFor(share);
  const backChoices = gives
    .filter((g) => g < 0)
    .map((g) => -g)
    .filter((v, i, all) => v !== Math.abs(askGive) && all.indexOf(v) === i)
    .map((v) => ({ v, label: choiceFor(v) }))
    .filter((d) => d.label);
  const decoyLine = [
    shareChoice ? `${shareChoice} ${money(share)} the share` : "",
    backChoices.length
      ? `${backChoices.map((d) => `${d.label} ${money(d.v)}`).join(", ")} what the short friends get back`
      : "",
  ]
    .filter(Boolean)
    .join("  ·  ");

  const splitsEvenly = Number.isInteger(share);
  const paired = surplus.length === gaps.length;
  const answerOk = !Number.isFinite(answerNum) || answerNum === Math.abs(askGive);
  const ok = splitsEvenly && paired && answerOk;

  const lastStep = totalSteps - 1;
  const isFinal = beat >= lastStep;
  const phase = isFinal ? 3 : Math.min(Math.max(beat, 0), 3);

  // ---------------- geometry ----------------
  const xs = amounts.map((_, i) => (W / (n + 1)) * (i + 1));
  const noteW = Math.min(44, (W / (n + 1)) * 0.78);
  const stackY = (k: number) => BASE - (k + 1) * PITCH;
  const lineY = BASE - shareBills * PITCH;

  const cols = Math.min(10, Math.max(1, N));
  const poolW = Math.min(noteW, (W - 40) / cols - 3);
  const poolLeft = (W - (cols * (poolW + 3) - 3)) / 2;
  const poolX = (k: number) => poolLeft + (k % cols) * (poolW + 3) + poolW / 2;
  const poolY = (k: number) => BASE - (Math.floor(k / cols) + 1) * PITCH;
  const poolTop = BASE - Math.ceil(N / cols) * PITCH;

  // pool order: everyone's notes in turn, so a note knows the stack it came from
  const owners: { i: number; k: number }[] = [];
  bills.forEach((b, i) => {
    for (let k = 0; k < b; k += 1) owners.push({ i, k });
  });

  const Note = ({
    x,
    y,
    w,
    dx = 0,
    dy = 0,
    delay,
    moved = false,
  }: {
    x: number;
    y: number;
    w: number;
    dx?: number;
    dy?: number;
    delay: number;
    moved?: boolean;
  }) => {
    const flying = dx !== 0 || dy !== 0;
    return (
      <motion.g
        initial={flying ? { x: dx, y: dy, opacity: 1 } : { opacity: 0, scale: 0.5 }}
        animate={flying ? { x: 0, y: 0, opacity: 1 } : { opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 17, delay }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <rect
          x={x - w / 2}
          y={y}
          width={w}
          height={NOTE_H}
          rx={2.5}
          fill={moved ? MOVE_FILL : CASH_FILL}
          stroke={moved ? MOVE : CASH}
          strokeWidth={1.1}
        />
        <text
          x={x}
          y={y + 9.6}
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="800"
          fill={moved ? MOVE : CASH}
          fontFamily={numberFont}
        >
          {money(noteVal)}
        </text>
      </motion.g>
    );
  };

  const title =
    phase === 0
      ? `four friends, four different piles — each note is ${money(noteVal)}`
      : phase === 1
      ? "splitting equally means it all goes into one pot"
      : phase === 2
      ? `the pot is dealt back out, ${n} equal piles`
      : "everything above the line is what changes hands";

  const equation =
    phase === 1
      ? `${amounts.join(" + ")} = ${total}`
      : phase === 2
      ? `${total} ÷ ${n} = ${share}`
      : phase === 3
      ? `${amounts[ask]} − ${share} = ${Math.abs(askGive)}`
      : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 520 }}>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
          {title}
        </text>
        {equation && (
          <motion.text
            x={W / 2}
            y={42}
            textAnchor="middle"
            fontSize="15"
            fontWeight="800"
            fill={IND}
            fontFamily={numberFont}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16, delay: phase === 3 ? 1.5 : 1.1 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            {equation}
          </motion.text>
        )}

        {/* the table everything stands on */}
        <line x1={24} y1={BASE} x2={W - 24} y2={BASE} stroke="#cbd5e1" strokeWidth={2} strokeLinecap="round" />

        {/* the equal-share line, once the share is known */}
        {phase >= 2 && (
          <g>
            <motion.line
              x1={34}
              y1={lineY}
              x2={W - 34}
              y2={lineY}
              stroke={IND}
              strokeWidth={1.6}
              strokeDasharray="6 4"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{ transformBox: "fill-box", transformOrigin: "left" }}
            />
            <motion.text
              x={34}
              y={lineY - 6}
              textAnchor="start"
              fontSize="10.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {money(share)} each
            </motion.text>
          </g>
        )}

        {/* ---------------- phase 0: the four stacks as they were earned ------------- */}
        {phase === 0 &&
          bills.map((b, i) => (
            <g key={i}>
              {Array.from({ length: b }).map((_, k) => (
                <Note key={k} x={xs[i]} y={stackY(k)} w={noteW} delay={0.1 + i * 0.25 + k * 0.06} />
              ))}
            </g>
          ))}

        {/* ---------------- phase 1: every note flies into one pot ------------------- */}
        {phase === 1 && (
          <g>
            {owners.map((o, j) => (
              <Note
                key={j}
                x={poolX(j)}
                y={poolY(j)}
                w={poolW}
                dx={xs[o.i] - poolX(j)}
                dy={stackY(o.k) - poolY(j)}
                delay={0.15 + j * 0.04}
              />
            ))}
            <motion.text
              x={W / 2}
              y={poolTop - 10}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={CASH}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.3 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {money(total)} in the pot — {N} notes
            </motion.text>
          </g>
        )}

        {/* ---------------- phase 2: dealt back out in equal piles ------------------- */}
        {phase === 2 &&
          bills.map((_, i) => (
            <g key={i}>
              {Array.from({ length: shareBills }).map((_, k) => {
                const src = i * shareBills + k;
                return (
                  <Note
                    key={k}
                    x={xs[i]}
                    y={stackY(k)}
                    w={noteW}
                    dx={poolX(src) - xs[i]}
                    dy={poolY(src) - stackY(k)}
                    delay={0.3 + (k * n + i) * 0.06}
                  />
                );
              })}
            </g>
          ))}

        {/* ------------- phase 3: the surplus notes travel into the gaps ------------- */}
        {phase === 3 && (
          <g>
            {bills.map((b, i) => (
              <g key={i}>
                {Array.from({ length: Math.min(b, shareBills) }).map((_, k) => (
                  <Note key={k} x={xs[i]} y={stackY(k)} w={noteW} delay={0.1 + i * 0.12 + k * 0.04} />
                ))}
              </g>
            ))}
            {moves.map((m, j) => (
              <Note
                key={j}
                x={xs[m.to.i]}
                y={stackY(m.to.k)}
                w={noteW}
                dx={xs[m.from.i] - xs[m.to.i]}
                dy={stackY(m.from.k) - stackY(m.to.k)}
                delay={0.9 + j * 0.28}
                moved
              />
            ))}
            {/* what the asked person hands over, measured on their own stack */}
            {bills[ask] > shareBills && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <line
                  x1={xs[ask] + noteW / 2 + 9}
                  y1={stackY(bills[ask] - 1)}
                  x2={xs[ask] + noteW / 2 + 9}
                  y2={lineY}
                  stroke={MOVE}
                  strokeWidth={1.6}
                />
                <line x1={xs[ask] + noteW / 2 + 5} y1={stackY(bills[ask] - 1)} x2={xs[ask] + noteW / 2 + 13} y2={stackY(bills[ask] - 1)} stroke={MOVE} strokeWidth={1.6} />
                <line x1={xs[ask] + noteW / 2 + 5} y1={lineY} x2={xs[ask] + noteW / 2 + 13} y2={lineY} stroke={MOVE} strokeWidth={1.6} />
                <text
                  x={xs[ask] + noteW / 2 + 17}
                  y={(stackY(bills[ask] - 1) + lineY) / 2 + 4}
                  fontSize="11"
                  fontWeight="800"
                  fill={MOVE}
                  fontFamily={numberFont}
                >
                  {money(Math.abs(askGive))}
                </text>
              </motion.g>
            )}
            <motion.text
              x={W / 2}
              y={62}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="700"
              fill={WARN}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              the others were short {gives.filter((_, i) => i !== ask).map((g) => Math.max(0, -g)).join(" + ")} ={" "}
              {gives.reduce((s, g) => s + Math.max(0, -g), 0)} — no money enters or leaves
            </motion.text>
            {decoyLine && (
              <motion.text
                x={W / 2}
                y={78}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={DIM}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                on the answer list too: {decoyLine}
              </motion.text>
            )}
          </g>
        )}

        {/* the friends and what each one is holding on this beat */}
        {amounts.map((a, i) => (
          <g key={`who${i}`}>
            <text x={xs[i]} y={262} textAnchor="middle" fontSize="16">
              {icons[i] ?? "🙂"}
            </text>
            <text
              x={xs[i]}
              y={278}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="800"
              fill={phase === 2 || (phase === 3 && i === ask) ? IND : INK}
              fontFamily={numberFont}
            >
              {phase === 2 ? money(share) : money(a)}
            </text>
            {phase === 3 && gives[i] !== 0 && (
              <motion.text
                x={xs[i]}
                y={291}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="800"
                fill={gives[i] > 0 ? MOVE : CASH}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                {gives[i] > 0 ? "−" : "+"}
                {money(Math.abs(gives[i]))}
              </motion.text>
            )}
          </g>
        ))}
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
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {phase === 0
          ? `${amounts.map((a) => money(a)).join(", ")} — ${bills.join(", ")} notes`
          : phase === 1
          ? `${money(total)} altogether`
          : phase === 2
          ? `${money(share)} each`
          : `the ${money(amounts[ask])} friend ${askGive > 0 ? "hands over" : "takes in"} ${money(Math.abs(askGive))}`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          {!splitsEvenly
            ? `check failed: ${money(total)} does not split evenly among ${n}`
            : !paired
            ? `check failed: ${surplus.length} surplus notes but ${gaps.length} gaps`
            : `check failed: the overhang is ${money(Math.abs(askGive))}, the stored answer is ${problem.shortAnswer}`}
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.2 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
