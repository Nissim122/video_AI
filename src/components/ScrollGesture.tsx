import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";
import { HandPointer, SkinTone } from "./HandPointer";

interface ScrollGestureProps {
  startAt: number;
  direction?: "up" | "down";
  /** horizontal position as % of screen width (default "50%") */
  x?: string;
  /** vertical center of the gesture as % of screen height (default "60%") */
  y?: string;
  skinTone?: SkinTone;
}

// HandPointer at size=80
const HAND_W = 80;
const HAND_H = 80 * 1.94; // ≈ 155px

export const ScrollGesture: React.FC<ScrollGestureProps> = ({
  startAt,
  direction = "up",
  x = "50%",
  y = "60%",
  skinTone = "light",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const DURATION = 28;

  const handOpacity = interpolate(frame, [startAt, startAt + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const slideProgress = spring({
    frame: frame - startAt,
    fps,
    config: { damping: 22, mass: 1.1, stiffness: 90 },
  });

  const travelPx = 120;
  const travel = interpolate(
    slideProgress,
    [0, 1],
    [0, direction === "up" ? -travelPx : travelPx]
  );

  const gestureOpacity = interpolate(
    frame,
    [startAt + DURATION, startAt + DURATION + 10],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Trail dots trailing behind the finger
  const trailCount = 3;

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        // Center on the fingertip position (fingertip = bottom-center of hand SVG)
        marginLeft: -(HAND_W / 2) + 1,
        marginTop: -HAND_H,
        opacity: gestureOpacity,
        pointerEvents: "none",
      }}
    >
      {/* Trail dots behind the fingertip */}
      {Array.from({ length: trailCount }).map((_, i) => {
        const trailDelay = (i + 1) * 6;
        const trailProgress = spring({
          frame: frame - startAt - trailDelay,
          fps,
          config: { damping: 22, mass: 1.1, stiffness: 90 },
        });
        const trailTravel = interpolate(
          trailProgress,
          [0, 1],
          [0, direction === "up" ? -travelPx : travelPx]
        );
        const trailOpacity = interpolate(
          frame,
          [startAt + trailDelay, startAt + trailDelay + 6],
          [0, 0.35 - i * 0.1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              // dots follow the fingertip (bottom center of SVG)
              top: HAND_H,
              left: HAND_W / 2,
              width: 18,
              height: 18,
              marginTop: -9,
              marginLeft: -9,
              borderRadius: "50%",
              background: BRAND.blueL,
              opacity: trailOpacity,
              transform: `translateY(${trailTravel}px)`,
            }}
          />
        );
      })}

      {/* Hand */}
      <div
        style={{
          opacity: handOpacity,
          transform: `translateY(${travel}px)`,
          filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.5))",
        }}
      >
        <HandPointer pressProgress={0.3} skinTone={skinTone} size={HAND_W} />
      </div>
    </div>
  );
};
