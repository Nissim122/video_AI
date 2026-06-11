import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export interface EmojiFloat {
  emoji: string;
  frame: number;
  /** 0–1 horizontal position, defaults to distributed */
  x?: number;
  /** duration in frames, default 55 */
  duration?: number;
}

interface FloatingEmojiProps {
  emojis: EmojiFloat[];
}

function seeded(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export const FloatingEmoji: React.FC<FloatingEmojiProps> = ({ emojis }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {emojis.map((item, i) => {
        const elapsed = frame - item.frame;
        const duration = item.duration ?? 55;

        if (elapsed < 0 || elapsed > duration) return null;

        // Horizontal position — spread across the lower portion of the screen
        const xBase =
          item.x !== undefined
            ? item.x * 1080
            : 160 + seeded(i * 7.31) * 760;

        // Gentle side-to-side wobble
        const wobble = Math.sin(elapsed * 0.19 + i * 1.3) * 22;

        // Float upward
        const y = interpolate(elapsed, [0, duration], [1840, 1150], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const opacity = interpolate(
          elapsed,
          [0, 7, duration - 12, duration],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const scale = interpolate(elapsed, [0, 10, duration * 0.7, duration], [0.4, 1.15, 1, 0.85], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const rotate =
          Math.sin(elapsed * 0.14 + i * 2.1) * 20;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: xBase + wobble,
              top: y,
              transform: `scale(${scale}) rotate(${rotate}deg)`,
              opacity,
              fontSize: 56,
              lineHeight: 1,
            }}
          >
            {item.emoji}
          </div>
        );
      })}
    </div>
  );
};
