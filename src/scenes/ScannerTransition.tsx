import React from "react";
import { useCurrentFrame, interpolate, Img, staticFile } from "remotion";
import { PhoneEntrance } from "../components/PhoneEntrance";

const FRAMES_COUNT = 8;
const FRAMES_PER_IMAGE = 9;  // 0.3s per image
const CROSSFADE = 5;          // smooth dissolve between frames

export const SCANNER_DURATION = 80; // ~2.7s total

// Returns opacity for image i at the current frame — dissolves in/out
function imageOpacity(frame: number, i: number): number {
  const start = i * FRAMES_PER_IMAGE;
  const fadeInStart = start - CROSSFADE; // may be negative for i=0
  const fadeOutStart = start + FRAMES_PER_IMAGE - CROSSFADE;
  const fadeOutEnd = start + FRAMES_PER_IMAGE;

  if (i === FRAMES_COUNT - 1) {
    // Last frame: fade in and hold
    if (fadeInStart >= start) return 1; // no fade-in needed
    return interpolate(frame, [fadeInStart, start], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  if (fadeInStart >= start) {
    // No room for fade-in (i=0 with CROSSFADE=0), just fade-out
    return interpolate(frame, [fadeOutStart, fadeOutEnd], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return interpolate(
    frame,
    [fadeInStart, start, fadeOutStart, fadeOutEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}

export const ScannerTransition: React.FC = () => {
  const frame = useCurrentFrame();

  const enterOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitOpacity = interpolate(
    frame,
    [SCANNER_DURATION - 14, SCANNER_DURATION - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const sceneOpacity = enterOpacity * exitOpacity;

  // Crops the "Clix Automations" nav bar (IPhone14 already hides the status bar via top:-70)
  const NAV_CROP = 100;

  return (
    <div style={{ opacity: sceneOpacity }}>
      <PhoneEntrance variant="slideUp" delay={0}>
        {/* outer clips anything above the IPhone14 screen area */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* inner shifts content up by NAV_CROP to hide the nav bar */}
          <div style={{ position: "absolute", top: -NAV_CROP, left: 0, right: 0, bottom: 0 }}>
            {Array.from({ length: FRAMES_COUNT }, (_, i) => (
              <Img
                key={i}
                src={staticFile(
                  `scanner-frames/anim-frame-${String(i + 1).padStart(2, "0")}.png`
                )}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: `calc(100% + ${NAV_CROP}px)`,
                  objectFit: "cover",
                  objectPosition: "top center",
                  opacity: imageOpacity(frame, i),
                }}
              />
            ))}
          </div>
        </div>
      </PhoneEntrance>
    </div>
  );
};
