import mongoose from "mongoose";

export interface IuserMediaObject {
  id: number;
  media_type: string;
  media_url: string;
  timestamp: string;
  username: string;
}

type UserSchemaType = {
  email: string;
  password: string;
  username?: string;
  isAdmin?: boolean;
  showCheckIns?: boolean;
  showFavourites?: boolean;
  hideMyselfOnMap?: boolean;
  fullName?: string;
  birthDate?: Date | undefined;
};

const userSchema = new mongoose.Schema<UserSchemaType>({
  email: String,
  password: String,
  isAdmin: Boolean,
  showCheckIns: Boolean,
  showFavourites: Boolean,
  hideMyselfOnMap: Boolean,
  fullName: String,
  birthDate: Date,
});

export const User = mongoose.model("User", userSchema);
