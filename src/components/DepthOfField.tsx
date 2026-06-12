import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export interface DOFEvent {
  /** frame when blur starts fading in */
  startFrame: number;
  /** frame when blur is fully gone */
  endFrame: number;
  /** blur strength in px, default 12 */
  blurAmount?: number;
  /** vignette edge darkening 0–1, default 0.35 */
  vignetteEdge?: number;
}

interface DepthOfFieldProps {
  events?: DOFEvent[];
  children?: React.ReactNode;
}

export const DepthOfField: React.FC<DepthOfFieldProps> = ({
  events = [],
  children,
}) => {
  const frame = useCurrentFrame();

  let totalBlur = 0;
  let maxVignette = 0;

  for (const ev of events) {
    const {
      startFrame,
      endFrame,
      blurAmount = 12,
      vignetteEdge = 0.35,
    } = ev;

    if (frame > endFrame) continue;

    const fadeIn = interpolate(frame, [startFrame, startFrame + 18], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(frame, [endFrame - 18, endFrame], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const opacity = fadeIn * fadeOut;

    totalBlur = Math.max(totalBlur, blurAmount * opacity);
    maxVignette = Math.max(maxVignette, vignetteEdge * opacity);
  }

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Content layer — blurred */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: totalBlur > 0 ? `blur(${totalBlur}px)` : undefined,
          transition: "filter 0ms",
        }}
      >
        {children}
      </div>

      {/* Radial vignette to sell the DOF bokeh edge */}
      {maxVignette > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `radial-gradient(ellipse at 50% 50%,
              transparent 30%,
              rgba(0,0,0,${maxVignette * 0.6}) 70%,
              rgba(0,0,0,${maxVignette}) 100%)`,
          }}
        />
      )}
    </div>
  );
};
