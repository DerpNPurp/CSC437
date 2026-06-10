import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { Store, fromStore } from "@unbndl/store";
import { Model, GameSummary } from "../model.ts";

export class HomeViewElement extends HTMLElement {
  static styles = css`
    * {
      margin: 0;
      box-sizing: border-box;
    }
    main {
      padding: var(--space-large);
      display: grid;
      /* games takes up the bigger left chunk, sidebar takes the right */
      grid-template-columns: 2fr 1fr;
      gap: var(--space-medium);
      align-items: start;
    }
    /* stack the 4 smaller sections on the right */
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: var(--space-medium);
    }
    @media (max-width: 700px) {
      main {
        grid-template-columns: 1fr;
      }
    }
    section {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      padding: var(--space-medium);
      display: flex;
      flex-direction: column;
      gap: var(--space-small);
    }
    h2 {
      font-family: var(--font-body);
      font-weight: 700;
      color: var(--color-accent);
      margin-bottom: var(--space-small);
    }
    ul {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-small);
    }
    a {
      color: var(--color-accent);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    svg.icon {
      display: inline;
      height: 1.5em;
      width: 1.5em;
      vertical-align: middle;
      fill: currentColor;
    }
    .cat-gif {
      width: 300px;
      height: auto;
      display: block;
      margin: var(--space-medium) auto 0;
    }
    div {
      display: flex;
      flex-direction: column;
    }
  `;

  viewModel = createViewModel({
    games: undefined as GameSummary[] | undefined
  }).with(fromStore<Model>(this), "games");

  constructor() {
    super();
    shadow(this).styles(HomeViewElement.styles);

    this.viewModel.createEffect(($) => {
      if ($.games) {
        shadow(this).replace(HomeViewElement.render($.games));
      }
    });
  }

  connectedCallback() {
    Store.dispatch(this, ["games/request", {}]);
  }

  static render(games: GameSummary[]) {
    const companies = [...new Set(games.map((g) => g.company))];

    // Map deduplicates by genre name, need Map instead of Set to keep the icon info too
    const genres = [
      ...new Map(games.map((g) => [g.genre, { name: g.genre, icon: g.genreIcon }])).values()
    ];

    // platforms are nested so flatMap first to flatten them all out, then Map to deduplicate by name
    const platforms = [
      ...new Map(
        games.flatMap((g) => g.platforms.map((p) => [p.name, p]))
      ).values()
    ];
    const ratings = [...new Set(games.map((g) => g.rating))];

    return html`
      <main>
        <!-- games on the left by itself -->
        <div>
          <section>
            <h2>Games</h2>
            <ul>
              ${games.map((g) => {
                const href = `/app/games/${g._id}`;
                return html`<li><a href=${href}>${g.title} (${g.genre})</a></li>`;
              })}
            </ul>
          </section>
          <img class="cat-gif" src="/yapapa-cat.gif" alt="cat" />
        </div>

        <!-- everything else stacked on the right -->
        <div class="sidebar">
          <section>
            <h2>Companies</h2>
            <ul>
              ${companies.map((c) => {
                const href = `/app/companies/${encodeURIComponent(c)}`;
                return html`<li><a href=${href}>${c}</a></li>`;
              })}
            </ul>
          </section>
          <section>
            <h2>Genres</h2>
            <ul>
              ${genres.map(({ name, icon }) => {
                const href = `/app/genres/${encodeURIComponent(name)}`;
                const iconHref = `/icons/genres.svg#${icon}`;
                return html`<li><a href=${href}><svg class="icon"><use href=${iconHref}></use></svg> ${name}</a></li>`;
              })}
            </ul>
          </section>
          <section>
            <h2>Platforms</h2>
            <ul>
              ${platforms.map((p) => {
                const href = `/app/platforms/${encodeURIComponent(p.name)}`;
                const iconHref = `/icons/platforms.svg#${p.icon}`;
                return html`<li><a href=${href}><svg class="icon"><use href=${iconHref}></use></svg> ${p.name}</a></li>`;
              })}
            </ul>
          </section>
          <section>
            <h2>Ratings</h2>
            <ul>
              ${ratings.map((r) => {
                const href = `/app/ratings/${encodeURIComponent(r)}`;
                return html`<li><a href=${href}>${r}</a></li>`;
              })}
            </ul>
          </section>
        </div>
      </main>
    `;
  }
}
