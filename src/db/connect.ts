import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await await mongoose.connect(process.env.MONGO_URL);
  } catch (e) {
    console.log({ e });
  }
};
