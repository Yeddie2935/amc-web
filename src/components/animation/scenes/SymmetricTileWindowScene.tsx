import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";
const DARK = "#94a3b8";
const LIGHT = "#f8fafc";

function CountGrid({ x, y, size, reveal }: { x: number; y: number; size: number; reveal: boolean }) {
  const cell = size / 3;
  const dark = new Set([1, 3, 5, 7]);
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const isDark = dark.has(i);
        return (
          <motion.g key={i} initial={{ opacity: 0, scale: 0.45 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07, type: "spring", stiffness: 220, damping: 17 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={x + col * cell} y={y + row * cell} width={cell} height={cell} fill={isDark ? DARK : LIGHT} stroke={INK} strokeWidth="1.3" />
            {reveal && isDark && <motion.text x={x + (col + 0.5) * cell} y={y + (row + 0.5) * cell + 5} textAnchor="middle" fontSize="13" fontWeight="950" fill="#fff" fontFamily={FONT} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.65 + i * 0.05, type: "spring" }}>✓</motion.text>}
          </motion.g>
        );
      })}
    </g>
  );
}

/** Locate a 6×6 repeat in the supplied corner, fold to a symmetric 3×3 count window, and count its four dark tiles. */
export function SymmetricTileWindowScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const imagePath = String(data.imagePath ?? "");
  const repeatSize = Math.round(num(data.repeatSize, 6));
  const sampleSize = Math.round(num(data.sampleSize, 3));
  const darkCount = Math.round(num(data.darkCount, 4));
  const tileCount = sampleSize * sampleSize;
  const fraction = `${darkCount}/${tileCount}`;
  const choice = (problem.choices ?? []).find((c) => c.text.trim() === fraction)?.label;
  const valid = fraction === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 470 315" width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="A six by six floor repeat folds into a three by three counting window with four dark tiles">
        <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "find one 6 × 6 repeat in the supplied floor corner" : phase === 1 ? "four symmetric 3 × 3 quarters have the same dark fraction" : "count one 3 × 3 window"}
        </text>

        {phase === 0 && (
          <>
            <image href={imagePath} x="66" y="28" width="300" height="300" preserveAspectRatio="xMidYMid meet" />
            <motion.rect x="78" y="39" width="153" height="153" fill="none" stroke={IND} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <rect x="80" y="42" width="78" height="20" rx="10" fill="#fff" stroke={IND} />
            <text x="119" y="56" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={IND} fontFamily={FONT}>{repeatSize} × {repeatSize} repeat</text>
          </>
        )}

        {phase === 1 && (
          <>
            <image href={imagePath} x="20" y="44" width="205" height="205" opacity="0.32" preserveAspectRatio="xMidYMid meet" />
            <rect x="28" y="52" width="105" height="105" fill="none" stroke={IND} strokeWidth="2" />
            <line x1="80.5" y1="52" x2="80.5" y2="157" stroke={IND} strokeWidth="1.6" strokeDasharray="4 3" />
            <line x1="28" y1="104.5" x2="133" y2="104.5" stroke={IND} strokeWidth="1.6" strokeDasharray="4 3" />
            {[[54, 78], [107, 78], [54, 131], [107, 131]].map(([x, y], i) => (
              <motion.path key={i} d={`M ${x} ${y} Q 210 118 278 126`} fill="none" stroke={IND} strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.12 }} />
            ))}
            <CountGrid x={286} y={64} size={126} reveal={false} />
            <text x="349" y="208" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{sampleSize} × {sampleSize} representative window</text>
            <text x="235" y="267" textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM}>Folding by the horizontal and vertical symmetry preserves the dark fraction.</text>
          </>
        )}

        <AnimatePresence>
          {phase === 2 && (
            <motion.g key="count" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <CountGrid x={64} y={48} size={189} reveal />
              <g transform="translate(286 59)">
                <text x="67" y="4" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>TILE TALLY</text>
                {Array.from({ length: darkCount }, (_, i) => <motion.rect key={`d${i}`} x={8 + i * 29} y="20" width="24" height="24" rx="4" fill={DARK} stroke={INK} initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} />)}
                <text x="67" y="62" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>{darkCount} dark</text>
                {Array.from({ length: tileCount - darkCount }, (_, i) => <motion.rect key={`l${i}`} x={i < 4 ? 8 + i * 29 : 51} y={i < 4 ? 77 : 106} width="24" height="24" rx="4" fill={LIGHT} stroke={INK} initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + i * 0.08 }} />)}
                <text x="67" y="148" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>{tileCount - darkCount} light</text>
              </g>
              <text x="235" y="264" textAnchor="middle" fontSize="18" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>{darkCount} dark ÷ {tileCount} total = {fraction}</text>
              <text x="200" y="284" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? "4 + 5 = 9 tiles • fraction and choice verified" : `check failed: computed ${fraction}, stored ${problem.shortAnswer}`}</text>
              <SvgAnswerBadge show={valid} answer={problem.answer} cx={420} y={276} width={72} />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
