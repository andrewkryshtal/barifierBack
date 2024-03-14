import mongoose from "mongoose";

export interface IFriendSchemaType {
  friends: Map<string, Array<string>>;
}

export interface IFriendDocument extends IFriendSchemaType, Document {}

export const friendSchema = new mongoose.Schema<IFriendSchemaType>(
  {
    friends: { type: Map, of: Array },
  },
  { strict: false }
);

export const FriendModel = mongoose.model("Friend", friendSchema);
