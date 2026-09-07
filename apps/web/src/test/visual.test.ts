import { expect, it } from "vitest";
import { crestFor } from "../visual/glyphs/crest";
import { sigilFor } from "../visual/glyphs/sigil";
import { semanticIds } from "../visual/types";
import { geometric } from "../visual/themes/geometric";
import { debug } from "../visual/themes/debug";
it("maps IDs deterministically, including indices beyond a finite icon library", () => {
  for (const id of [0, 1, 11, 12, 128, 50000, Number.MAX_SAFE_INTEGER]) {
    expect(crestFor(id)).toEqual(crestFor(id));
    expect(sigilFor(id)).toEqual(sigilFor(id));
    expect(crestFor(id).points).not.toContain("NaN");
    expect(sigilFor(id).cells.length).toBeGreaterThan(0);
  }
});
it("distinguishes twelve nearby attributes by geometry alone", () => {
  const crests = Array.from({ length: 12 }, (_, i) => {
    const { points, bands } = crestFor(i);
    return JSON.stringify({ points, bands });
  });
  const sigils = Array.from({ length: 12 }, (_, i) => JSON.stringify(sigilFor(i)));
  expect(new Set(crests).size).toBe(12);
  expect(new Set(sigils).size).toBe(12);
});
it("retains canonical semantic labels independent of theme or graphics", () => {
  expect(semanticIds({ a: 3, b: 7 })).toEqual(["A3", "B7"]);
  expect([geometric.id, debug.id]).toEqual(["geometric", "debug"]);
  expect(debug.graphics).toBe(false);
});
it("validates presentation inputs", () => {
  for (const index of [-1, 0.5, NaN, Infinity]) {
    expect(() => crestFor(index)).toThrow();
    expect(() => sigilFor(index)).toThrow();
  }
});
