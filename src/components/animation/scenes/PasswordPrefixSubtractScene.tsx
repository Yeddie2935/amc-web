import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", AMBER = "#d97706", DIM = "#64748b";

/** Lock a forbidden prefix, enumerate its free suffixes, then remove that block from all passwords. */
export function PasswordPrefixSubtractScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const slots = Math.round(num(data.slots, 0)), digitChoices = Math.round(num(data.digitChoices, 0));
  const prefix = typeof data.forbiddenPrefix === "string" ? data.forbiddenPrefix : "";
  const free = slots - prefix.length;
  const all = digitChoices ** slots, forbidden = digitChoices ** free, allowed = all - forbidden;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const choice = problem.choices?.find(c => Number(String(c.text).replace(/,/g, "")) === allowed)?.label;
  const ok = prefix.length < slots && [...prefix].every(d => Number(d) >= 0 && Number(d) < digitChoices) && String(allowed) === problem.shortAnswer && choice === problem.answer;
  const failure = prefix.length >= slots ? `prefix length ${prefix.length} leaves no free suffix` : String(allowed) !== problem.shortAnswer ? `computed ${allowed}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const sx = (i: number) => 101 + i * 66;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 300" width="100%" style={{ width: "100%", maxWidth: "100%", minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "each of four ATM wheels may show any digit 0 through 9" : phase === 1 ? "lock 9–1–1; only the last wheel can still turn" : "remove the ten cards in the forbidden 911_ drawer"}</text>
      {phase < 2 && <><text x="56" y="78" fontSize="26">🏧</text>{Array.from({ length: slots }, (_, i) => { const locked = phase === 1 && i < prefix.length; return <motion.g key={`${phase}-${i}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .1 }}><rect x={sx(i)} y="46" width="52" height="64" rx="9" fill={locked ? "#fee2e2" : "#eef2ff"} stroke={locked ? RED : IND} strokeWidth="2" /><text x={sx(i)+26} y="84" textAnchor="middle" fontSize="25" fontWeight="900" fill={locked ? RED : IND} fontFamily={FONT}>{locked ? prefix[i] : phase === 0 ? "0–9" : "?"}</text><text x={sx(i)+26} y="126" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={locked ? RED : DIM}>{locked ? "LOCKED" : `${digitChoices} choices`}</text></motion.g>; })}
        {phase === 0 && <><g transform="translate(67 166)">{Array.from({ length: slots }, (_, i) => <g key={i}><circle cx={i*104+10} cy="10" r="10" fill={IND} /><text x={i*104+10} y="14" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff">{digitChoices}</text>{i < slots-1 && <text x={i*104+62} y="16" textAnchor="middle" fontSize="18" fontWeight="900" fill={INK}>×</text>}</g>)}</g><motion.rect x="135" y="212" width="190" height="46" rx="12" fill="#eef2ff" stroke={IND} strokeWidth="2" initial={{ scale: .7 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="230" y="241" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>{digitChoices}^{slots} = {all}</text></>}
        {phase === 1 && <><path d="M127 139 H259" stroke={RED} strokeWidth="3" /><text x="193" y="157" textAnchor="middle" fontSize="10" fontWeight="850" fill={RED}>forbidden prefix</text><motion.path d="M325 139 V174" stroke={AMBER} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><text x="325" y="193" textAnchor="middle" fontSize="12" fontWeight="900" fill={AMBER} fontFamily={FONT}>{digitChoices} endings</text><g transform="translate(72 216)">{Array.from({ length: digitChoices }, (_, d) => <motion.g key={d} initial={{ opacity: 0, scale: .5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: d*.045 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x={d*32} width="27" height="35" rx="5" fill="#fff7ed" stroke={AMBER} /><text x={d*32+13.5} y="22" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#92400e" fontFamily={FONT}>{prefix}{d}</text></motion.g>)}</g><text x="230" y="277" textAnchor="middle" fontSize="14" fontWeight="900" fill={RED} fontFamily={FONT}>{digitChoices}^{free} = {forbidden} forbidden</text></>}
      </>}
      {phase === 2 && <><g transform="translate(40 46)"><rect width="380" height="82" rx="14" fill="#eef2ff" stroke={IND} strokeWidth="2" /><text x="190" y="25" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>ALL FOUR-DIGIT PASSWORDS</text><text x="190" y="58" textAnchor="middle" fontSize="25" fontWeight="900" fill={IND} fontFamily={FONT}>{all}</text><motion.rect x="306" y="9" width="58" height="62" rx="9" fill="#fee2e2" stroke={RED} strokeWidth="2" initial={{ x: 0 }} animate={{ x: 42, opacity: .2 }} transition={{ duration: .8 }} /><text x="335" y="36" textAnchor="middle" fontSize="12" fontWeight="900" fill={RED} fontFamily={FONT}>911_</text><text x="335" y="55" textAnchor="middle" fontSize="11" fontWeight="900" fill={RED}>−{forbidden}</text></g>
        <g transform="translate(82 153)">{Array.from({ length: digitChoices }, (_, d) => <motion.g key={d} initial={{ opacity: 1, x: 0 }} animate={{ opacity: .18, x: 245 }} transition={{ delay: d*.04 }}><rect x={(d%5)*50} y={Math.floor(d/5)*42} width="43" height="33" rx="5" fill="#fee2e2" stroke={RED} /><text x={(d%5)*50+21.5} y={Math.floor(d/5)*42+21} textAnchor="middle" fontSize="10" fontWeight="900" fill={RED} fontFamily={FONT}>{prefix}{d}</text></motion.g>)}</g>
        <motion.rect x="125" y="226" width="210" height="47" rx="13" fill="#dcfce7" stroke={ok ? GREEN : RED} strokeWidth="2.3" initial={{ scale: .65 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="230" y="256" textAnchor="middle" fontSize="20" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{all} − {forbidden} = {allowed}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={400} y={264} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="294" textAnchor="middle" fill={RED} fontSize="10">{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
