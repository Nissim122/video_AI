import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

interface ScrollGestureProps {
  startAt: number;
  direction?: "up" | "down";
  /** horizontal position as % of screen width (default "50%") */
  x?: string;
  /** vertical center of the gesture as % of screen height (default "60%") */
  y?: string;
  color?: string;
}

export const ScrollGesture: React.FC<ScrollGestureProps> = ({
  startAt,
  direction = "up",
  x = "50%",
  y = "60%",
  color = BRAND.blueL,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const DURATION = 28; // frames for the swipe gesture

  // appear
  const handOpacity = interpolate(frame, [startAt, startAt + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // slide spring — finger travels 120px in the given direction
  const slideProgress = spring({
    frame: frame - startAt,
    fps,
    config: { damping: 22, mass: 1.1, stiffness: 90 },
  });

  const travelPx = 120;
  const travel = interpolate(slideProgress, [0, 1], [0, direction === "up" ? -travelPx : travelPx]);

  // trail dots — 3 dots that follow behind the finger
  const trailCount = 3;

  // fade out near the end
  const gestureOpacity = interpolate(
    frame,
    [startAt + DURATION, startAt + DURATION + 10],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        transform: "translate(-50%, -50%)",
        opacity: gestureOpacity,
        pointerEvents: "none",
      }}
    >
      {/* Trail dots */}
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
              top: 0,
              left: 0,
              width: 18,
              height: 18,
              marginTop: -9,
              marginLeft: -9,
              borderRadius: "50%",
              background: color,
              opacity: trailOpacity,
              transform: `translateY(${trailTravel}px)`,
            }}
          />
        );
      })}

      {/* Finger */}
      <div
        style={{
          opacity: handOpacity,
          transform: `translateY(${travel}px)`,
          fontSize: 44,
          lineHeight: 1,
          userSelect: "none",
          // flip emoji if scrolling down
          display: "inline-block",
          rotate: direction === "down" ? "180deg" : "0deg",
        }}
      >
        👆
      </div>
    </div>
  );
};
