import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const TILE = "#0d9488";
const BORDER = "#d97706";
const GRAY = "#c3c8d0";
const GRAY_EDGE = "#1f2a44";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const reduce = (a: number, b: number): [number, number] => {
  const k = gcd(a, b) || 1;
  return [a / k, b / k];
};
const exactSqrt = (x: number) => {
  const r = Math.round(Math.sqrt(x));
  return r * r === x ? r : null;
};
/** Answer choices here are fractions, so parse them as such. */
const parseFrac = (text: string): [number, number] | null => {
  const t = String(text).replace(/[−–—]/g, "-").trim();
  const m = t.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (m) return [Number(m[1]), Number(m[2])];
  const v = Number(t.replace(/[^\d.-]/g, ""));
  return Number.isFinite(v) ? [v, 1] : null;
};
const sameFrac = (a: [number, number], b: [number, number]) => a[0] * b[1] === b[0] * a[1];

/**
 * A square paved with n x n tiles, every tile wrapped in a border of width d,
 * with the tiles' share of the *area* given and d/s wanted. Two things make it
 * hard and the scene spends a beat on each.
 *
 * First the off-by-one: along one edge n tiles need **n + 1** borders, not n,
 * because the run starts and ends with one — counted off the contest's own n = 3
 * figure rather than asserted. Using n borders instead lands exactly on an answer
 * choice, which the scene discovers rather than being told.
 *
 * Then the real unlock: the percentage is an *area* but the question is about
 * lengths, and since the gray region is n^2 tiles it is itself a perfect square —
 * so the tiles genuinely slide together into one block whose side is the square
 * root of the area share. 64% of the area becomes 80% of the side, and the whole
 * problem collapses onto a single edge where n tiles hold 80% and n + 1 borders
 * hold 20%.
 *
 * That last ratio is what the closing beat draws literally. The borders' 20% is a
 * quarter of the tiles' 80%, so gathered end to end the n + 1 borders are exactly
 * n/4 = 6 tiles long — and `25d = 6s` is `d/s = 6/25` read straight off two blocks
 * that visibly match. The figure is drawn in the answer's own geometry and the
 * scene then re-measures the gray fraction it drew against the given percent, so
 * the picture is checked rather than trusted.
 * Data: { n, percent, figureN? }.
 */
export function TileBorderRatioScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(2, Math.round(num(data.n, 24)));
  const percent = num(data.percent, 64);
  const figureN = Math.max(2, Math.round(num(data.figureN, 3)));

  // area share, then its square root as an exact fraction
  const [an, ad] = reduce(Math.round(percent * 100), 10000);
  const p = exactSqrt(an);
  const q = exactSqrt(ad);
  const ok = p != null && q != null && p < q;
  const sp = p ?? 4;
  const sq = q ?? 5;

  // n·s·q = p·(n·s + (n+1)·d)  →  d/s = n(q−p) / (p(n+1))
  const [dn, dd] = reduce(n * (sq - sp), sp * (n + 1));
  const ratio = dn / dd;
  // shares of one edge
  const [tileNum, tileDen] = reduce(sp, sq * n);
  const [bordNum, bordDen] = reduce(sq - sp, sq * (n + 1));
  // the borders gathered, measured in tiles: (n+1)d / s
  const [tbNum, tbDen] = reduce(n * (sq - sp), sp);
  const bordersInTiles = tbDen === 1 ? tbNum : null;

  // ---- self-checks ----
  const sharesTile = Math.abs(n * (tileNum / tileDen) + (n + 1) * (bordNum / bordDen) - 1) < 1e-9;
  const ratioAgrees = Math.abs(bordNum / bordDen / (tileNum / tileDen) - ratio) < 1e-9;

  // ---- price the wrong choices ----
  const answerFrac: [number, number] = [dn, dd];
  const slips: { why: string; frac: [number, number] }[] = [
    { why: `counted only ${n} borders, one per tile`, frac: reduce(n * (sq - sp), sp * n) },
    { why: `counted ${n - 1} borders`, frac: reduce(n * (sq - sp), sp * (n - 1)) },
    { why: `skipped the square root`, frac: reduce(n * (ad - an), an * (n + 1)) },
    { why: `the share that is not gray`, frac: reduce(10000 - Math.round(percent * 100), 10000) },
    { why: `the side ratio itself`, frac: [sp, sq] },
    { why: `the borders' share of the side`, frac: reduce(sq - sp, sq) },
  ];
  const choices = (problem.choices ?? [])
    .map((c) => ({ label: String(c.label), text: String(c.text), frac: parseFrac(String(c.text)) }))
    .filter((c) => c.frac);
  const wrong = choices.filter((c) => !sameFrac(c.frac!, answerFrac));
  const priced = wrong
    .map((c) => {
      const hit = slips.find((s) => sameFrac(s.frac, c.frac!));
      return hit ? { ...c, why: hit.why } : null;
    })
    .filter((c): c is { label: string; text: string; frac: [number, number]; why: string } => c !== null);

  // ---- beats ----
  const last = totalSteps - 1;
  const isFinal = step >= last;
  const beat = isFinal ? 3 : Math.min(Math.max(step, 0), 2);

  // ---- geometry ----
  const W = 340;
  const H = 290;

  // the big square, drawn in the answer's own geometry: L = n·s + (n+1)·d
  const L = 180;
  const s = L / (n + (n + 1) * ratio);
  const d = s * ratio;
  const X0 = (W - L) / 2;
  const Y0 = 26;
  const packed = n * s;
  // what the drawing actually came out as, checked against the given percent
  const drawnPercent = Math.pow(packed / L, 2) * 100;
  const figureOk = Math.abs(drawnPercent - percent) < 0.01;

  // the contest's own small figure, in its own proportions (border ≈ s/3)
  const FS = 150;
  const fs = FS / (figureN + (figureN + 1) / 3);
  const fd = fs / 3;
  const FX = (W - FS) / 2;
  const FY = 22;

  // the edge unrolled: n tiles and n+1 borders across the full width
  const stripX = 16;
  const stripW = W - 32;
  const us = (stripW * (tileNum / tileDen)) / 1;
  const ud = (stripW * (bordNum / bordDen)) / 1;
  const tilesW = n * us;

  const fracText = `${dn}/${dd}`;
  const caption =
    beat === 0
      ? `${figureN} tiles along an edge need ${figureN + 1} borders`
      : beat === 1
      ? `${percent}% of the area is ${sp}/${sq} of the side`
      : beat === 2
      ? `${n} tiles hold ${((sp / sq) * 100).toFixed(0)}%, ${n + 1} borders hold ${(((sq - sp) / sq) * 100).toFixed(0)}%`
      : bordersInTiles != null
      ? `${n + 1} borders = ${bordersInTiles} tiles, end to end`
      : `${n + 1}d = ${tbNum}/${tbDen} s`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* ---- beat 0: the contest figure, and the borders counted off it ---- */}
        {beat === 0 && (
          <g>
            <rect x={FX} y={FY} width={FS} height={FS} fill="#fff" stroke={GRAY_EDGE} strokeWidth={1.6} />
            {Array.from({ length: figureN }).map((_, i) =>
              Array.from({ length: figureN }).map((_, j) => (
                <motion.g
                  key={`f${i}-${j}`}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 17, delay: (i + j) * 0.06 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <rect
                    x={FX + fd + j * (fs + fd)}
                    y={FY + fd + i * (fs + fd)}
                    width={fs}
                    height={fs}
                    fill={GRAY}
                    stroke={GRAY_EDGE}
                    strokeWidth={1.4}
                  />
                </motion.g>
              ))
            )}

            {/* the top edge, pulled down and stretched out */}
            {[0, 1].map((k) => (
              <motion.path
                key={`ld${k}`}
                d={`M ${k ? FX + FS : FX},${FY} L ${k ? stripX + stripW : stripX},196`}
                stroke={DIM}
                strokeWidth={1}
                strokeDasharray="3 3"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              />
            ))}
            {Array.from({ length: 2 * figureN + 1 }).map((_, k) => {
              const isTile = k % 2 === 1;
              const before = Math.ceil(k / 2) * fd + Math.floor(k / 2) * fs;
              const scale = stripW / FS;
              const x = stripX + before * scale;
              const w = (isTile ? fs : fd) * scale;
              const idx = isTile ? (k - 1) / 2 + 1 : k / 2 + 1;
              return (
                <motion.g
                  key={`sg${k}`}
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.7 + k * 0.09 }}
                >
                  <rect x={x} y={196} width={w} height={22} rx={2} fill={isTile ? GRAY : "#fff"} stroke={isTile ? GRAY_EDGE : BORDER} strokeWidth={1.4} />
                  <text
                    x={x + w / 2}
                    y={isTile ? 211 : 232}
                    textAnchor="middle"
                    fontSize={isTile ? 11 : 9}
                    fontWeight="800"
                    fill={isTile ? INK : BORDER}
                    fontFamily={numberFont}
                  >
                    {idx}
                  </text>
                </motion.g>
              );
            })}
            <motion.text
              x={W / 2}
              y={254}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {`${figureN} tiles, but ${figureN + 1} borders — one at each end`}
            </motion.text>
            <motion.text
              x={W / 2}
              y={276}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 1.7 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {`so for n = ${n}:  side = ${n}s + ${n + 1}d`}
            </motion.text>
          </g>
        )}

        {/* ---- beat 1: the gray tiles pack into one square ---- */}
        {beat === 1 && (
          <g>
            <rect x={X0} y={Y0} width={L} height={L} fill="#fff" stroke={GRAY_EDGE} strokeWidth={1.6} />
            {Array.from({ length: n }).map((_, i) =>
              Array.from({ length: n }).map((_, j) => (
                <motion.g
                  key={`t${i}-${j}`}
                  initial={{ x: 0, y: 0 }}
                  animate={{ x: -d * (j + 1), y: -d * (i + 1) }}
                  transition={{ duration: 0.5, delay: 0.5 + (i + j) * 0.012 }}
                >
                  <rect x={X0 + d + j * (s + d)} y={Y0 + d + i * (s + d)} width={s} height={s} fill={GRAY} />
                </motion.g>
              ))
            )}
            {/* the packed block's side against the whole side */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              <path d={`M ${X0},${Y0 + packed + 6} L ${X0 + packed},${Y0 + packed + 6}`} stroke={TILE} strokeWidth={2.4} />
              <text x={X0 + packed / 2} y={Y0 + packed + 20} textAnchor="middle" fontSize="10" fontWeight="800" fill={TILE} fontFamily={numberFont}>
                {`${n}s = ${sp}/${sq} of the side`}
              </text>
            </motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
              <path d={`M ${X0},${Y0 + L + 8} L ${X0 + L},${Y0 + L + 8}`} stroke={INK} strokeWidth={2} />
              <text x={X0 + L / 2} y={Y0 + L + 22} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                the whole side
              </text>
            </motion.g>
            <motion.text
              x={W / 2}
              y={252}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={DIM}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.9 }}
            >
              {`${n * n} = ${n} × ${n}, so the gray packs into one square`}
            </motion.text>
            <motion.text
              x={W / 2}
              y={274}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 2.05 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {`area ${an}/${ad}  →  side ${sp}/${sq}`}
            </motion.text>
          </g>
        )}

        {/* ---- beat 2: gather the edge, tiles one end, borders the other ---- */}
        {beat === 2 && (
          <g>
            <text x={W / 2} y={30} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              one edge: {n} tiles and {n + 1} borders
            </text>
            {Array.from({ length: 2 * n + 1 }).map((_, k) => {
              const isTile = k % 2 === 1;
              const before = Math.ceil(k / 2) * ud + Math.floor(k / 2) * us;
              const idx = isTile ? (k - 1) / 2 : k / 2;
              const homeX = stripX + before;
              const sortedX = isTile ? stripX + idx * us : stripX + tilesW + idx * ud;
              return (
                <motion.g
                  key={`e${k}`}
                  initial={{ x: 0, y: 0 }}
                  animate={{ x: sortedX - homeX, y: 62 }}
                  transition={{ type: "spring", stiffness: 150, damping: 22, delay: 0.4 + k * 0.012 }}
                >
                  <rect
                    x={homeX}
                    y={44}
                    width={isTile ? us : ud}
                    height={20}
                    fill={isTile ? TILE : BORDER}
                    stroke="#fff"
                    strokeWidth={0.4}
                  />
                </motion.g>
              );
            })}
            {/* the same segments, before they move */}
            {Array.from({ length: 2 * n + 1 }).map((_, k) => {
              const isTile = k % 2 === 1;
              const before = Math.ceil(k / 2) * ud + Math.floor(k / 2) * us;
              return (
                <rect
                  key={`g${k}`}
                  x={stripX + before}
                  y={44}
                  width={isTile ? us : ud}
                  height={20}
                  fill={isTile ? TILE : BORDER}
                  opacity={0.16}
                />
              );
            })}

            {/* brackets on the gathered blocks */}
            {[
              { x: stripX, w: tilesW, color: TILE, top: `${n} tiles`, pct: `${((sp / sq) * 100).toFixed(0)}%` },
              { x: stripX + tilesW, w: (n + 1) * ud, color: BORDER, top: `${n + 1} borders`, pct: `${(((sq - sp) / sq) * 100).toFixed(0)}%` },
            ].map((b, i) => (
              <motion.g key={`bk${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 + i * 0.15 }}>
                <path d={`M ${b.x},${132} L ${b.x},${138} L ${b.x + b.w},${138} L ${b.x + b.w},${132}`} fill="none" stroke={b.color} strokeWidth={1.8} />
                <text x={b.x + b.w / 2} y={154} textAnchor="middle" fontSize="11" fontWeight="800" fill={b.color} fontFamily={numberFont}>
                  {b.pct}
                </text>
                <text x={b.x + b.w / 2} y={170} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={b.color} fontFamily={numberFont}>
                  {b.top}
                </text>
              </motion.g>
            ))}
            <motion.text
              x={W / 2}
              y={206}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={DIM}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
            >
              same edge, just gathered — nothing changed length
            </motion.text>
            <motion.text
              x={W / 2}
              y={236}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.85 }}
            >
              {`${n} tiles share ${sp}/${sq},  ${n + 1} borders share ${sq - sp}/${sq}`}
            </motion.text>
            <motion.text
              x={W / 2}
              y={264}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 2 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {`the borders' share is ${sp / (sq - sp)}× smaller`}
            </motion.text>
          </g>
        )}

        {/* ---- beat 3: the gathered borders are exactly a few tiles long ---- */}
        {beat === 3 && bordersInTiles != null && (
          <g>
            <text x={W / 2} y={26} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              {`a quarter of the tiles\u2019 share: ${n}/${sp / (sq - sp)} = ${bordersInTiles} tiles`}
            </text>

            {/* all n+1 borders, gathered */}
            {Array.from({ length: n + 1 }).map((_, i) => (
              <motion.g
                key={`bd${i}`}
                initial={{ opacity: 0, scaleY: 0.2 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.25 + i * 0.02 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <rect x={50 + (i * 240) / (n + 1)} y={54} width={240 / (n + 1)} height={30} fill={BORDER} stroke="#fff" strokeWidth={0.6} />
              </motion.g>
            ))}
            <text x={W / 2} y={100} textAnchor="middle" fontSize="10" fontWeight="800" fill={BORDER} fontFamily={numberFont}>
              {`${n + 1} borders, end to end`}
            </text>

            {/* the same length, made of whole tiles */}
            {Array.from({ length: bordersInTiles }).map((_, i) => (
              <motion.g
                key={`tl${i}`}
                initial={{ x: 120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.9 + i * 0.1 }}
              >
                <rect x={50 + (i * 240) / bordersInTiles} y={118} width={240 / bordersInTiles} height={30} fill={TILE} stroke="#fff" strokeWidth={0.8} />
              </motion.g>
            ))}
            <text x={W / 2} y={164} textAnchor="middle" fontSize="10" fontWeight="800" fill={TILE} fontFamily={numberFont}>
              {`${bordersInTiles} tiles, end to end`}
            </text>

            {/* they line up exactly */}
            {[50, 290].map((x, i) => (
              <motion.path
                key={`gd${i}`}
                d={`M ${x},46 L ${x},156`}
                stroke={INK}
                strokeWidth={1.2}
                strokeDasharray="4 3"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              />
            ))}

            <motion.text
              x={W / 2}
              y={196}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.75 }}
            >
              {`${n + 1}d = ${bordersInTiles}s`}
            </motion.text>
            <motion.g
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 14, delay: 1.95 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect x={W / 2 - 58} y={212} width={116} height={30} rx={15} fill={WIN} />
              <text x={W / 2} y={233} textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                d/s = {fracText}
              </text>
            </motion.g>
            <motion.text
              x={W / 2}
              y={264}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="700"
              fill={DIM}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.15 }}
            >
              {`drawn figure measures ${drawnPercent.toFixed(1)}% gray`}
            </motion.text>
          </g>
        )}

        {/* fallback when the borders are not a whole number of tiles */}
        {beat === 3 && bordersInTiles == null && (
          <g>
            <text x={W / 2} y={130} textAnchor="middle" fontSize="14" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {`${n + 1}d = ${tbNum}/${tbDen} s`}
            </text>
            <motion.g
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.4 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect x={W / 2 - 58} y={158} width={116} height={30} rx={15} fill={WIN} />
              <text x={W / 2} y={179} textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                d/s = {fracText}
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
            transition={{ delay: 2.3 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", lineHeight: 1.55 }}
          >
            {!ok ? (
              `check failed: ${an}/${ad} has no exact square root, so the side ratio is not a fraction`
            ) : !figureOk ? (
              `check failed: the drawn figure is ${drawnPercent.toFixed(2)}% gray, not ${percent}%`
            ) : !sharesTile ? (
              `check failed: the tile and border shares do not fill the edge`
            ) : !ratioAgrees ? (
              `check failed: the share route gives a different d/s`
            ) : (
              <>
                {priced.map((c) => (
                  <span key={c.label}>
                    {`${c.label} ${c.text}: ${c.why}`}
                    <br />
                  </span>
                ))}
                {priced.length === wrong.length
                  ? `every wrong choice priced`
                  : `${priced.length} of the ${wrong.length} wrong choices priced`}
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
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
