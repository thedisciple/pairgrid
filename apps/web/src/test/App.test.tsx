// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
afterEach(cleanup);
it("teaches the first move and maintains semantic, keyboard-accessible ownership", async () => {
  const user = userEvent.setup();
  render(<App />);
  const board = screen.getByLabelText("Game board");
  const tiles = within(board).getAllByRole("button");
  expect(tiles).toHaveLength(16);
  expect(tiles.every((tile) => tile.getAttribute("aria-disabled") === "false")).toBe(true);
  tiles[0]!.focus();
  await user.keyboard("{Enter}");
  expect(screen.getByRole("status").textContent).toContain("Player 2's turn");
  expect(screen.getByText("Match either attribute.")).toBeTruthy();
  expect(tiles[0]!.getAttribute("aria-label")).toContain("owned by Player 1");
  expect(tiles.filter((tile) => tile.getAttribute("aria-disabled") === "false")).toHaveLength(6);
  await user.click(tiles[0]!);
  expect(screen.getByRole("status").textContent).toContain("Player 2's turn");
  await user.click(screen.getByLabelText("Show IDs"));
  expect(board.querySelectorAll(".semantic-ids")).toHaveLength(16);
  await user.selectOptions(screen.getByLabelText("Theme"), "debug");
  expect(board.querySelectorAll("svg")).toHaveLength(0);
  expect(board.querySelectorAll(".debug-ids")).toHaveLength(16);
  await user.click(screen.getByRole("button", { name: /New Game/ }));
  expect(screen.getByRole("status").textContent).toContain("Player 1's turn");
});
it("can play through a terminal result and restart", async () => {
  const user = userEvent.setup();
  render(<App />);
  const board = screen.getByLabelText("Game board");
  for (let i = 0; i < 16; i++) {
    const legal = within(board)
      .getAllByRole("button")
      .find((tile) => tile.getAttribute("aria-disabled") === "false");
    if (!legal) break;
    await user.click(legal);
  }
  expect(screen.getByRole("status").textContent).toMatch(/wins|drawn/);
  expect(
    within(board)
      .getAllByRole("button")
      .every((tile) => tile.getAttribute("aria-disabled") === "true"),
  ).toBe(true);
  await user.click(screen.getByRole("button", { name: /New Game/ }));
  expect(
    within(board)
      .getAllByRole("button")
      .filter((tile) => tile.getAttribute("aria-disabled") === "false"),
  ).toHaveLength(16);
});
