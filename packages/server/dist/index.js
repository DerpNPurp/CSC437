import express from "express";
import Games from "./services/game-svc.js";
const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
app.use(express.static(staticDir));
// Middleware:
app.use(express.json());
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});
app.get("/api/games/:id", (req, res) => {
    const id = req.params.id;
    const data = Games.get(id);
    if (data)
        res.send(data);
    else
        res.status(404).send();
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
