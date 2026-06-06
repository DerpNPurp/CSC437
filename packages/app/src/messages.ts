export type Msg =
  | ["game/request", { gameId: string }]
  | ["games/request", {}];
