import { createGame, applyMove } from "./game.js";
import { validateRules } from "./board.js";
import type { GameState, Rules } from "./types.js";
/** Store inputs, not trusted derived state. Deserialization replays and validates every move. */
export function serializeGame(state: GameState): string {
  return JSON.stringify({ version: 1, rules: state.rules, seed: state.seed, moves: state.moves });
}
export function deserializeGame(json: string): GameState {
  const data: unknown = JSON.parse(json);
  if (!data || typeof data !== "object") throw new Error("Replay must be an object.");
  const value = data as Record<string, unknown>;
  if (value.version !== 1 || typeof value.seed !== "string" || !Array.isArray(value.moves))
    throw new Error("Invalid replay format or unsupported version.");
  if (!value.rules || typeof value.rules !== "object") throw new Error("Replay requires rules.");
  const source = value.rules as Rules;
  validateRules(source);
  const rules: Rules = {
    size: source.size,
    lineLength: source.lineLength,
    blockWidth: source.blockWidth,
    blockHeight: source.blockHeight,
    lockoutWins: source.lockoutWins,
  };
  if (value.moves.length > rules.size ** 2) throw new Error("Replay contains too many moves.");
  let state = createGame(rules, value.seed);
  for (const move of value.moves) {
    if (typeof move !== "number") throw new Error("Replay moves must be numeric cell indices.");
    state = applyMove(state, move);
  }
  return state;
}
