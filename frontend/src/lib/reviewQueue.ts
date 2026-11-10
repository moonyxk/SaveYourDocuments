export function firstReviewItemAfter<T extends { id: number }>(
  items: readonly T[],
  currentId: number | undefined,
): T | undefined {
  if (currentId === undefined) return items[0];
  return items.find((item) => item.id > currentId);
}
