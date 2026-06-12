import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../brand";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BurstElementType = "stat" | "text" | "badge" | "icon";

export interface BurstElement {
  type: BurstElementType;
  // positioning — 0–1 fractions of canvas width/height
  targetX: number;
  targetY: number;
  // stat
  value?: number;
  suffix?: string;
  prefix?: string;
  label?: string;
  // text / badge / icon
  text?: string;
  // style
  color?: string;
  size?: "sm" | "md" | "lg";
  // timing overrides
  holdFrames?: number;
  exitFrame?: number;
}

export interface PersonBurstProps {
  // where on screen the person stands (0–1 fractions)
  personX?: number;
  personY?: number;
  enterFrame: number;
  stagger?: number; // frames between each element (default 7)
  elements: BurstElement[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useSpringProgress(localFrame: number, delay: number, fps: number) {
  return spring({
    frame: Math.max(0, localFrame - delay),
    fps,
    config: { damping: 14, stiffness: 220, mass: 0.65 },
  });
}

// ─── Element renderers ────────────────────────────────────────────────────────

const StatEl: React.FC<{ el: BurstElement }> = ({ el }) => {
  const accent = el.color ?? BRAND.blueL;
  const sz = el.size ?? "md";
  const [valSize, labelSize, padding] =
    sz === "lg" ? [68, 26, "18px 28px"] :
    sz === "sm" ? [40, 18, "10px 18px"] :
                  [54, 22, "14px 24px"];

  return (
    <div
      style={{
        background: "rgba(14,22,40,0.82)",
        border: `1.5px solid ${accent}44`,
        borderRadius: 20,
        padding,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        backdropFilter: "blur(12px)",
        boxShadow: `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px ${accent}22`,
        minWidth: sz === "lg" ? 200 : sz === "sm" ? 110 : 150,
      }}
    >
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: valSize,
          letterSpacing: "-0.03em",
          color: accent,
          lineHeight: 1,
          direction: "ltr",
        }}
      >
        {el.prefix ?? ""}{el.value ?? ""}{el.suffix ?? ""}
      </span>
      {el.label && (
        <span
          style={{
            fontFamily: "'Heebo', sans-serif",
            fontWeight: 600,
            fontSize: labelSize,
            color: BRAND.text,
            opacity: 0.85,
            whiteSpace: "nowrap",
          }}
        >
          {el.label}
        </span>
      )}
    </div>
  );
};

const TextEl: React.FC<{ el: BurstElement }> = ({ el }) => {
  const accent = el.color ?? BRAND.pink;
  const sz = el.size ?? "md";
  const [fontSize, px, py] =
    sz === "lg" ? [44, 28, 14] :
    sz === "sm" ? [26, 16, 8] :
                  [34, 22, 10];

  return (
    <div
      style={{
        background: `${accent}18`,
        border: `1.5px solid ${accent}55`,
        borderRadius: 40,
        padding: `${py}px ${px}px`,
        backdropFilter: "blur(10px)",
        boxShadow: `0 6px 24px rgba(0,0,0,0.38)`,
      }}
    >
      <span
        style={{
          fontFamily: "'Heebo', sans-serif",
          fontWeight: 700,
          fontSize,
          color: BRAND.text,
          whiteSpace: "nowrap",
        }}
      >
        {el.text ?? ""}
      </span>
    </div>
  );
};

const BadgeEl: React.FC<{ el: BurstElement }> = ({ el }) => {
  const accent = el.color ?? BRAND.green;
  const sz = el.size ?? "md";
  const dim = sz === "lg" ? 130 : sz === "sm" ? 72 : 100;
  const fs = sz === "lg" ? 32 : sz === "sm" ? 17 : 24;

  return (
    <div
      style={{
        width: dim,
        height: dim,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${accent}44, ${accent}18)`,
        border: `2px solid ${accent}88`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
        backdropFilter: "blur(8px)",
        boxShadow: `0 6px 24px rgba(0,0,0,0.4), 0 0 40px ${accent}33`,
        textAlign: "center",
        padding: 8,
      }}
    >
      <span
        style={{
          fontFamily: "'Heebo', sans-serif",
          fontWeight: 700,
          fontSize: fs,
          color: BRAND.text,
          lineHeight: 1.2,
        }}
      >
        {el.text ?? el.value ?? ""}
        {el.suffix && (
          <span style={{ color: accent, fontSize: fs * 0.8 }}>{el.suffix}</span>
        )}
      </span>
      {el.label && (
        <span
          style={{
            fontFamily: "'Heebo', sans-serif",
            fontWeight: 600,
            fontSize: fs * 0.55,
            color: BRAND.muted,
          }}
        >
          {el.label}
        </span>
      )}
    </div>
  );
};

const IconEl: React.FC<{ el: BurstElement }> = ({ el }) => {
  const sz = el.size ?? "md";
  const dim = sz === "lg" ? 96 : sz === "sm" ? 54 : 74;
  const fs = sz === "lg" ? 52 : sz === "sm" ? 30 : 40;
  const accent = el.color ?? BRAND.blueL;

  return (
    <div
      style={{
        width: dim,
        height: dim,
        borderRadius: 22,
        background: "rgba(14,22,40,0.78)",
        border: `1.5px solid ${accent}44`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(10px)",
        boxShadow: `0 6px 24px rgba(0,0,0,0.4)`,
        fontSize: fs,
      }}
    >
      {el.text ?? "✨"}
    </div>
  );
};

function renderElement(el: BurstElement) {
  switch (el.type) {
    case "stat":   return <StatEl   el={el} />;
    case "text":   return <TextEl   el={el} />;
    case "badge":  return <BadgeEl  el={el} />;
    case "icon":   return <IconEl   el={el} />;
    default:       return null;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export const PersonBurst: React.FC<PersonBurstProps> = ({
  personX = 0.5,
  personY = 0.55,
  enterFrame,
  stagger = 7,
  elements,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const localFrame = frame - enterFrame;

  // origin in px — the person's approximate position
  const originX = personX * width;
  const originY = personY * height;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {elements.map((el, i) => {
        const delay = i * stagger;
        const progress = useSpringProgress(localFrame, delay, fps);

        // exit: fade + scale down
        let exitOpacity = 1;
        let exitScale = 1;
        if (el.exitFrame != null) {
          const ef = el.exitFrame - enterFrame;
          exitOpacity = interpolate(localFrame, [ef, ef + 12], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          exitScale = interpolate(localFrame, [ef, ef + 12], [1, 0.7], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
        } else if (el.holdFrames != null) {
          const ef = delay + el.holdFrames;
          exitOpacity = interpolate(localFrame, [ef, ef + 12], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          exitScale = interpolate(localFrame, [ef, ef + 12], [1, 0.7], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
        }

        const targetX = el.targetX * width;
        const targetY = el.targetY * height;

        // element moves from origin → target
        const currentX = originX + (targetX - originX) * progress;
        const currentY = originY + (targetY - originY) * progress;

        // scale: starts at 0 at the person's body, grows to 1 at destination
        const entryScale = interpolate(progress, [0, 0.6, 1], [0, 1.08, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // blur: starts blurry (depth illusion) and sharpens as it exits
        const blur = interpolate(progress, [0, 0.45, 1], [8, 2, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // opacity: quick fade in from 0
        const entryOpacity = interpolate(progress, [0, 0.2], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const combinedScale = entryScale * exitScale;
        const combinedOpacity = entryOpacity * exitOpacity;

        if (combinedOpacity <= 0) return null;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: currentX,
              top: currentY,
              transform: `translate(-50%, -50%) scale(${combinedScale})`,
              opacity: combinedOpacity,
              filter: `blur(${blur}px)`,
              transformOrigin: "center center",
            }}
          >
            {renderElement(el)}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
