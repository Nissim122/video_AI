import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

type Platform = "instagram" | "tiktok" | "linkedin" | "youtube" | "whatsapp";

const platformColors: Record<Platform, string> = {
  instagram: "#E1306C",
  tiktok: "#69C9D0",
  linkedin: "#0A66C2",
  youtube: "#FF0000",
  whatsapp: "#25D366",
};

const platformIcons: Record<Platform, string> = {
  instagram: "📸",
  tiktok: "🎵",
  linkedin: "💼",
  youtube: "▶",
  whatsapp: "✆",
};

interface SocialHandleProps {
  handle: string;
  platform?: Platform;
  enterFrame: number;
  holdFrames?: number;
  corner?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
}

const PADDING = 60;

export const SocialHandle: React.FC<SocialHandleProps> = ({
  handle,
  platform = "instagram",
  enterFrame,
  holdFrames = 0,
  corner = "bottom-left",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 18, stiffness: 180, mass: 0.8 },
  });

  const exit =
    holdFrames > 0
      ? spring({
          frame: Math.max(0, frame - (enterFrame + holdFrames)),
          fps,
          config: { damping: 18, stiffness: 180, mass: 0.8 },
        })
      : 0;

  const isBottom = corner.startsWith("bottom");
  const isRight = corner.endsWith("right");

  const slideDir = isBottom ? 1 : -1;
  const translateY = interpolate(enter, [0, 1], [slideDir * 80, 0]) + interpolate(exit, [0, 1], [0, slideDir * 80]);
  const opacity = Math.max(0, Math.min(enter * 2, 1) - exit * 2);

  const color = platformColors[platform];

  return (
    <div
      style={{
        position: "absolute",
        bottom: isBottom ? PADDING : undefined,
        top: !isBottom ? PADDING : undefined,
        left: !isRight ? PADDING : undefined,
        right: isRight ? PADDING : undefined,
        transform: `translateY(${translateY}px)`,
        opacity,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        gap: 14,
        direction: "ltr",
        background: "rgba(14,22,40,0.78)",
        backdropFilter: "blur(12px)",
        border: `1.5px solid ${color}44`,
        borderRadius: 50,
        padding: "14px 28px 14px 18px",
        boxShadow: `0 0 24px ${color}22, 0 4px 20px rgba(0,0,0,0.5)`,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          flexShrink: 0,
        }}
      >
        {platformIcons[platform]}
      </div>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          fontSize: 38,
          color: BRAND.text,
          letterSpacing: "-0.01em",
        }}
      >
        {handle}
      </span>
    </div>
  );
};
