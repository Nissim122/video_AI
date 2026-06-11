import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, staticFile } from "remotion";
import { VideoBase } from "./VideoBase";
import { BRAND } from "../brand";

export type BRollTransition = "fade" | "slide-up" | "slide-down" | "zoom";

export interface BRollContent {
  type: "image" | "video";
  src: string;
}

interface BRollOverlayProps {
  content: BRollContent;
  enterFrame: number;
  exitFrame: number;
  transition?: BRollTransition;
  /** optional label shown at bottom */
  label?: string;
  /** dim the transition — how much of the frame is b-roll vs host (0=full takeover, 1=side-by-side strip at top) */
  splitY?: number;
}

export const BRollOverlay: React.FC<BRollOverlayProps> = ({
  content,
  enterFrame,
  exitFrame,
  transition = "fade",
  label,
  splitY,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cfg = { damping: 22, stiffness: 180, mass: 0.9 };

  const enterP = spring({ frame: Math.max(0, frame - enterFrame), fps, config: cfg });
  const exitP  = spring({ frame: Math.max(0, frame - exitFrame),  fps, config: cfg });

  // ── Opacity ────────────────────────────────────────────────────────────────
  const opacity = Math.max(
    0,
    interpolate(enterP, [0, 1], [0, 1], { extrapolateRight: "clamp" }) -
    interpolate(exitP,  [0, 1], [0, 1], { extrapolateRight: "clamp" })
  );

  // ── Transform ─────────────────────────────────────────────────────────────
  let transform = "";
  if (transition === "slide-up") {
    const ty =
      interpolate(enterP, [0, 1], [300, 0]) +
      interpolate(exitP,  [0, 1], [0, -300]);
    transform = `translateY(${ty}px)`;
  } else if (transition === "slide-down") {
    const ty =
      interpolate(enterP, [0, 1], [-300, 0]) +
      interpolate(exitP,  [0, 1], [0, 300]);
    transform = `translateY(${ty}px)`;
  } else if (transition === "zoom") {
    const scale =
      interpolate(enterP, [0, 1], [1.1, 1]) -
      interpolate(exitP,  [0, 1], [0, 0.1]);
    transform = `scale(${Math.max(0.01, scale)})`;
  }

  // ── Layout — full takeover vs split ───────────────────────────────────────
  const isSplit = splitY != null;
  const containerStyle: React.CSSProperties = isSplit
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: splitY,
        overflow: "hidden",
      }
    : {
        position: "absolute",
        inset: 0,
      };

  return (
    <div style={{ ...containerStyle, opacity, transform, pointerEvents: "none" }}>
      {/* content */}
      {content.type === "image" ? (
        <img
          src={staticFile(content.src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <VideoBase src={content.src} />
      )}

      {/* subtle dark overlay so text on top is readable */}
      {!isSplit && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%, transparent 65%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      )}

      {/* optional label */}
      {label && (
        <div
          style={{
            position: "absolute",
            bottom: isSplit ? 24 : 80,
            left: 60,
            right: 60,
            background: "rgba(14,22,40,0.82)",
            backdropFilter: "blur(14px)",
            border: `1.5px solid ${BRAND.border}`,
            borderRadius: 18,
            padding: "18px 32px",
            fontFamily: "'Heebo', sans-serif",
            fontWeight: 700,
            fontSize: 40,
            color: BRAND.text,
            direction: "rtl",
            textAlign: "center",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
