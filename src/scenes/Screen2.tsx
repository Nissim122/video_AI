import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhoneEntrance } from "../components/PhoneEntrance";
import { ScrollingPhoneScreen, STRIP_PAGE_H } from "../components/ScrollingPhoneScreen";
import { GlowHighlight } from "../components/GlowHighlight";
import { SCREEN_2_FORM } from "../screens/screen-2-form.coords";

// ── Timing (frames relative to scene start) ────────────────────────────────
// phone settled=18 | scroll1=28 | scroll2=55 | scroll3=82
const PAUSE_1_END  = 28;   // p1 highlights: +14, +18, +22
const PAUSE_2_END  = 55;   // p2 highlights: +40, +44, +48
const PAUSE_3_END  = 82;   // p3 highlights: +66, +70, +74
const SCROLL_3_END = 100;
const GLOW_4_START = 108;
export const SCREEN2_DURATION = 145;

// Fast spring: settles in ~18 frames
const SCROLL_SPRING = { damping: 22, stiffness: 260, mass: 0.7 };

interface Screen2Props {
  /** Global frame at which this scene starts (T.screen2.start) */
  startAt: number;
  /** Filenames in public/ — 4 sequential screenshots */
  images: [string, string, string, string];
}

export const Screen2: React.FC<Screen2Props> = ({ startAt, images }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - startAt);

  // ── Fade in wrapper ────────────────────────────────────────────────────────
  const phoneOpacity = interpolate(f, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Scrolling strip with 10% overlap ─────────────────────────────────────
  // Images are stacked with 90% spacing (each covers 10% of the one above).
  // A single globalScroll moves all images together as a unit.
  const s1 = spring({ frame: f - PAUSE_1_END, fps, config: SCROLL_SPRING });
  const s2 = spring({ frame: f - PAUSE_2_END, fps, config: SCROLL_SPRING });
  const s3 = spring({ frame: f - PAUSE_3_END, fps, config: SCROLL_SPRING });

  const STEP = STRIP_PAGE_H * 0.95; // 5% overlap between consecutive images
  const globalScroll = -(s1 + s2 + s3) * STEP;

  const scrollYs = [
    globalScroll,
    globalScroll + STEP,
    globalScroll + STEP * 2,
    globalScroll + STEP * 3,
  ];

  const onPage4 = f >= SCROLL_3_END;

  return (
    <div style={{ opacity: phoneOpacity }}>
      <PhoneEntrance variant="slideFromRight" delay={startAt}>
        <ScrollingPhoneScreen images={images} scrollYs={scrollYs} topCrops={[70, 70, 70, 70]} bottomCrops={[180, 180, 180, 180]}>

          {/* ━━ PAGE 1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <GlowHighlight pos={SCREEN_2_FORM.item_a_p1} startAt={startAt + 4}  shape="circle" fadeInFrames={4} fadeOutAt={startAt + PAUSE_1_END} />
          <GlowHighlight pos={SCREEN_2_FORM.item_b_p1} startAt={startAt + 9}  shape="circle" fadeInFrames={4} fadeOutAt={startAt + PAUSE_1_END} />
          <GlowHighlight pos={SCREEN_2_FORM.item_c_p1} startAt={startAt + 14} shape="circle" fadeInFrames={4} fadeOutAt={startAt + PAUSE_1_END} />

          {/* ━━ PAGE 2 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <GlowHighlight pos={SCREEN_2_FORM.item_a_p2} startAt={startAt + 32} shape="circle" fadeInFrames={4} fadeOutAt={startAt + PAUSE_2_END} />
          <GlowHighlight pos={SCREEN_2_FORM.item_b_p2} startAt={startAt + 37} shape="circle" fadeInFrames={4} fadeOutAt={startAt + PAUSE_2_END} />
          <GlowHighlight pos={SCREEN_2_FORM.item_c_p2} startAt={startAt + 42} shape="circle" fadeInFrames={4} fadeOutAt={startAt + PAUSE_2_END} />

          {/* ━━ PAGE 3 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <GlowHighlight pos={SCREEN_2_FORM.item_a_p3} startAt={startAt + 59} shape="circle" fadeInFrames={4} fadeOutAt={startAt + PAUSE_3_END} />
          <GlowHighlight pos={SCREEN_2_FORM.item_b_p3} startAt={startAt + 64} shape="circle" fadeInFrames={4} fadeOutAt={startAt + PAUSE_3_END} />
          <GlowHighlight pos={SCREEN_2_FORM.item_c_p3} startAt={startAt + 69} shape="circle" fadeInFrames={4} fadeOutAt={startAt + PAUSE_3_END} />

          {/* ━━ PAGE 4 — continue button glow ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {onPage4 && (
            <GlowHighlight
              pos={SCREEN_2_FORM.continue_btn}
              startAt={startAt + GLOW_4_START}
              shape="rect"
              color="#e0176b"
              badge={false}
            />
          )}
        </ScrollingPhoneScreen>
      </PhoneEntrance>
    </div>
  );
};
