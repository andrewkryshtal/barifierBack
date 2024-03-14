import e, { Router, Request, Response } from "express";
import { FriendModel } from "../database/friendInstance";
import { User } from "../database/userInstance";
import { redisClient } from "../redis";
import { io } from "../socket";

export const friendRouter = Router();

friendRouter.post("/newFriend", async (req: Request, res: Response, next) => {
  const { userId, friendId } = req.body;

  if (userId === friendId) {
    res.json({ error: "cannot add yourself in friendlist" });
    return;
  }

  const foundUser = await User.find({ userId });

  const foundFriend = await User.find({ userId: friendId });

  const allFriends = await FriendModel.find({});

  const foundFriendSocketId = await redisClient.get(friendId);

  //   console.log({
  //     test: io.sockets.sockets.get(foundFriendSocketId),
  //     foundFriendSocketId,
  //   });

  if (allFriends.length === 0) {
    // initial friend base, works one time if user hasnt got any friends
    const friends = new FriendModel({
      friends: {
        [userId]: [friendId],
        [friendId]: [userId],
      },
    });
    friends.save();

    if (
      !!foundFriendSocketId &&
      io.sockets.sockets.get(foundFriendSocketId) !== undefined
    ) {
      io.sockets.sockets
        .get(foundFriendSocketId)
        .emit("newFriend", { newFriendId: userId });
    }

    res.sendStatus(200);
  } else {
    const newFriendsArray = (friendsArray: string[], userIdParam: string) => {
      if (!friendsArray.includes(userIdParam)) {
        return userIdParam;
      } else {
        // already has friend code
      }
    };

    const userFriendsArray = allFriends[0].friends.get(userId) || [];
    const addedUserFriendsArray = allFriends[0].friends.get(friendId) || [];

    if (
      newFriendsArray(userFriendsArray, friendId) !== undefined ||
      newFriendsArray(addedUserFriendsArray, userId) !== undefined
    ) {
      allFriends[0].friends.set(userId, [
        ...userFriendsArray,
        newFriendsArray(userFriendsArray, friendId),
      ]);
      allFriends[0].friends.set(friendId, [
        ...addedUserFriendsArray,
        //   !addedUserFriendsArray.includes(userId) && userId,
        newFriendsArray(addedUserFriendsArray, userId),
      ]);

      allFriends[0].save();

      if (!!foundFriendSocketId) {
        io.sockets.sockets
          .get(foundFriendSocketId)
          .emit("newFriend", { newFriendId: userId });
      }
    }

    const userFriends = allFriends[0].friends.get(userId);

    res.json({ friends: userFriends });
    next();
  }
});

friendRouter.get(
  "/getAllFriends",
  async (req: Request, res: Response, next) => {
    const allFriends = await FriendModel.find({});
    const { userId } = req.query;

    const foundFriends =
      allFriends[0] !== undefined
        ? allFriends[0].friends?.get(userId as string)
        : [];

    res.json({ friends: foundFriends });
  }
);
