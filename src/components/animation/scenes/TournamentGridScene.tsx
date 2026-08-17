import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const HOT = "#f59e0b";
const DIM = "#94a3b8";
const WIN = "#16a34a";
const BAD = "#dc2626";

const W = 340;
const H = 200;
const GX = 74;
const PITCH = 30;
const CW = 26;
const RY = 32;
const RH = 23;
const RP = 26;

/**
 * Round-by-round win/loss records for a set of players, one of them unknown.
 * The unlock is a **column** fact, not a row one: in every round the players
 * pair off, so each round produces exactly half as many wins as there are
 * players — which means every column of the table holds a fixed number of 1s,
 * and the missing player's entry is forced one column at a time. (Counting the
 * unknown player's *total* wins is not enough on its own: several answer choices
 * usually carry that same total, and the scene says so.) The beats lay the table
 * out with the totals counting up, show the pairing that fixes the column sum
 * and apply it to the first column, sweep the rest so the unknown row fills in
 * left to right, then read it off and cross-check the grand total against the
 * number of matches. Every derived digit comes from its column; the scene flags
 * a column that cannot be completed, and reports how many choices share the
 * winner's win count. Data: { rows: ["Lola 111011", ..., "Tiyo ??????"] }.
 */
export function TournamentGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const parsed = (Array.isArray(data.rows) ? data.rows : [])
    .map(String)
    .map((s) => {
      const t = s.trim().split(/\s+/);
      return { name: t[0] ?? "", cells: (t[1] ?? "").split("") };
    })
    .filter((r) => r.name && r.cells.length);
  if (parsed.length < 2) return null;

  const cols = parsed[0].cells.length;
  if (parsed.some((r) => r.cells.length !== cols)) return null;
  const unknown = parsed.findIndex((r) => r.cells.some((c) => c === "?"));
  if (unknown < 0) return null;

  const perCol = parsed.length / 2; // each round the players pair off, so half of them win
  const solved = parsed[unknown].cells.map((c, i) => {
    if (c !== "?") return Number(c);
    const known = parsed.reduce((s, r, ri) => (ri === unknown ? s : s + Number(r.cells[i])), 0);
    return perCol - known;
  });
  const ok = solved.every((v) => v === 0 || v === 1);
  const record = solved.join("");

  const winsOf = (ri: number) => (ri === unknown ? solved.reduce((a, b) => a + b, 0) : parsed[ri].cells.reduce((a, c) => a + Number(c), 0));
  const grand = parsed.reduce((s, _, ri) => s + winsOf(ri), 0);
  const matches = cols * perCol;

  const opts = (problem.choices ?? []).map((c) => ({ label: c.label, text: String(c.text).trim() }));
  const hit = opts.find((o) => o.text === record);
  const sameCount = opts.filter((o) => o.text.split("").filter((d) => d === "1").length === winsOf(unknown)).length;
  const agrees = ok && (problem.shortAnswer == null || String(problem.shortAnswer) === record);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const filled = step <= 0 ? 0 : step === 1 ? 1 : cols;
  const pairing = step === 1;

  const cellX = (i: number) => GX + i * PITCH;
  const rowY = (r: number) => RY + r * RP;

  const caption = isFinal
    ? `${parsed[unknown].name}'s record is ${record}`
    : step === 0
    ? `${parsed.length} players, ${cols} rounds — one record is missing`
    : step === 1
    ? `the ${parsed.length} pair off into ${perCol} matches each round — ${perCol} wins per column`
    : "each column is missing whatever it takes to reach two — fill them all in";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* round headers */}
        {Array.from({ length: cols }).map((_, i) => (
          <motion.text
            key={`h${i}`}
            x={cellX(i) + CW / 2}
            y={24}
            textAnchor="middle"
            fontSize="9"
            fontWeight="800"
            fill={filled > i && step >= 1 ? MARK : DIM}
            fontFamily={numberFont}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 * i }}
          >
            {i + 1}
          </motion.text>
        ))}
        <text x={12} y={24} fontSize="9" fontWeight="800" fill={DIM} fontFamily={numberFont}>
          round
        </text>

        {/* the highlighted column */}
        <AnimatePresence>
          {step === 1 && (
            <motion.rect
              key="colhl"
              x={cellX(0) - 3}
              y={RY - 5}
              width={CW + 6}
              height={parsed.length * RP + 4}
              rx={6}
              fill="#fef3c7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {/* the table */}
        {parsed.map((r, ri) => (
          <motion.g key={r.name} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 + ri * 0.14 }}>
            <text x={12} y={rowY(ri) + 16} fontSize="11" fontWeight="800" fill={ri === unknown ? HOT : INK} fontFamily={numberFont}>
              {r.name}
            </text>
            {r.cells.map((c, i) => {
              const known = c !== "?";
              const shown = known ? Number(c) : i < filled ? solved[i] : null;
              const fresh = !known && i < filled;
              return (
                <g key={i}>
                  <rect
                    x={cellX(i)}
                    y={rowY(ri)}
                    width={CW}
                    height={RH}
                    rx={5}
                    fill={shown === 1 ? (fresh ? (isFinal ? WIN : HOT) : MARK) : shown === 0 ? "#fff" : "#fff"}
                    stroke={shown == null ? HOT : shown === 1 ? (fresh ? (isFinal ? WIN : HOT) : MARK) : fresh ? (isFinal ? WIN : HOT) : "#e2e8f0"}
                    strokeWidth={shown == null || fresh ? 1.6 : 1.1}
                    strokeDasharray={shown == null ? "3 3" : undefined}
                  />
                  <AnimatePresence mode="wait">
                    <motion.text
                      key={`${i}-${shown}`}
                      x={cellX(i) + CW / 2}
                      y={rowY(ri) + 16}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="800"
                      fill={shown === 1 ? "#fff" : shown === 0 ? (fresh ? (isFinal ? WIN : HOT) : DIM) : HOT}
                      fontFamily={numberFont}
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: fresh ? 0.3 + i * 0.16 : 0.15 + ri * 0.14 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      {shown == null ? "?" : shown}
                    </motion.text>
                  </AnimatePresence>
                </g>
              );
            })}

            {/* wins per player */}
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.5 + ri * 0.14 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              {(ri !== unknown || filled >= cols) && (
                <>
                  <rect x={258} y={rowY(ri)} width={66} height={RH} rx={6} fill="#eef2ff" stroke={MARK} strokeWidth={1.1} />
                  <text x={291} y={rowY(ri) + 16} textAnchor="middle" fontSize="10" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                    {winsOf(ri)} wins
                  </text>
                </>
              )}
            </motion.g>
          </motion.g>
        ))}

        {/* the column totals */}
        {step >= 1 &&
          Array.from({ length: cols }).map((_, i) =>
            i < filled ? (
              <motion.g key={`s${i}`} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 + i * 0.16 }}>
                <rect x={cellX(i)} y={rowY(parsed.length) + 3} width={CW} height={17} rx={5} fill="#dcfce7" stroke={WIN} strokeWidth={1.1} />
                <text x={cellX(i) + CW / 2} y={rowY(parsed.length) + 15} textAnchor="middle" fontSize="10" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                  {perCol}
                </text>
              </motion.g>
            ) : null
          )}
        {step >= 1 && (
          <text x={12} y={rowY(parsed.length) + 15} fontSize="8.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
            column
          </text>
        )}

        {/* why the column total is fixed */}
        <AnimatePresence>
          {pairing && (
            <motion.g key="pair" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }}>
              {parsed.map((r, i) => (
                <circle key={i} cx={30 + i * 26} cy={178} r={7} fill="#e2e8f0" stroke={INK} strokeWidth={1.1} />
              ))}
              {Array.from({ length: perCol }).map((_, k) => (
                <motion.path
                  key={`arc${k}`}
                  d={`M ${30 + 2 * k * 26} 170 Q ${43 + 2 * k * 26} 156 ${56 + 2 * k * 26} 170`}
                  fill="none"
                  stroke={HOT}
                  strokeWidth={1.6}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + k * 0.2 }}
                />
              ))}
              <text x={30 + parsed.length * 26} y={166} fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                however they pair up, {perCol} matches
              </text>
              <text x={30 + parsed.length * 26} y={182} fontSize="9.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                are played — so {perCol} wins that round
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the finished record, and the tally check */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.text
                x={12}
                y={178}
                fontSize="15"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.1 }}
                style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              >
                {parsed[unknown].name}: {record}
                {hit ? `  (${hit.label})` : ""}
              </motion.text>
              <motion.text x={12} y={194} fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                {parsed.map((_, ri) => winsOf(ri)).join(" + ")} = {grand} wins = {matches} matches played
              </motion.text>
            </motion.g>
          )}
          {step === 2 && !isFinal && (
            <motion.g key="mid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              <text x={12} y={174} fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                counting wins alone would not settle it:
              </text>
              <text x={12} y={190} fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                {sameCount} of the choices also have {winsOf(unknown)} ones
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
            transition={{ delay: 1.7 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && grand === matches ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {!ok
              ? "a column cannot be completed — the records are inconsistent"
              : agrees && grand === matches
              ? `every column came to ${perCol}, and the ${grand} wins match the ${matches} matches`
              : `the columns give ${record}, which is not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.8 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
