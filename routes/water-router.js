import express from "express";

import {
  waterRateController,
  addWaterController,
  deleteWaterController,
  updateWaterController,
  getWaterInfoPerMonthController,
  getWaterInfoTodayController,
} from "../controllers/water-controller.js";
import { authValidation, isValidId } from "../middlewares/index.js";
import { ctrlWrapper, validateBody } from "../helpers/index.js";
import {
  waterAddedSchema,
  waterRateSchema,
  waterUpdateSchema,
} from "../models/waterModel.js";

export const waterRouter = express.Router();

waterRouter.patch(
  "/water_rate",
  authValidation,
  validateBody(waterRateSchema),
  ctrlWrapper(waterRateController)
);
waterRouter.post(
  "/",
  authValidation,
  validateBody(waterAddedSchema),
  ctrlWrapper(addWaterController)
);
waterRouter.put(
  "/:id",
  authValidation,
  isValidId,
  validateBody(waterUpdateSchema),
  ctrlWrapper(updateWaterController)
);
waterRouter.delete(
  "/:id",
  authValidation,
  isValidId,
  ctrlWrapper(deleteWaterController)
);
waterRouter.get(
  "/per_month",
  authValidation,
  ctrlWrapper(getWaterInfoPerMonthController)
);
waterRouter.get(
  "/today",
  authValidation,
  ctrlWrapper(getWaterInfoTodayController)
);
