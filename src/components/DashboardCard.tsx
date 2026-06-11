import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

interface DashboardCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  enterFrame?: number;
  positionY?: number;
  width?: number;
  accentColor?: string;
  trend?: "up" | "down";
  trendLabel?: string;
}

// Deterministic bar heights (looks like a real growth chart)
const BAR_HEIGHTS = [0.35, 0.55, 0.42, 0.68, 0.74, 0.58, 0.82, 0.71, 0.92, 1.0];
const CHART_H = 100;

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  suffix = "",
  prefix = "",
  enterFrame = 0,
  positionY = 600,
  width = 460,
  accentColor = BRAND.blue,
  trend = "up",
  trendLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 18, stiffness: 160, mass: 1.0 },
  });

  const countP = spring({
    frame: Math.max(0, frame - (enterFrame + 8)),
    fps,
    config: { damping: 28, stiffness: 80, mass: 1.2 },
  });

  const displayValue = Math.round(interpolate(countP, [0, 1], [0, value]));
  const opacity = interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const ty      = interpolate(enter, [0, 1], [40, 0]);
  const scale   = interpolate(enter, [0, 1], [0.92, 1]);

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
        borderRadius: 22,
        padding: "36px 40px 28px",
        border: `1px solid ${BRAND.border}`,
        boxShadow: `0 12px 50px rgba(0,0,0,0.5), 0 0 0 1px ${BRAND.borderStrong}`,
      }}
    >
      <div
        style={{
          fontFamily: "'Heebo', sans-serif",
          fontSize: 26,
          color: BRAND.muted,
          marginBottom: 8,
          direction: "rtl",
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6, direction: "ltr" }}>
        {prefix && (
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 36, color: BRAND.muted }}>
            {prefix}
          </span>
        )}
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: 76,
            color: BRAND.text,
            letterSpacing: "-0.04em",
          }}
        >
          {displayValue.toLocaleString()}
        </span>
        {suffix && (
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 40, color: BRAND.muted }}>
            {suffix}
          </span>
        )}
      </div>

      {/* Bar chart */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginTop: 16, height: CHART_H }}>
        {BAR_HEIGHTS.map((h, i) => {
          const barH = h * CHART_H * Math.min(1, countP);
          const isLast = i === BAR_HEIGHTS.length - 1;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: barH,
                borderRadius: 4,
                alignSelf: "flex-end",
                background: isLast ? accentColor : `${accentColor}44`,
                boxShadow: isLast ? `0 0 14px ${accentColor}66` : "none",
              }}
            />
          );
        })}
      </div>

      {trendLabel && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
            direction: "rtl",
          }}
        >
          <span style={{ fontSize: 24, color: trend === "up" ? BRAND.green : BRAND.pink }}>
            {trend === "up" ? "↑" : "↓"}
          </span>
          <span
            style={{ fontFamily: "'Heebo', sans-serif", fontSize: 26, color: BRAND.muted }}
          >
            {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
};
