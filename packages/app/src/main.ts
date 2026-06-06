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

const routes = [
  {
    path: "/app/games/:id",
    auth: "protected",
    view: html`<game-view game-id=${($: { params: { id: string } }) => $.params.id}></game-view>`
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
  "router-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes as any);
    }
  }
});
