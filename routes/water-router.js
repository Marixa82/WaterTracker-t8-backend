import express from "express";
import { waterRateController } from '../controllers/water-controller.js';
import { authValidation } from '../middlewares/index.js'
import { ctrlWrapper, validateBody } from '../helpers/index.js'
import { waterRateSchema } from '../models/userModel.js'

export const waterRouter = express.Router();

waterRouter.patch('/water_rate', authValidation, validateBody(waterRateSchema), ctrlWrapper(waterRateController));