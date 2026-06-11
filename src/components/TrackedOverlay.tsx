import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from "remotion";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrackPoint {
  frame: number;
  detected: boolean;
  x: number;
  y: number;
}

export interface TrackingData {
  landmark: string;
  fps: number;
  width: number;
  height: number;
  frames: TrackPoint[];
}

export interface TrackedPosition {
  x: number;
  y: number;
  detected: boolean;
}

interface TrackedOverlayProps {
  /** Tracking data imported from JSON — see tools/track_hands.py */
  data: TrackingData;
  /** Global frame to start showing the overlay */
  enterFrame?: number;
  /** Global frame to stop showing the overlay */
  exitFrame?: number;
  /** Pixel offset from tracked point */
  offsetX?: number;
  offsetY?: number;
  /** Keep rendering even when the hand is not detected (default: false) */
  showWhenLost?: boolean;
  /** Render prop — receives live tracked {x, y, detected} coordinates */
  children: (pos: TrackedPosition) => React.ReactNode;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPosition(
  frames: TrackPoint[],
  frame: number,
  scaleX: number,
  scaleY: number
): TrackedPosition {
  if (!frames.length) return { x: 0, y: 0, detected: false };

  const clamped = Math.max(0, Math.min(frame, frames.length - 1));
  const loIdx = Math.floor(clamped);
  const hiIdx = Math.min(loIdx + 1, frames.length - 1);
  const t = clamped - loIdx;

  const lo = frames[loIdx];
  const hi = frames[hiIdx];

  return {
    x: (lo.x + (hi.x - lo.x) * t) * scaleX,
    y: (lo.y + (hi.y - lo.y) * t) * scaleY,
    detected: lo.detected || hi.detected,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Positions children at a tracked hand landmark coordinate on every frame.
 *
 * Usage in VideoOverlay:
 *   import trackingData from "../tracking/my-video.json";
 *
 *   <TrackedOverlay data={trackingData} enterFrame={60} exitFrame={180}>
 *     {({ x, y }) => (
 *       <Callout arrowX={x} arrowY={y} text="שים לב!" side="right" enterFrame={0} holdFrames={9999} />
 *     )}
 *   </TrackedOverlay>
 */
export const TrackedOverlay: React.FC<TrackedOverlayProps> = ({
  data,
  enterFrame = 0,
  exitFrame,
  offsetX = 0,
  offsetY = 0,
  showWhenLost = false,
  children,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const scaleX = width / data.width;
  const scaleY = height / data.height;

  const pos = getPosition(data.frames, frame, scaleX, scaleY);

  const inRange =
    frame >= enterFrame && (exitFrame === undefined || frame < exitFrame);
  const visible = inRange && (pos.detected || showWhenLost);

  const fadeIn = interpolate(frame - enterFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = exitFrame
    ? interpolate(frame, [exitFrame - 8, exitFrame], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const opacity = visible ? Math.min(fadeIn, fadeOut) : 0;
  if (opacity === 0) return null;

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {children({ x: pos.x + offsetX, y: pos.y + offsetY, detected: pos.detected })}
    </AbsoluteFill>
  );
};
