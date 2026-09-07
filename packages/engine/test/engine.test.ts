import { describe, expect, it } from "vitest";
import {
  applyMove,
  createGame,
  DEFAULT_RULES,
  deserializeGame,
  generateBoard,
  getLegalMoves,
  getResult,
  serializeGame,
  type GameState,
  type Rules,
} from "../src/index";
import { findSpatialWin } from "../src/win";
const largePatterns: Rules = {
  size: 4,
  lineLength: 4,
  blockWidth: 4,
  blockHeight: 4,
  lockoutWins: true,
};
function position(
  owners: readonly (0 | 1 | 2)[],
  lastMove: number | null = null,
  rules: Rules = largePatterns,
): GameState {
  const base = createGame(rules, "test");
  return {
    ...base,
    board: Array.from({ length: 16 }, (_, i) => ({ a: Math.floor(i / 4), b: i % 4 })),
    owners,
    lastMove,
    moves: owners.flatMap((owner, i) => (owner ? [i] : [])),
  };
}
describe("board and rules", () => {
  it("is deterministic, including a fixed replay-v1 reference permutation", () => {
    expect(generateBoard(DEFAULT_RULES, "same")).toEqual(generateBoard(DEFAULT_RULES, "same"));
    expect(
      generateBoard(
        { ...DEFAULT_RULES, size: 2, lineLength: 2, blockWidth: 2, blockHeight: 2 },
        "reference",
      ),
    ).toMatchInlineSnapshot(`
      [
        {
          "a": 1,
          "b": 1,
        },
        {
          "a": 0,
          "b": 1,
        },
        {
          "a": 0,
          "b": 0,
        },
        {
          "a": 1,
          "b": 0,
        },
      ]
    `);
  });
  it("changes permutations across seeds", () => {
    expect(
      new Set(
        Array.from({ length: 30 }, (_, i) => JSON.stringify(generateBoard(DEFAULT_RULES, `${i}`))),
      ).size,
    ).toBe(30);
  });
  it.each([1, 3, 4, 5, 12, 20])("has exactly N² unique pairs for N=%i", (size) => {
    const board = generateBoard(
      { ...DEFAULT_RULES, size, lineLength: size, blockWidth: 1, blockHeight: 1 },
      "pairs",
    );
    expect(board).toHaveLength(size ** 2);
    expect(new Set(board.map((tile) => `${tile.a},${tile.b}`)).size).toBe(size ** 2);
    expect(
      board.every((tile) => tile.a >= 0 && tile.a < size && tile.b >= 0 && tile.b < size),
    ).toBe(true);
  });
  it("rejects invalid rules and seed types", () => {
    for (const size of [0, -1, 1.5, NaN, Infinity, 257])
      expect(() => createGame({ ...DEFAULT_RULES, size }, "x")).toThrow();
    for (const lineLength of [0, 5, 2.5])
      expect(() => createGame({ ...DEFAULT_RULES, lineLength }, "x")).toThrow();
    expect(() => createGame(DEFAULT_RULES, 12 as unknown as string)).toThrow();
  });
});
describe("moves and immutability", () => {
  it("allows any opening then only same A or B, excluding occupied cells", () => {
    const start = position(Array<0>(16).fill(0));
    expect(getLegalMoves(start)).toHaveLength(16);
    const next = applyMove(start, 5);
    expect(getLegalMoves(next)).toEqual([1, 4, 6, 7, 9, 13]);
    expect(start.owners[5]).toBe(0);
    expect(next.currentPlayer).toBe(2);
    expect(applyMove(next, 1).currentPlayer).toBe(1);
  });
  it("rejects occupied, nonmatching, fractional and out-of-range moves", () => {
    const next = applyMove(position(Array<0>(16).fill(0)), 5);
    for (const move of [5, 0, -1, 16, 1.5, NaN])
      expect(() => applyMove(next, move)).toThrow("Illegal move");
  });
  it("freezes nested engine-owned state and does not freeze caller rules", () => {
    const rules = { ...DEFAULT_RULES };
    const state = createGame(rules, "immutable");
    rules.size = 8;
    expect(state.rules.size).toBe(4);
    expect(() => ((state.owners as number[])[0] = 2)).toThrow();
    expect(() => ((state.board[0] as { a: number }).a = 999)).toThrow();
  });
});
describe("spatial wins", () => {
  it.each([
    ["horizontal", [4, 5, 6, 7]],
    ["vertical", [2, 6, 10, 14]],
    ["diagonal", [0, 5, 10, 15]],
    ["diagonal", [3, 6, 9, 12]],
    ["block", [5, 6, 9, 10]],
  ] as const)("detects %s including off-origin patterns", (reason, cells) => {
    const owners: (0 | 1 | 2)[] = Array<0>(16).fill(0);
    cells.slice(0, -1).forEach((cell) => (owners[cell] = 1));
    const next = applyMove(position(owners, null, DEFAULT_RULES), cells[cells.length - 1]!);
    expect(getResult(next)).toEqual({ status: "win", winner: 1, reason, cells: [...cells] });
    expect(getLegalMoves(next)).toEqual([]);
    expect(() => applyMove(next, 0)).toThrow("Game is over");
  });
  it("supports shorter lines and non-square rectangles without rotating dimensions", () => {
    const owners: (0 | 1 | 2)[] = Array<0>(25).fill(0);
    [6, 7, 8].forEach((cell) => (owners[cell] = 2));
    expect(findSpatialWin({ ...DEFAULT_RULES, size: 5, lineLength: 3 }, owners, 8, 2)?.reason).toBe(
      "horizontal",
    );
    [11, 12, 13].forEach((cell) => (owners[cell] = 2));
    expect(
      findSpatialWin(
        { ...DEFAULT_RULES, size: 5, lineLength: 5, blockWidth: 3, blockHeight: 2 },
        owners,
        13,
        2,
      )?.reason,
    ).toBe("block");
  });
  it("never wraps row boundaries or accepts noncontiguous lines", () => {
    const owners: (0 | 1 | 2)[] = Array<0>(16).fill(0);
    [2, 3, 4, 5].forEach((cell) => (owners[cell] = 1));
    expect(findSpatialWin(DEFAULT_RULES, owners, 5, 1)).toBeNull();
  });
});
describe("terminal precedence and replay", () => {
  it("locks out the next player only when empty tiles remain", () => {
    const owners: (0 | 1 | 2)[] = Array<0>(16).fill(0);
    [1, 2, 3, 4, 8, 12].forEach((cell, i) => (owners[cell] = i % 2 ? 1 : 2));
    const start = position(owners);
    expect(applyMove(start, 0).result).toEqual({
      status: "win",
      winner: 1,
      reason: "lockout",
      cells: [0],
    });
    expect(
      applyMove({ ...start, rules: { ...largePatterns, lockoutWins: false } }, 0).result,
    ).toEqual({ status: "draw", reason: "no-legal-moves" });
  });
  it("spatial wins take precedence over lockout", () => {
    const owners: (0 | 1 | 2)[] = [0, 1, 1, 1, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0];
    expect(applyMove(position(owners), 0).result).toMatchObject({
      status: "win",
      reason: "horizontal",
    });
  });
  it("draws on a full board without another winning pattern", () => {
    const owners: (0 | 1 | 2)[] = [1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0];
    expect(applyMove(position(owners, 11), 15).result).toEqual({
      status: "draw",
      reason: "full-board",
    });
  });
  it("spatial wins take precedence over a full-board draw", () => {
    const owners: (0 | 1 | 2)[] = [1, 2, 1, 2, 2, 1, 2, 1, 1, 2, 2, 2, 1, 1, 1, 0];
    expect(applyMove(position(owners, 11), 15).result).toMatchObject({
      status: "win",
      reason: "horizontal",
    });
  });
  it("replays complete reachable games with identical states and outcomes", () => {
    for (let seed = 0; seed < 100; seed++) {
      let state = createGame(DEFAULT_RULES, `play-${seed}`);
      while (state.result.status === "playing") {
        const legal = getLegalMoves(state);
        state = applyMove(state, legal[(seed + state.moves.length) % legal.length]!);
        expect(deserializeGame(serializeGame(state))).toEqual(state);
      }
      expect(state.moves.length).toBeLessThanOrEqual(16);
    }
  });
  it("rejects tampered and unsupported replay data", () => {
    for (const value of [
      null,
      {},
      { version: 2, seed: "", moves: [] },
      { version: 1, seed: "", rules: DEFAULT_RULES, moves: [0, 0] },
      { version: 1, seed: "", rules: DEFAULT_RULES, moves: ["0"] },
    ])
      expect(() => deserializeGame(JSON.stringify(value))).toThrow();
  });
});
