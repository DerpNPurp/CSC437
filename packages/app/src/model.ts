import { Game } from "server/models";

export interface GameSummary {
  _id: string;
  title: string;
  company: string;
  genre: string;
  genreIcon: string;
  rating: string;
  platforms: Array<{ name: string; icon: string }>;
}

export interface Model {
  game?: Game;
  games?: GameSummary[];
  filteredGames?: GameSummary[];
}

export const init: Model = {};
