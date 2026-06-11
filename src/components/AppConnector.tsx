import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

interface AppConnectorProps {
  /** emoji or image URL */
  leftIcon: string;
  rightIcon: string;
  leftLabel?: string;
  rightLabel?: string;
  enterFrame?: number;
  positionY?: number;
  color?: string;
  /** animate data packets flowing along the arrow */
  animated?: boolean;
}

const ICON_SIZE = 140;
const ARROW_W   = 400;

function isEmoji(s: string) {
  return /^\p{Emoji}/u.test(s);
}

const AppIcon: React.FC<{ icon: string; label?: string }> = ({ icon, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
    <div
      style={{
        width: ICON_SIZE,
        height: ICON_SIZE,
        borderRadius: 28,
        background: BRAND.bgF,
        border: `2px solid ${BRAND.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {isEmoji(icon) ? (
        <span style={{ fontSize: ICON_SIZE * 0.55 }}>{icon}</span>
      ) : (
        <img
          src={icon}
          style={{ width: ICON_SIZE * 0.65, height: ICON_SIZE * 0.65, objectFit: "contain" }}
        />
      )}
    </div>
    {label && (
      <span
        style={{ fontFamily: "'Heebo', sans-serif", fontSize: 28, color: BRAND.muted }}
      >
        {label}
      </span>
    )}
  </div>
);

export const AppConnector: React.FC<AppConnectorProps> = ({
  leftIcon,
  rightIcon,
  leftLabel,
  rightLabel,
  enterFrame = 0,
  positionY = 880,
  color = BRAND.blue,
  animated = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 16, stiffness: 180, mass: 0.9 },
  });

  const opacity = interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const scale   = interpolate(enter, [0, 1], [0.85, 1]);

  const packetProgress = animated && frame >= enterFrame + 20
    ? ((frame - enterFrame - 20) % 40) / 40
    : 0;
  const packetVisible =
    animated &&
    frame >= enterFrame + 20 &&
    packetProgress > 0.08 &&
    packetProgress < 0.92;

  const packetCx = 20 + packetProgress * (ARROW_W - 40);

  return (
    <div
      style={{
        position: "absolute",
        top: positionY,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${scale})`,
        opacity,
        pointerEvents: "none",
        direction: "ltr",
      }}
    >
      <AppIcon icon={leftIcon} label={leftLabel} />

      {/* Arrow */}
      <svg width={ARROW_W} height={40} style={{ overflow: "visible", flexShrink: 0 }}>
        <line
          x1={20} y1={20} x2={ARROW_W - 20} y2={20}
          stroke={color}
          strokeWidth={3}
          strokeDasharray="8 6"
          opacity={0.6}
        />
        <polygon
          points={`${ARROW_W - 14},13 ${ARROW_W},20 ${ARROW_W - 14},27`}
          fill={color}
          opacity={0.85}
        />
        {packetVisible && (
          <circle
            cx={packetCx}
            cy={20}
            r={7}
            fill={color}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        )}
      </svg>

      <AppIcon icon={rightIcon} label={rightLabel} />
    </div>
  );
};
