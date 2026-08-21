import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";
const WARN = "#b45309";
const RAIL = "#64748b";

type Person = { name: string; icon: string; short: string };
type Rule = { kind: string; args: string[]; text: string };
type Pos = Record<string, number>;

/** A rule is structural when it pins seats outright, so it shapes the candidates. */
function isStructural(rule: Rule) {
  return rule.kind === "at" || rule.kind === "behind";
}

/** Does this seating satisfy the rule? Slot 1 is the front, slot n the last. */
function holds(rule: Rule, pos: Pos): boolean {
  const [a, b, c] = rule.args;
  if (rule.kind === "at") return pos[a] === Number(b);
  if (rule.kind === "behind") return pos[a] === pos[b] + 1;
  if (rule.kind === "front") return pos[a] < pos[b];
  if (rule.kind === "gap") return Math.abs(pos[a] - pos[b]) >= Number(c);
  return true;
}

function permute(items: string[]): string[][] {
  if (items.length <= 1) return [items];
  const out: string[][] = [];
  items.forEach((it, i) => {
    permute([...items.slice(0, i), ...items.slice(i + 1)]).forEach((rest) => out.push([it, ...rest]));
  });
  return out;
}

function wrap(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let line = "";
  text.split(" ").forEach((word) => {
    if (line && (line + " " + word).length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? line + " " + word : word;
    }
  });
  if (line) lines.push(line);
  return lines;
}

/**
 * A seating puzzle solved by elimination: people fill a row of numbered places
 * (train cars, chairs) under rules of the form "X is in place k", "X sits
 * directly behind Y", "X is somewhere in front of Y", "X and Y are at least k
 * apart". The scene **enumerates every seating itself** and filters by the rules,
 * so the arrangement is discovered rather than asserted — and it then rebuilds
 * the deduction as a picture.
 *
 * The unlock is the `behind` rule: two people who must be adjacent form a **block
 * that can never come apart**, so instead of five independent seats there are
 * only the few places that block fits. Each of those becomes a candidate row, and
 * the remaining rules are tested against it: for every candidate the scene works
 * out which people are **locked** (they sit in the same place across every
 * seating consistent with the structural rules) and which are still free, then
 * finds the first rule that *no* completion can satisfy. That rule is the killer,
 * and its detail line is measured — the largest gap actually achievable, the
 * furthest forward someone can get — so the failure is a computed quantity rather
 * than a claim.
 *
 * Beats: the train with the pinned seat and the coupled pair floating above; the
 * places the block fits, sliding into each; the verdicts, with the failing rows
 * struck through and their free places dashed amber; then the survivor seated in
 * full, with the asked place ringed and braced by the equal counts either side.
 * The unique-solution check and the answer check both run, and the caption names
 * whichever failed. Data
 * `{ slots, unit?, people: ["Aaron|🧑|A", ...], rules: ["at|Maren|5|text", ...], ask, pivot? }`.
 */
export function SeatDeduceScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const slots = Math.max(2, Math.round(num(data.slots, 5)));
  const unit = typeof data.unit === "string" ? data.unit : "car";
  const ask = Math.max(1, Math.min(slots, Math.round(num(data.ask, Math.ceil(slots / 2)))));

  const people: Person[] = (Array.isArray(data.people) ? data.people : []).map((p) => {
    const [name, icon, short] = String(p).split("|");
    return { name: name ?? "", icon: icon || "🙂", short: short || (name ?? "?").slice(0, 1) };
  });
  const byName = (n: string) => people.find((p) => p.name === n);

  const rules: Rule[] = (Array.isArray(data.rules) ? data.rules : []).map((r) => {
    const parts = String(r).split("|");
    return { kind: parts[0] ?? "", args: parts.slice(1, -1), text: parts[parts.length - 1] ?? "" };
  });
  const structRules = rules.filter(isStructural);
  const otherRules = rules.filter((r) => !isStructural(r));

  // ---- solve it: every seating, filtered by the rules ----
  const names = people.map((p) => p.name);
  const allPos: Pos[] =
    names.length === slots && names.length <= 7
      ? permute(names).map((perm) => Object.fromEntries(perm.map((n, i) => [n, i + 1])) as Pos)
      : [];
  const structPos = allPos.filter((p) => structRules.every((r) => holds(r, p)));
  const solutions = structPos.filter((p) => otherRules.every((r) => holds(r, p)));

  // the pair that must stay adjacent is what the candidates are built around
  const behindRule = rules.find((r) => r.kind === "behind");
  const pivot =
    (typeof data.pivot === "string" && data.pivot) || behindRule?.args[0] || names[0] || "";

  type Candidate = {
    slot: number;
    group: Pos[];
    valid: Pos[];
    locked: (string | null)[];
    freePeople: Person[];
    freeSlots: number[];
    killer: Rule | null;
    detail: string;
  };

  const candidates: Candidate[] = Array.from({ length: slots }, (_, i) => i + 1)
    .map((slot) => ({ slot, group: structPos.filter((p) => p[pivot] === slot) }))
    .filter((c) => c.group.length > 0)
    .map(({ slot, group }) => {
      // locked = everyone who sits in the same place across the whole group
      const locked: (string | null)[] = Array.from({ length: slots }, (_, i) => {
        const s = i + 1;
        const who = names.find((n) => group[0][n] === s) ?? null;
        return who && group.every((p) => p[who] === s) ? who : null;
      });
      const freePeople = people.filter((p) => !locked.includes(p.name));
      const freeSlots = locked.map((w, i) => (w ? 0 : i + 1)).filter((s) => s > 0);
      const valid = group.filter((p) => otherRules.every((r) => holds(r, p)));
      // the first rule no completion can satisfy is what kills this candidate
      const killer = valid.length === 0 ? otherRules.find((r) => !group.some((p) => holds(r, p))) ?? null : null;

      let detail = "";
      if (killer) {
        const [a, b, c] = killer.args;
        if (killer.kind === "gap") {
          const best = Math.max(...group.map((p) => Math.abs(p[a] - p[b])));
          detail = `at most ${best} apart, needs ${c}`;
        } else if (killer.kind === "front") {
          const best = Math.min(...group.map((p) => p[a]));
          detail = `${a} gets no further forward than ${unit} ${best}`;
        } else if (killer.kind === "at") {
          detail = `${a} can never reach ${unit} ${b}`;
        } else if (killer.kind === "behind") {
          detail = `${a} is never right behind ${b}`;
        }
      } else if (valid.length === 0) {
        detail = "no seating survives all the rules together";
      }
      return { slot, group, valid, locked, freePeople, freeSlots, killer, detail };
    });

  const winner = candidates.find((c) => c.valid.length > 0) ?? null;
  const winnerPos: Pos | null = winner ? winner.valid[0] : null;
  const seatedName = (s: number) => (winnerPos ? names.find((n) => winnerPos[n] === s) ?? "" : "");
  const answerName = seatedName(ask);

  // ---- self-checks: the puzzle must pin down one seating, and it must agree ----
  const uniqueOk = solutions.length === 1;
  const answerOk = problem.shortAnswer == null || String(problem.shortAnswer).trim() === answerName;
  const dataOk = allPos.length > 0 && candidates.length > 0;
  const ok = uniqueOk && answerOk && dataOk;
  const failure = !dataOk
    ? "the people and places do not match up"
    : !uniqueOk
    ? `the rules allow ${solutions.length} seatings, not 1`
    : !answerOk
    ? `${unit} ${ask} holds ${answerName}, but the answer says ${problem.shortAnswer}`
    : "";

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const phase = isFinal ? 3 : Math.min(beat, 2);

  const W = 470;
  const H = 262;

  // ---- full-size train (phases 0 and 3) ----
  const CW = 66;
  const CG = 7;
  const X0 = 68;
  const carX = (s: number) => X0 + (s - 1) * (CW + CG);
  const carMid = (s: number) => carX(s) + CW / 2;
  const CARY = 140;
  const CARH = 46;

  const Wheels = ({ x, w, y, r = 5 }: { x: number; w: number; y: number; r?: number }) => (
    <g>
      <circle cx={x + w * 0.26} cy={y} r={r} fill="#334155" />
      <circle cx={x + w * 0.74} cy={y} r={r} fill="#334155" />
    </g>
  );

  /** One passenger car: body, window band, wheels. */
  const Car = ({
    x,
    y,
    w,
    h,
    tone,
    dashed = false,
    fillOpacity = 0.16,
    wheelR = 5,
  }: {
    x: number;
    y: number;
    w: number;
    h: number;
    tone: string;
    dashed?: boolean;
    fillOpacity?: number;
    wheelR?: number;
  }) => (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={5}
        fill={tone}
        fillOpacity={fillOpacity}
        stroke={tone}
        strokeWidth={dashed ? 1.6 : 1.8}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <rect x={x + w * 0.14} y={y + h * 0.16} width={w * 0.72} height={h * 0.34} rx={3} fill="#fff" fillOpacity={0.75} stroke={tone} strokeWidth={0.9} />
      <Wheels x={x} w={w} y={y + h + wheelR - 1} r={wheelR} />
    </g>
  );

  /** A seated person in a small car: the figure, plus a nameplate letter under it
   *  — five passengers are not told apart by emoji alone at this size. */
  const Rider = ({ cx, y, h, name, tone = INK }: { cx: number; y: number; h: number; name: string; tone?: string }) => (
    <g>
      <text x={cx} y={y + h * 0.52} textAnchor="middle" fontSize="12">
        {byName(name)?.icon}
      </text>
      <text x={cx} y={y + h - 4} textAnchor="middle" fontSize="7.5" fontWeight="800" fill={tone} fontFamily={numberFont}>
        {byName(name)?.short}
      </text>
    </g>
  );

  /** The engine at the head of the train, so the leftmost car is the front one. */
  const Loco = ({ x, y, w, h, s = 1 }: { x: number; y: number; w: number; h: number; s?: number }) => (
    <g>
      <rect x={x} y={y + h * 0.3} width={w} height={h * 0.7} rx={4} fill={RAIL} fillOpacity={0.28} stroke={RAIL} strokeWidth={1.6} />
      <rect x={x + w * 0.42} y={y} width={w * 0.5} height={h * 0.42} rx={3} fill={RAIL} fillOpacity={0.4} stroke={RAIL} strokeWidth={1.4} />
      <rect x={x + w * 0.1} y={y + h * 0.06} width={w * 0.16} height={h * 0.3} rx={2} fill={RAIL} />
      <Wheels x={x} w={w} y={y + h + 4 * s - 1} r={4 * s} />
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 480 }}>
        {/* ============ phase 0: what the rules nail down before any guessing ============ */}
        {phase === 0 && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              two rules fix things outright — the rest is where they fit
            </text>

            {/* the coupled pair, floating free of the train for now */}
            {behindRule &&
              (() => {
                const back = byName(behindRule.args[0]);
                const front = byName(behindRule.args[1]);
                const bw = 62;
                const x1 = W / 2 - bw - 6;
                const x2 = W / 2 + 6;
                return (
                  <motion.g
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.9 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {[
                      { x: x1, who: front },
                      { x: x2, who: back },
                    ].map((slot, i) => (
                      <g key={i}>
                        <Car x={slot.x} y={38} w={bw} h={34} tone={IND} wheelR={4} />
                        <text x={slot.x + bw / 2} y={66} textAnchor="middle" fontSize="17">
                          {slot.who?.icon}
                        </text>
                        <text x={slot.x + bw / 2} y={90} textAnchor="middle" fontSize="10" fontWeight="800" fill={IND}>
                          {slot.who?.name}
                        </text>
                      </g>
                    ))}
                    {/* the coupling: this is the pair that can never come apart */}
                    <line x1={x1 + bw} y1={55} x2={x2} y2={55} stroke={IND} strokeWidth={3} />
                    <circle cx={W / 2} cy={55} r={4.5} fill={IND} />
                    <text x={W / 2} y={30} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={IND}>
                      coupled — always in this order
                    </text>
                  </motion.g>
                );
              })()}

            {/* the train itself, rolling in from the left */}
            <motion.g initial={{ x: -220, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 60, damping: 18, delay: 0.1 }}>
              <Loco x={14} y={CARY - 10} w={44} h={CARH + 10} />
              {Array.from({ length: slots }, (_, i) => i + 1).map((s) => (
                <Car key={s} x={carX(s)} y={CARY} w={CW} h={CARH} tone={RAIL} fillOpacity={0.1} />
              ))}
            </motion.g>
            <line x1={8} y1={CARY + CARH + 10} x2={W - 14} y2={CARY + CARH + 10} stroke={RAIL} strokeWidth={2} />

            {Array.from({ length: slots }, (_, i) => i + 1).map((s) => (
              <text key={s} x={carMid(s)} y={CARY + CARH + 26} textAnchor="middle" fontSize="9" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                {unit} {s}
              </text>
            ))}

            {/* the pinned seat drops in from above */}
            {rules
              .filter((r) => r.kind === "at")
              .map((r) => {
                const who = byName(r.args[0]);
                const s = Number(r.args[1]);
                return (
                  <g key={r.args[0]}>
                    <motion.g initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 150, damping: 13, delay: 1.5 }}>
                      <text x={carMid(s)} y={CARY + 38} textAnchor="middle" fontSize="21">
                        {who?.icon}
                      </text>
                    </motion.g>
                    <motion.text
                      x={carMid(s)}
                      y={CARY - 8}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="800"
                      fill={WARN}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.9 }}
                    >
                      {who?.name} — fixed
                    </motion.text>
                  </g>
                );
              })}

            <motion.text x={W / 2} y={252} textAnchor="middle" fontSize="10" fontWeight="700" fill={DIM} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
              so the pair is really one two-{unit} block looking for a home
            </motion.text>
          </g>
        )}

        {/* ============ phases 1 and 2: the places the block fits, then the verdicts ============ */}
        {(phase === 1 || phase === 2) &&
          (() => {
            const MW = 34;
            const MG = 4;
            const MX0 = 92;
            const mx = (s: number) => MX0 + (s - 1) * (MW + MG);
            const mmid = (s: number) => mx(s) + MW / 2;
            const pitch = Math.min(58, 172 / Math.max(1, candidates.length));
            const rowY = (i: number) => 50 + i * pitch;
            const MH = Math.min(30, pitch - 22);
            const blockNames = behindRule ? [behindRule.args[1], behindRule.args[0]] : [];

            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
                  {phase === 1
                    ? `the block fits in ${candidates.length} places — that is the whole search`
                    : `test the other rules: only one place survives`}
                </text>

                {candidates.map((c, i) => {
                  const y = rowY(i);
                  const dead = phase === 2 && c.valid.length === 0;
                  const alive = phase === 2 && c.valid.length > 0;
                  const tone = dead ? BAD : alive ? WIN : IND;
                  const blockSlots = blockNames.map((n) => c.group[0][n]);
                  const bx1 = mx(Math.min(...blockSlots));
                  const bx2 = mx(Math.max(...blockSlots)) + MW;

                  return (
                    <g key={c.slot}>
                      <text x={8} y={y + MH / 2 + 4} fontSize="9.5" fontWeight="800" fill={dead ? DIM : tone}>
                        {byName(pivot)?.name} in {unit} {c.slot}
                      </text>

                      {/* the places nobody is locked into yet */}
                      {Array.from({ length: slots }, (_, k) => k + 1).map((s) => {
                        const who = c.locked[s - 1];
                        const isFree = !who;
                        const dashTone = phase === 2 && isFree && dead ? WARN : DIM;
                        return (
                          <g key={s} opacity={dead ? 0.55 : 1}>
                            <Car
                              x={mx(s)}
                              y={y}
                              w={MW}
                              h={MH}
                              tone={isFree ? dashTone : blockSlots.includes(s) ? IND : RAIL}
                              dashed={isFree}
                              fillOpacity={isFree ? 0.07 : 0.16}
                              wheelR={2.6}
                            />
                            {who && !blockSlots.includes(s) && <Rider cx={mmid(s)} y={y} h={MH} name={who} />}
                            {isFree && phase === 2 && dead && (
                              <text x={mmid(s)} y={y + MH / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={WARN} fontFamily={numberFont}>
                                ?
                              </text>
                            )}
                            {/* the survivor gets its remaining people actually seated */}
                            {isFree && alive && winnerPos && (
                              <motion.g
                                initial={{ y: -22, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 190, damping: 14, delay: 1.1 + s * 0.08 }}
                              >
                                <Rider cx={mmid(s)} y={y} h={MH} name={names.find((n) => c.valid[0][n] === s) ?? ""} tone={WIN} />
                              </motion.g>
                            )}
                            {i === candidates.length - 1 && (
                              <text x={mmid(s)} y={y + MH + 14} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                                {s}
                              </text>
                            )}
                          </g>
                        );
                      })}

                      {/* the block slides into this row's slot as one piece */}
                      <motion.g
                        initial={{ x: -(bx2 + 30), opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 70, damping: 17, delay: phase === 1 ? 0.25 + i * 0.35 : 0.1 }}
                        opacity={dead ? 0.55 : 1}
                      >
                        {blockNames.map((n) => (
                          <Rider key={n} cx={mmid(c.group[0][n])} y={y} h={MH} name={n} tone={IND} />
                        ))}
                        <line x1={bx1 + MW} y1={y + MH / 2} x2={bx2 - MW} y2={y + MH / 2} stroke={IND} strokeWidth={2.2} />
                      </motion.g>

                      {/* verdict column — headline and detail both wrapped to the column */}
                      {phase === 2 &&
                        (() => {
                          const head = wrap(dead ? `✗ ${c.killer?.text ?? "breaks a rule"}` : "✓ every rule holds", 29);
                          const seating = c.valid[0]
                            ? names.slice().sort((a, b) => c.valid[0][a] - c.valid[0][b]).map((n) => byName(n)?.short).join(" ")
                            : "";
                          const detail = wrap(dead ? c.detail : seating, 31);
                          return (
                            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.45 }}>
                              {head.map((ln, li) => (
                                <text key={li} x={292} y={y + 8 + li * 10} fontSize="9" fontWeight="800" fill={tone}>
                                  {ln}
                                </text>
                              ))}
                              {detail.map((ln, li) => (
                                <text
                                  key={li}
                                  x={292}
                                  y={y + 9 + head.length * 10 + li * 9.5}
                                  fontSize="8"
                                  fontWeight="700"
                                  fill={dead ? WARN : INK}
                                  fontFamily={dead ? undefined : numberFont}
                                >
                                  {ln}
                                </text>
                              ))}
                            </motion.g>
                          );
                        })()}

                      {/* struck out, drawn across the whole row */}
                      {dead && (
                        <motion.line
                          x1={MX0 - 6}
                          y1={y + MH / 2}
                          x2={mx(slots) + MW + 6}
                          y2={y + MH / 2}
                          stroke={BAD}
                          strokeWidth={2}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, delay: 0.7 + i * 0.45 }}
                        />
                      )}
                      {alive && (
                        <motion.rect
                          x={MX0 - 8}
                          y={y - 6}
                          width={mx(slots) + MW + 16 - MX0}
                          height={MH + 12}
                          rx={7}
                          fill="none"
                          stroke={WIN}
                          strokeWidth={2}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 160, damping: 15, delay: 0.9 }}
                          style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        />
                      )}

                      {/* who is still loose, and where they have to go */}
                      {phase === 2 && dead && c.freePeople.length > 0 && (
                        <motion.text
                          x={(mx(c.freeSlots[0]) + mx(c.freeSlots[c.freeSlots.length - 1]) + MW) / 2}
                          y={y - 5}
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="800"
                          fill={WARN}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + i * 0.45 }}
                        >
                          {c.freePeople.map((p) => p.name).join(" + ")} must fill {c.freeSlots.join(" & ")}
                        </motion.text>
                      )}
                    </g>
                  );
                })}

                <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DIM}>
                  {phase === 1
                    ? `${byName(pivot)?.name} cannot sit at either end without breaking the fixed seats`
                    : `${candidates.length - 1} of the ${candidates.length} places die on a rule`}
                </text>
              </g>
            );
          })()}

        {/* ============ phase 3: the one seating that survives ============ */}
        {phase === 3 && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={INK}>
              one seating is left, and the question wants {unit} {ask}
            </text>

            {/* re-run every rule against the seating that survived */}
            <text x={W / 2} y={38} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM}>
              check it back against all {rules.length} rules
            </text>
            {rules.map((r, i) => {
              const pass = winnerPos ? holds(r, winnerPos) : false;
              return (
                <motion.g key={i} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.14 }}>
                  <text x={96} y={56 + i * 16} fontSize="10.5" fontWeight="800" fill={pass ? WIN : BAD} fontFamily={numberFont}>
                    {pass ? "✓" : "✗"}
                  </text>
                  <text x={114} y={56 + i * 16} fontSize="9.5" fontWeight="700" fill={pass ? INK : BAD}>
                    {r.text}
                  </text>
                </motion.g>
              );
            })}

            <Loco x={14} y={CARY - 10} w={44} h={CARH + 10} />
            {Array.from({ length: slots }, (_, i) => i + 1).map((s) => (
              <g key={s}>
                <Car x={carX(s)} y={CARY} w={CW} h={CARH} tone={s === ask ? WIN : RAIL} fillOpacity={s === ask ? 0.18 : 0.1} />
                <motion.g
                  initial={{ y: -60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 160, damping: 13, delay: 0.2 + (s - 1) * 0.18 }}
                >
                  <text x={carMid(s)} y={CARY + 38} textAnchor="middle" fontSize="22">
                    {byName(seatedName(s))?.icon}
                  </text>
                </motion.g>
                <text x={carMid(s)} y={CARY - 8} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={s === ask ? WIN : INK}>
                  {seatedName(s)}
                </text>
                <text x={carMid(s)} y={CARY + CARH + 26} textAnchor="middle" fontSize="9" fontWeight="700" fill={s === ask ? WIN : DIM} fontFamily={numberFont}>
                  {unit} {s}
                </text>
              </g>
            ))}
            <line x1={8} y1={CARY + CARH + 10} x2={W - 14} y2={CARY + CARH + 10} stroke={RAIL} strokeWidth={2} />

            {/* the asked car, ringed */}
            <motion.rect
              x={carX(ask) - 6}
              y={CARY - 6}
              width={CW + 12}
              height={CARH + 12}
              rx={9}
              fill="none"
              stroke={WIN}
              strokeWidth={2.4}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 170, damping: 14, delay: 1.6 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />

            {/* equal counts either side is exactly what makes it the middle */}
            {ask - 1 === slots - ask &&
              [
                { from: carX(1), to: carX(ask), n: ask - 1, label: "in front" },
                { from: carX(ask) + CW, to: carX(slots) + CW, n: slots - ask, label: "behind" },
              ].map((br) => (
                <motion.g key={br.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>
                  <line x1={br.from} y1={CARY + CARH + 36} x2={br.to} y2={CARY + CARH + 36} stroke={IND} strokeWidth={1.6} />
                  <line x1={br.from} y1={CARY + CARH + 31} x2={br.from} y2={CARY + CARH + 41} stroke={IND} strokeWidth={1.6} />
                  <line x1={br.to} y1={CARY + CARH + 31} x2={br.to} y2={CARY + CARH + 41} stroke={IND} strokeWidth={1.6} />
                  <text x={(br.from + br.to) / 2} y={CARY + CARH + 54} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                    {br.n} {br.label}
                  </text>
                </motion.g>
              ))}
          </g>
        )}
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
          color: phase === 3 ? "#166534" : "#4338ca",
          background: phase === 3 ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${phase === 3 ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {phase === 0
          ? behindRule
            ? `${behindRule.args[0]} is always right behind ${behindRule.args[1]}`
            : "fixed seats first"
          : phase === 1
          ? `${candidates.length} places to try`
          : phase === 2
          ? `only ${byName(pivot)?.name} in ${unit} ${winner?.slot} works`
          : `${unit} ${ask}: ${answerName}`}
      </motion.span>

      {!ok && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
