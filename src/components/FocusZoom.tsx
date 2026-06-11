import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface FocusZoomProps {
  children: React.ReactNode;
  /** Frame to start zooming in */
  zoomFrame: number;
  /** Horizontal focal point, 0–1 (default 0.5 = center) */
  focusX?: number;
  /** Vertical focal point, 0–1 (default 0.5 = center) */
  focusY?: number;
  /** Target zoom scale (default 2) */
  scale?: number;
  /** Frames to stay zoomed before unzooming (0 = stay forever) */
  holdFrames?: number;
  feel?: "snappy" | "smooth" | "bouncy";
}

const SPRING_CONFIGS = {
  snappy: { damping: 22, stiffness: 220, mass: 0.8 },
  smooth: { damping: 32, stiffness: 100, mass: 1.3 },
  bouncy: { damping: 11, stiffness: 200, mass: 0.9 },
};

export const FocusZoom: React.FC<FocusZoomProps> = ({
  children,
  zoomFrame,
  focusX = 0.5,
  focusY = 0.5,
  scale = 2,
  holdFrames = 0,
  feel = "smooth",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cfg = SPRING_CONFIGS[feel];

  const zoomIn = spring({
    frame: Math.max(0, frame - zoomFrame),
    fps,
    config: cfg,
  });

  const zoomOut =
    holdFrames > 0
      ? spring({
          frame: Math.max(0, frame - (zoomFrame + holdFrames)),
          fps,
          config: cfg,
        })
      : 0;

  // zoomIn-zoomOut: 0 → 1 (zooming in) → stays 1 → back to 0 (zooming out)
  const progress = interpolate(zoomIn - zoomOut, [0, 1], [1, scale], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: `${focusX * 100}% ${focusY * 100}%`,
        transform: `scale(${progress})`,
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
  );
};
