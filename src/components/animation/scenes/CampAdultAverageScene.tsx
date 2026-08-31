import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const GIRLS = "#4f46e5";
const BOYS = "#d97706";
const ADULTS = "#0d9488";

/**
 * A camp roster becomes an age ledger: first the whole-camp total, then the
 * two known group totals, then the adults' remainder, and finally five equal
 * adult shares. Data: { totalCount, totalAverage, knownGroups:
 * ["label|count|average", ...], adultCount }.
 */
export function CampAdultAverageScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const totalCount = Number(data.totalCount);
  const totalAverage = Number(data.totalAverage);
  const adultCount = Number(data.adultCount);
  const groups = (data.knownGroups as string[]).map((raw) => {
    const [label, count, average] = raw.split("|");
    return { label, count: Number(count), average: Number(average) };
  });
  const totalAge = totalCount * totalAverage;
  const groupTotals = groups.map((group) => group.count * group.average);
  const adultTotal = totalAge - groupTotals.reduce((sum, value) => sum + value, 0);
  const adultAverage = adultTotal / adultCount;
  const phase = step >= totalSteps - 1 ? 3 : Math.min(step, 2);
  const colors = [GIRLS, BOYS];
  const captions = [
    `${totalCount} campers × ${totalAverage} years = ${totalAge} total years`,
    `${groups[0].label}: ${groups[0].count} × ${groups[0].average} = ${groupTotals[0]}  •  ${groups[1].label}: ${groups[1].count} × ${groups[1].average} = ${groupTotals[1]}`,
    `${totalAge} − ${groupTotals[0]} − ${groupTotals[1]} = ${adultTotal} years for the adults`,
    `${adultTotal} ÷ ${adultCount} = ${adultAverage} years per adult`,
  ];

  const PersonDots = ({ count, x, y, color }: { count: number; x: number; y: number; color: string }) => (
    <g>
      {Array.from({ length: count }).map((_, i) => (
        <motion.circle
          key={i}
          cx={x + (i % 10) * 7}
          cy={y + Math.floor(i / 10) * 8}
          r="2.5"
          fill={color}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.82, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: i * 0.025 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "6px 4px" }}>
      <svg viewBox="0 0 400 270" width="100%" style={{ maxWidth: 420 }}>
        <text x="200" y="18" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={FONT}>
          CAMP AGE LEDGER
        </text>

        {phase === 0 && (
          <g>
            {[
              { ...groups[0], color: GIRLS },
              { ...groups[1], color: BOYS },
              { label: "Adults", count: adultCount, average: "?", color: ADULTS },
            ].map((group, i) => {
              const x = 24 + i * 126;
              return (
                <motion.g key={group.label} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.14 }}>
                  <rect x={x} y="36" width="110" height="104" rx="12" fill={`${group.color}10`} stroke={group.color} strokeWidth="1.6" />
                  <text x={x + 55} y="57" textAnchor="middle" fontSize="12" fontWeight="800" fill={group.color} fontFamily={FONT}>{group.label}</text>
                  <PersonDots count={group.count} x={x + 22} y={70} color={group.color} />
                  <text x={x + 55} y="128" textAnchor="middle" fontSize="10" fontWeight="700" fill={INK} fontFamily={FONT}>{group.count} campers</text>
                </motion.g>
              );
            })}
            <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: 0.55 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x="91" y="170" width="218" height="58" rx="14" fill="#eef2ff" stroke={GIRLS} strokeWidth="2" />
              <text x="200" y="190" textAnchor="middle" fontSize="10" fontWeight="700" fill={INK} fontFamily={FONT}>WHOLE CAMP</text>
              <text x="200" y="214" textAnchor="middle" fontSize="20" fontWeight="900" fill={GIRLS} fontFamily={FONT}>{totalCount} × {totalAverage} = {totalAge}</text>
            </motion.g>
          </g>
        )}

        {phase === 1 && (
          <g>
            {groups.map((group, i) => {
              const x = 32 + i * 184;
              return (
                <motion.g key={group.label} initial={{ opacity: 0, x: i ? 18 : -18 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 210, damping: 17 }}>
                  <rect x={x} y="42" width="152" height="122" rx="14" fill={`${colors[i]}10`} stroke={colors[i]} strokeWidth="2" />
                  <text x={x + 76} y="66" textAnchor="middle" fontSize="13" fontWeight="800" fill={colors[i]} fontFamily={FONT}>{group.label}</text>
                  <PersonDots count={group.count} x={x + 42} y={80} color={colors[i]} />
                  <text x={x + 76} y="144" textAnchor="middle" fontSize="17" fontWeight="900" fill={colors[i]} fontFamily={FONT}>{group.count} × {group.average} = {groupTotals[i]}</text>
                </motion.g>
              );
            })}
            <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <rect x="124" y="190" width="152" height="42" rx="12" fill="#f0fdfa" stroke={ADULTS} strokeDasharray="5 4" strokeWidth="1.8" />
              <text x="200" y="216" textAnchor="middle" fontSize="13" fontWeight="800" fill={ADULTS} fontFamily={FONT}>{adultCount} adults: total ?</text>
            </motion.g>
          </g>
        )}

        {phase === 2 && (
          <g>
            <text x="200" y="42" textAnchor="middle" fontSize="11" fontWeight="700" fill={INK} fontFamily={FONT}>the {totalAge}-year camp total</text>
            <rect x="30" y="58" width="340" height="54" rx="10" fill="#fff" stroke={INK} strokeWidth="1.7" />
            {[groupTotals[0], groupTotals[1], adultTotal].map((value, i) => {
              const starts = [30, 30 + (340 * groupTotals[0]) / totalAge, 30 + (340 * (groupTotals[0] + groupTotals[1])) / totalAge];
              const width = (340 * value) / totalAge;
              const color = [GIRLS, BOYS, ADULTS][i];
              return <motion.rect key={i} x={starts[i]} y="58" width={width} height="54" rx={i === 2 ? 9 : 0} fill={color} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: i * 0.18 }} style={{ transformBox: "fill-box", transformOrigin: "left" }} />;
            })}
            <text x="105" y="91" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" fontFamily={FONT}>{groupTotals[0]}</text>
            <text x="240" y="91" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" fontFamily={FONT}>{groupTotals[1]}</text>
            <text x="335" y="91" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" fontFamily={FONT}>{adultTotal}</text>
            {groups.map((group, i) => (
              <motion.g key={group.label} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 + i * 0.18 }}>
                <path d={`M ${i ? 240 : 105} 118 L ${i ? 240 : 105} 150`} stroke={colors[i]} strokeWidth="2" markerEnd="url(#arrow)" />
                <rect x={i ? 180 : 45} y="158" width="120" height="40" rx="10" fill={`${colors[i]}10`} stroke={colors[i]} />
                <text x={i ? 240 : 105} y="183" textAnchor="middle" fontSize="12" fontWeight="800" fill={colors[i]} fontFamily={FONT}>remove {groupTotals[i]}</text>
              </motion.g>
            ))}
            <defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill={INK} /></marker></defs>
            <motion.text x="335" y="139" textAnchor="middle" fontSize="11" fontWeight="800" fill={ADULTS} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}>ADULTS LEFT</motion.text>
            <motion.text x="200" y="237" textAnchor="middle" fontSize="18" fontWeight="900" fill={ADULTS} fontFamily={FONT} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: 1.05 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>{totalAge} − {groupTotals[0]} − {groupTotals[1]} = {adultTotal}</motion.text>
          </g>
        )}

        {phase === 3 && (
          <g>
            <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x="145" y="36" width="110" height="48" rx="12" fill="#ccfbf1" stroke={ADULTS} strokeWidth="2" />
              <text x="200" y="57" textAnchor="middle" fontSize="10" fontWeight="800" fill={ADULTS} fontFamily={FONT}>ADULT TOTAL</text>
              <text x="200" y="75" textAnchor="middle" fontSize="18" fontWeight="900" fill={ADULTS} fontFamily={FONT}>{adultTotal}</text>
            </motion.g>
            {Array.from({ length: adultCount }).map((_, i) => {
              const x = 22 + i * 74;
              return (
                <motion.g key={i} initial={{ opacity: 0, y: -22, scale: 0.7 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.18 + i * 0.11 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <line x1="200" y1="87" x2={x + 30} y2="130" stroke="#99f6e4" strokeWidth="2" />
                  <circle cx={x + 30} cy="151" r="28" fill="#f0fdfa" stroke={ADULTS} strokeWidth="2" />
                  <circle cx={x + 30} cy="140" r="5" fill={ADULTS} />
                  <path d={`M ${x + 20} 160 Q ${x + 30} 150 ${x + 40} 160`} fill="none" stroke={ADULTS} strokeWidth="3" strokeLinecap="round" />
                  <text x={x + 30} y="194" textAnchor="middle" fontSize="13" fontWeight="900" fill={ADULTS} fontFamily={FONT}>{adultAverage}</text>
                </motion.g>
              );
            })}
            <motion.text x="200" y="229" textAnchor="middle" fontSize="20" fontWeight="900" fill={ADULTS} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}>{adultTotal} ÷ {adultCount} = {adultAverage}</motion.text>
            <SvgAnswerBadge show answer={answerOf(problem)} cx={200} y={239} width={100} />
          </g>
        )}
      </svg>

      <AnimatePresence mode="wait">
        <motion.div key={phase} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ maxWidth: 390, textAlign: "center", padding: "5px 12px", borderRadius: 999, background: phase === 3 ? "#dcfce7" : "#eef2ff", border: `1px solid ${phase === 3 ? "#bbf7d0" : "#c7d2fe"}`, color: phase === 3 ? "#166534" : INK, font: `800 11.5px ${FONT}` }}>
          {captions[phase]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
