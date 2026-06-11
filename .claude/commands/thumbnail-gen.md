# /thumbnail-gen — יצירת thumbnail מהפריים הכי חזק

זהה את הפריים הכי "חזק" ויזואלית בוידאו וצור ממנו thumbnail מוכן לפרסום.

## מה לעשות

1. **קבל מהמשתמש** נתיב לקובץ וידאו

2. **דרג פריימים** לפי חדות, צבעוניות, ופנים:

```python
# scripts/thumbnail-gen.py
import sys, cv2, numpy as np, os

video_path = sys.argv[1]
output_dir = sys.argv[2] if len(sys.argv) > 2 else "thumbnails"
os.makedirs(output_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)
total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

candidates = []
# בדוק פריים כל 2 שניות, מהשניה ה-2 עד הסוף פחות 5 שניות
sample_points = range(int(fps*2), max(int(fps*2)+1, int(total - fps*5)), int(fps*2))

for idx in sample_points:
    cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
    ret, frame = cap.read()
    if not ret:
        continue
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # חדות
    sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()
    
    # צבעוניות (saturation)
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    saturation = np.mean(hsv[:,:,1])
    
    # פנים — bonus
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    face_bonus = 500 if len(faces) > 0 else 0
    
    # ציון משולב
    score = sharpness * 0.5 + saturation * 2 + face_bonus
    
    candidates.append({"frame": idx, "score": score, "time": idx/fps})

cap.release()
candidates.sort(key=lambda x: x["score"], reverse=True)

# שמור 3 הפריימים הטובים
cap = cv2.VideoCapture(video_path)
for i, c in enumerate(candidates[:3]):
    cap.set(cv2.CAP_PROP_POS_FRAMES, c["frame"])
    ret, frame = cap.read()
    if ret:
        path = os.path.join(output_dir, f"thumbnail_{i+1}_at_{c['time']:.1f}s.jpg")
        cv2.imwrite(path, frame, [cv2.IMWRITE_JPEG_QUALITY, 95])
        marker = " ← מומלץ!" if i == 0 else ""
        print(f"  thumbnail_{i+1}: {c['time']:.1f}s (ציון: {c['score']:.0f}){marker}")
cap.release()
```

הרץ: `pip install opencv-python numpy` ואז `python scripts/thumbnail-gen.py "video.mp4"`

3. **הצג תוצאות:**
```
🖼️ Thumbnails — video.mp4
──────────────────────────────
  thumbnail_1: 3.2s (ציון: 2847) ← מומלץ!
  thumbnail_2: 7.8s (ציון: 2341)
  thumbnail_3: 12.1s (ציון: 1998)

📁 נשמרו ב: thumbnails/
```

4. **שאל** אם להוסיף טקסט/לוגו על ה-thumbnail עם ffmpeg:
```bash
# הוספת טקסט ל-thumbnail
ffmpeg -i "thumbnails/thumbnail_1_at_3.2s.jpg" \
  -vf "drawtext=text='כותרת כאן':fontcolor=white:fontsize=60:x=50:y=50:shadowcolor=black:shadowx=2:shadowy=2" \
  "thumbnail_final.jpg"
```

## כלים נדרשים
- `opencv-python` + `numpy`: `pip install opencv-python numpy`
- `ffmpeg` — להוספת טקסט/לוגו
