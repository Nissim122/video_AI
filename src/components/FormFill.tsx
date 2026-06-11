import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

export interface FormField {
  label: string;
  value: string;
  /** frame when typing starts */
  startFrame: number;
  /** frames to type the full value — defaults to value.length * 3 */
  typingFrames?: number;
}

interface FormFillProps {
  fields: FormField[];
  title?: string;
  enterFrame?: number;
  positionY?: number;
  width?: number;
}

export const FormFill: React.FC<FormFillProps> = ({
  fields,
  title,
  enterFrame = 0,
  positionY = 400,
  width = 800,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 20, stiffness: 150, mass: 1.0 },
  });

  const scale   = interpolate(enter, [0, 1], [0.92, 1]);
  const opacity = interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top: positionY,
        left: (1080 - width) / 2,
        width,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        opacity,
        pointerEvents: "none",
        background: BRAND.bgE,
        borderRadius: 20,
        padding: "40px 48px",
        border: `1px solid ${BRAND.border}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      {title && (
        <div
          style={{
            fontFamily: "'Heebo', sans-serif",
            fontWeight: 700,
            fontSize: 40,
            color: BRAND.text,
            marginBottom: 32,
            direction: "rtl",
          }}
        >
          {title}
        </div>
      )}

      {fields.map((field, i) => {
        const elapsed = frame - field.startFrame;
        const typingFrames = field.typingFrames ?? field.value.length * 3;
        const charCount =
          elapsed < 0
            ? 0
            : Math.min(field.value.length, Math.floor((elapsed / typingFrames) * field.value.length));
        const isActive = elapsed >= 0 && charCount < field.value.length;
        const isDone   = charCount >= field.value.length && elapsed >= 0;

        return (
          <div key={i} style={{ marginBottom: i < fields.length - 1 ? 28 : 0 }}>
            <div
              style={{
                fontFamily: "'Heebo', sans-serif",
                fontSize: 28,
                color: BRAND.muted,
                marginBottom: 10,
                direction: "rtl",
              }}
            >
              {field.label}
            </div>
            <div
              style={{
                background: BRAND.bgF,
                borderRadius: 12,
                padding: "18px 24px",
                border: `1.5px solid ${isActive ? BRAND.blue : isDone ? BRAND.borderStrong : BRAND.border}`,
                boxShadow: isActive ? `0 0 0 3px rgba(33,150,176,0.15)` : "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                minHeight: 72,
                direction: "rtl",
              }}
            >
              <span
                style={{
                  fontFamily: "'Heebo', sans-serif",
                  fontSize: 32,
                  color: BRAND.text,
                  flex: 1,
                }}
              >
                {field.value.slice(0, charCount)}
              </span>
              {isActive && (
                <span
                  style={{
                    width: 2,
                    height: 36,
                    background: BRAND.blue,
                    opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
              )}
              {isDone && (
                <span style={{ color: BRAND.green, fontSize: 32, flexShrink: 0 }}>✓</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
