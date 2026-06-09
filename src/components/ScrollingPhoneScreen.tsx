import React from "react";
import { Img, staticFile } from "remotion";
import { PHONE_H } from "./IPhone14";

// Height of one screenshot in the vertical strip (matches phone inner screen height)
export const STRIP_PAGE_H = PHONE_H - 28; // 1220

interface ScrollingPhoneScreenProps {
  images: string[];
  /** Current scroll offset in px — 0 = page 1, -STRIP_PAGE_H = page 2, etc. */
  scrollY: number;
  /** Overlays positioned in phone-screen space (GlowHighlight, TapEffect, etc.) */
  children?: React.ReactNode;
}

/**
 * Renders a vertically stacked strip of screenshots that scrolls inside the phone.
 * Pass as children to IPhone14 (via PhoneEntrance or directly).
 */
export const ScrollingPhoneScreen: React.FC<ScrollingPhoneScreenProps> = ({
  images,
  scrollY,
  children,
}) => (
  <div style={{ position: "absolute", inset: 0 }}>
    {/* Scrolling strip */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        transform: `translateY(${scrollY}px)`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {images.map((src, i) => (
        <Img
          key={i}
          src={staticFile(src)}
          style={{
            width: "100%",
            height: STRIP_PAGE_H,
            objectFit: "cover",
            objectPosition: "top",
            flexShrink: 0,
            display: "block",
          }}
        />
      ))}
    </div>

    {/* Fixed overlays — positioned in phone-screen space, not affected by scroll */}
    {children}
  </div>
);
