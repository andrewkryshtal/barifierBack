import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await await mongoose.connect("mongodb://localhost:27017/testDB");
  } catch (e) {
    console.log({ e });
  }
};
