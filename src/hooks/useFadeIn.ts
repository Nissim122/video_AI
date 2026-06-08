import { useCurrentFrame, interpolate } from "remotion";

interface FadeInOptions {
  /** frame at which opacity starts rising */
  start: number;
  /** how many frames to reach full opacity (default 12) */
  duration?: number;
  /** optional: frame to start fading out */
  fadeOutStart?: number;
  /** how many frames to fade out (default 12) */
  fadeOutDuration?: number;
}

/**
 * Returns opacity value for a fade-in (and optional fade-out) animation.
 * Usage: const opacity = useFadeIn({ start: 30 });
 */
export function useFadeIn({
  start,
  duration = 12,
  fadeOutStart,
  fadeOutDuration = 12,
}: FadeInOptions): number {
  const frame = useCurrentFrame();

  if (fadeOutStart !== undefined) {
    return interpolate(
      frame,
      [start, start + duration, fadeOutStart, fadeOutStart + fadeOutDuration],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}
