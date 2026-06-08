import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface SpringEntranceOptions {
  /** frame to begin the entrance animation */
  start: number;
  /** pixels to travel (positive = from below, negative = from above, default 60) */
  distance?: number;
  /** spring damping (default 14) */
  damping?: number;
  /** spring mass (default 0.85) */
  mass?: number;
  /** spring stiffness (default 120) */
  stiffness?: number;
}

interface SpringEntranceResult {
  translateY: number;
  opacity: number;
  scale: number;
}

/**
 * Returns translateY, opacity, and scale for a spring-based entrance.
 * Usage:
 *   const { translateY, opacity } = useSpringEntrance({ start: 45 });
 *   style={{ transform: `translateY(${translateY}px)`, opacity }}
 */
export function useSpringEntrance({
  start,
  distance = 60,
  damping = 14,
  mass = 0.85,
  stiffness = 120,
}: SpringEntranceOptions): SpringEntranceResult {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - start,
    fps,
    config: { damping, mass, stiffness },
  });

  const translateY = interpolate(progress, [0, 1], [distance, 0]);
  const opacity = interpolate(frame, [start, start + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(progress, [0, 1], [0.92, 1]);

  return { translateY, opacity, scale };
}
