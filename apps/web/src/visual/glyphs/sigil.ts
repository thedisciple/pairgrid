import { assertIndex, type SigilDescriptor } from "../types";
/** Enumerate mirrored grid motifs directly, preserving low-index distinction without hashing. */
export function sigilFor(index: number): SigilDescriptor {
  assertIndex(index);
  const code = BigInt(index) + 1n;
  const cells: { x: number; y: number }[] = [];
  // A shared central stem unifies the family. Ten bits add symmetric branches.
  for (let y = 0; y < 5; y++) cells.push({ x: 2, y });
  for (let bit = 0; bit < 10; bit++) {
    if ((code & (1n << BigInt(bit))) === 0n) continue;
    const y = bit % 5,
      x = Math.floor(bit / 5);
    cells.push({ x, y }, { x: 4 - x, y });
  }
  // Higher IDs remain deterministic; human recognition is deliberately bounded.
  const shift = Number((code / 1024n) % 5n);
  return { cells: cells.map((cell) => ({ x: cell.x, y: (cell.y + shift) % 5 })) };
}
