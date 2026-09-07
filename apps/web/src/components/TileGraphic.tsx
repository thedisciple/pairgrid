import { crestFor } from "../visual/glyphs/crest";
import { sigilFor } from "../visual/glyphs/sigil";
export function TileGraphic({
  a,
  b,
  part = "both",
}: {
  a: number;
  b: number;
  part?: "both" | "crest" | "sigil";
}) {
  const crest = crestFor(a),
    sigil = sigilFor(b);
  return (
    <svg className="tile-graphic" viewBox="0 0 100 100" aria-hidden="true">
      {part !== "sigil" &&
        Array.from({ length: crest.bands }, (_, band) => (
          <polygon
            key={band}
            points={crest.points}
            transform={`translate(50 50) scale(${1 - band * 0.09}) translate(-50 -50)`}
            fill={band === 0 ? `hsl(${crest.hue} 48% 94%)` : "none"}
            stroke={`hsl(${crest.hue} 45% 36%)`}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        ))}
      {part !== "crest" && (
        <g fill="currentColor">
          {sigil.cells.map(({ x, y }) => (
            <rect
              key={`${x}-${y}`}
              x={32 + x * 7.2}
              y={32 + y * 7.2}
              width="7.5"
              height="7.5"
              rx="1"
            />
          ))}
        </g>
      )}
    </svg>
  );
}
