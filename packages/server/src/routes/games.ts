import express, { Request, Response } from "express";
import { Game } from "../models/index.ts";
import Games from "../services/game-svc.ts";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  const { company, genre, rating, platform } = req.query as Record<string, string>;
  const filter: Record<string, string> = {};
  if (company) filter.company = company;
  if (genre) filter.genre = genre;
  if (rating) filter.rating = rating;
  if (platform) filter.platform = platform;

  Games.index(filter)
    .then((list: Game[]) => res.send(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;

  Games.get(id)
    .then((game: Game | undefined) => {
      if (!game) res.status(404).send();
      else res.send(game);
    })
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newGame = req.body;

  Games.create(newGame)
    .then((game: Game) => res.status(201).json(game))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;
  const newGame = req.body;

  Games.update(id, newGame)
    .then((game: Game | undefined) => res.json(game))
    .catch((err) => res.status(404).end());
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;

  Games.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
