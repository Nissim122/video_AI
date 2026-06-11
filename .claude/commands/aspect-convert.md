# /aspect-convert — המרת aspect ratio אוטומטית

המר וידאו לכל הפורמטים (9:16 / 1:1 / 16:9) בבת אחת, ללא אובדן subject.

## מה לעשות

1. **קבל מהמשתמש** נתיב לקובץ וידאו ו(אופציונלי) קואורדינטות subject

2. **הרץ `/auto-reframe`** קודם אם לא ידוע מיקום ה-subject

3. **המר לכל הפורמטים** עם ffmpeg:

```bash
# פורמטים יעד: 9:16 (ריאלס/סטורי), 1:1 (פיד), 16:9 (YouTube)
# INPUT: 1080x1920 (9:16 מקורי)

# → 1:1 (ריבוע)
ffmpeg -i "input.mp4" -vf "crop=1080:1080:0:420,scale=1080:1080" "output_1x1.mp4"

# → 16:9 (YouTube)
ffmpeg -i "input.mp4" -vf "crop=1080:607:0:656,scale=1920:1080" "output_16x9.mp4"

# INPUT: 1920x1080 (16:9 מקורי)

# → 9:16 (ריאלס)
ffmpeg -i "input.mp4" -vf "crop=608:1080:656:0,scale=1080:1920" "output_9x16.mp4"

# → 1:1 (ריבוע)  
ffmpeg -i "input.mp4" -vf "crop=1080:1080:420:0,scale=1080:1080" "output_1x1.mp4"
```

4. **סקריפט אוטומטי לכל הפורמטים:**
```python
# scripts/aspect-convert.py
import sys, subprocess, json

video = sys.argv[1]
subject_x_pct = float(sys.argv[2]) if len(sys.argv) > 2 else 0.5  # 0=שמאל, 1=ימין, 0.5=מרכז

# קבל מידות
r = subprocess.run(['ffprobe','-v','quiet','-of','json','-show_streams', video], capture_output=True, text=True)
streams = json.loads(r.stdout)['streams']
video_stream = next(s for s in streams if s['codec_type'] == 'video')
W, H = int(video_stream['width']), int(video_stream['height'])
print(f"Source: {W}x{H}")

formats = {
    "9x16":  (1080, 1920),
    "1x1":   (1080, 1080),
    "16x9":  (1920, 1080),
}

for name, (out_w, out_h) in formats.items():
    # חישוב crop
    scale = max(out_w/W, out_h/H)
    crop_w = min(W, int(out_w/scale))
    crop_h = min(H, int(out_h/scale))
    x = int((W - crop_w) * subject_x_pct)
    y = int((H - crop_h) * 0.4)  # קצת מעל המרכז
    
    out_file = video.replace('.mp4', f'_{name}.mp4')
    cmd = ['ffmpeg', '-y', '-i', video,
           '-vf', f'crop={crop_w}:{crop_h}:{x}:{y},scale={out_w}:{out_h}',
           '-c:v', 'libx264', '-crf', '18', '-c:a', 'copy', out_file]
    subprocess.run(cmd, capture_output=True)
    print(f"  ✅ {name}: {out_file}")
```
הרץ: `python scripts/aspect-convert.py "video.mp4" 0.5`

5. **הצג סיכום:**
```
📐 Aspect Convert — video.mp4
──────────────────────────────
  ✅ 9:16  → video_9x16.mp4   (1080×1920) — ריאלס/סטורי
  ✅ 1:1   → video_1x1.mp4    (1080×1080) — פיד אינסטגרם
  ✅ 16:9  → video_16x9.mp4   (1920×1080) — YouTube

💡 Subject centered at x=50% — אם נחתך, שנה את הפרמטר השני (0.0–1.0)
```

## כלים נדרשים
- `ffmpeg` + `ffprobe` — חובה
- Python — לסקריפט האוטומטי (ללא pip נוסף)
