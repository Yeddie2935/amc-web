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
const TINT = ["#4338ca", "#0d9488", "#b45309", "#be185d"];

type Person = { name: string; icon: string; past: number | null; now: number };

/**
 * Ages that must add to a given total, where a single event in the past pins
 * some of them: someone turned a stated age and something else was newborn, so
 * both of those are known today by adding the years elapsed, and whoever is left
 * takes up the remainder of the total. The question then asks for a **gap
 * between two of them, not an age**, so the scene lays the ages out as bars and
 * puts the two being compared on a shared left edge, where the answer is simply
 * the overhang. The closing beat is what makes it an age problem rather than
 * arithmetic: **rewinding the clock takes the same number of years off every
 * bar**, so the total drops by years × people while the overhang between two of
 * them is left *exactly* unchanged — the scene shrinks the bars on screen and
 * the gap visibly survives, which both re-derives the answer down a second route
 * and shows why age differences are constant. Today's ages, the leftover, the
 * gap, the rewound total and the rewound gap are all computed, and the two
 * routes have to agree; data
 * `{ total, yearsAgo, people: ["Anna|🧒|", "Bella|👧|6", ...], compare: [a, b] }`
 * where the third field is that person's age at the past moment, blank if it is
 * the unknown one.
 */
export function AgeBarsScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = Math.max(1, num(data.total, 30));
  const ago = Math.max(1, num(data.yearsAgo, 5));
  const raw = (Array.isArray(data.people) ? data.people : []).map((p) => String(p).split("|"));
  const compare = (Array.isArray(data.compare) ? data.compare : []).map((c) => String(c));

  // ---- the past event pins everyone but one; the total hands over the last ----
  const parsed = raw.map(([name, icon, pastAge]) => ({
    name: name ?? "",
    icon: icon ?? "",
    past: pastAge != null && pastAge.trim() !== "" ? num(pastAge, 0) : null,
  }));
  const knownNow = parsed.reduce((s, p) => s + (p.past != null ? p.past + ago : 0), 0);
  const people: Person[] = parsed.map((p) => ({
    ...p,
    now: p.past != null ? p.past + ago : total - knownNow,
  }));
  people.forEach((p) => {
    if (p.past == null) p.past = p.now - ago;
  });

  const A = people.find((p) => p.name === compare[0]) ?? people[0];
  const B = people.find((p) => p.name === compare[1]) ?? people[1];
  const gapNow = A.now - B.now;
  const pastTotal = total - people.length * ago;
  const gapPast = (A.past ?? 0) - (B.past ?? 0);
  const unknown = people.find((p) => parsed[people.indexOf(p)].past == null) ?? people[0];

  const sumOk = people.reduce((s, p) => s + p.now, 0) === total;
  const pastOk = people.reduce((s, p) => s + (p.past ?? 0), 0) === pastTotal;
  const answerOk =
    problem.shortAnswer == null || String(gapNow) === String(problem.shortAnswer).replace(/[^\d-]/g, "");
  const ok = sumOk && pastOk && gapNow === gapPast && answerOk && people.length >= 2;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 262;
  const PX = 330 / total; // pixels per year
  const x0 = 54;

  // known people first, so the unknown one is the visible leftover on the right
  const ordered = [...people].sort((p, q) => (p === unknown ? 1 : 0) - (q === unknown ? 1 : 0));

  const Bar = ({
    x,
    y,
    years,
    colour,
    h = 22,
    delay = 0,
    label,
  }: {
    x: number;
    y: number;
    years: number;
    colour: string;
    h?: number;
    delay?: number;
    label?: string;
  }) => (
    <g>
      <motion.rect
        x={x}
        y={y}
        width={Math.max(0, years * PX)}
        height={h}
        rx={4}
        fill={colour}
        fillOpacity={0.32}
        stroke={colour}
        strokeWidth={1.5}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 16, delay }}
        style={{ transformBox: "fill-box", transformOrigin: "left" }}
      />
      {label && years * PX > 24 && (
        <text x={x + (years * PX) / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={colour} fontFamily={numberFont}>
          {label}
        </text>
      )}
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ================= phase 0: one event in the past pins two ages ================= */}
        {phase === 0 &&
          (() => {
            const known = people.filter((p) => p !== unknown);
            const lx = 128;
            const rx = 340;
            return (
              <g>
                <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  one birthday {ago} years ago fixes two of the three ages
                </text>
                {known.map((p, i) => {
                  const y = 66 + i * 62;
                  return (
                    <g key={p.name}>
                      <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.15 + i * 0.25 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                        <text x={lx} y={y + 6} textAnchor="middle" fontSize="24">
                          {p.icon}
                        </text>
                        <circle cx={lx + 26} cy={y - 2} r={13} fill="#eef2ff" stroke={TINT[i % TINT.length]} strokeWidth={1.4} />
                        <text x={lx + 26} y={y + 2} textAnchor="middle" fontSize="12" fontWeight="800" fill={TINT[i % TINT.length]} fontFamily={numberFont}>
                          {p.past}
                        </text>
                      </motion.g>
                      <motion.path
                        d={`M ${lx + 46},${y - 2} L ${rx - 46},${y - 2}`}
                        stroke={DIM}
                        strokeWidth={1.6}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 + i * 0.25 }}
                      />
                      <path d={`M ${rx - 44},${y - 2} l -7,-4 l 0,8 z`} fill={DIM} />
                      <text x={(lx + rx) / 2} y={y - 10} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                        + {ago}
                      </text>
                      <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 1 + i * 0.25 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                        <text x={rx} y={y + 6} textAnchor="middle" fontSize="24">
                          {p.icon}
                        </text>
                        <circle cx={rx + 26} cy={y - 2} r={13} fill={TINT[i % TINT.length]} />
                        <text x={rx + 26} y={y + 2} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                          {p.now}
                        </text>
                      </motion.g>
                      <text x={lx - 34} y={y + 2} textAnchor="end" fontSize="10.5" fontWeight="700" fill={INK}>
                        {p.name}
                      </text>
                    </g>
                  );
                })}
                <line x1={40} y1={196} x2={W - 30} y2={196} stroke="#cbd5e1" strokeWidth={1.6} />
                {[
                  { x: lx, t: `${ago} years ago` },
                  { x: rx, t: "today" },
                ].map((m) => (
                  <g key={m.t}>
                    <line x1={m.x} y1={190} x2={m.x} y2={202} stroke={INK} strokeWidth={1.6} />
                    <text x={m.x} y={216} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                      {m.t}
                    </text>
                  </g>
                ))}
                <motion.text x={W / 2} y={242} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
                  only {unknown.name}'s age is still unknown
                </motion.text>
              </g>
            );
          })()}

        {/* ================= phase 1: the total hands over the last age ================= */}
        {phase === 1 && (
          <g>
            <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              the three ages together make {total}, so the rest is {unknown.name}'s
            </text>
            {(() => {
              let run = x0;
              return ordered.map((p, i) => {
                const x = run;
                run += p.now * PX;
                const isUnknown = p === unknown;
                return (
                  <g key={p.name}>
                    <Bar x={x} y={92} years={p.now} colour={TINT[people.indexOf(p) % TINT.length]} h={34} delay={0.25 + i * 0.4} label={`${p.now}`} />
                    <text x={x + (p.now * PX) / 2} y={144} textAnchor="middle" fontSize="10" fontWeight="700" fill={INK}>
                      {p.icon} {p.name}
                    </text>
                    {isUnknown && (
                      <motion.text
                        x={x + (p.now * PX) / 2}
                        y={80}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="800"
                        fill={WARN}
                        fontFamily={numberFont}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        what is left
                      </motion.text>
                    )}
                  </g>
                );
              });
            })()}
            {/* the total bracket */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <line x1={x0} y1={62} x2={x0 + total * PX} y2={62} stroke={INK} strokeWidth={1.5} />
              <line x1={x0} y1={57} x2={x0} y2={67} stroke={INK} strokeWidth={1.5} />
              <line x1={x0 + total * PX} y1={57} x2={x0 + total * PX} y2={67} stroke={INK} strokeWidth={1.5} />
              <text x={x0 + (total * PX) / 2} y={52} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {total} years altogether
              </text>
            </motion.g>
            <motion.text
              x={W / 2}
              y={186}
              textAnchor="middle"
              fontSize="15"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              {total} − {people.filter((p) => p !== unknown).map((p) => p.now).join(" − ")} = {unknown.now}
            </motion.text>
            <motion.text x={W / 2} y={212} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
              {unknown.name} is {unknown.now}
            </motion.text>
          </g>
        )}

        {/* ================= phase 2: the question wants the overhang ================= */}
        {phase === 2 && (
          <g>
            <text x={W / 2} y={22} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              line them up from the same edge — the answer is the overhang
            </text>
            {[A, B].map((p, i) => (
              <g key={p.name}>
                <text x={x0 - 10} y={72 + i * 46 + 15} textAnchor="end" fontSize="11" fontWeight="700" fill={INK}>
                  {p.icon} {p.name}
                </text>
                <Bar x={x0} y={72 + i * 46} years={p.now} colour={TINT[people.indexOf(p) % TINT.length]} h={26} delay={0.3 + i * 0.35} label={`${p.now}`} />
              </g>
            ))}
            {/* the overhang */}
            <motion.g initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ type: "spring", stiffness: 120, damping: 16, delay: 1.2 }} style={{ transformBox: "fill-box", transformOrigin: "left" }}>
              <rect x={x0 + B.now * PX} y={68} width={gapNow * PX} height={98} fill={WIN} fillOpacity={0.18} stroke={WIN} strokeWidth={1.6} />
            </motion.g>
            <motion.text
              x={x0 + B.now * PX + (gapNow * PX) / 2}
              y={186}
              textAnchor="middle"
              fontSize="16"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {gapNow}
            </motion.text>
            <motion.text x={W / 2} y={216} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
              {A.now} − {B.now} = {gapNow}
            </motion.text>
            <motion.text x={W / 2} y={238} textAnchor="middle" fontSize="10" fontWeight="700" fill={WARN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
              the question asks how much older, not how old
            </motion.text>
          </g>
        )}

        {/* ================= phase 3: rewind — the gap survives ================= */}
        {phase === 3 && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              wind the clock back and every bar loses the same {ago} years
            </text>
            {[
              { label: "today", ages: [A.now, B.now], y: 50, delay: 0.2 },
              { label: `${ago} years ago`, ages: [A.past ?? 0, B.past ?? 0], y: 146, delay: 0.9 },
            ].map((row, ri) => (
              <g key={row.label}>
                <text x={x0} y={row.y + 4} fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={numberFont}>
                  {row.label}
                </text>
                {row.ages.map((v, i) => {
                  const who = i === 0 ? A : B;
                  return (
                    <g key={i}>
                      <text x={x0 - 10} y={row.y + 20 + i * 34 + 14} textAnchor="end" fontSize="10" fontWeight="700" fill={INK}>
                        {who.icon}
                      </text>
                      <motion.rect
                        x={x0}
                        y={row.y + 20 + i * 34}
                        width={Math.max(1, v * PX)}
                        height={24}
                        rx={4}
                        fill={TINT[people.indexOf(who) % TINT.length]}
                        fillOpacity={0.32}
                        stroke={TINT[people.indexOf(who) % TINT.length]}
                        strokeWidth={1.5}
                        initial={{ width: ri === 1 ? Math.max(1, (v + ago) * PX) : 0 }}
                        animate={{ width: Math.max(1, v * PX) }}
                        transition={{ type: "spring", stiffness: 70, damping: 16, delay: row.delay }}
                      />
                      <text x={x0 + 8} y={row.y + 20 + i * 34 + 16} fontSize="11" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                        {v}
                      </text>
                    </g>
                  );
                })}
                {/* the overhang, the same width on both rows */}
                <motion.rect
                  x={x0 + row.ages[1] * PX}
                  y={row.y + 16}
                  width={(row.ages[0] - row.ages[1]) * PX}
                  height={62}
                  fill={WIN}
                  fillOpacity={0.2}
                  stroke={WIN}
                  strokeWidth={1.6}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: row.delay + 0.5 }}
                />
                <motion.text
                  x={x0 + row.ages[1] * PX + ((row.ages[0] - row.ages[1]) * PX) / 2}
                  y={row.y + 92}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: row.delay + 0.6 }}
                >
                  {row.ages[0] - row.ages[1]}
                </motion.text>
                <text x={W - 22} y={row.y + 44} textAnchor="end" fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                  {people.length} ages: {ri === 0 ? total : pastTotal}
                </text>
              </g>
            ))}
            <motion.text
              x={W / 2}
              y={252}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill={WARN}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              the total fell by {people.length} × {ago} = {people.length * ago}, but the gap did not move
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
          ? people
              .filter((p) => p !== unknown)
              .map((p) => `${p.name} is ${p.now}`)
              .join(", ")
          : phase === 1
          ? `${unknown.name} is ${unknown.now}`
          : phase === 2
          ? `${A.name} is ${gapNow} years older than ${B.name}`
          : `${gapPast} then, ${gapNow} now — the gap never changes`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed: gap {gapNow} now vs {gapPast} then
        </span>
      )}

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
