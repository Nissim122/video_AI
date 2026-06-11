import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { BRAND } from "../brand";

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

function deterministicRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface TextScrambleProps {
  text: string;
  enterFrame: number;
  /** total frames for all chars to settle */
  duration?: number;
  positionY?: number;
  fontSize?: number;
  color?: string;
}

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  enterFrame,
  duration = 40,
  positionY = 0.5,
  fontSize = 80,
  color = BRAND.blueL,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - enterFrame);

  const opacity = interpolate(elapsed, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const displayed = text.split("").map((char, i) => {
    if (char === " ") return " ";

    // Each character settles left-to-right over the duration
    const settleAt = ((i + 1) / text.length) * duration;
    if (elapsed >= settleAt) return char;

    // Show a different random char every frame
    const seed = elapsed * 7.3 + i * 13.1 + frame * 0.5;
    return POOL[Math.floor(deterministicRandom(seed) * POOL.length)];
  });

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
        opacity,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize,
          color,
          letterSpacing: "0.04em",
          textAlign: "center",
          textShadow: `0 0 40px ${color}55, 0 4px 20px rgba(0,0,0,0.7)`,
        }}
      >
        {displayed.join("")}
      </span>
    </div>
  );
};
