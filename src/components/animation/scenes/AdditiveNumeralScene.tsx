import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const GROUP_COLORS = ["#4338ca", "#0d9488", "#b45309", "#be123c", "#7c3aed", "#0369a1"];

/** Egyptian numeral glyphs, drawn in a 24×24 box centred on (0,0). */
function Glyph({ kind, color }: { kind: string; color: string }) {
  const stroke = { stroke: color, strokeWidth: 2.6, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "stroke": // 1 — a single tally stroke
      return <line x1={0} y1={-11} x2={0} y2={11} {...stroke} />;
    case "heel": // 10 — heel bone, an arch
      return <path d="M -9,10 L -9,-2 A 9,9 0 0 1 9,-2 L 9,10" {...stroke} />;
    case "coil": // 100 — coil of rope
      return <path d="M 3,11 C 3,4 3,-1 3,-4 C 3,-9 -6,-9 -6,-4 C -6,-0.5 -2,0.5 0.5,-1.5" {...stroke} />;
    case "lotus": // 1,000 — lotus flower on a stem
      return (
        <g {...stroke}>
          <line x1={0} y1={11} x2={0} y2={-3} />
          <path d="M -7,-8 C -5,-1 5,-1 7,-8" />
          <line x1={0} y1={-3} x2={0} y2={-10} />
        </g>
      );
    case "finger": // 10,000 — a bent finger
      return (
        <g {...stroke}>
          <path d="M -2.5,11 C -2.5,3 -3,-3 -1.5,-7 C 0,-10.5 4,-9 3.5,-5 C 3,-1 2,4 2,11" />
          <path d="M -0.5,-6.5 C 0.5,-7.5 2,-7.2 2.6,-6" />
        </g>
      );
    case "tadpole": // 100,000 — tadpole
      return (
        <g {...stroke}>
          <circle cx={-4} cy={-5} r={4} />
          <path d="M -0.5,-3 C 5,0 1,5 6,10" />
        </g>
      );
    default:
      return <circle cx={0} cy={0} r={7} {...stroke} />;
  }
}

interface Grp {
  kind: string;
  value: number;
  count: number;
  color: string;
}

function readGroups(value: unknown): Grp[] {
  if (!Array.isArray(value)) return [];
  return value.map((g, i) => {
    const o = (g ?? {}) as Record<string, unknown>;
    return {
      kind: o.kind != null ? String(o.kind) : "stroke",
      value: num(o.value, 1),
      count: Math.max(0, Math.round(num(o.count, 0))),
      color: GROUP_COLORS[i % GROUP_COLORS.length],
    };
  });
}

const fmt = (n: number) => n.toLocaleString("en-US");

/**
 * An additive numeral system (Egyptian hieroglyphs, tallies): a string of
 * repeated symbols whose values simply add. The glyphs first appear in the order
 * printed, then fly into one row per symbol, each row resolves to count × value,
 * and finally the counts drop into a place-value strip — which is where a place
 * with *no* glyphs shows a 0. Total and digits are computed from the groups.
 * Data: { groups:[{kind,value,count},...], ladder?:[100000,...,1] }.
 */
export function AdditiveNumeralScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const groups = readGroups(data.groups);
  const ladderRaw = Array.isArray(data.ladder)
    ? data.ladder.map((v) => num(v, 1))
    : [100000, 10000, 1000, 100, 10, 1];
  const ladder = [...ladderRaw].sort((a, b) => b - a);

  const total = groups.reduce((a, g) => a + g.value * g.count, 0);
  const countAt = (v: number) => groups.find((g) => g.value === v)?.count ?? 0;
  const top = ladder.find((v) => countAt(v) > 0);
  const places = top != null ? ladder.slice(ladder.indexOf(top)) : [];
  // The digit read-off only works while every place holds a single digit.
  const digitsOk = places.every((v) => countAt(v) <= 9);

  // flat list of glyphs in printed order
  const flat = groups.flatMap((g, gi) => Array.from({ length: g.count }, (_, k) => ({ g, gi, k })));
  const N = flat.length;

  const last = totalSteps - 1;
  const showGroups = step >= 1;
  const showMath = step >= 2;
  const showPlaces = step >= last && last >= 3;
  const final = step >= last;

  // ---- layout ----
  const W = 400;
  const GAP = 32;
  const rowY = 96;
  const rowStartX = (W - (N - 1) * GAP) / 2;
  const grpTop = 30;
  const grpH = 44;
  const grpStartX = 74;
  const H = Math.max(150, grpTop + groups.length * grpH + 10);

  // printed row while ungrouped; one row per symbol once grouped
  const posOf = (i: number) => {
    const f = flat[i];
    if (!showGroups) return { x: rowStartX + i * GAP, y: rowY };
    return { x: grpStartX + f.k * GAP, y: grpTop + f.gi * grpH };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 430 }}>
        {/* per-group value label, once grouped */}
        <AnimatePresence>
          {showGroups &&
            groups.map((g, gi) => (
              // Motion's x/y become a CSS transform, so they must live on a
              // wrapper <g> — putting them on the <text> would add to its x attr.
              <motion.g
                key={`lab${gi}`}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.25 + gi * 0.08 }}
              >
                <text
                  x={62}
                  y={grpTop + gi * grpH + 5}
                  textAnchor="end"
                  fontSize="13"
                  fontWeight="800"
                  fill={g.color}
                  fontFamily={numberFont}
                >
                  {fmt(g.value)}
                </text>
              </motion.g>
            ))}
        </AnimatePresence>

        {/* the glyphs — they travel from the printed row into per-symbol rows */}
        {flat.map((f, i) => {
          const p = posOf(i);
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: p.y - 22, x: p.x }}
              animate={{ opacity: 1, x: p.x, y: p.y }}
              transition={{
                opacity: { duration: 0.3, delay: i * 0.06 },
                default: { type: "spring", stiffness: 120, damping: 16, delay: showGroups ? i * 0.045 : i * 0.06 },
              }}
            >
              <Glyph kind={f.g.kind} color={f.g.color} />
            </motion.g>
          );
        })}

        {/* count × value = partial, per row */}
        <AnimatePresence>
          {showMath &&
            groups.map((g, gi) => (
              <motion.text
                key={`m${gi}`}
                x={W - 12}
                y={grpTop + gi * grpH + 5}
                textAnchor="end"
                fontSize="14"
                fontWeight="800"
                fill={g.color}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 240, damping: 15, delay: gi * 0.12 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {g.count} × {fmt(g.value)} = {fmt(g.value * g.count)}
              </motion.text>
            ))}
        </AnimatePresence>
      </svg>

      {/* place-value strip: the empty place is the whole point */}
      <AnimatePresence>
        {showPlaces && digitsOk && (
          <motion.div
            key="places"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", gap: 6, alignItems: "flex-end" }}
          >
            {places.map((v, i) => {
              const c = countAt(v);
              const col = groups.find((g) => g.value === v)?.color ?? "#94a3b8";
              const empty = c === 0;
              return (
                <motion.div
                  key={v}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.15 + i * 0.1 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}
                >
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: "#94a3b8", fontFamily: numberFont }}>{fmt(v)}</span>
                  <span
                    style={{
                      width: 32,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 8,
                      fontFamily: numberFont,
                      fontSize: 20,
                      fontWeight: 800,
                      color: empty ? "#dc2626" : col,
                      background: empty ? "#fef2f2" : "#f8fafc",
                      border: `2px solid ${empty ? "#fecaca" : col}`,
                    }}
                  >
                    {c}
                  </span>
                  {empty && <span style={{ fontSize: 9, color: "#dc2626", fontWeight: 700 }}>none!</span>}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {final && (
          <motion.div
            key="total"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontFamily: numberFont, fontSize: 16, fontWeight: 800, color: INK, textAlign: "center" }}
          >
            {groups.map((g, gi) => (
              <span key={gi} style={{ color: g.color }}>
                {gi > 0 && <span style={{ color: "#94a3b8" }}> + </span>}
                {fmt(g.value * g.count)}
              </span>
            ))}
            <span style={{ color: "#94a3b8" }}> = </span>
            <span style={{ color: "#16a34a" }}>{fmt(total)}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {final && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
