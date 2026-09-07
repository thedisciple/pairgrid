# Engine contract and v0.1 decisions

## Semantics

- Two players, numbered 1 and 2; Player 1 starts.
- Every ordered pair `(a,b)` occurs once. Spatial cell order is independent of attribute order.
- Opening move unrestricted; subsequent moves match the previous A or B and must be unoccupied.
- Spatial win first, then full-board draw, then lockout if unoccupied tiles remain.
- Disabling lockout wins produces a no-legal-moves draw; there are no passes.
- Lines and blocks are contiguous and do not wrap. Rectangular dimensions are not rotated automatically.
- `currentPlayer` always names the next player after a move, even in a terminal state. Read `result.winner` for the winner.
- Winning `cells` describe one completed pattern. For lockout they identify the last move.

## Determinism and serialization

Replay v1 uses FNV-1a over JavaScript UTF-16 seed code units, Mulberry32 random values, and descending Fisher–Yates shuffling. Initial identity order is `a * N + b`. Arithmetic uses explicit 32-bit operations. A fixed reference-permutation test protects the format from accidental RNG changes.

Replay JSON contains only version, rules, seed, and zero-based row-major moves. Deserialization validates the rules, creates the same starting state, and checks every move, including terminal-state rejection. Derived data is regenerated. Unknown fields are ignored rather than inserted into reconstructed state.

The exported structural types are not an authentication boundary: `applyMove` expects an engine-created state, not a forged object. Use `deserializeGame` for external replay data. A server accepting arbitrary JSON in future should also bound payload bytes before parsing.

## Representation and limits

Rules require integer size 1–256 and each winning dimension from 1 through size. The size bound limits accidental allocation; there is no fixed four-by-four assumption in move or win code. Seeds are strings. The UI selects the compact default only. Attribute presentation accepts non-negative safe integers and remains outside the engine.

Returned game objects, rules, boards, tile identities, ownership, history, and results are frozen. Move generation returns a fresh array. Each successor shares the same frozen board and copies ownership and history. Spatial checks inspect only patterns containing the newly claimed cell, relying on a valid nonterminal predecessor.

This representation is intentionally straightforward for solver prototyping. Repeated allocations and scanning are not a performance claim; a future exact solver should benchmark before choosing bitsets, transposition keys, or incremental pattern indexes.
