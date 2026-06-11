#!/usr/bin/env python3
"""
track_hands.py — MediaPipe hand tracking → JSON for Remotion TrackedOverlay
=============================================================================
Usage:
    python tools/track_hands.py public/my-video.mp4
    python tools/track_hands.py public/my-video.mp4 --output src/tracking/my-video.json
    python tools/track_hands.py public/my-video.mp4 --landmark wrist --smooth 5

Install dependencies:
    pip install mediapipe opencv-python

Output format (src/tracking/my-video.json):
    {
      "landmark": "index_tip",
      "fps": 30,
      "width": 1080,
      "height": 1920,
      "frames": [
        { "frame": 0, "detected": true,  "x": 412, "y": 876 },
        { "frame": 1, "detected": false, "x": 412, "y": 876 },
        ...
      ]
    }

Available landmarks:
    wrist, thumb_tip, index_tip (default), middle_tip,
    ring_tip, pinky_tip, index_mcp, palm_center
"""
import argparse
import json
import os
import sys

try:
    import cv2
    import mediapipe as mp
except ImportError:
    print("Missing dependencies. Run: pip install mediapipe opencv-python", file=sys.stderr)
    sys.exit(1)

LANDMARK_IDX = {
    "wrist":        0,
    "thumb_tip":    4,
    "index_tip":    8,
    "middle_tip":   12,
    "ring_tip":     16,
    "pinky_tip":    20,
    "index_mcp":    5,
    "palm_center":  9,  # middle finger mcp — closest to palm center
}


def smooth_coords(frames: list, window: int) -> list:
    if window <= 1:
        return frames
    xs = [f["x"] for f in frames]
    ys = [f["y"] for f in frames]
    half = window // 2
    for i, f in enumerate(frames):
        lo = max(0, i - half)
        hi = min(len(frames), i + half + 1)
        f["x"] = round(sum(xs[lo:hi]) / (hi - lo))
        f["y"] = round(sum(ys[lo:hi]) / (hi - lo))
    return frames


def track(input_path: str, output_path: str, landmark_name: str, smooth: int) -> None:
    lm_idx = LANDMARK_IDX[landmark_name]

    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        print(f"Error: cannot open '{input_path}'", file=sys.stderr)
        sys.exit(1)

    fps    = cap.get(cv2.CAP_PROP_FPS)
    width  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total  = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    print(f"Input : {input_path}  ({width}×{height} @ {fps:.1f}fps, {total} frames)")
    print(f"Tracking: {landmark_name}  smooth={smooth}")

    mp_hands = mp.solutions.hands
    frames = []
    last_x, last_y = width // 2, height // 2

    with mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=1,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    ) as hands:
        idx = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = hands.process(rgb)

            if result.multi_hand_landmarks:
                lm = result.multi_hand_landmarks[0].landmark[lm_idx]
                last_x = round(lm.x * width)
                last_y = round(lm.y * height)
                detected = True
            else:
                detected = False

            frames.append({"frame": idx, "detected": detected, "x": last_x, "y": last_y})

            idx += 1
            if idx % 30 == 0:
                pct = idx / max(total, 1) * 100
                print(f"\r  {idx}/{total} ({pct:.0f}%) ...", end="", flush=True)

    cap.release()
    print()  # newline after progress

    frames = smooth_coords(frames, smooth)

    detected_count = sum(1 for f in frames if f["detected"])
    pct = detected_count / max(len(frames), 1) * 100
    print(f"Detection: {detected_count}/{len(frames)} frames ({pct:.0f}%)")

    output = {
        "landmark": landmark_name,
        "fps": fps,
        "width": width,
        "height": height,
        "frames": frames,
    }

    out_dir = os.path.dirname(output_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    print(f"Saved → {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="MediaPipe hand tracking → JSON for Remotion TrackedOverlay"
    )
    parser.add_argument("input", help="Path to video file")
    parser.add_argument(
        "--output", "-o",
        default="src/tracking/tracking.json",
        help="Output JSON path (default: src/tracking/tracking.json)",
    )
    parser.add_argument(
        "--landmark", "-l",
        default="index_tip",
        choices=list(LANDMARK_IDX.keys()),
        help="Which hand landmark to track (default: index_tip)",
    )
    parser.add_argument(
        "--smooth", "-s",
        type=int,
        default=3,
        help="Smoothing window in frames (default: 3, set 1 to disable)",
    )
    args = parser.parse_args()
    track(args.input, args.output, args.landmark, args.smooth)


if __name__ == "__main__":
    main()
