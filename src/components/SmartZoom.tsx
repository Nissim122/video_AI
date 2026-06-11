import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface SmartZoomEvent {
  startFrame: number;
  endFrame?: number;
  scale?: number;
  /** Horizontal focus point 0–1 (fraction of width). Default 0.5 */
  focusX?: number;
  /** Vertical focus point 0–1 (fraction of height). Default 0.5 */
  focusY?: number;
  feel?: "snappy" | "smooth" | "bouncy";
}

interface SmartZoomProps {
  events: SmartZoomEvent[];
  children: React.ReactNode;
}

const CONFIGS = {
  snappy: { damping: 28, stiffness: 140, mass: 0.9 },
  smooth: { damping: 22, stiffness: 80,  mass: 1.2 },
  bouncy: { damping: 14, stiffness: 180, mass: 0.7 },
};

export const SmartZoom: React.FC<SmartZoomProps> = ({ events, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let compositeScale = 1;
  let totalFocusX    = 0;
  let totalFocusY    = 0;
  let totalWeight    = 0;

  events.forEach((ev) => {
    const scale = ev.scale ?? 1.25;
    const feel  = ev.feel  ?? "snappy";
    const cfg   = CONFIGS[feel];

    const zoomIn = spring({
      frame: Math.max(0, frame - ev.startFrame),
      fps,
      config: cfg,
    });

    const zoomOut = ev.endFrame != null
      ? spring({ frame: Math.max(0, frame - ev.endFrame), fps, config: cfg })
      : 0;

    const s = interpolate(zoomIn, [0, 1], [1, scale]) - zoomOut * (scale - 1);

    // Weight by how much this event contributes above 1.0 (no zoom = no influence on origin)
    const weight = Math.max(0, s - 1);
    totalFocusX  += (ev.focusX ?? 0.5) * weight;
    totalFocusY  += (ev.focusY ?? 0.5) * weight;
    totalWeight  += weight;

    compositeScale *= s;
  });

  // Weighted blend — when no event is active both default to center
  const blendedX = totalWeight > 0 ? totalFocusX / totalWeight : 0.5;
  const blendedY = totalWeight > 0 ? totalFocusY / totalWeight : 0.5;
  const originX  = `${(blendedX * 100).toFixed(2)}%`;
  const originY  = `${(blendedY * 100).toFixed(2)}%`;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${compositeScale})`,
        transformOrigin: `${originX} ${originY}`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
