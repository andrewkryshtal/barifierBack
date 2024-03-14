import { Router, Request, Response } from "express";
import { Bar, BarSchemaType } from "../database/barInstance";
import { applyMiddleware } from "../middleware";

interface IbarReq {
  data: BarSchemaType;
}

export const barRouter = Router();

barRouter.post(
  "/postBar",
  applyMiddleware,
  async (req: Request, res: Response, next) => {
    const reqBody: BarSchemaType = req.body;
    const newBar = new Bar(reqBody);

    try {
      const similarBar = await Bar.find({ place_id: reqBody.place_id });
      if (similarBar.length === 0) {
        newBar.save();
        res.sendStatus(200);
      } else {
        res.sendStatus(411);
      }
    } catch (e) {
      console.log({ e });
      res.sendStatus(400);
    }
    next();
  }
);

barRouter.get(
  "/getAllBars",
  applyMiddleware,
  async (req: Request, res: Response, next) => {
    const allBars = await Bar.find({});

    res.json(allBars);
    next();
  }
);
