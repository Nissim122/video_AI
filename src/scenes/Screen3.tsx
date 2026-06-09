import React from "react";
import { useCurrentFrame, interpolate, Img, staticFile, Easing } from "remotion";
import { PhoneEntrance } from "../components/PhoneEntrance";
import { ScrollGesture } from "../components/ScrollGesture";
import { CircleClick } from "../components/CircleClick";

// Image: 1170×7878 → rendered at 548px wide → height ≈ 3690px
// IPhone14 crops 70px from top (status bar). Visible window: 1220px.
// Max scroll to reach bottom: 3690 - 1220 - 70 = 2400px
const MAX_SCROLL = 2400;
const ENTRANCE_FRAMES = 20;
const SCROLL_FRAMES = 210; // 7 seconds at 30fps
const HOLD_END = 20;
const IMAGE_START_OFFSET = 38; // px to skip at top of image
export const SCREEN3_DURATION = ENTRANCE_FRAMES + SCROLL_FRAMES + HOLD_END; // 250

// ── Click sequence — circles scroll with content ────────────────────────────
// imageY/imageX: px from top-left of rendered image (548px wide, ~3690px tall)
// startAt/duration: LOCAL frames (f = logical_global − T.screen3.start)
const CLICKS: Array<{
  imageY: number;
  imageX: number;
  size?: number;
  startAt: number;
  duration: number;
  label?: string;
}> = [
  { imageY: 800, imageX: 493, startAt: 27, duration: 40, label: "click 1" },
  { imageY: 2188, imageX: 493, startAt: 119, duration: 40, label: "click 2" },
  { imageY: 3169, imageX: 493, startAt: 169, duration: 40, label: "click 3" },
];

interface Screen3Props {
  startAt?: number;
  logicalFrame?: number;
}

export const Screen3: React.FC<Screen3Props> = ({ startAt = 0, logicalFrame }) => {
  const rawFrame = useCurrentFrame();
  const frame = logicalFrame ?? rawFrame;
  const f = Math.max(0, frame - startAt);

  const phoneOpacity = interpolate(f, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scrollY = interpolate(
    f,
    [ENTRANCE_FRAMES, ENTRANCE_FRAMES + SCROLL_FRAMES],
    [-IMAGE_START_OFFSET, -MAX_SCROLL],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.42, 0, 0.58, 1),
    }
  );

  return (
    <div style={{ opacity: phoneOpacity }}>
      <PhoneEntrance variant="slideFromRight" delay={startAt} frame={logicalFrame}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Scrolling wrapper — image and circles together so clicks track content */}
          <div
            style={{
              position: "relative",
              width: "100%",
              transform: `translateY(${scrollY}px)`,
            }}
          >
            <Img
              src={staticFile("screenshot-2-screen4-mobile.png")}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            {CLICKS.map((c, i) => (
              <ScrollGesture
                key={i}
                frame={f}
                imageY={c.imageY}
                imageX={c.imageX}
                size={c.size}
                startAt={c.startAt}
                duration={c.duration}
              />
            ))}
            <CircleClick
              frame={f}
              imageY={3558}
              imageX={242}
              startAt={229}
              duration={14}
            />
          </div>
        </div>
      </PhoneEntrance>
    </div>
  );
};
