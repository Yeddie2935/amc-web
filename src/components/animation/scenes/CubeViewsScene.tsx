import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const EDGE = "#334155";

type Face = { key: string; name: string; fill: string };
type Shift = { dx: number; dy: number; delay?: number };

/** Slots are the six axis directions: 0:+x 1:−x 2:+y 3:−y 4:+z 5:−z. */
const OPP = [1, 0, 3, 2, 5, 4];
const ROT_Z = [2, 3, 1, 0, 4, 5];
const ROT_X = [0, 1, 4, 5, 3, 2];

/** The 24 rotations of a cube, as permutations of the six slots. */
function rotationGroup(): number[][] {
  const key = (p: number[]) => p.join(",");
  const seen = new Map<string, number[]>();
  const id = [0, 1, 2, 3, 4, 5];
  const queue = [id];
  seen.set(key(id), id);
  while (queue.length) {
    const p = queue.shift() as number[];
    for (const g of [ROT_Z, ROT_X]) {
      const next = p.map((s) => g[s]);
      if (!seen.has(key(next))) {
        seen.set(key(next), next);
        queue.push(next);
      }
    }
  }
  return [...seen.values()];
}

/** Every permutation of 0..n−1. */
function permutations(n: number): number[][] {
  if (n === 0) return [[]];
  const out: number[][] = [];
  for (const rest of permutations(n - 1)) {
    for (let i = 0; i <= rest.length; i += 1) {
      out.push([...rest.slice(0, i), n - 1, ...rest.slice(i)]);
    }
  }
  return out;
}

/** Text that stays readable on a given fill. */
function inkOn(hex: string): string {
  const h = hex.replace("#", "");
  const v = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lum = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  return lum > 0.6 ? "#0f172a" : "#ffffff";
}

/**
 * Several views of one cube whose faces all differ, asking which face is
 * opposite a named one. Each view shows three faces meeting at a **single
 * corner**, so those three are mutually adjacent — and that is the only fact
 * the views carry. The unlock is a counting one: a cube face touches **exactly
 * four** others, so as soon as one colour has been seen beside four different
 * colours its ring is full, and whatever is left over has nowhere to be but the
 * hidden face behind it. On 2019-12 the payoff is that the answer colour
 * (aqua) **never appears in any view at all** — it is found purely by
 * elimination, which is why the scene spends a whole beat on the roster of six
 * with five struck off.
 *
 * The beats: the three views painted face by face with the shared corner
 * popping; red lit in every view while its neighbours **fly out as chips into
 * a tray**, where repeat sightings land on a chip already there and bounce off
 * (6 sightings, 4 colours); the ring drawn as a plus with red at the centre and
 * the leftover colour ringed on a roster; then the cube **pulled apart along
 * the red–aqua axis**, the front face sliding out one way and the hidden back
 * face the other, with the remaining colours shown pairing off so all three
 * opposite pairs are accounted for.
 *
 * Nothing is asserted: the scene enumerates all 720 colour-to-slot assignments
 * and keeps those where every view's (top, front, right) triple is one of the
 * 24 real corner readings of a cube — so handedness is used, not just
 * adjacency — then reads the opposite pairing off the survivors and checks
 * they all agree. Adjacency, the neighbour ring, the unseen colours and the
 * pairing are all discovered; data
 * `{ faces: ["R|red|#dc2626", ...], views: ["B|R|G", ...], ask }` with each
 * view written `top|front|right`.
 */
export function CubeViewsScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const faces: Face[] = (Array.isArray(data.faces) ? data.faces : []).map((f) => {
    const [key, name, fill] = String(f).split("|");
    return { key: key ?? "?", name: name ?? key ?? "?", fill: fill ?? "#cbd5e1" };
  });
  const views = (Array.isArray(data.views) ? data.views : []).map((v) => String(v).split("|"));
  const ask = String(data.ask ?? faces[0]?.key ?? "");
  const face = (k: string) => faces.find((f) => f.key === k);
  const idx = (k: string) => faces.findIndex((f) => f.key === k);

  // ---- solve the cube: keep every assignment all the views can really show ----
  const group = rotationGroup();
  const corners = new Set(group.map((h) => `${h[4]},${h[3]},${h[0]}`));
  const paintings = permutations(faces.length);
  const solutions = paintings.filter((asg) =>
    views.every((v) => {
      const [t, f, r] = v.map(idx);
      return t >= 0 && f >= 0 && r >= 0 && corners.has(`${asg[t]},${asg[f]},${asg[r]}`);
    })
  );
  const pairingOf = (asg: number[]) =>
    faces
      .map((f, i) => [f.key, faces[asg.findIndex((s) => s === OPP[asg[i]])]?.key ?? "?"].sort().join("-"))
      .filter((s, i, all) => all.indexOf(s) === i)
      .sort()
      .join(" ");
  const pairing = solutions.length ? pairingOf(solutions[0]) : "";
  const agree = solutions.every((s) => pairingOf(s) === pairing);
  const pairs = pairing ? pairing.split(" ").map((p) => p.split("-")) : [];
  const oppositeOf = (k: string) => pairs.find((p) => p.includes(k))?.find((q) => q !== k) ?? "";
  const answerKey = oppositeOf(ask);
  const answerFace = face(answerKey);

  // ---- what the views themselves say, for the argument on screen ----
  const seen = faces.filter((f) => views.some((v) => v.includes(f.key)));
  const unseen = faces.filter((f) => !views.some((v) => v.includes(f.key)));
  const hub = answerKey; // the colour whose ring the views fill in
  const sightings = views.flatMap((v, vi) =>
    v.includes(hub) ? v.filter((k) => k !== hub).map((k) => ({ key: k, view: vi })) : []
  );
  const ring: string[] = [];
  sightings.forEach((s) => {
    if (!ring.includes(s.key)) ring.push(s.key);
  });

  const stated = problem.shortAnswer == null ? null : String(problem.shortAnswer).trim().toLowerCase();
  const failure = !solutions.length
    ? "no cube can show all these views"
    : !agree
    ? `views leave the pairing ambiguous (${solutions.length} assignments disagree)`
    : ring.length !== 4
    ? `${hub} was seen beside ${ring.length} colours, not 4`
    : stated != null && answerFace != null && answerFace.name.toLowerCase() !== stated
    ? `scene gets ${answerFace.name}, problem says ${stated}`
    : null;

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const drop = Math.max(0, 4 - totalSteps);
  const phase = isFinal ? 3 : Math.min(beat + drop, 2);

  const W = 470;
  const H = 312;

  // ---- one oblique cube: square front, top and right sheared up-right ----
  const Cube = ({
    x,
    y,
    s,
    view,
    lit,
    dimOthers = true,
    shifts = {},
    delay = 0,
  }: {
    x: number;
    y: number;
    s: number;
    view: string[];
    lit?: string;
    dimOthers?: boolean;
    shifts?: Record<string, Shift>;
    delay?: number;
  }) => {
    const o = s * 0.44;
    const [t, f, r] = view;
    const quad = {
      top: `${x},${y + o} ${x + s},${y + o} ${x + s + o},${y} ${x + o},${y}`,
      front: `${x},${y + o} ${x + s},${y + o} ${x + s},${y + o + s} ${x},${y + o + s}`,
      right: `${x + s},${y + o} ${x + s + o},${y} ${x + s + o},${y + s} ${x + s},${y + o + s}`,
    };
    const mid = {
      top: [x + s / 2 + o / 2, y + o / 2 + 4],
      front: [x + s / 2, y + o + s / 2 + 5],
      right: [x + s + o / 2, y + o / 2 + s / 2 + 5],
    };
    const veil = { top: ["#ffffff", 0.22], front: ["#ffffff", 0], right: ["#000000", 0.17] } as const;
    return (
      <g>
        {(["top", "front", "right"] as const).map((slot, i) => {
          const fc = face([t, f, r][i]);
          if (!fc) return null;
          const sh = shifts[slot];
          const dim = dimOthers && lit != null && fc.key !== lit;
          return (
            <motion.g
              key={slot}
              initial={{ opacity: 0, ...(sh ? { x: 0, y: 0 } : {}) }}
              animate={{ opacity: dim ? 0.35 : 1, ...(sh ? { x: sh.dx, y: sh.dy } : {}) }}
              transition={{ type: "spring", stiffness: 90, damping: 16, delay: sh?.delay ?? delay + i * 0.16 }}
            >
              <polygon points={quad[slot]} fill={fc.fill} stroke={EDGE} strokeWidth={1.6} strokeLinejoin="round" />
              <polygon points={quad[slot]} fill={veil[slot][0]} fillOpacity={veil[slot][1]} stroke="none" />
              <text
                x={mid[slot][0]}
                y={mid[slot][1]}
                textAnchor="middle"
                fontSize={s * 0.3}
                fontWeight="800"
                fill={inkOn(fc.fill)}
                fontFamily={numberFont}
              >
                {fc.key}
              </text>
              {lit === fc.key && (
                <motion.polygon
                  points={quad[slot]}
                  fill="none"
                  stroke={INK}
                  strokeWidth={3}
                  strokeLinejoin="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.55, 1] }}
                  transition={{ duration: 1.4, delay: 0.2 }}
                />
              )}
            </motion.g>
          );
        })}
      </g>
    );
  };

  /** A face's centre in the same oblique projection, for chips flying out. */
  const faceMid = (x: number, y: number, s: number, slot: "top" | "front" | "right") => {
    const o = s * 0.44;
    if (slot === "top") return [x + s / 2 + o / 2, y + o / 2];
    if (slot === "front") return [x + s / 2, y + o + s / 2];
    return [x + s + o / 2, y + o / 2 + s / 2];
  };

  const Chip = ({ k, cx, cy, size = 30, muted }: { k: string; cx: number; cy: number; size?: number; muted?: boolean }) => {
    const fc = face(k);
    if (!fc) return null;
    return (
      <g opacity={muted ? 0.35 : 1}>
        <rect x={cx - size / 2} y={cy - size / 2} width={size} height={size} rx={6} fill={fc.fill} stroke={EDGE} strokeWidth={1.4} />
        <text x={cx} y={cy + size * 0.17} textAnchor="middle" fontSize={size * 0.5} fontWeight="800" fill={inkOn(fc.fill)} fontFamily={numberFont}>
          {fc.key}
        </text>
      </g>
    );
  };

  // geometry shared by the first two beats
  const S0 = 78;
  const VX = [32, 179, 326];
  const S1 = 64;
  const VX1 = [38, 190, 342];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ============ phase 0: three views, each a corner of the same cube ============ */}
        {phase === 0 && (
          <g>
            <text x={W / 2} y={26} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              three views of one cube — {faces.length} faces, {faces.length} different colours
            </text>
            {views.map((v, i) => {
              const o = S0 * 0.44;
              return (
                <g key={i}>
                  <Cube x={VX[i]} y={64} s={S0} view={v} delay={0.2 + i * 0.55} />
                  {/* the single vertex where all three visible faces meet */}
                  <motion.circle
                    cx={VX[i] + S0}
                    cy={64 + o}
                    r={4.5}
                    fill={INK}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.85 + i * 0.55 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  />
                  <text x={VX[i] + (S0 + o) / 2} y={64 + S0 + o + 24} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM}>
                    view {i + 1}
                  </text>
                </g>
              );
            })}
            <motion.text x={W / 2} y={252} textAnchor="middle" fontSize="12" fontWeight="800" fill={IND} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
              the three faces in a view meet at one corner
            </motion.text>
            <motion.text x={W / 2} y={276} textAnchor="middle" fontSize="11" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}>
              so within a view, every pair of colours touches
            </motion.text>
            <motion.text x={W / 2} y={299} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={BAD} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.7 }}>
              {unseen.length > 0 && `${unseen.map((f) => f.name).join(", ")} never appears in any view`}
            </motion.text>
          </g>
        )}

        {/* ============ phase 1: collect everything seen beside the hub colour ============ */}
        {phase === 1 && (
          <g>
            <text x={W / 2} y={24} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              {face(hub)?.name} shows up in every view — collect what it touches
            </text>
            {views.map((v, i) => (
              <Cube key={i} x={VX1[i]} y={44} s={S1} view={v} lit={hub} delay={0} />
            ))}
            {/* the tray the neighbours land in */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <rect x={62} y={196} width={346} height={54} rx={12} fill="#f1f5f9" stroke={DIM} strokeWidth={1.4} strokeDasharray="5 4" />
              <text x={235} y={190} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM}>
                colours touching {face(hub)?.name}
              </text>
            </motion.g>
            {(() => {
              const slotX = (n: number) => 235 + (n - (ring.length - 1) / 2) * 70;
              let order = 0;
              const firstSeen: Record<string, boolean> = {};
              return sightings.map((s) => {
                const v = views[s.view];
                const slot = (["top", "front", "right"] as const)[v.indexOf(s.key)];
                const [sx, sy] = faceMid(VX1[s.view], 44, S1, slot);
                const tx = slotX(ring.indexOf(s.key));
                const ty = 223;
                const repeat = firstSeen[s.key] === true;
                firstSeen[s.key] = true;
                const t = 0.9 + order * 0.42;
                order += 1;
                return (
                  <motion.g
                    key={`${s.view}-${s.key}`}
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={
                      repeat
                        ? { x: [0, tx - sx, tx - sx], y: [0, ty - sy, ty - sy - 26], opacity: [1, 1, 0] }
                        : { x: tx - sx, y: ty - sy, opacity: 1 }
                    }
                    transition={{ duration: repeat ? 1.5 : 0.85, times: repeat ? [0, 0.6, 1] : undefined, delay: t, type: repeat ? "tween" : "spring", stiffness: 90, damping: 15 }}
                  >
                    <Chip k={s.key} cx={sx} cy={sy} size={30} />
                  </motion.g>
                );
              });
            })()}
            <motion.text x={W / 2} y={276} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={IND} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}>
              {sightings.length} sightings, but only {ring.length} different colours
            </motion.text>
            <motion.text x={W / 2} y={298} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.8 }}>
              {ring
                .filter((k) => sightings.filter((s) => s.key === k).length > 1)
                .map((k) => face(k)?.name)
                .join(" and ")}{" "}
              turned up twice — a repeat is not a new neighbour
            </motion.text>
          </g>
        )}

        {/* ============ phase 2: the ring holds exactly four, so one colour is left ============ */}
        {phase === 2 && (
          <g>
            <text x={W / 2} y={24} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              a cube face touches exactly four others — {face(hub)?.name}&apos;s four are all used
            </text>
            {(() => {
              const cx = 150;
              const cy = 138;
              const sq = 50;
              const arm = 58;
              const spots = [
                [cx, cy - arm],
                [cx + arm, cy],
                [cx, cy + arm],
                [cx - arm, cy],
              ];
              return (
                <g>
                  {spots.map((p, i) => (
                    <g key={i}>
                      <motion.line
                        x1={cx}
                        y1={cy}
                        x2={p[0]}
                        y2={p[1]}
                        stroke={DIM}
                        strokeWidth={1.4}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + i * 0.22 }}
                      />
                      <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.62 + i * 0.22 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      >
                        <Chip k={ring[i]} cx={p[0]} cy={p[1]} size={sq} />
                      </motion.g>
                    </g>
                  ))}
                  <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.2 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <Chip k={hub} cx={cx} cy={cy} size={sq} />
                  </motion.g>
                  <motion.text x={cx} y={cy + arm + 46} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={IND} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                    the ring is full
                  </motion.text>
                </g>
              );
            })()}
            {/* the roster: strike off everything the ring accounts for */}
            <g>
              <text x={370} y={62} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM}>
                all {faces.length} colours
              </text>
              {faces.map((f, i) => {
                const y = 84 + i * 34;
                const used = f.key === hub || ring.includes(f.key);
                return (
                  <g key={f.key}>
                    <Chip k={f.key} cx={310} cy={y} size={26} muted={used} />
                    <motion.text
                      x={330}
                      y={y + 4}
                      fontSize="10.5"
                      fontWeight="800"
                      fill={used ? DIM : INK}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                    >
                      {f.name}
                    </motion.text>
                    {used && (
                      <motion.line
                        x1={328}
                        y1={y}
                        x2={330 + f.name.length * 6.2}
                        y2={y}
                        stroke={DIM}
                        strokeWidth={1.6}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 1.9 + i * 0.12 }}
                      />
                    )}
                    {!used && (
                      <motion.rect
                        x={294}
                        y={y - 17}
                        width={120}
                        height={34}
                        rx={9}
                        fill="none"
                        stroke={WIN}
                        strokeWidth={2.2}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.7 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      />
                    )}
                  </g>
                );
              })}
            </g>
            <motion.text x={W / 2} y={300} textAnchor="middle" fontSize="12" fontWeight="800" fill={WIN} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
              {unseen.length > 0
                ? `${unseen.map((f) => f.name).join(", ")} is left over — and was never even shown`
                : `${face(ask)?.name} is the only colour left over`}
            </motion.text>
          </g>
        )}

        {/* ============ phase 3: open the cube along the axis and pair the rest off ============ */}
        {phase === 3 &&
          (() => {
            const x = 40;
            const y = 94;
            const s = 72;
            const o = s * 0.44;
            const hubView = views.find((v) => v.includes(hub)) ?? views[0];
            const slot = (["top", "front", "right"] as const)[hubView.indexOf(hub)];
            // the hidden face sits exactly one depth-vector behind the front one
            const pull = { dx: 72, dy: -40 };
            const back = { x: x + o, y };
            const bm = [back.x + s / 2 + pull.dx, back.y + s / 2 + pull.dy];
            const hm = faceMid(x, y, s, slot);
            return (
              <g>
                <text x={W / 2} y={24} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  {face(ask)?.name} has nowhere left but the hidden face behind {face(hub)?.name}
                </text>
                {/* the cube stays whole; only the face nobody ever saw comes out */}
                <Cube x={x} y={y} s={s} view={hubView} lit={hub} dimOthers={false} />
                <motion.line
                  x1={hm[0]}
                  y1={hm[1]}
                  x2={bm[0]}
                  y2={bm[1]}
                  stroke={INK}
                  strokeWidth={1.6}
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.9 }}
                />
                <motion.g initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: pull.dx, y: pull.dy, opacity: 1 }} transition={{ type: "spring", stiffness: 60, damping: 15, delay: 1.1 }}>
                  <rect x={back.x} y={back.y} width={s} height={s} rx={2} fill={face(ask)?.fill} stroke={EDGE} strokeWidth={1.8} strokeDasharray="6 4" />
                  <text x={back.x + s / 2} y={back.y + s / 2 + 8} textAnchor="middle" fontSize={s * 0.3} fontWeight="800" fill={inkOn(face(ask)?.fill ?? "#fff")} fontFamily={numberFont}>
                    {ask}
                  </text>
                </motion.g>
                {/* anchored right of the cube's own width, or it lands on a face */}
                <motion.text x={x + s + o + 8} y={bm[1] + s / 2 + 18} fontSize="10" fontWeight="800" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
                  the face no view showed
                </motion.text>
                <motion.text x={x + 62} y={y + s + o + 30} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
                  opposite faces never touch
                </motion.text>

                {/* every colour pairs off, so no other pairing is possible */}
                <text x={352} y={58} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM}>
                  the three opposite pairs
                </text>
                {pairs.map((p, i) => {
                  const yy = 88 + i * 52;
                  const isAsk = p.includes(ask);
                  return (
                    <motion.g
                      key={p.join()}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "spring", stiffness: 150, damping: 16, delay: 2.3 + i * 0.25 }}
                    >
                      {isAsk && <rect x={286} y={yy - 22} width={134} height={44} rx={10} fill="#dcfce7" stroke={WIN} strokeWidth={1.8} />}
                      <Chip k={p[0]} cx={312} cy={yy} size={30} />
                      <text x={352} y={yy + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={isAsk ? WIN : DIM}>
                        ↔
                      </text>
                      <Chip k={p[1]} cx={392} cy={yy} size={30} />
                    </motion.g>
                  );
                })}
                <motion.text x={W / 2} y={292} textAnchor="middle" fontSize="15" fontWeight="800" fill={WIN} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 160, damping: 16, delay: 3.2 }}>
                  opposite {face(ask)?.name} = {answerFace?.name}
                </motion.text>
              </g>
            );
          })()}
      </svg>

      <motion.span
        key={phase}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
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
          ? `${seen.length} of the ${faces.length} colours are ever shown`
          : phase === 1
          ? `${hub} touches ${ring.join(", ")}`
          : phase === 2
          ? `${ring.length} neighbours + ${hub} itself = ${ring.length + 1} of ${faces.length}`
          : `${ask} and ${hub} are the pair that never meet`}
      </motion.span>

      {isFinal && solutions.length > 0 && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.6 }}
          style={{ fontSize: 10.5, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 450 }}
        >
          checked by brute force: of the {paintings.length} ways to paint the cube, the{" "}
          {solutions.length} that can show all {views.length} views agree on every opposite pair — so the other
          four colours are already paired with each other and none can face {face(ask)?.name}.
        </motion.span>
      )}

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 3.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
