import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { Auth, fromAuth } from "@unbndl/auth";
import reset from "./styles/reset.css.js";

export class HeaderElement extends HTMLElement {
  static styles = css`
    header {
      background-color: var(--color-background-header);
      color: var(--color-text-inverted);
      padding: var(--space-medium);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    h1 a {
      color: var(--color-text-inverted);
      text-decoration: none;
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 400;
    }
    nav {
      display: flex;
      align-items: center;
      gap: var(--space-small);
      border-left: 2px solid rgba(250, 249, 246, 0.3);
      padding-left: var(--space-small);
    }
    p {
      margin: 0;
    }
    a {
      color: var(--color-text-inverted);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      display: none;
    }
    .logged-in .when-signed-in,
    .logged-out .when-signed-out {
      display: block;
    }
    button {
      background: none;
      border: 1px solid var(--color-text-inverted);
      color: var(--color-text-inverted);
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      font-family: var(--font-body);
    }
  `;

  viewModel = createViewModel({
    authenticated: false
  }).with(fromAuth(this), "authenticated", "username");

  view = html`
    <header>
      <h1><a href="/index.html">Game Database</a></h1>
      <nav class=${($) => $.authenticated ? "logged-in" : "logged-out"}>
        <p>Hello, ${($) => $.username || "traveler"}</p>
        <menu>
          <li class="when-signed-in">
            <button>Sign Out</button>
          </li>
          <li class="when-signed-out">
            <a href="/login.html">Sign In</a>
          </li>
        </menu>
      </nav>
    </header>
  `;

  constructor() {
    super();
    shadow(this)
      .styles(reset.styles, HeaderElement.styles)
      .replace(this.viewModel.render(this.view))
      .delegate(".when-signed-in button", {
        click: () => this.signout()
      });
  }

  signout() {
    const customEvent = new CustomEvent("auth:message", {
      bubbles: true,
      composed: true,
      detail: ["auth/signout"]
    });
    this.dispatchEvent(customEvent);
  }
}
