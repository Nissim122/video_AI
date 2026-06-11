import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

interface ToggleSwitchProps {
  /** frame at which toggle flips ON */
  toggleFrame: number;
  label?: string;
  labelOff?: string;
  labelOn?: string;
  enterFrame?: number;
  positionX?: number;
  positionY?: number;
  /** scale multiplier */
  size?: number;
  color?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  toggleFrame,
  label,
  labelOff = "ידני",
  labelOn = "אוטומטי",
  enterFrame = 0,
  positionX = 540,
  positionY = 960,
  size = 1,
  color = BRAND.green,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 14, stiffness: 200, mass: 0.8 },
  });

  const toggle = spring({
    frame: Math.max(0, frame - toggleFrame),
    fps,
    config: { damping: 14, stiffness: 300, mass: 0.5 },
  });

  const isOn  = frame >= toggleFrame;
  const W     = 160 * size;
  const H     = 90  * size;
  const knobR = (H - 16) / 2;
  const knobX = interpolate(toggle, [0, 1], [8, W - knobR * 2 - 8]);

  const opacity = interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const scale   = interpolate(enter, [0, 1], [0.85, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: positionY,
        left: positionX,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20 * size,
      }}
    >
      {label && (
        <div
          style={{
            fontFamily: "'Heebo', sans-serif",
            fontWeight: 700,
            fontSize: 36 * size,
            color: BRAND.text,
            direction: "rtl",
          }}
        >
          {label}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 24 * size }}>
        <span
          style={{
            fontFamily: "'Heebo', sans-serif",
            fontSize: 32 * size,
            color: isOn ? BRAND.subtle : BRAND.text,
            fontWeight: 600,
          }}
        >
          {labelOff}
        </span>

        {/* Track */}
        <div
          style={{
            width: W,
            height: H,
            borderRadius: H / 2,
            background: isOn ? color : BRAND.muted,
            position: "relative",
            boxShadow: isOn ? `0 0 30px ${color}66` : "none",
          }}
        >
          {/* Knob */}
          <div
            style={{
              position: "absolute",
              top: (H - knobR * 2) / 2,
              left: knobX,
              width: knobR * 2,
              height: knobR * 2,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
            }}
          />
        </div>

        <span
          style={{
            fontFamily: "'Heebo', sans-serif",
            fontSize: 32 * size,
            color: isOn ? BRAND.text : BRAND.subtle,
            fontWeight: 600,
          }}
        >
          {labelOn}
        </span>
      </div>
    </div>
  );
};
