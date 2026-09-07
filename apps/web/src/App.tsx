import { useState } from "react";
import { applyMove, createGame, DEFAULT_RULES, getLegalMoves } from "@pairgrid/engine";
import { Board } from "./components/Board";
import { TileGraphic } from "./components/TileGraphic";
import { geometric } from "./visual/themes/geometric";
import { debug } from "./visual/themes/debug";
const initialSeed = new URLSearchParams(window.location.search).get("seed") ?? "pairgrid-001";
export default function App() {
  const [state, setState] = useState(() => createGame(DEFAULT_RULES, initialSeed));
  const [showIds, setShowIds] = useState(false);
  const [theme, setTheme] = useState(geometric);
  const legal = getLegalMoves(state),
    previous = state.lastMove === null ? null : state.board[state.lastMove]!;
  const result = state.result;
  const status =
    result.status === "win"
      ? `Player ${result.winner} wins`
      : result.status === "draw"
        ? "Game drawn"
        : `Player ${state.currentPlayer}'s turn`;
  function newSeed() {
    const seed = Array.from(crypto.getRandomValues(new Uint32Array(2)), (value) =>
      value.toString(36),
    ).join("-");
    const url = new URL(window.location.href);
    url.searchParams.set("seed", seed);
    history.replaceState(null, "", url);
    setState(createGame(DEFAULT_RULES, seed));
  }
  return (
    <main className="app-shell">
      <header className="masthead">
        <a
          className="brand"
          href="https://github.com/thedisciple/pairgrid"
          aria-label="PairGrid source on GitHub"
        >
          <span className="brand-mark" aria-hidden="true">
            ▦
          </span>{" "}
          PairGrid<span className="version">v0.1</span>
        </a>
        <span className="edition">A STUDY IN CONSTRAINTS</span>
        <a className="source-link" href="https://github.com/thedisciple/pairgrid">
          Source ↗
        </a>
      </header>
      <section className="intro">
        <div>
          <p className="eyebrow">TWO PLAYERS · ONE SHARED BOARD</p>
          <h1>Every move sets the next.</h1>
        </div>
        <p>
          Claim a tile. Your opponent must match its <strong>outer crest</strong> or{" "}
          <strong>center sigil</strong>. Make a line, a square, or leave no move.
        </p>
      </section>
      <section className="game-layout" aria-label="PairGrid game">
        <div className="board-area">
          <div className="board-heading">
            <span>
              THE SPATIAL BOARD <span className="muted">/ 4 × 4</span>
            </span>
            <span>
              MOVE{" "}
              {String(state.moves.length + (result.status === "playing" ? 1 : 0)).padStart(2, "0")}
            </span>
          </div>
          <Board
            state={state}
            legal={legal}
            showIds={showIds}
            theme={theme}
            onMove={(move) => setState((current) => applyMove(current, move))}
          />
          <div className="board-caption">
            <span>
              <i className="caption-dot" /> Available tile
            </span>
            <span>
              <b className="mini-owner p1">P1</b> Player 1 <b className="mini-owner p2">P2</b>{" "}
              Player 2
            </span>
          </div>
          <div className="toolbar">
            <label className="toggle">
              <input
                type="checkbox"
                checked={showIds}
                onChange={(event) => setShowIds(event.target.checked)}
              />{" "}
              Show IDs
            </label>
            <label className="theme-select">
              Theme{" "}
              <select
                value={theme.id}
                onChange={(event) => setTheme(event.target.value === "debug" ? debug : geometric)}
              >
                <option value="geometric">Geometric</option>
                <option value="debug">Debug IDs</option>
              </select>
            </label>
          </div>
        </div>
        <aside className="game-panel">
          <div
            className={`turn-banner player-${result.status === "win" ? result.winner : state.currentPlayer}`}
            role="status"
            aria-live="polite"
          >
            <span className="turn-symbol">
              {result.status === "playing"
                ? `P${state.currentPlayer}`
                : result.status === "win"
                  ? `P${result.winner}`
                  : "="}
            </span>
            <div>
              <span className="eyebrow">
                {result.status === "playing" ? "YOUR MOVE" : "RESULT"}
              </span>
              <h2>{status}</h2>
            </div>
          </div>
          {result.status !== "playing" ? (
            <div className="constraint-content result-content">
              <h3>
                {result.status === "win"
                  ? result.reason === "lockout"
                    ? "No way through."
                    : "Pattern complete."
                  : "A balanced board."}
              </h3>
              <p>
                {result.status === "win"
                  ? result.reason === "lockout"
                    ? "Unclaimed tiles remain, but none match the previous tile. The last player wins."
                    : `A ${result.reason} winning pattern is outlined on the board.`
                  : result.reason === "full-board"
                    ? "Every tile is claimed and neither player completed a winning pattern."
                    : "No matching move remains. Under these rules, lockout is a draw."}
              </p>
            </div>
          ) : (
            <div className="constraint-content">
              {previous ? (
                <>
                  <div className="previous-row">
                    <div className="previous-graphic">
                      {theme.graphics ? (
                        <TileGraphic {...previous} />
                      ) : (
                        <b>
                          A{previous.a}
                          <br />B{previous.b}
                        </b>
                      )}
                    </div>
                    <div>
                      <span className="eyebrow">PREVIOUS TILE</span>
                      <p>
                        A{previous.a} <span className="muted">+</span> B{previous.b}
                      </p>
                    </div>
                  </div>
                  <h3>Match either attribute.</h3>
                  <p className="panel-note">Your next tile must share one of these:</p>
                  <div className="attribute-options">
                    <div>
                      {theme.graphics && <TileGraphic {...previous} part="crest" />}
                      <b>A{previous.a}</b>
                      <span>Outer crest</span>
                    </div>
                    <em>OR</em>
                    <div>
                      {theme.graphics && <TileGraphic {...previous} part="sigil" />}
                      <b>B{previous.b}</b>
                      <span>Center sigil</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="eyebrow">THE OPENING MOVE</span>
                  <h3>The board is yours.</h3>
                  <p>
                    Choose any tile to begin. Its crest and sigil will decide where Player 2 can go.
                  </p>
                  <div className="opening-example">
                    <TileGraphic a={2} b={3} />
                    <span>
                      Same crest
                      <br />
                      <b>OR</b>
                      <br />
                      same sigil
                    </span>
                    <TileGraphic a={2} b={0} />
                  </div>
                </>
              )}
              <div className="move-count">
                <strong>{legal.length}</strong>
                <span>legal {legal.length === 1 ? "move" : "moves"} available</span>
                <span aria-hidden="true">↖</span>
              </div>
            </div>
          )}
          <div className="game-controls">
            <button
              className="primary-button"
              onClick={() => setState(createGame(DEFAULT_RULES, state.seed))}
            >
              New Game <span>↺</span>
            </button>
            <button className="secondary-button" onClick={newSeed}>
              Shuffle / New Seed <span>↗</span>
            </button>
            <div className="seed">
              <span>SEED</span>
              <code>{state.seed}</code>
            </div>
          </div>
        </aside>
      </section>
      <section className="winning-guide" aria-label="How to win">
        <div>
          <p className="eyebrow">THREE WAYS TO WIN</p>
          <h2>Connect. Cluster. Constrain.</h2>
        </div>
        <p>
          <b>01 / Line</b>Claim 4 in a row, column, or diagonal.
        </p>
        <p>
          <b>02 / Square</b>Claim a contiguous 2 × 2 block.
        </p>
        <p>
          <b>03 / Lockout</b>Leave your opponent no matching tile.
        </p>
      </section>
      <footer>
        <span>Spatial patterns. Relational moves.</span>
        <span>
          Independent strategy game & research playground ·{" "}
          <a href="https://github.com/thedisciple/pairgrid#the-model">Explore the model ↗</a>
        </span>
      </footer>
    </main>
  );
}
