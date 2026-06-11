import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

export interface ReactionItem {
  text: string;
  frame: number;
  side?: "left" | "right";
  holdFrames?: number;
  avatar?: string;
}

interface ReactionBubbleProps {
  reactions: ReactionItem[];
}

const AVATARS = ["👤", "🙋", "👩", "👨", "🧑"];

const Bubble: React.FC<{
  item: ReactionItem;
  index: number;
  frame: number;
  fps: number;
}> = ({ item, index, frame, fps }) => {
  const side = item.side ?? (index % 2 === 0 ? "left" : "right");
  const holdFrames = item.holdFrames ?? 80;

  const enter = spring({
    frame: Math.max(0, frame - item.frame),
    fps,
    config: { damping: 16, stiffness: 200, mass: 0.75 },
  });

  const exit = spring({
    frame: Math.max(0, frame - (item.frame + holdFrames)),
    fps,
    config: { damping: 18, stiffness: 220, mass: 0.7 },
  });

  const isLeft = side === "left";

  const tx =
    interpolate(enter, [0, 1], [isLeft ? -480 : 480, 0]) +
    interpolate(exit,  [0, 1], [0, isLeft ? -480 : 480]);

  const opacity = Math.max(
    0,
    interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }) -
    interpolate(exit,  [0, 0.6], [0, 1], { extrapolateRight: "clamp" })
  );

  const scale = interpolate(enter, [0, 0.5, 0.8, 1], [0.7, 1.06, 0.97, 1], {
    extrapolateRight: "clamp",
  });

  const isEmoji = /^\p{Emoji}/u.test(item.text.trim()) && item.text.trim().length <= 6;

  return (
    <div
      style={{
        position: "absolute",
        left: isLeft ? 48 : undefined,
        right: !isLeft ? 48 : undefined,
        transform: `translateX(${tx}px) scale(${scale})`,
        transformOrigin: isLeft ? "left center" : "right center",
        opacity,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexDirection: isLeft ? "row" : "row-reverse",
        direction: "ltr",
        maxWidth: 760,
      }}
    >
      {/* avatar */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blueL})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
          flexShrink: 0,
          boxShadow: `0 0 0 2px rgba(255,255,255,0.15)`,
        }}
      >
        {item.avatar ?? AVATARS[index % AVATARS.length]}
      </div>

      {/* bubble */}
      <div
        style={{
          background: "rgba(14,22,40,0.88)",
          backdropFilter: "blur(16px)",
          border: `1.5px solid rgba(255,255,255,0.12)`,
          borderRadius: isEmoji ? 24 : 28,
          padding: isEmoji ? "16px 24px" : "18px 30px",
          boxShadow: "0 4px 28px rgba(0,0,0,0.55)",
        }}
      >
        <span
          style={{
            fontFamily: isEmoji ? undefined : "'Heebo', sans-serif",
            fontWeight: 700,
            fontSize: isEmoji ? 52 : 40,
            color: BRAND.text,
            direction: "rtl",
            display: "block",
            whiteSpace: "nowrap",
          }}
        >
          {item.text}
        </span>
      </div>
    </div>
  );
};

export const ReactionBubble: React.FC<ReactionBubbleProps> = ({ reactions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stack active bubbles vertically from bottom up
  const sorted = [...reactions].sort((a, b) => a.frame - b.frame);

  const BUBBLE_H = 110;
  const BOTTOM_START = 1920 - 240;

  return (
    <>
      {sorted.map((item, i) => {
        const top = BOTTOM_START - i * (BUBBLE_H + 16);
        return (
          <div key={i} style={{ position: "absolute", top, left: 0, right: 0 }}>
            <Bubble item={item} index={i} frame={frame} fps={fps} />
          </div>
        );
      })}
    </>
  );
};
