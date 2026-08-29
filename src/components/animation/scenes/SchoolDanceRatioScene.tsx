import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const BOYS = "#0d9488";
const GIRLS = "#d97706";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/**
 * Two schools with opposite boy:girl ratios combine for one dance. Since the
 * ratios really do mirror each other (5:4 and 4:5), the trap is averaging
 * the two girls-fractions directly (4/9 and 5/9) as if the schools were the
 * same size — that average is exactly 1/2, and it's sitting right there as a
 * choice. The real answer has to weight each school by its own headcount,
 * which the scene does by splitting each school's actual bar into boys and
 * girls before ever combining them.
 *
 * data: { schools: [{ name, total, boysRatio, girlsRatio }, ...] }
 */
export function SchoolDanceRatioScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const raw = Array.isArray(data.schools) ? data.schools : [];
  const schools = raw.map((s) => {
    const o = (s ?? {}) as Record<string, unknown>;
    const total = num(o.total, 0);
    const boysRatio = num(o.boysRatio, 1);
    const girlsRatio = num(o.girlsRatio, 1);
    const parts = boysRatio + girlsRatio;
    const unit = parts > 0 ? total / parts : 0;
    const girls = Math.round(unit * girlsRatio);
    const boys = total - girls;
    return { name: o.name != null ? String(o.name) : "school", total, boysRatio, girlsRatio, unit, girls, boys };
  });
  const [a, b] = schools;

  const totalGirls = schools.reduce((acc, s) => acc + s.girls, 0);
  const totalStudents = schools.reduce((acc, s) => acc + s.total, 0);
  const g = gcd(totalGirls, totalStudents) || 1;
  const probStr = `${totalGirls / g}/${totalStudents / g}`;
  const ok = probStr.replace(/\s/g, "") === (problem.shortAnswer ?? "").trim().replace(/\s/g, "");

  const trapFrac = a && b ? (a.girlsRatio / (a.boysRatio + a.girlsRatio) + b.girlsRatio / (b.boysRatio + b.girlsRatio)) / 2 : 0;
  const trapNum = Math.round(trapFrac * 2);
  const trapDen = 2;
  const tg = gcd(trapNum, trapDen) || 1;
  const trapStr = `${trapNum / tg}/${trapDen / tg}`;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).replace(/\s/g, "") === trapStr && String(c.label) !== problem.answer);

  // ---- beats: 0 setup, 1 school A, 2 school B, 3 the trap, 4 combine, 5 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  // ---- geometry ----
  const W = 380;
  const H = 300;
  const baseY = 220;
  const barW = 70;
  const scale = 140 / Math.max(a?.total ?? 1, b?.total ?? 1, 1);
  const posX = [90, 250];

  const caption =
    beat === 0
      ? schools.map((s) => `${s.name}: ${s.total}, ${s.boysRatio}:${s.girlsRatio}`).join("  ")
      : beat === 1
      ? `${a?.name}: ${a?.total}/${(a?.boysRatio ?? 0) + (a?.girlsRatio ?? 0)}=${a?.unit} per part → ${a?.girls} girls`
      : beat === 2
      ? `${b?.name}: ${b?.total}/${(b?.boysRatio ?? 0) + (b?.girlsRatio ?? 0)}=${b?.unit} per part → ${b?.girls} girls`
      : beat === 3
      ? `averaging ${a?.girlsRatio}/${(a?.boysRatio ?? 0) + (a?.girlsRatio ?? 0)} and ${b?.girlsRatio}/${(b?.boysRatio ?? 0) + (b?.girlsRatio ?? 0)} gives ${trapStr}`
      : beat === 4
      ? `${a?.girls}+${b?.girls}=${totalGirls} girls of ${a?.total}+${b?.total}=${totalStudents} students`
      : `${totalGirls}/${totalStudents} = ${probStr}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        {beat <= 3 &&
          schools.map((s, i) => {
            const h = s.total * scale;
            const girlsH = s.girls * scale;
            const showSplit = beat >= i + 1;
            return (
              <g key={s.name}>
                <rect x={posX[i]} y={baseY - h} width={barW} height={h} fill="#f1f5f9" stroke={INK} strokeWidth={1.4} />
                {showSplit && (
                  <>
                    <motion.rect
                      x={posX[i]}
                      width={barW}
                      fill={GIRLS}
                      fillOpacity={0.75}
                      initial={{ y: baseY, height: 0 }}
                      animate={{ y: baseY - girlsH, height: girlsH }}
                      transition={{ type: "spring", stiffness: 180, damping: 18 }}
                    />
                    <motion.rect
                      x={posX[i]}
                      width={barW}
                      fill={BOYS}
                      fillOpacity={0.75}
                      initial={{ y: baseY - girlsH, height: 0 }}
                      animate={{ y: baseY - h, height: h - girlsH }}
                      transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.15 }}
                    />
                  </>
                )}
                <text x={posX[i] + barW / 2} y={baseY + 16} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK} fontFamily={FONT}>
                  {s.name}
                </text>
                <text x={posX[i] + barW / 2} y={baseY - h - 8} textAnchor="middle" fontSize="9" fontWeight="700" fill={DIM} fontFamily={FONT}>
                  {s.total}, {s.boysRatio}:{s.girlsRatio}
                </text>
                {showSplit && (
                  <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} x={posX[i] + barW / 2} y={baseY - girlsH / 2 + 4} textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily={FONT}>
                    {s.girls}
                  </motion.text>
                )}
              </g>
            );
          })}

        {/* beat 3: naive averaging of the two girls-fractions */}
        {beat === 3 && (
          <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.4 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={W / 2 - 96} y={40} width={192} height={30} rx={9} fill="#fee2e2" stroke={BAD} strokeWidth={1.6} />
            <text x={W / 2} y={60} textAnchor="middle" fontSize="11" fontWeight="800" fill={BAD} fontFamily={FONT}>
              ({a?.girlsRatio}/{(a?.boysRatio ?? 0) + (a?.girlsRatio ?? 0)} + {b?.girlsRatio}/{(b?.boysRatio ?? 0) + (b?.girlsRatio ?? 0)}) / 2 = {trapStr}
            </text>
          </motion.g>
        )}

        {/* beats 4-5: the combined bar */}
        {beat >= 4 &&
          (() => {
            const barX = 40;
            const barWFull = 300;
            const barY = 130;
            const barH = 34;
            const px = (v: number) => (v / totalStudents) * barWFull;
            return (
              <g>
                <rect x={barX} y={barY} width={barWFull} height={barH} rx={6} fill="#f1f5f9" stroke={INK} strokeWidth={1.4} />
                <motion.rect x={barX} y={barY} height={barH} fill={GIRLS} fillOpacity={0.75} initial={{ width: 0 }} animate={{ width: px(totalGirls) }} transition={{ type: "spring", stiffness: 150, damping: 18 }} />
                <motion.rect x={barX + px(totalGirls)} y={barY} height={barH} fill={BOYS} fillOpacity={0.75} initial={{ width: 0 }} animate={{ width: px(totalStudents - totalGirls) }} transition={{ type: "spring", stiffness: 150, damping: 18, delay: 0.15 }} />
                <text x={barX + px(totalGirls) / 2} y={barY + barH / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily={FONT}>
                  {totalGirls} girls
                </text>
                <text x={barX + px(totalGirls) + px(totalStudents - totalGirls) / 2} y={barY + barH / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily={FONT}>
                  {totalStudents - totalGirls} boys
                </text>
                {beat === 5 && (
                  <motion.text initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.5 }} x={W / 2} y={barY + barH + 34} textAnchor="middle" fontSize="15" fontWeight="800" fill={WIN} fontFamily={FONT} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    {probStr}
                  </motion.text>
                )}
              </g>
            );
          })()}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : beat === 3 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 3 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 3 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 3 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 280 }}>
            {trapChoice ? `choice ${trapChoice.label} (${trapStr}) ignores that the schools are different sizes` : `the schools have different sizes, so a plain average is wrong`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${probStr} but stored answer reads "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
