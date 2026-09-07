import type { Player, Rules, WinReason } from "./types.js";
export interface SpatialWin {
  readonly reason: Exclude<WinReason, "lockout">;
  readonly cells: readonly number[];
}
/** Check only patterns containing the new move; a valid ongoing state has no earlier winner. */
export function findSpatialWin(
  rules: Rules,
  owners: readonly (0 | Player)[],
  move: number,
  player: Player,
): SpatialWin | null {
  const { size, lineLength, blockWidth, blockHeight } = rules;
  const row = Math.floor(move / size),
    col = move % size;
  for (const [dr, dc, reason] of [
    [0, 1, "horizontal"],
    [1, 0, "vertical"],
    [1, 1, "diagonal"],
    [1, -1, "diagonal"],
  ] as const) {
    for (let offset = 0; offset < lineLength; offset++) {
      const cells: number[] = [];
      for (let k = 0; k < lineLength; k++) {
        const r = row + (k - offset) * dr,
          c = col + (k - offset) * dc;
        if (r < 0 || r >= size || c < 0 || c >= size || owners[r * size + c] !== player) break;
        cells.push(r * size + c);
      }
      if (cells.length === lineLength) return { reason, cells };
    }
  }
  for (
    let top = Math.max(0, row - blockHeight + 1);
    top <= Math.min(row, size - blockHeight);
    top++
  ) {
    for (
      let left = Math.max(0, col - blockWidth + 1);
      left <= Math.min(col, size - blockWidth);
      left++
    ) {
      const cells: number[] = [];
      for (let r = top; r < top + blockHeight; r++)
        for (let c = left; c < left + blockWidth; c++) cells.push(r * size + c);
      if (cells.every((cell) => owners[cell] === player)) return { reason: "block", cells };
    }
  }
  return null;
}
