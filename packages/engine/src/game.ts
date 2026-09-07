import { generateBoard } from "./board.js";
import { getLegalMoves } from "./moves.js";
import { findSpatialWin } from "./win.js";
import type { GameResult, GameState, Move, Rules } from "./types.js";
function freezeState(state: GameState): GameState {
  if (state.result.status === "win") Object.freeze(state.result.cells);
  Object.freeze(state.result);
  Object.freeze(state.owners);
  Object.freeze(state.moves);
  return Object.freeze(state);
}
export function createGame(rules: Rules, seed: string): GameState {
  const board = generateBoard(rules, seed);
  return freezeState({
    rules: Object.freeze({ ...rules }),
    seed,
    board,
    owners: Array<0>(board.length).fill(0),
    currentPlayer: 1,
    lastMove: null,
    moves: [],
    result: { status: "playing" },
  });
}
export function applyMove(state: GameState, move: Move): GameState {
  if (state.result.status !== "playing") throw new Error("Game is over. Start a new game.");
  if (!Number.isInteger(move) || !getLegalMoves(state).includes(move))
    throw new Error(
      `Illegal move: ${move}. Choose an unoccupied tile matching the previous A or B.`,
    );
  const owners = [...state.owners];
  owners[move] = state.currentPlayer;
  const next: GameState = {
    ...state,
    owners,
    currentPlayer: state.currentPlayer === 1 ? 2 : 1,
    lastMove: move,
    moves: [...state.moves, move],
    result: { status: "playing" },
  };
  const spatial = findSpatialWin(state.rules, owners, move, state.currentPlayer);
  let result: GameResult = next.result;
  if (spatial) result = { status: "win", winner: state.currentPlayer, ...spatial };
  else if (next.moves.length === state.board.length)
    result = { status: "draw", reason: "full-board" };
  else if (getLegalMoves(next).length === 0)
    result = state.rules.lockoutWins
      ? { status: "win", winner: state.currentPlayer, reason: "lockout", cells: [move] }
      : { status: "draw", reason: "no-legal-moves" };
  return freezeState({ ...next, result });
}
export function getResult(state: GameState): GameResult {
  return state.result;
}
