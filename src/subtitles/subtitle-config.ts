// ─────────────────────────────────────────────────────────────────────────────
// Subtitle Config — After Effects-style full control over captions
// שינוי פרמטר אחד → כל הכתוביות מתעדכנות אוטומטית
// ─────────────────────────────────────────────────────────────────────────────

export type SubtitleAnimationType = "fade" | "slide-up" | "pop" | "none";
export type SubtitleHighlightStyle = "color" | "background" | "underline" | "glow" | "none";

export type SubtitleStyle = {
  // ── Typography ─────────────────────────────────────────────────────────────
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;  // em units (e.g. -0.02)
  lineHeight: number;     // multiplier (e.g. 1.3)

  // ── Text color ─────────────────────────────────────────────────────────────
  textColor: string;

  // ── Active word ────────────────────────────────────────────────────────────
  highlightStyle: SubtitleHighlightStyle;
  activeColor: string;         // color for 'color' | 'glow' | 'underline' styles
  activeBgColor: string;       // background color for 'background' style
  activeBgRadius: number;      // border-radius in px
  activeBgPaddingX: number;    // horizontal padding in px
  activeBgPaddingY: number;    // vertical padding in px

  // ── Text background box ────────────────────────────────────────────────────
  textBg: boolean;
  textBgColor: string;
  textBgRadius: number;
  textBgPaddingX: number;      // horizontal padding in px
  textBgPaddingY: number;      // vertical padding in px

  // ── Stroke / outline ───────────────────────────────────────────────────────
  stroke: boolean;
  strokeColor: string;
  strokeWidth: number;         // px

  // ── Drop shadow ───────────────────────────────────────────────────────────
  shadow: boolean;
  shadowColor: string;
  shadowBlur: number;          // px
  shadowX: number;             // px offset
  shadowY: number;             // px offset

  // ── Position ───────────────────────────────────────────────────────────────
  positionY: number;           // 0 = top, 1 = bottom (fraction of screen height)
  textAlign: "left" | "center" | "right";
  direction: "ltr" | "rtl";
  maxWidth: number;            // px (max line width)
  paddingX: number;            // horizontal padding from edge (px)

  // ── Page grouping ──────────────────────────────────────────────────────────
  wordsPerPageMs: number;      // ms — higher = more words per page

  // ── Entrance animation ─────────────────────────────────────────────────────
  enterAnimation: SubtitleAnimationType;
  enterDuration: number;       // frames
  enterBounce: number;         // spring damping override: 0=none, 1=AE default, 2=bouncy

  // ── Exit animation ─────────────────────────────────────────────────────────
  exitAnimation: "fade" | "none";
  exitDuration: number;        // frames
};

// ── Default — clean white with stroke, slide-up ──────────────────────────────
export const DEFAULT_SUBTITLE_STYLE: SubtitleStyle = {
  fontFamily: "'Heebo', sans-serif",
  fontSize: 72,
  fontWeight: 700,
  letterSpacing: -0.02,
  lineHeight: 1.25,

  textColor: "#ffffff",

  highlightStyle: "color",
  activeColor: "#2db3cd",
  activeBgColor: "rgba(33,150,176,0.85)",
  activeBgRadius: 10,
  activeBgPaddingX: 16,
  activeBgPaddingY: 4,

  textBg: false,
  textBgColor: "rgba(0,0,0,0.55)",
  textBgRadius: 14,
  textBgPaddingX: 28,
  textBgPaddingY: 12,

  stroke: true,
  strokeColor: "#000000",
  strokeWidth: 3,

  shadow: true,
  shadowColor: "rgba(0,0,0,0.7)",
  shadowBlur: 18,
  shadowX: 0,
  shadowY: 4,

  positionY: 0.82,
  textAlign: "center",
  direction: "rtl",
  maxWidth: 920,
  paddingX: 60,

  wordsPerPageMs: 1500,

  enterAnimation: "slide-up",
  enterDuration: 10,
  enterBounce: 1,

  exitAnimation: "fade",
  exitDuration: 8,
};

// ─────────────────────────────────────────────────────────────────────────────
// Presets — After Effects-style named looks
// שימוש: { ...SUBTITLE_PRESETS.tiktok, fontSize: 80 }
// ─────────────────────────────────────────────────────────────────────────────

export const SUBTITLE_PRESETS = {
  // TikTok / Reels — bold + background highlight on active word
  tiktok: {
    ...DEFAULT_SUBTITLE_STYLE,
    fontSize: 78,
    fontWeight: 800,
    stroke: true,
    strokeColor: "#000",
    strokeWidth: 4,
    highlightStyle: "background" as SubtitleHighlightStyle,
    activeColor: "#ffffff",
    activeBgColor: "#ffdd00",
    activeBgRadius: 10,
    activeBgPaddingX: 14,
    activeBgPaddingY: 2,
    shadow: true,
    shadowColor: "rgba(0,0,0,0.6)",
    shadowBlur: 12,
    shadowX: 0,
    shadowY: 3,
    enterAnimation: "pop" as SubtitleAnimationType,
    enterDuration: 8,
    enterBounce: 1.5,
  },

  // Netflix — black box behind text, clean sans-serif
  netflix: {
    ...DEFAULT_SUBTITLE_STYLE,
    fontFamily: "'Heebo', sans-serif",
    fontSize: 64,
    fontWeight: 600,
    textBg: true,
    textBgColor: "rgba(0,0,0,0.80)",
    textBgRadius: 6,
    textBgPaddingX: 20,
    textBgPaddingY: 8,
    stroke: false,
    shadow: false,
    highlightStyle: "color" as SubtitleHighlightStyle,
    activeColor: "#f5c842",
    enterAnimation: "fade" as SubtitleAnimationType,
    enterDuration: 6,
    enterBounce: 0,
  },

  // AE Clean — no stroke, text shadow only, white on dark
  ae_clean: {
    ...DEFAULT_SUBTITLE_STYLE,
    fontSize: 68,
    fontWeight: 700,
    stroke: false,
    shadow: true,
    shadowColor: "rgba(0,0,0,0.9)",
    shadowBlur: 24,
    shadowX: 0,
    shadowY: 6,
    highlightStyle: "color" as SubtitleHighlightStyle,
    activeColor: "#2db3cd",
    enterAnimation: "slide-up" as SubtitleAnimationType,
    enterDuration: 12,
    enterBounce: 0.8,
  },

  // AE Bold — heavy stroke + bright highlight
  ae_bold: {
    ...DEFAULT_SUBTITLE_STYLE,
    fontSize: 84,
    fontWeight: 900,
    stroke: true,
    strokeColor: "#000",
    strokeWidth: 5,
    shadow: true,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowBlur: 8,
    shadowX: 2,
    shadowY: 4,
    highlightStyle: "background" as SubtitleHighlightStyle,
    activeBgColor: "#e0176b",
    activeBgRadius: 8,
    activeBgPaddingX: 12,
    activeBgPaddingY: 2,
    enterAnimation: "pop" as SubtitleAnimationType,
    enterDuration: 10,
    enterBounce: 2,
  },

  // Hebrew Bold — optimized for Hebrew RTL at bottom of frame
  hebrew_bold: {
    ...DEFAULT_SUBTITLE_STYLE,
    fontFamily: "'Heebo', sans-serif",
    fontSize: 72,
    fontWeight: 800,
    letterSpacing: -0.03,
    direction: "rtl" as "rtl",
    textAlign: "center" as "center",
    positionY: 0.84,
    stroke: true,
    strokeColor: "#000",
    strokeWidth: 3,
    shadow: true,
    shadowColor: "rgba(0,0,0,0.8)",
    shadowBlur: 16,
    shadowX: 0,
    shadowY: 3,
    highlightStyle: "color" as SubtitleHighlightStyle,
    activeColor: "#2db3cd",
    enterAnimation: "slide-up" as SubtitleAnimationType,
    enterDuration: 8,
    enterBounce: 1,
    wordsPerPageMs: 1200,
  },

  // Glow — neon glow highlight, dark background
  glow: {
    ...DEFAULT_SUBTITLE_STYLE,
    textColor: "#ffffff",
    highlightStyle: "glow" as SubtitleHighlightStyle,
    activeColor: "#2db3cd",
    stroke: false,
    shadow: true,
    shadowColor: "rgba(0,0,0,0.9)",
    shadowBlur: 20,
    shadowX: 0,
    shadowY: 4,
    enterAnimation: "fade" as SubtitleAnimationType,
    enterDuration: 8,
    enterBounce: 0,
  },
} as const;
