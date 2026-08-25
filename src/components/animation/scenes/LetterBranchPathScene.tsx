import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const COLORS = ["#4338ca", "#0d9488", "#d97706", "#16a34a"];
const GREEN = "#16a34a";
const RED = "#dc2626";
type Node = { r: number; c: number; label: string; key: string };

/** Enumerate orthogonal paths through a sparse letter grid in the required order. */
export function LetterBranchPathScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const target = typeof data.target === "string" ? data.target : "AMC8";
  const nodes: Node[] = (Array.isArray(data.nodes) ? data.nodes : []).map((raw) => {
    const [r, c, label] = String(raw).split(",");
    return { r: Math.round(num(r, -1)), c: Math.round(num(c, -1)), label: label ?? "", key: `${r},${c}` };
  });
  const byKey = new Map(nodes.map((node) => [node.key, node]));
  const next = (node: Node, label: string) => [[-1, 0], [1, 0], [0, -1], [0, 1]]
    .map(([dr, dc]) => byKey.get(`${node.r + dr},${node.c + dc}`))
    .filter((candidate): candidate is Node => candidate?.label === label);
  let paths: Node[][] = nodes.filter((node) => node.label === target[0]).map((node) => [node]);
  const levelCounts = [paths.length];
  for (const label of target.slice(1)) {
    paths = paths.flatMap((path) => next(path[path.length - 1], label).map((node) => [...path, node]));
    levelCounts.push(paths.length);
  }
  const starts = nodes.filter((node) => node.label === target[0]);
  const branchCounts = target.slice(1).split("").map((label, depth) => {
    const prefixes = depth === 0 ? starts.map((node) => [node]) : (() => {
      let ps = starts.map((node) => [node]);
      for (const ch of target.slice(1, depth + 1)) ps = ps.flatMap((p) => next(p[p.length - 1], ch).map((n) => [...p, n]));
      return ps;
    })();
    const counts = prefixes.map((p) => next(p[p.length - 1], label).length);
    return new Set(counts).size === 1 ? counts[0] ?? 0 : -1;
  });
  const product = branchCounts.reduce((a, b) => a * b, 1);
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d-]/g, ""));
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === paths.length)?.label;
  const ok = starts.length === 1 && branchCounts.every((n) => n > 0) && product === paths.length && paths.length === stored && choice === problem.answer;
  const failure = starts.length !== 1 ? `${starts.length} starting ${target[0]} nodes` : product !== paths.length ? `branch product ${product}, enumeration ${paths.length}` : `counted ${paths.length}, stored answer ${problem.shortAnswer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 4 : Math.min(step, 3);
  const CELL = 46, X0 = 28, Y0 = 47;
  const X = (c: number) => X0 + c * CELL;
  const Y = (r: number) => Y0 + r * CELL;
  const visibleDepth = Math.min(phase, target.length - 1);
  const edgeSet = new Map<string, { a: Node; b: Node; depth: number }>();
  paths.forEach((path) => path.slice(0, -1).forEach((a, i) => edgeSet.set(`${a.key}>${path[i + 1].key}`, { a, b: path[i + 1], depth: i + 1 })));
  const demo = paths[0] ?? [];

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "calc(100vw - 48px)", maxWidth: 480, minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 440 340" style={{ width: "calc(100vw - 48px)", maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="220" y="17" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>{phase === 0 ? "begin at the one central A" : phase === 1 ? "move one square to an M" : phase === 2 ? "from each M, move to a C" : phase === 3 ? "from each C, finish at an 8" : "multiply the independent choices"}</text>
      <rect x="12" y="23" width="252" height="296" rx="14" fill="#f8fafc" stroke="#e2e8f0" />
      {[...edgeSet.values()].filter((edge) => edge.depth <= visibleDepth).map((edge, i) => <motion.line key={`${edge.a.key}-${edge.b.key}`} x1={X(edge.a.c)} y1={Y(edge.a.r)} x2={X(edge.b.c)} y2={Y(edge.b.r)} stroke={COLORS[edge.depth]} strokeWidth={phase === edge.depth ? 2.4 : 1.3} strokeOpacity={phase === edge.depth ? 0.75 : 0.25} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: (i % 12) * 0.035 }} />)}
      {nodes.map((node) => {
        const depth = target.indexOf(node.label);
        const active = depth >= 0 && depth <= visibleDepth;
        return <motion.g key={node.key} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: active ? 1 : 0.22, scale: active ? 1 : 0.82 }} transition={{ type: "spring", stiffness: 210, damping: 16, delay: active ? Math.max(0, depth) * 0.15 : 0 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <circle cx={X(node.c)} cy={Y(node.r)} r="17" fill={active ? `${COLORS[Math.max(0, depth)]}18` : "#fff"} stroke={active ? COLORS[Math.max(0, depth)] : "#cbd5e1"} strokeWidth={active ? 2 : 1} />
          <text x={X(node.c)} y={Y(node.r) + 6} textAnchor="middle" fontSize="18" fontWeight="900" fill={active ? COLORS[Math.max(0, depth)] : "#94a3b8"} fontFamily={mono}>{node.label}</text>
        </motion.g>;
      })}
      {phase > 0 && phase < 4 && demo[phase] && <motion.g key={`walker-${phase}`} initial={{ x: X(demo[phase - 1].c), y: Y(demo[phase - 1].r), opacity: 0 }} animate={{ x: X(demo[phase].c), y: Y(demo[phase].r), opacity: 1 }} transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.35 }}><circle r="6" fill={COLORS[phase]} stroke="#fff" strokeWidth="2" /></motion.g>}

      <g transform="translate(278 34)">
        {target.split("").map((label, i) => <g key={label}><circle cx="22" cy={18 + i * 52} r="15" fill={`${COLORS[i]}18`} stroke={COLORS[i]} strokeWidth="2" /><text x="22" y={24 + i * 52} textAnchor="middle" fontSize="17" fontWeight="900" fill={COLORS[i]} fontFamily={mono}>{label}</text>{i > 0 && <><text x="53" y={23 + i * 52} fontSize="14" fontWeight="900" fill={i <= visibleDepth ? COLORS[i] : "#cbd5e1"} fontFamily={mono}>× {branchCounts[i - 1]}</text><text x="92" y={23 + i * 52} fontSize="10" fontWeight="800" fill={i <= visibleDepth ? COLORS[i] : "#cbd5e1"} fontFamily={mono}>= {levelCounts[i]}</text></>}</g>)}
        {phase === 4 && <motion.g initial={{ opacity: 0, scale: 0.65 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.45 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x="-2" y="220" width="151" height="37" rx="11" fill="#dcfce7" stroke={GREEN} strokeWidth="2" /><text x="73" y="244" textAnchor="middle" fontSize="15" fontWeight="900" fill={GREEN} fontFamily={mono}>{branchCounts.join(" × ")} = {paths.length}</text></motion.g>}
      </g>
      {phase < 4 && <text x="344" y="324" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={COLORS[visibleDepth]} fontFamily={mono}>{levelCounts[visibleDepth]} partial path{levelCounts[visibleDepth] === 1 ? "" : "s"}</text>}
      {phase === 4 && <><text x="182" y="333" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={mono}>{ok ? `enumerated all ${paths.length} orthogonal paths` : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={385} y={311} width={72} /></>}
    </svg>
    <AnimatePresence>{final && !ok && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: RED, fontFamily: mono, fontSize: 11, fontWeight: 800 }}>{failure}</motion.div>}</AnimatePresence>
  </div>;
}
