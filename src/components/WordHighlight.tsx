import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

interface WordHighlightProps {
  words: string[];
  startFrame: number;
  /** frames between each word highlight */
  frameBetween?: number;
  positionY?: number;
  fontSize?: number;
  highlightColor?: string;
}

export const WordHighlight: React.FC<WordHighlightProps> = ({
  words,
  startFrame,
  frameBetween = 22,
  positionY = 0.5,
  fontSize = 68,
  highlightColor = BRAND.pink,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = Math.max(0, frame - startFrame);
  const currentIndex = Math.floor(elapsed / frameBetween);

  const containerOpacity = interpolate(elapsed, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
        flexWrap: "wrap",
        gap: "0 18px",
        padding: "0 80px",
        opacity: containerOpacity,
        pointerEvents: "none",
        direction: "rtl",
      }}
    >
      {words.map((word, i) => {
        const wordEnterFrame = startFrame + i * frameBetween;
        const isActive = currentIndex === i;
        const isPast = currentIndex > i;

        const highlightP = spring({
          frame: Math.max(0, frame - wordEnterFrame),
          fps,
          config: { damping: 18, stiffness: 340, mass: 0.45 },
        });

        // Bar grows right-to-left (RTL) under the active word
        const scaleX = isActive ? highlightP : isPast ? 1 : 0;

        return (
          <span
            key={i}
            style={{ position: "relative", display: "inline-block" }}
          >
            {/* Highlight bar */}
            <span
              style={{
                position: "absolute",
                bottom: 4,
                left: 0,
                right: 0,
                height: "35%",
                background: `${highlightColor}44`,
                borderRadius: 6,
                transform: `scaleX(${scaleX})`,
                transformOrigin: "right center",
              }}
            />
            <span
              style={{
                fontFamily: "'Heebo', sans-serif",
                fontWeight: 800,
                fontSize,
                position: "relative",
                color: isActive
                  ? highlightColor
                  : isPast
                  ? BRAND.subtle
                  : BRAND.text,
                textShadow: isActive
                  ? `0 0 35px ${highlightColor}77`
                  : "0 2px 14px rgba(0,0,0,0.6)",
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </div>
  );
};
