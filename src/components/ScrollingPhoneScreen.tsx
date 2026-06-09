import React from "react";
import { Img, staticFile } from "remotion";
import { PHONE_H } from "./IPhone14";

// Height of one screenshot in the vertical strip (matches phone inner screen height)
export const STRIP_PAGE_H = PHONE_H - 28; // 1220

interface ScrollingPhoneScreenProps {
  images: string[];
  /**
   * Per-image Y offset in px.
   * image[0] = 0 (stationary), image[i] starts at STRIP_PAGE_H and slides up.
   */
  scrollYs: number[];
  /** Per-image px to cover from bottom (hides browser bar) */
  bottomCrops?: number[];
  /** Per-image px to cover from top (hides status bar — time/battery) */
  topCrops?: number[];
  /** Overlays positioned in phone-screen space (GlowHighlight, TapEffect, etc.) */
  children?: React.ReactNode;
}

export const ScrollingPhoneScreen: React.FC<ScrollingPhoneScreenProps> = ({
  images,
  scrollYs,
  bottomCrops,
  topCrops,
  children,
}) => (
  <div style={{ position: "absolute", inset: 0 }}>
    {images.map((src, i) => {
      const bCrop = bottomCrops?.[i] ?? 0;
      const tCrop = topCrops?.[i] ?? 0;
      const y = scrollYs[i] ?? 0;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: STRIP_PAGE_H,
            overflow: "hidden",
            zIndex: i + 1,
            transform: `translateY(${y}px)`,
          }}
        >
          <Img
            src={staticFile(src)}
            style={{
              width: "100%",
              height: STRIP_PAGE_H,
              objectFit: "cover",
              objectPosition: "top",
              display: "block",
            }}
          />
          {tCrop > 0 && (
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: tCrop, background: "#0e1628",
            }} />
          )}
          {bCrop > 0 && (
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: bCrop, background: "#0e1628",
            }} />
          )}
        </div>
      );
    })}

    {/* Fixed overlays — phone-screen space, above all images */}
    <div style={{ position: "absolute", inset: 0, zIndex: 100 }}>
      {children}
    </div>
  </div>
);
