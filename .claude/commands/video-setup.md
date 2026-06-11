# /video-setup — התקנת כל הכלים הנדרשים לכישורי הוידאו

התקן את כל התלויות הנדרשות לכישורי הוידאו בבת אחת.

## מה לעשות

1. **בדוק מה כבר מותקן:**

```powershell
# בדוק ffmpeg
ffmpeg -version 2>$null | Select-Object -First 1

# בדוק Python
python --version 2>$null

# בדוק חבילות Python
python -c "import cv2; print('opencv ✅', cv2.__version__)" 2>$null
python -c "import librosa; print('librosa ✅')" 2>$null
python -c "import numpy; print('numpy ✅', numpy.__version__)" 2>$null
python -c "import noisereduce; print('noisereduce ✅')" 2>$null
python -c "import soundfile; print('soundfile ✅')" 2>$null
```

2. **הצג סטטוס:**
```
🔍 בדיקת תלויות:
  ffmpeg:        ✅ / ❌ לא מותקן
  Python:        ✅ / ❌ לא מותקן
  opencv-python: ✅ / ❌ לא מותקן
  librosa:       ✅ / ❌ לא מותקן
  numpy:         ✅ / ❌ לא מותקן
  noisereduce:   ✅ / ❌ לא מותקן
  soundfile:     ✅ / ❌ לא מותקן
```

3. **התקן ffmpeg (אם חסר):**

```powershell
# שיטה 1 — winget (מובנה ב-Windows 11)
winget install --id Gyan.FFmpeg -e --source winget

# שיטה 2 — Chocolatey (אם מותקן)
choco install ffmpeg

# שיטה 3 — הורדה ידנית
# https://www.gyan.dev/ffmpeg/builds/ → ffmpeg-release-essentials.zip
# חלץ → העתק ffmpeg.exe, ffprobe.exe ל-C:\Windows\System32\
```

4. **התקן חבילות Python (הכל בפקודה אחת):**

```powershell
pip install opencv-python numpy librosa soundfile noisereduce
```

5. **צור תיקיית scripts (אם לא קיימת):**

```powershell
New-Item -ItemType Directory -Force -Path "scripts"
```

6. **הרץ בדיקה סופית:**

```powershell
python -c "
import cv2, numpy, librosa, soundfile, noisereduce
print('✅ כל החבילות מותקנות!')
print(f'  opencv: {cv2.__version__}')
print(f'  numpy:  {numpy.__version__}')
print(f'  librosa: OK')
print(f'  soundfile: OK')
print(f'  noisereduce: OK')
"
```

7. **הצג סיכום סופי:**

```
✅ סביבת הוידאו מוכנה!

🛠️ כלים זמינים:
  ffmpeg / ffprobe  → כל כישורי הוידאו הבסיסיים
  opencv-python     → /best-take, /auto-reframe, /thumbnail-gen, /motion-ramp, /video-diff
  librosa           → /audio-beats, /beat-sync, /audio-clean
  noisereduce       → /audio-clean (מתקדם)
  numpy             → כל הסקריפטים

📁 תיקיית scripts/ נוצרה — שם נשמרים סקריפטי Python

🚀 מוכן להשתמש בכל הכישורים:
  /video-analyze  /cut-detect  /audio-beats  /beat-sync
  /audio-clean    /motion-ramp /best-take    /auto-reframe
  /thumbnail-gen  /aspect-convert /music-fit /video-export
  /video-upload   /video-diff
```

## פתרון בעיות נפוצות

### ffmpeg לא מזוהה אחרי התקנה
```powershell
# רענן PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
ffmpeg -version
```

### pip לא מוצא Python
```powershell
python -m pip install opencv-python numpy librosa soundfile noisereduce
```

### שגיאת הרשאות ב-pip
```powershell
pip install --user opencv-python numpy librosa soundfile noisereduce
```
