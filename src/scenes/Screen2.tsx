import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { PhoneEntrance } from "../components/PhoneEntrance";
import { CircleClick } from "../components/CircleClick";

// ── Timing (frames relative to scene start) ────────────────────────────────
const PAUSE_1_END = 28;
const PAUSE_2_END = 55;
const PAUSE_3_END = 82;
export const SCREEN2_DURATION = 145;

const SCROLL_SPRING = { damping: 22, stiffness: 260, mass: 0.7 };

// image: 1170×7479 → rendered at width 548 → height ≈ 3503px
// IPhone14 hides first 70px (top:-70). TOP_CROP adds extra to hide the Clix banner.
// Absolute image position formula (px from image top):
//   page 1: imageY = top_frac × 1290 + TOP_CROP
//   page 2: imageY = top_frac × 1290 + TOP_CROP + SCROLL_STEP
//   page 3: imageY = top_frac × 1290 + TOP_CROP + 2×SCROLL_STEP
const TOP_CROP = 64;
const SCROLL_STEP = 724;

// ── Click sequence — one circle at a time, no two under the same heading ───
// imageY/imageX are px from top-left of the rendered image (548px wide).
// startAt / duration are LOCAL frames (f = logical_global − startAt_scene).
// Add entries here after confirming positions in Remotion Studio.
const CLICKS: Array<{
  imageY: number;
  imageX: number;
  size?: number;
  startAt: number;
  duration: number;
  label?: string;
}> = [
  // Page 1 — visible before 1st scroll (PAUSE_1_END=28)
  { imageY: 470, imageX: 48, startAt: 16, duration: 10, label: "Origami (CRM)" },
  { imageY: 1000, imageX: 300, startAt: 20, duration: 14, label: "click 2" },
  { imageY: 1398, imageX: 427, startAt: 38, duration: 14, label: "click 3" },
];

interface Screen2Props {
  startAt?: number;
  logicalFrame?: number;
}

export const Screen2: React.FC<Screen2Props> = ({ startAt = 0, logicalFrame }) => {
  const rawFrame = useCurrentFrame();
  const frame = logicalFrame ?? rawFrame;
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - startAt);

  const phoneOpacity = interpolate(f, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const s1 = spring({ frame: f - PAUSE_1_END, fps, config: SCROLL_SPRING });
  const s2 = spring({ frame: f - PAUSE_2_END, fps, config: SCROLL_SPRING });
  const s3 = spring({ frame: f - PAUSE_3_END, fps, config: SCROLL_SPRING });

  const scrollY = -(s1 + s2 + s3) * SCROLL_STEP - TOP_CROP;

  return (
    <div style={{ opacity: phoneOpacity }}>
      <PhoneEntrance variant="slideFromRight" delay={startAt} frame={logicalFrame}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Scrolling wrapper — both image and circles live here so circles track content */}
          <div
            style={{
              position: "relative",
              width: "100%",
              transform: `translateY(${scrollY}px)`,
            }}
          >
            <Img
              src={staticFile("screenshot-3-screen2-mobile.png")}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            {CLICKS.map((c, i) => (
              <CircleClick
                key={i}
                frame={f}
                imageY={c.imageY}
                imageX={c.imageX}
                size={c.size}
                startAt={c.startAt}
                duration={c.duration}
              />
            ))}
          </div>
        </div>
      </PhoneEntrance>
    </div>
  );
};
