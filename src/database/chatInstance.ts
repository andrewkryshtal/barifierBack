import mongoose from "mongoose";

interface IMessageInterface {
  date: Date;
  message: string;
}

interface IChatInterface {
  chatIdentifier: string;
  messages?: IMessageInterface[];
  chatStarter?: string;
  isApproved?: boolean;
}

export const chatSchema = new mongoose.Schema<IChatInterface>({
  chatIdentifier: String,
  messages: Array<IMessageInterface>,
  chatStarter: String,
  isApproved: Boolean,
});

export const Chats = mongoose.model("Chats", chatSchema);
