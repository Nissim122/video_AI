import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

interface MockBrowserProps {
  url?: string;
  children?: React.ReactNode;
  screenshotSrc?: string;
  enterFrame?: number;
  width?: number;
  positionX?: number;
  positionY?: number;
}

export const MockBrowser: React.FC<MockBrowserProps> = ({
  url = "app.clixautomations.com",
  children,
  screenshotSrc,
  enterFrame = 0,
  width = 900,
  positionX = 90,
  positionY = 480,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 18, stiffness: 160, mass: 1.1 },
  });

  const scale   = interpolate(enter, [0, 1], [0.88, 1]);
  const opacity = interpolate(enter, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const ty      = interpolate(enter, [0, 1], [40, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: positionY,
        left: positionX,
        width,
        transform: `translateY(${ty}px) scale(${scale})`,
        transformOrigin: "top center",
        opacity,
        pointerEvents: "none",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,0,0.65)",
        border: `1px solid ${BRAND.borderStrong}`,
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          height: 72,
          background: BRAND.bgF,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 14,
          borderBottom: `1px solid ${BRAND.border}`,
        }}
      >
        {(["#ef4444", "#f59e0b", "#22c55e"] as const).map((c, i) => (
          <div
            key={i}
            style={{ width: 18, height: 18, borderRadius: "50%", background: c, opacity: 0.85 }}
          />
        ))}
        <div
          style={{
            flex: 1,
            height: 40,
            background: BRAND.bg,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 10,
            marginLeft: 20,
          }}
        >
          <span style={{ fontSize: 22, opacity: 0.5 }}>🔒</span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 24,
              color: BRAND.muted,
              letterSpacing: "-0.01em",
            }}
          >
            {url}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ background: BRAND.bgE, position: "relative" }}>
        {screenshotSrc ? (
          <img src={screenshotSrc} style={{ width: "100%", display: "block" }} />
        ) : (
          children
        )}
      </div>
    </div>
  );
};
