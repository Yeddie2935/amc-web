import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const STACK = "#0d9488";
const TALL = "#7c3aed";
const TILE = "#eef2ff";
const EDGE = "#c7d2fe";

type Tile = { x: number; y: number; w: number; h: number };

const parseChoice = (text: string) =>
  Number(String(text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));

/**
 * Identical rectangles fitted together into one big rectangle, with only the
 * short side given. The tiles are supplied in units of that **short side**, so
 * their long side is however many of those units they span — which means the
 * whole shape of the answer is already in the layout and nothing has to be
 * asserted about the aspect ratio.
 *
 * The reasoning beat is the one the picture makes free: a tile standing on its
 * long side is flanked by a column of tiles lying on their short sides, and since
 * both reach exactly the same height, that long side **is** those short sides
 * stacked. The scene finds that column itself — the tall tile, the tiles beside
 * it, and the check that their spans partition the same interval — so "long = 2 ×
 * short" is counted off the figure rather than quoted.
 *
 * From there the outer rectangle is measured along its own edges (the bottom is
 * read off whichever tiles actually touch it, so the width is a sum of real tile
 * sides, not a formula), and the closing beat computes the area **twice**: outer
 * width × height, and the tile area times the number of tiles. Those two agree
 * only because the tiling is exact, which the scene has already verified by area
 * and by overlap, so the agreement is a genuine check rather than a restatement.
 * Data: { short, tiles: ["x,y,w,h", ...] in short-side units, unit?, corners? }.
 */
export function IdenticalTilesScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const short = Math.max(1, num(data.short, 5));
  const unitName = data.unit != null ? String(data.unit) : "";
  const corners = String(data.corners ?? "A,B,C,D").split(",");
  const tiles: Tile[] = (Array.isArray(data.tiles) ? data.tiles : []).map((t) => {
    const [x, y, w, h] = String(t).split(",").map((v) => num(v, 0));
    return { x, y, w, h };
  });

  // the bounding rectangle, in short-side units
  const bw = tiles.length ? Math.max(...tiles.map((t) => t.x + t.w)) : 0;
  const bh = tiles.length ? Math.max(...tiles.map((t) => t.y + t.h)) : 0;

  // ---- self-checks on the tiling ----
  const shapes = tiles.map((t) => [t.w, t.h].sort((a, b) => a - b).join("x"));
  const congruent = shapes.length > 0 && new Set(shapes).size === 1;
  const tileArea = tiles.length ? tiles[0].w * tiles[0].h : 0;
  const exact = tiles.reduce((a, t) => a + t.w * t.h, 0) === bw * bh;
  const overlaps = tiles.some((a, i) =>
    tiles.some((b, j) => j > i && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h)
  );

  // long / short, read straight off a tile's own dimensions
  const k = tiles.length ? Math.max(tiles[0].w, tiles[0].h) / Math.min(tiles[0].w, tiles[0].h) : 1;
  const longSide = k * short;
  const outerW = bw * short;
  const outerH = bh * short;
  const areaOuter = outerW * outerH;
  const areaTiles = tiles.length * tileArea * short * short;

  // the column of tiles whose short sides stack up to one tile's long side
  const tall = tiles.find((t) => t.h > t.w);
  const stack = (() => {
    if (!tall) return [];
    for (const side of [tall.x, tall.x + tall.w]) {
      const col = tiles
        .filter((o) => o !== tall && (o.x + o.w === side || o.x === side))
        .sort((a, b) => a.y - b.y);
      if (!col.length) continue;
      const covers =
        col[0].y === tall.y &&
        col[col.length - 1].y + col[col.length - 1].h === tall.y + tall.h &&
        col.every((o, i) => i === 0 || o.y === col[i - 1].y + col[i - 1].h);
      if (covers) return col;
    }
    return [];
  })();
  const stackOk = stack.length === k;

  // the tiles that actually sit on the bottom edge give the width as real sides
  const bottom = tiles.filter((t) => t.y + t.h === bh).sort((a, b) => a.x - b.x);

  // ---- price the wrong choices ----
  const slips = [
    { why: `used the short side as the height`, value: outerW * short },
    { why: `left the extra short side out of the width`, value: longSide * longSide },
    { why: `only one rectangle`, value: tileArea * short * short },
  ];
  const wrong = (problem.choices ?? [])
    .map((c) => ({ label: String(c.label), value: parseChoice(String(c.text)) }))
    .filter((c) => Number.isFinite(c.value) && c.value !== areaOuter);
  const priced = wrong
    .map((c) => {
      const hit = slips.find((s) => s.value === c.value);
      return hit ? { ...c, why: hit.why } : null;
    })
    .filter((c): c is { label: string; value: number; why: string } => c !== null);

  // ---- beats ----
  const last = totalSteps - 1;
  const isFinal = step >= last;
  const plan = totalSteps >= 4 ? [0, 1, 2] : totalSteps === 3 ? [0, 1] : [0];
  const beat = isFinal ? 3 : plan[Math.min(Math.max(step, 0), plan.length - 1)];

  // ---- geometry ----
  const CW = 340;
  const CH = 300;
  const u = Math.min(240 / (bw || 1), 140 / (bh || 1));
  const FW = bw * u;
  const FH = bh * u;
  const FX = (CW - FW) / 2;
  const FY = 46;
  const sx = (v: number) => FX + v * u;
  const sy = (v: number) => FY + v * u;
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2));

  const inStack = (t: Tile) => stack.includes(t);
  const fillOf = (t: Tile) => {
    if (beat !== 1) return TILE;
    if (t === tall) return "#ede9fe";
    return inStack(t) ? "#ccfbf1" : TILE;
  };
  const strokeOf = (t: Tile) => {
    if (beat !== 1) return EDGE;
    if (t === tall) return TALL;
    return inStack(t) ? STACK : EDGE;
  };

  const caption =
    beat === 0
      ? `${tiles.length} identical rectangles, short side ${fmt(short)}`
      : beat === 1
      ? `${k} short sides stack to one long side: ${fmt(longSide)}`
      : beat === 2
      ? `${corners.join("")} is ${fmt(outerW)} by ${fmt(outerH)}`
      : `${fmt(outerW)} × ${fmt(outerH)} = ${fmt(areaOuter)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${CW} ${CH}`} width="100%" style={{ maxWidth: 360 }}>
        {/* the three rectangles, flying into place */}
        {tiles.map((t, i) => (
          <motion.g
            key={`t${i}`}
            initial={{ opacity: 0, scale: 0.55 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.16 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <rect x={sx(t.x)} y={sy(t.y)} width={t.w * u} height={t.h * u} fill={fillOf(t)} stroke={strokeOf(t)} strokeWidth={beat === 1 ? 2.4 : 1.6} />
          </motion.g>
        ))}
        {/* the outer rectangle, drawn over the seams */}
        <rect x={FX} y={FY} width={FW} height={FH} fill="none" stroke={INK} strokeWidth={2.4} />

        {/* vertex labels: bottom-left, bottom-right, top-right, top-left */}
        {[
          { t: corners[0], x: FX - 12, y: FY + FH + 16 },
          { t: corners[1], x: FX + FW + 12, y: FY + FH + 16 },
          { t: corners[2], x: FX + FW + 12, y: FY - 8 },
          { t: corners[3], x: FX - 12, y: FY - 8 },
        ].map((c, i) => (
          <text key={`c${i}`} x={c.x} y={c.y} textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily="Georgia, serif">
            {c.t}
          </text>
        ))}

        {/* ---- beat 0: the short side marked on every rectangle ---- */}
        {beat === 0 &&
          tiles.map((t, i) => {
            const vertical = t.w > t.h; // a wide tile lies on its long side, so the short side is its height
            const x0 = sx(t.x);
            const y0 = sy(t.y);
            return (
              <motion.g key={`s${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.16 }}>
                {vertical ? (
                  <>
                    <path d={`M ${x0 + 16},${y0 + 8} L ${x0 + 16},${y0 + t.h * u - 8}`} stroke={IND} strokeWidth={1.6} />
                    <path d={`M ${x0 + 12},${y0 + 12} L ${x0 + 16},${y0 + 8} L ${x0 + 20},${y0 + 12}`} fill="none" stroke={IND} strokeWidth={1.4} />
                    <path d={`M ${x0 + 12},${y0 + t.h * u - 12} L ${x0 + 16},${y0 + t.h * u - 8} L ${x0 + 20},${y0 + t.h * u - 12}`} fill="none" stroke={IND} strokeWidth={1.4} />
                    <text x={x0 + 26} y={y0 + (t.h * u) / 2 + 4} fontSize="12" fontWeight="800" fill={IND} fontFamily={numberFont}>
                      {fmt(short)}
                    </text>
                  </>
                ) : (
                  <>
                    <path d={`M ${x0 + 8},${y0 + 16} L ${x0 + t.w * u - 8},${y0 + 16}`} stroke={IND} strokeWidth={1.6} />
                    <path d={`M ${x0 + 12},${y0 + 12} L ${x0 + 8},${y0 + 16} L ${x0 + 12},${y0 + 20}`} fill="none" stroke={IND} strokeWidth={1.4} />
                    <path d={`M ${x0 + t.w * u - 12},${y0 + 12} L ${x0 + t.w * u - 8},${y0 + 16} L ${x0 + t.w * u - 12},${y0 + 20}`} fill="none" stroke={IND} strokeWidth={1.4} />
                    <text x={x0 + (t.w * u) / 2} y={y0 + 32} textAnchor="middle" fontSize="12" fontWeight="800" fill={IND} fontFamily={numberFont}>
                      {fmt(short)}
                    </text>
                  </>
                )}
              </motion.g>
            );
          })}

        {/* ---- beat 1: the stack's short sides equal the tall one's long side ---- */}
        {beat === 1 && tall && stack.length > 0 && (
          <g>
            {stack.map((t, i) => (
              <motion.g key={`sb${i}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.3 + i * 0.15 }}>
                <path d={`M ${FX - 10},${sy(t.y) + 3} L ${FX - 10},${sy(t.y + t.h) - 3}`} stroke={STACK} strokeWidth={2.2} />
                <text x={FX - 16} y={sy(t.y + t.h / 2) + 4} textAnchor="end" fontSize="11" fontWeight="800" fill={STACK} fontFamily={numberFont}>
                  {fmt(short)}
                </text>
              </motion.g>
            ))}
            {/* the same span, read as the tall rectangle's long side */}
            <motion.g initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.8 }}>
              <path d={`M ${FX + FW + 10},${sy(tall.y) + 2} L ${FX + FW + 10},${sy(tall.y + tall.h) - 2}`} stroke={TALL} strokeWidth={2.2} />
              <text x={FX + FW + 16} y={sy(tall.y + tall.h / 2) + 4} fontSize="11" fontWeight="800" fill={TALL} fontFamily={numberFont}>
                long
              </text>
            </motion.g>
            {[tall.y, tall.y + tall.h].map((v, i) => (
              <motion.path
                key={`gl${i}`}
                d={`M ${FX - 10},${sy(v)} L ${FX + FW + 10},${sy(v)}`}
                stroke={DIM}
                strokeWidth={1}
                strokeDasharray="4 3"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              />
            ))}
            <motion.text x={CW / 2} y={FY + FH + 40} textAnchor="middle" fontSize="11" fontWeight="700" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
              both reach exactly the same height
            </motion.text>
            <motion.text
              x={CW / 2}
              y={FY + FH + 66}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 1.5 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {`long = ${stack.map(() => fmt(short)).join(" + ")} = ${fmt(longSide)}`}
            </motion.text>
          </g>
        )}

        {/* ---- beat 2: measure the outer rectangle along its own edges ---- */}
        {beat === 2 && (
          <g>
            {bottom.map((t, i) => (
              <motion.g key={`bw${i}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.3 + i * 0.18 }}>
                <path d={`M ${sx(t.x) + 3},${FY + FH + 12} L ${sx(t.x + t.w) - 3},${FY + FH + 12}`} stroke={STACK} strokeWidth={2.2} />
                <text x={sx(t.x + t.w / 2)} y={FY + FH + 26} textAnchor="middle" fontSize="11" fontWeight="800" fill={STACK} fontFamily={numberFont}>
                  {fmt(t.w * short)}
                </text>
              </motion.g>
            ))}
            <motion.g initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.8 }}>
              <path d={`M ${FX - 12},${FY + 2} L ${FX - 12},${FY + FH - 2}`} stroke={TALL} strokeWidth={2.2} />
              <text x={FX - 18} y={FY + FH / 2 + 4} textAnchor="end" fontSize="11" fontWeight="800" fill={TALL} fontFamily={numberFont}>
                {fmt(outerH)}
              </text>
            </motion.g>
            <motion.text
              x={CW / 2}
              y={FY + FH + 52}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={DIM}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {`width = ${bottom.map((t) => fmt(t.w * short)).join(" + ")} = ${fmt(outerW)}`}
            </motion.text>
            <motion.text
              x={CW / 2}
              y={FY + FH + 78}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 1.3 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {`${fmt(outerW)} wide, ${fmt(outerH)} tall`}
            </motion.text>
          </g>
        )}

        {/* ---- beat 3: the area, counted two independent ways ---- */}
        {beat === 3 && (
          <g>
            {tiles.map((t, i) => (
              <motion.text
                key={`ar${i}`}
                x={sx(t.x + t.w / 2)}
                y={sy(t.y + t.h / 2) + 5}
                textAnchor="middle"
                fontSize="14"
                fontWeight="800"
                fill={IND}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.3 + i * 0.15 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {fmt(tileArea * short * short)}
              </motion.text>
            ))}
            <motion.text x={CW / 2} y={FY + FH + 26} textAnchor="middle" fontSize="11" fontWeight="700" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              {`each is ${fmt(longSide)} × ${fmt(short)} = ${fmt(tileArea * short * short)}`}
            </motion.text>
            <motion.text x={CW / 2} y={FY + FH + 48} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}>
              {`${tiles.length} × ${fmt(tileArea * short * short)} = ${fmt(areaTiles)}`}
            </motion.text>
            <motion.g
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 14, delay: 1.45 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect x={CW / 2 - 78} y={FY + FH + 62} width={156} height={30} rx={15} fill={WIN} />
              <text x={CW / 2} y={FY + FH + 83} textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                {fmt(areaOuter)} {unitName ? `sq ${unitName}` : ""}
              </text>
            </motion.g>
          </g>
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : IND,
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
            key="notes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", lineHeight: 1.55 }}
          >
            {!congruent ? (
              `check failed: the rectangles are not all the same shape`
            ) : overlaps ? (
              `check failed: two of the rectangles overlap`
            ) : !exact ? (
              `check failed: the rectangles do not fill ${corners.join("")} exactly`
            ) : !stackOk ? (
              `check failed: no column of ${k} short sides matches a long side`
            ) : areaTiles !== areaOuter ? (
              `check failed: ${fmt(areaTiles)} of rectangle against ${fmt(areaOuter)} of ${corners.join("")}`
            ) : (
              <>
                {`both routes give ${fmt(areaOuter)}, so the tiling is exact`}
                {priced.map((c) => (
                  <span key={c.label}>
                    <br />
                    {`${c.label} ${c.value}: ${c.why}`}
                  </span>
                ))}
              </>
            )}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.7 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
