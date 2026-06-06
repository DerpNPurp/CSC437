import { Game } from "server/models";

export interface GameSummary {
  _id: string;
  company: string;
  genre: string;
}

export interface Model {
  game?: Game;
  games?: GameSummary[];
}

export const init: Model = {};
