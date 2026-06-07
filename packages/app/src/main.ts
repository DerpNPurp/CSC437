import { define, html } from "@unbndl/html";
import { Auth } from "@unbndl/auth";
import { Store } from "@unbndl/store";
import { BrowserHistory, Switch } from "@unbndl/switch";
import { Msg } from "./messages.ts";
import { Model, init } from "./model.ts";
import update, { Cmd } from "./update.ts";
import { HeaderElement } from "./components/app-header.ts";
import { HomeViewElement } from "./views/home-view.ts";
import { GameViewElement } from "./views/game-view.ts";
import { FilteredViewElement } from "./views/filtered-view.ts";

const routes = [
  {
    path: "/app/games/:id",
    auth: "protected",
    view: html`<game-view game-id=${($: { params: { id: string } }) => $.params.id}></game-view>`
  },
  {
    path: "/app/companies/:name",
    auth: "protected",
    view: html`<filtered-view filter-by="company" filter-value=${($: { params: { name: string } }) => $.params.name}></filtered-view>`
  },
  {
    path: "/app/genres/:name",
    auth: "protected",
    view: html`<filtered-view filter-by="genre" filter-value=${($: { params: { name: string } }) => $.params.name}></filtered-view>`
  },
  {
    path: "/app/ratings/:name",
    auth: "protected",
    view: html`<filtered-view filter-by="rating" filter-value=${($: { params: { name: string } }) => $.params.name}></filtered-view>`
  },
  {
    path: "/app/platforms/:name",
    auth: "protected",
    view: html`<filtered-view filter-by="platform" filter-value=${($: { params: { name: string } }) => $.params.name}></filtered-view>`
  },
  {
    path: "/app",
    auth: "protected",
    view: html`<home-view></home-view>`
  },
  {
    path: "/",
    redirect: "/app"
  }
];

// Store.Provider has to be subclassed to pass in the types and the update function
// same for AppSwitch, routes get passed in the constructor
// as any on routes because the types dont perfectly match but it still works
define({
  "auth-provider": Auth.Provider,
  "history-provider": BrowserHistory.Provider,
  "store-provider": class AppStore extends Store.Provider<Model, Msg, Cmd> {
    constructor() {
      super(update, init);
    }
  },
  "app-header": HeaderElement,
  "home-view": HomeViewElement,
  "game-view": GameViewElement,
  "filtered-view": FilteredViewElement,
  "router-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes as any);
    }
  }
});
