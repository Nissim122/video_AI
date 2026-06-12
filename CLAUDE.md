# Clix Video AI — Project Instructions

## תיעוד חיצוני

- [Remotion Docs](https://www.remotion.dev/docs) — API רשמי, hooks, components, rendering

## אימות ויזואלי — חובה לפני סיום כל משימה

לאחר כל עריכה לקובץ קומפוזיציה (`src/*.tsx`, `src/edit-config.ts`, `src/scenes/*.tsx`):

1. הרץ `node screenshot.mjs [CompId] [frame]` — ברירת מחדל: `VideoOverlay 60`
2. קרא את ה-PNG שנוצר ב-`preview/` עם כלי ה-Read
3. ודא ויזואלית: טקסט לא חתוך, לא מכסה פנים, צבעים נכונים, מיקום תואם לתיאור

**אסור להודיע "סיימתי" לפני שביצעת את 3 הצעדים האלה.**

---

## Workflow: כל בקשה לסרטון חדש

כאשר המשתמש מבקש ליצור סרטון — **תמיד** בצע את השלבים הבאים בסדר הזה, ללא צורך בהפעלה ידנית של סקילים:

### שלב 1 — תכנון ויזואלי (אוטומטי)
הפעל את לוגיקת `/video-plan`:
- שאל שאלות מובנות לפי השלבים המוגדרים בסקיל
- אל תתחיל לכתוב קוד לפני שיש מסמך תכנון מלא
- סיים את שלב התכנון עם טבלת סצנות + טקסטים + סגנון אנימציה

### שלב 2 — בנייה (אוטומטי אחרי אישור)
לאחר שהמשתמש מאשר את מסמך התכנון — הפעל את לוגיקת `/video-build`:
- עבוד עם סקיל `remotion` לפי best practices
- כתוב את הקוד ב-`src/Composition.tsx` ו-`src/Root.tsx`
- אל תמציא מבנה תיקיות חדש

---

## מבנה הפרויקט

```
src/
  Composition.tsx   ← הקומפוזיציה הראשית
  Root.tsx          ← רישום הקומפוזיציה
  scenes/           ← נוצר רק לסרטונים מרובי-סצנות
```

## עיצוב — Clix Brand (תמיד)

```ts
const BRAND = {
  bg: '#0e1628',
  bgE: '#141d35',
  bgF: '#1a2540',
  blue: '#2196b0',
  blueL: '#2db3cd',
  pink: '#e0176b',
  green: '#28c76f',
  text: '#ffffff',
  muted: 'rgba(255,255,255,0.5)',
  border: 'rgba(255,255,255,0.09)',
};
```

- פונט עברית / גוף: `Heebo`
- פונט מספרים / לוגו: `Inter`
- טקסט עברי: תמיד `direction: 'rtl'`
- אנימציות כניסה: תמיד `spring()` — לא `interpolate` לבד

## צילומי מסך — חיתוך חובה

בכל שימוש ב-`ScrollingPhoneScreen` עם צילומי מסך של iPhone Safari — **תמיד** להגדיר:

```tsx
topCrops={[70, 70, 70, 70]}       // מסיר: שעה + סוללה (status bar)
bottomCrops={[180, 180, 180, 180]} // מסיר: פס כתובת הדפדפן (Safari toolbar)
```

**למה 180 ולא פחות?**
בגלל `objectFit: cover`, הסקייל של התמונה (946×2048) משתנה יחד עם גובה האלמנט. ערכים קטנים (100, 130) לא הספיקו כי הפס הופיע בדיוק על גבול החיתוך. 180px הוא הערך שנבדק ואושר.

- ערכים אלו חלים על כל תמונה בסצנה, ללא יוצאים מן הכלל
- אם הצילום מסך אינו Safari (אפליקציה נייטיב) — אפשר להוריד את `bottomCrops`
- אסור להשאיר ערכים חלקיים כמו `bottomCrops={[0, 70, 0, 0]}` — תמיד לכל התמונות

## לוגו Clix Automations — מידות קבועות

בכל פעם שמוסיפים את לוגו העסק למסך — **תמיד** להשתמש במידות ובמיקום הבאים:

```tsx
// מיקום
position: "absolute", top: 130, left: 0, right: 0
display: "flex", justifyContent: "center", alignItems: "baseline"
gap: 6, direction: "ltr"

// "Clix"
fontFamily: "'Inter', sans-serif", fontWeight: 700
fontSize: 82, letterSpacing: "-0.04em", color: BRAND.text

// "Automations"
fontFamily: "'Inter', sans-serif", fontWeight: 400
fontSize: 70, letterSpacing: "-0.02em", color: BRAND.pink
```

---

## ספריית רכיבים קיימים — `src/components/`

> כל הרכיבים מיובאים ב-`VideoOverlay.tsx` ומוגדרים דרך `edit-config.ts`.  
> לא בונים רכיב חדש לפני שבודקים שאין כאן רכיב מתאים.

### VideoBase
וידאו בסיסי מלא-מסך עם `OffthreadVideo`.
```tsx
<VideoBase src="clip.mp4" startFrom={0} endAt={300} playbackRate={1} brightness={0.85} />
```

### VignetteGrade
וינייט + גריידינג צבע מעל הוידאו. **תמיד להוסיף לכל סרטון.**
```tsx
<VignetteGrade vignetteStrength={0.55} tone="cinematic" brightness={1} contrast={1.05} />
// tone: "neutral" | "cool" | "warm" | "cinematic"
```

### LogoWatermark
לוגו Clix Automations קטן בפינה, מופיע בפייד-אין.
```tsx
<LogoWatermark corner="top-right" size={38} fadeInFrame={15} />
// corner: "top-right" | "top-left" | "bottom-right" | "bottom-left"
```

### TextPop
טקסט גדול שצץ ונעלם — לציטוטים, כותרות, הדגשות.
```tsx
<TextPop text="100% אוטומטי" enterFrame={120} holdFrames={45} style="blue" positionY={0.42} />
// style: "default" | "pink" | "blue" | "outline"
// positionY: 0 (top) → 1 (bottom)
```

### KineticText
מילים שמופיעות אחת-אחת בתזמון — לסינכרון עם דיבור.
```tsx
<KineticText
  style="pop"  // "pop" | "highlight" | "clean"
  positionY={0.5}
  fontSize={72}
  words={[
    { text: "חוסך",  frame: 30 },
    { text: "10",    frame: 38, accent: true },  // accent = צבע ורוד/כחול
    { text: "שעות",  frame: 46 },
  ]}
/>
```

### BulletList
רשימת נקודות שמופיעות בזו אחר זו מימין עם אנימציית כניסה.
```tsx
<BulletList
  positionY={960}
  items={[
    { text: "חוסך 10 שעות", frame: 90, icon: "⏱" },
    { text: "ללא קוד",       frame: 120 },
  ]}
/>
```

### StatCard
כרטיס סטטיסטיקה עם מספר שסופר מאפס (שימוש ב-CounterNumber פנימי).
```tsx
<StatCard value={10000} suffix="+" label="שעות נחסכו" enterFrame={180} positionY={900} accentColor={BRAND.blue} />
```

### CounterNumber
מספר שסופר — לשימוש עצמאי בתוך טקסט.
```tsx
<CounterNumber to={98} suffix="%" enterFrame={60} durationFrames={60} fontSize={120} color={BRAND.blueL} />
```

### CTAButton
כפתור CTA ורוד עם דופק, נכנס מלמטה.
```tsx
<CTAButton text="לפרטים נוספים" enterFrame={600} holdFrames={180} positionY="bottom" pulse={true} />
```

### LowerThird
שם + תפקיד, נכנס משמאל בסגנון שידור.
```tsx
<LowerThird name="ניסים בנגייב" title="מייסד Clix Automations" enterFrame={30} holdFrames={90} />
```

### SocialHandle
פיל סושיאל עם אייקון פלטפורמה, לפינות המסך.
```tsx
<SocialHandle handle="@clixautomations" platform="instagram" enterFrame={30} corner="bottom-left" />
// platform: "instagram" | "tiktok" | "linkedin" | "youtube" | "whatsapp"
```

### Callout
חץ מקווקו + תיבת טקסט שמצביע על נקודה בסרטון.
```tsx
<Callout text="כאן קורה הקסם" arrowX={540} arrowY={900} side="right" enterFrame={180} holdFrames={60} />
```

### HighlightBox
מסגרת/קו תחתון/פיל שמדגיש אזור בסרטון.
```tsx
<HighlightBox x={200} y={800} width={680} height={120} enterFrame={150} holdFrames={60} style="box" label="שים לב" />
// style: "box" | "underline" | "pill"
```

### BRollOverlay
מחליף/מוסיף תמונה או וידאו מעל הסרטון לזמן מוגדר.
```tsx
<BRollOverlay
  content={{ type: "image", src: "screen.jpg" }}
  enterFrame={120} exitFrame={240}
  transition="fade"  // "fade" | "slide-up" | "slide-down" | "zoom"
  label="כך זה נראה"  // אופציונלי
  splitY={600}        // אופציונלי — חלק עליון בלבד
/>
```

### PictureInPicture
חלון קטן (תמונה/וידאו) שנכנס ויוצא.
```tsx
<PictureInPicture
  content={{ type: "image", src: "demo.jpg" }}
  position={{ x: 60, y: 1400, width: 960, height: 440, borderRadius: 24 }}
  enterFrame={90} exitFrame={210}
  enterFrom="bottom"  // "bottom" | "right" | "left"
/>
```

### ChapterMarker
כותרת פרק שמופיעה ונעלמת + סרגל התקדמות תחתון.
```tsx
<ChapterMarker
  totalFrames={900}
  chapters={[{ frame: 0, label: "הקדמה" }, { frame: 150, label: "הפתרון" }]}
  showProgressBar={true}
/>
```

### FadeTransition
פייד לשחור בין סצנות — **תמיד אחרון בסטאק**.
```tsx
<FadeTransition fadeOutFrame={0} fadeInFrame={18} durationFrames={18} />
<FadeTransition fadeOutFrame={870} durationFrames={20} />  // פייד-אאוט בסוף
```

### ZoomClip
זום אל נקודה בסרטון עם spring.
```tsx
<ZoomClip startFrame={60} scale={1.25} holdFrames={90} originX="50%" originY="40%">
  {/* תוכן */}
</ZoomClip>
```

### BehindReveal
עוטף כל רכיב ומאניים אותו פנימה/החוצה עם כיוון + סגנון.
```tsx
<BehindReveal
  enterFrame={60} exitFrame={180}
  enterFrom="left"    // "left" | "right" | "bottom" | "top" | "none"
  exitTo="right"
  animation="slide"   // "slide" | "scale" | "rotate" | "slide-rotate" | "slide-fade"
  feel="snappy"       // "snappy" | "smooth" | "bouncy"
>
  <LowerThird name="ניסים" enterFrame={0} />
</BehindReveal>
```

### OutroScreen
מסך סיום מלא עם לוגו + CTA + לינק, מאניים פנימה.
```tsx
<OutroScreen
  enterFrame={820}
  ctaText="רוצה אוטומציה לעסק שלך?"
  subText="השאר פרטים ואחזור אליך תוך 24 שעות"
  linkText="clixautomations.com"
/>
```

---

## ספריית רכיבים חדשים — `src/components/` (20 רכיבים נוספים)

### קטגוריה א — אפקטי טקסט

### FlipText
לוח split-flap — כל תו מתהפך לתו הסופי בזה אחר זה.
```tsx
<FlipText text="CLIX" enterFrame={60} stagger={4} flipDuration={20} fontSize={96} positionY={0.42} />
```

### TextStagger
אותיות נכנסות אחת-אחת עם stagger — שונה מ-KineticText שפועל ברמת מילה.
```tsx
<TextStagger
  text="אוטומציה"
  enterFrame={60}
  stagger={3}
  animation="rise"  // "rise" | "drop" | "pop" | "spin"
  fontSize={96}
  positionY={0.42}
  accentIndices={[0, 1]}  // אינדקסים לצביעה ב-accentColor
  accentColor={BRAND.pink}
/>
```

### RevealMask
תוכן מתגלה מאחורי מסכת wipe מונפשת — mask נכנס ואז יוצא וחושף.
```tsx
// עוטף כל תוכן — עובד עם טקסט, כרטיסים, תמונות
<RevealMask enterFrame={60} direction="right" maskColor={BRAND.blue} feel="snappy">
  <TextPop text="תוצאה" enterFrame={0} />
</RevealMask>
// direction: "right" | "left" | "up" | "down"
// feel: "snappy" | "smooth"
```

---

### קטגוריה ב — UI מדומה

### MockBrowser
חלון דפדפן דסקטופ עם כתובת URL + תוכן — לדמו מוצר ווב.
```tsx
<MockBrowser
  url="app.clixautomations.com"
  screenshotSrc="dashboard.jpg"   // או children
  enterFrame={60}
  width={900}
  positionX={90}
  positionY={480}
/>
```

### FormFill
טופס שממלא את עצמו שדה-שדה, עם cursor מהבהב ו-✓ בסיום.
```tsx
<FormFill
  title="פרטי הלקוח"
  enterFrame={30}
  fields={[
    { label: "שם עסק", value: "Clix Automations", startFrame: 60, typingFrames: 40 },
    { label: "אימייל",  value: "info@clix.co.il",  startFrame: 120 },
  ]}
/>
```

### ToggleSwitch
מתג ON/OFF מונפש עם spring, עם תוויות לפני/אחרי.
```tsx
<ToggleSwitch
  toggleFrame={90}        // frame שבו המתג מתהפך ON
  label="מצב עבודה"
  labelOff="ידני"
  labelOn="אוטומטי"
  enterFrame={30}
  positionX={540} positionY={960}
  color={BRAND.green}
  size={1}
/>
```

### AppConnector
שני לוגואים (emoji או תמונה) עם חץ מונפש וחבילות data זורמות.
```tsx
<AppConnector
  leftIcon="📧"   rightIcon="📊"
  leftLabel="Gmail" rightLabel="Sheets"
  enterFrame={60}
  positionY={880}
  color={BRAND.blue}
  animated={true}
/>
```

### DashboardCard
כרטיס analytics עם counter ומיני bar chart שעולה.
```tsx
<DashboardCard
  title="לידים החודש"
  value={1240}
  suffix="+"
  enterFrame={90}
  positionY={600}
  width={460}
  accentColor={BRAND.blue}
  trend="up"
  trendLabel="+18% מהחודש שעבר"
/>
```

---

### קטגוריה ג — מעברים ואפקטי מצלמה

### KenBurns
pan + zoom איטי על תמונה סטטית — אפקט תיעודי קלאסי.
```tsx
<KenBurns
  src="photo.jpg"
  startFrame={0}
  durationFrames={300}
  preset="zoom-in"   // "zoom-in" | "zoom-out" | "pan-right" | "pan-left" | "tilt-up" | "tilt-down"
  panAmount={5}      // % תזוזה (רלוונטי ל-pan/tilt)
/>
```

### GlitchCut
עיוות דיגיטלי (RGB split + scan lines) שעוטף תוכן למשך כמה פריימים.
```tsx
<GlitchCut triggerFrame={120} durationFrames={8} intensity={1}>
  {/* כל תוכן */}
</GlitchCut>
```

### FlashTransition
הבזק לבן (או כל צבע) סביב פריים — לחיתוך חד בין סצנות.
```tsx
<FlashTransition peakFrame={150} durationFrames={12} color="#ffffff" />
```

### FilmGrain
רעש פילם overlay מונפש מעל כל המסך.
```tsx
<FilmGrain opacity={0.08} animated={true} blendMode="overlay" />
```

---

### קטגוריה ד — רקע ואווירה

### GridBackground
רשת קווים (כמו Make.com) שגולשת לאיטה.
```tsx
<GridBackground cellSize={80} color={BRAND.blue} opacity={0.15} scrollSpeed={0.3} dots={true} />
```

### GradientBackground
גרדיאנט רקע שסובב ומשנה גוונים לאיטה.
```tsx
<GradientBackground opacity={1} driftSpeed={0.06} angle={135} pulse={0.06} />
```

### DataStream
זרם תווים/מספרים נופלים ברקע (Matrix-lite עם כתב יפני + 0/1).
```tsx
<DataStream opacity={0.18} color={BRAND.blueL} fadeInFrames={20} />
```

---

### קטגוריה ה — מבנה ומידע

### TestimonialCard
כרטיס לקוח עם כוכבים + ציטוט + שם + תפקיד + avatar.
```tsx
<TestimonialCard
  quote="חסכנו 12 שעות בשבוע תוך יומיים"
  name="דנה כהן"
  role="מנהלת שיווק, StartupXYZ"
  avatarEmoji="👩"
  stars={5}
  enterFrame={60}
  positionY={500}
  width={880}
/>
```

### ComparisonRow
שורות לפני/אחרי עם חצים — "3 שעות → 3 דקות".
```tsx
<ComparisonRow
  enterFrame={30}
  positionY={400}
  beforeLabel="לפני"
  afterLabel="אחרי"
  items={[
    { before: "3 שעות",  after: "3 דקות",  label: "דוחות שבועיים",   enterFrame: 60 },
    { before: "ידני",    after: "אוטומטי", label: "עדכון לקוחות",    enterFrame: 90 },
  ]}
/>
```

### TimelineStep
שלבים (אנכי/אופקי) שמופיעים בזה אחר זה ומסמנים ✓ כשמגיעים.
```tsx
<TimelineStep
  orientation="vertical"   // "vertical" | "horizontal"
  positionY={400}
  accentColor={BRAND.blue}
  steps={[
    { label: "ניתוח תהליכים", sublabel: "30 דקות", enterFrame: 60  },
    { label: "בניית אוטומציה", sublabel: "יום עבודה", enterFrame: 120 },
    { label: "השקה",           sublabel: "תוך שבוע",   enterFrame: 180, icon: "🚀" },
  ]}
/>
```

### ROIBadge
Badge עגלגל עם counter מונפש — "חוסך 10 שעות / ₪5,000 בחודש".
```tsx
<ROIBadge
  value={10}
  unit="שעות"
  label="נחסכות בשבוע"
  enterFrame={90}
  positionX={540} positionY={960}
  color={BRAND.green}
  size="md"  // "sm" | "md" | "lg"
/>
```

---

## קטגוריה ו — מנוע מצלמה מתקדם (Camera Engine)

> כל 3 הרכיבים פועלים דרך `edit-config.ts` ונטענים אוטומטית ב-`VideoOverlay.tsx`.  
> סדר שכבות ה-wrapper: `ZoomBurst → SmartZoom → ContinuousDrift → WhipPan → CameraShake → תוכן`

### SmartZoom
זום עם נקודת פוקוס מדויקת — לא עיוור למרכז, אלא לאן שצריך.
```ts
export const SMART_ZOOMS: SmartZoomEvent[] = [
  { startFrame: 60, endFrame: 180, scale: 1.3, focusX: 0.5, focusY: 0.28, feel: "snappy" },
  // focusX/Y: 0–1 (שבר של רוחב/גובה המסך)
  // 0.5, 0.5 = מרכז | 0.5, 0.25 = פנים דובר בחלק עליון של הפריים
  // feel: "snappy" | "smooth" | "bouncy"
];
```

### WhipPan
צליפת מצלמה מהירה עם motion blur — לחיתוכים בין קטעים.
```ts
export const WHIP_PANS: WhipPanEvent[] = [
  { frame: 150, direction: "right", duration: 10, intensity: 1 },
  // direction: "left" | "right" | "up" | "down"
  // duration: פריימים (ברירת מחדל 10)
  // intensity: 1 = רגיל, 2 = חזק מאוד
];
```

### ContinuousDrift
תנועה איטית ובלתי פוסקת שמחיה קטעים סטטיים — לא עוצרת אף פעם.
```ts
export const DRIFT = {
  enabled:    true,
  mode:       "both" as const,  // "pan" | "zoom" | "both"
  panAmount:  12,               // פיקסלים מקסימום (12 = כמעט בלתי מורגש)
  zoomAmount: 0.04,             // תוספת סקייל (0.04 = 4%)
  speed:      1,                // מהירות אוסצילציה
};
```

### VideoMosaic
רשת 2×2 או 3×3 של תמונות/קליפים שנכנסים בstagger.
```tsx
<VideoMosaic
  cols={2}
  enterFrame={60}
  stagger={6}
  positionY={400}
  width={960}
  items={[
    { src: "clip1.mp4", type: "video", label: "לקוח א׳" },
    { src: "img1.jpg",  type: "image", label: "לקוח ב׳" },
  ]}
/>
```

---

## edit-config.ts — איך מפעילים רכיבים

כל הרכיבים מוגדרים ב-`src/edit-config.ts` כמערכים ואובייקטים.  
`VideoOverlay.tsx` קורא ומרנדר הכל אוטומטית — **לא נוגעים ב-VideoOverlay ישירות**.

```ts
// דוגמה מינימלית לסרטון עם טקסט + CTA
export const TEXT_POPS = [
  { text: "חוסך 10 שעות", enterFrame: 60, holdFrames: 50, style: "pink" as const },
];
export const CTA_BUTTONS = [
  { text: "לפרטים נוספים", enterFrame: 600, holdFrames: 180 },
];
export const OUTRO = { show: true, enterFrame: 820, ctaText: "...", subText: "...", linkText: "clixautomations.com" };
```

---

## כללים

- לא מתחילים לכתוב קוד לפני שיש תכנון מאושר
- לא קובעים צבעים ישירות — תמיד דרך BRAND
- לא יוצרים קבצים חדשים אלא אם הסרטון מרובה-סצנות
- אחרי בנייה — מזכירים `npx remotion studio` לצפייה
