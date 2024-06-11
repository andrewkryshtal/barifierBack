import express from "express";
import { connectDb } from "./src/db/connect";
import bodyParser from "body-parser";
import { barRouter } from "./src/routers/barApi";
import { userRouter } from "./src/routers/userApi";
import { weatherRouter } from "./src/routers/weatherApi";
import { friendRouter } from "./src/routers/friendApi";
import { socketInstance } from "./src/socket";
import cors from "cors";
import { redisEnabler } from "./src/redis";
import dotenv from "dotenv";

export const app = express();

const port = process.env.PORT || 3333;

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/files", express.static("public/files"));

app.get("/", (req, res) => {
  res.send(
    "<html><div style='text-align:center;margin-top:20%'><h1>Welcome to My Page </h1></div></html>"
  );
});

app.use("/friend", friendRouter);

app.use("/bar", barRouter);

app.use("/user", userRouter);

app.use("/weather", weatherRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

redisEnabler();

socketInstance();

connectDb();

// weatherCron();
