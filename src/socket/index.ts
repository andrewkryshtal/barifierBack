import { Server, Socket } from "socket.io";
import { redisClient } from "../redis";

export const io = new Server(3002);

const socketConnections = {};

export const socketInstance = () => {
  io.on("connection", (socket: Socket) => {
    console.log("a user connected", socket.connected);
    socket.on("message", (socket) => {
      console.log({ socketConnections, socket });
    });

    socket.on("registerUser", async (data) => {
      console.log("registered");
      const registeredSocket = await redisClient.set(
        String(data.userId),
        String(socket.id)
      );

      //   console.log({
      //     io: io.sockets.sockets
      //       .get(socket.id)
      //       .emit("newMessage", "FUCKING WORKS"),
      //   });
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  });
};
