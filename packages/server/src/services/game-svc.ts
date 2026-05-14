import { Schema, model } from "mongoose";
import { Game } from "../models/index.ts";

const gameSchema = new Schema<Game>(
  {
    company: String,
    companyHref: String,
    genre: String,
    genreHref: String,
    genreIcon: String,
    rating: String,
    ratingHref: String,
    platforms: [{ name: String, href: String, icon: String }]
  },
  { collection: "games" }
);

const GameModel = model<Game>("Game", gameSchema);

function index(): Promise<Game[]> {
  return GameModel.find();
}

function get(id: string): Promise<Game | undefined> {
  return GameModel.findById(id)
    .then((game) => game ?? undefined)
    .catch(() => {
      throw `${id} Not Found`;
    });
}

export default { index, get };
