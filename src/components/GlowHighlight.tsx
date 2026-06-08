import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { BRAND } from "../brand";
import { ScreenRegion } from "../types";

interface GlowHighlightProps {
  pos: ScreenRegion;
  startAt: number;
  color?: string;
  /** show a checkmark badge in the corner (default true) */
  badge?: boolean;
}

export const GlowHighlight: React.FC<GlowHighlightProps> = ({
  pos,
  startAt,
  color = BRAND.blue,
  badge = true,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [startAt, startAt + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = 0.7 + Math.sin((frame - startAt) * 0.22) * 0.3;

  return (
    <div
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        width: pos.width,
        height: pos.height,
        borderRadius: 16,
        background: `${color}${Math.round(0.18 * opacity * 255).toString(16).padStart(2, "0")}`,
        border: `3px solid ${color}`,
        boxShadow: `
          0 0 0 6px ${color}${Math.round(0.18 * opacity * pulse * 255).toString(16).padStart(2, "0")},
          0 0 32px ${color}${Math.round(0.55 * opacity * pulse * 255).toString(16).padStart(2, "0")}
        `,
        opacity,
        pointerEvents: "none",
      }}
    >
      {badge && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path
              d="M 2 7 L 5.5 10.5 L 12 3.5"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
