import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const TRAY = "#eef2ff";
const TRAY_EDGE = "#c7d2fe";
const MEDAL = ["#dc2626", "#ea580c", "#ca8a04", "#0d9488", "#7c3aed", "#0891b2", "#db2777", "#65a30d"];

type Shape = {
  parts: number[];
  assignments: number;
  binos: number[];
  deals: number;
  count: number;
  legal: boolean;
};

const fact = (n: number) => {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
};
const choose = (n: number, k: number) => fact(n) / (fact(k) * fact(n - k));
const parseChoice = (text: string) =>
  Number(String(text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));

/** Every partition of `items` into exactly `boxes` non-increasing parts ≥ 0. */
function partitionShapes(items: number, boxes: number): number[][] {
  const out: number[][] = [];
  const rec = (rem: number, slots: number, max: number, cur: number[]) => {
    if (slots === 0) {
      if (rem === 0) out.push([...cur]);
      return;
    }
    for (let v = Math.min(max, rem); v >= 0; v--) {
      // the rest must still fit under v, and that only gets worse as v drops
      if (rem - v > v * (slots - 1)) break;
      cur.push(v);
      rec(rem - v, slots - 1, v, cur);
      cur.pop();
    }
  };
  rec(items, boxes, items, []);
  return out;
}

/**
 * Distinct objects handed out to distinct people, everyone getting at least one.
 * The scene's claim is that the whole problem is decided *before* any counting:
 * a handout is fixed by the **shape** of the piles, and 5 into 3 has only a
 * handful of shapes — so it enumerates every partition rather than asserting the
 * usual two cases, and the "at least one" rule visibly strikes out the shapes
 * that leave a tray empty.
 *
 * Each surviving shape is then counted the same way twice over: how many ways the
 * *sizes* can be handed to the people (`boxes!` divided by the repeats, which is
 * why 3+1+1 gives 3 and not 6 — the two singles are interchangeable as sizes),
 * times how many ways the *awards* fill those sizes (a chain of binomials). The
 * medals genuinely fly from a pool into the trays, so the second factor is a deal
 * you watch rather than a formula.
 *
 * The closing beat is the payoff and it is entirely discovered: the scene searches
 * subsets of the **illegal** shapes for sums that land on an answer choice, and on
 * this problem three of the four distractors turn out to be 150 plus exactly the
 * shapes where somebody goes home empty-handed. It separately re-runs each legal
 * shape with one binomial factor dropped, which accounts for the fourth. The total
 * is cross-checked against inclusion–exclusion (3⁵ − 3·2⁵ + 3), a completely
 * independent route, and every shape's count is checked to sum to boxes^items.
 * Data: { items, boxes, minEach?, itemWord?, boxWord? }.
 */
export function SurjectionCasesScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const items = Math.max(1, Math.round(num(data.items, 5)));
  const boxes = Math.max(1, Math.round(num(data.boxes, 3)));
  const minEach = Math.max(0, Math.round(num(data.minEach, 1)));
  const itemWord = data.itemWord != null ? String(data.itemWord) : "award";
  const boxWord = data.boxWord != null ? String(data.boxWord) : "student";

  const shapes: Shape[] = partitionShapes(items, boxes).map((parts) => {
    const mult = new Map<number, number>();
    parts.forEach((v) => mult.set(v, (mult.get(v) ?? 0) + 1));
    // sizes that repeat are interchangeable, so divide them out
    let assignments = fact(boxes);
    mult.forEach((m) => (assignments /= fact(m)));
    let rem = items;
    const binos = parts.map((s) => {
      const c = choose(rem, s);
      rem -= s;
      return c;
    });
    const deals = binos.reduce((a, b) => a * b, 1);
    return { parts, assignments, binos, deals, count: assignments * deals, legal: parts.every((v) => v >= minEach) };
  });

  const legal = shapes.filter((s) => s.legal);
  const illegal = shapes.filter((s) => !s.legal);
  const answer = legal.reduce((a, s) => a + s.count, 0);

  // every shape together must account for all boxes^items handouts
  const allSum = shapes.reduce((a, s) => a + s.count, 0);
  const shapesCheck = allSum === Math.pow(boxes, items);
  // inclusion–exclusion, a route that never mentions shapes at all
  let incl = 0;
  for (let k = 0; k <= boxes; k++) incl += (k % 2 ? -1 : 1) * choose(boxes, k) * Math.pow(boxes - k, items);
  const inclCheck = minEach !== 1 || incl === answer;

  // ---- price the wrong choices ----
  const wrong = (problem.choices ?? [])
    .map((c) => ({ label: String(c.label), value: parseChoice(String(c.text)) }))
    .filter((c) => Number.isFinite(c.value) && c.value !== answer);
  // (a) letting a tray go empty: answer + some subset of the illegal shapes
  const emptySlips = wrong
    .map((c) => {
      let best: Shape[] | null = null;
      for (let m = 1; m < 1 << illegal.length; m++) {
        const sub = illegal.filter((_, i) => m & (1 << i));
        if (answer + sub.reduce((a, s) => a + s.count, 0) !== c.value) continue;
        if (!best || sub.length < best.length) best = sub;
      }
      return { ...c, sub: best };
    })
    .filter((c) => c.sub);
  // (b) forgetting that a later pile can still be filled more than one way
  const dropSlips = wrong
    .map((c) => {
      for (const s of legal) {
        for (const b of s.binos) {
          if (b === 1) continue;
          if (answer - s.count + s.assignments * (s.deals / b) === c.value) return { ...c, shape: s, factor: b };
        }
      }
      return null;
    })
    .filter((c): c is { label: string; value: number; shape: Shape; factor: number } => c !== null);
  const priced = new Set([...emptySlips.map((c) => c.label), ...dropSlips.map((c) => c.label)]);

  // ---- beats: shapes, then one per legal shape, then the total ----
  const last = totalSteps - 1;
  const isFinal = step >= last;
  const beat = isFinal ? legal.length + 1 : Math.min(Math.max(step, 0), legal.length);
  const shownCase = beat >= 1 && beat <= legal.length ? legal[beat - 1] : null;

  // ---- geometry ----
  const W = 340;
  const H = 286;
  const fmt = (p: number[]) => p.join(" + ");

  // one concrete deal for the case beat: awards taken in order
  const dealt: number[][] = [];
  if (shownCase) {
    let n = 0;
    shownCase.parts.forEach((s) => {
      dealt.push(Array.from({ length: s }, () => n++));
    });
  }
  const poolX = (i: number) => (W - items * 26) / 2 + i * 26 + 13;
  const poolY = 128;
  const trayW = 76;
  const trayGap = 20;
  const trayX = (i: number) => (W - (boxes * trayW + (boxes - 1) * trayGap)) / 2 + i * (trayW + trayGap);
  const trayY = 168;
  const trayH = 50;
  // the closing block is short when few shapes survive; centre it in the box
  const finalShift = Math.max(0, (H - (34 + legal.length * 46 + 96)) / 2);

  const caption =
    beat === 0
      ? `${legal.length} of the ${shapes.length} shapes give every ${boxWord} at least ${minEach}`
      : shownCase
      ? `${fmt(shownCase.parts)}:  ${shownCase.assignments} × ${shownCase.binos.filter((b) => b !== 1).join(" × ")} = ${shownCase.count}`
      : `${legal.map((s) => s.count).join(" + ")} = ${answer}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* ---- beat 0: every shape the piles could take ---- */}
        {beat === 0 && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM} fontFamily={numberFont}>
              every way {items} {itemWord}s can split into {boxes} piles
            </text>
            {shapes.map((s, i) => {
              const y = 32 + i * 44;
              return (
                <motion.g
                  key={`sh${i}`}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: s.legal ? 1 : 0.55, x: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.12 }}
                >
                  <text x={8} y={y + 20} fontSize="11" fontWeight="800" fill={s.legal ? INK : DIM} fontFamily={numberFont}>
                    {fmt(s.parts)}
                  </text>
                  {s.parts.map((sz, j) => (
                    <g key={`t${j}`}>
                      <rect
                        x={72 + j * 48}
                        y={y}
                        width={44}
                        height={30}
                        rx={6}
                        fill={sz === 0 ? "#fff" : TRAY}
                        stroke={sz === 0 ? BAD : TRAY_EDGE}
                        strokeWidth={sz === 0 ? 1.6 : 1.2}
                        strokeDasharray={sz === 0 ? "3 3" : undefined}
                      />
                      {sz === 0 ? (
                        <text x={72 + j * 48 + 22} y={y + 20} textAnchor="middle" fontSize="11" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                          0
                        </text>
                      ) : (
                        Array.from({ length: sz }).map((_, k) => (
                          <circle
                            key={`d${k}`}
                            cx={72 + j * 48 + 22 - ((sz - 1) * 8) / 2 + k * 8}
                            cy={y + 15}
                            r={3.2}
                            fill={MEDAL[(dotBase(s.parts, j) + k) % MEDAL.length]}
                          />
                        ))
                      )}
                    </g>
                  ))}
                  <motion.g
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.7 + i * 0.12 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <text x={224} y={y + 20} fontSize="14" fontWeight="800" fill={s.legal ? WIN : BAD} fontFamily={numberFont}>
                      {s.legal ? "✓" : "✗"}
                    </text>
                    {!s.legal && (
                      <text x={240} y={y + 20} fontSize="8.5" fontWeight="700" fill={BAD} fontFamily={numberFont}>
                        a {boxWord} gets none
                      </text>
                    )}
                  </motion.g>
                </motion.g>
              );
            })}
            <motion.text
              x={W / 2}
              y={278}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              count each surviving shape, then add
            </motion.text>
          </g>
        )}

        {/* ---- a case beat: one legal shape, counted twice over ---- */}
        {shownCase && (
          <g>
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 280, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={W / 2 - 54} y={4} width={108} height={20} rx={10} fill={TRAY} stroke={TRAY_EDGE} strokeWidth={1.4} />
              <text x={W / 2} y={18} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                shape {fmt(shownCase.parts)}
              </text>
            </motion.g>

            {/* which person takes which size — repeats make these fewer than boxes! */}
            <text x={W / 2} y={40} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              who takes which size?
            </text>
            {sizeAssignments(shownCase.parts).slice(0, 3).map((variant, vi, arr) => {
              const vw = boxes * 18 + (boxes - 1) * 4;
              const spread = (W - 24) / arr.length;
              const vx = 12 + vi * spread + (spread - vw) / 2;
              return (
                <motion.g
                  key={`va${vi}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: vi === 0 ? 1 : 0.55, y: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.15 + vi * 0.1 }}
                >
                  {variant.map((sz, j) => (
                    <g key={`vb${j}`}>
                      <rect x={vx + j * 22} y={48} width={18} height={18} rx={4} fill="#fff" stroke={vi === 0 ? IND : TRAY_EDGE} strokeWidth={1.4} />
                      <text x={vx + j * 22 + 9} y={61} textAnchor="middle" fontSize="10" fontWeight="800" fill={vi === 0 ? IND : DIM} fontFamily={numberFont}>
                        {sz}
                      </text>
                      <Person x={vx + j * 22 + 9} y={74} color={vi === 0 ? IND : DIM} />
                    </g>
                  ))}
                </motion.g>
              );
            })}
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={W / 2 - 44} y={86} width={88} height={18} rx={9} fill="#fff" stroke={IND} strokeWidth={1.4} />
              <text x={W / 2} y={99} textAnchor="middle" fontSize="10" fontWeight="800" fill={IND} fontFamily={numberFont}>
                {shownCase.assignments} way{shownCase.assignments === 1 ? "" : "s"}
              </text>
            </motion.g>

            {/* the awards themselves, flying from the pool into the trays */}
            <text x={W / 2} y={118} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              now deal the {items} different {itemWord}s
            </text>
            {Array.from({ length: items }).map((_, i) => (
              <motion.g key={`pool${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} transition={{ delay: 0.6 }}>
                <Medal cx={poolX(i)} cy={poolY} index={i} />
              </motion.g>
            ))}
            {shownCase.parts.map((sz, j) => (
              <g key={`tr${j}`}>
                {shownCase.binos[j] !== 1 && (
                  <motion.text
                    x={trayX(j) + trayW / 2}
                    y={160}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="800"
                    fill={IND}
                    fontFamily={numberFont}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 + j * 0.25 }}
                  >
                    {`C(${remainingBefore(shownCase.parts, j, items)},${sz}) = ${shownCase.binos[j]}`}
                  </motion.text>
                )}
                <rect x={trayX(j)} y={trayY} width={trayW} height={trayH} rx={8} fill={TRAY} stroke={TRAY_EDGE} strokeWidth={1.4} />
                <Person x={trayX(j) + trayW / 2} y={trayY + trayH + 14} color={INK} />
                {dealt[j].map((mi, k) => {
                  const cx = trayX(j) + trayW / 2 - ((dealt[j].length - 1) * 22) / 2 + k * 22;
                  const cy = trayY + 25;
                  return (
                    <motion.g
                      key={`m${mi}`}
                      initial={{ x: poolX(mi) - cx, y: poolY - cy, opacity: 0 }}
                      animate={{ x: 0, y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.75 + j * 0.25 + k * 0.08 }}
                    >
                      <Medal cx={cx} cy={cy} index={mi} />
                    </motion.g>
                  );
                })}
              </g>
            ))}

            {/* the product */}
            <motion.text
              x={W / 2}
              y={262}
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 15, delay: 1.7 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              {`${shownCase.assignments} × ${shownCase.binos.filter((b) => b !== 1).join(" × ")} = ${shownCase.count}`}
            </motion.text>
          </g>
        )}

        {/* ---- final beat: add the surviving shapes ---- */}
        {beat === legal.length + 1 && (
          <g>
            <text x={W / 2} y={18} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM} fontFamily={numberFont}>
              add the shapes that survived
            </text>
            <g transform={`translate(0 ${finalShift})`}>
            {legal.map((s, i) => {
              const y = 34 + i * 46;
              return (
                <motion.g key={`fl${i}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.15 }}>
                  <text x={12} y={y + 22} fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    {fmt(s.parts)}
                  </text>
                  {s.parts.map((sz, j) => (
                    <g key={`ft${j}`}>
                      <rect x={80 + j * 46} y={y + 2} width={40} height={30} rx={6} fill={TRAY} stroke={TRAY_EDGE} strokeWidth={1.2} />
                      {Array.from({ length: sz }).map((_, k) => (
                        <circle key={`fd${k}`} cx={80 + j * 46 + 20 - ((sz - 1) * 8) / 2 + k * 8} cy={y + 17} r={3.2} fill={MEDAL[(dotBase(s.parts, j) + k) % MEDAL.length]} />
                      ))}
                    </g>
                  ))}
                  <rect x={236} y={y + 4} width={54} height={26} rx={13} fill="#fff" stroke={IND} strokeWidth={1.6} />
                  <text x={263} y={y + 22} textAnchor="middle" fontSize="13" fontWeight="800" fill={IND} fontFamily={numberFont}>
                    {s.count}
                  </text>
                </motion.g>
              );
            })}
            {/* the counts drop into one total */}
            <motion.g
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.6 }}
            >
              <text x={W / 2} y={34 + legal.length * 46 + 26} textAnchor="middle" fontSize="15" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {legal.map((s) => s.count).join(" + ")} =
              </text>
            </motion.g>
            <motion.g
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.9 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect x={W / 2 - 34} y={34 + legal.length * 46 + 38} width={68} height={28} rx={14} fill={WIN} />
              <text x={W / 2} y={34 + legal.length * 46 + 57} textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                {answer}
              </text>
            </motion.g>
            {minEach === 1 && (
              <motion.text
                x={W / 2}
                y={34 + legal.length * 46 + 84}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={DIM}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {`check, no shapes: ${inclusionText(boxes, items)} = ${incl}`}
              </motion.text>
            )}
            </g>
          </g>
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : IND,
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
            key="notes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", lineHeight: 1.55 }}
          >
            {!shapesCheck ? (
              `check failed: the shapes total ${allSum}, not ${Math.pow(boxes, items)}`
            ) : !inclCheck ? (
              `check failed: inclusion–exclusion gives ${incl}, not ${answer}`
            ) : (
              <>
                {emptySlips.length > 0 && `let a ${boxWord} go empty-handed and the extra shapes land on choices:`}
                {emptySlips.map((c) => (
                  <span key={c.label}>
                    <br />
                    {`${c.label} ${c.value} = ${answer} + ${c.sub!.map((s) => s.count).join(" + ")}, the ${c.sub!
                      .map((s) => fmt(s.parts))
                      .join(" and ")} shape${c.sub!.length > 1 ? "s" : ""}`}
                  </span>
                ))}
                {dropSlips.map((c) => (
                  <span key={c.label}>
                    <br />
                    {`${c.label} ${c.value} drops the × ${c.factor} in the ${fmt(c.shape.parts)} shape`}
                  </span>
                ))}
                {priced.size > 0 && <br />}
                {priced.size === wrong.length && wrong.length > 0
                  ? `every wrong choice is one of those two slips`
                  : priced.size > 0
                  ? `${priced.size} of the ${wrong.length} wrong choices priced`
                  : ""}
              </>
            )}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Index of the first award in pile `j`, so colours never repeat across a row. */
function dotBase(parts: number[], j: number) {
  return parts.slice(0, j).reduce((a, b) => a + b, 0);
}

/** How many items are still unhanded when pile `j` is filled. */
function remainingBefore(parts: number[], j: number, items: number) {
  return items - parts.slice(0, j).reduce((a, b) => a + b, 0);
}

/** The distinct orderings of a multiset of pile sizes. */
function sizeAssignments(parts: number[]): number[][] {
  const seen = new Set<string>();
  const out: number[][] = [];
  const rec = (rest: number[], cur: number[]) => {
    if (!rest.length) {
      const key = cur.join(",");
      if (!seen.has(key)) {
        seen.add(key);
        out.push([...cur]);
      }
      return;
    }
    const used = new Set<number>();
    rest.forEach((v, i) => {
      if (used.has(v)) return;
      used.add(v);
      cur.push(v);
      rec([...rest.slice(0, i), ...rest.slice(i + 1)], cur);
      cur.pop();
    });
  };
  rec(parts, []);
  return out;
}

/** `n^k − C(n,1)(n−1)^k + …` written out for the closing cross-check. */
function inclusionText(boxes: number, items: number) {
  const terms: string[] = [];
  for (let k = 0; k <= boxes; k++) {
    const c = choose(boxes, k);
    const base = boxes - k;
    if (base === 0) continue;
    const body = c === 1 ? `${base}^${items}` : `${c}·${base}^${items}`;
    terms.push(k === 0 ? body : `${k % 2 ? "−" : "+"} ${body}`);
  }
  return terms.join(" ");
}

/** A small stick figure standing under a tray. */
function Person({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y - 6} r={3.2} fill={color} />
      <path d={`M ${x - 4.5},${y + 3} q 4.5,-5 9,0 z`} fill={color} />
    </g>
  );
}

/** One of the distinct awards: a ribboned medal, coloured by index. */
function Medal({ cx, cy, index }: { cx: number; cy: number; index: number }) {
  const color = MEDAL[index % MEDAL.length];
  return (
    <g>
      <path d={`M ${cx - 5},${cy - 11} l 3,7 l 4,0 z`} fill={color} opacity={0.55} />
      <path d={`M ${cx + 5},${cy - 11} l -3,7 l -4,0 z`} fill={color} opacity={0.8} />
      <circle cx={cx} cy={cy + 1} r={7.5} fill={color} />
      <text x={cx} y={cy + 4.5} textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#fff" fontFamily={numberFont}>
        {String.fromCharCode(65 + index)}
      </text>
    </g>
  );
}
