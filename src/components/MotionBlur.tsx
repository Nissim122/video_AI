import React from "react";
import { useCurrentFrame } from "remotion";

export interface MotionBlurEvent {
  /** frame when blur starts */
  startFrame: number;
  /** frame when blur ends */
  endFrame: number;
  /** "left" | "right" | "up" | "down" */
  direction?: "left" | "right" | "up" | "down";
  /** 0–3, default 1 */
  strength?: number;
}

interface MotionBlurProps {
  events?: MotionBlurEvent[];
  children?: React.ReactNode;
}

export const MotionBlur: React.FC<MotionBlurProps> = ({
  events = [],
  children,
}) => {
  const frame = useCurrentFrame();

  let totalBlurX = 0;
  let totalBlurY = 0;

  for (const ev of events) {
    const { startFrame, endFrame, direction = "right", strength = 1 } = ev;
    if (frame < startFrame || frame > endFrame) continue;

    const mid = (startFrame + endFrame) / 2;
    const halfDur = (endFrame - startFrame) / 2;

    // Bell curve — peak at midpoint
    const progress = 1 - Math.abs(frame - mid) / halfDur;
    const blurPx = progress * 28 * strength;

    if (direction === "left" || direction === "right") {
      totalBlurX += blurPx;
    } else {
      totalBlurY += blurPx;
    }
  }

  const hasBlur = totalBlurX > 0 || totalBlurY > 0;

  if (!hasBlur) return <>{children}</>;

  // Directional blur via SVG feGaussianBlur on a filter
  const filterId = `mb-${frame}`;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur
              stdDeviation={`${totalBlurX} ${totalBlurY}`}
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: `url(#${filterId})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
