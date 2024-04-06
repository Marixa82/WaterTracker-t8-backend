import { Schema, model } from "mongoose";
import Joi from "joi";

const waterSchema = new Schema({
    day: String,
    month: {
        type: String,
        enum: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
    },
    year: String,
    time: String,
    amount: Number,
    waterRateForThisDay: Number,
    owner: String,
    },
    { versionKey: false, timestamps: true });

export const Water = model("waters", waterSchema);

export const waterRateSchema = Joi.object({
  date: Joi.string()
    .regex(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)
    .required()
    .messages({
      "string.pattern.base": "date must be in format DD/MM/YYYY or DD-MM-YYYY",
    }),
  waterRate: Joi.number().required().integer().min(100).max(15000),
});

export const waterAddedSchema = Joi.object({
  date: Joi.string()
    .regex(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)
    .required()
    .messages({
      "string.pattern.base": "date must be in format DD/MM/YYYY or DD-MM-YYYY",
    }),
  time: Joi.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "time must be in format hh:mm",
    }),
  waterAmount: Joi.number().integer().min(1).max(5000).required(),
});

export const waterUpdateSchema = Joi.object({
  time: Joi.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .messages({
      "string.pattern.base": "time must be in format hh:mm",
    }),
  waterAmount: Joi.number().integer().min(1).max(5000),
});

export const waterTodaySchema = Joi.object({
  date: Joi.string()
    .regex(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)
    .required()
    .messages({
      "string.pattern.base": "date must be in format DD/MM/YYYY or DD-MM-YYYY",
    }),
});

export const waterMonthSchema = Joi.object({
  date: Joi.string()
    .regex(/^(0?[1-9]|1[012])[\/\-]\d{4}$/)
    .required()
    .messages({
      "string.pattern.base": "date must be in format MM/YYYY or MM-YYYY",
    }),
});