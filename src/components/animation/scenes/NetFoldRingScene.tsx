import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const STRIP = "#e0e7ff";
const FLAP = "#fef3c7";
const MARK = "#4338ca";
const HOT = "#b45309";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const W = 340;
const H = 212;
const HB = 23; // half a triangle base
const RH = 42; // row height
const X0 = 14;
const Y0 = 80;
const NX = 208;

type P = { id: string; x: number; y: number };
type F = { id: string; vs: string[] };

/**
 * A polyhedron net folded up, asking which face lands beside a named one. The
 * scene **derives the folding** rather than asserting it: planar vertices are
 * merged by repeatedly closing whichever vertex already carries its full ring of
 * faces — its two boundary edges must be the same edge, which glues their far
 * endpoints — until every vertex is complete and every edge is shared by two
 * faces. With the identification known, each face becomes a set of solid
 * vertices and any two faces are adjacent, opposite, or merely vertex-sharing by
 * counting what they have in common. For an octahedron the unlock is that a long
 * **run of six triangles closes into a ring** around the middle (the equator is
 * exactly six faces) while the two stray flaps fold over as the caps and land
 * opposite each other — so the run's first face comes all the way round to meet
 * its last, which is the whole answer. The beats draw the net, fold the flaps
 * away as caps, walk the first face round the ring to its landing edge (computed
 * from the shared vertices, so the ghost sits on the right edge of the target),
 * then list the target's full neighbourhood with the face opposite it.
 * Data: { points: ["A|0|0", ...], faces: ["1|A|B|E", ...], strip: [...], target }.
 */
export function NetFoldRingScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const pts: P[] = (Array.isArray(data.points) ? data.points : [])
    .map(String)
    .map((s) => s.split("|"))
    .filter((p) => p.length >= 3 && Number.isFinite(+p[1]) && Number.isFinite(+p[2]))
    .map((p) => ({ id: p[0].trim(), x: +p[1], y: +p[2] }));
  const faces: F[] = (Array.isArray(data.faces) ? data.faces : [])
    .map(String)
    .map((s) => s.split("|").map((t) => t.trim()))
    .filter((p) => p.length >= 4)
    .map((p) => ({ id: p[0], vs: p.slice(1, 4) }));
  const strip = (Array.isArray(data.strip) ? data.strip : []).map(String);
  const target = data.target != null ? String(data.target) : "";
  const pos = new Map(pts.map((p) => [p.id, p]));
  if (faces.length < 4 || !strip.length || !pos.has(faces[0].vs[0]) || !faces.some((f) => f.id === target)) return null;

  // ---- fold the net: merge planar vertices until every one carries a full ring ----
  const par = new Map<string, string>(pts.map((p) => [p.id, p.id]));
  const find = (x: string): string => {
    let r = x;
    while (par.get(r) !== r) r = par.get(r)!;
    return r;
  };
  const join = (a: string, b: string) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) par.set(ra, rb);
  };
  const ring = () => {
    const cnt = new Map<string, number>();
    const edge = new Map<string, string[][]>();
    for (const f of faces) {
      const rs = f.vs.map(find);
      new Set(rs).forEach((r) => cnt.set(r, (cnt.get(r) ?? 0) + 1));
      for (let i = 0; i < 3; i++) {
        const key = [rs[i], rs[(i + 1) % 3]].sort().join("~");
        edge.set(key, [...(edge.get(key) ?? []), [f.vs[i], f.vs[(i + 1) % 3]]]);
      }
    }
    return { cnt, edge };
  };
  for (let guard = 0; guard < 40; guard++) {
    const { cnt, edge } = ring();
    let moved = false;
    for (const [r, c] of cnt) {
      if (c !== 4) continue;
      const free: string[][] = [];
      for (const [key, list] of edge) if (list.length === 1 && key.split("~").includes(r)) free.push(list[0]);
      if (free.length !== 2) continue;
      const far = free.map((e) => (find(e[0]) === r ? e[1] : e[0]));
      if (find(far[0]) !== find(far[1])) {
        join(far[0], far[1]);
        moved = true;
        break;
      }
    }
    if (!moved) break;
  }
  const { cnt: finalCnt, edge: finalEdge } = ring();
  const solid = faces.map((f) => ({ id: f.id, vs: f.vs, set: new Set(f.vs.map(find)) }));
  const closed = [...finalCnt.values()].every((c) => c === 4) && [...finalEdge.values()].every((l) => l.length === 2);

  const of = (id: string) => solid.find((s) => s.id === id)!;
  const shared = (a: string, b: string) => [...of(a).set].filter((v) => of(b).set.has(v)).length;
  const T = of(target);
  const neighbours = solid.filter((s) => s.id !== target && shared(target, s.id) === 2).map((s) => s.id);
  const opposite = solid.find((s) => s.id !== target && shared(target, s.id) === 0)?.id ?? "";

  // the run closes into a ring, so its first face meets its last
  const ringCloses = strip.every((id, i) => shared(id, strip[(i + 1) % strip.length]) === 2);
  const answer = strip[0];
  const fromStrip = strip[strip.length - 2] ?? "";
  const cap = neighbours.find((x) => x !== answer && x !== fromStrip) ?? "";
  const flaps = faces.map((f) => f.id).filter((id) => !strip.includes(id));
  const capsOpposite = flaps.length === 2 && shared(flaps[0], flaps[1]) === 0;

  // which edge of the target does the answer face glue to, and where does it land
  const meet = [...T.set].filter((v) => of(answer).set.has(v));
  const onEdge = T.vs.filter((v) => meet.includes(find(v)));
  const apexV = T.vs.find((v) => !onEdge.includes(v))!;
  const ghost =
    onEdge.length === 2
      ? (() => {
          const a = pos.get(onEdge[0])!;
          const b = pos.get(onEdge[1])!;
          const c = pos.get(apexV)!;
          return [a, b, { id: "*", x: a.x + b.x - c.x, y: a.y + b.y - c.y }];
        })()
      : null;

  const tx = (x: number) => X0 + x * HB;
  const ty = (y: number) => Y0 - y * RH;
  const poly = (vs: { x: number; y: number }[]) => vs.map((v) => `${tx(v.x)},${ty(v.y)}`).join(" ");
  const mid = (vs: { x: number; y: number }[]) => ({
    x: vs.reduce((s, v) => s + tx(v.x), 0) / vs.length,
    y: vs.reduce((s, v) => s + ty(v.y), 0) / vs.length,
  });

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const capsGone = step >= 1;
  const wrapped = isFinal || step >= 2;

  const startC = mid(faces.find((f) => f.id === answer)!.vs.map((v) => pos.get(v)!));
  const endC = ghost ? mid(ghost) : startC;

  const caption = isFinal
    ? `${answer} sits on the far side of ${target} from ${fromStrip}`
    : step === 0
    ? `a run of ${strip.length}: ${strip.join(", ")} — with ${flaps.join(" and ")} hanging off`
    : step === 1
    ? `${flaps.join(" and ")} fold over as the two caps`
    : `${strip.length} faces make a full ring, so ${answer} comes round to ${target}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the net */}
        {faces.map((f) => {
          const vs = f.vs.map((v) => pos.get(v)!);
          const c = mid(vs);
          const isFlap = !strip.includes(f.id);
          const isT = f.id === target;
          const gone = capsGone && isFlap;
          return (
            <motion.g
              key={f.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: gone ? 0.3 : 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.08 * strip.indexOf(f.id) + (isFlap ? 0.5 : 0.1) }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <polygon
                points={poly(vs)}
                fill={isT ? "#dcfce7" : isFlap ? FLAP : STRIP}
                stroke={isT ? WIN : isFlap ? HOT : MARK}
                strokeWidth={isT ? 2 : 1.3}
                strokeDasharray={gone ? "3 3" : undefined}
              />
              <text x={c.x} y={c.y + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={isT ? WIN : isFlap ? HOT : INK} fontFamily={numberFont}>
                {f.id}
              </text>
            </motion.g>
          );
        })}

        {/* the first face comes round the ring and lands on the target */}
        <AnimatePresence>
          {wrapped && ghost && (
            <motion.g key="ghost" initial={{ x: startC.x - endC.x, y: startC.y - endC.y }} animate={{ x: 0, y: 0 }} transition={{ type: "spring", stiffness: 60, damping: 16, delay: 0.4 }}>
              <polygon points={poly(ghost)} fill="#dbeafe" stroke={MARK} strokeWidth={2} />
              <text x={mid(ghost).x} y={mid(ghost).y + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                {answer}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* notes */}
        <AnimatePresence>
          {!capsGone && (
            <motion.g key="n0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
              <text x={NX} y={60} fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                a run of {strip.length}
              </text>
              <text x={NX} y={80} fontSize="10.5" fontWeight="800" fill={HOT} fontFamily={numberFont}>
                {flaps.length} flaps
              </text>
              <text x={NX} y={106} fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                {faces.length} faces in all
              </text>
            </motion.g>
          )}
          {capsGone && !wrapped && (
            <motion.g key="n1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <text x={NX} y={56} fontSize="10.5" fontWeight="800" fill={HOT} fontFamily={numberFont}>
                {flaps.join(" and ")} become
              </text>
              <text x={NX} y={72} fontSize="10.5" fontWeight="800" fill={HOT} fontFamily={numberFont}>
                the two caps
              </text>
              <text x={NX} y={96} fontSize="9.5" fontWeight="700" fill={capsOpposite ? DIM : BAD} fontFamily={numberFont}>
                {capsOpposite ? "and land opposite" : "caps not opposite"}
              </text>
              <text x={NX} y={126} fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                the middle of an
              </text>
              <text x={NX} y={142} fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                octahedron is a ring
              </text>
              <text x={NX} y={158} fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                of exactly {strip.length}
              </text>
            </motion.g>
          )}
          {wrapped && !isFinal && (
            <motion.g key="n2a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <text x={NX} y={56} fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                the run closes,
              </text>
              <text x={NX} y={72} fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                so {answer} glues onto
              </text>
              <text x={NX} y={88} fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                the far edge of {target}
              </text>
              <text x={NX} y={116} fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                {fromStrip} came from the left
              </text>
            </motion.g>
          )}
          {isFinal && (
            <motion.g key="n2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <text x={NX} y={52} fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                around {target}:
              </text>
              {[
                { t: `${fromStrip} — before it`, c: MARK },
                { t: `${answer} — round the ring`, c: WIN },
                { t: `${cap} — the cap`, c: HOT },
              ].map((r, i) => (
                <motion.text
                  key={i}
                  x={NX}
                  y={72 + i * 18}
                  fontSize="10"
                  fontWeight="800"
                  fill={r.c}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1.1 + i * 0.2 }}
                >
                  {r.t}
                </motion.text>
              ))}
              <motion.text x={NX} y={142} fontSize="10" fontWeight="700" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                opposite {target}: {opposite}
              </motion.text>
              {(
                <motion.text
                  x={NX}
                  y={174}
                  fontSize="17"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15, delay: 2 }}
                  style={{ transformBox: "fill-box", transformOrigin: "left center" }}
                >
                  face {answer}
                </motion.text>
              )}
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
            transition={{ delay: 2.2 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: closed && ringCloses ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {!closed
              ? "the net does not fold up cleanly"
              : !ringCloses
              ? "the run does not close into a ring"
              : `folded it: every corner takes 4 faces, and ${target} meets ${neighbours.join(", ")}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
