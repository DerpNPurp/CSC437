import { css, html, shadow } from "@unbndl/html";
import { createViewModel, fromAttributes } from "@unbndl/view";
import { Store, fromStore } from "@unbndl/store";
import { Model, GameSummary } from "../model.ts";

interface FilteredViewModel {
  filterBy?: string;
  filterValue?: string;
  filteredGames?: GameSummary[];
}

export class FilteredViewElement extends HTMLElement {
  static styles = css`
    * {
      margin: 0;
      box-sizing: border-box;
    }
    main {
      padding: var(--space-large);
      display: flex;
      flex-direction: column;
      gap: var(--space-medium);
    }
    h2 {
      font-family: var(--font-body);
      font-weight: 700;
      color: var(--color-accent);
    }
    section {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      padding: var(--space-medium);
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
    .back-link {
      margin-top: var(--space-small);
    }
    .back-link a {
      font-size: 0.85rem;
      color: var(--color-text);
      opacity: 0.6;
    }
    .back-link a:hover {
      opacity: 1;
    }
  `;

  viewModel = createViewModel<FilteredViewModel>({})
    .withRenamed(
      fromAttributes<{ "filter-by": string; "filter-value": string }>(this),
      { filterBy: "filter-by", filterValue: "filter-value" }
    )
    .with(fromStore<Model>(this), "filteredGames");

  constructor() {
    super();
    shadow(this).styles(FilteredViewElement.styles);

    this.viewModel.createEffect(($) => {
      if ($.filterBy && $.filterValue) {
        Store.dispatch(this, [
          "games/filter-request",
          { filterBy: $.filterBy, value: $.filterValue }
        ]);
      }
    });

    this.viewModel.createEffect(($) => {
      if ($.filteredGames !== undefined) {
        shadow(this).replace(FilteredViewElement.render($.filterBy || "", $.filterValue || "", $.filteredGames));
      }
    });
  }

  static render(filterBy: string, filterValue: string, games: GameSummary[]) {
    const label = filterBy.charAt(0).toUpperCase() + filterBy.slice(1);
    return html`
      <main>
        <h2>${label}: ${filterValue}</h2>
        <section>
          <ul>
            ${games.map((g) => {
              const href = `/app/games/${g._id}`;
              return html`<li><a href=${href}>${g.title} (${g.genre})</a></li>`;
            })}
          </ul>
        </section>
        <p class="back-link"><a href="/app">← Back to Home</a></p>
      </main>
    `;
  }
}
