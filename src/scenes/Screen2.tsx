import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { PhoneEntrance } from "../components/PhoneEntrance";
import { STRIP_PAGE_H } from "../components/ScrollingPhoneScreen";

// ── Timing (frames relative to scene start) ────────────────────────────────
const PAUSE_1_END = 28;
const PAUSE_2_END = 55;
const PAUSE_3_END = 82;
export const SCREEN2_DURATION = 145;

const SCROLL_SPRING = { damping: 22, stiffness: 260, mass: 0.7 };

// image: 1170×7479 → rendered at width 548 → height ≈ 3503px
// IPhone14 hides first 70px (top:-70). TOP_CROP adds extra to hide the Clix banner.
// max scroll = 3503 - 1290 - TOP_CROP = 2213 → 3 steps × 724px
const TOP_CROP = 64; // +24px (~2% of PHONE_H)
const SCROLL_STEP = 724;

interface Screen2Props {
  startAt: number;
}

export const Screen2: React.FC<Screen2Props> = ({ startAt }) => {
  const frame = useCurrentFrame();
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
      <PhoneEntrance variant="slideFromRight" delay={startAt}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <Img
            src={staticFile("screenshot-3-screen2-mobile.png")}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              transform: `translateY(${scrollY}px)`,
            }}
          />
        </div>
      </PhoneEntrance>
    </div>
  );
};
