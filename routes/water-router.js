import express from "express";
import {
  waterRateController,
  addWaterController,
  deleteWaterController,
  updateWaterController,
  getWaterInfoPerMonthController,
} from "../controllers/water-controller.js";
import { authValidation, isValidId } from "../middlewares/index.js";
import { ctrlWrapper, validateBody } from "../helpers/index.js";
import {
  waterAddedSchema,
  waterRateSchema,
  waterUpdateSchema,
  waterTodaySchema,
} from "../models/userModel.js";

export const waterRouter = express.Router();

waterRouter.patch(
  "/water_rate",
  authValidation,
  validateBody(waterRateSchema),
  ctrlWrapper(waterRateController)
);
waterRouter.put(
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
  validateBody(waterTodaySchema),
  ctrlWrapper(getWaterInfoPerMonthController)
);
