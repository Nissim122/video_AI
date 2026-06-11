import React from "react";
import { useCurrentFrame } from "remotion";

interface GlitchCutProps {
  /** frame when glitch starts */
  triggerFrame: number;
  durationFrames?: number;
  /** 0–2, default 1 */
  intensity?: number;
  children?: React.ReactNode;
}

export const GlitchCut: React.FC<GlitchCutProps> = ({
  triggerFrame,
  durationFrames = 8,
  intensity = 1,
  children,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - triggerFrame;

  if (elapsed < 0 || elapsed >= durationFrames) return <>{children}</>;

  const p    = elapsed / durationFrames;
  const seed = elapsed * 7919;
  const fx   = ((seed % 40) - 20) * intensity * (1 - p);
  const fy   = (((seed * 13) % 20) - 10) * intensity * (1 - p);
  const skew = (((seed * 7) % 10) - 5) * intensity * (1 - p);
  const rOff = fx * 0.4 * intensity;
  const bOff = -fx * 0.3 * intensity;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* Red channel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${rOff}px, ${fy * 0.3}px) skewX(${skew * 0.5}deg)`,
          mixBlendMode: "screen",
          opacity: 0.5,
          filter: "url(#glitch-r)",
        }}
      >
        {children}
      </div>
      {/* Blue channel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${bOff}px, 0)`,
          mixBlendMode: "screen",
          opacity: 0.5,
          filter: "hue-rotate(200deg)",
        }}
      >
        {children}
      </div>
      {/* Main */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${fx * 0.15}px, ${fy * 0.1}px) skewX(${skew * 0.2}deg)`,
        }}
      >
        {children}
      </div>
      {/* Scan lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 4px)",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
