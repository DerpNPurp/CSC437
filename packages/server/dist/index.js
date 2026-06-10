import express from "express";
import fs from "node:fs/promises";
import path from "path";
import { connect } from "./services/mongo.js";
import games from "./routes/games.js";
import auth from "./routes/auth.js";
import { authenticateUser } from "./routes/auth.js";
const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
connect("blazing");
app.use(express.static(staticDir));
app.use(express.json());
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});
app.use("/auth", auth);
app.use("/api/games", authenticateUser, games);
// sends index.html for any /app/* url so the js router can take over
// has to be after the api routes or those would get caught here too
// without this refreshing on a route like /app/games/123 would 404
app.use("/app", (req, res) => {
    const indexHtml = path.resolve(staticDir, "index.html");
    fs.readFile(indexHtml, { encoding: "utf8" }).then((html) => res.send(html));
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
