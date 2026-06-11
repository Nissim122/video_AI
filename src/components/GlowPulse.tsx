import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { BRAND } from "../brand";

interface GlowPulseProps {
  positionX?: number;
  positionY?: number;
  color?: string;
  radius?: number;
  /** pulses per second */
  pulseSpeed?: number;
  enterFrame?: number;
  intensity?: number;
  children?: React.ReactNode;
}

export const GlowPulse: React.FC<GlowPulseProps> = ({
  positionX = 0.5,
  positionY = 0.5,
  color = BRAND.blueL,
  radius = 220,
  pulseSpeed = 1.2,
  enterFrame = 0,
  intensity = 1,
  children,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - enterFrame);

  const fadeIn = interpolate(elapsed, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Two offset sine waves for organic, non-mechanical feel
  const pulse1 = 0.55 + Math.sin((elapsed / 30) * Math.PI * pulseSpeed) * 0.45;
  const pulse2 =
    0.4 + Math.sin((elapsed / 30) * Math.PI * pulseSpeed * 0.65 + 1.7) * 0.4;

  const cx = positionX * 1080;
  const cy = positionY * 1920;
  const gid1 = `glow-p1-${enterFrame}-${Math.round(positionX * 100)}`;
  const gid2 = `glow-p2-${enterFrame}-${Math.round(positionX * 100)}`;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
        opacity={fadeIn}
      >
        <defs>
          <radialGradient id={gid1} cx={cx} cy={cy} r={radius} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={color} stopOpacity={0.55 * pulse1 * intensity} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={gid2} cx={cx} cy={cy} r={radius * 1.7} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={color} stopOpacity={0.22 * pulse2 * intensity} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={cx} cy={cy} rx={radius * 1.3} ry={radius} fill={`url(#${gid1})`} />
        <ellipse cx={cx} cy={cy} rx={radius * 2.1} ry={radius * 1.6} fill={`url(#${gid2})`} />
      </svg>

      {children && (
        <div style={{ position: "absolute", inset: 0 }}>{children}</div>
      )}
    </div>
  );
};
