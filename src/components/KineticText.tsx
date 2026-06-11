import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

export type KineticStyle = "highlight" | "pop" | "clean";

export interface KineticWord {
  text: string;
  frame: number;
  /** override style per-word */
  accent?: boolean;
}

interface KineticTextProps {
  words: KineticWord[];
  style?: KineticStyle;
  fontSize?: number;
  positionY?: number;
  accentColor?: string;
}

const WordChip: React.FC<{
  word: KineticWord;
  kStyle: KineticStyle;
  fontSize: number;
  accentColor: string;
  frame: number;
  fps: number;
}> = ({ word, kStyle, fontSize, accentColor, frame, fps }) => {
  const p = spring({
    frame: Math.max(0, frame - word.frame),
    fps,
    config: { damping: 14, stiffness: 200, mass: 0.75 },
  });

  const isAccent = word.accent ?? false;

  if (kStyle === "pop") {
    const scale = interpolate(p, [0, 0.55, 0.8, 1], [0, 1.22, 0.92, 1], {
      extrapolateRight: "clamp",
    });
    const opacity = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });

    return (
      <span
        style={{
          display: "inline-block",
          transform: `scale(${scale})`,
          opacity,
          transformOrigin: "center bottom",
          color: isAccent ? accentColor : BRAND.text,
          marginLeft: 10,
          marginRight: 10,
          textShadow: isAccent ? `0 0 30px ${accentColor}88` : "0 2px 12px rgba(0,0,0,0.7)",
          fontWeight: isAccent ? 900 : 800,
        }}
      >
        {word.text}
      </span>
    );
  }

  if (kStyle === "highlight") {
    const scale = interpolate(p, [0, 0.6, 1], [0.85, 1.04, 1], { extrapolateRight: "clamp" });
    const opacity = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

    return (
      <span
        style={{
          display: "inline-block",
          transform: `scale(${scale})`,
          opacity,
          transformOrigin: "center bottom",
          marginLeft: 8,
          marginRight: 8,
          ...(isAccent
            ? {
                background: accentColor,
                color: "#fff",
                borderRadius: 12,
                padding: "2px 18px",
                boxShadow: `0 0 28px ${accentColor}66`,
                fontWeight: 900,
              }
            : {
                color: BRAND.text,
                fontWeight: 800,
              }),
        }}
      >
        {word.text}
      </span>
    );
  }

  // clean — slide up + fade
  const ty = interpolate(p, [0, 1], [36, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <span
      style={{
        display: "inline-block",
        transform: `translateY(${ty}px)`,
        opacity,
        marginLeft: 8,
        marginRight: 8,
        color: isAccent ? accentColor : BRAND.text,
        fontWeight: isAccent ? 900 : 700,
        textShadow: "0 2px 12px rgba(0,0,0,0.6)",
      }}
    >
      {word.text}
    </span>
  );
};

export const KineticText: React.FC<KineticTextProps> = ({
  words,
  style = "pop",
  fontSize = 72,
  positionY = 0.55,
  accentColor = BRAND.pink,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const top = positionY * 1920;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 60px",
        pointerEvents: "none",
        direction: "rtl",
        fontFamily: "'Heebo', sans-serif",
        fontSize,
        lineHeight: 1.35,
        gap: 4,
      }}
    >
      {words.map((w, i) => (
        <WordChip
          key={i}
          word={w}
          kStyle={style}
          fontSize={fontSize}
          accentColor={accentColor}
          frame={frame}
          fps={fps}
        />
      ))}
    </div>
  );
};
