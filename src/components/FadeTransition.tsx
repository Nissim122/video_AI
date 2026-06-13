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

  let opacity = 0;

  if (fadeInFrame != null) {
    // Fade-in-out bridge: black → visible → black (or black → visible only)
    if (frame >= fadeInFrame + durationFrames) {
      // After fade-in completes: transparent
      opacity = 0;
    } else if (frame >= fadeInFrame) {
      // Fading back from black to visible
      opacity = interpolate(frame, [fadeInFrame, fadeInFrame + durationFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else if (frame >= fadeOutFrame + durationFrames) {
      // Bridging: fully black between fade-out end and fade-in start
      opacity = 1;
    } else {
      // Fading to black
      opacity = interpolate(frame, [fadeOutFrame, fadeOutFrame + durationFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  } else {
    // Fade-out only: stays black forever after completion
    opacity = interpolate(frame, [fadeOutFrame, fadeOutFrame + durationFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  if (opacity === 0) return null;

  return (
    <AbsoluteFill
      style={{ background: color, opacity, pointerEvents: "none" }}
    />
  );
};
