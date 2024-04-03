import express from "express";
import { authValidation, upload } from "../middlewares/index.js";
import {
  updateAvatar,
  getUserInfo,
  updateInfo,
} from "../controllers/user-controller.js";
import { ctrlWrapper, validateBody } from "../helpers/index.js";
import { updateUserInfoSchema } from "../models/userModel.js";

export const userRouter = express.Router();

userRouter.patch(
  "/avatars",
  authValidation,
  upload.single("avatarURL"),
  ctrlWrapper(updateAvatar)
);

userRouter.get("/current", authValidation, ctrlWrapper(getUserInfo));

userRouter.put(
  "/current",
  authValidation,
  validateBody(updateUserInfoSchema),
  ctrlWrapper(updateInfo)
);
