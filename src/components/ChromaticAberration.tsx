import React from "react";
import { useCurrentFrame } from "remotion";

export interface CAEvent {
  /** frame when the burst starts */
  frame: number;
  /** strength multiplier 0–4, default 2 */
  intensity?: number;
  /** duration in frames, default 10 */
  duration?: number;
}

interface ChromaticAberrationProps {
  /** always-on subtle base intensity (px), default 0.8 */
  baseIntensity?: number;
  /** burst events at specific frames */
  events?: CAEvent[];
  children?: React.ReactNode;
}

export const ChromaticAberration: React.FC<ChromaticAberrationProps> = ({
  baseIntensity = 0.8,
  events = [],
  children,
}) => {
  const frame = useCurrentFrame();

  // Calculate extra intensity from any active events
  let burstIntensity = 0;
  for (const ev of events) {
    const { frame: evFrame, intensity = 2, duration = 10 } = ev;
    const elapsed = frame - evFrame;
    if (elapsed < 0 || elapsed >= duration) continue;

    // Sharp in, smooth decay
    const progress = elapsed / duration;
    const curve = 1 - Math.pow(progress, 0.6);
    burstIntensity = Math.max(burstIntensity, intensity * curve);
  }

  const totalPx = baseIntensity + burstIntensity * 8;

  if (totalPx < 0.1) return <>{children}</>;

  // Tiny scale difference between channels creates fringe
  const rScale = 1 + (totalPx / 1080) * 1.2;
  const bScale = 1 - (totalPx / 1080) * 0.9;

  const filterId = `ca-${Math.round(totalPx * 10)}`;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id={`${filterId}-r`}>
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
          <filter id={`${filterId}-b`}>
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>

      {/* Red channel — slightly larger */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${rScale})`,
          transformOrigin: "center center",
          filter: `url(#${filterId}-r)`,
          mixBlendMode: "screen",
          opacity: 0.55,
        }}
      >
        {children}
      </div>

      {/* Blue channel — slightly smaller */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${bScale})`,
          transformOrigin: "center center",
          filter: `url(#${filterId}-b)`,
          mixBlendMode: "screen",
          opacity: 0.55,
        }}
      >
        {children}
      </div>

      {/* Green/main channel */}
      <div style={{ position: "absolute", inset: 0 }}>
        {children}
      </div>
    </div>
  );
};
