// ─────────────────────────────────────────────────────────────────────────────
// Edit Config — כל הגדרות העריכה במקום אחד
// ─────────────────────────────────────────────────────────────────────────────

import type { NotificationApp } from "../../components/PhoneNotification";
import type { FlowNode, FlowEdge } from "../../components/AutomationFlow";
import type { ShakeEvent } from "../../components/CameraShake";
import type { ZoomBurstEvent } from "../../components/ZoomBurst";
import type { ChatMessage } from "../../components/ChatBubble";
import type { EmojiFloat } from "../../components/FloatingEmoji";
import type { TrackingData } from "../../components/TrackedOverlay";
import type { BurstElement } from "../../components/PersonBurst";
import type { SmartZoomEvent } from "../../components/SmartZoom";
import type { WhipPanEvent } from "../../components/WhipPan";
import type { StripEvent } from "../../components/StripTransition";
import type { IrisEvent } from "../../components/IrisTransition";
import type { MotionBlurEvent } from "../../components/MotionBlur";
import type { DOFEvent } from "../../components/DepthOfField";
import type { LensFlareEvent } from "../../components/LensFlare";
import type { CAEvent } from "../../components/ChromaticAberration";
import type { TextLineRevealItem } from "../../components/TextLineReveal";
import type { AnamorphicStreakEvent } from "../../components/AnamorphicStreak";
import type { AETextProps } from "../../components/AEText";

export const VIDEO_CONFIG = {
  src: "30bachodesh/30bachodesh.mp4",
  fps: 30,
  durationInFrames: 1239,   // 41.3 שניות × 30fps
  width: 576,
  height: 1024,
};

// ── Zoom moments ──────────────────────────────────────────────────────────────
export const ZOOMS: Array<{ startFrame: number; scale: number; holdFrames: number; originX?: string; originY?: string }> = [
  // { startFrame: 60, scale: 1.2, holdFrames: 90 },
];

// ── Picture-in-Picture ────────────────────────────────────────────────────────
export const PIPS: Array<{
  content: { type: "video" | "image"; src: string; startFrom?: number };
  position: { x: number; y: number; width: number; height: number; borderRadius?: number };
  enterFrame: number;
  exitFrame?: number;
  enterFrom?: "bottom" | "right" | "left";
}> = [];

// ── Chapter markers ───────────────────────────────────────────────────────────
export const CHAPTERS: Array<{ frame: number; label: string }> = [];

// ── Logo ──────────────────────────────────────────────────────────────────────
export const LOGO = {
  show: true,
  corner: "top-right" as const,
  fadeInFrame: 15,
};

// ── Lower thirds ──────────────────────────────────────────────────────────────
export const LOWER_THIRDS: Array<{ name: string; title?: string; enterFrame: number; holdFrames?: number }> = [
  // { name: "ניסים בנגייב", title: "מייסד Clix Automations", enterFrame: 30, holdFrames: 90 },
];

// ── Text pops ─────────────────────────────────────────────────────────────────
export const TEXT_POPS: Array<{ text: string; enterFrame: number; holdFrames?: number; style?: "default" | "pink" | "blue" | "outline"; positionY?: number }> = [
  // { text: "30 שעות בחודש", enterFrame: 120, holdFrames: 50, style: "pink" as const },
];

// ── Callouts ──────────────────────────────────────────────────────────────────
export const CALLOUTS: Array<{ text: string; arrowX: number; arrowY: number; side?: "left" | "right"; enterFrame: number; holdFrames?: number }> = [];

// ── Outro ─────────────────────────────────────────────────────────────────────
export const OUTRO = {
  show: false,
  enterFrame: 1150,
  ctaText: "רוצה אוטומציה לעסק שלך?",
  subText: "השאר פרטים ואחזור אליך תוך 24 שעות",
  linkText: "clixautomations.com",
};

// ── Vignette & color grade ────────────────────────────────────────────────────
export const GRADE = {
  show: true,
  vignetteStrength: 0.55,
  tone: "cinematic" as const,
  brightness: 1,
  contrast: 1.05,
};

// ── Fade transitions ──────────────────────────────────────────────────────────
export const FADES: Array<{ fadeOutFrame: number; fadeInFrame?: number; durationFrames?: number }> = [
  // { fadeOutFrame: 0, fadeInFrame: 18 },
  // { fadeOutFrame: 1210, durationFrames: 20 },
];

// ── Bullet lists ──────────────────────────────────────────────────────────────
export const BULLET_LISTS: Array<{ positionY?: number; items: Array<{ text: string; frame: number; icon?: string }> }> = [];

// ── Stat cards ────────────────────────────────────────────────────────────────
export const STAT_CARDS: Array<{ value: number; suffix?: string; prefix?: string; label: string; enterFrame: number; positionX?: number | "center"; positionY?: number; accentColor?: string }> = [];

// ── Highlight boxes ───────────────────────────────────────────────────────────
export const HIGHLIGHTS: Array<{ x: number; y: number; width: number; height: number; enterFrame: number; holdFrames?: number; style?: "box" | "underline" | "pill"; label?: string }> = [];

// ── CTA buttons ───────────────────────────────────────────────────────────────
export const CTA_BUTTONS: Array<{ text: string; enterFrame: number; holdFrames?: number; positionY?: "bottom" | number; pulse?: boolean }> = [];

// ── Social handles ────────────────────────────────────────────────────────────
export const SOCIAL_HANDLES: Array<{ handle: string; platform: "instagram" | "tiktok" | "linkedin" | "youtube" | "whatsapp"; enterFrame: number; corner?: "top-right" | "top-left" | "bottom-right" | "bottom-left" }> = [
  // { handle: "@clixautomations", platform: "instagram" as const, enterFrame: 30, corner: "bottom-left" as const },
];

// ── Kinetic text ─────────────────────────────────────────────────────────────
export const KINETIC_TEXTS: Array<{ style?: "pop" | "highlight" | "clean"; positionY?: number; fontSize?: number; accentColor?: string; words: Array<{ text: string; frame: number; accent?: boolean }> }> = [];

// ── B-Roll overlays ───────────────────────────────────────────────────────────
export const BROLLS: Array<{
  content: { type: "image" | "video"; src: string; startFrom?: number };
  enterFrame: number;
  exitFrame: number;
  transition?: "fade" | "slide-up" | "slide-down" | "zoom";
  label?: string;
  splitY?: number;
}> = [];

// ── Reaction bubbles ──────────────────────────────────────────────────────────
export const REACTIONS: Array<{ text: string; frame: number; side?: "left" | "right"; holdFrames?: number }> = [];

// ── Punch transitions ─────────────────────────────────────────────────────────
export const PUNCHES: Array<{ frame: number; type: "zoom-punch" | "flash" | "glitch" | "swipe-right" | "swipe-left"; duration?: number }> = [];

// ── SmartZoom ─────────────────────────────────────────────────────────────────
export const SMART_ZOOMS: SmartZoomEvent[] = [];

// ── WhipPan ───────────────────────────────────────────────────────────────────
export const WHIP_PANS: WhipPanEvent[] = [];

// ── ContinuousDrift ───────────────────────────────────────────────────────────
export const DRIFT = {
  enabled:    false,
  mode:       "both" as const,
  panAmount:  12,
  zoomAmount: 0.04,
  speed:      1,
};

// ── FloatingEmoji ─────────────────────────────────────────────────────────────
export const FLOATING_EMOJIS: EmojiFloat[] = [];

// ── Typewriters ───────────────────────────────────────────────────────────────
export const TYPEWRITERS: Array<{
  text: string; enterFrame: number; speed?: number; holdFrames?: number;
  fontSize?: number; positionY?: number; color?: string; showCursor?: boolean;
}> = [];

// ── Morphs ────────────────────────────────────────────────────────────────────
export const MORPHS: Array<{
  from: string; to: string; morphFrame: number; durationFrames?: number;
  positionY?: number; fontSize?: number; fromColor?: string; toColor?: string;
}> = [];

// ── Scrambles ─────────────────────────────────────────────────────────────────
export const SCRAMBLES: Array<{
  text: string; enterFrame: number; duration?: number;
  positionY?: number; fontSize?: number; color?: string;
}> = [];

// ── Gradient texts ────────────────────────────────────────────────────────────
export const GRADIENT_TEXTS: Array<{
  text: string; enterFrame: number; holdFrames?: number;
  positionY?: number; fontSize?: number; speed?: number;
}> = [];

// ── Word highlights ───────────────────────────────────────────────────────────
export const WORD_HIGHLIGHTS: Array<{
  words: string[]; startFrame: number; frameBetween?: number;
  positionY?: number; fontSize?: number; highlightColor?: string;
}> = [];

// ── Chats ─────────────────────────────────────────────────────────────────────
export const CHATS: Array<{
  messages: ChatMessage[]; title?: string; titleAvatar?: string; positionY?: number;
}> = [];

// ── Notifications ─────────────────────────────────────────────────────────────
export const NOTIFICATIONS: Array<{
  app: NotificationApp; title: string; message: string;
  enterFrame: number; holdFrames?: number; icon?: string; appColor?: string;
}> = [];

// ── Checks ────────────────────────────────────────────────────────────────────
export const CHECKS: Array<{
  enterFrame: number; size?: number; color?: string;
  positionY?: number; positionX?: number; label?: string;
}> = [];

// ── Progress rings ────────────────────────────────────────────────────────────
export const PROGRESS_RINGS: Array<{
  enterFrame: number; durationFrames: number; size?: number; strokeWidth?: number;
  color?: string; label?: string; targetPercent?: number; positionY?: number;
  positionX?: number; showPercent?: boolean;
}> = [];

// ── Flows ─────────────────────────────────────────────────────────────────────
export const FLOWS: Array<{
  nodes: FlowNode[]; edges: FlowEdge[]; enterFrame: number;
  staggerFrames?: number; positionY?: number; layout?: "horizontal" | "vertical";
}> = [];

// ── Shakes ────────────────────────────────────────────────────────────────────
export const SHAKES: ShakeEvent[] = [];

// ── Spotlights ────────────────────────────────────────────────────────────────
export const SPOTLIGHTS: Array<{
  enterFrame: number; exitFrame?: number; cx?: number; cy?: number;
  radius?: number; dimOpacity?: number; animate?: "grow" | "pulse" | "static";
}> = [];

// ── Zoom bursts ───────────────────────────────────────────────────────────────
export const ZOOM_BURSTS: ZoomBurstEvent[] = [];

// ── Particle field ────────────────────────────────────────────────────────────
export const PARTICLE_FIELD = {
  show: false, count: 38, color: "#2db3cd",
  dotSize: 3.5, speed: 0.28, connected: true, opacity: 0.5, enterFrame: 0,
};

// ── Glow pulses ───────────────────────────────────────────────────────────────
export const GLOW_PULSES: Array<{
  positionX?: number; positionY?: number; color?: string;
  radius?: number; pulseSpeed?: number; enterFrame?: number; intensity?: number;
}> = [];

// ── Draw paths ────────────────────────────────────────────────────────────────
export const DRAW_PATHS: Array<{
  x1: number; y1: number; x2: number; y2: number; enterFrame: number;
  durationFrames?: number; color?: string; strokeWidth?: number;
  cpx?: number; cpy?: number; label?: string; arrowHead?: boolean;
}> = [];

// ── Countdowns ────────────────────────────────────────────────────────────────
export const COUNTDOWNS: Array<{
  from: number; to?: number; enterFrame: number; framesPerNumber?: number;
  positionY?: number; fontSize?: number; color?: string; accentLast?: boolean; label?: string;
}> = [];

// ── Motion blurs ──────────────────────────────────────────────────────────────
export const MOTION_BLURS: MotionBlurEvent[] = [];

// ── DOF events ────────────────────────────────────────────────────────────────
export const DOF_EVENTS: DOFEvent[] = [];

// ── Lens flares ───────────────────────────────────────────────────────────────
export const LENS_FLARES: LensFlareEvent[] = [];

// ── Chromatic aberration ──────────────────────────────────────────────────────
export const CA_CONFIG = {
  enabled: false,
  baseIntensity: 0.8,
  events: [] as CAEvent[],
};

// ── Text line reveals ─────────────────────────────────────────────────────────
export const TEXT_LINE_REVEALS: Array<{
  lines: TextLineRevealItem[];
  fontSize?: number; lineHeight?: number; positionY?: number;
  align?: "right" | "center" | "left";
  feel?: "snappy" | "smooth" | "bouncy"; showLine?: boolean;
}> = [];

// ── Anamorphic streaks ────────────────────────────────────────────────────────
export const ANAMORPHIC_STREAKS: AnamorphicStreakEvent[] = [];

// ── AE texts ──────────────────────────────────────────────────────────────────
export const AE_TEXTS: AETextProps[] = [];

// ── Person bursts ─────────────────────────────────────────────────────────────
export const PERSON_BURSTS: Array<{
  personX?: number; personY?: number; enterFrame: number;
  stagger?: number; elements: BurstElement[];
}> = [];

// ── Tracked overlays ──────────────────────────────────────────────────────────
export const TRACKED_OVERLAYS: Array<{
  data: TrackingData; type: "callout" | "glow" | "emoji";
  enterFrame?: number; exitFrame?: number; offsetX?: number; offsetY?: number;
  text?: string; side?: "left" | "right"; color?: string;
  glowRadius?: number; emoji?: string;
}> = [];

// ── Strip transitions ─────────────────────────────────────────────────────────
export const STRIP_TRANSITIONS: StripEvent[] = [];

// ── Iris transitions ──────────────────────────────────────────────────────────
export const IRIS_TRANSITIONS: IrisEvent[] = [];
