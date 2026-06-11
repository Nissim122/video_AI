import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, OffthreadVideo, Img } from "remotion";
import { BRAND } from "../brand";

export interface MosaicItem {
  src: string;
  type?: "video" | "image";
  label?: string;
}

interface VideoMosaicProps {
  items: MosaicItem[];
  cols?: 2 | 3;
  enterFrame?: number;
  /** frames between each item appearing */
  stagger?: number;
  positionY?: number;
  gap?: number;
  borderRadius?: number;
  width?: number;
}

export const VideoMosaic: React.FC<VideoMosaicProps> = ({
  items,
  cols = 2,
  enterFrame = 0,
  stagger = 6,
  positionY = 400,
  gap = 16,
  borderRadius = 16,
  width = 960,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const itemW = (width - gap * (cols - 1)) / cols;
  const itemH = (itemW * 9) / 16;

  return (
    <div
      style={{
        position: "absolute",
        top: positionY,
        left: (1080 - width) / 2,
        width,
        display: "flex",
        flexWrap: "wrap",
        gap,
        pointerEvents: "none",
      }}
    >
      {items.map((item, i) => {
        const enter = spring({
          frame: Math.max(0, frame - (enterFrame + i * stagger)),
          fps,
          config: { damping: 16, stiffness: 200, mass: 0.8 },
        });

        const opacity = interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
        const scale   = interpolate(enter, [0, 1], [0.88, 1]);
        const ty      = interpolate(enter, [0, 1], [30, 0]);

        return (
          <div
            key={i}
            style={{
              width: itemW,
              height: itemH,
              borderRadius,
              overflow: "hidden",
              transform: `translateY(${ty}px) scale(${scale})`,
              opacity,
              position: "relative",
              border: `1px solid ${BRAND.border}`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              flexShrink: 0,
            }}
          >
            {item.type === "video" ? (
              <OffthreadVideo
                src={item.src}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Img
                src={item.src}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
            {item.label && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                  padding: "20px 16px 12px",
                  fontFamily: "'Heebo', sans-serif",
                  fontSize: 22,
                  color: "#fff",
                  direction: "rtl",
                }}
              >
                {item.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
