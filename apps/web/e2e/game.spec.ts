import { expect, test } from "@playwright/test";
test("keyboard play, legal constraints, deterministic restart, themes, shuffle, terminal result", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  const tiles = page.getByLabel("Game board").getByRole("button");
  await expect(tiles).toHaveCount(16);
  const initialIds = await tiles.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("aria-label")),
  );
  await tiles.first().focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("Player 2's turn");
  await expect(page.locator('.tile[aria-disabled="false"]')).toHaveCount(6);
  const illegal = page.locator(".tile.unavailable:not(.owned)").first();
  await illegal.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("Player 2's turn");
  await page.getByLabel("Show IDs").check();
  await expect(page.locator(".semantic-ids")).toHaveCount(16);
  await page.getByLabel("Theme").selectOption("debug");
  await expect(page.locator(".board svg")).toHaveCount(0);
  await page.getByRole("button", { name: /New Game/ }).click();
  expect(
    await tiles.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("aria-label"))),
  ).toEqual(initialIds);
  for (let turn = 0; turn < 16; turn++) {
    const legal = page.locator('.tile[aria-disabled="false"]');
    if ((await legal.count()) === 0) break;
    await legal.first().click();
  }
  await expect(page.getByRole("status")).toContainText(/wins|drawn/);
  await page.getByRole("button", { name: /Shuffle/ }).click();
  await expect(page.getByRole("status")).toContainText("Player 1's turn");
  await expect(page).toHaveURL(/seed=/);
  const shuffled = await tiles.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("aria-label")),
  );
  expect(shuffled).not.toEqual(initialIds);
  await page.reload();
  expect(
    await tiles.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("aria-label"))),
  ).toEqual(shuffled);
  expect(errors).toEqual([]);
});
test("mobile board remains square, fits viewport, and plays", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const board = page.getByLabel("Game board");
  const box = await board.boundingBox();
  expect(box).not.toBeNull();
  expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await board.getByRole("button").first().click();
  await expect(page.getByRole("status")).toContainText("Player 2's turn");
  await expect(page.locator('.tile[aria-disabled="false"]')).toHaveCount(6);
});
