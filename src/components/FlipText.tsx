import React from "react";
import { useCurrentFrame } from "remotion";
import { BRAND } from "../brand";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

interface FlipTextProps {
  text: string;
  enterFrame: number;
  /** frames between each character starting to flip */
  stagger?: number;
  /** frames each character spends flipping */
  flipDuration?: number;
  fontSize?: number;
  positionY?: number;
  color?: string;
}

export const FlipText: React.FC<FlipTextProps> = ({
  text,
  enterFrame,
  stagger = 4,
  flipDuration = 20,
  fontSize = 96,
  positionY = 0.42,
  color = BRAND.text,
}) => {
  const frame = useCurrentFrame();

  const chars = text.split("").map((char, i) => {
    const charStart = enterFrame + i * stagger;
    const elapsed = frame - charStart;
    if (elapsed < 0) return " ";
    if (elapsed >= flipDuration) return char;
    const seed = Math.floor(elapsed * 7.3 + i * 13.7) % CHARS.length;
    const progress = elapsed / flipDuration;
    return progress > 0.85 ? char : CHARS[seed];
  });

  const cellW = fontSize * 0.62;

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
        direction: "ltr",
        pointerEvents: "none",
        padding: "0 60px",
        flexWrap: "wrap",
        gap: 6,
      }}
    >
      {chars.map((c, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: c === " " ? cellW * 0.4 : cellW,
            fontFamily: "'Inter', monospace",
            fontWeight: 700,
            fontSize,
            color,
            background: c === " " ? "transparent" : BRAND.bgF,
            borderRadius: 8,
            padding: `${fontSize * 0.08}px ${fontSize * 0.04}px`,
            boxShadow: c === " "
              ? "none"
              : `0 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 ${BRAND.borderStrong}`,
          }}
        >
          {c}
        </span>
      ))}
    </div>
  );
};
