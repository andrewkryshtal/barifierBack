import { Request, Response, Router } from "express";
import { applyMiddleware } from "../middleware";
import weather from "openweather-apis";

export const weatherRouter = Router();
weather.setAPPID("a753df1d34090020fe63590752b65cb1");

weatherRouter.post(
  "/getWeather",
  applyMiddleware,
  (req: Request, res: Response, next) => {
    weather.setLang(req.body.language);

    weather.setCity(req.body.city);
    weather.getSmartJSON((err, data) => {
      if (err !== null) {
        res.sendStatus(400);
        next();
        return;
      }
      res.json(data);
    });
  }
);
