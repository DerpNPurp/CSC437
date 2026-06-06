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
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-medium);
    }
    @media (max-width: 650px) {
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
    return html`
      <main>
        <section>
          <h2>Games</h2>
          <ul>
            ${games.map((g) => {
              const href = `/app/games/${g._id}`;
              return html`<li><a href=${href}>${g.title} (${g.genre})</a></li>`;
            })}
          </ul>
        </section>
      </main>
    `;
  }
}
