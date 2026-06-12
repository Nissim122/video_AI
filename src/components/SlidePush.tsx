import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { Easing } from "remotion";

type Direction = "left" | "right" | "up" | "down";
type Feel = "snappy" | "smooth" | "bouncy";

interface SlidePushProps {
  /**
   * Frame at which the push starts.
   * Outgoing exits and incoming enters simultaneously.
   */
  triggerFrame: number;
  /** Duration of the entire push in frames. Default 18 */
  durationFrames?: number;
  /**
   * Direction the INCOMING scene enters FROM.
   * e.g. "right" → new scene slides in from right, old scene exits to the left.
   * Default: "right"
   */
  direction?: Direction;
  feel?: Feel;
  /** The OUTGOING (current/previous) scene */
  outgoing: React.ReactNode;
  /** The INCOMING (new) scene */
  incoming: React.ReactNode;
}

const EASING: Record<Feel, (t: number) => number> = {
  snappy: Easing.bezier(0.22, 1, 0.36, 1),
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
  bouncy: Easing.bezier(0.34, 1.56, 0.64, 1),
};

export const SlidePush: React.FC<SlidePushProps> = ({
  triggerFrame,
  durationFrames = 18,
  direction = "right",
  feel = "snappy",
  outgoing,
  incoming,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const ease = EASING[feel];

  const progress = interpolate(
    frame,
    [triggerFrame, triggerFrame + durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }
  );

  // Outgoing exits in the OPPOSITE direction from which incoming comes
  // Incoming comes from `direction`, so outgoing exits to the inverse direction
  const offset = (size: number) => size * progress;

  let outTransform = "";
  let inTransform  = "";

  switch (direction) {
    case "right":
      // incoming from right, outgoing exits left
      outTransform = `translateX(${-offset(width)}px)`;
      inTransform  = `translateX(${width - offset(width)}px)`;
      break;
    case "left":
      // incoming from left, outgoing exits right
      outTransform = `translateX(${offset(width)}px)`;
      inTransform  = `translateX(${-width + offset(width)}px)`;
      break;
    case "down":
      // incoming from bottom, outgoing exits top
      outTransform = `translateY(${-offset(height)}px)`;
      inTransform  = `translateY(${height - offset(height)}px)`;
      break;
    case "up":
      // incoming from top, outgoing exits bottom
      outTransform = `translateY(${offset(height)}px)`;
      inTransform  = `translateY(${-height + offset(height)}px)`;
      break;
  }

  const isHorizontal = direction === "left" || direction === "right";

  return (
    // Clip so scenes don't overflow outside the frame
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Outgoing scene */}
      <AbsoluteFill
        style={{
          transform: outTransform,
          // Thin shadow line between panels
          boxShadow: isHorizontal
            ? "4px 0 24px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(0,0,0,0.4)",
        }}
      >
        {outgoing}
      </AbsoluteFill>

      {/* Incoming scene */}
      <AbsoluteFill style={{ transform: inTransform }}>
        {incoming}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
