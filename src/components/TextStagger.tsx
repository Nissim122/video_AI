import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

export type StaggerAnimation = "rise" | "drop" | "pop" | "spin";

interface TextStaggerProps {
  text: string;
  enterFrame: number;
  /** frames between each letter */
  stagger?: number;
  animation?: StaggerAnimation;
  fontSize?: number;
  positionY?: number;
  color?: string;
  /** zero-based indices of letters to colorize with accentColor */
  accentIndices?: number[];
  accentColor?: string;
}

export const TextStagger: React.FC<TextStaggerProps> = ({
  text,
  enterFrame,
  stagger = 3,
  animation = "rise",
  fontSize = 96,
  positionY = 0.42,
  color = BRAND.text,
  accentIndices = [],
  accentColor = BRAND.pink,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        top: `${positionY * 100}%`,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        transform: "translateY(-50%)",
        direction: "rtl",
        flexWrap: "wrap",
        padding: "0 60px",
        pointerEvents: "none",
      }}
    >
      {text.split("").map((letter, i) => {
        const p = spring({
          frame: Math.max(0, frame - (enterFrame + i * stagger)),
          fps,
          config: { damping: 14, stiffness: 250, mass: 0.6 },
        });

        let transform = "";
        let opacity = 1;

        if (animation === "rise") {
          transform = `translateY(${interpolate(p, [0, 1], [40, 0])}px)`;
          opacity = interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
        } else if (animation === "drop") {
          transform = `translateY(${interpolate(p, [0, 1], [-40, 0])}px)`;
          opacity = interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
        } else if (animation === "pop") {
          const scale = interpolate(p, [0, 0.5, 0.8, 1], [0, 1.3, 0.9, 1], { extrapolateRight: "clamp" });
          transform = `scale(${scale})`;
          opacity = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
        } else if (animation === "spin") {
          const rot = interpolate(p, [0, 1], [-90, 0]);
          const scale = interpolate(p, [0, 0.6, 1], [0, 1.1, 1], { extrapolateRight: "clamp" });
          transform = `rotateX(${rot}deg) scale(${scale})`;
          opacity = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
        }

        const isAccent = accentIndices.includes(i);

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform,
              opacity,
              transformOrigin: "center bottom",
              fontFamily: "'Heebo', sans-serif",
              fontWeight: 900,
              fontSize,
              color: isAccent ? accentColor : color,
              textShadow: isAccent
                ? `0 0 30px ${accentColor}88`
                : "0 2px 12px rgba(0,0,0,0.7)",
            }}
          >
            {letter === " " ? " " : letter}
          </span>
        );
      })}
    </div>
  );
};
