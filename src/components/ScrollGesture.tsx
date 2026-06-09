import React from "react";
import { interpolate, Easing } from "remotion";
import { BRAND } from "../brand";

interface ScrollGestureProps {
  frame: number;
  imageY: number;
  imageX: number;
  size?: number;
  startAt: number;
  duration?: number;
  swipeDistance?: number;
  color?: string;
}

export const ScrollGesture: React.FC<ScrollGestureProps> = ({
  frame,
  imageY,
  imageX,
  size = 78,
  startAt,
  duration = 36,
  swipeDistance = 200,
  color = BRAND.blue,
}) => {
  const f = frame - startAt;

  const fadeInEnd = Math.min(6, Math.floor(duration * 0.3));
  const fadeOutStart = Math.max(fadeInEnd + 1, duration - 6);

  const opacity = interpolate(f, [0, fadeInEnd, fadeOutStart, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const swipeProgress = interpolate(f, [fadeInEnd, fadeOutStart], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });

  if (opacity <= 0) return null;

  const hex2 = (v: number) =>
    Math.round(v * 255).toString(16).padStart(2, "0");

  const r = size / 2;
  const circleOffsetY = swipeDistance * swipeProgress;
  const pulse = 0.7 + Math.sin(f * 0.22) * 0.3;

  return (
    <div
      style={{
        position: "absolute",
        top: imageY,
        left: imageX,
        pointerEvents: "none",
        transform: "rotate(180deg)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: r,
          left: r - 2,
          width: 4,
          height: swipeDistance * swipeProgress,
          background: `linear-gradient(to bottom, ${color}, transparent)`,
          opacity: opacity * 0.55,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: circleOffsetY,
          left: 0,
          width: size,
          height: size,
          borderRadius: "50%",
          background: `${color}${hex2(0.28 * opacity)}`,
          border: `4px solid ${color}`,
          boxShadow: `0 0 0 8px ${color}${hex2(0.25 * opacity * pulse)}, 0 0 48px ${color}${hex2(0.7 * opacity * pulse)}`,
          opacity,
        }}
      />
    </div>
  );
};
