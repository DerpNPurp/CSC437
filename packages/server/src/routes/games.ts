import express, { Request, Response } from "express";
import { Game } from "../models/index.ts";
import Games from "../services/game-svc.ts";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Games.index()
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

export default router;
