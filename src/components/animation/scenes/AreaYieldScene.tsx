import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const SOIL = "#c9a227";
const LEAF = "#15803d";

const W = 520;
const H = 286;

type Rate = { factor: number; name: string; icon: string; color: string };

/**
 * A rectangle's **area** carried through a chain of per-unit rates — so many
 * plants in every square foot, so many berries on every plant. The arithmetic is
 * three multiplications, and the entire difficulty is the very first one: the
 * rates are per unit of *area*, so the garden has to be measured by the squares
 * inside it and not by the distance around it. The scene therefore draws the plot
 * as a real grid of unit squares that fill in one at a time, puts the plants
 * literally inside a square, and closes by tracing the **perimeter in red** beside
 * the interior — because on this problem both "distance around" readings are
 * answer choices (6 + 8 lands on A, 2(6 + 8) lands on C), and the scene finds them
 * by re-running the same rate chain off the wrong measurement and matching each
 * result against `problem.choices`.
 *
 * An inset square foot carries whichever rate the current beat is about: the
 * seedlings sprout in it, then one plant is magnified with its berries popping out
 * around it, which is what keeps the picture honest once the counts (192, 1920)
 * are far too large to draw. The garden's dots are the *plants* throughout —
 * count-accurate at 4 per square — and later rates recolour them rather than
 * pretending to draw 1,920 berries.
 *
 * Area, every running total, the rate product per square and both slips are
 * computed; data
 * `{ width, length, unit?, areaUnit?, areaUnitOne?, icon?,
 *    rates: ["4|plants|🌱", "10|strawberries|🍓"] }` — `areaUnitOne` spells the
 * singular out, since "square feet" cannot be de-pluralised by rule.
 */
export function AreaYieldScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const width = Math.max(1, Math.round(num(data.width, 1)));
  const length = Math.max(1, Math.round(num(data.length, 1)));
  const unit = String(data.unit ?? "ft");
  const areaUnit = String(data.areaUnit ?? `square ${unit}`);
  const areaUnitOne = String(data.areaUnitOne ?? areaUnit.replace(/s$/, ""));
  const icon = String(data.icon ?? "🧑‍🌾");
  const TINT = [LEAF, "#dc2626", "#7c3aed"];
  const rates: Rate[] = (Array.isArray(data.rates) ? data.rates : []).map((raw, i) => {
    const [factor, name, ic, color] = String(raw).split("|");
    return {
      factor: Math.max(1, Math.round(num(factor, 1))),
      name: name ?? "",
      icon: ic ?? "",
      color: color && color.trim() ? color : TINT[i % TINT.length],
    };
  });
  const k = rates.length;

  // ---- area first, then one multiplication per rate ----
  const area = width * length;
  const running: number[] = [];
  rates.forEach((r, i) => {
    running[i] = (i === 0 ? area : running[i - 1]) * r.factor;
  });
  const goal = running[k - 1] ?? area;
  const perSquare = rates.reduce((p, r) => p * r.factor, 1);

  // ---- the same chain run off the distance around instead of the area ----
  const choiceFor = (value: number) => {
    const hit = (problem.choices ?? []).find((c) => {
      const v = Number(
        String(c.text)
          .replace(/[−–—]/g, "-")
          .replace(/[^\d.-]/g, "")
      );
      return Number.isFinite(v) && v === value;
    });
    return hit?.label ?? null;
  };
  const slips = [
    { measure: width + length, how: `${width} + ${length}` },
    { measure: 2 * (width + length), how: `2 × (${width} + ${length})` },
  ]
    .map((s) => ({ ...s, v: s.measure * perSquare, label: choiceFor(s.measure * perSquare) }))
    .filter((s) => s.label && s.v !== goal);

  const answerNum = Number(String(problem.shortAnswer ?? "").replace(/[^\d.-]/g, ""));
  const answerOk = !Number.isFinite(answerNum) || answerNum === goal;
  const ok = k >= 1 && answerOk;

  const lastStep = totalSteps - 1;
  const isFinal = beat >= lastStep;
  // 0 = the plot, 1..k = one rate each, k+1 = area against distance around
  const phase = isFinal ? k + 1 : Math.min(Math.max(beat, 0), k + 1);
  const rateIdx = Math.min(Math.max(phase - 1, 0), k - 1);
  const rate = rates[rateIdx];

  // ---------------- geometry ----------------
  const cell = Math.min(30, 240 / length, 180 / width);
  const gw = cell * length;
  const gh = cell * width;
  const gx = 40 + (240 - gw) / 2;
  const gy = 52 + (180 - gh) / 2;
  const cellX = (c: number) => gx + c * cell;
  const cellY = (r: number) => gy + r * cell;

  // the first rate is the density per square, so its dots are drawable
  const perCell = rates[0]?.factor ?? 0;
  const dotCols = Math.ceil(Math.sqrt(perCell));
  const dotRows = Math.ceil(perCell / dotCols);
  const dotAt = (c: number, r: number, j: number) => ({
    x: cellX(c) + ((j % dotCols) + 0.5) * (cell / dotCols),
    y: cellY(r) + (Math.floor(j / dotCols) + 0.5) * (cell / dotRows),
  });

  const panelX = 405;
  const insetS = 96;
  const insetX = panelX - insetS / 2;
  const insetY = 62;

  const Plant = ({ x, y, s, color, delay }: { x: number; y: number; s: number; color: string; delay: number }) => (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 15, delay }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      <line x1={x} y1={y + s} x2={x} y2={y - s * 0.4} stroke={color} strokeWidth={Math.max(0.9, s * 0.22)} strokeLinecap="round" />
      <ellipse cx={x - s * 0.55} cy={y - s * 0.1} rx={s * 0.55} ry={s * 0.32} fill={color} transform={`rotate(-25 ${x - s * 0.55} ${y - s * 0.1})`} />
      <ellipse cx={x + s * 0.55} cy={y - s * 0.1} rx={s * 0.55} ry={s * 0.32} fill={color} transform={`rotate(25 ${x + s * 0.55} ${y - s * 0.1})`} />
    </motion.g>
  );

  const Berry = ({ x, y, s, delay }: { x: number; y: number; s: number; delay: number }) => (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 14, delay }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      <path d={`M ${x - s},${y - s * 0.3} Q ${x},${y + s * 1.5} ${x + s},${y - s * 0.3} Q ${x},${y - s} ${x - s},${y - s * 0.3} Z`} fill="#dc2626" />
      <path d={`M ${x - s * 0.7},${y - s * 0.5} L ${x},${y - s * 1.1} L ${x + s * 0.7},${y - s * 0.5} Z`} fill={LEAF} />
    </motion.g>
  );

  const title =
    phase === 0
      ? `the plot is ${width} ${unit} by ${length} ${unit} — count the squares inside it`
      : phase <= k
      ? `every ${rateIdx === 0 ? areaUnitOne : rates[rateIdx - 1].name.replace(/s$/, "")} carries ${rate.factor} ${rate.name}`
      : "the rates are per square — so the area is what counts, not the way round";

  const equation =
    phase === 0
      ? `${width} × ${length} = ${area} ${areaUnit}`
      : phase <= k
      ? `${rateIdx === 0 ? area : running[rateIdx - 1]} × ${rate.factor} = ${running[rateIdx]} ${rate.name}`
      : `${area} × ${perSquare} = ${goal} ${rates[k - 1].name}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 520 }}>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
          {title}
        </text>

        {/* ---------------- the garden, square foot by square foot ---------------- */}
        {Array.from({ length: width }).map((_, r) =>
          Array.from({ length: length }).map((__, c) => (
            <motion.rect
              key={`${r}-${c}`}
              x={cellX(c)}
              y={cellY(r)}
              width={cell}
              height={cell}
              fill={phase >= k ? "#fee2e2" : "#fef3c7"}
              stroke={SOIL}
              strokeWidth={0.7}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: phase === 0 ? 0.1 + (r * length + c) * 0.018 : 0 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          ))
        )}
        <rect x={gx} y={gy} width={gw} height={gh} fill="none" stroke={SOIL} strokeWidth={2} />

        {/* the plants themselves, once the first rate is in play */}
        {phase >= 1 &&
          phase <= k + 1 &&
          perCell <= 12 &&
          Array.from({ length: width }).map((_, r) =>
            Array.from({ length: length }).map((__, c) =>
              Array.from({ length: perCell }).map((___, j) => {
                const p = dotAt(c, r, j);
                return (
                  <motion.circle
                    key={`${r}-${c}-${j}`}
                    cx={p.x}
                    cy={p.y}
                    r={Math.max(1.4, cell * 0.11)}
                    fill={phase >= 2 ? "#dc2626" : LEAF}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 16,
                      delay: phase === 1 ? 0.5 + (r * length + c) * 0.012 : 0.1 + (r * length + c) * 0.008,
                    }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  />
                );
              })
            )
          )}

        {/* the distance around, traced against the squares inside */}
        {phase > k && (
          <motion.rect
            x={gx}
            y={gy}
            width={gw}
            height={gh}
            fill="none"
            stroke={BAD}
            strokeWidth={3.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
        )}

        {/* the gardener and the two side measurements */}
        <text x={20} y={44} fontSize="17">
          {icon}
        </text>
        <text x={gx - 8} y={gy + gh / 2 + 4} textAnchor="end" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {width} {unit}
        </text>
        <text x={gx + gw / 2} y={gy + gh + 18} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {length} {unit}
        </text>

        {/* ---------------- right panel: one square foot, magnified ---------------- */}
        {phase >= 1 && phase <= k && (
          <g>
            <text x={panelX} y={insetY - 10} textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM}>
              {rateIdx === 0 ? `one ${areaUnitOne}` : `one ${rates[rateIdx - 1].name.replace(/s$/, "")}`}
            </text>
            <motion.rect
              x={insetX}
              y={insetY}
              width={insetS}
              height={insetS}
              rx={4}
              fill={rateIdx === 0 ? "#fef3c7" : "#fff"}
              stroke={rateIdx === 0 ? SOIL : "#e2e8f0"}
              strokeWidth={1.6}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            {rateIdx === 0
              ? Array.from({ length: rate.factor }).map((_, j) => {
                  const c = j % dotCols;
                  const r = Math.floor(j / dotCols);
                  return (
                    <Plant
                      key={j}
                      x={insetX + ((c + 0.5) * insetS) / dotCols}
                      y={insetY + ((r + 0.5) * insetS) / dotRows + 6}
                      s={11}
                      color={LEAF}
                      delay={0.35 + j * 0.14}
                    />
                  );
                })
              : (() => {
                  const cx = panelX;
                  const cy = insetY + insetS / 2;
                  return (
                    <g>
                      <Plant x={cx} y={cy + 10} s={13} color={LEAF} delay={0.2} />
                      {Array.from({ length: rate.factor }).map((_, j) => {
                        const a = (2 * Math.PI * j) / rate.factor - Math.PI / 2;
                        return (
                          <Berry
                            key={j}
                            x={cx + Math.cos(a) * 34}
                            y={cy + Math.sin(a) * 30 + 4}
                            s={6}
                            delay={0.5 + j * 0.1}
                          />
                        );
                      })}
                    </g>
                  );
                })()}
            <motion.text
              x={panelX}
              y={insetY + insetS + 22}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={rate.color}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {rate.icon} {rate.factor} {rate.name}
            </motion.text>
            {rateIdx > 0 && (
              <motion.text
                x={panelX}
                y={insetY + insetS + 42}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="700"
                fill={DIM}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                {rates.slice(0, rateIdx + 1).map((r) => r.factor).join(" × ")} = {perSquare} per {areaUnitOne}
              </motion.text>
            )}
          </g>
        )}

        {/* ---------------- right panel: the three ways to measure ---------------- */}
        {phase > k && (
          <g>
            <text x={panelX} y={78} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK}>
              {perSquare} {rates[k - 1].name} per {areaUnitOne}, so:
            </text>
            {[
              ...slips.map((s) => ({
                how: s.how,
                measure: s.measure,
                v: s.v,
                tag: s.label ?? "",
                good: false,
              })),
              { how: `${width} × ${length}`, measure: area, v: goal, tag: problem.answer ?? "", good: true },
            ].map((row, i) => (
              <motion.g
                key={row.tag + i}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.9 + i * 0.3 }}
              >
                <rect x={panelX - 100} y={92 + i * 30} width={200} height={25} rx={5} fill={row.good ? "#dcfce7" : "#fef2f2"} stroke={row.good ? WIN : BAD} strokeWidth={1.1} />
                <text
                  x={panelX - 94}
                  y={109 + i * 30}
                  fontSize="10"
                  fontWeight="800"
                  fill={row.good ? "#166534" : BAD}
                  fontFamily={numberFont}
                >
                  {row.how} = {row.measure} → {row.v}
                </text>
                <text x={panelX + 94} y={109 + i * 30} textAnchor="end" fontSize="10" fontWeight="800" fill={row.good ? WIN : BAD} fontFamily={numberFont}>
                  {row.good ? "✓" : "✗"} {row.tag}
                </text>
              </motion.g>
            ))}
            <motion.text
              x={panelX}
              y={200}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="700"
              fill={DIM}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              the red edge is {2 * (width + length)} {unit} — it grows nothing
            </motion.text>
          </g>
        )}

        <motion.text
          key={`eq${phase}`}
          x={W / 2}
          y={272}
          textAnchor="middle"
          fontSize="15"
          fontWeight="800"
          fill={IND}
          fontFamily={numberFont}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: phase === 0 ? 1.2 : 1.4 }}
        >
          {equation}
        </motion.text>
      </svg>

      <motion.span
        key={phase}
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
        {phase === 0
          ? `${area} ${areaUnit} of ground`
          : phase <= k
          ? `${running[rateIdx]} ${rate.name}`
          : `${goal} ${rates[k - 1].name}`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          {k < 1
            ? "check failed: the chain needs at least one rate"
            : `check failed: the chain gives ${goal}, the stored answer is ${problem.shortAnswer}`}
        </span>
      )}

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
