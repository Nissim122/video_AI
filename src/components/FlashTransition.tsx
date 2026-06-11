import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface FlashTransitionProps {
  /** frame at the peak of the flash */
  peakFrame: number;
  durationFrames?: number;
  color?: string;
}

export const FlashTransition: React.FC<FlashTransitionProps> = ({
  peakFrame,
  durationFrames = 12,
  color = "#ffffff",
}) => {
  const frame = useCurrentFrame();
  const half  = durationFrames / 2;

  const opacity =
    frame < peakFrame - half || frame > peakFrame + half
      ? 0
      : frame <= peakFrame
        ? interpolate(frame, [peakFrame - half, peakFrame], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        : interpolate(frame, [peakFrame, peakFrame + half], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: color,
        opacity,
        pointerEvents: "none",
        zIndex: 999,
      }}
    />
  );
};
