import { css, html, shadow } from "@unbndl/html";

export class LoginFormElement extends HTMLElement {
  static template = html`<template>
    <form>
      <slot></slot>
      <button type="submit">
        <slot name="submit-label">Login</slot>
      </button>
    </form>
  </template>`;

  static styles = css`
    * {
      margin: 0;
      box-sizing: border-box;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    button[type="submit"] {
      align-self: flex-start;
      padding: 0.4rem 1rem;
      cursor: pointer;
    }
  `;

  constructor() {
    super();
    shadow(this)
      .template(LoginFormElement.template)
      .styles(LoginFormElement.styles)
      .listen({
        submit: (ev: Event) => this.submitLogin(ev, this.getAttribute("api") || "#")
      });
  }

  submitLogin(event: Event, endpoint: string) {
    event.preventDefault();
    const inputs = this.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
    const data: Record<string, string> = {};
    inputs.forEach((input) => {
      if (input.name) data[input.name] = input.value;
    });
    const method = "POST";
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify(data);
    fetch(endpoint, { method, headers, body })
      .then((res) => {
        if (res.status !== 200)
          throw `Form submission failed: Status ${res.status}`;
        return res.json();
      })
      .then((json) => {
        const { token } = json;
        // fire a custom event up to auth-provider to handle the token instead of doing it here
        // composed: true lets it cross shadow dom boundaries
        const customEvent = new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token, redirect: "/" }]
        });
        this.dispatchEvent(customEvent);
      });
  }
}
