import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const WIRE = "#94a3b8";
const EDGE = "#0d9488";
const FACE = "#4338ca";
const SPACE = "#dc2626";
const WIN = "#16a34a";

type V3 = { id: string; x: number; y: number; z: number };

/**
 * Equilateral triangles on the vertices of a cube through one chosen vertex.
 * Cube vertices sit at only three distances apart — edge, face diagonal, space
 * diagonal — and only the face diagonal can carry an equilateral triangle: two
 * edge-neighbours of a vertex are a face diagonal apart, and only one vertex is a
 * space diagonal away. The chosen vertex's three face-diagonal neighbours turn
 * out to be mutually face-diagonal too, so together they form a regular
 * tetrahedron inscribed in the cube, and the answer is simply how many of its
 * four faces meet the vertex. Distance classes, every equilateral triple and the
 * tetrahedron's regularity are all computed from the coordinates.
 * Data: { apex, vertices:[{id,x,y,z}] }.
 */
export function CubeTriangleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const verts: V3[] = (Array.isArray(data.vertices) ? data.vertices : []).map((r) => {
    const o = (r ?? {}) as Record<string, unknown>;
    return { id: String(o.id ?? "?"), x: num(o.x, 0), y: num(o.y, 0), z: num(o.z, 0) };
  });
  const apex = data.apex != null ? String(data.apex) : verts[0]?.id ?? "";
  const at = (id: string) => verts.find((v) => v.id === id)!;

  const d2 = (a: V3, b: V3) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
  const A = at(apex);
  const byClass = (k: number) => verts.filter((v) => v.id !== apex && d2(A, v) === k);
  const edgeN = byClass(1);
  const faceN = byClass(2);
  const spaceN = byClass(3);

  // every equilateral triple, found from the coordinates
  const triples: string[][] = [];
  for (let i = 0; i < verts.length; i++)
    for (let j = i + 1; j < verts.length; j++)
      for (let k = j + 1; k < verts.length; k++) {
        const [p, q, r] = [verts[i], verts[j], verts[k]];
        if (d2(p, q) === d2(q, r) && d2(q, r) === d2(p, r)) triples.push([p.id, q.id, r.id]);
      }
  const throughApex = triples.filter((t) => t.includes(apex));
  const count = throughApex.length;

  // the apex with its face-diagonal neighbours
  const tet = [apex, ...faceN.map((v) => v.id)];
  const tetPairs: number[] = [];
  for (let i = 0; i < tet.length; i++) for (let j = i + 1; j < tet.length; j++) tetPairs.push(d2(at(tet[i]), at(tet[j])));
  const regular = tet.length === 4 && new Set(tetPairs).size === 1;
  const agrees = problem.shortAnswer == null || Number(problem.shortAnswer) === count;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showRule = !isFinal && step === 1;
  const showTet = isFinal || step >= 2;

  // ---- geometry ----
  const W = 340;
  const H = 194;
  const S = 96;
  const D = 40;
  const ox = 46;
  const oy = 168;
  const PX = (v: V3) => ox + v.x * S + v.z * D;
  const PY = (v: V3) => oy - v.y * S - v.z * D;
  const cx = ox + S / 2 + D / 2;
  const cy = oy - S / 2 - D / 2;
  const panelX = 214;

  const edges: [string, string][] = [];
  for (let i = 0; i < verts.length; i++)
    for (let j = i + 1; j < verts.length; j++) if (d2(verts[i], verts[j]) === 1) edges.push([verts[i].id, verts[j].id]);

  const poly = (ids: string[]) => ids.map((id) => `${PX(at(id))},${PY(at(id))}`).join(" ");
  const colorOf = (id: string) =>
    id === apex ? WIN : edgeN.some((v) => v.id === id) ? EDGE : faceN.some((v) => v.id === id) ? FACE : SPACE;

  // two edge-neighbours of the apex: the triangle that is only isosceles
  const iso = edgeN.length >= 2 ? [apex, edgeN[0].id, edgeN[1].id] : [];

  const caption = isFinal
    ? `${throughApex.map((t) => t.join("")).join(", ")} — ${count} of the four faces meet ${apex}`
    : step === 0
    ? `from ${apex}: ${edgeN.length} at s, ${faceN.length} at s√2, ${spaceN.length} at s√3`
    : showRule
    ? `${iso.join("")} has sides s, s, s√2 — and only ${spaceN.length} vertex is s√3 away`
    : `${faceN.map((v) => v.id).join(", ")} are s√2 from each other too`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* the tetrahedron's faces, the three through the apex lit */}
        <AnimatePresence>
          {showTet &&
            [...throughApex, faceN.map((v) => v.id)].map((t, i) => {
              const meets = t.includes(apex);
              if (!isFinal && meets) return null;
              return (
                <motion.polygon
                  key={t.join("")}
                  points={poly(t)}
                  fill={meets ? "rgba(22,163,74,0.20)" : "rgba(67,56,202,0.13)"}
                  stroke={meets ? WIN : FACE}
                  strokeWidth={meets ? 2.2 : 1.8}
                  strokeLinejoin="round"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 + i * 0.18 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              );
            })}
        </AnimatePresence>

        {/* the cube wireframe */}
        {edges.map(([a, b], i) => (
          <motion.line
            key={`e${i}`}
            x1={PX(at(a))}
            y1={PY(at(a))}
            x2={PX(at(b))}
            y2={PY(at(b))}
            stroke={WIRE}
            strokeWidth={1.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
          />
        ))}

        {/* how far every other vertex is from the apex */}
        <AnimatePresence>
          {step === 0 && !isFinal &&
            verts
              .filter((v) => v.id !== apex)
              .map((v, i) => (
                <motion.line
                  key={`r${v.id}`}
                  x1={PX(A)}
                  y1={PY(A)}
                  x2={PX(v)}
                  y2={PY(v)}
                  stroke={colorOf(v.id)}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.09 }}
                />
              ))}
        </AnimatePresence>

        {/* the tetrahedron's other three edges, so its skeleton is visible
            before the faces through the apex are filled in */}
        <AnimatePresence>
          {showTet &&
            faceN.map((v, i) => (
              <motion.line
                key={`t${v.id}`}
                x1={PX(A)}
                y1={PY(A)}
                x2={PX(v)}
                y2={PY(v)}
                stroke={FACE}
                strokeWidth={2}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.14 }}
              />
            ))}
        </AnimatePresence>

        {/* the triangle that is only isosceles */}
        <AnimatePresence>
          {showRule && iso.length === 3 && (
            <motion.g key="iso" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <polygon points={poly(iso)} fill="rgba(220,38,38,0.10)" stroke={SPACE} strokeWidth={2} strokeLinejoin="round" />
              {([[iso[0], iso[1], "s"], [iso[0], iso[2], "s"], [iso[1], iso[2], "s√2"]] as [string, string, string][]).map(
                ([a, b, t], i) => (
                  <text
                    key={i}
                    x={(PX(at(a)) + PX(at(b))) / 2}
                    y={(PY(at(a)) + PY(at(b))) / 2 - 3}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="800"
                    fill={t === "s" ? EDGE : SPACE}
                    fontFamily={numberFont}
                  >
                    {t}
                  </text>
                )
              )}
            </motion.g>
          )}
        </AnimatePresence>

        {/* vertices and their names */}
        {verts.map((v, i) => {
          const dim = showRule ? !iso.includes(v.id) : showTet ? !tet.includes(v.id) : false;
          const nx = PX(v) - cx;
          const ny = PY(v) - cy;
          const len = Math.hypot(nx, ny) || 1;
          return (
            <motion.g
              key={v.id}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: dim ? 0.3 : 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.2 + i * 0.05 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <circle cx={PX(v)} cy={PY(v)} r={v.id === apex ? 5.5 : 4} fill={step === 0 && !isFinal ? colorOf(v.id) : v.id === apex ? WIN : INK} />
              <text
                x={PX(v) + (nx / len) * 15}
                y={PY(v) + (ny / len) * 15 + 4}
                textAnchor="middle"
                fontSize="12"
                fontWeight="800"
                fill={v.id === apex ? WIN : INK}
                fontFamily={numberFont}
              >
                {v.id}
              </text>
            </motion.g>
          );
        })}

        {/* the distance classes, then what they rule in or out */}
        {step === 0 && !isFinal && (
          <g>
            {[
              { c: EDGE, n: edgeN.length, t: "s", w: "edge" },
              { c: FACE, n: faceN.length, t: "s√2", w: "face diag" },
              { c: SPACE, n: spaceN.length, t: "s√3", w: "space diag" },
            ].map((row, i) => (
              <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.14 }}>
                <circle cx={panelX + 8} cy={40 + i * 24} r={5} fill={row.c} />
                <text x={panelX + 20} y={40 + i * 24 + 4} fontSize="10" fontWeight="800" fill={INK} fontFamily={numberFont}>
                  {row.n} at {row.t}
                </text>
                <text x={panelX + 20} y={40 + i * 24 + 14} fontSize="8" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                  {row.w}
                </text>
              </motion.g>
            ))}
          </g>
        )}

        <AnimatePresence>
          {showRule && (
            <motion.g key="rules" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <text x={panelX} y={44} fontSize="9.5" fontWeight="800" fill={SPACE} fontFamily={numberFont}>
                s: ✗ closes to s√2
              </text>
              <text x={panelX} y={64} fontSize="9.5" fontWeight="800" fill={SPACE} fontFamily={numberFont}>
                s√3: ✗ only {spaceN.length} vertex
              </text>
              <text x={panelX} y={90} fontSize="10.5" fontWeight="800" fill={FACE} fontFamily={numberFont}>
                so every side
              </text>
              <text x={panelX} y={104} fontSize="10.5" fontWeight="800" fill={FACE} fontFamily={numberFont}>
                is s√2
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTet && (
            <motion.g key="tet" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <text x={panelX} y={40} fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {tet.join("")}: all {tetPairs.length}
              </text>
              <text x={panelX} y={53} fontSize="9.5" fontWeight="800" fill={regular ? FACE : SPACE} fontFamily={numberFont}>
                edges s√2 {regular ? "✓" : "✗"}
              </text>
              <text x={panelX} y={72} fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                a regular
              </text>
              <text x={panelX} y={85} fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                tetrahedron
              </text>
              {isFinal &&
                throughApex.map((t, i) => (
                  <motion.text
                    key={t.join("")}
                    x={panelX}
                    y={110 + i * 18}
                    fontSize="11"
                    fontWeight="800"
                    fill={WIN}
                    fontFamily={numberFont}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.15 }}
                  >
                    △{t.join("")}
                  </motion.text>
                ))}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : showRule ? "#991b1b" : "#4338ca",
          background: isFinal ? "#dcfce7" : showRule ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showRule ? "#fecaca" : "#c7d2fe"}`,
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
            transition={{ delay: 0.7 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : SPACE, textAlign: "center" }}
          >
            {agrees
              ? `checked all triples: the cube has ${triples.length} equilateral triangles, ${count} through ${apex}`
              : `the search found ${count}, not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.8 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
