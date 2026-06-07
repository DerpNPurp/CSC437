import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";

type HeaderState = { authenticated: boolean; username: string | undefined };

export class HeaderElement extends HTMLElement {
  static styles = css`
    * {
      margin: 0;
      box-sizing: border-box;
    }
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
    .dark-toggle {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--color-text-inverted);
      font-size: 0.85rem;
      cursor: pointer;
      border-left: 2px solid rgba(250, 249, 246, 0.3);
      padding-left: var(--space-small);
    }
  `;

  viewModel = createViewModel({
    authenticated: false,
    username: undefined as string | undefined
  }).with(fromAuth(this), "authenticated", "username");

  view = html`
    <header>
      <h1><a href="/app">Game Database</a></h1>
      <nav class=${($: HeaderState) => $.authenticated ? "logged-in" : "logged-out"}>
        <p>Hello, ${($: HeaderState) => $.username || "traveler"}</p>
        <label class="dark-toggle">
          <input type="checkbox" id="dark-toggle" autocomplete="off" />
          Dark mode
        </label>
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
      .styles(HeaderElement.styles)
      .replace(this.viewModel.render(this.view))
      .delegate(".when-signed-in button", {
        click: () => this.signout()
      })
      .delegate("#dark-toggle", {
        change: (ev: Event) => {
          const checked = (ev.target as HTMLInputElement).checked;
          document.body.classList.toggle("dark-mode", checked);
        }
      });
  }

  signout() {
    // same as login-form, bubble auth:message up to auth-provider to handle clearing the token
    const event = new CustomEvent("auth:message", {
      bubbles: true,
      composed: true,
      detail: ["auth/signout"]
    });
    this.dispatchEvent(event);
  }
}
