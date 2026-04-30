import { html, css, shadow } from "@unbndl/html";
import reset from "./styles/reset.css.js";

export class GameInfoElement extends HTMLElement {
  static template = html`
    <template>
      <section>
        <p><strong>Company:</strong> <slot name="company"></slot></p>
        <p><strong>Genre:</strong> <slot name="genre"></slot></p>
        <p><strong>Rating:</strong> <slot name="rating"></slot></p>
        <p><strong>Platforms:</strong> <slot name="platforms"></slot></p>
      </section>
    </template>
  `;

  constructor() {
    super();
    shadow(this)
      .template(GameInfoElement.template)
      .styles(reset.styles, GameInfoElement.styles);
  }

  static styles = css`
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
    }
  `;
}
