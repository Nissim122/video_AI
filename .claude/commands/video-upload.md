# /video-upload — העלאה ישירה לפלטפורמות

הכן קובץ וידאו להעלאה לכל פלטפורמה ופתח את תהליך ההעלאה.

## מה לעשות

1. **קבל מהמשתמש:**
   - נתיב לקובץ וידאו מוכן
   - פלטפורמה יעד: `instagram` / `tiktok` / `youtube` / `whatsapp`

2. **בדוק דרישות לפי פלטפורמה** ותתקן אם צריך:

### Instagram Reels
```
✅ דרישות:
  - פורמט: MP4 (H.264)
  - יחס: 9:16 (1080×1920)
  - FPS: 30
  - אורך: 15s – 90s
  - גודל: עד 4GB
  - אודיו: AAC

ffmpeg תיקון אם צריך:
ffmpeg -i "input.mp4" -vcodec libx264 -acodec aac -vf "scale=1080:1920" -r 30 "instagram_ready.mp4"
```

### TikTok
```
✅ דרישות:
  - פורמט: MP4
  - יחס: 9:16
  - FPS: 24–60
  - אורך: 15s – 10 דקות
  - גודל: עד 287.6MB (מובייל) / 4GB (דסקטופ)
  - מינימום רזולוציה: 540×960

ffmpeg תיקון:
ffmpeg -i "input.mp4" -vcodec libx264 -crf 20 -acodec aac "tiktok_ready.mp4"
```

### YouTube
```
✅ דרישות:
  - פורמט: MP4 (H.264)
  - יחס: 16:9 (1920×1080)
  - FPS: 30 / 60
  - גודל: עד 256GB
  - אורך: עד 12 שעות

ffmpeg תיקון:
ffmpeg -i "input.mp4" -vcodec libx264 -crf 18 -acodec aac -b:a 192k "youtube_ready.mp4"
```

### WhatsApp Status
```
✅ דרישות:
  - פורמט: MP4
  - גודל: עד 16MB
  - אורך: עד 30 שניות (Status) / 2GB (שיחה)

ffmpeg דחיסה ל-16MB:
ffmpeg -i "input.mp4" -vcodec libx264 -crf 30 -vf "scale=720:1280" -acodec aac -b:a 96k "whatsapp_ready.mp4"
```

3. **פתח את הקובץ בסייר:**
```bash
# Windows — פתח תיקייה עם הקובץ
explorer /select,"output_ready.mp4"
```

4. **הנחיות העלאה ידנית:**
```
📤 להעלאה ב-Instagram:
  1. פתח את Instagram במובייל
  2. לחץ + → Reel
  3. בחר את הקובץ מהגלריה
  4. הוסף caption + hashtags + מוזיקה

📤 להעלאה ב-TikTok:
  1. פתח TikTok → + → Upload
  2. בחר את הקובץ
  3. הוסף caption + hashtags + sound

📤 להעלאה ב-YouTube:
  1. studio.youtube.com → Create → Upload
  2. בחר קובץ ← גרור לחלון
  3. מלא title, description, thumbnail
```

5. **הצג סיכום:**
```
✅ מוכן להעלאה!
  קובץ:     instagram_ready.mp4
  גודל:     8.3 MB ✓
  רזולוציה: 1080×1920 ✓
  FPS:      30 ✓
  אורך:     28.5s ✓

📂 הקובץ נפתח בסייר Windows — גרור לאפליקציה/דפדפן
```

## הערה
- העלאה ישירה מ-API דורשת OAuth ומפתחות API לכל פלטפורמה
- לאוטומציה מלאה — שקול Make.com עם Instagram Graph API
