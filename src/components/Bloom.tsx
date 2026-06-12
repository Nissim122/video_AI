import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { BRAND } from "../brand";

interface BloomProps {
  /**
   * Frame when bloom fades in (default 0 — always visible)
   */
  enterFrame?: number;
  /**
   * Frame when bloom fades out (optional)
   */
  exitFrame?: number;
  /**
   * Blur radius of the bloom halo in px, default 22
   */
  radius?: number;
  /**
   * Bloom opacity 0–1, default 0.55
   * Controls how prominent the glow is
   */
  intensity?: number;
  /**
   * Tint color mixed into the bloom, default BRAND.blue
   */
  color?: string;
  /**
   * "soft" — large diffuse bloom (default)
   * "hard" — tighter glow, closer to a sharp highlight
   * "dual" — both layers
   */
  style?: "soft" | "hard" | "dual";
  children?: React.ReactNode;
}

/**
 * Bloom — wraps any element and adds a soft luminous glow around it,
 * exactly like the After Effects Glow / Fast Box Blur effect.
 *
 * Technique: renders children twice —
 *   1. Normal layer
 *   2. Blurred copy at screen blend mode (the bloom)
 *
 * Usage:
 *   <Bloom intensity={0.65} radius={28} color={BRAND.blueL}>
 *     <TextPop text="חוסך 10 שעות" enterFrame={60} />
 *   </Bloom>
 */
export const Bloom: React.FC<BloomProps> = ({
  enterFrame = 0,
  exitFrame,
  radius = 22,
  intensity = 0.55,
  color = BRAND.blue,
  style: bloomStyle = "soft",
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = Math.max(0, frame - enterFrame);
  const fadeIn = spring({ frame: elapsed, fps, config: { damping: 20, stiffness: 180, mass: 0.7 } });

  const fadeOut =
    exitFrame !== undefined
      ? interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const opacity = fadeIn * fadeOut * intensity;
  if (opacity < 0.01) return <>{children}</>;

  // Subtle breathing pulse
  const breathe = 1 + Math.sin(frame * 0.07) * 0.08;
  const finalOpacity = Math.min(opacity * breathe, 1);

  // Use a ref-based counter to ensure unique filter IDs when multiple Bloom instances share the same enterFrame
  const idRef = React.useRef(`bloom-${enterFrame}-${Math.random().toString(36).slice(2, 7)}`);
  const filterId = idRef.current;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          {/* Soft bloom filter */}
          <filter id={`${filterId}-soft`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={radius} result="blur" />
            <feComposite in="blur" in2="SourceGraphic" operator="over" />
          </filter>
          {/* Hard inner glow filter */}
          <filter id={`${filterId}-hard`} x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation={radius * 0.35} result="blur" />
            <feComposite in="blur" in2="SourceGraphic" operator="over" />
          </filter>
          {/* Tint — colorize the bloom layer */}
          <filter id={`${filterId}-tint`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={radius} result="blur" />
            <feFlood floodColor={color} floodOpacity={0.45} result="tint" />
            <feComposite in="tint" in2="blur" operator="in" result="tinted" />
            <feMerge>
              <feMergeNode in="tinted" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Main content */}
      <div style={{ position: "absolute", inset: 0 }}>
        {children}
      </div>

      {/* Bloom layer — screen blend */}
      {(bloomStyle === "soft" || bloomStyle === "dual") && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: finalOpacity,
            filter: `url(#${filterId}-tint)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        >
          {children}
        </div>
      )}

      {/* Hard inner glow — add mode for extra punch */}
      {(bloomStyle === "hard" || bloomStyle === "dual") && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: finalOpacity * 0.7,
            filter: `url(#${filterId}-hard)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
