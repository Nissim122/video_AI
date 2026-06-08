export type SceneInfo = {
  start: number;
  end: number;
  duration: number;
};

export type Timeline<T extends string> = Record<T, SceneInfo> & { total: number };

export function buildTimeline<T extends string>(
  scenes: { id: T; duration: number }[]
): Timeline<T> {
  let cursor = 0;
  const result = { total: 0 } as Timeline<T>;

  for (const scene of scenes) {
    (result as Record<string, SceneInfo | number>)[scene.id] = {
      start: cursor,
      end: cursor + scene.duration,
      duration: scene.duration,
    };
    cursor += scene.duration;
  }

  result.total = cursor;
  return result;
}
