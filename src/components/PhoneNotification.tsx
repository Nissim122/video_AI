import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

export type NotificationApp =
  | "whatsapp"
  | "gmail"
  | "slack"
  | "calendar"
  | "custom";

interface PhoneNotificationProps {
  app: NotificationApp;
  title: string;
  message: string;
  enterFrame: number;
  holdFrames?: number;
  /** override icon for "custom" app */
  icon?: string;
  /** override color for "custom" app */
  appColor?: string;
}

const APP_CONFIGS: Record<
  NotificationApp,
  { icon: string; color: string; label: string }
> = {
  whatsapp: { icon: "💬", color: "#25D366", label: "WhatsApp" },
  gmail: { icon: "✉️", color: "#EA4335", label: "Gmail" },
  slack: { icon: "⚡", color: "#4A154B", label: "Slack" },
  calendar: { icon: "📅", color: "#4285F4", label: "Calendar" },
  custom: { icon: "🔔", color: BRAND.blue, label: "App" },
};

export const PhoneNotification: React.FC<PhoneNotificationProps> = ({
  app,
  title,
  message,
  enterFrame,
  holdFrames = 90,
  icon,
  appColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cfg = APP_CONFIGS[app];
  const color = appColor ?? cfg.color;
  const emoji = icon ?? cfg.icon;

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 22, stiffness: 280, mass: 0.6 },
  });

  const exit = spring({
    frame: Math.max(0, frame - (enterFrame + holdFrames)),
    fps,
    config: { damping: 18, stiffness: 240, mass: 0.65 },
  });

  const ty =
    interpolate(enter, [0, 1], [-220, 0]) +
    interpolate(exit, [0, 1], [0, -220]);

  const opacity = Math.max(
    0,
    interpolate(enter, [0, 0.35], [0, 1], { extrapolateRight: "clamp" }) -
      interpolate(exit, [0.65, 1], [0, 1], { extrapolateRight: "clamp" })
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 72,
        left: 36,
        right: 36,
        background: "rgba(18,26,48,0.96)",
        backdropFilter: "blur(28px)",
        borderRadius: 26,
        padding: "20px 22px",
        boxShadow: `0 10px 50px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(255,255,255,0.09)`,
        transform: `translateY(${ty}px)`,
        opacity,
        pointerEvents: "none",
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        direction: "rtl",
      }}
    >
      {/* App icon */}
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 16,
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          flexShrink: 0,
          boxShadow: `0 0 22px ${color}55`,
        }}
      >
        {emoji}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontFamily: "'Heebo', sans-serif",
              fontWeight: 700,
              fontSize: 28,
              color: BRAND.text,
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontFamily: "'Heebo', sans-serif",
              fontSize: 22,
              color: BRAND.muted,
              direction: "ltr",
            }}
          >
            {cfg.label} · עכשיו
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Heebo', sans-serif",
            fontSize: 28,
            fontWeight: 400,
            color: BRAND.muted,
            lineHeight: 1.35,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
};
