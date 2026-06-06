import { css, html, shadow } from "@unbndl/html";
import { createViewModel, fromAttributes } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";

interface Platform {
  name: string;
  href: string;
  icon: string;
}

interface GameData {
  company: string;
  companyHref: string;
  genre: string;
  genreHref: string;
  genreIcon: string;
  rating: string;
  ratingHref: string;
  platforms: Platform[];
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
  `;

  viewModel = createViewModel({
    authenticated: false,
    token: undefined as string | undefined,
    gameId: undefined as string | undefined
  }).withRenamed(
    fromAttributes<{ "game-id": string }>(this),
    { gameId: "game-id" }
  ).with(fromAuth(this), "authenticated", "token");

  constructor() {
    super();
    shadow(this).styles(GameViewElement.styles);

    this.viewModel.createEffect(($) => {
      if ($.authenticated && $.token && $.gameId) {
        fetch(`/api/games/${$.gameId}`, {
          headers: { Authorization: `Bearer ${$.token}` }
        })
          .then((res) => {
            if (res.status !== 200) throw `HTTP ${res.status}`;
            return res.json();
          })
          .then((game: GameData) => {
            shadow(this).replace(GameViewElement.render(game));
          })
          .catch((err) => console.log("Could not fetch game:", err));
      }
    });
  }

  static render(game: GameData) {
    const genreIconHref = `/icons/genres.svg#${game.genreIcon}`;
    return html`
      <main>
        <h1>${game.company}</h1>
        <section>
          <p><strong>Company:</strong> <a href=${game.companyHref}>${game.company}</a></p>
          <p><strong>Genre:</strong>
            <a href=${game.genreHref}>
              <svg class="icon"><use href=${genreIconHref}></use></svg>
              ${game.genre}
            </a>
          </p>
          <p><strong>Rating:</strong> <a href=${game.ratingHref}>${game.rating}</a></p>
          <p><strong>Platforms:</strong>
            ${game.platforms.map((p) => {
              const iconHref = `/icons/platforms.svg#${p.icon}`;
              return html`
                <a href=${p.href}>
                  <svg class="icon"><use href=${iconHref}></use></svg>
                  ${p.name}
                </a>
              `;
            })}
          </p>
        </section>
        <p class="back-link"><a href="/app">← Back to Home</a></p>
      </main>
    `;
  }
}
