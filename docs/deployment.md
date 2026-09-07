# Deployment

## GitHub Pages

The public project is `thedisciple/pairgrid`. In repository Settings → Pages, select **GitHub Actions** as the build source. The workflow validates TypeScript, the engine boundary, unit/component tests, the production build, and Chromium interactions before publishing the static artifact.

Vite's base is `/pairgrid/`. If the repository is renamed, change `apps/web/vite.config.ts`, the Playwright base URL, and public links together.

To create the repository in a fresh authenticated environment if it does not exist:

```sh
gh repo create pairgrid --public --source=. --remote=origin --description 'A generalized constraint-placement strategy game and computational playground for game theory, search and machine learning.'
gh api repos/thedisciple/pairgrid/pages --method POST --field build_type=workflow
git push -u origin main
```

## Companion ChatGPT Site

The companion is a portfolio explanation, not another game implementation. It links to the public source and embeds the canonical Pages URL. It owns no game rules or engine fork.

Content structure:

1. PairGrid introduction and immediate Play / Source links.
2. The A2 + B3 matching example, using canonical identifiers.
3. Spatial board versus rook-graph constraint structure.
4. Embedded canonical game with a direct-link fallback.
5. Future research: exact solver → rule-space experiments → MCTS → policy/value learning → GNN.
6. Engine boundary and independent-project acknowledgement.

Update and publish the companion through Sites when its narrative changes. GitHub Pages updates automatically from `main`; the embed therefore follows canonical gameplay updates. Site account metadata and credentials are not part of the public source repository. A copy of the original landing page source is retained under `docs/companion/` for portability; it contains only narrative content and an iframe.
