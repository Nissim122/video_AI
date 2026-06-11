import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

interface BulletItem {
  text: string;
  /** frame when this bullet appears */
  frame: number;
  icon?: string;
}

interface BulletListProps {
  items: BulletItem[];
  /** vertical center position 0–1920 */
  positionY?: number;
  fontSize?: number;
}

const Bullet: React.FC<{ item: BulletItem; fontSize: number }> = ({ item, fontSize }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - item.frame),
    fps,
    config: { damping: 20, stiffness: 200, mass: 0.7 },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateX(${interpolate(enter, [0, 1], [60, 0])}px)`,
        direction: "rtl",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.pink})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
          boxShadow: `0 0 16px ${BRAND.blue}66`,
        }}
      >
        {item.icon ?? "✓"}
      </div>
      <span
        style={{
          fontFamily: "'Heebo', sans-serif",
          fontWeight: 600,
          fontSize,
          color: BRAND.text,
          lineHeight: 1.3,
          textShadow: "0 2px 16px rgba(0,0,0,0.6)",
        }}
      >
        {item.text}
      </span>
    </div>
  );
};

export const BulletList: React.FC<BulletListProps> = ({
  items,
  positionY = 960,
  fontSize = 48,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: positionY,
        left: 70,
        right: 70,
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 36,
        pointerEvents: "none",
      }}
    >
      {items.map((item, i) => (
        <Bullet key={i} item={item} fontSize={fontSize} />
      ))}
    </div>
  );
};
