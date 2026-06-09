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
  /** 'rect' = rounded rectangle (default), 'circle' = full circle */
  shape?: "rect" | "circle";
  /** if set, fade out over the last 10 frames before startAt + duration */
  duration?: number;
}

export const GlowHighlight: React.FC<GlowHighlightProps> = ({
  pos,
  startAt,
  color = BRAND.blue,
  badge = true,
  shape = "rect",
  duration,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [startAt, startAt + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut =
    duration !== undefined
      ? interpolate(frame, [startAt + duration - 10, startAt + duration], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  const combinedOpacity = opacity * fadeOut;
  const pulse = 0.7 + Math.sin((frame - startAt) * 0.22) * 0.3;

  return (
    <div
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        width: pos.width,
        height: pos.height,
        borderRadius: shape === "circle" ? "50%" : 16,
        background: `${color}${Math.round(0.18 * combinedOpacity * 255).toString(16).padStart(2, "0")}`,
        border: `3px solid ${color}`,
        boxShadow: `
          0 0 0 6px ${color}${Math.round(0.18 * combinedOpacity * pulse * 255).toString(16).padStart(2, "0")},
          0 0 32px ${color}${Math.round(0.55 * combinedOpacity * pulse * 255).toString(16).padStart(2, "0")}
        `,
        opacity: combinedOpacity,
        pointerEvents: "none",
      }}
    >
      {badge && shape !== "circle" && (
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
