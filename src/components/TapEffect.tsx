import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";
import { ScreenRegion } from "../types";
import { HandPointer, SkinTone } from "./HandPointer";

interface TapEffectProps {
  pos: ScreenRegion;
  startAt: number;
  color?: string;
  skinTone?: SkinTone;
}

// HandPointer rendered at size=80: width=80px, height≈155px
const HAND_W = 80;
const HAND_H = 80 * 1.94; // ≈ 155px

/**
 * Realistic hand tap animation. Fingertip lands on the center of `pos`.
 * Hand approaches from above, presses, releases, ripple on impact.
 */
export const TapEffect: React.FC<TapEffectProps> = ({
  pos,
  startAt,
  color = BRAND.blueL,
  skinTone = "light",
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
  const slideY = interpolate(slideSpring, [0, 1], [-55, 0]);

  const handOpacity = interpolate(frame, [startAt, startAt + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // press down / release
  const pressProgress = interpolate(
    frame,
    [TAP, TAP + 5, TAP + 13],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tapY = interpolate(
    frame,
    [TAP, TAP + 5, TAP + 13],
    [0, 8, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ripple from impact point
  const rippleProgress = interpolate(frame, [TAP + 4, TAP + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rippleScale   = interpolate(rippleProgress, [0, 1], [0.1, 2.6]);
  const rippleOpacity = interpolate(rippleProgress, [0, 0.12, 1], [0, 0.7, 0]);

  // fingertip lands at center of target region
  const cx = `calc(${pos.left} + ${pos.width}  / 2)`;
  const cy = `calc(${pos.top}  + ${pos.height} / 2)`;

  return (
    <>
      {/* Ripple */}
      <div
        style={{
          position: "absolute",
          top: cy,
          left: cx,
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

      {/* Hand — fingertip (bottom-center of SVG) aligned to (cx, cy) */}
      <div
        style={{
          position: "absolute",
          top: cy,
          left: cx,
          marginLeft: -(HAND_W / 2) + 1,
          marginTop: -HAND_H,
          opacity: handOpacity,
          transform: `translateY(${slideY + tapY}px)`,
          pointerEvents: "none",
          filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.5))",
        }}
      >
        <HandPointer pressProgress={pressProgress} skinTone={skinTone} size={HAND_W} />
      </div>
    </>
  );
};
