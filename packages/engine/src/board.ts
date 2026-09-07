import { seededRandom } from "./rng.js";
import type { Rules, TileIdentity } from "./types.js";
export function validateRules(rules: Rules): void {
  if (!rules || !Number.isSafeInteger(rules.size) || rules.size < 1 || rules.size > 256)
    throw new Error("Board size must be an integer from 1 to 256.");
  for (const key of ["lineLength", "blockWidth", "blockHeight"] as const) {
    if (!Number.isInteger(rules[key]) || rules[key] < 1 || rules[key] > rules.size)
      throw new Error(`${key} must be an integer from 1 to board size.`);
  }
  if (typeof rules.lockoutWins !== "boolean") throw new Error("lockoutWins must be a boolean.");
}
export function generateBoard(rules: Rules, seed: string): readonly TileIdentity[] {
  validateRules(rules);
  if (typeof seed !== "string") throw new Error("Seed must be a string.");
  const board = Array.from({ length: rules.size ** 2 }, (_, id) =>
    Object.freeze({ a: Math.floor(id / rules.size), b: id % rules.size }),
  );
  const random = seededRandom(seed);
  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [board[i], board[j]] = [board[j]!, board[i]!];
  }
  return Object.freeze(board);
}
