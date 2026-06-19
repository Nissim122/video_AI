import { DEFAULT_CONFIG } from "../VideoEditorTypes";

export const VIDEO_CONFIG = {
  ...DEFAULT_CONFIG,
  src: "30bachodesh/30bachodesh.mp4",
  durationInFrames: 1239,

  topVignette: false,
  grade: { show: false, vignetteStrength: 0, tone: "neutral" as const, brightness: 1, contrast: 1 },

  logo: { show: true, corner: "top-right" as const, fadeInFrame: 15 },

  outro: {
    show: false,
    enterFrame: 1150,
    ctaText: "רוצה אוטומציה לעסק שלך?",
    subText: "השאר פרטים ואחזור אליך תוך 24 שעות",
    linkText: "clixautomations.com",
  },

  aeTexts: [
    { text: "עסק", enterFrame: 50, positionY: 0.5 },
  ],
};
