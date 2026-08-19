import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WARN = "#b45309";

/** Exact-ish display: never rounds a value into a different number. */
const fmt = (v: number) => {
  const r = Number(v.toFixed(6));
  return r.toLocaleString("en-US", { maximumFractionDigits: 6 });
};
/** Same value with no separators, for labels that must stay narrow. */
const plain = (v: number) => String(Number(v.toFixed(6)));

type Link = { op: "×" | "÷"; value: number; unit: string; why: string };

/**
 * A quantity carried through a **chain of unit conversions and rates** to an
 * answer in different units (a file size at a download speed, a distance at a
 * pace). Nothing here is hard — every step is one multiplication or division —
 * so the whole difficulty is *bookkeeping*: which way each factor goes, and when
 * to stop. The scene therefore makes the units the visible object rather than the
 * arithmetic. Each link cancels the unit it arrives with (`× 8000 kilobits per
 * megabyte` kills megabytes; `÷ 56 kilobits per second` kills kilobits and leaves
 * seconds), and the cancelled unit is struck out **measured by character index**,
 * so the rule "the old unit has to disappear" is watched happening rather than
 * asserted. The middle beat is the one that earns the theme: dividing by a rate
 * is drawn as the quantity actually being *delivered*, a zoomed inset showing the
 * first few one-second chunks at true size next to the full track filling, since
 * 600 chunks at real scale would be sub-pixel. The closing beat lays the whole
 * chain out as cards and then **prices the mistakes**: it flips the operation at
 * each link in turn, and stops the chain early at each link, computing where each
 * slip lands and naming the answer choice it hits — so distractors are discovered,
 * never authored. `traps` may name a plausible *misread factor*; even then only
 * the narration is authored, the value and its matching choice are computed, and
 * a trap that hits no choice is silently dropped. Data
 * `{ start, startUnit, chain: ["×|8000|kilobits|kilobits in a megabyte", ...],
 *   icon?, traps?: ["0|8|used 8 bits per byte", ...] }`.
 */
export function UnitChainScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const start = num(data.start, 0);
  const startUnit = String(data.startUnit ?? "units");
  const icon = String(data.icon ?? "📦");
  const subject = String(data.subject ?? "amount");

  const links: Link[] = (Array.isArray(data.chain) ? (data.chain as unknown[]) : []).map((raw) => {
    const [op, value, unit, why] = String(raw).split("|");
    return { op: op === "÷" ? "÷" : "×", value: Number(value), unit: String(unit ?? ""), why: String(why ?? "") };
  });

  const apply = (v: number, l: Link) => (l.op === "×" ? v * l.value : v / l.value);
  // running value after each link, so values[0] is the start
  const values = links.reduce<number[]>((acc, l) => [...acc, apply(acc[acc.length - 1], l)], [start]);
  const units = [startUnit, ...links.map((l) => l.unit)];
  const result = values[values.length - 1];
  const resultUnit = units[units.length - 1];

  // ---- answer choices, normalising the data's U+2212 minus ----
  const choiceOf = (v: number) =>
    (problem.choices ?? []).find(
      (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === v,
    )?.label ?? null;

  // ---- slips, discovered rather than authored ----
  const runFrom = (override: (i: number, l: Link) => Link | null, stopAfter = links.length) => {
    let v = start;
    for (let i = 0; i < stopAfter; i++) {
      const l = override(i, links[i]) ?? links[i];
      v = apply(v, l);
    }
    return v;
  };
  const flips = links.map((l, i) => ({
    at: i,
    label: `did ${l.op === "×" ? "÷" : "×"} ${fmt(l.value)} instead of ${l.op} ${fmt(l.value)}`,
    value: runFrom((j, link) => (j === i ? { ...link, op: link.op === "×" ? "÷" : "×" } : link)),
  }));
  const stops = links.slice(0, -1).map((_, i) => ({
    at: i,
    label: `stopped at ${units[i + 1]}`,
    value: values[i + 1],
  }));
  const authored = (Array.isArray(data.traps) ? (data.traps as unknown[]) : []).map((raw) => {
    const [at, value, label] = String(raw).split("|");
    const i = Number(at);
    return {
      at: i,
      label: String(label ?? ""),
      value: runFrom((j, link) => (j === i ? { ...link, value: Number(value) } : link)),
    };
  });
  const traps = [...authored, ...flips, ...stops]
    .map((t) => ({ ...t, choice: choiceOf(t.value) }))
    .filter((t) => t.choice != null && t.choice !== problem.answer)
    .filter((t, i, all) => all.findIndex((o) => o.choice === t.choice) === i)
    .slice(0, 3);
  // the classic "stop one step early" value, and whether the test even offers it
  const nearMiss = stops.length ? stops[stops.length - 1] : null;

  const answerOk =
    problem.shortAnswer == null || String(problem.shortAnswer).replace(/[^\d.]/g, "") === String(fmt(result)).replace(/,/g, "");
  const ok = links.length > 0 && Number.isFinite(result) && answerOk;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 272;
  const cw = 0.6; // monospace advance as a fraction of font size

  // ---- the delivery beat needs a link that divides by a rate ----
  const rateIdx = Math.min(1, Math.max(0, links.length - 2));
  const rate = links[rateIdx];
  const before = values[rateIdx];
  const chunks = values[rateIdx + 1];
  const shown = Math.min(5, Math.max(2, Math.floor(chunks)));

  const trackX = 60;
  const trackW = 350;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ============ phase 0: the quantity restated in the units the rate speaks ============ */}
        {phase === 0 && links.length > 0 && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              the speed is per {links[0].unit}, so measure the {subject} in {links[0].unit} first
            </text>

            {/* the file */}
            <motion.g
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect x={28} y={44} width={72} height={54} rx={8} fill="#eef2ff" stroke={IND} strokeWidth={1.8} />
              <text x={64} y={70} textAnchor="middle" fontSize="20">
                {icon}
              </text>
              <text x={64} y={88} textAnchor="middle" fontSize="11" fontWeight="800" fill={IND} fontFamily={numberFont}>
                {fmt(start)}
              </text>
            </motion.g>
            <text x={64} y={112} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM}>
              {startUnit}
            </text>

            {/* the conversion arrow */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <line x1={108} y1={71} x2={150} y2={71} stroke={TEAL} strokeWidth={2} />
              <path d="M 150 71 l -7 -4 M 150 71 l -7 4" fill="none" stroke={TEAL} strokeWidth={2} strokeLinecap="round" />
              <text x={129} y={62} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={TEAL} fontFamily={numberFont}>
                {links[0].op} {plain(links[0].value)}
              </text>
            </motion.g>

            {/* it unpacks into a long bar of the new unit */}
            <motion.rect
              y={52}
              height={38}
              rx={5}
              fill={TEAL}
              fillOpacity={0.28}
              stroke={TEAL}
              strokeWidth={1.6}
              initial={{ x: 158, width: 10 }}
              animate={{ x: 158, width: 282 }}
              transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.7 }}
            />
            <motion.text
              x={299}
              y={76}
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {fmt(values[1])}
            </motion.text>
            <motion.text
              x={299}
              y={104}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="700"
              fill={TEAL}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {links[0].unit}
            </motion.text>

            {/* the units cancelling, struck by character index */}
            {(() => {
              // the denominator reads singular, so each strike is measured on its own word
              const sUnit = startUnit.replace(/s$/, "");
              const line = `${fmt(start)} ${startUnit}  ×  ${fmt(links[0].value)} ${links[0].unit} / ${sUnit}`;
              const fs = 10.5;
              const x0 = W / 2 - (line.length * fs * cw) / 2;
              const at = (i: number) => x0 + i * fs * cw;
              const s1 = line.indexOf(startUnit);
              const s2 = line.lastIndexOf(sUnit);
              return (
                <g>
                  {/* laid out one character at a time, so the strikes and the glyphs
                      share a coordinate system instead of trusting the real advance */}
                  {line.split("").map((ch, i) =>
                    ch === " " ? null : (
                      <text key={i} x={at(i)} y={152} fontSize={fs} fontWeight="700" fill={INK} fontFamily={numberFont}>
                        {ch}
                      </text>
                    ),
                  )}
                  {[
                    { i: s1, n: startUnit.length },
                    { i: s2, n: sUnit.length },
                  ].map((k, idx) => (
                    <motion.line
                      key={idx}
                      x1={at(k.i)}
                      y1={148}
                      x2={at(k.i + k.n)}
                      y2={148}
                      stroke={BAD}
                      strokeWidth={1.8}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 1.6 + idx * 0.25 }}
                    />
                  ))}
                </g>
              );
            })()}
            <motion.text
              x={W / 2}
              y={176}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="700"
              fill={DIM}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              {startUnit} cancels, leaving {links[0].unit}
            </motion.text>
            <motion.text
              x={W / 2}
              y={206}
              textAnchor="middle"
              fontSize="15"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 2.4 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {fmt(start)} × {fmt(links[0].value)} = {fmt(values[1])} {links[0].unit}
            </motion.text>
            <text x={W / 2} y={230} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM}>
              {links[0].why}
            </text>
          </g>
        )}

        {/* ============ phase 1: dividing by a rate = watching it be delivered ============ */}
        {phase === 1 && rate && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              {fmt(rate.value)} {units[rateIdx]} arrive every {units[rateIdx + 1].replace(/s$/, "")}
            </text>

            {/* zoomed inset: the first few chunks at a size you can see */}
            <text x={30} y={44} fontSize="9.5" fontWeight="700" fill={DIM}>
              one {units[rateIdx + 1].replace(/s$/, "")} at a time —
            </text>
            {Array.from({ length: shown }).map((_, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.25 + i * 0.22 }}
              >
                <rect x={38 + i * 62} y={54} width={54} height={30} rx={4} fill={TEAL} fillOpacity={0.3} stroke={TEAL} strokeWidth={1.5} />
                <text x={65 + i * 62} y={74} textAnchor="middle" fontSize="11" fontWeight="800" fill={TEAL} fontFamily={numberFont}>
                  {fmt(rate.value)}
                </text>
                <text x={65 + i * 62} y={97} textAnchor="middle" fontSize="9" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                  {i + 1}
                </text>
              </motion.g>
            ))}
            <motion.text
              x={38 + shown * 62 + 12}
              y={74}
              fontSize="12"
              fontWeight="800"
              fill={DIM}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              …
            </motion.text>

            {/* the whole track filling */}
            <text x={30} y={126} fontSize="9.5" fontWeight="700" fill={DIM}>
              the whole {subject}:
            </text>
            <rect x={trackX} y={136} width={trackW} height={26} rx={5} fill="#f1f5f9" stroke={DIM} strokeWidth={1.4} />
            <motion.rect
              y={136}
              height={26}
              rx={5}
              fill={TEAL}
              fillOpacity={0.45}
              initial={{ x: trackX, width: 0 }}
              animate={{ x: trackX, width: trackW }}
              transition={{ duration: 1.6, delay: 1.2, ease: "linear" }}
            />
            <text x={trackX + trackW / 2} y={154} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {fmt(before)} {units[rateIdx]}
            </text>
            <motion.text
              x={30}
              y={155}
              fontSize="17"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              🖥️
            </motion.text>

            <motion.text
              x={W / 2}
              y={190}
              textAnchor="middle"
              fontSize="15"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 2.2 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {fmt(before)} ÷ {fmt(rate.value)} = {fmt(chunks)} {units[rateIdx + 1]}
            </motion.text>

            {/* the units again */}
            <motion.text
              x={W / 2}
              y={214}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={DIM}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              {units[rateIdx]} ÷ ({units[rateIdx]} per {units[rateIdx + 1].replace(/s$/, "")}) leaves {units[rateIdx + 1]}
            </motion.text>
            <text x={W / 2} y={236} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM}>
              {rate.why}
            </text>
          </g>
        )}

        {/* ============ phase 2: the last conversion, grouped ============ */}
        {phase === 2 && links.length >= 3 && (
          <g>
            {(() => {
              const l = links[links.length - 1];
              const from = values[values.length - 2];
              const groups = Math.round(values[values.length - 1]);
              const drawn = Math.min(groups, 12);
              const gw = Math.min(30, 348 / drawn);
              const gx = (W - drawn * gw) / 2;
              return (
                <g>
                  <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                    {fmt(from)} {units[units.length - 2]} in groups of {fmt(l.value)}
                  </text>
                  {/* the bar breaking into groups */}
                  {Array.from({ length: drawn }).map((_, i) => (
                    <motion.g
                      key={i}
                      initial={{ opacity: 0, scaleY: 0.2 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.3 + i * 0.11 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <rect x={gx + i * gw} y={58} width={gw - 3} height={40} rx={4} fill={IND} fillOpacity={0.26} stroke={IND} strokeWidth={1.5} />
                      <text x={gx + i * gw + (gw - 3) / 2} y={83} textAnchor="middle" fontSize="9" fontWeight="800" fill={IND} fontFamily={numberFont}>
                        {fmt(l.value)}
                      </text>
                    </motion.g>
                  ))}
                  {/* one clock chip per group */}
                  {Array.from({ length: drawn }).map((_, i) => (
                    <motion.text
                      key={`c${i}`}
                      x={gx + i * gw + (gw - 3) / 2}
                      y={124}
                      textAnchor="middle"
                      fontSize="14"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 1.5 + i * 0.09 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      {/* the clock face advances an hour per group, so the row reads as time passing */}
                      {String.fromCodePoint(0x1f550 + (i % 12))}
                    </motion.text>
                  ))}
                  <motion.text
                    x={W / 2}
                    y={150}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill={DIM}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.6 }}
                  >
                    {groups > drawn ? `${fmt(groups)} groups in all` : `one ${l.unit.replace(/s$/, "")} each`}
                  </motion.text>
                  <motion.text
                    x={W / 2}
                    y={186}
                    textAnchor="middle"
                    fontSize="16"
                    fontWeight="800"
                    fill={WIN}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 2.8 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {fmt(from)} ÷ {fmt(l.value)} = {fmt(values[values.length - 1])} {l.unit}
                  </motion.text>
                  <text x={W / 2} y={212} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM}>
                    {l.why}
                  </text>
                </g>
              );
            })()}
          </g>
        )}

        {/* ============ phase 3: the whole chain, and what the wrong turns cost ============ */}
        {phase === 3 && (
          <g>
            <text x={W / 2} y={18} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              every step kills the unit it arrives with
            </text>
            {(() => {
              const n = values.length;
              const cardW = 78;
              const gap = 44;
              const total = n * cardW + (n - 1) * gap;
              const x0 = (W - total) / 2;
              return (
                <g>
                  {values.map((v, i) => (
                    <motion.g
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 240, damping: 17, delay: 0.2 + i * 0.35 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <rect
                        x={x0 + i * (cardW + gap)}
                        y={44}
                        width={cardW}
                        height={40}
                        rx={6}
                        fill={i === n - 1 ? "#dcfce7" : "#f8fafc"}
                        stroke={i === n - 1 ? WIN : DIM}
                        strokeWidth={i === n - 1 ? 2 : 1.4}
                      />
                      <text
                        x={x0 + i * (cardW + gap) + cardW / 2}
                        y={62}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="800"
                        fill={i === n - 1 ? WIN : INK}
                        fontFamily={numberFont}
                      >
                        {fmt(v)}
                      </text>
                      <text
                        x={x0 + i * (cardW + gap) + cardW / 2}
                        y={77}
                        textAnchor="middle"
                        fontSize="8.5"
                        fontWeight="700"
                        fill={i === n - 1 ? WIN : DIM}
                      >
                        {units[i]}
                      </text>
                    </motion.g>
                  ))}
                  {links.map((l, i) => (
                    <motion.g
                      key={`a${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.42 + i * 0.35 }}
                    >
                      <line
                        x1={x0 + i * (cardW + gap) + cardW + 5}
                        y1={64}
                        x2={x0 + (i + 1) * (cardW + gap) - 6}
                        y2={64}
                        stroke={TEAL}
                        strokeWidth={1.8}
                      />
                      <path
                        d={`M ${x0 + (i + 1) * (cardW + gap) - 6} 64 l -6 -3.5 M ${x0 + (i + 1) * (cardW + gap) - 6} 64 l -6 3.5`}
                        fill="none"
                        stroke={TEAL}
                        strokeWidth={1.8}
                        strokeLinecap="round"
                      />
                      <text
                        x={x0 + i * (cardW + gap) + cardW + gap / 2}
                        y={54}
                        textAnchor="middle"
                        fontSize="10.5"
                        fontWeight="800"
                        fill={TEAL}
                        fontFamily={numberFont}
                      >
                        {l.op} {plain(l.value)}
                      </text>
                    </motion.g>
                  ))}
                </g>
              );
            })()}

            {/* the wrong turns, each one computed */}
            <motion.text
              x={W / 2}
              y={112}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="800"
              fill={WARN}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {traps.length > 1 ? "where the other choices come from" : traps.length === 1 ? "where one of the other choices comes from" : ""}
            </motion.text>
            {traps.map((t, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: 1.7 + i * 0.25 }}
              >
                <rect x={34} y={124 + i * 26} width={402} height={22} rx={5} fill="#fffbeb" stroke="#fde68a" strokeWidth={1.2} />
                <text x={44} y={139 + i * 26} fontSize="9.5" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                  {t.choice}
                </text>
                <text x={60} y={139 + i * 26} fontSize="9.5" fontWeight="700" fill={INK}>
                  {t.label}
                </text>
                <text x={428} y={139 + i * 26} textAnchor="end" fontSize="9.5" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                  {fmt(t.value)}
                </text>
              </motion.g>
            ))}

            {nearMiss && !choiceOf(nearMiss.value) && (
              <motion.text
                x={W / 2}
                y={136 + traps.length * 26}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={DIM}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4 }}
              >
                stopping at {fmt(nearMiss.value)} {units[units.length - 2]} is the usual slip — and it is deliberately not offered
              </motion.text>
            )}

            <motion.text
              x={W / 2}
              y={160 + traps.length * 26}
              textAnchor="middle"
              fontSize="16"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 2.6 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {fmt(result)} {resultUnit}
            </motion.text>
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
          ? `${fmt(start)} ${startUnit} = ${fmt(values[1] ?? 0)} ${units[1] ?? ""}`
          : phase === 1
          ? `${fmt(chunks)} ${units[rateIdx + 1] ?? ""}`
          : phase === 2
          ? `${fmt(result)} ${resultUnit}`
          : `${fmt(result)} ${resultUnit}`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed:{" "}
          {links.length === 0
            ? "no conversion chain supplied"
            : !Number.isFinite(result)
            ? "the chain did not produce a finite value"
            : `computed ${fmt(result)} but the stored answer is ${problem.shortAnswer}`}
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
