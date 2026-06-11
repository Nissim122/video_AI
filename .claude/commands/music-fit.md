# /music-fit — הוספת מוזיקת רקע מותאמת וחיתוך לאורך הסרטון

הוסף מוזיקת רקע לוידאו — כולל fade in/out, עמעום מתחת לקול ואורך מדויק.

## מה לעשות

1. **קבל מהמשתמש:**
   - נתיב לוידאו
   - נתיב לקובץ מוזיקה (או בקש המלצה על mood)
   - עוצמת מוזיקה: `low` (רקע עדין) / `mid` (שווה לקול) / `high` (מוזיקה ראשית)

2. **אם המשתמש ביקש המלצה על מוזיקה** — הצג אתרים בחינם:
   ```
   מקורות מוזיקה ללא זכויות:
   - pixabay.com/music (חינם, ללא קרדיט)
   - freemusicarchive.org
   - incompetech.com (Kevin MacLeod)
   - YouTube Audio Library (studio.youtube.com → Audio Library)
   ```

3. **קבל אורך הוידאו:**
```bash
ffprobe -v quiet -of json -show_format "video.mp4" | python -c "import sys,json; d=json.load(sys.stdin); print(d['format']['duration'])"
```

4. **הרץ ffmpeg עם מוזיקה מותאמת:**

### קול + מוזיקת רקע עדינה (low):
```bash
ffmpeg -i "video.mp4" -i "music.mp3" \
  -filter_complex "\
    [1:a]volume=0.15,afade=t=in:st=0:d=1,afade=t=out:st=DURATION-2:d=2[music];\
    [0:a][music]amix=inputs=2:duration=first:dropout_transition=2[out]" \
  -map 0:v -map "[out]" -c:v copy -shortest \
  "output_with_music.mp4"
```

### מוזיקה בלבד (ללא קול מקור):
```bash
ffmpeg -i "video.mp4" -i "music.mp3" \
  -filter_complex "\
    [1:a]volume=0.8,afade=t=in:st=0:d=1.5,afade=t=out:st=DURATION-2:d=2[music]" \
  -map 0:v -map "[music]" -c:v copy -shortest \
  "output_music_only.mp4"
```

### עוצמות לפי בחירה:
- `low`:  volume=0.12  (רקע עדין מאוד)
- `mid`:  volume=0.35  (מאוזן עם קול)
- `high`: volume=0.80  (מוזיקה ראשית)

5. **החלף DURATION** באורך הוידאו בשניות (מהפלט של ffprobe למעלה)

6. **הצג סיכום:**
```
🎵 Music Fit — video.mp4
──────────────────────────
וידאו:    video.mp4 (28.5s)
מוזיקה:  background_track.mp3
עוצמה:   low (0.12)
Fade in:  1s | Fade out: 2s

✅ נשמר: output_with_music.mp4
💡 לסנכרון על beats — הרץ /beat-sync
```

## כלים נדרשים
- `ffmpeg` + `ffprobe` — חובה, ללא pip נוסף

## הערות
- `afade=t=out:st=DURATION-2` — מתחיל fade 2 שניות לפני הסוף
- `-shortest` — חותך את המוזיקה בדיוק כשהוידאו נגמר
- אם המוזיקה קצרה מהוידאו — הוסף `-stream_loop -1` לפני `-i "music.mp3"` לחזרה
