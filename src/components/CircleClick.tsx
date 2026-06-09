import React from "react";
import { interpolate } from "remotion";
import { BRAND } from "../brand";

interface CircleClickProps {
  /** Logical local frame (f = logical_global - sceneStart) */
  frame: number;
  /** px from top of rendered image (top-left corner of circle) */
  imageY: number;
  /** px from left of rendered image (top-left corner of circle) */
  imageX: number;
  /** diameter in px (default 78) */
  size?: number;
  /** local frame when circle appears */
  startAt: number;
  /** local frames the circle stays visible (fade-in + hold + fade-out) */
  duration: number;
  color?: string;
}

export const CircleClick: React.FC<CircleClickProps> = ({
  frame,
  imageY,
  imageX,
  size = 78,
  startAt,
  duration,
  color = BRAND.blue,
}) => {
  const fadeIn = interpolate(frame, [startAt, startAt + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [startAt + duration - 6, startAt + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;
  const pulse = 0.7 + Math.sin((frame - startAt) * 0.22) * 0.3;

  if (opacity <= 0) return null;

  const hex2 = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");

  return (
    <div
      style={{
        position: "absolute",
        top: imageY,
        left: imageX,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `${color}${hex2(0.28 * opacity)}`,
        border: `4px solid ${color}`,
        boxShadow: `
          0 0 0 8px ${color}${hex2(0.25 * opacity * pulse)},
          0 0 48px ${color}${hex2(0.7 * opacity * pulse)}
        `,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};
