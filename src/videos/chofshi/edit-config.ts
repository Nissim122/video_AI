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
  src: "chofshi/chofshi.mp4",    // שם הקובץ ב-public/
  fps: 30,
  durationInFrames: 900,    // עדכן לאורך האמיתי של הסרטון × fps
  width: 1080,
  height: 1920,
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
}> = [
  // {
  //   content: { type: "image" as const, src: "screen-demo.jpeg" },
  //   position: { x: 60, y: 1400, width: 960, height: 440, borderRadius: 24 },
  //   enterFrame: 90,
  //   exitFrame: 210,
  //   enterFrom: "bottom" as const,
  // },
];

// ── Chapter markers ───────────────────────────────────────────────────────────
export const CHAPTERS: Array<{ frame: number; label: string }> = [
  // { frame: 0,   label: "הקדמה" },
  // { frame: 150, label: "הבעיה" },
  // { frame: 300, label: "הפתרון" },
];

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
  // { text: "חוסך 10 שעות בשבוע", enterFrame: 120, holdFrames: 50, style: "pink" as const },
  // { text: "100% אוטומטי", enterFrame: 240, holdFrames: 50, style: "blue" as const },
];

// ── Callouts ──────────────────────────────────────────────────────────────────
export const CALLOUTS: Array<{ text: string; arrowX: number; arrowY: number; side?: "left" | "right"; enterFrame: number; holdFrames?: number }> = [
  // { text: "כאן קורה הקסם", arrowX: 540, arrowY: 900, side: "right" as const, enterFrame: 180, holdFrames: 60 },
];

// ── Outro ─────────────────────────────────────────────────────────────────────
export const OUTRO = {
  show: false,
  enterFrame: 820,
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
  // { fadeOutFrame: 0, fadeInFrame: 18 },           // פתיחה מחשיכה
  // { fadeOutFrame: 870, durationFrames: 20 },       // סיום
];

// ── Bullet lists ──────────────────────────────────────────────────────────────
export const BULLET_LISTS: Array<{ positionY?: number; items: Array<{ text: string; frame: number; icon?: string }> }> = [
  // {
  //   positionY: 1000,
  //   items: [
  //     { text: "חוסך 10 שעות בשבוע",  frame: 90,  icon: "⏱" },
  //     { text: "ללא קוד, ללא תכנות",  frame: 120, icon: "✓" },
  //     { text: "מוכן תוך 48 שעות",    frame: 150, icon: "🚀" },
  //   ],
  // },
];

// ── Stat cards ────────────────────────────────────────────────────────────────
export const STAT_CARDS: Array<{ value: number; suffix?: string; prefix?: string; label: string; enterFrame: number; positionX?: number | "center"; positionY?: number; accentColor?: string }> = [
  // { value: 10000, suffix: "+", label: "שעות עבודה נחסכו", enterFrame: 180 },
  // { value: 98, suffix: "%", label: "שביעות רצון לקוחות", enterFrame: 240, accentColor: "#28c76f" },
];

// ── Highlight boxes ───────────────────────────────────────────────────────────
export const HIGHLIGHTS: Array<{ x: number; y: number; width: number; height: number; enterFrame: number; holdFrames?: number; style?: "box" | "underline" | "pill"; label?: string }> = [
  // { x: 200, y: 800, width: 680, height: 120, enterFrame: 150, holdFrames: 60, style: "box" as const, label: "שים לב לזה" },
];

// ── CTA buttons ───────────────────────────────────────────────────────────────
export const CTA_BUTTONS: Array<{ text: string; enterFrame: number; holdFrames?: number; positionY?: "bottom" | number; pulse?: boolean }> = [
  // { text: "לפרטים נוספים", enterFrame: 600, holdFrames: 180 },
];

// ── Social handles ────────────────────────────────────────────────────────────
export const SOCIAL_HANDLES: Array<{ handle: string; platform: "instagram" | "tiktok" | "linkedin" | "youtube" | "whatsapp"; enterFrame: number; corner?: "top-right" | "top-left" | "bottom-right" | "bottom-left" }> = [
  // { handle: "@clixautomations", platform: "instagram" as const, enterFrame: 30, corner: "bottom-left" as const },
];

// ── Kinetic text ─────────────────────────────────────────────────────────────
// מילים נפרדות שמתזמנות מול הדיבור
// style: "pop" | "highlight" | "clean"
// positionY: 0 (top) → 1 (bottom), accentColor לצביעת מילים עם accent: true
export const KINETIC_TEXTS: Array<{ style?: "pop" | "highlight" | "clean"; positionY?: number; fontSize?: number; accentColor?: string; words: Array<{ text: string; frame: number; accent?: boolean }> }> = [
  // {
  //   style: "pop" as const,
  //   positionY: 0.5,
  //   words: [
  //     { text: "חוסך",   frame: 30 },
  //     { text: "10",     frame: 38, accent: true },
  //     { text: "שעות",   frame: 46 },
  //     { text: "בשבוע!", frame: 54, accent: true },
  //   ],
  // },
];

// ── B-Roll overlays ───────────────────────────────────────────────────────────
// מחליף את הסרטון הראשי בתמונה/וידאו לזמן מוגדר
// transition: "fade" | "slide-up" | "slide-down" | "zoom"
// splitY: גובה בפיקסלים לפיצול מסך (ללא = השתלטות מלאה)
export const BROLLS: Array<{
  content: { type: "image" | "video"; src: string; startFrom?: number };
  enterFrame: number;
  exitFrame: number;
  transition?: "fade" | "slide-up" | "slide-down" | "zoom";
  label?: string;
  splitY?: number;
}> = [
  // {
  //   content: { type: "image" as const, src: "screen-demo.jpeg" },
  //   enterFrame: 120,
  //   exitFrame: 240,
  //   transition: "fade" as const,
  //   label: "כך זה נראה בפועל",
  // },
  // {
  //   content: { type: "video" as const, src: "demo-clip.mp4" },
  //   enterFrame: 360,
  //   exitFrame: 540,
  //   transition: "zoom" as const,
  // },
];

// ── Reaction bubbles ──────────────────────────────────────────────────────────
// בועות תגובה שנכנסות מהצד — בסגנון סושיאל
// side: "left" | "right" | (ברירת מחדל מתחלף אוטומטית)
// holdFrames: כמה פריימים נשארת (ברירת מחדל 80)
export const REACTIONS: Array<{ text: string; frame: number; side?: "left" | "right"; holdFrames?: number }> = [
  // { text: "אחי זה שינה לי את החיים 🙌", frame: 90,  side: "right" as const },
  // { text: "איך זה בחינם??",              frame: 150, side: "left"  as const },
  // { text: "🔥🔥🔥",                      frame: 210, side: "right" as const, holdFrames: 50 },
];

// ── Punch transitions ─────────────────────────────────────────────────────────
// אפקטים ויזואליים בין חתכים
// type: "zoom-punch" | "flash" | "glitch" | "swipe-right" | "swipe-left"
// duration: אורך האפקט בפריימים (אופציונלי — יש ברירות מחדל לכל סוג)
export const PUNCHES: Array<{ frame: number; type: "zoom-punch" | "flash" | "glitch" | "swipe-right" | "swipe-left"; duration?: number }> = [
  // { frame: 90,  type: "flash"       as const },
  // { frame: 210, type: "zoom-punch"  as const },
  // { frame: 360, type: "glitch"      as const },
  // { frame: 510, type: "swipe-right" as const },
];

// ── Behind Reveal ─────────────────────────────────────────────────────────────
// עוטף כל קומפוננטה ומאניים אותה מחוץ לפריים פנימה (ויוצאת חזרה)
//
// enterFrom / exitTo : "left" | "right" | "bottom" | "top" | "none"
// animation          : "slide" | "scale" | "rotate" | "slide-rotate" | "slide-fade"
// feel               : "snappy" | "smooth" | "bouncy"
//
// ── דוגמאות ──────────────────────────────────────────────────────────────────
//
// נכנס משמאל, יוצא ימינה — slide
// <BehindReveal enterFrame={60} exitFrame={180} enterFrom="left" exitTo="right" animation="slide" feel="snappy">
//   <LowerThird name="ניסים בנגייב" title="מייסד Clix" enterFrame={0} />
// </BehindReveal>
//
// נכנס מלמטה, יוצא לאותו כיוון — bouncy
// <BehindReveal enterFrame={90} exitFrame={240} enterFrom="bottom" animation="slide-rotate" feel="bouncy">
//   <StatCard value={10000} suffix="+" label="שעות נחסכו" enterFrame={0} />
// </BehindReveal>
//
// זום פנימה ממרכז, נעלם בזום
// <BehindReveal enterFrame={120} exitFrame={210} enterFrom="none" animation="scale" feel="smooth">
//   <TextPop text="100% אוטומטי" enterFrame={0} />
// </BehindReveal>
//
// נכנס מימין עם סיבוב, יוצא למעלה
// <BehindReveal enterFrame={150} exitFrame={270} enterFrom="right" exitTo="top" animation="slide-rotate" feel="snappy">
//   <CTAButton text="לפרטים" enterFrame={0} />
// </BehindReveal>
//
// fade + slide מהשמאל, יוצא עם fade לימין
// <BehindReveal enterFrame={30} exitFrame={300} enterFrom="left" exitTo="right" animation="slide-fade" feel="smooth">
//   <SocialHandle handle="@clixautomations" platform="instagram" enterFrame={0} corner="bottom-left" />
// </BehindReveal>

// ═════════════════════════════════════════════════════════════════════════════
// רכיבים חדשים — 20 תוספות
// ═════════════════════════════════════════════════════════════════════════════

// ── 1. TypewriterText ─────────────────────────────────────────────────────────
// טקסט שמקליד את עצמו אות-אות עם cursor מהבהב
// speed: תווים לפריים (ברירת מחדל 0.6) | holdFrames: כמה פריימים להישאר
export const TYPEWRITERS: Array<{
  text: string;
  enterFrame: number;
  speed?: number;
  holdFrames?: number;
  fontSize?: number;
  positionY?: number;
  color?: string;
  showCursor?: boolean;
}> = [
  // { text: "האוטומציה הפכה לי את העסק", enterFrame: 30, speed: 0.7, holdFrames: 80, fontSize: 68 },
];

// ── 2. MorphText ──────────────────────────────────────────────────────────────
// מילה אחת מתמזגת לאחרת — "ידני → אוטומטי"
// morphFrame: הפריים שבו מתחיל המעבר | durationFrames: אורך המעבר
export const MORPHS: Array<{
  from: string;
  to: string;
  morphFrame: number;
  durationFrames?: number;
  positionY?: number;
  fontSize?: number;
  fromColor?: string;
  toColor?: string;
}> = [
  // { from: "ידני", to: "אוטומטי", morphFrame: 90, durationFrames: 22, positionY: 0.45 },
];

// ── 3. TextScramble ───────────────────────────────────────────────────────────
// תווים אקראיים שמתייצבים למילה הסופית (אפקט מטריקס)
// duration: פריימים עד שכל התווים מתייצבים
export const SCRAMBLES: Array<{
  text: string;
  enterFrame: number;
  duration?: number;
  positionY?: number;
  fontSize?: number;
  color?: string;
}> = [
  // { text: "AUTOMATION", enterFrame: 60, duration: 35, fontSize: 90 },
];

// ── 4. GradientText ───────────────────────────────────────────────────────────
// gradient זורם בתוך הטקסט, animated (כחול→ורוד→כחול)
// speed: כמה מהר זורם הגרדיאנט (pixels per frame)
export const GRADIENT_TEXTS: Array<{
  text: string;
  enterFrame: number;
  holdFrames?: number;
  positionY?: number;
  fontSize?: number;
  speed?: number;
}> = [
  // { text: "חוסך 10 שעות בשבוע", enterFrame: 45, holdFrames: 90, positionY: 0.5 },
];

// ── 5. WordHighlight ──────────────────────────────────────────────────────────
// highlight נע מילה אחר מילה בתוך משפט
// frameBetween: פריימים בין כל מילה
export const WORD_HIGHLIGHTS: Array<{
  words: string[];
  startFrame: number;
  frameBetween?: number;
  positionY?: number;
  fontSize?: number;
  highlightColor?: string;
}> = [
  // { words: ["חוסך", "זמן", "חוסך", "כסף", "מגדיל", "רווחים"], startFrame: 60, frameBetween: 25, positionY: 0.5 },
];

// ── 6. ChatBubble ─────────────────────────────────────────────────────────────
// שיחת WhatsApp מדומה, בועות שנכנסות בזו אחר זו
// sender: "me" (ירוק, ימין) | "them" (כהה, שמאל)
export const CHATS: Array<{
  messages: ChatMessage[];
  title?: string;
  titleAvatar?: string;
  positionY?: number;
}> = [
  // {
  //   title: "דני — לקוח",
  //   messages: [
  //     { text: "יש לי שאלה על השירות", frame: 60, sender: "them", avatar: "👨" },
  //     { text: "כמובן! איך אפשר לעזור?",  frame: 100, sender: "me" },
  //     { text: "ממש תענוג לעבוד איתכם 🙏",  frame: 150, sender: "them" },
  //   ],
  // },
];

// ── 7. PhoneNotification ──────────────────────────────────────────────────────
// נוטיפיקציה שנופלת מלמעלה — WhatsApp / Gmail / Slack / Calendar / custom
export const NOTIFICATIONS: Array<{
  app: NotificationApp;
  title: string;
  message: string;
  enterFrame: number;
  holdFrames?: number;
  icon?: string;
  appColor?: string;
}> = [
  // { app: "whatsapp", title: "ליד חדש!", message: "יוסי כהן מעוניין בשירות — נשלח אוטומטית", enterFrame: 90, holdFrames: 100 },
  // { app: "gmail", title: "הצעת מחיר נשלחה", message: "HL-00234 נשלחה ללקוח באופן אוטומטי", enterFrame: 200, holdFrames: 90 },
];

// ── 8. ConfirmCheck ───────────────────────────────────────────────────────────
// עיגול + ✓ שמצייר את עצמו
// positionX/Y: 0–1 (ברירת מחדל מרכז)
export const CHECKS: Array<{
  enterFrame: number;
  size?: number;
  color?: string;
  positionY?: number;
  positionX?: number;
  label?: string;
}> = [
  // { enterFrame: 120, size: 200, color: "#28c76f", positionY: 0.45, label: "הושלם בהצלחה!" },
];

// ── 9. ProgressRing ───────────────────────────────────────────────────────────
// עיגול progress שמתמלא (0% → targetPercent)
// durationFrames: כמה פריימים לקחת למלא
export const PROGRESS_RINGS: Array<{
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
}> = [
  // { enterFrame: 60, durationFrames: 90, size: 240, color: "#2db3cd", label: "אחוז אוטומציה", targetPercent: 98, positionY: 0.45 },
];

// ── 10. AutomationFlow ────────────────────────────────────────────────────────
// נודים מחוברים בחצים שמתאנימים אחד-אחד
// layout: "horizontal" | "vertical"
export const FLOWS: Array<{
  nodes: FlowNode[];
  edges: FlowEdge[];
  enterFrame: number;
  staggerFrames?: number;
  positionY?: number;
  layout?: "horizontal" | "vertical";
}> = [
  // {
  //   nodes: [
  //     { id: "form", label: "טופס נכנס", icon: "📋" },
  //     { id: "make", label: "Make.com",  icon: "⚙", color: "#9B4DFF" },
  //     { id: "crm",  label: "CRM",       icon: "📊" },
  //     { id: "mail", label: "Gmail",     icon: "✉", color: "#EA4335" },
  //   ],
  //   edges: [
  //     { from: "form", to: "make" },
  //     { from: "make", to: "crm" },
  //     { from: "make", to: "mail" },
  //   ],
  //   enterFrame: 60,
  //   layout: "horizontal",
  //   positionY: 0.5,
  // },
];

// ── 11. CameraShake ───────────────────────────────────────────────────────────
// רועד קצר של כל המסך לדגש / הלם
// intensity: 1 = רגיל, 2 = חזק | duration: פריימים
export const SHAKES: ShakeEvent[] = [
  // { frame: 90,  intensity: 1,   duration: 18 },
  // { frame: 210, intensity: 1.5, duration: 14 },
];

// ── 12. SpotlightReveal ───────────────────────────────────────────────────────
// עיגול spotlight שמדגיש אזור — שאר המסך מחשיך
// animate: "grow" | "pulse" | "static"
export const SPOTLIGHTS: Array<{
  enterFrame: number;
  exitFrame?: number;
  cx?: number;
  cy?: number;
  radius?: number;
  dimOpacity?: number;
  animate?: "grow" | "pulse" | "static";
}> = [
  // { enterFrame: 120, exitFrame: 240, cx: 540, cy: 800, radius: 280, animate: "pulse" },
];

// ── 13. ZoomBurst ─────────────────────────────────────────────────────────────
// זום חד וחזק ממרכז לנקודת שיא — עוטף את כל המסך
// scale: גודל שיא (ברירת מחדל 1.12) | duration: אורך בפריימים
export const ZOOM_BURSTS: ZoomBurstEvent[] = [
  // { frame: 90,  scale: 1.12, duration: 14 },
  // { frame: 270, scale: 1.08 },
];

// ── 14. ParticleField ─────────────────────────────────────────────────────────
// נקודות/חלקיקים צפים ברקע עם קווי חיבור
export const PARTICLE_FIELD = {
  show: false,
  count: 38,
  color: "#2db3cd",
  dotSize: 3.5,
  speed: 0.28,
  connected: true,
  opacity: 0.5,
  enterFrame: 0,
};

// ── 15. GlowPulse ─────────────────────────────────────────────────────────────
// אור שדופק סביב נקודה — כמו ping/radar effect
// intensity: עוצמת הזוהר | pulseSpeed: פעימות לשנייה
export const GLOW_PULSES: Array<{
  positionX?: number;
  positionY?: number;
  color?: string;
  radius?: number;
  pulseSpeed?: number;
  enterFrame?: number;
  intensity?: number;
}> = [
  // { positionX: 0.5, positionY: 0.5, color: "#2db3cd", radius: 250, enterFrame: 0 },
];

// ── 16. DrawPath ──────────────────────────────────────────────────────────────
// חץ SVG שמצייר את עצמו מנקודה לנקודה
// cpx/cpy: נקודת שליטה לעקומה (אופציונלי)
export const DRAW_PATHS: Array<{
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
}> = [
  // { x1: 200, y1: 600, x2: 540, y2: 900, enterFrame: 120, color: "#e0176b", label: "שים לב!" },
];

// ── 17. SplitScreen ───────────────────────────────────────────────────────────
// שני פאנלים זה לצד זה — לשימוש ב-Composition.tsx ישירות (ראה תיעוד):
//
// import { SplitScreen } from "../../components/SplitScreen";
// <SplitScreen
//   enterFrame={0}
//   left={{ content: <AbsoluteFill style={{background:"red"}}/>, label: "לפני" }}
//   right={{ content: <AbsoluteFill style={{background:"green"}}/>, label: "אחרי", labelColor: BRAND.green }}
//   layout="50-50"
// />

// ── 18. MaskReveal ────────────────────────────────────────────────────────────
// wipe reveal שחושף תוכן — לשימוש ב-Composition.tsx ישירות:
//
// import { MaskReveal } from "../../components/MaskReveal";
// <MaskReveal enterFrame={0} direction="left">
//   <Screen2 ... />
// </MaskReveal>

// ── 19. CountdownTimer ────────────────────────────────────────────────────────
// ספירה לאחור עם עיצוב גדול — "תוך 5... 4... 3..."
// framesPerNumber: מהירות (ברירת מחדל 30 = שנייה)
export const COUNTDOWNS: Array<{
  from: number;
  to?: number;
  enterFrame: number;
  framesPerNumber?: number;
  positionY?: number;
  fontSize?: number;
  color?: string;
  accentLast?: boolean;
  label?: string;
}> = [
  // { from: 5, to: 1, enterFrame: 60, framesPerNumber: 25, positionY: 0.35, label: "שניות בלבד" },
];

// ── SmartZoom ─────────────────────────────────────────────────────────────────
// זום עם נקודת פוקוס מדויקת — focusX/Y הם 0–1 (שבר של רוחב/גובה המסך)
// 0.5, 0.5 = מרכז | 0.25, 0.3 = רבע שמאל למעלה (לדובר שנמצא שם)
// feel: "snappy" | "smooth" | "bouncy"
export const SMART_ZOOMS: SmartZoomEvent[] = [
  // { startFrame: 60, endFrame: 180, scale: 1.3, focusX: 0.5, focusY: 0.28, feel: "snappy" },
];

// ── WhipPan ───────────────────────────────────────────────────────────────────
// מעבר צליפת מצלמה מהיר עם motion blur — לחיתוכים בין קטעים
// direction: "left" | "right" | "up" | "down"
// duration: אורך בפריימים (ברירת מחדל 10 = שליש שנייה ב-30fps)
// intensity: עוצמת הצליפה (1 = רגיל, 2 = חזק מאוד)
export const WHIP_PANS: WhipPanEvent[] = [
  // { frame: 150, direction: "right", duration: 10, intensity: 1 },
  // { frame: 420, direction: "left",  duration: 8,  intensity: 1.3 },
];

// ── ContinuousDrift ───────────────────────────────────────────────────────────
// תנועה איטית ובלתי פוסקת שמחיה קטעים סטטיים ארוכים
// mode: "pan" (תנועה בלבד) | "zoom" (נשימת זום בלבד) | "both"
// panAmount: פיקסלים מקסימום (ברירת מחדל 12 — כמעט בלתי מורגש)
// zoomAmount: תוספת סקייל (ברירת מחדל 0.04 = 4%)
// speed: מהירות האוסצילציה (ברירת מחדל 1)
export const DRIFT = {
  enabled:    false,
  mode:       "both" as const,
  panAmount:  12,
  zoomAmount: 0.04,
  speed:      1,
};

// ── 20. FloatingEmoji ─────────────────────────────────────────────────────────
// אמוג'י שעולים מלמטה (כמו ריאקציות בTikTok Live)
// x: 0–1 מיקום אופקי (אופציונלי — מתפזר אוטומטית)
export const FLOATING_EMOJIS: EmojiFloat[] = [
  // { emoji: "🔥", frame: 90  },
  // { emoji: "🙌", frame: 110, x: 0.3 },
  // { emoji: "💯", frame: 130, x: 0.7 },
  // { emoji: "🚀", frame: 150 },
];

// ── FocusZoom — Auto-Focus / UI Zoom ─────────────────────────────────────────
// זום אוטומטי אל אזור ספציפי — אידיאלי כשמציגים MockBrowser בפורמט 9:16
// עוטף את הרכיב ב-Composition.tsx ישירות (לא דרך VideoOverlay):
//
// import { FocusZoom } from "../../components/FocusZoom";
//
// // זום פנימה אל אזור הטופס בתוך הדפדפן (MockBrowser מרוכז בחצי העליון)
// <FocusZoom
//   zoomFrame={90}           // frame שבו מתחיל הזום
//   focusX={0.5}             // 0–1, מרכז אופקי של האזור לזום
//   focusY={0.42}            // 0–1, מרכז אנכי — 0.42 ≈ אמצע MockBrowser
//   scale={2.2}              // כמה לזום פנימה
//   holdFrames={120}         // פריימים להישאר מוזום לפני חזרה
//   feel="smooth"            // "snappy" | "smooth" | "bouncy"
// >
//   <MockBrowser url="app.clix.com" screenshotSrc="dashboard.jpg" enterFrame={0} />
// </FocusZoom>
//
// טיפ: קבע focusY לפי מיקום האלמנט הרלוונטי בתוך הדפדפן.
// לדוגמה, אם הטופס נמצא בחלק העליון של הדפדפן שמתחיל ב-Y=480:
//   focusY = (480 + 300) / 1920 ≈ 0.41

// ── SmartStack — Dynamic Padding & Grouping ───────────────────────────────────
// מונע חפיפה בין רכיבים שנמצאים באותה אזור (למשל LowerThird + CTAButton)
// שימוש ב-Composition.tsx ישירות:
//
// import { SmartStack } from "../../components/SmartStack";
//
// const VIDEO_H = 1920;
// const LOWER_H = 120;  // גובה משוער של LowerThird
// const CTA_H   = 86;   // גובה משוער של CTAButton
//
// <SmartStack
//   padding={24}
//   items={[
//     {
//       key: "cta",
//       preferredBottom: 180,   // רוצה להיות 180px מהתחתית
//       height: CTA_H,
//       render: (b, z) => (
//         <CTAButton
//           text="לפרטים נוספים"
//           enterFrame={600}
//           positionY={VIDEO_H - b - CTA_H}   // המרת bottom→top
//         />
//         // הערה: z מועבר אוטומטית — השתמש בו כאשר עוטפים ב-div עם zIndex
//       ),
//     },
//     {
//       key: "lower",
//       preferredBottom: 260,   // רוצה 260px מהתחתית — יוסט למעלה אם יש חפיפה
//       height: LOWER_H,
//       render: (b, z) => (
//         <LowerThird
//           name="ניסים בנגייב"
//           title="מייסד Clix Automations"
//           enterFrame={30}
//           holdFrames={90}
//           positionBottom={b}  // prop חדש שמאפשר override
//         />
//       ),
//     },
//   ]}
// />
//
// z-index אוטומטי: הפריט הנמוך ביותר על המסך מקבל z גבוה יותר,
// כך שאם צלליות/blur דולף, הפריט שבחזית נשאר נראה נכון.
//
// SmartStack ימקם את ה-CTA ב-180px, וה-LowerThird ב-180+86+24=290px (במקום 260)
// כדי שלא יחפף. אם אין חפיפה, כל אחד מקבל את preferredBottom שלו.

// ═════════════════════════════════════════════════════════════════════════════
// After Effects — 8 רכיבים חדשים
// ═════════════════════════════════════════════════════════════════════════════

// ── MotionBlur — blur כיווני על שכבות בתנועה ──────────────────────────────────
// direction: "left" | "right" | "up" | "down"
// strength: 0–3 (ברירת מחדל 1)
export const MOTION_BLURS: MotionBlurEvent[] = [
  // { startFrame: 60, endFrame: 90, direction: "right", strength: 1.5 },
  // { startFrame: 210, endFrame: 230, direction: "left", strength: 1 },
];

// ── DepthOfField — blur רקע לפי פוקוס ─────────────────────────────────────────
// blurAmount: עוצמת ה-blur בפיקסלים (ברירת מחדל 12)
// vignetteEdge: כהות שוליים 0–1 (ברירת מחדל 0.35)
export const DOF_EVENTS: DOFEvent[] = [
  // { startFrame: 60, endFrame: 180, blurAmount: 14, vignetteEdge: 0.4 },
];

// ── LensFlare — הילה + קרניים + orbs ──────────────────────────────────────────
// x/y: מיקום בפיקסלים | intensity: 0–2 | animated: תנועה עדינה
export const LENS_FLARES: LensFlareEvent[] = [
  // { enterFrame: 0, x: 780, y: 280, intensity: 0.9 },
  // { enterFrame: 120, exitFrame: 240, x: 200, y: 400, intensity: 0.7 },
];

// ── ChromaticAberration — RGB split ───────────────────────────────────────────
// baseIntensity: תמיד-פעיל עדין בפיקסלים (ברירת מחדל 0.8)
// events: burst חזק בפריימים ספציפיים
export const CA_CONFIG = {
  enabled: false,
  baseIntensity: 0.8,     // px — תמיד-פעיל
  events: [] as CAEvent[],
  // events: [
  //   { frame: 90,  intensity: 2.5, duration: 12 },
  //   { frame: 210, intensity: 3,   duration: 8  },
  // ],
};

// ── TextLineReveal — AE classic: טקסט עולה מאחורי קו ─────────────────────────
// feel: "snappy" | "smooth" | "bouncy"
// align: "right" | "center" | "left"
// accentWords: אינדקסים של מילים שיוצגו ב-accentColor
export const TEXT_LINE_REVEALS: Array<{
  lines: TextLineRevealItem[];
  fontSize?: number;
  lineHeight?: number;
  positionY?: number;
  align?: "right" | "center" | "left";
  feel?: "snappy" | "smooth" | "bouncy";
  showLine?: boolean;
}> = [
  // {
  //   positionY: 0.45,
  //   feel: "snappy",
  //   lines: [
  //     { text: "חוסך 10 שעות בשבוע", enterFrame: 60, accentWords: [1, 2], accentColor: "#e0176b" },
  //     { text: "בלי קוד. בלי כאב ראש.", enterFrame: 80, color: "blue" },
  //   ],
  // },
];

// ── AnamorphicStreak — פסי אור אופקיים ────────────────────────────────────────
// y: מיקום אנכי בפיקסלים (חובה)
// length: חצי-אורך הפס (ברירת מחדל 520)
// thickness: עובי ב-px (ברירת מחדל 2)
// color: ברירת מחדל BRAND.blueL
export const ANAMORPHIC_STREAKS: AnamorphicStreakEvent[] = [
  // { enterFrame: 30, y: 960,  length: 480, opacity: 0.65 },
  // { enterFrame: 90, exitFrame: 180, y: 440, color: "#e0176b", length: 320 },
];

// ── ParallaxLayer — ב-Composition.tsx ישירות (עוטף תוכן) ────────────────────
//
// import { ParallaxLayer } from "../../components/ParallaxLayer";
//
// // רקע נע לאט (depth גבוה = תנועה מהירה יותר)
// <ParallaxLayer depth={0.9} panAmountX={50} panAmountY={25}>
//   <GridBackground ... />
// </ParallaxLayer>
//
// // אלמנט קדמי כמעט לא זז
// <ParallaxLayer depth={0.15} panAmountX={50}>
//   <TextPop text="כותרת" enterFrame={60} />
// </ParallaxLayer>

// ── Bloom — glow diffuse רך (ב-Composition.tsx ישירות) ───────────────────────
//
// import { Bloom } from "../../components/Bloom";
//
// // גלוב סביב טקסט
// <Bloom intensity={0.6} radius={24} color={BRAND.blueL} enterFrame={60}>
//   <TextPop text="100% אוטומטי" enterFrame={0} />
// </Bloom>
//
// // bloom כפול (soft + hard) — לאפקט קולנועי
// <Bloom style="dual" intensity={0.5} radius={30} enterFrame={0}>
//   <StatCard value={10000} suffix="+" label="שעות נחסכו" enterFrame={0} />
// </Bloom>

// ── TrackedOverlays — Spatial Tracking ───────────────────────────────────────
// רכיבים שעוקבים אחרי נקודת יד זזה בוידאו (MediaPipe)
//
// שלב 1 — הרצת ה-Python script:
//   pip install mediapipe opencv-python
//   python tools/track_hands.py public/my-video.mp4 --output src/tracking/my-video.json
//
// שלב 2 — ייבוא ה-JSON:
//   import myVideoTracking from "./tracking/my-video.json";
//
// שלב 3 — הוספה כאן:
//   {
//     data: myVideoTracking as TrackingData,
//     type: "callout",
//     text: "שים לב לכאן!",
//     side: "right",
//     enterFrame: 60,
//     exitFrame: 180,
//   }
//
// type: "callout" | "glow" | "emoji"
// offsetX/Y: הזזה בפיקסלים מנקודת המעקב (למשל offsetY: -100 = 100px מעל היד)
// ── PersonBurst — אלמנטים שצצים מאחורי דמות (ללא גרין-סקרין) ─────────────────
//
// האשליה עובדת כך:
//   • כל אלמנט מתחיל ב-scale 0 + blur גבוה בנקודת הדמות (personX/Y)
//   • spring מנייד אותו לנקודת היעד (targetX/Y) תוך התחדדות ורוחב
//   • stagger בין אלמנטים מייצר אפקט "פריצה מאחורה" רציפה
//
// personX/Y: 0–1, מיקום הדמות על המסך (0.5, 0.55 = מרכז, קצת מתחת)
// targetX/Y: 0–1, לאן האלמנט נוסע
// stagger: פריימים בין כל אלמנט (ברירת מחדל 7)
//
// דוגמה — 3 אלמנטים שיוצאים מאחורי דמות שעומדת במרכז:
// {
//   personX: 0.5, personY: 0.55,
//   enterFrame: 60,
//   stagger: 8,
//   elements: [
//     { type: "stat",  value: 10, suffix: "×", label: "יותר מהיר", targetX: 0.18, targetY: 0.35, color: BRAND.blueL },
//     { type: "text",  text: "100% אוטומטי",                        targetX: 0.82, targetY: 0.38, color: BRAND.pink  },
//     { type: "badge", text: "AI", label: "מבוסס",                  targetX: 0.5,  targetY: 0.22, color: BRAND.green },
//     { type: "icon",  text: "🚀",                                   targetX: 0.15, targetY: 0.65, holdFrames: 80     },
//   ],
// }
export const PERSON_BURSTS: Array<{
  personX?: number;
  personY?: number;
  enterFrame: number;
  stagger?: number;
  elements: BurstElement[];
}> = [
  // {
  //   personX: 0.5,    // 0–1 — מיקום הדמות אופקית (0.5 = מרכז)
  //   personY: 0.55,   // 0–1 — מיקום הדמות אנכית (0.55 = קצת מתחת לאמצע = טורסו)
  //   enterFrame: 60,
  //   stagger: 7,      // פריימים בין כל אלמנט
  //   elements: [
  //     { type: "stat",  value: 10, suffix: "×",  label: "יותר מהיר",  targetX: 0.15, targetY: 0.32 },
  //     { type: "text",  text: "100% אוטומטי",                          targetX: 0.82, targetY: 0.38, color: "#e0176b" },
  //     { type: "badge", text: "AI", label: "מבוסס",                    targetX: 0.5,  targetY: 0.2,  color: "#28c76f" },
  //     { type: "icon",  text: "🚀",                                     targetX: 0.82, targetY: 0.68, holdFrames: 80   },
  //   ],
  // },
];

export const TRACKED_OVERLAYS: Array<{
  data: TrackingData;
  type: "callout" | "glow" | "emoji";
  enterFrame?: number;
  exitFrame?: number;
  offsetX?: number;
  offsetY?: number;
  // callout
  text?: string;
  side?: "left" | "right";
  // glow
  color?: string;
  glowRadius?: number;
  // emoji
  emoji?: string;
}> = [
  // {
  //   data: myVideoTracking as TrackingData,
  //   type: "callout",
  //   text: "שים לב!",
  //   side: "right",
  //   enterFrame: 60,
  //   exitFrame: 180,
  // },
];

// ── AEText — After Effects style "Rise Up" per-character animation ────────────
// כל אות עולה מתוך clip mask עם spring overshoot, motion blur ו-scaleY squish
//
// mode:     "chars" (ברירת מחדל) — כל אות עצמאית | "words" — כל מילה עצמאית
// stagger:  פריימים בין יחידה ליחידה (ברירת מחדל 3)
// bounce:   0 = ללא overshoot | 1 = AE ברירת מחדל | 2 = קפצני מאוד
// tracking: true = רווח אותיות מתכווץ בזמן הכניסה (AE tracking animator)
// positionY: 0–1 (שבר גובה המסך)
//
// דוגמה בסיסית:
//   { text: "חוסך 10 שעות", enterFrame: 60 }
//
// עם accent על אות ספציפית (mode: chars, מחושב לפי אינדקס):
//   { text: "100% אוטומטי", enterFrame: 120, accentIndices: [0, 1, 2] }
//
// per-word עם bounce:
//   { text: "שנה את העסק שלך", enterFrame: 90, mode: "words", bounce: 1.5, stagger: 8 }
export const AE_TEXTS: AETextProps[] = [
  // { text: "חוסך 10 שעות", enterFrame: 60, positionY: 0.3 },
];

// ═════════════════════════════════════════════════════════════════════════════
// מעברים — Transitions
// ═════════════════════════════════════════════════════════════════════════════

// ── StripTransition — רצועות/lamellas נפתחות (כמו ב-Premiere) ────────────────
// strips: מספר רצועות (ברירת מחדל 8)
// direction: "left" | "right" | "up" | "down" — מאיזה כיוון הרצועות מגיעות
// mode: "in" = רצועות מכסות (מעבר לתוך שחור) | "out" = נפתחות (חשיפה)
// feel: "snappy" | "smooth" | "bouncy"
//
// שימוש טיפוסי — מעבר כפול (כיסוי + חשיפה):
//   { triggerFrame: 150, mode: "in",  direction: "right" }  ← כיסוי
//   { triggerFrame: 172, mode: "out", direction: "left"  }  ← חשיפה
export const STRIP_TRANSITIONS: StripEvent[] = [
  // { triggerFrame: 150, durationFrames: 22, strips: 8, direction: "right", mode: "in",  feel: "snappy" },
  // { triggerFrame: 172, durationFrames: 22, strips: 8, direction: "left",  mode: "out", feel: "snappy" },
];

// ── IrisTransition — עיגול/Iris נפתח או נסגר ──────────────────────────────────
// mode: "open" = עיגול גדל וחושף | "close" = עיגול מתכווץ ומכסה
// cx/cy: מרכז העיגול בפיקסלים (ברירת מחדל: מרכז המסך)
// feel: "snappy" | "smooth"
export const IRIS_TRANSITIONS: IrisEvent[] = [
  // { triggerFrame: 0,   durationFrames: 30, mode: "open",  color: "#000000", feel: "smooth" },
  // { triggerFrame: 840, durationFrames: 30, mode: "close", color: "#000000", feel: "snappy" },
  // { triggerFrame: 150, durationFrames: 20, cx: 540, cy: 400, mode: "close", color: "#0e1628" },
];

// ── ZoomTransition — זום-אאוט מסצנה אחת לשנייה ────────────────────────────────
// שימוש ישיר ב-Composition.tsx בלבד (עוטף שני children):
//
// import { ZoomTransition } from "../../components/ZoomTransition";
//
// <ZoomTransition
//   triggerFrame={300}          // frame החיתוך (10 לפני = zoom-out, 10 אחרי = zoom-in)
//   durationFrames={20}         // סה"כ אורך המעבר
//   scaleAmount={1.5}           // כמה מוזמת הסצנה הנכנסת בהתחלה
//   feel="snappy"
//   flashColor="#ffffff"        // הבזק בחיתוך — null להשבית
//   outgoing={<SceneA />}       // הסצנה שמתרחקת (zoom-out)
//   incoming={<SceneB />}       // הסצנה שמתקרבת (zoom-in)
// />

// ── SlidePush — דחיפה אופקית/אנכית ───────────────────────────────────────────
// שימוש ישיר ב-Composition.tsx בלבד (עוטף שני children):
//
// import { SlidePush } from "../../components/SlidePush";
//
// <SlidePush
//   triggerFrame={300}          // frame תחילת הדחיפה
//   durationFrames={18}         // אורך המעבר
//   direction="right"           // מאיזה כיוון הסצנה החדשה נכנסת
//   feel="snappy"
//   outgoing={<SceneA />}       // הסצנה שנדחפת החוצה
//   incoming={<SceneB />}       // הסצנה שנכנסת ודוחפת
// />
