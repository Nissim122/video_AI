import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  OffthreadVideo,
  staticFile,
} from "remotion";
import { PersonBurst } from "../../components/PersonBurst";
import { StripTransition } from "../../components/StripTransition";
import { IrisTransition } from "../../components/IrisTransition";
import { STRIP_TRANSITIONS, IRIS_TRANSITIONS } from "./edit-config";

const BRAND = {
  pink:   "#e0176b",
  blueL:  "#2db3cd",
  green:  "#28c76f",
};

// ── Aurora blobs — iridescent glow overlay for first 5 seconds ───────────────
const AuroraEffect: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const endFrame = 5 * fps;

  const opacity = interpolate(
    frame,
    [0, 12, endFrame - 18, endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const t = frame / 30;

  // Animated center positions — slow organic drift
  const b1x = 540 + Math.sin(t * 0.30) * 230;
  const b1y = 480 + Math.cos(t * 0.22) * 170;
  const b2x = 260 + Math.sin(t * 0.42 + 1.2) * 270;
  const b2y = 1280 + Math.cos(t * 0.33 + 0.8) * 210;
  const b3x = 840 + Math.sin(t * 0.27 + 2.1) * 210;
  const b3y = 960 + Math.cos(t * 0.38 + 1.4) * 250;
  const b4x = 540 + Math.sin(t * 0.19 + 3.0) * 190;
  const b4y = 1680 + Math.cos(t * 0.24 + 0.5) * 160;

  const blobStyle = (
    x: number,
    y: number,
    size: number,
    color: string
  ): React.CSSProperties => ({
    position: "absolute",
    width: size,
    height: size,
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    left: x - size / 2,
    top: y - size / 2,
    filter: "blur(72px)",
    borderRadius: "50%",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    >
      {/* Hot pink / magenta */}
      <div style={blobStyle(b1x, b1y, 1050, "rgba(224,23,107,0.58)")} />
      {/* Cyan / electric blue */}
      <div style={blobStyle(b2x, b2y, 950, "rgba(33,200,220,0.60)")} />
      {/* Violet / purple */}
      <div style={blobStyle(b3x, b3y, 860, "rgba(160,60,230,0.52)")} />
      {/* Mint / green */}
      <div style={blobStyle(b4x, b4y, 780, "rgba(40,199,111,0.45)")} />
    </div>
  );
};

// ── Gray rounded box behind the speaker — first 5 seconds ───────────────────
const SpeakerBox: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const endFrame = 5 * fps;

  const opacity = interpolate(
    frame,
    [0, 12, endFrame - 18, endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 277,
        top: 502,
        width: 526,
        height: 916,
        background: "rgba(140,140,140,1)",
        borderRadius: 56,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

// ── Main composition ──────────────────────────────────────────────────────────
export const ChofshiVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      {/* Background video — full screen (fallback while masked video processes) */}
      <OffthreadVideo
        src={staticFile("chofshi/chofshi.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Gray rounded box — sits above background, below masked person */}
      <SpeakerBox frame={frame} />

      {/* Masked person video (transparent background) — on top of gray box */}
      <OffthreadVideo
        src={staticFile("chofshi/chofshi_masked.webm")}
        transparent={true}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Aurora overlay — frames 0–150 (5 sec), blend mode: screen */}
      <AuroraEffect frame={frame} />

      {/* Text elements bursting from behind the speaker */}
      <PersonBurst
        personX={0.5}
        personY={0.55}
        enterFrame={45}
        stagger={12}
        elements={[
          { type: "text", text: "חוסך 10 שעות", targetX: 0.14, targetY: 0.28, color: BRAND.blueL, holdFrames: 90 },
          { type: "text", text: "100% אוטומטי",  targetX: 0.86, targetY: 0.31, color: BRAND.pink,  holdFrames: 90 },
          { type: "text", text: "ללא קוד",        targetX: 0.5,  targetY: 0.76, color: BRAND.green, holdFrames: 90 },
        ]}
      />

      {/* Strip / Iris transitions — topmost layer, covers everything. Driven by edit-config.ts */}
      {STRIP_TRANSITIONS.length > 0 && <StripTransition events={STRIP_TRANSITIONS} />}
      {IRIS_TRANSITIONS.length > 0 && <IrisTransition events={IRIS_TRANSITIONS} />}
    </AbsoluteFill>
  );
};
