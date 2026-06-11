import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

export interface TimelineStepItem {
  label: string;
  sublabel?: string;
  enterFrame: number;
  icon?: string;
}

interface TimelineStepProps {
  steps: TimelineStepItem[];
  orientation?: "horizontal" | "vertical";
  enterFrame?: number;
  positionY?: number;
  accentColor?: string;
  width?: number;
}

export const TimelineStep: React.FC<TimelineStepProps> = ({
  steps,
  orientation = "vertical",
  positionY = 400,
  accentColor = BRAND.blue,
  width = 860,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        top: positionY,
        left: (1080 - width) / 2,
        width,
        pointerEvents: "none",
        direction: "rtl",
        display: "flex",
        flexDirection: orientation === "vertical" ? "column" : "row",
      }}
    >
      {steps.map((step, i) => {
        const enter = spring({
          frame: Math.max(0, frame - step.enterFrame),
          fps,
          config: { damping: 16, stiffness: 180, mass: 0.85 },
        });

        const isDone   = enter > 0.95;
        const opacity  = interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
        const isLast   = i === steps.length - 1;

        if (orientation === "vertical") {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 28,
                opacity,
                transform: `translateX(${interpolate(enter, [0, 1], [-30, 0])}px)`,
              }}
            >
              {/* Dot + connector column */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 48 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: isDone ? accentColor : BRAND.bgF,
                    border: `2px solid ${isDone ? accentColor : BRAND.borderStrong}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    color: isDone ? "#fff" : BRAND.muted,
                    boxShadow: isDone ? `0 0 16px ${accentColor}66` : "none",
                    flexShrink: 0,
                  }}
                >
                  {step.icon ?? (isDone ? "✓" : String(i + 1))}
                </div>
                {!isLast && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: 32,
                      marginTop: 6,
                      marginBottom: 6,
                      background: isDone ? accentColor : BRAND.border,
                      opacity: isDone ? 0.6 : 0.3,
                    }}
                  />
                )}
              </div>

              {/* Text */}
              <div style={{ paddingTop: 8, paddingBottom: isLast ? 0 : 32 }}>
                <div
                  style={{
                    fontFamily: "'Heebo', sans-serif",
                    fontSize: 36,
                    fontWeight: 700,
                    color: isDone ? BRAND.text : BRAND.muted,
                  }}
                >
                  {step.label}
                </div>
                {step.sublabel && (
                  <div
                    style={{
                      fontFamily: "'Heebo', sans-serif",
                      fontSize: 28,
                      color: BRAND.muted,
                      marginTop: 6,
                    }}
                  >
                    {step.sublabel}
                  </div>
                )}
              </div>
            </div>
          );
        }

        // Horizontal layout
        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              opacity,
              transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
              position: "relative",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: isDone ? accentColor : BRAND.bgF,
                border: `2px solid ${isDone ? accentColor : BRAND.borderStrong}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                color: isDone ? "#fff" : BRAND.muted,
                boxShadow: isDone ? `0 0 20px ${accentColor}66` : "none",
              }}
            >
              {step.icon ?? (isDone ? "✓" : String(i + 1))}
            </div>

            {!isLast && (
              <div
                style={{
                  position: "absolute",
                  top: 28,
                  right: -50,
                  width: 80,
                  height: 2,
                  background: isDone ? accentColor : BRAND.border,
                  opacity: isDone ? 0.6 : 0.3,
                }}
              />
            )}

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Heebo', sans-serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: isDone ? BRAND.text : BRAND.muted,
                }}
              >
                {step.label}
              </div>
              {step.sublabel && (
                <div
                  style={{
                    fontFamily: "'Heebo', sans-serif",
                    fontSize: 22,
                    color: BRAND.muted,
                    marginTop: 4,
                  }}
                >
                  {step.sublabel}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
