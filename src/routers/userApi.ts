import { Router, Request, Response } from "express";
import { IuserMediaObject, User } from "../database/userInstance";
import { applyMiddleware } from "../middleware";
import formidable, { File } from "formidable";
import * as path from "path";
import * as fs from "fs";
import { redisClient } from "../redis";
import { FriendModel } from "../database/friendInstance";

const uploadFolder = path.join(process.cwd(), "public", "files");

interface IUserReq {
  userId: number;
  instagram_token: string;
  isAdmin: boolean;
  username?: string;
}

interface IUserMediaReq {
  userId: number;
  user_media: IuserMediaObject[];
}

export const userRouter = Router();

userRouter.post(
  "/checkUser",
  applyMiddleware,
  async (req: Request, res: Response, next) => {
    const userData: IUserReq = req.body;

    try {
      const similarUser = await User.find({ userId: userData.userId });
      if (similarUser.length === 0) {
        res.json({ newUser: true });
      } else {
        res.json({ newUser: false, user: similarUser[0] });
      }
    } catch (e) {
      console.log({ e });
      res.sendStatus(400);
    }
    next();
  }
);

userRouter.post(
  "/saveUserMedia",
  applyMiddleware,
  async (req: Request, res: Response, next) => {
    const userMedia: IUserMediaReq = req.body;

    await User.findOneAndUpdate(
      { userId: userMedia.userId },
      { user_media: userMedia.user_media }
    );

    res.sendStatus(200);
    next();
  }
);

userRouter.post(
  "/registerWithAvatar",
  applyMiddleware,
  async (req: Request, res: Response, next) => {
    // hack to make friends db on first login. TODO: move to proper place in some time
    const allFriends = await FriendModel.find({});
    if (allFriends[0] === undefined) {
      const friends = new FriendModel({ friends: {} });
      friends.save();
    }
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log({ err });

        next(err);
        return;
      }

      const file = files.photo as File;
      const fileName = encodeURIComponent(
        file.originalFilename.replace(/\s/g, "-")
      );
      if (isFileValid(file)) {
        fs.renameSync(file.filepath, uploadFolder + "/" + fileName);
      }

      try {
        const similarUser = await User.find({ userId: fields.userId });
        if (similarUser.length === 0) {
          console.log("TEST NEW USER");
          const newUser = new User({
            ...fields,
            fileName,
            fullName: "",
            showCheckIns: true,
            showFavourites: true,
            hideMyselfOnMap: false,
            birthDate: null,
          });
          newUser.save();

          res.sendStatus(200);
        } else {
          console.log("TEST EXISTING USER");

          res.json(similarUser[0]);
        }
      } catch (e) {
        console.log("TEST CATCH");

        console.log({ e });
        res.sendStatus(400);
      }
    });
  }
);

userRouter.post(
  "/updateUserSettings",
  applyMiddleware,
  async (req: Request, res: Response, next) => {
    const foundAndChangedUser = await User.findOneAndUpdate(
      {
        userId: req.body.userId,
      },
      { ...req.body }
    );
    foundAndChangedUser.save();

    res.json(foundAndChangedUser);
    next();
  }
);

userRouter.post(
  "/uploadAvatar",
  applyMiddleware,
  async (req: Request, res: Response, next) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log({ err });

        next(err);
        return;
      }

      const file = files.photo as File;
      const fileName = encodeURIComponent(
        file.originalFilename.replace(/\s/g, "-")
      );
      if (isFileValid(file)) {
        fs.renameSync(file.filepath, uploadFolder + "/" + fileName);
      }

      const foundUser = await User.findOne({
        userId: fields.userId,
      });
      console.log({ foundUser: foundUser.fileName });

      if (foundUser.fileName !== null) {
        console.log("test");
        console.log(foundUser.fileName !== "");

        fs.unlink(uploadFolder + "/" + foundUser.fileName, (err) => {
          if (err) throw err;
        });
      }

      const foundAndChangedUser = await User.findOneAndUpdate(
        {
          userId: fields.userId,
        },
        { fileName: null }
      );
      foundAndChangedUser.save();
      res.json({ fileName });
      next();
    });
  }
);

userRouter.post(
  "/deleteAvatar",
  applyMiddleware,
  async (req: Request, res: Response, next) => {
    const foundUser = await User.findOne({
      userId: req.body.userId,
    });

    if (foundUser.fileName !== null) {
      fs.unlink(uploadFolder + "/" + foundUser.fileName, (err) => {
        if (err) throw err;
      });
    }

    const foundAndChangedUser = await User.findOneAndUpdate(
      {
        userId: req.body.userId,
      },
      { fileName: null }
    );
    foundAndChangedUser.save();
    res.json({ fileName: null });
  }
);

userRouter.get(
  "/getUser",
  applyMiddleware,
  async (req: Request, res: Response) => {
    const { userId } = req.query;
    const foundUser = await User.findOne({ userId });
    console.log({ foundUser });
    res.json({});
  }
);

const isFileValid = (file: File) => {
  const type = file.mimetype.split("/").pop();
  const validTypes = ["jpg", "jpeg", "png", "pdf"];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
};
