import React from "react";

export const PHONE_W = 576;
export const PHONE_H = 1248;

export const IPhone14: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div style={{ position: "relative", width: PHONE_W, height: PHONE_H, flexShrink: 0 }}>
    {/* Outer frame */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(145deg, #2c2c2e 0%, #1c1c1e 100%)",
        borderRadius: 80,
        boxShadow:
          "0 0 0 2px #3a3a3c, 0 60px 180px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.05) inset",
      }}
    />
    {/* Screen */}
    <div
      style={{
        position: "absolute",
        top: 14,
        left: 14,
        right: 14,
        bottom: 14,
        borderRadius: 68,
        overflow: "hidden",
        background: "#000",
      }}
    >
      {children}
    </div>
    {/* Dynamic Island */}
    <div
      style={{
        position: "absolute",
        top: 26,
        left: "50%",
        transform: "translateX(-50%)",
        width: 180,
        height: 52,
        background: "#1c1c1e",
        borderRadius: 30,
        zIndex: 20,
      }}
    />
    {/* Power button */}
    <div style={{ position: "absolute", right: -5, top: 250, width: 5, height: 120, background: "#2c2c2e", borderRadius: 3 }} />
    {/* Silent switch */}
    <div style={{ position: "absolute", left: -5, top: 190, width: 5, height: 52, background: "#2c2c2e", borderRadius: 3 }} />
    {/* Volume up */}
    <div style={{ position: "absolute", left: -5, top: 264, width: 5, height: 96, background: "#2c2c2e", borderRadius: 3 }} />
    {/* Volume down */}
    <div style={{ position: "absolute", left: -5, top: 376, width: 5, height: 96, background: "#2c2c2e", borderRadius: 3 }} />
  </div>
);
