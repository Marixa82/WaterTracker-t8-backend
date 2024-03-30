import express from "express";
import { waterRateController, addWaterController, deleteWaterController, updateWaterController } from '../controllers/water-controller.js';
import { authValidation } from '../middlewares/index.js'
import { ctrlWrapper, validateBody } from '../helpers/index.js'
import { waterAddedSchema, waterRateSchema, waterUpdateSchema } from "../models/userModel.js";


export const waterRouter = express.Router();

waterRouter.patch('/water_rate', authValidation, validateBody(waterRateSchema), ctrlWrapper(waterRateController));
waterRouter.put('/', authValidation, validateBody(waterAddedSchema), ctrlWrapper(addWaterController));
waterRouter.patch('/:waterId', authValidation, validateBody(waterUpdateSchema), ctrlWrapper(updateWaterController));
waterRouter.delete('/:waterId', authValidation, ctrlWrapper(deleteWaterController));