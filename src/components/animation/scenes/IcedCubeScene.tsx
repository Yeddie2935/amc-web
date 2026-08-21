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
const FROST = "#ec4899";
const SPONGE = "#f59e0b";

type P = [number, number];
const poly = (pts: P[]) => pts.map(([x, y]) => `${x},${y}`).join(" ");

const FACE_KEYS = ["left", "right", "front", "back", "bottom", "top"] as const;
type FaceKey = (typeof FACE_KEYS)[number];

/**
 * A cube cut into unit cubes with only *some* of its outer faces coated, asking
 * how many little cubes carry exactly k coated faces. Counting edges and corners
 * by hand is where these go wrong, because leaving one face bare quietly changes
 * which cubes are special.
 *
 * The scene **counts every unit cube itself** — one point per coated wall it
 * touches — and then discovers the structure rather than asserting it: it groups
 * the horizontal layers by their count pattern and finds that all the layers away
 * from the coated top share **one identical pattern**, while the top layer is
 * that same pattern **plus one**, since the top face adds a point to every cube up
 * there and nothing else changes. That subtraction is verified elementwise, so
 * the "+1" is a measured fact; if a future problem's layers do not line up that
 * way the narration falls back to describing them plainly.
 *
 * With that in hand "exactly 2" stops being casework: downstairs only the corners
 * touch two walls, and upstairs the whole pattern has shifted up so the *edges*
 * are the twos and the corners have spilled over to three. The closing beat
 * prices the three natural slips — dropping the top layer, dropping the bottom
 * layer (over-correcting for the bare base), and coating the bottom after all —
 * each recomputed from scratch and matched against `problem.choices`, which on
 * 2020-09 accounts for four of the five options.
 *
 * Beats: the cake with its coating and a cross-section showing the bare face; the
 * cube exploding into layers with the repeated pattern filled in; the top layer
 * taking its +1; then the target cubes lighting up and tallying. Data
 * `{ size, faces: ["top","left","right","front","back"], target, subject?, coating? }`.
 */
export function IcedCubeScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(2, Math.min(6, Math.round(num(data.size, 4))));
  const target = Math.max(0, Math.round(num(data.target, 2)));
  const coating = typeof data.coating === "string" ? data.coating : "icing";
  const iced = new Set<FaceKey>(
    (Array.isArray(data.faces) ? data.faces : []).map((f) => String(f) as FaceKey).filter((f) => FACE_KEYS.includes(f))
  );

  // ---- count the coated faces of every unit cube, from the wall list alone ----
  const countAt = (x: number, y: number, z: number, faces: Set<FaceKey>) =>
    (faces.has("left") && x === 1 ? 1 : 0) +
    (faces.has("right") && x === n ? 1 : 0) +
    (faces.has("front") && y === 1 ? 1 : 0) +
    (faces.has("back") && y === n ? 1 : 0) +
    (faces.has("bottom") && z === 1 ? 1 : 0) +
    (faces.has("top") && z === n ? 1 : 0);

  /** layer z as a row-major grid of coated-face counts */
  const layerGrid = (z: number, faces: Set<FaceKey> = iced) =>
    Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => countAt(c + 1, r + 1, z, faces)));
  const layers = Array.from({ length: n }, (_, i) => layerGrid(i + 1));
  const sig = (g: number[][]) => g.map((r) => r.join(",")).join("|");

  const total = layers.reduce((s, g) => s + g.flat().filter((v) => v === target).length, 0);
  const perLayer = layers.map((g) => g.flat().filter((v) => v === target).length);

  // layers that repeat the bottom one, and whichever layer breaks the pattern
  const baseSig = sig(layers[0]);
  const plain = layers.map((g, i) => (sig(g) === baseSig ? i + 1 : 0)).filter((z) => z > 0);
  const special = layers.map((g, i) => (sig(g) === baseSig ? 0 : i + 1)).filter((z) => z > 0);
  const oddLayer = special.length > 0 ? special[special.length - 1] : n;
  // is the odd layer just the plain one with a point added everywhere?
  const plusOne =
    special.length > 0 &&
    layers[oddLayer - 1].every((row, r) => row.every((v, c) => v - layers[0][r][c] === 1));

  // ---- the natural slips, each recomputed and matched against the real choices ----
  const choiceFor = (v: number) => {
    const t = String(Math.round(v));
    const hit = (problem.choices ?? []).find(
      (c) => String(c.text).replace(/[−–—]/g, "-").replace(/[^\d-]/g, "") === t
    );
    return hit ? hit.label : null;
  };
  const allFaces = new Set<FaceKey>(FACE_KEYS);
  const slips = [
    { label: `ignore the ${oddLayer === n ? "top" : `${oddLayer}th`} layer`, value: total - perLayer[oddLayer - 1] },
    { label: "ignore the bottom layer", value: total - perLayer[0] },
    {
      label: `coat all ${FACE_KEYS.length} faces`,
      value: Array.from({ length: n }, (_, i) => layerGrid(i + 1, allFaces))
        .reduce((s, g) => s + g.flat().filter((v) => v === target).length, 0),
    },
  ]
    .map((s) => ({ ...s, letter: choiceFor(s.value) }))
    .filter((s) => s.letter && s.value !== total);
  const accounted = new Set([...slips.map((s) => s.letter), problem.answer]).size;

  // ---- self-checks ----
  const facesOk = iced.size > 0 && iced.size < 6;
  const tallyOk = perLayer.reduce((a, b) => a + b, 0) === total;
  const answerOk = problem.shortAnswer == null || String(total) === String(problem.shortAnswer).replace(/[^\d]/g, "");
  const ok = facesOk && tallyOk && answerOk;
  const failure = !facesOk
    ? `${iced.size} coated faces — nothing is left bare`
    : !tallyOk
    ? "the per-layer tallies do not add to the total"
    : `counted ${total}, answer says ${problem.shortAnswer}`;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 262;

  // ---- isometric projection for the whole cake ----
  const CX = 150;
  const CY = 100;
  const AX = 66 / n;
  const AY = 38 / n;
  const AZ = 62 / n;
  const P3 = (x: number, y: number, z: number): P => [CX + (x - y) * AX, CY + (x + y) * AY - z * AZ];

  const countTone = (v: number) => (v === target ? WIN : v > target ? BAD : v === 0 ? DIM : INK);

  // ---- exploded layer grids ----
  const CELL = 21;
  const GW = CELL * n;
  const GX = (i: number) => 32 + i * (GW + 20);
  const GY = 78;

  const LayerGrid = ({
    z,
    i,
    show,
    lit,
    dim = false,
    delay = 0,
  }: {
    z: number;
    i: number;
    show: boolean;
    lit: boolean;
    dim?: boolean;
    delay?: number;
  }) => {
    const g = layers[z - 1];
    const x0 = GX(i);
    return (
      <g opacity={dim ? 0.35 : 1}>
        <text x={x0 + GW / 2} y={GY - 10} textAnchor="middle" fontSize="9" fontWeight="800" fill={z === oddLayer ? FROST : DIM}>
          layer {z}
          {z === n ? " (top)" : z === 1 ? " (bottom)" : ""}
        </text>
        {g.map((row, r) =>
          row.map((v, c) => {
            const on = lit && v === target;
            return (
              <g key={`${r}-${c}`}>
                <rect
                  x={x0 + c * CELL}
                  y={GY + r * CELL}
                  width={CELL}
                  height={CELL}
                  fill={on ? WIN : "#f8fafc"}
                  fillOpacity={on ? 0.22 : 1}
                  stroke={on ? WIN : "#cbd5e1"}
                  strokeWidth={on ? 1.8 : 1}
                />
                {show && (
                  <motion.text
                    x={x0 + c * CELL + CELL / 2}
                    y={GY + r * CELL + CELL / 2 + 4}
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="800"
                    fill={lit ? countTone(v) : v === 0 ? DIM : INK}
                    fontFamily={numberFont}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 17, delay: delay + (r * n + c) * 0.018 }}
                  >
                    {v}
                  </motion.text>
                )}
              </g>
            );
          })
        )}
      </g>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ============ phase 0: the cake, coated everywhere but one face ============ */}
        {phase === 0 && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              {coating} on {iced.size} of the 6 faces — the bottom stays bare
            </text>

            {/* the plate it sits on */}
            <ellipse cx={CX} cy={P3(n, n, 0)[1] + 4} rx={88} ry={9} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={1.4} />

            {/* three visible faces, frosted in sequence */}
            {[
              { key: "top" as FaceKey, pts: [P3(0, 0, n), P3(n, 0, n), P3(n, n, n), P3(0, n, n)], tint: 0.55, delay: 0.5 },
              { key: "back" as FaceKey, pts: [P3(0, n, n), P3(n, n, n), P3(n, n, 0), P3(0, n, 0)], tint: 0.4, delay: 0.75 },
              { key: "right" as FaceKey, pts: [P3(n, 0, n), P3(n, n, n), P3(n, n, 0), P3(n, 0, 0)], tint: 0.3, delay: 1.0 },
            ].map((f) => (
              <g key={f.key}>
                <polygon points={poly(f.pts)} fill={SPONGE} fillOpacity={0.35} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
                {iced.has(f.key) && (
                  <motion.polygon
                    points={poly(f.pts)}
                    fill={FROST}
                    fillOpacity={f.tint}
                    stroke={FROST}
                    strokeWidth={1.4}
                    initial={{ opacity: 0, scale: 0.82 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 150, damping: 16, delay: f.delay }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  />
                )}
              </g>
            ))}

            {/* the cuts into unit cubes */}
            {Array.from({ length: n - 1 }, (_, k) => k + 1).flatMap((k) => [
              { a: P3(k, 0, n), b: P3(k, n, n) },
              { a: P3(0, k, n), b: P3(n, k, n) },
              { a: P3(k, n, n), b: P3(k, n, 0) },
              { a: P3(0, n, k), b: P3(n, n, k) },
              { a: P3(n, k, n), b: P3(n, k, 0) },
              { a: P3(n, 0, k), b: P3(n, n, k) },
            ]).map((ln, i) => (
              <motion.line
                key={i}
                x1={ln.a[0]}
                y1={ln.a[1]}
                x2={ln.b[0]}
                y2={ln.b[1]}
                stroke="#fff"
                strokeWidth={0.9}
                opacity={0.75}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                transition={{ delay: 1.3 + i * 0.012 }}
              />
            ))}

            <text x={CX} y={202} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={INK}>
              {n}×{n}×{n}, cut into {n * n * n} pieces
            </text>

            {/* a cross-section makes the bare face visible */}
            <motion.g initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}>
              <text x={360} y={72} textAnchor="middle" fontSize="9" fontWeight="800" fill={DIM}>
                cut it open
              </text>
              <rect x={318} y={94} width={84} height={84} fill={SPONGE} fillOpacity={0.3} stroke={SPONGE} strokeWidth={1.2} />
              <rect x={310} y={86} width={100} height={8} fill={FROST} fillOpacity={0.6} stroke={FROST} strokeWidth={1} />
              <rect x={310} y={86} width={8} height={92} fill={FROST} fillOpacity={0.6} stroke={FROST} strokeWidth={1} />
              <rect x={402} y={86} width={8} height={92} fill={FROST} fillOpacity={0.6} stroke={FROST} strokeWidth={1} />
              <rect x={310} y={178} width={100} height={8} fill="none" stroke={BAD} strokeWidth={1.4} strokeDasharray="4 3" />
              <text x={360} y={136} textAnchor="middle" fontSize="9" fontWeight="700" fill={SPONGE}>
                cake
              </text>
              <text x={360} y={200} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={BAD}>
                bare underneath
              </text>
            </motion.g>

            <motion.text x={W / 2} y={238} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={IND} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>
              a piece scores one point per coated wall it touches
            </motion.text>
          </g>
        )}

        {/* ============ phases 1-3: the cake in exploded layers ============ */}
        {phase > 0 &&
          (() => {
            const showTop = phase >= 2;
            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  {phase === 1
                    ? `slice it into ${n} layers — the lower ${plain.length} are identical`
                    : phase === 2
                    ? `the top ${coating} adds a point to every piece up there`
                    : `now collect every piece scoring exactly ${target}`}
                </text>
                <text x={W / 2} y={34} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM}>
                  {phase === 1
                    ? "away from the top, a piece only scores on the side walls it touches"
                    : phase === 2 && plusOne
                    ? `corners ${layers[0][0][0]} → ${layers[oddLayer - 1][0][0]}, edges ${layers[0][0][1]} → ${layers[oddLayer - 1][0][1]}, middle ${layers[0][1][1]} → ${layers[oddLayer - 1][1][1]}`
                    : phase === 3
                    ? `corners downstairs, edges upstairs`
                    : ""}
                </text>

                {layers.map((_, i) => {
                  const z = i + 1;
                  const isOdd = z === oddLayer;
                  // the layers fly apart from a stacked pile on the first beat
                  const fromX = GX(1) + 8 - GX(i);
                  const fromY = (n - z) * 5;
                  return (
                    <motion.g
                      key={z}
                      initial={phase === 1 ? { x: fromX, y: fromY, opacity: 0 } : { opacity: 0 }}
                      animate={{ x: 0, y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 70, damping: 16, delay: phase === 1 ? 0.15 + i * 0.14 : 0.1 }}
                    >
                      <LayerGrid
                        z={z}
                        i={i}
                        show={!isOdd || showTop}
                        lit={phase === 3}
                        dim={phase === 2 && !isOdd}
                        delay={phase === 1 ? 0.9 + i * 0.14 : phase === 2 && isOdd ? 0.6 : 0.2}
                      />
                      {isOdd && !showTop && (
                        <text x={GX(i) + GW / 2} y={GY + GW / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={FROST}>
                          ?
                        </text>
                      )}
                      {/* the top coating landing on the odd layer */}
                      {isOdd && phase === 2 && (
                        <motion.g initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.25 }}>
                          <rect x={GX(i) - 3} y={GY - 7} width={GW + 6} height={6} rx={3} fill={FROST} fillOpacity={0.75} />
                        </motion.g>
                      )}
                      {phase === 3 && (
                        <motion.text
                          x={GX(i) + GW / 2}
                          y={GY + GW + 18}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="800"
                          fill={WIN}
                          fontFamily={numberFont}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.9 + i * 0.15 }}
                        >
                          {perLayer[z - 1]}
                        </motion.text>
                      )}
                    </motion.g>
                  );
                })}

                {phase === 1 && (
                  <motion.text x={W / 2} y={GY + GW + 34} textAnchor="middle" fontSize="10" fontWeight="700" fill={IND} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                    corners touch 2 walls, edges 1, the middle none — the same in every lower layer
                  </motion.text>
                )}

                {phase === 2 && plusOne && (
                  <motion.text x={W / 2} y={GY + GW + 34} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={FROST} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                    layer {oddLayer} is layer 1 with +1 in every square — nothing else moved
                  </motion.text>
                )}

                {phase === 3 && (
                  <>
                    <motion.text
                      x={W / 2}
                      y={GY + GW + 44}
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="800"
                      fill={WIN}
                      fontFamily={numberFont}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6 }}
                    >
                      {perLayer.join(" + ")} = {total}
                    </motion.text>
                    {slips.length > 0 && (
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
                        <text x={W / 2} y={GY + GW + 64} textAnchor="middle" fontSize="9" fontWeight="700" fill={BAD}>
                          {slips.map((s) => `${s.letter} ${s.value}: ${s.label}`).join("   ·   ")}
                        </text>
                        <text x={W / 2} y={GY + GW + 78} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM}>
                          {accounted} of the {(problem.choices ?? []).length} choices are exactly these slips
                        </text>
                      </motion.g>
                    )}
                  </>
                )}
              </g>
            );
          })()}
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
          ? `${iced.size} faces coated, 1 bare`
          : phase === 1
          ? `layers ${plain.join(", ")} share one pattern`
          : phase === 2
          ? `layer ${oddLayer} = layer 1 + 1`
          : `${perLayer[0]} × ${plain.length} + ${perLayer[oddLayer - 1]} = ${total}`}
      </motion.span>

      {!ok && <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>}

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
