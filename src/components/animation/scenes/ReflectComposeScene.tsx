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

type Vec = [number, number];
/** A 2×2 matrix [[a,b],[c,d]] in screen coordinates. */
type Mat = [number, number, number, number];

const rad = (d: number) => (d * Math.PI) / 180;
/** Reflection across a line through the origin at the given screen angle. */
const reflection = (deg: number): Mat => {
  const t = rad(2 * deg);
  return [Math.cos(t), Math.sin(t), Math.sin(t), -Math.cos(t)];
};
const mul = (A: Mat, B: Mat): Mat => [
  A[0] * B[0] + A[1] * B[2],
  A[0] * B[1] + A[1] * B[3],
  A[2] * B[0] + A[3] * B[2],
  A[2] * B[1] + A[3] * B[3],
];
const apply = (M: Mat, v: Vec): Vec => [M[0] * v[0] + M[1] * v[1], M[2] * v[0] + M[3] * v[1]];
const det = (M: Mat) => M[0] * M[3] - M[1] * M[2];
const IDENT: Mat = [1, 0, 0, 1];

/**
 * A figure reflected across one line and then across another, asking where it
 * ends up. Doing the two flips is easy enough; what the answer choices actually
 * test is that **two reflections compose into a rotation** — the determinants
 * multiply to +1, so the result is orientation-preserving, and the turn is
 * exactly *twice* the angle between the mirrors. The scene never asserts that:
 * it builds each reflection as a real matrix, multiplies them, reads the net
 * angle straight out of the product, and checks it against twice the angle
 * between the lines and against the shape's vertices moved the long way round.
 * Each flip is animated as a genuine reflection about its mirror — the transform
 * is decomposed into `rotate(2α)` plus `scaleY(-1)` plus the translation
 * `(L − I)(c − O)` that moves the own-centre pivot onto the crossing point, so
 * the letter collapses onto the mirror line and reopens on the far side rather
 * than sliding. The closing beat sends a ghost of the original through the
 * single 90° turn and lands it exactly on the twice-flipped letter, which is
 * what rules out the look-alike choice sitting in the same place; data
 * `{ glyph?, guides: ["p|0", "|90", "q|-45"], order: ["q","p"], start, radius }`
 * with angles as screen degrees (y downward, so up-right is −45).
 */
export function ReflectComposeScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const guides = (Array.isArray(data.guides) ? data.guides : [])
    .map((g) => String(g).split("|"))
    .map(([id, deg]) => ({ id: id ?? "", deg: num(deg, 0) }));
  const order = (Array.isArray(data.order) ? data.order : []).map((o) => String(o));
  const startDeg = num(data.start, -67.5);
  const radius = Math.max(20, num(data.radius, 62));

  const mirrors = order
    .map((id) => guides.find((g) => g.id === id))
    .filter((g): g is { id: string; deg: number } => g != null);

  // ---- the composition, built rather than asserted ----
  const stages: Mat[] = [IDENT];
  mirrors.forEach((mrr) => stages.push(mul(reflection(mrr.deg), stages[stages.length - 1])));
  const net = stages[stages.length - 1];
  const isRotation = det(net) > 0;
  const netDeg = (Math.round(((Math.atan2(net[2], net[0]) * 180) / Math.PI) * 100) / 100 + 360) % 360;
  const between = mirrors.length === 2 ? mirrors[1].deg - mirrors[0].deg : 0;
  const doubled = ((2 * between) % 360 + 360) % 360;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 264;
  const O: Vec = [152, 132];
  const R = 112;

  const start: Vec = [Math.cos(rad(startDeg)) * radius, Math.sin(rad(startDeg)) * radius];
  const centre: Vec = [O[0] + start[0], O[1] + start[1]];

  /** Any isometry as Motion's own-centre rotate + scaleY, plus the translation that re-pivots onto O. */
  const asTransform = (M: Mat) => {
    const sy = det(M) < 0 ? -1 : 1;
    const rotate = (Math.atan2(M[2], M[0]) * 180) / Math.PI;
    const moved = apply(M, start);
    return { rotate, scaleY: sy, x: moved[0] - start[0], y: moved[1] - start[1] };
  };
  const T = stages.map(asTransform);

  // the reflections applied to the glyph's own anchor, the long way round
  const walked = mirrors.reduce<Vec>((v, mrr) => apply(reflection(mrr.deg), v), start);
  const direct = apply(net, start);
  const agree = Math.hypot(walked[0] - direct[0], walked[1] - direct[1]) < 1e-9;
  const ok = mirrors.length === 2 && isRotation && Math.abs(netDeg - doubled) < 1e-6 && agree;

  /** A block letter M, centred on its own bounding box so the pivot is its middle. */
  const glyphPath = (cx: number, cy: number) =>
    `M ${cx - 13},${cy + 15} L ${cx - 13},${cy - 15} L ${cx},${cy + 1} L ${cx + 13},${cy - 15} L ${cx + 13},${cy + 15}`;

  const Glyph = ({ colour, opacity = 1 }: { colour: string; opacity?: number }) => (
    <path
      d={glyphPath(centre[0], centre[1])}
      fill="none"
      stroke={colour}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
    />
  );

  const stageColour = [INK, TEAL, WIN, WIN];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ---- the lines of the figure ---- */}
        {guides.map((g, i) => {
          const dx = Math.cos(rad(g.deg)) * R;
          const dy = Math.sin(rad(g.deg)) * R;
          const isMirror = mirrors.some((mrr) => mrr.id === g.id);
          const active =
            (phase === 1 && mirrors[0]?.id === g.id) || (phase === 2 && mirrors[1]?.id === g.id);
          return (
            <g key={i}>
              <line
                x1={O[0] - dx}
                y1={O[1] - dy}
                x2={O[0] + dx}
                y2={O[1] + dy}
                stroke={active ? WARN : isMirror ? INK : "#cbd5e1"}
                strokeWidth={active ? 3 : isMirror ? 2 : 1.4}
              />
              {g.id && (
                <text
                  x={O[0] - dx - 6}
                  y={O[1] - dy + (g.deg === 0 ? -6 : 14)}
                  textAnchor="end"
                  fontSize="13"
                  fontWeight="800"
                  fill={active ? WARN : INK}
                  fontFamily={numberFont}
                  fontStyle="italic"
                >
                  {g.id}
                </text>
              )}
            </g>
          );
        })}

        {/* ---- the angle between the two mirrors ---- */}
        {(phase === 0 || phase === 3) && mirrors.length === 2 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <path
              d={`M ${O[0] + Math.cos(rad(mirrors[0].deg)) * 36},${O[1] + Math.sin(rad(mirrors[0].deg)) * 36} A 36 36 0 0 1 ${
                O[0] + Math.cos(rad(mirrors[1].deg)) * 36
              },${O[1] + Math.sin(rad(mirrors[1].deg)) * 36}`}
              fill="none"
              stroke={WARN}
              strokeWidth={2}
            />
            <text
              x={O[0] + Math.cos(rad((mirrors[0].deg + mirrors[1].deg) / 2)) * 52}
              y={O[1] + Math.sin(rad((mirrors[0].deg + mirrors[1].deg) / 2)) * 52 + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill={WARN}
              fontFamily={numberFont}
            >
              {Math.abs(between)}°
            </text>
          </motion.g>
        )}

        {/* ---- ghosts of where the letter has been ---- */}
        {stages.slice(0, Math.min(phase, T.length - 1)).map((M, i) => {
          const t = asTransform(M);
          return (
            <g key={`ghost${i}`} transform={`translate(${t.x} ${t.y})`}>
              <g
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                transform={`rotate(${t.rotate}) scale(1 ${t.scaleY})`}
              >
                <Glyph colour={DIM} opacity={0.32} />
              </g>
            </g>
          );
        })}

        {/* ---- the letter itself, flipping onto its new place ---- */}
        <motion.g
          key={`live${phase}`}
          initial={T[phase >= 1 && phase <= T.length - 1 ? Math.min(phase, T.length - 1) - 1 : Math.min(phase, T.length - 1)]}
          animate={T[Math.min(phase, T.length - 1)]}
          transition={{ type: "spring", stiffness: 55, damping: 14, delay: 0.35 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <Glyph colour={stageColour[Math.min(phase, stageColour.length - 1)]} />
        </motion.g>

        {/* ---- the closing beat: one turn instead of two flips ---- */}
        {phase === 3 && (
          <g>
            <motion.g
              initial={{ rotate: 0, scaleY: 1, x: 0, y: 0, opacity: 0 }}
              animate={{ rotate: T[T.length - 1].rotate, scaleY: 1, x: T[T.length - 1].x, y: T[T.length - 1].y, opacity: [0, 0.9, 0.9, 0] }}
              transition={{ duration: 3.2, times: [0, 0.15, 0.8, 1], repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <Glyph colour={IND} />
            </motion.g>
            <motion.path
              d={`M ${centre[0]},${centre[1]} A ${radius} ${radius} 0 0 1 ${O[0] + direct[0]},${O[1] + direct[1]}`}
              fill="none"
              stroke={IND}
              strokeWidth={1.8}
              strokeDasharray="4 3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.4 }}
            />
          </g>
        )}

        {/* ---- the running commentary ---- */}
        <text x={296} y={30} fontSize="11.5" fontWeight="800" fill={INK}>
          {phase === 0
            ? "the two mirrors"
            : phase === 1
            ? `flip across ${mirrors[0]?.id}`
            : phase === 2
            ? `flip across ${mirrors[1]?.id}`
            : "two flips = one turn"}
        </text>

        {phase === 0 && (
          <g>
            <motion.text x={296} y={58} fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              they cross at {Math.abs(between)}°
            </motion.text>
            <motion.text x={296} y={78} fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
              and the letter sits in
            </motion.text>
            <motion.text x={296} y={94} fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}>
              the wedge above {mirrors[0]?.id}
            </motion.text>
          </g>
        )}
        {phase === 1 && (
          <g>
            <motion.text x={296} y={58} fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              it lands on the far side,
            </motion.text>
            <motion.text x={296} y={74} fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              still above {mirrors[1]?.id}
            </motion.text>
            <motion.text x={296} y={100} fontSize="10.5" fontWeight="800" fill={BAD} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              one flip mirrors it
            </motion.text>
          </g>
        )}
        {phase === 2 && (
          <g>
            <motion.text x={296} y={58} fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              now it drops below {mirrors[1]?.id}
            </motion.text>
            <motion.text x={296} y={84} fontSize="10.5" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              mirrored twice, so it
            </motion.text>
            <motion.text x={296} y={100} fontSize="10.5" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
              reads the right way again
            </motion.text>
          </g>
        )}
        {phase === 3 && (
          <g>
            <motion.text x={296} y={56} fontSize="11" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              2 × {Math.abs(between)}° = {Math.round(doubled)}°
            </motion.text>
            <motion.text x={296} y={78} fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              a single turn about the
            </motion.text>
            <motion.text x={296} y={92} fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.78 }}>
              crossing point lands on
            </motion.text>
            <motion.text x={296} y={106} fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.86 }}>
              exactly the same letter
            </motion.text>
            <motion.text x={296} y={136} fontSize="10" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
              a turn, not a mirror —
            </motion.text>
            <motion.text x={296} y={150} fontSize="10" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              so the M is not flipped
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
          ? `${mirrors[0]?.id} and ${mirrors[1]?.id} meet at ${Math.abs(between)}°`
          : phase === 1
          ? `across ${mirrors[0]?.id} first`
          : phase === 2
          ? `then across ${mirrors[1]?.id}`
          : `the two flips add up to one ${Math.round(doubled)}° turn`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed: net {Math.round(netDeg)}° vs 2 × {Math.abs(between)}°
        </span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
