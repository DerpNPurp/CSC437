import { css, html, shadow } from "@unbndl/html";
import { createViewModel, fromAttributes } from "@unbndl/view";
import { Store, fromStore } from "@unbndl/store";
import { Game } from "server/models";
import { Model } from "../model.ts";

type GameMode = "view" | "edit";

interface GameViewModel {
  gameId?: string;
  game?: Game;
  mode: GameMode;
}

export class GameViewElement extends HTMLElement {
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
    h1 {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 400;
      color: var(--color-accent);
      padding-bottom: var(--space-small);
      border-bottom: 2px solid var(--color-border);
    }
    section {
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      padding: var(--space-medium);
      display: flex;
      flex-direction: column;
      gap: var(--space-small);
    }
    svg.icon {
      display: inline;
      height: 2em;
      width: 2em;
      vertical-align: top;
      fill: currentColor;
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
    form {
      display: flex;
      flex-direction: column;
      gap: var(--space-small);
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.9rem;
    }
    input {
      padding: 0.4rem;
      border: 1px solid var(--color-border);
      font-family: var(--font-body);
      font-size: 1rem;
    }
    button {
      padding: 0.4rem 0.8rem;
      border: 1px solid var(--color-border);
      background: none;
      cursor: pointer;
      font-family: var(--font-body);
      align-self: flex-start;
    }
  `;

  viewModel = createViewModel<GameViewModel>({
    mode: "view" as GameMode
  })
    // withRenamed maps the kebab-case attribute "game-id" to the camelCase property gameId
    .withRenamed(fromAttributes<{ "game-id": string }>(this), { gameId: "game-id" })
    .with(fromStore<Model>(this), "game");

  constructor() {
    super();
    // delegate listens at the shadow root and fires when events bubble up from matching elements
    shadow(this)
      .styles(GameViewElement.styles)
      .delegate("#edit-btn", {
        click: () => {
          this.viewModel.set("mode", "edit");
        }
      })
      .delegate("form", {
        submit: (ev: Event) => this.submitForm(ev)
      });

    this.viewModel.createEffect(($) => {
      if ($.gameId) {
        Store.dispatch(this, ["game/request", { gameId: $.gameId }]);
      }
    });

    this.viewModel.createEffect(($) => {
      if ($.game) {
        const view =
          $.mode === "edit"
            ? GameViewElement.renderEdit($.game)
            : GameViewElement.renderView($.game);
        shadow(this).replace(view);
      }
    });
  }

  static renderView(game: Game) {
    const genreIconHref = `/icons/genres.svg#${game.genreIcon}`;
    const companyHref = `/app/companies/${encodeURIComponent(game.company)}`;
    const genreHref = `/app/genres/${encodeURIComponent(game.genre)}`;
    const ratingHref = `/app/ratings/${encodeURIComponent(game.rating)}`;
    return html`
      <main>
        <h1>${game.title}</h1>
        <section>
          <p><strong>Company:</strong> <a href=${companyHref}>${game.company}</a></p>
          <p><strong>Genre:</strong>
            <a href=${genreHref}>
              <svg class="icon"><use href=${genreIconHref}></use></svg>
              ${game.genre}
            </a>
          </p>
          <p><strong>Rating:</strong> <a href=${ratingHref}>${game.rating}</a></p>
          <p><strong>Platforms:</strong>
            ${game.platforms.map((p) => {
              const iconHref = `/icons/platforms.svg#${p.icon}`;
              const platformHref = `/app/platforms/${encodeURIComponent(p.name)}`;
              return html`
                <a href=${platformHref}>
                  <svg class="icon"><use href=${iconHref}></use></svg>
                  ${p.name}
                </a>
              `;
            })}
          </p>
          <button type="button" id="edit-btn">Edit</button>
        </section>
        <p class="back-link"><a href="/app">← Back to Home</a></p>
      </main>
    `;
  }

  static renderEdit(game: Game) {
    return html`
      <main>
        <h1>Edit: ${game.title}</h1>
        <section>
          <form>
            <label>
              Title
              <input name="title" value=${game.title} />
            </label>
            <label>
              Company
              <input name="company" value=${game.company} />
            </label>
            <label>
              Company URL
              <input name="companyHref" value=${game.companyHref} />
            </label>
            <label>
              Genre
              <input name="genre" value=${game.genre} />
            </label>
            <label>
              Genre URL
              <input name="genreHref" value=${game.genreHref} />
            </label>
            <label>
              Genre Icon
              <input name="genreIcon" value=${game.genreIcon} />
            </label>
            <label>
              Rating
              <input name="rating" value=${game.rating} />
            </label>
            <label>
              Rating URL
              <input name="ratingHref" value=${game.ratingHref} />
            </label>
            <button type="submit">Save</button>
          </form>
        </section>
        <p class="back-link"><a href="/app">← Back to Home</a></p>
      </main>
    `;
  }

  submitForm(ev: Event) {
    ev.preventDefault();

    const form = ev.target as HTMLFormElement;
    const formData = this.formDataToJSON(form) as Partial<Game>;
    const gameId = this.viewModel.$.gameId;
    const existingGame = this.viewModel.$.game;

    if (gameId && existingGame) {
      // spread existingGame first to keep fields not in the form like platforms, then overwrite with formData
      const updatedGame = { ...existingGame, ...formData };
      Store.dispatch(this, [
        "game/save",
        { gameId, game: updatedGame },
        {
          onSuccess: () => {
            this.viewModel.set("mode", "view");
          },
          onFailure: (error: Error) => console.log("ERROR:", error)
        }
      ]);
    }
  }

  formDataToJSON(form: HTMLFormElement): object {
    const inputs = Array.from(form.elements).filter(
      (el) => "name" in el
    ) as Array<HTMLInputElement>;

    const entries = inputs.map((el) => [el.name, el.value]);
    return Object.fromEntries(entries);
  }
}
