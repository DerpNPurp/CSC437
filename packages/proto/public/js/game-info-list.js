import { html, shadow } from "@unbndl/html";

function renderPlatform(p) {
  const iconHref = `/icons/platforms.svg#${p.icon}`;
  return html`<a href=${p.href}><svg class="icon"><use href=${iconHref}></use></svg> ${p.name}</a>`;
}

export class GameInfoListElement extends HTMLElement {
  constructor() {
    super();
    shadow(this);
  }

  static observedAttributes = ["src"];

  attributeChangedCallback(name, _, newValue) {
    if (name === "src") {
      this.hydrate(newValue).then((data) => {
        const view = GameInfoListElement.render(data);
        shadow(this).replace(view);
      });
    }
  }

  hydrate(src) {
    return fetch(src)
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
