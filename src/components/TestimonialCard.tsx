import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role?: string;
  avatarSrc?: string;
  avatarEmoji?: string;
  stars?: number;
  enterFrame?: number;
  positionY?: number;
  width?: number;
  accentColor?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  role,
  avatarSrc,
  avatarEmoji = "👤",
  stars = 5,
  enterFrame = 0,
  positionY = 500,
  width = 880,
  accentColor = BRAND.blue,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 20, stiffness: 140, mass: 1.1 },
  });

  const opacity = interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const ty      = interpolate(enter, [0, 1], [50, 0]);
  const scale   = interpolate(enter, [0, 1], [0.94, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: positionY,
        left: (1080 - width) / 2,
        width,
        transform: `translateY(${ty}px) scale(${scale})`,
        opacity,
        pointerEvents: "none",
        background: BRAND.bgE,
        borderRadius: 24,
        padding: "44px 48px",
        border: `1px solid ${BRAND.border}`,
        boxShadow: `0 16px 60px rgba(0,0,0,0.5), 0 0 0 1px ${BRAND.borderStrong}`,
        direction: "rtl",
      }}
    >
      {/* Stars */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            style={{
              fontSize: 36,
              color: i < stars ? "#f5c842" : BRAND.muted,
              opacity: i < stars ? 1 : 0.3,
            }}
          >
            ★
          </span>
        ))}
      </div>

      {/* Quote */}
      <div
        style={{
          fontFamily: "'Heebo', sans-serif",
          fontSize: 36,
          fontWeight: 500,
          color: BRAND.text,
          lineHeight: 1.6,
          marginBottom: 36,
        }}
      >
        "{quote}"
      </div>

      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `${accentColor}33`,
            border: `2px solid ${accentColor}66`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {avatarSrc ? (
            <img src={avatarSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 36 }}>{avatarEmoji}</span>
          )}
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Heebo', sans-serif",
              fontWeight: 700,
              fontSize: 34,
              color: BRAND.text,
            }}
          >
            {name}
          </div>
          {role && (
            <div
              style={{
                fontFamily: "'Heebo', sans-serif",
                fontSize: 28,
                color: BRAND.muted,
                marginTop: 4,
              }}
            >
              {role}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
