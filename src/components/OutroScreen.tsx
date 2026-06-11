import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

interface OutroScreenProps {
  enterFrame: number;
  ctaText?: string;
  subText?: string;
  linkText?: string;
}

export const OutroScreen: React.FC<OutroScreenProps> = ({
  enterFrame,
  ctaText = "רוצה אוטומציה לעסק שלך?",
  subText = "השאר פרטים ואחזור אליך תוך 24 שעות",
  linkText = "clixautomations.com",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - enterFrame);

  const bgEnter = spring({ frame: localFrame, fps, config: { damping: 28, stiffness: 80, mass: 1.2 } });
  const logoEnter = spring({ frame: Math.max(0, localFrame - 8), fps, config: { damping: 20, stiffness: 140, mass: 0.9 } });
  const ctaEnter = spring({ frame: Math.max(0, localFrame - 18), fps, config: { damping: 18, stiffness: 160, mass: 0.8 } });
  const subEnter = spring({ frame: Math.max(0, localFrame - 26), fps, config: { damping: 18, stiffness: 160, mass: 0.8 } });
  const linkEnter = spring({ frame: Math.max(0, localFrame - 36), fps, config: { damping: 18, stiffness: 160, mass: 0.8 } });

  const bgOpacity = interpolate(bgEnter, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        opacity: bgOpacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        pointerEvents: "none",
        direction: "rtl",
      }}
    >
      {/* Glow backdrop */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 45%, rgba(33,150,176,0.13) 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          direction: "ltr",
          opacity: interpolate(logoEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(logoEnter, [0, 1], [40, 0])}px)`,
          marginBottom: 70,
        }}
      >
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 110, letterSpacing: "-0.04em", color: BRAND.text }}>
          Clix
        </span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: 94, letterSpacing: "-0.02em", color: BRAND.pink }}>
          Automations
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          width: interpolate(ctaEnter, [0, 1], [0, 600]),
          height: 2,
          background: `linear-gradient(90deg, transparent, ${BRAND.blue}, transparent)`,
          marginBottom: 60,
          opacity: interpolate(ctaEnter, [0, 1], [0, 1]),
        }}
      />

      {/* CTA text */}
      <div
        style={{
          fontFamily: "'Heebo', sans-serif",
          fontWeight: 800,
          fontSize: 72,
          color: BRAND.text,
          textAlign: "center",
          lineHeight: 1.25,
          padding: "0 80px",
          opacity: interpolate(ctaEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(ctaEnter, [0, 1], [30, 0])}px)`,
          marginBottom: 28,
        }}
      >
        {ctaText}
      </div>

      {/* Sub text */}
      <div
        style={{
          fontFamily: "'Heebo', sans-serif",
          fontWeight: 400,
          fontSize: 42,
          color: BRAND.muted,
          textAlign: "center",
          padding: "0 100px",
          opacity: interpolate(subEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(subEnter, [0, 1], [20, 0])}px)`,
          marginBottom: 80,
        }}
      >
        {subText}
      </div>

      {/* Link pill */}
      <div
        style={{
          background: `linear-gradient(135deg, ${BRAND.blue}33, ${BRAND.pink}22)`,
          border: `1.5px solid ${BRAND.blue}66`,
          borderRadius: 60,
          padding: "20px 60px",
          opacity: interpolate(linkEnter, [0, 1], [0, 1]),
          transform: `scale(${interpolate(linkEnter, [0, 1], [0.85, 1])})`,
          boxShadow: `0 0 30px ${BRAND.blue}33`,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 44,
            color: BRAND.blueL,
            letterSpacing: "0.01em",
            direction: "ltr",
          }}
        >
          {linkText}
        </span>
      </div>
    </AbsoluteFill>
  );
};
