import type { Game } from "server/models";

export type Msg =
  | ["game/request", { gameId: string }]
  | ["games/request", {}]
  | ["games/filter-request", { filterBy: string; value: string }]
  | [
      "game/save",
      { gameId: string; game: Game },
      { onSuccess?: () => void; onFailure?: (err: Error) => void }
    ];
