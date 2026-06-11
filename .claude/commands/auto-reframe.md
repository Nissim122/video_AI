# /auto-reframe — ריפריים אוטומטי לפי subject

זהה את ה-subject המרכזי בוידאו וחתוך/ריפריים אוטומטית לפורמט יעד (9:16, 1:1, 16:9).

## מה לעשות

1. **קבל מהמשתמש:**
   - נתיב לקובץ וידאו
   - פורמט יעד: `9:16` (ריאלס) / `1:1` (ריבוע) / `16:9` (YouTube)

2. **זהה subject** עם Python + OpenCV:
```python
# scripts/auto-reframe.py
import sys, cv2, numpy as np

video_path = sys.argv[1]
target = sys.argv[2] if len(sys.argv) > 2 else "9:16"

cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)
W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

# טעינת face detector
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

center_x_list = []
frame_idx = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break
    if frame_idx % 15 == 0:  # בדוק כל 15 פריימים
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        if len(faces) > 0:
            # מרכז הפנים
            cx = int(faces[0][0] + faces[0][2]/2)
            center_x_list.append(cx)
        else:
            # ללא פנים — חישוב center of motion
            center_x_list.append(W // 2)
    frame_idx += 1

cap.release()

avg_cx = int(np.mean(center_x_list)) if center_x_list else W // 2

# חישוב crop
if target == "9:16":
    out_w = int(H * 9/16)
    out_h = H
elif target == "1:1":
    out_w = out_h = min(W, H)
else:  # 16:9
    out_w = W
    out_h = int(W * 9/16)

# x offset — ממורכז על ה-subject
x_offset = max(0, min(avg_cx - out_w//2, W - out_w))

print(f"Source:   {W}x{H}")
print(f"Target:   {target} → {out_w}x{out_h}")
print(f"Subject X: {avg_cx}px → crop from x={x_offset}")
print(f"\nffmpeg command:")
print(f'ffmpeg -i "{video_path}" -vf "crop={out_w}:{out_h}:{x_offset}:0,scale={out_w}:{out_h}" "reframed_{target.replace(":","x")}.mp4"')
```

3. **הרץ:** `pip install opencv-python numpy` ואז `python scripts/auto-reframe.py "video.mp4" "9:16"`

4. **בצע את ה-crop עם הפקודה שהתקבלה:**
```bash
ffmpeg -i "input.mp4" -vf "crop=1080:1920:420:0,scale=1080:1920" "reframed_9x16.mp4"
```

5. **הצג סיכום:**
```
🎯 Auto-Reframe — video.mp4
──────────────────────────────
מקור:     1920×1080 (16:9)
יעד:      1080×1920 (9:16)
Subject:  x=840px (ממוצע מ-47 פריימים)
Crop:     x=300, width=1080

✅ קובץ נשמר: reframed_9x16.mp4
💡 בדוק שה-subject לא נחתך — אם כן, שנה x_offset ידנית
```

## כלים נדרשים
- `ffmpeg` — לחיתוך הסופי
- `opencv-python` + `numpy` — לזיהוי subject: `pip install opencv-python numpy`

## הגבלות
- זיהוי פנים עובד טוב לאנשים מדברים / talking head
- לוידאו ללא פנים — מרכז הפריים משמש כברירת מחדל
- reframe מורכב (tracking) דורש כלים מתקדמים כמו DaVinci Resolve
