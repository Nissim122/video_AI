import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";
import { CounterNumber } from "./CounterNumber";

interface StatCardProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  enterFrame: number;
  /** "center" | px from left */
  positionX?: number | "center";
  positionY?: number;
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  suffix = "",
  prefix = "",
  label,
  enterFrame,
  positionX = "center",
  positionY = 900,
  accentColor = BRAND.blue,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 16, stiffness: 140, mass: 1 },
  });

  const scale = interpolate(enter, [0, 1], [0.6, 1]);
  const opacity = interpolate(enter, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  const left = positionX === "center" ? undefined : positionX;
  const right = positionX === "center" ? undefined : undefined;

  return (
    <div
      style={{
        position: "absolute",
        top: positionY,
        left: positionX === "center" ? "50%" : left,
        transform: positionX === "center"
          ? `translateX(-50%) translateY(-50%) scale(${scale})`
          : `translateY(-50%) scale(${scale})`,
        transformOrigin: "center center",
        opacity,
        pointerEvents: "none",
        background: "rgba(14,22,40,0.85)",
        backdropFilter: "blur(16px)",
        border: `1.5px solid ${accentColor}44`,
        borderRadius: 24,
        padding: "36px 60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        minWidth: 380,
        boxShadow: `0 0 50px ${accentColor}22, 0 12px 40px rgba(0,0,0,0.5)`,
        direction: "rtl",
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />

      <CounterNumber
        to={value}
        prefix={prefix}
        suffix={suffix}
        enterFrame={enterFrame}
        durationFrames={50}
        fontSize={110}
        color={accentColor}
      />

      <span
        style={{
          fontFamily: "'Heebo', sans-serif",
          fontWeight: 500,
          fontSize: 38,
          color: BRAND.muted,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
    </div>
  );
};
