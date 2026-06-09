import React from "react";
import { useCurrentFrame, interpolate, Img, staticFile } from "remotion";
import { PhoneEntrance } from "../components/PhoneEntrance";

const FRAMES_COUNT = 8;
const FRAMES_PER_IMAGE = 9;  // 0.3s per image
const CROSSFADE = 5;          // smooth dissolve between frames

export const SCANNER_DURATION = 80; // ~2.7s total

// Returns opacity for image i at the current frame — dissolves in/out
// Uses separate fade-in × fade-out to guarantee no duplicate keyframes.
function imageOpacity(frame: number, i: number): number {
  const start = i * FRAMES_PER_IMAGE;
  const end = start + FRAMES_PER_IMAGE;

  // First frame has nothing before it — start fully visible
  const fadeIn = i === 0
    ? 1
    : interpolate(frame, [start - CROSSFADE, start], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  // Last frame holds indefinitely — overall exitOpacity handles the fade-out
  const fadeOut = i === FRAMES_COUNT - 1
    ? 1
    : interpolate(frame, [end - CROSSFADE, end], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  return fadeIn * fadeOut;
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
