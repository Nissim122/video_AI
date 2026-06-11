import React from "react";

export interface SmartStackItem {
  /** Unique identifier for this item */
  key: string;
  /**
   * Desired distance from the bottom of the canvas (px).
   * Items that would overlap will be pushed up automatically.
   */
  preferredBottom: number;
  /** Approximate rendered height of this item (px) — used for overlap detection */
  height: number;
  /**
   * Render function that receives:
   *   computedBottom — collision-adjusted px from canvas bottom
   *   zIndex         — auto-assigned stacking order (lowest item = highest z-index)
   *
   * Usage:
   *   CTAButton  → positionY={VIDEO_H - bottom - height}
   *   LowerThird → positionBottom={bottom}
   *   custom div → style={{ position:"absolute", bottom, zIndex }}
   */
  render: (computedBottom: number, zIndex: number) => React.ReactNode;
}

interface SmartStackProps {
  items: SmartStackItem[];
  /** Minimum gap (px) between adjacent stacked items (default 20) */
  padding?: number;
}

/**
 * SmartStack — collision-free vertical stacking near the bottom of the canvas.
 *
 * Items are sorted from lowest (smallest preferredBottom) to highest.
 * Each item gets the maximum of its preferredBottom and the position that
 * clears the item below it plus the padding gap.
 *
 * Usage in Composition.tsx:
 *
 * <SmartStack
 *   padding={24}
 *   items={[
 *     {
 *       key: "cta",
 *       preferredBottom: 180,
 *       height: 86,
 *       render: (b) => (
 *         <CTAButton text="לפרטים" enterFrame={600} positionY={VIDEO_H - b - 86} />
 *       ),
 *     },
 *     {
 *       key: "lower",
 *       preferredBottom: 260,
 *       height: 120,
 *       render: (b) => (
 *         <LowerThird name="ניסים" title="מייסד Clix" enterFrame={30} positionBottom={b} />
 *       ),
 *     },
 *   ]}
 * />
 */
export const SmartStack: React.FC<SmartStackProps> = ({
  items,
  padding = 20,
}) => {
  // Sort ascending: smallest preferredBottom first (lowest on screen)
  const sorted = [...items].sort((a, b) => a.preferredBottom - b.preferredBottom);

  const computed: Record<string, number> = {};
  let cursor = 0;

  for (const item of sorted) {
    const bottom = Math.max(item.preferredBottom, cursor);
    computed[item.key] = bottom;
    cursor = bottom + item.height + padding;
  }

  // Lowest item (smallest computedBottom) = visually closest to edge = highest z-index
  // so it appears in front when shadows/blur of adjacent items bleed
  const zIndexMap: Record<string, number> = {};
  sorted.forEach((item, i) => {
    zIndexMap[item.key] = sorted.length - i;
  });

  return (
    <>
      {items.map((item) => (
        <React.Fragment key={item.key}>
          {item.render(computed[item.key], zIndexMap[item.key])}
        </React.Fragment>
      ))}
    </>
  );
};
