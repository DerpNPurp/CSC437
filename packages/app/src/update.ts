import { Auth } from "@unbndl/auth";
import { ThenUpdate } from "@unbndl/store";
import { Game } from "server/models";
import { Model, GameSummary } from "./model.ts";
import { Msg } from "./messages.ts";

export type Cmd =
  | ["game/load", { game: Game }]
  | ["games/load", { games: GameSummary[] }]
  | ["games/filter-load", { games: GameSummary[] }];

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
    case "games/filter-request": {
      const p = payload as { filterBy: string; value: string };
      return [
        { ...model, filteredGames: undefined },
        requestFilteredGames(p, user)
      ];
    }
    case "games/filter-load": {
      const p = payload as { games: GameSummary[] };
      return { ...model, filteredGames: p.games };
    }
    case "game/save": {
      const [, p, cbs] = message as [
        "game/save",
        { gameId: string; game: Game },
        { onSuccess?: () => void; onFailure?: (err: Error) => void }
      ];
      return [model, saveGame(p, user, cbs)];
    }
    default: {
      const unhandled: never = type;
      throw new Error(`Unhandled message "${unhandled}"`);
    }
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

function requestFilteredGames(payload: { filterBy: string; value: string }, user: Auth.Model) {
  const params = new URLSearchParams({ [payload.filterBy]: payload.value });
  return fetch(`/api/games?${params}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw "No response from server";
    })
    .then((json: unknown) => {
      if (json) return ["games/filter-load", { games: json }] as Cmd;
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

function saveGame(
  payload: { gameId: string; game: Game },
  user: Auth.Model,
  callbacks: { onSuccess?: () => void; onFailure?: (err: Error) => void }
): Promise<Cmd> {
  return fetch(`/api/games/${payload.gameId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(payload.game)
  })
    .then((res: Response) => {
      if (res.status === 200) return res.json();
      throw new Error(`${res.status} status saving game ${payload.gameId}`);
    })
    .then((json: unknown) => {
      if (json) {
        if (callbacks.onSuccess) callbacks.onSuccess();
        return ["game/load", { game: json as Game }] as Cmd;
      }
      throw new Error("No JSON in API response");
    })
    .catch((err: Error) => {
      if (callbacks.onFailure) callbacks.onFailure(err);
      throw err;
    });
}
