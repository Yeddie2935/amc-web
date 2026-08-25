import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

type Sign = "+" | "−";

const above = (a: Sign, b: Sign): Sign => a === b ? "+" : "−";

function pyramid(bottom: Sign[]): Sign[][] {
  const rows = [bottom];
  while (rows[rows.length - 1].length > 1) {
    const prev = rows[rows.length - 1];
    rows.push(prev.slice(0, -1).map((v, i) => above(v, prev[i + 1])));
  }
  return rows;
}

function allRows(count: number): Sign[][] {
  return Array.from({ length: 2 ** count }, (_, mask) =>
    Array.from({ length: count }, (__, i) => mask & (1 << (count - 1 - i)) ? "−" : "+") as Sign[]
  );
}

/**
 * The official four-level sign pyramid builds upward from the supplied example,
 * then all 16 bottom rows are evaluated. Flipping the first bottom sign toggles
 * the top, pairing every plus-top row with one minus-top row. Data:
 * { bottomCount: 4, example: ["+", "−", "+", "−"] }.
 */
export function SignPyramidSweepScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const count = Number(data.bottomCount ?? 4);
  const rawExample = Array.isArray(data.example) ? data.example.map(String) : ["+", "−", "+", "−"];
  const example = rawExample.map((s) => s === "+" ? "+" : "−") as Sign[];
  const rows = allRows(count);
  const evaluated = rows.map((bottom) => ({ bottom, top: pyramid(bottom).at(-1)?.[0] ?? "−" }));
  const winners = evaluated.filter((r) => r.top === "+");
  const losers = evaluated.filter((r) => r.top === "−");
  const paired = winners.every((win) => {
    const flipped: Sign[] = [win.bottom[0] === "+" ? "−" : "+", ...win.bottom.slice(1)];
    return pyramid(flipped).at(-1)?.[0] === "−";
  });
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d]/g, ""));
  const ok = winners.length === losers.length && paired && (!Number.isFinite(stored) || stored === winners.length);
  const isFinal = step >= totalSteps - 1;
  const W = 460;

  const Tile = ({ x, y, sign, size = 38, face = true }: { x: number; y: number; sign: Sign; size?: number; face?: boolean }) => {
    const color = sign === "+" ? WIN : BAD;
    return (
      <g>
        <rect x={x} y={y} width={size} height={size * 0.72} rx={Math.min(6, size * 0.14)} fill={color} fillOpacity="0.12" stroke={color} strokeWidth={Math.max(1, size * 0.04)} />
        <text x={x + size / 2} y={y + size * 0.49} textAnchor="middle" fontSize={size * 0.42} fontWeight="900" fill={color} fontFamily={FONT}>{sign}</text>
        {face && size >= 30 && (
          <>
            <circle cx={x + size * 0.28} cy={y + size * 0.18} r="1.1" fill={INK} />
            <circle cx={x + size * 0.72} cy={y + size * 0.18} r="1.1" fill={INK} />
          </>
        )}
      </g>
    );
  };

  const MiniPattern = ({ bottom, top, x, y, index }: { bottom: Sign[]; top: Sign; x: number; y: number; index: number }) => (
    <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 17, delay: index * 0.045 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <rect x={x} y={y} width="96" height="39" rx="7" fill={top === "+" ? "#f0fdf4" : "#fef2f2"} stroke={top === "+" ? "#86efac" : "#fecaca"} />
      {bottom.map((s, i) => <Tile key={i} x={x + 5 + i * 18} y={y + 13} sign={s} size={16} face={false} />)}
      <circle cx={x + 84} cy={y + 19.5} r="9" fill={top === "+" ? WIN : BAD} />
      <text x={x + 84} y={y + 24} textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff" fontFamily={FONT}>{top}</text>
    </motion.g>
  );

  const built = pyramid(example);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} 270`} width="100%" style={{ maxWidth: 470 }}>
        <text x={W / 2} y="18" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>
          {step === 0 ? "same makes +, different makes −" : isFinal ? "flip the first sign: every winner gets a losing partner" : "test every possible bottom row"}
        </text>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.g key="build" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {built.map((row, level) => {
                const size = 48;
                const gap = 5;
                const totalW = row.length * size + (row.length - 1) * gap;
                const y = 205 - level * 48;
                return row.map((sign, i) => (
                  <motion.g key={`${level}-${i}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 210, damping: 16, delay: level * 0.45 + i * 0.07 }}>
                    <Tile x={(W - totalW) / 2 + i * (size + gap)} y={y} sign={sign} size={size} />
                  </motion.g>
                ));
              })}
              <motion.text x={W / 2} y="257" textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                the official + − + − example climbs to +
              </motion.text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g key="sweep" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {evaluated.map((r, i) => <MiniPattern key={i} bottom={r.bottom} top={r.top} x={18 + (i % 4) * 108} y={42 + Math.floor(i / 4) * 47} index={i} />)}
              <motion.text x={W / 2} y="249" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                {winners.length} top +   ·   {losers.length} top −
              </motion.text>
            </motion.g>
          )}

          {isFinal && (
            <motion.g key="pair" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x="202" y="56" fontSize="27">🦉</text>
              <text x={W / 2} y="75" textAnchor="middle" fontSize="10" fontWeight="800" fill={IND}>sign sorter</text>
              <text x="82" y="57" textAnchor="middle" fontSize="12" fontWeight="900" fill={WIN}>TOP +</text>
              <text x="378" y="57" textAnchor="middle" fontSize="12" fontWeight="900" fill={BAD}>TOP −</text>
              {winners.map((win, i) => {
                const other: Sign[] = [win.bottom[0] === "+" ? "−" : "+", ...win.bottom.slice(1)];
                const y = 83 + i * 20;
                return (
                  <g key={i}>
                    {win.bottom.map((s, j) => <Tile key={`w${j}`} x={43 + j * 18} y={y} sign={s} size={16} face={false} />)}
                    <motion.path d={`M 124 ${y + 6} C 175 ${y + 6}, 285 ${y + 6}, 336 ${y + 6}`} fill="none" stroke={i % 2 ? "#cbd5e1" : IND} strokeWidth="1.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.08, duration: 0.45 }} />
                    {other.map((s, j) => <Tile key={`l${j}`} x={345 + j * 18} y={y} sign={s} size={16} face={false} />)}
                  </g>
                );
              })}
              <text x={W / 2} y="245" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>16 ÷ 2 = {winners.length}</text>
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.75 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <rect x="181" y="248" width="98" height="22" rx="11" fill={ok ? WIN : BAD} />
                <text x={W / 2} y="263" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#fff">Answer {ok ? problem.answer : "check data"}</text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
