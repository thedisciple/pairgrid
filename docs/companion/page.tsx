const play = "https://thedisciple.github.io/pairgrid/";
const source = "https://github.com/thedisciple/pairgrid";
export default function Page() {
  return (
    <main>
      <header>
        <a className="brand" href={source}>
          PairGrid<span>v0.1</span>
        </a>
        <a href={play}>Play the game ↗</a>
      </header>
      <section className="hero">
        <p className="eyebrow">INDEPENDENT GAME / COMPUTATIONAL PLAYGROUND</p>
        <h1>
          A small board.
          <br />A different kind
          <br />
          of connection.
        </h1>
        <div className="hero-bottom">
          <p>
            Every tile has two attributes. Every move limits the next. PairGrid separates{" "}
            <strong>where you play</strong> from <strong>where you can go</strong>.
          </p>
          <nav>
            <a className="button" href={play}>
              Play PairGrid ↗
            </a>
            <a className="text-link" href={source}>
              Explore the source ↗
            </a>
          </nav>
        </div>
        <span className="hero-note">Local two-player · Free to play · No sign-in</span>
      </section>
      <section className="model">
        <div>
          <p className="eyebrow">01 / THE CONSTRAINT</p>
          <h2>
            Match one.
            <br />
            Change everything.
          </h2>
          <p>
            Choose a tile with attributes A2 and B3. Your opponent must choose an unclaimed tile
            with the same A or the same B.
          </p>
          <p>
            Crests and sigils help you see those relationships. The engine knows only numeric IDs.
          </p>
        </div>
        <div className="equation">
          <span>PREVIOUS TILE</span>
          <strong>
            A2 <i>+</i> B3
          </strong>
          <div className="rule">
            next.a == A2
            <br />
            <em>OR</em>
            <br />
            next.b == B3
          </div>
          <small>One shared attribute is enough.</small>
        </div>
      </section>
      <section className="structures">
        <div>
          <p className="eyebrow">02 / TWO STRUCTURES</p>
          <h2>Position meets possibility.</h2>
        </div>
        <article>
          <h3>The spatial board</h3>
          <p>
            A seeded shuffle places every A×B pair once on a square grid. Claim a line or a 2×2
            square to win.
          </p>
        </article>
        <article>
          <h3>The constraint graph</h3>
          <p>
            Tiles connect when they share A or B: the rook graph K<sub>N</sub> □ K<sub>N</sub>. A
            move narrows the opponent’s choices. With tiles still free, leaving no legal move also
            wins.
          </p>
        </article>
      </section>
      <section className="play-section">
        <div className="section-top">
          <div>
            <p className="eyebrow">03 / PLAYABLE NOW</p>
            <h2>Let the board teach you.</h2>
          </div>
          <a href={play}>Open full-size ↗</a>
        </div>
        <p>
          Pick any tile. Then pass the next move to a friend. The highlighted choices show the rule
          in action.
        </p>
        <iframe
          src={play}
          title="Play PairGrid, the canonical GitHub Pages application"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <p className="embed-note">
          This is the GitHub Pages application, embedded directly. <a href={play}>Open the game</a>{" "}
          if your browser blocks the embedded view.
        </p>
      </section>
      <section className="research">
        <p className="eyebrow">04 / THE RESEARCH DIRECTION</p>
        <h2>
          Small enough to solve.
          <br />
          Rich enough to study.
        </h2>
        <p>
          Different shuffles preserve the same attribute graph but change its relationship to
          spatial winning patterns. Which boards favor the first player? How do rule choices change
          the game?
        </p>
        <div className="roadmap">
          Exact solver <span>→</span> Rule-space experiments <span>→</span> MCTS <span>→</span>{" "}
          Policy/value learning <span>→</span> GNN
        </div>
        <p className="scope">
          Future work, not current capabilities. v0.1 provides the deterministic engine, tested
          replay format, procedural visuals, and playable 4×4 starting point.
        </p>
      </section>
      <section className="engineering">
        <div>
          <p className="eyebrow">BUILT TO BE INSPECTED</p>
          <h2>A clean boundary.</h2>
        </div>
        <div>
          <code>apps/web → packages/engine</code>
          <p>
            The React interface maps semantic IDs to visuals. The TypeScript engine has no React,
            DOM, color, or SVG dependencies, so future search code can reuse the same rules.
          </p>
          <a href={source}>Read the code and tests ↗</a>
        </div>
      </section>
      <footer>
        <p>
          PairGrid is an independent implementation and research project inspired by abstract
          constraint-placement games, including Okiya and Kamon by Bruno Cathala. Not affiliated
          with or endorsed by their designer or publishers. No original artwork or copyrighted game
          assets are used.
        </p>
        <nav>
          <a href={play}>Play ↗</a>
          <a href={source}>Source ↗</a>
          <a href={`${source}/blob/main/LICENSE`}>MIT license ↗</a>
        </nav>
      </footer>
    </main>
  );
}
