import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const ORANGE = "#f59e0b";
const RED = "#dc2626";
const DIM = "#94a3b8";

/**
 * The L-shaped polygon ABCDEF is the outer AB-by-BC rectangle with a
 * DE-by-EF notch cut from the bottom-left; DE is found first, then the
 * area equation solves for EF.
 * Data: { AB: 8, BC: 9, FA: 5, area: 52 }.
 */
export function LShapeNotchAreaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const AB = num(data.AB, 8);
  const BC = num(data.BC, 9);
  const FA = num(data.FA, 5);
  const area = num(data.area, 52);

  const DE = BC - FA;
  const outerArea = AB * BC;
  const EF = (outerArea - area) / DE;
  const total = DE + EF;

  const isFinal = step >= totalSteps - 1;
  const showDE = step >= 1;
  const showNotch = step >= 2;

  const U = 12; // px per unit
  const X0 = 40;
  const Y0 = 15;
  const W = AB * U;
  const H = BC * U;
  const notchW = 0.42 * W; // schematic width, not to scale — EF itself is the unknown being solved
  const notchH = DE * U;

  // Polygon path: A(top-left) B(top-right) C(bottom-right) D E F back to A.
  const A = { x: X0, y: Y0 };
  const B = { x: X0 + W, y: Y0 };
  const C = { x: X0 + W, y: Y0 + H };
  const D = { x: X0 + notchW, y: Y0 + H };
  const E = { x: X0 + notchW, y: Y0 + H - notchH };
  const F = { x: X0, y: Y0 + H - notchH };

  const outline = `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y} ${E.x},${E.y} ${F.x},${F.y}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? `polygon ABCDEF, area ${area}`
          : isFinal
            ? "solve for EF, then add DE + EF"
            : showNotch
              ? "outer rectangle minus the notch equals the area"
              : "find DE from the two heights"}
      </div>

      <svg viewBox="0 0 210 145" width="100%" style={{ maxWidth: 220 }}>
        {showNotch && (
          <rect x={X0} y={Y0} width={W} height={H} fill="none" stroke={DIM} strokeWidth="1.2" strokeDasharray="4 3" />
        )}

        <polygon points={outline} fill="#f8fafc" stroke={INK} strokeWidth="2" />

        {[
          { p: A, t: "A", dx: -8, dy: -4 },
          { p: B, t: "B", dx: 8, dy: -4 },
          { p: C, t: "C", dx: 8, dy: 12 },
          { p: D, t: "D", dx: 0, dy: 16 },
          { p: E, t: "E", dx: -4, dy: -8 },
          { p: F, t: "F", dx: -8, dy: 4 },
        ].map(({ p, t, dx, dy }) => (
          <text key={t} x={p.x + dx} y={p.y + dy} textAnchor="middle" fontSize="10.5" fontWeight="900" fill={INK} fontFamily={FONT}>
            {t}
          </text>
        ))}

        <text x={(A.x + B.x) / 2} y={A.y - 6} textAnchor="middle" fontSize="10" fontWeight="800" fill={ORANGE} fontFamily={FONT}>
          {AB}
        </text>
        <text x={B.x + 8} y={(B.y + C.y) / 2} fontSize="10" fontWeight="800" fill={ORANGE} fontFamily={FONT}>
          {BC}
        </text>
        <text x={A.x - 12} y={(A.y + F.y) / 2} fontSize="10" fontWeight="800" fill={ORANGE} fontFamily={FONT}>
          {FA}
        </text>

        <AnimatePresence>
          {showDE && (
            <motion.text key="de" x={D.x + 6} y={(D.y + E.y) / 2} fontSize="10" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {DE}
            </motion.text>
          )}
        </AnimatePresence>

        {showNotch && (
          <>
            <rect x={X0} y={Y0 + H - notchH} width={notchW} height={notchH} fill={RED} fillOpacity="0.18" stroke={RED} strokeWidth="1.4" strokeDasharray="3 2" />
            <text x={X0 + notchW / 2} y={(E.y + F.y) / 2 - 4} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={RED} fontFamily={FONT}>
              EF
            </text>
          </>
        )}
      </svg>

      {showNotch && (
        <div style={{ textAlign: "center", fontSize: 11, fontWeight: 800, color: DIM, fontFamily: FONT }}>
          {outerArea} − {DE} × EF = {area}
        </div>
      )}

      {isFinal && (
        <div style={{ textAlign: "center", fontSize: 13, fontWeight: 900, color: IND, fontFamily: FONT, marginTop: 2 }}>
          EF = {EF}, DE + EF = {total}
        </div>
      )}

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 2 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
