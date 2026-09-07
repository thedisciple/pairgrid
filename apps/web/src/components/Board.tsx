import type { GameState } from "@pairgrid/engine";
import type { VisualTheme } from "../visual/types";
import { semanticIds } from "../visual/types";
import { TileGraphic } from "./TileGraphic";
export function moveExplanation(state: GameState, index: number): string {
  if (state.lastMove === null) return "Any tile is legal";
  const tile = state.board[index]!,
    previous = state.board[state.lastMove]!;
  return [
    tile.a === previous.a ? `matches A${previous.a}` : "",
    tile.b === previous.b ? `matches B${previous.b}` : "",
  ]
    .filter(Boolean)
    .join(" and ");
}
export function Board({
  state,
  legal,
  onMove,
  showIds,
  theme,
}: {
  state: GameState;
  legal: readonly number[];
  onMove: (move: number) => void;
  showIds: boolean;
  theme: VisualTheme;
}) {
  const won = state.result.status === "win" ? state.result.cells : [];
  return (
    <div
      className="board"
      style={{ gridTemplateColumns: `repeat(${state.rules.size}, 1fr)` }}
      aria-label="Game board"
    >
      {state.board.map((tile, index) => {
        const owner = state.owners[index]!,
          available = legal.includes(index),
          ids = semanticIds(tile);
        const explanation = available ? moveExplanation(state, index) : "";
        return (
          <button
            key={index}
            type="button"
            className={`tile ${available ? "legal" : "unavailable"} ${owner ? `owned player-${owner}` : ""} ${won.includes(index) ? "winning" : ""} ${state.lastMove === index ? "last" : ""}`}
            aria-disabled={!available}
            onClick={() => {
              if (available) onMove(index);
            }}
            aria-label={`Row ${Math.floor(index / state.rules.size) + 1}, column ${(index % state.rules.size) + 1}. Tile ${ids.join(" ")}, ${owner ? `owned by Player ${owner}` : available ? `legal move, ${explanation}` : "unavailable"}${state.lastMove === index ? ", previous tile" : ""}`}
            title={owner ? `Player ${owner}` : available ? explanation : "Not a legal move"}
          >
            <span className="cell-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            {theme.graphics ? (
              <TileGraphic a={tile.a} b={tile.b} />
            ) : (
              <span className="debug-ids">
                {ids[0]}
                <br />
                {ids[1]}
              </span>
            )}
            {showIds && theme.graphics && <span className="semantic-ids">{ids.join(" · ")}</span>}
            {owner ? (
              <span className="owner">P{owner}</span>
            ) : (
              available && <span className="legal-dot" aria-hidden="true" />
            )}
            {state.lastMove === index && <span className="last-label">LAST</span>}
          </button>
        );
      })}
    </div>
  );
}
