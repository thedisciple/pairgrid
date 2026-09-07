export type AttributeIndex = number;
export interface TileIdentity {
  readonly a: AttributeIndex;
  readonly b: AttributeIndex;
}
export interface Rules {
  readonly size: number;
  readonly lineLength: number;
  readonly blockWidth: number;
  readonly blockHeight: number;
  readonly lockoutWins: boolean;
}
export type Player = 1 | 2;
/** Row-major cell index: row * rules.size + column. */
export type Move = number;
export type WinReason = "horizontal" | "vertical" | "diagonal" | "block" | "lockout";
export type GameResult =
  | { readonly status: "playing" }
  | {
      readonly status: "win";
      readonly winner: Player;
      readonly reason: WinReason;
      readonly cells: readonly number[];
    }
  | { readonly status: "draw"; readonly reason: "full-board" | "no-legal-moves" };
export interface GameState {
  readonly rules: Rules;
  readonly seed: string;
  readonly board: readonly TileIdentity[];
  readonly owners: readonly (0 | Player)[];
  readonly currentPlayer: Player;
  readonly lastMove: Move | null;
  readonly moves: readonly Move[];
  readonly result: GameResult;
}
export const DEFAULT_RULES: Rules = Object.freeze({
  size: 4,
  lineLength: 4,
  blockWidth: 2,
  blockHeight: 2,
  lockoutWins: true,
});
