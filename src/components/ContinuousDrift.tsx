import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

interface ContinuousDriftProps {
  children: React.ReactNode;
  enabled?: boolean;
  mode?: "pan" | "zoom" | "both";
  /** Max pixel offset for pan oscillation. Default 12 */
  panAmount?: number;
  /** Extra scale on top of 1.0 added by zoom breathing. Default 0.04 */
  zoomAmount?: number;
  /** Oscillation speed multiplier. Default 1 */
  speed?: number;
}

export const ContinuousDrift: React.FC<ContinuousDriftProps> = ({
  children,
  enabled = true,
  mode = "both",
  panAmount = 12,
  zoomAmount = 0.04,
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!enabled) return <AbsoluteFill>{children}</AbsoluteFill>;

  // Two lissajous-like frequencies so the drift never perfectly repeats
  const t = (frame / fps) * speed;

  const tx   = mode !== "zoom" ? Math.sin(t * 0.31 * Math.PI) * panAmount         : 0;
  const ty   = mode !== "zoom" ? Math.sin(t * 0.19 * Math.PI + 1.2) * panAmount * 0.55 : 0;
  const zoom = mode !== "pan"  ? 1 + Math.sin(t * 0.23 * Math.PI + 0.8) * zoomAmount  : 1;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${zoom}) translate(${tx}px, ${ty}px)`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
