import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export type PunchType = "zoom-punch" | "flash" | "glitch" | "swipe-right" | "swipe-left";

export interface PunchItem {
  frame: number;
  type: PunchType;
  /** duration in frames — default varies by type */
  duration?: number;
}

interface PunchTransitionProps {
  punches: PunchItem[];
}

// Each effect is a self-contained overlay rendered for its window only
const ZoomPunch: React.FC<{ localFrame: number; duration: number }> = ({ localFrame, duration }) => {
  if (localFrame < 0 || localFrame > duration) return null;
  const half = duration / 2;
  const scale = localFrame <= half
    ? interpolate(localFrame, [0, half], [1, 1.06], { extrapolateRight: "clamp" })
    : interpolate(localFrame, [half, duration], [1.06, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `scale(${scale})`,
        pointerEvents: "none",
      }}
    />
  );
};

const Flash: React.FC<{ localFrame: number; duration: number }> = ({ localFrame, duration }) => {
  if (localFrame < 0 || localFrame > duration) return null;
  const opacity = localFrame <= 2
    ? interpolate(localFrame, [0, 2], [0.85, 0.4], { extrapolateRight: "clamp" })
    : interpolate(localFrame, [2, duration], [0.4, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#ffffff",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

const Glitch: React.FC<{ localFrame: number; duration: number }> = ({ localFrame, duration }) => {
  if (localFrame < 0 || localFrame > duration) return null;

  const progress = localFrame / duration;
  const intensity = Math.sin(progress * Math.PI);

  const offsetX  = (Math.sin(localFrame * 7.3) * 18 + Math.sin(localFrame * 3.1) * 10) * intensity;
  const offsetY  = (Math.sin(localFrame * 5.7) * 8) * intensity;
  const redOp    = intensity * 0.55;
  const cyanOp   = intensity * 0.45;

  return (
    <>
      {/* red channel shift */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#ff0040",
          opacity: redOp,
          mixBlendMode: "screen",
          transform: `translate(${offsetX}px, ${-offsetY}px)`,
          pointerEvents: "none",
        }}
      />
      {/* cyan channel shift */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#00ffff",
          opacity: cyanOp,
          mixBlendMode: "screen",
          transform: `translate(${-offsetX * 0.6}px, ${offsetY}px)`,
          pointerEvents: "none",
        }}
      />
      {/* horizontal scan lines */}
      {Array.from({ length: 4 }).map((_, i) => {
        const top = ((i / 4) * 1920 + localFrame * 60 * (i % 2 === 0 ? 1 : -1)) % 1920;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top,
              height: 6,
              background: i % 2 === 0 ? "#ff0040" : "#00ffff",
              opacity: intensity * 0.4,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
};

const Swipe: React.FC<{ localFrame: number; duration: number; dir: "left" | "right" }> = ({
  localFrame,
  duration,
  dir,
}) => {
  if (localFrame < 0 || localFrame > duration) return null;

  const p = interpolate(localFrame, [0, duration], [0, 1], { extrapolateRight: "clamp" });
  // swipe line passes center at p=0.5
  const x = dir === "right"
    ? interpolate(p, [0, 1], [-1080, 1080])
    : interpolate(p, [0, 1], [1080, -1080]);

  const lineOpacity = interpolate(p, [0, 0.1, 0.9, 1], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* bright edge line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 6,
          left: x,
          background: "rgba(255,255,255,0.9)",
          boxShadow: "0 0 30px 10px rgba(255,255,255,0.5)",
          opacity: lineOpacity,
        }}
      />
      {/* motion blur trail */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 60,
          left: dir === "right" ? x - 60 : x + 6,
          background: dir === "right"
            ? "linear-gradient(to right, transparent, rgba(255,255,255,0.15))"
            : "linear-gradient(to left, transparent, rgba(255,255,255,0.15))",
          opacity: lineOpacity,
        }}
      />
    </div>
  );
};

// ─── Wrapper ──────────────────────────────────────────────────────────────────
export const PunchTransition: React.FC<PunchTransitionProps> = ({ punches }) => {
  const frame = useCurrentFrame();

  return (
    <>
      {punches.map((punch, i) => {
        const defaultDuration: Record<PunchType, number> = {
          "zoom-punch":  12,
          "flash":       10,
          "glitch":      14,
          "swipe-right": 10,
          "swipe-left":  10,
        };
        const dur = punch.duration ?? defaultDuration[punch.type];
        const local = frame - punch.frame;

        if (local < 0 || local > dur) return null;

        switch (punch.type) {
          case "zoom-punch":  return <ZoomPunch  key={i} localFrame={local} duration={dur} />;
          case "flash":       return <Flash      key={i} localFrame={local} duration={dur} />;
          case "glitch":      return <Glitch     key={i} localFrame={local} duration={dur} />;
          case "swipe-right": return <Swipe      key={i} localFrame={local} duration={dur} dir="right" />;
          case "swipe-left":  return <Swipe      key={i} localFrame={local} duration={dur} dir="left" />;
          default:            return null;
        }
      })}
    </>
  );
};
