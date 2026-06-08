import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";
import { ScreenRegion } from "../screens/screen-1-pain.coords";

interface TapEffectProps {
  pos: ScreenRegion;
  startAt: number;
  color?: string;
}

/**
 * Renders an animated finger tap: slides in from below, presses down, releases,
 * and emits a ripple. Place inside the IPhone14 screen area.
 */
export const TapEffect: React.FC<TapEffectProps> = ({
  pos,
  startAt,
  color = BRAND.blueL,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TAP = startAt + 14;

  // slide in from above
  const slideSpring = spring({
    frame: frame - startAt,
    fps,
    config: { damping: 18, mass: 0.75, stiffness: 160 },
  });
  const slideY = interpolate(slideSpring, [0, 1], [-40, 0]);
  const handOpacity = interpolate(frame, [startAt, startAt + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // press down / release
  const tapY = interpolate(
    frame,
    [TAP, TAP + 5, TAP + 13],
    [0, 9, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tapScale = interpolate(
    frame,
    [TAP, TAP + 5, TAP + 13],
    [1, 0.84, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ripple
  const rippleProgress = interpolate(frame, [TAP + 4, TAP + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rippleScale = interpolate(rippleProgress, [0, 1], [0.1, 2.6]);
  const rippleOpacity = interpolate(rippleProgress, [0, 0.12, 1], [0, 0.7, 0]);

  // center of the target region
  const centerLeft = `calc(${pos.left} + ${pos.width} / 2)`;
  const centerTop  = `calc(${pos.top}  + ${pos.height} / 2)`;

  return (
    <>
      {/* Ripple */}
      <div
        style={{
          position: "absolute",
          top: centerTop,
          left: centerLeft,
          width: 60,
          height: 60,
          marginTop: -30,
          marginLeft: -30,
          borderRadius: "50%",
          background: color,
          opacity: rippleOpacity,
          transform: `scale(${rippleScale})`,
          pointerEvents: "none",
        }}
      />

      {/* Finger pointing down — SVG replaces emoji for reliable Remotion rendering */}
      <div
        style={{
          position: "absolute",
          top: centerTop,
          left: centerLeft,
          marginTop: -64,
          marginLeft: -22,
          opacity: handOpacity,
          transform: `translateY(${slideY + tapY}px) scale(${tapScale})`,
          pointerEvents: "none",
          filter: "drop-shadow(0 3px 12px rgba(0,0,0,0.55)) drop-shadow(0 0 18px rgba(33,150,176,0.4))",
        }}
      >
        <svg width="44" height="68" viewBox="0 0 44 68" fill="none">
          {/* Fist — curled fingers */}
          <rect x="4" y="0" width="36" height="30" rx="12" fill="white"/>
          {/* Thumb */}
          <rect x="0" y="4" width="11" height="22" rx="5.5" fill="white"/>
          {/* Index finger extending downward */}
          <rect x="14" y="20" width="16" height="44" rx="8" fill="white"/>
        </svg>
      </div>
    </>
  );
};
