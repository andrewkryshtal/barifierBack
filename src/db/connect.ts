import mongoose from "mongoose";

mongoose.set("strictQuery", false);

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
  } catch (e) {
    console.log({ e });
  }
};
