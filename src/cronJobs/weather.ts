import cron from "node-cron";

export const weatherCron = () => {
  cron.schedule("0 * * * *", () => {
    console.log("running a task every minute123");
  });
};
