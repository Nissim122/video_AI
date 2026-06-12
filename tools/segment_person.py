"""
segment_person.py
-----------------
Processes chofshi.mp4 frame-by-frame using rembg (isnet-general-use),
produces a WebM (VP9 + alpha) where the background is transparent.

Output: public/chofshi_masked.webm
Usage:  python tools/segment_person.py
"""

import cv2
import numpy as np
import subprocess
import os
import sys
from rembg import remove, new_session

INPUT  = os.path.join(os.path.dirname(__file__), "..", "public", "chofshi.mp4")
FRAMES = os.path.join(os.path.dirname(__file__), "..", "public", "_seg_frames")
OUTPUT = os.path.join(os.path.dirname(__file__), "..", "public", "chofshi_masked.webm")


def refine_mask(img: np.ndarray) -> np.ndarray:
    """Fill holes (incl. light-shirt holes) in alpha using large close + flood-fill."""
    alpha = img[:, :, 3]

    _, binary = cv2.threshold(alpha, 10, 255, cv2.THRESH_BINARY)

    # Large closing bridges gaps caused by white/light clothing
    kernel_big = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (80, 80))
    closed = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel_big)

    # Flood-fill from padded border → all unreached interior pixels are holes
    h, w = closed.shape
    padded = cv2.copyMakeBorder(closed, 1, 1, 1, 1, cv2.BORDER_CONSTANT, value=0)
    flood_mask = np.zeros((h + 4, w + 4), np.uint8)
    cv2.floodFill(padded, flood_mask, (0, 0), 255)
    interior_holes = cv2.bitwise_not(padded[1:-1, 1:-1])
    filled = cv2.bitwise_or(closed, interior_holes)

    # Smooth edges only (preserve hard interior)
    kernel_edge = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
    smooth = cv2.GaussianBlur(filled, (7, 7), 0)
    edge = cv2.absdiff(filled, cv2.erode(filled, kernel_edge))
    edge = (edge > 10).astype(np.uint8) * 255
    alpha_final = np.where(edge > 0, smooth, filled)

    img[:, :, 3] = alpha_final
    return img


def main():
    cap = cv2.VideoCapture(INPUT)
    if not cap.isOpened():
        print(f"ERROR: cannot open {INPUT}")
        sys.exit(1)

    fps   = cap.get(cv2.CAP_PROP_FPS)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Video: {total} frames @ {fps:.2f} fps")

    os.makedirs(FRAMES, exist_ok=True)

    # isnet-general-use — fast model; refine_mask fills holes in light clothing
    print("Loading AI model (isnet-general-use)...")
    session = new_session("isnet-general-use")

    MAX_FRAMES = 210  # 7 seconds at 30fps
    frame_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret or frame_idx >= MAX_FRAMES:
            break

        # rembg expects RGB PNG bytes
        _, png_buf = cv2.imencode(".png", cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        result_bytes = remove(png_buf.tobytes(), session=session)

        # Decode result — keep as BGRA (imencode expects BGRA for correct PNG output)
        result_arr = np.frombuffer(result_bytes, np.uint8)
        bgra = cv2.imdecode(result_arr, cv2.IMREAD_UNCHANGED)

        # Post-process: fill holes + smooth edges (only touches channel 3 = alpha)
        bgra = refine_mask(bgra)

        out_path = os.path.join(FRAMES, f"frame_{frame_idx:05d}.png")
        success, buf = cv2.imencode(".png", bgra)
        if success:
            with open(out_path, "wb") as fh:
                fh.write(buf.tobytes())

        frame_idx += 1
        pct = frame_idx / total * 100
        done = int(pct / 2)
        bar = "#" * done + "-" * (50 - done)
        print(f"\r[{bar}] {pct:5.1f}%  ({frame_idx}/{total})", end="", flush=True)

    cap.release()
    print(f"\nSegmentation done — {frame_idx} frames written")

    # ── Encode to WebM VP9 with alpha ──────────────────────────────────────────
    print("Encoding WebM with alpha channel...")
    cmd = [
        "ffmpeg", "-y",
        "-framerate", str(fps),
        "-i", os.path.join(FRAMES, "frame_%05d.png"),
        "-c:v", "libvpx-vp9",
        "-b:v", "0",
        "-crf", "28",
        "-pix_fmt", "yuva420p",
        "-auto-alt-ref", "0",
        OUTPUT,
    ]
    result = subprocess.run(cmd, capture_output=True)
    if result.returncode != 0:
        err = (result.stderr or b"").decode("utf-8", errors="replace")
        print("ffmpeg error:", err[-800:])
        sys.exit(1)

    print(f"Done!  →  {OUTPUT}")

    import shutil
    shutil.rmtree(FRAMES)
    print("Temp frames cleaned up.")

if __name__ == "__main__":
    main()
