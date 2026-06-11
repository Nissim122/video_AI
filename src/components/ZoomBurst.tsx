import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export interface ZoomBurstEvent {
  frame: number;
  /** peak scale multiplier, default 1.12 */
  scale?: number;
  /** duration in frames, default 14 */
  duration?: number;
}

interface ZoomBurstProps {
  children: React.ReactNode;
  bursts: ZoomBurstEvent[];
}

export const ZoomBurst: React.FC<ZoomBurstProps> = ({ children, bursts }) => {
  const frame = useCurrentFrame();

  let totalScale = 1;

  bursts.forEach((burst) => {
    const elapsed = frame - burst.frame;
    const duration = burst.duration ?? 14;
    const peakScale = burst.scale ?? 1.12;

    if (elapsed < 0 || elapsed > duration) return;

    // Sharp punch in at frame 3, then spring back out
    const s = interpolate(
      elapsed,
      [0, 3, duration],
      [1, peakScale, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    totalScale *= s;
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `scale(${totalScale})`,
        transformOrigin: "center center",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};
