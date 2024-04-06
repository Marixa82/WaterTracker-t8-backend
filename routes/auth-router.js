import express from "express";
import { ctrlWrapper, validateBody } from "../helpers/index.js";
import {
  loginController,
  logoutController,
  registerController,
  verifyEmailController,
  resendVerifyEmailController,
  forgotPasswordController,
} from "../controllers/auth-controller.js";
import { registerSchema, emailSchema } from "../models/userModel.js";
import { authValidation } from "../middlewares/index.js";

export const authRouter = express.Router();

authRouter.get("/verify/:verificationCode", ctrlWrapper(verifyEmailController));
authRouter.post(
  "/verify",
  validateBody(emailSchema),
  ctrlWrapper(resendVerifyEmailController)
);
authRouter.post(
  "/register",
  validateBody(registerSchema),
  ctrlWrapper(registerController)
);
authRouter.post(
  "/login",
  validateBody(registerSchema),
  ctrlWrapper(loginController)
);
authRouter.post("/logout", authValidation, ctrlWrapper(logoutController));
authRouter.get(
  "/forgot-password",
  validateBody(emailSchema),
  ctrlWrapper(forgotPasswordController)
);
