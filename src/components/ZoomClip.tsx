import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface ZoomClipProps {
  /** frame to start zoom-in */
  startFrame: number;
  /** target scale, e.g. 1.25 */
  scale?: number;
  /** frames to hold zoom before zooming back out (0 = stay zoomed) */
  holdFrames?: number;
  /** origin point, default center */
  originX?: string;
  originY?: string;
  children: React.ReactNode;
}

export const ZoomClip: React.FC<ZoomClipProps> = ({
  startFrame,
  scale = 1.2,
  holdFrames = 0,
  originX = "50%",
  originY = "50%",
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoomIn = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 28, stiffness: 120, mass: 1 },
  });

  const zoomOut =
    holdFrames > 0
      ? spring({
          frame: Math.max(0, frame - (startFrame + holdFrames)),
          fps,
          config: { damping: 28, stiffness: 120, mass: 1 },
        })
      : 0;

  const currentScale = interpolate(zoomIn, [0, 1], [1, scale]) - zoomOut * (scale - 1);

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${currentScale})`,
        transformOrigin: `${originX} ${originY}`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
