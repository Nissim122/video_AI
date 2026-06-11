# /best-take — בחירת ה-take הטוב ביותר מכמה טייקים

השווה כמה טייקים של אותה סצנה ובחר אוטומטית את הטוב ביותר לפי בהירות, יציבות ותנועה.

## מה לעשות

1. **קבל מהמשתמש** תיקייה עם קבצי הטייקים (take1.mp4, take2.mp4, ...)

2. **הרץ ניתוח איכות** לכל קובץ:

```python
# scripts/best-take.py
import sys, os, cv2, numpy as np

folder = sys.argv[1]
videos = [f for f in os.listdir(folder) if f.endswith(('.mp4', '.mov', '.avi'))]
results = []

for video in sorted(videos):
    path = os.path.join(folder, video)
    cap = cv2.VideoCapture(path)
    
    sharpness_scores = []
    stability_scores = []
    prev_frame = None
    
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    # דגום 20 פריימים מהאמצע
    sample_frames = list(range(total_frames//4, 3*total_frames//4, max(1, total_frames//20)))
    
    for idx in sample_frames:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if not ret:
            continue
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # חדות — Laplacian variance
        sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()
        sharpness_scores.append(sharpness)
        
        # יציבות — הפרש בין פריימים
        if prev_frame is not None:
            diff = np.mean(cv2.absdiff(gray, prev_frame))
            stability_scores.append(diff)
        prev_frame = gray
    
    cap.release()
    
    avg_sharp = np.mean(sharpness_scores) if sharpness_scores else 0
    avg_stab = 100 - np.mean(stability_scores) if stability_scores else 0  # גבוה = יציב יותר
    
    # ציון משולב (חדות חשובה יותר)
    combined = avg_sharp * 0.7 + avg_stab * 0.3
    
    results.append({
        "file": video,
        "sharpness": round(avg_sharp, 1),
        "stability": round(avg_stab, 1),
        "score": round(combined, 1)
    })

results.sort(key=lambda x: x["score"], reverse=True)

print("\n🎬 השוואת טייקים:")
print(f"{'קובץ':<20} {'חדות':<10} {'יציבות':<10} {'ציון':<10}")
print("─" * 55)
for i, r in enumerate(results):
    marker = " ← מומלץ!" if i == 0 else ""
    print(f"{r['file']:<20} {r['sharpness']:<10} {r['stability']:<10} {r['score']:<10}{marker}")

print(f"\n✅ הטייק המומלץ: {results[0]['file']}")
```

הרץ: `pip install opencv-python numpy` ואז `python scripts/best-take.py "takes/"`

3. **הצג דוח:**
```
🎬 השוואת טייקים — takes/
──────────────────────────────────
קובץ          חדות      יציבות    ציון
take1.mp4     245.3     87.2      188.3
take3.mp4     312.1     81.4      234.2  ← מומלץ!
take2.mp4     198.7     92.1      161.3

✅ הטייק המומלץ: take3.mp4
   חדות גבוהה: 312 | יציבות טובה: 81%
```

4. **שאל** אם לאמץ את הטייק המומלץ לסרטון הנוכחי

## כלים נדרשים
- `opencv-python` + `numpy`: `pip install opencv-python numpy`

## הערות
- חדות (Laplacian variance) מזהה מצלמה מטושטשת / out-of-focus
- יציבות (frame diff) מזהה רעד / motion blur
- דגימה של 20 פריימים מאמצע הקליפ — מהיר ומדויק מספיק
