import React from "react";
import { useCurrentFrame } from "remotion";

export interface WhipPanEvent {
  frame: number;
  direction?: "left" | "right" | "up" | "down";
  /** Total duration in frames. Default 10 */
  duration?: number;
  /** Travel distance & blur strength multiplier. Default 1 */
  intensity?: number;
}

interface WhipPanProps {
  whips: WhipPanEvent[];
  children: React.ReactNode;
}

export const WhipPan: React.FC<WhipPanProps> = ({ whips, children }) => {
  const frame = useCurrentFrame();

  let tx   = 0;
  let ty   = 0;
  let blur = 0;

  whips.forEach((whip) => {
    const dur       = whip.duration  ?? 10;
    const intensity = whip.intensity ?? 1;
    const dir       = whip.direction ?? "right";
    const elapsed   = frame - whip.frame;

    if (elapsed < 0 || elapsed > dur) return;

    const half      = dur / 2;
    const travel    = 280 * intensity;
    const blurPeak  = 20 * intensity;

    let localTx   = 0;
    let localTy   = 0;
    let localBlur = 0;

    if (elapsed <= half) {
      // Phase 1: slam out — ease-in curve
      const p     = elapsed / half;
      const eased = Math.pow(p, 0.35);
      localBlur   = eased * blurPeak;
      if (dir === "right") localTx = -eased * travel;
      if (dir === "left")  localTx =  eased * travel;
      if (dir === "down")  localTy = -eased * travel;
      if (dir === "up")    localTy =  eased * travel;
    } else {
      // Phase 2: slam in from opposite side — ease-out curve
      const p     = (elapsed - half) / half;
      const eased = Math.pow(p, 2);
      localBlur   = (1 - eased) * blurPeak;
      if (dir === "right") localTx =  (1 - eased) * travel;
      if (dir === "left")  localTx = -(1 - eased) * travel;
      if (dir === "down")  localTy =  (1 - eased) * travel;
      if (dir === "up")    localTy = -(1 - eased) * travel;
    }

    tx   += localTx;
    ty   += localTy;
    blur  = Math.max(blur, localBlur);
  });

  const hasMotion = tx !== 0 || ty !== 0 || blur > 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform:  hasMotion ? `translate(${tx}px, ${ty}px)` : undefined,
        filter:     blur > 0  ? `blur(${blur}px)`             : undefined,
        overflow:   "hidden",
      }}
    >
      {children}
    </div>
  );
};
