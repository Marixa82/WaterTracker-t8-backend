import { Schema, model } from "mongoose";
import Joi from "joi";

const userSchema = new Schema(
  {
    password: {
      type: String,
      min: 8,
      max: 64,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    token: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: "",
    },
    waterRate: {
      type: Number,
      default: 2000,
    },
    gender: {
      type: String,
      enum: ["male", "female", ""],
      default: "",
    },
  },

  { versionKey: false, timestamps: true }
);

export const User = model("auth", userSchema);

export const registerSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  password: Joi.string().min(8).max(64).required(),
});

export const updateUserInfoSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  newPassword: Joi.string().min(8).max(64),
  outdatedPassword: Joi.when('newPassword', {
    is: Joi.exist(),
    then: Joi.string().required().min(8).max(64).invalid(Joi.ref('newPassword')).messages({"invalid":"You must enter a new password"}),
    otherwise: Joi.string().min(800).error(new Error("newPassword is required")),
  }),
  name: Joi.string(),
  gender: Joi.string().valid("male", "female"),
});

export const emailSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
});
