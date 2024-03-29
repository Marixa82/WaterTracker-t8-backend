import express from 'express';
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import { loginController, logoutController, registerController } from '../controllers/auth-controller.js';
import validateBody from '../helpers/validateBody.js';
import { registerSchema } from '../models/authmodel.js';
import { auth } from '../middlewares/authValidation.js';

export const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), ctrlWrapper(registerController));
authRouter.post('/login', validateBody(registerSchema), ctrlWrapper(loginController));
authRouter.post('/logout', auth, ctrlWrapper(logoutController))