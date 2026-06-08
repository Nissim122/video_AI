import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { IPhone14 } from "./IPhone14";

export type PhoneVariant = "slideUp" | "perspectiveLeft" | "floatIn" | "dropBounce";

interface PhoneEntranceProps {
  /** Animation style */
  variant: PhoneVariant;
  /** Delay before animation starts, in frames */
  delay?: number;
  /** Screen content rendered inside the phone */
  children?: React.ReactNode;
}

const SPRING_CONFIGS: Record<PhoneVariant, { damping: number; mass: number; stiffness: number }> = {
  // Smooth upward slide — default product shot
  slideUp: { damping: 14, mass: 0.85, stiffness: 120 },
  // Apple-style 3D flip from left
  perspectiveLeft: { damping: 18, mass: 0.9, stiffness: 130 },
  // Gentle scale-in from center — SaaS landing style
  floatIn: { damping: 22, mass: 0.7, stiffness: 90 },
  // Falls from above with elastic bounce — high-energy
  dropBounce: { damping: 7, mass: 1.0, stiffness: 220 },
};

export const PhoneEntrance: React.FC<PhoneEntranceProps> = ({
  variant,
  delay = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const f = Math.max(0, frame - delay);

  const progress = spring({
    frame: f,
    fps,
    config: SPRING_CONFIGS[variant],
  });

  const opacity = interpolate(f, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let transform = "";
  let perspective: number | undefined;

  switch (variant) {
    case "slideUp": {
      const y = interpolate(progress, [0, 1], [900, 0]);
      const scale = interpolate(progress, [0, 1], [0.92, 1]);
      transform = `translateY(${y}px) scale(${scale})`;
      break;
    }
    case "perspectiveLeft": {
      const x = interpolate(progress, [0, 1], [-680, 0]);
      const rotY = interpolate(progress, [0, 1], [-42, 0]);
      transform = `translateX(${x}px) rotateY(${rotY}deg)`;
      perspective = 1400;
      break;
    }
    case "floatIn": {
      const scale = interpolate(progress, [0, 1], [0.5, 1]);
      const y = interpolate(progress, [0, 1], [60, 0]);
      transform = `scale(${scale}) translateY(${y}px)`;
      break;
    }
    case "dropBounce": {
      const y = interpolate(progress, [0, 1], [-1100, 0]);
      transform = `translateY(${y}px)`;
      break;
    }
  }

  return (
    <div style={{ perspective }}>
      <div style={{ transform, opacity }}>
        <IPhone14>{children}</IPhone14>
      </div>
    </div>
  );
};
