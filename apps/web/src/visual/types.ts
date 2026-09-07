export interface CrestDescriptor {
  readonly sides: number;
  readonly rotation: number;
  readonly bands: number;
  readonly hue: number;
  readonly points: string;
}
export interface SigilDescriptor {
  readonly cells: readonly { readonly x: number; readonly y: number }[];
}
export interface VisualTheme {
  readonly id: "geometric" | "debug";
  readonly label: string;
  readonly graphics: boolean;
}
export function assertIndex(index: number): void {
  if (!Number.isSafeInteger(index) || index < 0)
    throw new Error("Attribute index must be a non-negative safe integer.");
}
export function semanticIds(tile: {
  readonly a: number;
  readonly b: number;
}): readonly [string, string] {
  return [`A${tile.a}`, `B${tile.b}`];
}
