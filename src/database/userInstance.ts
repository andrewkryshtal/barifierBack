import mongoose from "mongoose";

export interface IuserMediaObject {
  id: number;
  media_type: string;
  media_url: string;
  timestamp: string;
  username: string;
}

type UserSchemaType = {
  access_token?: string;
  userId: number;
  isAdmin?: boolean;
  username?: string;
  user_media?: IuserMediaObject[];
  fileName: string;
  showCheckIns?: boolean;
  showFavourites?: boolean;
  hideMyselfOnMap?: boolean;
  fullName?: string;
  birthDate?: Date | undefined;
};

export const userSchema = new mongoose.Schema<UserSchemaType>({
  access_token: String,
  userId: Number,
  isAdmin: Boolean,
  username: String,
  user_media: Array<IuserMediaObject[]>,
  fileName: String,
  showCheckIns: Boolean,
  showFavourites: Boolean,
  hideMyselfOnMap: Boolean,
  fullName: String,
  birthDate: Date,
});

export const User = mongoose.model("User", userSchema);
