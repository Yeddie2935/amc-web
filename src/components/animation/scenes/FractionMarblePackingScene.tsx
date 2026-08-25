import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const BLUE = "#2563eb";
const RED = "#dc2626";
const GREEN = "#16a34a";
const YELLOW = "#eab308";
const INDIGO = "#4338ca";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const lcm = (a: number, b: number) => Math.abs(a * b) / (gcd(a, b) || 1);

/** Pack fractional color shares into the smallest feasible whole-number tray. */
export function FractionMarblePackingScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const blueDen = Math.round(num(data.blueDen, 3));
  const redDen = Math.round(num(data.redDen, 4));
  const greenCount = Math.round(num(data.greenCount, 6));
  const base = lcm(blueDen, redDen);

  const countsFor = (total: number) => {
    const blue = total / blueDen;
    const red = total / redDen;
    const left = total - blue - red;
    return { total, blue, red, left, yellow: left - greenCount };
  };
  const trials = Array.from({ length: 6 }, (_, i) => countsFor(base * (i + 1)));
  const winner = trials.find((trial) => Number.isInteger(trial.blue) && Number.isInteger(trial.red) && trial.yellow >= 0) ?? null;
  const first = trials[0];
  const yellow = winner?.yellow ?? -1;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d-]/g, ""));
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === yellow)?.label;
  const ok = base > 0 && winner != null && winner.total === base * 2 && yellow === stored && choice === problem.answer &&
    winner.blue + winner.red + greenCount + yellow === winner.total;
  const failure = winner == null
    ? "no feasible tray was found"
    : winner.total !== base * 2
      ? `the first feasible total is ${winner.total}, not ${base * 2}`
      : yellow !== stored
        ? `computed ${yellow} yellow, stored answer ${problem.shortAnswer}`
        : "the color counts do not rebuild the total";

  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const Marble = ({ cx, cy, color, delay = 0, spill = false }: { cx: number; cy: number; color: string; delay?: number; spill?: boolean }) => (
    <motion.g initial={{ opacity: 0, y: spill ? -34 : -12, scale: 0.5 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 190, damping: 15, delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <circle cx={cx} cy={cy} r="11" fill={color} stroke={INK} strokeWidth="1" />
      <circle cx={cx - 3.5} cy={cy - 3.5} r="3" fill="#fff" opacity="0.65" />
    </motion.g>
  );
  const Tray = ({ total, x, y, cols, cell, showColors, spillGreen = false }: { total: number; x: number; y: number; cols: number; cell: number; showColors: boolean; spillGreen?: boolean }) => {
    const c = countsFor(total);
    const colorAt = (i: number) => i < c.blue ? BLUE : i < c.blue + c.red ? RED : i < c.blue + c.red + greenCount ? GREEN : YELLOW;
    return <g>
      <rect x={x - 8} y={y - 8} width={cols * cell + 16} height={Math.ceil(total / cols) * cell + 16} rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      {Array.from({ length: total }, (_, i) => {
        const cx = x + (i % cols) * cell + cell / 2;
        const cy = y + Math.floor(i / cols) * cell + cell / 2;
        return showColors
          ? <Marble key={i} cx={cx} cy={cy} color={colorAt(i)} delay={0.06 + i * 0.025} />
          : <motion.circle key={i} cx={cx} cy={cy} r="10" fill="#eef2ff" stroke="#a5b4fc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.035 }} />;
      })}
      {spillGreen && <Marble cx={x + cols * cell + 34} cy={y + cell * 1.5} color={GREEN} delay={0.9} spill />}
    </g>;
  };

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "100%", maxWidth: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 260" style={{ width: "100%", maxWidth: 480, minWidth: 0, display: "block" }}>
      {phase === 0 && <g>
        <text x="230" y="19" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>thirds and fourths must both make whole marbles</text>
        <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 190, damping: 16 }}>
          <rect x="38" y="43" width="164" height="46" rx="10" fill="#eff6ff" stroke={BLUE} strokeWidth="2" />
          {[0, 1, 2].map((i) => <rect key={i} x={42 + i * 52} y="47" width="48" height="38" rx="6" fill={i === 0 ? BLUE : "#dbeafe"} />)}
          <text x="120" y="108" textAnchor="middle" fontSize="12" fontWeight="900" fill={BLUE} fontFamily={mono}>1 / {blueDen} blue</text>
        </motion.g>
        <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 190, damping: 16, delay: 0.18 }}>
          <rect x="258" y="43" width="164" height="46" rx="10" fill="#fef2f2" stroke={RED} strokeWidth="2" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={262 + i * 39} y="47" width="35" height="38" rx="5" fill={i === 0 ? RED : "#fee2e2"} />)}
          <text x="340" y="108" textAnchor="middle" fontSize="12" fontWeight="900" fill={RED} fontFamily={mono}>1 / {redDen} red</text>
        </motion.g>
        <motion.path d="M 120 125 Q 175 155 230 178 M 340 125 Q 285 155 230 178" fill="none" stroke="#a5b4fc" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.55 }} />
        <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x="139" y="174" width="182" height="44" rx="12" fill="#eef2ff" stroke={INDIGO} strokeWidth="2" />
          <text x="230" y="201" textAnchor="middle" fontSize="18" fontWeight="900" fill={INDIGO} fontFamily={mono}>LCM({blueDen}, {redDen}) = {base}</text>
        </motion.g>
        <text x="230" y="242" textAnchor="middle" fontSize="11" fontWeight="800" fill="#64748b" fontFamily={mono}>possible totals: {base}, {base * 2}, {base * 3}, …</text>
      </g>}

      {phase === 1 && <g>
        <text x="230" y="19" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>try the smallest possible tray: {first.total} marbles</text>
        <Tray total={first.total} x={82} y={48} cols={4} cell={31} showColors spillGreen />
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          <text x="300" y="70" fontSize="12" fontWeight="900" fill={BLUE} fontFamily={mono}>{first.blue} blue</text>
          <text x="300" y="94" fontSize="12" fontWeight="900" fill={RED} fontFamily={mono}>+ {first.red} red</text>
          <line x1="294" y1="104" x2="382" y2="104" stroke={INK} strokeWidth="1.5" />
          <text x="300" y="124" fontSize="12" fontWeight="900" fill={INK} fontFamily={mono}>{first.left} spaces left</text>
        </motion.g>
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }}>
          <rect x="79" y="189" width="302" height="43" rx="12" fill="#fef2f2" stroke="#fecaca" />
          <text x="230" y="208" textAnchor="middle" fontSize="12" fontWeight="900" fill={RED} fontFamily={mono}>{first.left} spaces cannot hold {greenCount} green marbles</text>
          <text x="230" y="224" textAnchor="middle" fontSize="10" fontWeight="800" fill={RED}>one green marble spills outside the tray</text>
        </motion.g>
      </g>}

      {phase === 2 && winner && <g>
        <text x="230" y="17" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>the next possible tray has {winner.total} spaces</text>
        <Tray total={winner.total} x={50} y={34} cols={8} cell={28} showColors />
        <g fontFamily={mono} fontSize="11" fontWeight="900">
          <text x="65" y="140" fill={BLUE}>{winner.blue} blue</text>
          <text x="160" y="140" fill={RED}>{winner.red} red</text>
          <text x="250" y="140" fill={GREEN}>{greenCount} green</text>
          <text x="353" y="140" fill="#a16207">{yellow} yellow</text>
        </g>
        <motion.path d="M 347 150 C 347 175 310 183 292 183" fill="none" stroke={YELLOW} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.9 }} />
        <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x="128" y="174" width="204" height="42" rx="12" fill="#fefce8" stroke={YELLOW} strokeWidth="2" />
          <text x="230" y="200" textAnchor="middle" fontSize="17" fontWeight="900" fill="#a16207" fontFamily={mono}>{winner.left} − {greenCount} = {yellow} yellow</text>
        </motion.g>
        <text x="230" y="232" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={mono}>{ok ? `${winner.blue} + ${winner.red} + ${greenCount} + ${yellow} = ${winner.total}` : failure}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={235} width={88} />
      </g>}
    </svg>
    <AnimatePresence>{final && !ok && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: RED, fontFamily: mono, fontSize: 11, fontWeight: 800 }}>{failure}</motion.div>}</AnimatePresence>
  </div>;
}
