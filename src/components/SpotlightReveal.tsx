import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface SpotlightRevealProps {
  enterFrame: number;
  exitFrame?: number;
  /** center X in pixels, default 540 */
  cx?: number;
  /** center Y in pixels, default 960 */
  cy?: number;
  /** spotlight radius in pixels, default 320 */
  radius?: number;
  /** darkness of surrounding area 0–1, default 0.78 */
  dimOpacity?: number;
  animate?: "grow" | "pulse" | "static";
}

export const SpotlightReveal: React.FC<SpotlightRevealProps> = ({
  enterFrame,
  exitFrame,
  cx = 540,
  cy = 960,
  radius = 320,
  dimOpacity = 0.78,
  animate = "pulse",
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - enterFrame);

  const fadeIn = interpolate(elapsed, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut =
    exitFrame !== undefined
      ? interpolate(frame, [exitFrame, exitFrame + 14], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  let currentRadius = radius;
  if (animate === "grow") {
    currentRadius = interpolate(elapsed, [0, 35], [0, radius], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (animate === "pulse") {
    currentRadius = radius + Math.sin(elapsed * 0.11) * 22;
  }

  const gradId = `spotlight-grad-${enterFrame}`;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: fadeIn * fadeOut,
        pointerEvents: "none",
      }}
    >
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient
            id={gradId}
            cx={cx}
            cy={cy}
            r={currentRadius}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="black" stopOpacity="0" />
            <stop offset="80%" stopColor="black" stopOpacity={dimOpacity * 0.6} />
            <stop offset="100%" stopColor="black" stopOpacity={dimOpacity} />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill={`url(#${gradId})`} />
      </svg>
    </div>
  );
};
