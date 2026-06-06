import { Schema, model } from "mongoose";
const gameSchema = new Schema({
    company: String,
    companyHref: String,
    genre: String,
    genreHref: String,
    genreIcon: String,
    rating: String,
    ratingHref: String,
    platforms: [{ name: String, href: String, icon: String }]
}, { collection: "games" });
const GameModel = model("Game", gameSchema);
function index() {
    return GameModel.find();
}
function get(id) {
    return GameModel.findById(id)
        .then((game) => game ?? undefined)
        .catch(() => {
        throw `${id} Not Found`;
    });
}
function create(json) {
    const t = new GameModel(json);
    return t.save();
}
function update(id, game) {
    return GameModel.findByIdAndUpdate(id, game, { new: true }).then((updated) => {
        if (!updated)
            throw `${id} not updated`;
        else
            return updated;
    });
}
function remove(id) {
    return GameModel.findByIdAndDelete(id).then((deleted) => {
        if (!deleted)
            throw `${id} not deleted`;
    });
}
export default { index, get, create, update, remove };
