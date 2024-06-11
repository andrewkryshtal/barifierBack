import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDb = async () => {
  const { parsed } = dotenv.config();
  try {
    await await mongoose.connect(parsed.MONGO_URL);
  } catch (e) {
    console.log({ e });
  }
};
