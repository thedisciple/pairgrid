import { assertIndex, type CrestDescriptor } from "../types";
/** First twelve IDs use four silhouettes and three orientations; no asset lookup. */
export function crestFor(index: number): CrestDescriptor {
  assertIndex(index);
  const sides = 3 + (index % 4);
  const rotation = -90 + (Math.floor(index / 4) % 3) * 20;
  const bands = 1 + (Math.floor(index / 12) % 3);
  const points = Array.from({ length: sides }, (_, vertex) => {
    const angle = ((rotation + (vertex * 360) / sides) * Math.PI) / 180;
    return `${(50 + 42 * Math.cos(angle)).toFixed(3)},${(50 + 42 * Math.sin(angle)).toFixed(3)}`;
  }).join(" ");
  return { sides, rotation, bands, hue: (index * 137.508) % 360, points };
}
