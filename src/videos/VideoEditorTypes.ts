// ─────────────────────────────────────────────────────────────────────────────
// VideoEditorTypes — הגדרות טיפוסים לכל הגדרות עריכת סרטון
// ─────────────────────────────────────────────────────────────────────────────

import type { NotificationApp } from "../components/PhoneNotification";
import type { FlowNode, FlowEdge } from "../components/AutomationFlow";
import type { ShakeEvent } from "../components/CameraShake";
import type { ZoomBurstEvent } from "../components/ZoomBurst";
import type { ChatMessage } from "../components/ChatBubble";
import type { EmojiFloat } from "../components/FloatingEmoji";
import type { TrackingData } from "../components/TrackedOverlay";
import type { BurstElement } from "../components/PersonBurst";
import type { SmartZoomEvent } from "../components/SmartZoom";
import type { WhipPanEvent } from "../components/WhipPan";
import type { StripEvent } from "../components/StripTransition";
import type { IrisEvent } from "../components/IrisTransition";
import type { MotionBlurEvent } from "../components/MotionBlur";
import type { DOFEvent } from "../components/DepthOfField";
import type { LensFlareEvent } from "../components/LensFlare";
import type { CAEvent } from "../components/ChromaticAberration";
import type { TextLineRevealItem } from "../components/TextLineReveal";
import type { AnamorphicStreakEvent } from "../components/AnamorphicStreak";
import type { AETextProps } from "../components/AEText";

export interface VideoEditConfig {
  // ── Video source ──────────────────────────────────────────────────────────
  src: string;
  durationInFrames: number;

  // ── Color grade & vignette ────────────────────────────────────────────────
  grade: {
    show: boolean;
    vignetteStrength: number;
    tone: "neutral" | "cool" | "warm" | "cinematic";
    brightness: number;
    contrast: number;
  };

  // ── Logo watermark ────────────────────────────────────────────────────────
  logo: {
    show: boolean;
    corner: "top-right" | "top-left" | "bottom-right" | "bottom-left";
    fadeInFrame: number;
  };

  // ── Outro screen ──────────────────────────────────────────────────────────
  outro: {
    show: boolean;
    enterFrame: number;
    ctaText: string;
    subText: string;
    linkText: string;
  };

  // ── Continuous drift ──────────────────────────────────────────────────────
  drift: {
    enabled: boolean;
    mode: "pan" | "zoom" | "both";
    panAmount: number;
    zoomAmount: number;
    speed: number;
  };

  // ── Chromatic aberration ──────────────────────────────────────────────────
  caConfig: {
    enabled: boolean;
    baseIntensity: number;
    events: CAEvent[];
  };

  // ── Particle field ────────────────────────────────────────────────────────
  particleField: {
    show: boolean;
    count: number;
    color: string;
    dotSize: number;
    speed: number;
    connected: boolean;
    opacity: number;
    enterFrame: number;
  };

  // ── Arrays ────────────────────────────────────────────────────────────────
  pips: Array<{
    content: { type: "video" | "image"; src: string; startFrom?: number };
    position: { x: number; y: number; width: number; height: number; borderRadius?: number };
    enterFrame: number;
    exitFrame?: number;
    enterFrom?: "bottom" | "right" | "left";
  }>;

  chapters: Array<{ frame: number; label: string }>;

  lowerThirds: Array<{
    name: string;
    title?: string;
    enterFrame: number;
    holdFrames?: number;
  }>;

  textPops: Array<{
    text: string;
    enterFrame: number;
    holdFrames?: number;
    style?: "default" | "pink" | "blue" | "outline";
    positionY?: number;
  }>;

  callouts: Array<{
    text: string;
    arrowX: number;
    arrowY: number;
    side?: "left" | "right";
    enterFrame: number;
    holdFrames?: number;
  }>;

  fades: Array<{
    fadeOutFrame: number;
    fadeInFrame?: number;
    durationFrames?: number;
  }>;

  bulletLists: Array<{
    positionY?: number;
    items: Array<{ text: string; frame: number; icon?: string }>;
  }>;

  statCards: Array<{
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    enterFrame: number;
    positionX?: number | "center";
    positionY?: number;
    accentColor?: string;
  }>;

  highlights: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    enterFrame: number;
    holdFrames?: number;
    style?: "box" | "underline" | "pill";
    label?: string;
  }>;

  ctaButtons: Array<{
    text: string;
    enterFrame: number;
    holdFrames?: number;
    positionY?: "bottom" | number;
    pulse?: boolean;
  }>;

  socialHandles: Array<{
    handle: string;
    platform: "instagram" | "tiktok" | "linkedin" | "youtube" | "whatsapp";
    enterFrame: number;
    corner?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  }>;

  kineticTexts: Array<{
    style?: "pop" | "highlight" | "clean";
    positionY?: number;
    fontSize?: number;
    accentColor?: string;
    words: Array<{ text: string; frame: number; accent?: boolean }>;
  }>;

  brolls: Array<{
    content: { type: "image" | "video"; src: string; startFrom?: number };
    enterFrame: number;
    exitFrame: number;
    transition?: "fade" | "slide-up" | "slide-down" | "zoom";
    label?: string;
    splitY?: number;
  }>;

  reactions: Array<{
    text: string;
    frame: number;
    side?: "left" | "right";
    holdFrames?: number;
  }>;

  punches: Array<{
    frame: number;
    type: "zoom-punch" | "flash" | "glitch" | "swipe-right" | "swipe-left";
    duration?: number;
  }>;

  typewriters: Array<{
    text: string;
    enterFrame: number;
    speed?: number;
    holdFrames?: number;
    fontSize?: number;
    positionY?: number;
    color?: string;
    showCursor?: boolean;
  }>;

  morphs: Array<{
    from: string;
    to: string;
    morphFrame: number;
    durationFrames?: number;
    positionY?: number;
    fontSize?: number;
    fromColor?: string;
    toColor?: string;
  }>;

  scrambles: Array<{
    text: string;
    enterFrame: number;
    duration?: number;
    positionY?: number;
    fontSize?: number;
    color?: string;
  }>;

  gradientTexts: Array<{
    text: string;
    enterFrame: number;
    holdFrames?: number;
    positionY?: number;
    fontSize?: number;
    speed?: number;
  }>;

  wordHighlights: Array<{
    words: string[];
    startFrame: number;
    frameBetween?: number;
    positionY?: number;
    fontSize?: number;
    highlightColor?: string;
  }>;

  chats: Array<{
    messages: ChatMessage[];
    title?: string;
    titleAvatar?: string;
    positionY?: number;
  }>;

  notifications: Array<{
    app: NotificationApp;
    title: string;
    message: string;
    enterFrame: number;
    holdFrames?: number;
    icon?: string;
    appColor?: string;
  }>;

  checks: Array<{
    enterFrame: number;
    size?: number;
    color?: string;
    positionY?: number;
    positionX?: number;
    label?: string;
  }>;

  progressRings: Array<{
    enterFrame: number;
    durationFrames: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    label?: string;
    targetPercent?: number;
    positionY?: number;
    positionX?: number;
    showPercent?: boolean;
  }>;

  flows: Array<{
    nodes: FlowNode[];
    edges: FlowEdge[];
    enterFrame: number;
    staggerFrames?: number;
    positionY?: number;
    layout?: "horizontal" | "vertical";
  }>;

  shakes: ShakeEvent[];
  spotlights: Array<{
    enterFrame: number;
    exitFrame?: number;
    cx?: number;
    cy?: number;
    radius?: number;
    dimOpacity?: number;
    animate?: "grow" | "pulse" | "static";
  }>;

  zoomBursts: ZoomBurstEvent[];

  glowPulses: Array<{
    positionX?: number;
    positionY?: number;
    color?: string;
    radius?: number;
    pulseSpeed?: number;
    enterFrame?: number;
    intensity?: number;
  }>;

  drawPaths: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    enterFrame: number;
    durationFrames?: number;
    color?: string;
    strokeWidth?: number;
    cpx?: number;
    cpy?: number;
    label?: string;
    arrowHead?: boolean;
  }>;

  countdowns: Array<{
    from: number;
    to?: number;
    enterFrame: number;
    framesPerNumber?: number;
    positionY?: number;
    fontSize?: number;
    color?: string;
    accentLast?: boolean;
    label?: string;
  }>;

  floatingEmojis: EmojiFloat[];
  smartZooms: SmartZoomEvent[];
  whipPans: WhipPanEvent[];

  trackedOverlays: Array<{
    data: TrackingData;
    type: "callout" | "glow" | "emoji";
    enterFrame?: number;
    exitFrame?: number;
    offsetX?: number;
    offsetY?: number;
    text?: string;
    side?: "left" | "right";
    color?: string;
    glowRadius?: number;
    emoji?: string;
  }>;

  personBursts: Array<{
    personX?: number;
    personY?: number;
    enterFrame: number;
    stagger?: number;
    elements: BurstElement[];
  }>;

  motionBlurs: MotionBlurEvent[];
  dofEvents: DOFEvent[];
  lensFlares: LensFlareEvent[];
  textLineReveals: Array<{
    lines: TextLineRevealItem[];
    fontSize?: number;
    lineHeight?: number;
    positionY?: number;
    align?: "right" | "center" | "left";
    feel?: "snappy" | "smooth" | "bouncy";
    showLine?: boolean;
  }>;
  anamorphicStreaks: AnamorphicStreakEvent[];
  aeTexts: AETextProps[];
  stripTransitions: StripEvent[];
  irisTransitions: IrisEvent[];
}

// ── ברירות מחדל — כל הפיצ'רים כבויים ──────────────────────────────────────
export const DEFAULT_CONFIG: Omit<VideoEditConfig, "src" | "durationInFrames"> = {
  grade: { show: true, vignetteStrength: 0.55, tone: "cinematic", brightness: 1, contrast: 1.05 },
  logo: { show: true, corner: "top-right", fadeInFrame: 15 },
  outro: { show: false, enterFrame: 0, ctaText: "", subText: "", linkText: "clixautomations.com" },
  drift: { enabled: false, mode: "both", panAmount: 12, zoomAmount: 0.04, speed: 1 },
  caConfig: { enabled: false, baseIntensity: 0.8, events: [] },
  particleField: { show: false, count: 38, color: "#2db3cd", dotSize: 3.5, speed: 0.28, connected: true, opacity: 0.5, enterFrame: 0 },
  pips: [],
  chapters: [],
  lowerThirds: [],
  textPops: [],
  callouts: [],
  fades: [],
  bulletLists: [],
  statCards: [],
  highlights: [],
  ctaButtons: [],
  socialHandles: [],
  kineticTexts: [],
  brolls: [],
  reactions: [],
  punches: [],
  typewriters: [],
  morphs: [],
  scrambles: [],
  gradientTexts: [],
  wordHighlights: [],
  chats: [],
  notifications: [],
  checks: [],
  progressRings: [],
  flows: [],
  shakes: [],
  spotlights: [],
  zoomBursts: [],
  glowPulses: [],
  drawPaths: [],
  countdowns: [],
  floatingEmojis: [],
  smartZooms: [],
  whipPans: [],
  trackedOverlays: [],
  personBursts: [],
  motionBlurs: [],
  dofEvents: [],
  lensFlares: [],
  textLineReveals: [],
  anamorphicStreaks: [],
  aeTexts: [],
  stripTransitions: [],
  irisTransitions: [],
};
