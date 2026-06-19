// ─────────────────────────────────────────────────────────────────────────────
// SubtitleEngine — מנוע כתוביות After Effects-style
//
// שימוש בסיסי:
//   import { SubtitleEngine } from "../subtitles/SubtitleEngine";
//   import { SUBTITLE_PRESETS } from "../subtitles/subtitle-config";
//   import captionsData from "../../public/captions.json";
//
//   <SubtitleEngine captions={captionsData} style={SUBTITLE_PRESETS.tiktok} />
//
// שימוש עם override:
//   <SubtitleEngine
//     captions={captionsData}
//     style={{ ...SUBTITLE_PRESETS.hebrew_bold, fontSize: 80, positionY: 0.86 }}
//   />
// ─────────────────────────────────────────────────────────────────────────────

import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption } from "@remotion/captions";
import { loadFont } from "@remotion/google-fonts/Heebo";
import { CaptionPage } from "./CaptionPage";
import { DEFAULT_SUBTITLE_STYLE } from "./subtitle-config";
import type { SubtitleStyle } from "./subtitle-config";

// טוען את Heebo בכל משקלים הנדרשים לפני הרינדור הראשון
loadFont("normal", { weights: ["400", "600", "700", "800", "900"] });

type Props = {
  captions: Caption[];
  style?: Partial<SubtitleStyle>;
};

export const SubtitleEngine: React.FC<Props> = ({ captions, style: styleOverride }) => {
  const { fps } = useVideoConfig();

  const style: SubtitleStyle = {
    ...DEFAULT_SUBTITLE_STYLE,
    ...styleOverride,
  };

  const { pages } = useMemo(() => {
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: style.wordsPerPageMs,
    });
  }, [captions, style.wordsPerPageMs]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pages.map((page, i) => {
        const nextPage = pages[i + 1] ?? null;

        const startFrame = Math.round((page.startMs / 1000) * fps);
        const endFrame = nextPage
          ? Math.round((nextPage.startMs / 1000) * fps)
          : startFrame + Math.round((style.wordsPerPageMs / 1000) * fps);

        const durationInFrames = Math.max(1, endFrame - startFrame);

        return (
          <Sequence
            key={`page-${i}`}
            from={startFrame}
            durationInFrames={durationInFrames}
            layout="none"
          >
            <CaptionPage page={page} style={style} totalFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
