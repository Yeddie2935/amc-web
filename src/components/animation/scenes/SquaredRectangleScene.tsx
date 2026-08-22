import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const C1 = "#0d9488";
const C2 = "#d97706";
const C3 = "#7c3aed";
const FILLER = "#e8ecf3";

type Box = { x: number; y: number; w: number; h: number };
const boxPath = (b: Box) => `M ${b.x},${b.y} L ${b.x + b.w},${b.y} L ${b.x + b.w},${b.y + b.h} L ${b.x},${b.y + b.h} Z`;

/**
 * Three squares and two rectangles tiling one big rectangle of known width and
 * height, asking for the side of the middle square. Setting up two equations and
 * subtracting works, but it hides why the question is answerable at all — the
 * outer squares are *not* determined, only their sum, so S2 is the one length the
 * two given dimensions actually pin down. The opening beat says so by sliding the
 * internal walls to a genuinely different valid split (every piece resizes, the
 * paths interpolated as `d` strings so nothing is faked) while S2 keeps its exact
 * size.
 *
 * The two equations are then read off the picture as **shadows** rather than
 * written down. Cast the three squares down onto the bottom edge and they tile it
 * with no gap and no overlap, so s1 + s2 + s3 = width. Cast S1 and S3 across onto
 * the left edge and they cover the height but **overlap** — and the overlap band
 * lines up exactly with the rows S2 occupies, so s1 + s3 = height + s2. The width
 * counts s2 once and the height misses it once, which is the whole problem.
 *
 * Substituting one into the other collapses the width bar into height + s2 + s2,
 * animated as the two outer blocks gathering and then splitting, so `2·s2 =
 * width − height` is a length you watch appear rather than an algebraic step.
 * Every seam of the drawn figure is re-checked against the others, both equations
 * are verified, the overlap is measured off the drawing, and the closing note
 * counts how many integer splits of the outer pair are legal — all of which give
 * the same s2; data { width, height, split? }.
 */
export function SquaredRectangleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const W = Math.max(1, Math.round(num(data.width, 3322)));
  const Hh = Math.max(1, Math.round(num(data.height, 2020)));

  const s2 = (W - Hh) / 2;
  const sumS = W - s2; // s1 + s3
  // s1 must leave both outer squares shorter than the height and bigger than s2
  const lo = s2 + 1;
  const hi = Hh - 1;
  const splits = Math.max(0, hi - lo + 1);
  const pick = (t: number) => Math.round(lo + t * (hi - lo));
  const s1Main = Number.isFinite(num(data.split, NaN)) ? Math.round(num(data.split, 0)) : pick(0.5);
  const s1Alt = pick(0.25);

  const layout = (s1: number) => {
    const s3 = sumS - s1;
    return {
      s1,
      s3,
      S1: { x: 0, y: 0, w: s1, h: s1 },
      R2: { x: s1, y: 0, w: W - s1, h: Hh - s3 },
      S2: { x: s1, y: Hh - s3, w: s2, h: s2 },
      S3: { x: s1 + s2, y: Hh - s3, w: s3, h: s3 },
      R1: { x: 0, y: s1, w: s1 + s2, h: Hh - s1 },
    };
  };
  const A = layout(s1Main);
  const B = layout(s1Alt);

  // ---- self-checks, measured off the layout rather than assumed ----
  const seams = (L: ReturnType<typeof layout>) =>
    L.S3.x + L.S3.w === W &&
    L.S3.y + L.S3.h === Hh &&
    L.R1.y + L.R1.h === Hh &&
    L.R2.x + L.R2.w === W &&
    L.S2.y + L.S2.h === L.S1.h &&
    L.R2.y + L.R2.h === L.S2.y &&
    L.R1.w === L.S2.x + L.S2.w;
  const seamsOk = seams(A) && seams(B);
  const eqOk = A.s1 + s2 + A.s3 === W && A.s1 - s2 + A.s3 === Hh;
  // the vertical shadows of S1 and S3 must overlap by exactly s2
  const overlap = Math.min(A.S1.y + A.S1.h, A.S3.y + A.S3.h) - Math.max(A.S1.y, A.S3.y);
  const overlapOk = overlap === s2;
  const wholeOk = Number.isInteger(s2) && s2 > 0 && splits > 0;

  // ---- beats ----
  const last = totalSteps - 1;
  const isFinal = step >= last;
  const beat = isFinal ? 3 : Math.min(Math.max(step, 0), 2);

  // ---- geometry ----
  const CW = 340;
  const CH = 290;
  const FX = 76;
  const FY = 32;
  const FW = 248;
  const FH = (FW * Hh) / W;
  const k = FW / W;
  const px = (v: number) => FX + v * k;
  const py = (v: number) => FY + v * k;
  const sc = (b: Box): Box => ({ x: px(b.x), y: py(b.y), w: b.w * k, h: b.h * k });

  const pieces: { key: keyof ReturnType<typeof layout>; label: string; fill: string; ink: string }[] = [
    { key: "S1", label: "S₁", fill: C1, ink: "#fff" },
    { key: "R2", label: "R₂", fill: FILLER, ink: DIM },
    { key: "S2", label: "S₂", fill: C2, ink: "#fff" },
    { key: "S3", label: "S₃", fill: C3, ink: "#fff" },
    { key: "R1", label: "R₁", fill: FILLER, ink: DIM },
  ];

  // the bottom shadow bar (beat 1) and the left shadow bar (beat 2)
  const shadowY = 206;
  const shadowH = 22;
  const railX = 34;
  const colW = 14;
  const railW = colW * 2 + 4;

  // the three bar rows of the closing beat
  const barX = 18;
  const barW = CW - 36;
  const bs = barW / W;

  const caption =
    beat === 0
      ? `only S₂ is pinned down — the rest can slide`
      : beat === 1
      ? `side by side, the three squares fill the width`
      : beat === 2
      ? `stacked, S₁ and S₃ overlap by exactly S₂`
      : `2 × S₂ = ${W} − ${Hh} = ${W - Hh}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${CW} ${CH}`} width="100%" style={{ maxWidth: 360 }}>
        {/* ---- the figure itself (beats 0–2) ---- */}
        {beat <= 2 && (
          <g>
            {pieces.map((p, i) => {
              const a = sc(A[p.key] as Box);
              const b = sc(B[p.key] as Box);
              // beat 0 slides the walls to another legal split; later beats sit still
              const slide = beat === 0;
              return (
                <motion.path
                  key={p.key}
                  d={boxPath(a)}
                  fill={p.fill}
                  stroke={INK}
                  strokeWidth={1.2}
                  initial={{ opacity: 0 }}
                  animate={
                    slide
                      ? { opacity: 1, d: [boxPath(a), boxPath(a), boxPath(b), boxPath(b), boxPath(a)] }
                      : { opacity: 1, d: boxPath(a) }
                  }
                  transition={
                    slide
                      ? { opacity: { delay: 0.1 + i * 0.1 }, d: { duration: 4.4, times: [0, 0.22, 0.5, 0.72, 1], delay: 0.8 } }
                      : { opacity: { delay: 0.1 + i * 0.1 } }
                  }
                />
              );
            })}
          </g>
        )}
        {/* pieces drawn again for entry + labels, so the fade is independent of the slide */}
        {beat <= 2 && (
          <g>
            {pieces.map((p, i) => {
              const a = sc(A[p.key] as Box);
              // beat 2 draws guide lines along S₂'s rows; a label sitting on one
              // gets struck through, so move it clear of the band
              const guides = beat === 2 ? [py(A.S2.y), py(A.S2.y + A.S2.h)] : [];
              const mid = a.y + a.h / 2 + 4;
              const clash = guides.some((g) => Math.abs(g - mid) < 9) && p.key !== "S2";
              return (
                <motion.text
                  key={`lb${p.key}`}
                  x={a.x + a.w / 2}
                  y={clash ? a.y + 16 : mid}
                  textAnchor="middle"
                  fontSize={p.key === "S2" ? 10 : 12}
                  fontWeight="800"
                  fill={p.ink}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: beat === 0 ? 0.9 : 1 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                >
                  {p.label}
                </motion.text>
              );
            })}
            {/* the outer dimensions */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              {beat !== 1 && (
                <>
                  <path d={`M ${FX},${FY + FH + 8} L ${FX + FW},${FY + FH + 8}`} stroke={INK} strokeWidth={1.4} />
                  <text x={FX + FW / 2} y={FY + FH + 21} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    {W}
                  </text>
                </>
              )}
              {beat !== 2 && (
                <>
                  <path d={`M ${FX - 8},${FY} L ${FX - 8},${FY + FH}`} stroke={INK} strokeWidth={1.4} />
                  <text x={FX - 12} y={FY + FH / 2 + 4} textAnchor="end" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    {Hh}
                  </text>
                </>
              )}
            </motion.g>
          </g>
        )}

        {/* ---- beat 0: S₂ stays put while everything else moves ---- */}
        {beat === 0 && (
          <>
            <motion.rect
              x={sc(A.S2).x - 3}
              y={sc(A.S2).y - 3}
              width={sc(A.S2).w + 6}
              height={sc(A.S2).h + 6}
              rx={3}
              fill="none"
              stroke={C2}
              strokeWidth={2}
              strokeDasharray="4 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            />
            <motion.text
              x={CW / 2}
              y={248}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              the walls can shift and it still fits
            </motion.text>
            <motion.text
              x={CW / 2}
              y={270}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill={C2}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              but S₂ never changes size
            </motion.text>
          </>
        )}

        {/* ---- beat 1: the three squares cast shadows that tile the width ---- */}
        {beat === 1 && (
          <g>
            {([
              { b: A.S1, c: C1, t: "s₁" },
              { b: A.S2, c: C2, t: "s₂" },
              { b: A.S3, c: C3, t: "s₃" },
            ] as const).map((it, i) => {
              const box = sc(it.b as Box);
              return (
                <g key={`sh${i}`}>
                  <motion.path
                    d={`M ${box.x},${box.y + box.h} L ${box.x},${shadowY}`}
                    stroke={it.c}
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    fill="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 0.4 + i * 0.25 }}
                  />
                  <motion.path
                    d={`M ${box.x + box.w},${box.y + box.h} L ${box.x + box.w},${shadowY}`}
                    stroke={it.c}
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    fill="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 0.4 + i * 0.25 }}
                  />
                  <motion.g
                    initial={{ y: box.y + box.h - shadowY, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 170, damping: 20, delay: 0.5 + i * 0.25 }}
                  >
                    <rect x={box.x} y={shadowY} width={box.w} height={shadowH} fill={it.c} stroke="#fff" strokeWidth={1} />
                    <text x={box.x + box.w / 2} y={shadowY + 15} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                      {it.t}
                    </text>
                  </motion.g>
                </g>
              );
            })}
            <motion.text
              x={CW / 2}
              y={252}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={DIM}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              no gaps, no overlap — they fill the bottom edge
            </motion.text>
            <motion.text
              x={CW / 2}
              y={276}
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
              s₁ + s₂ + s₃ = {W}
            </motion.text>
          </g>
        )}

        {/* ---- beat 2: stacked, S₁ and S₃ overlap by exactly S₂ ---- */}
        {beat === 2 && (
          <g>
            {/* two side-by-side columns, so the shared rows are visibly doubled */}
            {([
              { b: A.S1, c: C1, t: "s₁" },
              { b: A.S3, c: C3, t: "s₃" },
            ] as const).map((it, i) => {
              const box = sc(it.b as Box);
              const colX = railX + i * (colW + 4);
              return (
                <motion.g
                  key={`vs${i}`}
                  initial={{ x: box.x - colX, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 170, damping: 20, delay: 0.4 + i * 0.3 }}
                >
                  <rect x={colX} y={box.y} width={colW} height={box.h} fill={it.c} />
                  <text
                    x={colX + colW / 2}
                    y={box.y + (i === 0 ? 11 : box.h - 4)}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="800"
                    fill="#fff"
                    fontFamily={numberFont}
                  >
                    {it.t}
                  </text>
                </motion.g>
              );
            })}
            {/* the band they share, and the rows S₂ actually occupies */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
              <rect x={railX - 4} y={py(A.S2.y)} width={railW + 8} height={A.S2.h * k} fill="none" stroke={C2} strokeWidth={2.2} />
              {[A.S2.y, A.S2.y + A.S2.h].map((v, i) => (
                <path key={`gl${i}`} d={`M ${railX - 4},${py(v)} L ${px(A.S2.x + A.S2.w)},${py(v)}`} stroke={C2} strokeWidth={1} strokeDasharray="4 3" fill="none" />
              ))}
            </motion.g>
            <motion.text
              x={railX + railW / 2}
              y={py(Hh) + 16}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {Hh}
            </motion.text>
            <motion.text
              x={CW / 2}
              y={230}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={DIM}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              together they cover the height, but they double up
            </motion.text>
            <motion.text
              x={CW / 2}
              y={252}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill={C2}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.55 }}
            >
              and the shared band is exactly S₂
            </motion.text>
            <motion.text
              x={CW / 2}
              y={278}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 1.7 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              s₁ + s₃ = {Hh} + s₂
            </motion.text>
          </g>
        )}

        {/* ---- beat 3: the width bar collapses to height + s₂ + s₂ ---- */}
        {beat === 3 && (
          <g>
            {/* row 1: the width, cut into the three squares */}
            <text x={barX} y={38} fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              the width, cut into the three squares
            </text>
            {([
              { w: A.s1, c: C1, t: "s₁" },
              { w: s2, c: C2, t: "s₂" },
              { w: A.s3, c: C3, t: "s₃" },
            ] as const).map((seg, i, arr) => {
              const before = arr.slice(0, i).reduce((a, v) => a + v.w, 0);
              return (
                <motion.g
                  key={`r1${i}`}
                  initial={{ opacity: 0, scaleX: 0.3 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 20, delay: i * 0.12 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <rect x={barX + before * bs} y={44} width={seg.w * bs} height={24} fill={seg.c} stroke="#fff" strokeWidth={1} />
                  <text x={barX + (before + seg.w / 2) * bs} y={60} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                    {seg.t}
                  </text>
                </motion.g>
              );
            })}

            {/* row 2: the two outer squares gathered, since only their sum matters */}
            <text x={barX} y={98} fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              gather the outer two
            </text>
            <motion.g initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}>
              <rect x={barX} y={104} width={sumS * bs} height={24} fill={C1} stroke="#fff" strokeWidth={1} />
              <text x={barX + (sumS * bs) / 2} y={120} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                s₁ + s₃
              </text>
              <rect x={barX + sumS * bs} y={104} width={s2 * bs} height={24} fill={C2} stroke="#fff" strokeWidth={1} />
              <text x={barX + (sumS + s2 / 2) * bs} y={120} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                s₂
              </text>
            </motion.g>

            {/* row 3: and s₁ + s₃ is the height plus one more s₂ */}
            <text x={barX} y={158} fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              but s₁ + s₃ is the height plus another s₂
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <rect x={barX} y={164} width={Hh * bs} height={24} fill={INK} />
              <text x={barX + (Hh * bs) / 2} y={180} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                {Hh}
              </text>
            </motion.g>
            {[0, 1].map((i) => (
              <motion.g
                key={`e${i}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 240, damping: 17, delay: 1.2 + i * 0.18 }}
              >
                <rect x={barX + (Hh + i * s2) * bs} y={164} width={s2 * bs} height={24} fill={C2} stroke="#fff" strokeWidth={1} />
                <text x={barX + (Hh + i * s2 + s2 / 2) * bs} y={180} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                  s₂
                </text>
              </motion.g>
            ))}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
              <path
                d={`M ${barX + Hh * bs},196 L ${barX + Hh * bs},202 L ${barX + W * bs},202 L ${barX + W * bs},196`}
                fill="none"
                stroke={C2}
                strokeWidth={1.8}
              />
              <text x={barX + ((Hh + W) / 2) * bs} y={216} textAnchor="middle" fontSize="11" fontWeight="800" fill={C2} fontFamily={numberFont}>
                {`${W} − ${Hh} = ${W - Hh}`}
              </text>
            </motion.g>
            <motion.g
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 14, delay: 1.9 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect x={CW / 2 - 92} y={234} width={184} height={30} rx={15} fill={WIN} />
              <text x={CW / 2} y={255} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                s₂ = {W - Hh} ÷ 2 = {s2}
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
            transition={{ delay: 2.1 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", lineHeight: 1.55 }}
          >
            {!wholeOk ? (
              `check failed: ${W} − ${Hh} is not a positive even number, so s₂ is not a whole side`
            ) : !seamsOk ? (
              `check failed: the drawn pieces do not meet at every seam`
            ) : !eqOk ? (
              `check failed: the two dimension equations do not hold`
            ) : !overlapOk ? (
              `check failed: S₁ and S₃ overlap by ${overlap}, not ${s2}`
            ) : (
              <>
                {`s₁ + s₃ = ${sumS} is fixed, but the split is not:`}
                <br />
                {`all ${splits} splits from ${lo} to ${hi} tile the rectangle`}
                <br />
                {`every one of them has s₂ = ${s2}`}
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
