import { createClient } from "redis";

export const redisClient = createClient();

export const redisEnabler = async () => {
  redisClient.connect();
  redisClient.on("connect", () => {
    console.log("redis connected");
  });
};
