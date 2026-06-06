import { Schema, model } from "mongoose";
import { Game } from "../models/index.ts";

const gameSchema = new Schema<Game>(
  {
    title: String,
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

function index(filter?: Record<string, string>): Promise<Game[]> {
  if (filter && Object.keys(filter).length > 0) {
    const query: Record<string, string> = {};
    if (filter.company) query.company = filter.company;
    if (filter.genre) query.genre = filter.genre;
    if (filter.rating) query.rating = filter.rating;
    if (filter.platform) query["platforms.name"] = filter.platform;
    return GameModel.find(query);
  }
  return GameModel.find();
}

function get(id: string): Promise<Game | undefined> {
  return GameModel.findById(id)
    .then((game) => game ?? undefined)
    .catch(() => {
      throw `${id} Not Found`;
    });
}

function create(json: Game): Promise<Game> {
  const t = new GameModel(json);
  return t.save();
}

function update(id: String, game: Game): Promise<Game | undefined> {
  return GameModel.findByIdAndUpdate(id, game, { new: true }).then(
    (updated) => {
      if (!updated) throw `${id} not updated`;
      else return updated as Game;
    }
  );
}

function remove(id: String): Promise<void> {
  return GameModel.findByIdAndDelete(id).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}

export default { index, get, create, update, remove };
