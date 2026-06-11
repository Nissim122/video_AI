import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

type MaskDirection = "left" | "right" | "top" | "bottom" | "circle";

interface MaskRevealProps {
  children: React.ReactNode;
  enterFrame: number;
  exitFrame?: number;
  direction?: MaskDirection;
}

export const MaskReveal: React.FC<MaskRevealProps> = ({
  children,
  enterFrame,
  exitFrame,
  direction = "left",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 24, stiffness: 210, mass: 0.65 },
  });

  const exit =
    exitFrame !== undefined
      ? spring({
          frame: Math.max(0, frame - exitFrame),
          fps,
          config: { damping: 24, stiffness: 210, mass: 0.65 },
        })
      : 0;

  const p = Math.min(1, enter) * (1 - Math.min(1, exit));

  let clipPath = "";
  switch (direction) {
    case "left":
      clipPath = `inset(0 ${(1 - p) * 100}% 0 0 round 0px)`;
      break;
    case "right":
      clipPath = `inset(0 0 0 ${(1 - p) * 100}% round 0px)`;
      break;
    case "top":
      clipPath = `inset(0 0 ${(1 - p) * 100}% 0 round 0px)`;
      break;
    case "bottom":
      clipPath = `inset(${(1 - p) * 100}% 0 0 0 round 0px)`;
      break;
    case "circle": {
      // Diagonal of 1080×1920
      const maxR = Math.sqrt(540 * 540 + 960 * 960);
      clipPath = `circle(${p * maxR}px at 50% 50%)`;
      break;
    }
  }

  return (
    <div style={{ position: "absolute", inset: 0, clipPath }}>
      {children}
    </div>
  );
};
