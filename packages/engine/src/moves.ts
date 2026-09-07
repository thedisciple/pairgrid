import type { GameState, Move } from "./types.js";
export function getLegalMoves(state: GameState): readonly Move[] {
  if (state.result.status !== "playing") return [];
  const previous = state.lastMove === null ? null : state.board[state.lastMove]!;
  const moves: Move[] = [];
  for (let cell = 0; cell < state.board.length; cell++) {
    const tile = state.board[cell]!;
    if (state.owners[cell] === 0 && (!previous || tile.a === previous.a || tile.b === previous.b))
      moves.push(cell);
  }
  return moves;
}
