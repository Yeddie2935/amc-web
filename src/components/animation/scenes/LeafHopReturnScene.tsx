import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, num } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const AMBER = "#d97706";
const MUTE = "#94a3b8";
const RULE = "#cbd5e1";
const LEAF = "#65a30d";
const LEAFD = "#3f6212";
const HOME = "#0891b2";

const W = 380;
const H = 292;

type P = [number, number];
type R = [number, number];

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const red = ([n, d]: R): R => {
  const k = gcd(n, d) || 1;
  const s = d < 0 ? -1 : 1;
  return [(s * n) / k, (s * d) / k];
};
const mul = (a: R, b: R): R => red([a[0] * b[0], a[1] * b[1]]);
const add = (a: R, b: R): R => red([a[0] * b[1] + b[0] * a[1], a[1] * b[1]]);
const rs = ([n, d]: R) => (d === 1 ? String(n) : `${n}/${d}`);
const eqR = (a: R, b: R) => a[0] === b[0] && a[1] === b[1];
const parseR = (t: string): R | null => {
  const s = String(t).replace(/[−–—]/g, "-").trim();
  const m = s.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (m) return red([Number(m[1]), Number(m[2])]);
  const v = Number(s);
  return Number.isFinite(v) && s !== "" ? red([v, 1]) : null;
};

/** x/y keyframes that arc between consecutive points, so a walk really hops. */
function hopKeys(pts: P[], per = 10) {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const lift = Math.min(40, Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.45);
    for (let k = 0; k < per; k++) {
      const t = k / per;
      xs.push(a[0] + (b[0] - a[0]) * t);
      ys.push(a[1] + (b[1] - a[1]) * t - lift * 4 * t * (1 - t));
    }
  }
  const last = pts[pts.length - 1];
  xs.push(last[0]);
  ys.push(last[1]);
  return { xs, ys, times: xs.map((_, i) => i / Math.max(1, xs.length - 1)) };
}

function Leaf({ angle }: { angle: number }) {
  return (
    <g transform={`rotate(${angle})`}>
      <path d="M -13 0 Q 0 -9 13 0 Q 0 9 -13 0 Z" fill={LEAF} stroke={LEAFD} strokeWidth={1.1} />
      <path d="M -13 0 L 13 0" stroke={LEAFD} strokeWidth={0.7} />
      <path d="M -5 0 L -1 -3 M 1 0 L 5 -3 M -5 0 L -1 3 M 1 0 L 5 3" stroke={LEAFD} strokeWidth={0.5} fill="none" />
    </g>
  );
}

function Cricket() {
  return (
    <g>
      <ellipse cx={-1} cy={0} rx={7} ry={4.2} fill="#4d7c0f" stroke="#1a2e05" strokeWidth={0.8} />
      <circle cx={6} cy={-1.6} r={3} fill="#4d7c0f" stroke="#1a2e05" strokeWidth={0.8} />
      <path d="M 8 -3.4 Q 13 -8 15.5 -10" fill="none" stroke="#1a2e05" strokeWidth={0.8} strokeLinecap="round" />
      <path d="M 7.6 -4.2 Q 11 -9 10 -12" fill="none" stroke="#1a2e05" strokeWidth={0.8} strokeLinecap="round" />
      <path d="M -3 1.5 L -7 7 L -1.5 8" fill="none" stroke="#1a2e05" strokeWidth={1.3} strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 1.5 2.5 L -0.5 6.5" fill="none" stroke="#1a2e05" strokeWidth={1} strokeLinecap="round" />
    </g>
  );
}

/**
 * A random walk over a handful of **interchangeable** sites — each turn the
 * walker must move, choosing uniformly among the others — asking the chance it is
 * back where it started after a set number of turns. Tracking which site it is on
 * looks like a problem with `sites` states, and the unlock is that it is really
 * only ever a problem with **two**: the site you started on, and "somewhere else".
 * Every non-home site behaves identically, so the whole thing collapses to
 * `home → away` with certainty and `away → home` with probability `1/(sites−1)`.
 * The scene animates that collapse rather than asserting it — the non-home sites
 * physically gather under one bracket — and the two-state machine it produces is
 * then walked out as **real routes on the real sites**, with the cricket hopping
 * along keyframed arcs. That matters for the `away → away` step in particular:
 * the walker has to land on a *different* away site, which is exactly where the
 * `(sites−2)/(sites−1)` comes from, and the drawn route uses a fresh leaf each
 * time so the rule is visible instead of quoted.
 * Route enumeration is exhaustive over the collapsed chain (the walker can never
 * sit at home two turns running, so the surviving routes are few), every
 * probability is exact rational arithmetic, and the total is cross-checked
 * against a completely independent **count of the real hop sequences** — 21 of 81
 * here. The closing beat prices two slips and names the choice each hits:
 * stopping one turn early, and letting the walker stay put.
 * Data: { sites, hops, siteWord? }
 */
export function LeafHopReturnScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.max(3, Math.min(8, num(data.sites ?? 4)));
  const hops = Math.max(2, Math.min(10, num(data.hops ?? 4)));
  const word = String(data.siteWord ?? "leaf");
  const words = String(data.siteWordPlural ?? (word.endsWith("f") ? `${word.slice(0, -1)}ves` : `${word}s`));

  // the collapsed two-state chain
  const pHA: R = [1, 1];
  const pAH: R = [1, n - 1];
  const pAA: R = [n - 2, n - 1];

  // every route that comes home, enumerated on the collapsed chain
  const routes: { seq: number[]; probs: R[]; p: R }[] = [];
  const walk = (seq: number[], probs: R[]) => {
    if (seq.length === hops + 1) {
      if (seq[seq.length - 1] === 0) routes.push({ seq, probs, p: probs.reduce(mul, [1, 1] as R) });
      return;
    }
    if (seq[seq.length - 1] === 0) walk([...seq, 1], [...probs, pHA]);
    else {
      walk([...seq, 0], [...probs, pAH]);
      walk([...seq, 1], [...probs, pAA]);
    }
  };
  walk([0], []);
  const total = routes.reduce((a, r) => add(a, r.p), [0, 1] as R);
  // shown unreduced so the addition reads 3/27 + 4/27, not 1/9 + 4/27
  const commonDen = routes.reduce((a, r) => (a * r.p[1]) / gcd(a, r.p[1]), total[1]);

  // and, independently, count the real hop sequences over labelled sites
  let counts = Array.from({ length: n }, (_, i) => (i === 0 ? 1 : 0));
  for (let k = 0; k < hops; k++) {
    const nx = Array.from({ length: n }, () => 0);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) nx[j] += counts[i];
    counts = nx;
  }
  const backCount = counts[0];
  const allCount = Math.pow(n - 1, hops);
  const matches = eqR(red([backCount, allCount]), total);

  // the chance of being home after each hop — the second-to-last is a classic trap
  let dist: [R, R] = [[1, 1], [0, 1]];
  const hist: R[] = [dist[0]];
  for (let k = 0; k < hops; k++) {
    dist = [mul(dist[1], pAH), add(mul(dist[0], pHA), mul(dist[1], pAA))];
    hist.push(dist[0]);
  }

  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, r: parseR(String(c.text)) }))
    .filter((c) => c.r) as { label: string; r: R }[];
  const letterFor = (v: R) => opts.find((o) => eqR(o.r, v))?.label;
  const agrees = !problem.answer || letterFor(total) === problem.answer;
  const slips = [
    { v: hist[hops - 1], why: `stopping after ${hops - 1} hops` },
    { v: red([1, n]), why: `letting it stay put` },
  ]
    .map((s) => ({ ...s, letter: letterFor(s.v) }))
    .filter((s) => s.letter && !eqR(s.v, total));

  // the ring of sites
  const cx = 98;
  const cy = 116;
  const RR = 64;
  const site = (i: number): P => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + RR * Math.cos(a), cy + RR * Math.sin(a)];
  };
  const siteAngle = (i: number) => -90 + (i * 360) / n;

  // which real site each route step lands on: away hops must change leaf
  const leafPath = (seq: number[]) => {
    const out: number[] = [];
    let away = 0;
    for (const st of seq) {
      if (st === 0) out.push(0);
      else {
        away = (away % (n - 1)) + 1;
        out.push(away);
      }
    }
    return out;
  };

  const isFinal = step >= totalSteps - 1;
  // beat 0 = the collapse, then one beat per route, then the total
  const pre = Math.max(1, totalSteps - 1);
  const perBeat = Math.max(1, Math.ceil(routes.length / Math.max(1, pre - 1)));
  const shown = isFinal ? routes.length : step <= 0 ? 0 : Math.min(routes.length, step * perBeat);
  const active = !isFinal && shown > 0 ? routes[shown - 1] : null;
  const phase = isFinal ? 2 : active ? 1 : 0;

  const activeLeaves = active ? leafPath(active.seq) : [];
  const keys = active ? hopKeys(activeLeaves.map(site)) : null;

  const caption =
    phase === 0
      ? `the other ${n - 1} ${words} all behave the same, so only home vs away matters`
      : phase === 1 && active
      ? `${active.seq.map((s) => (s === 0 ? "H" : "A")).join("")} — ${active.probs.map(rs).join(" × ")} = ${rs(active.p)}`
      : `${routes.length} routes home, and nothing else can work`;


  // the two-state machine
  const hx = 252;
  const hy = 74;
  const ax = 330;
  const ay = 164;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        <AnimatePresence mode="wait">
          <motion.g key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {phase < 2 && (
              <>
                {/* the away sites gather under one bracket */}
                {phase === 0 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                    <circle cx={cx} cy={cy} r={RR + 22} fill="none" stroke={AMBER} strokeWidth={1.3} strokeDasharray="5 4" opacity={0.7} />
                    <rect x={cx - 40} y={cy + RR + 12} width={80} height={16} rx={4} fill="#fff" stroke={AMBER} strokeWidth={1} />
                    <text x={cx} y={cy + RR + 23} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={AMBER} fontFamily={numberFont}>
                      away: any of {n - 1}
                    </text>
                  </motion.g>
                )}

                {/* the sites themselves */}
                {Array.from({ length: n }).map((_, i) => {
                  const p = site(i);
                  const onRoute = phase === 1 && activeLeaves.includes(i);
                  return (
                    <motion.g
                      key={i}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: phase === 1 && !onRoute ? 0.3 : 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 230, damping: 16, delay: phase === 0 ? 0.1 + i * 0.12 : 0.05 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <g transform={`translate(${p[0]} ${p[1]})`}>
                        <Leaf angle={siteAngle(i)} />
                      </g>
                      {i === 0 && <circle cx={p[0]} cy={p[1]} r={19} fill="none" stroke={HOME} strokeWidth={2} />}
                    </motion.g>
                  );
                })}
                <text x={site(0)[0]} y={site(0)[1] - 24} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={HOME} fontFamily={numberFont}>
                  home
                </text>

                {/* from home, three equally likely hops */}
                {phase === 0 &&
                  Array.from({ length: n - 1 }).map((_, k) => {
                    const a = site(0);
                    const b = site(k + 1);
                    return (
                      <motion.g key={`ar${k}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 + k * 0.18 }}>
                        <path
                          d={`M ${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.16} ${(a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.16} ${b[0]} ${b[1]}`}
                          fill="none"
                          stroke={MUTE}
                          strokeWidth={1.2}
                        />
                        <text
                          x={(a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.09}
                          y={(a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.09 + 3}
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="800"
                          fill={MUTE}
                          fontFamily={numberFont}
                        >
                          1/{n - 1}
                        </text>
                      </motion.g>
                    );
                  })}

                {/* the route being walked */}
                {phase === 1 && active && (
                  <>
                    {activeLeaves.slice(0, -1).map((from, k) => {
                      const a = site(from);
                      const b = site(activeLeaves[k + 1]);
                      return (
                        <motion.path
                          key={k}
                          d={`M ${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.22} ${(a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.22} ${b[0]} ${b[1]}`}
                          fill="none"
                          stroke={MARK}
                          strokeWidth={1.6}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.55, delay: 0.3 + k * 0.6 }}
                        />
                      );
                    })}
                    {keys && (
                      <motion.g
                        initial={{ x: keys.xs[0], y: keys.ys[0] }}
                        animate={{ x: keys.xs, y: keys.ys }}
                        transition={{ duration: 0.6 * (activeLeaves.length - 1), times: keys.times, ease: "linear", delay: 0.3 }}
                      >
                        <Cricket />
                      </motion.g>
                    )}
                  </>
                )}

                {/* right panel */}
                {phase === 0 ? (
                  <>
                    <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16, delay: 2 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                      <circle cx={hx} cy={hy} r={22} fill="#cffafe" stroke={HOME} strokeWidth={1.8} />
                      <text x={hx} y={hy + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={HOME} fontFamily={numberFont}>
                        H
                      </text>
                      <circle cx={ax} cy={ay} r={22} fill="#fef3c7" stroke={AMBER} strokeWidth={1.8} />
                      <text x={ax} y={ay + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={AMBER} fontFamily={numberFont}>
                        A
                      </text>
                      <path d={`M ${hx + 16} ${hy + 15} L ${ax - 16} ${ay - 15}`} stroke={INK} strokeWidth={1.3} markerEnd="" />
                      <polygon points={`${ax - 16},${ay - 15} ${ax - 23},${ay - 15} ${ax - 17},${ay - 22}`} fill={INK} />
                      <text x={hx + 44} y={hy + 30} fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                        1
                      </text>
                      <path d={`M ${ax - 21} ${ay - 8} Q ${hx + 4} ${ay - 40} ${hx - 4} ${hy + 21}`} fill="none" stroke={HOME} strokeWidth={1.3} />
                      <polygon points={`${hx - 4},${hy + 21} ${hx - 10},${hy + 28} ${hx + 2},${hy + 28}`} fill={HOME} />
                      <text x={hx - 22} y={ay - 32} fontSize="9.5" fontWeight="800" fill={HOME} fontFamily={numberFont}>
                        {rs(pAH)}
                      </text>
                      <path d={`M ${ax - 11} ${ay + 19} A 14 14 0 1 0 ${ax + 11} ${ay + 19}`} fill="none" stroke={AMBER} strokeWidth={1.3} />
                      <polygon points={`${ax + 11},${ay + 19} ${ax + 15},${ay + 10} ${ax + 4},${ay + 12}`} fill={AMBER} />
                      <text x={ax} y={ay + 56} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={AMBER} fontFamily={numberFont}>
                        {rs(pAA)}
                      </text>
                    </motion.g>
                    <text x={W / 2 + 12} y={244} textAnchor="middle" fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                      it must move, so H → H never happens
                    </text>
                  </>
                ) : (
                  active && (
                    <>
                      {active.seq.map((st, k) => (
                        <motion.g key={k} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.3 + k * 0.6 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                          <circle cx={300} cy={42 + k * 44} r={14} fill={st === 0 ? "#cffafe" : "#fef3c7"} stroke={st === 0 ? HOME : AMBER} strokeWidth={1.6} />
                          <text x={300} y={42 + k * 44 + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={st === 0 ? HOME : AMBER} fontFamily={numberFont}>
                            {st === 0 ? "H" : "A"}
                          </text>
                        </motion.g>
                      ))}
                      {active.probs.map((pr, k) => (
                        <motion.g key={`p${k}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + k * 0.6 }}>
                          <line x1={300} y1={56 + k * 44} x2={300} y2={72 + k * 44} stroke={MUTE} strokeWidth={1.1} />
                          <text x={288} y={68 + k * 44} textAnchor="end" fontSize="9.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                            {rs(pr)}
                          </text>
                        </motion.g>
                      ))}
                      <motion.text x={300} y={272} textAnchor="middle" fontSize="13" fontWeight="800" fill={MARK} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.4 + active.probs.length * 0.6 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                        = {rs(active.p)}
                      </motion.text>
                    </>
                  )
                )}
              </>
            )}

            {/* every route, added up */}
            {phase === 2 && (
              <>
                <text x={W / 2} y={26} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={MUTE} fontFamily={numberFont}>
                  every route that comes home in {hops} hops
                </text>
                {routes.map((r, ri) => {
                  const y = 56 + ri * 62;
                  const x0 = 32;
                  const dx = Math.min(48, 280 / hops);
                  return (
                    <motion.g key={ri} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 + ri * 0.4 }}>
                      {r.seq.map((st, k) => (
                        <g key={k}>
                          {k > 0 && (
                            <>
                              <line x1={x0 + (k - 1) * dx + 13} y1={y} x2={x0 + k * dx - 13} y2={y} stroke={MUTE} strokeWidth={1.1} />
                              <text x={x0 + (k - 0.5) * dx} y={y - 8} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                                {rs(r.probs[k - 1])}
                              </text>
                            </>
                          )}
                          <circle cx={x0 + k * dx} cy={y} r={12} fill={st === 0 ? "#cffafe" : "#fef3c7"} stroke={st === 0 ? HOME : AMBER} strokeWidth={1.5} />
                          <text x={x0 + k * dx} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={st === 0 ? HOME : AMBER} fontFamily={numberFont}>
                            {st === 0 ? "H" : "A"}
                          </text>
                        </g>
                      ))}
                      <text x={x0 + hops * dx + 26} y={y + 4} fontSize="13" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                        {rs(r.p)}
                      </text>
                    </motion.g>
                  );
                })}
                <motion.text
                  x={W / 2}
                  y={202}
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="800"
                  fill={WIN}
                  fontFamily={numberFont}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.3 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  {routes.map((r) => `${(r.p[0] * commonDen) / r.p[1]}/${commonDen}`).join(" + ")} = {rs(total)}
                </motion.text>
                <motion.text x={W / 2} y={230} textAnchor="middle" fontSize="9" fontWeight="700" fill={matches ? MUTE : BAD} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                  {matches
                    ? `checked by counting: ${backCount} of the ${allCount} hop sequences end home`
                    : `the count gives ${backCount}/${allCount}, not ${rs(total)}`}
                </motion.text>
                <motion.text x={W / 2} y={252} textAnchor="middle" fontSize="9" fontWeight="700" fill={MUTE} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>
                  no other route exists — H → H is impossible
                </motion.text>
              </>
            )}
          </motion.g>
        </AnimatePresence>
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
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
            transition={{ delay: 2.5 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: matches && agrees ? MUTE : BAD, textAlign: "center", maxWidth: 380 }}
          >
            {!matches
              ? `the two routes disagree: ${rs(total)} against ${backCount}/${allCount}`
              : !agrees
              ? `this gives ${rs(total)}, not the stored answer`
              : slips.length
              ? `slips: ${slips.map((s) => `${s.why} gives ${rs(s.v)} = (${s.letter})`).join(", ")}`
              : `enumerated every route on the collapsed chain`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
