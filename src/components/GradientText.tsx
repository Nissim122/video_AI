import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { BRAND } from "../brand";

interface GradientTextProps {
  text: string;
  enterFrame: number;
  holdFrames?: number;
  positionY?: number;
  fontSize?: number;
  /** pixels the gradient shifts per frame */
  speed?: number;
}

export const GradientText: React.FC<GradientTextProps> = ({
  text,
  enterFrame,
  holdFrames = 90,
  positionY = 0.5,
  fontSize = 88,
  speed = 1.8,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - enterFrame);

  const fadeIn = interpolate(elapsed, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitStart = enterFrame + holdFrames;
  const fadeOut =
    frame > exitStart
      ? interpolate(frame, [exitStart, exitStart + 15], [1, 0], {
          extrapolateRight: "clamp",
        })
      : 1;

  // Move background-position to animate the gradient sweep
  const pos = (elapsed * speed) % 200;

  return (
    <div
      style={{
        position: "absolute",
        top: `${positionY * 100}%`,
        left: 0,
        right: 0,
        transform: "translateY(-50%)",
        display: "flex",
        justifyContent: "center",
        padding: "0 80px",
        opacity: fadeIn * fadeOut,
        pointerEvents: "none",
        direction: "rtl",
      }}
    >
      <span
        style={{
          fontFamily: "'Heebo', sans-serif",
          fontWeight: 900,
          fontSize,
          textAlign: "center",
          lineHeight: 1.2,
          background: `linear-gradient(90deg,
            ${BRAND.blue} 0%,
            ${BRAND.blueL} 25%,
            ${BRAND.pink} 50%,
            ${BRAND.blueL} 75%,
            ${BRAND.blue} 100%
          )`,
          backgroundSize: "200% 100%",
          backgroundPosition: `${pos}% 50%`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 4px 20px rgba(33,150,176,0.45))",
        }}
      >
        {text}
      </span>
    </div>
  );
};
