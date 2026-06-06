import { Auth } from "@unbndl/auth";
import { ThenUpdate } from "@unbndl/store";
import { Game } from "server/models";
import { Model, GameSummary } from "./model.ts";
import { Msg } from "./messages.ts";

export type Cmd =
  | ["game/load", { game: Game }]
  | ["games/load", { games: GameSummary[] }];

export default function update(
  model: Readonly<Model>,
  message: Msg | Cmd,
  user: Auth.Model
): Model | ThenUpdate<Model, Cmd> {
  const [type, payload] = message;
  switch (type) {
    case "game/request": {
      const p = payload as { gameId: string };
      if (model.game?._id === p.gameId) break;
      return [
        { ...model },
        requestGame(p, user)
      ];
    }
    case "game/load": {
      const p = payload as { game: Game };
      return { ...model, game: p.game };
    }
    case "games/request": {
      if (model.games) break;
      return [
        { ...model },
        requestGames(user)
      ];
    }
    case "games/load": {
      const p = payload as { games: GameSummary[] };
      return { ...model, games: p.games };
    }
    default:
      throw new Error(`Unhandled message "${type}"`);
  }
  return model;
}

function requestGame(payload: { gameId: string }, user: Auth.Model) {
  return fetch(`/api/games/${payload.gameId}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw "No response from server";
    })
    .then((json: unknown) => {
      if (json) return ["game/load", { game: json }] as Cmd;
      throw "No JSON in response from server";
    });
}

function requestGames(user: Auth.Model) {
  return fetch("/api/games", {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw "No response from server";
    })
    .then((json: unknown) => {
      if (json) return ["games/load", { games: json }] as Cmd;
      throw "No JSON in response from server";
    });
}
