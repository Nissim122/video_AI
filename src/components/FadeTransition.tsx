import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface FadeTransitionProps {
  /** frame to start fading to black */
  fadeOutFrame: number;
  /** frame to start fading back in (omit for fade-out only) */
  fadeInFrame?: number;
  durationFrames?: number;
  color?: string;
}

export const FadeTransition: React.FC<FadeTransitionProps> = ({
  fadeOutFrame,
  fadeInFrame,
  durationFrames = 18,
  color = "#000000",
}) => {
  const frame = useCurrentFrame();

  const fadeOut = interpolate(frame, [fadeOutFrame, fadeOutFrame + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeIn =
    fadeInFrame != null
      ? interpolate(frame, [fadeInFrame, fadeInFrame + durationFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const opacity = Math.max(fadeOut, fadeIn);

  if (opacity === 0) return null;

  return (
    <AbsoluteFill
      style={{ background: color, opacity, pointerEvents: "none" }}
    />
  );
};
