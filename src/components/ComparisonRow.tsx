import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

export interface ComparisonItem {
  before: string;
  after: string;
  label?: string;
  enterFrame: number;
}

interface ComparisonRowProps {
  items: ComparisonItem[];
  enterFrame?: number;
  positionY?: number;
  width?: number;
  beforeLabel?: string;
  afterLabel?: string;
}

export const ComparisonRow: React.FC<ComparisonRowProps> = ({
  items,
  enterFrame = 0,
  positionY = 400,
  width = 900,
  beforeLabel = "לפני",
  afterLabel = "אחרי",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerEnter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 18, stiffness: 180, mass: 0.9 },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: positionY,
        left: (1080 - width) / 2,
        width,
        pointerEvents: "none",
        direction: "rtl",
      }}
    >
      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 60px 1fr",
          marginBottom: 16,
          opacity: interpolate(headerEnter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontFamily: "'Heebo', sans-serif",
            fontSize: 28,
            color: BRAND.muted,
            fontWeight: 600,
          }}
        >
          {beforeLabel}
        </div>
        <div />
        <div
          style={{
            textAlign: "center",
            fontFamily: "'Heebo', sans-serif",
            fontSize: 28,
            color: BRAND.green,
            fontWeight: 600,
          }}
        >
          {afterLabel}
        </div>
      </div>

      {items.map((item, i) => {
        const enter = spring({
          frame: Math.max(0, frame - item.enterFrame),
          fps,
          config: { damping: 16, stiffness: 160, mass: 0.9 },
        });

        return (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 60px 1fr",
              alignItems: "center",
              marginBottom: i < items.length - 1 ? 16 : 0,
              transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
              opacity: interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            {/* Before */}
            <div
              style={{
                background: BRAND.bgF,
                borderRadius: 14,
                padding: "18px 24px",
                border: "1px solid rgba(239,68,68,0.25)",
                textAlign: "center",
              }}
            >
              <div style={{ fontFamily: "'Heebo', sans-serif", fontSize: 32, color: BRAND.text }}>
                {item.before}
              </div>
              {item.label && (
                <div
                  style={{ fontFamily: "'Heebo', sans-serif", fontSize: 22, color: BRAND.muted, marginTop: 4 }}
                >
                  {item.label}
                </div>
              )}
            </div>

            {/* Arrow */}
            <div style={{ textAlign: "center", fontSize: 32, color: BRAND.blue }}>→</div>

            {/* After */}
            <div
              style={{
                background: BRAND.bgF,
                borderRadius: 14,
                padding: "18px 24px",
                border: "1px solid rgba(40,199,111,0.3)",
                textAlign: "center",
                boxShadow: "0 0 20px rgba(40,199,111,0.1)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Heebo', sans-serif",
                  fontSize: 32,
                  color: BRAND.green,
                  fontWeight: 700,
                }}
              >
                {item.after}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
