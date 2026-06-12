import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

interface ParallaxLayerProps {
  /**
   * Depth factor 0–1.
   *   0   = foreground — no movement (anchored)
   *   0.5 = mid — moves at half speed
   *   1   = deep background — maximum movement
   */
  depth?: number;
  /**
   * Max horizontal drift in px at depth=1, default 40
   * Lower = subtler parallax
   */
  panAmountX?: number;
  /**
   * Max vertical drift in px at depth=1, default 20
   */
  panAmountY?: number;
  /**
   * Oscillation speed multiplier, default 1
   */
  speed?: number;
  children?: React.ReactNode;
}

/**
 * ParallaxLayer — wraps content and applies a sinusoidal pan offset
 * scaled by depth. Combine multiple layers at different depths to
 * simulate a 3-D parallax stack.
 *
 * Works best layered with ContinuousDrift at depth=0 (root) so the
 * whole scene has a slow drift, while individual elements drift faster
 * or slower depending on their depth.
 *
 * Usage in Composition.tsx:
 *   <ParallaxLayer depth={0.8}>
 *     <GridBackground ... />
 *   </ParallaxLayer>
 *   <ParallaxLayer depth={0.3}>
 *     <TextPop ... />
 *   </ParallaxLayer>
 */
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  depth = 0.5,
  panAmountX = 40,
  panAmountY = 20,
  speed = 1,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = (frame / fps) * speed;

  // Two slightly offset sine waves give a Lissajous-style drift
  const dx = Math.sin(t * 0.55) * panAmountX * depth;
  const dy = Math.cos(t * 0.38) * panAmountY * depth;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate(${dx}px, ${dy}px)`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};
