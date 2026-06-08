/**
 * Returns an `at(index)` helper that calculates frame timing for a sequence of effects.
 *
 * Usage:
 *   const { at } = useEffectTimeline({ start: 80, gap: 20 });
 *   <TapEffect startAt={at(0)} />  // frame 80
 *   <TapEffect startAt={at(1)} />  // frame 100
 *   <TapEffect startAt={at(2)} />  // frame 120
 */
export function useEffectTimeline({ start, gap }: { start: number; gap: number }) {
  return {
    at: (index: number) => start + index * gap,
  };
}
