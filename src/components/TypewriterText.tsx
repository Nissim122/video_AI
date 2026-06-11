import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { BRAND } from "../brand";

interface TypewriterTextProps {
  text: string;
  enterFrame: number;
  /** chars revealed per frame, default 0.6 */
  speed?: number;
  holdFrames?: number;
  fontSize?: number;
  positionY?: number;
  color?: string;
  showCursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  enterFrame,
  speed = 0.6,
  holdFrames = 60,
  fontSize = 72,
  positionY = 0.5,
  color = BRAND.text,
  showCursor = true,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - enterFrame);
  const totalTypeDuration = Math.ceil(text.length / speed);

  const charsToShow = Math.min(text.length, Math.floor(elapsed * speed));
  const visible = text.slice(0, charsToShow);

  const exitStart = enterFrame + totalTypeDuration + holdFrames;
  const opacity =
    frame < enterFrame
      ? 0
      : frame < exitStart
      ? interpolate(elapsed, [0, 8], [0, 1], { extrapolateRight: "clamp" })
      : interpolate(frame, [exitStart, exitStart + 15], [1, 0], {
          extrapolateRight: "clamp",
        });

  // Blink cursor every 15 frames while typing or holding
  const cursorVisible =
    showCursor &&
    frame >= enterFrame &&
    frame < exitStart &&
    Math.floor(frame / 15) % 2 === 0;

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
        direction: "rtl",
      }}
    >
      <span
        style={{
          fontFamily: "'Heebo', sans-serif",
          fontWeight: 800,
          fontSize,
          color,
          textAlign: "center",
          lineHeight: 1.35,
          textShadow: "0 4px 30px rgba(0,0,0,0.7)",
        }}
      >
        {visible}
        {cursorVisible && (
          <span
            style={{
              color: BRAND.blueL,
              fontWeight: 300,
              marginRight: 3,
            }}
          >
            |
          </span>
        )}
      </span>
    </div>
  );
};
