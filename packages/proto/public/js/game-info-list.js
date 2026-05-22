import { html, css, shadow } from "@unbndl/html";
import { createViewModel, fromAttributes } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";

function renderPlatform(p) {
  const iconHref = `/icons/platforms.svg#${p.icon}`;
  return html`<a href=${p.href}><svg class="icon"><use href=${iconHref}></use></svg> ${p.name}</a>`;
}

export class GameInfoListElement extends HTMLElement {
  static styles = css`
    svg.icon {
      display: inline;
      height: 2em;
      width: 2em;
      vertical-align: top;
      fill: currentColor;
    }
    a {
      color: var(--color-accent);
    }
  `;

  viewModel = createViewModel({
    authenticated: false,
    token: undefined,
    gameData: null
  }).with(fromAttributes(this), "src")
    .with(fromAuth(this), "authenticated", "token");

  get authorization() {
    const $ = this.viewModel.toObject();
    if ($.authenticated)
      return { Authorization: `Bearer ${$.token}` };
    else return {};
  }

  constructor() {
    super();
    shadow(this).styles(GameInfoListElement.styles);

    this.viewModel.createEffect(($) => {
      if ($.authenticated && $.src) {
        this.hydrate($.src).then((data) => {
          if (data) {
            const view = GameInfoListElement.render(data);
            shadow(this).replace(view);
          }
        });
      }
    });
  }

  hydrate(src) {
    return fetch(src, { headers: this.authorization })
      .then((response) => {
        if (response.status !== 200)
          throw `HTTP Status ${response.status}`;
        else return response.json();
      })
      .catch((error) => {
        console.log(`Could not fetch ${src}:`, error);
      });
  }

  static render(data) {
    const { company, companyHref, genre, genreHref, genreIcon, rating, ratingHref, platforms } = data;
    const genreIconHref = `/icons/genres.svg#${genreIcon}`;
    return html`
      <game-info>
        <span slot="company"><a href=${companyHref}>${company}</a></span>
        <span slot="genre"><a href=${genreHref}><svg class="icon"><use href=${genreIconHref}></use></svg> ${genre}</a></span>
        <span slot="rating"><a href=${ratingHref}>${rating}</a></span>
        <span slot="platforms">${platforms.map(renderPlatform)}</span>
      </game-info>
    `;
  }
}
