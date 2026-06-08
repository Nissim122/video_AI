import { useCurrentFrame } from "remotion";

/** Returns the frame count relative to the scene's start — always >= 0. */
export function useSceneFrame(sceneStart: number): number {
  const frame = useCurrentFrame();
  return Math.max(0, frame - sceneStart);
}
