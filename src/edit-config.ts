// ─────────────────────────────────────────────────────────────────────────────
// Edit Config — כל הגדרות העריכה במקום אחד
// ─────────────────────────────────────────────────────────────────────────────

import type { NotificationApp } from "./components/PhoneNotification";
import type { FlowNode, FlowEdge } from "./components/AutomationFlow";
import type { ShakeEvent } from "./components/CameraShake";
import type { ZoomBurstEvent } from "./components/ZoomBurst";
import type { ChatMessage } from "./components/ChatBubble";
import type { EmojiFloat } from "./components/FloatingEmoji";

export const VIDEO_CONFIG = {
  src: "test-video.mp4",    // שם הקובץ ב-public/
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
// import { SplitScreen } from "./components/SplitScreen";
// <SplitScreen
//   enterFrame={0}
//   left={{ content: <AbsoluteFill style={{background:"red"}}/>, label: "לפני" }}
//   right={{ content: <AbsoluteFill style={{background:"green"}}/>, label: "אחרי", labelColor: BRAND.green }}
//   layout="50-50"
// />

// ── 18. MaskReveal ────────────────────────────────────────────────────────────
// wipe reveal שחושף תוכן — לשימוש ב-Composition.tsx ישירות:
//
// import { MaskReveal } from "./components/MaskReveal";
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

// ── 20. FloatingEmoji ─────────────────────────────────────────────────────────
// אמוג'י שעולים מלמטה (כמו ריאקציות בTikTok Live)
// x: 0–1 מיקום אופקי (אופציונלי — מתפזר אוטומטית)
export const FLOATING_EMOJIS: EmojiFloat[] = [
  // { emoji: "🔥", frame: 90  },
  // { emoji: "🙌", frame: 110, x: 0.3 },
  // { emoji: "💯", frame: 130, x: 0.7 },
  // { emoji: "🚀", frame: 150 },
];
