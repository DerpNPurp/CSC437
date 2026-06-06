import { Game } from "server/models";

export interface GameSummary {
  _id: string;
  title: string;
  company: string;
  genre: string;
}

export interface Model {
  game?: Game;
  games?: GameSummary[];
  filteredGames?: GameSummary[];
}

export const init: Model = {};
